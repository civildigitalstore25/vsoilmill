export type FaqVideo = {
  title: string;
  url: string;
  label?: string;
  part?: string;
  description?: string;
};

export type FaqItem = {
  id: string;
  q: string;
  a: string;
  category: "videos" | "general" | "products" | "delivery";
  badge?: string;
  videos?: FaqVideo[];
};

export const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "videos", label: "🎥 Video Answers", count: 3 },
  { id: "products", label: "Oil & Ghee Quality", count: 4 },
  { id: "delivery", label: "Shipping & Orders", count: 1 },
  { id: "general", label: "Payments & General", count: 1 },
] as const;

export const FAQS: FaqItem[] = [
  {
    id: "special-and-taste",
    q: "What is special about VS OilMill and the authentic taste of our oils?",
    a: "At VS OilMill, we extract 100% pure cold-pressed oil using traditional Vaagai wood Mara Chekku churners. Unlike factory-refined commercial oils that undergo chemical solvent extraction and extreme heat (which strips away vital nutrients), our slow wooden cold-pressing method never exceeds natural room temperature. This retains the original micro-nutrients, authentic aroma, rich golden hue, and deep natural taste that South Indian households have cherished for centuries. Watch our founder Sarathkumar demonstrate what makes our Mara Chekku oil unique and why it tastes so distinctly wholesome.",
    category: "videos",
    badge: "Featured Mill Video",
    videos: [
      {
        title: "What makes VS OilMill special & the rich taste of pure Mara Chekku oil",
        url: "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/special/1.mp4?tr=orig-true",
        label: "Watch Video Explanation",
        description: "Founder Sarathkumar explains the traditional wooden cold-press method, zero chemicals, natural settling, and authentic heritage taste.",
      },
    ],
  },
  {
    id: "low-price-and-quality",
    q: "How can VS OilMill offer such affordable prices while maintaining supreme quality?",
    a: "We believe pure, healthy wooden-pressed oils should be accessible to every family, not an overpriced luxury. We achieve our unbeatable direct mill prices through three core practices: (1) Direct bulk procurement of sun-dried groundnuts, sesame seeds, and copra from local farmers, eliminating middleman commissions and broker fees; (2) In-house Mara Chekku crushing and natural sunlight settling in Madurai, avoiding third-party manufacturing costs; (3) Honest direct-to-consumer delivery with zero expensive marketing agency overheads. In these two detailed video presentations, we walk you step-by-step through our farmer sourcing, mill economics, and quality testing.",
    category: "videos",
    badge: "2-Part Video Guide",
    videos: [
      {
        title: "Part 1: Farm-Direct Sourcing & Honest Mill Pricing",
        url: "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/how/1.mp4?tr=orig-true",
        part: "Part 1",
        label: "Watch Part 1",
        description: "How direct farmer relationships eliminate middleman markups and keep prices fair for customers.",
      },
      {
        title: "Part 2: Traditional Expeller Efficiency & Quality Assurance",
        url: "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/how/2.mp4?tr=orig-true",
        part: "Part 2",
        label: "Watch Part 2",
        description: "How our in-house Mara Chekku extraction maintains 100% purity without high retail overheads.",
      },
    ],
  },
  {
    id: "why-choose-vsoilmill",
    q: "Why should you choose VS OilMill for your family's daily cooking?",
    a: "Choosing VS OilMill guarantees you are getting 100% genuine, unadulterated cold-pressed Mara Chekku oils and authentic Uthukuli Desi Cow Ghee. We are FSSAI licensed, Legal Metrology verified, and government lab-tested with zero liquid paraffin, zero palm oil blends, and zero chemical preservatives. With over 12,000+ happy families served and fast pan-India doorstep delivery, we bring the honest integrity of our village oil mill directly to your kitchen. Watch the video below to learn why conscious families choose VS OilMill.",
    category: "videos",
    badge: "Why Choose Us",
    videos: [
      {
        title: "Why Choose VS OilMill — Purity, Trust & Health",
        url: "https://ik.imagekit.io/r33t79noj/vsoilmill/vsupdated/whyvsoil/1.mp4?tr=orig-true",
        label: "Watch Video Tour",
        description: "See why 12,000+ families trust VS OilMill for genuine cold-pressed oils and pure cow ghee.",
      },
    ],
  },
  {
    id: "what-is-mara-chekku",
    q: "What is Mara Chekku / wooden-pressed oil?",
    a: "Mara Chekku is the traditional wooden mill method used to cold-press oilseeds at low temperature without chemicals — preserving nutrients, aroma, and purity.",
    category: "products",
  },
  {
    id: "delivery-across-india",
    q: "Do you deliver across India?",
    a: "Yes. We ship pan-India. Orders above ₹999 get free express shipping. Estimated delivery typically takes 3 to 5 business days.",
    category: "delivery",
  },
  {
    id: "payment-methods",
    q: "What payment methods do you accept?",
    a: "We accept UPI, cards, and net banking. You can also place an order enquiry via WhatsApp.",
    category: "general",
  },
  {
    id: "ghee-bilona-process",
    q: "How is your Uthukuli Cow Ghee prepared?",
    a: "Our Uthukuli cow ghee is prepared using traditional bilona methods from grass-fed desi cows for authentic grainy texture, golden color, and divine aroma.",
    category: "products",
  },
  {
    id: "store-oils",
    q: "How should I store the oils?",
    a: "Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon and keep the bottle tightly closed.",
    category: "products",
  },
  {
    id: "bulk-15kg-tins",
    q: "Can I order bulk 15 Kg tins?",
    a: "Yes. 15 Kg tins are available for sesame, groundnut, coconut, castor, neem, mahua, and pongam oils. Contact us for restaurant/wholesale needs.",
    category: "products",
  },
];
