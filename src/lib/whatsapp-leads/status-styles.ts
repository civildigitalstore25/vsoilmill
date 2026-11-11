import { WhatsAppLeadStatus } from "@/types/whatsapp-lead";

const STATUS_STYLES: Record<WhatsAppLeadStatus, string> = {
  [WhatsAppLeadStatus.NEW]: "bg-amber-50 text-amber-800 border-amber-200",
  [WhatsAppLeadStatus.CONTACTED]: "bg-blue-50 text-blue-800 border-blue-200",
  [WhatsAppLeadStatus.ORDERED]:
    "bg-emerald-50 text-emerald-800 border-emerald-200",
  [WhatsAppLeadStatus.LOST]: "bg-red-50 text-red-800 border-red-200",
};

export function whatsappLeadStatusClass(status: WhatsAppLeadStatus): string {
  return STATUS_STYLES[status] ?? STATUS_STYLES[WhatsAppLeadStatus.NEW];
}
