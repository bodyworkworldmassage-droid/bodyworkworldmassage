'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Section = 'edit' | 'password' | 'listings' | 'notifications' | 'privacy' | 'delete';

export default function AccountPage() {
  const { user, loading, logout, refresh } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>('edit');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <p className="text-[#1a3a2a]">Loading…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#1a3a2a]">My Account</h1>
          <Link
            href="/listing/new"
            className="rounded-full bg-[#1a3a2a] px-6 py-2.5 text-sm text-white font-semibold hover:bg-[#14301f]"
          >
            + Add a Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center mb-4">
              {user.profile_image ? (
                <img src={user.profile_image} alt="" className="h-20 w-20 rounded-full object-cover mx-auto" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-2xl font-bold text-gray-500">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
              )}
              <p className="mt-3 text-sm text-gray-500 font-medium">@{user.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user.account_type}</p>
            </div>
            <nav className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {([
                ['edit', 'Edit Account'],
                ['password', 'Change Password'],
                ['listings', 'My Listings'],
                ['notifications', 'Notifications'],
                ['privacy', 'Privacy'],
              ] as [Section, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  className={`w-full text-left px-5 py-3 text-sm border-b border-gray-100 last:border-0 transition-colors ${section === key ? 'bg-[#1a3a2a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setSection('delete')}
                className={`w-full text-left px-5 py-3 text-sm border-t border-gray-100 text-red-500 hover:bg-red-50 transition-colors ${section === 'delete' ? 'bg-red-50 font-semibold' : ''}`}
              >
                Delete Account
              </button>
              <button
                onClick={async () => { await logout(); router.replace('/'); }}
                className="w-full text-left px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main className="lg:col-span-3">
            {section === 'edit' && <EditAccountSection user={user} onSaved={refresh} />}
            {section === 'password' && <ChangePasswordSection />}
            {section === 'listings' && <MyListingsSection />}
            {section === 'notifications' && <PlaceholderSection title="Notifications" />}
            {section === 'privacy' && <PlaceholderSection title="Privacy Settings" />}
            {section === 'delete' && <DeleteAccountSection onDeleted={() => router.replace('/')} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function EditAccountSection({ user, onSaved }: { user: Record<string, unknown>; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    first_name: (user.first_name as string) || '',
    last_name: (user.last_name as string) || '',
    username: (user.username as string) || '',
    email: (user.email as string) || '',
    phone: (user.phone as string) || '',
    date_of_birth: (user.date_of_birth as string) || '',
    instagram_url: (user.instagram_url as string) || '',
    website: (user.website as string) || '',
    bio: (user.bio as string) || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setError(data.error || 'Failed to save.');
    else { setSuccess('Profile updated!'); await onSaved(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/api/profile/image', { method: 'POST', body: fd });
    setImageUploading(false);
    if (res.ok) { await onSaved(); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-[#1a3a2a] mb-6">Edit Account</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-500" />
        {imageUploading && <p className="text-sm text-blue-500 mt-1">Uploading…</p>}
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
          <input value={form.instagram_url} onChange={e => setForm(f => ({ ...f, instagram_url: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button type="submit" disabled={saving} className="bg-blue-600 text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordSection() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    const res = await fetch('/api/profile/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setError(data.error || 'Failed.');
    else { setSuccess('Password updated!'); setForm({ current_password: '', new_password: '', confirm_new_password: '' }); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-[#1a3a2a] mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" value={form.current_password} onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" value={form.new_password} onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" value={form.confirm_new_password} onChange={e => setForm(f => ({ ...f, confirm_new_password: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button type="submit" disabled={saving} className="bg-blue-600 text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function MyListingsSection() {
  const [listings, setListings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings/mine').then(r => r.json()).then(d => {
      setListings(d.listings || []);
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending_review: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-600',
    rejected: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1a3a2a]">My Listings</h2>
        <Link href="/listing/new" className="bg-[#1a3a2a] text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-[#14301f]">
          + New Listing
        </Link>
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading…</p> : listings.length === 0 ? (
        <p className="text-sm text-gray-500">No listings yet. <Link href="/listing/new" className="text-blue-600 underline">Add one now.</Link></p>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id as number} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200">
              <div>
                <Link href={`/listing/${l.id}`} className="font-semibold text-[#1a3a2a] hover:underline">{l.title as string}</Link>
                <p className="text-xs text-gray-400 mt-0.5">{l.city as string}{l.country ? `, ${l.country}` : ''}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[(l.status as string)] || 'bg-gray-100 text-gray-600'}`}>
                {(l.status as string).replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteAccountSection({ onDeleted }: { onDeleted: () => void }) {
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm !== 'DELETE') return setError('Type DELETE to confirm.');
    setDeleting(true);
    const res = await fetch('/api/profile/delete', { method: 'DELETE' });
    if (res.ok) onDeleted();
    else setDeleting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
      <p className="text-sm text-gray-600 mb-6">This action is permanent and cannot be undone. All your listings and data will be deleted.</p>
      <form onSubmit={handleDelete} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type DELETE to confirm</label>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={deleting} className="bg-red-600 text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
          {deleting ? 'Deleting…' : 'Delete My Account'}
        </button>
      </form>
    </div>
  );
}

function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-[#1a3a2a] mb-4">{title}</h2>
      <p className="text-sm text-gray-500">This section is coming soon.</p>
    </div>
  );
}
