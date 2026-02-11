'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Jhonny Ramírez',
    role: 'Rubí',
    image:
      'https://images.pexels.com/photos/6973088/pexels-photo-6973088.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Hola, buenos días. Muchas gracias por el masaje, dormí como un niño y me levanté muy bien, sin dolor ni nada 🙏 Gracias, que tengas un bonito día.',
    service: 'Massatge Terapèutic',
  },
  {
    id: 2,
    name: 'Maria Sosnovskaya',
    role: 'Barcelona',
    image:
      'https://images.pexels.com/photos/35150128/pexels-photo-35150128.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'I want to thank Olena for her effective help! In one session, we solved a problem that had been bothering me for about five years. It was necessary to first find the cause and then work with it. Now I don’t have headaches that occurred almost every day at the end of the working day.',
    service: 'Kinesiologia',
  },
  {
    id: 3,
    name: 'Fabio Quaranta',
    role: 'Local Guide',
    image:
      'https://images.pexels.com/photos/8837543/pexels-photo-8837543.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Elena es una persona especial, te sabe leer exactamente y tiene muy buenas manos. Además tiene un gran don de sensibilidad y empatía que usa para ayudarte durante su sesión. Muy aconsejado!',
    service: 'Osteobalance',
  },
  {
    id: 4,
    name: 'Alessandra Neves',
    role: 'Local Guide',
    image:
      'https://images.pexels.com/photos/4452215/pexels-photo-4452215.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Estuve con Helena, haciendo un masaje californiano. Fue una experiencia muchísimo agradable. El masaje es suave, pero muy profundo a la vez. Helena es muy cuidadosa y te hace sentir súper a gusto. Recomiendo muchísimo.',
    service: 'Massatge Californià',
  },
  {
    id: 5,
    name: 'Oriol Pagès Canals',
    role: 'Barcelona',
    image:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Gracias a Elena pude sanar diversas molestias musculares. Con sus sesiones pude conocer algunos aspectos sobre mí que me causaban molestias a nivel físico y poder sanar. Elena se implica mucho con la persona. Recomiendo 100%.',
    service: 'Massatge Terapèutic',
  },
  {
    id: 6,
    name: 'Alejandro Martínez',
    role: 'Barcelona',
    image:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Una experiencia inolvidable. El masaje un 10 y Elena es una bellísima persona. 100% recomendable.',
    service: 'Massatge Relaxant',
  },
  {
    id: 7,
    name: 'Rose',
    role: 'Texas, USA',
    image:
      'https://images.pexels.com/photos/27041642/pexels-photo-27041642.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Elena was very professional, friendly, and very experienced in massage. There was absolutely nothing I would have changed. Feeling stressed, sore, want to relax… Book Elena!!!!',
    service: 'Deep Tissue Massage',
  },
  {
    id: 8,
    name: 'Airbnb Guest',
    role: 'Barcelona',
    image:
      'https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Has a great time. We had a nice conversation at the start, looking at the view of Barcelona over the balcony. And then the massage felt very personal; Elena went with the flow and tried to soothe the pains she felt I had. Nice music and smells. I highly recommend it!',
    service: 'Massatge Personalitzat',
  },
  {
    id: 9,
    name: 'Irene',
    role: 'Booking',
    image:
      'https://images.pexels.com/photos/6204232/pexels-photo-6204232.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Una experiencia muy completa. Helena genial, solo hablar con ella ya da paz. Iba con una lesión en el pie y estuvo un buen rato y la verdad es que sentí un alivio casi inmediato. Salí renovada!!',
    service: 'Reflexologia',
  },
  {
    id: 10,
    name: 'Esperanza',
    role: 'Galicia',
    image:
      'https://images.pexels.com/photos/6702738/pexels-photo-6702738.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Helena mil gracias por la sesión, por tus manos, por qué me siento ligera y expandida, como hace mucho tiempo no me sentía. Se me hace difícil expresarlo en palabras, es un sentimiento de plenitud, como si se encendiera una luz dentro de mí.',
    service: 'Kinesiologia Emocional',
  },
  {
    id: 11,
    name: 'Cristina y Manuel',
    role: 'Sant Cugat',
    image:
      'https://images.pexels.com/photos/3170635/pexels-photo-3170635.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Gracias a Elena me encuentro mucho mejor de mis problemas intestinales y también de mi estado de ánimo. Su sensibilidad hace que te sientas a gusto y confíes, desprende amor.',
    service: 'Nutrició Conscient',
  },
];

interface TestimonialSliderProps {
  backgroundImage?: string;
}

export default function TestimonialSlider({
  backgroundImage = 'https://images.pexels.com/photos/6724383/pexels-photo-6724383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop',
}: TestimonialSliderProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="bg-section-full relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-overlay-dark" />

      <div className="apple-section relative z-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {t('testimonials.sliderTitle')}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg text-primary-foreground/90 md:text-xl">
              {t('testimonials.sliderSubtitle')}
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative mx-auto max-w-4xl">
            {/* Testimonial Cards */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full shrink-0 px-4">
                    <div className="bg-card/95 rounded-2xl border border-background/50 p-8 text-center shadow-sm backdrop-blur-sm md:p-12">
                      {/* Rating */}
                      <div className="mb-6 flex justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="mx-0.5 h-5 w-5 fill-current text-warning" />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-foreground mb-8 text-xl leading-relaxed font-light italic md:text-2xl">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author */}
                      <div className="text-center">
                        <div className="text-foreground text-lg font-semibold">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground">{testimonial.role}</div>
                        <div className="text-sm font-medium text-primary">
                          {testimonial.service}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              <button
                onClick={prevSlide}
                className="bg-card/20 hover:bg-card/30 flex h-12 w-12 items-center justify-center rounded-full border border-border/30 text-primary-foreground backdrop-blur-sm transition-colors"
              >
                <div className="h-3 w-3 -rotate-45 transform border-t-2 border-l-2 border-background"></div>
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-card' : 'bg-card/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-card/20 hover:bg-card/30 flex h-12 w-12 items-center justify-center rounded-full border border-border/30 text-primary-foreground backdrop-blur-sm transition-colors"
              >
                <div className="h-3 w-3 rotate-45 transform border-t-2 border-r-2 border-background"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

