import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { EkaLogo } from '@/components/eka/eka-logo';

const footerLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Help Center', href: '/help' },
  { name: 'Contact Us', href: '/contact' },
];

export function AppFooter() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <EkaLogo className="h-8 w-auto" />
            <span className="font-semibold text-lg">EKA Account</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EKA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
