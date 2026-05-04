"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, getMediaPublicUrl } from "@/lib/supabase/browser";

type Category = "studio-series" | "visualizers" | "journalism";

type MediaItem = {
  id: string;
  type: "image" | "youtube" | "video";
  title: string;
  description: string | null;
  category: Category;
  storage_path: string | null;
  youtube_url: string | null;
  created_at: string;
};

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "studio-series", label: "Studio Series" },
  { value: "visualizers", label: "Visualizers" },
  { value: "journalism", label: "Journalism" },
];

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function AdminPanel({
  email,
  initialItems,
}: {
  email: string;
  initialItems: MediaItem[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [notice, setNotice] = useState<string | null>(null);

  // Image form state
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgTitle, setImgTitle] = useState("");
  const [imgDesc, setImgDesc] = useState("");
  const [imgCategory, setImgCategory] = useState<Category>("journalism");
  const [imgSubmitting, setImgSubmitting] = useState(false);

  // YouTube form state
  const [ytUrl, setYtUrl] = useState("");
  const [ytTitle, setYtTitle] = useState("");
  const [ytDesc, setYtDesc] = useState("");
  const [ytCategory, setYtCategory] = useState<Category>("studio-series");
  const [ytSubmitting, setYtSubmitting] = useState(false);

  // Video form state
  const vidInputRef = useRef<HTMLInputElement>(null);
  const [vidFile, setVidFile] = useState<File | null>(null);
  const [vidTitle, setVidTitle] = useState("");
  const [vidDesc, setVidDesc] = useState("");
  const [vidCategory, setVidCategory] = useState<Category>("visualizers");
  const [vidSubmitting, setVidSubmitting] = useState(false);

  async function handleImageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imgFile) return;

    setImgSubmitting(true);
    setNotice(null);

    const storagePath = `${crypto.randomUUID()}-${safeFilename(imgFile.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, imgFile, {
        contentType: imgFile.type,
        upsert: false,
      });

    if (uploadError) {
      setNotice(`Upload failed: ${uploadError.message}`);
      setImgSubmitting(false);
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("media_items")
      .insert({
        type: "image",
        title: imgTitle.trim(),
        description: imgDesc.trim() || null,
        category: imgCategory,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (insertError || !inserted) {
      // Roll back the upload so we don't orphan the file.
      await supabase.storage.from("media").remove([storagePath]);
      setNotice(`Save failed: ${insertError?.message ?? "unknown error"}`);
      setImgSubmitting(false);
      return;
    }

    setItems((prev) => [inserted as MediaItem, ...prev]);
    setImgFile(null);
    setImgTitle("");
    setImgDesc("");
    if (imgInputRef.current) imgInputRef.current.value = "";
    setNotice("Image uploaded.");
    setImgSubmitting(false);
    router.refresh();
  }

  async function handleYouTubeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setYtSubmitting(true);
    setNotice(null);

    const id = extractYouTubeId(ytUrl.trim());
    if (!id) {
      setNotice("That doesn't look like a YouTube URL.");
      setYtSubmitting(false);
      return;
    }

    const { data: inserted, error } = await supabase
      .from("media_items")
      .insert({
        type: "youtube",
        title: ytTitle.trim(),
        description: ytDesc.trim() || null,
        category: ytCategory,
        youtube_url: ytUrl.trim(),
      })
      .select()
      .single();

    if (error || !inserted) {
      setNotice(`Save failed: ${error?.message ?? "unknown error"}`);
      setYtSubmitting(false);
      return;
    }

    setItems((prev) => [inserted as MediaItem, ...prev]);
    setYtUrl("");
    setYtTitle("");
    setYtDesc("");
    setNotice("YouTube link added.");
    setYtSubmitting(false);
    router.refresh();
  }

  async function handleVideoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vidFile) return;

    setVidSubmitting(true);
    setNotice(null);

    const storagePath = `${crypto.randomUUID()}-${safeFilename(vidFile.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, vidFile, {
        contentType: vidFile.type,
        upsert: false,
      });

    if (uploadError) {
      setNotice(`Upload failed: ${uploadError.message}`);
      setVidSubmitting(false);
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("media_items")
      .insert({
        type: "video",
        title: vidTitle.trim(),
        description: vidDesc.trim() || null,
        category: vidCategory,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (insertError || !inserted) {
      await supabase.storage.from("media").remove([storagePath]);
      setNotice(`Save failed: ${insertError?.message ?? "unknown error"}`);
      setVidSubmitting(false);
      return;
    }

    setItems((prev) => [inserted as MediaItem, ...prev]);
    setVidFile(null);
    setVidTitle("");
    setVidDesc("");
    if (vidInputRef.current) vidInputRef.current.value = "";
    setNotice("Video uploaded.");
    setVidSubmitting(false);
    router.refresh();
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;

    const { error: dbError } = await supabase
      .from("media_items")
      .delete()
      .eq("id", item.id);

    if (dbError) {
      setNotice(`Delete failed: ${dbError.message}`);
      return;
    }

    if ((item.type === "image" || item.type === "video") && item.storage_path) {
      await supabase.storage.from("media").remove([item.storage_path]);
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setNotice("Deleted.");
    router.refresh();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <h1 className="pixel-heading text-5xl md:text-6xl tracking-tighter mb-2">
              ADMIN
            </h1>
            <p className="text-[11px] text-[#666] uppercase tracking-[0.2em]">
              Signed in as {email}
            </p>
          </div>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-[#333] text-[#888] hover:text-white hover:border-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {notice && (
          <div className="mb-8 border border-[#333] bg-white/5 text-[11px] uppercase tracking-[0.2em] text-[#aaa] px-4 py-3">
            {notice}
          </div>
        )}

        {/* Upload image */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#888] mb-6">
            Upload image
          </h2>
          <form onSubmit={handleImageSubmit} className="space-y-4">
            <Field label="File">
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImgFile(e.target.files?.[0] ?? null)}
                className="w-full text-[11px] text-[#aaa] file:mr-4 file:py-2 file:px-4 file:border file:border-[#333] file:bg-transparent file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-white hover:file:border-white file:cursor-pointer"
              />
            </Field>
            <Field label="Title">
              <TextInput value={imgTitle} onChange={setImgTitle} required />
            </Field>
            <Field label="Description">
              <TextArea value={imgDesc} onChange={setImgDesc} />
            </Field>
            <Field label="Category">
              <CategorySelect value={imgCategory} onChange={setImgCategory} />
            </Field>
            <SubmitButton submitting={imgSubmitting} label="Upload image" />
          </form>
        </section>

        {/* YouTube */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#888] mb-6">
            Add YouTube link
          </h2>
          <form onSubmit={handleYouTubeSubmit} className="space-y-4">
            <Field label="YouTube URL">
              <TextInput
                value={ytUrl}
                onChange={setYtUrl}
                placeholder="https://www.youtube.com/watch?v=…"
                required
              />
            </Field>
            <Field label="Title">
              <TextInput value={ytTitle} onChange={setYtTitle} required />
            </Field>
            <Field label="Description">
              <TextArea value={ytDesc} onChange={setYtDesc} />
            </Field>
            <Field label="Category">
              <CategorySelect value={ytCategory} onChange={setYtCategory} />
            </Field>
            <SubmitButton submitting={ytSubmitting} label="Add link" />
          </form>
        </section>

        {/* Video (MP4) */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#888] mb-2">
            Upload video (MP4)
          </h2>
          <p className="text-[11px] text-[#555] mb-6">
            For visualizers and studio clips. Max 50 MB. MP4, WebM, or MOV.
          </p>
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <Field label="File">
              <input
                ref={vidInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                required
                onChange={(e) => setVidFile(e.target.files?.[0] ?? null)}
                className="w-full text-[11px] text-[#aaa] file:mr-4 file:py-2 file:px-4 file:border file:border-[#333] file:bg-transparent file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-white hover:file:border-white file:cursor-pointer"
              />
            </Field>
            <Field label="Title">
              <TextInput value={vidTitle} onChange={setVidTitle} required />
            </Field>
            <Field label="Description">
              <TextArea value={vidDesc} onChange={setVidDesc} />
            </Field>
            <Field label="Category">
              <CategorySelect value={vidCategory} onChange={setVidCategory} />
            </Field>
            <SubmitButton submitting={vidSubmitting} label="Upload video" />
          </form>
        </section>

        {/* Existing items */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#888] mb-6">
            Items ({items.length})
          </h2>
          {items.length === 0 ? (
            <p className="text-[11px] text-[#555]">Nothing yet.</p>
          ) : (
            <ul className="divide-y divide-[#222] border border-[#222]">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.02]"
                >
                  <div className="w-16 h-16 shrink-0 bg-[#111] relative overflow-hidden">
                    {item.type === "image" && item.storage_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getMediaPublicUrl(item.storage_path)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" && item.storage_path ? (
                      <video
                        src={getMediaPublicUrl(item.storage_path)}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-[0.2em] text-[#666]">
                        YT
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{item.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#666] mt-1">
                      {item.category} · {item.type}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-[10px] uppercase tracking-[0.2em] px-3 py-2 border border-[#333] text-[#888] hover:text-red-400 hover:border-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-[#666] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-[#333] px-3 py-2 text-sm focus:border-white focus:outline-none"
    />
  );
}

function TextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-[#333] px-3 py-2 text-sm focus:border-white focus:outline-none resize-none"
    />
  );
}

function CategorySelect({
  value,
  onChange,
}: {
  value: Category;
  onChange: (v: Category) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Category)}
      className="w-full bg-black border border-[#333] px-3 py-2 text-sm focus:border-white focus:outline-none"
    >
      {CATEGORY_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SubmitButton({
  submitting,
  label,
}: {
  submitting: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="text-[10px] uppercase tracking-[0.2em] px-6 py-3 border border-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      {submitting ? "Saving…" : label}
    </button>
  );
}
