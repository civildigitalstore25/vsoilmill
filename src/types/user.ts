export type UserRole = "user" | "admin";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  addresses: ShippingAddress[];
  createdAt: string;
  updatedAt: string;
}
