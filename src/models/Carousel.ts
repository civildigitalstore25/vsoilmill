import { Schema, model, models } from "mongoose";

const CarouselSchema = new Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    navigationLink: { type: String, required: true, trim: true },
    headline: { type: String, default: "", trim: true },
    subheadline: { type: String, default: "", trim: true },
    buttonText: { type: String, default: "", trim: true },
    altText: { type: String, default: "", trim: true },
    sortOrder: { type: Number, required: true, default: 1, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CarouselSchema.index({ sortOrder: 1, createdAt: 1 });
CarouselSchema.index({ isActive: 1, sortOrder: 1 });

export const CarouselModel = models.Carousel ?? model("Carousel", CarouselSchema);
