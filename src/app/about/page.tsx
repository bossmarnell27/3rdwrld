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
            The reflection of our fractured culture.
          </p>
        </motion.div>
      </section>

      {/* Brand story */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="fx-clean text-xs uppercase tracking-[0.3em] text-[#555] sticky top-32">
              The brand
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="space-y-6 text-[#999] text-sm leading-relaxed max-w-xl">
              <p>
                3rdwrld is a multi-media brand that exists at the intersection
                of our fractured culture. Shared cultural experiences are
                disappearing. Music, film, fashion, and the moments that
                define us are scattered across a thousand different
                perspectives and world-views. We collect the fragments. We
                find the commonalities. We are the lens.
              </p>
              <p>
                3rdwrld was created to give a unique, and often dark
                perspective of culture. We produce the &ldquo;In the Studio
                with 3rdwrld&rdquo; series that pulls back the curtain on
                artists&apos; creative processes. We build visualizers that
                turn audio into immersive experiences. We write articles that
                treat music, film, fashion, and culture history with the
                delicacy it deserves.
              </p>
              <p>
                As a creative studio, we partner with artists and brands who
                share our obsession of aesthetic. We don&apos;t do campaigns,
                we build worlds. From visualizers to full-scale rollouts,
                everything we touch carries the 3rdwrld standard.
              </p>
              <p>
                This isn&apos;t merely content creation. This is a movement.
              </p>
            </div>
          </div>
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
            href="mailto:3rdwrld4ever@gmail.com"
            className="text-xs uppercase tracking-[0.2em] border border-[#333] px-6 py-3 hover:bg-white hover:text-black transition-all duration-300"
          >
            3rdwrld4ever@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
