import { Button } from "@/components/ui/button";
import { ProductShare } from "@/components/features/products/ProductShare";
import { WhatsAppIcon } from "@/components/features/products/ProductShareIcons";
import { QuantityStepper } from "@/components/features/products/QuantityStepper";
import { CATALOG_COPY } from "@/constants/catalog";
import { CHECKOUT_COPY } from "@/constants/checkout";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

export function ProductPurchaseActions({
  available,
  quantity,
  onQuantity,
  onAdd,
  onBuy,
  onWhatsApp,
  productName,
  shareText,
  variantLabel,
  unitPrice,
}: {
  available: boolean;
  quantity: number;
  onQuantity: (next: number) => void;
  onAdd: () => void;
  onBuy: () => void;
  onWhatsApp?: () => boolean;
  productName: string;
  shareText: string;
  variantLabel?: string;
  unitPrice: number;
}) {
  return (
    <>
      <div className="mt-6 hidden items-center gap-3 lg:flex">
        <p className="text-sm font-medium">Quantity</p>
        <QuantityStepper quantity={quantity} available={available} onQuantity={onQuantity} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 lg:mt-8 lg:flex lg:gap-3">
        <Button size="lg" className="flex-1" onClick={onAdd} disabled={!available}>
          {available ? CHECKOUT_COPY.ADD_TO_CART : CATALOG_COPY.outOfStock}
        </Button>
        <Button size="lg" variant="accent" className="flex-1" onClick={onBuy} disabled={!available}>
          {CHECKOUT_COPY.BUY_NOW}
        </Button>
      </div>
      {variantLabel ? (
        <Button
          size="lg"
          variant="whatsapp"
          className="mt-3 w-full flex items-center justify-center gap-2.5 font-semibold text-white bg-[#25D366] hover:bg-[#1ebe57] transition-all shadow-sm hover:shadow-md py-6 rounded-xl text-base"
          onClick={() => {
            if (onWhatsApp && !onWhatsApp()) return;
            window.open(
              buildWhatsAppUrl(
                buildProductWhatsAppMessage(productName, variantLabel, unitPrice, quantity),
              ),
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 p-1">
            <WhatsAppIcon className="h-4 w-4 text-white" />
          </span>
          <span>Chat on WhatsApp ({variantLabel})</span>
        </Button>
      ) : null}
      <div className="mt-4">
        <ProductShare name={productName} text={shareText} />
      </div>
    </>
  );
}
