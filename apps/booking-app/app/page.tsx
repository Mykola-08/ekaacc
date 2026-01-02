import { 
  MapPin, 
  Flower, 
  BadgeCheck, 
  Leaf, 
  UserCheck, 
} from "lucide-react";
import Link from "next/link";
import { listServices } from '@/server/booking/service';
import { Service } from '@/types/database';
import { ServiceCard } from '@/components/booking/ServiceCard';

export const revalidate = 0;

async function getServices() {
  const { data, error } = await listServices();

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return (data || []) as Service[];
}

export default async function Home() {
  const services = await getServices();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-slate-200 overflow-x-hidden font-display">
      {/* Header */}
      <div className="layout-container flex w-full flex-col z-50">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-subtle bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-12 sticky top-0">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 flex items-center justify-center text-primary rounded-full bg-surface-highlight border border-border-subtle">
              <Flower className="w-6 h-6" />
            </div>
            <h2 className="text-primary text-xl font-serif italic font-medium tracking-wide">Elena V. Therapy</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Home</Link>
              <Link className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">About</Link>
              <Link className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#booking">Services</Link>
              <Link className="text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Contact</Link>
            </div>
            <Link href="#booking" className="flex min-w-25 cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-primary text-primary-foreground text-sm font-bold tracking-wide hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(230,210,196,0.15)] hover:shadow-[0_0_25px_rgba(230,210,196,0.25)]">
              <span className="truncate">Book Now</span>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col">
        <div className="px-4 py-8 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-270 flex-1">
            <div className="@container">
              <div className="flex flex-col gap-8 px-4 py-8 md:flex-row items-center">
                <div className="w-full md:w-1/2 relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-[2.2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded-[2rem] relative overflow-hidden shadow-2xl" 
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqUMARY1cw4kAX2MDn8RGRAcCVE6GZ6LjjOrbAlMr32Qu4wPo1iWgu5Ep8s5CGzDEdr2tV-LHkDFFc-IsPhd_RExrHPcJOjTAbtYTOOwJYlOzIo1y_gzJIzWbKQKWmWY3Ic5tZyE6QA2s1ssuIO4C6KDNFsSVOkmgrhjoaKxarEME8Uv2xaEBKMg23kykVEaiyLAA2XF14IVipbvaUGnilDepWQsbkkq0_-hN8HQ3727dGzauuzv1Ho6bV6IYRYnrv-xTtKZjS9g")' }}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:w-1/2 md:pl-10">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-2 text-primary/90 mb-2 px-3 py-1 rounded-full bg-surface-highlight w-fit border border-border-subtle">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Passeig de Gràcia, BCN</span>
                    </div>
                    <h1 className="text-slate-100 text-5xl font-serif font-normal leading-[1.1] tracking-tight">
                      Restoring balance through <span className="text-primary italic">structural integration</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
                      Experience a high-end integrative massage in the heart of Barcelona. My approach combines deep tissue precision with nervous system regulation.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#booking" className="flex min-w-35 cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary text-primary-foreground text-base font-bold tracking-wide hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-[0_4px_20px_-5px_rgba(230,210,196,0.3)]">
                      <span className="truncate">Book Session</span>
                    </Link>
                    <button className="flex min-w-35 cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-surface-highlight border border-border-subtle text-slate-200 text-base font-medium hover:bg-surface hover:text-white transition-all">
                      <span className="truncate">Learn More</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="flex flex-col relative overflow-hidden py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center relative z-10">
          <div className="layout-content-container flex flex-col max-w-270 flex-1">
            <div className="flex flex-col gap-16 px-4">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-white text-4xl font-serif italic max-w-180">
                  My Philosophy
                </h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-150">
                  True healing happens when structure and relaxation meet. Every session is designed to not only relieve pain but to realign your body's natural posture.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="flex flex-1 gap-6 rounded-3xl border border-border-subtle bg-surface/50 backdrop-blur-sm p-8 flex-col hover:border-primary/30 hover:bg-surface-highlight transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-surface-highlight border border-border-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                    <BadgeCheck className="w-7 h-7 font-light" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-slate-100 text-xl font-serif">Certified Therapist</h3>
                    <p className="text-slate-400 text-sm font-normal leading-relaxed">Over 10 years of experience in structural integration and osteopathic techniques.</p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex flex-1 gap-6 rounded-3xl border border-border-subtle bg-surface/50 backdrop-blur-sm p-8 flex-col hover:border-primary/30 hover:bg-surface-highlight transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-surface-highlight border border-border-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                    <Leaf className="w-7 h-7 font-light" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-slate-100 text-xl font-serif">Holistic Approach</h3>
                    <p className="text-slate-400 text-sm font-normal leading-relaxed">Addressing the root cause of tension, not just the symptoms.</p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="flex flex-1 gap-6 rounded-3xl border border-border-subtle bg-surface/50 backdrop-blur-sm p-8 flex-col hover:border-primary/30 hover:bg-surface-highlight transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-surface-highlight border border-border-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                    <UserCheck className="w-7 h-7 font-light" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-slate-100 text-xl font-serif">Tailored Sessions</h3>
                    <p className="text-slate-400 text-sm font-normal leading-relaxed">No two bodies are the same. Each treatment is customized to your needs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col py-10" id="booking">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-270 flex-1">
            <h2 className="text-slate-100 text-3xl font-serif italic px-4 pb-10 pt-4 text-center">Select Your Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    variant={index % 2 === 1 ? 'highlight' : 'default'} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center text-slate-400 py-10">
                  No services available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
