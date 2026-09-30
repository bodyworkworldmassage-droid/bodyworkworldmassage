'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-black/10 bg-brand-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="BodyWorkWorldMassage"
              width={504}
              height={495}
              className="h-14 w-auto max-w-[260px] object-contain"
              priority
            />
          </a>
          <nav className="hidden gap-8 text-base text-[#3a352c] lg:flex">
            <a href="/" className="hover:text-brand-green">Home</a>
            <a href="/#about" className="hover:text-brand-green">About</a>
            <a href="/#services" className="hover:text-brand-green">Service</a>
            <a href="/#faq" className="hover:text-brand-green">FAQ</a>
            <a href="/#contact" className="hover:text-brand-green">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 text-sm text-[#1a3a2a] font-semibold hover:underline"
                >
                  {user.profile_image ? (
                    <img src={user.profile_image} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a3a2a] text-white text-xs font-bold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  )}
                  @{user.username}
                </Link>
                <button
                  onClick={logout}
                  className="font-marcellus rounded-full border border-[#1a3a2a] px-4 py-2 text-sm text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                aria-label="Account"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-black/15 text-[#3a352c] sm:flex hover:border-[#1a3a2a]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.8-3.6-5-8-5z" />
                </svg>
              </button>
            )}
            <a
              href="/#contact"
              className="font-marcellus rounded-full bg-brand-green px-5 py-2.5 text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </header>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
