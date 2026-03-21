'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { PersonalizedServiceItem } from '@/marketing/shared/types';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';

interface PersonalizedServiceCardProps {
  service: PersonalizedServiceItem;
}

export default function PersonalizedServiceCard({ service }: PersonalizedServiceCardProps) {
  const { t } = useLanguage();

  const details = (
    <>
      {service.benefitsKeys && service.benefitsKeys.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h4 className="mb-2 text-base font-semibold tracking-tight text-gray-900 sm:mb-3 sm:text-lg">
            {t('services.mainBenefits') || 'Main Benefits'}
          </h4>
          <ul className=".5 sm:">
            {service.benefitsKeys.map((key, i) => (
              <li
                key={i}
                className="flex items-start text-sm leading-snug text-gray-600 sm:text-base"
              >
                <span className="bg-primary mt-2 mr-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.resultKey && (
        <div className="bg-primary/5 border-primary/10 mb-4 rounded-[var(--radius)] border p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-primary/70 text-xs font-semibold tracking-widest uppercase sm:text-xs">
              {t('common.expectedResult') || 'Expected Result'}
            </span>
            <p className="text-sm leading-snug font-semibold text-gray-900 sm:text-base">
              {t(service.resultKey)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between rounded-[var(--radius)] border border-gray-100 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase sm:text-xs">
            {t('common.duration') || 'Duration'}
          </span>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5 text-gray-400 sm:h-4 sm:w-4" />
            <span className="text-sm font-semibold text-gray-900 sm:text-base">
              {service.duration
                ? `${service.duration} ${t('common.minutes') || 'min'}`
                : `60 ${t('common.minutes') || 'min'}`}
            </span>
          </div>
        </div>
        <div className="mx-2 h-8 w-px bg-gray-100"></div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase sm:text-xs">
            {t('common.price') || 'Price'}
          </span>
          <span className="text-sm font-semibold text-gray-900 sm:text-base">
            {service.price ? `${service.price} €` : t('common.consultPrice')}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <ServiceBentoItem
      title={t(service.titleKey)}
      description={t(service.descriptionKey)}
      image={service.image}
      details={details}
      bookUrl={`/booking?service=${encodeURIComponent(t(service.titleKey))}`}
      bookText={t('nav.bookNow') || 'Book Now'}
      readMoreUrl={service.href}
    />
  );
}
