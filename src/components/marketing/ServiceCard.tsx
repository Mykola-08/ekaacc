'use client';

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, LazyImage } from '@/components/ui';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useBooking } from '@/hooks/useBooking';
import { ServiceItem } from '@/shared/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLanguage();
  const { navigateToBooking } = useBooking();

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 h-full border border-border/60 hover:border-primary/30 hover:shadow-lg">
      <div className="relative h-56 sm:h-64 overflow-hidden rounded-3xl m-2 mb-0">
        <div className="absolute inset-0 bg-primary/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <LazyImage
          src={service.image}
          alt={t(service.titleKey)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <CardHeader className="pt-6 pb-0">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-2xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {t(service.titleKey)}
          </h3>
          {service.subtitleKey && (
            <Badge variant="secondary" className="uppercase tracking-wider text-[11px] px-3 py-1">
              {t(service.subtitleKey)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-0 flex flex-col grow">
        <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3 font-light">
          {t(service.descriptionKey)}
        </p>

        {service.benefitsKeys && service.benefitsKeys.length > 0 && (
          <div className="mb-6 bg-muted/20 rounded-2xl p-4 border border-border/40">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t('services.mainBenefits') || 'Key Benefits'}
            </h4>
            <ul className="space-y-2">
              {service.benefitsKeys.slice(0, 4).map((key, i) => (
                <li key={i} className="flex items-start text-sm text-muted-foreground/90">
                  <HugeiconsIcon icon={Tick02Icon} size={16} className="text-primary/70 mt-0.5 mr-2" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-6 mt-auto flex flex-col gap-3">
        <Button
          onClick={() => navigateToBooking(service.slug || service.id)}
          className="w-full bg-primary hover:bg-primary/95 text-white text-base py-6 rounded-full font-semibold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border-none"
        >
          {t('nav.bookNow')}
        </Button>
        <Link href={service.href} className="w-full">
          <Button
            variant="outline"
            className="w-full bg-transparent hover:bg-black/5 text-foreground/70 border-black/5 text-base py-6 rounded-full transition-all"
          >
            {t('common.readMore') || 'Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
