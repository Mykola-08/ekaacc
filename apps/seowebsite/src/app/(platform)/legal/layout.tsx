import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
 title: "EKA Balance - Legal Center",
 description: "Legal documents, policies, and compliance information for EKA Balance",
 icons: {
  icon: '/favicon.ico',
 },
};

export default function LegalLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
    <div className="min-h-screen flex flex-col">
     <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
       <div className="flex items-center space-x-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
         EKA Balance <span className="text-muted-foreground font-normal">| Legal</span>
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-muted-foreground">
         <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
         <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
         <Link href="/legal/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
         <Link href="/legal/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
         <Link href="/legal/imprint" className="hover:text-foreground transition-colors">Imprint</Link>
        </nav>
       </div>
       <div className="flex items-center space-x-4">
        <a 
         href="https://app.ekabalance.com" 
         className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
         Back to Main Site
        </a>
       </div>
      </div>
     </header>
     
     <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12">
       {children}
      </div>
     </main>

     <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
         <h3 className="font-bold mb-4">EKA Balance</h3>
         <p className="text-sm text-gray-500">
          Empowering your journey to mental wellness through technology and professional care.
         </p>
        </div>
        <div>
         <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Legal</h4>
         <ul className="space-y-2 text-sm text-gray-600">
          <li><Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link></li>
          <li><Link href="/legal/terms" className="hover:underline">Terms of Service</Link></li>
          <li><Link href="/legal/cookies" className="hover:underline">Cookie Policy</Link></li>
          <li><Link href="/legal/disclaimer" className="hover:underline">Disclaimer</Link></li>
         </ul>
        </div>
        <div>
         <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Contact</h4>
         <ul className="space-y-2 text-sm text-gray-600">
          <li>legal@ekabalance.com</li>
          <li>dpo@ekabalance.com</li>
          <li>support@ekabalance.com</li>
         </ul>
        </div>
        <div>
         <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Updates</h4>
         <p className="text-sm text-gray-500">
          Legal documents last updated: <br/>
          <span className="font-medium text-gray-900">November 25, 2025</span>
         </p>
        </div>
       </div>
       <div className="border-t pt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} EKA Balance. All rights reserved.
       </div>
      </div>
     </footer>
    </div>
 );
}
