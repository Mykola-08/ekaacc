'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { PersonalizedServiceItem } from '@/marketing/shared/types';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { Clock } from 'lucide-react';

interface PersonalizedServiceCardProps {
  service: PersonalizedServiceItem;
}

export default function PersonalizedServiceCard({ service }: PersonalizedServiceCardProps) {
  const { t } = useLanguage();

  const details = (
     <>
       {service.benefitsKeys && service.benefitsKeys.length > 0 && (
         <div className="mb-6 sm:mb-8">
           <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4">{t('services.mainBenefits') || 'Main Benefits'}</h4>
           <ul className="space-y-2 sm:space-y-3">
             {service.benefitsKeys.map((key, i) => (
               <li key={i} className="flex items-start text-base sm:text-lg text-gray-600">
                 <span className="w-2 h-2 rounded-full bg-black mt-2 sm:mt-2.5 mr-3 flex-shrink-0" />
                 {t(key)}
               </li>
             ))}
           </ul>
         </div>
       )}

       {service.resultKey && (
         <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <div className="flex flex-col gap-2">
                 <span className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest">
                     {t('common.expectedResult') || 'Expected Result'}
                 </span>
                 <p className="text-lg sm:text-xl font-semibold text-gray-900">
                     {t(service.resultKey)}
                 </p>
            </div>
         </div>
       )}

       <div className="flex items-center justify-between mt-auto p-5 sm:p-6 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="flex flex-col gap-1">
             <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest">{t('common.duration') || 'Duration'}</span>
             <div className="flex items-center gap-1.5 sm:gap-2">
                 <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                 <span className="text-base sm:text-lg font-semibold text-gray-900">{service.duration ? `${service.duration} ${t('common.minutes') || 'min'}` : `60 ${t('common.minutes') || 'min'}`}</span>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest">{t('common.price') || 'Price'}</span>
             <span className="text-lg sm:text-xl font-semibold text-gray-900">{service.price ? `${service.price} €` : t('common.consultPrice')}</span>
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
