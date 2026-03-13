import Link from 'next/link';
import { Button } from '@/marketing/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-eka-dark mb-4 text-4xl font-bold">404 - Page Not Found</h2>
      <p className="mb-8 max-w-md text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg" variant="default">
          Go back home
        </Button>
      </Link>
    </div>
  );
}
