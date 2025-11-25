import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} EKA Account. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
           <Link href="http://localhost:9006/privacy" className="hover:underline">Privacy Policy</Link>
           <Link href="http://localhost:9006/terms" className="hover:underline">Terms of Service</Link>
           <Link href="http://localhost:9006/privacy#ccpa" className="hover:underline">Do Not Sell or Share My Personal Information</Link>
        </div>
      </div>
    </footer>
  );
}
