"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMediaPublicUrl } from "@/lib/supabase/browser";

type Category = "studio-series" | "visualizers" | "journalism";

export type ExploreItem = {
  id: string;
  type: "image" | "youtube" | "video";
  title: string;
  description: string | null;
  category: Category;
  storage_path: string | null;
  youtube_url: string | null;
  created_at: string;
};

const categories: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "studio-series", label: "Studio Series" },
  { id: "visualizers", label: "Visualizers" },
  { id: "journalism", label: "Journalism" },
];

function getYouTubeId(url: string): string {
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
  return "";
}

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  if (!id) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-[#555]">
        Invalid YouTube URL
      </div>
    );
  }
  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full border-0"
    />
  );
}

export default function ExploreClient({
  items,
  initialCategory,
}: {
  items: ExploreItem[];
  initialCategory: string;
}) {
  const validIds = categories.map((c) => c.id);
  const [active, setActive] = useState<"all" | Category>(
    (validIds as string[]).includes(initialCategory)
      ? (initialCategory as "all" | Category)
      : "all"
  );

  const videos = items.filter((i) => i.type === "youtube" || i.type === "video");
  const images = items.filter((i) => i.type === "image");

  const filteredVideos =
    active === "all" ? videos : videos.filter((v) => v.category === active);
  const filteredImages =
    active === "all" ? images : images.filter((v) => v.category === active);
  const activeLabel = categories.find((c) => c.id === active)?.label ?? "Posts";

  const [lightbox, setLightbox] = useState<ExploreItem | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pixel-heading text-6xl md:text-8xl tracking-tighter mb-4"
        >
          EXPLORE
        </motion.h1>
        <p className="text-[#666] text-sm max-w-md">
          Studio series, visualizers, journalism, and curated playlists. The
          3rdwrld archive.
        </p>
      </div>

      {/* Category filter */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-12">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-300 whitespace-nowrap ${
                active === cat.id
                  ? "border-white text-white bg-white/5"
                  : "border-[#333] text-[#666] hover:text-white hover:border-[#555]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        {filteredVideos.length === 0 ? (
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#555]">
            No videos in this category yet.
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-[#222]"
          >
            {filteredVideos.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-black"
              >
                {item.type === "video" && item.storage_path ? (
                  <button
                    onClick={() => setLightbox(item)}
                    aria-label={item.title}
                    className="group relative aspect-video bg-[#111] overflow-hidden block w-full cursor-pointer"
                  >
                    <video
                      src={getMediaPublicUrl(item.storage_path)}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <span className="text-white text-lg ml-1">▶</span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="relative aspect-video bg-[#111] overflow-hidden">
                    <YouTubeEmbed url={item.youtube_url ?? ""} title={item.title} />
                  </div>
                )}

                <div className="p-4">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#666] block mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-[#555]">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Instagram-style image grid */}
      {filteredImages.length > 0 && (
        <div className="px-6 md:px-16 max-w-7xl mx-auto mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#888]">
              {active === "all" ? "Posts" : `${activeLabel} — Posts`}
            </h2>
            <span className="text-[10px] text-[#555] uppercase tracking-wider">
              @3rdwrld
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#222]">
            {filteredImages.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group aspect-square bg-[#111] relative overflow-hidden cursor-pointer text-left"
                aria-label={item.title}
              >
                <Image
                  src={getMediaPublicUrl(item.storage_path!)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#999] block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-semibold tracking-tight text-white truncate">
                    {item.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: ExploreItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl grid md:grid-cols-[2fr_1fr] gap-[1px] bg-[#222] border border-[#222]"
      >
        <div className="relative aspect-square md:aspect-auto bg-black min-h-[60vh] md:min-h-[70vh]">
          {item.type === "video" && item.storage_path ? (
            <video
              src={getMediaPublicUrl(item.storage_path)}
              controls
              autoPlay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : item.storage_path ? (
            <Image
              src={getMediaPublicUrl(item.storage_path)}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-contain"
              priority
            />
          ) : null}
        </div>
        <div className="bg-black p-6 md:p-8 flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">
            {item.category}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 md:top-4 md:right-4 w-9 h-9 bg-black border border-[#333] hover:border-white text-[#888] hover:text-white text-lg leading-none flex items-center justify-center transition-colors"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}
