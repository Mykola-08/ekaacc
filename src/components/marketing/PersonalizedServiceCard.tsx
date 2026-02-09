'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { PersonalizedServiceItem } from '@/shared/marketing/types';
import { LazyImage } from '@/components/ui/lazy-image';
import { Clock } from 'lucide-react';

interface PersonalizedServiceCardProps {
  service: PersonalizedServiceItem;
}

export default function PersonalizedServiceCard({ service }: PersonalizedServiceCardProps) {
  const { t } = useLanguage();

  return (
    <div className="card card-interactive flex h-full flex-col">
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <LazyImage
          src={service.image}
          alt={t(service.titleKey)}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="flex flex-grow flex-col p-8">
        <h3 className="heading-3 mb-3">{t(service.titleKey)}</h3>

        <p className="text-body mb-6 text-sm">{t(service.descriptionKey)}</p>

        {/* Bullet Points */}
        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <ul className="mb-8 space-y-3">
            {service.benefitsKeys.map((key, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700">
                <span className="bg-accent mt-1.5 mr-3 h-2 w-2 flex-shrink-0 rounded-full" />
                {t(key)}
              </li>
            ))}
          </ul>
        )}

        {/* Expected Result Box */}
        {service.resultKey && (
          <div className="bg-accent-light/30 border-accent/20 mb-6 rounded-xl border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-accent-dark text-xs font-bold tracking-wide uppercase opacity-80">
                {t('common.expectedResult') || 'Expected Result:'}
              </span>
              <p className="text-sm font-medium text-gray-900">{t(service.resultKey)}</p>
            </div>
          </div>
        )}

        {/* Price and Duration Row */}
        <div className="mt-auto mb-8 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{service.duration || '1 h'}</span>
          </div>
          <span className="text-xl font-medium text-gray-900">
            {service.price ? `${service.price} EUR` : 'Ask price'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link href="/book" className="flex-1">
            <Button className="btn btn-accent w-full rounded-xl border-none py-3 normal-case shadow-md">
              {t('nav.bookNow')}
            </Button>
          </Link>
          <Link href={service.href} className="flex-1">
            <Button
              variant="outline"
              className="btn btn-outline w-full rounded-xl py-3 normal-case"
            >
              {t('common.readMore') || 'Read More'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
