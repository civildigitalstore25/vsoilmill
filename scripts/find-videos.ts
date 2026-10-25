import { connectDb } from "../src/lib/db/mongoose";
import { ProductModel } from "../src/models/Product";
import { ComboModel } from "../src/models/Combo";
import { CarouselModel } from "../src/models/Carousel";

async function findVideos() {
  await connectDb();
  console.log("Connected to MongoDB.");

  const productsWithVideos = await ProductModel.find({ videos: { $exists: true, $not: { $size: 0 } } }).lean();
  console.log(`Products with videos (${productsWithVideos.length}):`);
  for (const p of productsWithVideos) {
    console.log(`- Product "${p.name}" (ID: ${p._id}):`, p.videos);
  }

  const combosWithVideos = await ComboModel.find({ videos: { $exists: true, $not: { $size: 0 } } }).lean();
  console.log(`Combos with videos (${combosWithVideos.length}):`);
  for (const c of combosWithVideos) {
    console.log(`- Combo "${c.name}" (ID: ${c._id}):`, c.videos);
  }

  const carousels = await CarouselModel.find().lean();
  console.log(`Carousels (${carousels.length}):`);
  for (const car of carousels) {
    console.log(`- Carousel "${car.headline}":`, car.linkUrl);
  }
}

findVideos().catch(console.error).finally(() => process.exit(0));
