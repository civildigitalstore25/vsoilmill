import { Schema, model, models } from "mongoose";
import { ManualShipmentStatus } from "@/types/manual-shipment";
import { ST_COURIER_NAME } from "@/lib/shipping/st-courier";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
  },
  { _id: false },
);

const ItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    variantId: String,
    name: { type: String, required: true },
    variantLabel: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isCustom: { type: Boolean, default: false },
  },
  { _id: false },
);

const PricingSchema = new Schema(
  {
    total: { type: Number, required: true },
  },
  { _id: false },
);

const ManualShipmentSchema = new Schema(
  {
    customer: { type: CustomerSchema, required: true },
    items: { type: [ItemSchema], required: true },
    pricing: { type: PricingSchema, required: true },
    trackingNumber: { type: String, index: true },
    courier: { type: String, default: ST_COURIER_NAME },
    publicTrackToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ManualShipmentStatus),
      default: ManualShipmentStatus.CONFIRMED,
      index: true,
    },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    shippedAt: Date,
  },
  { timestamps: true },
);

ManualShipmentSchema.index({ createdAt: -1 });
ManualShipmentSchema.index({ "customer.phone": 1 });

export const ManualShipmentModel =
  models.ManualShipment ?? model("ManualShipment", ManualShipmentSchema);
