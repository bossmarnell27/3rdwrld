"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaPublicUrl } from "@/lib/supabase/browser";

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  media: string;
  type: "video" | "image";
  href: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "Visualizer",
    title: "3RDWRLD",
    subtitle: "Music given a world",
    media: getMediaPublicUrl("slide-1.mp4"),
    type: "video",
    href: "/explore",
  },
  {
    id: 2,
    tag: "In the Studio with 3rdwrld",
    title: "WILDKARDUNO",
    subtitle: "Official trailer — out now",
    media: getMediaPublicUrl("slide-2.mp4"),
    type: "video",
    href: "/explore",
  },
  {
    id: 3,
    tag: "3rdwrld Archive",
    title: "KANYE'S LOST DISCOGRAPHY",
    subtitle: "Breaking down the intersections of culture",
    media: getMediaPublicUrl("slide-3.jpeg"),
    type: "image",
    href: "/explore",
  },
];

function SlideBackground({ slide }: { slide: Slide }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  if (slide.type === "video") {
    return (
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={slide.media}
          muted
          autoPlay
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slide.media})`,
          filter: "blur(40px)",
          transform: "scale(1.1)",
        }}
      />
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slide.media})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(next, 9000);
    return () => clearTimeout(timer);
  }, [current, next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <SlideBackground slide={slide} />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end pl-6 pr-6 pb-12 md:pl-16 md:pr-16 md:pb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="fx-pixel text-sm md:text-base uppercase tracking-[0.3em] text-[#888] mb-1"
            >
              {slide.tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-1"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base text-[#aaa] max-w-md"
            >
              {slide.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-4 z-10">
        <button
          onClick={prev}
          className="w-10 h-10 border border-[#333] flex items-center justify-center hover:border-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 border border-[#333] flex items-center justify-center hover:border-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-6 md:left-16 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="relative w-12 h-[2px] bg-[#333] overflow-hidden"
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-white slide-progress"
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
