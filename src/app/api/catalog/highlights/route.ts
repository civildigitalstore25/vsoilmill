import { NextResponse } from "next/server";
import { getLiveCombos, getLiveOffers } from "@/lib/catalog/highlights";

export async function GET() {
  try {
    const [offers, combos] = await Promise.all([
      getLiveOffers(),
      getLiveCombos(),
    ]);
    return NextResponse.json({
      data: { hasOffers: offers.length > 0, hasCombos: combos.length > 0 },
    });
  } catch {
    return NextResponse.json({
      data: { hasOffers: false, hasCombos: false },
    });
  }
}
