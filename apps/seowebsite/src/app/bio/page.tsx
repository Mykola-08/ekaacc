import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bio | EKA',
  description: 'Learn more about Elena and her journey.',
};

export default function BioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Bio</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700">
          Elena is a dedicated professional...
        </p>
        {/* Add full bio content here */}
      </div>
    </div>
  );
}
