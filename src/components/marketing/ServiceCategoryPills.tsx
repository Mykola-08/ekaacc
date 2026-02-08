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
      color: s.color === 'orange' ? 'from-orange-400 to-pink-500' :
        s.color === 'blue' ? 'from-blue-400 to-indigo-500' :
          s.color === 'green' ? 'from-green-400 to-blue-500' : 'from-purple-400 to-pink-500',
      number: `0${index + 1}`,
      name: t(s.titleKey),
      description: `${t(s.descriptionKey).substring(0, 50)}...`
    }));
    setServiceCategories(mappedServices);
  }, [t]);

  return (
    <section className="apple-section bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Els nostres serveis
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descobreix la nostra gamma completa de teràpies personalitzades
            per restaurar l'equilibri i promoure el teu benestar integral
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {serviceCategories.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group service-pill relative block"
              style={{
                backgroundImage: `url(${service.image})`
              }}
            >
              <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
                <div className="flex justify-between items-start">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${service.color} shadow-md`}>
                    <span className="text-2xl font-light">{service.number}</span>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-white" />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {service.name}
                  </h3>
                  <p className="text-white/90 font-medium group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
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



