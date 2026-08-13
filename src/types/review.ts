export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  body: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface ReviewFormInput {
  productId: string;
  authorName: string;
  rating: number;
  body: string;
}
