"use client";

import { TrackedWhatsAppLink } from "@/components/shared/TrackedWhatsAppLink";
import { WhatsAppIcon } from "@/components/features/products/ProductShareIcons";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import { WhatsAppLeadContext } from "@/types/whatsapp-lead";

export function ProductWhatsAppFloat({
  productId,
  productName,
  variantLabel,
  unitPrice,
  quantity,
}: {
  productId: string;
  productName: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <TrackedWhatsAppLink
        href={buildWhatsAppUrl(
          buildProductWhatsAppMessage(
            productName,
            variantLabel ?? "",
            unitPrice,
            quantity,
          ),
        )}
        context={WhatsAppLeadContext.PRODUCT}
        items={[
          {
            productId,
            name: productName,
            variantLabel,
            quantity,
            price: unitPrice,
          },
        ]}
        estimatedTotal={unitPrice * quantity}
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl hover:bg-[#1ebe57] hover:shadow-2xl transition-all hover:scale-105"
        aria-label="Chat with VS OilMill on WhatsApp"
      >
        <span className="flex h-6 w-6 items-center justify-center">
          <WhatsAppIcon className="h-5 w-5 text-white" />
        </span>
        <span className="hidden text-sm font-bold sm:inline">
          Chat on WhatsApp
        </span>
      </TrackedWhatsAppLink>
    </div>
  );
}
