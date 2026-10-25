import { Schema, model, models } from "mongoose";

const ComboItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    variantId: String,
    quantity: { type: Number, required: true, default: 1 },
    productName: String,
    variantLabel: String,
    isCustom: { type: Boolean, default: false },
    customPrice: Number,
    customImage: String,
  },
  { _id: false },
);

const ComboSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
    items: { type: [ComboItemSchema], default: [] },
  },
  { timestamps: true },
);

const ExistingCombo = models.Combo;
if (ExistingCombo) {
  const itemSchema = (
    ExistingCombo.schema.path("items") as {
      schema?: { path: (name: string) => unknown };
    }
  )?.schema;
  if (!ExistingCombo.schema.path("videos") || (itemSchema && !itemSchema.path("isCustom"))) {
    delete models.Combo;
  }
}
export const ComboModel = models.Combo ?? model("Combo", ComboSchema);
