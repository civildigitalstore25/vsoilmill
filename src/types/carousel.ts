export interface CarouselSlide {
  _id: string;
  imageUrl: string;
  navigationLink: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CarouselFormData = {
  imageUrl: string;
  navigationLink: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  altText?: string;
  sortOrder: number;
  isActive: boolean;
};
