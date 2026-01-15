import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-transparent pt-16 pb-8 overflow-hidden">
       {/* Top Border with gradient fade */}
       <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand Column - Simplified */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                <Link href='/' className='flex items-center gap-3 group opacity-90 hover:opacity-100 transition-opacity'>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-sans font-bold text-sm shadow-sm">
                        E
                    </div>
                    <span className='font-sans font-bold tracking-tight text-lg text-foreground/90'>EKA BALANCE</span>
                </Link>
                <p className="text-muted-foreground max-w-sm text-base font-normal leading-relaxed">
                    Restoring balance through structural integration. 
                    <span className="block mt-1 opacity-70">Designed for your well-being.</span>
                </p>
            </div>

            {/* Links Column 1 - Clean typography */}
            <div className="space-y-4">
                <h4 className="font-sans font-medium text-foreground text-sm tracking-wide opacity-80">Platform</h4>
                <ul className="space-y-2.5">
                    {['Services', 'About', 'Journal', 'Pricing'].map((link) => (
                        <li key={link}>
                            <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

             {/* Links Column 2 */}
            <div className="space-y-4">
                <h4 className="font-sans font-medium text-foreground text-sm tracking-wide opacity-80">Legal</h4>
                <ul className="space-y-2.5">
                    {['Privacy', 'Terms', 'Cookies'].map((link) => (
                        <li key={link}>
                            <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="pt-6 border-t border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-xs font-medium">
                © {currentYear} Eka Balance Inc.
            </p>
            
            <div className="flex items-center gap-4 text-slate-400 text-xs">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-black/[0.02]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span>All Systems Operational</span>
                 </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
