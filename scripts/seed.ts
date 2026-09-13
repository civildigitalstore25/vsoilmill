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
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
    badge: "Best Seller",
    sortOrder: 1,
  },
  {
    name: "Pure Cow Ghee",
    slug: "pure-cow-ghee",
    description: "Traditional Taste & Quality",
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
    badge: "A2 Bilona",
    sortOrder: 2,
  },
  {
    name: "Traditional Oils",
    slug: "traditional-oils",
    description: "Deepam • Mahua • Pongam",
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
    badge: "Sacred & Pure",
    sortOrder: 3,
  },
  {
    name: "Oil Cakes",
    slug: "oil-cakes",
    description: "Groundnut • Coconut • Sesame",
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/cake.jpeg",
    badge: "100% Organic",
    sortOrder: 4,
  },
  {
    name: "Combo Offers",
    slug: "combo-offers",
    description: "Value Packs & Special Deals",
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
    badge: "Save Up To 25%",
    sortOrder: 5,
  },
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    description: "Complete Home Care",
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/clean_tool.png",
    badge: "Natural Care",
    sortOrder: 6,
  },
];

type SeedProduct = {
  name: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  image: string;
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
    name: "VS Wooden Pressed Groundnut - Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>Unrefined groundnut oil in convenient 5 Litre Can for healthy cooking.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Groundnut%20-%20Oil%205%20Litre%20Can/Wooden-Presseed-Groundnut-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326129",
    tags: ["groundnut oil", "5l can", "wood pressed"],
    variants: [
      { label: "5 Litre Can", sku: "GN-5L-CAN", originalPrice: 1500, price: 1300, stock: 90 },
    ],
  },
  {
    name: "VS Wooden Pressed Sesame Oil 1 Liter",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>Pure wooden pressed sesame oil in 1 Liter PET bottle.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Sesame%20Oil%201%20Liter/VS-Wooden-Pressed-Sesame-Oil.jpg?updatedAt=1789281326285",
    tags: ["sesame oil", "1 liter", "pet bottle"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "SES-1L-BOTTLE", originalPrice: 400, price: 350, stock: 150 },
    ],
  },
  {
    name: "VS Wooden Pressed Coconut - Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>Pure cold pressed coconut oil in handy 5 Litre Can.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Coconut%20-%20Oil%205%20Litre%20Can/Wooden-Pressed-Cocunut-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326275",
    tags: ["coconut oil", "5l can", "wood pressed"],
    variants: [
      { label: "5 Litre Can", sku: "COC-5L-CAN", originalPrice: 2000, price: 1750, stock: 75 },
    ],
  },
  {
    name: "VS Gold Uthukuli Ghee - 5 Litre Can",
    shortDescription: "UTHUKULI COW GHEE | Gst 5%",
    description: "<p>Authentic Uthukuli Desi Cow Ghee 5 Litre family can.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%20-%205%20Litre%20Can/IMG-20250925-WA0135-768x1004.jpg?updatedAt=1789281326288",
    tags: ["uthukuli ghee", "5l can", "cow ghee"],
    variants: [
      { label: "5 Litre Can", sku: "GHEE-5L-CAN", originalPrice: 4000, price: 3250, stock: 35 },
    ],
  },
  {
    name: "VS Wooden Pressed Sesame - Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>Traditional Mara Chekku sesame oil in 5 Litre Can.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Sesame%20-%20Oil%205%20Litre%20Can/Wooden-Pressed-Sesame-Oil-5-Litre-Can-1-1536x1229.jpg?updatedAt=1789281326438",
    tags: ["sesame oil", "5l can", "wood pressed"],
    variants: [
      { label: "5 Litre Can", sku: "SES-5L-CAN", originalPrice: 2000, price: 1750, stock: 80 },
    ],
  },
  {
    name: "VS Wooden Pressed Coconut Oil 1 Liter",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>Pure Mara Chekku wooden pressed coconut oil in 1 Liter PET bottle.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Coconut%20Oil%201%20Liter/VS-Wooden-Pressed-Coconut-Oil.jpg?updatedAt=1789281326421",
    isBestSeller: true,
    tags: ["coconut oil", "wood pressed", "1 liter"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "COC-1L-BOTTLE", originalPrice: 380, price: 350, stock: 120 },
    ],
  },
  {
    name: "VS Gold Neem Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>Pure Neem oil 5 Litre Can for multipurpose natural care.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Neem%20Oil%205%20Litre%20Can/Neem-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326433",
    tags: ["neem oil", "5l can"],
    variants: [
      { label: "5 Litre Can", sku: "NEEM-5L-CAN", originalPrice: 1500, price: 1250, stock: 45 },
    ],
  },
  {
    name: "VS Gold Castor Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>VS Gold Castor oil 5 Litre Can for traditional health and beauty routines.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Castor%20Oil%205%20Litre%20Can/Castor-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326444",
    tags: ["castor oil", "5l can"],
    variants: [
      { label: "5 Litre Can", sku: "CAS-5L-CAN", originalPrice: 1500, price: 1250, stock: 60 },
    ],
  },
  {
    name: "VS Gold Ponga Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>VS Gold Ponga oil 5 Litre Can pressed for sacred lighting and traditional application.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Ponga%20Oil%205%20Litre%20Can/Ponga-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326395",
    tags: ["pongam oil", "5l can"],
    variants: [
      { label: "5 Litre Can", sku: "PON-5L-CAN", originalPrice: 1250, price: 1000, stock: 50 },
    ],
  },
  {
    name: "VS Wooden Pressed Groundnut Oil 1 Liter",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>Cold pressed Mara Chekku groundnut oil in 1 Liter PET bottle.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Wooden%20Pressed%20Groundnut%20Oil%201%20Liter/VS-Wooden-Pressed-Groundnut-Oil.jpg?updatedAt=1789281326509",
    tags: ["groundnut oil", "1 liter", "pet bottle"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "GN-1L-BOTTLE", originalPrice: 300, price: 260, stock: 200 },
    ],
  },
  {
    name: "VS Gold Mahua Oil 5 Litre Can",
    shortDescription: "5 Litre Can | Gst 5%",
    description: "<p>VS Gold Mahua oil 5 Litre Can for lamps and natural remedies.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Mahua%20Oil%205%20Litre%20Can/Mahua-Oil-5-Litre-Can-1536x1229.jpg?updatedAt=1789281326552",
    tags: ["mahua oil", "5l can"],
    variants: [
      { label: "5 Litre Can", sku: "MAH-5L-CAN", originalPrice: 1250, price: 1000, stock: 50 },
    ],
  },
  {
    name: "VS GOLD UTHUKULI COW GHEE 15 Kg Tin",
    shortDescription: "15 Kg Ghee Tin | Gst 5%",
    description: "<p>Bulk 15 Kg commercial tin of pure Uthukuli Desi Cow Ghee for function and catering needs.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20GOLD%20UTHUKULI%20COW%20GHEE%2015%20Kg%20Tin/IMG-20250916-WA0025.jpg?updatedAt=1789281326693",
    tags: ["uthukuli ghee", "15kg tin", "bulk ghee"],
    variants: [
      { label: "15 Kg Tin", sku: "GHEE-15KG-TIN", originalPrice: 11500, price: 9500, stock: 20 },
    ],
  },
  {
    name: "VS Brand Sesame oil - 3 litre - 999 Rs",
    shortDescription: "3 Litre Package | Gst 5%",
    description: "<p>VS Brand Sesame Oil 3 Litre Combo Package (999 Rs) with premium pure sesame oil.</p>",
    categorySlug: "combo-offers",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Brand%20Sesame%20oil%20-%203%20litre%20-%20999%20Rs/IMG-20241013-WA0054.jpg?updatedAt=1789281326709",
    isBestSeller: true,
    tags: ["sesame oil", "3 litre", "combo offer"],
    variants: [
      { label: "3 Litre Package", sku: "SES-3L-PACK", originalPrice: 1200, price: 999, stock: 70 },
    ],
  },
  {
    name: "VS Gold Neem Oil 1 Litre",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>VS Gold Neem oil 1 Litre PET bottle.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Neem%20Oil%201%20Litre/VS-Gold-Neem-Oil-1-Litre.jpg?updatedAt=1789281326615",
    tags: ["neem oil", "1 liter"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "NEEM-1L-BOTTLE", originalPrice: 300, price: 250, stock: 100 },
    ],
  },
  {
    name: "VS Brand Groundnut oil - 5 litre combo package",
    shortDescription: "Combo offer | Gst 5%",
    description: "<p>Special value combo package: 5 Litre VS Brand Groundnut Oil at discounted price.</p>",
    categorySlug: "combo-offers",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Brand%20Groundnut%20oil%20-%205%20litre%20combo%20package/IMG-20240905-WA0074.jpg?updatedAt=1789281326594",
    tags: ["groundnut oil", "combo offer", "5 litre"],
    variants: [
      { label: "Combo offer", sku: "COMBO-GN-5L-PACK", originalPrice: 1500, price: 1099, stock: 60 },
    ],
  },
  {
    name: "VS Gold Mahua Oil 1 Litre",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>VS Gold Mahua oil (Iluppai Ennai) 1 Litre PET bottle.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Mahua%20Oil%201%20Litre/VS-Gold-Mahua-Oil-1-Litre.jpg?updatedAt=1789281326599",
    tags: ["mahua oil", "1 liter"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "MAH-1L-BOTTLE", originalPrice: 270, price: 220, stock: 100 },
    ],
  },
  {
    name: "VS Brand Pulses ( 10 variety)",
    shortDescription: "Combo offer",
    description: "<p>VS Brand Pulses combo package containing 10 varieties of premium unpolished pulses.</p>",
    categorySlug: "combo-offers",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Brand%20Pulses%20(%2010%20variety)/IMG-20260329-WA00731-700x1058.jpg?updatedAt=1789281326605",
    isBestSeller: true,
    tags: ["pulses", "combo offer", "10 variety"],
    variants: [
      { label: "Combo offer", sku: "PULSE-10V-PACK", originalPrice: 999, price: 499, stock: 80 },
    ],
  },
  {
    name: "VS Gold Castor Oil 1 Litre",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>VS Gold Castor oil 1 Litre PET bottle.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Castor%20Oil%201%20Litre/VS-Gold-Castor-Oil-1-Litre.jpg?updatedAt=1789281326730",
    tags: ["castor oil", "1 liter"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "CAS-1L-BOTTLE", originalPrice: 300, price: 250, stock: 100 },
    ],
  },
  {
    name: "VS Gold Ponga Oil 1 Litre",
    shortDescription: "1 Liter Oil PET Bottle | Gst 5%",
    description: "<p>VS Gold Ponga oil 1 Litre PET bottle.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Ponga%20Oil%201%20Litre/VS-Gold-Ponga-Oil-1-Litre.jpg?updatedAt=1789281326731",
    tags: ["pongam oil", "1 liter"],
    variants: [
      { label: "1 Liter Oil PET Bottle", sku: "PON-1L-BOTTLE", originalPrice: 250, price: 200, stock: 100 },
    ],
  },
  {
    name: "VS Gold Uthukuli Ghee 100 ML",
    shortDescription: "UTHUKULI COW GHEE | Gst 5%",
    description: "<p>Authentic Uthukuli Desi Cow Ghee 100 ML pack with granular texture and traditional aroma.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%20100%20ML/20250925_222958_0000.png?updatedAt=1789281326752",
    tags: ["uthukuli ghee", "100ml", "cow ghee"],
    variants: [
      { label: "100 ML", sku: "GHEE-100ML", originalPrice: 80, price: 70, stock: 150 },
    ],
  },
  {
    name: "Vs Wooden Pressed Sesame Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>Traditional cold pressed gingelly/sesame oil in 15 Kg tin.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Sesame%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Sesame-Oil-15-Kg-Tin.jpg?updatedAt=1789281326742",
    isBestSeller: true,
    tags: ["sesame oil", "wood pressed", "15kg tin"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "SES-15KG", originalPrice: 6600, price: 5775, stock: 30 },
    ],
  },
  {
    name: "VS Gold Uthukuli Ghee 500 ML",
    shortDescription: "UTHUKULI COW GHEE | Gst 5%",
    description: "<p>Authentic Uthukuli Desi Cow Ghee 500 ML jar.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%20500%20ML/20250925_222958_0000.png?updatedAt=1789281326852",
    tags: ["uthukuli ghee", "500ml", "cow ghee"],
    variants: [
      { label: "500 ML", sku: "GHEE-500ML", originalPrice: 400, price: 350, stock: 100 },
    ],
  },
  {
    name: "VS Gold Uthukuli Ghee 1 Litre",
    shortDescription: "UTHUKULI COW GHEE | Gst 5%",
    description: "<p>Authentic Uthukuli Desi Cow Ghee 1 Litre pack.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%201%20Litre/20250925_222958_0000%20(1).png?updatedAt=1789281326869",
    isBestSeller: true,
    tags: ["uthukuli ghee", "1 litre", "cow ghee"],
    variants: [
      { label: "1 Litre", sku: "GHEE-1L-BOT", originalPrice: 800, price: 700, stock: 90 },
    ],
  },
  {
    name: "VS Gold Uthukuli Ghee 200 ML",
    shortDescription: "UTHUKULI COW GHEE | Gst 5%",
    description: "<p>Authentic Uthukuli Desi Cow Ghee 200 ML pack.</p>",
    categorySlug: "pure-cow-ghee",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%20200%20ML/20250925_222958_0000%20(1).png?updatedAt=1789281326880",
    tags: ["uthukuli ghee", "200ml", "cow ghee"],
    variants: [
      { label: "200 ML", sku: "GHEE-200ML", originalPrice: 160, price: 140, stock: 120 },
    ],
  },
  {
    name: "Vs Gold Neem Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>Pure Neem oil 15 Kg Tin for traditional, agricultural, and skin care uses.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Gold%20Neem%20Oil%2015%20Kg%20Tin/Neem-Oil-15-Kg-Tin.jpg?updatedAt=1789281326881",
    tags: ["neem oil", "15kg tin", "traditional oil"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "NEEM-15KG", originalPrice: 4500, price: 3500, stock: 30 },
    ],
  },
  {
    name: "Vs Gold Mahua Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>VS Gold Mahua oil (Iluppai Ennai) 15 Kg Tin for divine lighting and traditional remedies.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Gold%20Mahua%20Oil%2015%20Kg%20Tin/Mahua-Oil-15-Kg-Tin.jpg?updatedAt=1789281326891",
    tags: ["mahua oil", "iluppai", "15kg tin"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "MAH-15KG", originalPrice: 4950, price: 3000, stock: 35 },
    ],
  },
  {
    name: "Vs Gold Ponga Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>VS Gold Ponga oil 15 Kg Tin pressed for sacred lighting and traditional application.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Gold%20Ponga%20Oil%2015%20Kg%20Tin/Pongam-Oil-15-Kg-Tin.jpg?updatedAt=1789281326893",
    tags: ["pongam oil", "ponga oil", "15kg tin"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "PON-15KG", originalPrice: 4125, price: 3300, stock: 30 },
    ],
  },
  {
    name: "VS Gold Castor Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>VS Gold Castor oil 15 Kg Tin. Pure, high quality castor oil for traditional and medicinal uses.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Castor%20Oil%2015%20Kg%20Tin/Castor-Oil-15-Kg-Tin.jpg?updatedAt=1789281326960",
    tags: ["castor oil", "15kg tin", "traditional oil"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "CAS-15KG", originalPrice: 4950, price: 3000, stock: 50 },
    ],
  },
  {
    name: "Vs Wooden Pressed Groundnut Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>Unrefined Mara Chekku groundnut oil in 15 Kg tin packaging for traditional cooking.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Groundnut%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Groundnut-Oil-15-Kg-Tin.jpg?updatedAt=1789281326935",
    isBestSeller: true,
    tags: ["groundnut oil", "wood pressed", "15kg tin"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "GN-15KG", originalPrice: 4950, price: 3500, stock: 45 },
    ],
  },
  {
    name: "Vs Wooden Pressed Coconut Oil 15 Kg Tin",
    shortDescription: "15 Kg Oil Tin | Gst 5%",
    description: "<p>Pure Mara Chekku wooden pressed coconut oil in 15 Kg commercial tin.</p>",
    categorySlug: "wood-pressed-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Coconut%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Coconut-Oil-15-Kg-Tin.jpg?updatedAt=1789281326992",
    isBestSeller: true,
    tags: ["coconut oil", "wood pressed", "15kg tin"],
    variants: [
      { label: "15 Kg Oil Tin", sku: "COC-15KG", originalPrice: 6000, price: 5500, stock: 40 },
    ],
  },
  {
    name: "VS Gold Herbal Hair oil 100ml",
    shortDescription: "Hair oil | Gst 5%",
    description: "<p>VS Gold Herbal Hair Oil 100ml formulation with natural herbs for healthy scalp and hair growth.</p>",
    categorySlug: "traditional-oils",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Herbal%20Hair%20oil%20100ml/76b3bf9d-5320-4bed-95c4-3c4a2595a7e5-700x1050.png?updatedAt=1789281327194",
    isBestSeller: true,
    isNewArrival: true,
    tags: ["herbal hair oil", "hair oil", "100ml"],
    variants: [
      { label: "100 ML", sku: "HAIR-100ML", originalPrice: 699, price: 299, stock: 100 },
    ],
  },
  {
    name: "VS Brand Country sugar (நாட்டு சர்க்கரை) - 1KG",
    shortDescription: "Pocket packing | Gst 5%",
    description: "<p>Pure traditional unrefined Country Sugar (Nattu Sakkarai) 1KG pocket packing.</p>",
    categorySlug: "combo-offers",
    image: "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Brand%20Country%20sugar%20(%E0%AE%A8%E0%AE%BE%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AF%81%20%E0%AE%9A%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AE%B0%E0%AF%88)%20-%201KG/195de44e-a962-46e8-99bf-08591029a45d-700x1050.png?updatedAt=1789281327226",
    tags: ["country sugar", "nattu sakkarai", "1kg"],
    variants: [
      { label: "1 KG", sku: "SUGAR-1KG-PACK", originalPrice: 150, price: 100, stock: 200 },
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

  const usedSlugs = new Set<string>();

  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug];
    if (!categoryId) continue;

    let baseSlug = slugify(product.name);
    if (!baseSlug) baseSlug = "product";
    let productSlug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(productSlug)) {
      productSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(productSlug);

    await ProductModel.create({
      name: product.name,
      slug: productSlug,
      shortDescription: product.shortDescription,
      description: product.description,
      images: [product.image],
      categoryId,
      variants: product.variants,
      tags: product.tags ?? [],
      isActive: true,
      isBestSeller: product.isBestSeller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      seo: product.seo ?? {
        metaTitle: `${product.name} | VS OilMill`,
        metaDescription: `Buy ${product.name} online from VS OilMill. High quality, pure products delivered across India.`,
      },
      averageRating: 0,
      reviewCount: 0,
    });
  }

  console.log(`Seed complete: ${products.length} products created.`);
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
