'use client';

import { Button, LazyImage } from '@ekaacc/shared-ui';
import Link from 'next/link';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { useBooking } from '@/react-app/hooks/useBooking';
import { ServiceItem } from '@/shared/types';

interface ServiceCardProps {
 service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
 const { t } = useLanguage();
 const { navigateToBooking } = useBooking();

 return (
  <div className="group relative bg-white/60 backdrop-blur-md rounded-4xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-white/40 hover:border-primary/20">
    <div className="relative h-56 sm:h-64 overflow-hidden rounded-2xl m-2 mb-0">
     <div className="absolute inset-0 bg-primary/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
     <LazyImage
      src={service.image}
      alt={t(service.titleKey)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
     />
    </div>
   
   <div className="p-8 flex flex-col grow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-2xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
      {t(service.titleKey)}
      </h3>
    </div>

    {/* Helper text/subtitle in primary/medium */}
     <p className="text-sm font-medium mb-4 text-primary bg-primary/5 inline-block px-3 py-1 rounded-full w-fit">
     {t(service.subtitleKey)}
    </p>
    
    <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3 font-light">
     {t(service.descriptionKey)}
    </p>

    {/* Benefits List */}
    {service.benefitsKeys && service.benefitsKeys.length > 0 && (
     <div className="mb-6 bg-white/40 rounded-2xl p-4 border border-white/20">
      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
       {t('services.mainBenefits') || 'Key Benefits'}
      </h4>
      <ul className="space-y-2">
       {service.benefitsKeys.slice(0, 4).map((key, i) => (
        <li key={i} className="flex items-start text-sm text-muted-foreground/90">
         <span className="text-primary mr-2 opacity-60">•</span>
         {t(key)}
        </li>
       ))}
      </ul>
     </div>
    )}

    <div className="mt-auto flex flex-col gap-3 pt-2">
      <Button 
        onClick={() => navigateToBooking(service.slug || service.id)}
        className="w-full bg-primary hover:bg-primary/90 text-white text-base py-6 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg hover:scale-[1.02] border-none"
       >
       {t('nav.bookNow')}
      </Button>
       <Link href={service.href} className="w-full">
      <Button 
        variant="outline"
        className="w-full bg-transparent hover:bg-white/50 text-foreground/70 border-foreground/10 text-base py-6 rounded-2xl transition-all backdrop-blur-sm"
        >
        {t('common.readMore') || 'Details'}
      </Button>
     </Link>
    </div>
   </div>
  </div>
 );
}
