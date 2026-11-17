import { requireAuth } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardRootPage() {
  const user = await requireAuth();
  redirect(`/dashboard/${user.role.toLowerCase()}`);
}
