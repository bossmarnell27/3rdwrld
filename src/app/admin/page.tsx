import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: items } = await supabase
    .from("media_items")
    .select("id, type, title, description, category, storage_path, youtube_url, created_at")
    .order("created_at", { ascending: false });

  return <AdminPanel email={user.email ?? ""} initialItems={items ?? []} />;
}
