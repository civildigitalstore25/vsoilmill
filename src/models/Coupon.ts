import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      default: "PERCENTAGE",
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    timesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableVariants: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

CouponSchema.index({ code: 1, status: 1 });
CouponSchema.index({ validFrom: 1, validTo: 1 });

const ExistingCoupon = models.Coupon;
if (ExistingCoupon) {
  if (!ExistingCoupon.schema.path("applicableVariants")) {
    ExistingCoupon.schema.add({ applicableVariants: { type: [String], default: [] } });
  }
}

export const CouponModel = ExistingCoupon ?? model("Coupon", CouponSchema);
