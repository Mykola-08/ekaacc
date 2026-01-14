
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
// import { supabase } from '@/react-app/lib/supabase';
import { SERVICES_DATA } from '@/shared/constants';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

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
    const fetchData = () => {
       /*
      const { data } = await supabase
        .from('content_blocks')
        .select('data')
        .eq('key', 'service_categories')
        .single();
      */
      
      const mappedServices: ServiceCategory[] = SERVICES_DATA.slice(0, 3).map((s, index) => ({
        id: s.id,
        href: s.href,
        image: s.image || '',
        color: s.color === 'orange' ? 'from-orange-400 to-pink-500' : 
               s.color === 'blue' ? 'from-blue-400 to-indigo-500' : 
               s.color === 'green' ? 'from-green-400 to-teal-500' : 'from-purple-400 to-pink-500',
        number: `0${index + 1}`,
        name: t(s.titleKey),
        description: t(s.descriptionKey).substring(0, 50) + '...'
      }));
      setServiceCategories(mappedServices);
    };
    fetchData();
  }, [t]);

  return (
    <section className="apple-section bg-card">
      <div className="apple-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="apple-headline mb-6">
            Els nostres serveis
          </h2>
          <p className="apple-subtitle max-w-3xl mx-auto">
            Descobreix la nostra gamma completa de teràpies personalitzades
            per restaurar l'equilibri i promoure el teu benestar integral
          </p>
        </div>

        {/* Service Pills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {serviceCategories.map((service) => (
            <Link
              key={service.id}
              to={service.href}
              className="group service-pill relative block"
              style={{
                backgroundImage: `url(${service.image})`
              }}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
                {/* Top content */}
                <div className="flex justify-between items-start">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} shadow-md`}>
                    <span className="text-2xl font-light">{service.number}</span>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Bottom content */}
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Veure tots els serveis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
