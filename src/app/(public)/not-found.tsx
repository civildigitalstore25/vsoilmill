import type { Metadata } from "next";
import { NotFoundLandingView } from "@/components/features/not-found/NotFoundLandingView";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The requested page was not found. Explore VS OilMill cold-pressed oils, pure ghee, and combo offers.",
};

export default function PublicNotFound() {
  return <NotFoundLandingView />;
}

