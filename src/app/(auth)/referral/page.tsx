import { redirect } from 'next/navigation';

interface ReferralPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function ReferralPage({ searchParams }: ReferralPageProps) {
  const params = await searchParams;
  const ref = params.ref;

  if (ref) {
    redirect(`/signup?ref=${ref}`);
  }

  redirect('/signup');
}
