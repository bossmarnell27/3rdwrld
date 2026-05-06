"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { createClient, getMediaPublicUrl } from "@/lib/supabase/browser";

export default function StudioPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    serviceSelection: "",
    serviceOther: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const service =
      formData.serviceSelection === "other"
        ? formData.serviceOther.trim()
        : formData.serviceSelection;

    const { error } = await supabase.from("agency_submissions").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      service,
      message: formData.message,
    });

    setSubmitting(false);

    if (error) {
      setErrorMessage("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="relative pt-24 pb-20">
      {/* Background video fixed behind content */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <video
          src={getMediaPublicUrl("agency-bg.mp4")}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Legibility overlay: dark base + vertical gradient so text always has contrast */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Hero */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#555] block mb-6">
            Creative Studio
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            TASTE CAN&apos;T
            <br />
            <span className="text-[#444]">BE BOUGHT.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl"
        >
          <p className="text-lg md:text-xl text-[#999] leading-relaxed">
            3rdwrld is a creative studio built at the intersection of music,
            film, and culture. We handle everything that shapes how an artist,
            record, or brand shows up in the world. Visuals, direction,
            promotion, and beyond. Our taste is curated daily. We bring it to
            every project we touch.
          </p>
        </motion.div>
      </section>

      {/* Services */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <h2 className="fx-clean text-xs uppercase tracking-[0.3em] text-[#555] mb-12">
          What we do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#222]">
          {[
            {
              title: "Vision & Direction",
              desc: "The concept, the aesthetic, the arc. Before a single asset is made, we shape how the project should feel and where it should land.",
            },
            {
              title: "Marketing & Rollouts",
              desc: "How the work moves. Sequencing, positioning, and campaign architecture for artists, brands, and labels.",
            },
            {
              title: "Promotion",
              desc: "Putting the work in front of the right eyes. We use the 3rdwrld platform and network to give records, drops, and rollouts the reach they deserve.",
            },
            {
              title: "Videos & Visuals",
              desc: "Music videos, visualizers, edits, album art, short-form. The pieces that carry the project across feeds.",
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-black p-8"
            >
              <h3 className="text-lg font-semibold tracking-tight mb-3">
                {service.title}
              </h3>
              <p className="text-xs text-[#666] leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-[#555] leading-relaxed mt-8 max-w-md">
          And whatever else the project needs.
        </p>
      </section>

      {/* Proof */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <h2 className="fx-clean text-xs uppercase tracking-[0.3em] text-[#555] mb-12">
          What we&apos;ve done
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#222]">
          {[
            {
              stat: "72M+",
              desc: "Views across content on the 3rdwrld platform, including promo for major artists.",
            },
            {
              stat: "530K+",
              desc: "Likes generated for one label's roster through visualizers and edits made in-house.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-black p-8 md:p-10"
            >
              <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
                {item.stat}
              </div>
              <p className="text-xs text-[#666] leading-relaxed max-w-xs">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Apply / Contact form */}
      <section className="border-t border-[#222] px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              WORK WITH US
            </h2>
            <p className="text-sm text-[#666] leading-relaxed max-w-sm">
              If what we believe in lines up with what you&apos;re building,
              we&apos;d like to hear about it. Tell us what you&apos;re working
              on, a record, a drop, a roster, and we&apos;ll reply if we think
              we can add to it.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[11px] text-[#555] uppercase tracking-wider">
                <div className="w-1 h-1 bg-[#555]" />
                Response within 24 hours
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#555] uppercase tracking-wider">
                <div className="w-1 h-1 bg-[#555]" />
                NDA available upon request
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-12 h-12 border border-[#333] rounded-full flex items-center justify-center mb-4">
                  <Check size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Received.</h3>
                <p className="text-xs text-[#666]">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-[#333]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-[#333]"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-[#333]"
                    placeholder="+1 555 555 5555"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    I am a...
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">
                      Select one
                    </option>
                    <option value="artist" className="bg-black">
                      Artist
                    </option>
                    <option value="brand" className="bg-black">
                      Brand
                    </option>
                    <option value="label" className="bg-black">
                      Label
                    </option>
                    <option value="other" className="bg-black">
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    What you&apos;re looking for
                  </label>
                  <select
                    required
                    value={formData.serviceSelection}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceSelection: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">
                      Select one
                    </option>
                    <option value="Visualizer" className="bg-black">
                      Custom Visualizer
                    </option>
                    <option value="Creative Direction" className="bg-black">
                      Creative Direction
                    </option>
                    <option value="Song Promotion" className="bg-black">
                      Song Promotion
                    </option>
                    <option value="Music Video Editing" className="bg-black">
                      Music Video Editing
                    </option>
                    <option value="other" className="bg-black">
                      Other
                    </option>
                  </select>
                  {formData.serviceSelection === "other" && (
                    <input
                      type="text"
                      required
                      value={formData.serviceOther}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceOther: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-[#333] mt-4"
                      placeholder="Tell us what you need"
                    />
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] block mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white outline-none focus:border-white transition-colors resize-none placeholder:text-[#333]"
                    placeholder="What are you building?"
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-400 -mt-2">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] border border-[#333] px-6 py-3 hover:bg-white hover:text-black transition-all duration-300 w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  {submitting ? "Sending…" : "Submit"}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
