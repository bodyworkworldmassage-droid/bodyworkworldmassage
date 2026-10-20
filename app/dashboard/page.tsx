import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';
import LoginGate from './LoginGate';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('dashboard_auth');
  const isAuthed = auth?.value === 'true';

  if (!isAuthed) return <LoginGate />;
  return <DashboardClient />;
}
