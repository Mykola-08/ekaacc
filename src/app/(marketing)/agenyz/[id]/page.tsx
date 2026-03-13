import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getLocalized } from '@/app/(marketing)/agenyz/products';
import AgenyzProductContent from './AgenyzProductContent';

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
  if (!product) return { title: 'Product Not Found | EKA Balance' };

  const name = getLocalized(product.name, 'en');
  const description = getLocalized(product.shortDescription || product.description, 'en');

  return {
    title: `${name} | Agenyz - EKA Balance`,
    description,
    openGraph: {
      title: name,
      description,
      type: 'website',
      ...(product.image ? { images: [{ url: product.image, alt: name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
  if (!product) return notFound();

  return <AgenyzProductContent id={id} />;
}
