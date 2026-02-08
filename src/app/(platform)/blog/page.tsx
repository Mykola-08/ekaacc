import Link from 'next/link';

export const metadata = {
  title: 'Blog | EKA Account',
  description: 'Latest updates and articles from EKA.',
};

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>
      <div className="bg-muted/30 rounded-xl border p-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground mb-6">
          Our blog is currently undergoing maintenance. Please check back later.
        </p>
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
