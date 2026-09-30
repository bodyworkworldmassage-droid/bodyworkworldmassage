"use client";

import { useState } from "react";

export default function ContactForm() {
  const [mode, setMode] = useState<"client" | "provider">("provider");

  return (
    <div className="rounded-2xl border border-black/10 bg-brand-panel p-8 shadow-sm">
      <div className="flex rounded-full bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("client")}
          className={`font-jost flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            mode === "client"
              ? "bg-brand-green text-brand-cream"
              : "text-[#6b6558]"
          }`}
        >
          I&apos;m looking for a provider
        </button>
        <button
          type="button"
          onClick={() => setMode("provider")}
          className={`font-jost flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            mode === "provider"
              ? "bg-brand-green text-brand-cream"
              : "text-[#6b6558]"
          }`}
        >
          I&apos;m a provider
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
              Full name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
              Email
            </label>
            <input
              type="email"
              placeholder="Your@email.com"
              className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
              Phone optional
            </label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
              {mode === "provider" ? "Where you practise" : "Your location"}
            </label>
            <input
              type="text"
              placeholder="ZIP code, city, or state"
              className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>

        <div>
          <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
            {mode === "provider" ? "What you offer" : "What you're looking for"}
          </label>
          <select className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] focus:outline-none focus:ring-2 focus:ring-brand-gold">
            {mode === "provider" ? (
              <>
                <option>Massage therapy</option>
                <option>Deep tissue therapy</option>
                <option>Sports & recovery</option>
                <option>Prenatal massage</option>
                <option>Mobile massage</option>
              </>
            ) : (
              <>
                <option>Deep tissue therapy</option>
                <option>Swedish relaxation</option>
                <option>Sports & recovery</option>
                <option>Prenatal massage</option>
                <option>Mobile massage</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
            Message
          </label>
          <textarea
            rows={4}
            placeholder={
              mode === "provider"
                ? "Tell us about your practice, your locations, and any cities you travel to."
                : "Tell us what you're looking for and where."
            }
            className="font-jost w-full resize-none rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <button
          type="submit"
          className="font-marcellus rounded-full bg-brand-green px-7 py-3 text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
        >
          {mode === "provider" ? "Request to be listed" : "Send inquiry"}
        </button>
      </form>
    </div>
  );
}
