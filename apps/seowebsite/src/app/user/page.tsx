import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile | EKA',
  description: 'Manage your EKA profile and preferences.',
};

export default function UserPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">User Profile</h1>
      <p className="text-lg text-gray-700">
        Welcome to your user dashboard. Manage your settings and view your history here.
      </p>
      {/* Add user dashboard components here */}
    </div>
  );
}
