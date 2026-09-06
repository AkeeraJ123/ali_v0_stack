"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await supabase?.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      SIGN OUT
    </Button>
  );
}
