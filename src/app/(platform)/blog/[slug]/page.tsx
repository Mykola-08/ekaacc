import Link from 'next/link';

export default function BlogPost() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Article Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The article you are looking for does not exist or has been moved.
      </p>
      <Link href="/blog" className="text-primary hover:underline">
        Back to Blog
      </Link>
    </div>
  );
}
