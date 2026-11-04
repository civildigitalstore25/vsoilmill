import { connectDb } from "@/lib/db/mongoose";
import {
  fetchStCourierTracking,
  normalizeConsignment,
  type StCourierTracking,
} from "@/lib/shipping/st-courier";
import { OrderModel } from "@/models/Order";
import { OrderStatus } from "@/types/order";

const BATCH_LIMIT = 50;
const DELAY_MS = 1_500;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

export type TrackingSyncResult = {
  orderId: string;
  ok: boolean;
  status?: string;
  delivered?: boolean;
};

export type CachedTracking = {
  data: StCourierTracking;
  fetchedAt: Date;
  cached: boolean;
};

const trackingCache = new Map<string, { data: StCourierTracking; fetchedAt: Date }>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches live ST Courier tracking with a short in-memory cache per AWB
 * (per server instance) so page views don't hammer stcourier.com.
 */
export async function getStCourierTrackingCached(
  trackingNumber: string,
  options: { force?: boolean } = {},
): Promise<CachedTracking | null> {
  const awb = normalizeConsignment(trackingNumber);
  if (!awb) return null;

  const hit = trackingCache.get(awb);
  if (!options.force && hit && Date.now() - hit.fetchedAt.getTime() < CACHE_TTL_MS) {
    return { ...hit, cached: true };
  }

  const data = await fetchStCourierTracking(awb);
  if (!data) return null;

  const entry = { data, fetchedAt: new Date() };
  trackingCache.delete(awb);
  trackingCache.set(awb, entry);
  while (trackingCache.size > CACHE_MAX_ENTRIES) {
    const oldest = trackingCache.keys().next().value;
    if (oldest === undefined) break;
    trackingCache.delete(oldest);
  }
  return { ...entry, cached: false };
}

/** Saves a fetched status on the order; marks SHIPPED orders DELIVERED. */
export async function applyTrackingToOrder(
  orderId: string,
  result: { status: string; delivered: boolean },
  checkedAt = new Date(),
) {
  await connectDb();
  const order = await OrderModel.findById(orderId);
  if (!order?.trackingNumber) return null;

  order.trackingStatus = result.status;
  order.trackingLastCheckedAt = checkedAt;
  order.trackingUpdatedAt = checkedAt;
  if (result.delivered && order.status === OrderStatus.SHIPPED) {
    order.status = OrderStatus.DELIVERED;
  }
  await order.save();
  return order;
}

export async function syncOrderTracking(orderId: string): Promise<TrackingSyncResult> {
  await connectDb();
  const order = await OrderModel.findById(orderId).select("trackingNumber").lean<{
    trackingNumber?: string;
  }>();
  if (!order?.trackingNumber) return { orderId, ok: false };

  const result = await getStCourierTrackingCached(order.trackingNumber, { force: true });
  if (!result) return { orderId, ok: false };

  await applyTrackingToOrder(orderId, result.data, result.fetchedAt);
  return {
    orderId,
    ok: true,
    status: result.data.status,
    delivered: result.data.delivered,
  };
}

export async function syncShippedOrders(limit = BATCH_LIMIT) {
  await connectDb();
  const orders = await OrderModel.find({
    status: OrderStatus.SHIPPED,
    trackingNumber: { $exists: true, $nin: [null, ""] },
  })
    .sort({ trackingLastCheckedAt: 1 })
    .limit(limit)
    .select("_id")
    .lean<{ _id: unknown }[]>();

  const results: TrackingSyncResult[] = [];
  for (const [index, order] of orders.entries()) {
    if (index > 0) await sleep(DELAY_MS);
    try {
      results.push(await syncOrderTracking(String(order._id)));
    } catch {
      results.push({ orderId: String(order._id), ok: false });
    }
  }

  return {
    checked: results.length,
    updated: results.filter((r) => r.ok).length,
    delivered: results.filter((r) => r.delivered).length,
    results,
  };
}