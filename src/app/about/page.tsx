"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#555] block mb-6">
            About
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            3RDWRLD
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl"
        >
          <p className="text-2xl md:text-3xl text-[#ccc] leading-snug tracking-tight font-light mb-8">
            The digital intersection of film and music.
          </p>
        </motion.div>
      </section>

      {/* Brand story */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#555] sticky top-32">
              The brand
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="space-y-6 text-[#999] text-sm leading-relaxed max-w-xl">
              <p>
                3rdwrld is a multimedia brand built at the crossroads of two
                worlds that were never meant to be separated&mdash;film and
                music. We exist to document, create, and amplify the culture
                that lives in the space between sound and image.
              </p>
              <p>
                Born out of a frustration with surface-level content and
                disposable media, 3rdwrld was created to give depth back to the
                conversation. We produce studio series that pull back the
                curtain on the creative process. We build visualizers that turn
                audio into immersive experiences. We write journalism that
                treats music history with the seriousness it deserves.
              </p>
              <p>
                As a creative studio, we partner with artists and brands who
                share our obsession with craft. We don&apos;t do campaigns
                &mdash;we build worlds. From visual identities to full-scale
                rollouts, everything we touch carries the 3rdwrld standard:
                intentional, uncompromising, and impossible to ignore.
              </p>
              <p>
                This isn&apos;t content for content&apos;s sake. This is a
                movement for anyone who believes that film and music are the
                most powerful storytelling tools on the planet&mdash;and that
                the best stories haven&apos;t been told yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values / pillars */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#555] mb-12">
          What we stand for
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-[#222]">
          {[
            {
              num: "01",
              title: "Craft over content",
              desc: "Every piece we create is built with intention. We'd rather make one thing that matters than a hundred things that don't.",
            },
            {
              num: "02",
              title: "Film + Music",
              desc: "These two mediums are inseparable. We exist at their intersection and refuse to treat them as anything less than art forms.",
            },
            {
              num: "03",
              title: "Depth over virality",
              desc: "We don't chase trends. We document culture, explore history, and create work that holds up long after the algorithm moves on.",
            },
            {
              num: "04",
              title: "Uncompromising",
              desc: "We believe in the power of saying no. Limited roster, high standards, zero shortcuts. If it has our name on it, it's undeniable.",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-black p-8"
            >
              <span className="text-[10px] text-[#444] font-mono block mb-4">
                {value.num}
              </span>
              <h3 className="text-base font-semibold tracking-tight mb-3">
                {value.title}
              </h3>
              <p className="text-xs text-[#666] leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-[#222] px-6 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter mb-2">
              Get in touch
            </h2>
            <p className="text-xs text-[#666]">
              For inquiries, partnerships, and press.
            </p>
          </div>
          <a
            href="mailto:hello@3rdwrld.com"
            className="text-xs uppercase tracking-[0.2em] border border-[#333] px-6 py-3 hover:bg-white hover:text-black transition-all duration-300"
          >
            hello@3rdwrld.com
          </a>
        </div>
      </section>
    </div>
  );
}
