import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { ManualShipmentStatus } from "@/types/manual-shipment";

type StatusStyle = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const STATUS_STYLES: Record<ManualShipmentStatus, StatusStyle> = {
  [ManualShipmentStatus.DELIVERED]: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [ManualShipmentStatus.SHIPPED]: {
    label: "Shipped",
    icon: Truck,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [ManualShipmentStatus.CONFIRMED]: {
    label: "Confirmed",
    icon: Package,
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  [ManualShipmentStatus.DRAFT]: {
    label: "Draft",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [ManualShipmentStatus.CANCELLED]: {
    label: "Cancelled",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function manualShipmentStatusStyle(
  status: ManualShipmentStatus | string,
): StatusStyle {
  const key = status.toUpperCase() as ManualShipmentStatus;
  return STATUS_STYLES[key] ?? STATUS_STYLES[ManualShipmentStatus.DRAFT];
}
