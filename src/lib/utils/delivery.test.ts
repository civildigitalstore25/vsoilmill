import { describe, expect, it } from "vitest";
import { getEstimatedDeliveryRange } from "@/lib/utils/delivery";

describe("delivery utility", () => {
  it("calculates 3 to 5 days delivery range correctly from fixed date", () => {
    // 2026-10-01 UTC
    const base = new Date("2026-10-01T12:00:00.000Z");
    const result = getEstimatedDeliveryRange(base);

    expect(result.daysText).toBe("3 to 5 days");
    expect(result.label).toBe("Estimated Delivery: 3 to 5 Days");
    // 3 days later is Oct 4, 5 days later is Oct 6
    expect(result.formattedRange).toContain("Oct");
    expect(result.formattedRange).toContain("4");
    expect(result.formattedRange).toContain("6");
  });

  it("handles string date input", () => {
    const result = getEstimatedDeliveryRange("2026-11-10T00:00:00.000Z");
    expect(result.formattedRange).toContain("Nov");
  });

  it("handles null / undefined safely without throwing", () => {
    const result = getEstimatedDeliveryRange(null);
    expect(result.formattedRange).toBeTruthy();
    expect(result.daysText).toBe("3 to 5 days");
  });
});

