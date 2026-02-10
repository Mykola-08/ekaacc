'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { ServiceItem } from '@/shared/marketing/types';
import { LazyImage } from '@/components/ui/lazy-image';

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
      <div className="relative h-48 overflow-hidden sm:h-56" style={{ borderRadius: '1.25rem 1.25rem 0 0' }}>
        <LazyImage
          src={service.image}
          alt={t(service.titleKey)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">{t(service.titleKey)}</h3>
        {/* Helper text/subtitle in color */}
        <p className={`mb-4 text-sm font-medium ${palette.text}`}>{t(service.subtitleKey)}</p>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600">{t(service.descriptionKey)}</p>

        {/* Benefits List */}
        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-900">
              {t('services.mainBenefits') || 'Key Benefits'}
            </h4>
            <ul className="space-y-2.5">
              {service.benefitsKeys.slice(0, 4).map((key, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span
                    className={`mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${palette.dot}`}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex gap-3 border-t border-gray-100 pt-5">
          <Button
            asChild
            variant="outline"
            className="flex-1 w-full rounded-[20px] border border-gray-200 bg-transparent p-3 text-sm font-medium normal-case text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <Link href={service.href}>
              {t('common.readMore') || 'Read More'}
            </Link>
          </Button>

          <Button 
            asChild
            className="flex-1 w-full rounded-[20px] border-none bg-accent p-3 text-sm font-semibold normal-case text-eka-dark transition-all duration-300 hover:bg-accent/90"
          >
            <Link href="/book">
              {t('nav.bookNow')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
