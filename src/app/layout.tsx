import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from '@/lib/auth/session';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShikshaSetu — Connect. Teach. Give. Empower.',
  description:
    'ShikshaSetu connects verified Child Care Institutions with volunteers, educators and donors to provide structured learning, teaching support and educational resources.',
  openGraph: {
    title: 'ShikshaSetu — Connect. Teach. Give. Empower.',
    description:
      'ShikshaSetu connects verified Child Care Institutions with volunteers, educators and donors to provide structured learning, teaching support and educational resources.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-[#F8F7F2] text-[#25352B] selection:bg-[#4F9D69] selection:text-white">
        <Navbar currentUser={currentUser} />
        <main className="flex-1 page-entrance">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
