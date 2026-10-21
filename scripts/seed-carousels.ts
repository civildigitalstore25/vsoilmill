import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db/mongoose";
import { CarouselModel } from "../src/models/Carousel";

const initialCarousels = [
  {
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/banner/1.png",
    navigationLink: "/shop",
    headline: "Pure, Traditional Wood-Pressed Oils",
    subheadline: "Cold-pressed with Vaagai wood to retain natural nutrients, aroma, and rich taste.",
    buttonText: "Shop All Oils",
    altText: "VS OilMill Wood-Pressed Cold Pressed Oils",
    sortOrder: 1,
    isActive: true,
  },
  {
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/banner/2.png",
    navigationLink: "/categories/pure-cow-ghee",
    headline: "Authentic Uthukuli A2 Cow Ghee",
    subheadline: "Slow-cooked traditionally with rich golden grains, heavenly aroma, and supreme purity.",
    buttonText: "Explore Pure Ghee",
    altText: "Authentic Uthukuli A2 Cow Ghee",
    sortOrder: 2,
    isActive: true,
  },
  {
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
    navigationLink: "/bestsellers",
    headline: "Farm-Fresh Groundnut & Sesame Oils",
    subheadline: "Direct from local farmers to our traditional expeller mill, unrefined and 100% natural.",
    buttonText: "View Best Sellers",
    altText: "Wooden pressed groundnut oil bottles",
    sortOrder: 3,
    isActive: true,
  },
];

async function seedCarousels() {
  await connectDb();
  console.log("Connected to MongoDB for carousel seed.");

  // Check if carousel slides already exist
  const count = await CarouselModel.countDocuments();
  if (count > 0) {
    console.log(`Carousels already exist (${count} slides found). Skipping seed.`);
  } else {
    const created = await CarouselModel.insertMany(initialCarousels);
    console.log(`Successfully seeded ${created.length} carousel slides.`);
  }

  await mongoose.disconnect();
}

seedCarousels().catch(async (err) => {
  console.error("Seeding error:", err);
  await mongoose.disconnect();
  process.exit(1);
});
