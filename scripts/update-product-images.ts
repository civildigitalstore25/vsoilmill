import mongoose from "mongoose";
import { connectDb } from "../src/lib/db/mongoose";
import { CategoryModel } from "../src/models/Category";
import { ProductModel } from "../src/models/Product";

const categoryImageMap: Record<string, string> = {
  "wood-pressed-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
  "pure-cow-ghee":
    "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
  "traditional-oils":
    "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
  "oil-cakes":
    "https://ik.imagekit.io/mnm0iz0ng2/category/cake.jpeg",
  "combo-offers":
    "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
  "home-cleaning":
    "https://ik.imagekit.io/mnm0iz0ng2/category/clean_tool.png",
};

async function updateImages() {
  await connectDb();
  // Touch CategoryModel to register it in Mongoose schemas
  void CategoryModel;

  console.log("Connected to database for image update...");

  const products = await ProductModel.find().populate("categoryId");
  let updatedCount = 0;

  for (const p of products) {
    const hasValidImage =
      Array.isArray(p.images) &&
      p.images.some(
        (img: string) =>
          img &&
          img !== "/images/product-placeholder.svg" &&
          img.startsWith("http"),
      );

    if (!hasValidImage) {
      const catSlug =
        p.categoryId && typeof p.categoryId === "object"
          ? (p.categoryId as { slug?: string }).slug ?? ""
          : "";

      const defaultImg =
        categoryImageMap[catSlug] ||
        "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg";

      p.images = [defaultImg];
      await p.save();
      updatedCount++;
      console.log(`Updated images for product: ${p.name}`);
    }
  }

  console.log(`Successfully updated ${updatedCount} products.`);
  await mongoose.disconnect();
}

updateImages().catch(async (err) => {
  console.error("Failed to update product images:", err);
  await mongoose.disconnect();
  process.exit(1);
});
