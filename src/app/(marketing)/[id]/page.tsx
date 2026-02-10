import { Metadata } from 'next';
import TechniqueDetailContent from '@/components/marketing/TechniqueDetailContent';

const techniqueMap: Record<string, string> = {
  myofascial: 'Detailed technique description',
  kinesio: 'Kinesiology and movement',
  reflexology: 'Reflexology points',
  lymphatic: 'Lymphatic drainage',
  craniosacral: 'Craniosacral therapy',
  acupressure: 'Acupressure points',
};

export async function generateStaticParams() {
  return Object.keys(techniqueMap).map((id) => ({
    id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Note: True localization for metadata requires server-side translation logic or mapped static strings.
  // For now using a generic title format.
  return {
    title: `Technique: ${id.charAt(0).toUpperCase() + id.slice(1)} | EKA Balance`,
    description: `Learn more about our ${id} technique and its benefits.`,
  };
}

export default async function TechniquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TechniqueDetailContent id={id} />;
}
