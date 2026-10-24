import Link from "next/link";
import { UI } from "@/constants/ui";
import { LAYOUT } from "@/constants/layout";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { SocialLinks } from "@/components/common/SocialLinks";

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-2 text-[11px] leading-snug text-primary-foreground sm:text-sm">
      <div className={`${LAYOUT.container} flex items-center justify-between gap-3`}>
        <p className="min-w-0 flex-1 text-center md:text-left">
          <span className="block sm:inline">{UI.announcement}</span>
          <span className="mx-2 hidden opacity-50 sm:inline">|</span>
          <Link
            href={buildWhatsAppUrl("Hi VS OilMill!")}
            className="mt-0.5 block font-medium underline underline-offset-2 hover:text-accent sm:mt-0 sm:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Call / WhatsApp: {UI.phoneDisplay}
          </Link>
        </p>
        <div className="hidden shrink-0 items-center gap-2 border-l border-primary-foreground/20 pl-4 md:flex">
          <span className="text-[11px] font-medium opacity-80">{UI.follow}</span>
          <SocialLinks variant="header" />
        </div>
      </div>
    </div>
  );
}
