export type GalleryVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: "videos";
  tag: string;
  badge: string;
  featured?: boolean;
  type?: "youtube" | "file";
  subCategory?: "extraction" | "packing" | "packaging" | "selling" | "whitelabel" | "story";
  youtubeId?: string;
  date?: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "banners" | "products" | "combos" | "traditional";
  tag: string;
  badge?: string;
  aspectRatio?: "landscape" | "square" | "portrait";
  link?: string;
};

export type GalleryItem = GalleryVideo | GalleryImage;

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Media", count: 44 },
  { id: "packing", label: "📦 Packing & Dispatch", count: 4 },
  { id: "selling", label: "🛍️ Selling & Offers", count: 21 },
  { id: "whitelabel", label: "🏷️ White Label & Your Brand", count: 2 },
  { id: "extraction", label: "⚙️ Oil Extraction", count: 5 },
  { id: "videos", label: "🎥 Mill Videos (19)", count: 19 },
  { id: "banners", label: "✨ Banners & Promos", count: 4 },
  { id: "products", label: "🧴 Wood Pressed Oils", count: 9 },
  { id: "combos", label: "🎁 Combo Offers", count: 4 },
  { id: "traditional", label: "🏺 Heritage & Traditional", count: 11 },
] as const;

export const GALLERY_VIDEOS: GalleryVideo[] = [
  // 1. Live Mara Chekku Machine Running & Oil Extraction
  {
    id: "groundnuts-live-extraction",
    title: "Mara Chekku Groundnut Oil Live Extraction & Premium Peanuts",
    description:
      "Live cold pressing of farm-fresh groundnuts in traditional Vaagai wooden Chekku, extracting unrefined, naturally nutrient-rich golden peanut oil.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/videos-vsoilmill/groundnuts.mp4?tr=orig-true",
    category: "videos",
    tag: "Groundnut Oil Machine",
    badge: "Live Groundnut Extraction",
    featured: true,
    type: "file",
    subCategory: "extraction",
  },
  {
    id: "coconut-oil-live-flow",
    title: "Mara Chekku Coconut Oil Extraction & Pure Fresh Flow",
    description:
      "Watch sulphur-free sun-dried copra being cold-pressed in our wooden expeller, releasing crystal-pure, deeply fragrant Mara Chekku coconut oil.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/videos-vsoilmill/coconut-oil.mp4?tr=orig-true",
    category: "videos",
    tag: "Coconut Oil Machine",
    badge: "Pure Coconut Flow",
    featured: true,
    type: "file",
    subCategory: "extraction",
  },
  {
    id: "dry-process-sesame-coconut-groundnut",
    title: "Natural Sun-Drying Process: Sesame Seeds, Copra & Groundnuts",
    description:
      "Traditional open-air sunlight drying of sesame seeds, premium coconut copra, and groundnuts to eliminate moisture before authentic Mara Chekku pressing.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/videos-vsoilmill/dry-process-sesame-coconut-groundnut.mp4?tr=orig-true",
    category: "videos",
    tag: "Raw Material Sun-Drying",
    badge: "Natural Sun-Drying",
    featured: true,
    type: "file",
    subCategory: "extraction",
  },
  {
    id: "oil-machine-groundnut-extraction",
    title: "Mara Chekku Groundnut Oil Machine Running & Live Extraction",
    description:
      "Watch our traditional Vaagai wooden cold-press machine running at gentle speed, crushing sun-dried peanuts to extract fresh, aromatic unrefined groundnut oil.",
    videoUrl: "https://youtube.com/shorts/xJP29mjCkKc?si=iEq37ig2MWkyAJRe",
    category: "videos",
    tag: "Machine & Oil Extraction",
    badge: "Live Machine Running",
    featured: true,
    type: "youtube",
    subCategory: "extraction",
    youtubeId: "xJP29mjCkKc",
  },
  {
    id: "oil-machine-coconut-extraction",
    title: "Mara Chekku Coconut Oil Machine Running & Live Extraction",
    description:
      "Watch sulphur-free naturally sun-dried copra being cold-pressed in our traditional wooden mill to extract crystal-pure, fragrant Mara Chekku coconut oil.",
    videoUrl: "https://youtube.com/shorts/_Wug05LRL4g?si=e_479Hi1QJJ_5v-u",
    category: "videos",
    tag: "Machine & Oil Extraction",
    badge: "Live Machine Running",
    featured: true,
    type: "youtube",
    subCategory: "extraction",
    youtubeId: "_Wug05LRL4g",
  },

  // 2. Customer Orders Packaging & Doorstep Courier Dispatch (PACKING)
  {
    id: "customer-packaging-dispatch-general",
    title: "Safe Packaging & Doorstep Delivery Dispatch to Customers",
    description:
      "See how we safely pack pure Mara Chekku oils and Uthukuli cow ghee with bubble cushioning, tamper-proof seals, and corrugated boxes for nationwide doorstep delivery.",
    videoUrl: "https://www.youtube.com/shorts/Yz_iUykJBzc",
    category: "videos",
    tag: "Packaging & Dispatch",
    badge: "Safe Delivery",
    featured: true,
    type: "youtube",
    subCategory: "packing",
    youtubeId: "Yz_iUykJBzc",
  },
  {
    id: "customer-packaging-26-oct-2026",
    title: "Customer Orders Packaging & Dispatch — 26 October 2026",
    description:
      "Real customer shipment dispatch log from 26 October 2026: packing bottles, 5L cans, and combo packs for prompt courier dispatch across Tamil Nadu & India.",
    videoUrl: "https://www.youtube.com/shorts/38e8jJcyH0I",
    category: "videos",
    tag: "Packaging & Dispatch",
    badge: "26 Oct 2026 Dispatch",
    featured: false,
    type: "youtube",
    subCategory: "packing",
    date: "26 October 2026",
    youtubeId: "38e8jJcyH0I",
  },
  {
    id: "customer-packaging-17-oct-2026",
    title: "Customer Orders Packaging & Dispatch — 17 October 2026",
    description:
      "Real customer shipment dispatch log from 17 October 2026: safe packing of traditional cold-pressed oils and pure cow ghee sent to delighted customers.",
    videoUrl: "https://www.youtube.com/shorts/tKsSgb3zhuQ",
    category: "videos",
    tag: "Packaging & Dispatch",
    badge: "17 Oct 2026 Dispatch",
    featured: false,
    type: "youtube",
    subCategory: "packing",
    date: "17 October 2026",
    youtubeId: "tKsSgb3zhuQ",
  },
  {
    id: "customer-packaging-cow-ghee-30l",
    title: "Customer Orders Packaging & Dispatch — 30 Litres Cow Ghee Courier Dispatch",
    description:
      "Watch our team carefully pack and dispatch 30 litres of pure Uthukuli cow ghee in protective courier packaging with doorstep delivery all over Tamil Nadu.",
    videoUrl: "https://www.youtube.com/shorts/S4F6A1PH-9E",
    category: "videos",
    tag: "Packaging & Dispatch",
    badge: "30L Ghee Dispatch",
    featured: true,
    type: "youtube",
    subCategory: "packing",
    youtubeId: "S4F6A1PH-9E",
  },

  // 3. Direct Mill Selling, Factory Rates & Exclusive Offers (SELLING)
  {
    id: "selling-groundnut-oil-220",
    title: "Wooden Pressed Groundnut Oil Direct Sale — ₹220/L with Door Delivery",
    description:
      "Direct mill selling: fresh Mara Chekku peanut oil cold-pressed in Madurai at direct factory rate ₹220 per litre with door delivery available.",
    videoUrl: "https://youtube.com/shorts/xJP29mjCkKc?si=iEq37ig2MWkyAJRe",
    category: "videos",
    tag: "Direct Selling",
    badge: "₹220/L Direct Sale",
    featured: true,
    type: "youtube",
    subCategory: "selling",
    youtubeId: "xJP29mjCkKc",
  },
  {
    id: "selling-coconut-oil-350",
    title: "Wooden Pressed Coconut Oil Direct Sale — ₹350/L with Door Delivery",
    description:
      "Direct mill selling: 100% sulphur-free copra Mara Chekku coconut oil at direct mill rate ₹350 per litre with prompt courier delivery.",
    videoUrl: "https://youtube.com/shorts/_Wug05LRL4g?si=e_479Hi1QJJ_5v-u",
    category: "videos",
    tag: "Direct Selling",
    badge: "₹350/L Direct Sale",
    featured: true,
    type: "youtube",
    subCategory: "selling",
    youtubeId: "_Wug05LRL4g",
  },
  {
    id: "selling-diwali-combo-offer",
    title: "Diwali Special Combo Offer & Booking — ₹2,222 Sale Price (MRP ₹3,000)",
    description:
      "Festive celebration combo booking: cold pressed groundnut, sesame & coconut oils plus pure Uthukuli cow ghee at ₹2,222 exclusive sale price.",
    videoUrl: "https://www.youtube.com/shorts/Kjz0OuGsh-s",
    category: "videos",
    tag: "Combo Sale Offer",
    badge: "₹2,222 Sale Booking",
    featured: true,
    type: "youtube",
    subCategory: "selling",
    youtubeId: "Kjz0OuGsh-s",
  },
  {
    id: "selling-weekend-cow-ghee-700",
    title: "Weekend Pure Cow Ghee Sale Offer — ₹700/L with Free Door Delivery",
    description:
      "Special weekend direct sale: pure golden grainy Uthukuli Desi Cow Ghee at ₹700 per litre with free doorstep courier delivery across Tamil Nadu.",
    videoUrl: "https://www.youtube.com/shorts/92frcHQQS_g",
    category: "videos",
    tag: "Weekend Sale Offer",
    badge: "₹700/L Ghee Sale",
    featured: true,
    type: "youtube",
    subCategory: "selling",
    youtubeId: "92frcHQQS_g",
  },

  // 4. White Label, Unlabeled Supply & Custom Branding (WHITE LABEL)
  {
    id: "white-label-unlabeled-supply-video",
    title: "White Label & Private Brand Supply — Unlabeled Oils for Your Own Brand",
    description:
      "VS OilMill supplies pure wood-pressed Mara Chekku oils in unlabeled bottles and cans. Resellers and brand owners paste their own custom labels and sell under their own brand with zero factory setup cost.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/whitelabel/whitelabel.mp4?tr=orig-true",
    category: "videos",
    tag: "White Label Supply",
    badge: "Sell With Your Brand",
    featured: true,
    type: "file",
    subCategory: "whitelabel",
  },
  {
    id: "white-label-branding-nonbranding-short",
    title: "Branded & Non-Branded (Unlabeled) Oil Supply & Direct Reseller Service",
    description:
      "Watch how we supply non-branded (unlabeled) oil cans and bottles for resellers who apply their own brand labels, as well as direct doorstep indirect services.",
    videoUrl: "https://www.youtube.com/shorts/rQvuRBB4EMk",
    category: "videos",
    tag: "Custom Branding",
    badge: "Non-Branded Supply",
    featured: true,
    type: "youtube",
    subCategory: "whitelabel",
    youtubeId: "rQvuRBB4EMk",
  },

  // 5. Mill Stories, Sourcing & Founder Explanations
  {
    id: "president-dignitary-mill-visit",
    title: "President & Dignitary Inspection Visit to VS Oil Mill",
    description:
      "Dignitary and association president visit to VS Oil Mill in Madurai, observing authentic Mara Chekku wooden press operations and traditional purity standards.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/videos-vsoilmill/presdient-visit.mp4?tr=orig-true",
    category: "videos",
    tag: "President & Dignitary Visit",
    badge: "President Mill Visit",
    featured: true,
    type: "file",
    subCategory: "story",
  },
  {
    id: "special-and-taste",
    title: "What Makes VS OilMill Special & The Pure Taste of Mara Chekku Oil",
    description:
      "Watch founder Sarathkumar demonstrate how traditional Vaagai wood cold-pressing locks in natural nutrients, aroma, and authentic heritage taste without chemicals or heat.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/special/1.mp4?tr=orig-true",
    category: "videos",
    tag: "Special & Taste",
    badge: "Founder Explains",
    featured: true,
    type: "file",
    subCategory: "story",
  },
  {
    id: "low-price-part-1",
    title: "How VS OilMill Offers Low Prices with High Quality — Part 1: Direct Farm Sourcing",
    description:
      "See how our direct bulk procurement from local Tamil Nadu farmers eliminates all middleman commissions, keeping pure Mara Chekku oils affordable for everyday families.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/how/1.mp4?tr=orig-true",
    category: "videos",
    tag: "Mill Pricing Part 1",
    badge: "Direct Farm Sourcing",
    featured: true,
    type: "file",
    subCategory: "story",
  },
  {
    id: "low-price-part-2",
    title: "How VS OilMill Offers Low Prices with High Quality — Part 2: In-House Mill Efficiency",
    description:
      "Explore our in-house extraction and natural sunlight sedimentation process in Madurai that guarantees supreme quality with zero expensive corporate markups.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/how/2.mp4?tr=orig-true",
    category: "videos",
    tag: "Mill Pricing Part 2",
    badge: "In-House Mill Efficiency",
    featured: true,
    type: "file",
    subCategory: "story",
  },
  {
    id: "why-choose-vsoilmill",
    title: "Why You Need to Choose VS OilMill for Your Family's Health",
    description:
      "Discover why over 12,000+ conscious households trust VS OilMill: 100% unadulterated Mara Chekku oils, lab-tested purity, FSSAI compliance, and doorstep express delivery.",
    videoUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/whyvsoil/1.mp4?tr=orig-true",
    category: "videos",
    tag: "Why Choose Us",
    badge: "Why Choose Us",
    featured: true,
    type: "file",
    subCategory: "story",
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  // Banners & Promos
  {
    id: "banner-oils",
    title: "Pure, Traditional Wood-Pressed Oils Banner",
    description:
      "Cold-pressed with Vaagai wood to retain natural nutrients, aroma, and rich authentic taste.",
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/banner/1.png",
    category: "banners",
    tag: "Mill Banner",
    badge: "Signature Collection",
    aspectRatio: "landscape",
    link: "/shop",
  },
  {
    id: "banner-ghee",
    title: "Authentic Uthukuli Desi Cow Ghee Banner",
    description:
      "Slow-cooked traditionally with golden granules and heavenly aroma from grass-fed cows.",
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/banner/2.png",
    category: "banners",
    tag: "Pure Cow Ghee",
    badge: "Bilona Churned",
    aspectRatio: "landscape",
    link: "/categories/pure-cow-ghee",
  },
  {
    id: "banner-honey",
    title: "Pure Raw Wild Forest Honey Promo",
    description:
      "100% unheated, unprocessed raw honey straight from natural apiaries.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/honey.jpeg?updatedAt=1792839297577",
    category: "banners",
    tag: "Natural Honey",
    badge: "100% Pure Raw",
    aspectRatio: "square",
    link: "/products/honey-with-dry-nuts-mixture",
  },
  {
    id: "banner-combo-deals",
    title: "Special Value Combo Offer Banner",
    description:
      "Save up to 25% on our specially curated oil and ghee value combo bundles.",
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
    category: "banners",
    tag: "Combo Savings",
    badge: "Special Deals",
    aspectRatio: "square",
    link: "/combos",
  },

  // Wood Pressed Oils & Signature Products (All active in store)
  {
    id: "prod-groundnut-5l",
    title: "கடலை எண்ணெய் (Groundnut Oil) — 5 Litre Can",
    description:
      "Farm-fresh unrefined groundnut oil extracted in traditional Vaagai wooden Chekku.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/update-groundnutoil/5liter.jpeg?updatedAt=1792836907732",
    category: "products",
    tag: "Groundnut Oil",
    badge: "Bestseller",
    aspectRatio: "landscape",
    link: "/products/groundnut-oil",
  },
  {
    id: "prod-sesame-1l",
    title: "நல்லெண்ணெய் (Sesame Oil) — 1 Liter Bottle",
    description:
      "Pure Mara Chekku sesame oil with natural palm jaggery, unrefined and deeply aromatic.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/update-sesameOil/1liter.jpeg",
    category: "products",
    tag: "Sesame Oil",
    badge: "Popular Choice",
    aspectRatio: "square",
    link: "/products/sesame-oil",
  },
  {
    id: "prod-coconut-5l",
    title: "தேங்காய் எண்ணெய் (Coconut Oil) — 5 Litre Can",
    description:
      "Sulphur-free copra cold-pressed at low temperature for cooking, hair, and baby care.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/coco_oil/5liter.jpeg?updatedAt=1792836907838",
    category: "products",
    tag: "Coconut Oil",
    badge: "Cold Pressed",
    aspectRatio: "landscape",
    link: "/products/coconut-oil",
  },
  {
    id: "prod-sesame-5l",
    title: "நல்லெண்ணெய் (Sesame Oil) — 5 Litre Can",
    description:
      "Traditional 5 Litre family value pack pressed from premium dark sesame seeds.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/update-sesameOil/5liter.jpeg?updatedAt=1792836907423",
    category: "products",
    tag: "Sesame Oil",
    badge: "Family Pack",
    aspectRatio: "landscape",
    link: "/products/sesame-oil",
  },
  {
    id: "prod-coconut-1l",
    title: "தேங்காய் எண்ணெய் (Coconut Oil) — 1 Liter Bottle",
    description:
      "Pure Mara Chekku unrefined coconut oil in convenient 1 Liter bottle.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/coco_oil/1liter.jpeg?updatedAt=1792836907748",
    category: "products",
    tag: "Coconut Oil",
    badge: "Daily Essential",
    aspectRatio: "square",
    link: "/products/coconut-oil",
  },
  {
    id: "prod-groundnut-1l",
    title: "கடலை எண்ணெய் (Groundnut Oil) — 1 Liter Bottle",
    description:
      "Everyday healthy cooking oil with high smoke point and natural nutty fragrance.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/update-groundnutoil/1liter.jpeg?updatedAt=1792836907685",
    category: "products",
    tag: "Groundnut Oil",
    badge: "Daily Essential",
    aspectRatio: "square",
    link: "/products/groundnut-oil",
  },
  {
    id: "prod-groundnut-15kg",
    title: "கடலை எண்ணெய் (Groundnut Oil) — 15 Kg Tin",
    description:
      "Bulk commercial food-grade tin for caterers, restaurants, and grand wedding functions.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Groundnut%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Groundnut-Oil-15-Kg-Tin.jpg?updatedAt=1789281326935",
    category: "products",
    tag: "Groundnut Oil",
    badge: "15 Kg Bulk",
    aspectRatio: "portrait",
    link: "/products/groundnut-oil",
  },
  {
    id: "prod-sesame-15kg",
    title: "நல்லெண்ணெய் (Sesame Oil) — 15 Kg Tin",
    description:
      "Pure wood pressed sesame oil in traditional 15 Kg bulk tin for restaurants and events.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Sesame%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Sesame-Oil-15-Kg-Tin.jpg?updatedAt=1789281326742",
    category: "products",
    tag: "Sesame Oil",
    badge: "15 Kg Bulk",
    aspectRatio: "portrait",
    link: "/products/sesame-oil",
  },
  {
    id: "prod-coconut-15kg",
    title: "தேங்காய் எண்ணெய் (Coconut Oil) — 15 Kg Tin",
    description:
      "Bulk Mara Chekku coconut oil in 15 Kg commercial tin.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/Vs%20Wooden%20Pressed%20Coconut%20Oil%2015%20Kg%20Tin/Wooden-Pressed-Coconut-Oil-15-Kg-Tin.jpg?updatedAt=1789281326992",
    category: "products",
    tag: "Coconut Oil",
    badge: "15 Kg Bulk",
    aspectRatio: "portrait",
    link: "/products/coconut-oil",
  },

  // Combos & Value Offers (All active in store)
  {
    id: "combo-kitchen",
    title: "Kitchen Combo",
    description:
      "Essential cold pressed Mara Chekku oil bundle for everyday healthy home cooking.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/Kitchen%20combo/kitchen-combo%202.jpeg?updatedAt=1792839926536",
    category: "combos",
    tag: "Kitchen Value",
    badge: "Top Combo",
    aspectRatio: "portrait",
    link: "/combos/kitchen-combo",
  },
  {
    id: "combo-gold-coin",
    title: "Gold 🪙 Coin Offer — Sesame Oil 3 Litres",
    description:
      "Special festive offer: 3 Litres of pure Mara Chekku Sesame Oil with a gold coin guarantee.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/goldcoin/1.jpeg",
    category: "combos",
    tag: "Festive Offer",
    badge: "Gold Coin Deal",
    aspectRatio: "portrait",
    link: "/combos/gold-coin-offer-sesame-oil-3-litres",
  },
  {
    id: "combo-diwali",
    title: "Diwali Special Combo Package",
    description:
      "Celebration combo pack containing pure Mara Chekku oils and aromatic Uthukuli cow ghee.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/diwali/1.jpeg",
    category: "combos",
    tag: "Festive Combo",
    badge: "Festival Deal",
    aspectRatio: "portrait",
    link: "/combos/diwali-combo-package",
  },
  {
    id: "combo-oil-mega",
    title: "Oil Mega Combo Package",
    description:
      "The ultimate all-in-one family savings package with groundnut, sesame, and coconut oils.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/megacombo/1.jpeg",
    category: "combos",
    tag: "Mega Savings",
    badge: "Max Savings",
    aspectRatio: "portrait",
    link: "/combos/oil-mega-combo-package",
  },

  // Heritage, Traditional & Pure Ghee (All active in store)
  {
    id: "trad-ghee-1l",
    title: "பசு நெய் (Pure Cow Ghee) — 1 Litre Jar",
    description:
      "Rich, aromatic, grainy textured authentic Uthukuli desi cow ghee packed in airtight jars.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%201%20Litre/20250925_222958_0000%20(1).png?updatedAt=1789281326869",
    category: "traditional",
    tag: "Pure Cow Ghee",
    badge: "Bilona Method",
    aspectRatio: "square",
    link: "/products/pure-cow-ghee",
  },
  {
    id: "trad-ghee-500ml",
    title: "பசு நெய் (Pure Cow Ghee) — 500 ML Jar",
    description:
      "Traditional village bilona churned Uthukuli cow ghee with natural golden grains.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Uthukuli%20Ghee%20500%20ML/20250925_222958_0000.png?updatedAt=1789281326852",
    category: "traditional",
    tag: "Pure Cow Ghee",
    badge: "Pure & Golden",
    aspectRatio: "square",
    link: "/products/pure-cow-ghee",
  },
  {
    id: "trad-ghee-5l",
    title: "பசு நெய் (Pure Cow Ghee) — 5 Litre Family Can",
    description:
      "Authentic bilona-churned Uthukuli cow ghee in convenient 5 Litre family pack.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/ghee/5liter.jpeg",
    category: "traditional",
    tag: "Pure Cow Ghee",
    badge: "Family Can",
    aspectRatio: "portrait",
    link: "/products/pure-cow-ghee",
  },
  {
    id: "trad-castor-1l",
    title: "ஆமணக்கு எண்ணெய் (Castor Oil) — 1 Litre",
    description:
      "Pure cold-pressed castor oil for Ayurvedic hair treatment, skin conditioning, and cooling.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Castor%20Oil%201%20Litre/VS-Gold-Castor-Oil-1-Litre.jpg?updatedAt=1789281326730",
    category: "traditional",
    tag: "Castor Oil",
    badge: "Ayurvedic Purity",
    aspectRatio: "portrait",
    link: "/products/castor-oil",
  },
  {
    id: "trad-neem-1l",
    title: "வேப்பெண்ணெய் (Neem Oil) — 1 Litre",
    description:
      "100% natural cold pressed neem oil for organic gardening and traditional skin care.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Neem%20Oil%201%20Litre/VS-Gold-Neem-Oil-1-Litre.jpg?updatedAt=1789281326615",
    category: "traditional",
    tag: "Neem Oil",
    badge: "Natural Antiseptic",
    aspectRatio: "portrait",
    link: "/products/neem-oil",
  },
  {
    id: "trad-mahua-1l",
    title: "இலுப்பை எண்ணெய் (Mahua Oil) — 1 Litre",
    description:
      "Pure traditional Iluppai (Mahua) oil for temple deepam lighting and wellness remedies.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Mahua%20Oil%201%20Litre/VS-Gold-Mahua-Oil-1-Litre.jpg?updatedAt=1789281326599",
    category: "traditional",
    tag: "Mahua Oil",
    badge: "Sacred Deepam",
    aspectRatio: "portrait",
    link: "/products/mahua-oil",
  },
  {
    id: "trad-pongam-1l",
    title: "புங்கம் எண்ணெய் (Pongam Oil) — 1 Litre",
    description:
      "Unrefined cold pressed Pongam (Ponga) oil for traditional lighting and herbal remedies.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Gold%20Ponga%20Oil%201%20Litre/VS-Gold-Ponga-Oil-1-Litre.jpg?updatedAt=1789281326731",
    category: "traditional",
    tag: "Pongam Oil",
    badge: "Traditional Oil",
    aspectRatio: "portrait",
    link: "/products/pongam-oil",
  },
  {
    id: "trad-jaggery",
    title: "Jaggery Powder (நாட்டு சர்க்கரை பொடி) — 1 KG",
    description:
      "Pure unrefined traditional country sugar (Nattu Sakkarai) full of natural minerals.",
    imageUrl:
      "https://ik.imagekit.io/zxpphru8x/vsoilmill/VS%20Brand%20Country%20sugar%20(%E0%AE%A8%E0%AE%BE%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AF%81%20%E0%AE%9A%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AE%B0%E0%AF%88)%20-%201KG/195de44e-a962-46e8-99bf-08591029a45d-700x1050.png?updatedAt=1789281327226",
    category: "traditional",
    tag: "Country Sugar",
    badge: "100% Organic",
    aspectRatio: "portrait",
    link: "/products/jaggery-powder",
  },
  {
    id: "trad-honey-nuts",
    title: "Honey with Dry Nuts Mixture (தேன் உலர் பருப்பு கலவை)",
    description:
      "Pure raw wild apiary honey enriched with roasted almonds, cashews, and dates.",
    imageUrl:
      "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/honey.jpeg",
    category: "traditional",
    tag: "Honey & Nuts",
    badge: "Superfood",
    aspectRatio: "square",
    link: "/products/honey-with-dry-nuts-mixture",
  },
  {
    id: "trad-wooden-expeller",
    title: "Mara Chekku Traditional Vaagai Churner",
    description:
      "Our authentic wooden churner in Madurai pressing cold oils at slow, gentle speeds.",
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
    category: "traditional",
    tag: "Mill Heritage",
    badge: "Vaagai Wood",
    aspectRatio: "landscape",
    link: "/about",
  },
  {
    id: "trad-pure-ghee-process",
    title: "Heritage Uthukuli Cow Ghee Bilona Method",
    description:
      "Traditional village churning method to create pure, wholesome bilona cow ghee.",
    imageUrl: "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
    category: "traditional",
    tag: "Bilona Ghee",
    badge: "Traditional Method",
    aspectRatio: "landscape",
    link: "/categories/pure-cow-ghee",
  },
];
