import { ESTIMATED_DELIVERY } from "@/constants/shipping";

/**
 * Calculates estimated delivery date range based on a base date (defaults to current date).
 * Uses Indian Standard Time (IST / Asia/Kolkata).
 */
export function getEstimatedDeliveryRange(
  baseDate?: Date | string | number | null,
  minDays = ESTIMATED_DELIVERY.minDays,
  maxDays = ESTIMATED_DELIVERY.maxDays,
) {
  const start = baseDate ? new Date(baseDate) : new Date();
  const validStart = isNaN(start.getTime()) ? new Date() : start;

  const minDate = new Date(validStart.getTime() + minDays * 24 * 60 * 60 * 1000);
  const maxDate = new Date(validStart.getTime() + maxDays * 24 * 60 * 60 * 1000);

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
  });

  const fullFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const minFormatted = formatter.format(minDate);
  const maxFormatted = formatter.format(maxDate);
  const formattedRange = `${minFormatted} – ${maxFormatted}`;
  const formattedWithWeekday = `${fullFormatter.format(minDate)} – ${fullFormatter.format(maxDate)}`;

  return {
    minDate,
    maxDate,
    minFormatted,
    maxFormatted,
    formattedRange,
    formattedWithWeekday,
    daysText: ESTIMATED_DELIVERY.daysText,
    label: ESTIMATED_DELIVERY.label,
  };
}

