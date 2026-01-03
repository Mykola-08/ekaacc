import { Service } from '@/types/database';
import { Timer, Check } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'highlight';
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  const isHighlight = variant === 'highlight';
  
  // Parse description into bullet points if possible, otherwise just show description
  const features = service.description 
    ? service.description.split('\n').filter(line => line.trim().length > 0)
    : [];

  return (
    <div className={`flex flex-1 flex-col gap-6 rounded-3xl border p-10 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group ${
      isHighlight 
        ? 'border-2 border-primary/30 bg-surface-highlight shadow-[0_0_40px_-10px_rgba(230,210,196,0.1)]' 
        : 'border-border-subtle bg-surface hover:border-primary/40'
    }`}>
      <div className={`absolute -right-10 -top-10 opacity-[0.03] ${!isHighlight && 'group-hover:opacity-[0.07] transition-opacity duration-700'}`}>
        <Timer className="w-60 h-60" />
      </div>
      
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-2xl font-serif">{service.name}</h3>
          {isHighlight && (
            <span className="text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary px-4 py-1.5">
              Recommended
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 text-primary">
          <span className="text-4xl font-light tracking-tight">€{service.price}</span>
          <span className="text-slate-500 text-lg font-medium">/ {service.duration} Minutes</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10 flex-1 my-4">
        {features.length > 0 ? (
          features.map((item, i) => (
            <div key={i} className="text-sm font-medium flex gap-4 text-slate-300 items-center">
              <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${isHighlight ? 'bg-primary' : 'bg-primary/20'}`}>
                <Check className={`w-3.5 h-3.5 ${isHighlight ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              {item}
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm leading-relaxed">
            {service.description || "Experience a professional session tailored to your needs."}
          </p>
        )}
      </div>

      <Link 
        href={`/book/${service.id}`}
        className={`relative z-10 flex w-full cursor-pointer items-center justify-center rounded-full h-14 px-6 text-sm font-bold tracking-wide transition-all duration-300 ${
          isHighlight
            ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20'
            : 'bg-surface-highlight border border-border-subtle text-white hover:bg-primary hover:text-primary-foreground hover:border-primary'
        }`}
      >
        {isHighlight ? (
          <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Book Now</span>
        ) : (
          "Select Session"
        )}
      </Link>
    </div>
  );
}
