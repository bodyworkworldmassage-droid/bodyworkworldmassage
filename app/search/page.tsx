'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SiteHeader from '@/app/components/SiteHeader';

interface Listing {
  id: number;
  title: string;
  description: string | null;
  tags: string | null;
  category: string | null;
  city: string | null;
  region: string | null;
  services_offered: string | null;
  first_name: string;
  last_name: string;
  username: string;
  profile_image: string | null;
  phone: string | null;
  website: string | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`)
      .then(r => r.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, location]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1a3a2a] hover:underline mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </a>

        <h1 className="font-jost text-3xl font-semibold text-[#1a3a2a] mb-2">
          {q || location
            ? <>Results for{q ? <> &ldquo;{q}&rdquo;</> : null}{location ? <> in &ldquo;{location}&rdquo;</> : null}</>
            : 'All Providers'}
        </h1>
        {!loading && (
          <p className="font-jost text-sm text-[#6b6558] mb-8">{results.length} provider{results.length !== 1 ? 's' : ''} found</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-12 text-center shadow-sm">
            <p className="font-jost text-lg text-[#3a352c]">
              No providers found for your search. Try a different location or service.
            </p>
            <a
              href="/"
              className="font-jost mt-5 inline-block rounded-full bg-[#1a3a2a] px-7 py-3 text-sm text-white hover:bg-[#14301f]"
            >
              Back to Search
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map(listing => {
              const tags = listing.tags ? listing.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
              const firstThreeTags = tags.slice(0, 3);
              const locationParts = [listing.city, listing.region].filter(Boolean).join(', ');

              return (
                <div
                  key={listing.id}
                  className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {listing.profile_image ? (
                      <Image
                        src={`/uploads/profiles/${listing.profile_image}`}
                        alt={`${listing.first_name} ${listing.last_name}`}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#f5f0e8] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-[#7c5a2a]">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-jost font-semibold text-[#1a3a2a] truncate">
                        {listing.first_name} {listing.last_name}
                      </p>
                      {locationParts && (
                        <p className="font-jost text-xs text-[#6b6558] truncate">{locationParts}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="font-jost font-semibold text-[#1c1a16] mb-2 leading-snug">
                    {listing.title}
                  </h3>

                  {listing.category && (
                    <span className="inline-block self-start mb-3 rounded-full bg-[#f5f0e8] px-3 py-0.5 text-xs font-semibold text-[#7c5a2a]">
                      {listing.category}
                    </span>
                  )}

                  {firstThreeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {firstThreeTags.map(tag => (
                        <span key={tag} className="rounded-full border border-black/10 bg-[#f5f0e8]/60 px-2.5 py-0.5 text-xs text-[#3a352c]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {listing.services_offered && (
                    <p className="font-jost text-sm leading-6 text-[#3a352c] mb-4 flex-1">
                      {listing.services_offered.length > 100
                        ? listing.services_offered.slice(0, 100) + '…'
                        : listing.services_offered}
                    </p>
                  )}

                  <a
                    href={`/listing/${listing.id}`}
                    className="mt-auto inline-block w-full rounded-full bg-[#1a3a2a] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#14301f] transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0e8] font-jost text-[#1c1a16]">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
      <footer className="border-t border-black/10 bg-[#f5f0e8] py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-jost text-sm text-[#6b6558] text-center">
            &copy; {new Date().getFullYear()} BodyWorkWorldMassage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
