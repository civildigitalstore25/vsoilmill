import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema(
  {
    label: { type: String, required: true },
    sku: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    offerPrice: Number,
    available: { type: Boolean, default: true },
    stock: { type: Number, required: true, default: 0 },
    image: String,
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
    videos: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    variants: { type: [VariantSchema], default: [] },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    gstExempt: { type: Boolean, default: false },
    offerEnabled: { type: Boolean, default: false },
    offerStartsAt: Date,
    offerEndsAt: Date,
    seo: { type: SeoSchema, default: {} },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", shortDescription: "text" });

const ExistingProduct = models.Product;
if (ExistingProduct) {
  if (!ExistingProduct.schema.path("gstExempt")) {
    ExistingProduct.schema.add({ gstExempt: { type: Boolean, default: false } });
  }
  if (!ExistingProduct.schema.path("videos")) {
    ExistingProduct.schema.add({ videos: { type: [String], default: [] } });
  }
  if (!ExistingProduct.schema.path("offerEnabled")) {
    ExistingProduct.schema.add({
      offerEnabled: { type: Boolean, default: false },
      offerStartsAt: Date,
      offerEndsAt: Date,
    });
  }
  const variantSchema = (
    ExistingProduct.schema.path("variants") as { schema?: { path: (name: string) => unknown; add: (fields: object) => void } } | undefined
  )?.schema;
  if (variantSchema && !variantSchema.path("available")) {
    variantSchema.add({
      available: { type: Boolean, default: true },
      image: String,
      offerPrice: Number,
    });
  }
}

export const ProductModel = ExistingProduct ?? model("Product", ProductSchema);
