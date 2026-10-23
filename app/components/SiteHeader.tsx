'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-black/10 bg-brand-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="BodyWorkWorldMassage"
              width={504}
              height={495}
              className="h-16 w-auto max-w-[200px] object-contain sm:h-24 sm:max-w-[300px] lg:h-28 lg:max-w-[380px]"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden gap-8 text-lg text-[#3a352c] lg:flex">
            <a href="/" className="hover:text-brand-green">Home</a>
            <a href="/#about" className="hover:text-brand-green">About</a>
            <a href="/#services" className="hover:text-brand-green">Service</a>
            <a href="/#faq" className="hover:text-brand-green">FAQ</a>
            <a href="/#contact" className="hover:text-brand-green">Contact</a>
          </nav>

          {/* Right side — desktop */}
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm text-[#1a3a2a] font-semibold hover:underline"
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
                className="flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-[#3a352c] hover:border-[#1a3a2a] hover:text-[#1a3a2a] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-shrink-0">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.8-3.6-5-8-5z" />
                </svg>
                <span className="font-jost text-base font-medium">Create a new profile</span>
              </button>
            )}
            <a
              href="/#contact"
              className="font-marcellus rounded-full bg-brand-green px-7 py-3 text-base tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Profile icon — always visible on mobile */}
            {user ? (
              <Link href="/account" className="flex items-center justify-center">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="" className="h-9 w-9 rounded-full object-cover border-2 border-brand-green" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a3a2a] text-white text-sm font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                )}
              </Link>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                aria-label="Sign in"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-[#3a352c] hover:border-brand-green hover:text-brand-green"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.8-3.6-5-8-5z" />
                </svg>
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-[#3a352c]"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="border-t border-black/10 bg-brand-cream px-4 pb-4 lg:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/#about' },
                { label: 'Service', href: '/#services' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Contact', href: '/#contact' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-[#3a352c] hover:bg-black/5 hover:text-brand-green"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
              {user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="font-marcellus rounded-full border border-[#1a3a2a] px-4 py-2.5 text-sm text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { setModalOpen(true); setMenuOpen(false); }}
                  className="font-marcellus rounded-full border border-[#1a3a2a] px-4 py-2.5 text-sm text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white transition-colors"
                >
                  Create a new profile
                </button>
              )}
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="font-marcellus rounded-full bg-brand-green px-4 py-2.5 text-center text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
              >
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
