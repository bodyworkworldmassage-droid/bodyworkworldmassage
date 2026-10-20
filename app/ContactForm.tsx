"use client";

import { useState } from "react";

export default function ContactForm() {
  const [mode, setMode] = useState<"client" | "provider">("provider");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '', service: '', message: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, ...form }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.');
    } else {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', location: '', service: '', message: '' });
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-brand-panel p-8 shadow-sm">
      <div className="flex rounded-full bg-white p-1">
        <button
          type="button"
          onClick={() => { setMode("client"); setSuccess(false); setError(''); }}
          className={`font-jost flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            mode === "client" ? "bg-brand-green text-brand-cream" : "text-[#6b6558]"
          }`}
        >
          I&apos;m looking for a provider
        </button>
        <button
          type="button"
          onClick={() => { setMode("provider"); setSuccess(false); setError(''); }}
          className={`font-jost flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            mode === "provider" ? "bg-brand-green text-brand-cream" : "text-[#6b6558]"
          }`}
        >
          I&apos;m a provider
        </button>
      </div>

      {success ? (
        <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-6 text-center">
          <div className="text-3xl mb-3">✅</div>
          <p className="font-semibold text-green-800 text-base">
            {mode === 'provider' ? 'Request submitted successfully!' : 'Inquiry sent successfully!'}
          </p>
          <p className="text-green-700 text-sm mt-1">We'll be in touch with you shortly.</p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-4 text-sm text-brand-green underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">Full name <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={set('name')}
                required
                className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">Email <span className="text-red-400">*</span></label>
              <input
                type="email"
                placeholder="Your@email.com"
                value={form.email}
                onChange={set('email')}
                required
                className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">Phone <span className="text-stone-400 text-xs">(optional)</span></label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={set('phone')}
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
                value={form.location}
                onChange={set('location')}
                className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">
              {mode === "provider" ? "What you offer" : "What you're looking for"}
            </label>
            <select
              value={form.service}
              onChange={set('service')}
              className="font-jost w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {mode === "provider" ? (
                <>
                  <option value="">Select a service</option>
                  <option>Massage therapy</option>
                  <option>Deep tissue therapy</option>
                  <option>Sports &amp; recovery</option>
                  <option>Prenatal massage</option>
                  <option>Mobile massage</option>
                  <option>Swedish relaxation</option>
                  <option>Myofascial release</option>
                  <option>Hot stone massage</option>
                  <option>Other</option>
                </>
              ) : (
                <>
                  <option value="">Select a service</option>
                  <option>Deep tissue therapy</option>
                  <option>Swedish relaxation</option>
                  <option>Sports &amp; recovery</option>
                  <option>Prenatal massage</option>
                  <option>Mobile massage</option>
                  <option>Myofascial release</option>
                  <option>Hot stone massage</option>
                  <option>Other</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="font-jost mb-1.5 block text-sm text-[#3a352c]">Message <span className="text-red-400">*</span></label>
            <textarea
              rows={4}
              placeholder={
                mode === "provider"
                  ? "Tell us about your practice, your locations, and any cities you travel to."
                  : "Tell us what you're looking for and where."
              }
              value={form.message}
              onChange={set('message')}
              required
              className="font-jost w-full resize-none rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#1c1a16] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-marcellus rounded-full bg-brand-green px-7 py-3 text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : mode === "provider" ? "Request to be listed" : "Send inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
