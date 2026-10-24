import Link from "next/link";
import { UI } from "@/constants/ui";
import { LAYOUT } from "@/constants/layout";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-2 text-center text-[11px] leading-snug text-primary-foreground sm:text-sm">
      <p className={LAYOUT.container}>
        <span className="block sm:inline">{UI.announcement}</span>
        <span className="mx-2 hidden opacity-50 sm:inline">|</span>
        <Link
          href={buildWhatsAppUrl("Hi VS OilMill!")}
          className="mt-0.5 block underline underline-offset-2 sm:mt-0 sm:inline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Call / WhatsApp: {UI.phoneDisplay}
        </Link>
      </p>
    </div>
  );
}
