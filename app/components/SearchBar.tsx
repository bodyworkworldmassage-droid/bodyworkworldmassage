'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
  };

  return (
    <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Service or Provider"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="font-jost w-full rounded-lg border-0 py-3 pl-10 pr-4 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        >
          <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
        <input
          type="text"
          placeholder="City, State or ZIP Code"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="font-jost w-full rounded-lg border-0 py-3 pl-10 pr-4 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center rounded-lg bg-[#2f6fae] px-5 py-3 text-white transition-colors hover:bg-[#255a8c] sm:py-0"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
