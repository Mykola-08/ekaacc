'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Jhonny Ramírez',
    role: 'Rubí',
    image: 'https://images.pexels.com/photos/6973088/pexels-photo-6973088.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Hola, buenos días. Muchas gracias por el masaje, dormí como un niño y me levanté muy bien, sin dolor ni nada 🙏 Gracias, que tengas un bonito día.',
    service: 'Massatge Terapèutic'
  },
  {
    id: 2,
    name: 'Maria Sosnovskaya',
    role: 'Barcelona',
    image: 'https://images.pexels.com/photos/35150128/pexels-photo-35150128.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'I want to thank Olena for her effective help! In one session, we solved a problem that had been bothering me for about five years. It was necessary to first find the cause and then work with it. Now I don’t have headaches that occurred almost every day at the end of the working day.',
    service: 'Kinesiologia'
  },
  {
    id: 3,
    name: 'Fabio Quaranta',
    role: 'Local Guide',
    image: 'https://images.pexels.com/photos/8837543/pexels-photo-8837543.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Elena es una persona especial, te sabe leer exactamente y tiene muy buenas manos. Además tiene un gran don de sensibilidad y empatía que usa para ayudarte durante su sesión. Muy aconsejado!',
    service: 'Osteobalance'
  },
  {
    id: 4,
    name: 'Alessandra Neves',
    role: 'Local Guide',
    image: 'https://images.pexels.com/photos/4452215/pexels-photo-4452215.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Estuve con Helena, haciendo un masaje californiano. Fue una experiencia muchísimo agradable. El masaje es suave, pero muy profundo a la vez. Helena es muy cuidadosa y te hace sentir súper a gusto. Recomiendo muchísimo.',
    service: 'Massatge Californià'
  },
  {
    id: 5,
    name: 'Oriol Pagès Canals',
    role: 'Barcelona',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Gracias a Elena pude sanar diversas molestias musculares. Con sus sesiones pude conocer algunos aspectos sobre mí que me causaban molestias a nivel físico y poder sanar. Elena se implica mucho con la persona. Recomiendo 100%.',
    service: 'Massatge Terapèutic'
  },
  {
    id: 6,
    name: 'Alejandro Martínez',
    role: 'Barcelona',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Una experiencia inolvidable. El masaje un 10 y Elena es una bellísima persona. 100% recomendable.',
    service: 'Massatge Relaxant'
  },
  {
    id: 7,
    name: 'Rose',
    role: 'Texas, USA',
    image: 'https://images.pexels.com/photos/27041642/pexels-photo-27041642.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Elena was very professional, friendly, and very experienced in massage. There was absolutely nothing I would have changed. Feeling stressed, sore, want to relax… Book Elena!!!!',
    service: 'Deep Tissue Massage'
  },
  {
    id: 8,
    name: 'Airbnb Guest',
    role: 'Barcelona',
    image: 'https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Has a great time. We had a nice conversation at the start, looking at the view of Barcelona over the balcony. And then the massage felt very personal; Elena went with the flow and tried to soothe the pains she felt I had. Nice music and smells. I highly recommend it!',
    service: 'Massatge Personalitzat'
  },
  {
    id: 9,
    name: 'Irene',
    role: 'Booking',
    image: 'https://images.pexels.com/photos/6204232/pexels-photo-6204232.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Una experiencia muy completa. Helena genial, solo hablar con ella ya da paz. Iba con una lesión en el pie y estuvo un buen rato y la verdad es que sentí un alivio casi inmediato. Salí renovada!!',
    service: 'Reflexologia'
  },
  {
    id: 10,
    name: 'Esperanza',
    role: 'Galicia',
    image: 'https://images.pexels.com/photos/6702738/pexels-photo-6702738.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Helena mil gracias por la sesión, por tus manos, por qué me siento ligera y expandida, como hace mucho tiempo no me sentía. Se me hace difícil expresarlo en palabras, es un sentimiento de plenitud, como si se encendiera una luz dentro de mí.',
    service: 'Kinesiologia Emocional'
  },
  {
    id: 11,
    name: 'Cristina y Manuel',
    role: 'Sant Cugat',
    image: 'https://images.pexels.com/photos/3170635/pexels-photo-3170635.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
    text: 'Gracias a Elena me encuentro mucho mejor de mis problemas intestinales y también de mi estado de ánimo. Su sensibilidad hace que te sientas a gusto y confíes, desprende amor.',
    service: 'Nutrició Conscient'
  }
];

interface TestimonialSliderProps {
  backgroundImage?: string;
}

export default function TestimonialSlider({ backgroundImage = 'https://images.pexels.com/photos/6724383/pexels-photo-6724383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop' }: TestimonialSliderProps) {
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
      
      <div className="relative z-10 apple-section">
        <div className="apple-container">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="apple-headline text-white mb-6">
              {t('testimonials.sliderTitle')}
            </h2>
            <p className="apple-subtitle text-white/90 max-w-3xl mx-auto">
              {t('testimonials.sliderSubtitle')}
            </p>
          </div>
          
          {/* Slider Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Cards */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="rounded-3xl bg-card/95 backdrop-blur-sm p-8 md:p-12 text-center shadow-sm border border-white/50">
                      {/* Rating */}
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current mx-0.5" />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <blockquote className="text-xl md:text-2xl text-foreground italic leading-relaxed mb-8 font-light">
                        "{testimonial.text}"
                      </blockquote>
                      
                      {/* Author */}
                      <div className="text-center">
                        <div className="font-semibold text-foreground text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          {testimonial.service}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={prevSlide}
                className="bg-card/20 backdrop-blur-sm border border-white/30 text-white hover:bg-card/30 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              >
                <div className="w-3 h-3 border-l-2 border-t-2 border-white transform -rotate-45"></div>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-card' : 'bg-card/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextSlide}
                className="bg-card/20 backdrop-blur-sm border border-white/30 text-white hover:bg-card/30 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              >
                <div className="w-3 h-3 border-r-2 border-t-2 border-white transform rotate-45"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

