import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema(
  {
    label: { type: String, required: true },
    sku: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    weightGrams: Number,
  },
  { _id: true },
);

const SeoSchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String,
    canonicalUrl: String,
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    images: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    variants: { type: [VariantSchema], default: [] },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    seo: { type: SeoSchema, default: {} },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", shortDescription: "text" });

export const ProductModel = models.Product ?? model("Product", ProductSchema);
