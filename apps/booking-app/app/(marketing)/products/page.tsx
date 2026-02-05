import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | EKA',
  description: 'Explore our range of wellness products.',
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Products</h1>
      <p className="text-lg text-gray-700">
        Browse our curated selection of products designed to support your well-being.
      </p>
      {/* Add product grid/list here */}
    </div>
  );
}
