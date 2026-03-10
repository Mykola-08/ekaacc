import Link from 'next/link';
import { Button } from '@/marketing/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-bold text-eka-dark mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button size="xl" variant="default">
          Go back home
        </Button>
      </Link>
    </div>
  );
}
