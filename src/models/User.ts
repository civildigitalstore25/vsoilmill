import { Schema, model, models, type InferSchemaType } from "mongoose";

const AddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: Schema.Types.ObjectId };

export const UserModel = models.User ?? model("User", UserSchema);
