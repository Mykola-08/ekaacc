'use client';

import React, { useState } from 'react';
import { Users, Heart, Scale, Briefcase, Smile } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function DeiPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Diversity, Equity & Inclusion Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'At EKA Balance, we believe that diversity is our strength. We are committed to creating an inclusive environment where everyone feels valued, respected, and empowered to contribute their best work.',
      sections: [
        {
          title: '1. Our Commitment',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'We are dedicated to fostering a workplace that reflects the diverse communities we serve. We do not discriminate on the basis of race, color, religion, gender, gender identity, sexual orientation, national origin, age, disability, or any other protected characteristic.',
        },
        {
          title: '2. Equal Opportunity',
          icon: <Scale className="h-6 w-6 text-primary" />,
          text: 'We provide equal opportunities for employment, advancement, and development to all qualified individuals. Our hiring and promotion decisions are based on merit, qualifications, and business needs.',
        },
        {
          title: '3. Inclusive Culture',
          icon: <Users className="h-6 w-6 text-green-600" />,
          text: 'We strive to create a culture of belonging where everyone can bring their authentic selves to work. We encourage open dialogue, active listening, and mutual respect. We provide training and resources to support inclusive behaviors.',
        },
        {
          title: '4. Workplace Accessibility',
          icon: <Briefcase className="h-6 w-6 text-purple-600" />,
          text: 'We are committed to providing a workplace that is accessible to everyone. We provide reasonable accommodations for employees with disabilities to ensure they can perform their essential job functions.',
        },
        {
          title: '5. Employee Well-being',
          icon: <Smile className="h-6 w-6 text-orange-600" />,
          text: 'We prioritize the physical and mental well-being of our employees. We offer comprehensive benefits, flexible work arrangements, and support programs to help our team members thrive both personally and professionally.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Diversidad, Equidad e InclusiÃ³n',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'En EKA Balance, creemos que la diversidad es nuestra fortaleza. Estamos comprometidos a crear un entorno inclusivo donde todos se sientan valorados, respetados y empoderados para contribuir con su mejor trabajo.',
      sections: [
        {
          title: '1. Nuestro Compromiso',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'Estamos dedicados a fomentar un lugar de trabajo que refleje las diversas comunidades a las que servimos. No discriminamos por motivos de raza, color, religiÃ³n, gÃ©nero, identidad de gÃ©nero, orientaciÃ³n sexual, origen nacional, edad, discapacidad o cualquier otra caracterÃ­stica protegida.',
        },
        {
          title: '2. Igualdad de Oportunidades',
          icon: <Scale className="h-6 w-6 text-primary" />,
          text: 'Brindamos igualdad de oportunidades de empleo, avance y desarrollo a todas las personas calificadas. Nuestras decisiones de contrataciÃ³n y promociÃ³n se basan en el mÃ©rito, las calificaciones y las necesidades comerciales.',
        },
        {
          title: '3. Cultura Inclusiva',
          icon: <Users className="h-6 w-6 text-green-600" />,
          text: 'Nos esforzamos por crear una cultura de pertenencia donde todos puedan ser autÃ©nticos en el trabajo. Fomentamos el diÃ¡logo abierto, la escucha activa y el respeto mutuo. Brindamos capacitaciÃ³n y recursos para apoyar comportamientos inclusivos.',
        },
        {
          title: '4. Accesibilidad en el Lugar de Trabajo',
          icon: <Briefcase className="h-6 w-6 text-purple-600" />,
          text: 'Estamos comprometidos a proporcionar un lugar de trabajo que sea accesible para todos. Brindamos adaptaciones razonables para empleados con discapacidades para garantizar que puedan realizar sus funciones laborales esenciales.',
        },
        {
          title: '5. Bienestar de los Empleados',
          icon: <Smile className="h-6 w-6 text-orange-600" />,
          text: 'Priorizamos el bienestar fÃ­sico y mental de nuestros empleados. Ofrecemos beneficios integrales, acuerdos de trabajo flexibles y programas de apoyo para ayudar a los miembros de nuestro equipo a prosperar tanto personal como profesionalmente.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de Diversitat, Equitat i InclusiÃ³',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'A EKA Balance, creiem que la diversitat Ã©s la nostra fortalesa. Ens comprometem a crear un entorn inclusiu on tothom se senti valorat, respectat i empoderat per contribuir amb el seu millor treball.',
      sections: [
        {
          title: '1. El Nostre CompromÃ­s',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'Estem dedicats a fomentar un lloc de treball que reflecteixi les diverses comunitats a les quals servim. No discriminem per motius de raÃ§a, color, religiÃ³, gÃ¨nere, identitat de gÃ¨nere, orientaciÃ³ sexual, origen nacional, edat, discapacitat o qualsevol altra caracterÃ­stica protegida.',
        },
        {
          title: "2. Igualtat d'Oportunitats",
          icon: <Scale className="h-6 w-6 text-primary" />,
          text: "Oferim igualtat d'oportunitats d'ocupaciÃ³, avanÃ§ament i desenvolupament a totes les persones qualificades. Les nostres decisions de contractaciÃ³ i promociÃ³ es basen en el mÃ¨rit, les qualificacions i les necessitats comercials.",
        },
        {
          title: '3. Cultura Inclusiva',
          icon: <Users className="h-6 w-6 text-green-600" />,
          text: "Ens esforcem per crear una cultura de pertinenÃ§a on tothom pugui ser autÃ¨ntic a la feina. Fomentem el diÃ leg obert, l'escolta activa i el respecte mutu. Oferim formaciÃ³ i recursos per donar suport a comportaments inclusius.",
        },
        {
          title: '4. Accessibilitat al Lloc de Treball',
          icon: <Briefcase className="h-6 w-6 text-purple-600" />,
          text: 'Ens comprometem a proporcionar un lloc de treball que sigui accessible per a tothom. Oferim adaptacions raonables per a empleats amb discapacitats per garantir que puguin realitzar les seves funcions laborals essencials.',
        },
        {
          title: '5. Benestar dels Empleats',
          icon: <Smile className="h-6 w-6 text-orange-600" />,
          text: 'Prioritzem el benestar fÃ­sic i mental dels nostres empleats. Oferim beneficis integrals, acords de treball flexibles i programes de suport per ajudar els membres del nostre equip a prosperar tant personalment com professionalment.',
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ€Ð°Ð·Ð½Ð¾Ð¾Ð±Ñ€Ð°Ð·Ð¸Ñ, Ñ€Ð°Ð²ÐµÐ½ÑÑ‚Ð²Ð° Ð¸ Ð¸Ð½ÐºÐ»ÑŽÐ·Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ EKA Balance Ð¼Ñ‹ Ð²ÐµÑ€Ð¸Ð¼, Ñ‡Ñ‚Ð¾ Ñ€Ð°Ð·Ð½Ð¾Ð¾Ð±Ñ€Ð°Ð·Ð¸Ðµ â€” ÑÑ‚Ð¾ Ð½Ð°ÑˆÐ° ÑÐ¸Ð»Ð°. ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ Ð¸Ð½ÐºÐ»ÑŽÐ·Ð¸Ð²Ð½ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ, Ð² ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¹ ÐºÐ°Ð¶Ð´Ñ‹Ð¹ Ñ‡ÑƒÐ²ÑÑ‚Ð²ÑƒÐµÑ‚, Ñ‡Ñ‚Ð¾ ÐµÐ³Ð¾ Ñ†ÐµÐ½ÑÑ‚, ÑƒÐ²Ð°Ð¶Ð°ÑŽÑ‚ Ð¸ Ð½Ð°Ð´ÐµÐ»ÑÑŽÑ‚ Ð¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡Ð¸ÑÐ¼Ð¸ Ð²Ð½Ð¾ÑÐ¸Ñ‚ÑŒ ÑÐ²Ð¾Ð¹ Ð²ÐºÐ»Ð°Ð´ Ð² Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ.',
      sections: [
        {
          title: '1. ÐÐ°ÑˆÐµ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐµ Ð¼ÐµÑÑ‚Ð¾, Ð¾Ñ‚Ñ€Ð°Ð¶Ð°ÑŽÑ‰ÐµÐµ Ñ€Ð°Ð·Ð½Ð¾Ð¾Ð±Ñ€Ð°Ð·Ð½Ñ‹Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÑÑ‚Ð²Ð°, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ Ð¼Ñ‹ ÑÐ»ÑƒÐ¶Ð¸Ð¼. ÐœÑ‹ Ð½Ðµ Ð´Ð¾Ð¿ÑƒÑÐºÐ°ÐµÐ¼ Ð´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð¿Ñ€Ð¸Ð·Ð½Ð°ÐºÑƒ Ñ€Ð°ÑÑ‹, Ñ†Ð²ÐµÑ‚Ð° ÐºÐ¾Ð¶Ð¸, Ñ€ÐµÐ»Ð¸Ð³Ð¸Ð¸, Ð¿Ð¾Ð»Ð°, Ð³ÐµÐ½Ð´ÐµÑ€Ð½Ð¾Ð¹ Ð¸Ð´ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸, ÑÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ Ð¾Ñ€Ð¸ÐµÐ½Ñ‚Ð°Ñ†Ð¸Ð¸, Ð½Ð°Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð¶Ð´ÐµÐ½Ð¸Ñ, Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð°, Ð¸Ð½Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ÑÑ‚Ð¸ Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð¹ Ð´Ñ€ÑƒÐ³Ð¾Ð¹ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ð¾Ð¹ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸.',
        },
        {
          title: '2. Ð Ð°Ð²Ð½Ñ‹Ðµ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸',
          icon: <Scale className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ñ€Ð°Ð²Ð½Ñ‹Ðµ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ Ñ‚Ñ€ÑƒÐ´Ð¾ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð°, Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ ÑÐ»ÑƒÐ¶Ð±Ðµ Ð¸ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ñ Ð²ÑÐµÐ¼ ÐºÐ²Ð°Ð»Ð¸Ñ„Ð¸Ñ†Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¼ Ð»Ð¸Ñ†Ð°Ð¼. ÐÐ°ÑˆÐ¸ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ Ð¾ Ð½Ð°Ð¹Ð¼Ðµ Ð¸ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ð¸ Ð¿Ð¾ ÑÐ»ÑƒÐ¶Ð±Ðµ Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ñ‹ Ð½Ð° Ð·Ð°ÑÐ»ÑƒÐ³Ð°Ñ…, ÐºÐ²Ð°Ð»Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð¸ Ð´ÐµÐ»Ð¾Ð²Ñ‹Ñ… Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð¾ÑÑ‚ÑÑ….',
        },
        {
          title: '3. Ð˜Ð½ÐºÐ»ÑŽÐ·Ð¸Ð²Ð½Ð°Ñ ÐºÑƒÐ»ÑŒÑ‚ÑƒÑ€Ð°',
          icon: <Users className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ ÐºÑƒÐ»ÑŒÑ‚ÑƒÑ€Ñƒ Ð¿Ñ€Ð¸Ð½Ð°Ð´Ð»ÐµÐ¶Ð½Ð¾ÑÑ‚Ð¸, Ð² ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¹ ÐºÐ°Ð¶Ð´Ñ‹Ð¹ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ ÑÐ°Ð¼Ð¸Ð¼ ÑÐ¾Ð±Ð¾Ð¹ Ð½Ð° Ñ€Ð°Ð±Ð¾Ñ‚Ðµ. ÐœÑ‹ Ð¿Ð¾Ð¾Ñ‰Ñ€ÑÐµÐ¼ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ñ‹Ð¹ Ð´Ð¸Ð°Ð»Ð¾Ð³, Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ðµ ÑÐ»ÑƒÑˆÐ°Ð½Ð¸Ðµ Ð¸ Ð²Ð·Ð°Ð¸Ð¼Ð½Ð¾Ðµ ÑƒÐ²Ð°Ð¶ÐµÐ½Ð¸Ðµ. ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ Ñ€ÐµÑÑƒÑ€ÑÑ‹ Ð´Ð»Ñ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸ Ð¸Ð½ÐºÐ»ÑŽÐ·Ð¸Ð²Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.',
        },
        {
          title: '4. Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ³Ð¾ Ð¼ÐµÑÑ‚Ð°',
          icon: <Briefcase className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐµ Ð¼ÐµÑÑ‚Ð¾, Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾Ðµ Ð´Ð»Ñ Ð²ÑÐµÑ…. ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ñ€Ð°Ð·ÑƒÐ¼Ð½Ñ‹Ðµ Ð¿Ñ€Ð¸ÑÐ¿Ð¾ÑÐ¾Ð±Ð»ÐµÐ½Ð¸Ñ Ð´Ð»Ñ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð² Ñ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¼Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑÐ¼Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð½Ð¸ Ð¼Ð¾Ð³Ð»Ð¸ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÑ‚ÑŒ ÑÐ²Ð¾Ð¸ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ÑÑ‚Ð½Ñ‹Ðµ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '5. Ð‘Ð»Ð°Ð³Ð¾Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ðµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð²',
          icon: <Smile className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ ÑƒÐ´ÐµÐ»ÑÐµÐ¼ Ð¿Ñ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚Ð½Ð¾Ðµ Ð²Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ¾Ð¼Ñƒ Ð¸ Ð¿ÑÐ¸Ñ…Ð¸Ñ‡ÐµÑÐºÐ¾Ð¼Ñƒ Ð±Ð»Ð°Ð³Ð¾Ð¿Ð¾Ð»ÑƒÑ‡Ð¸ÑŽ Ð½Ð°ÑˆÐ¸Ñ… ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð². ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð»Ð°Ð³Ð°ÐµÐ¼ ÐºÐ¾Ð¼Ð¿Ð»ÐµÐºÑÐ½Ñ‹Ðµ Ð»ÑŒÐ³Ð¾Ñ‚Ñ‹, Ð³Ð¸Ð±ÐºÐ¸Ð¹ Ð³Ñ€Ð°Ñ„Ð¸Ðº Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð¼Ð¾Ñ‡ÑŒ Ñ‡Ð»ÐµÐ½Ð°Ð¼ Ð½Ð°ÑˆÐµÐ¹ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹ Ð¿Ñ€Ð¾Ñ†Ð²ÐµÑ‚Ð°Ñ‚ÑŒ ÐºÐ°Ðº Ð² Ð»Ð¸Ñ‡Ð½Ð¾Ð¼, Ñ‚Ð°Ðº Ð¸ Ð² Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¼ Ð¿Ð»Ð°Ð½Ðµ.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-[12px] shadow-sm" role="group">
          {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-4 py-2 text-sm font-medium first:rounded-l-[12px] last:rounded-r-[12px] ${
                language === lang
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card text-foreground/90 border-border hover:bg-muted/30'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <div className="bg-linear-to-r from-purple-600 to-pink-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Users className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-semibold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              className="bg-muted/30 hover:bg-muted flex gap-4 rounded-lg p-6 transition-colors"
            >
              <div className="mt-1 shrink-0">{section.icon}</div>
              <div>
                <h2 className="text-foreground mb-2 text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 border-t border-border px-8 py-6">
          <p className="text-muted-foreground text-center text-sm">
            Â© {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
