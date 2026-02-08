import { Star, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Maria Rodríguez',
    role: 'Directora Marketing',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: "Després de mesos amb dolor d'esquena crònic, Elena va aconseguir alleujar el meu dolor amb només tres sessions de kinesiologia. El seu enfocament integral m'ha canviat la vida.",
    result: 'Reducció del dolor del 90%',
  },
  {
    name: 'Jordi Martínez',
    role: 'Enginyer de Software',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: "L'estrès laboral m'estava afectant molt. Amb les sessions d'osteobalance i els exercicis personalitzats, he recuperat l'equilibri emocional i físic.",
    result: 'Millora del son en 2 setmanes',
  },
  {
    name: 'Anna Fernández',
    role: 'Professora',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'El tractament per al meu fill amb necessitats especials ha estat increïble. Elena té una sensibilitat especial per tractar nens i ha millorat molt la seva mobilitat.',
    result: 'Millora de la mobilitat del 70%',
  },
];

export default function SuccessStories() {
  return (
    <section className="bg-card relative overflow-hidden py-24 dark:bg-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-50 to-blue-50 opacity-50 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-linear-to-br from-yellow-50 to-blue-50 opacity-50 dark:from-gray-800 dark:to-gray-900"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl dark:text-white">
            Històries d'èxit
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl dark:text-gray-300">
            Descobreix testimonis de persones que han recuperat el benestar i la llibertat de
            moviment amb les nostres teràpies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card relative transform rounded-3xl p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-lg dark:bg-gray-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-yellow-400 to-yellow-500">
                <Quote className="h-4 w-4 text-white" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed italic dark:text-gray-300">
                "{testimonial.text}"
              </p>

              {/* Result Badge */}
              <div className="mb-6 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {testimonial.result}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="mr-4 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-foreground font-semibold dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground dark:text-muted-foreground/80 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-foreground mb-8 text-2xl font-bold md:text-3xl dark:text-white">
            Torna a sentir-te bé amb tu mateixa
          </p>
          <Link
            to="/contact"
            className="inline-flex transform items-center rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-2xl"
          >
            Reserva la teva sessió avui mateix
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
