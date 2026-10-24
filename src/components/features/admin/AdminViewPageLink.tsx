import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS } from "@/constants/admin";

export function AdminViewPageLink({ href }: { href: string }) {
  return (
    <Button size="icon" variant="outline" className="h-9 w-9" asChild>
      <Link href={href} target="_blank" aria-label={ADMIN_ACTIONS.openPage}>
        <Eye className="h-4 w-4" />
      </Link>
    </Button>
  );
}
