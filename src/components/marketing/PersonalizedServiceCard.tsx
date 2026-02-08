'use client';

import Link from 'next/link';
import { Button } from 'keep-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { PersonalizedServiceItem } from '@/shared/marketing/types';
import LazyImage from '@/components/marketing/LazyImage';
import { Clock } from 'lucide-react';

interface PersonalizedServiceCardProps {
  service: PersonalizedServiceItem;
}

export default function PersonalizedServiceCard({ service }: PersonalizedServiceCardProps) {
  const { t } = useLanguage();

  return (
    <div className="card card-interactive h-full flex flex-col">
       <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <LazyImage
            src={service.image}
            alt={t(service.titleKey)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="heading-3 mb-3">
          {t(service.titleKey)}
        </h3>
        
        <p className="text-body text-sm mb-6">
          {t(service.descriptionKey)}
        </p>

        {/* Bullet Points */}
        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <ul className="space-y-3 mb-8">
            {service.benefitsKeys.map((key, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-accent mt-1.5 mr-3 flex-shrink-0" />
                {t(key)}
              </li>
            ))}
          </ul>
        )}

        {/* Expected Result Box */}
        {service.resultKey && (
             <div className="bg-accent-light/30 rounded-xl p-4 mb-6 border border-accent/20">
                <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold text-accent-dark uppercase tracking-wide opacity-80">
                         {t('common.expectedResult') || 'Expected Result:'}
                     </span>
                     <p className="text-sm font-medium text-gray-900">
                         {t(service.resultKey)}
                     </p>
                </div>
            </div>
        )}
        
        {/* Price and Duration Row */}
         <div className="flex items-center justify-between mb-8 mt-auto text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{service.duration || '1 h'}</span>
            </div>
             <span className="text-xl font-medium text-gray-900">
                {service.price ? `${service.price} EUR` : 'Ask price'}
            </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link href="/booking" className="flex-1">
             <Button 
                className="w-full btn btn-accent py-3 rounded-xl shadow-md border-none normal-case"
             >
               {t('nav.bookNow')}
            </Button>
          </Link>
          <Link href={service.href} className="flex-1">
             <Button 
                variant="outline"
                className="w-full btn btn-outline py-3 rounded-xl normal-case"
                >
               {t('common.readMore') || 'Read More'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}




