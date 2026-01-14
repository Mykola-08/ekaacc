import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-border py-12 md:py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-6">
                <Link href='/' className='flex items-center gap-2 group'>
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-sm">E</div>
                    <span className='font-serif font-bold tracking-tight text-xl text-slate-900'>EKA BALANCE</span>
                </Link>
                <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
                    Restoring balance through structural integration and therapeutic massage. 
                    A holistic approach to well-being in the heart of the city.
                </p>
                <div className="flex gap-4">
                    {/* Social Placeholders */}
                    {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                        <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300">
                             <span className="sr-only">{social}</span>
                             <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Links Column 1 */}
            <div className="space-y-6">
                <h4 className="font-serif font-bold text-slate-900">Platform</h4>
                <ul className="space-y-3">
                    {['Services', 'About', 'Journal', 'Pricing', 'Gift Cards'].map((link) => (
                        <li key={link}>
                            <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-slate-500 hover:text-slate-900 transition-colors">
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

             {/* Links Column 2 */}
            <div className="space-y-6">
                <h4 className="font-serif font-bold text-slate-900">Legal</h4>
                <ul className="space-y-3">
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                        <li key={link}>
                            <Link href="/legal" className="text-slate-500 hover:text-slate-900 transition-colors">
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm font-medium">
                © {currentYear} EKA Balance. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
                 <Link href="/privacy" className="text-sm text-slate-400 hover:text-slate-600">Privacy</Link>
                 <Link href="/terms" className="text-sm text-slate-400 hover:text-slate-600">Terms</Link>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-slate-500 font-medium">Systems Operational</span>
                 </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
