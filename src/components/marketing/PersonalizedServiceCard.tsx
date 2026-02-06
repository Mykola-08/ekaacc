'use client';

import Link from 'next/link';
import { Button, LazyImage } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { Clock } from 'lucide-react';
import { BOOKING_APP_URL } from '@/lib/constants';

interface PersonalizedServiceItem {
 image: string;
 titleKey: string;
 descriptionKey: string;
 benefitsKeys?: string[];
 resultKey?: string;
 duration?: string;
 price?: number;
 href: string;
}

interface PersonalizedServiceCardProps {
 service: PersonalizedServiceItem;
}

export default function PersonalizedServiceCard({ service }: PersonalizedServiceCardProps) {
 const { t } = useLanguage();

 return (
  <div className="bg-card rounded-4xl shadow-sm border-none overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
    <div className="relative h-64 overflow-hidden rounded-t-3xl">
     <LazyImage
      src={service.image}
      alt={t(service.titleKey)}
      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
     />
    </div>
    
   <div className="p-8 flex flex-col grow">
    <h3 className="text-2xl font-bold text-foreground mb-3">
     {t(service.titleKey)}
    </h3>
    
    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
     {t(service.descriptionKey)}
    </p>

    {/* Bullet Points */}
    {service.benefitsKeys && service.benefitsKeys.length > 0 && (
     <ul className="space-y-3 mb-8">
      {service.benefitsKeys.map((key, i) => (
       <li key={i} className="flex items-start text-sm text-foreground/90">
        <span className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 mr-3 shrink-0" />
        {t(key)}
       </li>
      ))}
     </ul>
    )}

    {/* Expected Result Box */}
    {service.resultKey && (
       <div className="bg-yellow-50 rounded-xl p-4 mb-6">
        <div className="flex flex-col gap-1">
           <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide opacity-80">
             {t('common.expectedResult') || 'Expected Result:'}
           </span>
           <p className="text-sm font-medium text-foreground">
             {t(service.resultKey)}
           </p>
        </div>
      </div>
    )}
    
    {/* Price and Duration Row */}
     <div className="flex items-center justify-between mb-8 mt-auto text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        <span>{service.duration || '1 h'}</span>
      </div>
       <span className="text-xl font-medium text-foreground">
        {service.price ? `${service.price} €` : 'Ask price'}
      </span>
    </div>

    {/* Buttons - Note order reversed from typical: Book first (Orange), Learn More second (Outline) */}
    <div className="flex gap-4">
     <Link href={BOOKING_APP_URL} className="flex-1">
       <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-colors border-none shadow-md hover:shadow-lg"
       >
        {t('nav.bookNow')}
      </Button>
     </Link>
     <Link href={service.href} className="flex-1">
       <Button 
        variant="outline"
        className="w-full bg-card hover:bg-muted/30 text-muted-foreground border border-border py-3 rounded-xl font-medium transition-colors"
        >
        {t('common.readMore') || 'Read More'}
      </Button>
     </Link>
    </div>
   </div>
  </div>
 );
}
