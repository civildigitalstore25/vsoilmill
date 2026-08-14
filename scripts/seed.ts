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
    name: "15 Kg Tins",
    slug: "15-kg-tins",
    description: "Bulk value packs for homes and businesses",
    badge: "Best Value",
    sortOrder: 1,
  },
  {
    name: "5 Litre Cans",
    slug: "5-litre-cans",
    description: "Family packs for everyday cooking",
    badge: "Popular",
    sortOrder: 2,
  },
  {
    name: "1 Litre Bottles",
    slug: "1-litre-bottles",
    description: "Everyday use PET bottles",
    badge: "Starter Pack",
    sortOrder: 3,
  },
  {
    name: "Uthukuli Ghee",
    slug: "uthukuli-ghee",
    description: "A2 bilona cow ghee",
    badge: "Premium",
    sortOrder: 4,
  },
  {
    name: "Herbal Oils",
    slug: "herbal-oils",
    description: "Wellness blends and hair oil",
    badge: "New Arrival",
    sortOrder: 5,
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
    categorySlug: "1-litre-bottles",
    isBestSeller: true,
    tags: ["sesame", "gingelly"],
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
    categorySlug: "1-litre-bottles",
    isBestSeller: true,
    tags: ["groundnut"],
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
    categorySlug: "1-litre-bottles",
    isBestSeller: true,
    isNewArrival: true,
    tags: ["coconut"],
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
    categorySlug: "uthukuli-ghee",
    isBestSeller: true,
    tags: ["ghee", "a2"],
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
    name: "VS Gold Castor Oil",
    shortDescription: "Pure castor oil for traditional and industrial use",
    description: "<p>High-quality castor oil from VS Gold range. Available in bottles, cans, and tins.</p>",
    categorySlug: "15-kg-tins",
    tags: ["castor"],
    variants: [
      { label: "1 Litre", sku: "CAS-1L", originalPrice: 300, price: 250, stock: 100 },
      { label: "5 Litre Can", sku: "CAS-5L", originalPrice: 1500, price: 1250, stock: 50 },
      { label: "15Kg Tin", sku: "CAS-15KG", originalPrice: 4950, price: 3000, stock: 40 },
    ],
  },
  {
    name: "VS Gold Neem Oil",
    shortDescription: "Natural neem oil",
    description: "<p>Pure neem oil suitable for agricultural and traditional applications.</p>",
    categorySlug: "5-litre-cans",
    tags: ["neem"],
    variants: [
      { label: "1 Litre", sku: "NEEM-1L", originalPrice: 300, price: 250, stock: 80 },
      { label: "5 Litre Can", sku: "NEEM-5L", originalPrice: 1500, price: 1250, stock: 40 },
      { label: "15Kg Tin", sku: "NEEM-15KG", originalPrice: 4500, price: 3500, stock: 25 },
    ],
  },
  {
    name: "VS Gold Mahua Oil",
    shortDescription: "Traditional mahua oil",
    description: "<p>VS Gold Mahua oil pressed with care for purity.</p>",
    categorySlug: "5-litre-cans",
    tags: ["mahua"],
    variants: [
      { label: "1 Litre", sku: "MAH-1L", originalPrice: 270, price: 220, stock: 70 },
      { label: "5 Litre Can", sku: "MAH-5L", originalPrice: 1250, price: 1000, stock: 35 },
      { label: "15Kg Tin", sku: "MAH-15KG", originalPrice: 4500, price: 3000, stock: 20 },
    ],
  },
  {
    name: "VS Gold Pongam Oil",
    shortDescription: "Pure pongam / ponga oil",
    description: "<p>VS Gold Pongam oil available in multiple pack sizes.</p>",
    categorySlug: "5-litre-cans",
    tags: ["pongam"],
    variants: [
      { label: "1 Litre", sku: "PON-1L", originalPrice: 250, price: 200, stock: 70 },
      { label: "5 Litre Can", sku: "PON-5L", originalPrice: 1250, price: 1000, stock: 35 },
      { label: "15Kg Tin", sku: "PON-15KG", originalPrice: 4125, price: 3300, stock: 20 },
    ],
  },
  {
    name: "VS Gold Herbal Hair Oil",
    shortDescription: "Herbal wellness hair oil",
    description: "<p>Herbal hair oil blend from VS Gold for everyday hair care.</p>",
    categorySlug: "herbal-oils",
    isNewArrival: true,
    tags: ["herbal", "hair"],
    variants: [
      { label: "100ml", sku: "HAIR-100", originalPrice: 699, price: 299, stock: 200 },
    ],
  },
  {
    name: "VS Gold Lamp Oil",
    shortDescription: "Traditional lamp oil",
    description: "<p>Clean-burning lamp oil for pooja and home use.</p>",
    categorySlug: "1-litre-bottles",
    tags: ["lamp"],
    variants: [
      { label: "1 Litre", sku: "LAMP-1L", originalPrice: 200, price: 180, stock: 100 },
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

  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug];
    if (!categoryId) continue;

    await ProductModel.create({
      name: product.name,
      slug: slugify(product.name),
      shortDescription: product.shortDescription,
      description: product.description,
      images: ["/images/product-placeholder.svg"],
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
