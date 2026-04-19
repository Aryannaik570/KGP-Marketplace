import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import FounderDashboardClient from './FounderDashboardClient';

export default async function FounderDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'FOUNDER') redirect('/login');

  const profile = await prisma.founderProfile.findUnique({
    where: { userId: session.userId },
    include: {
      technologies: true,
      startups: true
    }
  });

  const technologies = profile?.technologies || [];
  const startups = profile?.startups || [];

  return <FounderDashboardClient profile={profile} technologies={technologies} startups={startups} session={session} />;
}
