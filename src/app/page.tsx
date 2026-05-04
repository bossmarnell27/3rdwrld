import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import { getMediaPublicUrl } from "@/lib/supabase/browser";

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Marquee strip */}
      <div className="border-y border-[#333] py-5 overflow-hidden bg-gradient-to-r from-black via-[#0a0a0a] to-black">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs md:text-sm uppercase tracking-[0.35em] font-semibold text-white">
          {Array(3)
            .fill(
              "3RDWRLD \u00b7 FILM \u00b7 MUSIC \u00b7 CULTURE \u00b7 AESTHETIC \u00b7 JOURNALISM \u00b7 "
            )
            .map((text, i) => (
              <span key={i}>{text}</span>
            ))}
        </div>
      </div>

      {/* Featured grid */}
      <section className="px-6 py-20 md:px-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#888]">
            Featured
          </h2>
          <Link
            href="/explore"
            className="text-xs uppercase tracking-[0.2em] text-[#555] hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#222]">
          {[
            {
              tag: "Studio Series",
              title: "Behind the Lens",
              desc: "An inside look at the creative process",
              video: getMediaPublicUrl("featured-1.mp4"),
              size: "cover",
              position: "center",
              category: "studio",
            },
            {
              tag: "Visualizer",
              title: "Sonic Landscapes",
              desc: "Audio-reactive visual experiences",
              video: getMediaPublicUrl("featured-2.mp4"),
              size: "cover",
              position: "center",
              category: "visualizers",
            },
            {
              tag: "Journalism",
              title: "Culture Decoded",
              desc: "Deep dives into music\u2019s untold stories",
              img: getMediaPublicUrl("featured-3.png"),
              size: "cover",
              position: "center",
              category: "journalism",
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={`/explore?category=${item.category}`}
              className="group bg-black p-0 block overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
                {item.video ? (
                  <video
                    src={item.video}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${item.img})`,
                      backgroundSize: item.size ?? "contain",
                      backgroundPosition: item.position ?? "center",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="text-sm md:text-base uppercase tracking-[0.2em] text-[#ccc] border border-[#333] px-3 py-1.5">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight group-hover:opacity-70 transition-opacity">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Compact agency CTA above the footer — restrained, not dominant. */}
      <section className="border-t border-[#222] px-6 py-10 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#555] block mb-1">
              For artists, labels &amp; brands
            </span>
            <p className="text-base md:text-lg tracking-tight text-[#ddd]">
              Apply to work with 3rdwrld.
            </p>
          </div>
          <Link
            href="/agency"
            className="self-start md:self-auto text-[10px] uppercase tracking-[0.3em] border border-[#333] px-5 py-2.5 hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            Apply →
          </Link>
        </div>
      </section>
    </>
  );
}
