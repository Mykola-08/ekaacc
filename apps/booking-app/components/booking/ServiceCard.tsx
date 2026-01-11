import { Service } from '@/types/database';
import { Timer, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'highlight';
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  const isHighlight = variant === 'highlight';
  
  // Parse description into bullet points if possible
  const features = service.description 
    ? service.description.split('\n').filter(line => line.trim().length > 0)
    : [];

  return (
    <div className={lex flex-col relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-300 group
      
    }>
      {/* Background Pattern */}
      <div className={bsolute top-0 right-0 p-12 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12}>
         <Timer className='w-48 h-48' />
      </div>

      <div className='relative z-10 flex flex-col h-full'>
        <div className='flex justify-between items-start mb-6'>
           <div className='space-y-1'>
              <h3 className={	ext-2xl font-serif font-bold tracking-tight }>{service.name}</h3>
              <p className={	ext-sm font-medium uppercase tracking-wider }>
                {service.duration} Minutes
              </p>
           </div>
           {isHighlight && (
            <span className='inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/10'>
              Popular
            </span>
           )}
        </div>

        <div className='mb-8'>
          <div className='flex items-baseline'>
             <span className='text-4xl font-light'>€{service.price}</span>
          </div>
        </div>

        <div className='flex-1 space-y-4 mb-8'>
          {features.map((item, i) => (
            <div key={i} className='flex items-start gap-3 text-sm'>
              <div className={mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full }>
                <Check className={h-3 w-3 } />
              </div>
              <span className={leading-tight }>
                {item}
              </span>
            </div>
          ))}
        </div>

        <Button 
          asChild 
          className={w-full rounded-2xl h-12 text-base font-medium shadow-none transition-transform active:scale-[0.98] 
            }
        >
          <Link href={/book/?service=}>
            Book Session
          </Link>
        </Button>
      </div>
    </div>
  );
}

