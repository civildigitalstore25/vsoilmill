import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ProductsPage() {
  redirect(ROUTES.SHOP);
}
