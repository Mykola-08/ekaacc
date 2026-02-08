'use client';

import { Button } from 'keep-react';
import Link from 'next/link';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { ServiceItem } from '@/shared/marketing/types';
import LazyImage from '@/components/marketing/LazyImage';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLanguage();
  const colorStyles: Record<string, { text: string; dot: string }> = {
    blue: { text: 'text-blue-600', dot: 'bg-blue-500' },
    purple: { text: 'text-purple-600', dot: 'bg-purple-500' },
    green: { text: 'text-green-600', dot: 'bg-green-500' },
    orange: { text: 'text-orange-600', dot: 'bg-orange-500' },
    indigo: { text: 'text-indigo-600', dot: 'bg-indigo-500' },
    pink: { text: 'text-pink-600', dot: 'bg-pink-500' },
    red: { text: 'text-red-600', dot: 'bg-red-500' },
  };
  const palette = colorStyles[service.color] ?? colorStyles.blue;

  return (
    <div className="card card-interactive flex h-full flex-col">
      <div className="relative h-48 overflow-hidden rounded-xl sm:h-56">
        <LazyImage
          src={service.image}
          alt={t(service.titleKey)}
          className="ease-out-quart h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-eka-dark heading-3 mb-2 text-xl font-bold">{t(service.titleKey)}</h3>
        {/* Helper text/subtitle in orange/color */}
        <p className={`mb-3 text-sm font-medium ${palette.text}`}>{t(service.subtitleKey)}</p>

        <p className="text-body mb-6 line-clamp-3 text-sm">{t(service.descriptionKey)}</p>

        {/* Benefits List */}
        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <div className="mb-6">
            <h4 className="text-eka-dark mb-3 text-xs font-bold tracking-wider uppercase">
              {t('services.mainBenefits') || 'Key Benefits'}
            </h4>
            <ul className="space-y-2">
              {service.benefitsKeys.slice(0, 4).map((key, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${palette.dot} mt-1.5 mr-2 flex-shrink-0`}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex gap-3 border-t border-gray-100 pt-4">
          <Link href={service.href} className="flex-1">
            <Button
              variant="outline"
              className="btn btn-sm btn-secondary border-primary-200 text-primary-700 hover:bg-primary-50 w-full rounded-xl p-2.5 normal-case"
            >
              {t('common.readMore') || 'Read More'}
            </Button>
          </Link>
          <Link href="/book" className="flex-1">
            <Button className="btn btn-sm btn-accent w-full rounded-xl border-none p-2.5 font-semibold normal-case">
              {t('nav.bookNow')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
