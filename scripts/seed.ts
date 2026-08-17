import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db/mongoose";
import { UserModel } from "../src/models/User";
import { CategoryModel } from "../src/models/Category";
import { ProductModel } from "../src/models/Product";
import { ReviewModel } from "../src/models/Review";
import { slugify } from "../src/lib/utils/format";
import { AUTH, USER_ROLES } from "../src/constants/auth";

const categories = [
  {
    name: "Wood Pressed Oils",
    slug: "wood-pressed-oils",
    description: "Pure • Traditional • Healthy",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
    badge: "Best Seller",
    sortOrder: 1,
  },
  {
    name: "Pure Cow Ghee",
    slug: "pure-cow-ghee",
    description: "Traditional Taste & Quality",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
    badge: "A2 Bilona",
    sortOrder: 2,
  },
  {
    name: "Traditional Oils",
    slug: "traditional-oils",
    description: "Deepam • Mahua • Pongam",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
    badge: "Sacred & Pure",
    sortOrder: 3,
  },
  {
    name: "Oil Cakes",
    slug: "oil-cakes",
    description: "Groundnut • Coconut • Sesame",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/cake.jpeg",
    badge: "100% Organic",
    sortOrder: 4,
  },
  {
    name: "Combo Offers ",
    slug: "combo-offers",
    description: "Value Packs & Special Deals",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
    badge: "Save Up To 25%",
    sortOrder: 5,
  },
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    description: "Complete Home Care",
    image:
      "https://ik.imagekit.io/mnm0iz0ng2/category/clean_tool.png",
    badge: "Natural Care",
    sortOrder: 6,
  },
];

type SeedProduct = {
  name: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
  variants: {
    label: string;
    sku: string;
    originalPrice: number;
    price: number;
    stock: number;
  }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
};

const products: SeedProduct[] = [
  {
    name: "Wooden Pressed Sesame Oil",
    shortDescription: "Traditional Mara Chekku | Gingelly Oil",
    description:
      "<p>Cold-pressed sesame (gingelly) oil from our Mara Chekku mill. Fragrant, unrefined, and ideal for cooking and traditional use.</p>",
    categorySlug: "wood-pressed-oils",
    isBestSeller: true,
    tags: ["sesame", "gingelly", "wood pressed"],
    variants: [
      { label: "100ml", sku: "SES-100", originalPrice: 120, price: 95, stock: 100 },
      { label: "1L Bottle", sku: "SES-1L", originalPrice: 400, price: 350, stock: 200 },
      { label: "5L Can", sku: "SES-5L", originalPrice: 2000, price: 1750, stock: 80 },
      { label: "15Kg Tin", sku: "SES-15KG", originalPrice: 6600, price: 5775, stock: 40 },
    ],
    seo: {
      metaTitle: "Buy Wooden Pressed Sesame Oil Online | VS OilMill",
      metaDescription:
        "Pure Mara Chekku wooden-pressed sesame oil. Available in 100ml, 1L, 5L and 15Kg. Free shipping above ₹999.",
      metaKeywords: ["sesame oil", "gingelly oil", "wooden pressed oil", "mara chekku"],
    },
  },
  {
    name: "Wooden Pressed Groundnut Oil",
    shortDescription: "Cold Pressed | Mara Chekku | Kadalai Ennai",
    description:
      "<p>Rich groundnut oil pressed traditionally without chemicals. Perfect for deep frying and everyday Tamil cooking.</p>",
    categorySlug: "wood-pressed-oils",
    isBestSeller: true,
    tags: ["groundnut", "wood pressed"],
    variants: [
      { label: "1L Bottle", sku: "GN-1L", originalPrice: 300, price: 260, stock: 180 },
      { label: "5L Can", sku: "GN-5L", originalPrice: 1500, price: 1300, stock: 70 },
      { label: "15Kg Tin", sku: "GN-15KG", originalPrice: 4950, price: 3500, stock: 35 },
    ],
    seo: {
      metaTitle: "Wooden Pressed Groundnut Oil | VS OilMill",
      metaDescription:
        "Buy cold-pressed groundnut oil (kadalai ennai) from VS OilMill. Pure Mara Chekku extraction, pan-India delivery.",
      metaKeywords: ["groundnut oil", "kadalai ennai", "cold pressed oil"],
    },
  },
  {
    name: "Wooden Pressed Coconut Oil",
    shortDescription: "Cold Pressed | Mara Chekku | Thengai Ennai",
    description:
      "<p>Virgin wooden-pressed coconut oil with natural aroma. Use for cooking, hair, and skin.</p>",
    categorySlug: "wood-pressed-oils",
    isBestSeller: true,
    isNewArrival: true,
    tags: ["coconut", "wood pressed"],
    variants: [
      { label: "500ml", sku: "COC-500", originalPrice: 220, price: 190, stock: 120 },
      { label: "1L Bottle", sku: "COC-1L", originalPrice: 380, price: 350, stock: 160 },
      { label: "5L Can", sku: "COC-5L", originalPrice: 2000, price: 1750, stock: 60 },
      { label: "15Kg Tin", sku: "COC-15KG", originalPrice: 6000, price: 5500, stock: 30 },
    ],
  },
  {
    name: "Pure Uthukuli Cow Ghee",
    shortDescription: "A2 Bilona Method | Grass-Fed Desi Cows",
    description:
      "<p>Authentic Uthukuli cow ghee with grainy texture and rich aroma. Prepared using traditional bilona method.</p>",
    categorySlug: "pure-cow-ghee",
    isBestSeller: true,
    tags: ["ghee", "a2", "cow ghee"],
    variants: [
      { label: "100 ML", sku: "GHEE-100", originalPrice: 80, price: 70, stock: 150 },
      { label: "200 ML", sku: "GHEE-200", originalPrice: 160, price: 140, stock: 120 },
      { label: "500 ML", sku: "GHEE-500", originalPrice: 400, price: 350, stock: 100 },
      { label: "1 Litre", sku: "GHEE-1L", originalPrice: 800, price: 700, stock: 90 },
      { label: "5 Litre Can", sku: "GHEE-5L", originalPrice: 4000, price: 3250, stock: 25 },
    ],
    seo: {
      metaTitle: "Buy Uthukuli A2 Cow Ghee Online | VS OilMill",
      metaDescription:
        "Premium Uthukuli bilona cow ghee from VS OilMill. Authentic aroma and grainy texture. Multiple sizes available.",
      metaKeywords: ["uthukuli ghee", "a2 ghee", "bilona ghee"],
    },
  },
  {
    name: "VS Gold Lamp Oil (Deepam)",
    shortDescription: "Pooja & Divine Lighting Oil Blend",
    description: "<p>Clean-burning aromatic lamp oil blend for pooja and home lighting.</p>",
    categorySlug: "traditional-oils",
    tags: ["lamp", "deepam", "traditional"],
    variants: [
      { label: "1 Litre", sku: "LAMP-1L", originalPrice: 200, price: 180, stock: 100 },
      { label: "5 Litre Can", sku: "LAMP-5L", originalPrice: 1000, price: 850, stock: 50 },
    ],
  },
  {
    name: "VS Gold Mahua Oil",
    shortDescription: "Traditional Iluppai Ennai for Pooja & Medicinal Use",
    description: "<p>VS Gold Mahua oil pressed with care for divine purity and traditional remedies.</p>",
    categorySlug: "traditional-oils",
    tags: ["mahua", "iluppai", "traditional"],
    variants: [
      { label: "1 Litre", sku: "MAH-1L", originalPrice: 270, price: 220, stock: 70 },
      { label: "5 Litre Can", sku: "MAH-5L", originalPrice: 1250, price: 1000, stock: 35 },
    ],
  },
  {
    name: "VS Gold Pongam Oil",
    shortDescription: "Pure Ponga Oil for Traditional Uses",
    description: "<p>VS Gold Pongam oil available in multiple convenient pack sizes.</p>",
    categorySlug: "traditional-oils",
    tags: ["pongam", "ponga", "traditional"],
    variants: [
      { label: "1 Litre", sku: "PON-1L", originalPrice: 250, price: 200, stock: 70 },
      { label: "5 Litre Can", sku: "PON-5L", originalPrice: 1250, price: 1000, stock: 35 },
    ],
  },
  {
    name: "Groundnut Oil Cake (Kadalai Punnaku)",
    shortDescription: "100% Organic Cattle Feed & Soil Fertilizer",
    description: "<p>Nutrient-rich natural groundnut cake residue from cold-pressing. Excellent for organic farming and livestock nutrition.</p>",
    categorySlug: "oil-cakes",
    isBestSeller: true,
    tags: ["oil cake", "groundnut", "fertilizer"],
    variants: [
      { label: "5 Kg Bag", sku: "CAKE-GN-5KG", originalPrice: 350, price: 280, stock: 100 },
      { label: "25 Kg Sack", sku: "CAKE-GN-25KG", originalPrice: 1600, price: 1350, stock: 50 },
    ],
  },
  {
    name: "Coconut Oil Cake (Thengai Punnaku)",
    shortDescription: "Organic Plant Fertilizer & Cattle Feed",
    description: "<p>Pure organic coconut cake after cold oil extraction. Ideal soil conditioner and dairy feed boost.</p>",
    categorySlug: "oil-cakes",
    tags: ["oil cake", "coconut"],
    variants: [
      { label: "5 Kg Bag", sku: "CAKE-COC-5KG", originalPrice: 300, price: 250, stock: 80 },
      { label: "25 Kg Sack", sku: "CAKE-COC-25KG", originalPrice: 1400, price: 1150, stock: 40 },
    ],
  },
  {
    name: "Kitchen Trio Health Combo",
    shortDescription: "1L Sesame + 1L Groundnut + 1L Coconut Oil",
    description: "<p>Get all 3 essential cold-pressed cooking oils in one value pack and save big!</p>",
    categorySlug: "combo-offers",
    isBestSeller: true,
    isNewArrival: true,
    tags: ["combo", "value pack", "wood pressed"],
    variants: [
      { label: "3 Bottle Combo (3L)", sku: "COMBO-TRIO-3L", originalPrice: 1080, price: 899, stock: 60 },
    ],
  },
  {
    name: "Herbal Floor Cleaner Liquid",
    shortDescription: "Natural Disinfectant & Fragrant Floor Care",
    description: "<p>Eco-friendly plant-based floor cleaner enriched with citronella and lemongrass essential oils.</p>",
    categorySlug: "home-cleaning",
    isNewArrival: true,
    tags: ["cleaning", "floor cleaner", "natural"],
    variants: [
      { label: "1 Litre", sku: "CLEAN-FL-1L", originalPrice: 220, price: 180, stock: 120 },
      { label: "5 Litre Can", sku: "CLEAN-FL-5L", originalPrice: 950, price: 799, stock: 40 },
    ],
  },
];

async function seed() {
  await connectDb();

  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
    ReviewModel.deleteMany({}),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@vsoilmill.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const passwordHash = await bcrypt.hash(adminPassword, AUTH.bcryptRounds);

  await UserModel.create({
    name: "VS OilMill Admin",
    email: adminEmail,
    passwordHash,
    role: USER_ROLES.ADMIN,
    phone: "8438775451",
  });

  const createdCategories = await CategoryModel.insertMany(
    categories.map((c) => ({ ...c, isActive: true })),
  );
  const categoryMap = Object.fromEntries(
    createdCategories.map((c) => [c.slug, c._id]),
  );

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

  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug];
    if (!categoryId) continue;

    const defaultImg =
      categoryImageMap[product.categorySlug] ??
      "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg";

    await ProductModel.create({
      name: product.name,
      slug: slugify(product.name),
      shortDescription: product.shortDescription,
      description: product.description,
      images: [defaultImg],
      categoryId,
      variants: product.variants,
      tags: product.tags ?? [],
      isActive: true,
      isBestSeller: product.isBestSeller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      seo: product.seo ?? {},
      averageRating: 4.8,
      reviewCount: 12,
    });
  }

  console.log("Seed complete");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
