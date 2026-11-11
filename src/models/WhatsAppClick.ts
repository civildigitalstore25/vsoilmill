import { Schema, model, models } from "mongoose";
import {
  WhatsAppLeadContext,
  WhatsAppLeadStatus,
} from "@/types/whatsapp-lead";

const ItemSchema = new Schema(
  {
    productId: String,
    name: { type: String, required: true },
    variantLabel: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const AttributionSchema = new Schema(
  {
    source: String,
    medium: String,
    campaign: String,
    content: String,
    term: String,
    landingPath: String,
  },
  { _id: false },
);

const WhatsAppClickSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(WhatsAppLeadStatus),
      default: WhatsAppLeadStatus.NEW,
      index: true,
    },
    context: {
      type: String,
      enum: Object.values(WhatsAppLeadContext),
      required: true,
      index: true,
    },
    pagePath: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    estimatedTotal: { type: Number, required: true },
    attribution: AttributionSchema,
    sessionKey: { type: String, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userName: String,
    userEmail: String,
  },
  { timestamps: true },
);

WhatsAppClickSchema.index({ createdAt: -1 });
WhatsAppClickSchema.index({ "attribution.source": 1 });

export const WhatsAppClickModel =
  models.WhatsAppClick ?? model("WhatsAppClick", WhatsAppClickSchema);
