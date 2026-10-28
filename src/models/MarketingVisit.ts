import { Schema, model, models } from "mongoose";

const MarketingVisitSchema = new Schema(
  {
    source: { type: String, required: true, index: true },
    medium: String,
    campaign: String,
    content: String,
    term: String,
    landingPath: String,
    sessionKey: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

MarketingVisitSchema.index(
  {
    sessionKey: 1,
    source: 1,
    medium: 1,
    campaign: 1,
    content: 1,
    term: 1,
    landingPath: 1,
  },
  { unique: true },
);

export const MarketingVisitModel =
  models.MarketingVisit ?? model("MarketingVisit", MarketingVisitSchema);
