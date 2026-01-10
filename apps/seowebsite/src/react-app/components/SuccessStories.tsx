import { Star, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const testimonials = [
  {
    name: 'Maria Rodríguez',
    role: 'Directora Marketing',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Després de mesos amb dolor d\'esquena crònic, Elena va aconseguir alleujar el meu dolor amb només tres sessions de kinesiologia. El seu enfocament integral m\'ha canviat la vida.',
    result: 'Reducció del dolor del 90%'
  },
  {
    name: 'Jordi Martínez',
    role: 'Enginyer de Software',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'L\'estrès laboral m\'estava afectant molt. Amb les sessions d\'osteobalance i els exercicis personalitzats, he recuperat l\'equilibri emocional i físic.',
    result: 'Millora del son en 2 setmanes'
  },
  {
    name: 'Anna Fernández',
    role: 'Professora',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'El tractament per al meu fill amb necessitats especials ha estat increïble. Elena té una sensibilitat especial per tractar nens i ha millorat molt la seva mobilitat.',
    result: 'Millora de la mobilitat del 70%'
  }
];

export default function SuccessStories() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Històries d'èxit
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descobreix testimonis de persones que han recuperat el benestar i la llibertat de moviment amb les nostres teràpies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Result Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium mb-6">
                {testimonial.result}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Torna a sentir-te bé amb tu mateixa
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Reserva la teva sessió avui mateix
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
