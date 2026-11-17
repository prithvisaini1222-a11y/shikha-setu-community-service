import { redirect } from 'next/navigation';

export default async function DonateDetailPage({
  params,
}: {
  params: Promise<{ needId: string }>;
}) {
  const { needId } = await params;
  redirect(`/needs/${needId}`);
}
