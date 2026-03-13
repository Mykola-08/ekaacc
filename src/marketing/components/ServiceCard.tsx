'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { ServiceItem } from '@/marketing/shared/types';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLanguage();

  const details = (
    <>
      {service.benefitsKeys && service.benefitsKeys.length > 0 && (
        <div className="mb-8">
          <h4 className="mb-4 text-xl font-semibold tracking-tight text-gray-900">
            {t('services.mainBenefits')}
          </h4>
          <ul className="">
            {service.benefitsKeys.map((key, i) => (
              <li key={i} className="flex items-start text-lg text-gray-600">
                <span className="mt-2.5 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 flex items-center gap-6 rounded-2xl bg-gray-50 p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            {t('common.duration')}
          </span>
          <span className="text-xl font-semibold text-gray-900">
            {service.durations && service.durations.length > 0
              ? `${service.durations[0]} ${t('common.minutes')}`
              : t('services.variableDuration')}
          </span>
        </div>
        <div className="h-12 w-px bg-gray-200"></div>
        <div className="flex flex-col">
          <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            {t('common.price')}
          </span>
          <span className="text-xl font-semibold text-gray-900">
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
      readMoreUrl={service.href}
    />
  );
}
