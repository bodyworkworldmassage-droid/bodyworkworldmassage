'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';

const ListingMap = dynamic(() => import('../../components/ListingMap'), { ssr: false });

const CATEGORIES = ['Massage Therapy', 'Bodywork', 'Sports Therapy', 'Prenatal', 'Mobile Massage', 'Other'];
const MAP_VIEWS = ['Street', 'Satellite', 'Terrain'];

export default function NewListingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '', description: '', tags: '', category: '', default_category: '',
    address: '', country: '', region: '', city: '', postal_code: '',
    latitude: '', longitude: '', map_view: '',
    services_offered: '', pricing: '', service_areas: '', availability: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user, router]);

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted]);
    accepted.forEach(f => {
      const url = URL.createObjectURL(f);
      setPreviews(prev => [...prev, url]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true });

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed.'); setSubmitting(false); return; }

    const listingId = data.listing_id as number;

    if (files.length > 0) {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      await fetch(`/api/listings/${listingId}/images`, { method: 'POST', body: fd });
    }

    setSubmitting(false);
    setSuccessId(listingId);
  };

  if (loading) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center"><p>Loading…</p></div>;

  const lat = parseFloat(form.latitude) || 37.7749;
  const lng = parseFloat(form.longitude) || -122.4194;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1a3a2a] mb-2">Add Place</h1>
        <p className="text-gray-500 mb-8">Enter Listing Details</p>

        {successId ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-green-800 font-semibold text-lg mb-3">Post received!</p>
            <p className="text-green-700 text-sm mb-5">Your listing may need to be reviewed before going live. You can preview it here.</p>
            <Link href={`/listing/${successId}`} className="bg-blue-600 text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-blue-700">
              Preview Listing
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card title="Basic Info">
              <Field label="Place Title *">
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} required />
              </Field>
              <Field label="Place Description">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={inputCls} />
              </Field>
              <Field label="Tags">
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. Swedish, Deep Tissue, Sports" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Default Category">
                  <select value={form.default_category} onChange={e => setForm(f => ({ ...f, default_category: e.target.value }))} className={inputCls}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </Card>

            <Card title="Address">
              <Field label="Address">
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Country">
                  <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="US" className={inputCls} />
                </Field>
                <Field label="Region / State">
                  <input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City">
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="ZIP / Post Code">
                  <input value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} className={inputCls} />
                </Field>
              </div>
            </Card>

            <Card title="Map Location">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="Latitude">
                  <input value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="37.7749" className={inputCls} />
                </Field>
                <Field label="Longitude">
                  <input value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="-122.4194" className={inputCls} />
                </Field>
              </div>
              <Field label="Map View">
                <select value={form.map_view} onChange={e => setForm(f => ({ ...f, map_view: e.target.value }))} className={inputCls}>
                  <option value="">Select…</option>
                  {MAP_VIEWS.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <p className="text-xs text-gray-400 mb-2">Click on the map to set the marker position.</p>
              <ListingMap lat={lat} lng={lng} onMapClick={handleMapClick} />
            </Card>

            <Card title="Images">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">Drop files here OR <span className="text-blue-600 font-semibold">Select Files</span></p>
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previews.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="" className="h-24 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Services & Availability">
              <Field label="Services Offered">
                <textarea value={form.services_offered} onChange={e => setForm(f => ({ ...f, services_offered: e.target.value }))} rows={3} className={inputCls} />
              </Field>
              <Field label="Pricing">
                <textarea value={form.pricing} onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))} rows={3} className={inputCls} />
              </Field>
              <Field label="Service Areas">
                <textarea value={form.service_areas} onChange={e => setForm(f => ({ ...f, service_areas: e.target.value }))} rows={3} className={inputCls} />
              </Field>
              <Field label="Availability">
                <textarea value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} rows={3} className={inputCls} />
              </Field>
            </Card>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white rounded-full py-3 text-base font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'SUBMIT LISTING'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-bold text-[#1a3a2a] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
