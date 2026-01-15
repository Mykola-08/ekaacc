import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white/30 backdrop-blur-2xl border-t border-white/20 pt-16 pb-8 overflow-hidden">
      {/* Soft Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-50 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand Column - Simplified */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                <Link href='/' className='flex items-center gap-3 group opacity-90 hover:opacity-100 transition-opacity'>
                    <div className="w-8 h-8 bg-zinc-900/5 rounded-2xl flex items-center justify-center text-zinc-900 font-sans font-medium text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-sm">
                        E
                    </div>
                    <span className='font-sans font-semibold tracking-tight text-lg text-zinc-800/90'>EKA BALANCE</span>
                </Link>
                <p className="text-muted-foreground max-w-sm text-base font-normal leading-relaxed">
                    Restoring balance through structural integration. 
                    <span className="block mt-1 opacity-70">Designed for your well-being.</span>
                </p>
            </div>

            {/* Links Column 1 - Clean typography */}
            <div className="space-y-4">
                <h4 className="font-sans font-medium text-zinc-900 text-sm tracking-wide opacity-80">Platform</h4>
                <ul className="space-y-2.5">
                    {['Services', 'About', 'Journal', 'Pricing'].map((link) => (
                        <li key={link}>
                            <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-zinc-900 transition-colors">
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

             {/* Links Column 2 */}
            <div className="space-y-4">
                <h4 className="font-sans font-medium text-zinc-900 text-sm tracking-wide opacity-80">Legal</h4>
                <ul className="space-y-2.5">
                    {['Privacy', 'Terms', 'Cookies'].map((link) => (
                        <li key={link}>
                            <Link href="/legal" className="text-sm text-muted-foreground hover:text-zinc-900 transition-colors">
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
