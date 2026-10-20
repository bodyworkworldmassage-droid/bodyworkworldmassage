'use client';
import { useEffect, useRef, useState } from 'react';

interface DashData {
  kpis: {
    totalUsers: number; totalProviders: number; defaultUsers: number;
    pendingUsers: number; approvedUsers: number;
    totalListings: number; approvedListings: number; pendingListings: number;
    totalImages: number;
  };
  regByDay: { day: string; n: number }[];
  listingsByDay: { day: string; n: number }[];
  usersByState: { state: string; n: number }[];
  listingsByCategory: { category: string; n: number }[];
  recentUsers: any[];
  recentListings: any[];
  pendingProviders: any[];
  pendingListingsDetail: any[];
  providersWithListings: any[];
}

const SECTIONS = [
  { id: 'overview',   label: 'Overview',          icon: '▦' },
  { id: 'providers',  label: 'Providers',          icon: '👥' },
  { id: 'listings',   label: 'Listings',           icon: '📋' },
  { id: 'pending',    label: 'Pending Approvals',  icon: '⏳' },
  { id: 'locations',  label: 'Locations',          icon: '📍' },
  { id: 'categories', label: 'Categories',         icon: '🗂' },
];

export default function DashboardClient() {
  const [data, setData] = useState<DashData | null>(null);
  const [error, setError] = useState('');
  const [section, setSection] = useState('overview');
  const chartsBooted = useRef(false);

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); })
      .catch(() => setError('Failed to load data'));
  }, []);

  useEffect(() => {
    if (!data || chartsBooted.current) return;
    if (typeof window === 'undefined') return;
    if ((window as any).Chart) { bootCharts(data); chartsBooted.current = true; return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = () => { bootCharts(data); chartsBooted.current = true; };
    document.head.appendChild(s);
  }, [data]);

  // Re-run charts when section changes (canvas may not have existed before)
  useEffect(() => {
    if (data && (window as any).Chart) {
      setTimeout(() => bootCharts(data), 50);
    }
  }, [section, data]);

  async function logout() {
    await fetch('/api/dashboard-auth', { method: 'DELETE' });
    window.location.reload();
  }

  if (error) return (
    <div style={{ padding: 40, color: '#dc2626', fontFamily: 'system-ui' }}>
      Error: {error}
    </div>
  );
  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', color: '#6b7280' }}>
      Loading real data…
    </div>
  );

  const { kpis } = data;

  return (
    <>
      <style>{CSS}</style>
      <div id="db-shell">
        <nav id="db-sidebar">
          <div className="sb-logo">
            <div className="sb-logo-icon">BW</div>
            <div>
              <div className="sb-logo-text">BWW Admin</div>
              <div className="sb-logo-sub">Live Database</div>
            </div>
          </div>
          <ul className="sb-nav">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <a className={section === s.id ? 'active' : ''} onClick={() => setSection(s.id)}>
                  <span className="icon">{s.icon}</span> {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'auto', padding: '16px 8px' }}>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>

        <div id="db-main">
          <div id="db-topbar">
            <div className="topbar-title">{SECTIONS.find(s2 => s2.id === section)?.label}</div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              Live · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div id="db-content">
            {section === 'overview'   && <Overview   kpis={kpis} data={data} />}
            {section === 'providers'  && <Providers  data={data} />}
            {section === 'listings'   && <Listings   data={data} />}
            {section === 'pending'    && <Pending    data={data} />}
            {section === 'locations'  && <Locations  data={data} />}
            {section === 'categories' && <Categories data={data} />}
          </div>
        </div>
      </div>
    </>
  );
}

function Overview({ kpis, data }: { kpis: DashData['kpis']; data: DashData }) {
  return (
    <>
      <div className="kpi-grid">
        <KpiCard label="Total Users"       value={kpis.totalUsers} />
        <KpiCard label="Providers"         value={kpis.totalProviders} />
        <KpiCard label="Default Users"     value={kpis.defaultUsers} />
        <KpiCard label="Pending Approval"  value={kpis.pendingUsers}    warn />
        <KpiCard label="Approved Users"    value={kpis.approvedUsers} />
        <KpiCard label="Total Listings"    value={kpis.totalListings} />
        <KpiCard label="Live Listings"     value={kpis.approvedListings} />
        <KpiCard label="Pending Listings"  value={kpis.pendingListings}  warn />
        <KpiCard label="Listing Images"    value={kpis.totalImages} />
      </div>
      <div className="col-grid-2">
        <div className="chart-card">
          <div className="chart-title">Registrations — Last 30 Days</div>
          <canvas id="regChart" height="200"></canvas>
        </div>
        <div className="chart-card">
          <div className="chart-title">Listings Created — Last 30 Days</div>
          <canvas id="listingChart" height="200"></canvas>
        </div>
      </div>
      <div className="col-grid-2">
        <div className="chart-card">
          <div className="chart-title">User Types</div>
          <canvas id="userTypeChart" height="200"></canvas>
        </div>
        <div className="chart-card">
          <div className="chart-title">Listing Status</div>
          <canvas id="listingStatusChart" height="200"></canvas>
        </div>
      </div>
      <div className="table-card">
        <div className="table-head"><div className="table-head-title">Recent Registrations</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>State</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {data.recentUsers.slice(0, 10).map((u: any) => (
                <tr key={u.id}>
                  <td>{u.first_name} {u.last_name}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{u.email}</td>
                  <td><span className={`badge ${u.account_type === 'provider' ? 'badge-blue' : 'badge-gray'}`}>{u.account_type}</span></td>
                  <td>{u.state || '—'}</td>
                  <td><StatusBadge status={u.account_status} /></td>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(u.created_at)}</td>
                </tr>
              ))}
              {data.recentUsers.length === 0 && <tr><td colSpan={6} className="empty">No users yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Providers({ data }: { data: DashData }) {
  return (
    <div className="table-card">
      <div className="table-head">
        <div className="table-head-title">All Providers ({data.providersWithListings.length})</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Listings</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            {data.providersWithListings.map((u: any) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td style={{ color: '#6b7280', fontSize: 12 }}>{u.email}</td>
                <td>{u.state || '—'}</td>
                <td><span style={{ fontWeight: 700 }}>{u.listing_count}</span></td>
                <td><StatusBadge status={u.account_status} /></td>
                <td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(u.created_at)}</td>
              </tr>
            ))}
            {data.providersWithListings.length === 0 && (
              <tr><td colSpan={6} className="empty">No providers registered yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Listings({ data }: { data: DashData }) {
  return (
    <div className="table-card">
      <div className="table-head">
        <div className="table-head-title">Recent Listings ({data.recentListings.length})</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Provider</th><th>Category</th><th>City</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {data.recentListings.map((l: any) => (
              <tr key={l.id}>
                <td style={{ fontWeight: 500 }}>{l.title}</td>
                <td style={{ color: '#6b7280', fontSize: 12 }}>{l.provider_name}</td>
                <td>{l.category || '—'}</td>
                <td>{l.city || l.region || '—'}</td>
                <td><StatusBadge status={l.status} /></td>
                <td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(l.created_at)}</td>
              </tr>
            ))}
            {data.recentListings.length === 0 && <tr><td colSpan={6} className="empty">No listings yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pending({ data }: { data: DashData }) {
  return (
    <>
      <div className="table-card">
        <div className="table-head">
          <div className="table-head-title">
            Pending Provider Accounts
            {data.pendingProviders.length > 0 && (
              <span className="badge badge-amber" style={{ marginLeft: 10 }}>{data.pendingProviders.length}</span>
            )}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>State</th><th>Registered</th></tr></thead>
            <tbody>
              {data.pendingProviders.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.first_name} {u.last_name}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{u.email}</td>
                  <td>{u.state || '—'}</td>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(u.created_at)}</td>
                </tr>
              ))}
              {data.pendingProviders.length === 0 && (
                <tr><td colSpan={4} className="empty" style={{ color: '#16a34a' }}>✓ No pending accounts</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="table-card">
        <div className="table-head">
          <div className="table-head-title">
            Pending Listings
            {data.pendingListingsDetail.length > 0 && (
              <span className="badge badge-amber" style={{ marginLeft: 10 }}>{data.pendingListingsDetail.length}</span>
            )}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Provider</th><th>Category</th><th>City</th><th>Submitted</th></tr></thead>
            <tbody>
              {data.pendingListingsDetail.map((l: any) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.title}</td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{l.provider_name}</td>
                  <td>{l.category || '—'}</td>
                  <td>{l.city || l.region || '—'}</td>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>{fmtDate(l.created_at)}</td>
                </tr>
              ))}
              {data.pendingListingsDetail.length === 0 && (
                <tr><td colSpan={5} className="empty" style={{ color: '#16a34a' }}>✓ No pending listings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Locations({ data }: { data: DashData }) {
  const max = data.usersByState[0]?.n || 1;
  return (
    <div className="chart-card">
      <div className="chart-title" style={{ marginBottom: 20 }}>Providers by State</div>
      {data.usersByState.length === 0
        ? <p className="empty">No state data yet — providers need to fill in their state on registration</p>
        : data.usersByState.map(s => (
          <div className="stat-row" key={s.state}>
            <div style={{ width: 120, flexShrink: 0, fontSize: 13, fontWeight: 500 }}>{s.state}</div>
            <div style={{ flex: 1 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(s.n / max) * 100}%` }} />
              </div>
            </div>
            <div className="stat-val">{s.n}</div>
          </div>
        ))
      }
    </div>
  );
}

function Categories({ data }: { data: DashData }) {
  const max = data.listingsByCategory[0]?.n || 1;
  return (
    <>
      <div className="chart-card">
        <div className="chart-title">Listings by Category</div>
        <canvas id="catChart" height="220"></canvas>
      </div>
      <div className="chart-card" style={{ marginTop: 0 }}>
        <div className="chart-title" style={{ marginBottom: 18 }}>Category Breakdown</div>
        {data.listingsByCategory.length === 0
          ? <p className="empty">No listings with categories yet</p>
          : data.listingsByCategory.map(c => (
            <div className="stat-row" key={c.category}>
              <div style={{ width: 180, flexShrink: 0, fontSize: 13 }}>{c.category}</div>
              <div style={{ flex: 1 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(c.n / max) * 100}%` }} />
                </div>
              </div>
              <div className="stat-val">{c.n}</div>
            </div>
          ))
        }
      </div>
    </>
  );
}

function KpiCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={warn && value > 0 ? { color: '#d97706' } : {}}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: 'badge-green', pending: 'badge-amber', pending_review: 'badge-amber',
    rejected: 'badge-red',
  };
  return (
    <span className={`badge ${map[status] || 'badge-gray'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function fmtDate(s: string) {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return s; }
}

function bootCharts(data: DashData) {
  const C = (window as any).Chart;
  if (!C) return;

  const COLORS = ['#1a5fb4','#26a269','#e66100','#a51d2d','#613583','#1c71d8','#2ec27e','#c64600','#e5a50a','#3584e4'];
  function alpha(c: string, a: number) {
    const r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  const today = new Date();
  const days30: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    days30.push(d.toISOString().slice(0, 10));
  }
  function toDayMap(arr: { day: string; n: number }[]) {
    const m: Record<string, number> = {};
    arr.forEach(r => { m[r.day] = r.n; });
    return days30.map(d => m[d] || 0);
  }
  const labels30 = days30.map(d => { const p = d.split('-'); return `${parseInt(p[1])}/${parseInt(p[2])}`; });

  const baseOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#111827', boxWidth: 12, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280', maxTicksLimit: 8 } },
      y: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' }, beginAtZero: true },
    },
  };

  function mkLine(id: string, label: string, values: number[], color: string) {
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    if (!el) return;
    if ((el as any)._chart) (el as any)._chart.destroy();
    const chart = new C(el, {
      type: 'line',
      data: { labels: labels30, datasets: [{ label, data: values, borderColor: color, backgroundColor: alpha(color, .1), fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }] },
      options: baseOpts,
    });
    (el as any)._chart = chart;
  }
  mkLine('regChart', 'Registrations', toDayMap(data.regByDay), COLORS[0]);
  mkLine('listingChart', 'Listings Created', toDayMap(data.listingsByDay), COLORS[1]);

  function mkDoughnut(id: string, labels: string[], values: number[]) {
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    if (!el) return;
    if ((el as any)._chart) (el as any)._chart.destroy();
    const chart = new C(el, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: COLORS, borderWidth: 0 }] },
      options: { responsive: true, cutout: '60%', plugins: { legend: { labels: { color: '#111827', boxWidth: 12, font: { size: 11 } } } } },
    });
    (el as any)._chart = chart;
  }
  const { kpis } = data;
  mkDoughnut('userTypeChart', ['Providers', 'Default Users'], [kpis.totalProviders, kpis.defaultUsers]);
  mkDoughnut('listingStatusChart', ['Approved', 'Pending Review'], [kpis.approvedListings, kpis.pendingListings]);

  const catEl = document.getElementById('catChart') as HTMLCanvasElement | null;
  if (catEl && data.listingsByCategory.length > 0) {
    if ((catEl as any)._chart) (catEl as any)._chart.destroy();
    const chart = new C(catEl, {
      type: 'bar',
      data: {
        labels: data.listingsByCategory.map(c => c.category),
        datasets: [{ label: 'Listings', data: data.listingsByCategory.map(c => c.n), backgroundColor: data.listingsByCategory.map((_, i) => COLORS[i % COLORS.length]) }],
      },
      options: { ...baseOpts, plugins: { legend: { display: false } } },
    });
    (catEl as any)._chart = chart;
  }
}

const CSS = `
:root{--bg:#f8f9fb;--surface:#fff;--border:#e5e7eb;--sidebar:#0f1b2d;--sidebar-fg:#cbd5e1;--fg:#111827;--fg-2:#6b7280;--fg-3:#9ca3af;--accent:#1a5fb4}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
#db-shell{display:flex;height:100vh;font-family:'Inter',system-ui,sans-serif;font-size:14px;background:var(--bg);color:var(--fg);overflow:hidden}
#db-sidebar{width:220px;flex-shrink:0;background:var(--sidebar);display:flex;flex-direction:column;overflow-y:auto}
#db-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
#db-topbar{background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;padding:10px 24px;height:56px;flex-shrink:0}
#db-content{flex:1;overflow-y:auto;padding:24px}
.sb-logo{padding:16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,.06)}
.sb-logo-icon{width:32px;height:32px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0}
.sb-logo-text{font-size:13px;font-weight:600;color:#fff}
.sb-logo-sub{font-size:10px;color:var(--sidebar-fg)}
.sb-nav{list-style:none;padding:8px;flex:1}
.sb-nav li{margin:1px 0}
.sb-nav a{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;text-decoration:none;color:var(--sidebar-fg);font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s;user-select:none}
.sb-nav a:hover{background:rgba(255,255,255,.06);color:#fff}
.sb-nav a.active{background:#1e3a5f;color:#fff}
.icon{width:16px;text-align:center}
.topbar-title{font-size:15px;font-weight:600}
.logout-btn{width:100%;padding:8px;border-radius:7px;font-size:13px;font-weight:500;border:1px solid rgba(255,255,255,.12);background:transparent;color:#f87171;cursor:pointer}
.logout-btn:hover{background:rgba(248,113,113,.1)}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px;margin-bottom:24px}
.kpi-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.kpi-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--fg-2);margin-bottom:8px}
.kpi-value{font-size:28px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1}
.chart-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.07);margin-bottom:20px}
.chart-title{font-size:14px;font-weight:600;margin-bottom:16px}
.col-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:4px}
.table-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.07);margin-bottom:20px;overflow:hidden}
.table-head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--border)}
.table-head-title{font-size:13px;font-weight:600;display:flex;align-items:center}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse}
th{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--fg-2);padding:10px 16px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:10px 16px;font-size:12.5px;border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--bg)}
.empty{text-align:center;color:#9ca3af;padding:32px!important}
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.badge-green{background:#f0fdf4;color:#16a34a}
.badge-red{background:#fef2f2;color:#dc2626}
.badge-amber{background:#fffbeb;color:#d97706}
.badge-blue{background:#eff6ff;color:#1a5fb4}
.badge-gray{background:var(--bg);color:var(--fg-2);border:1px solid var(--border)}
.stat-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border)}
.stat-row:last-child{border-bottom:none}
.stat-val{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;min-width:40px;text-align:right}
.progress-bar{height:6px;background:var(--bg);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px;background:var(--accent);transition:width .4s}
@media(max-width:768px){.col-grid-2{grid-template-columns:1fr}#db-sidebar{width:180px}}
`;
