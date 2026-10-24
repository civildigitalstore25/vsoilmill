import Link from "next/link";
import { UI } from "@/constants/ui";
import { LAYOUT } from "@/constants/layout";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { SocialLinks } from "@/components/common/SocialLinks";

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-1.5 text-xs text-primary-foreground sm:text-sm">
      <div className={`flex items-center justify-between ${LAYOUT.container}`}>
        {/* Left / Center: Announcement Message */}
        <p className="flex-1 text-center md:text-left">
          {UI.announcement}
          <span className="mx-2 opacity-50 hidden sm:inline">|</span>
          <Link
            href={buildWhatsAppUrl("Hi VS OilMill!")}
            className="underline underline-offset-2 hover:text-accent font-medium hidden sm:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Call / WhatsApp: {UI.phoneDisplay}
          </Link>
        </p>

        {/* Right: Quick Social Channels */}
        <div className="hidden items-center gap-2 md:flex shrink-0 pl-4 border-l border-primary-foreground/20">
          <span className="text-[11px] font-medium opacity-80">Follow:</span>
          <SocialLinks variant="header" />
        </div>
      </div>
    </div>
  );
}
