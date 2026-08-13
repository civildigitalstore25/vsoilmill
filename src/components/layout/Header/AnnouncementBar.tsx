import Link from "next/link";
import { UI } from "@/constants/ui";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      <p>
        {UI.announcement}
        <span className="mx-2 opacity-50">|</span>
        <Link
          href={buildWhatsAppUrl("Hi VS OilMill!")}
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Call / WhatsApp: {UI.phoneDisplay}
        </Link>
      </p>
    </div>
  );
}
