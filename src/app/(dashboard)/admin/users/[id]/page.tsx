import { redirect } from 'next/navigation';

export default async function AdminUserRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/console/users/${id}`);
}
