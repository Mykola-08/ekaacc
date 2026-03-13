'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { servicesTranslations } from './TranslationExtensions';
import { revision360Translations } from './Revision360Translations';
import { techniqueTranslations } from './TechniqueTranslations';
import { agenyzTranslations } from './AgenyzTranslations';
import { bentoTranslations } from './BentoTranslations';

import { Language, LanguageContextType } from './LanguageTypes';

// Types are imported for internal use, but not re-exported to avoid HMR issues.
// Import types directly from './LanguageTypes'.

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Keys actively used in the UI that must always resolve in every locale.
const guaranteedTranslations: Record<Language, Record<string, string>> = {
  ca: {
    'common.enquireNow': 'Consultar Ara',
    'personalized.business.bento.box1.details.title': "Cohesió d'Equip",
    'personalized.business.bento.box1.details.desc':
      'Les nostres activitats especialitzades ajuden a trencar el gel, fomentar la comunicació i construir vincles sòlids.',
    'personalized.business.bento.box2.details.title': 'Més Concentració',
    'personalized.business.bento.box2.details.desc':
      "Aprèn tècniques per millorar el rendiment individual i l'eficiència de l'equip.",
    'personalized.business.bento.box3.details.title': "Alliberament de l'Estrès",
    'personalized.business.bento.box3.details.desc':
      'Estratègies i pràctiques per reduir la pressió i mantenir una salut mental forta.',
    'personalized.business.bento.box4.details.title': 'Entorn Holístic',
    'personalized.business.bento.box4.details.desc':
      'Crea un espai de treball que fomenti el benestar. Auditem el teu entorn actual i proporcionem recomanacions.',
    'personalized.business.plans.title': 'Solucions a Mida per a Organitzacions',
    'personalized.business.plans.subtitle':
      'Inverteix en el benestar físic i mental del teu equip per assolir la màxima productivitat i harmonia.',
    'personalized.business.plans.teams.title': 'Equips / Startups',
    'personalized.business.plans.teams.desc':
      'Perfecte per a grups petits i departaments que busquen millorar la sincronització i el rendiment.',
    'personalized.business.plans.teams.price': 'A partir de',
    'personalized.business.plans.teams.feature1': 'Proves de suplements individuals',
    'personalized.business.plans.teams.feature2': "Sessions d'equip",
    'personalized.business.plans.teams.feature3': 'Gestió de conflictes',
    'personalized.business.plans.teams.feature4': 'Efectivitat operativa',
    'personalized.business.plans.enterprise.title': 'Empreses / Corporacions',
    'personalized.business.plans.enterprise.desc':
      'Integració integral de benestar per a organitzacions completes.',
    'personalized.business.plans.enterprise.price': 'Preus a Mida',
    'personalized.business.plans.enterprise.feature1': "Gestió de l'estrès",
    'personalized.business.plans.enterprise.feature2': 'Auditories ergonòmiques',
    'personalized.business.plans.enterprise.feature3': 'Indicadors de salut',
    'personalized.business.plans.enterprise.feature4': 'Dies de teràpia presencial',

    'adult.cta.desc': 'Comença el teu camí de benestar amb una sessió personalitzada.',
    'adult.cta.title': 'Preparat per començar?',
    'adult.recommended': 'Serveis recomanats',
    'adult.recommended.desc': 'Teràpies seleccionades per a adults i benestar integral.',
    'booking.form.close': 'Tancar formulari',
    'common.minutes': 'min',
    'common.notFound': 'No trobat',
    'common.readyToStart': 'Preparat per començar?',
    'common.bookConsultation':
      'Reserva la teva consulta avui i fes el primer pas cap a una millor salut i benestar.',
    'common.bookNow': 'Reserva ara',
    'common.contactUs': 'Contacta amb nosaltres',
    'common.readMore': 'Llegir més',
    'common.clickHere': 'Fes clic aquí',
    'whatsapp.booking': 'Hola, vull reservar una sessió',
    'contact.form.emailPlaceholder': 'El teu correu electrònic',
    'contact.form.namePlaceholder': 'El teu nom',
    'contact.form.title': "Envia'ns un missatge",
    'contact.hours.saturday': 'Dissabte: amb cita prèvia',
    'contact.hours.sunday': 'Diumenge: tancat',
    'contact.hours.title': 'Horari',
    'contact.hours.weekdays': 'Dilluns a divendres: 09:00 - 20:00',
    'contact.info.email': 'Correu electrònic',
    'contact.info.location': 'Ubicació',
    'contact.info.metro': 'Metro proper',
    'contact.info.phone': 'Telèfon',
    'contact.info.response': 'Resposta en menys de 24h',
    'contact.info.subtitle': 'Estem aquí per ajudar-te',
    'contact.info.title': 'Informació de contacte',
    'contact.info.whatsapp': 'WhatsApp',
    'discounts.activeBadge': 'Actiu',
    'discounts.apply': 'Aplicar',
    'discovery.tension.full': 'Tot el cos',
    'discovery.tension.head': 'Cap',
    'discovery.tension.legs': 'Cames',
    'discovery.tension.lumbar': 'Lumbars',
    'discovery.tension.neck': 'Coll i espatlles',
    'discovery.tension.none': 'Sense tensió principal',
    'elena.approach': "T'ajudo a escoltar el cos i restaurar l'equilibri natural.",
    'footer.readyToBegin': 'Preparat per començar?',
    'hero.badge': 'Benestar somàtic i acompanyament integratiu',
    'hero.subtitle':
      "Acompanyament somàtic i de benestar per millorar la mobilitat, reduir l'estrès i recuperar equilibri.",
    'hero.firstTime': 'Primera sessió de benestar',
    'kinesiology.page.availableToday': 'Disponible avui',
    'kinesiology.page.bookSession': 'Reserva la teva sessió',
    'kinesiology.page.durationsTitle': 'Durades disponibles',
    'kinesiology.page.testimonialsTitle': 'Testimonis',
    'nutrition.hero.badge': 'Nutrició funcional',
    'nutrition.page.availableToday': 'Disponible avui',
    'nutrition.page.bookSession': 'Reserva la teva sessió',
    'nutrition.page.durationsSubtitle': "Escull la durada que millor s'adapti a tu.",
    'nutrition.page.durationsTitle': 'Durades disponibles',
    'nutrition.page.testimonialsTitle': 'Testimonis',
    'onboarding.userTypes.freeWoman': 'Dona lliure',
    'recommendations.kinesiology.emotional_description':
      'Regulació emocional per recuperar claredat i calma.',
    'recommendations.systemic.description': 'Treball sistèmic per alliberar bloquejos profunds.',
    'services.disclaimerBody':
      'Aquest contingut és informatiu. Els nostres mètodes són complementaris i no substitueixen atenció mèdica o psicològica.',
    'services.disclaimerPrefix': 'Avís',
    'services.exploreOurServices': 'Explora la nostra gamma de serveis integrals',
    'services.coreTitle': 'Teràpies Integrals',
    'services.coreDesc':
      'Des de massatges relaxants fins a teràpies especialitzades de kinesiologia.',
    'services.descriptionPrefix':
      'Des de massatges relaxants fins a teràpies especialitzades de kinesiologia.',
    'services.feldenkrais.title': 'Mètode Feldenkrais',
    'services.kinesiology.shortDesc': 'Equilibra cos, ment i energia.',
    'services.nutrition.shortDesc': 'Nutrició funcional adaptada al teu cas.',
    'services.title': 'Sessions personalitzades de benestar',
    'services.subtitle':
      "Enfocament somàtic i integratiu per mobilitat, regulació de l'estrès i equilibri corporal.",
    'services.cta': 'Explorar sessions',
    'problems.subtitle':
      'Situacions freqüents que acompanyem amb enfocament complementari i personalitzat.',
    'discovery.diagnosis.title': 'Valoració personalitzada',
    'casos.treatment': 'Com et donem suport',
    'technique.why': 'Per què aquesta tècnica?',

    'nav.parents': 'Pares',
    'common.spanish': 'Espanyol',
    'common.english': 'Anglès',
    'common.catalan': 'Català',
    'common.russian': 'Rus',
  },
  en: {
    'common.enquireNow': 'Enquire Now',
    'personalized.business.bento.box1.details.title': 'Team Cohesion',
    'personalized.business.bento.box1.details.desc':
      'Our specialized activities help break the ice, foster communication, and build strong bonds within your team.',
    'personalized.business.bento.box2.details.title': 'Enhanced Focus',
    'personalized.business.bento.box2.details.desc':
      'Learn techniques to improve individual output and overall team efficiency.',
    'personalized.business.bento.box3.details.title': 'Stress Relief',
    'personalized.business.bento.box3.details.desc':
      'Strategies and practices aimed at reducing pressure and maintaining strong mental health.',
    'personalized.business.bento.box4.details.title': 'Holistic Environment',
    'personalized.business.bento.box4.details.desc':
      'Create a workspace that naturally encourages well-being. We audit your current environment and provide recommendations.',
    'personalized.business.plans.title': 'Tailored Solutions for Organizations',
    'personalized.business.plans.subtitle':
      "Invest in your team's physical and mental well-being to achieve peak productivity and harmony in the workplace.",
    'personalized.business.plans.teams.title': 'Teams / Startups',
    'personalized.business.plans.teams.desc':
      'Perfect for small groups and departments looking to improve synchronization and performance.',
    'personalized.business.plans.teams.price': 'Starting from',
    'personalized.business.plans.teams.feature1': 'Individual supplement testing',
    'personalized.business.plans.teams.feature2': 'Team cohesion sessions',
    'personalized.business.plans.teams.feature3': 'Conflicts resolution',
    'personalized.business.plans.teams.feature4': 'Operational effectivity',
    'personalized.business.plans.enterprise.title': 'Enterprises / Corporations',
    'personalized.business.plans.enterprise.desc':
      'Comprehensive wellness integration for entire organizations seeking to build a health-first culture.',
    'personalized.business.plans.enterprise.price': 'Custom Pricing',
    'personalized.business.plans.enterprise.feature1': 'Company-wide stress management',
    'personalized.business.plans.enterprise.feature2': 'Ergonomic workplace audits',
    'personalized.business.plans.enterprise.feature3': 'Health indicators tracking',
    'personalized.business.plans.enterprise.feature4': 'Regular on-site therapy days',

    'adult.cta.desc': 'Start your wellness path with a personalized session.',
    'adult.cta.title': 'Ready to begin?',
    'adult.recommended': 'Recommended services',
    'adult.recommended.desc': 'Selected therapies for adults and integral wellbeing.',
    'booking.form.close': 'Close form',
    'common.minutes': 'min',
    'common.notFound': 'Not found',
    'common.readyToStart': 'Ready to start your journey?',
    'common.bookConsultation':
      'Book a consultation today and take the first step towards better health and wellbeing.',
    'common.bookNow': 'Book now',
    'common.contactUs': 'Contact us',
    'common.readMore': 'Read more',
    'common.clickHere': 'Click here',
    'whatsapp.booking': 'Hi, I would like to book a session',
    'contact.form.emailPlaceholder': 'Your email',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.title': 'Send us a message',
    'contact.hours.saturday': 'Saturday: by appointment',
    'contact.hours.sunday': 'Sunday: closed',
    'contact.hours.title': 'Opening hours',
    'contact.hours.weekdays': 'Monday to Friday: 09:00 - 20:00',
    'contact.info.email': 'Email',
    'contact.info.location': 'Location',
    'contact.info.metro': 'Nearest metro',
    'contact.info.phone': 'Phone',
    'contact.info.response': 'Response in less than 24h',
    'contact.info.subtitle': 'We are here to help',
    'contact.info.title': 'Contact information',
    'contact.info.whatsapp': 'WhatsApp',
    'discounts.activeBadge': 'Active',
    'discounts.apply': 'Apply',
    'discovery.tension.full': 'Whole body',
    'discovery.tension.head': 'Head',
    'discovery.tension.legs': 'Legs',
    'discovery.tension.lumbar': 'Lower back',
    'discovery.tension.neck': 'Neck and shoulders',
    'discovery.tension.none': 'No main tension',
    'elena.approach': 'I help you listen to your body and restore natural balance.',
    'footer.readyToBegin': 'Ready to begin?',
    'hero.badge': 'Somatic wellness and integrative support',
    'hero.subtitle':
      'Personalized somatic and wellness support to improve mobility, reduce stress, and restore everyday balance.',
    'hero.firstTime': 'First wellness session',
    'kinesiology.page.availableToday': 'Available today',
    'kinesiology.page.bookSession': 'Book your session',
    'kinesiology.page.durationsTitle': 'Available durations',
    'kinesiology.page.testimonialsTitle': 'Testimonials',
    'nutrition.hero.badge': 'Functional nutrition',
    'nutrition.page.availableToday': 'Available today',
    'nutrition.page.bookSession': 'Book your session',
    'nutrition.page.durationsSubtitle': 'Choose the duration that fits you best.',
    'nutrition.page.durationsTitle': 'Available durations',
    'nutrition.page.testimonialsTitle': 'Testimonials',
    'onboarding.userTypes.freeWoman': 'Free woman',
    'recommendations.kinesiology.emotional_description':
      'Emotional regulation to recover clarity and calm.',
    'recommendations.systemic.description': 'Systemic work to release deep blockages.',
    'services.disclaimerBody':
      'This content is informational. Our methods are complementary and do not replace medical or mental health care.',
    'services.disclaimerPrefix': 'Disclaimer',
    'services.exploreOurServices': 'Explore our comprehensive range of services',
    'services.coreTitle': 'Integral Therapies',
    'services.coreDesc': 'From relaxing massages to specialized kinesiology therapies.',
    'services.descriptionPrefix': 'From relaxing massages to specialized kinesiology therapies.',
    'services.feldenkrais.title': 'Feldenkrais Method',
    'services.kinesiology.shortDesc': 'Balance body, mind, and energy.',
    'services.nutrition.shortDesc': 'Functional nutrition tailored to your case.',
    'services.title': 'Personalized wellness sessions',
    'services.subtitle':
      'Somatic and movement support for stress relief, mobility, and sustainable wellbeing.',
    'services.cta': 'Explore sessions',
    'problems.subtitle':
      'Common situations we support through complementary, non-medical wellness work.',
    'discovery.diagnosis.title': 'Personalized assessment',
    'casos.treatment': 'How we support you',
    'technique.why': 'Why this technique?',

    'common.spanish': 'Spanish',
    'common.english': 'English',
    'common.catalan': 'Catalan',
    'common.russian': 'Russian',
  },
  es: {
    'common.enquireNow': 'Consultar Ahora',
    'personalized.business.bento.box1.details.title': 'Cohesión de Equipo',
    'personalized.business.bento.box1.details.desc':
      'Nuestras actividades especializadas ayudan a romper el hielo, fomentar la comunicación y construir vínculos sólidos dentro del equipo.',
    'personalized.business.bento.box2.details.title': 'Mayor Enfoque',
    'personalized.business.bento.box2.details.desc':
      'Aprende técnicas para mejorar el rendimiento individual y la eficiencia general del equipo.',
    'personalized.business.bento.box3.details.title': 'Alivio del Estrés',
    'personalized.business.bento.box3.details.desc':
      'Estrategias y prácticas para reducir la presión y mantener una salud mental fuerte.',
    'personalized.business.bento.box4.details.title': 'Entorno Holístico',
    'personalized.business.bento.box4.details.desc':
      'Crea un espacio de trabajo que fomente el bienestar de forma natural. Auditamos tu entorno y proporcionamos recomendaciones.',
    'personalized.business.plans.title': 'Soluciones a Medida para Organizaciones',
    'personalized.business.plans.subtitle':
      'Invierte en el bienestar físico y mental de tu equipo para alcanzar el máximo de productividad y armonía en el trabajo.',
    'personalized.business.plans.teams.title': 'Equipos / Startups',
    'personalized.business.plans.teams.desc':
      'Perfecto para grupos pequeños y departamentos que buscan mejorar la sincronización y el rendimiento.',
    'personalized.business.plans.teams.price': 'A partir de',
    'personalized.business.plans.teams.feature1': 'Pruebas de suplementos',
    'personalized.business.plans.teams.feature2': 'Sesiones de cohesión',
    'personalized.business.plans.teams.feature3': 'Marcos de resolución de conflictos',
    'personalized.business.plans.teams.feature4': 'Mejor enfoque y efectividad',
    'personalized.business.plans.enterprise.title': 'Empresas / Corporaciones',
    'personalized.business.plans.enterprise.desc':
      'Integración integral de bienestar para organizaciones completas.',
    'personalized.business.plans.enterprise.price': 'Precios a Medida',
    'personalized.business.plans.enterprise.feature1': 'Manejo del estrés',
    'personalized.business.plans.enterprise.feature2': 'Auditorías ergonómicas',
    'personalized.business.plans.enterprise.feature3': 'Seguimiento de indicadores',
    'personalized.business.plans.enterprise.feature4': 'Días de terapia presencial',

    'adult.cta.desc': 'Empieza tu camino de bienestar con una sesión personalizada.',
    'adult.cta.title': '¿Lista para empezar?',
    'common.readyToStart': '¿Listo para empezar?',
    'common.bookConsultation':
      'Reserva tu consulta hoy y da el primer paso hacia una mejor salud y bienestar.',
    'common.bookNow': 'Reserva ahora',
    'common.contactUs': 'Contáctanos',
    'common.readMore': 'Leer más',
    'common.clickHere': 'Haz clic aquí',
    'whatsapp.booking': 'Hola, quiero reservar una sesión',
    'adult.recommended': 'Servicios recomendados',
    'adult.recommended.desc': 'Terapias seleccionadas para adultos y bienestar integral.',
    'booking.form.close': 'Cerrar formulario',
    'common.minutes': 'min',
    'common.notFound': 'No encontrado',
    'contact.form.emailPlaceholder': 'Tu correo electrónico',
    'contact.form.namePlaceholder': 'Tu nombre',
    'contact.form.title': 'Envíanos un mensaje',
    'contact.hours.saturday': 'Sábado: con cita previa',
    'contact.hours.sunday': 'Domingo: cerrado',
    'contact.hours.title': 'Horario',
    'contact.hours.weekdays': 'Lunes a viernes: 09:00 - 20:00',
    'contact.info.email': 'Correo electrónico',
    'contact.info.location': 'Ubicación',
    'contact.info.metro': 'Metro cercano',
    'contact.info.phone': 'Teléfono',
    'contact.info.response': 'Respuesta en menos de 24h',
    'contact.info.subtitle': 'Estamos aquí para ayudarte',
    'contact.info.title': 'Información de contacto',
    'contact.info.whatsapp': 'WhatsApp',
    'discounts.activeBadge': 'Activo',
    'discounts.apply': 'Aplicar',
    'discovery.tension.full': 'Todo el cuerpo',
    'discovery.tension.head': 'Cabeza',
    'discovery.tension.legs': 'Piernas',
    'discovery.tension.lumbar': 'Lumbares',
    'discovery.tension.neck': 'Cuello y hombros',
    'discovery.tension.none': 'Sin tensión principal',
    'elena.approach': 'Te ayudo a escuchar tu cuerpo y restaurar el equilibrio natural.',
    'footer.readyToBegin': '¿Lista para empezar?',
    'hero.badge': 'Bienestar somático y acompañamiento integrativo',
    'hero.subtitle':
      'Acompañamiento somático y de bienestar para mejorar movilidad, regular el estrés y recuperar equilibrio diario.',
    'hero.firstTime': '¿Es tu primera vez?',
    'kinesiology.page.availableToday': 'Disponible hoy',
    'kinesiology.page.bookSession': 'Reserva tu sesión',
    'kinesiology.page.durationsTitle': 'Duraciones disponibles',
    'kinesiology.page.testimonialsTitle': 'Testimonios',
    'nutrition.hero.badge': 'Nutrición funcional',
    'nutrition.page.availableToday': 'Disponible hoy',
    'nutrition.page.bookSession': 'Reserva tu sesión',
    'nutrition.page.durationsSubtitle': 'Elige la duración que mejor se adapte a ti.',
    'nutrition.page.durationsTitle': 'Duraciones disponibles',
    'nutrition.page.testimonialsTitle': 'Testimonios',
    'onboarding.userTypes.freeWoman': 'Mujer libre',
    'recommendations.kinesiology.emotional_description':
      'Regulación emocional para recuperar claridad y calma.',
    'recommendations.systemic.description': 'Trabajo sistémico para liberar bloqueos profundos.',
    'services.exploreOurServices': 'Explora nuestra gama de servicios integrales',
    'services.coreTitle': 'Terapias Integrales',
    'services.coreDesc': 'Desde masajes relajantes hasta terapias especializadas de kinesiología.',
    'services.descriptionPrefix':
      'Desde masajes relajantes hasta terapias especializadas de kinesiología.',
    'services.disclaimerBody':
      'Este contenido es informativo. Nuestros métodos son complementarios y no sustituyen la atención médica o psicológica.',
    'services.disclaimerPrefix': 'Aviso',
    'services.feldenkrais.title': 'Método Feldenkrais',
    'services.kinesiology.shortDesc': 'Equilibra cuerpo, mente y energía.',
    'services.nutrition.shortDesc': 'Nutrición funcional adaptada a tu caso.',
    'services.title': 'Sesiones personalizadas de bienestar',
    'services.subtitle':
      'Enfoque somático e integrativo para movilidad, regulación del estrés y equilibrio corporal.',
    'services.cta': 'Explorar sesiones',
    'problems.subtitle':
      'Situaciones frecuentes que acompañamos con enfoque complementario y personalizado.',
    'discovery.diagnosis.title': 'Valoración personalizada',
    'casos.treatment': 'Cómo te acompañamos',
    'technique.why': '¿Por qué esta técnica?',

    'nav.vip': 'VIP',
    'personalized.officeWorkers.method.title': 'Protocolo de Bienestar Corporativo',
    'personalized.officeWorkers.method.step1.title': 'Descompresión Postural',
    'personalized.officeWorkers.method.step1.desc':
      'Nos enfocamos en las líneas fasciales acortadas por estar sentado.',
    'personalized.officeWorkers.method.step2.title': 'Reinicio del Sistema Nervioso',
    'personalized.officeWorkers.method.step2.desc':
      'Cambiamos tu cuerpo del modo estrés al modo de recuperación.',
    'personalized.officeWorkers.method.step3.title': 'Realineamiento Ergonómico',
    'personalized.officeWorkers.method.step3.desc':
      'Integramos señales somáticas para mantener la alineación neutral.',
    'personalized.officeWorkers.benefits.title': 'Beneficios',
    'personalized.officeWorkers.benefit1': 'Alivio del dolor crónico de cuello.',
    'personalized.officeWorkers.benefit2': 'Mejora en la concentración.',
    'personalized.officeWorkers.benefit3': 'Menos fatiga al final del día.',
    'personalized.officeWorkers.benefit4': 'Mayor bienestar general.',
    'personalized.officeWorkers.faq.title': 'Preguntas Frecuentes',
    'personalized.officeWorkers.faq.q1': '¿Cuántas sesiones necesito?',
    'personalized.officeWorkers.faq.a1': 'Depende de tus necesidades específicas.',
    'personalized.officeWorkers.faq.q2': '¿Es doloroso?',
    'personalized.officeWorkers.faq.a2': 'No, es una técnica suave.',
    'personalized.officeWorkers.faq.q3': '¿Puedo hacerlo online?',
    'personalized.officeWorkers.faq.a3': 'Algunas prácticas sí.',

    'personalized.musicians.method.title': 'Optimización para Músicos',
    'personalized.musicians.method.step1.title': 'Liberación de Tensión',
    'personalized.musicians.method.step1.desc': 'Liberamos la tensión en áreas clave.',
    'personalized.musicians.method.step2.title': 'Conciencia Corporal',
    'personalized.musicians.method.step2.desc': 'Mejoramos la conciencia del cuerpo al tocar.',
    'personalized.musicians.method.step3.title': 'Alineación Natural',
    'personalized.musicians.method.step3.desc': 'Encontramos la postura ideal para tu instrumento.',
    'personalized.musicians.benefits.title': 'Beneficios',
    'personalized.musicians.benefit1': 'Mayor fluidez al tocar.',
    'personalized.musicians.benefit2': 'Prevención de lesiones.',
    'personalized.musicians.benefit3': 'Expresión musical libre.',
    'personalized.musicians.benefit4': 'Menor fatiga en ensayos largos.',
    'personalized.musicians.faq.title': 'Preguntas Frecuentes',
    'personalized.musicians.faq.q1': '¿Sirve para cualquier instrumento?',
    'personalized.musicians.faq.a1': 'Sí, se adapta a tu instrumento.',
    'personalized.musicians.faq.q2': '¿Necesito traer mi instrumento?',
    'personalized.musicians.faq.a2': 'Puede ser útil en algunas sesiones.',
    'personalized.musicians.faq.q3': '¿Mejora mi técnica?',
    'personalized.musicians.faq.a3': 'Mejora el soporte físico de tu técnica.',

    'personalized.athletes.method.title': 'Recuperación Deportiva',
    'personalized.athletes.method.step1.title': 'Evaluación Funcional',
    'personalized.athletes.method.step1.desc': 'Analizamos tus patrones de movimiento.',
    'personalized.athletes.method.step2.title': 'Normalización',
    'personalized.athletes.method.step2.desc': 'Restauramos el rango de movimiento óptimo.',
    'personalized.athletes.method.step3.title': 'Integración',
    'personalized.athletes.method.step3.desc': 'Integramos la mejora en tu gesto deportivo.',
    'personalized.athletes.benefits.title': 'Beneficios',
    'personalized.athletes.benefit1': 'Recuperación más rápida.',
    'personalized.athletes.benefit2': 'Mejora del rendimiento.',
    'personalized.athletes.benefit3': 'Prevención de sobrecargas.',
    'personalized.athletes.benefit4': 'Mayor conciencia cinética.',
    'personalized.athletes.faq.title': 'Preguntas Frecuentes',
    'personalized.athletes.faq.q1': '¿Cuándo es mejor agendar sesión?',
    'personalized.athletes.faq.a1': 'Dependiendo de tu ciclo de entrenamiento.',
    'personalized.athletes.faq.q2': '¿Es un masaje deportivo clásico?',
    'personalized.athletes.faq.a2': 'Es un enfoque más integral y neurológico.',
    'personalized.athletes.faq.q3': '¿Trata lesiones específicas?',
    'personalized.athletes.faq.a3': 'Acompaña la recuperación estructural.',

    'personalized.artists.hero.title': 'Artistas',
  },
  ru: {
    'common.enquireNow': 'Связаться',
    'personalized.business.bento.box1.details.title': 'Сплоченность Команды',
    'personalized.business.bento.box1.details.desc':
      'Наши специализированные мероприятия помогают растопить лед, наладить общение и создать крепкие связи.',
    'personalized.business.bento.box2.details.title': 'Осознанный Фокус',
    'personalized.business.bento.box2.details.desc':
      'Изучите техники для повышения личной результативности и эффективности команды в целом.',
    'personalized.business.bento.box3.details.title': 'Снятие Стресса',
    'personalized.business.bento.box3.details.desc':
      'Стратегии и практики для снижения давления и поддержания крепкого психического здоровья.',
    'personalized.business.bento.box4.details.title': 'Комплексная Среда',
    'personalized.business.bento.box4.details.desc':
      'Создайте рабочее пространство, которое естественным образом способствует благополучию.',
    'personalized.business.plans.teams.title': 'Команды / Стартапы',
    'personalized.business.plans.teams.desc':
      'Идеально подходит для небольших групп и отделов, стремящихся улучшить синхронизацию и производительность.',
    'personalized.business.plans.teams.price': 'От',
    'personalized.business.plans.teams.feature1': 'Индивидуальное тестирование',
    'personalized.business.plans.teams.feature2': 'Мероприятия по сплочению команды',
    'personalized.business.plans.teams.feature3': 'Разрешение конфликтов',
    'personalized.business.plans.teams.feature4': 'Улучшение операционной эффективности',
    'personalized.business.plans.title': 'Индивидуальные решения для организаций',
    'personalized.business.plans.subtitle':
      'Инвестируйте в физическое и психическое благополучие вашей команды для достижения максимальной продуктивности и гармонии.',
    'personalized.business.plans.enterprise.title': 'Предприятия / Корпорации',
    'personalized.business.plans.enterprise.desc':
      'Комплексная интеграция программ благополучия для целых организаций, стремящихся создать культуру здоровья.',
    'personalized.business.plans.enterprise.price': 'Индивидуальная цена',
    'personalized.business.plans.enterprise.feature1': 'Управление стрессом в компании',
    'personalized.business.plans.enterprise.feature2': 'Эргономический аудит',
    'personalized.business.plans.enterprise.feature3': 'Отслеживание показателей здоровья',
    'personalized.business.plans.enterprise.feature4': 'Регулярная терапия в офисе',

    'adult.cta.desc': 'Начните путь к благополучию с персональной сессии.',
    'adult.cta.title': 'Готовы начать?',
    'adult.recommended': 'Рекомендуемые услуги',
    'adult.recommended.desc': 'Подобранные терапии для взрослых и комплексного благополучия.',
    'booking.form.close': 'Закрыть форму',
    'common.minutes': 'мин',
    'common.notFound': 'Не найдено',
    'common.readyToStart': 'Готовы начать?',
    'common.bookConsultation':
      'Запишитесь на консультацию сегодня и сделайте первый шаг к лучшему здоровью и благополучию.',
    'common.bookNow': 'Забронировать',
    'common.contactUs': 'Связаться с нами',
    'common.readMore': 'Читать дальше',
    'common.clickHere': 'Нажмите здесь',
    'whatsapp.booking': 'Здравствуйте, я хочу забронировать сессию',
    'contact.form.emailPlaceholder': 'Ваш email',
    'contact.form.namePlaceholder': 'Ваше имя',
    'contact.form.title': 'Отправьте нам сообщение',
    'contact.hours.saturday': 'Суббота: по записи',
    'contact.hours.sunday': 'Воскресенье: выходной',
    'contact.hours.title': 'Часы работы',
    'contact.hours.weekdays': 'Понедельник - Пятница: 09:00 - 20:00',
    'contact.info.email': 'Email',
    'contact.info.location': 'Локация',
    'contact.info.metro': 'Ближайшее метро',
    'contact.info.phone': 'Телефон',
    'contact.info.response': 'Ответ в течение 24 часов',
    'contact.info.subtitle': 'Мы здесь, чтобы помочь',
    'contact.info.title': 'Контактная информация',
    'contact.info.whatsapp': 'WhatsApp',
    'discounts.activeBadge': 'Активно',
    'discounts.apply': 'Применить',
    'discovery.tension.full': 'Все тело',
    'discovery.tension.head': 'Голова',
    'discovery.tension.legs': 'Ноги',
    'discovery.tension.lumbar': 'Поясница',
    'discovery.tension.neck': 'Шея и плечи',
    'discovery.tension.none': 'Без основной зоны напряжения',
    'elena.approach': 'Я помогаю вам слышать тело и восстанавливать естественный баланс.',
    'footer.readyToBegin': 'Готовы начать?',
    'hero.badge': 'Соматическое здоровье и интегративная поддержка',
    'hero.subtitle':
      'Персонализированная соматическая поддержка для улучшения подвижности, снятия стресса и восстановления баланса.',
    'hero.firstTime': 'В первый раз?',
    'kinesiology.page.availableToday': 'Доступно сегодня',
    'kinesiology.page.bookSession': 'Забронировать сессию',
    'kinesiology.page.durationsTitle': 'Доступная длительность',
    'kinesiology.page.testimonialsTitle': 'Отзывы',
    'nutrition.hero.badge': 'Функциональное питание',
    'nutrition.page.availableToday': 'Доступно сегодня',
    'nutrition.page.bookSession': 'Забронировать сессию',
    'nutrition.page.durationsSubtitle': 'Выберите длительность, которая подходит вам лучше всего.',
    'nutrition.page.durationsTitle': 'Доступная длительность',
    'nutrition.page.testimonialsTitle': 'Отзывы',
    'onboarding.userTypes.freeWoman': 'Свободная женщина',
    'services.exploreOurServices': 'Изучите наш комплексный спектр услуг',
    'services.coreTitle': 'Комплексная терапия',
    'services.coreDesc': 'От расслабляющего массажа до специализированной кинезиологии.',
    'services.descriptionPrefix':
      'От расслабляющего массажа до специализированной кинезиологической терапии.',
    'recommendations.kinesiology.emotional_description':
      'Эмоциональная регуляция для ясности и внутреннего спокойствия.',
    'recommendations.systemic.description': 'Системная работа для снятия глубоких блоков.',
    'services.disclaimerBody':
      'Этот контент носит информационный характер. Наши методы являются дополнительными и не заменяют медицинскую или психологическую помощь.',
    'services.disclaimerPrefix': 'Важно',
    'services.feldenkrais.title': 'Метод Фельденкрайза',
    'services.kinesiology.shortDesc': 'Баланс тела, ума и энергии.',
    'services.nutrition.shortDesc': 'Функциональное питание под ваш запрос.',
    'services.title': 'Персональные сессии',
    'services.subtitle': 'Соматический и двигательный подход для регуляции стресса и баланса тела.',
    'services.cta': 'Узнать больше об услугах',
    'problems.subtitle':
      'Частые ситуации, в которых мы помогаем с помощью дополнительного подхода.',
    'discovery.diagnosis.title': 'Персональная оценка',
    'casos.treatment': 'Как мы помогаем',
    'technique.why': 'Почему эта техника?',

    'personalized.officeWorkers.method.title': 'Протокол Корпоративного Велнеса',
    'personalized.officeWorkers.method.step1.title': 'Постуральная Декомпрессия',
    'personalized.officeWorkers.method.step1.desc': 'Мы работаем с фасциальными линиями.',
    'personalized.officeWorkers.method.step2.title': 'Перезагрузка Нервной Системы',
    'personalized.officeWorkers.method.step2.desc': 'Переводим тело в режим восстановления.',
    'personalized.officeWorkers.method.step3.title': 'Эргономичное Выравнивание',
    'personalized.officeWorkers.method.step3.desc': 'Помогаем поддерживать нейтральное положение.',
    'personalized.officeWorkers.benefits.title': 'Преимущества',
    'personalized.officeWorkers.benefit1': 'Снятие болей в шее.',
    'personalized.officeWorkers.benefit2': 'Улучшение концентрации.',
    'personalized.officeWorkers.benefit3': 'Меньше усталости к концу дня.',
    'personalized.officeWorkers.benefit4': 'Общее улучшение самочувствия.',
    'personalized.officeWorkers.faq.title': 'Частые Вопросы',
    'personalized.officeWorkers.faq.q1': 'Сколько сеансов нужно?',
    'personalized.officeWorkers.faq.a1': 'Зависит от ваших конкретных нужд.',
    'personalized.officeWorkers.faq.q2': 'Это больно?',
    'personalized.officeWorkers.faq.a2': 'Нет, методики очень мягкие.',
    'personalized.officeWorkers.faq.q3': 'Можно ли онлайн?',
    'personalized.officeWorkers.faq.a3': 'Некоторые практики можно.',

    'personalized.musicians.method.title': 'Оптимизация для Музыкантов',
    'personalized.musicians.method.step1.title': 'Снятие Напряжения',
    'personalized.musicians.method.step1.desc': 'Работаем с ключевыми зонами напряжений.',
    'personalized.musicians.method.step2.title': 'Осознанность Тела',
    'personalized.musicians.method.step2.desc': 'Улучшаем осознанность при игре.',
    'personalized.musicians.method.step3.title': 'Естественное Выравнивание',
    'personalized.musicians.method.step3.desc': 'Находим идеальную позу.',
    'personalized.musicians.benefits.title': 'Преимущества',
    'personalized.musicians.benefit1': 'Больше свободы в игре.',
    'personalized.musicians.benefit2': 'Профилактика травм.',
    'personalized.musicians.benefit3': 'Свободное музыкальное выражение.',
    'personalized.musicians.benefit4': 'Меньше усталости на долгих репетициях.',
    'personalized.musicians.faq.title': 'Частые Вопросы',
    'personalized.musicians.faq.q1': 'Подходит для любого инструмента?',
    'personalized.musicians.faq.a1': 'Да, мы адаптируем под ваш инструмент.',
    'personalized.musicians.faq.q2': 'Нужно ли приносить инструмент?',
    'personalized.musicians.faq.a2': 'Иногда это бывает полезно.',
    'personalized.musicians.faq.q3': 'Улучшает ли это технику?',
    'personalized.musicians.faq.a3': 'Улучшает физическую базу для техники.',

    'personalized.athletes.method.title': 'Спортивное Восстановление',
    'personalized.athletes.method.step1.title': 'Функциональная Оценка',
    'personalized.athletes.method.step1.desc': 'Анализируем паттерны движений.',
    'personalized.athletes.method.step2.title': 'Нормализация',
    'personalized.athletes.method.step2.desc': 'Восстанавливаем амплитуду движений.',
    'personalized.athletes.method.step3.title': 'Интеграция',
    'personalized.athletes.method.step3.desc': 'Интеграция в спортивный жест.',
    'personalized.athletes.benefits.title': 'Преимущества',
    'personalized.athletes.benefit1': 'Более быстрое восстановление.',
    'personalized.athletes.benefit2': 'Повышение производительности.',
    'personalized.athletes.benefit3': 'Профилактика перегрузок.',
    'personalized.athletes.benefit4': 'Лучшее осознание тела.',
    'personalized.athletes.faq.title': 'Частые Вопросы',
    'personalized.athletes.faq.q1': 'Когда лучше приходить?',
    'personalized.athletes.faq.a1': 'В зависимости от тренировочного цикла.',
    'personalized.athletes.faq.q2': 'Это спортивный массаж?',
    'personalized.athletes.faq.a2': 'Это более комплексный подход.',
    'personalized.athletes.faq.q3': 'Лечите ли вы травмы?',
    'personalized.athletes.faq.a3': 'Мы сопровождаем структурное восстановление.',
  },
};

// Translation files
const translations: Record<Language, Record<string, string>> = {
  ca: {
    // Navigation
    'nav.home': 'Inici',
    'nav.services': 'Serveis',
    'nav.personalizedServices': 'Serveis personalitzats',
    'nav.revision360': 'Revisió 360°',
    'nav.vip': 'VIP',
    'nav.bookNow': 'Reservar cita',
    'nav.contact': 'Contacte',
    'nav.aboutElena': 'Sobre Elena',
    'nav.casos': 'Casos reals',

    'common.consultPrice': 'Consultar preu',
    'services.variableDuration': 'Variable',
    'services.mainBenefits': 'Beneficis principals',

    // Elena Section (Profile)
    'elena.greeting': "Hola, sóc l'Elena",
    'elena.name': 'Elena Kucherova',
    'elena.role': 'Especialista en integració somàtica i kinesiologia',
    'elena.bio':
      'La meva passió és ajudar les persones a recuperar la seva vitalitat natural a través de la connexió profunda amb el seu cos.',
    'elena.quote':
      'El cos té la capacitat innata de sanar-se; la meva feina és recordar-li com fer-ho.',
    'elena.description1':
      'Explora un enfocament únic que uneix la ciència moderna amb la saviesa somàtica ancestral.',
    'elena.description2':
      "Junts, crearem un camí personalitzat per alliberar tensions, restaurar l'equilibri i despertar el teu potencial de sanació.",
    'elena.knowMore': 'Més sobre mi',

    // Elena Approach & Targets
    'elena.approach.title': 'El mètode Elena Kucherova',
    'elena.approach.desc':
      "Al nucli del meu treball hi ha una profunda comprensió que el cos, el cervell i les emocions són un sistema unificat. No tracto símptomes, sinó que busco la seva causa arrel, ajudant l'organisme a restaurar la seva capacitat natural d'autoregulació. El meu mètode combina tècniques avançades de treball amb el cos i el sistema nerviós: Movement Lesson, JKA (Jeremy Krauss Approach), Child’Space, Feldenkrais i Biodinàmica. És una influència suau però poderosa que reentrena el sistema nerviós, allibera tensions profundes i restaura la facilitat de moviment i la claredat mental.",

    'elena.target.adults.title': 'Adults',
    'elena.target.adults.desc':
      "Per a aquells que senten fatiga crònica, mal d'esquena o coll, o els efectes de l'estrès i el trauma. T'ajudo a restaurar el teu estat de recursos, millorar la postura, alliberar bloquejos psicosomàtics i recuperar la lleugeresa en moure't. No és només un massatge o una teràpia; és un reinici del teu sistema nerviós per elevar la teva qualitat de vida.",

    'elena.target.children.title': 'Nens',
    'elena.target.children.desc':
      "Suport per a un desenvolupament harmoniós des dels primers dies. Treballo amb retards motors, alteracions posturals, hiperactivitat i dificultats d'aprenentatge. Mitjançant tècniques suaus, ajudo l'infant a sentir millor el seu cos, desenvolupant coordinació, seguretat i confiança en si mateix.",

    'elena.target.families.title': 'Famílies amb necessitats especials',
    'elena.target.families.desc':
      "Acompanyament integral per a famílies amb nens amb pc, síndromes genètics o altres necessitats del desenvolupament. Treballo no només amb l'infant perquè adquireixi noves habilitats de moviment i comunicació, sinó també amb els pares, ensenyant-vos a interactuar amb ell i a cuidar la vostra pròpia energia i benestar.",

    // Dropdown items
    'nav.officeWorkers': "Professionals d'oficina",
    'nav.athletes': 'Esportistes',
    'nav.artists': 'Artistes',
    'nav.musicians': 'Músics',
    'nav.students': 'Estudiants',

    // Hero Section
    'hero.title': 'EKA Balance',
    'home.founder': 'Fundadora i CEO',
    'home.elenaAlt': "Elena, terapeuta corporal d'EKA Balance",
    'home.viewAllServices': 'Veure tots els serveis',
    'home.elenaName': 'Elena Kucherova',
    'hero.title.part1': 'Troba alleujament del',
    'hero.title.part2': 'dolor i estrès',
    'hero.subtitle':
      "T'ajudem a sentir-te a gust amb el teu cos una altra vegada. Amb tractaments personalitzats i kinesiologia pràctica, trobem la causa real del malestar per retornar-te energia.",
    'hero.cta.primary': 'Reserva la teva sessió',
    'hero.cta.secondary': 'Descobreix el teu camí',
    'hero.badge': 'Excel·lència en salut integrativa',
    'hero.stats.clients': 'Clients satisfets',
    'hero.stats.experience': "Anys d'experiència",
    'hero.stats.rating': 'Valoració 5 estrelles',

    // About Section
    'about.badge': 'La meva trajectòria',
    'about.title': 'Elena Kucherova',
    'about.role': 'Especialista en integració somàtica i kinesiologia',
    'about.description1':
      'Amb més de 15 anys de pràctica clínica, he perfeccionat un mètode que va més enllà del tractament convencional. La meva missió és descodificar el llenguatge del teu cos per desbloquejar la seva capacitat innata de regeneració.',
    'about.description2':
      "Fusiono la precisió de la neurociència aplicada amb la profunditat de les teràpies manuals. Cada sessió és una intervenció estratègica en el teu sistema nerviós per desactivar patrons de dolor i restaurar l'equilibri vital.",
    'about.cta': 'Descobreix el mètode',

    // Services Section
    'services.badge': 'Excel·lència terapèutica',
    'services.title': "Intervencions d'alt impacte",
    'services.subtitle':
      'Protocols avançats que integren manipulació estructural, reequilibri neurològic i optimització metabòlica.',
    'services.cta': 'Explorar protocols',

    // Service: Massage
    'massage.title': 'Teràpia manual avançada',
    'massage.desc':
      "Reconstrucció de l'arquitectura corporal. Fusió de tècniques de teixit profund i alliberament miofascial per eliminar restriccions cròniques i recuperar la llibertat de moviment.",
    'massage.benefit1': 'Descompressió estructural',
    'massage.benefit2': 'Realineament postural',
    'massage.benefit3': 'Regulació del sistema nerviós',
    'massage.benefit4': 'Regeneració tissular',

    // Service: Kinesiology
    'kinesiology.title': 'Kinesiologia clínica',
    'kinesiology.desc':
      'Biofeedback de precisió. Utilitzem el test muscular neurològic per descodificar i corregir disfuncions estructurals, bioquímiques i emocionals en el seu origen.',
    'kinesiology.benefit1': 'Diagnòstic causal',
    'kinesiology.benefit2': 'Optimització neurològica',
    'kinesiology.benefit3': 'Integració estructural',
    'kinesiology.benefit4': 'Estabilitat sistèmica',

    // Service: Nutrition
    'nutrition.title': 'Nutrició funcional',
    'nutrition.desc':
      "Bioquímica per al rendiment. Estratègies nutricionals dissenyades per potenciar la funció cognitiva, l'estabilitat hormonal i la vitalitat cel·lular.",
    'nutrition.benefit1': 'Optimització metabòlica',
    'nutrition.benefit2': 'Salut de la microbiota',
    'nutrition.benefit3': 'Rendiment cognitiu',
    'nutrition.benefit4': 'Regulació hormonal',

    // Problems / Casos Section
    'problems.badge': 'Diagnòstic i resolució',
    'problems.title': 'Identificació de patologies',
    'problems.subtitle':
      "Abordatge clínic de les disfuncions més comunes mitjançant protocols d'integració somàtica.",

    // Problem: Back Pain
    'problems.backpain.title': 'Disfunció vertebral crònica',
    'problems.backpain.desc':
      'Compromís estructural persistent que limita la funcionalitat i el descans.',
    'problems.backpain.solution': 'Protocol clínic',
    'problems.backpain.solutionDesc':
      "Descompressió axial i reeducació neuromuscular per a l'estabilitat a llarg termini.",

    // Problem: Stress
    'problems.stress.title': 'Desregulació del sistema nerviós',
    'problems.stress.desc':
      'Hiperactivació simpàtica, ansietat sistèmica i alteració del cicle de son.',
    'problems.stress.solution': 'Protocol clínic',
    'problems.stress.solutionDesc': "Restauració del to vagal i modulació de la resposta d'estrès.",

    // Problem: Fatigue
    'problems.fatigue.title': 'Esgotament sistèmic',
    'problems.fatigue.desc': 'Dèficit energètic crònic i recuperació metabòlica ineficient.',
    'problems.fatigue.solution': 'Protocol clínic',
    'problems.fatigue.solutionDesc': 'Reactivació mitocondrial i desbloqueig de vies metabòliques.',

    // Problem: Injuries
    'problems.injuries.title': 'Traumatologia esportiva',
    'problems.injuries.desc': 'Limitacions biomecàniques que comprometen el rendiment atlètic.',
    'problems.injuries.solution': 'Protocol clínic',

    'problems.injuries.solutionDesc':
      'Rehabilitació funcional accelerada i prevenció de recaigudes.',

    // Casos Problems Details
    // Back Pain
    'casos.problems.backPain.symptom1':
      'Dolor punxant, rigidesa o tensió constant a la zona lumbar, dorsal o cervical.',
    'casos.problems.backPain.symptom2':
      'Limitació de moviment: dificultat per girar el coll, ajupir-se o aixecar els braços.',
    'casos.problems.backPain.symptom3':
      "Fatiga postural: cansament intens després d'estar assegut o dret durant períodes prolongats.",
    'casos.problems.backPain.symptom4':
      'Sensació de càrrega o pesadesa a les espatlles, trapezi i base del crani.',
    'casos.problems.backPain.cause1':
      'Postures mantingudes, ergonomia deficient i hàbits posturals compensatoris.',
    'casos.problems.backPain.cause2':
      'Càrrega emocional somatitzada (estrès, ansietat) que es manifesta com a tensió muscular.',
    'casos.problems.backPain.cause3': 'Sedentarisme i falta de to muscular o mobilitat articular.',
    'casos.problems.backPain.cause4':
      'Patrons respiratoris restringits que bloquegen el moviment natural de la columna.',
    'casos.problems.backPain.treatment':
      "Abordatge integral: massatge terapèutic profund, alliberament miofascial, kinesiologia per identificar l'origen (estructural, químic o emocional) i reeducació postural (Mètode Feldenkrais).",
    'casos.problems.backPain.results':
      "Alleujament immediat del dolor i la tensió. Recuperació de la mobilitat i l'agilitat. A llarg termini, una esquena més forta, flexible i lliure de dolor recurrent.",

    // Stress
    'casos.problems.stress.symptom1':
      'Soroll mental constant: dificultat per aturar els pensaments i desconnectar.',
    'casos.problems.stress.symptom2':
      "Incapacitat per relaxar-se, sensació d'alerta permanent o dificultat per agafar el son.",
    'casos.problems.stress.symptom3':
      'Símptomes físics: bruxisme, tensió cervical, opressió al pit o fatiga matinal.',
    'casos.problems.stress.symptom4':
      "Labilitat emocional: irritabilitat, ansietat o canvis d'humor sobtats.",
    'casos.problems.stress.cause1':
      'Sobrecàrrega de responsabilitats, pressió laboral o familiar i falta de límits.',
    'casos.problems.stress.cause2':
      'Desconnexió de les pròpies necessitats i manca de temps de qualitat per a un mateix.',
    'casos.problems.stress.cause3':
      'Traumes no processats o situacions vitals difícils que mantenen el sistema en alerta.',
    'casos.problems.stress.cause4':
      'Desregulació del sistema nerviós autònom (simpaticotonia crònica).',
    'casos.problems.stress.treatment':
      'Regulació del sistema nerviós: kinesiologia emocional, tècniques vagals, treball corporal suau (Feldenkrais) i respiració conscient per restablir la calma interna.',
    'casos.problems.stress.results':
      "Recuperació de la pau mental i l'equilibri emocional. Millora de la qualitat del son i la capacitat de gestió de l'estrès.Sensació de control i benestar profund.",

    // Digestive
    'casos.problems.digestive.symptom1':
      'Malestar digestiu: inflor, gasos, acidesa, reflux o pesadesa després dels àpats.',
    'casos.problems.digestive.symptom2':
      "Somnolència, boira mental o falta d'energia després de menjar.",
    'casos.problems.digestive.symptom3':
      'Irregularitat intestinal (restrenyiment o descomposició) i molèsties abdominals.',
    'casos.problems.digestive.symptom4':
      "Relació conflictiva amb el menjar o sospita d'intoleràncies.",
    'casos.problems.digestive.cause1':
      'Intoleràncies o sensibilitats alimentàries no diagnosticades.',
    'casos.problems.digestive.cause2':
      'Hàbits alimentaris inadequats: menjar ràpid, amb estrès o a deshores.',
    'casos.problems.digestive.cause3':
      "Eix intestí-cervell: l'estrès emocional impactant directament en la funció digestiva.",
    'casos.problems.digestive.cause4':
      'Disfuncions viscerals mecàniques o desequilibris de la microbiota.',
    'casos.problems.digestive.treatment':
      "Kinesiologia nutricional per testar aliments, massatge visceral per millorar la motilitat i pautes d'alimentació conscient i personalitzada.",
    'casos.problems.digestive.results':
      "Digestions lleugeres i sense molèsties. Desaparició de la inflor i recuperació de l'energia vital. Una relació sana i plaent amb l'alimentació.",

    // Migraines
    'casos.problems.migraines.symptom1':
      'Dolor pulsàtil intens, sovint unilateral, que pot afectar la visió.',
    'casos.problems.migraines.symptom2': 'Sensació de pressió al cap,"casc" o tensió ocular.',
    'casos.problems.migraines.symptom3': 'Símptomes associats: nàusees, vòmits o inestabilitat.',
    'casos.problems.migraines.symptom4':
      'Hipersensibilitat sensorial: molèstia a la llum (fotofòbia) o als sorolls (fonofòbia).',
    'casos.problems.migraines.cause1':
      'Tensió cervical crònica i bloquejos a la base del crani (suboccipitals).',
    'casos.problems.migraines.cause2':
      "Disfunció de l'ATM (bruxisme) que irradia dolor cap al cap.",
    'casos.problems.migraines.cause3':
      'Sobrecàrrega mental, estrès visual o falta de descans real.',
    'casos.problems.migraines.cause4':
      'Factors metabòlics: desequilibris hormonals, histamina o toxicitat hepàtica.',
    'casos.problems.migraines.treatment':
      'Teràpia manual cranial (Osteobalance), alliberament de la tensió cervical i mandibular, i regulació del sistema nerviós i hormonal amb kinesiologia.',
    'casos.problems.migraines.results':
      'Reducció dràstica de la freqüència i intensitat de les crisis. En molts casos, desaparició total del dolor. Major claredat mental i benestar.',

    // Low Energy
    'casos.problems.lowEnergy.symptom1':
      'Esgotament profund que no millora amb el descans (fatiga crònica).',
    'casos.problems.lowEnergy.symptom2':
      'Dificultat per concentrar-se, pèrdua de memòria o"boira mental".',
    'casos.problems.lowEnergy.symptom3': 'Apatia, falta de motivació o sensació de buit.',
    'casos.problems.lowEnergy.symptom4': 'Sensació de feblesa física o de"no poder amb tot".',
    'casos.problems.lowEnergy.cause1':
      'Burnout o estrès sostingut que ha esgotat les reserves del cos.',
    'casos.problems.lowEnergy.cause2':
      'Desequilibris nutricionals (dèficits de vitamines/minerals) o metabòlics.',
    'casos.problems.lowEnergy.cause3': "Disfunció de l'eix hormonal (fatiga adrenal, tiroides).",
    'casos.problems.lowEnergy.cause4':
      "Bloquejos emocionals o falta de propòsit vital que drenen l'energia.",
    'casos.problems.lowEnergy.treatment':
      "Revitalització integral: kinesiologia per detectar fugues d'energia, suport nutricional, i treball corporal per reactivar el flux vital.",
    'casos.problems.lowEnergy.results':
      "Recuperació de la vitalitat i l'entusiasme. Ment clara i desperta. Capacitat per afrontar el dia a dia amb energia i alegria.",

    // Discovery New Keys
    'discovery.step.description.minChars': 'caràcters mínim',
    'discovery.recommendation.online.note':
      "Nota: Com que has seleccionat Online, aquest servei s'adapta per a sessions remotes.",

    // Sleep
    'casos.problems.sleep.symptom1':
      'Insomni de conciliació: donar voltes al llit sense poder adormir-se.',
    'casos.problems.sleep.symptom2': "Despertars nocturns freqüents o despertar-se massa d'hora.",
    'casos.problems.sleep.symptom3':
      'Son no reparador: despertar-se cansat, amb tensió o mal de cap.',
    'casos.problems.sleep.symptom4':
      "Activitat mental incessant o ansietat al moment d'anar a dormir.",
    'casos.problems.sleep.cause1':
      "Hiperactivació del sistema nerviós (estat d'alerta) que impedeix el descans.",
    'casos.problems.sleep.cause2': 'Desregulació dels ritmes circadians (horaris, llum blava).',
    'casos.problems.sleep.cause3': 'Hàbits de son inadequats o entorn poc propici.',
    'casos.problems.sleep.cause4':
      'Causes orgàniques: digestions pesades, dolor crònic o desequilibris hormonals.',
    'casos.problems.sleep.treatment':
      "Reeducació del son: tècniques de relaxació profunda, regulació del sistema nerviós (vagal), i pautes d'higiene del son personalitzades.",
    'casos.problems.sleep.results':
      "Son profund, continu i reparador. Despertar-se amb energia i sensació de descans real. Millora de l'estat d'ànim i la salut global.",

    // Recovery
    'casos.problems.recovery.symptom1':
      'Dolor persistent o molèsties en una zona lesionada antigament.',
    'casos.problems.recovery.symptom2':
      'Limitació de mobilitat, rigidesa o sensació de fragilitat.',
    'casos.problems.recovery.symptom3': 'Por a fer certs moviments o a recaure (kinesiofòbia).',
    'casos.problems.recovery.symptom4':
      'Compensacions posturals que generen dolor en altres zones.',
    'casos.problems.recovery.cause1':
      'Teixit cicatricial (adherències) que limita el moviment i atrapa nervis.',
    'casos.problems.recovery.cause2':
      'Patrons de moviment alterats per protegir la lesió (compensacions).',
    'casos.problems.recovery.cause3':
      'Trauma cel·lular o memòria del dolor que manté la zona en alerta.',
    'casos.problems.recovery.cause4': 'Rehabilitació incompleta o precipitada.',
    'casos.problems.recovery.treatment':
      'Recuperació funcional: tractament de cicatrius, reeducació del moviment (Feldenkrais), i treball emocional per alliberar la memòria del trauma.',
    'casos.problems.recovery.results':
      "Recuperació total de la funcionalitat i la confiança en el cos. Moviment lliure, fluid i sense dolor. Retorn a l'activitat normal amb seguretat.",

    // Contact Form
    'contact.success.title': 'Missatge enviat correctament!',
    'contact.success.message':
      'Gràcies per contactar amb nosaltres. Ens posarem en contacte amb tu molt aviat.',
    'contact.success.button': 'Enviar un altre missatge',
    'contact.title': 'Parla amb nosaltres',
    'contact.subtitle':
      'Estem aquí per ajudar-te en el teu camí cap al benestar. Contacta amb nosaltres i descobreix com podem millorar la teva qualitat de vida.',
    'contact.phone.title': 'Telèfon i WhatsApp',
    'contact.phone.subtitle': 'WhatsApp disponible 24/7',
    'contact.email.title': 'Email',
    'contact.email.subtitle': 'Resposta en menys de 24h',
    'contact.location.title': 'Ubicació',
    'contact.location.address': 'Carrer Pelai, 12\n08001 Barcelona',
    'contact.location.subtitle': 'Metro: l1 i l2 (universitat)',
    'contact.form.name': 'Nom complet',
    'contact.form.email': 'Correu electrònic',
    'contact.form.phone': 'Telèfon',
    'contact.form.service': "Servei d'interès",
    'contact.form.service.placeholder': 'Selecciona un servei',
    'contact.form.time': 'Horari preferent',
    'contact.form.time.placeholder': 'Selecciona un horari',
    'contact.form.message': 'Missatge',
    'contact.form.message.placeholder': "Explica'ns breument què necessites...",
    'contact.form.preferred': 'Mètode de contacte preferit',
    'contact.form.submit': 'Enviar missatge',
    'contact.form.submitting': 'Enviant...',
    'contact.form.privacy': 'Accepto la política de privacitat',
    'contact.form.source': 'Com ens has conegut?',
    'contact.form.source.placeholder': 'Selecciona una opció',
    'contact.form.source.google': 'Google',
    'contact.form.source.social': 'Xarxes socials',
    'contact.form.source.friend': "Recomanació d'un amic",
    'contact.form.source.other': 'Altres',
    'contact.quick.title': "O contacta'ns directament:",
    'contact.quick.call': 'Trucar ara',
    'contact.error': 'Hi ha hagut un error al enviar el missatge. Si us plau, torna-ho a intentar.',

    // Contact Form Options
    'contact.service.massageBasic': 'Massatge bàsic (1h)',
    'contact.service.massageComplete': 'Massatge complet (1,5h)',
    'contact.service.massagePremium': 'Massatge premium (2h)',
    'contact.service.kinesiology': 'Kinesiologia holística',
    'contact.service.nutrition': 'Nutrició conscient',
    'contact.service.revision360': 'Revisió 360°',
    'contact.service.vip': 'Plans VIP',
    'contact.service.other': 'Altres consultes',

    'contact.time.morning': 'Matí (9:00 - 12:00)',
    'contact.time.noon': 'Migdia (12:00 - 15:00)',
    'contact.time.afternoon': 'Tarda (15:00 - 18:00)',
    'contact.time.evening': 'Vespre (18:00 - 21:00)',
    'contact.time.any': 'Sense preferència',

    // Symptoms, causes, treatment, results labels
    'casos.symptoms': 'Símptomes',
    'casos.causes': 'Causes',
    'casos.treatment': "Com t'ajudem",
    'casos.results': 'Resultats',

    // Additional problems list
    'casos.additionalProblems.bruxism': 'Bruxisme i tensió mandibular',
    'casos.additionalProblems.tmj': "Dolor d'ATM (articulació temporomandibular)",
    'casos.additionalProblems.sciatica': 'Ciàtica i dolor de cames',
    'casos.additionalProblems.shoulderPain': "Dolor d'espatlles i rigidesa",
    'casos.additionalProblems.dizziness': 'Marejos i vèrtigos',
    'casos.additionalProblems.irritability': 'Irritabilitat constant',
    'casos.additionalProblems.intestinalProblems': 'Problemes intestinals',
    'casos.additionalProblems.chronicFatigue': 'Fatiga crònica',
    'casos.additionalProblems.socialAnxiety': 'Ansietat social',
    'casos.additionalProblems.concentrationDifficulty': 'Dificultat per concentrar-se',
    'casos.additionalProblems.headaches': 'Mals de cap i migranyes',
    'casos.additionalProblems.insomnia': 'Insomni i trastorns del son',
    'casos.additionalProblems.posture': 'Problemes posturals',
    'casos.additionalProblems.contractures': 'Contractures musculars',
    'casos.additionalProblems.emotionalBlock': 'Bloquejos emocionals',
    'casos.additionalProblems.rsi': 'Lesions per esforç repetitiu',
    'casos.additionalProblems.carpalTunnel': 'Síndrome del túnel carpià',
    'casos.additionalProblems.plantarFasciitis': 'Fascitis plantar',

    // Testimonials
    'testimonials.title': 'Testimonis dels nostres clients',
    'testimonials.subtitle':
      'Descobreix les experiències reals de persones que han transformat les seves vides',
    'testimonials.all': 'Tots',
    'testimonials.hide': 'Ocultar',
    'testimonials.show': 'Veure',
    'testimonials.beforeAfter': 'Abans/després',
    'testimonials.before': 'Abans',
    'testimonials.after': 'Després',
    'testimonials.also': 'També a:',
    'testimonials.with': 'Amb',
    'testimonials.ratings': 'Valoracions',
    'testimonials.externalReviews': 'Pots llegir més valoracions a les nostres pàgines externes',
    'testimonials.photo': 'Foto de',
    'testimonials.satisfiedClient': 'Client satisfet',
    'testimonials.sliderTitle': 'Testimonis que parlen per si sols',
    'testimonials.sliderSubtitle':
      'Descobreix com hem ajudat als nostres clients a assolir el seu benestar',

    // Offline
    'offline.message': 'Sense connexió a internet',

    // Discounts page
    'discounts.pageTitle': 'Descomptes - EKA Balance',
    'discounts.pageDescription':
      'Descobreix els nostres descomptes especials per a serveis de benestar i teràpies',
    'discounts.badge': 'Ofertes especials',
    'discounts.title': 'Descomptes especials',
    'discounts.subtitle':
      'Gaudeix de preus reduïts en els nostres serveis de benestar amb els nostres descomptes exclusius',
    'discounts.availableTitle': 'Descomptes disponibles',
    'discounts.availableSubtitle':
      'Aprofita aquestes ofertes especials per començar el teu camí cap al benestar',

    // SEO
    'seo.home.title':
      'EKA Balance - centre de teràpies holístiques a Barcelona | massatge & kinesiologia',
    'seo.home.description':
      'Descobreix el benestar integral a EKA Balance. Especialistes en massatge terapèutic, kinesiologia i Osteobalance a Barcelona. Reserves per WhatsApp/Telegram 658867133.',
    'seo.home.keywords':
      'Massatge terapèutic Barcelona, kinesiologia Barcelona, Osteobalance, centre teràpies holístiques, benestar integral, relaxació Barcelona, plaça universitat',
    'seo.contact.title': 'Contacte - EKA Balance | centre de teràpies holístiques a Barcelona',
    'seo.contact.description':
      'Contacta amb EKA Balance per reserves i consultes. Centres a Barcelona i Rubí. Telefon +34 658 867 133, email contact@ekabalance.com',
    'seo.contact.keywords':
      'Contacte EKA Balance, reserves massatge Barcelona, teràpies holístiques Rubí, centre benestar Barcelona',
    'seo.services.title': 'Serveis de teràpies holístiques a Barcelona | EKA Balance',
    'seo.services.description':
      'Descobreix els nostres serveis: massatge terapèutic, kinesiologia, nutrició conscient i revisió 360°. Espai de benestar integral a Barcelona.',
    'seo.services.keywords':
      'Serveis terapèutics Barcelona, massatge, kinesiologia, nutrició, revisió integral, teràpies holístiques',
    'seo.personalized.title': 'Serveis personalitzats - EKA Balance Barcelona',
    'seo.personalized.description':
      "Tria el servei que més s'adapta a tu: treballadors d'oficina, esportistes, artistes, músics i estudiants.Cuida el teu cos amb teràpies personalitzades.",
    'seo.personalized.keywords':
      'Serveis personalitzats Barcelona, massatge oficina, esportistes, artistes, músics, estudiants',
    'seo.vip.title': 'Inner circle VIP - experiència premium exclusiva | EKA Balance',
    'seo.vip.description':
      "Uneix-te al cercle interior VIP d'EKA Balance. Plans Bronze, Silver i Gold Elite amb beneficis exclusius, atenció 24/7 i experiències personalitzades.",
    'seo.vip.keywords':
      'VIP elite Barcelona, plans exclusius salut, cercle interior wellness, control salut premium',
    'seo.massage.title': 'Massatge terapèutic i relaxant a Barcelona | EKA Balance',
    'seo.massage.description':
      'Massatge terapèutic professional a Barcelona. Allibera tensions, cuida el teu cos i relaxa la ment. Sessions de 60, 90 i 120 minuts. Reserva ara.',

    'seo.students.title':
      "Teràpies per a estudiants - gestió de l'Estrès i Concentració | EKA Balance",
    'seo.students.description':
      "Serveis especialitzats per a estudiants: reducció de l'estrès mental, millora de la concentració i gestió de l'ansietat acadèmica. Kinesiologia i massatge per a ments joves i curioses.",
    'seo.students.keywords':
      'Teràpies estudiants, estrès estudis, concentració, ansietat acadèmica, kinesiologia estudiants, massatge relaxant Barcelona',

    'seo.officeWorkers.title':
      "Teràpies per a treballadors d'Oficina - Dolor Cervical i Postura | EKA Balance",
    'seo.officeWorkers.description':
      "Serveis especialitzats per a professionals d'oficina: alleujar dolor cervical, corregir postura, reduir estrès tecnològic.Massatge terapèutic i Feldenkrais per a qui passa hores davant l'ordinador.",
    'seo.officeWorkers.keywords':
      'Dolor cervical oficina, postura ordinador, estrès tecnològic, massatge terapèutic, Feldenkrais Barcelona, treballadors oficina',

    'seo.musicians.title':
      'Teràpies per a músics - expressió corporal i flow musical | EKA Balance',
    'seo.musicians.description':
      "Serveis especialitzats per a músics: millora de l'expressió corporal, gestió de l'ansietat escènica, optimització del flow musical. Feldenkrais i kinesiologia per a artistes del so.",
    'seo.musicians.keywords':
      'Teràpies músics, expressió corporal, ansietat escènica, flow musical, Feldenkrais músics, kinesiologia performance Barcelona',

    'seo.artists.title': 'Teràpies per a artistes - creativitat i benestar | EKA Balance',
    'seo.artists.description':
      "Serveis per a artistes de totes les disciplines. Desbloqueja la teva creativitat, redueix l'estrès i millora la teva expressió artística.",
    'seo.artists.keywords':
      'Teràpies artistes, creativitat, benestar emocional, expressió artística, artteràpia Barcelona',

    'seo.adults.title': 'Benestar integral per a adults - salut i equilibri | EKA Balance',
    'seo.adults.description':
      "Tractaments personalitzats per a adults: gestió de l'estrès, dolor crònic i millora de la qualitat de vida.Massatge, kinesiologia i més.",
    'seo.adults.keywords':
      'Benestar adults, gestió estrès, dolor crònic, massatge terapèutic, kinesiologia Barcelona',

    'seo.children.title': 'Teràpies per a nens - desenvolupament i creixement | EKA Balance',
    'seo.children.description':
      "Suport al desenvolupament infantil a través de kinesiologia i mètodes suaus. Ajudem en problemes d'aprenentatge, emocionals i de coordinació.",
    'seo.children.keywords':
      'Teràpies nens, desenvolupament infantil, kinesiologia nens, problemes aprenentatge, coordinació psicomotriu Barcelona',

    'seo.families.title': 'Benestar per a famílies - harmonia i connexió | EKA Balance',
    'seo.families.description':
      "Espai de salut per a tota la família. Millora la convivència, redueix tensions i troba l'equilibri familiar amb les nostres teràpies sistèmiques.",
    'seo.families.keywords':
      'Benestar familiar, teràpia familiar, harmonia llar, kinesiologia familiar, relacions pares fills Barcelona',

    'seo.athletes.title': 'Teràpies per a esportistes - recuperació i rendiment | EKA Balance',
    'seo.athletes.description':
      'Serveis especialitzats per a atletes: recuperació muscular, prevenció de lesions, millora del rendiment esportiu. Massatge esportiu i Osteobalance per a qui no pot parar.',
    'seo.athletes.keywords':
      'Recuperació esportistes, massatge esportiu, Osteobalance, prevenció lesions, rendiment atletes Barcelona',

    'seo.parents.title':
      'Teràpies per a pares i mares - recuperar energia i equilibri | EKA Balance',
    'seo.parents.description':
      'Serveis especialitzats per a pares i mares: recuperar energia, pau i claredat per poder cuidar sense buidar-se. Kinesiologia emocional i massatge relaxant per a qui cuida de tothom.',
    'seo.parents.keywords':
      'Teràpies pares mares, recuperar energia, kinesiologia emocional, equilibri familiar, cuidadors Barcelona',
    'seo.massage.keywords':
      'Massatge terapèutic Barcelona, massatge relaxant, contractures, dolor muscular, estrès, plaza universitat',
    'seo.kinesiology.title': 'Kinesiologia holística a Barcelona | EKA Balance',
    'seo.kinesiology.description':
      "Kinesiologia holística professional a Barcelona. Troba l'equilibri entre cos, ment i emocions. Sessions de 60 i 90 minuts. Reserva ara.",
    'seo.kinesiology.keywords':
      'Kinesiologia Barcelona, equilibri emocional, test muscular, bloquejos emocionals, postura, coordinació',
    'seo.nutrition.title': 'Assessorament nutricional personalitzat a Barcelona | EKA Balance',
    'seo.nutrition.description':
      'Nutrició conscient i personalitzada a Barcelona. Menjar bé per viure millor. Sessió inicial i seguiment personalitzat. Reserva ara.',
    'seo.nutrition.keywords':
      'Nutrició Barcelona, assessorament nutricional, hàbits alimentaris, energia, gestió pes, salut alimentària',

    // Massage Page
    'massage.hero.badge': 'Benestar per al cos i la ment',
    'massage.benefits.pain': 'Alleuja el dolor muscular i articular',
    'massage.benefits.circulation': 'Millora la circulació i la mobilitat',
    'massage.benefits.wellbeing': 'Benestar immediat i descans de veritat',

    // Kinesiology Page
    'kinesiology.hero.badge': 'Cos, ment i emocions en equilibri',
    'kinesiology.benefits.posture': 'Millora la postura i la coordinació',
    'kinesiology.benefits.stress': "Redueix l'estrès i millora el descans",
    'kinesiology.benefits.energy': 'Més autoconeixement i energia estable',

    // Nutrition Page
    'nutrition.benefits.habits': 'Hàbits alimentaris clars i sostenibles',
    'nutrition.benefits.weight': 'Suport en la gestió del pes i la composició corporal',
    'nutrition.benefits.prevention': 'Prevenció i salut a llarg termini',
    'nutrition.session.first.name': 'Primera sessió',
    'nutrition.session.first.description': 'Avaluació completa i pla personalitzat',
    'nutrition.session.followup.name': 'Seguiment',
    'nutrition.session.followup.description': 'Ajust del pla i resolució de dubtes',

    // Discounts Page
    'discounts.success': 'Descompte aplicat correctament!',
    'discounts.active': 'Actiu - {percentage}% de descompte aplicat a tots els preus',
    'discounts.remove': 'Treure descompte',

    // Discovery Form
    // Discovery Form - User Types
    'discovery.userTypes.mother.title': 'Maternitat / paternitat',
    'discovery.userTypes.mother.desc':
      "Restauració de l'energia vital per sostenir la cura dels altres.",
    'discovery.userTypes.woman.title': 'Salut femenina',
    'discovery.userTypes.woman.desc': 'Harmonització del cicle i reconnexió somàtica.',
    'discovery.userTypes.regular.title': 'Benestar general',
    'discovery.userTypes.regular.desc': 'Manteniment preventiu i relaxació profunda.',
    'discovery.userTypes.office.title': 'Perfil executiu',
    'discovery.userTypes.office.desc': "Descompressió de l'estrès corporatiu i postural.",
    'discovery.userTypes.athlete.title': 'Rendiment esportiu',
    'discovery.userTypes.athlete.desc': 'Optimització biomecànica i recuperació activa.',

    // Discovery Form - Emotional States
    'discovery.emotional.stressed.title': 'Sobrecàrrega del sistema',
    'discovery.emotional.stressed.desc': "Estat d'alerta constant i tensió acumulada.",
    'discovery.emotional.sad.title': 'Baixa energia vital',
    'discovery.emotional.sad.desc': 'Necessitat de reactivació i desbloqueig.',
    'discovery.emotional.balanced.title': 'Estabilitat relativa',
    'discovery.emotional.balanced.desc': 'Foc en el manteniment i la prevenció.',
    'discovery.emotional.focus_physical.title': 'Enfocament somàtic',
    'discovery.emotional.focus_physical.desc': "Prioritat en l'alleujament estructural i muscular.",

    // Discovery Form - Time Commitments
    'discovery.time.short.title': 'Sessió standard (1.5h)',
    'discovery.time.short.desc': 'Intervenció focalitzada i eficient.',
    'discovery.time.standard.title': 'Sessió completa (90 min)',
    'discovery.time.standard.desc': 'Tractament profund i integratiu.',
    'discovery.time.long.title': 'Immersió terapèutica (120 min)',
    'discovery.time.long.desc': 'Transformació integral i detallada.',

    // Discovery Form - Budget
    'discovery.budget.basic.title': 'Fins a 60€',
    'discovery.budget.basic.desc': 'Opció bàsica',
    'discovery.budget.standard.title': '60€ - 75€',
    'discovery.budget.standard.desc': 'Fins a 2h, modalitat plena',
    'discovery.budget.premium.title': 'Més de 75€',
    'discovery.budget.premium.desc': 'Sessió llarga premium',

    // Discovery Form - Recommendations
    'discovery.recommendation.emotional.service': 'Reequilibri emocional',
    'discovery.recommendation.emotional.desc':
      'Teràpia holística per gestionar estrès, ansietat o tristesa. Se centra a superar problemes emocionals i recuperar harmonia i felicitat.',
    'discovery.recommendation.emotional.benefit1': "Reducció de l'estrès",
    'discovery.recommendation.emotional.benefit2': 'Equilibri emocional',
    'discovery.recommendation.emotional.benefit3': 'Claredat mental',
    'discovery.recommendation.emotional.benefit4': 'Pau interior',

    'discovery.recommendation.manual.service': 'Sessió terapèutica manual',
    'discovery.recommendation.manual.desc':
      "Massatge terapèutic especialitzat per alleujar dolor i tensions musculars. Professionals amb experiència t'ajudaran a relaxar contractures.",
    'discovery.recommendation.manual.benefit1': 'Alleujament del dolor',
    'discovery.recommendation.manual.benefit2': 'Reducció de contractures',
    'discovery.recommendation.manual.benefit3': 'Millora de la mobilitat',
    'discovery.recommendation.manual.benefit4': 'Relaxació muscular',

    'discovery.recommendation.integrative.service': 'Alleujament tensional integratiu (4 en 1)',
    'discovery.recommendation.integrative.desc':
      'Combina massatge, kinesiologia, osteopatia i moviments (Feldenkrais) per un alleujament profund de tensions cròniques.',
    'discovery.recommendation.integrative.benefit1': 'Tractament integral',
    'discovery.recommendation.integrative.benefit2': 'Alleujament profund',
    'discovery.recommendation.integrative.benefit3': 'Combinació de tècniques',
    'discovery.recommendation.integrative.benefit4': 'Resultats duradors',

    'discovery.recommendation.relax.service': 'Massatge relaxant complet',
    'discovery.recommendation.relax.desc':
      'Experiència de relaxació global (física i mental), ideal si el teu objectiu és senzillament descansar i recarregar energies.',
    'discovery.recommendation.relax.benefit1': 'Relaxació profunda',
    'discovery.recommendation.relax.benefit2': "Reducció de l'estrès",
    'discovery.recommendation.relax.benefit3': "Renovació d'energia",
    'discovery.recommendation.relax.benefit4': 'Benestar general',

    // Online Rec
    'discovery.recommendation.online.service': 'Consulta online / assessorament',
    'discovery.recommendation.online.desc':
      'Rep orientació personalitzada sense desplaçar-te. Ideal per a seguiment, consell nutricional o dubtes.',
    'discovery.recommendation.online.benefit1': 'Sense desplaçaments',
    'discovery.recommendation.online.benefit2': 'Horari flexible',
    'discovery.recommendation.online.benefit3': 'Seguiment continu',
    'discovery.recommendation.online.benefit4': 'Pla personalitzat en pdf',

    'discovery.recommendation.title': 'Recomanació personalitzada - EKA Balance',
    'discovery.recommendation.badge': 'Recomanació personalitzada',
    'discovery.recommendation.subtitle':
      'Basat en les teves respostes, creiem que aquest és el millor servei per a tu:',
    'discovery.recommendation.why': 'Per què aquesta opció?',
    'discovery.analysis.intro': 'Hem identificat que',
    'discovery.analysis.have': 'Tens',
    'discovery.analysis.want': 'I vols millorar',
    'discovery.analysis.feel': 'Per sentir-te',
    'discovery.diagnosis.title': 'Fitxa de valoració avançada',
    'discovery.diagnosis.profile': 'Perfil del client',
    'discovery.diagnosis.symptoms': 'Indicadors identificats',
    'discovery.diagnosis.rootCause': 'Possibles causes arrel',
    'discovery.diagnosis.strategy': 'Estratègia recomanada',
    'discovery.diagnosis.frequency': 'Freqüència suggerida',
    'discovery.view.basic': 'Recomanació simple',
    'discovery.view.advanced': 'Valoració completa',
    'discovery.diagnosis.cause.posture': 'Fatiga postural (sedentarisme)',
    'discovery.diagnosis.cause.overload': 'Sobrecàrrega muscular',
    'discovery.diagnosis.cause.stress': 'Tensió psicosomàtica',
    'discovery.diagnosis.cause.emotional': 'Bloqueig emocional',
    'discovery.diagnosis.cause.metabolic': 'Desequilibri metabòlic/digestiu',
    'discovery.diagnosis.cause.structural': 'Desequilibri estructural/mecànic',
    'discovery.diagnosis.cause.general': 'Necessitat de manteniment/prevenció',
    'discovery.diagnosis.strategy.structural': 'Alliberament estructural i mobilitat',
    'discovery.diagnosis.strategy.regulation': 'Regulació del sistema nerviós',
    'discovery.diagnosis.strategy.rebalance': 'Reequilibri cos-ment',
    'discovery.diagnosis.freq.high': 'Intensiu (1 sessió/setmana durant 3 setmanes)',
    'discovery.diagnosis.freq.medium': 'Manteniment (1 sessió cada 2-3 setmanes)',
    'discovery.diagnosis.freq.low': 'Preventiu (1 sessió al mes)',
    'discovery.goal.athlete': 'La teva recuperació esportiva',
    'discovery.goal.office': 'La teva postura',
    'discovery.goal.stress': 'La teva tranquil·litat',
    'discovery.goal.pain': 'El teu confort físic',
    'discovery.goal.general': 'El teu benestar general',
    'discovery.feeling.relaxed': 'Relaxat/da',
    'discovery.feeling.energized': 'Amb energia',
    'discovery.feeling.balanced': 'En equilibri',
    'discovery.feeling.painfree': 'Sense dolor',
    'discovery.recommendation.book': 'Reservar aquesta sessió',
    'discovery.recommendation.restart': 'Tornar a començar',

    // Discovery Form - Steps
    'discovery.step1.title': 'Com et defineixes?',
    'discovery.step1.subtitle': "Selecciona l'opció que millor et descrigui",
    'discovery.step2.title': 'On sents més tensió?',
    'discovery.step2.subtitle': 'Pots seleccionar múltiples opcions',
    'discovery.step3.title': 'Tens alguna condició especial?',
    'discovery.step3.subtitle': 'Això ens ajuda a adaptar la sessió',
    'discovery.step4.title': 'Com et sents emocionalment?',
    'discovery.step4.subtitle': 'El benestar emocional és clau per a la salut física',
    'discovery.step5.title': 'Quant temps tens disponible?',
    'discovery.step5.subtitle': 'Adaptem la sessió al teu horari',
    'discovery.step6.title': 'Quin és el teu pressupost?',
    'discovery.step6.subtitle': 'Trobarem la millor opció per a tu',
    'discovery.next': 'Següent',
    'discovery.back': 'Enrere',
    'discovery.seeRecommendation': 'Veure recomanació',
    'common.step': 'Pas',
    'common.of': 'De',

    // Office Workers
    'office.seo.title': "Serveis per a treballadors d'Oficina - EKA Balance Barcelona",
    'office.seo.desc':
      "Teràpies especialitzades per a treballadors d'oficina: alleuja tensions, millora postura i gestiona l'estrès laboral. Sessions d'1 hora per 70€.",
    'office.seo.keywords':
      'Massatge oficina Barcelona, estrès laboral, dolor esquena ordinador, kinesiologia treballadors',

    // Athletes SEO
    'athletes.seo.title': 'Serveis per a esportistes - EKA Balance Barcelona',
    'athletes.seo.desc':
      "Teràpies especialitzades per esportistes: recuperació muscular, millora de flexibilitat i gestió d'estrès pre-competició. Sessions d'1 hora per 70€.",
    'athletes.seo.keywords':
      'Massatge esportistes Barcelona, recuperació muscular, flexibilitat esportiva, estrès competició',

    // Artists SEO
    'artists.seo.title': 'Serveis per a artistes - EKA Balance Barcelona',
    'artists.seo.desc':
      "Teràpies per a artistes visuals i creadors: cura de mans, millora postural i desbloqueig creatiu. Sessions d'1 hora per 70€.",
    'artists.seo.keywords':
      'Massatge artistes Barcelona, dolor mans artistes, postura creativa, bloqueig creatiu',

    // Musicians SEO
    'musicians.seo.title': 'Serveis per a músics - EKA Balance Barcelona',
    'musicians.seo.desc':
      "Teràpies especialitzades per a músics: prevenció de lesions, millora tècnica i gestió de l'ansietat escènica. Sessions d'1 hora per 70€.",
    'musicians.seo.keywords':
      'Fisioteràpia músics Barcelona, lesions músics, ansietat escènica, tècnica musical',

    // Students SEO
    'students.seo.title': 'Serveis per a estudiants - EKA Balance Barcelona',
    'students.seo.desc':
      "Teràpies per a estudiants: gestió de l'estrès d'exàmens, millora de la concentració i correcció postural. Sessions d'1 hora per 70€.",
    'students.seo.keywords':
      'Estrès exàmens Barcelona, concentració estudi, postura estudiants, ansietat acadèmica',

    'office.problems.pain.title': 'Dolor postural',
    'office.problems.pain.desc':
      "Dolor al coll, espatlles i esquena per postures incorrectes davant l'ordinador",
    'office.problems.stress.title': 'Estrès laboral',
    'office.problems.stress.desc':
      'Pressió constant, deadlines i excés de responsabilitats que afecten el benestar',
    'office.problems.sedentary.title': 'Sedentarisme',
    'office.problems.sedentary.desc':
      'Pèrdua de mobilitat i flexibilitat per passar massa hores assegut',
    'office.benefits.techniques.title': 'Tècniques específiques',
    'office.benefits.techniques.desc':
      "Tècniques específiques per descontracturar zones afectades pel treball d'oficina",
    'office.benefits.exercises.title': 'Correcció postural',
    'office.benefits.exercises.desc':
      'Exercicis i correccions posturals per prevenir futurs problemes',
    'office.benefits.mindfulness.title': "Gestió de l'estrès",
    'office.benefits.mindfulness.desc':
      "Tècniques de relaxació i mindfulness adaptades a l'entorn professional",
    'office.stats.pain': 'Reducció del dolor',
    'office.stats.posture': 'Millora postural',
    'office.stats.stress': 'Menys estrès',
    'office.session.title': "Sessió terapèutica per a treballadors d'Oficina",
    'office.session.plans': 'Veure plans',

    // Contact Page
    'contact.hero.badge': 'Estem aquí per tu',
    'contact.hero.title': 'Contacta amb',
    'contact.hero.titleHighlight': 'nosaltres',
    'contact.hero.description':
      "Estem aquí per ajudar-te en el teu camí cap al benestar. Contacta'ns per reserves, consultes o qualsevol dubte sobre els nostres serveis.",
    'contact.whatsapp': 'WhatsApp +34 658 867 133',
    'contact.callNow': 'Trucar ara',
    'contact.faq.title': 'Preguntes freqüents',
    'contact.faq.subtitle': 'Tot el que necessites saber sobre com contactar amb nosaltres',
    'contact.faq.q1.title': 'Com puc reservar una cita?',
    'contact.faq.q1.answer':
      'Pots reservar una cita escrivint per WhatsApp o Telegram al +34 658 867 133, trucant-nos al mateix número o enviant-nos un email.',
    'contact.faq.q2.title': 'Quina és la política de cancel·lació?',
    'contact.faq.q2.answer':
      'Les cancel·lacions gratuïtes es poden fer fins a 24 hores abans de la cita. Els usuaris VIP poden cancel·lar fins a 12 hores abans.',
    'contact.faq.q3.title': 'Oferiu descomptes o plans VIP?',
    'contact.faq.q3.answer':
      'Sí, tenim plans VIP amb descomptes de fins al 25% i avantatges exclusius com reserves prioritàries i consultes telefòniques gratuïtes.',
    'contact.faq.q4.title': 'Què he de portar a la primera sessió?',
    'contact.faq.q4.answer':
      'Porta roba còmoda, qualsevol informe mèdic rellevant i una llista dels medicaments que prens actualment. Les tovalloles les proporcionem nosaltres.',

    'personalizedServices.business': 'Per a Empreses',
    'personalizedServices.business.desc':
      'Programes de benestar corporatiu, classes en grup i consultoria.',
    'personalizedServices.business.benefit1': "Redueix l'estrès de l'equip",
    'personalizedServices.business.benefit2': 'Millora la postura i la salut',
    'personalizedServices.business.benefit3': 'Augmenta la productivitat',
    'personalized.business.hero.title': 'Benestar per a la teva empresa',
    'personalized.business.hero.description':
      'Cuidem de la salut del teu equip amb programes personalitzats: massatges a la feina, classes grupals i consultoria ergonòmica perquè treballin millor i sense dolor.',
    'personalized.business.bento.title': 'Benestar corporatiu dissenyat amb cura',
    'personalized.business.bento.subtitle':
      'Empodera el teu equip amb un espai i una pràctica dedicats a restaurar el focus i cultivar la resiliència.',
    'personalized.business.bento.box1.title': "Cohesió d'Equip",
    'personalized.business.bento.box1.desc':
      'Construeix connexions més fortes mitjançant experiències físiques compartides i moviment conscient.',
    'personalized.business.bento.box2.title': 'Més Productivitat',
    'personalized.business.bento.box2.desc':
      'Les ments clares porten a millors decisions. Corregir la postura redueix la fatiga i millora el rendiment.',
    'personalized.business.bento.box3.title': 'Retenció del Focus',
    'personalized.business.bento.box3.desc':
      "Fomenta la concentració i redueix l'estrès mitjançant tècniques de relaxació profundes.",
    'personalized.business.bento.box4.title': 'Entorn Holístic',
    'personalized.business.bento.box4.desc':
      "Dissenyem entorns i rutines que promouen la vitalitat física i la claredat mental a l'oficina.",

    'personalized.business.plans.title': 'Plans Corporatius',
    'personalized.business.plans.subtitle':
      'Solucions adaptades a la mida i necessitats del teu equip',

    'personalized.business.plans.starter.name': 'Pla Team',
    'personalized.business.plans.starter.desc':
      'Ideal per a equips petits que busquen introduir el benestar.',
    'personalized.business.plans.starter.price': 'A mida',
    'personalized.business.plans.starter.feat1': '1 sessió grupal al mes',
    'personalized.business.plans.starter.feat2': 'Avaluació ergonòmica bàsica',
    'personalized.business.plans.starter.feat3': 'Accés a rutines digitals',

    'personalized.business.plans.pro.name': 'Pla Office',
    'personalized.business.plans.pro.desc':
      'La solució completa per a oficines que volen resultats constants.',
    'personalized.business.plans.pro.price': 'A mida',
    'personalized.business.plans.pro.feat1': 'Sessions grupals setmanals',
    'personalized.business.plans.pro.feat2': "Massatges a l'oficina (2 dies/mes)",
    'personalized.business.plans.pro.feat3': 'Seguiment personalitzat',

    'personalized.business.plans.enterprise.name': 'Pla Enterprise',
    'personalized.business.plans.enterprise.desc': 'Programa integral de salut.',
    'personalized.business.plans.enterprise.price': 'A consultar',
    'personalized.business.plans.enterprise.feat1': 'Terapeutes dedicats in-site',
    'personalized.business.plans.enterprise.feat2': 'Tallers i formacions mensuals',
    'personalized.business.plans.enterprise.feat3': 'Mètriques de benestar i informes',
    'personalized.business.understanding.title': 'Un equip sa és un equip feliç',
    'personalized.business.understanding.description1':
      'Les llargues jornades laborals, la tensió i les males postures es tradueixen en baixes i estrès. Nosaltres ajudem a prevenir-ho.',
    'personalized.business.understanding.description2':
      'Oferim solucions flexibles adaptades al ritme i les necessitats reals de la teva empresa.',
    'personalized.business.understanding.callToAction':
      'Parlem per dissenyar un pla pel teu equip.',
    'personalized.business.services.title': 'Serveis Corporatius',
    'personalized.business.services.subtitle':
      'Solucions a mida per millorar el dia a dia de la teva empresa',
    'personalized.business.services.groupClasses.title': 'Classes de grup & Postura',
    'personalized.business.services.groupClasses.description':
      "Sessions de consciència corporal o estiraments per alleujar l'esquena, ideals per fer a l'oficina.",
    'personalized.business.services.consulting.title': 'Consultoria & Diagnòstic',
    'personalized.business.services.consulting.description':
      "Avaluem l'ergonomia i l'estrès dels teus empleats per establir pautes de benestar que funcionin.",
    'personalized.business.faq.q1': 'Teniu plans mensuals?',
    'personalized.business.faq.a1':
      "Sí, creem plans recurrents on el nostre terapeuta pot visitar l'oficina un o diversos dies al mes.",
    'personalized.business.faq.q2': 'Són classes online o presencials?',
    'personalized.business.faq.a2':
      'Ens adaptem: podem realitzar tallers presencials a la vostra oficina o donar accés a sessions online.',
    'personalized.business.faq.q3': 'Com podem començar?',
    'personalized.business.faq.a3':
      'Només cal que ens contactis. Farem una valoració gratuïta de què necessita exactament el teu equip.',
    'personalized.business.benefit1':
      "Redueix els nivells d'estrès de l'equip i prevé l'esgotament de manera proactiva.",
    'personalized.business.benefit2':
      "Millora la postura a l'escriptori i alleuja eficaçment el mal d'esquena crònic.",
    'personalized.business.benefit3':
      "Fomenta una cultura d'empresa més forta, connectada i saludable.",
    'personalized.business.benefit4':
      "Augmenta significativament la concentració diària, l'energia i la productivitat general.",

    // Booking Page Help Section
    'booking.help.title': 'Necessites ajuda amb la reserva?',
    'booking.help.contactDirect': "Contacta'ns directament",
    'booking.help.email': 'ðŸ“§ contact@ekabalance.com',
    'booking.help.address': 'ðŸ“ Carrer Pelai, 12, 08001 Barcelona',
    'booking.help.hours': "Horari d'atenció",
    'booking.help.hours.weekdays': 'Dilluns - divendres: 9:00 - 20:00',
    'booking.help.hours.saturday': 'Dissabte: 9:00 - 14:00',
    'booking.help.hours.sunday': 'Diumenge: tancat',
    'booking.help.footer':
      'Si tens qualsevol dubte sobre els nostres serveis o necessites ajuda amb la reserva, no dubtis en contactar-nos. Estem aquí per ajudar-te.',
    'discounts.mykolaFriend.description':
      'Descompte especial del 20% per a amics de mykola. Vàlid per a totes les sessions i serveis.',
    'discounts.conocidoMykola.description':
      'Descompte del 10% per a coneguts de mykola. Aplicable a tots els nostres tractaments.',
    'discounts.off': 'Descompte',
    'discounts.code': 'Codi',
    'discounts.copy': 'Copiar',
    'discounts.howToUse.title': 'Com utilitzar els descomptes',
    'discounts.howToUse.subtitle': 'Segueix aquests passos senzills per aplicar el teu descompte',
    'discounts.step1.title': "Contacta'ns",
    'discounts.step1.description':
      "Posa't en contacte amb nosaltres per WhatsApp o telèfon per reservar",
    'discounts.step2.title': 'Menciona el codi',
    'discounts.step2.description': 'Indica el codi de descompte quan facis la reserva',
    'discounts.step3.title': 'Gaudeix del descompte',
    'discounts.step3.description': "El descompte s'aplicarà automàticament al preu final",
    'discounts.cta.title': 'Preparat per utilitzar el teu descompte?',
    'discounts.cta.subtitle': 'Reserva la teva sessió ara i gaudeix del preu especial',
    'discounts.cta.bookNow': 'Reservar amb descompte',
    'discounts.cta.contact': 'Contactar',

    // Personalized Services
    'personalizedServices.title': 'Programes especialitzats',
    'personalizedServices.subtitle':
      "Solucions d'alt rendiment dissenyades per a les exigències específiques del teu estil de vida.",
    'personalizedServices.cta': 'Sol·licitar programa',
    'personalizedServices.difference.title': 'Per què triar un programa especialitzat?',
    'personalizedServices.main.title': 'Enfocament generalista',
    'personalizedServices.main.list1': 'Tractament genèric',
    'personalizedServices.main.list2': 'Protocol estàndard',
    'personalizedServices.main.list3': 'Alleujament temporal',
    'personalizedServices.main.list4': 'Millora gradual',
    'personalizedServices.special.title': 'Enfocament EKA expert',
    'personalizedServices.special.list1': 'Precisió biomecànica',
    'personalizedServices.special.list2': 'Protocols específics per activitat',
    'personalizedServices.special.list3': 'Resolució de la causa arrel',
    'personalizedServices.special.list4': 'Optimització del rendiment',
    'personalizedServices.choose.title': 'Selecciona el teu perfil',
    'personalizedServices.choose.subtitle':
      'Cada activitat té un impacte únic en el cos. Tria la teva per veure com podem potenciar-te.',
    'personalizedServices.bookNow.title': 'Eleva el teu potencial',
    'personalizedServices.bookNow.subtitle':
      'No deixis que el dolor limiti la teva carrera o passió. Reserva avui.',
    'personalizedServices.officeWorkers': 'Executius i oficina',
    'personalizedServices.officeWorkers.desc':
      "Contraresta els efectes del sedentarisme i l'estrès d'alt nivell. Recupera la postura i la claredat mental.",
    'personalizedServices.officeWorkers.benefit1':
      'Descompressió de la columna i alliberament cervical.',
    'personalizedServices.officeWorkers.benefit2': 'Correcció postural ergonòmica i respiratòria.',
    'personalizedServices.officeWorkers.benefit3': "Gestió de l'estrès executiu i fatiga visual.",
    'personalizedServices.officeWorkers.result': 'Màxima productivitat sense desgast físic.',
    'personalizedServices.athletes': "Esportistes d'elit",
    'personalizedServices.athletes.desc':
      'Optimització biomecànica, prevenció de lesions i recuperació accelerada per a un rendiment superior.',
    'personalizedServices.athletes.benefit1': 'Descàrrega muscular profunda i mobilitat articular.',
    'personalizedServices.athletes.benefit2': 'Prevenció activa de lesions i compensacions.',
    'personalizedServices.athletes.benefit3': 'Activació neuromuscular pre/post competició.',
    'personalizedServices.athletes.result': 'Supera els teus límits amb un cos que respon.',
    'personalizedServices.artists': 'Artistes visuals',
    'personalizedServices.artists.desc':
      'Cura especialitzada per a la motricitat fina i les postures estàtiques de llarga durada.',
    'personalizedServices.artists.benefit1': 'Tractament específic de mans, canells i avantbraços.',
    'personalizedServices.artists.benefit2': 'Alliberament de la cintura escapular i coll.',
    'personalizedServices.artists.benefit3': 'Connexió cos-ment per desbloquejar la creativitat.',
    'personalizedServices.artists.result': 'Crea sense dolor i amb total llibertat de moviment.',
    'personalizedServices.musicians': 'Músics i intèrprets',
    'personalizedServices.musicians.desc':
      'Harmonització del to muscular i la postura per a una execució tècnica impecable.',
    'personalizedServices.musicians.benefit1': 'Prevenció de tendinitis i distonies focals.',
    'personalizedServices.musicians.benefit2': "Optimització de la postura amb l'instrument.",
    'personalizedServices.musicians.benefit3': "Gestió de l'ansietat escènica a través del cos.",
    'personalizedServices.musicians.result': 'Toca amb facilitat, precisió i sense tensió.',
    'personalizedServices.students': 'Estudiants i acadèmics',
    'personalizedServices.students.desc':
      "Suport físic i mental per a períodes d'alta exigència intel·lectual.",
    'personalizedServices.students.benefit1': "Alleujament de la tensió per hores d'estudi.",
    'personalizedServices.students.benefit2': "Millora de l'oxigenació cerebral i la memòria.",
    'personalizedServices.students.benefit3': "Regulació del son i l'ansietat abans d'exàmens.",
    'personalizedServices.students.result': 'Ment desperta en un cos relaxat.',
    'personalizedServices.parents': 'Mares i Pares',
    'personalizedServices.parents.desc':
      'Suport per recuperar energia, paciència i benestar físic mentre cuides dels altres.',
    'personalizedServices.parents.benefit1': "Alleuja el mal d'esquena de carregar nens.",
    'personalizedServices.parents.benefit2': "Redueix la fatiga emocional i l'estrès.",
    'personalizedServices.parents.benefit3': "Restaura els nivells d'energia vital.",
    'personalizedServices.parents.result': 'Sent-te revitalitzat per criar amb alegria.',

    // Booking page
    'booking.title': 'Sol·licita la teva sessió - EKA Balance',
    'booking.description':
      'Gestiona la teva cita de benestar a Barcelona amb facilitat. Atenció personalitzada i resposta prioritària via WhatsApp.',
    'booking.badge': 'Gestió de cites simplificada',
    'booking.hero.title': 'Inicia el teu procés de recuperació',
    'booking.hero.subtitle':
      'Un sistema àgil dissenyat per connectar-te immediatament amb la solució que necessites.',
    'booking.benefits.whatsapp': 'Atenció directa',
    'booking.benefits.flexible': 'Flexibilitat horària',
    'booking.benefits.confirmation': 'Confirmació immediata',
    'booking.contact.title': 'Canals de comunicació',
    'booking.contact.subtitle': 'Selecciona la via preferent per coordinar la teva visita.',
    'booking.direct.title': 'Xat directe',
    'booking.direct.description': 'Inicia una conversa immediata per agilitzar la teva reserva.',
    'booking.direct.button': 'Obrir WhatsApp',
    'booking.form.title': 'Assistent de reserva',
    'booking.form.description':
      'Prepara la teva sol·licitud amb els detalls clau per a una resposta precisa.',
    'booking.form.button': 'Utilitzar assistent',
    'booking.form.hide': 'Tancar assistent',
    'booking.form.location': 'Ubicació preferent',
    'booking.form.locationPlaceholder': 'Indica la ubicació',
    'booking.form.timeSlot': 'Disponibilitat horària',
    'booking.form.timeSlotPlaceholder': 'Tria el teu moment',
    'booking.form.availability': 'Preferència de dia',
    'booking.form.availabilityPlaceholder': 'Indica la teva disponibilitat',
    'booking.form.objective': 'Motiu de la consulta',
    'booking.form.objectivePlaceholder': 'Descriu breument el teu objectiu o símptoma...',
    'booking.form.submit': 'Enviar sol·licitud',

    // Options
    'booking.options.service.massage': 'Massatge',
    'booking.options.service.kinesiology': 'Kinesiologia',
    'booking.options.service.osteobalance': 'Osteobalance',
    'booking.options.service.movementLesson': 'Movement Lesson',
    'booking.options.service.feldenkrais': 'Feldenkrais',
    'booking.options.service.online': 'Consulta online',
    'booking.options.service.other': 'Altres',

    'booking.options.location.barcelona': 'Barcelona',
    'booking.options.location.rubi': 'Rubí',
    'booking.options.location.online': 'Online',

    'booking.options.availability.tomorrow': 'Demà',
    'booking.options.availability.dayAfterTomorrow': 'Demà passat',
    'booking.options.availability.nextWeek': 'Setmana vinent',
    'booking.options.availability.weekend': 'Cap de setmana',
    'booking.options.availability.flexible': 'Flexible',

    'booking.options.timeSlot.morning': 'Matí (9:00-12:00)',
    'booking.options.timeSlot.noon': 'Migdia (12:00-15:00)',
    'booking.options.timeSlot.afternoon': 'Tarda (15:00-18:00)',
    'booking.options.timeSlot.evening': 'Vespre (18:00-21:00)',
    'booking.form.quickTitle': 'Formulari ràpid de reserva',
    'booking.form.nameRequired': 'Nom *',
    'booking.form.namePlaceholder': 'El teu nom',
    'booking.form.serviceRequired': 'Servei *',
    'booking.form.servicePlaceholder': 'Selecciona un servei',
    'booking.form.validationError': "Si us plau, omple almenys el nom i el servei d'interès.",
    'booking.popup.title': 'Reserva la teva sessió',
    'booking.popup.subtitle': "Selecciona el servei i la data que millor t'convingui",
    'booking.whatsapp.greeting': 'Hola, sóc {name}',
    'booking.whatsapp.greetingGeneric': "Hola Elena, m'agradaria reservar una cita.",
    'booking.whatsapp.service': "M'agradaria reservar una sessió: {service}",
    'booking.whatsapp.location': 'Lloc preferit: {location}',
    'booking.whatsapp.date': 'Data preferida: {date}',
    'booking.whatsapp.time': 'Hora preferida: {time}',
    'booking.whatsapp.comments': 'Comentaris: {comments}',
    'booking.whatsapp.availability': 'Disponibilitat: {availability} – {timeslot}',
    'booking.whatsapp.thanks': 'Gràcies!',

    // Athletes personalized service
    'athletes.hero.badge': 'Especialitzat per esportistes',
    'athletes.hero.title': 'Esportistes',
    'athletes.hero.subtitle':
      'Recuperació muscular, prevenció de lesions i optimització del rendiment esportiu',
    'athletes.challenges.title': 'Problemes comuns',
    'athletes.challenge1.title': 'Recuperació lenta',
    'athletes.challenge1.desc':
      'Les lesions i la fatiga muscular triguen més del necessari a recuperar-se',
    'athletes.challenge2.title': 'Flexibilitat limitada',
    'athletes.challenge2.desc': 'Rigidesa que redueix el rang de moviment i afecta el rendiment',
    'athletes.challenge3.title': 'Estrès pre-competició',
    'athletes.challenge3.desc': 'Ansietat i tensió abans de competicions importants',
    'athletes.help.title': "Com t'ajudem",
    'athletes.help1.title': 'Accelera la recuperació muscular',
    'athletes.help1.desc': 'Tècniques específiques per reduir la inflamació i accelerar la curació',
    'athletes.help2.title': 'Millora la flexibilitat i mobilitat',
    'athletes.help2.desc': 'Exercicis dirigits per augmentar el rang de moviment',
    'athletes.help3.title': "Gestiona l'estrès competitiu",
    'athletes.help3.desc': 'Tècniques de relaxació per mantenir la calma sota pressió',
    'athletes.result.title': 'Resultat',
    'athletes.result.desc': 'Recuperació més ràpida, millor rendiment i menys lesions',
    'athletes.stats.recovery': 'Millor recuperació',
    'athletes.stats.flexibility': 'Més flexibilitat',
    'athletes.stats.anxiety': 'Menys ansietat',
    'athletes.session.title': 'Sessió per a esportistes',

    // Artists personalized service
    'artists.hero.badge': 'Especialitzat per artistes',
    'artists.hero.title': 'Artistes',
    'artists.hero.subtitle': 'Cura de les mans, braços i postura per a artistes visuals i creadors',
    'artists.challenges.title': 'Problemes comuns',
    'artists.challenge1.title': 'Dolor a les mans i canells',
    'artists.challenge1.desc': 'Dolor per moviments repetitius durant llargues sessions de creació',
    'artists.challenge2.title': 'Postura incorrecta',
    'artists.challenge2.desc': 'Tensions al coll i esquena per postures prolongades mentre es crea',
    'artists.challenge3.title': 'Bloquejos creatius',
    'artists.challenge3.desc': 'Tensions físiques que limiten el flux creatiu i la inspiració',
    'artists.help.title': "Com t'ajudem",
    'artists.help1.title': 'Cura específica de mans i canells',
    'artists.help1.desc': 'Tractaments dirigits per alleujar el dolor i prevenir lesions',
    'artists.help2.title': 'Millora la postura de treball',
    'artists.help2.desc': 'Correccions posturals per prevenir tensions mentre crees',
    'artists.help3.title': 'Allibera la creativitat',
    'artists.help3.desc': 'Elimina tensions físiques que bloquegen el procés creatiu',
    'artists.result.title': 'Resultat esperat',
    'artists.result.desc': 'Més comoditat, fluïdesa i creativitat en el teu procés artístic',
    'artists.stats.confidence': 'Més confiança',
    'artists.stats.tension': 'Menys tensió',
    'artists.stats.anxiety': 'Menys ansietat',
    'artists.session.title': 'Sessió per a artistes',
    'artists.session.cta': 'Reservar sessió',
    'artists.session.other': 'Altres serveis',

    // Musicians personalized service
    'musicians.hero.badge': 'Especialitzat per músics',
    'musicians.hero.title': 'Músics',
    'musicians.hero.subtitle':
      'Teràpies especialitzades per músics: mans, braços, postura i tècnica',
    'musicians.problems.title': 'Problemes que resolem',
    'musicians.problems.subtitle':
      'Els músics enfronten reptes físics únics que poden afectar la seva carrera',
    'musicians.problem1.title': 'Lesions per esforç repetitiu',
    'musicians.problem1.desc': 'Dolor a mans, canells i avantbraços per la pràctica intensiva',
    'musicians.problem2.title': 'Tensions posturals',
    'musicians.problem2.desc': 'Dolor al coll i esquena per mantenir postures específiques',
    'musicians.problem3.title': 'Ansietat escènica',
    'musicians.problem3.desc': "Estrès i tensió abans d'actuacions importants",
    'musicians.problem4.title': 'Pèrdua de precisió tècnica',
    'musicians.problem4.desc': 'La tensió afecta la coordinació i la qualitat musical',
    'musicians.help.title': "Com t'ajudem",
    'musicians.help1.title': 'Prevenció de lesions',
    'musicians.help1.desc': 'Tècniques per prevenir i tractar lesions per esforç repetitiu',
    'musicians.help2.title': 'Millora postural',
    'musicians.help2.desc': 'Correccions específiques per la teva postura instrumental',
    'musicians.help3.title': 'Relaxació dirigida',
    'musicians.help3.desc': 'Tècniques per mantenir la calma i la precisió',
    'musicians.results.title': 'Resultats que obtindràs',
    'musicians.results.point1': 'Reducció significativa del dolor i tensions',
    'musicians.results.point2': 'Millora de la precisió tècnica i expressivitat',
    'musicians.results.point3': 'Major confiança i presència escènica',
    'musicians.plans.title': 'Plans especialitzats per músics',
    'musicians.plans.subtitle':
      "Escull el pla que millor s'adapti a les teves necessitats musicals",
    'musicians.plan1.name': 'Sessió individual',
    'musicians.plan1.desc': 'Perfecte per provar els nostres serveis',
    'musicians.plan1.benefit1': 'Avaluació completa de postura instrumental',
    'musicians.plan1.benefit2': 'Tractament de tensions específiques',
    'musicians.plan1.benefit3': 'Exercicis personalitzats per casa',
    'musicians.plan1.benefit4': 'Consells de prevenció',
    'musicians.plan1.result': 'Alleujament immediat i major consciència corporal',
    'musicians.plan2.name': 'Paquet inicial',
    'musicians.plan2.desc': 'Ideal per establir una base sòlida',
    'musicians.plan2.benefit1': 'Tot del plan individual',
    'musicians.plan2.benefit2': 'Seguiment i ajust personalitzat',
    'musicians.plan2.benefit3': "Rutina d'exercicis progressiva",
    'musicians.plan2.benefit4': 'Suport continuat per WhatsApp',
    'musicians.plan2.result': 'Millores significatives en tècnica i comfort',
    'musicians.plan2.popular': 'Més popular',
    'musicians.plan2.save': 'Estalvies',
    'musicians.plan3.name': 'Programa complet',
    'musicians.plan3.desc': 'La solució completa per músics professionals',
    'musicians.plan3.benefit1': 'Tot dels plans anteriors',
    'musicians.plan3.benefit2': 'Plan nutricional per a músics',
    'musicians.plan3.benefit3': 'Tècniques avançades de relaxació',
    'musicians.plan3.benefit4': 'Revisió 360° gratuita',
    'musicians.plan3.result': 'Transformació completa del teu benestar musical',
    'musicians.plan.cta': 'Seleccionar',

    // Students personalized service
    'students.hero.badge': 'Especialitzat per estudiants',
    'students.hero.title': 'Estudiants',
    'students.hero.subtitle':
      "Gestió de l'estrès d'estudi, millora de la concentració i cura postural",
    'students.challenges.title': 'Problemes comuns',
    'students.challenge1.title': "Estrès d'exàmens",
    'students.challenge1.desc': 'Ansietat i tensió que afecten el rendiment acadèmic',
    'students.challenge2.title': 'Concentració limitada',
    'students.challenge2.desc':
      "Dificultat per mantenir l'atenció durant llargues sessions d'estudi",
    'students.challenge3.title': 'Tensions posturals',
    'students.challenge3.desc': "Dolor d'esquena i coll per estar assegut moltes hores estudiant",
    'students.help.title': "Com t'ajudem",
    'students.help1.title': "Gestiona l'estrès acadèmic",
    'students.help1.desc': "Tècniques de relaxació per reduir l'ansietat d'exàmens",
    'students.help2.title': 'Millora la concentració',
    'students.help2.desc': "Exercicis per augmentar la capacitat d'atenció i memòria",
    'students.help3.title': "Corregeix la postura d'estudi",
    'students.help3.desc': 'Ajustos posturals per prevenir dolors mentre estudies',
    'students.result.title': 'Resultat',
    'students.result.desc': 'Millor rendiment acadèmic, menys estrès i més energia',
    'students.stats.concentration': 'Més concentració',
    'students.stats.tension': 'Menys tensió',
    'students.stats.stress': 'Menys estrès',
    'students.session.title': 'Sessió per a estudiants',

    // FAQ Section
    'faq.title': 'Preguntes freqüents',
    'faq.subtitle': 'Troba respostes a les preguntes més comunes sobre els nostres serveis',
    'faq.q1.question': 'Quant dura una sessió típica?',
    'faq.q1.answer':
      'Les sessions solen durar entre 60 i 90 minuts, depenent del tractament escollit i les teves necessitats específiques.',
    'faq.q2.question': 'Necessito experiència prèvia?',
    'faq.q2.answer':
      "No cal cap experiència prèvia. Tots els nostres tractaments s'adapten al teu nivell i necessitats específiques.",
    'faq.q3.question': 'Amb quina freqüència hauria de venir?',
    'faq.q3.answer':
      'Depenent dels teus objectius, recomanem entre 1-2 sessions per setmana inicialment, i després sessions de manteniment mensuals.',
    'faq.q4.question': 'Quins mètodes de pagament accepteu?',
    'faq.q4.answer':
      'Acceptem efectiu, targetes de crèdit i débito, i també bizum per a més comoditat.',
    'faq.q5.question': 'Puc cancel·lar o reprogramar la meva cita?',
    'faq.q5.answer':
      "Sí, pots cancel·lar o reprogramar amb 24 hores d'antelació sense cap càrrec addicional.",

    // First Time Visitor Form
    'firstTime.seo.title': 'No saps què triar? - Troba el teu servei ideal a EKA Balance',
    'firstTime.seo.desc':
      'Sistema personalitzat intel·ligent per descobrir el servei de teràpia holística perfecte per a les teves necessitats específiques. Recomanacions empàtiques basades en qui ets i què busques.',
    'firstTime.seo.keywords':
      'No sé què triar, formulari personalitzat, recomanacions teràpia, servei ideal, Barcelona, onboarding intel·ligent',
    'form.badge': 'Descobriment personalitzat',
    'form.title': 'Trobem el servei perfecte per a tu',
    'form.subtitle': "Respon unes preguntes ràpides i t'ajudarem a trobar la teràpia ideal",
    'form.contactWhatsApp': 'Contactar per WhatsApp',
    'form.step': 'Pas',
    'form.of': 'De',
    'form.previous': 'Anterior',
    'form.next': 'Següent',
    'form.seeRecommendation': 'Veure recomanació',
    'form.backToForm': 'Tornar al formulari',
    'form.close': 'Tancar',
    'form.closeForm': 'Tancar formulari',

    'form.step1.question': 'Quin és el teu perfil principal?',
    'form.userType.officeWorker': "Treballador/a d'oficina",
    'form.userType.officeWorkerDesc': "Passo moltes hores assegut/da davant l'ordinador",
    'form.userType.athlete': 'Esportista',
    'form.userType.athleteDesc': 'Faig exercici regularment o sóc atleta professional',
    'form.userType.artist': 'Artista o creador/a',
    'form.userType.artistDesc': 'Treballo amb les mans (pintura, escultura, artesania)',
    'form.userType.musician': 'Músic',
    'form.userType.musicianDesc': 'Toco instruments musicals regularment',
    'form.userType.student': 'Estudiant',
    'form.userType.studentDesc': 'Estudio o estic preparant exàmens',
    'form.userType.general': 'Altres perfils',
    'form.userType.generalDesc': 'Cap de les anteriors o combinació de vàries',

    'form.step2.question': "Quins són els teus objectius? (Selecciona tots els que t'interessin)",
    'form.goals.musclePain': 'Alleujar dolor muscular i tensions',
    'form.goals.stress': 'Reduir estrès i ansietat',
    'form.goals.posture': 'Millorar postura',
    'form.goals.relaxation': 'Relaxació i desconnexió',
    'form.goals.recovery': "Recuperació després d'exercici",
    'form.goals.sleep': 'Millorar qualitat del son',
    'form.goals.emotions': 'Gestionar emocions',
    'form.goals.energy': 'Augmentar energia i vitalitat',

    'form.step3.question': 'Quant de temps tens disponible per sessió?',
    'form.time.short': "Menys d'1 hora",
    'form.time.standard': '1-1.5 hores',
    'form.time.long': "Més d'1.5 hores",

    'form.step4.question': 'Quina experiència tens amb teràpies corporals?',
    'form.experience.none': 'És la meva primera vegada',
    'form.experience.noneDesc': 'Mai he rebut teràpies corporals',
    'form.experience.some': "Tinc una mica d'experiència",
    'form.experience.someDesc': 'He anat alguna vegada a massatges o teràpies',
    'form.experience.experienced': 'Tinc experiència',
    'form.experience.experiencedDesc': 'Rebeixo teràpies regularment',

    'form.step5.question': "Quin tipus d'intensitat prefereixes?",
    'form.intensity.gentle': 'Suau i relaxant',
    'form.intensity.gentleDesc': 'Prefereixo un tractament suau i tranquil',
    'form.intensity.medium': 'Moderada',
    'form.intensity.mediumDesc': 'Tractament equilibrat entre relaxació i treball profund',
    'form.intensity.deep': 'Intensa i profunda',
    'form.intensity.deepDesc': 'Vull un treball profund per tensions específiques',

    'form.recommendation.badge': 'Recomanació personalitzada',
    'form.recommendation.title': 'El teu servei ideal',
    'form.recommendation.subtitle':
      'Basant-nos en el teu perfil, hem trobat el servei perfecte per a tu',
    'form.recommendation.price': 'Preu',
    'form.recommendation.duration': 'Durada',
    'form.recommendation.benefits': 'Beneficis principals',

    'form.recommendation.officeWorker.title': "Sessió per a treballadors d'oficina",
    'form.recommendation.officeWorker.desc':
      "Teràpia especialitzada per alleujar tensions del treball sedentari, millorar la postura i reduir l'estrès laboral",
    'form.recommendation.officeWorker.benefit1': "Alleuja dolor cervical i d'esquena",
    'form.recommendation.officeWorker.benefit2': "Millora la postura davant l'ordinador",
    'form.recommendation.officeWorker.benefit3': "Redueix l'estrès laboral",
    'form.recommendation.officeWorker.benefit4': 'Més energia per treballar',

    'form.recommendation.athlete.title': 'Sessió per a esportistes',
    'form.recommendation.athlete.desc':
      'Recuperació muscular, prevenció de lesions i optimització del rendiment esportiu amb tècniques especialitzades',
    'form.recommendation.athlete.benefit1': 'Accelera recuperació muscular',
    'form.recommendation.athlete.benefit2': 'Prevé lesions',
    'form.recommendation.athlete.benefit3': 'Millora flexibilitat',
    'form.recommendation.athlete.benefit4': 'Optimitza rendiment',

    'form.recommendation.artist.title': 'Sessió per a artistes',
    'form.recommendation.artist.desc':
      'Cura específica de mans, braços i postura per a artistes visuals. Allibera la creativitat eliminant tensions físiques',
    'form.recommendation.artist.benefit1': 'Cura de mans i canells',
    'form.recommendation.artist.benefit2': 'Millora postura creativa',
    'form.recommendation.artist.benefit3': 'Allibera creativitat',
    'form.recommendation.artist.benefit4': 'Prevé lesions per ús repetitiu',

    'form.recommendation.musician.title': 'Sessió per a músics',
    'form.recommendation.musician.desc':
      "Teràpia especialitzada per a músics: prevenció de lesions, millora de la tècnica i gestió de l'ansietat escènica",
    'form.recommendation.musician.benefit1': 'Prevé lesions musicals',
    'form.recommendation.musician.benefit2': 'Millora tècnica',
    'form.recommendation.musician.benefit3': 'Gestiona ansietat escènica',
    'form.recommendation.musician.benefit4': 'Relaxació específica',

    'form.recommendation.student.title': 'Sessió per a estudiants',
    'form.recommendation.student.desc':
      "Gestió de l'estrès d'estudi, millora de la concentració i cura postural per a estudiants",
    'form.recommendation.student.benefit1': "Redueix estrès d'exàmens",
    'form.recommendation.student.benefit2': 'Millora concentració',
    'form.recommendation.student.benefit3': "Corregeix postura d'estudi",
    'form.recommendation.student.benefit4': 'Més energia per estudiar',

    'form.recommendation.holistic.title': 'Sessió holística integral',
    'form.recommendation.holistic.desc':
      'Combinació de massatge terapèutic i kinesiologia per un tractament complet del cos i les emocions',
    'form.recommendation.holistic.benefit1': 'Tractament integral',
    'form.recommendation.holistic.benefit2': 'Equilibri cos-ment',
    'form.recommendation.holistic.benefit3': 'Alleuja tensions físiques',
    'form.recommendation.holistic.benefit4': 'Gestiona emocions',

    'form.recommendation.therapeutic.title': 'Massatge terapèutic',
    'form.recommendation.therapeutic.desc':
      'Sessió especialitzada per alleujar dolor muscular, tensions i millorar la mobilitat corporal',
    'form.recommendation.therapeutic.benefit1': 'Alleuja dolor muscular',
    'form.recommendation.therapeutic.benefit2': 'Millora mobilitat',
    'form.recommendation.therapeutic.benefit3': 'Redueix tensions',
    'form.recommendation.therapeutic.benefit4': 'Relaxació profunda',

    'form.recommendation.kinesiology.title': 'Kinesiologia holística',
    'form.recommendation.kinesiology.desc':
      'Teràpia que combina tècniques corporals i emocionals per reequilibrar el teu estat general',
    'form.recommendation.kinesiology.benefit1': 'Equilibri emocional',
    'form.recommendation.kinesiology.benefit2': "Gestió de l'estrès",
    'form.recommendation.kinesiology.benefit3': 'Millora autoconeixement',
    'form.recommendation.kinesiology.benefit4': 'Pau interior',

    'form.recommendation.discovery.title': 'Sessió de descobriment',
    'form.recommendation.discovery.desc':
      'Sessió inicial per explorar les teves necessitats i crear un pla personalitzat per al teu benestar',
    'form.recommendation.discovery.benefit1': 'Avaluació completa',
    'form.recommendation.discovery.benefit2': 'Pla personalitzat',
    'form.recommendation.discovery.benefit3': 'Primera experiència',
    'form.recommendation.discovery.benefit4': 'Orientació professional',

    // Onboarding System
    'onboarding.welcome.title': 'Benvinguda',
    'onboarding.welcome.description':
      "Cada persona és diferent. Per això, abans de recomanar-te res, volem escoltar-te. Explica'ns qui ets, què busques i com vols sentir-te. Nosaltres t'ajudarem a trobar el camí que més ressoni amb tu.",
    'onboarding.welcome.discountBadge': '15€ de descompte en la teva primera sessió',
    'onboarding.progress.step': 'Pas',
    'onboarding.progress.of': 'De',
    'onboarding.processing.title': 'Personalitzant la teva experiència...',
    'onboarding.processing.subtitle':
      'Estem analitzant les teves respostes per trobar les millors recomanacions.',
    'onboarding.finish': 'Finalitzar',
    'onboarding.results.title': 'La teva experiència personalitzada està llesta',
    'onboarding.results.subtitle': 'Segons les teves respostes, et recomanem:',
    'onboarding.results.recommended': 'Recomanat',
    'onboarding.results.discountApplied': '🎁 -15€ Primera sessió',
    'onboarding.results.howYouWillFeel': 'Com et sentiràs',
    'onboarding.results.personalizedInfo': 'Informació personalitzada',

    'onboarding.questions.userType.title': 'Com et descriuries millor?',
    'onboarding.userTypes.student': 'Estudiant',
    'onboarding.userTypes.office': "Persona d'oficina",
    'onboarding.userTypes.artist': 'Artista o músic',
    'onboarding.userTypes.musician': 'Músic',
    'onboarding.userTypes.athlete': 'Esportista',
    'onboarding.userTypes.parent': 'Pare o mare',
    'onboarding.userTypes.entrepreneur': 'Emprenedor/a',
    'onboarding.userTypes.therapist': 'Terapeuta o professional del benestar',
    'onboarding.userTypes.senior': 'Persona gran',
    'onboarding.userTypes.other': 'Altres',

    'onboarding.questions.goals.title': "Què t'agradaria millorar?",
    'onboarding.goals.stress': "Regular el sistema nerviós i reduir l'ansietat",
    'onboarding.goals.pain': 'Tractament del dolor físic i estructural',
    'onboarding.goals.posture': 'Correcció postural i optimització de la mobilitat',
    'onboarding.goals.sleep': 'Restaurar la qualitat del son profund',
    'onboarding.goals.energy': 'Reactivació metabòlica i claredat mental',
    'onboarding.goals.focus': 'Potenciar el rendiment cognitiu i la concentració',
    'onboarding.goals.bodyAwareness': 'Integració somàtica i consciència corporal',
    'onboarding.goals.feelGood': 'Benestar integral i equilibri sistèmic',

    'onboarding.questions.preferredFeeling.title':
      "Després de la sessió, com t'agradaria sentir-te?",
    'onboarding.feelings.calm': 'Serenitat profunda i regulació nerviosa',
    'onboarding.feelings.light': 'Descompressió física i llibertat de moviment',
    'onboarding.feelings.energized': 'Vitalitat renovada i to muscular òptim',
    'onboarding.feelings.focused': 'Agudesa mental i focus sostingut',
    'onboarding.feelings.confident': 'Seguretat somàtica i presència plena',

    'onboarding.questions.approach.title': "Quin tipus d'enfocament prefereixes?",
    'onboarding.approaches.massage': 'Teràpia manual',
    'onboarding.approaches.kinesiology': 'Kinesiologia clínica',
    'onboarding.approaches.feldenkrais': 'Mètode Feldenkrais',
    'onboarding.approaches.energy': 'Equilibri bioenergètic',
    'onboarding.approaches.open': 'Obert a recomanacions clíniques',

    'onboarding.questions.timePreference.title':
      'Quant de temps vols dedicar al teu benestar avui?',
    'onboarding.time.60min': '1.5h',
    'onboarding.time.90min': '90 minuts',
    'onboarding.time.120min': '120 minuts',

    'recommendations.massage.description':
      "Teràpia manual avançada per a la restauració estructural i l'alleujament profund de la tensió acumulada.",
    'recommendations.kinesiology.description':
      "Kinesiologia clínica per a la regulació sistèmica i la identificació precisa de l'origen del desequilibri.",
    'recommendations.feldenkrais.description':
      "Reeducació neuromuscular Feldenkrais per a l'optimització biomecànica i l'alliberament de patrons restrictius.",

    // Personalized Pages
    'personalized.students.hero.title': 'Per a ments joves i curioses',
    'personalized.students.hero.description':
      "Quan estudies, la tensió es concentra a la ment i al coll. Et costa mantenir la concentració, et falta energia o et sents saturat? A EKA Balance t'ajudem a reconnectar amb el teu cos, millorar la postura i recuperar la calma mental.",
    'personalized.students.understanding.title': "T'entenem perfectament",
    'personalized.students.understanding.description1':
      'Quan estudies, la tensió es concentra a la ment i al coll. Et costa mantenir la concentració, et falta energia o et sents saturat?',
    'personalized.students.understanding.description2':
      'Estudiar intensament pot generar tensions físiques i mentals que afecten el teu rendiment acadèmic.',
    'personalized.students.understanding.callToAction':
      "A EKA Balance t'ajudem a reconnectar amb el teu cos, millorar la postura i recuperar la calma mental.",
    'personalized.students.services.title': 'Sessions recomanades per a tu',
    'personalized.students.services.subtitle': 'Tractaments especialitzats per estudiants',
    'personalized.students.services.kinesiologyStress.title': "Kinesiologia per a l'estrès mental",
    'personalized.students.services.kinesiologyStress.description':
      "Teràpia específica per equilibrar el sistema nerviós i gestionar l'ansietat d'exàmens.",
    'personalized.students.services.relaxingMassage.title':
      'Massatge relaxant + tècniques de respiració',
    'personalized.students.services.relaxingMassage.description':
      'Combinació de massatge terapèutic i exercicis de respiració per alleujar tensions posturals.',
    'personalized.students.testimonial.title': "Experiència d'un estudiant",
    'personalized.students.testimonial.quote':
      "Després de les sessions amb Elena, puc estudiar durant més hores sense tenir dolor d'esquena i em sento molt més relaxada durant els exàmens.",
    'personalized.students.testimonial.author': 'Maria, estudiant universitària',

    'personalized.officeWorkers.hero.title': "Per a qui passa massa hores davant l'ordinador",
    'personalized.officeWorkers.hero.description':
      "Dolor cervical, esquena rígida, ulls cansats, ment hiperactiva. T'acompanyem a recuperar equilibri i energia.",
    'personalized.officeWorkers.understanding.title': 'Sabem exactament com et sents',
    'personalized.officeWorkers.understanding.description1':
      "Dolor cervical, esquena rígida, ulls cansats, ment hiperactiva. El treball d'oficina crea patrons de tensió únics.",
    'personalized.officeWorkers.understanding.description2':
      "Les llargues hores davant l'ordinador generen contractures cervicals, dolor lumbar i fatiga mental.",
    'personalized.officeWorkers.understanding.callToAction':
      "T'acompanyem a recuperar equilibri i energia per poder treballar còmodament.",
    'personalized.officeWorkers.services.title': 'Sessions dissenyades per a tu',
    'personalized.officeWorkers.services.subtitle':
      'Tractaments específics per alleujar les tensions del treball sedentari',
    'personalized.officeWorkers.services.therapeuticMassage.title':
      'Massatge terapèutic amb enfoc postural',
    'personalized.officeWorkers.services.therapeuticMassage.description':
      "Sessió especialitzada per alleujar contractures cervicals i millorar la postura davant l'ordinador.",
    'personalized.officeWorkers.services.feldenkrais.title':
      'Feldenkrais per desbloquejar moviments',
    'personalized.officeWorkers.services.feldenkrais.description':
      'Tècniques de moviment conscient per trencar patrons de rigidesa i recuperar flexibilitat.',

    'personalized.officeWorkers.method.title': 'Protocol de Benestar Corporatiu',
    'personalized.officeWorkers.method.step1.title': 'Descompressió Postural',
    'personalized.officeWorkers.method.step1.desc':
      'Ens enfoquem en les línies fascials escurçades per estar assegut, obrint el pit i alliberant la tensió del coll.',
    'personalized.officeWorkers.method.step2.title': 'Reinici del Sistema Nerviós',
    'personalized.officeWorkers.method.step2.desc':
      "Canviem el teu cos del mode d'estrès al mode de descans i reparació per a una recuperació profunda.",
    'personalized.officeWorkers.method.step3.title': 'Realineament Ergonòmic',
    'personalized.officeWorkers.method.step3.desc':
      'Integrem senyals somàtics simples per ajudar-te a mantenir una alineació neutral sense esforç durant el dia.',

    'personalized.officeWorkers.benefits.title': 'Beneficis clau',
    'personalized.officeWorkers.benefit1':
      'Alleujament immediat del dolor crònic de coll, espatlles i esquena baixa.',
    'personalized.officeWorkers.benefit2':
      'Reducció de mals de cap tensionals i fatiga ocular mitjançant alliberament cranial.',
    'personalized.officeWorkers.benefit3':
      "Millora de la claredat mental i l'enfocament regulant el sistema nerviós.",
    'personalized.officeWorkers.benefit4':
      "Millor qualitat del son reduint les hormones de l'estrès acumulades.",

    'personalized.officeWorkers.faq.title': 'Preguntes freqüents',
    'personalized.officeWorkers.faq.q1':
      'Tinc "coll de text". La teràpia somàtica pot arreglar la meva postura?',
    'personalized.officeWorkers.faq.a1':
      "És molt efectiva perquè no només força les espatlles enrere; allibera la tensió al pit i coll que t'estira cap endavant, fent que la bona postura sigui natural.",
    'personalized.officeWorkers.faq.q2': 'És adequat per a la cura preventiva?',
    'personalized.officeWorkers.faq.a2':
      "Absolutament. Les sessions regulars prevenen l'acumulació de micro-traumes per postures estàtiques.",
    'personalized.officeWorkers.faq.q3': 'Hauré de fer exercicis al meu escriptori?',
    'personalized.officeWorkers.faq.a3':
      'Proporcionem micro-moviments subtils que restableixen el teu sistema nerviós i postura sense interrompre el flux de treball.',

    'personalized.officeWorkers.testimonial.title': "Testimoni d'un professional",
    'personalized.officeWorkers.testimonial.quote':
      'Treballava 8 hores diàries amb dolor constant al coll. Després del tractament amb Elena, puc treballar còmodament i tinc més energia al final del dia.',
    'personalized.officeWorkers.testimonial.author': 'Joan, desenvolupador de software',

    'personalized.musicians.hero.title': 'Per als qui viuen a través del so',
    'personalized.musicians.hero.description':
      'Si toques o cantes, el teu cos també és el teu instrument. Et mostrem com alliberar tensió, fluir amb el moviment i respirar millor.',
    'personalized.musicians.understanding.title': 'El teu cos és el teu instrument',
    'personalized.musicians.understanding.description1':
      'Si toques o cantes, el teu cos també és el teu instrument. La tensió física afecta directament la teva capacitat musical.',
    'personalized.musicians.understanding.description2':
      "Les lesions per esforç repetitiu i l'ansietat escènica són reptes comuns entre músics.",
    'personalized.musicians.understanding.callToAction':
      'Et mostrem com alliberar tensió, fluir amb el moviment i respirar millor per potenciar la teva expressivitat.',
    'personalized.musicians.services.title': 'Serveis especialitzats per músics',
    'personalized.musicians.services.subtitle':
      'Tractaments dissenyats per potenciar la teva expressió musical',
    'personalized.musicians.services.feldenkraisExpression.title':
      'Feldenkrais per a la coordinació i expressió corporal',
    'personalized.musicians.services.feldenkraisExpression.description':
      'Tècniques específiques per millorar la coordinació, fluidesa del moviment i expressivitat musical.',
    'personalized.musicians.services.kinesiologyPerformance.title':
      "Kinesiologia per l'ansietat escènica",
    'personalized.musicians.services.kinesiologyPerformance.description':
      "Teràpia per gestionar l'ansietat abans de les actuacions i millorar la confiança escènica.",

    'personalized.musicians.method.title': "Protocol d'Harmonia Musical",
    'personalized.musicians.method.step1.title': 'Anàlisi Instrumental',
    'personalized.musicians.method.step1.desc':
      'Avaluem les demandes biomecàniques uniques del teu instrument, identificant patrons asimètrics.',
    'personalized.musicians.method.step2.title': 'Alliberament de Motor Fi',
    'personalized.musicians.method.step2.desc':
      'Ens enfoquem en la musculatura delicada de mans i braços, i en la tensió central que restringeix la respiració.',
    'personalized.musicians.method.step3.title': "Calibratge d'Estat de Flux",
    'personalized.musicians.method.step3.desc':
      " unim respiració i moviment, reduint l'ansietat i permetent una execució tècnica fluida.",

    'personalized.musicians.benefits.title': 'Beneficis clau',
    'personalized.musicians.benefit1':
      'Prevenció i tractament de lesions per esforç repetitiu (RSI) i tendinitis.',
    'personalized.musicians.benefit2':
      'Millor control de la respiració i ressonància per a músics de vent i vocalistes.',
    'personalized.musicians.benefit3':
      'Major fluïdesa i reducció de tensió en la postura de tocar.',
    'personalized.musicians.benefit4':
      "Reducció de l'ansietat escènica mitjançant la regulació del sistema nerviós.",

    'personalized.musicians.faq.title': 'Preguntes freqüents',
    'personalized.musicians.faq.q1': 'Això pot ajudar amb la tendinitis o el túnel carpià?',
    'personalized.musicians.faq.a1':
      "Sí. Tractem això no només localment, sinó seguint la cadena de tensió fins al coll, abordant la compressió nerviosa a l'origen.",
    'personalized.musicians.faq.q2': 'El tractament afectarà la meva tècnica?',
    'personalized.musicians.faq.a2':
      'La refinarà. En eliminar la tensió innecessària, podràs tocar amb més facilitat, velocitat i resistència.',
    'personalized.musicians.faq.q3': 'Toco un instrument asimètric. Com ajudeu?',
    'personalized.musicians.faq.a3':
      'Ens enfoquem a desfer els patrons de rotació, restaurant la simetria en la teva postura de descans.',

    'personalized.musicians.testimonial.title': "Experiència d'una pianista",
    'personalized.musicians.testimonial.quote':
      "Les sessions m'han ajudat a tocar amb més fluïdesa i a superar els nervis abans dels concerts. Ara sento el piano com una extensió natural del meu cos.",
    'personalized.musicians.testimonial.author': 'Anna, pianista professional',

    'personalized.artists.hero.title': 'Artistes',
    'personalized.artists.hero.description':
      'Cura de les mans, braços i postura per a artistes visuals i creadors',
    'personalized.artists.understanding.title': 'Reptes creatius',
    'personalized.artists.understanding.description1':
      'Dolor per moviments repetitius durant llargues sessions de creació.',
    'personalized.artists.understanding.description2':
      'Tensions al coll i esquena per postures prolongades mentre es crea.',
    'personalized.artists.understanding.callToAction':
      "T'ajudem a alliberar tensions físiques que bloquegen el procés creatiu.",
    'personalized.artists.services.title': 'Intervenció clínica',
    'personalized.artists.services.subtitle': 'Tractaments especialitzats per a artistes',
    'personalized.artists.benefits.title': 'Impacte creatiu',
    'personalized.artists.method.title': 'El nostre protocol per a artistes',
    'personalized.artists.method.step1.title': 'Avaluació',
    'personalized.artists.method.step1.desc': 'Analitzem la teva postura i gestos tècnics.',
    'personalized.artists.method.step2.title': 'Tractament',
    'personalized.artists.method.step2.desc': 'Teràpia manual per alliberar tensions i dolor.',
    'personalized.artists.method.step3.title': 'Prevenció',
    'personalized.artists.method.step3.desc':
      'Exercicis i pautes per mantenir la salut mentre crees.',
    'personalized.artists.benefits.benefit1':
      'Més comoditat, fluïdesa i creativitat en el teu procés artístic.',
    'personalized.artists.benefits.benefit2': 'Reducció del dolor i la tensió muscular.',
    'personalized.artists.benefits.benefit3': 'Major consciència corporal i postural.',

    'personalized.athletes.hero.title': 'Per als qui no poden parar, però volen cuidar-se',
    'personalized.athletes.hero.description':
      "Recupera el teu cos després de l'esforç, millora la flexibilitat i evita lesions.",
    'personalized.athletes.understanding.title': 'Entenem el teu cos actiu',
    'personalized.athletes.understanding.description1':
      "Recupera el teu cos després de l'esforç, millora la flexibilitat i evita lesions.",
    'personalized.athletes.understanding.description2':
      "L'activitat física intensa requereix cures específiques per mantenir el rendiment òptim.",
    'personalized.athletes.understanding.callToAction':
      "T'ajudem a mantenir el teu cos en perfectes condicions per continuar donant el màxim.",
    'personalized.athletes.services.title': 'Tractaments per a esportistes',
    'personalized.athletes.services.subtitle': 'Recuperació i optimització del rendiment esportiu',
    'personalized.athletes.services.sportsMassage.title':
      "Massatge esportiu + tècniques d'equilibri muscular",
    'personalized.athletes.services.sportsMassage.description':
      'Tractament especialitzat per accelerar la recuperació muscular i prevenir lesions.',
    'personalized.athletes.services.osteobalance.title': 'Osteobalance i estiraments guiats',
    'personalized.athletes.services.osteobalance.description':
      'Tècniques avançades per millorar la mobilitat articular i optimitzar el rendiment.',

    'personalized.athletes.method.title': 'El nostre protocol de rendiment',
    'personalized.athletes.method.step1.title': 'Avaluació biomecànica',
    'personalized.athletes.method.step1.desc':
      'Analitzem els teus patrons de moviment per identificar ineficiències neuromusculars i restriccions fascials.',
    'personalized.athletes.method.step2.title': 'Alliberament estratègic i activació',
    'personalized.athletes.method.step2.desc':
      "Alliberem la tensió crònica mentre activem els estabilitzadors infraactius per restaurar l'equilibri estructural.",
    'personalized.athletes.method.step3.title': 'Integració del rendiment',
    'personalized.athletes.method.step3.desc':
      'Reentrenem el teu sistema nerviós per a estratègies de moviment eficients, millorant la potència i reduint el temps de recuperació.',

    'personalized.athletes.benefits.title': 'Beneficis clau',
    'personalized.athletes.benefit1':
      'Temps de recuperació accelerats mitjançant drenatge limfàtic millorat i alliberament fascial.',
    'personalized.athletes.benefit2':
      'Prevenció de lesions per sobrecàrrega corregint patrons de moviment compensatoris.',
    'personalized.athletes.benefit3':
      'Biomecànica optimitzada que porta a una major potència explosiva i resistència.',
    'personalized.athletes.benefit4':
      'Major consciència propioceptiva per a una millor coordinació i agilitat.',

    'personalized.athletes.faq.title': 'Preguntes freqüents',
    'personalized.athletes.faq.q1':
      "En què es diferencia la teràpia somàtica d'un massatge esportiu normal?",
    'personalized.athletes.faq.a1':
      'Mentre que el massatge esportiu se centra en la relaxació muscular, la teràpia somàtica aborda el control del sistema nerviós sobre aquests músculs. Treballem en la causa arrel.',
    'personalized.athletes.faq.q2':
      "Pot ajudar amb lesions cròniques que no s'han curat amb fisio tradicional?",
    'personalized.athletes.faq.a2':
      'Sí. Les lesions cròniques sovint persisteixen perquè el cos està atrapat en un patró protector. El nostre enfocament ajuda el teu sistema nerviós a sentir-se prou segur per alliberar aquests mecanismes.',
    'personalized.athletes.faq.q3':
      'Quan hauria de programar una sessió respecte a la meva competició?',
    'personalized.athletes.faq.a3':
      "Per a un treball d'alliberament profund, recomanem 3-5 dies abans d'un esdeveniment important. Per a la regulació i activació del sistema nerviós, 24-48 hores abans és ideal.",

    'personalized.athletes.testimonial.title': "Testimoni d'un atleta",
    'personalized.athletes.testimonial.quote':
      'Des que vaig començar les sessions, la meva recuperació és molt més ràpida i puc entrenar amb més intensitat sense por a lesionar-me.',
    'personalized.athletes.testimonial.author': 'Marc, corredor de marató',

    'personalized.parents.hero.title': "Per a qui cuida de tothom menys d'ell mateix",
    'personalized.parents.hero.description':
      "T'ajudem a recuperar energia, pau i claredat per poder donar sense buidar-te.",
    'personalized.parents.understanding.title': 'Sabem que necessites temps per a tu',
    'personalized.parents.understanding.description1':
      "T'ajudem a recuperar energia, pau i claredat per poder donar sense buidar-te.",
    'personalized.parents.understanding.description2':
      "Ser pare o mare és una tasca intensa que sovint deixa poc temps per l'autocura.",
    'personalized.parents.understanding.callToAction':
      "Mereix prendre't un temps per recarregar energies i estar millor per als teus.",
    'personalized.parents.services.title': 'Sessions pensades per a pares i mares',
    'personalized.parents.services.subtitle':
      'Tractaments per recuperar energia i equilibri emocional',
    'personalized.parents.services.emotionalKinesiology.title': 'Kinesiologia emocional',
    'personalized.parents.services.emotionalKinesiology.description':
      "Teràpia específica per gestionar l'estrès familiar i recuperar l'equilibri emocional.",
    'personalized.parents.services.relaxingMassage.title':
      'Massatge relaxant i consciència corporal',
    'personalized.parents.services.relaxingMassage.description':
      'Sessió de desconnexió profunda per alliberar tensions acumulades i recuperar energia.',
    'personalized.parents.testimonial.title': "Experiència d'una mare",
    'personalized.parents.testimonial.quote':
      'Després de les sessions, em sento més pacient amb els nens i tinc més energia per gaudir realment del temps en família.',
    'personalized.parents.testimonial.author': 'Laura, mare de dos fills',

    // Common translations for personalized pages
    'common.askQuestions': 'Fer preguntes',
    'common.learnMore': 'Saber més',
    'common.recommended': 'Recomanat',
    'common.back': 'Enrere',
    'common.continue': 'Continuar',
    'common.disclaimer':
      "Els serveis d'EKA Balance són de suport complementari, no mèdic. No substitueixen cap diagnòstic ni tractament professional. L'objectiu és acompanyar-te cap a més benestar, consciència i equilibri global.",

    'contact.form.whatsapp': 'WhatsApp',
    'contact.form.preferredTime': 'Horari preferit',
    'contact.form.selectTime': 'Selecciona un horari',

    // Cookie translations
    'cookies.title': 'Utilitzem cookies per millorar la teva experiència',
    'cookies.description':
      "Utilitzem cookies essencials per a la funcionalitat del lloc web i analítiques anònimes per millorar els nostres serveis. No utilitzem cookies publicitàries ni de seguiment. En continuar utilitzant el nostre lloc, acceptes l'ús de cookies.",
    'cookies.accept': 'Acceptar',
    'cookies.reject': 'Rebutjar',
    'cookies.learnMore': 'Saber més',

    // Layout footer
    'footer.privacyPolicy': 'Política de privacitat',
    'footer.cookiePolicy': 'Política de cookies',
    'footer.termsOfService': 'Condicions de servei',
    'footer.logout': 'Sortir',
    'footer.login': 'Entrar',

    // Service pages
    'services.page.benefits': 'Beneficis',
    'services.page.testimonials': 'Testimonials',
    'services.page.sessions': 'Sessions',
    'services.page.duration': 'Durada',
    'services.page.price': 'Preu',

    // Policy pages
    'policy.lastUpdated': 'Última actualització:',
    'policy.introduction': 'Introducció',

    'vip.plan.bronze.description': 'Cura essencial per al manteniment',
    'vip.plan.bronze.price': '150€',
    'vip.plan.silver.description': 'Benestar mensual complet',
    'vip.plan.silver.price': '280€',
    'vip.plan.gold.description': 'Transformació total i exclusivitat',
    'vip.plan.gold.price': '500€',

    'vip.service.priority.title': 'Reserva prioritària',
    'vip.service.priority.description':
      'Salta la cua amb franges exclusives reservades només per a tu.',
    'vip.service.displacements.title': 'Visites a domicili',
    'vip.service.displacements.description':
      'Venim on siguis. Estalvia temps i gaudeix dels tractaments al teu espai.',
    'vip.service.health.title': 'Seguiment de salut',
    'vip.service.health.description':
      'Revisions regulars i seguiment del progrés de la teva salut física.',
    'vip.service.family.title': 'Beneficis familiars',
    'vip.service.family.description':
      'Comparteix les teves sessions i beneficis amb familiars directes.',

    'vip.benefits.transferable': 'Sessions transferibles',
    'vip.benefits.transferableDesc': 'Comparteix amb la família',
    'vip.benefits.monthly': 'Revisió mensual',
    'vip.benefits.monthlyDesc': 'Cura preventiva',
    'vip.benefits.barcelona': 'Exclusiu Barcelona',
    'vip.benefits.barcelonaDesc': 'Disponible al centre',
    'vip.benefits.sessions': 'Sessions esteses',

    'vip.stats.concierge': 'Servei concierge',
    'vip.stats.exclusivity': 'Exclusivitat',
    'vip.stats.clients': 'Top 1% clients',
    'vip.stats.possibilities': 'Possibilitats',
    'vip.stats.control': 'Control de salut',
    'vip.stats.family': 'Pla familiar',

    'vip.mostExclusive': 'Més exclusiu',
    'vip.experienceDescription':
      'Viu el cim del benestar dirigit a aquells que exigeixen el millor.',
    'vip.voicesOfExcellence': "Veus d'Excel·lència",
    'vip.testimonialsSubtitle': "El que diuen els nostres membres d'elit.",
    'vip.tier.standard': 'Membre estàndard',

    'vip.testimonials.comment1':
      'La millor inversió que he fet per a la meva salut. El servei prioritari canvia les regles del joc.',
    'vip.testimonials.comment2':
      "Professionalitat en estat pur. L'Elena entén exactament el que el meu cos necessita.",
    'vip.testimonials.comment3':
      "Em sento renovada després de cada sessió. L'atenció al detall és inigualable.",

    'vip.hero.badge': 'Ultra prèmium',
    'vip.hero.title.beyond': 'Més enllà',
    'vip.hero.title.wellness': 'Del benestar',
    'vip.hero.subtitle':
      'Entra en un món on el teu benestar és la prioritat absoluta. Tractaments exclusius, accés prioritari i atenció personalitzada.',
    'vip.hero.cta.join': 'Uneix-te al cercle interior',

    'vip.dashboard.member': 'Àrea de membres',
    'vip.dashboard.hello': 'Hola,',
    'vip.dashboard.status': 'Estat actual:',
    'vip.dashboard.priorityBooking': 'Reserva prioritària',
    'vip.dashboard.viewPlans': 'Veure plans VIP',

    'vip.features.badge': 'Excel·lència',
    'vip.features.title': "Dissenyat per a l'Elit",
    'vip.features.subtitle': 'Descobreix què significa formar part del cercle més exclusiu.',
    'vip.plans.badge': "Membresies d'ELIT",
    'vip.plans.title': 'Tria la teva experiència elite',
    'vip.plans.subtitle':
      'Cada pla està meticulosament dissenyat per oferir una experiència inoblidable.',
    'vip.plans.popular': 'Més exclusiu',
    'vip.plans.perMonth': '€/Mes',
    'vip.plans.sessions': 'Sessions exclusives mensuals',
    'vip.plans.contact': 'Contactar per a',
    'vip.table.title': 'Comparativa de plans',
    'vip.table.sessions': 'Sessions incloses',
    'vip.exclusivePrivileges': 'Privilegis exclusius',
    'vip.testimonials.title': "Veus d'excel·lència",
    'vip.testimonials.subtitle': "Experiències reals dels nostres membres de l'Inner Circle.",
    'vip.testimonials.role1': 'Ceo, empresa tecnològica',
    'vip.testimonials.role2': 'Cirurgià cardiovascular',
    'vip.testimonials.role3': 'Emprenedora',
    'vip.cta.badge': "L'INNER CIRCLE T'ESPERA",
    'vip.cta.title': 'Preparat per transcendir',
    'vip.cta.subtitle':
      "Només els qui busquen l'excel·lència poden formar part d'aquesta experiència única. La teva transformació comença aquí.",
    'vip.whatsapp.message':
      "Hola, estic interessat en el pla VIP {plan}. M'agradaria rebre més informació.",
    'vip.whatsapp.messageGeneral':
      "Hola, estic interessat en els plans VIP inner circle. M'agradaria rebre més informació.",
    'vip.cta.location': 'Ubicació exclusiva',
    'vip.cta.concierge': 'Servei concierge',
    'vip.cta.guarantee': 'Garantia total',

    // VIP Plans
    'vip.plan.bronze': 'Essencial',
    'vip.plan.silver': 'Prestige',
    'vip.plan.gold': 'Elite',
    'vip.plan.platinum': 'Signature',

    'vip.plan.bronze.desc': 'El punt de partida ideal per a qui busca constància i manteniment.',
    'vip.plan.silver.desc': 'Per a aquells que necessiten un acompanyament més profund i regular.',
    'vip.plan.gold.desc': "L'experiència completa per a una transformació integral.",
    'vip.plan.platinum.desc': "La màxima expressió de l'exclusivitat i el servei personalitzat.",

    'vip.feature.priority': 'Reserva prioritària (48h abans)',
    'vip.feature.extended': 'Sessions esteses (+15 min)',
    'vip.feature.support': 'Suport via WhatsApp',
    'vip.feature.events': 'Accés a esdeveniments exclusius',
    'vip.feature.home': 'Servei a domicili (opcional)',
    'vip.feature.all': 'Tots els beneficis inclosos',
    'vip.feature.gift': '1 sessió de regal per a un amic',
    'vip.feature.consultation': 'Consulta nutricional trimestral',
    'vip.feature.kit': 'Kit de benvinguda premium',
    'vip.feature.concierge': 'Gestor personal de benestar',
    'vip.feature.retreat': 'Descompte en retirs anuals',

    // Missing Keys Patch
    'hero.firstTime': 'Primera vegada?',
    'hero.dontKnowWhatToChoose': 'No saps què triar?',
    'hero.discoverServices': 'Descobreix els serveis',
    'hero.stats.sessions': 'Sessions realitzades',
    'hero.stats.countries': 'Països impactats',

    'footer.address': 'Carrer Pelai, 12, 08001 Barcelona',
    'footer.email': 'contact@ekabalance.com',
    'footer.copyright': '© 2024 EKA Balance. Tots els drets reservats.',
    'footer.selectLanguage': 'Selecciona idioma',
    'footer.discounts': "Descomptes d'estiu",

    'language.popup.title': 'Benvingut a EKA Balance',
    'language.popup.subtitle': 'Si us plau, selecciona el teu idioma preferit',
    'cookies.wrongLanguage': 'Sembla que estàs en un idioma diferent del teu navegador.',

    'stats.sessions': 'Sessions',
    'stats.clients': 'Clients',
    'stats.experience': 'Experiència',
    'stats.rating': 'Valoració',
    'stats.countries': 'Països',
    'stats.cases': 'Casos resolts',
    'stats.response': 'Resposta ràpida',

    // Casos & Problems
    'casos.hero.badge': 'Històries reals',
    'casos.title': 'Casos reals',
    'casos.subtitle': "Històries d'èxit",
    'casos.description': 'Descobreix com hem ajudat altres persones.',
    'casos.frequentCases': 'Casos freqüents',
    'casos.frequentCasesSubtitle': 'Patologies comunes',
    'casos.otherCases': 'Altres casos',
    'casos.otherCasesSubtitle': 'Altres àrees',
    'casos.ctaTitle': 'Tens un cas similar?',
    'casos.ctaSubtitle': 'Parla amb nosaltres',
    'casos.discoverIdeal': 'Descobreix el tractament',
    'casos.bookSession': 'Reservar sessió',
    'casos.seeDetails': 'Veure detalls',
    'casos.section.badge': 'Casos clínics',
    'casos.section.title': 'Identificació de patologies',
    'casos.section.titleHighlight': 'i solucions',
    'casos.section.subtitle': 'Resolució de problemes complexos',
    'casos.section.readMore': 'Llegir més',
    'casos.section.viewAll': 'Veure tots',
    'casos.section.findYourCase': 'Troba el teu cas',

    'casos.problems.backPain.title': "Mal d'Esquena",
    'casos.problems.backPain.description': 'Dolor persistent i problemes posturals.',
    'casos.problems.stress.title': 'Estrès i ansietat',
    'casos.problems.stress.description': 'Desregulació del sistema nerviós.',
    'casos.problems.digestive.title': 'Problemes digestius',
    'casos.problems.digestive.description': 'Disfunció visceral i inflor.',
    'casos.problems.migraines.title': 'Migranyes',
    'casos.problems.migraines.description': 'Mals de cap i tensió cranial.',
    'casos.problems.lowEnergy.title': 'Fatiga crònica',
    'casos.problems.lowEnergy.description': 'Esgotament sistèmic.',
    'casos.problems.hormonal.title': 'Desequilibris hormonals',
    'casos.problems.hormonal.description': 'Salut de la dona i cicles.',
    'casos.problems.sleep.title': 'Trastorns del son',
    'casos.problems.sleep.description': 'Insomni i descans pobre.',
    'casos.problems.recovery.title': 'Recuperació',
    'casos.problems.recovery.description': 'Post-lesió i rehabilitació.',

    // Students
    'students.problems.title': 'Reptes dels estudiants',
    'students.problems.subtitle': "Supera l'estrès acadèmic",
    'students.problem1.title': 'Ansietat',
    'students.problem1.desc': 'Davant exàmens',
    'students.problem2.title': 'Postura',
    'students.problem2.desc': "Dolor d'estudiar",
    'students.problem3.title': 'Concentració',
    'students.problem3.desc': 'Dificultat de focus',
    'students.problem4.title': 'Fatiga',
    'students.problem4.desc': 'Cansament mental',
    'students.results.title': 'Resultats',
    'students.results.point1': 'Millor rendiment',
    'students.results.point2': 'Menys estrès',
    'students.results.point3': 'Més energia',
    'students.plans.title': "Plans d'Estudi",
    'students.plans.subtitle': 'Opcions per a tu',
    'students.plan1.name': 'Sessió única',
    'students.plan1.desc': 'Puntual',
    'students.plan1.result': 'Alleujament',
    'students.plan2.name': 'Pack estudi',
    'students.plan2.desc': 'Seguiment',
    'students.plan2.result': 'Rendiment',
    'students.plan2.popular': 'Popular',
    'students.plan2.save': 'Estalvi',
    'students.plan3.name': 'Programa complet',
    'students.plan3.desc': 'Transformació',
    'students.plan3.result': 'Èxit',
    'students.plan.cta': 'Tria pla',
    'students.plan1.benefit1': 'Relax',
    'students.plan1.benefit2': 'Focus',
    'students.plan1.benefit3': 'Tips',
    'students.plan1.benefit4': 'Suport',
    'students.plan2.benefit1': '3 sessions',
    'students.plan2.benefit2': 'Seguiment',
    'students.plan2.benefit3': 'Prioritat',
    'students.plan2.benefit4': 'Descompte',
    'students.plan3.benefit1': '5 sessions',
    'students.plan3.benefit2': 'Coaching',
    'students.plan3.benefit3': 'WhatsApp',
    'students.plan3.benefit4': 'Material',

    // Office
    'office.hero.badge': 'Empreses',
    'office.hero.title': 'Benestar corporatiu',
    'office.hero.subtitle': 'Salut a la feina',
    'office.problems.title': "Reptes d'Oficina",
    'office.problems.subtitle': 'Sedentarisme i estrès',
    'office.problem1.title': "Mal d'esquena",
    'office.problem1.desc': 'Postura estàtica',
    'office.problem2.title': 'Vista cansada',
    'office.problem2.desc': 'Pantalles',
    'office.problem3.title': 'Cervicals',
    'office.problem3.desc': 'Tensió espatlles',
    'office.problem4.title': 'Sedentarisme',
    'office.problem4.desc': 'Falta moviment',
    'office.help.title': 'Solucions',
    'office.help1.title': 'Ergonomia',
    'office.help1.desc': 'Ajust postural',
    'office.help2.title': 'Actvació',
    'office.help2.desc': 'Exercicis',
    'office.help3.title': 'Relaxació',
    'office.help3.desc': 'Anti-estrès',
    'office.results.title': 'Beneficis',
    'office.results.point1': 'Productivitat',
    'office.results.point2': 'Menys baixes',
    'office.results.point3': 'Bon ambient',
    'office.plans.title': 'Plans empresa',
    'office.plans.subtitle': 'Per a equips',
    'office.plan1.name': 'Individual',
    'office.plan1.desc': 'Executiu',
    'office.plan1.result': 'Focus',
    'office.plan2.name': 'Equip petit',
    'office.plan2.desc': '< 10 persones',
    'office.plan2.result': 'Cohesió',
    'office.plan2.popular': 'Recomanat',
    'office.plan2.save': 'Deduïble',
    'office.plan3.name': 'Departament',
    'office.plan3.desc': 'Grans equips',
    'office.plan3.result': 'Cultura',
    'office.plan.cta': 'Contactar',
    'office.plan1.benefit1': 'Anàlisi',
    'office.plan1.benefit2': 'Tractament',
    'office.plan1.benefit3': 'Informe',
    'office.plan1.benefit4': 'Seguiment',
    'office.plan2.benefit1': 'Tallers',
    'office.plan2.benefit2': 'Grup',
    'office.plan2.benefit3': 'Material',
    'office.plan2.benefit4': 'Deal',
    'office.plan3.benefit1': 'Anual',
    'office.plan3.benefit2': 'In-house',
    'office.plan3.benefit3': 'Events',
    'office.plan3.benefit4': 'Dades',

    // Discovery & Other
    'discovery.location.barcelona': 'Barcelona',
    'discovery.location.rubi': 'Rubí',
    'discovery.location.online': 'Online',
    'discovery.step.location.title': 'Ubicació',
    'discovery.step.location.subtitle': 'On?',
    'discovery.step.description.title': 'Descripció',
    'discovery.step.description.subtitle': 'Què et passa?',
    'discovery.step.description.placeholder': "Explica'ns...",

    'common.moreInfo': 'Més info',
    'common.readMore': 'Llegir més',
    'common.expectedResult': 'Resultat esperat',
    'common.bookNow': 'Reservar',
    'common.contact': 'Contacte',
    'common.discoverServices': 'Serveis',
    'common.reserve': 'Reservar',
    'common.reserveNow': 'Reservar ara',
    'common.seePlans': 'Veure plans',
    'common.hour': 'H',
    'common.hours': 'Hores',
    'common.reserveSession': 'Reserva sessió',
    'common.seeOtherServices': 'Altres serveis',
    'common.getStarted': 'Començar',
    'common.free': 'Gratuït',
    'common.price': 'Preu',
    'common.duration': 'Duració',
    'common.benefits': 'Beneficis',

    'services.therapiesFor': 'Teràpies per',
    'services.integralWellbeing': 'Benestar integral',
    'services.personalizedTreatments': 'Personalitzat',
    'services.massage.title': 'Massatge',
    'services.massage.subtitle': 'Relax',
    'services.massage.description': 'Descans profund',
    'services.kinesiology.title': 'Kinesiologia',
    'services.kinesiology.subtitle': 'Equilibri',
    'services.kinesiology.description': 'Test muscular',

    // New Content Translations
    'adult.kinesiology.badge': 'Equilibri Integral',
    'adult.nutrition.badge': 'Salut Digestiva',
    'children.recommended': 'Serveis Recomanats',
    'children.recommended.desc': 'Cura especialitzada per al desenvolupament i benestar infantil.',
    'children.kinesiology.badge': 'Aprenentatge i Emocions',
    'children.kinesiology.desc':
      "Suport en dificultats d'aprenentatge, gestió emocional i coordinació motora.",
    'children.health.title': 'Equilibri Corporal',
    'children.health.desc':
      'Tractament holístic per a al·lèrgies, intoleràncies i desenvolupament físic saludable.',
    'children.kinesiology.imgAlt': 'Kinesiologia Infantil',
    'children.health.badge': 'Salut Física',
    'children.health.imgAlt': 'Salut Física',
    'families.recommended': 'Serveis Recomanats',
    'families.recommended.desc': 'Suport integral per al benestar de tota la família.',
    'families.kinesiology.badge': 'Benestar Familiar',
    'families.nutrition.badge': 'Hàbits Saludables',
    'services.nutrition.title': 'Nutrición',
    'services.nutrition.subtitle': 'Salud',
    'services.nutrition.description': 'Dieta consciente',
    'services.revision360.title': 'Revisió 360',
    'services.revision360.subtitle': 'Total',
    'services.revision360.description': 'Avaluació completa',
    'services.consultation.title': 'Consulta',
    'services.consultation.description': 'Parlem 15 min',
    'services.consultation.feeling': 'Claredat',

    'elena.seo.title': 'Elena Kucherova bcn',
    'elena.seo.desc': 'Teràpia somàtica Barcelona',
    'elena.seo.keywords': 'Somàtica, Elena, Barcelona',
    'casos.seo.title': 'Casos èxit',
    'casos.seo.desc': 'Recuperació real',
    'casos.seo.keywords': 'Casos, salut, resultats',

    'whyChoose.title': 'Per què triar EKA Balance?',
    'whyChoose.subtitle':
      'Som més que un centre de teràpia; som els teus socis dedicats en el benestar holístic.',
    'whyChoose.personalized.title': 'Plans veritablement personalitzats',
    'whyChoose.personalized.description':
      'El teu cos és únic, i la teva teràpia també ho hauria de ser. Adaptem cada sessió a la teva fisiologia i història específiques per obtenir resultats més ràpids i sostenibles.',
    'whyChoose.holistic.title': 'Integració sistèmica',
    'whyChoose.holistic.description':
      'Tractem tot el teu ésser: estructural, químic i emocional. La veritable curació succeeix quan tots els teus sistemes treballen en harmonia.',
    'whyChoose.experienced.title': 'Guiatge expert',
    'whyChoose.experienced.description':
      "Beneficia't d'anys de pràctica professional i estudi continu en modalitats globals com Feldenkrais, Osteopatia i Kinesiologia.",

    'finalCta.title': 'A punt?',
    'finalCta.subtitle': 'Reserva ja',

    // Pricing Section
    'pricing.badge': 'Tarifes transparents',
    'pricing.title.part1': 'Tria el teu',
    'pricing.title.part2': 'pla de benestar',
    'pricing.subtitle':
      'Packs dissenyats per a cada necessitat, amb la flexibilitat i qualitat que et mereixes',
    'pricing.popular': 'Més popular',
    'pricing.save': 'Estalvia {percent}%',
    'pricing.discount_applied': 'Aplicat',
    'pricing.plan.select': 'Seleccionar',

    'pricing.plan.basic.name': 'Sessió individual',
    'pricing.plan.basic.desc': 'Una sessió completa de 1.5h',
    'pricing.plan.pack3.name': 'Pack benestar (3)',
    'pricing.plan.pack3.desc': 'Pack de 3 sessions per un seguiment continu',
    'pricing.plan.pack5.name': 'Pack transformació (5)',
    'pricing.plan.pack5.desc': 'Tractament integral per canvis profunds',

    'pricing.feature.massage': 'Massatge terapèutic',
    'pricing.feature.kinesiology': 'Kinesiologia',
    'pricing.feature.osteopathy': 'Osteopatia suau',
    'pricing.feature.save15': 'Estalvia 15€',
    'pricing.feature.valid3months': 'Vàlid per 3 mesos',
    'pricing.feature.transferable': 'Transferible',
    'pricing.feature.save25': 'Estalvia 25€',
    'pricing.feature.valid6months': 'Vàlid per 6 mesos',
    'pricing.feature.priority': 'Prioritat de reserva',

    'pricing.guarantee.nocommitment.title': 'Sense compromisos',
    'pricing.guarantee.nocommitment.desc':
      'Cancel·la o canvia la teva cita fins 24h abans sense cost',
    'pricing.guarantee.satisfaction.title': 'Garantia de satisfacció',
    'pricing.guarantee.satisfaction.desc':
      'Si no estàs satisfet amb la primera sessió, te la reemborsen',
    'pricing.guarantee.certified.title': 'Professionals certificats',
    'pricing.guarantee.certified.desc': 'Tots els nostres terapeutes tenen certificacions oficials',
    'pricing.guarantee.equipment.title': 'Equip professional',
    'pricing.guarantee.equipment.desc': 'Utilitzem només equip i productes de màxima qualitat',

    'pricing.cta.unsure.title': 'No estàs segur quin pla triar?',
    'pricing.cta.unsure.subtitle':
      "Fes la nostra avaluació gratuïta i descobreix quin tractament s'adapta millor a les teves necessitats",
    'pricing.cta.unsure.button': 'Descobrir els nostres serveis',

    // Booking Popup
    'booking.smart.service.placeholder': 'Selecciona un servei...',
    'booking.smart.time.placeholder': 'Ex: matins, divendres...',
    'booking.whatsapp.name': 'Nom',
    'booking.whatsapp.serviceLabel': 'Servei',
    'booking.whatsapp.preference': 'Preferència horària',
    'booking.service.other': 'Altre',
    'booking.service.consultation': 'Consulta inicial',
    'booking.smart.quick': 'Reserva ràpida',
    'booking.smart.quickDesc': 'Contacta per WhatsApp directament.',
    'booking.smart.form': 'Formulari',
    'booking.smart.formDesc': 'Omple els detalls primer.',
    'booking.smart.name': 'El teu nom',
    'booking.smart.service': 'Servei',
    'booking.smart.time': 'Horari preferit',
    'booking.smart.send': 'Enviar per WhatsApp',
    'booking.smart.title': 'Reserva la teva cita',
    'booking.smart.subtitle': 'Tria com vols contactar',

    // Missing keys added by script
    'elena.work.title': 'El meu enfocament',
    'common.home': 'Inici',
    'common.about': 'Sobre mi',
    'common.blog': 'Blog',
    'common.services': 'Serveis',
    'common.faq': 'Preguntes freqüents',
    'common.terms': 'Termes i condicions',
    'common.privacy': 'Política de privacitat',
    'common.cookies': 'Política de cookies',
    'common.copyright': 'Tots els drets reservats.',
    'common.language': 'Idioma',
    'common.close': 'Tancar',
    'common.menu': 'Menú',
    'common.next': 'Següent',
    'common.submit': 'Enviar',
    'common.success': 'Enviat correctament',
    'common.error': 'Hi ha hagut un error',
    'common.loading': 'Carregant...',
    'common.required': 'Requerit',
    'common.optional': 'Opcional',
    'common.book': 'Reservar',

    'personalized.artists.title': 'Benestar per a artistes i creatius | EKA Balance',
    'personalized.artists.description':
      'Potencia la teva creativitat, desbloqueja tensions i connecta amb la teva expressió artística.',
    'personalized.artists.keywords':
      'benestar artistes barcelona, creativitat, desbloqueig emocional',
    'personalized.athletes.title': 'Benestar per a atletes i esportistes | EKA Balance',
    'personalized.athletes.description':
      'Millora el teu rendiment, recupera lesions i optimitza el teu cos amb els nostres plans.',
    'personalized.athletes.keywords':
      'rendiment esportiu, recuperació lesions, optimització física',
    'personalized.musicians.title': 'Benestar per a músics | EKA Balance',
    'personalized.musicians.description':
      "Prevé lesions, millora la postura i connecta amb el teu instrument des d'un cos lliure.",
    'personalized.musicians.keywords': 'benestar músics, prevenció lesions, postura músics',
    'personalized.office.title': "Benestar per a treballadors d'oficina | EKA Balance",
    'personalized.office.description':
      "Alleuja el mal d'esquena, corregeix la postura i redueix l'estrès laboral amb els nostres programes.",
    'personalized.office.keywords':
      "mal d'esquena oficina, ergonomia, postura ordinador, estrès laboral",
    'personalized.parents.title': 'Benestar per a pares i mares | EKA Balance',
    'personalized.parents.description':
      "Troba el teu equilibri, redueix l'estrès i millora la teva energia vital per a la criança.",
    'personalized.parents.keywords':
      'benestar pares, criança conscient, estrès familiar, equilibri vida-treball',
    'personalized.students.title': 'Benestar per a estudiants | EKA Balance',
    'personalized.students.description':
      "Millora la concentració, redueix l'ansietat i optimitza el teu rendiment acadèmic.",
    'personalized.students.keywords': 'estrès exàmens, concentració estudiants, ansietat acadèmica',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.personalizedServices': 'Personalized services',
    'nav.revision360': '360° review',
    'nav.vip': 'VIP',
    'nav.bookNow': 'Book now',
    'nav.contact': 'Contact',
    'nav.aboutElena': 'About Elena',
    'nav.casos': 'Cases',

    'common.consultPrice': 'Ask price',
    'services.variableDuration': 'Variable',
    'services.mainBenefits': 'Key Benefits',

    // Elena Approach & Targets
    'elena.approach.title': 'The Elena Kucherova method',
    'elena.approach.desc':
      'I believe that your body, mind, and emotions are not separate parts, but a single, living system. My approach goes beyond treating symptoms—I seek the root cause of your discomfort to help your body rediscover its natural ability to heal and self-regulate. By integrating advanced bodywork with nervous system re-education—using techniques like Movement Lesson, JKA, Child’Space, Feldenkrais, and Biodynamics—I offer a gentle yet profound pathway to release deep tension, rewire old patterns, and restore the joy of effortless movement.',

    'elena.target.adults.title': 'For adults',
    'elena.target.adults.desc':
      'If you are navigating chronic fatigue, persistent back or neck pain, or the heavy toll of stress and trauma, I am here to help. Together, we will restore your inner resources, align your posture, and release psychosomatic blockages. This is more than a massage; it is a complete reset for your nervous system, empowering you to move through life with renewed lightness and vitality.',

    'elena.target.children.title': 'For children',
    'elena.target.children.desc':
      'Supporting your child’s harmonious development from their very first days. I specialize in working with motor delays, postural challenges, hyperactivity, and learning difficulties. Through gentle, respectful touch and movement, I help children connect deeply with their bodies, fostering coordination, confidence, and a secure foundation for their future growth.',

    'elena.target.families.title': 'For families with special needs',
    'elena.target.families.desc':
      'Comprehensive, compassionate support for families raising children with cp, genetic syndromes, or unique developmental needs. My work extends beyond the child—helping them master new skills—to include you, the parents. I guide you in supporting your child’s journey while ensuring you maintain your own energy and well-being.',

    // Dropdown items
    'nav.officeWorkers': 'Office professionals',
    'nav.athletes': 'Athletes',
    'nav.artists': 'Artists & creatives',
    'nav.musicians': 'Musicians',
    'nav.students': 'Students',
    'nav.parents': 'Parents',

    'home.founder': 'Founder & CEO',
    'home.elenaAlt': 'Elena, EKA Balance body therapist',
    'home.viewAllServices': 'View all services',
    'home.elenaName': 'Elena Kucherova',
    'elena.name': 'Elena Kucherova',

    // Hero section
    'hero.badge': 'Integrative somatic therapy',
    'hero.title': 'EKA Balance',
    'hero.subtitle':
      'We help you feel comfortable in your body again. Through personalized massage and practical therapies, we find what is causing your discomfort and help you recover your energy for daily life.',
    'hero.firstTime': 'Is it your first time?',
    'hero.dontKnowWhatToChoose': 'Request diagnostic guidance',
    'hero.discoverServices': 'View therapeutic protocols',
    'hero.stats.sessions': 'Therapeutic sessions',
    'hero.stats.clients': 'Successful cases',
    'hero.stats.experience': 'Years of expertise',
    'hero.stats.countries': 'International certifications',

    // Footer
    'footer.address': 'Carrer Pelai, 12, 08001 Barcelona, Spain',
    'footer.email': 'contact@ekabalance.com',
    'footer.copyright': '© 2024 EKA Balance. All rights reserved.',
    'footer.selectLanguage': 'Select language',
    'footer.discounts': 'Discounts',

    // Language Popup & Cookies
    'language.popup.title': 'Which language do you prefer?',
    'language.popup.subtitle': 'Select your language to continue',
    'cookies.wrongLanguage': 'Wrong language?',

    // Discovery Form - Location
    'discovery.location.barcelona': 'Barcelona',
    'discovery.location.rubi': 'Rubí',
    'discovery.location.online': 'Online / not nearby',
    'discovery.step.location.title': 'Where are you located?',
    'discovery.step.location.subtitle': 'To suggest the best option',
    'discovery.step.description.title': 'Tell us about your case',
    'discovery.step.description.subtitle':
      'Briefly describe what is happening or what you are looking for (minimum 3 characters)',
    'discovery.step.description.placeholder': 'Ex: i have had back pain for weeks...',

    // Services
    'services.massage.title': 'Advanced manual therapy',
    'services.massage.subtitle': 'Structural integration & myofascial release',
    'services.massage.description':
      'Therapeutic Approach to musculoskeletal dysfunction. We utilize deep tissue mobilization and neuromuscular techniques to restore range of motion and eliminate chronic pain patterns.',
    'services.kinesiology.title': 'Holistic kinesiology',
    'services.kinesiology.subtitle': 'Neuromuscular biofeedback diagnosis',
    'services.kinesiology.description':
      'Precision diagnostic methodology using muscle response testing to identify physiological, structural, and emotional stressors affecting your systemic health.',

    // New Content Translations
    'adult.kinesiology.badge': 'Integral Balance',
    'adult.nutrition.badge': 'Digestive Health',
    'children.recommended': 'Recommended Services',
    'children.recommended.desc': 'Specialized care for child development and well-being.',
    'children.kinesiology.badge': 'Learning & Emotions',
    'children.kinesiology.desc':
      'Support for learning difficulties, emotional management, and motor coordination.',
    'children.health.title': 'Body Balance',
    'children.health.desc':
      'Holistic treatment for allergies, intolerances, and healthy physical development.',
    'children.kinesiology.imgAlt': 'Pediatric Kinesiology',
    'children.health.badge': 'Physical Health',
    'children.health.imgAlt': 'Physical Health',
    'families.recommended': 'Recommended Services',
    'families.recommended.desc': 'Comprehensive support for the well-being of the whole family.',
    'families.kinesiology.badge': 'Family Well-being',
    'families.nutrition.badge': 'Healthy Habits',
    'services.nutrition.title': 'Metabolic optimization',
    'services.nutrition.subtitle': 'Functional nutrition & biochemistry',
    'services.nutrition.description':
      'Therapeutic nutritional strategies designed to reduce systemic inflammation, optimize metabolic function, and support neuro-endocrine regulation.',
    'services.revision360.title': '360° comprehensive assessment',
    'services.revision360.subtitle': 'Comprehensive Functional diagnosis',
    'services.revision360.description':
      'An exhaustive evaluation of your biomechanics, posture, and metabolic status. We generate a detailed wellness report and a personalized therapeutic roadmap.',
    'services.therapiesFor': 'Specialized methods for',
    'services.integralWellbeing': 'Integral wellbeing',
    'services.personalizedTreatments':
      'Discover treatments tailored to your unique lifestyle and needs',
    'services.consultation.title': 'Free 15-min consultation',
    'services.consultation.description':
      'Unsure which path is right for you? Let’s chat for 15 minutes, no strings attached, to see how I can best support your journey.',
    'services.consultation.feeling': 'Gain clarity on your next step',

    // Common
    'common.moreInfo': 'Learn more',
    'common.readMore': 'Read more',
    'common.expectedResult': 'Expected result',
    'common.bookNow': 'Book your session',
    'common.contact': 'Get in touch',
    'common.discoverServices': 'Explore services',
    'common.reserve': 'Reserve',
    'common.reserveNow': 'Book now',
    'common.seePlans': 'View plans',
    'common.hour': 'Hour',
    'common.hours': 'Hours',
    'common.reserveSession': 'Secure your spot',
    'common.seeOtherServices': 'View other services',
    'common.getStarted': 'Start your journey',
    'common.free': 'Free',

    // About Elena
    'elena.greeting': "Hello, I'm Elena",
    'elena.role': 'Specialist in somatic healing & body practices',
    'elena.bio':
      'I have dedicated my life to exploring the depths of therapeutic disciplines, crafting a unique, integrative Approach that honors the whole person.',
    'elena.work.title': 'My Approach',
    'elena.description1':
      'I am a body therapist specializing in therapeutic massage, kinesiology, and mind-body integration. My work is grounded in the belief that True healing comes from listening to the body.',
    'elena.description2':
      'My goal is simple: to help you release the weight of tension and reclaim your physical and emotional well-being, so you can move through life with lightness and renewed energy.',
    'elena.knowMore': 'Read my full story',
    'elena.quote':
      'The body has the innate capability to heal itself; my job is to remind it how to do so.',

    // Stats
    'stats.sessions': 'Sessions given',
    'stats.clients': 'Lives impacted',
    'stats.experience': 'Years of practice',
    'stats.rating': 'Average rating',
    'stats.countries': 'Countries studied in',
    'stats.cases': 'Complex cases solved',
    'stats.response': 'WhatsApp response time',

    // Why choose us
    'whyChoose.title': 'Why choose EKA Balance?',
    'whyChoose.subtitle':
      'We are more than a therapy center; we are your dedicated partners in holistic well-being.',
    'whyChoose.personalized.title': 'Truly personalized plans',
    'whyChoose.personalized.description':
      'Your body is unique, and your therapy should be too. We tailor every session to your specific physiology and history for faster, sustainable results.',
    'whyChoose.holistic.title': 'Systemic integration',
    'whyChoose.holistic.description':
      'We treat the whole you—structural, chemical, and emotional. Real healing happens when all your systems work in harmony.',
    'whyChoose.experienced.title': 'Expert guidance',
    'whyChoose.experienced.description':
      'Benefit from years of professional practice and continuous study in global modalities like Feldenkrais, osteopathy, and kinesiology.',

    // Final CTA
    'finalCta.title': 'Ready to transform your health?',
    'finalCta.subtitle':
      'Reach out today to book your session or ask any questions. Your journey to wellness starts here.',

    // Casos page
    'casos.hero.badge': 'Success stories',
    'casos.title': 'Pathways to healing',
    'casos.subtitle': 'Your body is speaking. We help you listen.',
    'casos.description':
      'Symptoms like pain, fatigue, or tension are often just the tip of the iceberg—signals from a system seeking Balance. At EKA Balance, we don’t just silence these signals; we decode them. By addressing the root cause, we’ve helped hundreds of clients transform their relationship with their bodies. Explore these common journeys to see what’s possible for you.',
    'casos.frequentCases': 'Most frequent cases',
    'casos.frequentCasesSubtitle': 'Common challenges we successfully resolve every day',
    'casos.otherCases': 'Other conditions we treat',
    'casos.otherCasesSubtitle': 'A comprehensive list of issues we can help you overcome',
    'casos.ctaTitle': 'We know how to help',
    'casos.ctaSubtitle':
      'If you recognize yourself in any of these stories, your body is asking for support. At EKA Balance, we accompany you with precise techniques, a human touch, and real results.',
    'casos.discoverIdeal': 'Find your ideal service',
    'casos.bookSession': 'Book your session',
    'casos.seeDetails': 'View details',

    // Casos section
    'casos.section.badge': 'Real problems, effective solutions',
    'casos.section.title': 'Problems we solve',
    'casos.section.titleHighlight': 'every day',
    'casos.section.subtitle':
      'Hundreds of people have reclaimed their well-being with us. Discover how we can help you too.',
    'casos.section.readMore': 'Read more',
    'casos.section.viewAll': 'View all cases',
    'casos.section.findYourCase': 'Find your case',

    // Problems
    'casos.problems.backPain.title': 'Chronic musculoskeletal pain',
    'casos.problems.backPain.description':
      'Therapeutic management of cervicalgia, lumbar pathology, and myofascial pain syndromes. We address the structural and Functional root causes of persistent discomfort.',
    'casos.problems.stress.title': 'Autonomic dysregulation',
    'casos.problems.stress.description':
      'Therapeutic intervention for high-stress states, anxiety, and sympathetic dominance. We restore vagal tone and promote physiological equilibrium.',
    'casos.problems.digestive.title': 'Visceral dysfunction',
    'casos.problems.digestive.description':
      'Integrative treatment for Functional gastrointestinal disorders. We optimize the gut-brain axis to resolve bloating, motility issues, and systemic inflammation.',
    'casos.problems.migraines.title': 'Cephalalgia & migraine',
    'casos.problems.migraines.description':
      'Neuro-vascular regulation for chronic headaches. We treat cervical triggers and cranial tension patterns to reduce frequency and intensity.',
    'casos.problems.lowEnergy.title': 'Systemic fatigue',
    'casos.problems.lowEnergy.description':
      'Metabolic and adrenal support for chronic exhaustion. We identify and treat the underlying bio-energetic depletions restoring vitality.',
    'casos.problems.hormonal.title': 'Endocrine regulation',
    'casos.problems.hormonal.description':
      'Somatic support for hormonal health. We address cycle irregularities and menopausal transition through neuro-endocrine balancing.',
    'casos.problems.sleep.title': 'Circadian rhythm disorders',
    'casos.problems.sleep.description':
      'Restoration of sleep architecture. We treat the nervous system hyperarousal that prevents deep, restorative rest.',
    'casos.problems.recovery.title': 'Post-traumatic rehabilitation',
    'casos.problems.recovery.description':
      'Accelerated tissue healing and Functional restoration following injury or surgery. We minimize scar tissue and restore proprioception.',
    'casos.problems.backPain.symptom1':
      'Stabbing pain or constant tension in the lower back or neck',
    'casos.problems.backPain.symptom2': 'Difficulty turning your head or Lifting your arm',
    'casos.problems.backPain.symptom3': 'Fatigue after sitting or standing for long periods',
    'casos.problems.backPain.symptom4': 'Feeling of heavy pressure on shoulders or head',
    'casos.problems.backPain.cause1': 'Prolonged poor posture and ergonomics',
    'casos.problems.backPain.cause2': 'Accumulated emotional stress stored in muscles',
    'casos.problems.backPain.cause3': 'Lack of Movement and sedentary habits',
    'casos.problems.backPain.cause4': 'Blocked or shallow breathing patterns',
    'casos.problems.backPain.treatment':
      'We use therapeutic massage, myofascial release, and kinesiology to find the root cause (stress, joint, or visceral blockage), combined with Feldenkrais for postural re-education.',
    'casos.problems.backPain.results':
      'Most clients feel immediate relief and improved mobility after just one session. Over time, your body relearns to support itself with effortless ease.',
    'casos.problems.stress.symptom1': 'Racing thoughts and mental loops',
    'casos.problems.stress.symptom2': 'Inability to relax or switch off',
    'casos.problems.stress.symptom3': 'Jaw clenching, neck pain, or morning fatigue',
    'casos.problems.stress.symptom4': 'Intense emotional reactions without clear cause',
    'casos.problems.stress.cause1': 'Overwhelming responsibilities and pressure',
    'casos.problems.stress.cause2': 'Chronic stress and lack of self-care time',
    'casos.problems.stress.cause3': 'Unresolved trauma or difficult life events',
    'casos.problems.stress.cause4': 'Imbalance in the autonomic nervous system',
    'casos.problems.stress.treatment':
      'We employ emotional kinesiology and vagal nerve techniques to soothe the nervous system, adding gentle bodywork (Feldenkrais, breathwork) to teach your body to truly"let go."',
    'casos.problems.stress.results':
      'Sleep improves, internal tension melts away, and you regain a sense of control and deep serenity.',
    'casos.problems.digestive.symptom1': 'Bloating, gas, reflux, or pain after eating',
    'casos.problems.digestive.symptom2': 'Post-meal fatigue or brain fog',
    'casos.problems.digestive.symptom3': 'Unexplained mood swings or irritability',
    'casos.problems.digestive.symptom4': 'Food intolerances or sensitivities',
    'casos.problems.digestive.cause1': 'Undiagnosed Food sensitivities',
    'casos.problems.digestive.cause2': 'Irregular eating habits or stress during meals',
    'casos.problems.digestive.cause3': 'Emotional stress impacting gut function',
    'casos.problems.digestive.cause4': 'Visceral restrictions affecting organ motility',
    'casos.problems.digestive.treatment':
      'We use nutritional kinesiology to identify sensitivities, apply gentle visceral massage, and provide personalized dietary guidance.',
    'casos.problems.digestive.results':
      'Digestion becomes smooth, bloating vanishes, and daily energy soars. You learn to listen to your body and nourish it correctly.',
    'casos.problems.migraines.symptom1': 'Throbbing pain on one side of the head or neck',
    'casos.problems.migraines.symptom2': 'Pressure behind the eyes or a"tight helmet" sensation',
    'casos.problems.migraines.symptom3': 'Dizziness, nausea, or vertigo',
    'casos.problems.migraines.symptom4': 'Extreme sensitivity to light and sound',
    'casos.problems.migraines.cause1': 'Cervical misalignments and muscle tension',
    'casos.problems.migraines.cause2': 'Jaw tension (bruxism) and TMJ issues',
    'casos.problems.migraines.cause3': 'Sleep deprivation or mental overload',
    'casos.problems.migraines.cause4': 'Hormonal fluctuations or dietary triggers',
    'casos.problems.migraines.treatment':
      'We combine cranial Osteobalance, muscle release, and vagal techniques to rebalance the nervous system, alongside breathing and posture correction.',
    'casos.problems.migraines.results':
      'Significant reduction in frequency and intensity. Many clients experience complete relief after addressing the cervical and cranial root causes.',
    'casos.problems.lowEnergy.symptom1': 'Constant exhaustion despite adequate sleep',
    'casos.problems.lowEnergy.symptom2': 'Brain fog, poor memory, and lack of focus',
    'casos.problems.lowEnergy.symptom3': 'Apathy, irritability, or lack of motivation',
    'casos.problems.lowEnergy.symptom4': 'Feeling like you are"running on empty"',
    'casos.problems.lowEnergy.cause1': 'Prolonged stress leading to burnout',
    'casos.problems.lowEnergy.cause2': 'Nutritional deficiencies or metabolic issues',
    'casos.problems.lowEnergy.cause3': 'Hormonal imbalances (thyroid, adrenals)',
    'casos.problems.lowEnergy.cause4': 'Emotional exhaustion and lack of purpose',
    'casos.problems.lowEnergy.treatment':
      'We use kinesiology to pinpoint imbalances, recommend natural supplementation, and use conscious Movement to reignite your vitality.',
    'casos.problems.lowEnergy.results':
      'A noticeable surge in energy, sharper mental clarity, and a more stable, positive mood.',
    'casos.problems.sleep.symptom1': 'Trouble falling asleep or frequent waking',
    'casos.problems.sleep.symptom2': 'Waking up tired, tense, or after intense dreams',
    'casos.problems.sleep.symptom3': 'Racing mind the moment you lie down',
    'casos.problems.sleep.symptom4': 'Light, restless, or unrefreshing sleep',
    'casos.problems.sleep.cause1': 'High stress and mental hyperarousal',
    'casos.problems.sleep.cause2': 'Circadian rhythm disruption and nervous system dysregulation',
    'casos.problems.sleep.cause3': 'Poor sleep hygiene or lack of routine',
    'casos.problems.sleep.cause4': 'Digestive issues or hormonal shifts',
    'casos.problems.sleep.treatment':
      'We integrate Feldenkrais, guided breathwork, vagal toning, and kinesiology to reset your body’s natural sleep cycles.',
    'casos.problems.sleep.results':
      'Restoration of deep, restorative sleep and waking up feeling truly refreshed within a few sessions.',
    'casos.problems.recovery.symptom1': 'Lingering pain or limited range of motion',
    'casos.problems.recovery.symptom2': 'Feeling weak, unstable, or off-Balance',
    'casos.problems.recovery.symptom3': 'Emotional anxiety related to the injury',
    'casos.problems.recovery.symptom4': 'Guarding or fear of moving normally',
    'casos.problems.recovery.cause1': 'Internal scar tissue and adhesions',
    'casos.problems.recovery.cause2': 'Compensatory Movement patterns',
    'casos.problems.recovery.cause3': 'Physical trauma with trapped emotional stress',
    'casos.problems.recovery.cause4': 'Cellular memory of the traumatic event',
    'casos.problems.recovery.treatment':
      'We use Osteobalance, fascial release, and postural re-education to heal the tissue and help you regain trust in your body.',
    'casos.problems.recovery.results':
      'Full recovery of mobility, elimination of pain, and a renewed sense of safety and confidence in Movement.',

    // Contact Form
    'contact.success.title': 'Message sent successfully!',
    'contact.success.message': 'Thank you for contacting us. We will get back to you very soon.',
    'contact.success.button': 'Send another message',
    'contact.title': 'Talk to us',
    'contact.subtitle':
      'We are here to help you on your path to wellness. Contact us and discover how we can improve your quality of life.',
    'contact.phone.title': 'Phone and WhatsApp',
    'contact.phone.subtitle': 'WhatsApp available 24/7',
    'contact.email.title': 'Email',
    'contact.email.subtitle': 'Response in less than 24h',
    'contact.location.title': 'Location',
    'contact.location.address': 'Carrer Pelai, 12\n08001 Barcelona',
    'contact.location.subtitle': 'Metro: l1 and l2 (universitat)',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email address',
    'contact.form.phone': 'Phone',
    'contact.form.service': 'Service of interest',
    'contact.form.service.placeholder': 'Select a service',
    'contact.form.time': 'Preferred time',
    'contact.form.time.placeholder': 'Select a time',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Briefly explain what you need...',
    'contact.form.preferred': 'Preferred contact method',
    'contact.form.submit': 'Send message',
    'contact.form.submitting': 'Sending...',
    'contact.form.privacy': 'I accept the privacy policy',
    'contact.form.source': 'How did you hear about us?',
    'contact.form.source.placeholder': 'Select an option',
    'contact.form.source.google': 'Google',
    'contact.form.source.social': 'Social media',
    'contact.form.source.friend': 'Friend recommendation',
    'contact.form.source.other': 'Other',
    'contact.quick.title': 'Or contact us directly:',
    'contact.quick.call': 'Call now',
    'contact.error': 'There was an error sending the message. Please try again.',

    // Contact Form Options
    'contact.service.massageBasic': 'Basic massage (1h)',
    'contact.service.massageComplete': 'Complete massage (1.5h)',
    'contact.service.massagePremium': 'Premium massage (2h)',
    'contact.service.kinesiology': 'Holistic kinesiology',
    'contact.service.nutrition': 'Conscious nutrition',
    'contact.service.revision360': '360° review',
    'contact.service.vip': 'VIP plans',
    'contact.service.other': 'Other inquiries',

    'contact.time.morning': 'Morning (9:00 - 12:00)',
    'contact.time.noon': 'Noon (12:00 - 15:00)',
    'contact.time.afternoon': 'Afternoon (15:00 - 18:00)',
    'contact.time.evening': 'Evening (18:00 - 21:00)',
    'contact.time.any': 'No preference',

    // Symptoms, causes, treatment, results labels
    'casos.symptoms': 'Symptoms',
    'casos.causes': 'Causes',
    'casos.treatment': 'Our Approach',
    'casos.results': 'Results',

    // Additional problems list
    'casos.additionalProblems.bruxism': 'Bruxism and jaw tension',
    'casos.additionalProblems.tmj': 'TMJ pain (temporomandibular joint)',
    'casos.additionalProblems.sciatica': 'Sciatica and leg pain',
    'casos.additionalProblems.shoulderPain': 'Shoulder pain and stiffness',
    'casos.additionalProblems.dizziness': 'Dizziness and vertigo',
    'casos.additionalProblems.irritability': 'Constant irritability',
    'casos.additionalProblems.intestinalProblems': 'Intestinal problems',
    'casos.additionalProblems.chronicFatigue': 'Chronic fatigue',
    'casos.additionalProblems.socialAnxiety': 'Social anxiety',
    'casos.additionalProblems.concentrationDifficulty': 'Difficulty concentrating',
    'casos.additionalProblems.headaches': 'Headaches and migraines',
    'casos.additionalProblems.insomnia': 'Insomnia and sleep disorders',
    'casos.additionalProblems.posture': 'Postural problems',
    'casos.additionalProblems.contractures': 'Muscle contractures',
    'casos.additionalProblems.emotionalBlock': 'Emotional blockages',
    'casos.additionalProblems.rsi': 'Repetitive strain injuries',
    'casos.additionalProblems.carpalTunnel': 'Carpal tunnel syndrome',
    'casos.additionalProblems.plantarFasciitis': 'Plantar fasciitis',

    // Testimonials
    'testimonials.title': 'What our clients say',
    'testimonials.subtitle':
      'Discover real experiences from people who have transformed their lives',
    'testimonials.all': 'All',
    'testimonials.hide': 'Hide',
    'testimonials.show': 'Show',
    'testimonials.beforeAfter': 'Before/after',
    'testimonials.before': 'Before',
    'testimonials.after': 'After',
    'testimonials.also': 'Also on:',
    'testimonials.with': 'With',
    'testimonials.ratings': 'Ratings',
    'testimonials.externalReviews': 'You can read more reviews on our external pages',
    'testimonials.photo': 'Photo of',
    'testimonials.satisfiedClient': 'Satisfied client',
    'testimonials.sliderTitle': 'Testimonials that speak for themselves',
    'testimonials.sliderSubtitle': 'Discover how we have helped our clients achieve their wellness',

    // Offline
    'offline.message': 'No internet connection',

    // Discounts page
    'discounts.pageTitle': 'Discounts - EKA Balance',
    'discounts.pageDescription':
      'Discover our special discounts for wellness services and therapies',
    'discounts.badge': 'Special offers',
    'discounts.title': 'Special discounts',
    'discounts.subtitle':
      'Enjoy reduced prices on our wellness services with our exclusive discounts',
    'discounts.availableTitle': 'Available discounts',
    'discounts.availableSubtitle':
      'Take advantage of these special offers to start your wellness journey',
    'discounts.mykolaFriend.description':
      "Special 20% discount for mykola's friends. Valid for all sessions and services.",
    'discounts.conocidoMykola.description':
      "10% discount for mykola's acquaintances. Applicable to all our treatments.",
    'discounts.off': 'Off',
    'discounts.active': 'Active',
    'discounts.code': 'Code',
    'discounts.copy': 'Copy',
    'discounts.howToUse.title': 'How to use discounts',
    'discounts.howToUse.subtitle': 'Follow these simple steps to apply your discount',
    'discounts.step1.title': 'Contact us',
    'discounts.step1.description': 'Get in touch with us via WhatsApp or phone to book',
    'discounts.step2.title': 'Mention the code',
    'discounts.step2.description': 'Provide the discount code when making your reservation',
    'discounts.step3.title': 'Enjoy the discount',
    'discounts.step3.description': 'The discount will be automatically applied to the final price',
    'discounts.cta.title': 'Ready to use your discount?',
    'discounts.cta.subtitle': 'Book your session now and enjoy the special price',
    'discounts.cta.bookNow': 'Book with discount',
    'discounts.cta.contact': 'Contact',

    // Personalized Services
    'personalizedServices.title': 'Specialized programs',
    'personalizedServices.subtitle':
      'Discover therapies specifically adapted to your professional lifestyle',
    'personalizedServices.cta': 'Book your session',
    'personalizedServices.difference.title': 'Difference between services',
    'personalizedServices.main.title': 'Main services',
    'personalizedServices.main.list1': 'General therapeutic massage',
    'personalizedServices.main.list2': 'Holistic kinesiology',
    'personalizedServices.main.list3': 'Conscious nutrition',
    'personalizedServices.main.list4': '360° review',
    'personalizedServices.special.title': 'Personalized services',
    'personalizedServices.special.list1': 'Adapted to your profession',
    'personalizedServices.special.list2': 'Specific Approach for needs',
    'personalizedServices.special.list3': 'Specialized techniques',
    'personalizedServices.special.list4': 'Personalized follow-up',
    'personalizedServices.choose.title': 'Choose your personalized service',
    'personalizedServices.choose.subtitle': 'Each profession has its specific needs',
    'personalizedServices.bookNow.title': 'Start your transformation today',
    'personalizedServices.bookNow.subtitle':
      'Book your personalized service and discover the difference',
    'personalizedServices.officeWorkers': 'Executives & office professionals',
    'personalizedServices.officeWorkers.desc':
      'Counteract the effects of sedentary work and high-level stress. Restore posture and mental clarity.',
    'personalizedServices.officeWorkers.benefit1': 'Relieves chronic back and neck tension',
    'personalizedServices.officeWorkers.benefit2': 'Optimizes ergonomic posture',
    'personalizedServices.officeWorkers.benefit3': 'Reduces cumulative stress and anxiety',
    'personalizedServices.officeWorkers.result': 'Peak productivity without physical burnout',
    'personalizedServices.athletes': 'Elite athletes',
    'personalizedServices.athletes.desc':
      'Maximize performance and accelerate recovery. Essential maintenance for the body in motion.',
    'personalizedServices.athletes.benefit1': 'Faster muscle recovery',
    'personalizedServices.athletes.benefit2': 'Injury prevention and flexibility',
    'personalizedServices.athletes.benefit3': 'Performance optimization',
    'personalizedServices.athletes.result': 'Competitive edge with reduced injury risk',
    'personalizedServices.artists': 'Artists',
    'personalizedServices.artists.desc':
      'Hand, arm and posture care for visual artists and creators',
    'personalizedServices.artists.benefit1': 'Specific care for hands and wrists',
    'personalizedServices.artists.benefit2': 'Improves posture during creation',
    'personalizedServices.artists.benefit3': 'Releases creativity by reducing physical tensions',
    'personalizedServices.artists.result': 'More comfort and fluidity in the creative process',
    'personalizedServices.musicians': 'Professional musicians',
    'personalizedServices.musicians.desc':
      'Fine-tuning the body-instrument connection. Prevent repetitive strain injuries.',
    'personalizedServices.musicians.benefit1': 'Release of repetitive strain',
    'personalizedServices.musicians.benefit2': 'Fine motor control improvement',
    'personalizedServices.musicians.benefit3': 'Postural awareness with instrument',
    'personalizedServices.musicians.result': 'Seamless artistic expression',
    'personalizedServices.students': 'Academics & students',
    'personalizedServices.students.desc':
      'Physical and mental support for high intellectual demand. Boost focus and relieve exam stress.',
    'personalizedServices.students.benefit1': 'Relief from study-induced tension',
    'personalizedServices.students.benefit2': 'Enhanced cerebral oxygenation & memory',
    'personalizedServices.students.benefit3': 'Sleep regulation',
    'personalizedServices.students.result': 'Sharp mind in a relaxed body',
    'personalizedServices.parents': 'Parents & Caregivers',
    'personalizedServices.parents.desc':
      'Support to recover energy, patience, and physical well-being while caring for others.',
    'personalizedServices.parents.benefit1': 'Relieves back pain from carrying children.',
    'personalizedServices.parents.benefit2': 'Reduces emotional fatigue and stress.',
    'personalizedServices.parents.benefit3': 'Restores vital energy levels.',
    'personalizedServices.parents.result': 'Feel revitalized to care with joy.',

    // Booking page
    'booking.title': 'Book your session - EKA Balance',
    'booking.description':
      'Easily book your wellness session in Barcelona. Direct contact via WhatsApp with quick response.',
    'booking.badge': 'Easy and quick booking',
    'booking.hero.title': 'Request therapeutic session',
    'booking.hero.subtitle':
      'Initiate your recovery process with a personalized professional assessment',
    'booking.benefits.whatsapp': 'Direct communication',
    'booking.benefits.flexible': 'Priority scheduling',
    'booking.benefits.confirmation': 'Immediate management',
    'booking.contact.title': 'Communication channel',
    'booking.contact.subtitle': 'Select your preferred method to coordinate the visit',
    'booking.direct.title': 'Direct consultation',
    'booking.direct.description': 'Contact the specialist directly to evaluate your case',
    'booking.direct.button': 'Start consultation',
    'booking.form.title': 'Appointment request',
    'booking.form.description': 'Provide preliminary health data to prepare the session',
    'booking.form.button': 'Start request',
    'booking.form.hide': 'Close form',
    'booking.form.location': 'Preferred location',
    'booking.form.locationPlaceholder': 'Select location',
    'booking.form.timeSlot': 'Time preference',
    'booking.form.timeSlotPlaceholder': 'Select slot',
    'booking.form.availability': 'Availability',
    'booking.form.availabilityPlaceholder': 'Indicate availability',
    'booking.form.objective': 'Reason for consultation',
    'booking.form.objectivePlaceholder': 'Briefly describe your symptomatology...',
    'booking.form.submit': 'Process request',

    // Options
    'booking.options.service.massage': 'Manual therapy',
    'booking.options.service.kinesiology': 'Holistic kinesiology',
    'booking.options.service.osteobalance': 'Osteobalance',
    'booking.options.service.movementLesson': 'Movement Lesson',
    'booking.options.service.feldenkrais': 'Feldenkrais method',
    'booking.options.service.online': 'Telemedicine / online',
    'booking.options.service.other': 'Other consultation',

    'booking.options.location.barcelona': 'Barcelona',
    'booking.options.location.rubi': 'Rubí',
    'booking.options.location.online': 'Online',

    'booking.options.availability.tomorrow': 'Tomorrow',
    'booking.options.availability.dayAfterTomorrow': 'Day after tomorrow',
    'booking.options.availability.nextWeek': 'Next week',
    'booking.options.availability.weekend': 'Weekend',
    'booking.options.availability.flexible': 'Flexible',

    'booking.options.timeSlot.morning': 'Morning (9:00-12:00)',
    'booking.options.timeSlot.noon': 'Noon (12:00-15:00)',
    'booking.options.timeSlot.afternoon': 'Afternoon (15:00-18:00)',
    'booking.options.timeSlot.evening': 'Evening (18:00-21:00)',
    'booking.form.quickTitle': 'Quick booking form',
    'booking.form.nameRequired': 'Name *',
    'booking.form.namePlaceholder': 'Your name',
    'booking.form.serviceRequired': 'Service *',
    'booking.form.servicePlaceholder': 'Select a service',
    'booking.form.validationError': 'Please fill in at least the name and the service of interest.',
    'booking.popup.title': 'Book your session',
    'booking.popup.subtitle': 'Select the service and date that suits you best',
    'booking.whatsapp.greeting': 'Hi, I am {name}',
    'booking.whatsapp.greetingGeneric': 'Hi Elena, I would like to book an appointment.',
    'booking.whatsapp.service': 'I would like to book a session: {service}',
    'booking.whatsapp.location': 'Preferred location: {location}',
    'booking.whatsapp.date': 'Preferred date: {date}',
    'booking.whatsapp.time': 'Preferred time: {time}',
    'booking.whatsapp.comments': 'Comments: {comments}',

    // Athletes personalized service
    'athletes.hero.badge': 'Specialized for athletes',
    'athletes.hero.title': 'Elite athletes',
    'athletes.hero.subtitle':
      'Biomechanical optimization, accelerated recovery, and injury prevention',
    'athletes.challenges.title': 'Performance challenges',
    'athletes.challenge1.title': 'Systemic fatigue',
    'athletes.challenge1.desc':
      'Inefficient post-exertion recovery and allostatic load accumulation',
    'athletes.challenge2.title': 'Biomechanical restriction',
    'athletes.challenge2.desc': 'Functional limitations compromising Movement efficiency',
    'athletes.challenge3.title': 'Competitive pressure',
    'athletes.challenge3.desc': 'Autonomic nervous system dysregulation under high demand',
    'athletes.help.title': 'Therapeutic intervention',
    'athletes.help1.title': 'Tissue regeneration',
    'athletes.help1.desc': 'Advanced protocols to accelerate muscle repair and reduce inflammation',
    'athletes.help2.title': 'Functional optimization',
    'athletes.help2.desc': 'Restoration of joint mobility and neuromuscular efficiency',
    'athletes.help3.title': 'Autonomic regulation',
    'athletes.help3.desc': 'Somatic strategies for stress control and focus',
    'athletes.result.title': 'Performance impact',
    'athletes.result.desc': 'Performance maximization, athletic longevity, and physical resilience',
    'athletes.stats.recovery': 'Optimal recovery',
    'athletes.stats.flexibility': 'Functional mobility',
    'athletes.stats.anxiety': 'Stress control',
    'athletes.session.title': 'Sports protocol',

    // Artists personalized service
    'artists.hero.badge': 'Health for creators',
    'artists.hero.title': 'Visual artists',
    'artists.hero.subtitle': 'Functional preservation of fine motor skills and creative ergonomics',
    'artists.challenges.title': 'Creative challenges',
    'artists.challenge1.title': 'Repetitive strain',
    'artists.challenge1.desc':
      'Microtrauma in upper extremities due to continuous technical gestures',
    'artists.challenge2.title': 'Postural fatigue',
    'artists.challenge2.desc': 'Musculoskeletal compromise derived from prolonged static postures',
    'artists.challenge3.title': 'Psychosomatic block',
    'artists.challenge3.desc': 'Physical restriction impacting creative flow and expression',
    'artists.help.title': 'Therapeutic intervention',
    'artists.help1.title': 'Motor rehabilitation',
    'artists.help1.desc': 'Specific manual therapy to restore hand and wrist function',
    'artists.help2.title': 'Ergonomic re-education',
    'artists.help2.desc': 'Biomechanical optimization of the creative gesture to prevent injury',
    'artists.help3.title': 'Somatic unblocking',
    'artists.help3.desc': 'Release of deep tensions to facilitate artistic flow',
    'artists.result.title': 'Creative impact',
    'artists.result.desc': 'Sustainability of artistic practice and freedom of Movement',
    'artists.stats.confidence': 'Creative confidence',
    'artists.stats.tension': 'Tension relief',
    'artists.stats.anxiety': 'Nervous regulation',
    'artists.session.title': 'Artist protocol',
    'artists.session.cta': 'Request evaluation',
    'artists.session.other': 'Other specialties',

    // Musicians personalized service
    'musicians.hero.badge': 'Performing arts medicine',
    'musicians.hero.title': 'Professional musicians',
    'musicians.hero.subtitle':
      'Instrumental ergonomics, dystonia prevention, and technical gesture optimization',
    'musicians.problems.title': 'Specific pathologies',
    'musicians.problems.subtitle':
      'Therapeutic Approach to musculoskeletal dysfunctions associated with instrumental practice',
    'musicians.problem1.title': 'Overuse syndromes',
    'musicians.problem1.desc': 'Tendinopathies and nerve entrapments derived from motor repetition',
    'musicians.problem2.title': 'Postural dysfunction',
    'musicians.problem2.desc': 'Asymmetries and muscle compensations induced by the instrument',
    'musicians.problem3.title': 'Stage dysregulation',
    'musicians.problem3.desc': 'Somatic manifestations of performance anxiety (tremor, sweating)',
    'musicians.problem4.title': 'Technical deterioration',
    'musicians.problem4.desc': 'Loss of fine motor control and neuromuscular coordination',
    'musicians.help.title': 'Therapeutic protocol',
    'musicians.help1.title': 'Functional rehabilitation',
    'musicians.help1.desc': 'Advanced manual therapy to restore upper extremity biomechanics',
    'musicians.help2.title': 'Postural re-education',
    'musicians.help2.desc': 'Ergonomic analysis and correction of instrumental technical gesture',
    'musicians.help3.title': 'Autonomic control',
    'musicians.help3.desc': 'Nervous system regulation strategies for public performance',
    'musicians.results.title': 'Therapeutic objectives',
    'musicians.results.point1': 'Resolution of painful symptomatology and paresthesias',
    'musicians.results.point2': 'Recovery of motor precision and endurance',
    'musicians.results.point3': 'Security and control in stage execution',
    'musicians.plans.title': 'Intervention programs',
    'musicians.plans.subtitle': 'Select the level of assistance required',
    'musicians.plan1.name': 'Diagnostic evaluation',
    'musicians.plan1.desc': 'Initial assessment and emergency treatment',
    'musicians.plan1.benefit1': 'Biomechanical gesture analysis',
    'musicians.plan1.benefit2': 'Focused manual therapy',
    'musicians.plan1.benefit3': 'Immediate ergonomic guidelines',
    'musicians.plan1.benefit4': 'Preliminary assessment',
    'musicians.plan1.result': 'Functional diagnosis and symptomatic relief',
    'musicians.plan2.name': 'Intensive treatment',
    'musicians.plan2.desc': 'Functional recovery protocol',
    'musicians.plan2.benefit1': 'Everything included in evaluation',
    'musicians.plan2.benefit2': 'Weekly evolutionary monitoring',
    'musicians.plan2.benefit3': 'Motor readaptation program',
    'musicians.plan2.benefit4': 'Direct telematic support',
    'musicians.plan2.result': 'Restoration of interpretative capacity',
    'musicians.plan2.popular': 'Recommended',
    'musicians.plan2.save': 'Subsidized',
    'musicians.plan3.name': 'High performance',
    'musicians.plan3.desc': 'Integral optimization for soloists',
    'musicians.plan3.benefit1': 'Complete intensive protocol',
    'musicians.plan3.benefit2': 'Metabolic counseling',
    'musicians.plan3.benefit3': 'Neuro-regulation training',
    'musicians.plan3.benefit4': '360° multidisciplinary evaluation',
    'musicians.plan3.result': 'Technical excellence and sustainable health',
    'musicians.plan.cta': 'Request program',

    // Students personalized service

    'students.challenges.title': 'Common problems',
    'students.challenge1.title': 'Exam stress',
    'students.challenge1.desc': 'Anxiety and tension that affect academic performance',
    'students.challenge2.title': 'Limited concentration',
    'students.challenge2.desc': 'Difficulty maintaining attention during long study sessions',
    // Students personalized service
    'students.hero.badge': 'Cognitive performance',
    'students.hero.title': 'Academic performance',
    'students.hero.subtitle':
      'Neuro-cognitive optimization, stress management, and postural ergonomics for students',
    'students.problems.title': 'Academic challenges',
    'students.problems.subtitle':
      'Therapeutic Approach to physical and mental barriers affecting study',
    'students.problem1.title': 'Cognitive fatigue',
    'students.problem1.desc':
      'Mental exhaustion and difficulty maintaining prolonged concentration',
    'students.problem2.title': 'Static overload',
    'students.problem2.desc': 'Cervical and lumbar pain derived from prolonged sitting posture',
    'students.problem3.title': 'Exam anxiety',
    'students.problem3.desc': 'Autonomic dysregulation associated with evaluative pressure',
    'students.problem4.title': 'Sleep disorders',
    'students.problem4.desc':
      'Insomnia and circadian rhythm alterations affecting memory consolidation',
    'students.help.title': 'Therapeutic protocol',
    'students.help1.title': 'Neuro-activation',
    'students.help1.desc': 'Strategies to optimize cerebral blood flow and mental acuity',
    'students.help2.title': 'Ergonomic correction',
    'students.help2.desc': 'Postural re-education to prevent static musculoskeletal damage',
    'students.help3.title': 'Stress regulation',
    'students.help3.desc': 'Techniques to manage cortisol levels and improve rest',
    'students.results.title': 'Therapeutic objectives',
    'students.results.point1': 'Increase in concentration capacity and retention',
    'students.results.point2': 'Elimination of tension pain associated with study',
    'students.results.point3': 'Optimization of rest and energy recovery',
    'students.plans.title': 'Intervention programs',
    'students.plans.subtitle': 'Select the level of assistance required',
    'students.plan1.name': 'Diagnostic evaluation',
    'students.plan1.desc': 'Initial assessment and emergency treatment',
    'students.plan1.benefit1': 'Postural and tension analysis',
    'students.plan1.benefit2': 'Cervical manual therapy',
    'students.plan1.benefit3': 'Basic ergonomic guidelines',
    'students.plan1.benefit4': 'Preliminary assessment',
    'students.plan1.result': 'Symptomatic relief and postural awareness',
    'students.plan2.name': 'Intensive treatment',
    'students.plan2.desc': 'Functional recovery protocol',
    'students.plan2.benefit1': 'Everything included in evaluation',
    'students.plan2.benefit2': 'Weekly evolutionary monitoring',
    'students.plan2.benefit3': 'Cognitive activation exercises',
    'students.plan2.benefit4': 'Direct telematic support',
    'students.plan2.result': 'Sustained improvement in academic performance',
    'students.plan2.popular': 'Recommended',
    'students.plan2.save': 'Subsidized',
    'students.plan3.name': 'High performance',
    'students.plan3.desc': 'Integral optimization for exams',
    'students.plan3.benefit1': 'Complete intensive protocol',
    'students.plan3.benefit2': 'Nutritional counseling for brain',
    'students.plan3.benefit3': 'Advanced sleep hygiene',
    'students.plan3.benefit4': '360° multidisciplinary evaluation',
    'students.plan3.result': 'Maximum cognitive potential and health',
    'students.plan.cta': 'Request program',

    // Office Workers personalized service
    'office.hero.badge': 'Corporate health',
    'office.hero.title': 'Executive health',
    'office.hero.subtitle':
      'Ergonomics, stress management, and postural correction for the digital environment',
    'office.problems.title': 'Occupational pathologies',
    'office.problems.subtitle':
      'Comprehensive Approach to dysfunctions derived from sedentary work and digital stress',
    'office.problem1.title': 'Tech neck syndrome',
    'office.problem1.desc': 'Cervical rectification and anterior head carriage from screen use',
    'office.problem2.title': 'Chronic lumbar pain',
    'office.problem2.desc': 'Disc compression and muscle shortening due to prolonged sitting',
    'office.problem3.title': 'Digital burnout',
    'office.problem3.desc': 'Nervous system exhaustion due to hyperconnectivity',
    'office.problem4.title': 'Peripheral neuropathies',
    'office.problem4.desc': 'Carpal tunnel and epicondylitis (mouse elbow)',
    'office.help.title': 'Therapeutic protocol',
    'office.help1.title': 'Postural re-education',
    'office.help1.desc': 'Correction of spinal alignment and workstation ergonomics',
    'office.help2.title': 'Myofascial decompression',
    'office.help2.desc': 'Release of deep tension patterns in neck and back',
    'office.help3.title': 'Vagal regulation',
    'office.help3.desc': 'Techniques to deactivate the sympathetic stress response',
    'office.results.title': 'Key objectives',
    'office.results.point1': 'Restoration of painless mobility and posture',
    'office.results.point2': 'Increase in productivity and mental clarity',
    'office.results.point3': 'Prevention of degenerative spinal injuries',
    'office.plans.title': 'Intervention programs',
    'office.plans.subtitle': 'Select the level of specialized assistance required',
    'office.plan1.name': 'Diagnostic evaluation',
    'office.plan1.desc': 'Initial assessment and emergency treatment',
    'office.plan1.benefit1': 'Digital ergonomic analysis',
    'office.plan1.benefit2': 'Decompressive manual therapy',
    'office.plan1.benefit3': 'Immediate postural guidelines',
    'office.plan1.benefit4': 'Preliminary assessment report',
    'office.plan1.result': 'Symptomatic relief and ergonomic awareness',
    'office.plan2.name': 'Intensive treatment',
    'office.plan2.desc': 'Functional recovery protocol',
    'office.plan2.benefit1': 'Everything included in evaluation',
    'office.plan2.benefit2': 'Weekly evolutionary monitoring',
    'office.plan2.benefit3': 'Compensatory exercise program',
    'office.plan2.benefit4': 'Direct telematic support',
    'office.plan2.result': 'Sustainable correction of occupational pathology',
    'office.plan2.popular': 'Recommended',
    'office.plan2.save': 'Subsidized',
    'office.plan3.name': 'Executive performance',
    'office.plan3.desc': 'Integral optimization for leadership',
    'office.plan3.benefit1': 'Complete intensive protocol',
    'office.plan3.benefit2': 'Stress management coaching',
    'office.plan3.benefit3': 'Biohacking for productivity',
    'office.plan3.benefit4': '360° multidisciplinary evaluation',
    'office.plan3.result': 'Maximum professional performance and health',
    'office.plan.cta': 'Request program',

    // FAQ Section
    'faq.title': 'Frequently asked questions',
    'faq.subtitle': 'Find answers to the most common questions about our services',
    'faq.q1.question': 'How long does a typical session last?',
    'faq.q1.answer':
      'Sessions usually last between 60 and 90 minutes, depending on the chosen treatment and your specific needs.',
    'faq.q2.question': 'Do i need prior experience?',
    'faq.q2.answer':
      'No prior experience is needed. All our treatments are adapted to your level and specific needs.',
    'faq.q3.question': 'How often should i come?',
    'faq.q3.answer':
      'Depending on your goals, we recommend 1-2 sessions per week initially, and then monthly maintenance sessions.',
    'faq.q4.question': 'What payment methods do you accept?',
    'faq.q4.answer': 'We accept cash, credit and debit cards, and also bizum for convenience.',
    'faq.q5.question': 'Can i cancel or reschedule my appointment?',
    'faq.q5.answer':
      'Yes, you can cancel or reschedule with 24 hours notice without any additional charge.',

    // First Time Visitor Form
    'form.badge': 'Personalized discovery',
    'form.title': 'Find the perfect service for you',
    'form.subtitle': "Answer a few quick questions and we'll help you find the ideal therapy",
    'form.contactWhatsApp': 'Contact WhatsApp',
    'form.step': 'Step',
    'form.of': 'Of',
    'form.previous': 'Previous',
    'form.next': 'Next',
    'form.seeRecommendation': 'See recommendation',
    'form.backToForm': 'Back to form',
    'form.close': 'Close',
    'form.closeForm': 'Close form',

    'form.step1.question': 'What is your main profile?',
    'form.userType.officeWorker': 'Office worker',
    'form.userType.officeWorkerDesc': 'I spend many hours sitting in front of the computer',
    'form.userType.athlete': 'Athlete',
    'form.userType.athleteDesc': 'I exercise regularly or am a professional athlete',
    'form.userType.artist': 'Artist or creator',
    'form.userType.artistDesc': 'I work with my hands (painting, sculpture, crafts)',
    'form.userType.musician': 'Musician',
    'form.userType.musicianDesc': 'I play musical instruments regularly',
    'form.userType.student': 'Student',
    'form.userType.studentDesc': 'I study or am preparing for exams',
    'form.userType.general': 'Other profiles',
    'form.userType.generalDesc': 'None of the above or a combination of several',

    'form.step2.question': 'What are your goals? (Select all that apply)',
    'form.goals.musclePain': 'Resolve musculoskeletal pain',
    'form.goals.stress': 'Regulate nervous system',
    'form.goals.posture': 'Correct postural dysfunction',
    'form.goals.relaxation': 'Deep somatic release',
    'form.goals.recovery': 'Accelerate tissue recovery',
    'form.goals.sleep': 'Restore sleep architecture',
    'form.goals.emotions': 'Emotional integration',
    'form.goals.energy': 'Optimize metabolic vitality',

    'form.step3.question': 'How much time do you have available per session?',
    'form.time.short': 'Less than 1 hour',
    'form.time.standard': '1-1.5 hours',
    'form.time.long': 'More than 1.5 hours',

    'form.step4.question': 'What experience do you have with body therapies?',
    'form.experience.none': 'This is my first time',
    'form.experience.noneDesc': 'I have never received body therapies',
    'form.experience.some': 'I have some experience',
    'form.experience.someDesc': 'I have been to massages or therapies occasionally',
    'form.experience.experienced': 'I have experience',
    'form.experience.experiencedDesc': 'I receive therapies regularly',

    'form.step5.question': 'What type of intensity do you prefer?',
    'form.intensity.gentle': 'Gentle and relaxing',
    'form.intensity.gentleDesc': 'I prefer a gentle and calm treatment',
    'form.intensity.medium': 'Moderate',
    'form.intensity.mediumDesc': 'Balanced treatment between relaxation and deep work',
    'form.intensity.deep': 'Intense and deep',
    'form.intensity.deepDesc': 'I want deep work for specific tensions',

    'form.recommendation.badge': 'Personalized recommendation',
    'form.recommendation.title': 'Your ideal service',
    'form.recommendation.subtitle':
      'Based on your profile, we have found the perfect service for you',
    'form.recommendation.price': 'Price',
    'form.recommendation.duration': 'Duration',
    'form.recommendation.benefits': 'Main benefits',

    'form.recommendation.officeWorker.title': 'Executive decompression protocol',
    'form.recommendation.officeWorker.desc':
      'Therapeutic intervention for sedentary pathology. We treat cervicalgia, upper crossed syndrome, and cognitive fatigue.',
    'form.recommendation.officeWorker.benefit1': 'Cervical & lumbar decompression',
    'form.recommendation.officeWorker.benefit2': 'Ergonomic re-education',
    'form.recommendation.officeWorker.benefit3': 'Vagal tone restoration',
    'form.recommendation.officeWorker.benefit4': 'Cognitive clarity',

    'form.recommendation.athlete.title': 'High performance protocol',
    'form.recommendation.athlete.desc':
      'Advanced biomechanical optimization. We accelerate tissue regeneration and correct Functional asymmetries.',
    'form.recommendation.athlete.benefit1': 'Myofascial release',
    'form.recommendation.athlete.benefit2': 'Injury prevention',
    'form.recommendation.athlete.benefit3': 'Range of motion optimization',
    'form.recommendation.athlete.benefit4': 'Metabolic recovery',

    'form.recommendation.artist.title': 'Creative ergonomics protocol',
    'form.recommendation.artist.desc':
      'Fine motor rehabilitation for visual artists. We treat repetitive strain injuries and restore creative flow.',
    'form.recommendation.artist.benefit1': 'Carpal tunnel prevention',
    'form.recommendation.artist.benefit2': 'Postural stabilization',
    'form.recommendation.artist.benefit3': 'Somatic unblocking',
    'form.recommendation.artist.benefit4': 'Functional longevity',

    'form.recommendation.musician.title': 'Performing arts medicine',
    'form.recommendation.musician.desc':
      'Specialized treatment for instrumentalists. We address focal dystonia, overuse syndromes, and performance anxiety.',
    'form.recommendation.musician.benefit1': 'Technical gesture optimization',
    'form.recommendation.musician.benefit2': 'Neuromuscular coordination',
    'form.recommendation.musician.benefit3': 'Autonomic regulation',
    'form.recommendation.musician.benefit4': 'Proprioceptive refinement',

    'form.recommendation.student.title': 'Cognitive performance protocol',
    'form.recommendation.student.desc':
      'Neuro-regulation for academic excellence. We mitigate exam anxiety and optimize focus through somatic integration.',
    'form.recommendation.student.benefit1': 'Sympathetic down-regulation',
    'form.recommendation.student.benefit2': 'Focus enhancement',
    'form.recommendation.student.benefit3': 'Postural correction',
    'form.recommendation.student.benefit4': 'Adrenal support',

    'form.recommendation.holistic.title': 'Integrative somatic session',
    'form.recommendation.holistic.desc':
      'Synergistic application of manual therapy and holistic kinesiology for systemic diagnosis and treatment.',
    'form.recommendation.holistic.benefit1': 'Systemic diagnosis',
    'form.recommendation.holistic.benefit2': 'Neuro-affective Balance',
    'form.recommendation.holistic.benefit3': 'Structural alignment',
    'form.recommendation.holistic.benefit4': 'Emotional processing',

    'form.recommendation.therapeutic.title': 'Advanced manual therapy',
    'form.recommendation.therapeutic.desc':
      'Deep tissue mobilization for chronic pain management and Functional restoration.',
    'form.recommendation.therapeutic.benefit1': 'Pain pattern resolution',
    'form.recommendation.therapeutic.benefit2': 'Joint mobilization',
    'form.recommendation.therapeutic.benefit3': 'Fascial release',
    'form.recommendation.therapeutic.benefit4': 'Parasympathetic activation',

    'form.recommendation.kinesiology.title': 'Holistic kinesiology',
    'form.recommendation.kinesiology.desc':
      'Therapy that combines body and emotional techniques to rebalance your general state',
    'form.recommendation.kinesiology.benefit1': 'Emotional Balance',
    'form.recommendation.kinesiology.benefit2': 'Stress management',
    'form.recommendation.kinesiology.benefit3': 'Improves self-awareness',
    'form.recommendation.kinesiology.benefit4': 'Inner peace',

    'form.recommendation.discovery.title': 'Discovery session',
    'form.recommendation.discovery.desc':
      'Initial session to explore your needs and create a personalized plan for your wellbeing',
    'form.recommendation.discovery.benefit1': 'Complete assessment',
    'form.recommendation.discovery.benefit2': 'Personalized plan',
    'form.recommendation.discovery.benefit3': 'First experience',
    'form.recommendation.discovery.benefit4': 'Professional guidance',

    // Onboarding System
    'onboarding.welcome.title': 'Welcome',
    'onboarding.welcome.description':
      "Every person is different. That's why, before recommending anything, we want to listen to you. Tell us who you are, what you're looking for and how you want to feel. We'll help you find the path that resonates most with you.",
    'onboarding.welcome.discountBadge': '15€ discount on your first session',
    'onboarding.progress.step': 'Step',
    'onboarding.progress.of': 'Of',
    'onboarding.processing.title': 'Personalizing your experience...',
    'onboarding.processing.subtitle':
      "We're analyzing your responses to find the best recommendations.",
    'onboarding.finish': 'Finish',
    'onboarding.results.title': 'Your personalized experience is ready',
    'onboarding.results.subtitle': 'Based on your responses, we recommend:',
    'onboarding.results.recommended': 'Recommended',
    'onboarding.results.discountApplied': '🎁 -15€ First session',
    'onboarding.results.howYouWillFeel': 'How you will feel',
    'onboarding.results.personalizedInfo': 'Personalized info',

    'onboarding.questions.userType.title': 'How would you best describe yourself?',
    'onboarding.userTypes.student': 'Student',
    'onboarding.userTypes.office': 'Office worker',
    'onboarding.userTypes.artist': 'Artist or musician',
    'onboarding.userTypes.musician': 'Musician',
    'onboarding.userTypes.athlete': 'Athlete',
    'onboarding.userTypes.parent': 'Parent',
    'onboarding.userTypes.entrepreneur': 'Entrepreneur',
    'onboarding.userTypes.therapist': 'Therapist or wellness professional',
    'onboarding.userTypes.senior': 'Senior',
    'onboarding.userTypes.other': 'Other',

    'onboarding.questions.goals.title': 'What would you like to improve?',
    'onboarding.goals.stress': 'Reduce stress and anxiety',
    'onboarding.goals.pain': 'Relieve physical pain',
    'onboarding.goals.posture': 'Improve posture and flexibility',
    'onboarding.goals.sleep': 'Sleep better',
    'onboarding.goals.energy': 'Recover energy and mental clarity',
    'onboarding.goals.focus': 'Increase creativity and concentration',
    'onboarding.goals.bodyAwareness': 'Connect more with your body',
    'onboarding.goals.feelGood': 'Simply feel good',

    'onboarding.questions.preferredFeeling.title': 'How would you like to feel after the session?',
    'onboarding.feelings.calm': 'Calm and tranquil',
    'onboarding.feelings.light': 'Light and free',
    'onboarding.feelings.energized': 'Energized and vital',
    'onboarding.feelings.focused': 'Mental clarity',
    'onboarding.feelings.confident': 'Confident and present',

    'onboarding.questions.approach.title': 'What type of Approach do you prefer?',
    'onboarding.approaches.massage': 'Massage',
    'onboarding.approaches.kinesiology': 'Kinesiology',
    'onboarding.approaches.feldenkrais': 'Feldenkrais method',
    'onboarding.approaches.energy': 'Energy Balance',
    'onboarding.approaches.open': 'Open to recommendations',

    'onboarding.questions.timePreference.title':
      'How much time do you want to dedicate to your wellbeing today?',
    'onboarding.time.60min': '1.5h',
    'onboarding.time.90min': '90 minutes',
    'onboarding.time.120min': '120 minutes',

    'recommendations.massage.description':
      'Therapeutic massage session perfect for relieving tension and recovering physical Balance.',
    'recommendations.kinesiology.description':
      'Holistic kinesiology to Balance body, emotions and find the root of imbalances.',
    'recommendations.feldenkrais.description':
      'Feldenkrais method to rediscover natural Movement and release tension patterns.',

    // Personalized Pages
    'personalized.students.hero.title': 'Cognitive performance optimization',
    'personalized.students.hero.description':
      'Professional support for high-demand academic environments. We optimize focus, manage exam stress, and correct study-related postural dysfunction.',
    'personalized.students.understanding.title': 'Neuro-cognitive & postural analysis',
    'personalized.students.understanding.description1':
      'Academic excellence requires physiological regulation. Prolonged cognitive effort depletes neurotransmitters and creates static load on the spine.',
    'personalized.students.understanding.description2':
      'We address the somatic root of concentration deficits and exam anxiety.',
    'personalized.students.understanding.callToAction':
      'Restore your cognitive capacity and structural integrity through therapeutic intervention.',
    'personalized.students.services.title': 'Therapeutic protocols',
    'personalized.students.services.subtitle':
      'Evidence-based interventions for academic performance',
    'personalized.students.services.kinesiologyStress.title': 'Neuro-regulation therapy',
    'personalized.students.services.kinesiologyStress.description':
      'Targeted protocol to down-regulate the sympathetic nervous system and restore focus.',
    'personalized.students.services.relaxingMassage.title': 'Cervical decompression',
    'personalized.students.services.relaxingMassage.description':
      'Manual therapy focused on releasing suboccipital tension and improving cerebral blood flow.',
    'personalized.students.testimonial.title': 'Patient outcome',
    'personalized.students.testimonial.quote':
      'The protocol significantly improved my retention capacity and eliminated the chronic cervical tension during finals week.',
    'personalized.students.testimonial.author': 'Maria, medical student',

    'personalized.officeWorkers.hero.title': 'Executive health & ergonomics',
    'personalized.officeWorkers.hero.description':
      'Comprehensive management of sedentary pathology. We treat"tech neck", repetitive strain, and digital burnout.',
    'personalized.officeWorkers.understanding.title': 'Occupational health assessment',
    'personalized.officeWorkers.understanding.description1':
      'The digital workspace imposes unnatural biomechanical loads. Static posture compresses the spine while cognitive load dysregulates the nervous system.',
    'personalized.officeWorkers.understanding.description2':
      'We treat the specific pathology of the modern executive: upper crossed syndrome and adrenal fatigue.',
    'personalized.officeWorkers.understanding.callToAction':
      'Reclaim your physiological vitality and professional productivity.',
    'personalized.officeWorkers.services.title': 'Therapeutic interventions',
    'personalized.officeWorkers.services.subtitle':
      'Somatic solutions for the digital professional',
    'personalized.officeWorkers.services.therapeuticMassage.title':
      'Myofascial structural integration',
    'personalized.officeWorkers.services.therapeuticMassage.description':
      'Deep tissue work to reverse anterior head carriage and thoracic kyphosis.',
    'personalized.officeWorkers.services.feldenkrais.title': 'Neuromuscular re-education',
    'personalized.officeWorkers.services.feldenkrais.description':
      'Somatic learning to restore efficient Movement patterns and prevent degenerative changes.',
    'personalized.officeWorkers.testimonial.title': 'Patient outcome',
    'personalized.officeWorkers.testimonial.quote':
      'The treatment resolved my chronic migraines and lumbar pain. Essential maintenance for high-performance work.',
    'personalized.officeWorkers.testimonial.author': 'Joan, senior software engineer',

    'personalized.officeWorkers.method.title': 'Corporate Wellness Protocol',
    'personalized.officeWorkers.method.step1.title': 'Postural Decompression',
    'personalized.officeWorkers.method.step1.desc':
      'We target fascial lines shortened by sitting, focusing on opening the chest and releasing neck tension.',
    'personalized.officeWorkers.method.step2.title': 'Nervous System Reset',
    'personalized.officeWorkers.method.step2.desc':
      'We shift your body from high-stress mode to a rest and repair state for deep recovery.',
    'personalized.officeWorkers.method.step3.title': 'Ergonomic Re-alignment',
    'personalized.officeWorkers.method.step3.desc':
      'We integrate simple somatic cues to help you maintain neutral alignment effortlessly throughout the day.',

    'personalized.officeWorkers.benefits.title': 'Key Benefits',
    'personalized.officeWorkers.benefit1':
      'Immediate relief from chronic neck, shoulder, and lower back pain.',
    'personalized.officeWorkers.benefit2':
      'Reduction in tension headaches and eye strain through cranial release.',
    'personalized.officeWorkers.benefit3':
      'Improved mental clarity and focus by regulating the nervous system.',
    'personalized.officeWorkers.benefit4':
      'Better sleep quality by down-regulating stress hormones accumulated during the day.',

    'personalized.officeWorkers.faq.title': 'Common Questions',

    'personalized.musicians.method.title': 'Musical Harmony Protocol',
    'personalized.musicians.method.step1.title': 'Instrument-Specific Analysis',
    'personalized.musicians.method.step1.desc':
      'We evaluate the unique biomechanical requirements of your instrument, identifying asymmetrical patterns.',
    'personalized.musicians.method.step2.title': 'Fine Motor Release',
    'personalized.musicians.method.step2.desc':
      'We focus on delicate hand and arm musculature, and core tension restricting breath.',
    'personalized.musicians.method.step3.title': 'Flow State Calibration',
    'personalized.musicians.method.step3.desc':
      'We unite breath and movement, reducing anxiety and allowing for fluid technical execution.',

    'personalized.musicians.benefits.title': 'Key Benefits',
    'personalized.musicians.benefit1':
      'Prevention and treatment of Repetitive Strain Injuries (RSI) and tendonitis.',
    'personalized.musicians.benefit2':
      'Enhanced breath control and resonance for wind players and vocalists.',
    'personalized.musicians.benefit3': 'Greater fluidity and reduced tension in playing posture.',
    'personalized.musicians.benefit4':
      'Reduction of performance anxiety through nervous system regulation.',

    'personalized.musicians.faq.title': 'Common Questions',
    'personalized.musicians.faq.q1': 'Can this help with tendonitis or carpal tunnel symptoms?',
    'personalized.musicians.faq.a1':
      'Yes. We treat not just locally, but trace the tension chain to the neck, addressing nerve compression at the source.',
    'personalized.musicians.faq.q2': 'Will treatment affect my playing technique?',
    'personalized.musicians.faq.a2':
      'It will refine it. By removing unnecessary tension, you will play with more ease, speed, and endurance.',
    'personalized.musicians.faq.q3': 'I play an asymmetrical instrument. How do you help?',
    'personalized.musicians.faq.a3':
      'We focus on unwinding rotational patterns, restoring symmetry to your resting posture.',
    'personalized.officeWorkers.faq.q1': 'I have "tech neck". Can somatic therapy fix my posture?',
    'personalized.officeWorkers.faq.a1':
      "It is highly effective because it doesn't just force shoulders back; it releases the tension pulling you forward, so good posture feels natural.",
    'personalized.officeWorkers.faq.q2': 'Is this suitable for preventative care?',
    'personalized.officeWorkers.faq.a2':
      'Absolutely. Regular sessions prevent the accumulation of micro-traumas from static postures.',
    'personalized.officeWorkers.faq.q3': 'Will I need to do exercises at my desk?',
    'personalized.officeWorkers.faq.a3':
      'We provide subtle micro-movements that reset your nervous system and posture without interrupting your workflow.',

    'personalized.musicians.hero.title': 'Performing arts medicine',
    'personalized.musicians.hero.description':
      'Specialized care for instrumentalists. We treat focal dystonia, overuse syndromes, and performance anxiety through functional biomechanics.',
    'personalized.musicians.understanding.title': 'The musician as elite athlete',
    'personalized.musicians.understanding.description1':
      'Musical performance demands extreme fine motor precision and sustained postural endurance. This creates unique neuromuscular risks.',
    'personalized.musicians.understanding.description2':
      'We address the specific pathophysiology of the musician: repetitive strain, nerve entrapment, and stage dysregulation.',
    'personalized.musicians.understanding.callToAction':
      'Optimize your technical gesture and extend your professional longevity.',
    'personalized.musicians.services.title': 'Performance protocols',
    'personalized.musicians.services.subtitle':
      'Therapeutic interventions for the performing artist',
    'personalized.musicians.services.feldenkraisExpression.title': 'Somatic motor control',
    'personalized.musicians.services.feldenkraisExpression.description':
      'Neuromuscular re-education to optimize instrumental ergonomics and reduce parasitic tension.',
    'personalized.musicians.services.kinesiologyPerformance.title': 'Performance neuro-integration',
    'personalized.musicians.services.kinesiologyPerformance.description':
      'Targeted protocol to resolve stage anxiety and beta-adrenergic blockage.',
    'personalized.musicians.testimonial.title': 'Artist outcome',
    'personalized.musicians.testimonial.quote':
      'The treatment resolved my focal dystonia symptoms and allowed me to return to the concert stage with full confidence.',
    'personalized.musicians.testimonial.author': 'Anna, concert pianist',

    'personalized.artists.hero.title': 'Visual artists',
    'personalized.artists.hero.description':
      'Functional preservation of fine motor skills and creative ergonomics',
    'personalized.artists.understanding.title': 'Creative challenges',
    'personalized.artists.understanding.description1':
      'Microtrauma in upper extremities due to continuous technical gestures.',
    'personalized.artists.understanding.description2':
      'Musculoskeletal compromise derived from prolonged static postures.',
    'personalized.artists.understanding.callToAction':
      'We help you release physical blocks impacting creative flow.',
    'personalized.artists.services.title': 'Therapeutic intervention',
    'personalized.artists.services.subtitle': 'Specialized treatments for artists',
    'personalized.artists.benefits.title': 'Creative impact',
    'personalized.artists.method.title': 'Our artist protocol',
    'personalized.artists.method.step1.title': 'Assessment',
    'personalized.artists.method.step1.desc': 'We analyze your posture and technical gestures.',
    'personalized.artists.method.step2.title': 'Treatment',
    'personalized.artists.method.step2.desc': 'Manual therapy to release tension and pain.',
    'personalized.artists.method.step3.title': 'Prevention',
    'personalized.artists.method.step3.desc':
      'Exercises and guidelines to maintain health while creating.',
    'personalized.artists.benefits.benefit1':
      'Sustainability of artistic practice and freedom of movement.',
    'personalized.artists.benefits.benefit2': 'Reduction of pain and muscle tension.',
    'personalized.artists.benefits.benefit3': 'Greater body and postural awareness.',

    'personalized.athletes.hero.title': 'High performance recovery',
    'personalized.athletes.hero.description':
      'Advanced biomechanical optimization. We accelerate tissue regeneration, correct Functional asymmetries, and prevent injury.',
    'personalized.athletes.understanding.title': 'Physiology of performance',
    'personalized.athletes.understanding.description1':
      'Elite performance requires rapid metabolic recovery and structural alignment. Accumulated micro-trauma leads to systemic compensation.',
    'personalized.athletes.understanding.description2':
      'We provide the specialized support necessary to maintain peak output without compromising structural integrity.',
    'personalized.athletes.understanding.callToAction':
      'Maximize your competitive edge through systemic optimization.',
    'personalized.athletes.services.title': 'Recovery protocols',
    'personalized.athletes.services.subtitle': 'Therapeutic interventions for the athlete',
    'personalized.athletes.services.sportsMassage.title': 'Deep tissue restoration',
    'personalized.athletes.services.sportsMassage.description':
      'Advanced mobilization to flush metabolic waste and restore fascial elasticity.',
    'personalized.athletes.services.osteobalance.title': 'Structural alignment',
    'personalized.athletes.services.osteobalance.description':
      'Precision adjustments to correct pelvic and spinal asymmetries affecting gait and power.',
    'personalized.athletes.testimonial.title': 'Athlete outcome',
    'personalized.athletes.testimonial.quote':
      'My recovery time has halved, and the chronic hamstring issue is completely resolved. Essential for my training cycle.',
    'personalized.athletes.testimonial.author': 'Marc, ultra-marathon runner',

    'personalized.athletes.method.title': 'Our Performance Protocol',
    'personalized.athletes.method.step1.title': 'Biomechanical Assessment',
    'personalized.athletes.method.step1.desc':
      'We analyze your movement patterns to identify neuromuscular inefficiencies and fascial restrictions.',
    'personalized.athletes.method.step2.title': 'Strategic Release & Activation',
    'personalized.athletes.method.step2.desc':
      'We release chronic tension while activating underactive stabilizers to restore structural balance.',
    'personalized.athletes.method.step3.title': 'Performance Integration',
    'personalized.athletes.method.step3.desc':
      'We retrain your nervous system for efficient movement strategies, enhancing power and reducing recovery time.',

    'personalized.athletes.benefits.title': 'Key Benefits',
    'personalized.athletes.benefit1':
      'Accelerated recovery times through enhanced lymphatic drainage and fascial release.',
    'personalized.athletes.benefit2':
      'Prevention of overuse injuries by correcting compensatory movement patterns.',
    'personalized.athletes.benefit3':
      'Optimized biomechanics leading to greater explosive power and endurance.',
    'personalized.athletes.benefit4':
      'Increased proprioceptive awareness for better coordination and agility.',

    'personalized.athletes.faq.title': 'Common Questions',
    'personalized.athletes.faq.q1':
      'How does somatic therapy differ from a regular sports massage?',
    'personalized.athletes.faq.a1':
      'While sports massage focuses on muscle relaxation, somatic therapy addresses the nervous system control over those muscles. We work on the root cause.',
    'personalized.athletes.faq.q2':
      "Can this help with chronic injuries that haven't healed with traditional physio?",
    'personalized.athletes.faq.a2':
      'Yes. Chronic injuries often persist because the body is stuck in a protective pattern. Our approach helps your nervous system feel safe enough to release these protective mechanisms.',
    'personalized.athletes.faq.q3': 'When should I schedule a session relative to my competition?',
    'personalized.athletes.faq.a3':
      'For deep release work, we recommend 3-5 days before a major event. For nervous system regulation and activation, 24-48 hours prior is ideal.',

    'personalized.parents.hero.title': 'Parental vitality & recovery',
    'personalized.parents.hero.description':
      'Professional support for the physical and emotional demands of parenthood. We restore energy, correct postural strain, and regulate the nervous system.',
    'personalized.parents.understanding.title': 'Physiological restoration',
    'personalized.parents.understanding.description1':
      'Parenthood imposes chronic sleep deprivation and repetitive physical load (Lifting, carrying). This depletes adrenal reserves and creates structural imbalances.',
    'personalized.parents.understanding.description2':
      'We provide a restorative space for systemic recovery and neuro-affective regulation.',
    'personalized.parents.understanding.callToAction':
      'Restore your physiological baseline to sustain your caregiving capacity.',
    'personalized.parents.services.title': 'Restoration protocols',
    'personalized.parents.services.subtitle': 'Therapeutic interventions for parental health',
    'personalized.parents.services.emotionalKinesiology.title': 'Neuro-affective integration',
    'personalized.parents.services.emotionalKinesiology.description':
      'Therapeutic protocol to process family stress and restore emotional homeostasis.',
    'personalized.parents.services.relaxingMassage.title': 'Deep somatic restoration',
    'personalized.parents.services.relaxingMassage.description':
      'Restorative massage focused on adrenal recovery and releasing chronic holding patterns.',
    'personalized.parents.testimonial.title': 'Patient outcome',
    'personalized.parents.testimonial.quote':
      'The sessions restored my energy levels and patience. It is not just relaxation; it is essential physiological maintenance.',
    'personalized.parents.testimonial.author': 'Laura, mother of two',

    'seo.students.title': 'Somatic therapy for academic performance | EKA Balance',
    'seo.students.description':
      'Neuro-cognitive optimization and postural correction for students. Improve focus, manage exam anxiety, and resolve study-related pain.',
    'seo.students.keywords':
      'Academic performance therapy, study ergonomics, exam anxiety relief, cognitive focus, student physiotherapy Barcelona',

    'seo.officeWorkers.title': 'Executive health & ergonomics | EKA Balance',
    'seo.officeWorkers.description':
      'Comprehensive management of sedentary pathology. Treatment for tech neck, carpal tunnel, and digital burnout. Corporate wellness solutions.',
    'seo.officeWorkers.keywords':
      'Executive health, office ergonomics, tech neck treatment, corporate wellness, repetitive strain injury Barcelona',

    'seo.musicians.title': 'Performing arts medicine | EKA Balance',
    'seo.musicians.description':
      'Specialized physiotherapy for musicians. Treatment of focal dystonia, overuse syndromes, and performance anxiety. Instrumental ergonomics.',
    'seo.musicians.keywords':
      'Performing arts medicine, musician physiotherapy, focal dystonia treatment, stage anxiety, instrumental ergonomics Barcelona',

    'seo.artists.title': 'Therapies for Artists - Creativity & Wellness | EKA Balance',
    'seo.artists.description':
      'Services for artists of all disciplines. Unlock your creativity, reduce stress, and improve your artistic expression.',
    'seo.artists.keywords':
      'Artist therapies, creativity, emotional wellness, artistic expression, art therapy Barcelona',

    'seo.adults.title': 'Holistic Wellness for Adults - Health & Balance | EKA Balance',
    'seo.adults.description':
      'Personalized treatments for adults: stress management, chronic pain relief, and quality of life improvement. Massage, kinesiology, and more.',
    'seo.adults.keywords':
      'Adult wellness, stress management, chronic pain, therapeutic massage, kinesiology Barcelona',

    'seo.children.title': 'Therapies for Children - Development & Growth | EKA Balance',
    'seo.children.description':
      'Support for child development through kinesiology and gentle methods. We help with learning, emotional, and coordination issues.',
    'seo.children.keywords':
      'Children therapies, child development, child kinesiology, learning difficulties, psychomotor coordination Barcelona',

    'seo.families.title': 'Wellness for Families - Harmony & Connection | EKA Balance',
    'seo.families.description':
      'Health space for the whole family. Improve coexistence, reduce tension, and find family balance with our systemic therapies.',
    'seo.families.keywords':
      'Family wellness, family therapy, home harmony, family kinesiology, parent-child relations Barcelona',

    'seo.athletes.title': 'Sports recovery & biomechanics | EKA Balance',
    'seo.athletes.description':
      'Advanced sports recovery and biomechanical optimization. Deep tissue mobilization, injury prevention, and performance enhancement.',
    'seo.athletes.keywords':
      'Sports recovery, biomechanical analysis, deep tissue massage, injury prevention, athlete physiotherapy Barcelona',

    'seo.parents.title': 'Parental vitality & post-partum recovery | EKA Balance',
    'seo.parents.description':
      'Professional support for parenthood. Adrenal recovery, postural correction, and stress management for parents. Restore your vitality.',
    'seo.parents.keywords':
      'Parental burnout, postpartum recovery, adrenal fatigue, stress management, parent wellness Barcelona',

    // Common translations for personalized pages
    'common.askQuestions': 'Ask questions',
    'common.learnMore': 'Learn more',
    'common.recommended': 'Recommended',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.disclaimer':
      'EKA Balance services are complementary support, not medical. They do not replace any professional diagnosis or treatment. The goal is to accompany you towards more wellbeing, awareness and global Balance.',

    'contact.form.whatsapp': 'WhatsApp',
    'contact.form.preferredTime': 'Preferred time',
    'contact.form.selectTime': 'Select a time',

    // Cookie translations
    'cookies.title': 'We use cookies to enhance your experience',
    'cookies.description':
      'We use essential cookies for website functionality and anonymous analytics to improve our services. We do not use advertising or tracking cookies. By continuing to use our site, you agree to our use of cookies.',
    'cookies.accept': 'Accept all',
    'cookies.reject': 'Reject',
    'cookies.learnMore': 'Learn more',

    // Layout footer
    'footer.privacyPolicy': 'Privacy policy',
    'footer.cookiePolicy': 'Cookie policy',
    'footer.termsOfService': 'Terms of service',
    'footer.logout': 'Logout',
    'footer.login': 'Login',

    // Service pages
    'services.page.benefits': 'Benefits',
    'services.page.testimonials': 'Testimonials',
    'services.page.sessions': 'Sessions',
    'services.page.duration': 'Duration',
    'services.page.price': 'Price',

    // Policy pages
    'policy.lastUpdated': 'Last updated:',
    'policy.introduction': 'Introduction',

    // Common
    'common.price': 'Price',
    'common.duration': 'Duration',
    'common.benefits': 'Main benefits',

    // Elena SEO
    'elena.seo.title': 'Elena Kucherova - integrative somatic therapist | EKA Balance',
    'elena.seo.desc':
      'Specialist in neuro-integrative kinesiology and advanced manual therapy. Over 10 years of professional experience in musculoskeletal recovery and autonomic regulation.',
    'elena.seo.keywords':
      'Elena Kucherova, integrative somatic therapist, neuro-integrative kinesiology, manual therapy Barcelona, musculoskeletal specialist',

    // Casos SEO
    'casos.seo.title': 'Case studies & therapeutic outcomes | EKA Balance',
    'casos.seo.desc':
      'Evidence-based results in the treatment of chronic pain, autonomic dysregulation, and Functional rehabilitation. Real therapeutic protocols and patient outcomes.',
    'casos.seo.keywords':
      'Case studies, chronic pain treatment, autonomic regulation, Functional rehabilitation, therapeutic outcomes Barcelona',

    // SEO
    'seo.home.title': 'EKA Balance - integrative somatics & manual therapy Barcelona',
    'seo.home.description':
      'Advanced center for musculoskeletal recovery and autonomic regulation. Specialized in manual therapy, holistic kinesiology, and biomechanics.',
    'seo.home.keywords':
      'Integrative somatics, manual therapy Barcelona, holistic kinesiology, biomechanics, musculoskeletal recovery, autonomic regulation',
    'seo.contact.title': 'Contact - appointments | EKA Balance',
    'seo.contact.description':
      'Schedule your comprehensive evaluation. Centers in Barcelona and Rubí. Professional consultation for complex musculoskeletal cases.',
    'seo.contact.keywords':
      'Therapeutic appointment, physiotherapy booking, health center Barcelona, wellness consultation',
    'seo.services.title': 'Therapeutic services | EKA Balance',
    'seo.services.description':
      'Evidence-based interventions: advanced manual therapy, neuro-integrative kinesiology, and functional biomechanics. Systemic health solutions.',
    'seo.services.keywords':
      'Manual therapy, holistic kinesiology, biomechanics, systemic health, integrative medicine Barcelona',
    'seo.personalized.title': 'Specialized therapeutic protocols | EKA Balance',
    'seo.personalized.description':
      'Targeted interventions for executives, elite athletes, performing artists, and academic performance. Precision medicine Approach.',
    'seo.personalized.keywords':
      'Executive health, sports medicine, performing arts medicine, academic performance, personalized therapy',
    'seo.vip.title': 'Inner circle VIP - elite health management | EKA Balance',
    'seo.vip.description':
      'Exclusive health management for high-performance individuals. Priority access, comprehensive monitoring, and personalized therapeutic strategy.',
    'seo.vip.keywords':
      'VIP health management, executive health program, elite wellness, concierge medicine Barcelona',
    'seo.massage.title': 'Advanced manual therapy & myofascial release | EKA Balance',
    'seo.massage.description':
      'Advanced manual therapy for chronic pain, structural alignment, and tissue recovery. Deep tissue mobilization and fascial release.',
    'seo.massage.keywords':
      'Manual therapy, myofascial release, deep tissue massage, chronic pain relief, structural integration',
    'seo.kinesiology.title': 'Holistic kinesiology & neuro-integration | EKA Balance',
    'seo.kinesiology.description':
      'Integrative assessment of physiological, structural, and emotional imbalances. Bio-feedback mechanisms for systemic regulation.',
    'seo.kinesiology.keywords':
      'Holistic kinesiology, neuro-integration, systemic regulation, emotional Balance, muscle testing',
    'seo.nutrition.title': 'Metabolic & nutritional counseling | EKA Balance',
    'seo.nutrition.description':
      'Functional nutrition for metabolic optimization and inflammatory control. Personalized dietary strategies for systemic health.',
    'seo.nutrition.keywords':
      'Functional nutrition, metabolic optimization, anti-inflammatory diet, gut health, nutritional counseling',

    // Massage Page
    'massage.hero.badge': 'Wellbeing for body and mind',
    'massage.benefits.pain': 'Relieves muscle and joint pain',
    'massage.benefits.circulation': 'Improves circulation and mobility',
    'massage.benefits.wellbeing': 'Immediate wellbeing and True rest',

    // Kinesiology Page
    'kinesiology.hero.badge': 'Body, mind and emotions in Balance',
    'kinesiology.benefits.posture': 'Improves posture and coordination',
    'kinesiology.benefits.stress': 'Reduces stress and improves rest',
    'kinesiology.benefits.energy': 'More self-awareness and stable energy',

    // Nutrition Page
    'nutrition.benefits.habits': 'Clear and sustainable eating habits',
    'nutrition.benefits.weight': 'Support in weight management and body composition',
    'nutrition.benefits.prevention': 'Prevention and long-term health',
    'nutrition.session.first.name': 'First session',
    'nutrition.session.first.description': 'Complete assessment and personalized plan',
    'nutrition.session.followup.name': 'Follow-up',
    'nutrition.session.followup.description': 'Plan adjustment and doubt resolution',

    // Discounts Page
    'discounts.success': 'Discount applied successfully!',
    'discounts.remove': 'Remove discount',

    // Discovery Form
    // Discovery Form - User Types
    'discovery.userTypes.mother.title': 'Parenting & caregiving',
    'discovery.userTypes.mother.desc':
      'I need to recharge my energy so i can keep caring for others.',
    'discovery.userTypes.woman.title': 'Women’s health',
    'discovery.userTypes.woman.desc':
      'I want to reconnect with my body, cycles, and feminine vitality.',
    'discovery.userTypes.regular.title': 'General wellness',
    'discovery.userTypes.regular.desc':
      'I’m looking for relaxation, Balance, and a moment for myself.',
    'discovery.userTypes.office.title': 'Office professional',
    'discovery.userTypes.office.desc': 'I spend hours sitting and feel the tension building up.',
    'discovery.userTypes.athlete.title': 'Athlete / active',
    'discovery.userTypes.athlete.desc': 'I want to optimize performance and speed up recovery.',

    // Discovery Form - Emotional States
    'discovery.emotional.stressed.title': 'Overwhelmed / anxious',
    'discovery.emotional.stressed.desc': 'My mind won’t stop, and i find it hard to relax.',
    'discovery.emotional.sad.title': 'Low mood / apathetic',
    'discovery.emotional.sad.desc': 'I feel heavy or unmotivated and want a shift.',
    'discovery.emotional.balanced.title': 'Balanced / neutral',
    'discovery.emotional.balanced.desc': 'I feel okay emotionally, just need physical care.',
    'discovery.emotional.focus_physical.title': 'Focus on the physical',
    'discovery.emotional.focus_physical.desc': 'I’m not sure, let’s just treat the body.',

    // Discovery Form - Time Commitments
    'discovery.time.short.title': 'Express session (up to 1h)',
    'discovery.time.short.desc': 'Perfect for a quick reset.',
    'discovery.time.standard.title': 'Standard session (1-1.5h)',
    'discovery.time.standard.desc': 'The ideal time for deep work.',
    'discovery.time.long.title': 'Deep dive (up to 2h)',
    'discovery.time.long.desc': 'For comprehensive, transformative care.',

    // Discovery Form - Budget
    'discovery.budget.basic.title': 'Essential (up to 60€)',
    'discovery.budget.basic.desc': 'Focused and effective.',
    'discovery.budget.standard.title': 'Standard (60€ - 75€)',
    'discovery.budget.standard.desc': 'Full therapeutic experience.',
    'discovery.budget.premium.title': 'Premium (90â‚¬+)',
    'discovery.budget.premium.desc': 'Extended, all-inclusive care.',

    // Discovery Form - Recommendations
    'discovery.recommendation.emotional.service': 'Emotional rebalancing',
    'discovery.recommendation.emotional.desc':
      'A holistic Approach to soothe stress, anxiety, or heaviness. We focus on releasing emotional weight to restore your inner harmony and joy.',
    'discovery.recommendation.emotional.benefit1': 'Deep stress relief',
    'discovery.recommendation.emotional.benefit2': 'Emotional clarity',
    'discovery.recommendation.emotional.benefit3': 'Nervous system calm',
    'discovery.recommendation.emotional.benefit4': 'Renewed inner peace',

    'discovery.recommendation.manual.service': 'Therapeutic bodywork',
    'discovery.recommendation.manual.desc':
      'Targeted relief for pain and muscle tension. We use precise techniques to dissolve knots and restore your freedom of Movement.',
    'discovery.recommendation.manual.benefit1': 'Immediate pain relief',
    'discovery.recommendation.manual.benefit2': 'Muscle tension release',
    'discovery.recommendation.manual.benefit3': 'Improved mobility',
    'discovery.recommendation.manual.benefit4': 'Physical lightness',

    'discovery.recommendation.integrative.service': 'Integrative tension relief (4-in-1)',
    'discovery.recommendation.integrative.desc':
      'Our signature blend of massage, kinesiology, osteopathy, and somatic Movement (Feldenkrais). The ultimate solution for chronic issues.',
    'discovery.recommendation.integrative.benefit1': 'Holistic treatment',
    'discovery.recommendation.integrative.benefit2': 'Root cause resolution',
    'discovery.recommendation.integrative.benefit3': 'Multi-technique synergy',
    'discovery.recommendation.integrative.benefit4': 'Long-lasting results',

    'discovery.recommendation.relax.service': 'Deep relaxation massage',
    'discovery.recommendation.relax.desc':
      'A sanctuary for your senses. Ideal if your goal is to disconnect from the world and recharge your batteries completely.',
    'discovery.recommendation.relax.benefit1': 'Profound relaxation',
    'discovery.recommendation.relax.benefit2': 'Mental quiet',
    'discovery.recommendation.relax.benefit3': 'Energy restoration',
    'discovery.recommendation.relax.benefit4': 'Total well-being',

    // Online Rec
    'discovery.recommendation.online.service': 'Online consultation & guidance',
    'discovery.recommendation.online.desc':
      'Expert support, wherever you are. Perfect for follow-ups, nutritional planning, or somatic guidance from home.',
    'discovery.recommendation.online.benefit1': 'Comfort of home',
    'discovery.recommendation.online.benefit2': 'Flexible scheduling',
    'discovery.recommendation.online.benefit3': 'Continuous support',
    'discovery.recommendation.online.benefit4': 'Actionable pdf plan',

    'discovery.recommendation.title': 'Your personalized path',
    'discovery.recommendation.badge': 'Tailored for you',
    'discovery.recommendation.subtitle': 'Based on your unique profile, we recommend:',
    'discovery.recommendation.why': 'Why this is for you',
    'discovery.analysis.intro': 'We noticed that',
    'discovery.analysis.have': 'You are experiencing',
    'discovery.analysis.want': 'And your goal is',
    'discovery.analysis.feel': 'To feel',
    'discovery.diagnosis.title': 'Professional assessment',
    'discovery.diagnosis.profile': 'Your profile',
    'discovery.diagnosis.symptoms': 'Key indicators',
    'discovery.diagnosis.rootCause': 'Potential root causes',
    'discovery.diagnosis.strategy': 'Our strategy',
    'discovery.diagnosis.frequency': 'Recommended frequency',
    'discovery.view.basic': 'Simple view',
    'discovery.view.advanced': 'Detailed assessment',
    'discovery.diagnosis.cause.posture': 'Postural fatigue (sedentary strain)',
    'discovery.diagnosis.cause.overload': 'Muscular overload',
    'discovery.diagnosis.cause.stress': 'Psychosomatic tension',
    'discovery.diagnosis.cause.emotional': 'Emotional blockage',
    'discovery.diagnosis.cause.metabolic': 'Metabolic/digestive imbalance',
    'discovery.diagnosis.cause.structural': 'Structural/mechanical misalignment',
    'discovery.diagnosis.cause.general': 'Need for maintenance/prevention',
    'discovery.diagnosis.strategy.structural': 'Structural release & mobility work',
    'discovery.diagnosis.strategy.regulation': 'Nervous system regulation',
    'discovery.diagnosis.strategy.rebalance': 'Mind-body rebalancing',
    'discovery.diagnosis.freq.high': 'Intensive (weekly for 3 weeks)',
    'discovery.diagnosis.freq.medium': 'Maintenance (every 2-3 weeks)',
    'discovery.diagnosis.freq.low': 'Preventive (monthly)',
    'discovery.goal.athlete': 'Peak athletic recovery',
    'discovery.goal.office': 'Postural correction',
    'discovery.goal.stress': 'Deep peace of mind',
    'discovery.goal.pain': 'Physical comfort',
    'discovery.goal.general': 'Overall vitality',
    'discovery.feeling.relaxed': 'Relaxed',
    'discovery.feeling.energized': 'Energized',
    'discovery.feeling.balanced': 'Balanced',
    'discovery.feeling.painfree': 'Pain-free',
    'discovery.recommendation.book': 'Book this session',
    'discovery.recommendation.restart': 'Start over',

    // Discovery Form - Steps
    'discovery.step1.title': 'Tell us about yourself',
    'discovery.step1.subtitle': 'Choose the option that resonates most',
    'discovery.step2.title': 'Where do you hold tension?',
    'discovery.step2.subtitle': 'Select all that apply',
    'discovery.step3.title': 'Any specific conditions?',
    'discovery.step3.subtitle': 'Help us tailor the session to your safety',
    'discovery.step4.title': 'How do you feel emotionally?',
    'discovery.step4.subtitle': 'Emotional wellbeing is key to physical health',
    'discovery.step5.title': 'How much time do you have available?',
    'discovery.step5.subtitle': 'We adapt the session to your schedule',
    'discovery.step6.title': 'What is your budget?',
    'discovery.step6.subtitle': 'We will find the best option for you',
    'discovery.next': 'Next',
    'discovery.back': 'Back',
    'discovery.seeRecommendation': 'See recommendation',
    'common.step': 'Step',
    'common.of': 'Of',

    // Office Workers
    'office.seo.title': 'Services for office workers - EKA Balance Barcelona',
    'office.seo.desc':
      'Specialized therapies for office workers: relieve tension, improve posture and manage work stress. 1 hour sessions for 70â‚¬.',
    'office.seo.keywords':
      'Office massage Barcelona, work stress, computer back pain, kinesiology workers',

    // Athletes SEO
    'athletes.seo.title': 'Services for athletes - EKA Balance Barcelona',
    'athletes.seo.desc':
      'Specialized therapies for athletes: muscle recovery, flexibility improvement and pre-competition stress management. 1 hour sessions for 70â‚¬.',
    'athletes.seo.keywords':
      'Sports massage Barcelona, muscle recovery, sports flexibility, competition stress',

    // Artists SEO
    'artists.seo.title': 'Services for artists - EKA Balance Barcelona',
    'artists.seo.desc':
      'Therapies for visual artists and creators: hand care, posture improvement and creative unblocking. 1 hour sessions for 70â‚¬.',
    'artists.seo.keywords':
      'Artists massage Barcelona, artists hand pain, creative posture, creative block',

    // Musicians SEO
    'musicians.seo.title': 'Services for musicians - EKA Balance Barcelona',
    'musicians.seo.desc':
      'Specialized therapies for musicians: injury prevention, technique improvement and stage anxiety management. 1 hour sessions for 70â‚¬.',
    'musicians.seo.keywords':
      'Musicians physiotherapy Barcelona, musicians injuries, stage anxiety, musical technique',

    // Students SEO
    'students.seo.title': 'Services for students - EKA Balance Barcelona',
    'students.seo.desc':
      'Therapies for students: exam stress management, concentration improvement and postural correction. 1 hour sessions for 70â‚¬.',
    'students.seo.keywords':
      'Exam stress Barcelona, study concentration, student posture, academic anxiety',

    'office.problems.pain.title': 'Postural pain',
    'office.problems.pain.desc':
      'Pain in neck, shoulders and back due to incorrect postures in front of the computer',
    'office.problems.stress.title': 'Work stress',
    'office.problems.stress.desc':
      'Constant pressure, deadlines and excess responsibilities affecting wellbeing',
    'office.problems.sedentary.title': 'Sedentary lifestyle',
    'office.problems.sedentary.desc':
      'Loss of mobility and flexibility from spending too many hours sitting',
    'office.benefits.techniques.title': 'Specific techniques',
    'office.benefits.techniques.desc':
      'Specific techniques to decontract areas affected by office work',
    'office.benefits.exercises.title': 'Postural correction',
    'office.benefits.exercises.desc':
      'Exercises and postural corrections to prevent future problems',
    'office.benefits.mindfulness.title': 'Stress management',
    'office.benefits.mindfulness.desc':
      'Relaxation and mindfulness techniques adapted to the professional environment',

    // Contact Page
    'contact.hero.badge': 'We are here for you',
    'contact.hero.title': 'Contact',
    'contact.hero.titleHighlight': 'us',
    'contact.hero.description':
      'We are here to help you on your path to wellbeing. Contact us for bookings, inquiries or any questions about our services.',
    'contact.whatsapp': 'WhatsApp +34 658 867 133',
    'contact.callNow': 'Call now',
    'contact.faq.title': 'Frequently asked questions',
    'contact.faq.subtitle': 'Everything you need to know about contacting us',
    'contact.faq.q1.title': 'How can i book an appointment?',
    'contact.faq.q1.answer':
      'You can book an appointment by writing via WhatsApp or Telegram at +34 658 867 133, calling us at the same number or sending us an email.',
    'contact.faq.q2.title': 'What is the cancellation policy?',
    'contact.faq.q2.answer':
      'Free cancellations can be made up to 24 hours before the appointment. VIP users can cancel up to 12 hours before.',
    'contact.faq.q3.title': 'Do you offer discounts or VIP plans?',
    'contact.faq.q3.answer':
      'Yes, we have VIP plans with discounts of up to 25% and exclusive benefits such as priority bookings and free telephone consultations.',
    'contact.faq.q4.title': 'What should i bring to the first session?',
    'contact.faq.q4.answer':
      'Bring comfortable clothes, any relevant medical reports and a list of medications you are currently taking. We provide the towels.',

    'personalizedServices.business': 'For Businesses',
    'personalizedServices.business.desc':
      'Corporate wellness, group classes, and consulting to reduce workplace stress.',
    'personalizedServices.business.benefit1': 'Reduces team burnout',
    'personalizedServices.business.benefit2': 'Improves desk posture',
    'personalizedServices.business.benefit3': 'Boosts daily focus',
    'personalized.business.hero.title': 'Wellness for your team',
    'personalized.business.hero.description':
      'We take care of your companies health with customized programs: from in-office massages to posture workshops. Because work shouldnt hurt.',
    'personalized.business.bento.title': 'Corporate wellness beautifully designed',
    'personalized.business.bento.subtitle':
      'Empower your team with a space and practice dedicated to restoring focus and cultivating resilience.',
    'personalized.business.bento.box1.title': 'Team Cohesion',
    'personalized.business.bento.box1.desc':
      'Build stronger connections through shared physical experiences and mindful movement.',
    'personalized.business.bento.box2.title': 'Increased Productivity',
    'personalized.business.bento.box2.desc':
      'Clear minds lead to better decisions. Posture correction reduces fatigue and boosts daily output.',
    'personalized.business.bento.box3.title': 'Focus Retention',
    'personalized.business.bento.box3.desc':
      'Foster concentration and reduce stress through deep relaxation techniques.',
    'personalized.business.bento.box4.title': 'Holistic Workplace',
    'personalized.business.bento.box4.desc':
      'Designing environments and routines that promote physical vitality and mental clarity in the office.',

    'personalized.business.plans.title': 'Corporate Plans',
    'personalized.business.plans.subtitle': "Solutions tailored to your team's size and needs",

    'personalized.business.plans.starter.name': 'Team Plan',
    'personalized.business.plans.starter.desc':
      'Ideal for small teams looking to introduce wellness.',
    'personalized.business.plans.starter.price': 'Custom',
    'personalized.business.plans.starter.feat1': '1 group session per month',
    'personalized.business.plans.starter.feat2': 'Basic ergonomic assessment',
    'personalized.business.plans.starter.feat3': 'Access to digital routines',

    'personalized.business.plans.pro.name': 'Office Plan',
    'personalized.business.plans.pro.desc':
      'The complete solution for offices wanting consistent results.',
    'personalized.business.plans.pro.price': 'Custom',
    'personalized.business.plans.pro.feat1': 'Weekly group sessions',
    'personalized.business.plans.pro.feat2': 'In-office massages (2 days/mo)',
    'personalized.business.plans.pro.feat3': 'Personalized tracking',

    'personalized.business.plans.enterprise.name': 'Enterprise Plan',
    'personalized.business.plans.enterprise.desc':
      'Comprehensive health program for the corporation.',
    'personalized.business.plans.enterprise.price': "Let's talk",
    'personalized.business.plans.enterprise.feat1': 'Dedicated on-site therapists',
    'personalized.business.plans.enterprise.feat2': 'Monthly workshops and trainings',
    'personalized.business.plans.enterprise.feat3': 'Wellness metrics and reporting',
    'personalized.business.understanding.title': 'A healthy team is a happy team',
    'personalized.business.understanding.description1':
      'Sitting for hours causes neck strain and mental fatigue. We help employees recover their energy and stay sharp.',
    'personalized.business.understanding.description2':
      'Whether you need weekly group classes, ergonomic consulting, or in-office therapies, we adjust our schedule to fit yours.',
    'personalized.business.understanding.callToAction':
      'Lets talk and build a plan tailored to your workplace.',
    'personalized.business.services.title': 'Corporate Services',
    'personalized.business.services.subtitle':
      'Options built to improve health in a busy environment',
    'personalized.business.services.groupClasses.title': 'Group Posture & Stretching',
    'personalized.business.services.groupClasses.description':
      'Friendly and effective sessions focusing on relieving desk-related back pain, done online or on-site.',
    'personalized.business.services.consulting.title': 'Consulting & In-Office Care',
    'personalized.business.services.consulting.description':
      'We evaluate your teams workspace and teach them how to stay pain-free. We can also provide manual therapy days right at your office.',
    'personalized.business.faq.q1': 'Can you work around our schedule?',
    'personalized.business.faq.a1':
      'Yes, we know you have meetings and deadlines. We seamlessly integrate into your workday.',
    'personalized.business.faq.q2': 'Do you come to our office?',
    'personalized.business.faq.a2':
      'Yes, we bring everything we need to run sessions directly at your company headquarters.',
    'personalized.business.faq.q3': 'How much does it cost?',
    'personalized.business.faq.a3':
      'It varies based on team size and frequency. Lets hop on a call to give you a customized quote.',
    'personalized.business.benefit1':
      'Reduces team stress levels and proactively prevents burnout.',
    'personalized.business.benefit2':
      'Improves desk posture and effectively relieves chronic back pain.',
    'personalized.business.benefit3':
      'Fosters a stronger, more connected, and healthier company culture.',
    'personalized.business.benefit4':
      'Significantly boosts daily focus, energy, and overall productivity.',

    // Booking Page Help Section
    'booking.help.title': 'Need help with booking?',
    'booking.help.contactDirect': 'Contact us directly',
    'booking.help.email': 'ðŸ“§ contact@ekabalance.com',
    'booking.help.address': 'ðŸ“ Carrer Pelai, 12, 08001 Barcelona',
    'booking.help.hours': 'Opening hours',
    'booking.help.hours.weekdays': 'Monday - friday: 9:00 - 20:00',
    'booking.help.hours.saturday': 'Saturday: 9:00 - 14:00',
    'booking.help.hours.sunday': 'Sunday: closed',
    'booking.help.footer':
      'If you have any questions about our services or need help with booking, do not hesitate to contact us. We are here to help you.',
    'booking.whatsapp.availability': 'Availability: {availability} – {timeslot}',
    'booking.whatsapp.thanks': 'Thanks!',

    // First Time Visitor Form
    'firstTime.seo.title': "Don't know what to choose? - Find your ideal service at EKA Balance",
    'firstTime.seo.desc':
      'Intelligent personalized system to discover the perfect holistic therapy service for your specific needs. Empathetic recommendations based on who you are and what you are looking for.',
    'firstTime.seo.keywords':
      "Don't know what to choose, personalized form, therapy recommendations, ideal service, Barcelona, intelligent onboarding",

    // VIP Section
    'vip.plan.bronze': 'Bronze membership',
    'vip.plan.bronze.description': 'Essential maintenance for a balanced life',
    'vip.plan.bronze.price': '150€',
    'vip.plan.silver': 'Silver membership',
    'vip.plan.silver.description': 'Comprehensive monthly wellness & priority',
    'vip.plan.silver.price': '280€',
    'vip.plan.gold': 'Gold membership',
    'vip.plan.gold.description': 'The ultimate transformation & total exclusivity',
    'vip.plan.gold.price': '500€',

    'vip.service.priority.title': 'Priority access',
    'vip.service.priority.description':
      'Skip the wait. Your schedule is our priority, with exclusive slots reserved just for you.',
    'vip.service.displacements.title': 'Concierge home visits',
    'vip.service.displacements.description':
      'We bring the sanctuary to you. Save time and enjoy world-class treatments in the privacy of your home.',
    'vip.service.health.title': 'Proactive health monitoring',
    'vip.service.health.description':
      'We don’t just treat; we track. Regular assessments ensure your physical health is always progressing.',
    'vip.service.family.title': 'Family privileges',
    'vip.service.family.description':
      'Extend your care. Share your session credits and benefits with your immediate family.',

    'vip.benefits.transferable': 'Shareable credits',
    'vip.benefits.transferableDesc': 'Gift wellness to family',
    'vip.benefits.monthly': 'Monthly health audit',
    'vip.benefits.monthlyDesc': 'Preventive focus',
    'vip.benefits.barcelona': 'Barcelona exclusive',
    'vip.benefits.barcelonaDesc': 'City center availability',
    'vip.benefits.sessions': 'Extended duration sessions',

    'vip.stats.concierge': 'Personal concierge',
    'vip.stats.exclusivity': 'Members only',
    'vip.stats.clients': 'Elite clientele',
    'vip.stats.possibilities': 'Limitless potential',
    'vip.stats.control': 'Health mastery',
    'vip.stats.family': 'Family inclusion',

    'vip.mostExclusive': 'The pinnacle of care',
    'vip.experienceDescription':
      'Designed for those who refuse to compromise on their health. Experience wellness without boundaries.',
    'vip.voicesOfExcellence': 'Voices of the elite',
    'vip.testimonialsSubtitle': 'Hear from those who have elevated their lives with us.',
    'vip.tier.standard': 'Standard member',

    'vip.testimonials.comment1':
      'The best investment i have made for my performance. The priority service is a game changer for my busy schedule.',
    'vip.testimonials.comment2':
      'Professionalism at its finest. Elena understands my body better than i do. A truly bespoke experience.',
    'vip.testimonials.comment3':
      'I feel renewed after every session. The attention to detail is unmatched in Barcelona.',

    'vip.hero.badge': 'Ultra premium',
    'vip.hero.title.beyond': 'Beyond',
    'vip.hero.title.wellness': 'Wellness',
    'vip.hero.subtitle':
      'Step into a realm where your health is our sole focus. Unparalleled attention, priority access, and bespoke treatments designed for the few.',
    'vip.hero.cta.join': 'Apply for membership',

    'vip.dashboard.member': 'Member lounge',
    'vip.dashboard.hello': 'Welcome back,',
    'vip.dashboard.status': 'Membership tier:',
    'vip.dashboard.priorityBooking': 'Book priority session',
    'vip.dashboard.viewPlans': 'Upgrade membership',

    'vip.features.badge': 'Excellence',
    'vip.features.title': 'Curated for the elite',
    'vip.features.subtitle':
      'Every detail is orchestrated to provide an experience that transcends traditional therapy.',

    'vip.plans.badge': 'Membership',
    'vip.plans.title': 'Select your legacy',
    'vip.plans.subtitle': 'Choose the level of exclusivity that matches your ambition.',
    'vip.plans.popular': 'Most popular',
    'vip.plans.perMonth': '/ Month',
    'vip.plans.sessions': 'Sessions included',
    'vip.plans.contact': 'Inquire now',
    'vip.table.title': 'Membership comparison',
    'vip.table.sessions': 'Sessions included',

    'vip.exclusivePrivileges': 'Member privileges',
    'vip.testimonials.title': 'Elite experiences',
    'vip.testimonials.subtitle': 'Stories from those who demand the best.',
    'vip.testimonials.role1': 'Ceo, tech innovator',
    'vip.testimonials.role2': 'Cardiovascular surgeon',
    'vip.testimonials.role3': 'International entrepreneur',
    'vip.cta.badge': 'Join the inner circle',
    'vip.cta.title': 'Elevate your life',
    'vip.cta.subtitle': 'Your journey to peak performance and profound well-being starts here.',
    'vip.whatsapp.message':
      'Hello, I am interested in the {plan} VIP membership. I would like to apply.',
    'vip.whatsapp.messageGeneral':
      'Hello, i am interested in the VIP inner circle. I would like to know more.',
    'vip.cta.location': 'Prime location',
    'vip.cta.concierge': 'Dedicated concierge',
    'vip.cta.guarantee': 'Satisfaction guaranteed',

    // Hero Split
    'hero.title.part1': 'Find relief from',
    'hero.title.part2': 'pain and stress',
    'hero.cta.primary': 'Book your session',
    'hero.cta.secondary': 'Discover your path',
    'hero.stats.rating': '5 star rating',

    // About
    'about.badge': 'My journey',
    'about.title': 'Elena Kucherova',
    'about.role': 'Somatic integration specialist',
    'about.description1':
      'With over 15 years of professional practice, i have refined a method that goes beyond conventional treatment. My mission is to decode your body language to unlock its innate regeneration capacity.',
    'about.description2':
      'I fuse neuroscience precision with manual therapy depth. Each session is a strategic intervention in your nervous system to deactivate pain patterns and restore vital Balance.',
    'about.cta': 'Discover the method',

    // Services General
    'services.badge': 'Therapeutic excellence',
    'services.title': 'High impact interventions',
    'services.subtitle':
      'Advanced protocols integrating structural manipulation, neurological rebalancing, and metabolic optimization.',
    'services.cta': 'Explore protocols',

    // Service: Massage
    'massage.title': 'Advanced manual therapy',
    'massage.desc':
      'Reconstruction of body architecture. Fusion of deep tissue techniques and myofascial release to eliminate chronic restrictions.',
    'massage.benefit1': 'Structural decompression',
    'massage.benefit2': 'Postural realignment',
    'massage.benefit3': 'Nervous system regulation',
    'massage.benefit4': 'Tissue regeneration',

    // Service: Kinesiology
    'kinesiology.title': 'Applied kinesiology',
    'kinesiology.desc':
      'Precision biofeedback. We use neurological muscle testing to decode and correct structural, biochemical, and emotional dysfunctions.',
    'kinesiology.benefit1': 'Causal diagnosis',
    'kinesiology.benefit2': 'Neurological optimization',
    'kinesiology.benefit3': 'Structural integration',
    'kinesiology.benefit4': 'Systemic stability',

    // Service: Nutrition
    'nutrition.title': 'Functional nutrition',
    'nutrition.desc':
      'Biochemistry for performance. Nutritional strategies designed to enhance cognitive function, hormonal stability, and cellular vitality.',
    'nutrition.benefit1': 'Metabolic optimization',
    'nutrition.benefit2': 'Microbiota health',
    'nutrition.benefit3': 'Cognitive performance',
    'nutrition.benefit4': 'Hormonal regulation',

    // Problems
    'problems.badge': 'Diagnosis & resolution',
    'problems.title': 'Pathology identification',
    'problems.subtitle':
      'Integrative Approach to common dysfunctions via somatic integration protocols.',
    'problems.backpain.title': 'Chronic vertebral dysfunction',
    'problems.backpain.desc': 'Persistent structural compromise limiting functionality.',
    'problems.backpain.solution': 'Targeted protocol',
    'problems.backpain.solutionDesc': 'Axial decompression and neuromuscular reeducation.',
    'problems.stress.title': 'Nervous system dysregulation',
    'problems.stress.desc': 'Sympathetic hyperactivation, systemic anxiety, and sleep disruption.',
    'problems.stress.solution': 'Targeted protocol',
    'problems.stress.solutionDesc': 'Vagal tone restoration and stress response modulation.',
    'problems.fatigue.title': 'Systemic exhaustion',
    'problems.fatigue.desc': 'Chronic energy deficit and inefficient metabolic recovery.',
    'problems.fatigue.solution': 'Targeted protocol',
    'problems.fatigue.solutionDesc': 'Mitochondrial reactivation and metabolic unblocking.',
    'problems.injuries.title': 'Sports traumatology',
    'problems.injuries.desc': 'Biomechanical limitations compromising athletic performance.',
    'problems.injuries.solution': 'Targeted protocol',
    'problems.injuries.solutionDesc': 'Accelerated Functional rehabilitation.',

    // Office
    'office.stats.pain': 'Pain reduction',
    'office.stats.posture': 'Posture improvement',
    'office.stats.stress': 'Less stress',
    'office.session.title': 'Therapeutic session for office workers',
    'office.session.plans': 'View plans',

    // Students
    'students.challenge3.title': 'Exam stress',
    'students.challenge3.desc': 'Anxiety and pressure affecting performance',
    'students.result.title': 'Expected results',
    'students.result.desc': 'Improved focus and calmness',
    'students.stats.concentration': 'Concentration',
    'students.stats.tension': 'Tension relief',
    'students.stats.stress': 'Stress mgmt',
    'students.session.title': 'Student session',

    // VIP
    'vip.plan.platinum': 'Platinum VIP',
    'vip.plan.bronze.desc': 'VIP entry level',
    'vip.plan.silver.desc': 'Perfect for professionals',
    'vip.plan.gold.desc': 'The ultimate VIP experience',
    'vip.plan.platinum.desc': 'Exclusive elite access',
    'vip.feature.priority': 'Priority access',
    'vip.feature.extended': 'Extended sessions',
    'vip.feature.support': '24/7 support',
    'vip.feature.events': 'Exclusive events',
    'vip.feature.home': 'Home service',
    'vip.feature.all': 'All benefits included',
    'vip.feature.gift': 'Gift session',
    'vip.feature.consultation': 'Quarterly consultation',
    'vip.feature.kit': 'Premium kit',
    'vip.feature.concierge': 'Personal wellness manager',
    'vip.feature.retreat': 'Retreat discount',

    // Pricing Section
    'pricing.badge': 'Transparent pricing',
    'pricing.title.part1': 'Choose your',
    'pricing.title.part2': 'wellness plan',
    'pricing.subtitle':
      'Packs designed for every need, with the flexibility and quality you deserve',
    'pricing.popular': 'Most popular',
    'pricing.save': 'Save {percent}%',
    'pricing.discount_applied': 'Applied',
    'pricing.plan.select': 'Select',

    'pricing.plan.basic.name': 'Single session',
    'pricing.plan.basic.desc': 'A complete 60-minute session',
    'pricing.plan.pack3.name': 'Wellness pack (3)',
    'pricing.plan.pack3.desc': 'Pack of 3 sessions for continuous follow-up',
    'pricing.plan.pack5.name': 'Transformation pack (5)',
    'pricing.plan.pack5.desc': 'Comprehensive treatment for deep changes',

    'pricing.feature.massage': 'Therapeutic massage',
    'pricing.feature.kinesiology': 'Kinesiology',
    'pricing.feature.osteopathy': 'Gentle osteopathy',
    'pricing.feature.save15': 'Save 15€',
    'pricing.feature.valid3months': 'Valid for 3 months',
    'pricing.feature.transferable': 'Transferable',
    'pricing.feature.save25': 'Save 25€',
    'pricing.feature.valid6months': 'Valid for 6 months',
    'pricing.feature.priority': 'Priority booking',

    'pricing.guarantee.nocommitment.title': 'No commitments',
    'pricing.guarantee.nocommitment.desc': 'Cancel or reschedule up to 24h before without cost',
    'pricing.guarantee.satisfaction.title': 'Satisfaction guarantee',
    'pricing.guarantee.satisfaction.desc':
      'If you are not satisfied with the first session, we refund you',
    'pricing.guarantee.certified.title': 'Certified professionals',
    'pricing.guarantee.certified.desc': 'All our therapists have official certifications',
    'pricing.guarantee.equipment.title': 'Professional equipment',
    'pricing.guarantee.equipment.desc': 'We use only top quality equipment and products',

    'pricing.cta.unsure.title': 'Not sure which plan to choose?',
    'pricing.cta.unsure.subtitle':
      'Take our free assessment and discover which treatment best fits your needs',
    'pricing.cta.unsure.button': 'Discover our services',

    // Booking Popup
    'booking.smart.service.placeholder': 'Select a service...',
    'booking.smart.time.placeholder': 'Ex: mornings, next week...',
    'booking.whatsapp.name': 'Name',
    'booking.whatsapp.serviceLabel': 'Service',
    'booking.whatsapp.preference': 'Time preference',
    'booking.service.other': 'Other',
    'booking.service.consultation': 'Initial consultation',
    'booking.smart.quick': 'Quick booking',
    'booking.smart.quickDesc': 'Contact via WhatsApp directly.',
    'booking.smart.form': 'Form',
    'booking.smart.formDesc': 'Fill in details first.',
    'booking.smart.name': 'Your name',
    'booking.smart.service': 'Service',
    'booking.smart.time': 'Preferred time',
    'booking.smart.send': 'Send via WhatsApp',
    'booking.smart.title': 'Book your appointment',
    'booking.smart.subtitle': 'Choose how you want to contact',

    // Missing keys added by script
    'common.home': 'Home',
    'common.about': 'About',
    'common.blog': 'Blog',
    'common.services': 'Services',
    'common.faq': 'FAQ',
    'common.terms': 'Terms of Service',
    'common.privacy': 'Privacy Policy',
    'common.cookies': 'Cookie Policy',
    'common.copyright': 'All rights reserved.',
    'common.language': 'Language',
    'common.close': 'Close',
    'common.menu': 'Menu',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.success': 'Sent successfully',
    'common.error': 'An error occurred',
    'common.loading': 'Loading...',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.book': 'Book now',

    'personalized.artists.title': 'Wellness for Artists and Creatives | EKA Balance',
    'personalized.artists.description':
      'Boost your creativity, unlock tension, and connect with your artistic expression.',
    'personalized.artists.keywords':
      'wellness for artists, creativity, emotional release, body expression, Barcelona',
    'personalized.athletes.title': 'Wellness for Athletes and Sportspeople | EKA Balance',
    'personalized.athletes.description':
      'Improve your performance, recover from injuries, and optimize your body with our plans for athletes.',
    'personalized.athletes.keywords':
      'sports performance, injury recovery, physical optimization, sports massage, Barcelona',
    'personalized.musicians.title': 'Wellness for Musicians | EKA Balance',
    'personalized.musicians.description':
      'Prevent injuries, improve posture, and connect with your instrument from a tension-free body.',
    'personalized.musicians.keywords':
      'wellness for musicians, injury prevention, musician posture, relaxation, Barcelona',
    'personalized.office.title': 'Wellness for Office Workers | EKA Balance',
    'personalized.office.description':
      'Relieve back pain, correct posture, and reduce work stress with our programs.',
    'personalized.office.keywords': 'office back pain, ergonomics, computer posture, work stress',
    'personalized.parents.title': 'Wellness for Parents | EKA Balance',
    'personalized.parents.description':
      'Find your balance, reduce stress, and improve your vital energy for parenting.',
    'personalized.parents.keywords':
      'wellness for parents, mindful parenting, family stress, work-life balance',
    'personalized.students.title': 'Wellness for Students | EKA Balance',
    'personalized.students.description':
      'Improve concentration, reduce anxiety, and optimize your academic performance.',
    'personalized.students.keywords': 'exam stress, student concentration, academic anxiety',

    'discovery.step.description.minChars': 'characters minimum',
    'discovery.recommendation.online.note':
      'Note: Since you selected Online, this service is adapted for remote sessions.',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.personalizedServices': 'Servicios personalizados',
    'nav.revision360': 'Revisión 360°',

    'common.consultPrice': 'Consultar precio',
    'services.variableDuration': 'Variable',
    'services.mainBenefits': 'Beneficios principales',
    'nav.bookNow': 'Reservar cita',
    'nav.contact': 'Contacto',
    'nav.aboutElena': 'Sobre Elena',
    'nav.casos': 'Casos reales',

    // Elena Approach & Targets
    'elena.approach.title': 'El método Elena Kucherova',
    'elena.approach.desc':
      'En el núcleo de mi trabajo yace una profunda comprensión de que el cuerpo, el cerebro y las emociones son un sistema unificado. No trato síntomas, sino que busco su causa raíz, ayudando al organismo a restaurar su capacidad natural de autorregulación. Mi método combina técnicas avanzadas de trabajo con el cuerpo y el sistema nervioso: Movement Lesson, JKA (Jeremy Krauss Approach), child’space, Feldenkrais y biodinámica. Es una influencia suave pero poderosa que reentrena el sistema nervioso, libera tensiones profundas y restaura la facilidad de movimiento y la claridad mental.',

    'elena.target.adults.title': 'Adultos',
    'elena.target.adults.desc':
      'Para quienes sienten fatiga crónica, dolor de espalda o cuello, o los efectos del estrés y el trauma. Te ayudo a restaurar tu estado de recursos, mejorar la postura, liberar bloqueos psicosomáticos y recuperar la ligereza al moverte. No es solo un masaje o una terapia; es un reinicio de tu sistema nervioso para elevar tu calidad de vida.',

    'elena.target.children.title': 'Niños',
    'elena.target.children.desc':
      'Apoyo para un desarrollo armonioso desde los primeros días. Trabajo con retrasos motores, alteraciones posturales, hiperactividad y dificultades de aprendizaje. Mediante técnicas suaves, ayudo al niño a sentir mejor su cuerpo, desarrollando coordinación, seguridad y confianza en sí mismo.',

    'elena.target.families.title': 'Familias con necesidades especiales',
    'elena.target.families.desc':
      'Acompañamiento integral para familias con niños con pc, síndromes genéticos u otras necesidades del desarrollo. Trabajo no solo con el niño para que adquiera nuevas habilidades de movimiento y comunicación, sino también con los padres, enseñándoos a interactuar con él y a cuidar vuestra propia energía y bienestar.',

    // Dropdown items
    'nav.officeWorkers': 'Profesionales de oficina',
    'nav.athletes': 'Deportistas',
    'nav.artists': 'Artistas',
    'nav.musicians': 'Músicos',
    'nav.students': 'Estudiantes',
    'nav.parents': 'Padres y madres',

    'home.founder': 'Fundadora y CEO',
    'home.elenaAlt': 'Elena, terapeuta corporal de EKA Balance',
    'home.viewAllServices': 'Ver todos los servicios',
    'home.elenaName': 'Elena Kucherova',
    'elena.name': 'Elena Kucherova',

    // About
    'about.badge': 'Mi trayectoria',
    'about.title': 'Elena Kucherova',
    'about.role': 'Especialista en integración somática y kinesiología',
    'about.description1':
      'Con más de 15 años de práctica clínica, he perfeccionado un método que va más allá del tratamiento convencional. Mi misión es decodificar el lenguaje de tu cuerpo para desbloquear su capacidad innata de regeneración.',
    'about.description2':
      'Fusiono la precisión de la neurociencia aplicada con la profundidad de las terapias manuales. Cada sesión es una intervención estratégica en tu sistema nervioso para desactivar patrones de dolor y restaurar el equilibrio vital.',
    'about.cta': 'Descubre el método',

    // Hero Section
    'hero.title': 'EKA Balance',
    'hero.title.part1': 'Encuentra alivio al',
    'hero.title.part2': 'dolor y estrés',
    'hero.subtitle':
      'Te ayudamos a sentirte a gusto en tu cuerpo otra vez. A través del masaje y terapias clínicas prácticas, encontramos la causa de tu malestar y te ayudamos a recuperar energía.',
    'hero.cta.primary': 'Reserva tu sesión',
    'hero.cta.secondary': 'Descubre tu camino',
    'hero.badge': 'Excelencia en salud integrativa',
    'hero.stats.clients': 'Pacientes tratados',
    'hero.stats.experience': 'Años de práctica clínica',
    'hero.stats.rating': 'Excelencia terapéutica',

    // About Section
    'elena.greeting': 'Hola, soy Elena',
    'elena.role': 'Terapeuta corporal',
    'elena.bio':
      'He dedicado mi vida a explorar las profundidades de las disciplinas terapéuticas, creando un enfoque único e integrador que honra a la persona en su totalidad.',
    'elena.work.title': 'Trabajo',
    'elena.description1':
      'Soy terapeuta corporal especializada en masaje terapéutico, kinesiología e integración mente-cuerpo. Mi trabajo se basa en la creencia de que la verdadera curación proviene de escuchar al cuerpo.',
    'elena.description2':
      'Mi objetivo es simple: ayudarte a liberar el peso de la tensión y recuperar tu bienestar físico y emocional, para que puedas moverte por la vida con ligereza y energía renovada.',
    'elena.knowMore': 'Lee mi historia completa',
    'elena.quote':
      'El cuerpo tiene la capacidad innata de sanarse; mi trabajo es recordarle cómo hacerlo.',

    // Services Section
    'services.badge': 'Protocolos clínicos',
    'services.title': 'Intervenciones terapéuticas avanzadas',
    'services.subtitle':
      'Metodología integrativa que fusiona terapia manual, corrección biomecánica y regulación del sistema nervioso autónomo.',
    'services.cta': 'Explorar tratamientos',

    // Service: Massage
    'massage.title': 'Terapia manual avanzada',
    'massage.desc':
      'Restauración estructural profunda. Combinamos técnicas de tejido profundo con liberación miofascial para disolver la tensión crónica y restaurar la movilidad funcional.',
    'massage.benefit1': 'Alivio del dolor estructural',
    'massage.benefit2': 'Corrección biomecánica',
    'massage.benefit3': 'Regulación nerviosa',
    'massage.benefit4': 'Recuperación tisular',

    // Service: Kinesiology
    'kinesiology.title': 'Kinesiología clínica',
    'kinesiology.desc':
      'Diagnóstico funcional preciso. Utilizamos el test muscular para identificar desequilibrios estructurales, químicos y emocionales, corrigiéndolos desde su origen neurológico.',
    'kinesiology.benefit1': 'Diagnóstico sistémico',
    'kinesiology.benefit2': 'Equilibrio bioenergético',
    'kinesiology.benefit3': 'Optimización postural',
    'kinesiology.benefit4': 'Integración somática',

    // Service: Nutrition
    'nutrition.title': 'Nutrición clínica',
    'nutrition.desc':
      'Bioquímica aplicada a la salud. Planes nutricionales diseñados para optimizar la función metabólica, reparar la barrera intestinal y apoyar la neuroquímica cerebral.',
    'nutrition.benefit1': 'Energía metabólica',
    'nutrition.benefit2': 'Salud de la microbiota',
    'nutrition.benefit3': 'Claridad cognitiva',
    'nutrition.benefit4': 'Regulación hormonal',

    // Problems / Casos Section
    'problems.badge': 'Diagnóstico y resolución',
    'problems.title': 'Identificación clínica',
    'problems.subtitle':
      'Análisis preciso de patologías para el desarrollo de estrategias terapéuticas efectivas.',

    // Problem: Back Pain
    'problems.backpain.title': 'Disfunción vertebral crónica',
    'problems.backpain.desc':
      'Malestar estructural persistente que compromete el descanso y la funcionalidad laboral.',
    'problems.backpain.solution': 'Protocolo clínico',
    'problems.backpain.solutionDesc':
      'Descompresión axial y neuromodulación postural para una corrección sostenida.',

    // Problem: Stress
    'problems.stress.title': 'Desregulación del sistema nervioso',
    'problems.stress.desc':
      'Estado de hiperactivación, opresión torácica y ausencia de descanso reparador.',
    'problems.stress.solution': 'Protocolo clínico',
    'problems.stress.solutionDesc':
      'Regulación vegetativa mediante terapia craneosacral y respiración controlada.',

    // Problem: Fatigue
    'problems.fatigue.title': 'Agotamiento sistémico',
    'problems.fatigue.desc': 'Letargo crónico y déficit energético que persiste tras el sueño.',
    'problems.fatigue.solution': 'Protocolo clínico',
    'problems.fatigue.solutionDesc':
      'Reactivación metabólica y desbloqueo bioenergético para restaurar la vitalidad.',

    // Problem: Injuries
    'problems.injuries.title': 'Rehabilitación funcional avanzada',
    'problems.injuries.desc':
      'Limitaciones traumáticas que reducen el rendimiento deportivo y la biomecánica.',
    'problems.injuries.solution': 'Protocolo clínico',
    'problems.injuries.solutionDesc':
      'Regeneración tisular acelerada y estabilización preventiva para el alto rendimiento.',
    'casos.problems.backPain.cause4': 'Respiración bloqueada o superficial',
    'casos.problems.backPain.treatment':
      'Trabajamos con masaje terapéutico, liberación miofascial, kinesiología para encontrar la causa profunda (estrés, bloqueo articular o visceral), y técnicas de reeducación postural (Feldenkrais).',
    'casos.problems.backPain.results':
      'Muchas personas notan alivio inmediato y más movilidad después de la primera sesión. Con el tiempo, el cuerpo reaprende a sostenerse con menos esfuerzo y más fluidez.',
    'casos.problems.stress.symptom1': 'Pensamientos constantes y bucle mental',
    'casos.problems.stress.symptom2': 'Dificultad para relajarse o dormir',
    'casos.problems.stress.symptom3': 'Dolor cervical, tensión mandibular, fatiga por la mañana',
    'casos.problems.stress.symptom4': 'Emociones intensas sin motivo aparente',
    'casos.problems.stress.cause1': 'Exceso de responsabilidades y presión',
    'casos.problems.stress.cause2': 'Estrés crónico y falta de tiempo para uno mismo',
    'casos.problems.stress.cause3': 'Traumas no resueltos o experiencias difíciles',
    'casos.problems.stress.cause4': 'Desajuste del sistema nervioso autónomo',
    'casos.problems.stress.treatment':
      'Utilizamos kinesiología emocional y técnicas del sistema vagal para calmar el sistema nervioso. Añadimos trabajo corporal suave (Feldenkrais, respiración consciente) para enseñar al cuerpo a"salir de la lucha".',
    'casos.problems.stress.results':
      'La persona vuelve a dormir mejor, disminuye la tensión interna y recupera la sensación de control y serenidad.',
    'casos.problems.digestive.symptom1':
      'Hinchazón abdominal, gases, reflujo o dolor después de comer',
    'casos.problems.digestive.symptom2': 'Cansancio o somnolencia después de las comidas',
    'casos.problems.digestive.symptom3': 'Cambios de humor o irritabilidad sin motivo',
    'casos.problems.digestive.symptom4': 'Intolerancias alimentarias o sensibilidades',
    'casos.problems.digestive.cause1': 'Intolerancias alimentarias no detectadas',
    'casos.problems.digestive.cause2': 'Alimentación irregular o estrés durante las comidas',
    'casos.problems.digestive.cause3': 'Estrés emocional que afecta la digestión',
    'casos.problems.digestive.cause4':
      'Bloqueos viscerales que afectan la movilidad de los órganos',
    'casos.problems.digestive.treatment':
      'Aplicamos kinesiología nutricional para detectar intolerancias o déficits, técnicas de masaje visceral suave y recomendaciones alimentarias personalizadas.',
    'casos.problems.digestive.results':
      'Mejora la digestión, desaparece la hinchazón y aumenta la energía diaria. El cliente aprende a escuchar su cuerpo y a adaptar su alimentación.',
    'casos.problems.migraines.symptom1': 'Dolor intenso de un lado de la cabeza o en la nuca',
    'casos.problems.migraines.symptom2': 'Presión ocular o sensación de casco',
    'casos.problems.migraines.symptom3': 'Mareos o náuseas',
    'casos.problems.migraines.symptom4': 'Sensibilidad a la luz y a los ruidos',
    'casos.problems.migraines.cause1': 'Bloqueo cervical y tensión muscular',
    'casos.problems.migraines.cause2': 'Tensión mandibular (bruxismo)',
    'casos.problems.migraines.cause3': 'Falta de descanso o exceso de estimulación mental',
    'casos.problems.migraines.cause4': 'Desequilibrios hormonales o alimentarios',
    'casos.problems.migraines.treatment':
      'Combinamos Osteobalance craneal, descarga muscular y técnicas vagales para equilibrar el sistema nervioso. También revisamos la respiración y la postura.',
    'casos.problems.migraines.results':
      'Reducción de la frecuencia e intensidad de las migrañas. En muchos casos, desaparecen completamente después de regular el cuello y el cráneo.',
    'casos.problems.lowEnergy.symptom1': 'Cansancio constante a pesar de dormir bien',
    'casos.problems.lowEnergy.symptom2': 'Baja concentración y memoria',
    'casos.problems.lowEnergy.symptom3': 'Irritabilidad o apatía',
    'casos.problems.lowEnergy.symptom4': 'Sensación de"funcionar con el piloto automático"',
    'casos.problems.lowEnergy.cause1': 'Estrés prolongado y burnout',
    'casos.problems.lowEnergy.cause2': 'Déficits nutricionales o desequilibrios metabólicos',
    'casos.problems.lowEnergy.cause3': 'Problemas hormonales (tiroides, adrenales)',
    'casos.problems.lowEnergy.cause4': 'Desgaste emocional y falta de propósito',
    'casos.problems.lowEnergy.treatment':
      'Usamos kinesiología para identificar desequilibrios químicos o emocionales, suplementación natural y técnicas de movimiento consciente.',
    'casos.problems.lowEnergy.results':
      'Mejora notable de la energía, claridad mental y estado de ánimo más estable.',
    'casos.problems.sleep.symptom1': 'Dificultad para dormirse o despertares nocturnos',
    'casos.problems.sleep.symptom2': 'Fatiga matinal, tensión o sueños intensos',
    'casos.problems.sleep.symptom3': 'Pensamientos recurrentes antes de dormir',
    'casos.problems.sleep.symptom4': 'Sueño ligero o poco reparador',
    'casos.problems.sleep.cause1': 'Exceso de estrés e hiperactivación mental',
    'casos.problems.sleep.cause2': 'Desajuste del sistema nervioso y ritmos circadianos',
    'casos.problems.sleep.cause3': 'Falta de rutina o higiene del sueño',
    'casos.problems.sleep.cause4': 'Problemas digestivos o hormonales',
    'casos.problems.sleep.treatment':
      'Integramos Feldenkrais, respiración guiada, técnicas vagales y kinesiología para equilibrar el sistema hormonal.',
    'casos.problems.sleep.results':
      'Mejora del sueño profundo y descanso reparador después de pocas sesiones.',
    'casos.problems.recovery.symptom1': 'Dolor residual o limitación articular',
    'casos.problems.recovery.symptom2': 'Sensación de debilidad o desequilibrio',
    'casos.problems.recovery.symptom3': 'Bloqueos emocionales asociados a la lesión',
    'casos.problems.recovery.symptom4': 'Miedo al movimiento o reactividad',
    'casos.problems.recovery.cause1': 'Cicatrices internas y adherencias',
    'casos.problems.recovery.cause2': 'Compensaciones musculares y posturales',
    'casos.problems.recovery.cause3': 'Trauma físico con componente emocional',
    'casos.problems.recovery.cause4': 'Memoria corporal de la experiencia traumática',
    'casos.problems.recovery.treatment':
      'Trabajamos con Osteobalance, reeducación postural y trabajo del sistema fascial. Acompañamos también la confianza corporal y la memoria del cuerpo.',
    'casos.problems.recovery.results':
      'Recuperación de la movilidad, alivio del dolor y sensación de seguridad en el movimiento.',

    // Contact Form
    'contact.success.title': '¡Mensaje enviado correctamente!',
    'contact.success.message':
      'Gracias por contactar con nosotros. Nos pondremos en contacto contigo muy pronto.',
    'contact.success.button': 'Enviar otro mensaje',
    'contact.title': 'Habla con nosotros',
    'contact.subtitle':
      'Estamos aquí para ayudarte en tu camino hacia el bienestar. Contacta con nosotros y descubre cómo podemos mejorar tu calidad de vida.',
    'contact.phone.title': 'Teléfono y WhatsApp',
    'contact.phone.subtitle': 'WhatsApp disponible 24/7',
    'contact.email.title': 'Email',
    'contact.email.subtitle': 'Respuesta en menos de 24h',
    'contact.location.title': 'Ubicación',
    'contact.location.address': 'Carrer Pelai, 12\n08001 Barcelona',
    'contact.location.subtitle': 'Metro: l1 y l2 (universitat)',
    'contact.form.name': 'Nombre completo',
    'contact.form.email': 'Correo electrónico',
    'contact.form.phone': 'Teléfono',
    'contact.form.service': 'Servicio de interés',
    'contact.form.service.placeholder': 'Selecciona un servicio',
    'contact.form.time': 'Horario preferente',
    'contact.form.time.placeholder': 'Selecciona un horario',
    'contact.form.message': 'Mensaje',
    'contact.form.message.placeholder': 'Explícanos brevemente qué necesitas...',
    'contact.form.preferred': 'Método de contacto preferido',
    'contact.form.submit': 'Enviar mensaje',
    'contact.form.submitting': 'Enviando...',
    'contact.form.privacy': 'Acepto la política de privacidad',
    'contact.form.source': '¿Cómo nos has conocido?',
    'contact.form.source.placeholder': 'Selecciona una opción',
    'contact.form.source.google': 'Google',
    'contact.form.source.social': 'Redes sociales',
    'contact.form.source.friend': 'Recomendación de un amigo',
    'contact.form.source.other': 'Otros',
    'contact.quick.title': 'O contáctanos directamente:',
    'contact.quick.call': 'Llamar ahora',
    'contact.error': 'Ha habido un error al enviar el mensaje. Por favor, inténtalo de nuevo.',

    // Contact Form Options
    'contact.service.massageBasic': 'Masaje básico (1h)',
    'contact.service.massageComplete': 'Masaje completo (1,5h)',
    'contact.service.massagePremium': 'Masaje premium (2h)',
    'contact.service.kinesiology': 'Kinesiología holística',
    'contact.service.nutrition': 'Nutrición consciente',
    'contact.service.revision360': 'Revisión 360°',
    'contact.service.vip': 'Planes VIP',
    'contact.service.other': 'Otras consultas',

    'contact.time.morning': 'Mañana (9:00 - 12:00)',
    'contact.time.noon': 'Mediodía (12:00 - 15:00)',
    'contact.time.afternoon': 'Tarde (15:00 - 18:00)',
    'contact.time.evening': 'Noche (18:00 - 21:00)',
    'contact.time.any': 'Sin preferencia',

    // Symptoms, causes, treatment, results labels
    'casos.symptoms': 'Síntomas',
    'casos.causes': 'Causas',
    'casos.treatment': 'Cómo te ayudamos',
    'casos.results': 'Resultados',

    // Additional problems list
    'casos.additionalProblems.bruxism': 'Bruxismo y tensión mandibular',
    'casos.additionalProblems.tmj': 'Dolor de ATM (articulación temporomandibular)',
    'casos.additionalProblems.sciatica': 'Ciática y dolor de piernas',
    'casos.additionalProblems.shoulderPain': 'Dolor de hombros y rigidez',
    'casos.additionalProblems.dizziness': 'Mareos y vértigos',
    'casos.additionalProblems.irritability': 'Irritabilidad constante',
    'casos.additionalProblems.intestinalProblems': 'Problemas intestinales',
    'casos.additionalProblems.chronicFatigue': 'Fatiga crónica',
    'casos.additionalProblems.socialAnxiety': 'Ansiedad social',
    'casos.additionalProblems.concentrationDifficulty': 'Dificultad para concentrarse',
    'casos.additionalProblems.headaches': 'Dolores de cabeza y migrañas',
    'casos.additionalProblems.insomnia': 'Insomnio y trastornos del sueño',
    'casos.additionalProblems.posture': 'Problemas posturales',
    'casos.additionalProblems.contractures': 'Contracturas musculares',
    'casos.additionalProblems.emotionalBlock': 'Bloqueos emocionales',
    'casos.additionalProblems.rsi': 'Lesiones por esfuerzo repetitivo',
    'casos.additionalProblems.carpalTunnel': 'Síndrome del túnel carpiano',
    'casos.additionalProblems.plantarFasciitis': 'Fascitis plantar',

    // Testimonials
    'testimonials.title': 'Lo que dicen nuestros clientes',
    'testimonials.subtitle':
      'Descubre experiencias reales de personas que han transformado sus vidas',
    'testimonials.all': 'Todos',
    'testimonials.hide': 'Ocultar',
    'testimonials.show': 'Ver',
    'testimonials.beforeAfter': 'Antes/después',
    'testimonials.before': 'Antes',
    'testimonials.after': 'Después',
    'testimonials.also': 'También en:',
    'testimonials.with': 'Con',
    'testimonials.ratings': 'Valoraciones',
    'testimonials.externalReviews': 'Puedes leer más valoraciones en nuestras páginas externas',
    'testimonials.photo': 'Foto de',
    'testimonials.satisfiedClient': 'Cliente satisfecho',
    'testimonials.sliderTitle': 'Testimonios que hablan por sí solos',
    'testimonials.sliderSubtitle':
      'Descubre cómo hemos ayudado a nuestros clientes a lograr su bienestar',

    // Offline
    'offline.message': 'Sin conexión a internet',

    // Discounts page
    'discounts.pageTitle': 'Descuentos - EKA Balance',
    'discounts.pageDescription':
      'Descubre nuestros descuentos especiales para servicios de bienestar y terapias',
    'discounts.badge': 'Ofertas especiales',
    'discounts.title': 'Descuentos especiales',
    'discounts.subtitle':
      'Disfruta de precios reducidos en nuestros servicios de bienestar con nuestros descuentos exclusivos',
    'discounts.availableTitle': 'Descuentos disponibles',
    'discounts.availableSubtitle':
      'Aprovecha estas ofertas especiales para comenzar tu camino hacia el bienestar',
    'discounts.mykolaFriend.description':
      'Descuento especial del 20% para amigos de mykola. Válido para todas las sesiones y servicios.',
    'discounts.conocidoMykola.description':
      'Descuento del 10% para conocidos de mykola. Aplicable a todos nuestros tratamientos.',
    'discounts.off': 'Descuento',
    'discounts.active': 'Activo',
    'discounts.code': 'Código',
    'discounts.copy': 'Copiar',
    'discounts.howToUse.title': 'Cómo usar los descuentos',
    'discounts.howToUse.subtitle': 'Sigue estos pasos sencillos para aplicar tu descuento',
    'discounts.step1.title': 'Contáctanos',
    'discounts.step1.description':
      'Ponte en contacto con nosotros por WhatsApp o teléfono para reservar',
    'discounts.step2.title': 'Menciona el código',
    'discounts.step2.description': 'Proporciona el código de descuento al hacer tu reserva',
    'discounts.step3.title': 'Disfruta del descuento',
    'discounts.step3.description': 'El descuento se aplicará automáticamente al precio final',
    'discounts.cta.title': '¿Listo para usar tu descuento?',
    'discounts.cta.subtitle': 'Reserva tu sesión ahora y disfruta del precio especial',
    'discounts.cta.bookNow': 'Reservar con descuento',
    'discounts.cta.contact': 'Contactar',

    // Personalized Services
    'personalizedServices.title': 'Programas especializados',
    'personalizedServices.subtitle':
      'Descubre terapias adaptadas específicamente a tu profesión y estilo de vida',
    'personalizedServices.cta': 'Reserva tu sesión',
    'personalizedServices.difference.title': 'Diferencia entre servicios',
    'personalizedServices.main.title': 'Servicios principales',
    'personalizedServices.main.list1': 'Masaje terapéutico general',
    'personalizedServices.main.list2': 'Kinesiología holística',
    'personalizedServices.main.list3': 'Nutrición consciente',
    'personalizedServices.main.list4': 'Revisión 360°',
    'personalizedServices.special.title': 'Servicios personalizados',
    'personalizedServices.special.list1': 'Adaptados a tu profesión',
    'personalizedServices.special.list2': 'Enfoque específico para necesidades',
    'personalizedServices.special.list3': 'Técnicas especializadas',
    'personalizedServices.special.list4': 'Seguimiento personalizado',
    'personalizedServices.choose.title': 'Elige tu servicio personalizado',
    'personalizedServices.choose.subtitle': 'Cada profesión tiene sus necesidades específicas',
    'personalizedServices.bookNow.title': 'Comienza tu transformación hoy',
    'personalizedServices.bookNow.subtitle':
      'Reserva tu servicio personalizado y descubre la diferencia',
    'personalizedServices.officeWorkers': 'Ejecutivos y profesionales',
    'personalizedServices.officeWorkers.desc':
      'Contrarresta el sedentarismo laboral y el estrés de alto nivel. Recupera la postura y la claridad mental.',
    'personalizedServices.officeWorkers.benefit1':
      'Alivio de la tensión crónica en espalda y cuello',
    'personalizedServices.officeWorkers.benefit2': 'Optimización de la postura ergonómica',
    'personalizedServices.officeWorkers.benefit3': 'Reducción del estrés acumulado y la ansiedad',
    'personalizedServices.officeWorkers.result': 'Máxima productividad sin desgaste físico',
    'personalizedServices.athletes': 'Deportistas de élite',
    'personalizedServices.athletes.desc':
      'Maximiza tu rendimiento y acelera la recuperación. Mantenimiento esencial para el cuerpo en movimiento.',
    'personalizedServices.athletes.benefit1': 'Recuperación muscular acelerada',
    'personalizedServices.athletes.benefit2': 'Prevención de lesiones y flexibilidad',
    'personalizedServices.athletes.benefit3': 'Optimización del rendimiento',
    'personalizedServices.athletes.result': 'Ventaja competitiva con menor riesgo de lesiones',
    'personalizedServices.artists': 'Artistas',
    'personalizedServices.artists.desc':
      'Cuidado de manos, brazos y postura para artistas visuales y creadores',
    'personalizedServices.artists.benefit1': 'Cuidado específico de manos y muñecas',
    'personalizedServices.artists.benefit2': 'Mejora la postura durante la creación',
    'personalizedServices.artists.benefit3': 'Libera la creatividad reduciendo tensiones físicas',
    'personalizedServices.artists.result': 'Más comodidad y fluidez en el proceso creativo',
    'personalizedServices.musicians': 'Músicos profesionales',
    'personalizedServices.musicians.desc':
      'Afinación ergonómica de la conexión cuerpo-instrumento. Prevención de lesiones por repetición.',
    'personalizedServices.musicians.benefit1': 'Liberación de tensiones repetitivas',
    'personalizedServices.musicians.benefit2': 'Mejora del control motor fino',
    'personalizedServices.musicians.benefit3': 'Conciencia corporal con el instrumento',
    'personalizedServices.musicians.result': 'Expresión artística fluida',
    'personalizedServices.students': 'Estudiantes y académicos',
    'personalizedServices.students.desc':
      'Apoyo físico y mental para alta exigencia intelectual. Potencia el enfoque y alivia el estrés.',
    'personalizedServices.students.benefit1': 'Alivio de la tensión por estudio',
    'personalizedServices.students.benefit2': 'Mejora de la oxigenación cerebral y memoria',
    'personalizedServices.students.benefit3': 'Regulación del sueño',
    'personalizedServices.students.result': 'Mente despierta en un cuerpo relajado',
    'personalizedServices.parents': 'Madres y Padres',
    'personalizedServices.parents.desc':
      'Apoyo para recuperar energía, paciencia y bienestar físico mientras cuidas de otros.',
    'personalizedServices.parents.benefit1': 'Alivia el dolor de espalda por cargar niños.',
    'personalizedServices.parents.benefit2': 'Reduce la fatiga emocional y el estrés.',
    'personalizedServices.parents.benefit3': 'Restaura los niveles de energía vital.',
    'personalizedServices.parents.result': 'Siéntete revitalizado para criar con alegría.',

    // Booking page
    'booking.title': 'Reserva tu sesión - EKA Balance',
    'booking.description':
      'Reserva fácilmente tu sesión de bienestar en Barcelona. Contacto directo por WhatsApp con respuesta rápida.',
    'booking.badge': 'Reserva fácil y rápida',
    'booking.hero.title': 'Solicita tu sesión clínica',
    'booking.hero.subtitle':
      'Inicia tu proceso de recuperación con una evaluación profesional personalizada',
    'booking.benefits.whatsapp': 'Comunicación directa',
    'booking.benefits.flexible': 'Agenda prioritaria',
    'booking.benefits.confirmation': 'Gestión inmediata',
    'booking.contact.title': 'Canal de comunicación',
    'booking.contact.subtitle': 'Selecciona tu método preferente para coordinar la visita',
    'booking.direct.title': 'Consulta directa',
    'booking.direct.description': 'Contacta directamente con el especialista para evaluar tu caso',
    'booking.direct.button': 'Iniciar consulta',
    'booking.form.title': 'Solicitud de cita',
    'booking.form.description': 'Facilita tus datos clínicos preliminares para preparar la sesión',
    'booking.form.button': 'Iniciar solicitud',
    'booking.form.hide': 'Cerrar formulario',
    'booking.form.location': 'Sede clínica',
    'booking.form.locationPlaceholder': 'Selecciona ubicación',
    'booking.form.timeSlot': 'Preferencia horaria',
    'booking.form.timeSlotPlaceholder': 'Selecciona franja',
    'booking.form.availability': 'Disponibilidad',
    'booking.form.availabilityPlaceholder': 'Indica tu disponibilidad',
    'booking.form.objective': 'Motivo de consulta',
    'booking.form.objectivePlaceholder': 'Describe brevemente tu sintomatología...',
    'booking.form.submit': 'Tramitar solicitud',

    // Options
    'booking.options.service.massage': 'Terapia manual',
    'booking.options.service.kinesiology': 'Kinesiología clínica',
    'booking.options.service.osteobalance': 'Osteobalance',
    'booking.options.service.movementLesson': 'Movement Lesson',
    'booking.options.service.feldenkrais': 'Método Feldenkrais',
    'booking.options.service.online': 'Telemedicina / online',
    'booking.options.service.other': 'Otra consulta',

    'booking.options.location.barcelona': 'Barcelona',
    'booking.options.location.rubi': 'Rubí',
    'booking.options.location.online': 'Online',

    'booking.options.availability.tomorrow': 'Mañana',
    'booking.options.availability.dayAfterTomorrow': 'Pasado mañana',
    'booking.options.availability.nextWeek': 'Próxima semana',
    'booking.options.availability.weekend': 'Fin de semana',
    'booking.options.availability.flexible': 'Flexible',

    'booking.options.timeSlot.morning': 'Mañana (9:00-12:00)',
    'booking.options.timeSlot.noon': 'Mediodía (12:00-15:00)',
    'booking.options.timeSlot.afternoon': 'Tarde (15:00-18:00)',
    'booking.options.timeSlot.evening': 'Noche (18:00-21:00)',
    'booking.form.quickTitle': 'Formulario rápido de reserva',
    'booking.form.nameRequired': 'Nombre *',
    'booking.form.namePlaceholder': 'Tu nombre',
    'booking.form.serviceRequired': 'Servicio *',
    'booking.form.servicePlaceholder': 'Selecciona un servicio',
    'booking.form.validationError':
      'Por favor, rellena al menos el nombre y el servicio de interés.',
    'booking.popup.title': 'Reserva tu sesión',
    'booking.popup.subtitle': 'Selecciona el servicio y la fecha que mejor te convenga',
    'booking.whatsapp.greeting': 'Hola, soy {name}',
    'booking.whatsapp.greetingGeneric': 'Hola Elena, me gustaría reservar una cita.',
    'booking.whatsapp.service': 'Me gustaría reservar una sesión: {service}',
    'booking.whatsapp.location': 'Lugar preferido: {location}',
    'booking.whatsapp.date': 'Fecha preferida: {date}',
    'booking.whatsapp.time': 'Hora preferida: {time}',
    'booking.whatsapp.comments': 'Comentarios: {comments}',

    // Athletes personalized service
    'athletes.hero.badge': 'Alto rendimiento deportivo',
    'athletes.hero.title': 'Deportistas de élite',
    'athletes.hero.subtitle':
      'Optimización biomecánica, recuperación acelerada y prevención de lesiones',
    'athletes.challenges.title': 'Desafíos clínicos',
    'athletes.challenge1.title': 'Fatiga sistémica',
    'athletes.challenge1.desc':
      'Recuperación ineficiente post-esfuerzo y acumulación de carga alostática',
    'athletes.challenge2.title': 'Restricción biomecánica',
    'athletes.challenge2.desc':
      'Limitaciones funcionales que comprometen la eficiencia del movimiento',
    'athletes.challenge3.title': 'Presión competitiva',
    'athletes.challenge3.desc':
      'Desregulación del sistema nervioso autónomo ante la alta exigencia',
    'athletes.help.title': 'Intervención clínica',
    'athletes.help1.title': 'Regeneración tisular',
    'athletes.help1.desc':
      'Protocolos avanzados para acelerar la reparación muscular y reducir la inflamación',
    'athletes.help2.title': 'Optimización funcional',
    'athletes.help2.desc': 'Restauración de la movilidad articular y la eficiencia neuromuscular',
    'athletes.help3.title': 'Regulación autonómica',
    'athletes.help3.desc': 'Estrategias somáticas para el control del estrés y la focalización',
    'athletes.result.title': 'Impacto clínico',
    'athletes.result.desc':
      'Maximización del rendimiento, longevidad deportiva y resiliencia física',
    'athletes.stats.recovery': 'Recuperación óptima',
    'athletes.stats.flexibility': 'Movilidad funcional',
    'athletes.stats.anxiety': 'Control del estrés',
    'athletes.session.title': 'Protocolo deportivo',

    // Artists personalized service
    'artists.hero.badge': 'Salud para creadores',
    'artists.hero.title': 'Artistas visuales',
    'artists.hero.subtitle': 'Preservación funcional de la motricidad fina y ergonomía creativa',
    'artists.challenges.title': 'Desafíos clínicos',
    'artists.challenge1.title': 'Sobrecarga repetitiva',
    'artists.challenge1.desc':
      'Microtraumatismos en extremidades superiores por gestos técnicos continuados',
    'artists.challenge2.title': 'Fatiga postural',
    'artists.challenge2.desc':
      'Compromiso musculoesquelético derivado de posturas estáticas prolongadas',
    'artists.challenge3.title': 'Bloqueo psicosomático',
    'artists.challenge3.desc': 'Restricción física que impacta en la fluidez y expresión creativa',
    'artists.help.title': 'Intervención clínica',
    'artists.help1.title': 'Rehabilitación de la motricidad',
    'artists.help1.desc': 'Terapia manual específica para restaurar la función de manos y muñecas',
    'artists.help2.title': 'Reeducación ergonómica',
    'artists.help2.desc': 'Optimización biomecánica del gesto creativo para prevenir lesiones',
    'artists.help3.title': 'Desbloqueo somático',
    'artists.help3.desc': 'Liberación de tensiones profundas para facilitar el flujo artístico',
    'artists.result.title': 'Impacto clínico',
    'artists.result.desc': 'Sostenibilidad de la práctica artística y libertad de movimiento',
    'artists.stats.confidence': 'Confianza creativa',
    'artists.stats.tension': 'Alivio tensional',
    'artists.stats.anxiety': 'Regulación nerviosa',
    'artists.session.title': 'Protocolo para artistas',
    'artists.session.cta': 'Solicitar evaluación',
    'artists.session.other': 'Otras especialidades',

    // Musicians personalized service
    'musicians.hero.badge': 'Medicina de las artes escénicas',
    'musicians.hero.title': 'Músicos profesionales',
    'musicians.hero.subtitle':
      'Ergonomía instrumental, prevención de distonías y optimización del gesto técnico',
    'musicians.problems.title': 'Patologías específicas',
    'musicians.problems.subtitle':
      'Abordaje clínico de las disfunciones musculoesqueléticas asociadas a la práctica instrumental',
    'musicians.problem1.title': 'Síndromes de sobrecarga',
    'musicians.problem1.desc':
      'Tendinopatías y atrapamientos nerviosos derivados de la repetición motriz',
    'musicians.problem2.title': 'Disfunción postural',
    'musicians.problem2.desc':
      'Asimetrías y compensaciones musculares inducidas por el instrumento',
    'musicians.problem3.title': 'Desregulación escénica',
    'musicians.problem3.desc':
      'Manifestaciones somáticas de la ansiedad performativa (temblor, sudoración)',
    'musicians.problem4.title': 'Deterioro técnico',
    'musicians.problem4.desc': 'Pérdida de control motor fino y coordinación neuromuscular',
    'musicians.help.title': 'Protocolo terapéutico',
    'musicians.help1.title': 'Rehabilitación funcional',
    'musicians.help1.desc':
      'Terapia manual avanzada para restaurar la biomecánica de la extremidad superior',
    'musicians.help2.title': 'Reeducación postural',
    'musicians.help2.desc': 'Análisis ergonómico y corrección del gesto técnico instrumental',
    'musicians.help3.title': 'Control autonómico',
    'musicians.help3.desc':
      'Estrategias de regulación del sistema nervioso para la ejecución en público',
    'musicians.results.title': 'Objetivos clínicos',
    'musicians.results.point1': 'Resolución de la sintomatología dolorosa y parestesias',
    'musicians.results.point2': 'Recuperación de la precisión motriz y la resistencia',
    'musicians.results.point3': 'Seguridad y control en la ejecución escénica',
    'musicians.plans.title': 'Programas de intervención',
    'musicians.plans.subtitle': 'Selecciona el nivel de asistencia clínica requerido',
    'musicians.plan1.name': 'Evaluación diagnóstica',
    'musicians.plan1.desc': 'Valoración inicial y tratamiento de urgencia',
    'musicians.plan1.benefit1': 'Análisis biomecánico del gesto',
    'musicians.plan1.benefit2': 'Terapia manual focalizada',
    'musicians.plan1.benefit3': 'Pautas ergonómicas inmediatas',
    'musicians.plan1.benefit4': 'Informe clínico preliminar',
    'musicians.plan1.result': 'Diagnóstico funcional y alivio sintomático',
    'musicians.plan2.name': 'Tratamiento intensivo',
    'musicians.plan2.desc': 'Protocolo de recuperación funcional',
    'musicians.plan2.benefit1': 'Todo lo incluido en evaluación',
    'musicians.plan2.benefit2': 'Seguimiento evolutivo semanal',
    'musicians.plan2.benefit3': 'Programa de readaptación motriz',
    'musicians.plan2.benefit4': 'Soporte telemático directo',
    'musicians.plan2.result': 'Restauración de la capacidad interpretativa',
    'musicians.plan2.popular': 'Recomendado',
    'musicians.plan2.save': 'Bonificado',
    'musicians.plan3.name': 'Alto rendimiento',
    'musicians.plan3.desc': 'Optimización integral para solistas',
    'musicians.plan3.benefit1': 'Protocolo intensivo completo',
    'musicians.plan3.benefit2': 'Asesoramiento metabólico',
    'musicians.plan3.benefit3': 'Entrenamiento en neuroregulación',
    'musicians.plan3.benefit4': 'Evaluación 360° multidisciplinar',
    'musicians.plan3.result': 'Excelencia técnica y salud sostenible',
    'musicians.plan.cta': 'Solicitar programa',

    // Students personalized service
    'students.hero.badge': 'Especializado para estudiantes',
    'students.hero.title': 'Estudiantes',
    'students.hero.subtitle':
      'Gestión del estrés de estudio, mejora de la concentración y cuidado postural',
    'students.challenges.title': 'Problemas comunes',
    'students.challenge1.title': 'Estrés de exámenes',
    'students.challenge1.desc': 'Ansiedad y tensión que afectan el rendimiento académico',
    'students.challenge2.title': 'Concentración limitada',
    'students.challenge2.desc':
      'Dificultad para mantener la atención durante largas sesiones de estudio',
    'students.challenge3.title': 'Tensiones posturales',
    'students.challenge3.desc':
      'Dolor de espalda y cuello por estar sentado muchas horas estudiando',
    'students.help.title': 'Cómo te ayudamos',
    'students.help1.title': 'Gestiona el estrés académico',
    'students.help1.desc': 'Técnicas de relajación para reducir la ansiedad de exámenes',
    'students.help2.title': 'Mejora la concentración',
    'students.help2.desc': 'Ejercicios para aumentar la capacidad de atención y memoria',
    'students.help3.title': 'Corrige la postura de estudio',
    'students.help3.desc': 'Ajustes posturales para prevenir dolores mientras estudias',
    'students.result.title': 'Resultado',
    'students.result.desc': 'Mejor rendimiento académico, menos estrés y más energía',
    'students.stats.concentration': 'Más concentración',
    'students.stats.tension': 'Menos tensión',
    'students.stats.stress': 'Menos estrés',
    'students.session.title': 'Sesión para estudiantes',

    // Office Workers specific translations
    'office.stats.pain': 'Menos dolor',
    'office.stats.posture': 'Mejor postura',
    'office.stats.stress': 'Menos estrés',
    'office.session.title': 'Sesión para trabajadores de oficina',
    'office.session.plans': 'Ver planes',

    // FAQ Section
    'faq.title': 'Preguntas frecuentes',
    'faq.subtitle': 'Encuentra respuestas a las preguntas más comunes sobre nuestros servicios',
    'faq.q1.question': '¿Cuánto dura una sesión típica?',
    'faq.q1.answer':
      'Las sesiones suelen durar entre 60 y 90 minutos, dependiendo del tratamiento elegido y tus necesidades específicas.',
    'faq.q2.question': '¿Necesito experiencia previa?',
    'faq.q2.answer':
      'No se necesita experiencia previa. Todos nuestros tratamientos se adaptan a tu nivel y necesidades específicas.',
    'faq.q3.question': '¿Con qué frecuencia debería venir?',
    'faq.q3.answer':
      'Dependiendo de tus objetivos, recomendamos 1-2 sesiones por semana inicialmente, y luego sesiones de mantenimiento mensuales.',
    'faq.q4.question': '¿Qué métodos de pago aceptan?',
    'faq.q4.answer':
      'Aceptamos efectivo, tarjetas de crédito y débito, y también bizum para mayor comodidad.',
    'faq.q5.question': '¿Puedo cancelar o reprogramar mi cita?',
    'faq.q5.answer':
      'Sí, puedes cancelar o reprogramar con 24 horas de antelación sin ningún cargo adicional.',

    // First Time Visitor Form
    'form.badge': 'Descubrimiento personalizado',
    'form.title': 'Encuentra el servicio perfecto para ti',
    'form.subtitle': 'Responde unas preguntas rápidas y te ayudaremos a encontrar la terapia ideal',
    'form.contactWhatsApp': 'Contactar por WhatsApp',
    'form.step': 'Paso',
    'form.of': 'De',
    'form.previous': 'Anterior',
    'form.next': 'Siguiente',
    'form.seeRecommendation': 'Ver recomendación',
    'form.backToForm': 'Volver al formulario',
    'form.close': 'Cerrar',
    'form.closeForm': 'Cerrar formulario',

    'form.step1.question': '¿Cuál es tu perfil principal?',
    'form.userType.officeWorker': 'Trabajador/a de oficina',
    'form.userType.officeWorkerDesc': 'Paso muchas horas sentado/a frente al ordenador',
    'form.userType.athlete': 'Deportista',
    'form.userType.athleteDesc': 'Hago ejercicio regularmente o soy atleta profesional',
    'form.userType.artist': 'Artista o creador/a',
    'form.userType.artistDesc': 'Trabajo con las manos (pintura, escultura, artesanía)',
    'form.userType.musician': 'Músico',
    'form.userType.musicianDesc': 'Toco instrumentos musicales regularmente',
    'form.userType.student': 'Estudiante',
    'form.userType.studentDesc': 'Estudio o estoy preparando exámenes',
    'form.userType.general': 'Otros perfiles',
    'form.userType.generalDesc': 'Ninguna de las anteriores o combinación de varias',

    'form.step2.question': '¿Cuáles son tus objetivos? (Selecciona todos los que te interesen)',
    'form.goals.musclePain': 'Aliviar dolor muscular y tensiones',
    'form.goals.stress': 'Reducir estrés y ansiedad',
    'form.goals.posture': 'Mejorar postura',
    'form.goals.relaxation': 'Relajación y desconexión',
    'form.goals.recovery': 'Recuperación después del ejercicio',
    'form.goals.sleep': 'Mejorar calidad del sueño',
    'form.goals.emotions': 'Gestionar emociones',
    'form.goals.energy': 'Aumentar energía y vitalidad',

    'form.step3.question': '¿Cuánto tiempo tienes disponible por sesión?',
    'form.time.short': 'Menos de 1 hora',
    'form.time.standard': '1-1.5 horas',
    'form.time.long': 'Más de 1.5 horas',

    'form.step4.question': '¿Qué experiencia tienes con terapias corporales?',
    'form.experience.none': 'Es mi primera vez',
    'form.experience.noneDesc': 'Nunca he recibido terapias corporales',
    'form.experience.some': 'Tengo algo de experiencia',
    'form.experience.someDesc': 'He ido alguna vez a masajes o terapias',
    'form.experience.experienced': 'Tengo experiencia',
    'form.experience.experiencedDesc': 'Recibo terapias regularmente',

    'form.step5.question': '¿Qué tipo de intensidad prefieres?',
    'form.intensity.gentle': 'Suave y relajante',
    'form.intensity.gentleDesc': 'Prefiero un tratamiento suave y tranquilo',
    'form.intensity.medium': 'Moderada',
    'form.intensity.mediumDesc': 'Tratamiento equilibrado entre relajación y trabajo profundo',
    'form.intensity.deep': 'Intensa y profunda',
    'form.intensity.deepDesc': 'Quiero un trabajo profundo para tensiones específicas',

    'form.recommendation.badge': 'Recomendación personalizada',
    'form.recommendation.title': 'Tu servicio ideal',
    'form.recommendation.subtitle':
      'Basándonos en tu perfil, hemos encontrado el servicio perfecto para ti',
    'form.recommendation.price': 'Precio',
    'form.recommendation.duration': 'Duración',
    'form.recommendation.benefits': 'Beneficios principales',

    'form.recommendation.officeWorker.title': 'Sesión para trabajadores de oficina',
    'form.recommendation.officeWorker.desc':
      'Terapia especializada para aliviar tensiones del trabajo sedentario, mejorar la postura y reducir el estrés laboral',
    'form.recommendation.officeWorker.benefit1': 'Alivia dolor cervical y de espalda',
    'form.recommendation.officeWorker.benefit2': 'Mejora la postura frente al ordenador',
    'form.recommendation.officeWorker.benefit3': 'Reduce el estrés laboral',
    'form.recommendation.officeWorker.benefit4': 'Más energía para trabajar',

    'form.recommendation.athlete.title': 'Sesión para deportistas',
    'form.recommendation.athlete.desc':
      'Recuperación muscular, prevención de lesiones y optimización del rendimiento deportivo con técnicas especializadas',
    'form.recommendation.athlete.benefit1': 'Acelera recuperación muscular',
    'form.recommendation.athlete.benefit2': 'Previene lesiones',
    'form.recommendation.athlete.benefit3': 'Mejora flexibilidad',
    'form.recommendation.athlete.benefit4': 'Optimiza rendimiento',

    'form.recommendation.artist.title': 'Sesión para artistas',
    'form.recommendation.artist.desc':
      'Cuidado específico de manos, brazos y postura para artistas visuales. Libera la creatividad eliminando tensiones físicas',
    'form.recommendation.artist.benefit1': 'Cuidado de manos y muñecas',
    'form.recommendation.artist.benefit2': 'Mejora postura creativa',
    'form.recommendation.artist.benefit3': 'Libera creatividad',
    'form.recommendation.artist.benefit4': 'Previene lesiones por uso repetitivo',

    'form.recommendation.musician.title': 'Sesión para músicos',
    'form.recommendation.musician.desc':
      'Terapia especializada para músicos: prevención de lesiones, mejora de la técnica y gestión de la ansiedad escénica',
    'form.recommendation.musician.benefit1': 'Previene lesiones musicales',
    'form.recommendation.musician.benefit2': 'Mejora técnica',
    'form.recommendation.musician.benefit3': 'Gestiona ansiedad escénica',
    'form.recommendation.musician.benefit4': 'Relajación específica',

    'form.recommendation.student.title': 'Sesión para estudiantes',
    'form.recommendation.student.desc':
      'Gestión del estrés de estudio, mejora de la concentración y cuidado postural para estudiantes',
    'form.recommendation.student.benefit1': 'Reduce estrés de exámenes',
    'form.recommendation.student.benefit2': 'Mejora concentración',
    'form.recommendation.student.benefit3': 'Corrige postura de estudio',
    'form.recommendation.student.benefit4': 'Más energía para estudiar',

    'form.recommendation.holistic.title': 'Sesión holística integral',
    'form.recommendation.holistic.desc':
      'Combinación de masaje terapéutico y kinesiología para un tratamiento completo del cuerpo y las emociones',
    'form.recommendation.holistic.benefit1': 'Tratamiento integral',
    'form.recommendation.holistic.benefit2': 'Equilibrio cuerpo-mente',
    'form.recommendation.holistic.benefit3': 'Alivia tensiones físicas',
    'form.recommendation.holistic.benefit4': 'Gestiona emociones',

    'form.recommendation.therapeutic.title': 'Masaje terapéutico',
    'form.recommendation.therapeutic.desc':
      'Sesión especializada para aliviar dolor muscular, tensiones y mejorar la movilidad corporal',
    'form.recommendation.therapeutic.benefit1': 'Alivia dolor muscular',
    'form.recommendation.therapeutic.benefit2': 'Mejora movilidad',
    'form.recommendation.therapeutic.benefit3': 'Reduce tensiones',
    'form.recommendation.therapeutic.benefit4': 'Relajación profunda',

    'form.recommendation.kinesiology.title': 'Kinesiología holística',
    'form.recommendation.kinesiology.desc':
      'Terapia que combina técnicas corporales y emocionales para reequilibrar tu estado general',

    'form.recommendation.kinesiology.benefit1': 'Equilibrio emocional',
    'form.recommendation.kinesiology.benefit2': 'Gestión del estrés',
    'form.recommendation.kinesiology.benefit3': 'Mejora autoconocimiento',
    'form.recommendation.kinesiology.benefit4': 'Paz interior',

    'form.recommendation.discovery.title': 'Sesión de descubrimiento',
    'form.recommendation.discovery.desc':
      'Sesión inicial para explorar tus necesidades y crear un plan personalizado para tu bienestar',
    'form.recommendation.discovery.benefit1': 'Evaluación completa',
    'form.recommendation.discovery.benefit2': 'Plan personalizado',
    'form.recommendation.discovery.benefit3': 'Primera experiencia',
    'form.recommendation.discovery.benefit4': 'Orientación profesional',

    'seo.students.title': 'Terapias para estudiantes | EKA Balance',
    'seo.students.description':
      'Alivio del estrés y mejora de la postura para estudiantes. Sesiones personalizadas para mejorar la concentración y reducir la tensión de estudio.',
    'seo.students.keywords':
      'Terapia estudiantes, alivio estrés estudio, corrección postura, mejora concentración, masaje estudiantes Barcelona',

    'seo.officeWorkers.title': 'Bienestar para trabajadores de oficina | EKA Balance',
    'seo.officeWorkers.description':
      'Soluciones para el dolor de espalda, cuello y muñecas causado por el trabajo de oficina. Mejora tu postura y reduce el estrés laboral.',
    'seo.officeWorkers.keywords':
      'Ergonomía oficina, dolor espalda oficina, síndrome túnel carpiano, alivio estrés laboral, masaje ejecutivo Barcelona',

    'seo.musicians.title': 'Fisioterapia y bienestar para músicos | EKA Balance',
    'seo.musicians.description':
      'Tratamientos especializados para músicos. Prevención de lesiones, mejora del rendimiento y gestión de la ansiedad escénica.',
    'seo.musicians.keywords':
      'Terapia músicos, lesiones músicos, ansiedad escénica, ergonomía musical, fisioterapia artes escénicas',

    'seo.artists.title': 'Terapias para artistas - Creatividad y bienestar | EKA Balance',
    'seo.artists.description':
      'Servicios para artistas de todas las disciplinas. Desbloquea tu creatividad, reduce el estrés y mejora tu expresión artística.',
    'seo.artists.keywords':
      'Terapias artistas, creatividad, bienestar emocional, expresión artística, arteterapia Barcelona',

    'seo.adults.title': 'Bienestar integral para adultos - Salud y equilibrio | EKA Balance',
    'seo.adults.description':
      'Tratamientos personalizados para adultos: gestión del estrés, dolor crónico y mejora de la calidad de vida. Masaje, kinesiología y más.',
    'seo.adults.keywords':
      'Bienestar adultos, gestión estrés, dolor crónico, masaje terapéutico, kinesiología Barcelona',

    'seo.children.title': 'Terapias para niños - Desarrollo y crecimiento | EKA Balance',
    'seo.children.description':
      'Apoyo al desarrollo infantil a través de kinesiología y métodos suaves. Ayudamos en problemas de aprendizaje, emocionales y de coordinación.',
    'seo.children.keywords':
      'Terapias niños, desarrollo infantil, kinesiología niños, problemas aprendizaje, coordinación psicomotriz Barcelona',

    'seo.families.title': 'Bienestar para familias - Armonía y conexión | EKA Balance',
    'seo.families.description':
      'Espacio de salud para toda la familia. Mejora la convivencia, reduce tensiones y encuentra el equilibrio familiar con nuestras terapias sistémicas.',
    'seo.families.keywords':
      'Bienestar familiar, terapia familiar, armonía hogar, kinesiología familiar, relaciones padres hijos Barcelona',

    'seo.athletes.title': 'Recuperación y rendimiento deportivo | EKA Balance',
    'seo.athletes.description':
      'Masaje deportivo y terapias de recuperación para atletas. Mejora tu rendimiento, previene lesiones y recupérate más rápido.',
    'seo.athletes.keywords':
      'Masaje deportivo, recuperación atletas, prevención lesiones deportivas, mejora rendimiento, fisioterapia deportiva Barcelona',

    'seo.parents.title': 'Bienestar y energía para padres | EKA Balance',
    'seo.parents.description':
      'Apoyo para padres y madres. Recupera tu energía, reduce el estrés y encuentra el equilibrio entre la vida familiar y personal.',
    'seo.parents.keywords':
      'Estrés parental, recuperación posparto, energía padres, bienestar familiar, masaje relajante padres',

    'contact.form.whatsapp': 'WhatsApp',
    'contact.form.preferredTime': 'Horario preferido',
    'contact.form.selectTime': 'Selecciona un horario',

    // Cookie translations
    'cookies.title': 'Utilizamos cookies para mejorar tu experiencia',
    'cookies.description':
      'Utilizamos cookies esenciales para la funcionalidad del sitio web y análisis anónimos para mejorar nuestros servicios. No utilizamos cookies publicitarias ni de seguimiento. Al continuar utilizando nuestro sitio, aceptas el uso de cookies.',
    'cookies.accept': 'Aceptar todo',
    'cookies.reject': 'Rechazar',
    'cookies.learnMore': 'Más información',

    // Layout footer
    'footer.privacyPolicy': 'Política de privacidad',
    'footer.cookiePolicy': 'Política de cookies',
    'footer.termsOfService': 'Términos de servicio',
    'footer.logout': 'Cerrar sesión',
    'footer.login': 'Iniciar sesión',

    // Service pages
    'services.page.benefits': 'Beneficios',
    'services.page.testimonials': 'Testimonios',
    'services.page.sessions': 'Sesiones',
    'services.page.duration': 'Duración',
    'services.page.price': 'Precio',

    // Policy pages
    'policy.lastUpdated': 'Última actualización:',
    'policy.introduction': 'Introducción',

    // SEO
    'seo.home.title': 'EKA Balance | masaje terapéutico y kinesiología en Barcelona',
    'seo.home.description':
      'Centro de bienestar integral en Barcelona. Especialistas en masaje terapéutico, kinesiología holística y terapias personalizadas para aliviar el dolor y el estrés.',
    'seo.home.keywords':
      'Masaje Barcelona, kinesiología, bienestar, terapia manual, dolor de espalda, estrés, relajación',

    // Onboarding
    'onboarding.welcome.title': 'Bienvenido a tu experiencia personalizada',
    'onboarding.welcome.description':
      'Responde unas breves preguntas para que podamos recomendarte el servicio ideal para ti.',
    'onboarding.welcome.discountBadge': '15€ de descuento en tu primera sesión',
    'onboarding.progress.step': 'Paso',
    'onboarding.progress.of': 'De',
    'onboarding.processing.title': 'Procesando tus respuestas...',
    'onboarding.processing.subtitle':
      'Estamos analizando tu perfil para encontrar la mejor recomendación.',
    'onboarding.finish': 'Finalizar',
    'onboarding.results.title': 'Tu recomendación personalizada',
    'onboarding.results.subtitle': 'Basado en tus respuestas, te recomendamos:',
    'onboarding.results.recommended': 'Recomendado',
    'onboarding.results.discountApplied': '🎁 -15€ Primera sesión',
    'onboarding.results.howYouWillFeel': 'Cómo te sentirás',
    'onboarding.results.personalizedInfo': 'Información personalizada',

    // Personalized Pages SEO
    'personalized.office.title': 'Terapias para trabajadores de oficina | EKA Balance',
    'personalized.office.description':
      'Alivia el dolor de espalda y el estrés laboral con nuestras terapias especializadas para trabajadores de oficina en Barcelona.',
    'personalized.office.keywords':
      'Masaje oficina, dolor espalda ordenador, estrés laboral, ergonomía, Barcelona',

    'personalized.athletes.title': 'Masaje deportivo y recuperación | EKA Balance',
    'personalized.athletes.description':
      'Mejora tu rendimiento y acelera tu recuperación con nuestros masajes deportivos y terapias para atletas en Barcelona.',
    'personalized.athletes.keywords':
      'Masaje deportivo, recuperación muscular, lesiones deportivas, rendimiento, Barcelona',

    'personalized.artists.title': 'Bienestar para artistas y creativos | EKA Balance',
    'personalized.artists.description':
      'Cuida tus manos y tu postura. Terapias especializadas para artistas visuales, músicos y creativos en Barcelona.',
    'personalized.artists.keywords':
      'Masaje artistas, dolor manos, postura creativa, bienestar creativos, Barcelona',

    'personalized.musicians.title': 'Fisioterapia y masaje para músicos | EKA Balance',
    'personalized.musicians.description':
      'Prevención de lesiones y mejora del rendimiento para músicos. Tratamientos especializados en Barcelona.',
    'personalized.musicians.keywords':
      'Masaje músicos, lesiones músicos, distonía focal, postura musical, Barcelona',

    'personalized.students.title': 'Relajación y concentración para estudiantes | EKA Balance',
    'personalized.students.description':
      'Reduce el estrés de los exámenes y mejora tu concentración con nuestras terapias para estudiantes en Barcelona.',
    'personalized.students.keywords':
      'Estrés exámenes, concentración, postura estudio, masaje estudiantes, Barcelona',

    'personalized.parents.title': 'Bienestar para padres y madres | EKA Balance',
    'personalized.parents.description':
      'Encuentra tu momento de paz. Terapias para aliviar el estrés y la fatiga de la crianza en Barcelona.',
    'personalized.parents.keywords':
      'Estrés padres, posparto, fatiga crianza, masaje relax, Barcelona',

    // Common
    'common.price': 'Precio',
    'common.duration': 'Duración',
    'common.benefits': 'Beneficios',
    'common.book': 'Reservar',
    'common.learnMore': 'Saber más',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.submit': 'Enviar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.required': 'Requerido',
    'common.optional': 'Opcional',
    'common.close': 'Cerrar',
    'common.menu': 'Menú',
    'common.home': 'Inicio',
    'common.services': 'Servicios',
    'common.about': 'Sobre nosotros',
    'common.faq': 'Preguntas frecuentes',
    'common.privacy': 'Privacidad',
    'common.terms': 'Términos',
    'common.cookies': 'Cookies',
    'common.copyright': 'Derechos de autor',
    'common.language': 'Idioma',
    'common.spanish': 'Español',
    'common.english': 'Inglés',
    'common.catalan': 'Catalán',
    'common.russian': 'Ruso',

    // Elena SEO
    'elena.seo.title': 'Sobre Elena | terapeuta holística en Barcelona',
    'elena.seo.desc':
      'Conoce a Elena, terapeuta especializada en masaje, kinesiología y bienestar integral. Más de 10 años de experiencia ayudando a personas a recuperar su equilibrio.',
    'elena.seo.keywords':
      'Elena terapeuta, masaje Barcelona, kinesiología, terapeuta holística, bienestar',

    // Casos SEO
    'casos.seo.title': 'Casos de éxito y tratamientos | EKA Balance',
    'casos.seo.desc':
      'Descubre cómo hemos ayudado a nuestros clientes a superar dolor de espalda, estrés, ansiedad y otros problemas de salud con nuestras terapias personalizadas.',
    'casos.seo.keywords':
      'Casos éxito, testimonios masaje, tratamiento dolor espalda, alivio estrés, resultados terapia',

    // Contact SEO
    'seo.contact.title': 'Contacto y reservas | EKA Balance Barcelona',
    'seo.contact.description':
      'Reserva tu cita en EKA Balance. Estamos en el centro de Barcelona. Contacta por WhatsApp, teléfono o email.',
    'seo.contact.keywords':
      'Contacto EKA Balance, reservar masaje Barcelona, cita kinesiología, ubicación centro bienestar',

    // Services SEO
    'seo.services.title': 'Servicios de bienestar y terapias | EKA Balance',
    'seo.services.description':
      'Explora nuestra gama de servicios: masaje terapéutico, kinesiología, nutrición consciente y planes personalizados para tu salud.',
    'seo.services.keywords':
      'Servicios bienestar, masaje terapéutico, kinesiología holística, nutrición, terapias Barcelona',

    // Personalized SEO
    'seo.personalized.title': 'Terapias personalizadas por profesión | EKA Balance',
    'seo.personalized.description':
      'Tratamientos adaptados a tu estilo de vida: oficina, deporte, arte, música o estudios. Encuentra el equilibrio en tu día a día.',
    'seo.personalized.keywords':
      'Terapias personalizadas, masaje oficina, masaje deportivo, salud músicos, bienestar artistas',

    // VIP SEO
    'seo.vip.title': 'Club VIP y membresías | EKA Balance',
    'seo.vip.description':
      'Únete a nuestro club exclusivo y disfruta de descuentos, prioridad en reservas y seguimiento personalizado para tu bienestar continuo.',
    'seo.vip.keywords':
      'Club VIP bienestar, membresía masaje, descuentos terapia, salud exclusiva Barcelona',

    // Massage SEO
    'seo.massage.title': 'Masaje terapéutico y relajante | EKA Balance',
    'seo.massage.description':
      'Alivia tensiones y dolor muscular con nuestros masajes terapéuticos. Técnicas personalizadas para tu recuperación y descanso.',
    'seo.massage.keywords':
      'Masaje terapéutico, masaje relajante, descontracturante, dolor muscular, Barcelona',

    // Kinesiology SEO
    'seo.kinesiology.title': 'Kinesiología holística y emocional | EKA Balance',
    'seo.kinesiology.description':
      'Equilibra cuerpo y mente con kinesiología. Detecta y trata el origen de tus problemas físicos y emocionales.',
    'seo.kinesiology.keywords':
      'Kinesiología holística, test muscular, equilibrio emocional, terapia natural, Barcelona',

    // Nutrition SEO
    'seo.nutrition.title': 'Nutrición consciente y saludable | EKA Balance',
    'seo.nutrition.description':
      'Mejora tu salud con asesoramiento nutricional personalizado. Aprende a comer bien para tener más energía y vitalidad.',
    'seo.nutrition.keywords':
      'Nutrición consciente, dieta saludable, asesoramiento nutricional, energía vital, Barcelona',

    // Massage Page
    'massage.hero.badge': 'El arte del tacto curativo',
    'massage.benefits.pain': 'Alivia el dolor muscular y articular',
    'massage.benefits.circulation': 'Mejora la circulación y la movilidad',
    'massage.benefits.wellbeing': 'Bienestar inmediato y descanso real',

    // Kinesiology Page
    'kinesiology.hero.badge': 'Cuerpo, mente y emociones en equilibrio',
    'kinesiology.benefits.posture': 'Mejora la postura y la coordinación',
    'kinesiology.benefits.stress': 'Reduce el estrés y mejora el descanso',
    'kinesiology.benefits.energy': 'Más autoconocimiento y energía estable',

    // Nutrition Page
    'nutrition.benefits.habits': 'Hábitos alimentarios claros y sostenibles',
    'nutrition.benefits.weight': 'Apoyo en gestión de peso y composición corporal',
    'nutrition.benefits.prevention': 'Prevención y salud a largo plazo',
    'nutrition.session.first.name': 'Primera sesión',
    'nutrition.session.first.description': 'Valoración completa y plan personalizado',
    'nutrition.session.followup.name': 'Seguimiento',
    'nutrition.session.followup.description': 'Ajuste del plan y resolución de dudas',

    // Discounts Page
    'discounts.success': '¡Descuento aplicado con éxito!',
    'discounts.remove': 'Eliminar descuento',

    // Personalized Pages - Detailed Content
    'personalized.students.hero.title': 'Rendimiento académico',
    'personalized.students.hero.description':
      'Optimización cognitiva y regulación del estrés para estudiantes de alta exigencia.',
    'personalized.students.understanding.title': 'Análisis del contexto académico',
    'personalized.students.understanding.description1':
      'La carga cognitiva sostenida y la presión evaluativa generan desregulación nerviosa y fatiga sistémica.',
    'personalized.students.understanding.description2':
      'Implementamos protocolos para potenciar la función ejecutiva y preservar la salud durante periodos críticos.',
    'personalized.students.understanding.callToAction': 'Solicitar evaluación',
    'personalized.students.services.title': 'Protocolos académicos',
    'personalized.students.services.subtitle':
      'Intervenciones clínicas para la optimización del estudio',
    'personalized.students.services.kinesiologyStress.title': 'Neuroregulación del estrés',
    'personalized.students.services.kinesiologyStress.description':
      'Equilibrio del sistema nervioso autónomo para mitigar la ansiedad pre-examen.',
    'personalized.students.services.relaxingMassage.title': 'Masaje relajante',
    'personalized.students.services.relaxingMassage.description':
      'Libera la tensión acumulada en cuello y espalda por el estudio.',
    'personalized.students.testimonial.title': 'Lo que dicen los estudiantes',
    'personalized.students.testimonial.quote':
      '"me ayudó muchísimo a concentrarme mejor y a dormir antes de los exámenes."',
    'personalized.students.testimonial.author': 'Laura, estudiante de medicina',

    'personalized.officeWorkers.hero.title': 'Salud corporativa',
    'personalized.officeWorkers.hero.description':
      'Ergonomía clínica y gestión del estrés para el entorno ejecutivo.',
    'personalized.officeWorkers.understanding.title': 'Síndrome de la sedestación',
    'personalized.officeWorkers.understanding.description1':
      'La estática prolongada y la carga cognitiva inducen rigidez fascial y agotamiento nervioso.',
    'personalized.officeWorkers.understanding.description2':
      'Aplicamos protocolos de descompresión axial y regulación vagal para restaurar la vitalidad.',
    'personalized.officeWorkers.understanding.callToAction': 'Solicitar protocolo',
    'personalized.officeWorkers.services.title': 'Intervención clínica',
    'personalized.officeWorkers.services.subtitle': 'Recuperación funcional para ejecutivos',
    'personalized.officeWorkers.services.therapeuticMassage.title': 'Terapia manual avanzada',
    'personalized.officeWorkers.services.therapeuticMassage.description':
      'Tratamiento profundo de la musculatura antigravitatoria y cervical.',
    'personalized.officeWorkers.services.feldenkrais.title': 'Reeducación somática',
    'personalized.officeWorkers.services.feldenkrais.description':
      'Optimización de la postura sedente y la eficiencia biomecánica.',
    'personalized.artists.hero.title': 'Artistas visuales',
    'personalized.artists.hero.description':
      'Preservación funcional de la motricidad fina y ergonomía creativa',
    'personalized.artists.understanding.title': 'Desafíos clínicos',
    'personalized.artists.understanding.description1':
      'Microtraumatismos en extremidades superiores por gestos técnicos continuados.',
    'personalized.artists.understanding.description2':
      'Compromiso musculoesquelético derivado de posturas estáticas prolongadas.',
    'personalized.artists.understanding.callToAction':
      'Te ayudamos a liberar restricciones físicas que impactan en el flujo creativo.',
    'personalized.artists.services.title': 'Intervención clínica',
    'personalized.artists.services.subtitle': 'Tratamientos especializados para artistas',
    'personalized.artists.benefits.title': 'Impacto clínico',
    'personalized.artists.method.title': 'Protocolo para artistas',
    'personalized.artists.method.step1.title': 'Evaluación',
    'personalized.artists.method.step1.desc': 'Analizamos tu postura y gestos técnicos.',
    'personalized.artists.method.step2.title': 'Tratamiento',
    'personalized.artists.method.step2.desc': 'Terapia manual para liberar tensiones y dolor.',
    'personalized.artists.method.step3.title': 'Prevención',
    'personalized.artists.method.step3.desc':
      'Ejercicios y pautas para mantener la salud mientras creas.',
    'personalized.artists.benefits.benefit1':
      'Sostenibilidad de la práctica artística y libertad de movimiento.',
    'personalized.artists.benefits.benefit2': 'Reducción del dolor y la tensión muscular.',
    'personalized.artists.benefits.benefit3': 'Mayor conciencia corporal y postural.',

    'personalized.officeWorkers.testimonial.title': 'Testimonio',
    'personalized.officeWorkers.testimonial.quote':
      '"desde que voy a EKA Balance, mi dolor de espalda ha desaparecido."',
    'personalized.officeWorkers.testimonial.author': 'Carlos, programador',

    'personalized.musicians.hero.title': 'Medicina del músico',
    'personalized.musicians.hero.description':
      'Prevención de lesiones y optimización del gesto técnico instrumental.',
    'personalized.musicians.understanding.title': 'Biomecánica instrumental',
    'personalized.musicians.understanding.description1':
      'La repetición motriz y la asimetría postural comprometen la integridad musculoesquelética.',
    'personalized.musicians.understanding.description2':
      'Restauramos la función neuromuscular para garantizar la longevidad artística y la precisión.',
    'personalized.musicians.understanding.callToAction': 'Evaluación clínica',
    'personalized.musicians.services.title': 'Protocolos específicos',
    'personalized.musicians.services.subtitle': 'Alta especialización en artes escénicas',
    'personalized.musicians.services.feldenkraisExpression.title': 'Integración funcional',
    'personalized.musicians.services.feldenkraisExpression.description':
      'Refinamiento de la propiocepción y la economía del movimiento.',
    'personalized.musicians.services.kinesiologyPerformance.title': 'Neuroregulación escénica',
    'personalized.musicians.services.kinesiologyPerformance.description':
      'Control del sistema nervioso autónomo para la ejecución bajo presión.',
    'personalized.musicians.testimonial.title': 'Opinión de músico',
    'personalized.musicians.testimonial.quote':
      '"he ganado mucha libertad de movimiento al tocar el violín."',
    'personalized.musicians.testimonial.author': 'Ana, violinista',

    'personalized.athletes.hero.title': 'Alto rendimiento',
    'personalized.athletes.hero.description':
      'Recuperación tisular y potenciación biomecánica para el atleta.',
    'personalized.athletes.understanding.title': 'Fisiología del esfuerzo',
    'personalized.athletes.understanding.description1':
      'La carga alostática del entrenamiento requiere estrategias avanzadas de regeneración.',
    'personalized.athletes.understanding.description2':
      'Implementamos protocolos de descarga y alineación para maximizar la eficiencia motriz.',
    'personalized.athletes.understanding.callToAction': 'Optimizar rendimiento',
    'personalized.athletes.services.title': 'Intervención deportiva',
    'personalized.athletes.services.subtitle': 'Tecnología manual aplicada al deporte',
    'personalized.athletes.services.sportsMassage.title': 'Descarga muscular',
    'personalized.athletes.services.sportsMassage.description':
      'Terapia profunda para la eliminación de metabolitos y adherencias.',
    'personalized.athletes.services.osteobalance.title': 'Alineación estructural',
    'personalized.athletes.services.osteobalance.description':
      'Corrección de disfunciones articulares para la eficiencia biomecánica.',
    'personalized.athletes.testimonial.title': 'Experiencia de atleta',
    'personalized.athletes.testimonial.quote':
      '"mis tiempos de recuperación han mejorado notablemente."',
    'personalized.athletes.testimonial.author': 'Marc, corredor',

    'personalized.parents.hero.title': 'Salud familiar',
    'personalized.parents.hero.description':
      'Restauración de la vitalidad y regulación del sistema nervioso.',
    'personalized.parents.understanding.title': 'Sostenibilidad del cuidador',
    'personalized.parents.understanding.description1':
      'La demanda física y emocional de la crianza impacta en la reserva adaptativa del organismo.',
    'personalized.parents.understanding.description2':
      'Ofrecemos un espacio clínico de contención y regeneración para prevenir el agotamiento.',
    'personalized.parents.understanding.callToAction': 'Restaurar vitalidad',
    'personalized.parents.services.title': 'Protocolos de bienestar',
    'personalized.parents.services.subtitle': 'Apoyo integral a la crianza',
    'personalized.parents.services.emotionalKinesiology.title': 'Regulación emocional',
    'personalized.parents.services.emotionalKinesiology.description':
      'Procesamiento del estrés parental y equilibrio neuroafectivo.',
    'personalized.parents.services.relaxingMassage.title': 'Terapia sedativa',
    'personalized.parents.services.relaxingMassage.description':
      'Inducción profunda al estado parasimpático para el descanso reparador.',
    'personalized.parents.testimonial.title': 'Testimonio de madre',
    'personalized.parents.testimonial.quote':
      '"es mi momento sagrado de la semana. Salgo renovada."',
    'personalized.parents.testimonial.author': 'Sofia, madre de dos',

    // Contact Page
    'contact.hero.badge': 'Estamos aquí para ti',
    'contact.hero.title': 'Contacta',
    'contact.hero.titleHighlight': 'con nosotros',
    'contact.hero.description':
      'Estamos aquí para ayudarte en tu camino hacia el bienestar. Contáctanos para reservas, consultas o cualquier duda sobre nuestros servicios.',
    'contact.whatsapp': 'WhatsApp +34 658 867 133',
    'contact.callNow': 'Llamar ahora',
    'contact.faq.title': 'Preguntas frecuentes',
    'contact.faq.subtitle': 'Todo lo que necesitas saber sobre cómo contactarnos',
    'contact.faq.q1.title': '¿Cómo puedo reservar una cita?',
    'contact.faq.q1.answer':
      'Puedes reservar cita escribiendo por WhatsApp o Telegram al +34 658 867 133, llamándonos al mismo número o enviándonos un email.',
    'contact.faq.q2.title': '¿Cuál es la política de cancelación?',
    'contact.faq.q2.answer':
      'Se pueden realizar cancelaciones gratuitas hasta 24 horas antes de la cita. Los usuarios VIP pueden cancelar hasta 12 horas antes.',
    'contact.faq.q3.title': '¿Ofrecéis descuentos o planes VIP?',
    'contact.faq.q3.answer':
      'Sí, disponemos de planes VIP con descuentos de hasta el 25% y beneficios exclusivos como reservas prioritarias y consultas telefónicas gratuitas.',
    'contact.faq.q4.title': '¿Qué debo llevar a la primera sesión?',
    'contact.faq.q4.answer':
      'Trae ropa cómoda, cualquier informe médico relevante y una lista de medicamentos que estés tomando actualmente. Nosotros proporcionamos las toallas.',

    'personalizedServices.business': 'Para Empresas',
    'personalizedServices.business.desc':
      'Programas de bienestar corporativo, clases grupales y consultoría.',
    'personalizedServices.business.benefit1': 'Reduce el estrés del equipo',
    'personalizedServices.business.benefit2': 'Mejora la postura y salud',
    'personalizedServices.business.benefit3': 'Mejora el ambiente de trabajo',
    'personalized.business.hero.title': 'Bienestar para tu empresa',
    'personalized.business.hero.description':
      'Cuidamos de la salud de tu equipo con programas a medida: desde masajes en la oficina hasta clases de postura. Porque trabajar no debería doler.',
    'personalized.business.bento.title': 'Bienestar corporativo bellamente diseñado',
    'personalized.business.bento.subtitle':
      'Empodera a tu equipo con un espacio y práctica dedicados a restaurar el enfoque y cultivar la resiliencia.',
    'personalized.business.bento.box1.title': 'Cohesión de Equipo',
    'personalized.business.bento.box1.desc':
      'Construye conexiones más fuertes mediante experiencias físicas compartidas y movimiento consciente.',
    'personalized.business.bento.box2.title': 'Mayor Productividad',
    'personalized.business.bento.box2.desc':
      'Mentes claras llevan a mejores decisiones. Corregir la postura reduce la fatiga y mejora el rendimiento.',
    'personalized.business.bento.box3.title': 'Retención del Enfoque',
    'personalized.business.bento.box3.desc':
      'Fomenta la concentración y reduce el estrés mediante técnicas de relajación profunda.',
    'personalized.business.bento.box4.title': 'Entorno Holístico',
    'personalized.business.bento.box4.desc':
      'Diseñamos entornos y rutinas que promueven la vitalidad física y la claridad mental en la oficina.',

    'personalized.business.plans.title': 'Planes Corporativos',
    'personalized.business.plans.subtitle':
      'Soluciones adaptadas al tamaño y necesidades de tu equipo',

    'personalized.business.plans.starter.name': 'Plan Team',
    'personalized.business.plans.starter.desc':
      'Ideal para equipos pequeños que buscan introducir el bienestar.',
    'personalized.business.plans.starter.price': 'A medida',
    'personalized.business.plans.starter.feat1': '1 sesión grupal al mes',
    'personalized.business.plans.starter.feat2': 'Evaluación ergonómica básica',
    'personalized.business.plans.starter.feat3': 'Acceso a rutinas digitales',

    'personalized.business.plans.pro.name': 'Plan Office',
    'personalized.business.plans.pro.desc':
      'La solución completa para oficinas que buscan resultados constantes.',
    'personalized.business.plans.pro.price': 'A medida',
    'personalized.business.plans.pro.feat1': 'Sesiones grupales semanales',
    'personalized.business.plans.pro.feat2': 'Masajes en la oficina (2 días/mes)',
    'personalized.business.plans.pro.feat3': 'Seguimiento personalizado',

    'personalized.business.plans.enterprise.name': 'Plan Enterprise',
    'personalized.business.plans.enterprise.desc': 'Programa integral de salud.',
    'personalized.business.plans.enterprise.price': 'A consultar',
    'personalized.business.plans.enterprise.feat1': 'Terapeutas dedicados in-site',
    'personalized.business.plans.enterprise.feat2': 'Talleres y formaciones mensuales',
    'personalized.business.plans.enterprise.feat3': 'Métricas de bienestar e informes',
    'personalized.business.understanding.title': 'Un equipo sano es un equipo feliz',
    'personalized.business.understanding.description1':
      'Las largas horas de oficina pueden causar tensión y agotamiento. Nosotros ayudamos a recuperar la energía y reducir el estrés.',
    'personalized.business.understanding.description2':
      'Ya sea mediante consultoría o sesiones semanales, nos adaptamos completamente a los tiempos de tu empresa.',
    'personalized.business.understanding.callToAction':
      'Hablemos y diseñemos un plan real para tu equipo.',
    'personalized.business.services.title': 'Servicios Corporativos',
    'personalized.business.services.subtitle':
      'Opciones para mejorar la salud de los tuyos en el trabajo',
    'personalized.business.services.groupClasses.title': 'Clases Grupales y Estiramientos',
    'personalized.business.services.groupClasses.description':
      'Sesiones amenas de postura o estiramientos para destensar el cuello y la espalda, en la oficina o por videollamada.',
    'personalized.business.services.consulting.title': 'Consultoría y Cuidado en la Oficina',
    'personalized.business.services.consulting.description':
      'Evaluamos cómo trabaja tu equipo y les enseñamos a cuidar su descanso. Además, podemos llevar las terapias manuales a tu oficina.',
    'personalized.business.faq.q1': '¿Adaptáis los horarios a la jornada?',
    'personalized.business.faq.a1':
      'Sí, sabemos que el tiempo es oro. Diseñamos nuestras intervenciones para no interrumpir el flujo de trabajo.',
    'personalized.business.faq.q2': '¿Se desplazan a la oficina?',
    'personalized.business.faq.a2':
      'Exacto, en la mayoría de zonas urbanas, nuestro equipo va directo a vuestras instalaciones.',
    'personalized.business.faq.q3': '¿Cuáles son los precios?',
    'personalized.business.faq.a3':
      'Depende de las personas y la frecuencia. Contáctanos y te armaremos un presupuesto sin compromiso.',
    'personalized.business.benefit1':
      'Reduce los niveles de estrés del equipo y previene el agotamiento de manera proactiva.',
    'personalized.business.benefit2':
      'Mejora la postura en el escritorio y alivia eficazmente el dolor de espalda crónico.',
    'personalized.business.benefit3':
      'Fomenta una cultura de empresa más fuerte, conectada y saludable.',
    'personalized.business.benefit4':
      'Aumenta significativamente la concentración diaria, la energía y la productividad general.',

    // Booking Page Help Section
    'booking.help.title': '¿Necesitas ayuda con la reserva?',
    'booking.help.contactDirect': 'Contáctanos directamente',
    'booking.help.email': '📧 contact@ekabalance.com',
    'booking.help.address': '📍 Carrer Pelai, 12, 08001 Barcelona',
    'booking.help.hours': 'Horario de atención',
    'booking.help.hours.weekdays': 'Lunes - viernes: 9:00 - 20:00',
    'booking.help.hours.saturday': 'Sábado: 9:00 - 14:00',
    'booking.help.hours.sunday': 'Domingo: cerrado',
    'booking.help.footer':
      'Si tienes alguna duda sobre nuestros servicios o necesitas ayuda con la reserva, no dudes en contactarnos. Estamos aquí para ayudarte.',
    'booking.whatsapp.availability': 'Disponibilidad: {availability} – {timeslot}',
    'booking.whatsapp.thanks': '¡Gracias!',

    // Common
    'common.askQuestions': 'Hacer preguntas',
    'common.recommended': 'Recomendado',
    'common.continue': 'Continuar',
    'common.disclaimer':
      'Los servicios de EKA Balance son de acompañamiento y bienestar, no sustituyen el tratamiento médico.',

    // VIP Section
    'vip.plan.bronze': 'Membresía bronce',
    'vip.plan.bronze.description': 'Mantenimiento esencial para una vida equilibrada',
    'vip.plan.bronze.price': '150€',
    'vip.plan.silver': 'Membresía plata',
    'vip.plan.silver.description': 'Bienestar mensual completo y prioridad',
    'vip.plan.silver.price': '280€',
    'vip.plan.gold': 'Membresía oro',
    'vip.plan.gold.description': 'La transformación definitiva y exclusividad total',
    'vip.plan.gold.price': '500€',

    'vip.service.priority.title': 'Acceso prioritario',
    'vip.service.priority.description':
      'Sin esperas. Tu agenda es nuestra prioridad, con franjas exclusivas reservadas solo para ti.',
    'vip.service.displacements.title': 'Visitas concierge a domicilio',
    'vip.service.displacements.description':
      'Llevamos el santuario a tu hogar. Ahorra tiempo y disfruta de tratamientos de clase mundial en tu privacidad.',
    'vip.service.health.title': 'Monitorización proactiva de salud',
    'vip.service.health.description':
      'No solo tratamos; hacemos seguimiento. Evaluaciones regulares aseguran que tu salud física siempre progrese.',
    'vip.service.family.title': 'Privilegios familiares',
    'vip.service.family.description':
      'Extiende tu cuidado. Comparte tus créditos de sesión y beneficios con tu familia inmediata.',

    'vip.benefits.transferable': 'Créditos compartibles',
    'vip.benefits.transferableDesc': 'Regala bienestar a tu familia',
    'vip.benefits.monthly': 'Auditoría de salud mensual',
    'vip.benefits.monthlyDesc': 'Enfoque preventivo',
    'vip.benefits.barcelona': 'Exclusivo Barcelona',
    'vip.benefits.barcelonaDesc': 'Disponibilidad en el centro',
    'vip.benefits.sessions': 'Sesiones de duración extendida',

    'vip.stats.concierge': 'Concierge personal',
    'vip.stats.exclusivity': 'Solo miembros',
    'vip.stats.clients': 'Clientela de élite',
    'vip.stats.possibilities': 'Potencial ilimitado',
    'vip.stats.control': 'Maestría en salud',
    'vip.stats.family': 'Inclusión familiar',

    'vip.mostExclusive': 'La cima del cuidado',
    'vip.experienceDescription':
      'Diseñado para aquellos que se niegan a comprometer su salud. Experimenta el bienestar sin límites.',
    'vip.voicesOfExcellence': 'Voces de la élite',
    'vip.testimonialsSubtitle': 'Escucha a quienes han elevado sus vidas con nosotros.',
    'vip.tier.standard': 'Miembro estándar',

    'vip.testimonials.comment1':
      'La mejor inversión que he hecho para mi rendimiento. El servicio prioritario cambia las reglas del juego para mi agenda ocupada.',
    'vip.testimonials.comment2':
      'Profesionalidad en su máxima expresión. Elena entiende mi cuerpo mejor que yo. Una experiencia verdaderamente a medida.',
    'vip.testimonials.comment3':
      'Me siento renovado después de cada sesión. La atención al detalle es inigualable en Barcelona.',

    'vip.hero.badge': 'Ultra premium',
    'vip.hero.title.beyond': 'Más allá',
    'vip.hero.title.wellness': 'Del bienestar',
    'vip.hero.subtitle':
      'Entra en un reino donde tu salud es nuestro único foco. Atención inigualable, acceso prioritario y tratamientos a medida diseñados para unos pocos.',
    'vip.hero.cta.join': 'Solicitar membresía',

    'vip.dashboard.member': 'Salón de miembros',
    'vip.dashboard.hello': 'Bienvenido de nuevo,',
    'vip.dashboard.status': 'Nivel de membresía:',
    'vip.dashboard.priorityBooking': 'Reservar sesión prioritaria',
    'vip.dashboard.viewPlans': 'Mejorar membresía',

    'vip.features.badge': 'Excelencia',
    'vip.features.title': 'Curado para la élite',
    'vip.features.subtitle':
      'Cada detalle está orquestado para proporcionar una experiencia que trasciende la terapia tradicional.',

    'vip.plans.badge': 'Membresía',
    'vip.plans.title': 'Selecciona tu legado',
    'vip.plans.subtitle': 'Elige el nivel de exclusividad que coincida con tu ambición.',
    'vip.plans.popular': 'Más popular',
    'vip.plans.perMonth': '/ Mes',
    'vip.plans.sessions': 'Sesiones incluidas',
    'vip.plans.contact': 'Consultar ahora',
    'vip.table.title': 'Comparación de membresías',
    'vip.table.sessions': 'Sesiones incluidas',

    'vip.exclusivePrivileges': 'Privilegios de miembro',
    'vip.testimonials.title': 'Experiencias de élite',
    'vip.testimonials.subtitle': 'Historias de quienes exigen lo mejor.',
    'vip.testimonials.role1': 'Ceo, innovador tecnológico',
    'vip.testimonials.role2': 'Cirujano cardiovascular',
    'vip.testimonials.role3': 'Emprendedor internacional',
    'vip.cta.badge': 'Únete al círculo interior',
    'vip.cta.title': 'Eleva tu vida',
    'vip.cta.subtitle': 'Tu viaje hacia el máximo rendimiento y bienestar profundo comienza aquí.',
    'vip.whatsapp.message':
      'Hola, estoy interesado en la membresía VIP {plan}. Me gustaría solicitarla.',
    'vip.whatsapp.messageGeneral':
      'Hola, estoy interesado en el círculo interior VIP. Me gustaría saber más.',
    'vip.cta.location': 'Ubicación prime',
    'vip.cta.concierge': 'Concierge dedicado',
    'vip.cta.guarantee': 'Satisfacción garantizada',

    // Discovery Form
    // Discovery Form - User Types
    'discovery.userTypes.mother.title': 'Crianza y cuidado',
    'discovery.userTypes.mother.desc':
      'Necesito recargar mi energía para poder seguir cuidando a los demás.',
    'discovery.userTypes.woman.title': 'Salud femenina',
    'discovery.userTypes.woman.desc':
      'Quiero reconectar con mi cuerpo, mis ciclos y mi vitalidad femenina.',
    'discovery.userTypes.regular.title': 'Bienestar general',
    'discovery.userTypes.regular.desc': 'Busco relajación, equilibrio y un momento para mí.',
    'discovery.userTypes.office.title': 'Profesional de oficina',
    'discovery.userTypes.office.desc': 'Paso horas sentado y siento cómo se acumula la tensión.',
    'discovery.userTypes.athlete.title': 'Atleta / activo',
    'discovery.userTypes.athlete.desc':
      'Quiero optimizar mi rendimiento y acelerar la recuperación.',

    // Discovery Form - Emotional States
    'discovery.emotional.stressed.title': 'Abrumado / ansioso',
    'discovery.emotional.stressed.desc': 'Mi mente no para y me cuesta relajarme.',
    'discovery.emotional.sad.title': 'Bajo de ánimo / apático',
    'discovery.emotional.sad.desc': 'Me siento pesado o desmotivado y quiero un cambio.',
    'discovery.emotional.balanced.title': 'Equilibrado / neutral',
    'discovery.emotional.balanced.desc':
      'Me siento bien emocionalmente, solo necesito cuidado físico.',
    'discovery.emotional.focus_physical.title': 'Enfoque en lo físico',
    'discovery.emotional.focus_physical.desc': 'No estoy seguro, tratemos solo el cuerpo.',

    // Discovery Form - Time Commitments
    'discovery.time.short.title': 'Sesión exprés (hasta 1h)',
    'discovery.time.short.desc': 'Perfecto para un reinicio rápido.',
    'discovery.time.standard.title': 'Sesión estándar (1-1.5h)',
    'discovery.time.standard.desc': 'El tiempo ideal para un trabajo profundo.',
    'discovery.time.long.title': 'Inmersión profunda (hasta 2h)',
    'discovery.time.long.desc': 'Para un cuidado integral y transformador.',

    // Discovery Form - Budget
    'discovery.budget.basic.title': 'Esencial (hasta 60€)',
    'discovery.budget.basic.desc': 'Enfocado y efectivo.',
    'discovery.budget.standard.title': 'Estándar (60€ - 75€)',
    'discovery.budget.standard.desc': 'Experiencia terapéutica completa.',
    'discovery.budget.premium.title': 'Premium (75€+)',
    'discovery.budget.premium.desc': 'Cuidado extendido y todo incluido.',

    // Discovery Form - Recommendations
    'discovery.recommendation.emotional.service': 'Reequilibrio emocional',
    'discovery.recommendation.emotional.desc':
      'Un enfoque holístico para calmar el estrés, la ansiedad o la pesadez. Nos enfocamos en liberar la carga emocional para restaurar tu armonía interior y alegría.',
    'discovery.recommendation.emotional.benefit1': 'Alivio profundo del estrés',
    'discovery.recommendation.emotional.benefit2': 'Claridad emocional',
    'discovery.recommendation.emotional.benefit3': 'Calma del sistema nervioso',
    'discovery.recommendation.emotional.benefit4': 'Paz interior renovada',

    'discovery.recommendation.manual.service': 'Trabajo corporal terapéutico',
    'discovery.recommendation.manual.desc':
      'Alivio dirigido para el dolor y la tensión muscular. Utilizamos técnicas precisas para disolver nudos y restaurar tu libertad de movimiento.',
    'discovery.recommendation.manual.benefit1': 'Alivio inmediato del dolor',
    'discovery.recommendation.manual.benefit2': 'Liberación de tensión muscular',
    'discovery.recommendation.manual.benefit3': 'Movilidad mejorada',
    'discovery.recommendation.manual.benefit4': 'Ligereza física',

    'discovery.recommendation.integrative.service': 'Alivio de tensión integrativo (4 en 1)',
    'discovery.recommendation.integrative.desc':
      'Nuestra mezcla exclusiva de masaje, kinesiología, osteopatía y movimiento somático (Feldenkrais). La solución definitiva para problemas crónicos.',
    'discovery.recommendation.integrative.benefit1': 'Tratamiento holístico',
    'discovery.recommendation.integrative.benefit2': 'Resolución de causa raíz',
    'discovery.recommendation.integrative.benefit3': 'Sinergia multi-técnica',
    'discovery.recommendation.integrative.benefit4': 'Resultados duraderos',

    'discovery.recommendation.relax.service': 'Masaje de relajación profunda',
    'discovery.recommendation.relax.desc':
      'Un santuario para tus sentidos. Ideal si tu objetivo es desconectar del mundo y recargar tus baterías completamente.',
    'discovery.recommendation.relax.benefit1': 'Relajación profunda',
    'discovery.recommendation.relax.benefit2': 'Quietud mental',
    'discovery.recommendation.relax.benefit3': 'Restauración de energía',
    'discovery.recommendation.relax.benefit4': 'Bienestar total',

    // Online Rec
    'discovery.recommendation.online.service': 'Consulta y orientación online',
    'discovery.recommendation.online.desc':
      'Apoyo experto, estés donde estés. Perfecto para seguimientos, planificación nutricional u orientación somática desde casa.',
    'discovery.recommendation.online.benefit1': 'Comodidad del hogar',
    'discovery.recommendation.online.benefit2': 'Horario flexible',
    'discovery.recommendation.online.benefit3': 'Apoyo continuo',
    'discovery.recommendation.online.benefit4': 'Plan de acción en pdf',

    'discovery.recommendation.title': 'Tu camino personalizado',
    'discovery.recommendation.badge': 'A medida para ti',
    'discovery.recommendation.subtitle': 'Basado en tu perfil único, recomendamos:',
    'discovery.recommendation.why': 'Por qué esto es para ti',
    'discovery.analysis.intro': 'Notamos que',
    'discovery.analysis.have': 'Estás experimentando',
    'discovery.analysis.want': 'Y tu objetivo es',
    'discovery.analysis.feel': 'Sentirte',
    'discovery.diagnosis.title': 'Evaluación profesional',
    'discovery.diagnosis.profile': 'Tu perfil',
    'discovery.diagnosis.symptoms': 'Indicadores clave',
    'discovery.diagnosis.rootCause': 'Posibles causas raíz',
    'discovery.diagnosis.strategy': 'Nuestra estrategia',
    'discovery.diagnosis.frequency': 'Frecuencia recomendada',
    'discovery.view.basic': 'Vista simple',
    'discovery.view.advanced': 'Evaluación detallada',
    'discovery.diagnosis.cause.posture': 'Fatiga postural (tensión sedentaria)',
    'discovery.diagnosis.cause.overload': 'Sobrecarga muscular',
    'discovery.diagnosis.cause.stress': 'Tensión psicosomática',
    'discovery.diagnosis.cause.emotional': 'Bloqueo emocional',
    'discovery.diagnosis.cause.metabolic': 'Desequilibrio metabólico/digestivo',
    'discovery.diagnosis.cause.structural': 'Desalineación estructural/mecánica',
    'discovery.diagnosis.cause.general': 'Necesidad de mantenimiento/prevención',
    'discovery.diagnosis.strategy.structural': 'Liberación estructural y trabajo de movilidad',
    'discovery.diagnosis.strategy.regulation': 'Regulación del sistema nervioso',
    'discovery.diagnosis.strategy.rebalance': 'Reequilibrio mente-cuerpo',
    'discovery.diagnosis.freq.high': 'Intensivo (semanal por 3 semanas)',
    'discovery.diagnosis.freq.medium': 'Mantenimiento (cada 2-3 semanas)',
    'discovery.diagnosis.freq.low': 'Preventivo (mensual)',
    'discovery.goal.athlete': 'Recuperación atlética máxima',
    'discovery.goal.office': 'Corrección postural',
    'discovery.goal.stress': 'Paz mental profunda',
    'discovery.goal.pain': 'Confort físico',
    'discovery.goal.general': 'Vitalidad general',
    'discovery.feeling.relaxed': 'Relajado',
    'discovery.feeling.energized': 'Energizado',
    'discovery.feeling.balanced': 'Equilibrado',
    'discovery.feeling.painfree': 'Sin dolor',
    'discovery.recommendation.book': 'Reservar esta sesión',
    'discovery.recommendation.restart': 'Empezar de nuevo',

    // Discovery Form - Steps
    'discovery.step1.title': 'Cuéntanos sobre ti',
    'discovery.step1.subtitle': 'Elige la opción que más resuene contigo',
    'discovery.step2.title': '¿Dónde acumulas tensión?',
    'discovery.step2.subtitle': 'Selecciona todas las que apliquen',
    'discovery.step3.title': '¿Alguna condición específica?',
    'discovery.step3.subtitle': 'Ayúdanos a adaptar la sesión a tu seguridad',
    'discovery.step4.title': '¿Cómo te sientes emocionalmente?',
    'discovery.step4.subtitle': 'El bienestar emocional es clave para la salud física',
    'discovery.step5.title': '¿De cuánto tiempo dispones?',
    'discovery.step5.subtitle': 'Adaptamos la sesión a tu horario',
    'discovery.step6.title': '¿Cuál es tu presupuesto?',
    'discovery.step6.subtitle': 'Encontraremos la mejor opción para ti',
    'discovery.next': 'Siguiente',
    'discovery.back': 'Atrás',
    'discovery.seeRecommendation': 'Ver recomendación',
    'common.step': 'Paso',
    'common.of': 'De',

    // Office Workers SEO
    'office.seo.title': 'Servicios para trabajadores de oficina - EKA Balance Barcelona',
    'office.seo.desc':
      'Terapias especializadas para oficinistas: alivia la tensión, mejora la postura y gestiona el estrés laboral. Sesiones de 1.5h por 60€.',
    'office.seo.keywords':
      'Masaje oficina Barcelona, estrés laboral, dolor de espalda ordenador, kinesiología trabajadores',

    // Athletes SEO
    'athletes.seo.title': 'Servicios para deportistas - EKA Balance Barcelona',
    'athletes.seo.desc':
      'Terapias especializadas para atletas: recuperación muscular, mejora de flexibilidad y gestión del estrés pre-competición. Sesiones de 1.5h por 60€.',
    'athletes.seo.keywords':
      'Masaje deportivo Barcelona, recuperación muscular, flexibilidad deportiva, estrés competición',

    // Artists SEO
    'artists.seo.title': 'Servicios para artistas - EKA Balance Barcelona',
    'artists.seo.desc':
      'Terapias para artistas visuales y creadores: cuidado de manos, mejora postural y desbloqueo creativo. Sesiones de 1.5h por 60€.',
    'artists.seo.keywords':
      'Masaje artistas Barcelona, dolor manos artistas, postura creativa, bloqueo creativo',

    // Musicians SEO
    'musicians.seo.title': 'Servicios para músicos - EKA Balance Barcelona',
    'musicians.seo.desc':
      'Terapias especializadas para músicos: prevención de lesiones, mejora técnica y gestión de ansiedad escénica. Sesiones de 1.5h por 60€.',
    'musicians.seo.keywords':
      'Fisioterapia músicos Barcelona, lesiones músicos, ansiedad escénica, técnica musical',

    // Students SEO
    'students.seo.title': 'Servicios para estudiantes - EKA Balance Barcelona',
    'students.seo.desc':
      'Terapias para estudiantes: gestión de estrés de exámenes, mejora de concentración y corrección postural. Sesiones de 1.5h por 60€.',
    'students.seo.keywords':
      'Estrés exámenes Barcelona, concentración estudio, postura estudiante, ansiedad académica',

    'office.problems.pain.title': 'Dolor postural',
    'office.problems.pain.desc':
      'Dolor en cuello, hombros y espalda debido a posturas incorrectas frente al ordenador',
    'office.problems.stress.title': 'Estrés laboral',
    'office.problems.stress.desc':
      'Presión constante, plazos y exceso de responsabilidades que afectan al bienestar',
    'office.problems.sedentary.title': 'Sedentarismo',
    'office.problems.sedentary.desc':
      'Pérdida de movilidad y flexibilidad por pasar demasiadas horas sentado',
    'office.benefits.techniques.title': 'Técnicas específicas',
    'office.benefits.techniques.desc':
      'Técnicas específicas para descontracturar zonas afectadas por el trabajo de oficina',
    'office.benefits.exercises.title': 'Corrección postural',
    'office.benefits.exercises.desc':
      'Ejercicios y correcciones posturales para prevenir futuros problemas',
    'office.benefits.mindfulness.title': 'Gestión del estrés',
    'office.benefits.mindfulness.desc':
      'Técnicas de relajación y mindfulness adaptadas al entorno profesional',

    // First Time Visitor Form
    'firstTime.seo.title': '¿No sabes qué elegir? - Encuentra tu servicio ideal en EKA Balance',
    'firstTime.seo.desc':
      'Sistema inteligente personalizado para descubrir la terapia holística perfecta para tus necesidades específicas. Recomendaciones empáticas basadas en quién eres y qué buscas.',
    'firstTime.seo.keywords':
      'No sé qué elegir, formulario personalizado, recomendaciones terapia, servicio ideal, Barcelona, onboarding inteligente',

    // Casos details (partial)
    'casos.problems.backPain.symptom1': 'Dolor punzante, rigidez o tensión constante.',
    'casos.problems.backPain.symptom2': 'Limitación de movimiento.',
    'casos.problems.backPain.symptom3': 'Fatiga postural.',
    'casos.problems.backPain.symptom4': 'Sensación de pesadez.',
    'casos.problems.backPain.cause1': 'Posturas mantenidas y ergonomía deficiente.',
    'casos.problems.backPain.cause2': 'Carga emocional somatizada.',
    'casos.problems.backPain.cause3': 'Sedentarismo.',

    // Onboarding
    'onboarding.questions.userType.title': '¿Cómo te defines?',
    'onboarding.userTypes.student': 'Estudiante',
    'onboarding.userTypes.office': 'Oficina / ejecutivo',
    'onboarding.userTypes.artist': 'Artista / creativo',
    'onboarding.userTypes.musician': 'Músico',
    'onboarding.userTypes.athlete': 'Deportista',
    'onboarding.userTypes.parent': 'Padre / madre',
    'onboarding.userTypes.entrepreneur': 'Emprendedor',
    'onboarding.userTypes.therapist': 'Terapeuta',
    'onboarding.userTypes.senior': 'Senior',
    'onboarding.userTypes.other': 'Otro',
    'onboarding.questions.goals.title': '¿Cuál es tu objetivo principal?',
    'onboarding.goals.stress': 'Estrés y ansiedad',
    'onboarding.goals.pain': 'Dolor o molestias',
    'onboarding.goals.posture': 'Mejorar postura',
    'onboarding.goals.sleep': 'Dormir mejor',
    'onboarding.goals.energy': 'Más energía',
    'onboarding.goals.focus': 'Enfoque mental',
    'onboarding.goals.bodyAwareness': 'Conciencia corporal',
    'onboarding.goals.feelGood': 'Sentirme bien',
    'onboarding.questions.preferredFeeling.title': '¿Cómo quieres sentirte?',
    'onboarding.feelings.calm': 'Calmado/a',
    'onboarding.feelings.light': 'Ligero/a',
    'onboarding.feelings.energized': 'Con energía',
    'onboarding.feelings.focused': 'Enfocado/a',
    'onboarding.feelings.confident': 'Seguro/a',
    'onboarding.questions.approach.title': '¿Qué enfoque prefieres?',
    'onboarding.approaches.massage': 'Masaje / manual',
    'onboarding.approaches.kinesiology': 'Kinesiología / test',
    'onboarding.approaches.feldenkrais': 'Movimiento / Feldenkrais',
    'onboarding.approaches.energy': 'Energético',
    'onboarding.approaches.open': 'Abierto a sugerencias',
    'onboarding.questions.timePreference.title': 'Duración preferida',
    'onboarding.time.60min': '1.5h',
    'onboarding.time.90min': '90 minutos',
    'onboarding.time.120min': '120 minutos',

    // Recommendations
    'recommendations.massage.description':
      'Terapia manual para liberar tensión y restaurar la estructura.',
    'recommendations.kinesiology.description':
      'Equilibrio del sistema nervioso y emocional mediante test muscular.',
    'recommendations.feldenkrais.description':
      'Reeducación del movimiento para una vida sin dolor.',

    // VIP (missing)
    'vip.plan.platinum': 'Platino VIP',
    'vip.plan.bronze.desc': 'Entrada al mundo VIP',
    'vip.plan.silver.desc': 'Perfecto para profesionales',
    'vip.plan.gold.desc': 'La experiencia VIP definitiva',
    'vip.plan.platinum.desc': 'Acceso élite exclusivo',
    'vip.feature.priority': 'Acceso prioritario',
    'vip.feature.extended': 'Sesiones extendidas',
    'vip.feature.support': 'Soporte 24/7',
    'vip.feature.events': 'Eventos exclusivos',
    'vip.feature.home': 'Servicio a domicilio',
    'vip.feature.all': 'Todos los beneficios',
    'vip.feature.gift': 'Sesión de regalo',
    'vip.feature.consultation': 'Consulta trimestral',
    'vip.feature.kit': 'Kit premium',
    'vip.feature.concierge': 'Gestor personal',
    'vip.feature.retreat': 'Descuento en retiros',

    // Missing Keys Patch
    'hero.firstTime': '¿Primera vez?',
    'hero.dontKnowWhatToChoose': '¿No sabes qué elegir?',
    'hero.discoverServices': 'Descubre los servicios',
    'hero.stats.sessions': 'Sesiones realizadas',
    'hero.stats.countries': 'Países impactados',

    'footer.address': 'Calle de pelai',
    'footer.email': 'contact@ekabalance.com',
    'footer.copyright': '© 2024 EKA Balance. Todos los derechos reservados.',
    'footer.selectLanguage': 'Selecciona idioma',
    'footer.discounts': 'Descuentos de verano',

    'language.popup.title': 'Bienvenido a EKA Balance',
    'language.popup.subtitle': 'Por favor, selecciona tu idioma preferido',
    'cookies.wrongLanguage': 'Parece que estás en un idioma diferente al de tu navegador.',

    'stats.sessions': 'Sesiones',
    'stats.clients': 'Clientes',
    'stats.experience': 'Experiencia',
    'stats.rating': 'Valoración',
    'stats.countries': 'Países',
    'stats.cases': 'Casos resueltos',
    'stats.response': 'Respuesta rápida',

    // Casos & Problems
    'casos.hero.badge': 'Historias reales',
    'casos.title': 'Casos reales',
    'casos.subtitle': 'Historias de éxito',
    'casos.description': 'Descubre cómo hemos ayudado a otros.',
    'casos.frequentCases': 'Casos frecuentes',
    'casos.frequentCasesSubtitle': 'Patologías comunes',
    'casos.otherCases': 'Otros casos',
    'casos.otherCasesSubtitle': 'Otras áreas',
    'casos.ctaTitle': '¿Tienes un caso similar?',
    'casos.ctaSubtitle': 'Habla con nosotros',
    'casos.discoverIdeal': 'Descubre el tratamiento',
    'casos.bookSession': 'Reservar sesión',
    'casos.seeDetails': 'Ver detalles',
    'casos.section.badge': 'Casos clínicos',
    'casos.section.title': 'Identificación de patologías',
    'casos.section.titleHighlight': 'y soluciones',
    'casos.section.subtitle': 'Resolución de problemas complejos',
    'casos.section.readMore': 'Leer más',
    'casos.section.viewAll': 'Ver todos',
    'casos.section.findYourCase': 'Encuentra tu caso',

    'casos.problems.backPain.title': 'Dolor de espalda',
    'casos.problems.backPain.description': 'Dolor persistente y problemas posturales.',
    'casos.problems.stress.title': 'Estrés y ansiedad',
    'casos.problems.stress.description': 'Desregulación del sistema nervioso.',
    'casos.problems.digestive.title': 'Problemas digestivos',
    'casos.problems.digestive.description': 'Disfunción visceral e hinchazón.',
    'casos.problems.migraines.title': 'Migrañas',
    'casos.problems.migraines.description': 'Dolores de cabeza y tensión craneal.',
    'casos.problems.lowEnergy.title': 'Fatiga crónica',
    'casos.problems.lowEnergy.description': 'Agotamiento sistémico.',
    'casos.problems.hormonal.title': 'Desequilibrios hormonales',
    'casos.problems.hormonal.description': 'Salud de la mujer y ciclos.',
    'casos.problems.sleep.title': 'Trastornos del sueño',
    'casos.problems.sleep.description': 'Insomnio y mal descanso.',
    'casos.problems.recovery.title': 'Recuperación',
    'casos.problems.recovery.description': 'Post-lesión y rehabilitación.',

    // Students
    'students.problems.title': 'Retos de los estudiantes',
    'students.problems.subtitle': 'Supera el estrés académico',
    'students.problem1.title': 'Ansiedad',
    'students.problem1.desc': 'Ante exámenes',
    'students.problem2.title': 'Postura',
    'students.problem2.desc': 'Dolor al estudiar',
    'students.problem3.title': 'Concentración',
    'students.problem3.desc': 'Dificultad de foco',
    'students.problem4.title': 'Fatiga',
    'students.problem4.desc': 'Cansancio mental',
    'students.results.title': 'Resultados',
    'students.results.point1': 'Mejor rendimiento',
    'students.results.point2': 'Menos estrés',
    'students.results.point3': 'Más energía',
    'students.plans.title': 'Planes de estudio',
    'students.plans.subtitle': 'Opciones para ti',
    'students.plan1.name': 'Sesión única',
    'students.plan1.desc': 'Puntual',
    'students.plan1.result': 'Alivio',
    'students.plan2.name': 'Pack estudio',
    'students.plan2.desc': 'Seguimiento',
    'students.plan2.result': 'Rendimiento',
    'students.plan2.popular': 'Popular',
    'students.plan2.save': 'Ahorro',
    'students.plan3.name': 'Programa completo',
    'students.plan3.desc': 'Transformación',
    'students.plan3.result': 'Éxito',
    'students.plan.cta': 'Elige plan',
    'students.plan1.benefit1': 'Relax',
    'students.plan1.benefit2': 'Foco',
    'students.plan1.benefit3': 'Tips',
    'students.plan1.benefit4': 'Soporte',
    'students.plan2.benefit1': '3 sesiones',
    'students.plan2.benefit2': 'Seguimiento',
    'students.plan2.benefit3': 'Prioridad',
    'students.plan2.benefit4': 'Descuento',
    'students.plan3.benefit1': '5 sesiones',
    'students.plan3.benefit2': 'Coaching',
    'students.plan3.benefit3': 'WhatsApp',
    'students.plan3.benefit4': 'Material',

    // Office
    'office.hero.badge': 'Empresas',
    'office.hero.title': 'Bienestar corporativo',
    'office.hero.subtitle': 'Salud en el trabajo',
    'office.problems.title': 'Retos de oficina',
    'office.problems.subtitle': 'Sedentarismo y estrés',
    'office.problem1.title': 'Dolor de espalda',
    'office.problem1.desc': 'Postura estática',
    'office.problem2.title': 'Vista cansada',
    'office.problem2.desc': 'Pantallas',
    'office.problem3.title': 'Cervicales',
    'office.problem3.desc': 'Tensión hombros',
    'office.problem4.title': 'Sedentarismo',
    'office.problem4.desc': 'Falta movimiento',
    'office.help.title': 'Soluciones',
    'office.help1.title': 'Ergonomía',
    'office.help1.desc': 'Ajuste postural',
    'office.help2.title': 'Activación',
    'office.help2.desc': 'Ejercicios',
    'office.help3.title': 'Relajación',
    'office.help3.desc': 'Anti-estrés',
    'office.results.title': 'Beneficios',
    'office.results.point1': 'Productividad',
    'office.results.point2': 'Menos bajas',
    'office.results.point3': 'Buen ambiente',
    'office.plans.title': 'Planes empresa',
    'office.plans.subtitle': 'Para equipos',
    'office.plan1.name': 'Individual',
    'office.plan1.desc': 'Ejecutivo',
    'office.plan1.result': 'Foco',
    'office.plan2.name': 'Equipo pequeño',
    'office.plan2.desc': '< 10 personas',
    'office.plan2.result': 'Cohesión',
    'office.plan2.popular': 'Recomendado',
    'office.plan2.save': 'Deducible',
    'office.plan3.name': 'Departamento',
    'office.plan3.desc': 'Grandes equipos',
    'office.plan3.result': 'Cultura',
    'office.plan.cta': 'Contactar',
    'office.plan1.benefit1': 'Análisis',
    'office.plan1.benefit2': 'Tratamiento',
    'office.plan1.benefit3': 'Informe',
    'office.plan1.benefit4': 'Seguimiento',
    'office.plan2.benefit1': 'Talleres',
    'office.plan2.benefit2': 'Grupo',
    'office.plan2.benefit3': 'Material',
    'office.plan2.benefit4': 'Deal',
    'office.plan3.benefit1': 'Anual',
    'office.plan3.benefit2': 'In-house',
    'office.plan3.benefit3': 'Eventos',
    'office.plan3.benefit4': 'Datos',

    // Discovery & Other
    'discovery.location.barcelona': 'Barcelona',
    'discovery.location.rubi': 'Rubí',
    'discovery.location.online': 'Online',
    'discovery.step.location.title': 'Ubicación',
    'discovery.step.location.subtitle': '¿Dónde?',
    'discovery.step.description.title': 'Descripción',
    'discovery.step.description.subtitle': '¿Qué te pasa?',
    'discovery.step.description.placeholder': 'Cuéntanos...',
    'discovery.step.description.minChars':
      'Por favor, describe tu problema con el máximo detalle posible.',
    'discovery.recommendation.online.note':
      'Nota: Como has seleccionado Online, este servicio se adapta para sesiones remotas.',

    'common.moreInfo': 'Más info',
    'common.readMore': 'Leer más',
    'common.blog': 'Blog',
    'common.expectedResult': 'Resultado esperado',
    'common.bookNow': 'Reservar',
    'common.contact': 'Contacto',
    'common.discoverServices': 'Servicios',
    'common.reserve': 'Reservar',
    'common.reserveNow': 'Reservar ahora',
    'common.seePlans': 'Ver planes',
    'common.hour': 'H',
    'common.hours': 'Horas',
    'common.reserveSession': 'Reserva sesión',
    'common.seeOtherServices': 'Otros servicios',
    'common.getStarted': 'Comenzar',
    'common.free': 'Gratis',

    'services.therapiesFor': 'Terapias para',
    'services.integralWellbeing': 'Bienestar integral',
    'services.personalizedTreatments': 'Personalizado',
    'services.massage.title': 'Masaje',
    'services.massage.subtitle': 'Relax',
    'services.massage.description': 'Descanso profundo',
    'services.kinesiology.title': 'Kinesiología',
    'services.kinesiology.subtitle': 'Equilibrio',
    'services.kinesiology.description': 'Test muscular',

    // New Content Translations
    'adult.kinesiology.badge': 'Equilibrio Integral',
    'adult.nutrition.badge': 'Salud Digestiva',
    'children.recommended': 'Servicios Recomendados',
    'children.recommended.desc': 'Cuidado especializado para el desarrollo y bienestar infantil.',
    'children.kinesiology.badge': 'Aprendizaje y Emociones',
    'children.kinesiology.desc':
      'Apoyo en dificultades de aprendizaje, gestión emocional y coordinación motora.',
    'children.health.title': 'Equilibrio Corporal',
    'children.health.desc':
      'Tratamiento holístico para alergias, intolerancias y desarrollo físico saludable.',
    'children.kinesiology.imgAlt': 'Kinesiología Infantil',
    'children.health.badge': 'Salud Física',
    'children.health.imgAlt': 'Salud Física',
    'families.recommended': 'Servicios Recomendados',
    'families.recommended.desc': 'Apoyo integral para el bienestar de toda la familia.',
    'families.kinesiology.badge': 'Bienestar Familiar',
    'families.nutrition.badge': 'Hábitos Saludables',
    'services.nutrition.title': 'Nutrición',
    'services.nutrition.subtitle': 'Salud',
    'services.nutrition.description': 'Dieta consciente',
    'services.revision360.title': 'Revisión 360',
    'services.revision360.subtitle': 'Total',
    'services.revision360.description': 'Evaluación completa',
    'services.consultation.title': 'Consulta',
    'services.consultation.description': 'Hablamos 15 min',
    'services.consultation.feeling': 'Claridad',

    'whyChoose.title': '¿Por qué elegir EKA Balance?',
    'whyChoose.subtitle':
      'Somos más que un centro de terapia; somos tus socios dedicados en el bienestar holístico.',
    'whyChoose.personalized.title': 'Planes verdaderamente personalizados',
    'whyChoose.personalized.description':
      'Tu cuerpo es único, y tu terapia también debería serlo. Adaptamos cada sesión a tu fisiología e historia específicas para obtener resultados más rápidos y sostenibles.',
    'whyChoose.holistic.title': 'Integración sistémica',
    'whyChoose.holistic.description':
      'Tratamos todo tu ser: estructural, químico y emocional. La verdadera curación ocurre cuando todos tus sistemas trabajan en armonía.',
    'whyChoose.experienced.title': 'Guía experta',
    'whyChoose.experienced.description':
      'Benefíciate de años de práctica profesional y estudio continuo en modalidades globales como Feldenkrais, osteopatía y kinesiología.',

    'finalCta.title': '¿Listo?',
    'finalCta.subtitle': 'Reserva ya',

    // Pricing Section
    'pricing.badge': 'Tarifas transparentes',
    'pricing.title.part1': 'Elige tu',
    'pricing.title.part2': 'plan de bienestar',
    'pricing.subtitle':
      'Packs diseñados para cada necesidad, con la flexibilidad y calidad que te mereces',
    'pricing.popular': 'Más popular',
    'pricing.save': 'Ahorra {percent}%',
    'pricing.discount_applied': 'Aplicado',
    'pricing.plan.select': 'Seleccionar',

    'pricing.plan.basic.name': 'Sesión individual',
    'pricing.plan.basic.desc': 'Una sesión completa de 1.5h',
    'pricing.plan.pack3.name': 'Pack bienestar (3)',
    'pricing.plan.pack3.desc': 'Pack de 3 sesiones para un seguimiento continuo',
    'pricing.plan.pack5.name': 'Pack transformación (5)',
    'pricing.plan.pack5.desc': 'Tratamiento integral para cambios profundos',

    'pricing.feature.massage': 'Masaje terapéutico',
    'pricing.feature.kinesiology': 'Kinesiología',
    'pricing.feature.osteopathy': 'Osteopatía suave',
    'pricing.feature.save15': 'Ahorra 15€',
    'pricing.feature.valid3months': 'Válido por 3 meses',
    'pricing.feature.transferable': 'Transferible',
    'pricing.feature.save25': 'Ahorra 25€',
    'pricing.feature.valid6months': 'Válido por 6 meses',
    'pricing.feature.priority': 'Prioridad de reserva',

    'pricing.guarantee.nocommitment.title': 'Sin compromisos',
    'pricing.guarantee.nocommitment.desc': 'Cancela o cambia tu cita hasta 24h antes sin coste',
    'pricing.guarantee.satisfaction.title': 'Garantía de satisfacción',
    'pricing.guarantee.satisfaction.desc':
      'Si no estás satisfecho con la primera sesión, te la reembolsamos',
    'pricing.guarantee.certified.title': 'Profesionales certificados',
    'pricing.guarantee.certified.desc':
      'Todos nuestros terapeutas tienen certificaciones oficiales',
    'pricing.guarantee.equipment.title': 'Equipo profesional',
    'pricing.guarantee.equipment.desc': 'Utilizamos solo equipo y productos de máxima calidad',

    'pricing.cta.unsure.title': '¿No estás seguro de qué plan elegir?',
    'pricing.cta.unsure.subtitle':
      'Haz nuestra evaluación gratuita y descubre qué tratamiento se adapta mejor a tus necesidades',
    'pricing.cta.unsure.button': 'Descubrir nuestros servicios',

    // Booking Popup
    'booking.smart.service.placeholder': 'Selecciona un servicio...',
    'booking.smart.time.placeholder': 'Ej: mañanas, próxima semana...',
    'booking.whatsapp.name': 'Nombre',
    'booking.whatsapp.serviceLabel': 'Servicio',
    'booking.whatsapp.preference': 'Preferencia horaria',
    'booking.service.other': 'Otro',
    'booking.service.consultation': 'Consulta inicial',
    'booking.smart.quick': 'Reserva rápida',
    'booking.smart.quickDesc': 'Contactar por WhatsApp directamente.',
    'booking.smart.form': 'Formulario',
    'booking.smart.formDesc': 'Rellenar detalles primero.',
    'booking.smart.name': 'Tu nombre',
    'booking.smart.service': 'Servicio',
    'booking.smart.time': 'Horario preferido',
    'booking.smart.send': 'Enviar por WhatsApp',
    'booking.smart.title': 'Reserva tu cita',
    'booking.smart.subtitle': 'Elige cómo quieres contactar',
  },

  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.personalizedServices': 'Персонализированные услуги',
    'nav.revision360': 'Обзор 360°',

    'common.consultPrice': 'Уточнить цену',
    'services.variableDuration': 'Вариативно',
    'services.mainBenefits': 'Преимущества',
    'nav.vip': 'VIP',
    'nav.bookNow': 'Забронировать',
    'nav.contact': 'Контакты',
    'nav.aboutElena': 'О елене',
    'nav.casos': 'Случаи',

    // Elena Approach & Targets
    'elena.approach.title': 'Метод елены кучеры',
    'elena.approach.desc':
      'В основе моей работы лежит глубокое понимание того, что тело, мозг и эмоции — это единая система. Я работаю не с симптомами, а ищу их первопричину, помогая организму восстановить естественную способность к саморегуляции. Мой метод объединяет передовые техники работы с телом и нервной системой: Movement Lesson, JKA (Jeremy Krauss Approach), child’space, Feldenkrais и биодинамику. Это мягкое, но мощное воздействие, которое переобучает нервную систему, снимает глубинные напряжения и возвращает легкость движения и ясность ума.',

    'elena.target.adults.title': 'Взрослые',
    'elena.target.adults.desc':
      'Для тех, кто чувствует хроническую усталость, боли в спине и шее, последствия стресса или травм. Я помогаю восстановить ресурсное состояние, улучшить осанку, снять психосоматические блоки и вернуть радость движения. Это не просто массаж или терапия, это перезагрузка вашей нервной системы для более качественной жизни.',

    'elena.target.children.title': 'Дети',
    'elena.target.children.desc':
      'Поддержка гармоничного развития ребенка с первых дней жизни. Я работаю с задержками моторного развития, нарушениями осанки, гиперактивностью и сложностями в обучении. Мягкие техники помогают ребенку лучше чувствовать свое тело, развивать координацию и уверенность в себе.',

    'elena.target.families.title': 'Семьи с особенными детьми',
    'elena.target.families.desc':
      'Комплексное сопровождение семей с детьми с дцп, генетическими синдромами или другими особенностями развития. Я работаю не только с ребенком, чтобы он осваивал новые навыки движения и коммуникации, но и с родителями, обучая вас взаимодействовать с ним и заботиться о собственной энергии и благополучии.',

    // Dropdown items
    'nav.officeWorkers': 'Офисные работники',
    'nav.athletes': 'Спортсмены',
    'nav.artists': 'Артисты',
    'nav.musicians': 'Музыканты',
    'nav.students': 'Студенты',
    'nav.parents': 'Родители',

    'home.founder': 'Основатель и CEO',
    'home.elenaAlt': 'Елена, телесный терапевт EKA Balance',
    'home.viewAllServices': 'Посмотреть все услуги',
    'home.elenaName': 'Елена Кучерова',
    'elena.name': 'Елена Кучерова',

    // About
    'about.badge': 'Мой путь',
    'about.title': 'Елена Кучерова',
    'about.role': 'Специалист по соматической интеграции и кинезиологии',
    'about.description1':
      'За 15 лет клинической практики я усовершенствовала метод, который выходит за рамки классического лечения.',
    'about.description2':
      'Я объединяю точность прикладной нейробиологии с глубиной мануальных техник для восстановления жизненного баланса.',
    'about.cta': 'Узнайте больше о методе',

    // Hero section
    'hero.badge': 'Естественный способ исцеления',
    'hero.title': 'EKA Balance',
    'hero.subtitle':
      'Мы поможем вам снова почувствовать себя комфортно. С помощью массажа и терапий мы находим причину дискомфорта и возвращаем вам энергию для ежедневной жизни.',
    'hero.firstTime': 'Это ваш первый раз?',
    'hero.dontKnowWhatToChoose': 'Не знаете, с чего начать?',
    'hero.discoverServices': 'Откройте наши услуги',
    'hero.stats.sessions': 'Проведенных сессий',
    'hero.stats.clients': 'Измененных жизней',
    'hero.stats.experience': 'Лет практики',
    'hero.stats.countries': 'Международных обучений',
    // Footer
    'footer.address': 'Carrer Pelai, 12, 08001 Barcelona, Spain',
    'footer.email': 'contact@ekabalance.com',
    'footer.copyright': '© 2024 EKA Balance. Все права защищены.',
    'footer.selectLanguage': 'Выберите язык',
    'footer.discounts': 'Скидки',

    // Language Popup & Cookies
    'language.popup.title': 'Какой язык вы предпочитаете?',
    'language.popup.subtitle': 'Выберите ваш язык, чтобы продолжить',
    'cookies.wrongLanguage': 'Не тот язык?',

    // Discovery Form - Location
    'discovery.location.barcelona': 'Барселона',
    'discovery.location.rubi': 'Руби',
    'discovery.location.online': 'Онлайн / я не рядом',
    'discovery.step.location.title': 'Где вы находитесь?',
    'discovery.step.location.subtitle': 'Чтобы предложить лучший вариант',

    // Services
    'services.massage.title': 'Терапевтический массаж',
    'services.massage.subtitle': 'Больше, чем расслабление: глубокое восстановление',
    'services.massage.description':
      'Испытайте настоящую терапевтическую перезагрузку. Мы сочетаем миофасциальный релиз с глубокими техниками для растворения хронического напряжения, улучшения подвижности и успокоения ума. Это не просто приятные ощущения на час; это длительное облегчение.',
    'services.kinesiology.title': 'Холистическая кинезиология',
    'services.kinesiology.subtitle': 'Расшифруйте сигналы вашего тела',
    'services.kinesiology.description':
      'Ваше тело хранит ответы. С помощью точного мышечного тестирования мы находим скрытые источники дисбаланса — будь то физическая травма, эмоциональный стресс или биохимические потребности. Кинезиология — это ключ к пониманию того, что именно нужно вашей системе прямо сейчас для исцеления.',

    // New Content Translations
    'adult.kinesiology.badge': 'Интегральный баланс',
    'adult.nutrition.badge': 'Здоровье пищеварения',
    'children.recommended': 'Рекомендуемые услуги',
    'children.recommended.desc': 'Специализированная помощь для детского развития и благополучия.',
    'children.kinesiology.badge': 'Обучение и эмоции',
    'children.kinesiology.desc':
      'Поддержка при трудностях в обучении, управлении эмоциями и моторной координации.',
    'children.health.title': 'Телесный баланс',
    'children.health.desc':
      'Холистическое лечение аллергий, непереносимостей и здоровое физическое развитие.',
    'children.kinesiology.imgAlt': 'Детская кинезиология',
    'children.health.badge': 'Физическое здоровье',
    'children.health.imgAlt': 'Физическое здоровье',
    'families.recommended': 'Рекомендуемые услуги',
    'families.recommended.desc': 'Комплексная поддержка благополучия всей семьи.',
    'families.kinesiology.badge': 'Семейное благополучие',
    'families.nutrition.badge': 'Здоровые привычки',
    'services.nutrition.title': 'Осознанное питание',
    'services.nutrition.subtitle': 'Питайте свою жизненную силу, исцеляйтесь изнутри',
    'services.nutrition.description':
      'Питание — это биохимия, а не просто калории. Мы разрабатываем персональные планы для оптимизации вашей энергии, оздоровления кишечника и поддержки нервной системы.',
    'services.revision360.title': 'Обзор 360°',
    'services.revision360.subtitle': 'Карта вашего здоровья',
    'services.revision360.description':
      'Комплексная диагностическая сессия, анализирующая осанку, паттерны движения и метаболическое здоровье для создания точного маршрута к восстановлению.',
    'services.therapiesFor': 'Методы для',
    'services.integralWellbeing': 'Комплексного благополучия',
    'services.personalizedTreatments':
      'Откройте персонализированные методы, адаптированные к вашим конкретным потребностям',
    'services.consultation.title': 'Бесплатная консультация 15 мин',
    'services.consultation.description':
      'Не уверены? Поговорим 15 минут без обязательств, чтобы понять, чем я могу вам помочь.',
    'services.consultation.feeling': 'Ясность на вашем пути',

    // Common
    'common.moreInfo': 'Подробнее',
    'common.readMore': 'Читать далее',
    'common.expectedResult': 'Ожидаемый результат',
    'common.bookNow': 'Забронировать',
    'common.contact': 'Контакт',
    'common.discoverServices': 'Откройте наши услуги',
    'common.reserve': 'Забронировать',
    'common.reserveNow': 'Забронировать сейчас',
    'common.seePlans': 'Посмотреть планы',
    'common.hour': 'Час',
    'common.hours': 'Часов',
    'common.reserveSession': 'Забронировать сессию',
    'common.seeOtherServices': 'Посмотреть другие услуги',
    'common.getStarted': 'Начать',
    'common.free': 'Бесплатно',

    // About Section
    'elena.greeting': 'Здравствуйте, я Елена',
    'elena.role': 'Телесный терапевт',
    'elena.bio':
      'Я посвятила свою жизнь изучению глубин терапевтических дисциплин, создавая уникальный, интегративный подход, который чтит человека как единое целое.',
    'elena.work.title': 'Мой подход',
    'elena.description1':
      'Я телесный терапевт, специализирующийся на лечебном массаже, кинезиологии и интеграции ума и тела. Моя работа основана на убеждении, что истинное исцеление приходит через умение слушать свое тело.',
    'elena.description2':
      'Моя цель проста: помочь вам сбросить груз напряжения и восстановить физическое и эмоциональное благополучие, чтобы вы могли идти по жизни с легкостью и обновленной энергией.',
    'elena.knowMore': 'Читать мою полную историю',
    'elena.quote':
      'Тело обладает врожденной способностью исцелять себя; моя задача — напомнить ему, как это делать.',

    // Services Section
    'services.badge': 'Терапевтическое совершенство',
    'services.title': 'Вмешательства высокого воздействия',
    'services.subtitle':
      'Передовые протоколы, объединяющие структурную манипуляцию, неврологическую балансировку и метаболическую оптимизацию.',
    'services.cta': 'Изучить протоколы',

    // Service: Massage
    'massage.title': 'Продвинутая мануальная терапия',
    'massage.desc':
      'Реконструкция архитектуры тела. Слияние техник глубоких тканей и миофасциального релиза для устранения хронических ограничений и восстановления свободы движения.',
    'massage.benefit1': 'Структурная декомпрессия',
    'massage.benefit2': 'Постуральное выравнивание',
    'massage.benefit3': 'Регуляция нервной системы',
    'massage.benefit4': 'Регенерация тканей',

    // Service: Kinesiology
    'kinesiology.title': 'Клиническая кинезиология',
    'kinesiology.desc':
      'Биологическая обратная связь высокой точности. Мы используем неврологический мышечный тест для расшифровки и коррекции структурных, биохимических и эмоциональных дисфункций в их источнике.',
    'kinesiology.benefit1': 'Причинная диагностика',
    'kinesiology.benefit2': 'Неврологическая оптимизация',
    'kinesiology.benefit3': 'Структурная интеграция',
    'kinesiology.benefit4': 'Системная стабильность',

    // Service: Nutrition
    'nutrition.title': 'Функциональная нутрициология',
    'nutrition.desc':
      'Биохимия для производительности. Стратегии питания, разработанные для усиления когнитивных функций, гормональной стабильности и клеточной витальности.',
    'nutrition.benefit1': 'Метаболическая оптимизация',
    'nutrition.benefit2': 'Здоровье микробиоты',
    'nutrition.benefit3': 'Когнитивная производительность',
    'nutrition.benefit4': 'Гормональная регуляция',

    // Problems / Casos Section
    'problems.badge': 'Диагностика и решение',
    'problems.title': 'Клиническая идентификация',
    'problems.subtitle':
      'Точный анализ патологий для разработки эффективных терапевтических стратегий.',

    // Problem: Back Pain
    'problems.backpain.title': 'Хроническая вертебральная дисфункция',
    'problems.backpain.desc':
      'Постоянный структурный дискомфорт, нарушающий отдых и профессиональную деятельность.',
    'problems.backpain.solution': 'Клинический протокол',
    'problems.backpain.solutionDesc':
      'Осевая декомпрессия и постуральная нейромодуляция для устойчивой коррекции.',

    // Problem: Stress
    'problems.stress.title': 'Дисрегуляция нервной системы',
    'problems.stress.desc':
      'Состояние гипервозбуждения, торакальное сжатие и отсутствие восстановительного отдыха.',
    'problems.stress.solution': 'Клинический протокол',
    'problems.stress.solutionDesc':
      'Вегетативная регуляция через краниосакральную терапию и контролируемое дыхание.',

    // Problem: Fatigue
    'problems.fatigue.title': 'Системное истощение',
    'problems.fatigue.desc':
      'Хроническая летаргия и энергетический дефицит, сохраняющийся после сна.',
    'problems.fatigue.solution': 'Клинический протокол',
    'problems.fatigue.solutionDesc':
      'Метаболическая реактивация и биоэнергетическая разблокировка для восстановления витальности.',

    // Problem: Injuries
    'problems.injuries.title': 'Продвинутая функциональная реабилитация',
    'problems.injuries.desc':
      'Травматические ограничения, снижающие спортивную производительность и биомеханику.',
    'problems.injuries.solution': 'Клинический протокол',
    'problems.injuries.solutionDesc':
      'Ускоренная регенерация тканей и профилактическая стабилизация для пиковой формы.',

    // Final CTA
    'finalCta.title': 'Готовы начать свой путь к благополучию?',
    'finalCta.subtitle': 'Свяжитесь с нами, чтобы забронировать сессию или решить любые вопросы',

    // Casos page
    'casos.hero.badge': 'Реальные истории',
    'casos.title': 'Пути к исцелению',
    'casos.subtitle': 'Ваше тело рассказывает историю. Мы помогаем переписать её.',
    'casos.description':
      'Симптомы, такие как боль, усталость или напряжение, часто являются лишь верхушкой айсберга — сигналами системы, ищущей равновесия. В EKA Balance мы не заглушаем эти сигналы, мы их расшифровываем. Устраняя первопричину, мы помогли сотням клиентов трансформировать свои отношения с телом. Изучите эти истории, чтобы понять, что возможно для вас.',
    'casos.frequentCases': 'Самые частые случаи',
    'casos.frequentCasesSubtitle': 'Обычные проблемы, которые мы успешно лечим каждый день',
    'casos.otherCases': 'Другие случаи, которые мы также лечим',
    'casos.otherCasesSubtitle': 'Полный список проблем, которые мы можем помочь вам решить',
    'casos.ctaTitle': 'Мы уже знаем, как вам помочь',
    'casos.ctaSubtitle':
      'Если вы узнали себя в каком-то из этих случаев, это значит, что ваше тело просит внимания. В EKA Balance мы сопровождаем вас точными техниками, человеческим взглядом и реальными результатами.',
    'casos.discoverIdeal': 'Откройте вашу идеальную услугу',
    'casos.bookSession': 'Забронировать сессию',
    'casos.seeDetails': 'Посмотреть детали',

    // Casos section
    'casos.section.badge': 'Реальные проблемы, эффективные решения',
    'casos.section.title': 'Проблемы, которые мы решаем',
    'casos.section.titleHighlight': 'каждый день',
    'casos.section.subtitle':
      'Сотни людей восстановили свое благополучие с нами. Узнайте, как мы можем помочь вам.',
    'casos.section.readMore': 'Читать больше',
    'casos.section.viewAll': 'Посмотреть все случаи',
    'casos.section.findYourCase': 'Найти ваш случай',

    // Problems
    'casos.problems.backPain.title': 'Боль в спине и шее',
    'casos.problems.backPain.description':
      'Одна из самых частых причин обращения. Поясничная боль, шейные контрактуры, скованность или то ощущение, что"несешь весь мир на спине".',
    'casos.problems.stress.title': 'Стресс и тревога',
    'casos.problems.stress.description':
      'Тело входит в"постоянную тревогу" и не знает, как отключиться. многие люди приходят с сердцебиением, напряжением в груди, бессонницей или чувством удушья.',
    'casos.problems.digestive.title': 'Проблемы с пищеварением',
    'casos.problems.digestive.description':
      'Когда пищеварительная система блокируется, трудно переваривать не только еду —но также эмоции и повседневную жизнь.',
    'casos.problems.migraines.title': 'Мигрени и черепное напряжение',
    'casos.problems.migraines.description':
      'Повторяющиеся головные боли, фотофобия, звуки которые беспокоят или крайняя усталость. Разум не может течь, когда тело напряжено.',
    'casos.problems.lowEnergy.title': 'Недостаток энергии или низкая производительность',
    'casos.problems.lowEnergy.description':
      'Когда все дается с трудом, когда просыпаешься уставшим или чувствуешь, что тело"не отвечает". это не лень —это недостаток внутренней регуляции.',
    'casos.problems.hormonal.title': 'Гормональные проблемы или нерегулярные циклы',
    'casos.problems.hormonal.description':
      'Женское тело говорит через цикл. Когда есть боль, дисбаланс или истощение, это означает, что что-то не в равновесии.',
    'casos.problems.sleep.title': 'Трудности со сном',
    'casos.problems.sleep.description':
      'Разум не останавливается, тело тоже. Отдых необходим для восстановления и поддержания физического и психического здоровья.',
    'casos.problems.recovery.title': 'Восстановление после травмы',
    'casos.problems.recovery.description':
      'После падения, операции или несчастного случая тело может остаться со скованностью или страхом движения.',

    // Casos Problems Details
    // Back Pain
    'casos.problems.backPain.symptom1':
      'Острая боль, скованность или постоянное напряжение в пояснице, грудном отделе или шее.',
    'casos.problems.backPain.symptom2':
      'Ограничение подвижности: трудно повернуть голову, наклониться или поднять руки.',
    'casos.problems.backPain.symptom3':
      'Постуральная усталость: сильное утомление после долгого сидения или стояния.',
    'casos.problems.backPain.symptom4':
      'Ощущение тяжести или груза на плечах, трапеции и основании черепа.',
    'casos.problems.backPain.cause1':
      'Длительные статические позы, плохая эргономика и компенсаторные привычки.',
    'casos.problems.backPain.cause2':
      'Соматизированный эмоциональный груз (стресс, тревога), проявляющийся как мышечный панцирь.',
    'casos.problems.backPain.cause3':
      'Гиподинамия и недостаток мышечного тонуса или суставной подвижности.',
    'casos.problems.backPain.cause4':
      'Ограниченные паттерны дыхания, блокирующие естественное движение позвоночника.',
    'casos.problems.backPain.treatment':
      'Комплексный подход: глубокий терапевтический массаж, миофасциальный релиз, кинезиология для поиска первопричины (структурной, химической или эмоциональной) и переобучение осанки (метод фельденкрайза).',
    'casos.problems.backPain.results':
      'Мгновенное облегчение боли и напряжения. Восстановление подвижности и легкости. В долгосрочной перспективе — более сильная, гибкая спина без рецидивирующей боли.',

    // Stress
    'casos.problems.stress.symptom1':
      'Постоянный ментальный шум: невозможность остановить поток мыслей и отключиться.',
    'casos.problems.stress.symptom2':
      'Неспособность расслабиться, чувство постоянной тревоги или трудности с засыпанием.',
    'casos.problems.stress.symptom3':
      'Физические симптомы: бруксизм, напряжение в шее, сдавленность в груди или утренняя разбитость.',
    'casos.problems.stress.symptom4':
      'Эмоциональная лабильность: раздражительность, беспокойство или резкие перепады настроения.',
    'casos.problems.stress.cause1':
      'Перегрузка ответственностью, рабочее или семейное давление и отсутствие личных границ.',
    'casos.problems.stress.cause2':
      'Потеря контакта с собственными потребностями и нехватка качественного времени для себя.',
    'casos.problems.stress.cause3':
      'Непроработанные травмы или сложные жизненные ситуации, удерживающие систему в режиме"бей или беги".',
    'casos.problems.stress.cause4':
      'Дисрегуляция вегетативной нервной системы (хроническая симпатикотония).',
    'casos.problems.stress.treatment':
      'Регуляция нервной системы: эмоциональная кинезиология, вагальные техники, мягкая работа с телом (фельденкрайз) и осознанное дыхание для восстановления внутреннего покоя.',
    'casos.problems.stress.results':
      'Восстановление душевного равновесия и эмоционального баланса. Улучшение качества сна и способности справляться со стрессом. Чувство контроля и глубокого благополучия.',

    // Digestive
    'casos.problems.digestive.symptom1':
      'Пищеварительный дискомфорт: вздутие, газы, кислотность, рефлюкс или тяжесть после еды.',
    'casos.problems.digestive.symptom2':
      'Сонливость,"мозговой туман" или упадок сил после приема пищи.',
    'casos.problems.digestive.symptom3': 'Нерегулярный стул (запоры или диарея) и боли в животе.',
    'casos.problems.digestive.symptom4':
      'Сложные отношения с едой или подозрение на непереносимость.',
    'casos.problems.digestive.cause1':
      'Недиагностированная пищевая непереносимость или чувствительность.',
    'casos.problems.digestive.cause2':
      'Неправильные пищевые привычки: еда на бегу, в стрессе или в неподходящее время.',
    'casos.problems.digestive.cause3':
      'Ось кишечник-мозг: эмоциональный стресс, напрямую влияющий на функцию пищеварения.',
    'casos.problems.digestive.cause4':
      'Механические висцеральные дисфункции или дисбаланс микробиоты.',
    'casos.problems.digestive.treatment':
      'Нутрициологическая кинезиология для тестирования продуктов, висцеральный массаж для улучшения моторики и рекомендации по осознанному и персонализированному питанию.',
    'casos.problems.digestive.results':
      'Легкое пищеварение без дискомфорта. Исчезновение вздутия и восстановление жизненной энергии. Здоровые и приятные отношения с едой.',

    // Migraines
    'casos.problems.migraines.symptom1':
      'Интенсивная пульсирующая боль, часто односторонняя, которая может влиять на зрение.',
    'casos.problems.migraines.symptom2':
      'Ощущение давления в голове,"шлема" или напряжения в глазах.',
    'casos.problems.migraines.symptom3':
      'Сопутствующие симптомы: тошнота, рвота или неустойчивость.',
    'casos.problems.migraines.symptom4':
      'Сенсорная гиперчувствительность: непереносимость света (фотофобия) или звуков (фонофобия).',
    'casos.problems.migraines.cause1':
      'Хроническое напряжение в шее и блоки в основании черепа (подзатылочные мышцы).',
    'casos.problems.migraines.cause2': 'Дисфункция внчс (бруксизм), иррадиирующая боль в голову.',
    'casos.problems.migraines.cause3':
      'Умственная перегрузка, зрительный стресс или недостаток настоящего отдыха.',
    'casos.problems.migraines.cause4':
      'Метаболические факторы: гормональный дисбаланс, гистамин или токсическая нагрузка на печень.',
    'casos.problems.migraines.treatment':
      'Краниальная мануальная терапия (остеобаланс), освобождение шейного и челюстного напряжения, регуляция нервной и гормональной систем с помощью кинезиологии.',
    'casos.problems.migraines.results':
      'Радикальное снижение частоты и интенсивности приступов. Во многих случаях — полное исчезновение боли. Ясность ума и улучшение самочувствия.',

    // Low Energy
    'casos.problems.lowEnergy.symptom1':
      'Глубокое истощение, которое не проходит после отдыха (хроническая усталость).',
    'casos.problems.lowEnergy.symptom2':
      'Трудности с концентрацией, потеря памяти или"мозговой туман".',
    'casos.problems.lowEnergy.symptom3':
      'Апатия, отсутствие мотивации или чувство внутренней пустоты.',
    'casos.problems.lowEnergy.symptom4':
      'Ощущение физической слабости или"неспособности справиться".',
    'casos.problems.lowEnergy.cause1':
      'Выгорание или длительный стресс, истощивший ресурсы организма.',
    'casos.problems.lowEnergy.cause2':
      'Нутрициологический дисбаланс (дефицит витаминов/минералов) или метаболические нарушения.',
    'casos.problems.lowEnergy.cause3':
      'Дисфункция гормональной оси (усталость надпочечников, щитовидная железа).',
    'casos.problems.lowEnergy.cause4':
      'Эмоциональные блоки или потеря жизненной цели, истощающие энергию.',
    'casos.problems.lowEnergy.treatment':
      'Комплексная ревитализация: кинезиология для обнаружения утечек энергии, нутрициологическая поддержка и работа с телом для реактивации жизненного потока.',
    'casos.problems.lowEnergy.results':
      'Возвращение жизненных сил и энтузиазма. Ясный и бодрый ум. Способность справляться с повседневными делами с энергией и радостью.',

    // Discovery New Keys
    'discovery.step.description.minChars': 'символов минимум',
    'discovery.recommendation.online.note':
      'Примечание: Поскольку вы выбрали Онлайн, эта услуга адаптирована для дистанционных сеансов.',

    // Sleep
    'casos.problems.sleep.symptom1':
      'Инсомния засыпания: ворочание в постели без возможности уснуть.',
    'casos.problems.sleep.symptom2': 'Частые ночные пробуждения или слишком ранний подъем.',
    'casos.problems.sleep.symptom3':
      'Невосстанавливающий сон: пробуждение с усталостью, напряжением или головной болью.',
    'casos.problems.sleep.symptom4':
      'Непрекращающаяся умственная активность или тревога перед сном.',
    'casos.problems.sleep.cause1':
      'Гиперактивация нервной системы (состояние тревоги), препятствующая отдыху.',
    'casos.problems.sleep.cause2': 'Дисрегуляция циркадных ритмов (режим, синий свет).',
    'casos.problems.sleep.cause3': 'Неподходящие привычки сна или неблагоприятная обстановка.',
    'casos.problems.sleep.cause4':
      'Органические причины: тяжелое пищеварение, хроническая боль или гормональный дисбаланс.',
    'casos.problems.sleep.treatment':
      'Переобучение сна: техники глубокой релаксации, регуляция нервной системы (вагальной), и персонализированные рекомендации по гигиене сна.',
    'casos.problems.sleep.results':
      'Глубокий, непрерывный и восстанавливающий сон. Пробуждение с энергией и чувством настоящего отдыха. Улучшение настроения и общего здоровья.',

    // Recovery
    'casos.problems.recovery.symptom1': 'Постоянная боль или дискомфорт в зоне старой травмы.',
    'casos.problems.recovery.symptom2':
      'Ограничение подвижности, скованность или ощущение хрупкости.',
    'casos.problems.recovery.symptom3':
      'Страх совершать определенные движения или страх рецидива (кинезиофобия).',
    'casos.problems.recovery.symptom4': 'Постуральные компенсации, вызывающие боль в других зонах.',
    'casos.problems.recovery.cause1':
      'Рубцовая ткань (спайки), ограничивающая движение и защемляющая нервы.',
    'casos.problems.recovery.cause2':
      'Измененные паттерны движения для защиты травмы (компенсации).',
    'casos.problems.recovery.cause3':
      'Клеточная травма или память о боли, удерживающая зону в состоянии тревоги.',
    'casos.problems.recovery.cause4': 'Незавершенная или поспешная реабилитация.',
    'casos.problems.recovery.treatment':
      'Функциональное восстановление: работа со шрамами, переобучение движения (фельденкрайз) и эмоциональная работа для освобождения памяти о травме.',
    'casos.problems.recovery.results':
      'Полное восстановление функциональности и доверия к телу. Свободное, плавное движение без боли. Возвращение к нормальной активности с уверенностью.',

    // Contact Form
    'contact.success.title': 'Сообщение успешно отправлено!',
    'contact.success.message': 'Спасибо, что связались с нами. Мы ответим вам очень скоро.',
    'contact.success.button': 'Отправить еще одно сообщение',
    'contact.title': 'Поговорите с нами',
    'contact.subtitle':
      'Мы здесь, чтобы помочь вам на пути к благополучию. Свяжитесь с нами и узнайте, как мы можем улучшить качество вашей жизни.',
    'contact.phone.title': 'Телефон и WhatsApp',
    'contact.phone.subtitle': 'WhatsApp доступен 24/7',
    'contact.email.title': 'Email',
    'contact.email.subtitle': 'Ответ менее чем за 24 часа',
    'contact.location.title': 'Расположение',
    'contact.location.address': 'Carrer Pelai, 12\n08001 Barcelona',
    'contact.location.subtitle': 'Метро: l1 и l2 (universitat)',
    'contact.form.name': 'Полное имя',
    'contact.form.email': 'Электронная почта',
    'contact.form.phone': 'Телефон',
    'contact.form.service': 'Интересующая услуга',
    'contact.form.service.placeholder': 'Выберите услугу',
    'contact.form.time': 'Предпочтительное время',
    'contact.form.time.placeholder': 'Выберите время',
    'contact.form.message': 'Сообщение',
    'contact.form.message.placeholder': 'Кратко объясните, что вам нужно...',
    'contact.form.preferred': 'Предпочтительный способ связи',
    'contact.form.submit': 'Отправить сообщение',
    'contact.form.submitting': 'Отправка...',
    'contact.form.privacy': 'Я принимаю политику конфиденциальности',
    'contact.form.source': 'Как вы узнали о нас?',
    'contact.form.source.placeholder': 'Выберите вариант',
    'contact.form.source.google': 'Google',
    'contact.form.source.social': 'Социальные сети',
    'contact.form.source.friend': 'Рекомендация друга',
    'contact.form.source.other': 'Другое',
    'contact.quick.title': 'Или свяжитесь с нами напрямую:',
    'contact.quick.call': 'Позвонить сейчас',
    'contact.error': 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.',

    // Contact Form Options
    'contact.service.massageBasic': 'Базовый массаж (1ч)',
    'contact.service.massageComplete': 'Полный массаж (1,5ч)',
    'contact.service.massagePremium': 'Премиум массаж (2ч)',
    'contact.service.kinesiology': 'Холистическая кинезиология',
    'contact.service.nutrition': 'Осознанное питание',
    'contact.service.revision360': 'Обзор 360°',
    'contact.service.vip': 'VIP планы',
    'contact.service.other': 'Другие вопросы',

    'contact.time.morning': 'Утро (9:00 - 12:00)',
    'contact.time.noon': 'Полдень (12:00 - 15:00)',
    'contact.time.afternoon': 'День (15:00 - 18:00)',
    'contact.time.evening': 'Вечер (18:00 - 21:00)',
    'contact.time.any': 'Без предпочтений',

    // Symptoms, causes, treatment, results labels
    'casos.symptoms': 'Симптомы',
    'casos.causes': 'Причины',
    'casos.treatment': 'Наш подход',
    'casos.results': 'Результаты',

    // Additional problems list
    'casos.additionalProblems.bruxism': 'Бруксизм и челюстное напряжение',
    'casos.additionalProblems.tmj': 'Боль внчс (височно-нижнечелюстной сустав)',
    'casos.additionalProblems.sciatica': 'Ишиас и боль в ногах',
    'casos.additionalProblems.shoulderPain': 'Боль в плечах и скованность',
    'casos.additionalProblems.dizziness': 'Головокружения и вертиго',
    'casos.additionalProblems.irritability': 'Постоянная раздражительность',
    'casos.additionalProblems.intestinalProblems': 'Кишечные проблемы',
    'casos.additionalProblems.chronicFatigue': 'Хроническая усталость',
    'casos.additionalProblems.socialAnxiety': 'Социальная тревога',
    'casos.additionalProblems.concentrationDifficulty': 'Трудности с концентрацией',
    'casos.additionalProblems.headaches': 'Головные боли и мигрени',
    'casos.additionalProblems.insomnia': 'Бессонница и нарушения сна',
    'casos.additionalProblems.posture': 'Проблемы с осанкой',
    'casos.additionalProblems.contractures': 'Мышечные спазмы',
    'casos.additionalProblems.emotionalBlock': 'Эмоциональные блоки',
    'casos.additionalProblems.rsi': 'Травмы от повторяющихся нагрузок',
    'casos.additionalProblems.carpalTunnel': 'Синдром запястного канала',
    'casos.additionalProblems.plantarFasciitis': 'Плантарный фасциит',

    // Testimonials
    'testimonials.title': 'Отзывы наших клиентов',
    'testimonials.subtitle': 'Откройте реальный опыт людей, которые изменили свою жизнь',
    'testimonials.all': 'Все',
    'testimonials.hide': 'Скрыть',
    'testimonials.show': 'Показать',
    'testimonials.beforeAfter': 'До/после',
    'testimonials.before': 'До',
    'testimonials.after': 'После',
    'testimonials.also': 'Также на:',
    'testimonials.with': 'С',
    'testimonials.ratings': 'Оценок',
    'testimonials.externalReviews': 'Вы можете прочитать больше отзывов на наших внешних страницах',
    'testimonials.photo': 'Фото',
    'testimonials.satisfiedClient': 'Довольный клиент',
    'testimonials.sliderTitle': 'Отзывы, которые говорят сами за себя',
    'testimonials.sliderSubtitle': 'Узнайте, как мы помогли нашим клиентам достичь благополучия',

    // Offline
    'offline.message': 'Нет подключения к интернету',

    // Discounts page
    'discounts.pageTitle': 'Скидки - EKA Balance',
    'discounts.pageDescription':
      'Откройте наши специальные скидки на оздоровительные услуги и терапии',
    'discounts.badge': 'Специальные предложения',
    'discounts.title': 'Специальные скидки',
    'discounts.subtitle':
      'Наслаждайтесь сниженными ценами на наши оздоровительные услуги с нашими эксклюзивными скидками',
    'discounts.availableTitle': 'Доступные скидки',
    'discounts.availableSubtitle':
      'Воспользуйтесь этими специальными предложениями, чтобы начать свой путь к благополучию',
    'discounts.mykolaFriend.description':
      'Специальная скидка 20% для друзей миколы. Действует на все сессии и услуги.',
    'discounts.conocidoMykola.description':
      'Скидка 10% для знакомых миколы. Применимо ко всем нашим процедурам.',
    'discounts.off': 'Скидка',
    'discounts.active': 'Активно',
    'discounts.code': 'Код',
    'discounts.copy': 'Копировать',
    'discounts.howToUse.title': 'Как использовать скидки',
    'discounts.howToUse.subtitle': 'Следуйте этим простым шагам, чтобы применить вашу скидку',
    'discounts.step1.title': 'Свяжитесь с нами',
    'discounts.step1.description': 'Свяжитесь с нами через WhatsApp или телефон для бронирования',
    'discounts.step2.title': 'Упомяните код',
    'discounts.step2.description': 'Укажите код скидки при оформлении брони',
    'discounts.step3.title': 'Наслаждайтесь скидкой',
    'discounts.step3.description': 'Скидка будет автоматически применена к итоговой цене',
    'discounts.cta.title': 'Готовы использовать вашу скидку?',
    'discounts.cta.subtitle': 'Забронируйте сессию сейчас и наслаждайтесь специальной ценой',
    'discounts.cta.bookNow': 'Забронировать со скидкой',
    'discounts.cta.contact': 'Связаться',

    // Personalized Services
    'personalizedServices.title': 'Специализированные программы',
    'personalizedServices.subtitle':
      'Высокоэффективные решения, разработанные для специфических требований вашего образа жизни.',
    'personalizedServices.cta': 'Запросить программу',
    'personalizedServices.difference.title': 'Почему стоит выбрать специализированную программу?',
    'personalizedServices.main.title': 'Общий подход',
    'personalizedServices.main.list1': 'Общее лечение',
    'personalizedServices.main.list2': 'Стандартный протокол',
    'personalizedServices.main.list3': 'Временное облегчение',
    'personalizedServices.main.list4': 'Постепенное улучшение',
    'personalizedServices.special.title': 'Экспертный подход EKA',
    'personalizedServices.special.list1': 'Биомеханическая точность',
    'personalizedServices.special.list2': 'Протоколы, специфичные для деятельности',
    'personalizedServices.special.list3': 'Устранение первопричины',
    'personalizedServices.special.list4': 'Оптимизация производительности',
    'personalizedServices.choose.title': 'Выберите ваш профиль',
    'personalizedServices.choose.subtitle':
      'Каждая деятельность оказывает уникальное влияние на тело. Выберите свою, чтобы увидеть, как мы можем вас усилить.',
    'personalizedServices.bookNow.title': 'Раскройте свой потенциал',
    'personalizedServices.bookNow.subtitle':
      'Не позволяйте боли ограничивать вашу карьеру или страсть. Забронируйте сегодня.',
    'personalizedServices.officeWorkers': 'Руководители и офисные сотрудники',
    'personalizedServices.officeWorkers.desc':
      'Противодействие эффектам сидячего образа жизни и стресса высокого уровня. Восстановление осанки и ясности ума.',
    'personalizedServices.officeWorkers.benefit1':
      'Декомпрессия позвоночника и освобождение шейного отдела.',
    'personalizedServices.officeWorkers.benefit2': 'Эргономическая и дыхательная коррекция осанки.',
    'personalizedServices.officeWorkers.benefit3':
      'Управление исполнительным стрессом и зрительной усталостью.',
    'personalizedServices.officeWorkers.result':
      'Максимальная продуктивность без физического истощения.',
    'personalizedServices.athletes': 'Элитные спортсмены',
    'personalizedServices.athletes.desc':
      'Биомеханическая оптимизация, предотвращение травм и ускоренное восстановление для превосходных результатов.',
    'personalizedServices.athletes.benefit1': 'Глубокая мышечная разгрузка и подвижность суставов.',
    'personalizedServices.athletes.benefit2': 'Активное предотвращение травм и компенсаций.',
    'personalizedServices.athletes.benefit3': 'Нейромышечная активация до/после соревнований.',
    'personalizedServices.athletes.result':
      'Преодолевайте свои пределы с телом, которое откликается.',
    'personalizedServices.artists': 'Визуальные художники',
    'personalizedServices.artists.desc':
      'Специализированный уход за мелкой моторикой и длительными статическими позами.',
    'personalizedServices.artists.benefit1': 'Специфическое лечение рук, запястий и предплечий.',
    'personalizedServices.artists.benefit2': 'Освобождение плечевого пояса и шеи.',
    'personalizedServices.artists.benefit3': 'Связь тела и разума для разблокировки творчества.',
    'personalizedServices.artists.result': 'Творите без боли и с полной свободой движений.',
    'personalizedServices.musicians': 'Музыканты и исполнители',
    'personalizedServices.musicians.desc':
      'Гармонизация мышечного тонуса и осанки для безупречного технического исполнения.',
    'personalizedServices.musicians.benefit1': 'Предотвращение тендинитов и фокальных дистоний.',
    'personalizedServices.musicians.benefit2': 'Оптимизация осанки с инструментом.',
    'personalizedServices.musicians.benefit3': 'Управление сценическим волнением через тело.',
    'personalizedServices.musicians.result': 'Играйте с легкостью, точностью и без напряжения.',
    'personalizedServices.students': 'Студенты и академики',
    'personalizedServices.students.desc':
      'Физическая и ментальная поддержка в периоды высокой интеллектуальной нагрузки.',
    'personalizedServices.students.benefit1': 'Снятие напряжения от часов учебы.',
    'personalizedServices.students.benefit2': 'Улучшение оксигенации мозга и памяти.',
    'personalizedServices.students.benefit3': 'Регуляция сна и тревожности перед экзаменами.',
    'personalizedServices.students.result': 'Ясный ум в расслабленном теле.',
    'personalizedServices.parents': 'Родители',
    'personalizedServices.parents.desc':
      'Поддержка для восстановления энергии, терпения и физического самочувствия.',
    'personalizedServices.parents.benefit1': 'Снимает боль в спине от ношения детей.',
    'personalizedServices.parents.benefit2': 'Снижает эмоциональную усталость и стресс.',
    'personalizedServices.parents.benefit3': 'Восстанавливает жизненный тонус.',
    'personalizedServices.parents.result': 'Почувствуйте силы заботиться с радостью.',

    // Booking page
    'booking.title': 'Запросить сессию - EKA Balance',
    'booking.description':
      'Управляйте вашей записью на оздоровление в барселоне с легкостью. Персональное внимание и приоритетный ответ через WhatsApp.',
    'booking.badge': 'Упрощенное управление записями',
    'booking.hero.title': 'Начните процесс восстановления',
    'booking.hero.subtitle':
      'Гибкая система, разработанная для немедленного соединения вас с необходимым решением.',
    'booking.benefits.whatsapp': 'Прямая связь',
    'booking.benefits.flexible': 'Гибкость графика',
    'booking.benefits.confirmation': 'Мгновенное подтверждение',
    'booking.contact.title': 'Каналы связи',
    'booking.contact.subtitle': 'Выберите предпочтительный способ для координации вашего визита.',
    'booking.direct.title': 'Прямой чат',
    'booking.direct.description': 'Начните диалог немедленно, чтобы ускорить ваше бронирование.',
    'booking.direct.button': 'Открыть WhatsApp',
    'booking.form.title': 'Ассистент бронирования',
    'booking.form.description': 'Подготовьте ваш запрос с ключевыми деталями для точного ответа.',
    'booking.form.button': 'Использовать ассистент',
    'booking.form.hide': 'Закрыть ассистент',
    'booking.form.location': 'Предпочтительное местоположение',
    'booking.form.locationPlaceholder': 'Укажите местоположение',
    'booking.form.timeSlot': 'Доступность по времени',
    'booking.form.timeSlotPlaceholder': 'Выберите ваше время',
    'booking.form.availability': 'Предпочтение по дню',
    'booking.form.availabilityPlaceholder': 'Укажите вашу доступность',
    'booking.form.objective': 'Причина обращения',
    'booking.form.objectivePlaceholder': 'Кратко опишите вашу цель или симптом...',
    'booking.form.submit': 'Отправить запрос',

    // Options
    'booking.options.service.massage': 'Массаж',
    'booking.options.service.kinesiology': 'Кинезиология',
    'booking.options.service.osteobalance': 'Остеобаланс',
    'booking.options.service.movementLesson': 'Урок движения',
    'booking.options.service.feldenkrais': 'Фельденкрайз',
    'booking.options.service.online': 'Онлайн консультация',
    'booking.options.service.other': 'Другое',

    'booking.options.location.barcelona': 'Барселона',
    'booking.options.location.rubi': 'Руби',
    'booking.options.location.online': 'Онлайн',

    'booking.options.availability.tomorrow': 'Завтра',
    'booking.options.availability.dayAfterTomorrow': 'Послезавтра',
    'booking.options.availability.nextWeek': 'На следующей неделе',
    'booking.options.availability.weekend': 'Выходные',
    'booking.options.availability.flexible': 'Гибкий график',

    'booking.options.timeSlot.morning': 'Утро (9:00-12:00)',
    'booking.options.timeSlot.noon': 'Полдень (12:00-15:00)',
    'booking.options.timeSlot.afternoon': 'День (15:00-18:00)',
    'booking.options.timeSlot.evening': 'Вечер (18:00-21:00)',
    'booking.form.quickTitle': 'Быстрая форма бронирования',
    'booking.form.nameRequired': 'Имя *',
    'booking.form.namePlaceholder': 'Ваше имя',
    'booking.form.serviceRequired': 'Услуга *',
    'booking.form.servicePlaceholder': 'Выберите услугу',
    'booking.form.validationError': 'Пожалуйста, заполните хотя бы имя и интересующую услугу.',
    'booking.popup.title': 'Забронируйте сеанс',
    'booking.popup.subtitle': 'Выберите услугу и дату, которые вам подходят',
    'booking.whatsapp.greeting': 'Здравствуйте, я {name}',
    'booking.whatsapp.greetingGeneric': 'Здравствуйте, Елена, я хотел бы записаться на прием.',
    'booking.whatsapp.service': 'Я хотел бы забронировать сеанс: {service}',
    'booking.whatsapp.location': 'Предпочтительное место: {location}',
    'booking.whatsapp.date': 'Предпочтительная дата: {date}',
    'booking.whatsapp.time': 'Предпочтительное время: {time}',
    'booking.whatsapp.comments': 'Комментарии: {comments}',

    // Athletes personalized service
    'athletes.hero.badge': 'Специализированно для спортсменов',
    'athletes.hero.title': 'Спортсмены',
    'athletes.hero.subtitle':
      'Восстановление мышц, предотвращение травм и оптимизация спортивных результатов',
    'athletes.challenges.title': 'Общие проблемы',
    'athletes.challenge1.title': 'Медленное восстановление',
    'athletes.challenge1.desc':
      'Травмы и мышечная усталость восстанавливаются дольше, чем необходимо',
    'athletes.challenge2.title': 'Ограниченная гибкость',
    'athletes.challenge2.desc':
      'Скованность, которая уменьшает диапазон движений и влияет на производительность',
    'athletes.challenge3.title': 'Стресс перед соревнованиями',
    'athletes.challenge3.desc': 'Тревога и напряжение перед важными соревнованиями',
    'athletes.help.title': 'Как мы помогаем',
    'athletes.help1.title': 'Ускоряет восстановление мышц',
    'athletes.help1.desc': 'Специальные техники для уменьшения воспаления и ускорения заживления',
    'athletes.help2.title': 'Улучшает гибкость и подвижность',
    'athletes.help2.desc': 'Целенаправленные упражнения для увеличения диапазона движений',
    'athletes.help3.title': 'Управляет соревновательным стрессом',
    'athletes.help3.desc': 'Техники релаксации для сохранения спокойствия под давлением',
    'athletes.result.title': 'Результат',
    'athletes.result.desc':
      'Более быстрое восстановление, лучшая производительность и меньше травм',
    'athletes.stats.recovery': 'Лучшее восстановление',
    'athletes.stats.flexibility': 'Больше гибкости',
    'athletes.stats.anxiety': 'Меньше тревоги',
    'athletes.session.title': 'Сессия для спортсменов',

    // Artists personalized service
    'artists.hero.badge': 'Специализированно для артистов',
    'artists.hero.title': 'Артисты',
    'artists.hero.subtitle': 'Уход за руками, руками и осанкой для визуальных художников и творцов',
    'artists.challenges.title': 'Общие проблемы',
    'artists.challenge1.title': 'Боль в руках и запястьях',
    'artists.challenge1.desc': 'Боль от повторяющихся движений во время долгих творческих сессий',
    'artists.challenge2.title': 'Неправильная осанка',
    'artists.challenge2.desc': 'Напряжение шеи и спины от длительных поз во время творчества',
    'artists.challenge3.title': 'Творческие блоки',
    'artists.challenge3.desc':
      'Физические напряжения, ограничивающие творческий поток и вдохновение',
    'artists.help.title': 'Как мы помогаем',
    'artists.help1.title': 'Специфический уход за руками и запястьями',
    'artists.help1.desc': 'Целенаправленные процедуры для облегчения боли и предотвращения травм',
    'artists.help2.title': 'Улучшает рабочую осанку',
    'artists.help2.desc':
      'Постуральные коррекции для предотвращения напряжения во время творчества',
    'artists.help3.title': 'Освобождает творчество',
    'artists.help3.desc': 'Устраняет физические напряжения, блокирующие творческий процесс',
    'artists.result.title': 'Ожидаемый результат',
    'artists.result.desc':
      'Больше комфорта, плавности и творчества в вашем художественном процессе',
    'artists.stats.confidence': 'Больше уверенности',
    'artists.stats.tension': 'Меньше напряжения',
    'artists.stats.anxiety': 'Меньше тревоги',
    'artists.session.title': 'Сессия для артистов',
    'artists.session.cta': 'Забронировать сессию',
    'artists.session.other': 'Другие услуги',

    // Musicians personalized service
    'musicians.hero.badge': 'Специализированно для музыкантов',
    'musicians.hero.title': 'Музыканты',
    'musicians.hero.subtitle':
      'Специализированные терапии для музыкантов: руки, руки, осанка и техника',
    'musicians.problems.title': 'Проблемы, которые мы решаем',
    'musicians.problems.subtitle':
      'Музыканты сталкиваются с уникальными физическими вызовами, которые могут повлиять на их карьеру',
    'musicians.problem1.title': 'Травмы от повторяющихся нагрузок',
    'musicians.problem1.desc': 'Боль в руках, запястьях и предплечьях от интенсивной практики',
    'musicians.problem2.title': 'Постуральные напряжения',
    'musicians.problem2.desc': 'Боль в шее и спине от поддержания специфических поз',
    'musicians.problem3.title': 'Сценическая тревога',
    'musicians.problem3.desc': 'Стресс и напряжение перед важными выступлениями',
    'musicians.problem4.title': 'Потеря технической точности',
    'musicians.problem4.desc': 'Напряжение влияет на координацию и музыкальное качество',
    'musicians.help.title': 'Как мы помогаем',
    'musicians.help1.title': 'Предотвращение травм',
    'musicians.help1.desc': 'Техники для предотвращения и терапии травм от повторяющихся нагрузок',
    'musicians.help2.title': 'Постуральное улучшение',
    'musicians.help2.desc': 'Специфические коррекции для вашей инструментальной осанки',
    'musicians.help3.title': 'Целенаправленная релаксация',
    'musicians.help3.desc': 'Техники для поддержания спокойствия и точности',
    'musicians.results.title': 'Результаты, которых вы достигнете',
    'musicians.results.point1': 'Значительное уменьшение боли и напряжения',
    'musicians.results.point2': 'Улучшение технической точности и выразительности',
    'musicians.results.point3': 'Большая уверенность и сценическое присутствие',
    'musicians.plans.title': 'Специализированные планы для музыкантов',
    'musicians.plans.subtitle':
      'Выберите план, который лучше всего подходит вашим музыкальным потребностям',
    'musicians.plan1.name': 'Индивидуальная сессия',
    'musicians.plan1.desc': 'Идеально для пробы наших услуг',
    'musicians.plan1.benefit1': 'Полная оценка инструментальной осанки',
    'musicians.plan1.benefit2': 'Лечение специфических напряжений',
    'musicians.plan1.benefit3': 'Персонализированные домашние упражнения',
    'musicians.plan1.benefit4': 'Советы по профилактике',
    'musicians.plan1.result': 'Немедленное облегчение и большая осознанность тела',
    'musicians.plan2.name': 'Начальный пакет',
    'musicians.plan2.desc': 'Идеально для установления прочного основания',
    'musicians.plan2.benefit1': 'Все из индивидуального плана',
    'musicians.plan2.benefit2': 'Персонализированный мониторинг и корректировка',
    'musicians.plan2.benefit3': 'Прогрессивная программа упражнений',
    'musicians.plan2.benefit4': 'Постоянная поддержка через WhatsApp',
    'musicians.plan2.result': 'Значительные улучшения в технике и комфорте',
    'musicians.plan2.popular': 'Самый популярный',
    'musicians.plan2.save': 'Вы экономите',
    'musicians.plan3.name': 'Полная программа',
    'musicians.plan3.desc': 'Полное решение для профессиональных музыкантов',
    'musicians.plan3.benefit1': 'Все из предыдущих планов',
    'musicians.plan3.benefit2': 'Питательный план для музыкантов',
    'musicians.plan3.benefit3': 'Продвинутые техники релаксации',
    'musicians.plan3.benefit4': 'Бесплатный обзор 360°',
    'musicians.plan3.result': 'Полная трансформация вашего музыкального благополучия',
    'musicians.plan.cta': 'Выбрать',

    // Students personalized service
    'students.hero.badge': 'Специализированно для студентов',
    'students.hero.title': 'Студенты',
    'students.hero.subtitle': 'Управление стрессом учебы, улучшение концентрации и уход за осанкой',
    'students.challenges.title': 'Общие проблемы',
    'students.challenge1.title': 'Стресс от экзаменов',
    'students.challenge1.desc':
      'Тревога и напряжение, влияющие на академическую производительность',
    'students.challenge2.title': 'Ограниченная концентрация',
    'students.challenge2.desc': 'Трудность поддержания внимания во время долгих учебных сессий',
    'students.challenge3.title': 'Постуральные напряжения',
    'students.challenge3.desc': 'Боль в спине и шее от сидения многие часы за учебой',
    'students.help.title': 'Как мы помогаем',
    'students.help1.title': 'Управляет академическим стрессом',
    'students.help1.desc': 'Техники релаксации для уменьшения тревоги от экзаменов',
    'students.help2.title': 'Улучшает концентрацию',
    'students.help2.desc': 'Упражнения для увеличения продолжительности внимания и памяти',
    'students.help3.title': 'Корректирует учебную осанку',
    'students.help3.desc': 'Постуральные корректировки для предотвращения боли во время учебы',
    'students.result.title': 'Результат',
    'students.result.desc':
      'Лучшая академическая производительность, меньше стресса и больше энергии',
    'students.stats.concentration': 'Больше концентрации',
    'students.stats.tension': 'Меньше напряжения',
    'students.stats.stress': 'Меньше стресса',
    'students.session.title': 'Сессия для студентов',

    // Office Workers specific translations
    'office.stats.pain': 'Меньше боли',
    'office.stats.posture': 'Лучшая осанка',
    'office.stats.stress': 'Меньше стресса',
    'office.session.title': 'Сессия для офисных работников',
    'office.session.plans': 'Посмотреть планы',

    // FAQ Section
    'faq.title': 'Часто задаваемые вопросы',
    'faq.subtitle': 'Найдите ответы на самые распространенные вопросы о наших услугах',
    'faq.q1.question': 'Сколько длится типичная сессия?',
    'faq.q1.answer':
      'Сессии обычно длятся от 60 до 90 минут, в зависимости от выбранного терапии и ваших конкретных потребностей.',
    'faq.q2.question': 'Нужен ли мне предыдущий опыт?',
    'faq.q2.answer':
      'Предыдущий опыт не нужен. Все наши процедуры адаптируются к вашему уровню и конкретным потребностям.',
    'faq.q3.question': 'Как часто мне следует приходить?',
    'faq.q3.answer':
      'В зависимости от ваших целей, мы рекомендуем 1-2 сессии в неделю первоначально, а затем ежемесячные поддерживающие сессии.',
    'faq.q4.question': 'Какие способы оплаты вы принимаете?',
    'faq.q4.answer':
      'Мы принимаем наличные, кредитные и дебетовые карты, а также bizum для удобства.',
    'faq.q5.question': 'Могу ли я отменить или перенести встречу?',
    'faq.q5.answer': 'Да, вы можете отменить или перенести за 24 часа без дополнительной платы.',

    // First Time Visitor Form
    'form.badge': 'Персонализированное открытие',
    'form.title': 'Найдите идеальную услугу для вас',
    'form.subtitle':
      'Ответьте на несколько быстрых вопросов, и мы поможем вам найти идеальную терапию',
    'form.contactWhatsApp': 'Связаться через WhatsApp',
    'form.step': 'Шаг',
    'form.of': 'Из',
    'form.previous': 'Предыдущий',
    'form.next': 'Следующий',
    'form.seeRecommendation': 'Посмотреть рекомендацию',
    'form.backToForm': 'Вернуться к форме',
    'form.close': 'Закрыть',
    'form.closeForm': 'Закрыть форму',

    'discovery.step.description.title': 'Расскажите нам о вашем случае',
    'discovery.step.description.subtitle':
      'Опишите ваши симптомы, боль или то, чего вы хотите достичь, чтобы мы могли это проанализировать.',
    'discovery.step.description.placeholder':
      'Например: у меня болит поясница, когда я долго сижу, и в последнее время я чувствую сильный стресс...',

    'form.step1.question': 'Какой ваш основной профиль?',
    'form.userType.officeWorker': 'Офисный работник',
    'form.userType.officeWorkerDesc': 'Я провожу много часов сидя перед компьютером',
    'form.userType.athlete': 'Спортсмен',
    'form.userType.athleteDesc':
      'Я регулярно занимаюсь спортом или являюсь профессиональным спортсменом',
    'form.userType.artist': 'Артист или творец',
    'form.userType.artistDesc': 'Я работаю руками (живопись, скульптура, ремесла)',
    'form.userType.musician': 'Музыкант',
    'form.userType.musicianDesc': 'Я регулярно играю на музыкальных инструментах',
    'form.userType.student': 'Студент',
    'form.userType.studentDesc': 'Я учусь или готовлюсь к экзаменам',
    'form.userType.general': 'Другие профили',
    'form.userType.generalDesc': 'Ни один из вышеперечисленных или комбинация нескольких',

    'form.step2.question': 'Каковы ваши цели? (Выберите все подходящие)',
    'form.goals.musclePain': 'Облегчить мышечную боль и напряжение',
    'form.goals.stress': 'Снизить стресс и тревогу',
    'form.goals.posture': 'Улучшить осанку',
    'form.goals.relaxation': 'Расслабление и отключение',
    'form.goals.recovery': 'Восстановление после упражнений',
    'form.goals.sleep': 'Улучшить качество сна',
    'form.goals.emotions': 'Управлять эмоциями',
    'form.goals.energy': 'Увеличить энергию и жизненную силу',

    'form.step3.question': 'Сколько времени у вас есть на сессию?',
    'form.time.short': 'Менее 1 часа',
    'form.time.standard': '1-1,5 часа',
    'form.time.long': 'Более 1,5 часов',

    'form.step4.question': 'Какой у вас опыт работы с телесными терапиями?',
    'form.experience.none': 'Это мой первый раз',
    'form.experience.noneDesc': 'Я никогда не получал телесных терапий',
    'form.experience.some': 'У меня есть некоторый опыт',
    'form.experience.someDesc': 'Я иногда ходил на массаж или терапии',
    'form.experience.experienced': 'У меня есть опыт',
    'form.experience.experiencedDesc': 'Я регулярно получаю терапии',

    'form.step5.question': 'Какой тип интенсивности вы предпочитаете?',
    'form.intensity.gentle': 'Мягкий и расслабляющий',
    'form.intensity.gentleDesc': 'Я предпочитаю мягкое и спокойное методы работы',
    'form.intensity.medium': 'Умеренный',
    'form.intensity.mediumDesc':
      'Сбалансированное методы работы между расслаблением и глубокой работой',
    'form.intensity.deep': 'Интенсивный и глубокий',
    'form.intensity.deepDesc': 'Я хочу глубокую работу для конкретных напряжений',

    'form.recommendation.badge': 'Персонализированная рекомендация',
    'form.recommendation.title': 'Ваша идеальная услуга',
    'form.recommendation.subtitle': 'На основе вашего профиля мы нашли идеальную услугу для вас',
    'form.recommendation.price': 'Цена',
    'form.recommendation.duration': 'Продолжительность',
    'form.recommendation.benefits': 'Основные преимущества',

    'form.recommendation.officeWorker.title': 'Сессия для офисных работников',
    'form.recommendation.officeWorker.desc':
      'Специализированная терапия для облегчения напряжения от сидячей работы, улучшения осанки и снижения рабочего стресса',
    'form.recommendation.officeWorker.benefit1': 'Облегчает боль в шее и спине',
    'form.recommendation.officeWorker.benefit2': 'Улучшает осанку за компьютером',
    'form.recommendation.officeWorker.benefit3': 'Снижает рабочий стресс',
    'form.recommendation.officeWorker.benefit4': 'Больше энергии для работы',

    'form.recommendation.athlete.title': 'Сессия для спортсменов',
    'form.recommendation.athlete.desc':
      'Восстановление мышц, предотвращение травм и оптимизация спортивных результатов со специализированными техниками',
    'form.recommendation.athlete.benefit1': 'Ускоряет восстановление мышц',
    'form.recommendation.athlete.benefit2': 'Предотвращает травмы',
    'form.recommendation.athlete.benefit3': 'Улучшает гибкость',
    'form.recommendation.athlete.benefit4': 'Оптимизирует производительность',

    'form.recommendation.artist.title': 'Сессия для артистов',
    'form.recommendation.artist.desc':
      'Специальный уход за руками, руками и осанкой для визуальных художников. Освобождает творчество, устраняя физические напряжения',
    'form.recommendation.artist.benefit1': 'Уход за руками и запястьями',
    'form.recommendation.artist.benefit2': 'Улучшает творческую осанку',
    'form.recommendation.artist.benefit3': 'Освобождает творчество',
    'form.recommendation.artist.benefit4': 'Предотвращает травмы от повторяющегося использования',

    'form.recommendation.musician.title': 'Сессия для музыкантов',
    'form.recommendation.musician.desc':
      'Специализированная терапия для музыкантов: предотвращение травм, улучшение техники и управление сценической тревогой',
    'form.recommendation.musician.benefit1': 'Предотвращает музыкальные травмы',
    'form.recommendation.musician.benefit2': 'Улучшает технику',
    'form.recommendation.musician.benefit3': 'Управляет сценической тревогой',
    'form.recommendation.musician.benefit4': 'Специфическая релаксация',

    'form.recommendation.student.title': 'Сессия для студентов',
    'form.recommendation.student.desc':
      'Управление стрессом от учебы, улучшение концентрации и постуральный уход для студентов',
    'form.recommendation.student.benefit1': 'Снижает стресс от экзаменов',
    'form.recommendation.student.benefit2': 'Улучшает концентрацию',
    'form.recommendation.student.benefit3': 'Корректирует осанку при учебе',
    'form.recommendation.student.benefit4': 'Больше энергии для учебы',

    'form.recommendation.holistic.title': 'Интегральная холистическая сессия',
    'form.recommendation.holistic.desc':
      'Комбинация терапевтического массажа и кинезиологии для полного терапии тела и эмоций',
    'form.recommendation.holistic.benefit1': 'Интегральное методы работы',
    'form.recommendation.holistic.benefit2': 'Баланс тела и разума',
    'form.recommendation.holistic.benefit3': 'Облегчает физические напряжения',
    'form.recommendation.holistic.benefit4': 'Управляет эмоциями',

    'form.recommendation.therapeutic.title': 'Терапевтический массаж',
    'form.recommendation.therapeutic.desc':
      'Специализированная сессия для облегчения мышечной боли, напряжений и улучшения телесной подвижности',
    'form.recommendation.therapeutic.benefit1': 'Облегчает мышечную боль',
    'form.recommendation.therapeutic.benefit2': 'Улучшает подвижность',
    'form.recommendation.therapeutic.benefit3': 'Снижает напряжения',
    'form.recommendation.therapeutic.benefit4': 'Глубокая релаксация',

    'form.recommendation.kinesiology.title': 'Холистическая кинезиология',
    'form.recommendation.kinesiology.desc':
      'Терапия, которая сочетает телесные и эмоциональные техники для восстановления баланса вашего общего состояния',
    'form.recommendation.kinesiology.benefit1': 'Эмоциональный баланс',
    'form.recommendation.kinesiology.benefit2': 'Управление стрессом',
    'form.recommendation.kinesiology.benefit3': 'Улучшает самосознание',
    'form.recommendation.kinesiology.benefit4': 'Внутренний покой',

    'form.recommendation.discovery.title': 'Сессия открытия',
    'form.recommendation.discovery.desc':
      'Начальная сессия для изучения ваших потребностей и создания персонализированного плана для вашего благополучия',
    'form.recommendation.discovery.benefit1': 'Полная оценка',
    'form.recommendation.discovery.benefit2': 'Персонализированный план',
    'form.recommendation.discovery.benefit3': 'Первый опыт',
    'form.recommendation.discovery.benefit4': 'Профессиональное руководство',

    'seo.students.title': 'Терапия для студентов | EKA Balance',
    'seo.students.description':
      'Снятие стресса и улучшение осанки для студентов. Персонализированные сессии для улучшения концентрации и снижения учебного напряжения.',
    'seo.students.keywords':
      'Терапия для студентов, снятие учебного стресса, коррекция осанки, улучшение концентрации, массаж для студентов барселона',

    'seo.officeWorkers.title': 'Благополучие для офисных работников | EKA Balance',
    'seo.officeWorkers.description':
      'Решения для боли в спине, шее и запястьях, вызванной офисной работой. Улучшите осанку и снизьте рабочий стресс.',
    'seo.officeWorkers.keywords':
      'Офисная эргономика, боль в спине офис, синдром запястного канала, снятие рабочего стресса, массаж для руководителей барселона',

    'seo.musicians.title': 'Физиотерапия и благополучие для музыкантов | EKA Balance',
    'seo.musicians.description':
      'Специализированные процедуры для музыкантов. Профилактика травм, улучшение производительности и управление сценической тревогой.',
    'seo.musicians.keywords':
      'Терапия для музыкантов, травмы музыкантов, сценическая тревога, музыкальная эргономика, физиотерапия исполнительских искусств',

    'seo.artists.title':
      'Терапия для художников и артистов - Творчество и благополучие | EKA Balance',
    'seo.artists.description':
      'Услуги для людей искусства. Раскройте свой творческий потенциал, уменьшите стресс и улучшите художественное самовыражение.',
    'seo.artists.keywords':
      'Терапия для артистов, творчество, эмоциональное благополучие, художественное самовыражение, арт-терапия Барселона',

    'seo.adults.title': 'Комплексное благополучие для взрослых - Здоровье и баланс | EKA Balance',
    'seo.adults.description':
      'Персонализированные методы лечения для взрослых: управление стрессом, снятие хронической боли и улучшение качества жизни. Массаж, кинезиология и многое другое.',
    'seo.adults.keywords':
      'Благополучие взрослых, управление стрессом, хроническая боль, терапевтический массаж, кинезиология Барселона',

    'seo.children.title': 'Терапия для детей - Развитие и рост | EKA Balance',
    'seo.children.description':
      'Поддержка детского развития с помощью кинезиологии и мягких методов. Помогаем при проблемах с обучением, эмоциональных сложностях и координации.',
    'seo.children.keywords':
      'Терапия для детей, детское развитие, детская кинезиология, трудности обучения, психомоторная координация Барселона',

    'seo.families.title': 'Благополучие для семей - Гармония и связь | EKA Balance',
    'seo.families.description':
      'Пространство здоровья для всей семьи. Улучшите совместную жизнь, уменьшите напряжение и найдите семейный баланс с помощью наших системных методов.',
    'seo.families.keywords':
      'Семейное благополучие, семейная терапия, гармония в доме, семейная кинезиология, отношения родителей и детей Барселона',

    'seo.athletes.title': 'Спортивное восстановление и производительность | EKA Balance',
    'seo.athletes.description':
      'Спортивный массаж и восстановительные терапии для спортсменов. Улучшите свои результаты, предотвратите травмы и восстанавливайтесь быстрее.',
    'seo.athletes.keywords':
      'Спортивный массаж, восстановление спортсменов, профилактика спортивных травм, улучшение производительности, спортивная физиотерапия барселона',

    'seo.parents.title': 'Благополучие и энергия для родителей | EKA Balance',
    'seo.parents.description':
      'Поддержка для родителей. Восстановите энергию, снизьте стресс и найдите баланс между семейной и личной жизнью.',
    'seo.parents.keywords':
      'Родительский стресс, послеродовое восстановление, энергия родителей, семейное благополучие, расслабляющий массаж для родителей',

    // Common translations for personalized pages
    'common.askQuestions': 'Задать вопросы',
    'common.learnMore': 'Узнать больше',
    'common.recommended': 'Рекомендуется',
    'common.back': 'Назад',
    'common.continue': 'Продолжить',
    'common.disclaimer':
      'Услуги EKA Balance являются дополнительной поддержкой, а не медицинской. Они не заменяют профессиональную диагностику или методы работы. Цель - сопровождать вас к большему благополучию, осознанности и глобальному балансу.',

    'contact.form.whatsapp': 'WhatsApp',
    'contact.form.preferredTime': 'Предпочтительное время',
    'contact.form.selectTime': 'Выберите время',

    // Cookie translations
    'cookies.title': 'Мы используем файлы cookie для улучшения вашего опыта',
    'cookies.description':
      'Мы используем основные файлы cookie для функциональности веб-сайта и анонимную аналитику для улучшения наших услуг. Мы не используем рекламные файлы cookie или файлы отслеживания. Продолжая использовать наш сайт, вы соглашаетесь на использование файлов cookie.',
    'cookies.accept': 'Принять все',
    'cookies.reject': 'Отклонить',
    'cookies.learnMore': 'Узнать больше',

    // Layout footer
    'footer.privacyPolicy': 'Политика конфиденциальности',
    'footer.cookiePolicy': 'Политика использования файлов cookie',
    'footer.termsOfService': 'Условия обслуживания',
    'footer.logout': 'Выход',
    'footer.login': 'Вход',

    // Service pages
    'services.page.benefits': 'Преимущества',
    'services.page.testimonials': 'Отзывы',
    'services.page.sessions': 'Сеансы',
    'services.page.duration': 'Продолжительность',
    'services.page.price': 'Цена',

    // Policy pages
    'policy.lastUpdated': 'Последнее обновление:',
    'policy.introduction': 'Введение',

    // SEO
    'seo.home.title': 'EKA Balance | терапевтический массаж и кинезиология в барселоне',
    'seo.home.description':
      'Центр комплексного благополучия в барселоне. Специалисты по терапевтическому массажу, холистической кинезиологии и персонализированным терапиям для снятия боли и стресса.',
    'seo.home.keywords':
      'Массаж барселона, кинезиология, благополучие, мануальная терапия, боль в спине, стресс, релаксация',

    // Onboarding
    'onboarding.welcome.title': 'Добро пожаловать в ваш персонализированный опыт',
    'onboarding.welcome.description':
      'Ответьте на несколько коротких вопросов, чтобы мы могли порекомендовать вам идеальную услугу.',
    'onboarding.welcome.discountBadge': 'Скидка 15€ на первую сессию',
    'onboarding.progress.step': 'Шаг',
    'onboarding.progress.of': 'Из',
    'onboarding.processing.title': 'Обработка ваших ответов...',
    'onboarding.processing.subtitle':
      'Мы анализируем ваш профиль, чтобы найти лучшую рекомендацию.',
    'onboarding.finish': 'Завершить',
    'onboarding.results.title': 'Ваша персонализированная рекомендация',
    'onboarding.results.subtitle': 'На основе ваших ответов мы рекомендуем:',
    'onboarding.results.recommended': 'Рекомендуется',
    'onboarding.results.discountApplied': '🎁 -15€ Первая сессия',
    'onboarding.results.howYouWillFeel': 'Как вы будете себя чувствовать',
    'onboarding.results.personalizedInfo': 'Персонализированная информация',

    // Personalized Pages SEO
    'personalized.office.title': 'Терапия для офисных работников | EKA Balance',
    'personalized.office.description':
      'Облегчите боль в спине и рабочий стресс с помощью наших специализированных терапий для офисных работников в барселоне.',
    'personalized.office.keywords':
      'Офисный массаж, боль в спине компьютер, рабочий стресс, эргономика, барселона',

    'personalized.athletes.title': 'Спортивный массаж и восстановление | EKA Balance',
    'personalized.athletes.description':
      'Улучшите свои результаты и ускорьте восстановление с помощью наших спортивных массажей и терапий для спортсменов в барселоне.',
    'personalized.athletes.keywords':
      'Спортивный массаж, восстановление мышц, спортивные травмы, производительность, барселона',

    'personalized.artists.title': 'Благополучие для художников и творцов | EKA Balance',
    'personalized.artists.description':
      'Позаботьтесь о своих руках и осанке. Специализированные терапии для визуальных художников, музыкантов и творцов в барселоне.',
    'personalized.artists.keywords':
      'Массаж для художников, боль в руках, творческая осанка, благополучие творцов, барселона',

    'personalized.musicians.title': 'Физиотерапия и массаж для музыкантов | EKA Balance',
    'personalized.musicians.description':
      'Профилактика травм и улучшение производительности для музыкантов. Специализированные процедуры в барселоне.',
    'personalized.musicians.keywords':
      'Массаж для музыкантов, травмы музыкантов, фокальная дистония, музыкальная осанка, барселона',

    'personalized.students.title': 'Релаксация и концентрация для студентов | EKA Balance',
    'personalized.students.description':
      'Снизьте стресс от экзаменов и улучшите концентрацию с помощью наших терапий для студентов в барселоне.',
    'personalized.students.keywords':
      'Стресс экзамены, концентрация, учебная осанка, массаж для студентов, барселона',

    'personalized.parents.title': 'Благополучие для родителей | EKA Balance',
    'personalized.parents.description':
      'Найдите свой момент покоя. Терапии для снятия стресса и усталости от воспитания детей в барселоне.',
    'personalized.parents.keywords':
      'Стресс родителей, послеродовое восстановление, усталость воспитания, расслабляющий массаж, барселона',

    // Common
    'common.price': 'Цена',
    'common.duration': 'Продолжительность',
    'common.benefits': 'Преимущества',
    'common.book': 'Забронировать',
    'common.next': 'Далее',
    'common.submit': 'Отправить',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.required': 'Обязательно',
    'common.optional': 'Необязательно',
    'common.close': 'Закрыть',
    'common.menu': 'Меню',
    'common.home': 'Главная',
    'common.services': 'Услуги',
    'common.about': 'О нас',
    'common.blog': 'Блог',
    'common.faq': 'Часто задаваемые вопросы',
    'common.privacy': 'Конфиденциальность',
    'common.terms': 'Условия',
    'common.cookies': 'Файлы cookie',
    'common.copyright': 'Авторское право',
    'common.language': 'Язык',
    'common.spanish': 'Испанский',
    'common.english': 'Английский',
    'common.catalan': 'Каталанский',
    'common.russian': 'Русский',

    // Elena SEO
    'elena.seo.title': 'О елене | холистический терапевт в барселоне',
    'elena.seo.desc':
      'Познакомьтесь с еленой, терапевтом, специализирующимся на массаже, кинезиологии и комплексном благополучии. Более 10 лет опыта помощи людям в восстановлении баланса.',
    'elena.seo.keywords':
      'Елена терапевт, массаж барселона, кинезиология, холистический терапевт, благополучие',

    // Casos SEO
    'casos.seo.title': 'Истории успеха и методы работы | EKA Balance',
    'casos.seo.desc':
      'Узнайте, как мы помогли нашим клиентам преодолеть боль в спине, стресс, тревогу и другие проблемы со здоровьем с помощью наших персонализированных терапий.',
    'casos.seo.keywords':
      'Истории успеха, отзывы массаж, методы работы боли в спине, снятие стресса, результаты терапии',

    // Contact SEO
    'seo.contact.title': 'Контакты и бронирование | EKA Balance барселона',
    'seo.contact.description':
      'Забронируйте встречу в EKA Balance. Мы находимся в центре барселоны. Свяжитесь через WhatsApp, телефон или электронную почту.',
    'seo.contact.keywords':
      'Контакты EKA Balance, забронировать массаж барселона, запись кинезиология, расположение центра благополучия',

    // Services SEO
    'seo.services.title': 'Услуги благополучия и терапии | EKA Balance',
    'seo.services.description':
      'Изучите наш спектр услуг: терапевтический массаж, кинезиология, осознанное питание и персонализированные планы для вашего здоровья.',
    'seo.services.keywords':
      'Услуги благополучия, терапевтический массаж, холистическая кинезиология, питание, терапии барселона',

    // Personalized SEO
    'seo.personalized.title': 'Персонализированные терапии по профессии | EKA Balance',
    'seo.personalized.description':
      'Лечение, адаптированное к вашему образу жизни: офис, спорт, искусство, музыка или учеба. Найдите баланс в своей повседневной жизни.',
    'seo.personalized.keywords':
      'Персонализированные терапии, офисный массаж, спортивный массаж, здоровье музыкантов, благополучие художников',

    // VIP SEO
    'seo.vip.title': 'VIP клуб и членство | EKA Balance',
    'seo.vip.description':
      'Присоединяйтесь к нашему эксклюзивному клубу и наслаждайтесь скидками, приоритетом в бронировании и персонализированным мониторингом для вашего постоянного благополучия.',
    'seo.vip.keywords':
      'VIP клуб благополучия, членство массаж, скидки терапия, эксклюзивное здоровье барселона',

    // Massage SEO
    'seo.massage.title': 'Терапевтический и расслабляющий массаж | EKA Balance',
    'seo.massage.description':
      'Снимите напряжение и мышечную боль с помощью наших терапевтических массажей. Персонализированные техники для вашего восстановления и отдыха.',
    'seo.massage.keywords':
      'Терапевтический массаж, расслабляющий массаж, снятие напряжения, мышечная боль, барселона',

    // Kinesiology SEO
    'seo.kinesiology.title': 'Холистическая и эмоциональная кинезиология | EKA Balance',
    'seo.kinesiology.description':
      'Сбалансируйте тело и разум с помощью кинезиологии. Обнаружьте и лечите причину ваших физических и эмоциональных проблем.',
    'seo.kinesiology.keywords':
      'Холистическая кинезиология, мышечный тест, эмоциональный баланс, естественная терапия, барселона',

    // Nutrition SEO
    'seo.nutrition.title': 'Осознанное и здоровое питание | EKA Balance',
    'seo.nutrition.description':
      'Улучшите свое здоровье с помощью персонализированных консультаций по питанию. Научитесь правильно питаться, чтобы иметь больше энергии и жизненной силы.',
    'seo.nutrition.keywords':
      'Осознанное питание, здоровая диета, консультации по питанию, жизненная энергия, барселона',

    // Massage Page
    'massage.hero.badge': 'Искусство целительного прикосновения',
    'massage.benefits.pain': 'Облегчает мышечную и суставную боль',
    'massage.benefits.circulation': 'Улучшает кровообращение и подвижность',
    'massage.benefits.wellbeing': 'Немедленное благополучие и настоящий отдых',

    // Kinesiology Page
    'kinesiology.hero.badge': 'Тело, разум и эмоции в равновесии',
    'kinesiology.benefits.posture': 'Улучшает осанку и координацию',
    'kinesiology.benefits.stress': 'Снижает стресс и улучшает отдых',
    'kinesiology.benefits.energy': 'Больше самосознания и стабильной энергии',

    // Nutrition Page
    'nutrition.benefits.habits': 'Четкие и устойчивые пищевые привычки',
    'nutrition.benefits.weight': 'Поддержка в управлении весом и составом тела',
    'nutrition.benefits.prevention': 'Профилактика и долгосрочное здоровье',
    'nutrition.session.first.name': 'Первая сессия',
    'nutrition.session.first.description': 'Полная оценка и персонализированный план',
    'nutrition.session.followup.name': 'Последующее наблюдение',
    'nutrition.session.followup.description': 'Корректировка плана и решение вопросов',

    // Discounts Page
    'discounts.success': 'Скидка успешно применена!',
    'discounts.remove': 'Удалить скидку',

    // Discovery Form
    // Discovery Form - User Types
    'discovery.userTypes.mother.title': 'Материнство / отцовство',
    'discovery.userTypes.mother.desc':
      'Восстановление жизненной энергии для поддержания заботы о других.',
    'discovery.userTypes.woman.title': 'Женское здоровье',
    'discovery.userTypes.woman.desc': 'Гармонизация цикла и соматическое воссоединение.',
    'discovery.userTypes.regular.title': 'Общее благополучие',
    'discovery.userTypes.regular.desc': 'Профилактическое обслуживание и глубокая релаксация.',
    'discovery.userTypes.office.title': 'Исполнительный профиль',
    'discovery.userTypes.office.desc': 'Декомпрессия корпоративного стресса и осанки.',
    'discovery.userTypes.athlete.title': 'Спортивная производительность',
    'discovery.userTypes.athlete.desc': 'Биомеханическая оптимизация и активное восстановление.',

    // Discovery Form - Emotional States
    'discovery.emotional.stressed.title': 'Перегрузка системы',
    'discovery.emotional.stressed.desc': 'Состояние постоянной тревоги и накопленного напряжения.',
    'discovery.emotional.sad.title': 'Низкая жизненная энергия',
    'discovery.emotional.sad.desc': 'Потребность в реактивации и разблокировке.',
    'discovery.emotional.balanced.title': 'Относительная стабильность',
    'discovery.emotional.balanced.desc': 'Фокус на поддержании и профилактике.',
    'discovery.emotional.focus_physical.title': 'Соматический фокус',
    'discovery.emotional.focus_physical.desc': 'Приоритет на структурном и мышечном облегчении.',

    // Discovery Form - Time Commitments
    'discovery.time.short.title': 'Стандартная сессия (1.5ч)',
    'discovery.time.short.desc': 'Фокусированное и эффективное вмешательство.',
    'discovery.time.standard.title': 'Полная сессия (90 мин)',
    'discovery.time.standard.desc': 'Глубокое и интегративное лечение.',
    'discovery.time.long.title': 'Терапевтическое погружение (120 мин)',
    'discovery.time.long.desc': 'Комплексная и детальная трансформация.',

    // Discovery Form - Budget
    'discovery.budget.basic.title': 'До 60€',
    'discovery.budget.basic.desc': 'Базовый вариант',
    'discovery.budget.standard.title': '60-90â‚¬',
    'discovery.budget.standard.desc': 'До 2ч, полная модальность',
    'discovery.budget.premium.title': 'Более 75€',
    'discovery.budget.premium.desc': 'Премиум длинная сессия',

    // Discovery Form - Recommendations
    'discovery.recommendation.emotional.service': 'Эмоциональное восстановление баланса',
    'discovery.recommendation.emotional.desc':
      'Холистическая терапия для управления стрессом, тревогой или грустью. Фокусируется на преодолении эмоциональных проблем и восстановлении гармонии и счастья.',
    'discovery.recommendation.emotional.benefit1': 'Снижение стресса',
    'discovery.recommendation.emotional.benefit2': 'Эмоциональный баланс',
    'discovery.recommendation.emotional.benefit3': 'Ясность ума',
    'discovery.recommendation.emotional.benefit4': 'Внутренний покой',

    'discovery.recommendation.manual.service': 'Мануальная терапевтическая сессия',
    'discovery.recommendation.manual.desc':
      'Специализированный терапевтический массаж для облегчения боли и мышечного напряжения. Опытные профессионалы помогут вам расслабить контрактуры.',
    'discovery.recommendation.manual.benefit1': 'Облегчение боли',
    'discovery.recommendation.manual.benefit2': 'Уменьшение контрактур',
    'discovery.recommendation.manual.benefit3': 'Улучшение подвижности',
    'discovery.recommendation.manual.benefit4': 'Мышечное расслабление',

    'discovery.recommendation.integrative.service': 'Интегративное снятие напряжения (4 в 1)',
    'discovery.recommendation.integrative.desc':
      'Сочетает массаж, кинезиологию, остеопатию и движения (фельденкрайз) для глубокого облегчения хронического напряжения.',
    'discovery.recommendation.integrative.benefit1': 'Интегральное методы работы',
    'discovery.recommendation.integrative.benefit2': 'Глубокое облегчение',
    'discovery.recommendation.integrative.benefit3': 'Сочетание техник',
    'discovery.recommendation.integrative.benefit4': 'Длительные результаты',

    'discovery.recommendation.relax.service': 'Полный расслабляющий массаж',
    'discovery.recommendation.relax.desc':
      'Опыт глобального расслабления (физического и ментального), идеально, если ваша цель - просто отдохнуть и зарядиться энергией.',
    'discovery.recommendation.relax.benefit1': 'Глубокая релаксация',
    'discovery.recommendation.relax.benefit2': 'Снижение стресса',
    'discovery.recommendation.relax.benefit3': 'Обновление энергии',
    'discovery.recommendation.relax.benefit4': 'Общее благополучие',

    // Online Rec
    'discovery.recommendation.online.service': 'Онлайн-консультация / советы',
    'discovery.recommendation.online.desc':
      'Получите персональные рекомендации, не выходя из дома. Идеально для наблюдения, советов по питанию или вопросов.',
    'discovery.recommendation.online.benefit1': 'Без поездок',
    'discovery.recommendation.online.benefit2': 'Гибкий график',
    'discovery.recommendation.online.benefit3': 'Постоянное наблюдение',
    'discovery.recommendation.online.benefit4': 'Персональный план в pdf',

    'discovery.recommendation.title': 'Персонализированная рекомендация - EKA Balance',
    'discovery.recommendation.badge': 'Персонализированная рекомендация',
    'discovery.recommendation.subtitle':
      'На основе ваших ответов мы считаем, что это лучшая услуга для вас:',
    'discovery.recommendation.why': 'Почему этот вариант?',
    'discovery.analysis.intro': 'Мы определили, что',
    'discovery.analysis.have': 'У вас',
    'discovery.analysis.want': 'И вы хотите улучшить',
    'discovery.analysis.feel': 'Чтобы чувствовать себя',
    'discovery.diagnosis.title': 'Расширенная карта оценки',
    'discovery.diagnosis.profile': 'Профиль клиента',
    'discovery.diagnosis.symptoms': 'Выявленные индикаторы',
    'discovery.diagnosis.rootCause': 'Возможные первопричины',
    'discovery.diagnosis.strategy': 'Рекомендуемая стратегия',
    'discovery.diagnosis.frequency': 'Рекомендуемая частота',
    'discovery.view.basic': 'Простая рекомендация',
    'discovery.view.advanced': 'Полная оценка',
    'discovery.diagnosis.cause.posture': 'Постуральная усталость (сидячий образ жизни)',
    'discovery.diagnosis.cause.overload': 'Мышечная перегрузка',
    'discovery.diagnosis.cause.stress': 'Психосоматическое напряжение',
    'discovery.diagnosis.cause.emotional': 'Эмоциональный блок',
    'discovery.diagnosis.cause.metabolic': 'Метаболический/пищеварительный дисбаланс',
    'discovery.diagnosis.cause.structural': 'Структурный/механический дисбаланс',
    'discovery.diagnosis.cause.general': 'Потребность в обслуживании/профилактике',
    'discovery.diagnosis.strategy.structural': 'Структурное освобождение и мобильность',
    'discovery.diagnosis.strategy.regulation': 'Регуляция нервной системы',
    'discovery.diagnosis.strategy.rebalance': 'Восстановление баланса тела и разума',
    'discovery.diagnosis.freq.high': 'Интенсивный (1 сеанс/неделю в течение 3 недель)',
    'discovery.diagnosis.freq.medium': 'Поддерживающий (1 сеанс каждые 2-3 недели)',
    'discovery.diagnosis.freq.low': 'Профилактический (1 сеанс в месяц)',
    'discovery.goal.athlete': 'Ваше спортивное восстановление',
    'discovery.goal.office': 'Вашу осанку',
    'discovery.goal.stress': 'Ваше спокойствие',
    'discovery.goal.pain': 'Ваш физический комфорт',
    'discovery.goal.general': 'Ваше общее самочувствие',
    'discovery.feeling.relaxed': 'Расслабленным',
    'discovery.feeling.energized': 'Энергичным',
    'discovery.feeling.balanced': 'Сбалансированным',
    'discovery.feeling.painfree': 'Без боли',
    'discovery.recommendation.book': 'Забронировать эту сессию',
    'discovery.recommendation.restart': 'Начать сначала',

    // Discovery Form - Steps
    'discovery.step1.title': 'Как вы себя определяете?',
    'discovery.step1.subtitle': 'Выберите вариант, который лучше всего вас описывает',
    'discovery.step2.title': 'Где вы чувствуете наибольшее напряжение?',
    'discovery.step2.subtitle': 'Вы можете выбрать несколько вариантов',
    'discovery.step3.title': 'У вас есть какие-либо особые условия?',
    'discovery.step3.subtitle': 'Это помогает нам адаптировать сеанс',
    'discovery.step4.title': 'Как вы себя чувствуете эмоционально?',
    'discovery.step4.subtitle': 'Эмоциональное благополучие является ключом к физическому здоровью',
    'discovery.step5.title': 'Сколько времени у вас есть?',
    'discovery.step5.subtitle': 'Мы адаптируем сессию к вашему расписанию',
    'discovery.step6.title': 'Какой у вас бюджет?',
    'discovery.step6.subtitle': 'Мы найдем лучший вариант для вас',
    'discovery.next': 'Далее',
    'discovery.back': 'Назад',
    'discovery.seeRecommendation': 'Посмотреть рекомендацию',
    'common.step': 'Шаг',
    'common.of': 'Из',

    // Onboarding Questions
    'onboarding.questions.userType.title': 'Какой ваш основной профиль?',
    'onboarding.userTypes.student': 'Студент',
    'onboarding.userTypes.office': 'Офисный работник',
    'onboarding.userTypes.artist': 'Артист',
    'onboarding.userTypes.musician': 'Музыкант',
    'onboarding.userTypes.athlete': 'Спортсмен',
    'onboarding.userTypes.parent': 'Родитель',
    'onboarding.userTypes.entrepreneur': 'Предприниматель',
    'onboarding.userTypes.therapist': 'Терапевт',
    'onboarding.userTypes.senior': 'Пенсионер',
    'onboarding.userTypes.other': 'Другое',

    'onboarding.questions.goals.title': 'Что бы вы хотели улучшить?',
    'onboarding.goals.stress': 'Регуляция нервной системы и снижение тревожности',
    'onboarding.goals.pain': 'Лечение физической и структурной боли',
    'onboarding.goals.posture': 'Коррекция осанки и оптимизация подвижности',
    'onboarding.goals.sleep': 'Восстановление качества глубокого сна',
    'onboarding.goals.energy': 'Метаболическая реактивация и ясность ума',
    'onboarding.goals.focus': 'Повышение когнитивной производительности и концентрации',
    'onboarding.goals.bodyAwareness': 'Соматическая интеграция и осознание тела',
    'onboarding.goals.feelGood': 'Целостное благополучие и системный баланс',

    'onboarding.questions.preferredFeeling.title': 'Как вы хотите чувствовать себя после сеанса?',
    'onboarding.feelings.calm': 'Глубокое спокойствие и нервная регуляция',
    'onboarding.feelings.light': 'Физическая декомпрессия и свобода движения',
    'onboarding.feelings.energized': 'Обновленная жизненная сила и оптимальный мышечный тонус',
    'onboarding.feelings.focused': 'Ментальная острота и устойчивый фокус',
    'onboarding.feelings.confident': 'Соматическая уверенность и полное присутствие',

    'onboarding.questions.approach.title': 'Какой подход вы предпочитаете?',
    'onboarding.approaches.massage': 'Мануальная терапия',
    'onboarding.approaches.kinesiology': 'Клиническая кинезиология',
    'onboarding.approaches.feldenkrais': 'Метод фельденкрайза',
    'onboarding.approaches.energy': 'Биоэнергетический баланс',
    'onboarding.approaches.open': 'Открыт для клинических рекомендаций',

    'onboarding.questions.timePreference.title':
      'Сколько времени вы хотите посвятить своему благополучию сегодня?',
    'onboarding.time.60min': '1.5чут',
    'onboarding.time.90min': '90 минут',
    'onboarding.time.120min': '120 минут',

    // Recommendations Descriptions
    'recommendations.massage.description':
      'Продвинутая мануальная терапия для структурного восстановления и глубокого снятия накопленного напряжения.',
    'recommendations.kinesiology.description':
      'Клиническая кинезиология для системной регуляции и точного выявления источника дисбаланса.',
    'recommendations.feldenkrais.description':
      'Нейромышечное переобучение по методу фельденкрайза для биомеханической оптимизации и освобождения от ограничивающих паттернов.',

    // Personalized Pages - Office Workers
    'office.seo.title': 'Массаж для офиса в барселоне | EKA Balance',
    'office.seo.desc':
      'Облегчите боль в спине и шее, вызванную офисной работой. Специализированные терапии для улучшения осанки и снижения стресса.',
    'office.seo.keywords': 'Офисный массаж, боль в спине, эргономика, рабочий стресс, барселона',
    'office.problems.pain.title': 'Постуральная боль',
    'office.problems.pain.desc':
      'Боль в шее, плечах и спине из-за неправильных поз перед компьютером',
    'office.problems.stress.title': 'Рабочий стресс',
    'office.problems.stress.desc':
      'Постоянное давление, сроки и избыток ответственности, влияющие на благополучие',
    'office.problems.sedentary.title': 'Сидячий образ жизни',
    'office.problems.sedentary.desc': 'Потеря подвижности и гибкости из-за слишком долгого сидения',
    'office.benefits.techniques.title': 'Специфические техники',
    'office.benefits.techniques.desc':
      'Специфические техники для снятия контрактур в зонах, пострадавших от офисной работы',
    'office.benefits.exercises.title': 'Постуральная коррекция',
    'office.benefits.exercises.desc':
      'Упражнения и постуральные коррекции для предотвращения будущих проблем',
    'office.benefits.mindfulness.title': 'Управление стрессом',
    'office.benefits.mindfulness.desc':
      'Техники релаксации и осознанности, адаптированные к профессиональной среде',

    // Personalized Pages - Athletes
    'athletes.seo.title': 'Спортивный массаж в барселоне | EKA Balance',
    'athletes.seo.desc':
      'Улучшите свои результаты и восстанавливайтесь быстрее с нашими спортивными массажами. Профилактика травм и методы работы мышц.',
    'athletes.seo.keywords':
      'Спортивный массаж, восстановление, травмы, производительность, барселона',

    // Personalized Pages - Artists
    'artists.seo.title': 'Благополучие для художников в барселоне | EKA Balance',
    'artists.seo.desc':
      'Позаботьтесь о своих руках и теле. Терапии для визуальных художников и творцов, которым нужно поддерживать свой рабочий инструмент в форме.',
    'artists.seo.keywords':
      'Массаж для художников, боль в руках, творчество, благополучие, барселона',

    // Personalized Pages - Musicians
    'musicians.seo.title': 'Физиотерапия для музыкантов в барселоне | EKA Balance',
    'musicians.seo.desc':
      'Профилактика и методы работы травм у музыкантов. Улучшите свою технику и снизьте напряжение с помощью наших специализированных терапий.',
    'musicians.seo.keywords':
      'Массаж для музыкантов, травмы, осанка, музыкальная производительность, барселона',

    // Personalized Pages - Students
    'students.seo.title': 'Релаксация для студентов в барселоне | EKA Balance',
    'students.seo.desc':
      'Боритесь со стрессом от экзаменов и улучшайте концентрацию. Терапии, разработанные для студентов, которым нужно работать на максимуме.',
    'students.seo.keywords': 'Стресс студентов, концентрация, экзамены, учебная осанка, барселона',

    // Personalized Pages - First Time
    'firstTime.seo.title': 'Ваш первый визит | EKA Balance барселона',
    'firstTime.seo.desc':
      'Узнайте, чего ожидать на вашей первой сессии. Мы проведем вас шаг за шагом, чтобы вы чувствовали себя комфортно и расслабленно.',
    'firstTime.seo.keywords':
      'Первый визит, массаж барселона, чего ожидать, благополучие, релаксация',

    // Personalized Pages - Detailed Content
    'personalized.students.hero.title': 'Студенты',
    'personalized.students.hero.description':
      'Управление стрессом и улучшение академической успеваемости.',
    'personalized.students.understanding.title': 'Мы понимаем ваши проблемы',
    'personalized.students.understanding.description1':
      'Давление экзаменов и долгие часы учебы могут повлиять на ваше физическое и психическое здоровье.',
    'personalized.students.understanding.description2':
      'Мы помогаем вам найти баланс, чтобы вы могли работать на максимуме, не жертвуя своим благополучием.',
    'personalized.students.understanding.callToAction': 'Забронируйте сессию',
    'personalized.students.services.title': 'Рекомендуемые услуги',
    'personalized.students.services.subtitle': 'Терапии, разработанные для студентов',
    'personalized.students.services.kinesiologyStress.title': 'Кинезиология от стресса',
    'personalized.students.services.kinesiologyStress.description':
      'Сбалансируйте свою нервную систему и снизьте тревогу перед экзаменами.',
    'personalized.students.services.relaxingMassage.title': 'Расслабляющий массаж',
    'personalized.students.services.relaxingMassage.description':
      'Снимите напряжение, накопившееся в шее и спине из-за учебы.',
    'personalized.students.testimonial.title': 'Что говорят студенты',
    'personalized.students.testimonial.quote':
      '"это очень помогло мне лучше концентрироваться и спать перед экзаменами."',
    'personalized.students.testimonial.author': 'Лаура, студентка медицины',

    'personalized.officeWorkers.hero.title': 'Офисные работники',
    'personalized.officeWorkers.hero.description': 'Облегчение боли и коррекция осанки.',
    'personalized.officeWorkers.understanding.title': 'Влияние сидячей работы',
    'personalized.officeWorkers.understanding.description1':
      'Многочасовое сидение перед компьютером может вызвать хронические боли и усталость.',
    'personalized.officeWorkers.understanding.description2':
      'Наши терапии направлены на противодействие этим эффектам и улучшение качества вашей трудовой жизни.',
    'personalized.officeWorkers.understanding.callToAction': 'Улучшите свое благополучие',
    'personalized.officeWorkers.services.title': 'Услуги для вас',
    'personalized.officeWorkers.services.subtitle': 'Решения для офисной среды',
    'personalized.officeWorkers.services.therapeuticMassage.title': 'Терапевтический массаж',
    'personalized.officeWorkers.services.therapeuticMassage.description':
      'Глубокая проработка контрактур в спине и шее.',
    'personalized.officeWorkers.services.feldenkrais.title': 'Метод фельденкрайза',
    'personalized.officeWorkers.services.feldenkrais.description':
      'Научитесь сидеть и двигаться с большей легкостью и меньшими усилиями.',
    'personalized.artists.hero.title': 'Артисты',
    'personalized.artists.hero.description':
      'Уход за руками, руками и осанкой для визуальных художников и творцов',
    'personalized.artists.understanding.title': 'Общие проблемы',
    'personalized.artists.understanding.description1':
      'Боль от повторяющихся движений во время долгих творческих сессий.',
    'personalized.artists.understanding.description2':
      'Напряжение шеи и спины от длительных поз во время творчества.',
    'personalized.artists.understanding.callToAction':
      'Мы помогаем устранить физические напряжения, блокирующие творческий процесс.',
    'personalized.artists.services.title': 'Как мы помогаем',
    'personalized.artists.services.subtitle': 'Специализированные процедуры для художников',
    'personalized.artists.benefits.title': 'Ожидаемый результат',
    'personalized.artists.method.title': 'Наш протокол для артистов',
    'personalized.artists.method.step1.title': 'Оценка',
    'personalized.artists.method.step1.desc': 'Мы анализируем вашу осанку и технические жесты.',
    'personalized.artists.method.step2.title': 'Лечение',
    'personalized.artists.method.step2.desc': 'Мануальная терапия для снятия напряжения и боли.',
    'personalized.artists.method.step3.title': 'Профилактика',
    'personalized.artists.method.step3.desc':
      'Упражнения и рекомендации для поддержания здоровья во время творчества.',
    'personalized.artists.benefits.benefit1':
      'Больше комфорта, плавности и творчества в вашем процессе.',
    'personalized.artists.benefits.benefit2': 'Уменьшение боли и мышечного напряжения.',
    'personalized.artists.benefits.benefit3': 'Большая осознанность тела и осанки.',

    'personalized.officeWorkers.testimonial.title': 'Отзыв',
    'personalized.officeWorkers.testimonial.quote':
      '"с тех пор как я хожу в EKA Balance, моя боль в спине исчезла."',
    'personalized.officeWorkers.testimonial.author': 'Карлос, программист',

    'personalized.musicians.hero.title': 'Музыканты',
    'personalized.musicians.hero.description': 'Уход за телом для лучшего исполнения.',
    'personalized.musicians.understanding.title': 'Ваше тело - ваш инструмент',
    'personalized.musicians.understanding.description1':
      'Интенсивная музыкальная практика требует особого физического ухода для предотвращения травм.',
    'personalized.musicians.understanding.description2':
      'Мы помогаем вам поддерживать ваше тело настроенным, чтобы вы могли играть свободно.',
    'personalized.musicians.understanding.callToAction': 'Позаботьтесь о своем инструменте',
    'personalized.musicians.services.title': 'Специализированные услуги',
    'personalized.musicians.services.subtitle': 'Для музыкантов всех уровней',
    'personalized.musicians.services.feldenkraisExpression.title':
      'Фельденкрайз для выразительности',
    'personalized.musicians.services.feldenkraisExpression.description':
      'Улучшите осознание тела и связь с инструментом.',
    'personalized.musicians.services.kinesiologyPerformance.title':
      'Кинезиология для производительности',
    'personalized.musicians.services.kinesiologyPerformance.description':
      'Оптимизируйте координацию и снизьте сценическое напряжение.',
    'personalized.musicians.testimonial.title': 'Мнение музыканта',
    'personalized.musicians.testimonial.quote':
      '"я обрела большую свободу движений при игре на скрипке."',
    'personalized.musicians.testimonial.author': 'Ана, скрипачка',

    'personalized.athletes.hero.title': 'Спортсмены',
    'personalized.athletes.hero.description': 'Оптимизация производительности и восстановление.',
    'personalized.athletes.understanding.title': 'Поднимите свое тело на новый уровень',
    'personalized.athletes.understanding.description1':
      'Интенсивные тренировки требуют адекватного восстановления, чтобы избежать перетренированности.',
    'personalized.athletes.understanding.description2':
      'Наши терапии ускоряют ваше восстановление и помогают предотвратить травмы.',
    'personalized.athletes.understanding.callToAction': 'Увеличьте свою производительность',
    'personalized.athletes.services.title': 'Спортивные услуги',
    'personalized.athletes.services.subtitle': 'Для атлетов и любителей',
    'personalized.athletes.services.sportsMassage.title': 'Спортивный массаж',
    'personalized.athletes.services.sportsMassage.description':
      'Подготовьте мышцы и восстановитесь после нагрузки.',
    'personalized.athletes.services.osteobalance.title': 'Остеобаланс',
    'personalized.athletes.services.osteobalance.description':
      'Мягкое структурное выравнивание для улучшения биомеханики.',
    'personalized.athletes.testimonial.title': 'Опыт спортсмена',
    'personalized.athletes.testimonial.quote': '"мое время восстановления заметно улучшилось."',
    'personalized.athletes.testimonial.author': 'Марк, бегун',

    'personalized.parents.hero.title': 'Родители',
    'personalized.parents.hero.description': 'Восстановите энергию и благополучие.',
    'personalized.parents.understanding.title': 'Заботиться о себе, чтобы заботиться о них',
    'personalized.parents.understanding.description1':
      'Воспитание детей требует много сил, и мы часто забываем о собственных потребностях.',
    'personalized.parents.understanding.description2':
      'Мы предлагаем вам пространство, чтобы перезарядиться и найти свой баланс.',
    'personalized.parents.understanding.callToAction': 'Уделите время себе',
    'personalized.parents.services.title': 'Услуги для родителей',
    'personalized.parents.services.subtitle': 'Семейное благополучие',
    'personalized.parents.services.emotionalKinesiology.title': 'Эмоциональная кинезиология',
    'personalized.parents.services.emotionalKinesiology.description':
      'Управляйте стрессом и эмоциями воспитания.',
    'personalized.parents.services.relaxingMassage.title': 'Расслабляющий массаж',
    'personalized.parents.services.relaxingMassage.description':
      'Момент покоя и полного отключения.',
    'personalized.parents.testimonial.title': 'Отзыв мамы',
    'personalized.parents.testimonial.quote':
      '"это мой священный момент недели. я выхожу обновленной."',
    'personalized.parents.testimonial.author': 'София, мама двоих детей',

    // Contact Page
    'contact.hero.badge': 'Мы здесь для вас',
    'contact.hero.title': 'Свяжитесь',
    'contact.hero.titleHighlight': 'с нами',
    'contact.hero.description':
      'Мы здесь, чтобы помочь вам на пути к благополучию. Свяжитесь с нами для бронирования, запросов или любых вопросов о наших услугах.',
    'contact.whatsapp': 'WhatsApp +34 658 867 133',
    'contact.callNow': 'Позвонить сейчас',
    'contact.faq.title': 'Часто задаваемые вопросы',
    'contact.faq.subtitle': 'Всё, что нужно знать о том, как с нами связаться',
    'contact.faq.q1.title': 'Как я могу забронировать встречу?',
    'contact.faq.q1.answer':
      'Вы можете забронировать встречу, написав в WhatsApp или Telegram по номеру +34 658 867 133, позвонив нам по тому же номеру или отправив нам электронное письмо.',
    'contact.faq.q2.title': 'Какова политика отмены?',
    'contact.faq.q2.answer':
      'Бесплатная отмена возможна за 24 часа до встречи. VIP-пользователи могут отменить за 12 часов.',
    'contact.faq.q3.title': 'Вы предлагаете скидки или VIP-планы?',
    'contact.faq.q3.answer':
      'Да, у нас есть VIP-планы со скидками до 25% и эксклюзивными преимуществами, такими как приоритетное бронирование и бесплатные телефонные консультации.',
    'contact.faq.q4.title': 'Что мне нужно взять на первую сессию?',
    'contact.faq.q4.answer':
      'Возьмите удобную одежду, любые соответствующие медицинские заключения и список лекарств, которые вы принимаете в настоящее время. Мы предоставляем полотенца.',

    'personalizedServices.business': 'Для Бизнеса',
    'personalizedServices.business.desc':
      'Корпоративное здоровье, групповые занятия и консалтинг для снижения стресса.',
    'personalizedServices.business.benefit1': 'Снижает выгорание команды',
    'personalizedServices.business.benefit2': 'Улучшает осанку и здоровье',
    'personalizedServices.business.benefit3': 'Повышает продуктивность',
    'personalized.business.hero.title': 'Здоровье вашей команды',
    'personalized.business.hero.description':
      'Мы заботимся о здоровье вашей компании с помощью индивидуальных программ: от массажа в офисе до семинаров по осанке. Работа не должна приносить боль.',
    'personalized.business.bento.title': 'Корпоративный велнес в красивом исполнении',
    'personalized.business.bento.subtitle':
      'Помогите вашей команде восстановить концентрацию и развить стрессоустойчивость через осознанное движение.',
    'personalized.business.bento.box1.title': 'Сплоченность Команды',
    'personalized.business.bento.box1.desc':
      'Создавайте более прочные связи благодаря совместному физическому опыту и осознанным тренировкам.',
    'personalized.business.bento.box2.title': 'Повышение Продуктивности',
    'personalized.business.bento.box2.desc':
      'Ясный ум приводит к лучшим решениям. Исправление осанки снижает утомляемость и повышает результативность.',
    'personalized.business.bento.box3.title': 'Удержание Концентрации',
    'personalized.business.bento.box3.desc':
      'Способствует концентрации и снижает стресс благодаря техникам глубокого расслабления.',
    'personalized.business.bento.box4.title': 'Целостный Подход',
    'personalized.business.bento.box4.desc':
      'Мы создаем среду и процедуры, которые способствуют физической активности и ясности ума в офисе.',

    'personalized.business.plans.title': 'Корпоративные Планы',
    'personalized.business.plans.subtitle':
      'Решения, адаптированные под размер и потребности вашей команды',

    'personalized.business.plans.starter.name': 'План Team',
    'personalized.business.plans.starter.desc': 'Идеально для небольших команд.',
    'personalized.business.plans.starter.price': 'Индивидуально',
    'personalized.business.plans.starter.feat1': '1 групповое занятие в месяц',
    'personalized.business.plans.starter.feat2': 'Базовая оценка эргономики',
    'personalized.business.plans.starter.feat3': 'Доступ к цифровым тренировкам',

    'personalized.business.plans.pro.name': 'План Office',
    'personalized.business.plans.pro.desc': 'Комплексное решение для офисов.',
    'personalized.business.plans.pro.price': 'Индивидуально',
    'personalized.business.plans.pro.feat1': 'Еженедельные занятия',
    'personalized.business.plans.pro.feat2': 'Массаж в офисе (2 дня в месяц)',
    'personalized.business.plans.pro.feat3': 'Индивидуальное сопровождение',

    'personalized.business.plans.enterprise.name': 'План Enterprise',
    'personalized.business.plans.enterprise.desc': 'Комплексная программа здоровья.',
    'personalized.business.plans.enterprise.price': 'По запросу',
    'personalized.business.plans.enterprise.feat1': 'Выделенные терапевты в офисе',
    'personalized.business.plans.enterprise.feat2': 'Ежемесячные семинары и тренинги',
    'personalized.business.plans.enterprise.feat3': 'Метрики здоровья и отчетность',
    'personalized.business.understanding.title': 'Здоровая команда — счастливая команда',
    'personalized.business.understanding.description1':
      'Длительное сидение вызывает напряжение в шее и усталость. Мы помогаем сотрудникам восстановить энергию и снизить стресс.',
    'personalized.business.understanding.description2':
      'Будь то еженедельные групповые занятия, эргономический консалтинг или массаж в офисе, мы подстроимся под ваш график.',
    'personalized.business.understanding.callToAction':
      'Давайте обсудим план, который подойдет вашему офису.',
    'personalized.business.services.title': 'Корпоративные услуги',
    'personalized.business.services.subtitle': 'Решения для улучшения здоровья в рабочей среде',
    'personalized.business.services.groupClasses.title': 'Групповые занятия по осанке',
    'personalized.business.services.groupClasses.description':
      'Эффективные сессии, направленные на снятие боли в спине, проводятся онлайн или в офисе.',
    'personalized.business.services.consulting.title': 'Консалтинг и уход в офисе',
    'personalized.business.services.consulting.description':
      'Мы оцениваем рабочие места и учим команду работать без боли. Также мы можем проводить дни терапии прямо у вас в офисе.',
    'personalized.business.faq.q1': 'Подстроитесь ли вы под наш график?',
    'personalized.business.faq.a1':
      'Да, мы знаем о ваших дедлайнах и без проблем интегрируемся в рабочие часы.',
    'personalized.business.faq.q2': 'Вы приезжаете в офис?',
    'personalized.business.faq.a2':
      'Да, мы можем приезжать прямо в штаб-квартиру вашей компании для проведения сессий.',
    'personalized.business.faq.q3': 'Сколько это стоит?',
    'personalized.business.faq.a3':
      'Зависит от размера команды и частоты. Свяжитесь с нами, и мы подготовим предложение.',
    'personalized.business.benefit1':
      'Снижает уровень стресса в команде и активно предотвращает выгорание.',
    'personalized.business.benefit2':
      'Улучшает осанку при работе за столом и эффективно снимает хроническую боль в спине.',
    'personalized.business.benefit3':
      'Способствует созданию более сильной, сплоченной и здоровой корпоративной культуры.',
    'personalized.business.benefit4':
      'Значительно повышает ежедневную концентрацию, энергию и общую продуктивность.',

    // Booking Page Help Section
    'booking.help.title': 'Нужна помощь с бронированием?',
    'booking.help.contactDirect': 'Свяжитесь с нами напрямую',
    'booking.help.email': '📧 contact@ekabalance.com',
    'booking.help.address': '📍 Carrer Pelai, 12, 08001 Barcelona',
    'booking.help.hours': 'Часы работы',
    'booking.help.hours.weekdays': 'Понедельник - пятница: 9:00 - 20:00',
    'booking.help.hours.saturday': 'Суббота: 9:00 - 14:00',
    'booking.help.hours.sunday': 'Воскресенье: закрыто',
    'booking.help.footer':
      'Если у вас есть какие-либо вопросы о наших услугах или вам нужна помощь с бронированием, не стесняйтесь обращаться к нам. Мы здесь, чтобы помочь вам.',
    'booking.whatsapp.availability': 'Доступность: {availability} – {timeslot}',
    'booking.whatsapp.thanks': 'Спасибо!',
    // VIP Section
    'vip.plan.bronze': 'Доступ bronze',
    'vip.plan.bronze.description': 'Необходимый уход для поддержания здоровья',
    'vip.plan.bronze.price': '150€',
    'vip.plan.silver': 'Доступ silver',
    'vip.plan.silver.description': 'Полное ежемесячное благополучие',
    'vip.plan.silver.price': '280€',
    'vip.plan.gold': 'Доступ Gold',
    'vip.plan.gold.description': 'Полная трансформация и эксклюзивность',
    'vip.plan.gold.price': '500€',

    'vip.service.priority.title': 'Приоритетное бронирование',
    'vip.service.priority.description':
      'Без очередей, с эксклюзивными слотами, зарезервированными только для вас.',
    'vip.service.displacements.title': 'Визиты на дом',
    'vip.service.displacements.description':
      'Мы приезжаем к вам. Экономьте время и наслаждайтесь процедурами в своем пространстве.',
    'vip.service.health.title': 'Мониторинг здоровья',
    'vip.service.health.description':
      'Регулярные проверки и отслеживание прогресса вашего физического здоровья.',
    'vip.service.family.title': 'Семейные преимущества',
    'vip.service.family.description':
      'Делитесь своими сеансами и преимуществами с близкими родственниками.',
    'vip.benefits.transferable': 'Передаваемые сеансы',
    'vip.benefits.transferableDesc': 'Поделитесь с семьей',
    'vip.benefits.monthly': 'Ежемесячная проверка',
    'vip.benefits.monthlyDesc': 'Профилактический уход',
    'vip.benefits.barcelona': 'Эксклюзив барселона',
    'vip.benefits.barcelonaDesc': 'Доступно в центре',
    'vip.benefits.sessions': 'Расширенные сеансы',

    'vip.stats.concierge': 'Консьерж-сервис',
    'vip.stats.exclusivity': 'Эксклюзивность',
    'vip.stats.clients': 'Топ 1% клиентов',
    'vip.stats.possibilities': 'Возможности',
    'vip.stats.control': 'Контроль здоровья',
    'vip.stats.family': 'Семейный план',

    'vip.mostExclusive': 'Самый эксклюзивный',
    'vip.experienceDescription':
      'Ощутите вершину благополучия, созданную для тех, кто требует лучшего.',
    'vip.voicesOfExcellence': 'Голоса совершенства',
    'vip.testimonialsSubtitle': 'Что говорят наши элитные члены о своем опыте.',
    'vip.tier.standard': 'Стандартный участник',

    'vip.testimonials.comment1':
      'Лучшая инвестиция в мое здоровье. Приоритетный сервис меняет правила игры.',
    'vip.testimonials.comment2':
      'Профессионализм в лучшем виде. Елена точно понимает, что нужно моему телу.',
    'vip.testimonials.comment3':
      'Я чувствую обновление после каждого сеанса. Внимание к деталям непревзойденно.',

    'vip.hero.badge': 'Ультра премиум',
    'vip.hero.title.beyond': 'За пределами',
    'vip.hero.title.wellness': 'Благополучия',
    'vip.hero.subtitle':
      'Войдите в мир, где ваше благополучие является абсолютным приоритетом. Эксклюзивные процедуры, приоритетный доступ и индивидуальный уход.',
    'vip.hero.cta.join': 'Вступить в inner circle',

    'vip.dashboard.member': 'Зона участника',
    'vip.dashboard.hello': 'Привет,',
    'vip.dashboard.status': 'Текущий статус:',
    'vip.dashboard.priorityBooking': 'Приоритетное бронирование',
    'vip.dashboard.viewPlans': 'Посмотреть VIP планы',

    'vip.features.badge': 'Совершенство',
    'vip.features.title': 'Создано для элиты',
    'vip.features.subtitle':
      'Каждая деталь была продумана, чтобы предложить опыт, выходящий за рамки простой терапии.',

    'vip.plans.badge': 'Членство',
    'vip.plans.title': 'Выберите свой уровень',
    'vip.plans.subtitle':
      'Выберите уровень эксклюзивности, который соответствует вашему образу жизни.',
    'vip.plans.popular': 'Самый популярный',
    'vip.plans.perMonth': '/ Месяц',
    'vip.plans.sessions': 'Сеансов включено',
    'vip.plans.contact': 'Связаться для',
    'vip.table.title': 'Сравнение планов',
    'vip.table.sessions': 'Сеансы включены',

    'vip.exclusivePrivileges': 'Эксклюзивные привилегии',
    'vip.testimonials.title': 'Элитный опыт',
    'vip.testimonials.subtitle': 'Услышьте тех, кто выбрал путь совершенства.',
    'vip.testimonials.role1': 'Ceo, технологическая компания',
    'vip.testimonials.role2': 'Сердечно-сосудистый хирург',
    'vip.testimonials.role3': 'Предприниматель',
    'vip.cta.badge': 'Присоединяйтесь',
    'vip.cta.title': 'Преобразите свою жизнь',
    'vip.cta.subtitle':
      'Ваш путь к пиковой производительности и глубокому благополучию начинается здесь.',
    'vip.whatsapp.message':
      'Здравствуйте, меня интересует VIP-план {plan}. я хотел бы получить больше информации.',
    'vip.whatsapp.messageGeneral':
      'Здравствуйте, меня интересуют VIP-планы inner circle. Я хотел бы получить больше информации.',
    'vip.cta.location': 'Эксклюзивное расположение',
    'vip.cta.concierge': 'Консьерж-сервис',
    'vip.cta.guarantee': 'Полная гарантия',

    // Hero Missing
    'hero.title.part1': 'Избавьтесь от',
    'hero.title.part2': 'боли и стресса',
    'hero.cta.primary': 'Записаться на сеанс',
    'hero.cta.secondary': 'Узнать свой путь',
    'hero.stats.rating': 'Рейтинг 5 звезд',

    // VIP Missing Details
    'vip.plan.platinum': 'Platinum VIP',
    'vip.plan.bronze.desc': 'Вход в VIP',
    'vip.plan.silver.desc': 'Для профессионалов',
    'vip.plan.gold.desc': 'Максимальный опыт',
    'vip.plan.platinum.desc': 'Элитный доступ',
    'vip.feature.priority': 'Приоритет',
    'vip.feature.extended': 'Длинные сессии',
    'vip.feature.support': '24/7 поддержка',
    'vip.feature.events': 'События',
    'vip.feature.home': 'Выезд на дом',
    'vip.feature.all': 'Все включено',
    'vip.feature.gift': 'Подарочный сеанс',
    'vip.feature.consultation': 'Консультация',
    'vip.feature.kit': 'Premium набор',
    'vip.feature.concierge': 'Личный менеджер',
    'vip.feature.retreat': 'Скидка на ретриты',

    // Missing Keys Patch
    'stats.sessions': 'Сессии',
    'stats.clients': 'Клиенты',
    'stats.experience': 'Опыт',
    'stats.rating': 'Рейтинг',
    'stats.countries': 'Страны',
    'stats.cases': 'Решенные кейсы',
    'stats.response': 'Быстрый ответ',

    // Students
    'students.problems.title': 'Проблемы студентов',
    'students.problems.subtitle': 'Преодолей учебный стресс',
    'students.problem1.title': 'Тревога',
    'students.problem1.desc': 'Перед экзаменами',
    'students.problem2.title': 'Осанка',
    'students.problem2.desc': 'Боль от учебы',
    'students.problem3.title': 'Концентрация',
    'students.problem3.desc': 'Сложности с фокусом',
    'students.problem4.title': 'Усталость',
    'students.problem4.desc': 'Умственное утомление',
    'students.results.title': 'Результаты',
    'students.results.point1': 'Лучшая успеваемость',
    'students.results.point2': 'Меньше стресса',
    'students.results.point3': 'Больше энергии',
    'students.plans.title': 'Планы для студентов',
    'students.plans.subtitle': 'Варианты для вас',
    'students.plan1.name': 'Разовая сессия',
    'students.plan1.desc': 'Точечно',
    'students.plan1.result': 'Облегчение',
    'students.plan2.name': 'Пакет"учеба"',
    'students.plan2.desc': 'Сопровождение',
    'students.plan2.result': 'Эффективность',
    'students.plan2.popular': 'Популярный',
    'students.plan2.save': 'Выгода',
    'students.plan3.name': 'Полная программа',
    'students.plan3.desc': 'Трансформация',
    'students.plan3.result': 'Успех',
    'students.plan.cta': 'Выбрать план',
    'students.plan1.benefit1': 'Релакс',
    'students.plan1.benefit2': 'Фокус',
    'students.plan1.benefit3': 'Советы',
    'students.plan1.benefit4': 'Поддержка',
    'students.plan2.benefit1': '3 сессии',
    'students.plan2.benefit2': 'Контроль',
    'students.plan2.benefit3': 'Приоритет',
    'students.plan2.benefit4': 'Скидка',
    'students.plan3.benefit1': '5 сессий',
    'students.plan3.benefit2': 'Коучинг',
    'students.plan3.benefit3': 'WhatsApp',
    'students.plan3.benefit4': 'Материалы',

    // Office
    'office.hero.badge': 'Для компаний',
    'office.hero.title': 'Корпоративное здоровье',
    'office.hero.subtitle': 'Здоровье на работе',
    'office.problems.title': 'Офисные вызовы',
    'office.problems.subtitle': 'Сидячий образ жизни и стресс',
    'office.problem1.title': 'Боль в спине',
    'office.problem1.desc': 'Статичная поза',
    'office.problem2.title': 'Усталость глаз',
    'office.problem2.desc': 'Экраны',
    'office.problem3.title': 'Шея',
    'office.problem3.desc': 'Напряжение плеч',
    'office.problem4.title': 'Гиподинамия',
    'office.problem4.desc': 'Недостаток движения',
    'office.help.title': 'Решения',
    'office.help1.title': 'Эргономика',
    'office.help1.desc': 'Настройка позы',
    'office.help2.title': 'Активация',
    'office.help2.desc': 'Упражнения',
    'office.help3.title': 'Релаксация',
    'office.help3.desc': 'Анти-стресс',
    'office.results.title': 'Преимущества',
    'office.results.point1': 'Продуктивность',
    'office.results.point2': 'Меньше больничных',
    'office.results.point3': 'Атмосфера',
    'office.plans.title': 'Корпоративные планы',
    'office.plans.subtitle': 'Для команд',
    'office.plan1.name': 'Индивидуальный',
    'office.plan1.desc': 'Executive',
    'office.plan1.result': 'Фокус',
    'office.plan2.name': 'Малая команда',
    'office.plan2.desc': '< 10 человек',
    'office.plan2.result': 'Сплоченность',
    'office.plan2.popular': 'Рекомендуем',
    'office.plan2.save': 'Выгодно',
    'office.plan3.name': 'Департамент',
    'office.plan3.desc': 'Большие команды',
    'office.plan3.result': 'Культура',
    'office.plan.cta': 'Связаться',
    'office.plan1.benefit1': 'Анализ',
    'office.plan1.benefit2': 'Лечение',
    'office.plan1.benefit3': 'Отчет',
    'office.plan1.benefit4': 'Контроль',
    'office.plan2.benefit1': 'Воркшопы',
    'office.plan2.benefit2': 'Группа',
    'office.plan2.benefit3': 'Материалы',
    'office.plan2.benefit4': 'Сделка',
    'office.plan3.benefit1': 'Годовой',
    'office.plan3.benefit2': 'В офисе',
    'office.plan3.benefit3': 'Ивенты',
    'office.plan3.benefit4': 'Данные',

    'whyChoose.title': 'Почему выбирают EKA Balance?',
    'whyChoose.subtitle':
      'Мы больше, чем терапевтический центр; мы ваши преданные партнеры в целостном благополучии.',
    'whyChoose.personalized.title': 'Истинно персонализированные планы',
    'whyChoose.personalized.description':
      'Ваше тело уникально, и ваша терапия тоже должна быть такой. Мы адаптируем каждую сессию к вашей физиологии и истории для более быстрых и устойчивых результатов.',
    'whyChoose.holistic.title': 'Системная интеграция',
    'whyChoose.holistic.description':
      'Мы лечим вас целиком — структурно, химически и эмоционально. Истинное исцеление происходит, когда все ваши системы работают в гармонии.',
    'whyChoose.experienced.title': 'Экспертное руководство',
    'whyChoose.experienced.description':
      'Воспользуйтесь годами профессиональной практики и непрерывного обучения мировым методикам, таким как фельденкрайз, остеопатия и кинезиология.',

    // Pricing Section
    'pricing.badge': 'Прозрачные тарифы',
    'pricing.title.part1': 'Выберите свой',
    'pricing.title.part2': 'план благополучия',
    'pricing.subtitle':
      'Пакеты, разработанные для любых нужд, с гибкостью и качеством, которых вы заслуживаете',
    'pricing.popular': 'Самый популярный',
    'pricing.save': 'Экономия {percent}%',
    'pricing.discount_applied': 'Применено',
    'pricing.plan.select': 'Выбрать',

    'pricing.plan.basic.name': 'Индивидуальная сессия',
    'pricing.plan.basic.desc': 'Полная сессия 1.5чут',
    'pricing.plan.pack3.name': 'Пакет благополучие (3)',
    'pricing.plan.pack3.desc': 'Пакет из 3 сессий для непрерывного отслеживания',
    'pricing.plan.pack5.name': 'Пакет трансформация (5)',
    'pricing.plan.pack5.desc': 'Комплексное лечение для глубоких изменений',

    'pricing.feature.massage': 'Терапевтический массаж',
    'pricing.feature.kinesiology': 'Кинезиология',
    'pricing.feature.osteopathy': 'Мягкая остеопатия',
    'pricing.feature.save15': 'Экономия 15€',
    'pricing.feature.valid3months': 'Действителен 3 месяца',
    'pricing.feature.transferable': 'Можно передавать',
    'pricing.feature.save25': 'Экономия 25€',
    'pricing.feature.valid6months': 'Действителен 6 месяцев',
    'pricing.feature.priority': 'Приоритет бронирования',

    'pricing.guarantee.nocommitment.title': 'Без обязательств',
    'pricing.guarantee.nocommitment.desc': 'Отмена или перенос записи за 24 часа без оплаты',
    'pricing.guarantee.satisfaction.title': 'Гарантия удовлетворенности',
    'pricing.guarantee.satisfaction.desc':
      'Если вы не удовлетворены первой сессией, мы вернем вам деньги',
    'pricing.guarantee.certified.title': 'Сертифицированные профессионалы',
    'pricing.guarantee.certified.desc': 'Все наши терапевты имеют официальные сертификаты',
    'pricing.guarantee.equipment.title': 'Профессиональное оборудование',
    'pricing.guarantee.equipment.desc':
      'Мы используем только оборудование и продукты высшего качества',

    'pricing.cta.unsure.title': 'Не уверены, какой план выбрать?',
    'pricing.cta.unsure.subtitle':
      'Пройдите нашу бесплатную оценку и узнайте, какое лечение лучше всего подходит для ваших нужд',
    'pricing.cta.unsure.button': 'Узнать о наших услугах',

    // Booking Popup
    'booking.smart.service.placeholder': 'Выберите услугу...',
    'booking.smart.time.placeholder': 'Например: утром, на следующей неделе...',
    'booking.whatsapp.name': 'Имя',
    'booking.whatsapp.serviceLabel': 'Услуга',
    'booking.whatsapp.preference': 'Предпочтительное время',
    'booking.service.other': 'Другое',
    'booking.service.consultation': 'Первичная консультация',
    'booking.smart.quick': 'Быстрая запись',
    'booking.smart.quickDesc': 'Связаться через WhatsApp напрямую.',
    'booking.smart.form': 'Форма',
    'booking.smart.formDesc': 'Заполнить детали.',
    'booking.smart.name': 'Ваше имя',
    'booking.smart.service': 'Услуга',
    'booking.smart.time': 'Предпочтительное время',
    'booking.smart.send': 'Отправить в WhatsApp',
    'booking.smart.title': 'Забронируйте сеанс',
    'booking.smart.subtitle': 'Выберите способ связи',
  },
};

// Detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('ca')) return 'ca';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('en')) return 'en';

  // Default to English for unsupported languages
  return 'en';
};

// Get language from localStorage or detect browser language
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('eka-language') as Language;
    if (saved && ['ca', 'en', 'es', 'ru'].includes(saved)) {
      return saved;
    }
    return detectBrowserLanguage();
  }
  return 'en';
};
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with 'en' to match server rendering and avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>('en');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [languageConfirmed, setLanguageConfirmed] = useState(false);

  useEffect(() => {
    // Determine language after mount (client-only)
    const initial = getInitialLanguage();
    if (initial !== 'en') {
      setLanguageState(initial);
    }

    // Check local storage for confirmation status
    if (localStorage.getItem('eka-language-confirmed') === 'true') {
      setLanguageConfirmed(true);
    }
  }, []);

  const confirmLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('eka-language-confirmed', 'true');
    setLanguageConfirmed(true);
    setShowLanguagePopup(false);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eka-language', lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Guaranteed overrides first, then standard translation sources
    let text =
      (guaranteedTranslations[language] as Record<string, string>)?.[key] ||
      (guaranteedTranslations.en as Record<string, string>)?.[key] ||
      (translations[language] as Record<string, string>)?.[key] ||
      (servicesTranslations[language] as Record<string, string>)?.[key] ||
      (revision360Translations[language] as Record<string, string>)?.[key] ||
      (techniqueTranslations[language] as Record<string, string>)?.[key] ||
      (agenyzTranslations[language] as Record<string, string>)?.[key] ||
      (bentoTranslations[language] as Record<string, string>)?.[key] ||
      (translations.en as Record<string, string>)?.[key] ||
      (servicesTranslations.en as Record<string, string>)?.[key] ||
      (revision360Translations.en as Record<string, string>)?.[key] ||
      (techniqueTranslations.en as Record<string, string>)?.[key] ||
      (agenyzTranslations.en as Record<string, string>)?.[key] ||
      (bentoTranslations.en as Record<string, string>)?.[key] ||
      key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
      });
    }

    return text;
  };

  useEffect(() => {
    // Set HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        showLanguagePopup,
        setShowLanguagePopup,
        confirmLanguage,
        languageConfirmed,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
