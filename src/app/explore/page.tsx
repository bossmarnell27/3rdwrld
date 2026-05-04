import { createClient } from "@/lib/supabase/server";
import ExploreClient, { type ExploreItem } from "./ExploreClient";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("media_items")
    .select("id, type, title, description, category, storage_path, youtube_url, created_at")
    .order("created_at", { ascending: false });

  return (
    <ExploreClient
      items={(data ?? []) as ExploreItem[]}
      initialCategory={category ?? "all"}
    />
  );
}
