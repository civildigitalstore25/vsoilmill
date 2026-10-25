export type DiscountType = "PERCENTAGE" | "FIXED";
export type CouponStatus = "ACTIVE" | "INACTIVE";

export interface Coupon {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  timesUsed: number;
  applicableProducts: string[];
  applicableVariants?: string[];
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: {
    code: string;
    name: string;
    discountType: DiscountType;
    discountValue: number;
    discount: number;
    applicableProducts?: string[];
    applicableVariants?: string[];
  };
  error?: string;
}
