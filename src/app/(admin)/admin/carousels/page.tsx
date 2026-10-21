import { AdminCarouselsClient } from "@/components/features/admin/carousels/AdminCarouselsClient";
import { getAllCarousels } from "@/lib/carousels/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Carousel Management | Admin",
  description: "Create, edit, and manage homepage hero carousel slides.",
};

export default async function AdminCarouselsPage() {
  const slides = await getAllCarousels();
  return <AdminCarouselsClient initialSlides={slides} />;
}
