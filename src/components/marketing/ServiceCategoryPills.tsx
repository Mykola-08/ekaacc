import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SERVICES_DATA } from '@/shared/marketing/constants';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface ServiceCategory {
  id: string;
  href: string;
  image: string;
  color: string;
  number: string;
  name: string;
  description: string;
}

export default function ServiceCategoryPills() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const mappedServices: ServiceCategory[] = SERVICES_DATA.slice(0, 3).map((s, index) => ({
      id: s.id,
      href: s.href,
      image: s.image || '',
      color:
        s.color === 'orange'
          ? 'from-warning to-destructive'
          : s.color === 'blue'
            ? 'from-info to-accent'
            : s.color === 'green'
              ? 'from-success to-info'
              : 'from-accent to-destructive',
      number: `0${index + 1}`,
      name: t(s.titleKey),
      description: `${t(s.descriptionKey).substring(0, 50)}...`,
    }));
    setServiceCategories(mappedServices);
  }, [t]);

  return (
    <section className="apple-section bg-card">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Els nostres serveis
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
            Descobreix la nostra gamma completa de teràpies personalitzades per restaurar
            l'equilibri i promoure el teu benestar integral
          </p>
        </div>

        <div className="stagger-children grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group service-pill relative block"
              style={{
                backgroundImage: `url(${service.image})`,
              }}
            >
              <div className="relative z-10 flex h-full flex-col justify-between p-8 text-primary-foreground">
                <div className="flex items-start justify-between">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${service.color} shadow-md`}
                  >
                    <span className="text-2xl font-light">{service.number}</span>
                  </div>

                  <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-primary-foreground" />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="mb-2 text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-1">
                    {service.name}
                  </h3>
                  <p className="font-medium text-primary-foreground/90 transition-transform delay-75 duration-300 group-hover:translate-x-1">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild className="rounded-2xl px-8 py-6 text-base shadow-md hover:shadow-lg">
            <Link href="/services" className="inline-flex items-center gap-2">
              Veure tots els serveis
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

