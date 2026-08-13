import { AdminReviewsClient } from "@/components/features/admin/AdminReviewsClient";
import { connectDb } from "@/lib/db/mongoose";
import { ReviewModel } from "@/models/Review";

export default async function AdminReviewsPage() {
  await connectDb();
  const reviews = JSON.parse(
    JSON.stringify(await ReviewModel.find().sort({ createdAt: -1 }).lean()),
  );

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-dark">Reviews</h1>
      <AdminReviewsClient reviews={reviews} />
    </div>
  );
}
