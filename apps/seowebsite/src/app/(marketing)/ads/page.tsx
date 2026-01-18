import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Offers & Ads | EKA',
  description: 'Check out our latest promotions and advertisements.',
};

export default function AdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Promotions & Ads</h1>
      <p className="text-lg text-gray-700">
        Discover our latest campaigns and special offers.
      </p>
      {/* Add ads/promotions content here */}
    </div>
  );
}
