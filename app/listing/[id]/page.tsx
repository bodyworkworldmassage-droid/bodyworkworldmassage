'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import SiteHeader from '../../components/SiteHeader';

const ListingMap = dynamic(() => import('../../components/ListingMap'), { ssr: false });

interface Listing {
  id: number;
  title: string;
  description: string | null;
  tags: string | null;
  category: string | null;
  default_category: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  services_offered: string | null;
  pricing: string | null;
  service_areas: string | null;
  availability: string | null;
  status: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  website: string | null;
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<{ image_url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'map'>('profile');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else { setListing(d.listing); setImages(d.images || []); }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load.'); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center"><p>Loading…</p></div>;
  if (error || !listing) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center"><p className="text-red-500">{error || 'Listing not found.'}</p></div>;

  const tags = listing.tags ? listing.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-12">
        {listing.status !== 'approved' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
            Preview mode — this listing is <strong>{listing.status.replace('_', ' ')}</strong> and not yet public.
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {images.map((img, i) => (
              <img key={i} src={img.image_url} alt="" className={`rounded-2xl object-cover w-full ${i === 0 ? 'col-span-2 h-64' : 'h-32'}`} />
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1a3a2a]">{listing.title}</h1>
            {listing.category && (
              <span className="inline-block mt-2 bg-[#1a3a2a] text-white text-xs px-3 py-1 rounded-full">{listing.category}</span>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map(tag => (
                <span key={tag} className="bg-[#f5f0e8] border border-[#1a3a2a]/20 text-[#1a3a2a] text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          {listing.profile_image ? (
            <img src={listing.profile_image} alt="" className="h-16 w-16 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 flex-shrink-0">
              {listing.first_name?.[0]}{listing.last_name?.[0]}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['profile', 'map'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-[#1a3a2a] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {listing.description && (
                <Section title="Description">
                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{listing.description}</p>
                </Section>
              )}
              {listing.services_offered && (
                <Section title="Services Offered">
                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{listing.services_offered}</p>
                </Section>
              )}
              {listing.pricing && (
                <Section title="Pricing">
                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{listing.pricing}</p>
                </Section>
              )}
              {listing.service_areas && (
                <Section title="Service Areas">
                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{listing.service_areas}</p>
                </Section>
              )}
              {listing.availability && (
                <Section title="Availability">
                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{listing.availability}</p>
                </Section>
              )}
            </div>
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-[#1a3a2a] mb-4">Contact</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Provider</p>
                    <p className="font-medium text-gray-800">{listing.first_name} {listing.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Email</p>
                    <a href={`mailto:${listing.email}`} className="text-blue-600 hover:underline">{listing.email}</a>
                  </div>
                  {listing.phone && (
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                      <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">{listing.phone}</a>
                    </div>
                  )}
                  {listing.website && (
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Website</p>
                      <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{listing.website}</a>
                    </div>
                  )}
                  {(listing.city || listing.country) && (
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Location</p>
                      <p className="text-gray-800">{[listing.city, listing.region, listing.country].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && listing.latitude && listing.longitude && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <ListingMap lat={listing.latitude} lng={listing.longitude} onMapClick={() => {}} />
          </div>
        )}
        {activeTab === 'map' && (!listing.latitude || !listing.longitude) && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400 text-sm">No location set for this listing.</div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-[#1a3a2a] mb-3">{title}</h3>
      {children}
    </div>
  );
}
