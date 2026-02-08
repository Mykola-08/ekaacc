import { Language } from './LanguageTypes';

export interface Translations {
  [key: string]: {
    ca: string;
    en: string;
    es: string;
    ru: string;
  };
}

const rawTranslations: Translations = {
  // Language names
  'lang.catalan': {
    ca: 'Català',
    en: 'Catalan',
    es: 'Catalán',
    ru: 'Каталанский',
  },
  'lang.english': {
    ca: 'Anglès',
    en: 'English',
    es: 'Inglés',
    ru: 'Английский',
  },
  'lang.spanish': {
    ca: 'Espanyol',
    en: 'Spanish',
    es: 'Español',
    ru: 'Испанский',
  },
  'lang.russian': {
    ca: 'Rus',
    en: 'Russian',
    es: 'Ruso',
    ru: 'Русский',
  },

  // Hero Section
  'hero.title': {
    ca: 'Revisió Corporal 360°',
    en: '360° Body Review',
    es: 'Revisión Corporal 360°',
    ru: 'Телесный Обзор 360°',
  },
  'hero.byEka': {
    ca: 'per EKA Balance',
    en: 'by EKA Balance',
    es: 'por EKA Balance',
    ru: 'от EKA Balance',
  },
  'hero.subtitle': {
    ca: 'Un viatge complet i holístic a través del teu cos — físic, emocional, estructural i energètic.',
    en: 'A complete and holistic journey through your body — physical, emotional, structural and energetic.',
    es: 'Un viaje completo y holístico a través de tu cuerpo — físico, emocional, estructural y energético.',
    ru: 'Полное и целостное путешествие через ваше тело — физическое, эмоциональное, структурное и энергетическое.',
  },
  'hero.cta': {
    ca: 'Comença la teva sessió 360°',
    en: 'Start your 360° session',
    es: 'Comienza tu sesión 360°',
    ru: 'Начать вашу сессию 360°',
  },
  'hero.quote': {
    ca: 'Sanar no és afegir el que falta. És recordar el que sempre hi va ser.',
    en: 'Healing is not adding what is missing. It is remembering what was always there.',
    es: 'Sanar no es agregar lo que falta. Es recordar lo que siempre estuvo ahí.',
    ru: 'Исцеление — это не добавление того, чего не хватает. Это вспоминание того, что всегда было там.',
  },
  'hero.tooltip': {
    ca: 'On comença la teva història de transformació',
    en: 'Where your transformation story begins',
    es: 'Donde comienza tu historia de transformación',
    ru: 'Где начинается ваша история трансформации',
  },

  // Why 360 Section
  'why360.title': {
    ca: 'Per què 360°?',
    en: 'Why 360°?',
    es: '¿Por qué 360°?',
    ru: 'Почему 360°?',
  },
  'why360.modal.title': {
    ca: 'La Filosofia 360°',
    en: 'The 360° Philosophy',
    es: 'La Filosofía 360°',
    ru: 'Философия 360°',
  },
  'why360.modal.intro': {
    ca: 'El teu cos és una simfonia. La nostra feina és escoltar els instruments que no pots sentir.',
    en: 'Your body is a symphony. Our job is to listen to the instruments you cannot hear.',
    es: 'Tu cuerpo es una sinfonía. Nuestro trabajo es escuchar los instrumentos que no puedes oír.',
    ru: 'Ваше тело — это симфония. Наша работа — слушать инструменты, которые вы не можете услышать.',
  },
  'why360.modal.integration.title': {
    ca: 'Integració Completa',
    en: 'Complete Integration',
    es: 'Integración Completa',
    ru: 'Полная Интеграция',
  },
  'why360.modal.integration.description': {
    ca: "Els enfocaments tradicionals sovint es centren en símptomes aïllats o sistemes únics. El mètode 360° reconeix que el teu cos opera com un tot interconnectat — on els patrons emocionals creen tensió física, els desequilibris estructurals afecten el flux d'energia, i els bloquejos energètics es manifesten com a dolor físic.",
    en: 'Traditional approaches often focus on isolated symptoms or single systems. The 360° method recognizes that your body operates as an interconnected whole — where emotional patterns create physical tension, structural imbalances affect energy flow, and energetic blockages manifest as physical pain.',
    es: 'Los enfoques tradicionales a menudo se centran en síntomas aislados o sistemas únicos. El método 360° reconoce que tu cuerpo opera como un todo interconectado — donde los patrones emocionales crean tensión física, los desequilibrios estructurales afectan el flujo de energía, y los bloqueos energéticos se manifiestan como dolor físico.',
    ru: 'Традиционные подходы часто сосредотачиваются на изолированных симптомах или отдельных системах. Метод 360° признает, что ваше тело функционирует как взаимосвязанное целое — где эмоциональные паттерны создают физическое напряжение, структурные дисбалансы влияют на энергетический поток, а энергетические блоки проявляются как физическая боль.',
  },
  'why360.modal.dimensions.title': {
    ca: 'Les Quatre Dimensions',
    en: 'The Four Dimensions',
    es: 'Las Cuatro Dimensiones',
    ru: 'Четыре Измерения',
  },
  'why360.modal.importance.title': {
    ca: 'Per què això importa',
    en: 'Why this matters',
    es: 'Por qué esto importa',
    ru: 'Почему это важно',
  },
  'why360.modal.importance.description': {
    ca: "Quan veiem el panorama complet, la sanació deixa de ser reparar el que està trencat, i es converteix en restaurar el flux natural i l'equilibri que sempre havia d'estar-hi. Per això els nostres clients sovint experimenten canvis profunds que van molt més enllà de les seves preocupacions originals.",
    en: 'When we see the complete picture, healing stops being about fixing what is broken, and becomes about restoring the natural flow and balance that was always meant to be there. This is why our clients often experience profound changes that go far beyond their original concerns.',
    es: 'Cuando vemos el panorama completo, la sanación deja de ser reparar lo que está roto, y se convierte en restaurar el flujo natural y el equilibrio que siempre debía estar ahí. Por eso nuestros clientes a menudo experimentan cambios profundos que van mucho más allá de sus preocupaciones originales.',
    ru: 'Когда мы видим полную картину, исцеление перестает быть о исправлении того, что сломано, и становится о восстановлении естественного потока и баланса, который всегда должен был быть там. Поэтому наши клиенты часто испытывают глубокие изменения, которые выходят далеко за рамки их первоначальных забот.',
  },
  'why360.subtitle': {
    ca: '360° significa completesa. No tractem parts. Llegim tota la història.',
    en: "360° means completeness. We don't treat parts. We read the whole story.",
    es: '360° significa completitud. No tratamos partes. Leemos toda la historia.',
    ru: '360° означает полноту. Мы не лечим части. Мы читаем всю историю.',
  },
  'why360.layers.physical': {
    ca: 'Físic',
    en: 'Physical',
    es: 'Físico',
    ru: 'Физический',
  },
  'why360.layers.structural': {
    ca: 'Estructural',
    en: 'Structural',
    es: 'Estructural',
    ru: 'Структурный',
  },
  'why360.layers.emotional': {
    ca: 'Emocional',
    en: 'Emotional',
    es: 'Emocional',
    ru: 'Эмоциональный',
  },
  'why360.layers.energetic': {
    ca: 'Energètic',
    en: 'Energetic',
    es: 'Energético',
    ru: 'Энергетический',
  },
  'why360.physical.desc': {
    ca: 'Múscul, os, fàscia i patrons de moviment',
    en: 'Muscle, bone, fascia and movement patterns',
    es: 'Músculo, hueso, fascia y patrones de movimiento',
    ru: 'Мышцы, кости, фасции и двигательные паттерны',
  },
  'why360.structural.desc': {
    ca: 'Alineació, postura i integritat esquelètica',
    en: 'Alignment, posture and skeletal integrity',
    es: 'Alineación, postura e integridad esquelética',
    ru: 'Выравнивание, осанка и целостность скелета',
  },
  'why360.emotional.desc': {
    ca: 'Trauma emmagatzemat, tensió i bloquejos energètics',
    en: 'Stored trauma, tension and energetic blockages',
    es: 'Trauma almacenado, tensión y bloqueos energéticos',
    ru: 'Накопленная травма, напряжение и энергетические блоки',
  },
  'why360.energetic.desc': {
    ca: 'Força vital, flux i consciència del cos subtil',
    en: 'Life force, flow and subtle body awareness',
    es: 'Fuerza vital, flujo y conciencia del cuerpo sutil',
    ru: 'Жизненная сила, поток и осознание тонкого тела',
  },
  'why360.complete': {
    ca: 'Complet',
    en: 'Complete',
    es: 'Completo',
    ru: 'Полный',
  },
  'why360.philosophy': {
    ca: 'Coneix més sobre la nostra filosofia',
    en: 'Learn more about our philosophy',
    es: 'Conoce más sobre nuestra filosofía',
    ru: 'Узнать больше о нашей философии',
  },

  // Back Button
  'back.return': {
    ca: 'Tornar',
    en: 'Return',
    es: 'Volver',
    ru: 'Вернуться',
  },

  // WhatsApp Messages
  'whatsapp.booking': {
    ca: "Hola, m'agradaria reservar una sessió 360°. Podríem parlar?",
    en: 'Hello, I would like to book a 360° session. Could we talk?',
    es: 'Hola, me gustaría reservar una sesión 360°. ¿Podríamos hablar?',
    ru: 'Привет, я хотел бы забронировать сессию 360°. Можем ли мы поговорить?',
  },
  'whatsapp.consultation': {
    ca: 'Hola, voldria fer una consulta sobre el vostre mètode de treball. Gràcies!',
    en: 'Hello, I would like to make a consultation about your work method. Thank you!',
    es: 'Hola, me gustaría hacer una consulta sobre su método de trabajo. ¡Gracias!',
    ru: 'Привет, я хотел бы проконсультироваться о вашем методе работы. Спасибо!',
  },

  // Service Section
  'service.title': {
    ca: 'Revisió Corporal 360°',
    en: '360° Body Review',
    es: 'Revisión Corporal 360°',
    ru: 'Телесный Обзор 360°',
  },
  'service.subtitle': {
    ca: 'Un viatge terapèutic complet que honora cada aspecte del teu ser.',
    en: 'A complete therapeutic journey that honors every aspect of your being.',
    es: 'Un viaje terapéutico completo que honra cada aspecto de tu ser.',
    ru: 'Полное терапевтическое путешествие, которое уважает каждый аспект вашего существа.',
  },
  'service.step1.title': {
    ca: 'Consulta Profunda',
    en: 'Deep Consultation',
    es: 'Consulta Profunda',
    ru: 'Глубокая Консультация',
  },
  'service.step1.description': {
    ca: 'Comencem escoltant la història del teu cos — tant el que pots dir-nos com el que ell ens diu.',
    en: "We begin by listening to your body's story — both what you can tell us and what it tells us.",
    es: 'Comenzamos escuchando la historia de tu cuerpo — tanto lo que puedes decirnos como lo que él nos dice.',
    ru: 'Мы начинаем с выслушивания истории вашего тела — как того, что вы можете нам рассказать, так и того, что оно нам говорит.',
  },
  'service.step2.title': {
    ca: 'Mapeig Corporal 360°',
    en: '360° Body Mapping',
    es: 'Mapeo Corporal 360°',
    ru: 'Телесное Картирование 360°',
  },
  'service.step2.description': {
    ca: 'Una avaluació completa a través de les quatre dimensions del teu ser.',
    en: 'A comprehensive assessment across the four dimensions of your being.',
    es: 'Una evaluación completa a través de las cuatro dimensiones de tu ser.',
    ru: 'Комплексная оценка по четырем измерениям вашего существа.',
  },
  'service.step3.title': {
    ca: 'Sessió Integrada',
    en: 'Integrated Session',
    es: 'Sesión Integrada',
    ru: 'Интегрированная Сессия',
  },
  'service.step3.description': {
    ca: 'Treball manual que aborda totes les dimensions simultàniament.',
    en: 'Manual work that addresses all dimensions simultaneously.',
    es: 'Trabajo manual que aborda todas las dimensiones simultáneamente.',
    ru: 'Ручная работа, которая одновременно затрагивает все измерения.',
  },
  'service.step4.title': {
    ca: "Pla d'Integració",
    en: 'Integration Plan',
    es: 'Plan de Integración',
    ru: 'План Интеграции',
  },
  'service.step4.description': {
    ca: 'Una fulla de ruta personalitzada per continuar la teva transformació a casa.',
    en: 'A personalized roadmap to continue your transformation at home.',
    es: 'Una hoja de ruta personalizada para continuar tu transformación en casa.',
    ru: 'Персонализированная дорожная карта для продолжения вашей трансформации дома.',
  },
  'service.total.title': {
    ca: 'Sessió 360° Completa',
    en: 'Complete 360° Session',
    es: 'Sesión 360° Completa',
    ru: 'Полная Сессия 360°',
  },
  'service.total.duration': {
    ca: '4.5 Hores Total',
    en: '4.5 Hours Total',
    es: '4.5 Horas Total',
    ru: '4.5 Часа Всего',
  },
  'service.total.note': {
    ca: 'Normalment completada en 2-3 cites segons les teves necessitats i horari',
    en: 'Typically completed in 2-3 appointments based on your needs and schedule',
    es: 'Normalmente completada en 2-3 citas según tus necesidades y horario',
    ru: 'Обычно завершается за 2-3 приема в зависимости от ваших потребностей и расписания',
  },
  'service.expect': {
    ca: 'Què esperar:',
    en: 'What to expect:',
    es: 'Qué esperar:',
    ru: 'Чего ожидать:',
  },

  // Emotional Section
  'emotional.title': {
    ca: 'Perquè el teu cos mereix ser comprès, no arreglat.',
    en: 'Because your body deserves to be understood, not fixed.',
    es: 'Porque tu cuerpo merece ser comprendido, no arreglado.',
    ru: 'Потому что ваше тело заслуживает понимания, а не исправления.',
  },
  'emotional.subtitle': {
    ca: "No empenyem, forcem o 'corregim.' Escoltem, guiem i despertem.",
    en: "We don't push, force or 'correct.' We listen, guide and awaken.",
    es: "No empujamos, forzamos o 'corregimos.' Escuchamos, guiamos y despertamos.",
    ru: "Мы не толкаем, не принуждаем и не 'исправляем.' Мы слушаем, направляем и пробуждаем.",
  },
  'emotional.philosophy': {
    ca: 'Filosofia EKA Balance',
    en: 'EKA Balance Philosophy',
    es: 'Filosofía EKA Balance',
    ru: 'Философия EKA Balance',
  },
  'emotional.quote': {
    ca: 'La sanació ocorre quan el teu cos finalment se sent segur.',
    en: 'Healing happens when your body finally feels safe.',
    es: 'La sanación ocurre cuando tu cuerpo finalmente se siente seguro.',
    ru: 'Исцеление происходит, когда ваше тело наконец чувствует себя в безопасности.',
  },
  'emotional.story': {
    ca: 'Una història de transformació',
    en: 'A transformation story',
    es: 'Una historia de transformación',
    ru: 'История трансформации',
  },
  'emotional.readStory': {
    ca: 'Llegeix una història',
    en: 'Read a story',
    es: 'Lee una historia',
    ru: 'Прочитать историю',
  },
  'emotional.bodyRemembers': {
    ca: 'El teu cos recorda.',
    en: 'Your body remembers.',
    es: 'Tu cuerpo recuerda.',
    ru: 'Ваше тело помнит.',
  },
  'emotional.integrity': {
    ca: 'La integritat és el teu estat natural.',
    en: 'Integrity is your natural state.',
    es: 'La integridad es tu estado natural.',
    ru: 'Целостность — это ваше естественное состояние.',
  },

  // Benefits Section
  'benefits.title': {
    ca: 'Què Pots Esperar',
    en: 'What You Can Expect',
    es: 'Qué Puedes Esperar',
    ru: 'Чего Вы Можете Ожидать',
  },
  'benefits.subtitle': {
    ca: "Resultats reals que van més enllà de l'alleujament de símptomes per crear transformació duradora.",
    en: 'Real results that go beyond symptom relief to create lasting transformation.',
    es: 'Resultados reales que van más allá del alivio de síntomas para crear transformación duradera.',
    ru: 'Реальные результаты, которые выходят за рамки облегчения симптомов для создания длительной трансформации.',
  },

  // Final Invitation
  'final.title': {
    ca: 'Entra al Cercle.',
    en: 'Enter the Circle.',
    es: 'Entra al Círculo.',
    ru: 'Войти в Круг.',
  },
  'final.subtitle': {
    ca: "El viatge 360° no és una sessió — és un punt d'inflexió.",
    en: "The 360° journey is not a session — it's a turning point.",
    es: 'El viaje 360° no es una sesión — es un punto de inflexión.',
    ru: 'Путешествие 360° — это не сессия, а поворотный момент.',
  },
  'final.cta': {
    ca: 'Reserva la teva revisió corporal 360°',
    en: 'Book your 360° body review',
    es: 'Reserva tu revisión corporal 360°',
    ru: 'Забронировать ваш телесный обзор 360°',
  },
  'final.noInsurance': {
    ca: 'No cal assegurança',
    en: 'No insurance needed',
    es: 'No necesita seguro',
    ru: 'Страховка не нужна',
  },
  'final.flexibleSchedule': {
    ca: 'Horaris flexibles',
    en: 'Flexible schedules',
    es: 'Horarios flexibles',
    ru: 'Гибкое расписание',
  },
  'final.personalizedApproach': {
    ca: 'Enfocament personalitzat',
    en: 'Personalized approach',
    es: 'Enfoque personalizado',
    ru: 'Персонализированный подход',
  },
  'final.healingQuote': {
    ca: 'Cada viatge de sanació comença amb un sol pas cap a la integritat.',
    en: 'Every healing journey begins with a single step toward integrity.',
    es: 'Cada viaje de sanación comienza con un solo paso hacia la integridad.',
    ru: 'Каждое путешествие исцеления начинается с одного шага к целостности.',
  },
  'final.scheduleDiscovery': {
    ca: 'Programar una trucada de descobriment',
    en: 'Schedule a discovery call',
    es: 'Programar una llamada de descubrimiento',
    ru: 'Запланировать ознакомительный звонок',
  },
  'final.downloadGuide': {
    ca: 'Descarregar la nostra guia',
    en: 'Download our guide',
    es: 'Descargar nuestra guía',
    ru: 'Скачать наше руководство',
  },
  'final.stat1': {
    ca: 'Vides transformades',
    en: 'Lives transformed',
    es: 'Vidas transformadas',
    ru: 'Жизни трансформированы',
  },
  'final.stat2': {
    ca: "Anys d'experiència",
    en: 'Years of experience',
    es: 'Años de experiencia',
    ru: 'Лет опыта',
  },
  'final.stat3': {
    ca: 'Satisfacció del client',
    en: 'Client satisfaction',
    es: 'Satisfacción del cliente',
    ru: 'Удовлетворенность клиентов',
  },

  // WhatsApp Messages
  'whatsapp.discoveryCall': {
    ca: "Hola, m'agradaria programar una trucada de descobriment. Podríem parlar?",
    en: 'Hello, I would like to schedule a discovery call. Could we talk?',
    es: 'Hola, me gustaría programar una llamada de descubrimiento. ¿Podríamos hablar?',
    ru: 'Привет, я хотел бы запланировать ознакомительный звонок. Можем ли мы поговорить?',
  },

  // Testimonials Section
  'testimonials.title': {
    ca: 'Històries de Transformació',
    en: 'Transformation Stories',
    es: 'Historias de Transformación',
    ru: 'Истории Трансформации',
  },
  'testimonials.subtitle': {
    ca: 'Persones reals, resultats reals, canvi durador real.',
    en: 'Real people, real results, real lasting change.',
    es: 'Personas reales, resultados reales, cambio duradero real.',
    ru: 'Реальные люди, реальные результаты, реальные долгосрочные изменения.',
  },

  // Variants Section
  'variants.title': {
    ca: 'Tria el Teu Camí',
    en: 'Choose Your Path',
    es: 'Elige Tu Camino',
    ru: 'Выберите Свой Путь',
  },
  'variants.subtitle': {
    ca: "Cada camí comença amb 360°. Selecciona l'enfocament que ressoni amb les teves necessitats actuals.",
    en: 'Every path begins with 360°. Select the approach that resonates with your current needs.',
    es: 'Cada camino comienza con 360°. Selecciona el enfoque que resuene con tus necesidades actuales.',
    ru: 'Каждый путь начинается с 360°. Выберите подход, который резонирует с вашими текущими потребностями.',
  },
  'variants.idealFor': {
    ca: 'Ideal per a',
    en: 'Ideal for',
    es: 'Ideal para',
    ru: 'Идеально для',
  },
  'variants.includes': {
    ca: 'Què inclou',
    en: 'What includes',
    es: 'Qué incluye',
    ru: 'Что включает',
  },
  'variants.sessionDuration': {
    ca: 'Durada de la Sessió',
    en: 'Session Duration',
    es: 'Duración de la Sesión',
    ru: 'Продолжительность Сессии',
  },
  'variants.investment': {
    ca: 'Inversió',
    en: 'Investment',
    es: 'Inversión',
    ru: 'Инвестиция',
  },
  'variants.bookSession': {
    ca: 'Reservar aquesta sessió',
    en: 'Book this session',
    es: 'Reservar esta sesión',
    ru: 'Забронировать эту сессию',
  },
  'variants.clickForDetails': {
    ca: 'Fes clic per detalls',
    en: 'Click for details',
    es: 'Haz clic para detalles',
    ru: 'Нажмите для деталей',
  },
  // Variant Reset
  'variants.reset.title': {
    ca: 'Reinici 360°',
    en: 'Reset 360°',
    es: 'Reinicio 360°',
    ru: 'Перезагрузка 360°',
  },
  'variants.reset.subtitle': {
    ca: 'Reinicia cos i emocions',
    en: 'Reset body and emotions',
    es: 'Reinicia cuerpo y emociones',
    ru: 'Перезагрузите тело и эмоции',
  },
  'variants.reset.description': {
    ca: 'Un reinici integral per quan la vida se sent estancada o aclaparadora. Perfecte per a transicions importants, estrès crònic, o quan necessites començar de nou.',
    en: 'A comprehensive reset for when life feels stuck or overwhelming. Perfect for major transitions, chronic stress, or when you need to start fresh.',
    es: 'Un reinicio integral para cuando la vida se siente estancada o abrumadora. Perfecto para transiciones importantes, estrés crónico, o cuando necesitas empezar de nuevo.',
    ru: 'Комплексная перезагрузка для случаев, когда жизнь ощущается застойной или подавляющей. Идеально для важных переходов, хронического стресса или когда вам нужно начать заново.',
  },
  'variants.reset.idealFor.1': {
    ca: 'Estrès crònic i esgotament',
    en: 'Chronic stress and burnout',
    es: 'Estrés crónico y agotamiento',
    ru: 'Хронический стресс и выгорание',
  },
  'variants.reset.idealFor.2': {
    ca: 'Transicions importants de vida',
    en: 'Major life transitions',
    es: 'Transiciones importantes de vida',
    ru: 'Важные жизненные переходы',
  },
  'variants.reset.idealFor.3': {
    ca: 'Sentir-se física o emocionalment estancat',
    en: 'Feeling physically or emotionally stuck',
    es: 'Sentirse física o emocionalmente estancado',
    ru: 'Чувство физической или эмоциональной застойности',
  },
  'variants.reset.idealFor.4': {
    ca: 'Recuperació post-trauma',
    en: 'Post-trauma recovery',
    es: 'Recuperación post-trauma',
    ru: 'Восстановление после травмы',
  },
  'variants.reset.duration': {
    ca: '3 hores',
    en: '3 hours',
    es: '3 horas',
    ru: '3 часа',
  },
  'variants.reset.includes.1': {
    ca: 'Sessió de reinici del sistema nerviós',
    en: 'Nervous system reset session',
    es: 'Sesión de reinicio del sistema nervioso',
    ru: 'Сессия перезагрузки нервной системы',
  },
  'variants.reset.includes.2': {
    ca: "Treball corporal d'alliberament emocional",
    en: 'Emotional release bodywork',
    es: 'Trabajo corporal de liberación emocional',
    ru: 'Работа с телом для эмоционального освобождения',
  },
  'variants.reset.includes.3': {
    ca: "Identificació de patrons d'estrès",
    en: 'Stress pattern identification',
    es: 'Identificación de patrones de estrés',
    ru: 'Идентификация стрессовых паттернов',
  },
  'variants.reset.includes.4': {
    ca: 'Pla de recuperació personalitzat',
    en: 'Personalized recovery plan',
    es: 'Plan de recuperación personalizado',
    ru: 'Персонализированный план восстановления',
  },
  // Variant Mapping
  'variants.mapping.title': {
    ca: 'Mapeig 360°',
    en: 'Mapping 360°',
    es: 'Mapeo 360°',
    ru: 'Картирование 360°',
  },
  'variants.mapping.subtitle': {
    ca: 'Diagnòstic detallat',
    en: 'Detailed diagnosis',
    es: 'Diagnóstico detallado',
    ru: 'Детальная диагностика',
  },
  'variants.mapping.description': {
    ca: 'Una exploració i anàlisi profunda dels patrons del teu cos. Ideal per entendre problemes crònics o preparar-se per un treball de sanació important.',
    en: "A deep exploration and analysis of your body's patterns. Ideal for understanding chronic issues or preparing for major healing work.",
    es: 'Una exploración y análisis profundo de los patrones de tu cuerpo. Ideal para entender problemas crónicos o prepararse para un trabajo de sanación importante.',
    ru: 'Глубокое исследование и анализ паттернов вашего тела. Идеально для понимания хронических проблем или подготовки к важной целительной работе.',
  },
  'variants.mapping.idealFor.1': {
    ca: 'Dolor o disfunció crònica',
    en: 'Chronic pain or dysfunction',
    es: 'Dolor o disfunción crónica',
    ru: 'Хроническая боль или дисфункция',
  },
  'variants.mapping.idealFor.2': {
    ca: 'Preparació per a cirurgia o tractament important',
    en: 'Preparation for surgery or major treatment',
    es: 'Preparación para cirugía o tratamiento importante',
    ru: 'Подготовка к операции или важному лечению',
  },
  'variants.mapping.idealFor.3': {
    ca: 'Entendre símptomes complexos',
    en: 'Understanding complex symptoms',
    es: 'Entender síntomas complejos',
    ru: 'Понимание сложных симптомов',
  },
  'variants.mapping.idealFor.4': {
    ca: 'Avaluació base per a atletes',
    en: 'Baseline assessment for athletes',
    es: 'Evaluación base para atletas',
    ru: 'Базовая оценка для спортсменов',
  },
  'variants.mapping.duration': {
    ca: '2.5 hores',
    en: '2.5 hours',
    es: '2.5 horas',
    ru: '2.5 часа',
  },
  'variants.mapping.includes.1': {
    ca: 'Escaneig corporal integral',
    en: 'Comprehensive body scan',
    es: 'Escaneo corporal integral',
    ru: 'Комплексное сканирование тела',
  },
  'variants.mapping.includes.2': {
    ca: 'Anàlisi de patrons de moviment',
    en: 'Movement pattern analysis',
    es: 'Análisis de patrones de movimiento',
    ru: 'Анализ двигательных паттернов',
  },
  'variants.mapping.includes.3': {
    ca: "Informe d'avaluació detallat",
    en: 'Detailed assessment report',
    es: 'Informe de evaluación detallado',
    ru: 'Детальный отчет оценки',
  },
  'variants.mapping.includes.4': {
    ca: 'Pla de recomanacions de tractament',
    en: 'Treatment recommendations plan',
    es: 'Plan de recomendaciones de tratamiento',
    ru: 'План рекомендаций по лечению',
  },
  // Variant Alignment
  'variants.alignment.title': {
    ca: 'Alineació 360°',
    en: 'Alignment 360°',
    es: 'Alineación 360°',
    ru: 'Выравнивание 360°',
  },
  'variants.alignment.subtitle': {
    ca: 'Postura i moviment',
    en: 'Posture and movement',
    es: 'Postura y movimiento',
    ru: 'Осанка и движение',
  },
  'variants.alignment.description': {
    ca: "Enfocat en l'equilibri estructural i patrons de moviment òptims. Perfecte per abordar problemes posturals i ineficiències del moviment.",
    en: 'Focused on structural balance and optimal movement patterns. Perfect for addressing postural issues and movement inefficiencies.',
    es: 'Enfocado en el equilibrio estructural y patrones de movimiento óptimos. Perfecto para abordar problemas posturales e ineficiencias del movimiento.',
    ru: 'Сосредоточен на структурном балансе и оптимальных двигательных паттернах. Идеально для решения постуральных проблем и неэффективности движений.',
  },
  'variants.alignment.idealFor.1': {
    ca: 'Desequilibris posturals',
    en: 'Postural imbalances',
    es: 'Desequilibrios posturales',
    ru: 'Постуральные дисбалансы',
  },
  'variants.alignment.idealFor.2': {
    ca: 'Disfunció del moviment',
    en: 'Movement dysfunction',
    es: 'Disfunción del movimiento',
    ru: 'Двигательная дисфункция',
  },
  'variants.alignment.idealFor.3': {
    ca: 'Optimització del rendiment atlètic',
    en: 'Athletic performance optimization',
    es: 'Optimización del rendimiento atlético',
    ru: 'Оптимизация спортивных результатов',
  },
  'variants.alignment.idealFor.4': {
    ca: "Problemes d'ergonomia laboral",
    en: 'Workplace ergonomic issues',
    es: 'Problemas de ergonomía laboral',
    ru: 'Проблемы эргономики на рабочем месте',
  },
  'variants.alignment.duration': {
    ca: '2 hores',
    en: '2 hours',
    es: '2 horas',
    ru: '2 часа',
  },
  'variants.alignment.includes.1': {
    ca: 'Avaluació i correcció postural',
    en: 'Postural assessment and correction',
    es: 'Evaluación y corrección postural',
    ru: 'Постуральная оценка и коррекция',
  },
  'variants.alignment.includes.2': {
    ca: 'Reeducació del moviment',
    en: 'Movement re-education',
    es: 'Reeducación del movimiento',
    ru: 'Переобучение движению',
  },
  'variants.alignment.includes.3': {
    ca: 'Recomanacions ergonòmiques',
    en: 'Ergonomic recommendations',
    es: 'Recomendaciones ergonómicas',
    ru: 'Эргономические рекомендации',
  },
  'variants.alignment.includes.4': {
    ca: "Prescripció d'exercicis",
    en: 'Exercise prescription',
    es: 'Prescripción de ejercicios',
    ru: 'Назначение упражнений',
  },
  // Variant Integral
  'variants.integral.title': {
    ca: 'Integral 360°',
    en: 'Integral 360°',
    es: 'Integral 360°',
    ru: 'Интегральный 360°',
  },
  'variants.integral.subtitle': {
    ca: 'Totes les tècniques combinades',
    en: 'All techniques combined',
    es: 'Todas las técnicas combinadas',
    ru: 'Все техники объединены',
  },
  'variants.integral.description': {
    ca: "L'experiència completa combinant totes les nostres modalitats. Per a aquells preparats per a una transformació profunda i duradora a través de totes les dimensions de l'ésser.",
    en: 'The complete experience combining all our modalities. For those ready for deep and lasting transformation across all dimensions of being.',
    es: 'La experiencia completa combinando todas nuestras modalidades. Para aquellos listos para una transformación profunda y duradera a través de todas las dimensiones del ser.',
    ru: 'Полный опыт, объединяющий все наши модальности. Для тех, кто готов к глубокой и длительной трансформации через все измерения бытия.',
  },
  'variants.integral.idealFor.1': {
    ca: 'Transformació integral',
    en: 'Comprehensive transformation',
    es: 'Transformación integral',
    ru: 'Комплексная трансформация',
  },
  'variants.integral.idealFor.2': {
    ca: 'Involucració de múltiples sistemes',
    en: 'Multiple system involvement',
    es: 'Involucración de múltiples sistemas',
    ru: 'Вовлечение множественных систем',
  },
  'variants.integral.idealFor.3': {
    ca: 'Objectius de benestar a llarg termini',
    en: 'Long-term wellness goals',
    es: 'Objetivos de bienestar a largo plazo',
    ru: 'Долгосрочные цели благополучия',
  },
  'variants.integral.idealFor.4': {
    ca: 'Enfocament de sanació holística',
    en: 'Holistic healing approach',
    es: 'Enfoque de sanación holística',
    ru: 'Холистический подход к исцелению',
  },
  'variants.integral.duration': {
    ca: '5 hores',
    en: '5 hours',
    es: '5 horas',
    ru: '5 часов',
  },
  'variants.integral.includes.1': {
    ca: 'Revisió Corporal 360° completa',
    en: 'Complete 360° Body Review',
    es: 'Revisión Corporal 360° completa',
    ru: 'Полный Телесный Обзор 360°',
  },
  'variants.integral.includes.2': {
    ca: 'Múltiples modalitats terapèutiques',
    en: 'Multiple therapeutic modalities',
    es: 'Múltiples modalidades terapéuticas',
    ru: 'Множественные терапевтические модальности',
  },
  'variants.integral.includes.3': {
    ca: "Pla d'integració integral",
    en: 'Comprehensive integration plan',
    es: 'Plan de integración integral',
    ru: 'Комплексный план интеграции',
  },
  'variants.integral.includes.4': {
    ca: 'Suport de seguiment de 3 mesos',
    en: '3-month follow-up support',
    es: 'Soporte de seguimiento de 3 meses',
    ru: '3-месячная поддержка последующего наблюдения',
  },

  // Catalan Prompt Section
  'prompt.title': {
    ca: 'Enfocament integratiu del cos sencer',
    en: 'Whole-body integrative approach',
    es: 'Enfoque integrativo de todo el cuerpo',
    ru: 'Интегративный подход к целому телу',
  },
  'prompt.subtitle': {
    ca: 'Treballo amb una visió global: cos, ment, emocions i energia. La meva tasca és ajudar-te a reconnectar amb el teu eix intern perquè el cos recuperi equilibri, força i claredat.',
    en: 'I work with a global vision: body, mind, emotions and energy. My task is to help you reconnect with your inner axis so that the body recovers balance, strength and clarity.',
    es: 'Trabajo con una visión global: cuerpo, mente, emociones y energía. Mi tarea es ayudarte a reconectar con tu eje interno para que el cuerpo recupere equilibrio, fuerza y claridad.',
    ru: 'Я работаю с глобальным видением: тело, разум, эмоции и энергия. Моя задача — помочь вам восстановить связь с вашей внутренней осью, чтобы тело восстановило равновесие, силу и ясность.',
  },
  'prompt.whatWework': {
    ca: 'Què treballem',
    en: 'What we work on',
    es: 'En qué trabajamos',
    ru: 'Над чем мы работаем',
  },
  'prompt.body': {
    ca: 'Cos (físic)',
    en: 'Body (physical)',
    es: 'Cuerpo (físico)',
    ru: 'Тело (физическое)',
  },
  'prompt.bodyDesc': {
    ca: 'dolors recurrents, tensió muscular, postura, respiració, fatiga',
    en: 'recurring pain, muscle tension, posture, breathing, fatigue',
    es: 'dolores recurrentes, tensión muscular, postura, respiración, fatiga',
    ru: 'повторяющиеся боли, мышечное напряжение, осанка, дыхание, усталость',
  },
  'prompt.emotions': {
    ca: 'Emocions',
    en: 'Emotions',
    es: 'Emociones',
    ru: 'Эмоции',
  },
  'prompt.emotionsDesc': {
    ca: 'estrès, ansietat, bloquejos, patrons que es repeteixen, regulació emocional',
    en: 'stress, anxiety, blockages, repetitive patterns, emotional regulation',
    es: 'estrés, ansiedad, bloqueos, patrones repetitivos, regulación emocional',
    ru: 'стресс, тревога, блокировки, повторяющиеся паттерны, эмоциональная регуляция',
  },
  'prompt.mind': {
    ca: 'Ment',
    en: 'Mind',
    es: 'Mente',
    ru: 'Разум',
  },
  'prompt.mindDesc': {
    ca: 'excés de pensament, desgast mental, falta de focus, decisions difícils',
    en: 'overthinking, mental fatigue, lack of focus, difficult decisions',
    es: 'exceso de pensamiento, desgaste mental, falta de enfoque, decisiones difíciles',
    ru: 'избыточное мышление, умственная усталость, недостаток фокуса, трудные решения',
  },
  'prompt.energy': {
    ca: 'Energia',
    en: 'Energy',
    es: 'Energía',
    ru: 'Энергия',
  },
  'prompt.energyDesc': {
    ca: 'recuperació, qualitat del son, ritmes interns, vitalitat',
    en: 'recovery, sleep quality, internal rhythms, vitality',
    es: 'recuperación, calidad del sueño, ritmos internos, vitalidad',
    ru: 'восстановление, качество сна, внутренние ритмы, жизненность',
  },
  'prompt.expectedResult': {
    ca: 'Resultat esperat',
    en: 'Expected result',
    es: 'Resultado esperado',
    ru: 'Ожидаемый результат',
  },
  'prompt.expectedResultDesc': {
    ca: "Més espai al cos, calma mental, energia estable i una sensació clara d'",
    en: 'More space in the body, mental calm, stable energy and a clear sense of',
    es: 'Más espacio en el cuerpo, calma mental, energía estable y una sensación clara de',
    ru: 'Больше пространства в теле, ментальный покой, стабильная энергия и ясное ощущение',
  },
  'prompt.selfDirection': {
    ca: 'autodirecció',
    en: 'self-direction',
    es: 'autodirección',
    ru: 'самонаправленности',
  },
  'prompt.systemChoice': {
    ca: 'el teu sistema comença a triar el que li fa bé, de forma natural',
    en: 'your system begins to choose what is good for it, naturally',
    es: 'tu sistema comienza a elegir lo que le hace bien, de forma natural',
    ru: 'ваша система начинает естественно выбирать то, что ей полезно',
  },
  'prompt.howIwork': {
    ca: 'Com treballo',
    en: 'How I work',
    es: 'Cómo trabajo',
    ru: 'Как я работаю',
  },
  'prompt.gentleDiagnosis': {
    ca: 'Diagnosi suau i precisa',
    en: 'Gentle and precise diagnosis',
    es: 'Diagnóstico suave y preciso',
    ru: 'Мягкая и точная диагностика',
  },
  'prompt.diagnosisDesc': {
    ca: 'escoltant el cos amb les mans i amb preguntes curtes',
    en: 'listening to the body with hands and short questions',
    es: 'escuchando el cuerpo con las manos y preguntas cortas',
    ru: 'слушая тело руками и короткими вопросами',
  },
  'prompt.integrativeTechniques': {
    ca: 'Tècniques integratives',
    en: 'Integrative techniques',
    es: 'Técnicas integrativas',
    ru: 'Интегративные техники',
  },
  'prompt.techniquesDesc': {
    ca: 'massatge terapèutic, kinesiologia, osteobalance, moviment conscient (Feldenkrais), respiració i regulació del sistema nerviós',
    en: 'therapeutic massage, kinesiology, osteobalance, conscious movement (Feldenkrais), breathing and nervous system regulation',
    es: 'masaje terapéutico, kinesiología, osteobalance, movimiento consciente (Feldenkrais), respiración y regulación del sistema nervioso',
    ru: 'терапевтический массаж, кинезиология, остеобаланс, осознанное движение (Фельденкрайз), дыхание и регуляция нервной системы',
  },
  'prompt.layeredProcesses': {
    ca: 'Processos en capes',
    en: 'Layered processes',
    es: 'Procesos en capas',
    ru: 'Многослойные процессы',
  },
  'prompt.layeredDesc': {
    ca: 'alliberar tensió, reordenar patrons i consolidar nous hàbits corporals i emocionals',
    en: 'release tension, reorder patterns and consolidate new bodily and emotional habits',
    es: 'liberar tensión, reordenar patrones y consolidar nuevos hábitos corporales y emocionales',
    ru: 'освобождение напряжения, переупорядочивание паттернов и укрепление новых телесных и эмоциональных привычек',
  },
  'prompt.session': {
    ca: 'Sessió',
    en: 'Session',
    es: 'Sesión',
    ru: 'Сессия',
  },
  'prompt.firstVisit': {
    ca: "Primera visita amb diagnosi i treball suau. A partir d'aquí, traço el",
    en: 'First visit with diagnosis and gentle work. From here, I outline the',
    es: 'Primera visita con diagnóstico y trabajo suave. A partir de aquí, trazo el',
    ru: 'Первый визит с диагностикой и мягкой работой. Отсюда я намечаю',
  },
  'prompt.personalPlan': {
    ca: 'pla personal',
    en: 'personal plan',
    es: 'plan personal',
    ru: 'персональный план',
  },
  'prompt.sessionsRange': {
    ca: '(normalment 3–6 sessions) per anar capa per capa',
    en: '(usually 3–6 sessions) to go layer by layer',
    es: '(normalmente 3–6 sesiones) para ir capa por capa',
    ru: '(обычно 3–6 сессий) для работы слой за слоем',
  },
  'prompt.forWho': {
    ca: 'Per a qui és',
    en: "Who it's for",
    es: 'Para quién es',
    ru: 'Для кого это',
  },
  'prompt.forWhoDesc': {
    ca: "Per a persones que volen canvis reals i consistents, no solucions ràpides. Si estàs preparada per escoltar-te i comprometre't amb el teu benestar, aquest treball és per a tu.",
    en: 'For people who want real and consistent changes, not quick solutions. If you are ready to listen to yourself and commit to your well-being, this work is for you.',
    es: 'Para personas que quieren cambios reales y consistentes, no soluciones rápidas. Si estás preparada para escucharte y comprometerte con tu bienestar, este trabajo es para ti.',
    ru: 'Для людей, которые хотят настоящих и последовательных изменений, а не быстрых решений. Если вы готовы слушать себя и посвятить себя своему благополучию, эта работа для вас.',
  },
  'prompt.booking': {
    ca: 'Reserva',
    en: 'Book',
    es: 'Reserva',
    ru: 'Забронировать',
  },
  'prompt.consultation': {
    ca: 'Consulta',
    en: 'Consultation',
    es: 'Consulta',
    ru: 'Консультация',
  },
  'prompt.promptLabel': {
    ca: 'Prompt',
    en: 'Prompt',
    es: 'Prompt',
    ru: 'Промпт',
  },
  'prompt.signature': {
    ca: '— Elena Kucherova',
    en: '— Elena Kucherova',
    es: '— Elena Kucherova',
    ru: '— Елена Кучерова',
  },
  'common.ekaBalance': {
    ca: 'EKA Balance',
    en: 'EKA Balance',
    es: 'EKA Balance',
    ru: 'EKA Balance',
  },
  'common.copyright': {
    ca: '© 2024',
    en: '© 2024',
    es: '© 2024',
    ru: '© 2024',
  },

  // Benefits Section - Individual Benefits
  'benefits.benefit1.title': {
    ca: 'Claredat Mental',
    en: 'Mental Clarity',
    es: 'Claridad Mental',
    ru: 'Ментальная Ясность',
  },
  'benefits.benefit1.description': {
    ca: 'Enfocament millorat i funció cognitiva',
    en: 'Improved focus and cognitive function',
    es: 'Enfoque mejorado y función cognitiva',
    ru: 'Улучшенная концентрация и когнитивная функция',
  },
  'benefits.benefit1.science': {
    ca: 'El treball corporal integratiu estimula el nervi vag, millorant la comunicació cervell-cos i la funció executiva.',
    en: 'Integrative bodywork stimulates the vagus nerve, improving brain-body communication and executive function.',
    es: 'El trabajo corporal integrativo estimula el nervio vago, mejorando la comunicación cerebro-cuerpo y la función ejecutiva.',
    ru: 'Интегративная работа с телом стимулирует блуждающий нерв, улучшая связь мозг-тело и исполнительную функцию.',
  },
  'benefits.benefit2.title': {
    ca: 'Equilibri Emocional',
    en: 'Emotional Balance',
    es: 'Equilibrio Emocional',
    ru: 'Эмоциональный Баланс',
  },
  'benefits.benefit2.description': {
    ca: 'Major resistència emocional i regulació',
    en: 'Greater emotional resilience and regulation',
    es: 'Mayor resistencia emocional y regulación',
    ru: 'Большая эмоциональная устойчивость и регуляция',
  },
  'benefits.benefit2.science': {
    ca: "Les tècniques somàtiques ajuden a processar el trauma emmagatzemat i regular els patrons de resposta a l'estrès del sistema nerviós.",
    en: 'Somatic techniques help process stored trauma and regulate nervous system stress response patterns.',
    es: 'Las técnicas somáticas ayudan a procesar el trauma almacenado y regular los patrones de respuesta al estrés del sistema nervioso.',
    ru: 'Соматические техники помогают обработать накопленную травму и регулировать паттерны стрессовой реакции нервной системы.',
  },
  'benefits.benefit3.title': {
    ca: 'Energia Sostinguda',
    en: 'Sustained Energy',
    es: 'Energía Sostenida',
    ru: 'Устойчивая Энергия',
  },
  'benefits.benefit3.description': {
    ca: 'Vitalitat natural sense estimulació artificial',
    en: 'Natural vitality without artificial stimulation',
    es: 'Vitalidad natural sin estimulación artificial',
    ru: 'Естественная жизненность без искусственной стимуляции',
  },
  'benefits.benefit3.science': {
    ca: "Abordar les restriccions fascials i els desequilibris posturals redueix el malbaratament d'energia metabòlica, augmentant la vitalitat natural.",
    en: 'Addressing fascial restrictions and postural imbalances reduces metabolic energy waste, increasing natural vitality.',
    es: 'Abordar las restricciones fasciales y los desequilibrios posturales reduce el desperdicio de energía metabólica, aumentando la vitalidad natural.',
    ru: 'Устранение фасциальных ограничений и постуральных дисбалансов снижает метаболическое расточительство энергии, увеличивая естественную жизненность.',
  },
  'benefits.benefit4.title': {
    ca: 'Alleujament del Dolor',
    en: 'Pain Relief',
    es: 'Alivio del Dolor',
    ru: 'Облегчение Боли',
  },
  'benefits.benefit4.description': {
    ca: 'Alleujament durador de patrons de dolor crònic',
    en: 'Lasting relief from chronic pain patterns',
    es: 'Alivio duradero de patrones de dolor crónico',
    ru: 'Длительное облегчение хронических болевых паттернов',
  },
  'benefits.benefit4.science': {
    ca: "L'enfocament 360° aborda les causes arrel en lloc dels símptomes, creant canvis neuroplàstics duradors en la percepció del dolor.",
    en: 'The 360° approach addresses root causes rather than symptoms, creating lasting neuroplastic changes in pain perception.',
    es: 'El enfoque 360° aborda las causas raíz en lugar de los síntomas, creando cambios neuroplásticos duraderos en la percepción del dolor.',
    ru: '360° подход обращается к корневым причинам, а не к симптомам, создавая длительные нейропластические изменения в восприятии боли.',
  },
  'benefits.benefit5.title': {
    ca: 'Millor Son',
    en: 'Better Sleep',
    es: 'Mejor Sueño',
    ru: 'Лучший Сон',
  },
  'benefits.benefit5.description': {
    ca: 'Cicles de son més profunds i reparadors',
    en: 'Deeper, more restorative sleep cycles',
    es: 'Ciclos de sueño más profundos y reparadores',
    ru: 'Более глубокие, восстановительные циклы сна',
  },
  'benefits.benefit5.science': {
    ca: "La regulació del sistema nerviós i l'alliberament de tensions promouen ritmes circadians saludables i arquitectura del son.",
    en: 'Nervous system regulation and tension release promote healthy circadian rhythms and sleep architecture.',
    es: 'La regulación del sistema nervioso y la liberación de tensiones promueven ritmos circadianos saludables y arquitectura del sueño.',
    ru: 'Регуляция нервной системы и освобождение от напряжения способствуют здоровым циркадным ритмам и архитектуре сна.',
  },
  'benefits.benefit6.title': {
    ca: "Resistència a l'Estrès",
    en: 'Stress Resilience',
    es: 'Resistencia al Estrés',
    ru: 'Стрессоустойчивость',
  },
  'benefits.benefit6.description': {
    ca: 'Major capacitat per gestionar els reptes de la vida',
    en: "Greater capacity to handle life's challenges",
    es: 'Mayor capacidad para manejar los desafíos de la vida',
    ru: 'Большая способность справляться с жизненными вызовами',
  },
  'benefits.benefit6.science': {
    ca: "Construir el to parasimpàtic a través del treball corporal augmenta la resistència a l'estrès i la capacitat de recuperació.",
    en: 'Building parasympathetic tone through bodywork increases stress resilience and recovery capacity.',
    es: 'Construir el tono parasimpático a través del trabajo corporal aumenta la resistencia al estrés y la capacidad de recuperación.',
    ru: 'Построение парасимпатического тонуса через работу с телом увеличивает стрессоустойчивость и способность к восстановлению.',
  },
  'benefits.benefit7.title': {
    ca: 'Llibertat de Moviment',
    en: 'Movement Freedom',
    es: 'Libertad de Movimiento',
    ru: 'Свобода Движения',
  },
  'benefits.benefit7.description': {
    ca: 'Millor mobilitat i consciència corporal',
    en: 'Improved mobility and body awareness',
    es: 'Movilidad mejorada y conciencia corporal',
    ru: 'Улучшенная мобильность и осознание тела',
  },
  'benefits.benefit7.science': {
    ca: "L'alliberament fascial i la reeducació del moviment restauren els patrons naturals de moviment i la consciència propioceptiva.",
    en: 'Fascial release and movement re-education restore natural movement patterns and proprioceptive awareness.',
    es: 'La liberación fascial y la reeducación del movimiento restauran los patrones naturales de movimiento y la conciencia propioceptiva.',
    ru: 'Фасциальное освобождение и переобучение движению восстанавливают естественные двигательные паттерны и проприоцептивное осознание.',
  },
  'benefits.benefit8.title': {
    ca: 'Brúixola Interior',
    en: 'Inner Compass',
    es: 'Brújula Interior',
    ru: 'Внутренний Компас',
  },
  'benefits.benefit8.description': {
    ca: 'Connexió més forta amb la intuïció i saviesa interior',
    en: 'Stronger connection to intuition and inner wisdom',
    es: 'Conexión más fuerte con la intuición y sabiduría interior',
    ru: 'Более сильная связь с интуицией и внутренней мудростью',
  },
  'benefits.benefit8.science': {
    ca: 'La consciència interoceptiva desenvolupada a través del treball corporal millora les sensacions viscerals i la claredat en la presa de decisions.',
    en: 'Interoceptive awareness developed through bodywork enhances gut feelings and decision-making clarity.',
    es: 'La conciencia interoceptiva desarrollada a través del trabajo corporal mejora las sensaciones viscerales y la claridad en la toma de decisiones.',
    ru: 'Интероцептивное осознание, развитое через работу с телом, улучшает интуитивные ощущения и ясность принятия решений.',
  },
  'benefits.benefit9.title': {
    ca: 'Vitalitat',
    en: 'Vitality',
    es: 'Vitalidad',
    ru: 'Жизненность',
  },
  'benefits.benefit9.description': {
    ca: 'Renovat sentit de vida i presència',
    en: 'Renewed sense of aliveness and presence',
    es: 'Renovado sentido de vida y presencia',
    ru: 'Обновленное чувство живости и присутствия',
  },
  'benefits.benefit9.science': {
    ca: 'Eliminar bloquejos energètics i restaurar el flux crea millores mesurables en la força vital i presència.',
    en: 'Clearing energetic blockages and restoring flow creates measurable improvements in life force and presence.',
    es: 'Eliminar bloqueos energéticos y restaurar el flujo crea mejoras medibles en la fuerza vital y presencia.',
    ru: 'Устранение энергетических блоков и восстановление потока создает измеримые улучшения в жизненной силе и присутствии.',
  },
  'benefits.science': {
    ca: 'La Ciència',
    en: 'The Science',
    es: 'La Ciencia',
    ru: 'Наука',
  },
  'benefits.philosophy': {
    ca: "Mesurem l'èxit no només en l'absència de símptomes, sinó en la presència de vitalitat, goig, i el coneixement profund que el teu cos és el teu aliat en la vida.",
    en: 'We measure success not just in the absence of symptoms, but in the presence of vitality, joy, and the deep knowing that your body is your ally in life.',
    es: 'Medimos el éxito no solo en la ausencia de síntomas, sino en la presencia de vitalidad, alegría, y el conocimiento profundo de que tu cuerpo es tu aliado en la vida.',
    ru: 'Мы измеряем успех не только отсутствием симптомов, но и присутствием жизненности, радости и глубокого понимания того, что ваше тело — ваш союзник в жизни.',
  },

  // Service Section Details
  'service.step1.details.1': {
    ca: 'Avaluació integral de salut i estil de vida',
    en: 'Comprehensive health and lifestyle assessment',
    es: 'Evaluación integral de salud y estilo de vida',
    ru: 'Комплексная оценка здоровья и образа жизни',
  },
  'service.step1.details.2': {
    ca: 'Anàlisi de patrons de moviment',
    en: 'Movement pattern analysis',
    es: 'Análisis de patrones de movimiento',
    ru: 'Анализ двигательных паттернов',
  },
  'service.step1.details.3': {
    ca: "Mapeig emocional i de patrons d'estrès",
    en: 'Emotional mapping and stress pattern analysis',
    es: 'Mapeo emocional y análisis de patrones de estrés',
    ru: 'Эмоциональное картирование и анализ стрессовых паттернов',
  },
  'service.step1.details.4': {
    ca: "Establiment d'objectius i alineació d'intencions",
    en: 'Goal setting and intention alignment',
    es: 'Establecimiento de objetivos y alineación de intenciones',
    ru: 'Постановка целей и выравнивание намерений',
  },
  'service.step2.details.1': {
    ca: 'Anàlisi postural i estructural',
    en: 'Postural and structural analysis',
    es: 'Análisis postural y estructural',
    ru: 'Постуральный и структурный анализ',
  },
  'service.step2.details.2': {
    ca: 'Avaluació de tensió fascial i mobilitat',
    en: 'Fascial tension and mobility assessment',
    es: 'Evaluación de tensión fascial y movilidad',
    ru: 'Оценка фасциального напряжения и подвижности',
  },
  'service.step2.details.3': {
    ca: 'Avaluació del flux energètic',
    en: 'Energy flow assessment',
    es: 'Evaluación del flujo energético',
    ru: 'Оценка энергетического потока',
  },
  'service.step2.details.4': {
    ca: "Avaluació de l'estat del sistema nerviós",
    en: 'Nervous system state assessment',
    es: 'Evaluación del estado del sistema nervioso',
    ru: 'Оценка состояния нервной системы',
  },
  'service.step3.details.1': {
    ca: 'Teràpia manual i treball corporal',
    en: 'Manual therapy and bodywork',
    es: 'Terapia manual y trabajo corporal',
    ru: 'Мануальная терапия и работа с телом',
  },
  'service.step3.details.2': {
    ca: 'Regulació de la respiració i sistema nerviós',
    en: 'Breathing and nervous system regulation',
    es: 'Regulación de la respiración y sistema nervioso',
    ru: 'Регуляция дыхания и нервной системы',
  },
  'service.step3.details.3': {
    ca: 'Reeducació del moviment',
    en: 'Movement re-education',
    es: 'Reeducación del movimiento',
    ru: 'Переобучение движению',
  },
  'service.step3.details.4': {
    ca: "Tècniques d'equilibri energètic",
    en: 'Energy balancing techniques',
    es: 'Técnicas de equilibrio energético',
    ru: 'Техники энергетического баланса',
  },
  'service.step4.details.1': {
    ca: 'Seqüències de moviment personalitzades',
    en: 'Personalized movement sequences',
    es: 'Secuencias de movimiento personalizadas',
    ru: 'Персонализированные двигательные последовательности',
  },
  'service.step4.details.2': {
    ca: "Pràctiques d'autocura i eines",
    en: 'Self-care practices and tools',
    es: 'Prácticas de autocuidado y herramientas',
    ru: 'Практики и инструменты самоухода',
  },
  'service.step4.details.3': {
    ca: "Suggeriments de modificació de l'estil de vida",
    en: 'Lifestyle modification suggestions',
    es: 'Sugerencias de modificación del estilo de vida',
    ru: 'Рекомендации по изменению образа жизни',
  },
  'service.step4.details.4': {
    ca: 'Planificació de sessions de seguiment',
    en: 'Follow-up session planning',
    es: 'Planificación de sesiones de seguimiento',
    ru: 'Планирование последующих сессий',
  },

  // Testimonials
  'testimonials.maria.name': {
    ca: 'Maria',
    en: 'Maria',
    es: 'María',
    ru: 'Мария',
  },
  'testimonials.maria.issue': {
    ca: 'Dolor crònic de coll i estrès',
    en: 'Chronic neck pain and stress',
    es: 'Dolor crónico de cuello y estrés',
    ru: 'Хроническая боль в шее и стресс',
  },
  'testimonials.maria.quote': {
    ca: "Després de 15 anys de dolor, finalment em sento com jo mateixa un altre cop. L'enfocament 360° no només va arreglar el meu coll — em va tornar la meva confiança.",
    en: "After 15 years of pain, I finally feel like myself again. The 360° approach didn't just fix my neck — it gave me back my confidence.",
    es: 'Después de 15 años de dolor, finalmente me siento como yo misma otra vez. El enfoque 360° no solo arregló mi cuello — me devolvió mi confianza.',
    ru: 'После 15 лет боли я наконец снова чувствую себя собой. Подход 360° не только исправил мою шею — он вернул мне уверенность.',
  },
  'testimonials.maria.result': {
    ca: "Dolor reduït de 8/10 a 1/10, nivells d'estrès dramàticament millorats",
    en: 'Pain reduced from 8/10 to 1/10, stress levels dramatically improved',
    es: 'Dolor reducido de 8/10 a 1/10, niveles de estrés dramáticamente mejorados',
    ru: 'Боль уменьшилась с 8/10 до 1/10, уровень стресса значительно улучшился',
  },
  'testimonials.maria.timeframe': {
    ca: '3 mesos',
    en: '3 months',
    es: '3 meses',
    ru: '3 месяца',
  },
  'testimonials.maria.before': {
    ca: 'Tensió constant, mala postura, ansietat afectant la vida diària',
    en: 'Constant tension, poor posture, anxiety affecting daily life',
    es: 'Tensión constante, mala postura, ansiedad afectando la vida diaria',
    ru: 'Постоянное напряжение, плохая осанка, тревога, влияющая на повседневную жизнь',
  },
  'testimonials.maria.after': {
    ca: 'Moviment sense dolor, postura confident, sistema nerviós en pau',
    en: 'Pain-free movement, confident posture, peaceful nervous system',
    es: 'Movimiento sin dolor, postura confiada, sistema nervioso en paz',
    ru: 'Движение без боли, уверенная осанка, спокойная нервная система',
  },
  'testimonials.david.name': {
    ca: 'David',
    en: 'David',
    es: 'David',
    ru: 'Давид',
  },
  'testimonials.david.issue': {
    ca: 'Rendiment atlètic i recuperació',
    en: 'Athletic performance and recovery',
    es: 'Rendimiento atlético y recuperación',
    ru: 'Спортивные показатели и восстановление',
  },
  'testimonials.david.quote': {
    ca: 'Pensava que coneixia el meu cos com a atleta. El mapeig 360° va revelar patrons que mai vaig saber que existien. El meu rendiment i recuperació han assolit nous nivells.',
    en: 'I thought I knew my body as an athlete. The 360° mapping revealed patterns I never knew existed. My performance and recovery have reached new levels.',
    es: 'Pensaba que conocía mi cuerpo como atleta. El mapeo 360° reveló patrones que nunca supe que existían. Mi rendimiento y recuperación han alcanzado nuevos niveles.',
    ru: 'Я думал, что знаю свое тело как спортсмен. Картирование 360° выявило паттерны, о которых я никогда не знал. Мои показатели и восстановление достигли нового уровня.',
  },
  'testimonials.david.result': {
    ca: '25% de millora en temps de recuperació, va eliminar lesions recurrents',
    en: '25% improvement in recovery time, eliminated recurring injuries',
    es: '25% de mejora en tiempo de recuperación, eliminó lesiones recurrentes',
    ru: '25% улучшение времени восстановления, устранены повторяющиеся травмы',
  },
  'testimonials.david.timeframe': {
    ca: '6 setmanes',
    en: '6 weeks',
    es: '6 semanas',
    ru: '6 недель',
  },
  'testimonials.david.before': {
    ca: 'Lesions freqüents, recuperació lenta, estancaments en rendiment',
    en: 'Frequent injuries, slow recovery, performance plateaus',
    es: 'Lesiones frecuentes, recuperación lenta, estancamientos en rendimiento',
    ru: 'Частые травмы, медленное восстановление, застой в результатах',
  },
  'testimonials.david.after': {
    ca: 'Entrenament lliure de lesions, recuperació més ràpida, nous rècords personals',
    en: 'Injury-free training, faster recovery, new personal records',
    es: 'Entrenamiento libre de lesiones, recuperación más rápida, nuevos récords personales',
    ru: 'Тренировки без травм, более быстрое восстановление, новые личные рекорды',
  },
  'testimonials.jennifer.name': {
    ca: 'Jennifer',
    en: 'Jennifer',
    es: 'Jennifer',
    ru: 'Дженнифер',
  },
  'testimonials.jennifer.issue': {
    ca: 'Recuperació post-quirúrgica i mobilitat',
    en: 'Post-surgical recovery and mobility',
    es: 'Recuperación post-quirúrgica y movilidad',
    ru: 'Послеоперационное восстановление и подвижность',
  },
  'testimonials.jennifer.quote': {
    ca: 'Després de la meva cirurgia, em sentia desconnectada del meu cos. La sanació aquí va ser més enllà del físic — vaig aprendre a confiar en el meu cos un altre cop.',
    en: 'After my surgery, I felt disconnected from my body. The healing here went beyond physical — I learned to trust my body again.',
    es: 'Después de mi cirugía, me sentía desconectada de mi cuerpo. La sanación aquí fue más allá de lo físico — aprendí a confiar en mi cuerpo otra vez.',
    ru: 'После операции я чувствовала себя отключенной от своего тела. Исцеление здесь вышло за рамки физического — я научилась снова доверять своему телу.',
  },
  'testimonials.jennifer.result': {
    ca: 'Mobilitat completa restaurada, confiança en el moviment retornada',
    en: 'Full mobility restored, movement confidence returned',
    es: 'Movilidad completa restaurada, confianza en el movimiento retornada',
    ru: 'Полная подвижность восстановлена, уверенность в движении вернулась',
  },
  'testimonials.jennifer.timeframe': {
    ca: '4 mesos',
    en: '4 months',
    es: '4 meses',
    ru: '4 месяца',
  },
  'testimonials.jennifer.before': {
    ca: 'Mobilitat limitada, por al moviment, depressió',
    en: 'Limited mobility, fear of movement, depression',
    es: 'Movilidad limitada, miedo al movimiento, depresión',
    ru: 'Ограниченная подвижность, страх движения, депрессия',
  },
  'testimonials.jennifer.after': {
    ca: 'Rang complet de moviment, goig en el moviment, sanació emocional',
    en: 'Full range of motion, joy in movement, emotional healing',
    es: 'Rango completo de movimiento, alegría en el movimiento, sanación emocional',
    ru: 'Полная амплитуда движений, радость в движении, эмоциональное исцеление',
  },
  'testimonials.alex.name': {
    ca: 'Alex',
    en: 'Alex',
    es: 'Alex',
    ru: 'Алекс',
  },
  'testimonials.alex.issue': {
    ca: 'Ansietat i desregulació del sistema nerviós',
    en: 'Anxiety and nervous system dysregulation',
    es: 'Ansiedad y desregulación del sistema nervioso',
    ru: 'Тревога и дисрегуляция нервной системы',
  },
  'testimonials.alex.quote': {
    ca: 'Vaig venir per ansietat, sense esperar que el treball corporal ajudés. Però quan van explicar com el meu sistema nerviós estava encallat, tot va tenir sentit. Em sento calm al meu cos per primera vegada en anys.',
    en: 'I came for anxiety, not expecting bodywork to help. But when they explained how my nervous system was stuck, it all made sense. I feel calm in my body for the first time in years.',
    es: 'Vine por ansiedad, sin esperar que el trabajo corporal ayudara. Pero cuando explicaron cómo mi sistema nervioso estaba atascado, todo tuvo sentido. Me siento calmado en mi cuerpo por primera vez en años.',
    ru: 'Я пришел с тревогой, не ожидая, что работа с телом поможет. Но когда они объяснили, как моя нервная система застряла, все обрело смысл. Я чувствую спокойствие в своем теле впервые за годы.',
  },
  'testimonials.alex.result': {
    ca: 'Ansietat reduïda en 80%, qualitat del son dramàticament millorada',
    en: 'Anxiety reduced by 80%, sleep quality dramatically improved',
    es: 'Ansiedad reducida en 80%, calidad del sueño dramáticamente mejorada',
    ru: 'Тревога снижена на 80%, качество сна значительно улучшилось',
  },
  'testimonials.alex.timeframe': {
    ca: '8 setmanes',
    en: '8 weeks',
    es: '8 semanas',
    ru: '8 недель',
  },
  'testimonials.alex.before': {
    ca: 'Ansietat crònica, insomni, sentir-se insegur al cos',
    en: 'Chronic anxiety, insomnia, feeling unsafe in body',
    es: 'Ansiedad crónica, insomnio, sentirse inseguro en el cuerpo',
    ru: 'Хроническая тревога, бессонница, чувство небезопасности в теле',
  },
  'testimonials.alex.after': {
    ca: 'Sistema nerviós calm, son reparador, confiança encarnada',
    en: 'Calm nervous system, restorative sleep, embodied confidence',
    es: 'Sistema nervioso calmado, sueño reparador, confianza encarnada',
    ru: 'Спокойная нервная система, восстановительный сон, воплощенная уверенность',
  },

  // Common testimonial labels
  'testimonials.resultsAchieved': {
    ca: 'Resultats assolits:',
    en: 'Results achieved:',
    es: 'Resultados logrados:',
    ru: 'Достигнутые результаты:',
  },
  'testimonials.timeframe': {
    ca: 'Temps:',
    en: 'Time:',
    es: 'Tiempo:',
    ru: 'Время:',
  },
  'testimonials.watchVideo': {
    ca: 'Veure història en vídeo',
    en: 'Watch video story',
    es: 'Ver historia en vídeo',
    ru: 'Посмотреть видео-историю',
  },
  'testimonials.showBeforeAfter': {
    ca: 'Mostrar abans i després',
    en: 'Show before & after',
    es: 'Mostrar antes y después',
    ru: 'Показать до и после',
  },
  'testimonials.hideBeforeAfter': {
    ca: 'Amagar',
    en: 'Hide',
    es: 'Ocultar',
    ru: 'Скрыть',
  },
  'testimonials.before': {
    ca: 'Abans:',
    en: 'Before:',
    es: 'Antes:',
    ru: 'До:',
  },
  'testimonials.after': {
    ca: 'Després:',
    en: 'After:',
    es: 'Después:',
    ru: 'После:',
  },
  'testimonials.videoStory': {
    ca: 'Història de',
    en: 'Story of',
    es: 'Historia de',
    ru: 'История',
  },
  'testimonials.keyInsights': {
    ca: 'Perspectives Clau de',
    en: 'Key Insights from',
    es: 'Perspectivas Clave de',
    ru: 'Ключевые Выводы от',
  },
  'testimonials.keyInsight1': {
    ca: "Com l'enfocament 360° va abordar les causes arrel, no només els símptomes",
    en: 'How the 360° approach addressed root causes, not just symptoms',
    es: 'Cómo el enfoque 360° abordó las causas raíz, no solo los síntomas',
    ru: 'Как подход 360° обращался к корневым причинам, а не только к симптомам',
  },
  'testimonials.keyInsight2': {
    ca: "L'avenç emocional que va accelerar la sanació física",
    en: 'The emotional breakthrough that accelerated physical healing',
    es: 'El avance emocional que aceleró la sanación física',
    ru: 'Эмоциональный прорыв, который ускорил физическое исцеление',
  },
  'testimonials.keyInsight3': {
    ca: 'Eines pràctiques que continuen donant suport al benestar continu',
    en: 'Practical tools that continue to support ongoing wellness',
    es: 'Herramientas prácticas que continúan apoyando el bienestar continuo',
    ru: 'Практические инструменты, которые продолжают поддерживать постоянное благополучие',
  },
  'testimonials.keyInsight4': {
    ca: 'Per què aquest enfocament va tenir èxit on altres havien fallat',
    en: 'Why this approach succeeded where others had failed',
    es: 'Por qué este enfoque tuvo éxito donde otros habían fallado',
    ru: 'Почему этот подход преуспел там, где другие потерпели неудачу',
  },
  'testimonials.videoPlaceholder': {
    ca: 'El testimoni en vídeo es reproduiria aquí',
    en: 'Video testimonial would play here',
    es: 'El testimonio en vídeo se reproduciría aquí',
    ru: 'Здесь воспроизводился бы видео-отзыв',
  },
  'testimonials.videoImplementation': {
    ca: 'En una implementació real, això seria contingut de vídeo incorporat',
    en: 'In a real implementation, this would be embedded video content',
    es: 'En una implementación real, esto sería contenido de video incorporado',
    ru: 'В реальной реализации это было бы встроенное видео-содержание',
  },

  // Story modal content
  'story.title': {
    ca: 'Un Viatge de Sanació',
    en: 'A Healing Journey',
    es: 'Un Viaje de Sanación',
    ru: 'Путешествие Исцеления',
  },
  'story.intro': {
    ca: 'La Sarah va arribar a nosaltres carregant el pes de deu anys...',
    en: 'Sarah came to us carrying the weight of ten years...',
    es: 'Sarah llegó a nosotros cargando el peso de diez años...',
    ru: 'Сара пришла к нам, неся груз десяти лет...',
  },
  'story.paragraph1': {
    ca: "Les espatlles de la Sarah van parlar abans que ella. Corbades cap endins com un closca protector, guardaven la història d'innombrables nits sense dormir, de correus respostos a mitjanit, d'una promoció que va venir amb un preu que el seu cos encara estava pagant.",
    en: "Sarah's shoulders spoke before she did. Curved inward like a protective shell, they held the story of countless sleepless nights, of emails answered at midnight, of a promotion that came with a price her body was still paying.",
    es: 'Los hombros de Sarah hablaron antes que ella. Curvados hacia adentro como un caparazón protector, guardaban la historia de incontables noches sin dormir, de correos respondidos a medianoche, de una promoción que vino con un precio que su cuerpo aún estaba pagando.',
    ru: 'Плечи Сары заговорили раньше неё. Согнутые внутрь, как защитная оболочка, они хранили историю бесчисленных бессонных ночей, писем, отвеченных в полночь, повышения, которое пришло с ценой, которую её тело всё ещё платило.',
  },
  'story.paragraph2': {
    ca: '"Només vull que el meu coll deixi de doler," va dir durant la nostra primera sessió. Però el seu cos murmurava veritats més profundes — sobre la por allotjada al seu pit, l\'ansietat que havia pres residència a la seva mandíbula, l\'esgotament que vivia als seus mateixos ossos.',
    en: '"I just want my neck to stop hurting," she said during our first session. But her body whispered deeper truths — about the fear lodged in her chest, the anxiety that had taken residence in her jaw, the exhaustion that lived in her very bones.',
    es: '"Solo quiero que mi cuello deje de doler," dijo durante nuestra primera sesión. Pero su cuerpo susurraba verdades más profundas — sobre el miedo alojado en su pecho, la ansiedad que había tomado residencia en su mandíbula, el agotamiento que vivía en sus propios huesos.',
    ru: '"Я просто хочу, чтобы моя шея перестала болеть," — сказала она во время нашей первой сессии. Но её тело шептало более глубокие истины — о страхе, поселившемся в её груди, о тревоге, которая обосновалась в её челюсти, об истощении, которое жило в её костях.',
  },
  'story.paragraph3': {
    ca: "L'enfocament 360° no només va abordar el seu coll. Vam treballar amb els patrons emocionals que van crear la tensió, els desequilibris estructurals que la mantenien, i els bloquejos energètics que impedien la sanació. Vam escoltar el que el seu cos necessitava per tornar a sentir-se segur.",
    en: "The 360° approach didn't just address her neck. We worked with the emotional patterns that created the tension, the structural imbalances that maintained it, and the energetic blockages that prevented healing. We listened to what her body needed to feel safe again.",
    es: 'El enfoque 360° no solo abordó su cuello. Trabajamos con los patrones emocionales que crearon la tensión, los desequilibrios estructurales que la mantenían, y los bloqueos energéticos que impedían la sanación. Escuchamos lo que su cuerpo necesitaba para sentirse seguro otra vez.',
    ru: 'Подход 360° затронул не только её шею. Мы работали с эмоциональными паттернами, которые создавали напряжение, структурными дисбалансами, которые его поддерживали, и энергетическими блоками, которые препятствовали исцелению. Мы слушали, что нужно её телу, чтобы снова чувствовать себя в безопасности.',
  },
  'story.paragraph4': {
    ca: "Tres mesos després, la Sarah es posava diferent. No només més dreta — es posava com algú que va recordar que tenia permís per ocupar espai. El seu dolor de coll s'havia convertit en una porta per reclamar parts de si mateixa que havia oblidat que existien.",
    en: 'Three months later, Sarah carried herself differently. Not just straighter — she carried herself like someone who remembered she had permission to take up space. Her neck pain had become a doorway to reclaiming parts of herself she had forgotten existed.',
    es: 'Tres meses después, Sarah se llevaba a sí misma de manera diferente. No solo más derecha — se llevaba como alguien que recordó que tenía permiso para ocupar espacio. Su dolor de cuello se había convertido en una puerta para reclamar partes de sí misma que había olvidado que existían.',
    ru: 'Три месяца спустя Сара держалась по-другому. Не просто прямее — она держалась как кто-то, кто вспомнил, что имеет право занимать пространство. Её боль в шее стала дверью к возвращению частей себя, о существовании которых она забыла.',
  },
  'story.paragraph5': {
    ca: '"No només vaig recuperar el meu cos," ens va dir. "Vaig recuperar la meva vida."',
    en: '"I didn\'t just get my body back," she told us. "I got my life back."',
    es: '"No solo recuperé mi cuerpo," nos dijo. "Recuperé mi vida."',
    ru: '"Я не просто вернула своё тело," — сказала она нам. "Я вернула свою жизнь."',
  },
  'story.philosophy': {
    ca: "Cada cos té una història. Cada història mereix ser escoltada amb la plenitud que conté — no només els símptomes, sinó tota l'experiència humana que hi ha sota d'ells.",
    en: 'Every body has a story. Every story deserves to be heard in its fullness — not just the symptoms, but the whole human experience beneath them.',
    es: 'Cada cuerpo tiene una historia. Cada historia merece ser escuchada en su plenitud — no solo los síntomas, sino toda la experiencia humana que hay debajo de ellos.',
    ru: 'У каждого тела есть история. Каждая история заслуживает того, чтобы быть услышанной в полноте — не только симптомы, но и весь человеческий опыт под ними.',
  },

  // Additional Russian services texts
  'services.completeReview': {
    ca: 'Revisió Corporal 360° Completa',
    en: 'Complete 360° Body Review',
    es: 'Revisión Corporal 360° Completa',
    ru: 'Полный Телесный Обзор 360°',
  },
  'services.reset360': {
    ca: 'Reinici 360°',
    en: 'Reset 360°',
    es: 'Reinicio 360°',
    ru: 'Перезагрузка 360°',
  },
  'services.mapping360': {
    ca: 'Mapeig Corporal 360°',
    en: '360° Body Mapping',
    es: 'Mapeo Corporal 360°',
    ru: 'Телесное Картирование 360°',
  },
  'services.alignment360': {
    ca: 'Alineació 360°',
    en: 'Alignment 360°',
    es: 'Alineación 360°',
    ru: 'Выравнивание 360°',
  },
  'services.followUpConsultations': {
    ca: 'Consultes de Seguiment',
    en: 'Follow-up Consultations',
    es: 'Consultas de Seguimiento',
    ru: 'Консультации по Наблюдению',
  },

  // Additional CTA texts
  'cta.scheduleDiscoveryCall': {
    ca: 'Programar una trucada de descobriment',
    en: 'Schedule a discovery call',
    es: 'Programar una llamada de descubrimiento',
    ru: 'Запланировать ознакомительный звонок',
  },
  'cta.downloadGuide': {
    ca: 'Descarregar la nostra guia',
    en: 'Download our guide',
    es: 'Descargar nuestra guía',
    ru: 'Скачать наше руководство',
  },

  // Additional labels
  'labels.noInsuranceNeeded': {
    ca: 'No cal assegurança',
    en: 'No insurance needed',
    es: 'No necesita seguro',
    ru: 'Страховка не нужна',
  },
  'labels.flexibleSchedules': {
    ca: 'Horaris flexibles',
    en: 'Flexible schedules',
    es: 'Horarios flexibles',
    ru: 'Гибкое расписание',
  },
  'labels.personalizedApproach': {
    ca: 'Enfocament personalitzat',
    en: 'Personalized approach',
    es: 'Enfoque personalizado',
    ru: 'Персонализированный подход',
  },
  'labels.presentialConsultations': {
    ca: 'Consultes presencials',
    en: 'In-person consultations',
    es: 'Consultas presenciales',
    ru: 'Очные консультации',
  },
  'labels.onlineSessionsAvailable': {
    ca: 'i sessions online disponibles',
    en: 'and online sessions available',
    es: 'y sesiones online disponibles',
    ru: 'и онлайн-сессии доступны',
  },

  // Alt texts and accessibility
  'alt.ekaLogo': {
    ca: 'Logo EKA Balance',
    en: 'EKA Balance Logo',
    es: 'Logo EKA Balance',
    ru: 'Логотип EKA Balance',
  },

  // Footer
  'footer.brand': {
    ca: 'Sanació Integral 360°',
    en: 'Integral Healing 360°',
    es: 'Sanación Integral 360°',
    ru: 'Интегральное Исцеление 360°',
  },
  'footer.description': {
    ca: 'Transformant vides a través de la sanació integral del cos, ment i esperit. El teu viatge cap al benestar complet comença aquí.',
    en: 'Transforming lives through integral healing of body, mind and spirit. Your journey to complete wellness begins here.',
    es: 'Transformando vidas a través de la sanación integral del cuerpo, mente y espíritu. Tu viaje hacia el bienestar completo comienza aquí.',
    ru: 'Трансформируем жизни через интегральное исцеление тела, разума и духа. Ваше путешествие к полному благополучию начинается здесь.',
  },
  'footer.healingWithIntention': {
    ca: 'Sanant amb intenció',
    en: 'Healing with intention',
    es: 'Sanando con intención',
    ru: 'Исцеление с намерением',
  },
  'footer.contact': {
    ca: 'Contacte',
    en: 'Contact',
    es: 'Contacto',
    ru: 'Контакт',
  },
  'footer.services': {
    ca: 'Serveis',
    en: 'Services',
    es: 'Servicios',
    ru: 'Услуги',
  },
  'footer.copyright': {
    ca: '© 2024 EKA Balance. Tots els drets reservats.',
    en: '© 2024 EKA Balance. All rights reserved.',
    es: '© 2024 EKA Balance. Todos los derechos reservados.',
    ru: '© 2024 EKA Balance. Все права защищены.',
  },
  'footer.madeWith': {
    ca: 'Fet amb',
    en: 'Made with',
    es: 'Hecho con',
    ru: 'Сделано с',
  },
  'footer.forHealing': {
    ca: 'per a la sanació',
    en: 'for healing',
    es: 'para la sanación',
    ru: 'для исцеления',
  },
};

export const revision360Translations: Record<Language, Record<string, string>> = {
  ca: {},
  en: {},
  es: {},
  ru: {},
};

Object.entries(rawTranslations).forEach(([key, values]) => {
  revision360Translations.ca[key] = values.ca;
  revision360Translations.en[key] = values.en;
  revision360Translations.es[key] = values.es;
  revision360Translations.ru[key] = values.ru;
});
