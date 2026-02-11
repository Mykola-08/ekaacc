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
    blue: { text: 'text-primary', dot: 'bg-primary' },
    purple: { text: 'text-accent', dot: 'bg-accent' },
    green: { text: 'text-success', dot: 'bg-success/100' },
    orange: { text: 'text-marketing-accent-dark', dot: 'bg-marketing-accent' },
    indigo: { text: 'text-accent-foreground', dot: 'bg-accent/100' },
    pink: { text: 'text-accent-foreground', dot: 'bg-accent/100' },
    red: { text: 'text-destructive', dot: 'bg-destructive' },
  };
  const palette = colorStyles[service.color] ?? colorStyles.blue;

  return (
    <div className="card card-interactive flex h-full flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-xl sm:h-56">
        <LazyImage
          src={service.image}
          alt={t(service.titleKey)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
      </div>
      <div className="flex grow flex-col p-6">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{t(service.titleKey)}</h3>
        {/* Helper text/subtitle in color */}
        <p className={`mb-4 text-sm font-medium ${palette.text}`}>{t(service.subtitleKey)}</p>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{t(service.descriptionKey)}</p>

        {/* Benefits List */}
        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
              {t('services.mainBenefits') || 'Key Benefits'}
            </h4>
            <ul className="space-y-2.5">
              {service.benefitsKeys.slice(0, 4).map((key, i) => (
                <li key={i} className="flex items-start text-sm text-muted-foreground">
                  <span
                    className={`mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${palette.dot}`}
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex gap-3 border-t border-border pt-5">
          <Button
            asChild
            variant="outline"
            className="flex-1 w-full rounded-2xl border border-border bg-transparent p-3 text-sm font-medium normal-case text-foreground transition-all duration-300 hover:bg-muted hover:text-foreground"
          >
            <Link href={service.href}>
              {t('common.readMore') || 'Read More'}
            </Link>
          </Button>

          <Button 
            asChild
            className="flex-1 w-full rounded-2xl border-none bg-accent p-3 text-sm font-semibold normal-case text-eka-dark transition-all duration-300 hover:bg-accent/90"
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

