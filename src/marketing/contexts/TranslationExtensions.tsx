import { Language } from './LanguageTypes';

// Extended translations for services and specialized content
export const servicesTranslations: Record<Language, Record<string, string>> = {
  ca: {
    'booking.smart.title': 'Com vols reservar?',
    'booking.smart.subtitle': "Tria l'opció que et sigui més còmoda",
    'booking.smart.quick': 'WhatsApp directe',
    'booking.smart.quickDesc': 'Obre el xat i escriu directament',
    'booking.smart.form': 'Formulari guiat',
    'booking.smart.formDesc': 'Omple les dades per agilitzar el procés',
    'booking.service.consultation': 'Consulta gratuïta 15 min',
    'booking.smart.name': 'El teu nom',
    'booking.smart.service': 'Servei desitjat',
    'booking.smart.time': 'Preferència horària',
    'booking.smart.send': 'Enviar per WhatsApp',
    'booking.smart.back': 'Enrere',

    // Service-specific translations
    'service.duration': 'Duració',
    'service.price': 'Preu',
    'service.supplements.title': 'Suplements personalitzats',
    'service.systemic.title': 'Teràpia sistèmica',
    'service.benefits': 'Beneficis',
    'service.ideal.for': 'Ideal per a',
    'service.what.to.expect': 'Què esperar',
    'service.preparation': 'Preparació',
    'service.aftercare': 'Cures posteriors',
    'service.contraindications': 'Contraindicacions',
    'service.booking.note': 'Nota de reserva',
    'service.sessions.recommended': 'Sessions recomanades',
    'service.frequency': 'Freqüència',

    // Onboarding Goals & Feelings
    'onboarding.goals.stress': 'Estrès i ansietat',
    'onboarding.goals.pain': 'Dolor o molèsties',
    'onboarding.goals.posture': 'Millorar postura',
    'onboarding.goals.sleep': 'Dormir millor',
    'onboarding.goals.energy': 'Més energia',
    'onboarding.goals.focus': 'Enfocament mental',
    'onboarding.goals.bodyAwareness': 'Connexió amb el cos',
    'onboarding.goals.feelGood': 'Sentir-me bé',
    'onboarding.goals.lightness': 'Lleugeresa',
    'onboarding.goals.inspiration': 'Inspiració',
    'onboarding.goals.vitality': 'Vitalitat',
    'onboarding.goals.money': 'Diners i abundància',
    'onboarding.goals.relationships': 'Relacions i parella',
    'onboarding.goals.family': 'Família i arrels',
    'onboarding.goals.selfworth': 'Autoestima',

    'onboarding.results.howYouWillFeel': 'Com et sentiràs:',
    'services.consultation.title': 'Consulta gratuïta 15 min',
    'services.consultation.description': 'No estàs segura? Parlem 15 minuts sense compromís.',
    'services.consultation.feeling': 'Claredat sobre el teu camí',

    'recommendations.massage.feeling': 'Cos relaxat i ment en calma',
    'recommendations.kinesiology.feeling': 'Claredat mental i energia renovada',
    'recommendations.kinesiology.emotional_feeling': 'Equilibri emocional i pau interior',
    'recommendations.feldenkrais.feeling': 'Moviment lliure i sense dolor',
    'recommendations.systemic.feeling': 'Ordre intern i alleujament',
    'recommendations.supplements.feeling': 'Vitalitat i suport físic',
    'recommendations.supplements.description':
      'Nutrició cel·lular avançada per millorar la teva productivitat diària.',

    // Services page
    'services.integralWellbeingFor': 'Teràpies per al benestar integral',
    'services.ourServices': 'Els nostres serveis',
    'services.ourServices2': 'Professionals',
    'services.wellnessPath':
      'Descobreix el camí cap al teu benestar físic i emocional amb els nostres serveis professionals',
    'services.mainBenefits': 'Beneficis principals',
    'services.quickBooking': 'Reserva ràpida',
    'services.quickBookingSubtitle': 'Contacta amb nosaltres per WhatsApp o telegram per reservar',
    'services.readyToStart': 'Preparat per començar?',
    'services.contactUsToBook': 'Contacta amb nosaltres per reservar la teva sessió',

    // Service benefits
    'services.benefits.reduces': 'Redueix el dolor',
    'services.benefits.stress': "Alleugereix l'estrès",
    'services.benefits.circulation': 'Millora la circulació',
    'services.benefits.relaxation': 'Relaxació profunda',
    'services.benefits.blockages': 'Desbloqueja tensions',
    'services.benefits.posture': 'Millora la postura',
    'services.benefits.energy': "Augmenta l'energia",
    'services.benefits.habits': 'Hàbits saludables',
    'services.benefits.vitality': 'Més vitalitat',
    'services.benefits.weight': 'Control de pes',
    'services.benefits.longterm': 'Beneficis a llarg termini',
    'services.benefits.assessment': 'Avaluació completa',
    'services.benefits.plan': 'Pla personalitzat',
    'services.benefits.recommendations': 'Recomanacions clares',
    'services.benefits.followup': 'Seguiment continu',

    // Pricing specific
    'pricing.from': 'Des de',
    'pricing.session': 'Sessió',
    'pricing.package': 'Paquet',
    'pricing.discount': 'Descompte',
    'pricing.save': 'Estalvia',
    'pricing.popular': 'Popular',
    'pricing.best.value': 'Millor valor',
    'pricing.limited.time': 'Temps limitat',

    // VIP specific
    'vip.title': 'Plans VIP - control de salut i benestar | EKA Balance',
    'vip.description':
      'Plans VIP exclusius amb sessions a domicili, control de salut mensual i beneficis familiars. Bronze, silver i gold VIP a Barcelona.',
    'vip.badge': 'Atenció personal i exclusiva',
    'vip.hero.title': 'Plans VIP de control de salut',
    'vip.hero.subtitle': 'Sessions a domicili • control mensual • beneficis familiars • Barcelona',
    'vip.stats.sessions': 'Sessions 1,5h',
    'vip.stats.barcelona': 'A Barcelona',
    'vip.stats.family': 'Família inclosa',
    'vip.stats.control': 'Control salut',
    'vip.cta.consultation': 'Consulta VIP',
    'vip.cta.normal': 'Veure serveis normals',
    'vip.benefits.sessions': "Sessions d'1,5h",
    'vip.benefits.sessionsDesc': 'Sessions completes i personalitzades',
    'vip.benefits.barcelona': 'A Barcelona',
    'vip.benefits.barcelonaDesc': 'Desplaçaments a tot Barcelona',
    'vip.benefits.transferable': 'Sessions transferibles',
    'vip.benefits.transferableDesc': 'Comparteix amb la teva família',
    'vip.benefits.monthly': 'Control mensual',
    'vip.benefits.monthlyDesc': 'Seguiment de la teva salut',
    'vip.service.displacements.title': 'Desplaçaments exclusius',
    'vip.service.displacements.description': 'Servei VIP a domicili o oficina amb total discreció',
    'vip.service.health.title': 'Seguiment de salut',
    'vip.service.health.description': 'Control mensual del teu estat físic i emocional',
    'vip.service.family.title': 'Beneficis familiars',
    'vip.service.family.description': 'Extensió dels beneficis a la teva família',
    'vip.service.priority.title': 'Accés prioritari',
    'vip.service.priority.description': 'Atenció preferent i resposta ràpida',
    'vip.includes.title': 'Què inclou el servei VIP?',
    'vip.includes.subtitle': 'Tots els plans VIP inclouen aquests beneficis exclusius',
    'vip.plan.comparison': 'Comparació de plans VIP',
    'vip.plan.comparisonDesc': 'Troba el pla perfecte per a les teves necessitats',
    'vip.plan.bronze': 'Bronze VIP',
    'vip.plan.bronze.price': '390€',
    'vip.plan.bronze.description': 'Inici al món VIP',
    'vip.plan.silver': 'Silver VIP',
    'vip.plan.silver.price': '690€',
    'vip.plan.silver.description': 'Perfecte per a professionals',
    'vip.plan.gold': 'Gold VIP',
    'vip.plan.gold.price': '990€',
    'vip.plan.gold.description': "L'experiència VIP definitiva",
    'vip.plan.popular': 'Popular',
    'vip.plan.premium': 'Premium',
    'vip.tier.standard': 'Estàndard',
    'vip.testimonials.title': 'Clients VIP satisfets',
    'vip.testimonials.subtitle': 'Experiències reals dels nostres plans VIP',
    'vip.testimonials.comment1':
      "El servei gold VIP ha transformat completament la meva qualitat de vida. L'atenció personalitzada i la disponibilitat 24/7 són incomparables.",
    'vip.testimonials.comment2':
      "Com a professional de la salut, puc afirmar que EKA Balance ofereix un estàndard d'excel·lència que supera les meves expectatives més exigents.",
    'vip.testimonials.comment3':
      "El pla silver VIP m'ha permès cuidar la meva família i mantenir l'equilibri entre vida professional i personal. Una inversió que val la pena.",
    'vip.final.title': 'Uneix-te al cercle VIP',
    'vip.final.subtitle': 'Comença a gaudir dels beneficis exclusius avui mateix',
    'vip.final.address': 'Carrer Pelai, 12, 08001 Barcelona',
    'vip.final.addressNote': 'Desplaçaments inclosos segons el pla',
    'vip.monthlySessionsOf': "Sessions mensuals d'1,5h",
    'vip.contactFor': 'Contacta per a',
    'vip.innerCircle': 'Cercle de benestar',
    'vip.beyond': 'Més enllà del',
    'vip.wellness': 'Benestar',
    'vip.experienceDescription':
      'Una experiència exclusiva de salut i benestar dissenyada per a professionals exigents',
    'vip.eliteMemberships': "Plans d'Acompanyament",
    'vip.eliteSubtitle': "Escull el nivell d'excel·lència que mereixis",
    'vip.mostExclusive': 'Més exclusiu',
    'vip.exclusivePrivileges': 'Avantatges únics',
    'vip.privilegesSubtitle': 'Els beneficis que només els membres VIP poden gaudir',
    'vip.voicesOfExcellence': "Veus d'excel·lència",
    'vip.testimonialsSubtitle': 'Històries reals dels nostres membres VIP',
    'vip.elite': 'Premium',
    'vip.innerCircleAwaits': "El teu espai de cura t'ESPERA",
    'vip.readyToTranscend': 'Preparat per transcendir',
    'vip.transcend': 'Fer un pas més?',
    'vip.transcendSubtitle':
      "Uneix-te a l'elit del benestar i experimenta un nou nivell de cura personal",
    'vip.joinInnerCircle': 'Uneix-te al nostre programa',
    'vip.exclusiveExperiences': 'Experiències exclusives per a membres VIP',

    // About Elena page
    'elena.title': 'Elena Kucherova - terapeuta integradora | EKA Balance',
    'elena.subtitle': 'Especialista en kinesiologia i sanació somàtica',
    'elena.quote':
      'Ajudant les persones a reconnectar amb el seu cos, la seva ment i el seu potencial de vida.',
    'elena.experience': "Més de 10 anys d'experiència • Estudis en 9 països",
    'elena.about.title': 'Sobre Elena',
    'elena.about.p1':
      "Elena Kucherova és una terapeuta integradora amb una trajectòria de més de 10 anys dedicada al treball profund amb el cos, la ment i l'estat emocional de les persones. Ha estudiat en 9 països diferents i ha resolt més de 500 casos, transformant el patiment físic i emocional en consciència, llibertat i vitalitat.",
    'elena.about.p2':
      "La seva feina no consisteix només a alleujar els símptomes, sinó a descobrir i treballar les causes profundes que impedeixen viure plenament. La seva mirada és global: veu l'ésser humà com una unitat viva on cos, ment, emocions i experiència vital estan profundament interconnectats.",
    'elena.about.p3':
      "A través d'un enfocament suau però profund, acompanya processos de canvi que activen el potencial natural d'autoregulació i sanació que tots tenim dins.",
    'elena.education.title': 'Formació i educació',
    'elena.education.subtitle':
      'Elena ha dedicat dècades a formar-se en diferents disciplines terapèutiques, creant un enfocament únic i integrador',
    'elena.education.kinesiology': 'Kinesiologia i neurofisiologia aplicada',
    'elena.education.feldenkrais': 'Mètode Feldenkrais',
    'elena.education.psychosomatic': 'Psicosomàtica',
    'elena.education.massage': 'Massatge terapèutic i estructural',
    'elena.education.vibrational': 'Medicina vibracional',
    'elena.education.transformation': 'Tècniques de transformació i desenvolupament personal',
    'elena.specializations.title': "Àrees d'Especialització",
    'elena.specialization.pain': 'Dolors crònics i desequilibris posturals',
    'elena.specialization.stress': 'Estrès, ansietat i trastorns psicosomàtics',
    'elena.specialization.nervous': 'Regulació del sistema nerviós i millora del son',
    'elena.specialization.emotional': 'Reequilibri emocional i trauma',
    'elena.specialization.personal': 'Desenvolupament personal i transformació interior',
    'elena.specialization.support': 'Suport en relacions, vincles i processos vitals complexos',
    'elena.philosophy.title': 'Filosofia i enfocament',
    'elena.philosophy.p1':
      'Elena treballa des del principi que el cos és molt més que un vehicle físic: és una memòria viva de tot el que hem viscut. Cada tensió, cada dolor, cada bloqueig conté informació valuosa sobre nosaltres.',
    'elena.philosophy.p2':
      "Quan aprenem a escoltar aquesta informació i a treballar amb ella conscientment, s'obre la possibilitat de transformar no només el cos, sinó tota la nostra experiència vital.",
    'elena.philosophy.p3':
      'El seu enfocament combina ciència i intuïció, tècniques corporals i treball amb la consciència, en un procés profundament personalitzat i adaptat a cada persona.',
    'elena.work.title': 'Opcions de contacte',
    'elena.work.subtitle':
      'Si vols iniciar un procés profund de canvi o simplement explorar noves maneres de cuidar-te',
    'elena.work.book': 'Reservar una sessió',
    'elena.work.bookDesc': 'Comença el teu camí cap al benestar',
    'elena.work.explore': 'Explorar els serveis',
    'elena.work.exploreDesc': 'Descobreix totes les teràpies disponibles',
    'elena.work.contact': 'Contactar amb Elena',
    'elena.work.contactDesc': 'Fes les teves preguntes directament',
    'elena.connect.title': 'Connecta amb Elena',
    'elena.connect.email': 'Email',
    'elena.connect.whatsapp': 'WhatsApp',

    // Revisio360 page
    'revisio360.title': 'Revisió 360° - avaluació integral | EKA Balance',
    'revisio360.badge': 'Visió completa del teu benestar',
    'revisio360.hero.title': 'Revisió 360°',
    'revisio360.hero.subtitle': 'Visió completa de cos, moviment i hàbits.',
    'revisio360.hero.description': "Avaluació integral amb pla d'acció clar i següents passos.",
    'revisio360.includes.title': 'Què inclou la revisió 360°?',
    'revisio360.includes.subtitle':
      'Una avaluació completa per entendre el teu estat actual i dissenyar el teu pla de benestar',
    'revisio360.includes.postural': 'Anàlisi postural',
    'revisio360.includes.posturalDesc': 'Avaluem la teva postura i patrons de moviment',
    'revisio360.includes.energetic': 'Avaluació energètica',
    'revisio360.includes.energeticDesc': 'Identifiquem desequilibris i tensions emocionals',
    'revisio360.includes.report': 'Informe personalitzat',
    'revisio360.includes.reportDesc': 'Rebràs un pla detallat amb recomanacions específiques',
    'revisio360.booking.title': 'Reserva la teva revisió 360°',
    'revisio360.booking.subtitle':
      "Omple el formulari i t'enviarem un missatge preparat per WhatsApp",
    'revisio360.benefits.title': 'Beneficis de la revisió 360°',
    'revisio360.benefits.subtitle':
      'Descobreix tot el que pots aconseguir amb una avaluació completa',
    'revisio360.benefit1': 'Avaluació completa del teu estat físic i emocional',
    'revisio360.benefit2': 'Pla personalitzat amb recomanacions pràctiques',
    'revisio360.benefit3': 'Identificació de patrons i hàbits a millorar',
    'revisio360.benefit4': 'Seguiment i objectius clars per al futur',
    'revisio360.duration.title': 'Durades disponibles',
    'revisio360.duration.subtitle':
      "Escull la durada que millor s'adapti a la profunditat d'avaluació que necessites",
    'revisio360.duration.minutes': 'Minuts',
    'revisio360.duration.essential': 'Avaluació essencial',
    'revisio360.duration.complete': 'Avaluació completa',
    'revisio360.duration.exhaustive': 'Avaluació exhaustiva',
    'revisio360.process.title': 'Com funciona?',
    'revisio360.process.subtitle':
      'Un procés senzill per obtenir una visió completa del teu benestar',
    'revisio360.process.step1': 'Reserva',
    'revisio360.process.step1Desc': 'Contacta amb nosaltres per programar la teva sessió',
    'revisio360.process.step2': 'Avaluació',
    'revisio360.process.step2Desc': 'Realitzem una anàlisi completa del teu estat actual',
    'revisio360.process.step3': 'Informe',
    'revisio360.process.step3Desc': 'Rebràs un pla personalitzat amb recomanacions',
    'revisio360.process.step4': 'Seguiment',
    'revisio360.process.step4Desc': "T'acompanyem en la implementació del pla",
    'revisio360.testimonials.title': 'Què diuen els nostres clients',
    'revisio360.final.title': 'Descobreix el teu potencial de benestar',
    'revisio360.final.subtitle':
      'Reserva la teva revisió 360° i comença el camí cap a una vida més equilibrada i saludable',

    // Personalized services
    'personalized.tailored': 'Personalitzat',
    'personalized.custom': 'A mida',
    'personalized.specific': 'Específic',
    'personalized.targeted': 'Dirigit',
    'personalized.specialized': 'Especialitzat',

    // Casos section
    'casos.section.badge': 'Diagnòstic i resolució',
    'casos.section.title': 'Identificació clínica de',
    'casos.section.titleHighlight': 'Patologies',
    'casos.section.subtitle':
      'Anàlisi precisa i tractament sistèmic per a la recuperació integral de la salut.',
    'casos.section.readMore': 'Llegir més',
    'casos.section.viewAll': 'Veure tots els casos',
    'casos.section.findYourCase': 'Troba el teu cas',
    'casos.other.title': 'Altres àrees que tractem',
    'casos.other.money': 'Diners i finances',
    'casos.other.relationships': 'Relacions i parella',
    'casos.other.selfworth': 'Autoestima i realització',
    'casos.other.family': 'Conflictes familiars',
    'casos.other.work': 'Orientació professional',
    'casos.other.trauma': 'Traumes emocionals',

    // Problems
    'casos.problems.backPain.title': 'Disfunció vertebral i cervical',
    'casos.problems.backPain.description':
      'Tractament de la compressió discal, rectificació cervical i desequilibris posturals crònics mitjançant descompressió axial i reeducació neuromuscular.',
    'casos.problems.stress.title': 'Desregulació del sistema nerviós',
    'casos.problems.stress.description':
      "Intervenció en estats d'hiperactivació simpàtica, ansietat somatitzada i bloquejos diafragmàtics per restablir l'homeòstasi vagal.",
    'casos.problems.digestive.title': 'Disfunció visceral i digestiva',
    'casos.problems.digestive.description':
      "Abordatge de la motilitat visceral i l'eix intestí-cervell per resoldre inflamacions, dispèpsies i bloquejos emocionals somatitzats.",
    'casos.problems.migraines.title': 'Cefalees i tensió cranial',
    'casos.problems.migraines.description':
      'Descompressió de la base del crani i sutures cranials per alleujar migranyes tensionals, bruxisme i fatiga neurosensorial.',
    'casos.problems.lowEnergy.title': 'Síndrome de fatiga crònica',
    'casos.problems.lowEnergy.description':
      "Reactivació metabòlica i desbloqueig de l'estancament limfàtic per combatre l'esgotament sistèmic i la letargia.",
    'casos.problems.sleep.title': 'Trastorns del son i del descans',
    'casos.problems.sleep.description':
      "Regulació dels cicles circadians i del sistema parasimpàtic per induir un son profund, reparador i lliure d'interrupcions.",
    // Massatge Page
    'massage.page.title': 'Massatge terapèutic',
    'massage.page.subtitle': 'Allibera tensions i descansa de veritat.',
    'massage.page.description':
      'Massatge descontracturant i relaxant adaptat a tu per reduir dolor, estrès i rigidesa. Beneficis clau: alleujament muscular, millora de la circulació, calma mental, postura més lliure.',
    'massage.page.availableToday': 'Disponible avui',
    'massage.page.bookSession': 'Reserva la teva sessió',
    'massage.page.fillForm': "Omple el formulari i t'enviarem un missatge preparat per WhatsApp",
    'massage.page.benefitsTitle': 'Beneficis del massatge terapèutic',
    'massage.page.benefitsSubtitle':
      'Descobreix com el massatge pot millorar la teva qualitat de vida',
    'massage.page.durationsTitle': 'Durades disponibles',
    'massage.page.durationsSubtitle':
      "Escull la durada que millor s'adapti a les teves necessitats",
    'massage.page.duration60': 'Perfecte per començar',
    'massage.page.duration90': 'Tractament complet',
    'massage.page.duration120': 'Experiència premium',
    'massage.page.testimonialsTitle': 'Què diuen els nostres clients',

    // Kinesiologia Page
    'kinesiology.page.title': 'Kinesiologia holística',
    'kinesiology.page.subtitle': "Escolta el cos, troba l'arrel.",
    'kinesiology.page.imageAlt':
      'Sessió de kinesiologia holística en ambient professional i natural',
    'kinesiology.page.description':
      'Test neuromuscular i correccions suaus per reequilibrar cos, emocions i hàbits. Beneficis clau: menys estrès, millor coordinació i energia estable.',
    'kinesiology.page.energyBalance': 'Equilibri energètic',
    'kinesiology.page.benefitsTitle': 'Beneficis de la kinesiologia',
    'kinesiology.page.benefitsSubtitle':
      'Descobreix com la kinesiologia pot transformar el teu benestar',
    'kinesiology.page.durationsSubtitle': 'Sessions adaptades a les teves necessitats',
    'kinesiology.page.duration60': "Sessió d'introducció i equilibri bàsic",
    'kinesiology.page.duration90': 'Tractament complet i aprofundit',

    // Nutricio Page
    'nutrition.page.badge': 'Alimentació conscient',
    'nutrition.page.title': 'Nutrició conscient',
    'nutrition.page.subtitle': 'Menjar amb sentit per tenir energia real.',
    'nutrition.page.description':
      'Assessorament personalitzat per hàbits clars, digestió i energia. Beneficis clau: hàbits sostenibles, vitalitat i suport a la composició corporal.',
    'nutrition.page.personalized': 'Nutrició personalitzada',
    'nutrition.page.benefitsTitle': "Beneficis de l'assessorament nutricional",
    'nutrition.page.benefitsSubtitle':
      'Descobreix com una bona alimentació pot transformar la teva vida',
    'nutrition.page.sessionTypes': 'Tipus de sessions',
    'nutrition.page.sessionSubtitle':
      'Acompanyament personalitzat per als teus objectius nutricionals',

    // Agenyz Page
    'agenyz.page.title': 'Agenyz nutrició cel·lular',
    'agenyz.page.subtitle': 'Suplements avançats per a la regeneració cel·lular.',
    'agenyz.page.description':
      "Biohacking i nutrició que treballen a nivell cel·lular. Restaura l'energia, la immunitat i la joventut des de dins.",
    'agenyz.benefits.cell': 'Claredat cognitiva',
    'agenyz.benefits.energy': 'Energia infinita',
    'agenyz.benefits.immunity': 'Defensa immunològica',
    'agenyz.benefits.antiaging': 'Efecte antienvelliment',
    'agenyz.why.title': 'Per què Agenyz?',
    'agenyz.why.subtitle': 'Beneficis recolzats per la ciència per al teu cos i ment.',
    'agenyz.benefits.energy.desc':
      'Restaura la funció mitocondrial per a una energia diària sostinguda.',
    'agenyz.benefits.immunity.desc': 'Enforteix els sistemes de defensa naturals del cos.',
    'agenyz.benefits.cell.desc': "Millora l'enfocament, la memòria i el rendiment mental.",
    'agenyz.benefits.antiaging.desc':
      "Combat l'estrès oxidatiu i alenteix els processos d'envelliment.",
    'agenyz.cta.title': 'A punt per millorar la teva salut?',
    'agenyz.cta.consult': 'Consultar amb Elena',
    'agenyz.cta.visitStore': 'Visitar botiga Agenyz',
    'agenyz.hero.biohacking': 'Biohacking i nutrició',
    'agenyz.hero.available': 'Disponible per demanar',

    // Testimonials
    'massage.testimonial.1.text':
      'Arribo tens i amb nusos. Surto totalment relaxat. Així de simple. Dura dies.',
    'massage.testimonial.2.text':
      "El millor massatge que he rebut. Realment sap el que fa. L'espai també és genial.",
    'kinesiology.testimonial.1.text':
      "La kinesiologia m'ha ajudat a entendre millor el meu cos i les meves emocions. Ara tinc més energia i claredat mental.",
    'kinesiology.testimonial.2.text':
      'Després de les sessions de kinesiologia he notat una millora increïble en la meva postura i coordinació. Ho recomano totalment.',
    'nutrition.testimonial.1.text':
      "L'assessorament nutricional ha canviat completament la meva relació amb el menjar. Ara tinc més energia i em sento molt millor.",
    'nutrition.testimonial.2.text':
      "Els consells personalitzats m'han ajudat a crear hàbits saludables que puc mantenir fàcilment. Resultat: més vitalitat cada dia.",

    // 360 Revision
    'hero.title': 'Revisió corporal 360°',
    'hero.subtitle': 'Escolta el teu cos. Entén la teva història. Recupera la teva vida.',
    'hero.description':
      'Un viatge de 90 minuts per mapar el teu paisatge físic, emocional i energètic. No és només un diagnòstic — és el primer pas per tornar a casa, al teu cos.',
    'hero.cta': 'Comença el teu viatge',
    'hero.scroll': "Descobreix l'Enfocament 360°",
    'why.title': 'Per què 360°?',
    'why.subtitle': 'Perquè no ets només una col·lecció de parts. Ets un sistema complet.',
    'why.physical.title': 'El cos físic',
    'why.physical.desc':
      "On viu la tensió. Llegim l'estructura, la fàscia i la postura per trobar on estàs aguantant.",
    'why.emotional.title': 'El cos emocional',
    'why.emotional.desc':
      "On s'emmagatzema la història. Les emocions no processades es converteixen en bloquejos físics.",
    'why.energetic.title': 'El cos energètic',
    'why.energetic.desc':
      'On flueix la vitalitat. Restaurem el flux perquè la sanació pugui ocórrer naturalment.',
    'service.title': "L'Experiència",
    'service.step1.title': "1. L'Entrevista Profunda",
    'service.step1.desc':
      "Més enllà de l'historial mèdic. Parlem de la teva vida, el teu estrès, els teus somnis i el que el teu cos ha estat intentant dir-te.",
    'service.step2.title': '2. El mapeig corporal',
    'service.step2.desc':
      "Una lectura pràctica de la teva estructura. Identifiquem desequilibris, restriccions fascials i àrees d'energia estancada.",
    'service.step3.title': "3. La sessió d'Integració",
    'service.step3.desc':
      'Utilitzant una barreja de modalitats (massatge, kinesiologia, treball energètic) per començar el procés de desbloqueig i realineament.',
    'service.step4.title': '4. El pla de ruta',
    'service.step4.desc':
      "No marxes amb les mans buides. Rebràs un pla personalitzat amb exercicis, consells d'estil de vida i recomanacions de tractament.",
    'variants.title': 'Tria el teu camí',
    'variants.mapping.title': 'Mapeig 360°',
    'variants.mapping.price': '90€',
    'variants.mapping.duration': '90 min',
    'variants.mapping.desc': 'La sessió fonamental. Diagnòstic complet + primer tractament.',
    'variants.alignment.title': 'Alineació 360°',
    'variants.alignment.price': '250€',
    'variants.alignment.duration': 'Pack de 3 sessions',
    'variants.alignment.desc':
      'Per a un treball més profund. Inclou mapeig + 2 sessions de seguiment focalitzades.',
    'variants.integral.title': 'Transformació integral',
    'variants.integral.price': '450€',
    'variants.integral.duration': 'Programa de 6 setmanes',
    'variants.integral.desc': 'Canvi de vida complet. Mapeig + 5 sessions + suport continu.',
    'variants.book': 'Reservar ara',
    'prompt.title': 'El meu enfocament',
    'prompt.diagnosis': 'Diagnosi suau i precisa',
    'prompt.diagnosisDesc': 'Escoltant el cos amb les mans i amb preguntes curtes',
    'prompt.integrativeTechniques': 'Tècniques integratives',
    'prompt.techniquesDesc':
      'Massatge terapèutic, kinesiologia, Osteobalance, moviment conscient (Feldenkrais), respiració i regulació del sistema nerviós',
    'prompt.layeredProcesses': 'Processos en capes',
    'prompt.layeredDesc':
      'Alliberar tensió, reordenar patrons i consolidar nous hàbits corporals i emocionals',
    'prompt.session': 'Sessió',
    'prompt.firstVisit': "Primera visita amb diagnosi i treball suau. A partir d'aquí, traço el",
    'prompt.personalPlan': 'Pla personal',
    'prompt.sessionsRange': '(normalment 3–6 sessions) per anar capa per capa',
    'prompt.forWho': 'Per a qui és',
    'prompt.forWhoDesc':
      "Per a persones que volen canvis reals i consistents, no solucions ràpides. Si estàs preparada per escoltar-te i comprometre't amb el teu benestar, aquest treball és per a tu.",
    'prompt.booking': 'Reserva',
    'prompt.consultation': 'Consulta',
    'prompt.promptLabel': 'Prompt',
    'prompt.signature': '— Elena Kucherova',
    'common.ekaBalance': 'EKA Balance',
    'common.copyright': '© 2024',
    'benefits.benefit1.title': 'Claredat mental',
    'benefits.benefit1.description': 'Enfocament millorat i funció cognitiva',
    'benefits.benefit1.science':
      'El treball corporal integratiu estimula el nervi vag, millorant la comunicació cervell-cos i la funció executiva.',
    'benefits.benefit2.title': 'Equilibri emocional',
    'benefits.benefit2.description': 'Major resistència emocional i regulació',
    'benefits.benefit2.science':
      "Les tècniques somàtiques ajuden a processar el trauma emmagatzemat i regular els patrons de resposta a l'estrès del sistema nerviós.",
    'benefits.benefit3.title': 'Energia sostinguda',
    'benefits.benefit3.description': 'Vitalitat natural sense estimulació artificial',
    'benefits.benefit3.science':
      "Abordar les restriccions fascials i els desequilibris posturals redueix el malbaratament d'energia metabòlica, augmentant la vitalitat natural.",
    'benefits.benefit4.title': 'Alleujament del dolor',
    'benefits.benefit4.description': 'Alleujament durador de patrons de dolor crònic',
    'benefits.benefit4.science':
      "L'enfocament 360° aborda les causes arrel en lloc dels símptomes, creant canvis neuroplàstics duradors en la percepció del dolor.",
    'benefits.benefit5.title': 'Millor son',
    'benefits.benefit5.description': 'Cicles de son més profunds i reparadors',
    'benefits.benefit5.science':
      "La regulació del sistema nerviós i l'alliberament de tensions promouen ritmes circadians saludables i arquitectura del son.",
    'benefits.benefit6.title': "Resistència a l'Estrès",
    'benefits.benefit6.description': 'Major capacitat per gestionar els reptes de la vida',
    'benefits.benefit6.science':
      "Construir el to parasimpàtic a través del treball corporal augmenta la resistència a l'estrès i la capacitat de recuperació.",
    'benefits.benefit7.title': 'Llibertat de moviment',
    'benefits.benefit7.description': 'Millor mobilitat i consciència corporal',
    'benefits.benefit7.science':
      "L'alliberament fascial i la reeducació del moviment restauren els patrons naturals de moviment i la consciència propioceptiva.",
    'benefits.benefit8.title': 'Brúixola interior',
    'benefits.benefit8.description': 'Connexió més forta amb la intuïció i saviesa interior',
    'benefits.benefit8.science':
      'La consciència interoceptiva desenvolupada a través del treball corporal millora les sensacions viscerals i la claredat en la presa de decisions.',
    'benefits.benefit9.title': 'Vitalitat',
    'benefits.benefit9.description': 'Renovat sentit de vida i presència',
    'benefits.benefit9.science':
      'Eliminar bloquejos energètics i restaurar el flux crea millores mesurables en la força vital i presència.',
    'benefits.science': 'La ciència',
    'benefits.philosophy':
      "Mesurem l'èxit no només en l'absència de símptomes, sinó en la presència de vitalitat, goig, i el coneixement profund que el teu cos és el teu aliat en la vida.",
    'service.step1.details.1': 'Avaluació integral de salut i estil de vida',
    'service.step1.details.2': 'Anàlisi de patrons de moviment',
    'service.step1.details.3': "Mapeig emocional i de patrons d'estrès",
    'service.step1.details.4': "Establiment d'objectius i alineació d'intencions",
    'service.step2.details.1': 'Anàlisi postural i estructural',
    'service.step2.details.2': 'Avaluació de tensió fascial i mobilitat',
    'service.step2.details.3': 'Avaluació del flux energètic',
    'service.step2.details.4': "Avaluació de l'estat del sistema nerviós",
    'service.step3.details.1': 'Teràpia manual i treball corporal',
    'service.step3.details.2': 'Regulació de la respiració i sistema nerviós',
    'service.step3.details.3': 'Reeducació del moviment',
    'service.step3.details.4': "Tècniques d'equilibri energètic",
    'service.step4.details.1': 'Seqüències de moviment personalitzades',
    'service.step4.details.2': "Pràctiques d'autocura i eines",
    'service.step4.details.3': "Suggeriments de modificació de l'estil de vida",
    'service.step4.details.4': 'Planificació de sessions de seguiment',
    'testimonials.maria.name': 'Maria',
    'testimonials.maria.issue': 'Dolor crònic de coll i estrès',
    'testimonials.maria.quote':
      "Després de 15 anys de dolor, finalment em sento com jo mateixa un altre cop. L'enfocament 360° no només va arreglar el meu coll — em va tornar la meva confiança.",
    'testimonials.maria.result':
      "Dolor reduït de 8/10 a 1/10, nivells d'estrès dramàticament millorats",
    'testimonials.maria.timeframe': '3 mesos',
    'testimonials.maria.before': 'Tensió constant, mala postura, ansietat afectant la vida diària',
    'testimonials.maria.after': 'Moviment sense dolor, postura confident, sistema nerviós en pau',
    'testimonials.david.name': 'David',
    'testimonials.david.issue': 'Rendiment atlètic i recuperació',
    'testimonials.david.quote':
      'Pensava que coneixia el meu cos com a atleta. El mapeig 360° va revelar patrons que mai vaig saber que existien. El meu rendiment i recuperació han assolit nous nivells.',
    'testimonials.david.result':
      '25% de millora en temps de recuperació, va eliminar lesions recurrents',
    'testimonials.david.timeframe': '6 setmanes',
    'testimonials.david.before': 'Lesions freqüents, recuperació lenta, estancaments en rendiment',
    'testimonials.david.after':
      'Entrenament lliure de lesions, recuperació més ràpida, nous rècords personals',
    'testimonials.jennifer.name': 'Jennifer',
    'testimonials.jennifer.issue': 'Recuperació post-quirúrgica i mobilitat',
    'testimonials.jennifer.quote':
      'Després de la meva cirurgia, em sentia desconnectada del meu cos. La sanació aquí va ser més enllà del físic — vaig aprendre a confiar en el meu cos un altre cop.',
    'testimonials.jennifer.result':
      'Mobilitat completa restaurada, confiança en el moviment retornada',
    'testimonials.jennifer.timeframe': '4 mesos',
    'testimonials.jennifer.before': 'Mobilitat limitada, por al moviment, depressió',
    'testimonials.jennifer.after':
      'Rang complet de moviment, goig en el moviment, sanació emocional',
    'testimonials.alex.name': 'Alex',
    'testimonials.alex.issue': 'Ansietat i desregulació del sistema nerviós',
    'testimonials.alex.quote':
      'Vaig venir per ansietat, sense esperar que el treball corporal ajudés. Però quan van explicar com el meu sistema nerviós estava encallat, tot va tenir sentit. Em sento calm al meu cos per primera vegada en anys.',
    'testimonials.alex.result': 'Ansietat reduïda en 80%, qualitat del son dramàticament millorada',
    'testimonials.alex.timeframe': '8 setmanes',
    'testimonials.alex.before': 'Ansietat crònica, insomnio, sentir-se insegur al cos',
    'testimonials.alex.after': 'Sistema nerviós calm, son reparador, confiança encarnada',
    'testimonials.resultsAchieved': 'Resultats assolits:',
    'testimonials.timeframe': 'Temps:',
    'testimonials.watchVideo': 'Veure història en vídeo',
    'testimonials.showBeforeAfter': 'Mostrar abans i després',
    'testimonials.hideBeforeAfter': 'Amagar',
    'testimonials.before': 'Abans:',
    'testimonials.after': 'Després:',
    'testimonials.videoStory': 'Història de',
    'testimonials.keyInsights': 'Perspectives clau de',
    'testimonials.keyInsight1':
      "Com l'enfocament 360° va abordar les causes arrel, no només els símptomes",
    'testimonials.keyInsight2': "L'avenç emocional que va accelerar la sanació física",
    'testimonials.keyInsight3': 'Eines pràctiques que continuen donant suport al benestar continu',
    'testimonials.keyInsight4': 'Per què aquest enfocament va tenir èxit on altres havien fallat',
    'testimonials.videoPlaceholder': 'El testimoni en vídeo es reproduiria aquí',
    'testimonials.videoImplementation':
      'En una implementació real, això seria contingut de vídeo incorporat',
    'story.title': 'Un viatge de sanació',
    'story.intro': 'La sarah va arribar a nosaltres carregant el pes de deu anys...',
    'story.paragraph1':
      "Les espatlles de la sarah van parlar abans que ella. Corbades cap endins com un closca protector, guardaven la història d'innombrables nits sense dormir, de correus respostos a mitjanit, d'una promoció que va venir amb un preu que el seu cos encara estava pagant.",
    'story.paragraph2':
      '"només vull que el meu coll deixi de doler," va dir durant la nostra primera sessió. Però el seu cos murmurava veritats més profundes — sobre la por allotjada al seu pit, l\'ansietat que havia pres residència a la seva mandíbula, l\'esgotament que vivia als seus mateixos ossos.',
    'story.paragraph3':
      "L'enfocament 360° no només va abordar el seu coll. Vam treballar amb els patrons emocionals que van crear la tensió, els desequilibris estructurals que la mantenien, i els bloquejos energètics que impedien la sanació. Vam escoltar el que el seu cos necessitava per tornar a sentir-se segur.",
    'story.paragraph4':
      "Tres mesos després, la sarah es posava diferent. No només més dreta — es posava com algú que va recordar que tenia permís per ocupar espai. El seu dolor de coll s'havia convertit en una porta per reclamar parts de si mateixa que havia oblidat que existien.",
    'story.paragraph5':
      '"no només vaig recuperar el meu cos," ens va dir. "vaig recuperar la meva vida."',
    'story.philosophy':
      "Cada cos té una història. Cada història mereix ser escoltada amb la plenitud que conté — no només els símptomes, sinó tota l'experiència humana que hi ha sota d'ells.",
    'services.completeReview': 'Revisió corporal 360° completa',
    'services.reset360': 'Reinici 360°',
    'services.mapping360': 'Mapeig corporal 360°',
    'services.alignment360': 'Alineació 360°',
    'services.followUpConsultations': 'Consultes de seguiment',
    'cta.scheduleDiscoveryCall': 'Programar una trucada de descobriment',
    'cta.downloadGuide': 'Descarregar la nostra guia',
    'labels.noInsuranceNeeded': 'No cal assegurança',
    'labels.flexibleSchedules': 'Horaris flexibles',
    'labels.personalizedApproach': 'Enfocament personalitzat',
    'labels.presentialConsultations': 'Consultes presencials',
    'labels.onlineSessionsAvailable': 'I sessions online disponibles',
    'alt.ekaLogo': 'Logo EKA Balance',
    'footer.brand': 'Sanació integral 360°',
    'footer.description':
      'Transformant vides a través de la sanació integral del cos, ment i esperit. El teu viatge cap al benestar complet comença aquí.',
    'footer.healingWithIntention': 'Sanant amb intenció',
    'footer.contact': 'Contacte',
    'footer.services': 'Serveis',
    'footer.copyright': '© 2024 EKA Balance. Tots els drets reservats.',
    'footer.madeWith': 'Fet amb',
    'footer.forHealing': 'Per a la sanació',

    // Missing Casos Keys
    'casos.problems.backPain.symptoms.0': 'Dolor lumbar',
    'casos.problems.backPain.symptoms.1': 'Ciatàlgia',
    'casos.problems.backPain.symptoms.2': 'Rigidesa',
    'casos.problems.backPain.symptoms.3': 'Hèrnia',
    'casos.problems.backPain.causes.0': 'Sedentarisme',
    'casos.problems.backPain.causes.1': 'Males postures',
    'casos.problems.backPain.causes.2': 'Estrès',
    'casos.problems.backPain.causes.3': 'Sobrepès',
    'casos.problems.backPain.treatment': 'Descompressió i reeducació',
    'casos.problems.backPain.results': 'Alleujament i mobilitat',
    'casos.problems.backPain.successStory': 'He recuperat la mobilitat completa.',

    'casos.problems.stress.symptoms.0': 'Ansietat',
    'casos.problems.stress.symptoms.1': 'Insomni',
    'casos.problems.stress.symptoms.2': 'Taquicàrdia',
    'casos.problems.stress.symptoms.3': 'Irritabilitat',
    'casos.problems.stress.causes.0': 'Treball',
    'casos.problems.stress.causes.1': 'Família',
    'casos.problems.stress.causes.2': 'Trauma',
    'casos.problems.stress.causes.3': 'Estil de vida',
    'casos.problems.stress.treatment': 'Regulació vagal',
    'casos.problems.stress.results': 'Calma i claredat',
    'casos.problems.stress.successStory': 'Ara dormo com un nadó.',

    'casos.problems.digestive.symptoms.0': 'Inflor',
    'casos.problems.digestive.symptoms.1': 'Gasos',
    'casos.problems.digestive.symptoms.2': 'Acidesa',
    'casos.problems.digestive.symptoms.3': 'Restrenyiment',
    'casos.problems.digestive.causes.0': 'Dieta',
    'casos.problems.digestive.causes.1': 'Estrès',
    'casos.problems.digestive.causes.2': 'Intolèrencies',
    'casos.problems.digestive.causes.3': 'Sedentarisme',
    'casos.problems.digestive.treatment': 'Massatge visceral',
    'casos.problems.digestive.results': 'Digestions lleugeres',
    'casos.problems.digestive.successStory': 'Adéu a la inflor.',

    'casos.problems.migraines.symptoms.0': 'Mal de cap',
    'casos.problems.migraines.symptoms.1': 'Sensibilitat',
    'casos.problems.migraines.symptoms.2': 'Nàusees',
    'casos.problems.migraines.symptoms.3': 'Aura',
    'casos.problems.migraines.causes.0': 'Tensió',
    'casos.problems.migraines.causes.1': 'Hormones',
    'casos.problems.migraines.causes.2': 'Alimentació',
    'casos.problems.migraines.causes.3': 'Postura',
    'casos.problems.migraines.treatment': 'Craniosacral',
    'casos.problems.migraines.results': 'Cap lliure',
    'casos.problems.migraines.successStory': 'Visc sense dolor.',

    'casos.problems.lowEnergy.symptoms.0': 'Fatiga',
    'casos.problems.lowEnergy.symptoms.1': 'Debilitat',
    'casos.problems.lowEnergy.symptoms.2': 'Boira mental',
    'casos.problems.lowEnergy.symptoms.3': 'Apatia',
    'casos.problems.lowEnergy.causes.0': 'Estrès crònic',
    'casos.problems.lowEnergy.causes.1': 'Son pobre',
    'casos.problems.lowEnergy.causes.2': 'Nutrició',
    'casos.problems.lowEnergy.causes.3': 'Sedentarisme',
    'casos.problems.lowEnergy.treatment': 'Reactivació',
    'casos.problems.lowEnergy.results': 'Vitalitat',
    'casos.problems.lowEnergy.successStory': 'Tinc energia tot el dia.',

    'casos.problems.hormonal.title': 'Hormonal',
    'casos.problems.hormonal.description': 'Equilibri femení',
    'casos.problems.hormonal.symptoms.0': 'Dolor menstrual',
    'casos.problems.hormonal.symptoms.1': 'Irregularitat',
    'casos.problems.hormonal.symptoms.2': 'Spm',
    'casos.problems.hormonal.symptoms.3': 'Menopausa',
    'casos.problems.hormonal.causes.0': 'Estrès',
    'casos.problems.hormonal.causes.1': 'Dieta',
    'casos.problems.hormonal.causes.2': 'Disruptors',
    'casos.problems.hormonal.causes.3': 'Genètica',
    'casos.problems.hormonal.treatment': 'Kinesiologia',
    'casos.problems.hormonal.results': 'Cicles regulars',
    'casos.problems.hormonal.successStory': 'Els meus cicles són regulars.',

    'casos.problems.sleep.symptoms.0': 'Insomni',
    'casos.problems.sleep.symptoms.1': 'Despertars',
    'casos.problems.sleep.symptoms.2': 'Malsons',
    'casos.problems.sleep.symptoms.3': 'Cansament matinal',
    'casos.problems.sleep.causes.0': 'Ansietat',
    'casos.problems.sleep.causes.1': 'Horaris',
    'casos.problems.sleep.causes.2': 'Pantalles',
    'casos.problems.sleep.causes.3': 'Sopar tard',
    'casos.problems.sleep.treatment': 'Relaxació profunda',
    'casos.problems.sleep.results': 'Descans reparador',
    'casos.problems.sleep.successStory': 'Dormo 8 hores seguides.',

    'casos.problems.recovery.title': 'Recuperació',
    'casos.problems.recovery.description': 'Rehabilitació efectiva',
    'casos.problems.recovery.symptoms.0': 'Dolor',
    'casos.problems.recovery.symptoms.1': 'Limitació',
    'casos.problems.recovery.symptoms.2': 'Inflamació',
    'casos.problems.recovery.symptoms.3': 'Feblesa',
    'casos.problems.recovery.causes.0': 'Lesió',
    'casos.problems.recovery.causes.1': 'Cirurgia',
    'casos.problems.recovery.causes.2': 'Sobrecàrrega',
    'casos.problems.recovery.causes.3': 'Repòs inadequat',
    'casos.problems.recovery.treatment': 'Teràpia manual',
    'casos.problems.recovery.results': 'Recuperació total',
    'casos.problems.recovery.successStory': 'He tornat a entrenar.',
  },

  en: {
    'booking.smart.title': 'How would you like to book?',
    'booking.smart.subtitle': 'Choose the option that suits you best',
    'booking.smart.quick': 'Direct WhatsApp',
    'booking.smart.quickDesc': 'Open chat and write directly',
    'booking.smart.form': 'Guided form',
    'booking.smart.formDesc': 'Fill in details to speed up the process',
    'booking.service.consultation': 'Free 15 min consultation',
    'booking.smart.name': 'Your name',
    'booking.smart.service': 'Desired service',
    'booking.smart.time': 'Time preference',
    'booking.smart.send': 'Send via WhatsApp',
    'booking.smart.back': 'Back',

    // Service-specific translations
    'service.duration': 'Duration',
    'service.price': 'Price',
    'service.supplements.title': 'Personalized supplements',
    'service.systemic.title': 'Systemic therapy',
    'service.benefits': 'Benefits',
    'service.ideal.for': 'Ideal for',
    'service.what.to.expect': 'What to expect',
    'service.preparation': 'Preparation',
    'service.aftercare': 'Aftercare',
    'service.contraindications': 'Contraindications',
    'service.booking.note': 'Booking note',
    'service.sessions.recommended': 'Recommended sessions',
    'service.frequency': 'Frequency',

    // Onboarding Goals & Feelings
    'onboarding.goals.stress': 'Stress and anxiety',
    'onboarding.goals.pain': 'Pain or discomfort',
    'onboarding.goals.posture': 'Improve posture',
    'onboarding.goals.sleep': 'Sleep better',
    'onboarding.goals.energy': 'More energy',
    'onboarding.goals.focus': 'Mental focus',
    'onboarding.goals.bodyAwareness': 'Body connection',
    'onboarding.goals.feelGood': 'Feel good',
    'onboarding.goals.lightness': 'Lightness',
    'onboarding.goals.inspiration': 'Inspiration',
    'onboarding.goals.vitality': 'Vitality',
    'onboarding.goals.money': 'Money & abundance',
    'onboarding.goals.relationships': 'Relationships',
    'onboarding.goals.family': 'Family & roots',
    'onboarding.goals.selfworth': 'Self-worth',

    'onboarding.results.howYouWillFeel': 'How you will feel:',
    'services.consultation.title': 'Free 15 min consultation',
    'services.consultation.description': "Not sure? Let's talk for 15 mins, no strings attached.",
    'services.consultation.feeling': 'Clarity on your path',

    'recommendations.massage.feeling': 'Relaxed body and calm mind',
    'recommendations.kinesiology.feeling': 'Mental clarity and renewed energy',
    'recommendations.kinesiology.emotional_feeling': 'Emotional Balance and inner peace',
    'recommendations.feldenkrais.feeling': 'Free movement without pain',
    'recommendations.systemic.feeling': 'Inner order and relief',
    'recommendations.supplements.feeling': 'Vitality and physical support',
    'recommendations.supplements.description':
      'Advanced cellular nutrition to boost your daily performance.',

    // Services page
    'services.integralWellbeingFor': 'Therapies for integral wellbeing',
    'services.ourServices': 'Our professional',
    'services.ourServices2': 'Services',
    'services.wellnessPath':
      'Discover the path to your physical and emotional wellbeing with our professional services',
    'services.mainBenefits': 'Main benefits',
    'services.quickBooking': 'Quick booking',
    'services.quickBookingSubtitle': 'Contact us via WhatsApp or telegram to book',
    'services.readyToStart': 'Ready to start?',
    'services.contactUsToBook': 'Contact us to book your session',

    // Service benefits
    'services.benefits.reduces': 'Reduces pain',
    'services.benefits.stress': 'Relieves stress',
    'services.benefits.circulation': 'Improves circulation',
    'services.benefits.relaxation': 'Deep relaxation',
    'services.benefits.blockages': 'Releases blockages',
    'services.benefits.posture': 'Improves posture',
    'services.benefits.energy': 'Increases energy',
    'services.benefits.habits': 'Healthy habits',
    'services.benefits.vitality': 'More vitality',
    'services.benefits.weight': 'Weight control',
    'services.benefits.longterm': 'Long-term benefits',
    'services.benefits.assessment': 'Complete assessment',
    'services.benefits.plan': 'Personalized plan',
    'services.benefits.recommendations': 'Clear recommendations',
    'services.benefits.followup': 'Continuous follow-up',

    // Pricing specific
    'pricing.from': 'From',
    'pricing.session': 'Session',
    'pricing.package': 'Package',
    'pricing.discount': 'Discount',
    'pricing.save': 'Save',
    'pricing.popular': 'Popular',
    'pricing.best.value': 'Best value',
    'pricing.limited.time': 'Limited time',

    // VIP specific
    'vip.title': 'VIP plans - health & wellness control | EKA Balance',
    'vip.description':
      'Exclusive VIP plans with home sessions, monthly health control and family benefits. Bronze, silver and gold VIP in Barcelona.',
    'vip.badge': 'Exclusive personal attention',
    'vip.hero.title': 'VIP health control plans',
    'vip.hero.subtitle': 'Home sessions • monthly control • family benefits • Barcelona',
    'vip.stats.sessions': '1.5h sessions',
    'vip.stats.barcelona': 'In Barcelona',
    'vip.stats.family': 'Family included',
    'vip.stats.control': 'Health control',
    'vip.cta.consultation': 'VIP consultation',
    'vip.cta.normal': 'View regular services',
    'vip.benefits.sessions': '1.5h sessions',
    'vip.benefits.sessionsDesc': 'Complete and personalized sessions',
    'vip.benefits.barcelona': 'In Barcelona',
    'vip.benefits.barcelonaDesc': 'Travel throughout Barcelona',
    'vip.benefits.transferable': 'Transferable sessions',
    'vip.benefits.transferableDesc': 'Share with your family',
    'vip.benefits.monthly': 'Monthly control',
    'vip.benefits.monthlyDesc': 'Track your health',
    'vip.service.displacements.title': 'Exclusive travel',
    'vip.service.displacements.description': 'VIP service at home or office with total discretion',
    'vip.service.health.title': 'Health monitoring',
    'vip.service.health.description': 'Monthly control of your physical and emotional state',
    'vip.service.family.title': 'Family benefits',
    'vip.service.family.description': 'Extension of benefits to your family',
    'vip.service.priority.title': 'Priority access',
    'vip.service.priority.description': 'Preferential attention and quick response',
    'vip.includes.title': 'What does VIP service include?',
    'vip.includes.subtitle': 'All VIP plans include these exclusive benefits',
    'vip.plan.comparison': 'VIP plans comparison',
    'vip.plan.comparisonDesc': 'Find the perfect plan for your needs',
    'vip.plan.bronze': 'Bronze VIP',
    'vip.plan.bronze.price': '390€',
    'vip.plan.bronze.description': 'Entry into VIP world',
    'vip.plan.silver': 'Silver VIP',
    'vip.plan.silver.price': '690€',
    'vip.plan.silver.description': 'Perfect for professionals',
    'vip.plan.gold': 'Gold VIP',
    'vip.plan.gold.price': '990€',
    'vip.plan.gold.description': 'The ultimate VIP experience',
    'vip.plan.popular': 'Popular',
    'vip.plan.premium': 'Premium',
    'vip.tier.standard': 'Standard',
    'vip.testimonials.title': 'Satisfied VIP clients',
    'vip.testimonials.subtitle': 'Real experiences from our VIP plans',
    'vip.testimonials.comment1':
      'The gold VIP service has completely transformed my quality of life. The personalized attention and 24/7 availability are incomparable.',
    'vip.testimonials.comment2':
      'As a health professional, I can state that EKA Balance offers a standard of excellence that exceeds my most demanding expectations.',
    'vip.testimonials.comment3':
      'The silver VIP plan has allowed me to take care of my family and maintain the Balance between professional and personal life. A worthwhile investment.',
    'vip.final.title': 'Join the VIP circle',
    'vip.final.subtitle': 'Start enjoying exclusive benefits today',
    'vip.final.address': 'Carrer Pelai, 12, 08001 Barcelona',
    'vip.final.addressNote': 'Travel included according to plan',
    'vip.monthlySessionsOf': 'Monthly 1.5h sessions',
    'vip.contactFor': 'Contact for',
    'vip.innerCircle': 'Wellness circle',
    'vip.beyond': 'Beyond',
    'vip.wellness': 'Wellness',
    'vip.experienceDescription':
      'An exclusive health and wellness experience designed for demanding professionals',
    'vip.eliteMemberships': 'Accompaniment plans',
    'vip.eliteSubtitle': 'Choose the level of excellence you deserve',
    'vip.mostExclusive': 'Most exclusive',
    'vip.exclusivePrivileges': 'Unique benefits',
    'vip.privilegesSubtitle': 'Benefits that only VIP members can enjoy',
    'vip.voicesOfExcellence': 'Voices of excellence',
    'vip.testimonialsSubtitle': 'Real stories from our VIP members',
    'vip.elite': 'Premium',
    'vip.innerCircleAwaits': 'Your care space awaits',
    'vip.readyToTranscend': 'Ready to transcend',
    'vip.transcend': 'Take the next step?',
    'vip.transcendSubtitle': 'Join the wellness elite and experience a new level of personal care',
    'vip.joinInnerCircle': 'Join our program',
    'vip.exclusiveExperiences': 'Exclusive experiences for VIP members',

    // About Elena page
    'elena.title': 'Elena Kucherova - integrative therapist | EKA Balance',
    'elena.subtitle': 'Specialist in kinesiology and somatic healing',
    'elena.quote': 'Helping people reconnect with their body, mind and life potential.',
    'elena.experience': 'Over 10 years of experience • studies in 9 countries',
    'elena.about.title': 'About Elena',
    'elena.about.p1':
      'Elena Kucherova is an integrative therapist with over 10 years dedicated to deep work with the body, mind and emotional state of people. She has studied in 9 different countries and resolved over 500 cases, transforming physical and emotional suffering into consciousness, freedom and vitality.',
    'elena.about.p2':
      'Her work is not just about relieving symptoms, but discovering and working on the deep causes that prevent living fully. Her view is holistic: she sees the human being as a living unit where body, mind, emotions and life experience are deeply interconnected.',
    'elena.about.p3':
      'Through a gentle yet profound approach, she accompanies change processes that activate the natural potential for self-regulation and healing that we all have within.',
    'elena.education.title': 'Training and education',
    'elena.education.subtitle':
      'Elena has dedicated decades to training in different therapeutic disciplines, creating a unique and integrative approach',
    'elena.education.kinesiology': 'Kinesiology and applied neurophysiology',
    'elena.education.feldenkrais': 'Feldenkrais method',
    'elena.education.psychosomatic': 'Psychosomatics',
    'elena.education.massage': 'Therapeutic and structural massage',
    'elena.education.vibrational': 'Vibrational medicine',
    'elena.education.transformation': 'Transformation and personal development techniques',
    'elena.specializations.title': 'Areas of specialization',
    'elena.specialization.pain': 'Chronic pain and postural imbalances',
    'elena.specialization.stress': 'Stress, anxiety and psychosomatic disorders',
    'elena.specialization.nervous': 'Nervous system regulation and sleep improvement',
    'elena.specialization.emotional': 'Emotional rebalancing and trauma',
    'elena.specialization.personal': 'Personal development and inner transformation',
    'elena.specialization.support': 'Support in relationships, bonds and complex life processes',
    'elena.philosophy.title': 'Philosophy and approach',
    'elena.philosophy.p1':
      'Elena works from the principle that the body is much more than a physical vehicle: it is a living memory of everything we have lived. Every tension, every pain, every blockage contains valuable information about us.',
    'elena.philosophy.p2':
      'When we learn to listen to this information and work with it consciously, the possibility opens up to transform not only the body, but our entire life experience.',
    'elena.philosophy.p3':
      'Her approach combines science and intuition, body techniques and consciousness work, in a deeply personalized process adapted to each person.',
    'elena.work.title': 'Contact options',
    'elena.work.subtitle':
      'If you want to start a deep process of change or simply explore new ways of self-care',
    'elena.work.book': 'Book a session',
    'elena.work.bookDesc': 'Start your journey to wellness',
    'elena.work.explore': 'Explore services',
    'elena.work.exploreDesc': 'Discover all available therapies',
    'elena.work.contact': 'Contact Elena',
    'elena.work.contactDesc': 'Ask your questions directly',
    'elena.connect.title': 'Connect with Elena',
    'elena.connect.email': 'Email',
    'elena.connect.whatsapp': 'WhatsApp',

    // Revisio360 page
    'revisio360.title': '360° review - comprehensive assessment | EKA Balance',
    'revisio360.badge': 'Complete view of your wellness',
    'revisio360.hero.title': '360° review',
    'revisio360.hero.subtitle': 'Complete view of body, movement and habits.',
    'revisio360.hero.description':
      'Comprehensive assessment with clear action plan and next steps.',
    'revisio360.includes.title': 'What does the 360° review include?',
    'revisio360.includes.subtitle':
      'A comprehensive assessment to understand your current state and design your wellness plan',
    'revisio360.includes.postural': 'Postural analysis',
    'revisio360.includes.posturalDesc': 'We evaluate your posture and movement patterns',
    'revisio360.includes.energetic': 'Energetic assessment',
    'revisio360.includes.energeticDesc': 'We identify imbalances and emotional tensions',
    'revisio360.includes.report': 'Personalized report',
    'revisio360.includes.reportDesc':
      'You will receive a detailed plan with specific recommendations',
    'revisio360.booking.title': 'Book your 360° review',
    'revisio360.booking.subtitle':
      "Fill out the form and we'll send you a prepared WhatsApp message",
    'revisio360.benefits.title': 'Benefits of the 360° review',
    'revisio360.benefits.subtitle':
      'Discover everything you can achieve with a comprehensive assessment',
    'revisio360.benefit1': 'Complete assessment of your physical and emotional state',
    'revisio360.benefit2': 'Personalized plan with practical recommendations',
    'revisio360.benefit3': 'Identification of patterns and habits to improve',
    'revisio360.benefit4': 'Follow-up and clear objectives for the future',
    'revisio360.duration.title': 'Available durations',
    'revisio360.duration.subtitle':
      'Choose the duration that best suits the depth of assessment you need',
    'revisio360.duration.minutes': 'Minutes',
    'revisio360.duration.essential': 'Essential assessment',
    'revisio360.duration.complete': 'Complete assessment',
    'revisio360.duration.exhaustive': 'Exhaustive assessment',
    'revisio360.process.title': 'How does it work?',
    'revisio360.process.subtitle': 'A simple process to get a complete view of your wellness',
    'revisio360.process.step1': 'Book',
    'revisio360.process.step1Desc': 'Contact us to schedule your session',
    'revisio360.process.step2': 'Assessment',
    'revisio360.process.step2Desc': 'We perform a complete analysis of your current state',
    'revisio360.process.step3': 'Report',
    'revisio360.process.step3Desc': 'You will receive a personalized plan with recommendations',
    'revisio360.process.step4': 'Follow-up',
    'revisio360.process.step4Desc': 'We accompany you in implementing the plan',
    'revisio360.testimonials.title': 'What our clients say',
    'revisio360.final.title': 'Discover your wellness potential',
    'revisio360.final.subtitle':
      'Book your 360° review and start the path to a more balanced and healthy life',

    // Personalized services
    'personalized.tailored': 'Tailored',
    'personalized.custom': 'Custom',
    'personalized.specific': 'Specific',
    'personalized.targeted': 'Targeted',
    'personalized.specialized': 'Specialized',

    // Casos section
    'casos.section.badge': 'Problems we solve',
    'casos.section.title': 'Discover if we can',
    'casos.section.titleHighlight': 'Help you',
    'casos.section.subtitle':
      'Every body has its story. These are the most common cases we successfully treat.',
    'casos.section.readMore': 'Read more',
    'casos.section.viewAll': 'View all cases',
    'casos.section.findYourCase': 'Find your case',
    'casos.other.title': 'Other areas we treat',
    'casos.other.money': 'Money & finances',
    'casos.other.relationships': 'Relationships & couple',
    'casos.other.selfworth': 'Self-worth & realization',
    'casos.other.family': 'Family conflicts',
    'casos.other.work': 'Professional guidance',
    'casos.other.trauma': 'Emotional trauma',

    // Problems
    'casos.problems.backPain.title': 'Back and neck pain',
    'casos.problems.backPain.description':
      'One of the most frequent reasons for coming to consultation. Lower back pain, cervical contractures, stiffness, or that feeling that you "carry the world on your back".',
    'casos.problems.backPain.symptoms.0':
      'Stabbing pain or constant tension in the lower back or cervical area',
    'casos.problems.backPain.symptoms.1': 'Difficulty turning the neck or lifting the arm',
    'casos.problems.backPain.symptoms.2': 'Fatigue after sitting or standing for a long time',
    'casos.problems.backPain.symptoms.3': 'Sensation of pressure on the shoulders or head',
    'casos.problems.backPain.causes.0': 'Maintained postures and poor ergonomics',
    'casos.problems.backPain.causes.1': 'Accumulated emotional stress',
    'casos.problems.backPain.causes.2': 'Lack of movement and sedentary lifestyle',
    'casos.problems.backPain.causes.3': 'Blocked or shallow breathing',
    'casos.problems.backPain.treatment':
      'With therapeutic massage, myofascial release, kinesiology to find the deep cause (stress, joint or visceral blockage), and postural re-education techniques (Feldenkrais).',
    'casos.problems.backPain.results':
      'Many people notice immediate relief and more mobility after the first session. Over time, the body relearns to support itself with less effort and more fluidity.',
    'casos.problems.backPain.successStory':
      'Anna, 34 years old, office worker: "after 3 years with constant cervical pain, in just 4 sessions i recovered mobility. Now I know how to take care of my posture and the pain has completely disappeared."',

    'casos.problems.stress.title': 'Stress and anxiety',
    'casos.problems.stress.description':
      'The body enters "permanent alert" and does not know how to disconnect. Many people arrive with palpitations, chest tension, insomnia or a feeling of suffocation.',
    'casos.problems.stress.symptoms.0': 'Constant thoughts and mental loop',
    'casos.problems.stress.symptoms.1': 'Difficulty relaxing or sleeping',
    'casos.problems.stress.symptoms.2': 'Cervical pain, jaw tension, morning fatigue',
    'casos.problems.stress.symptoms.3': 'Intense emotions without apparent reason',
    'casos.problems.stress.causes.0': 'Excess of responsibilities and pressure',
    'casos.problems.stress.causes.1': 'Chronic stress and lack of time for oneself',
    'casos.problems.stress.causes.2': 'Unresolved traumas or difficult experiences',
    'casos.problems.stress.causes.3': 'Autonomic nervous system imbalance',
    'casos.problems.stress.treatment':
      'With emotional kinesiology and vagal system techniques to calm the nervous system. We add gentle body work (Feldenkrais, conscious breathing) to teach the body to "get out of the fight".',
    'casos.problems.stress.results':
      'The person sleeps better again, internal tension decreases and recovers the feeling of control and serenity.',
    'casos.problems.stress.successStory':
      'Marc, 28 years old, master student: "anxiety was paralyzing me. With kinesiology i discovered that I had emotional blockages from a past experience. Now I feel much calmer and safer."',

    'casos.problems.digestive.title': 'Digestive problems',
    'casos.problems.digestive.description':
      'When the digestive system is blocked, it is not only difficult to digest food —also emotions and day to day.',
    'casos.problems.digestive.symptoms.0': 'Abdominal bloating, gas, reflux or pain after eating',
    'casos.problems.digestive.symptoms.1': 'Tiredness or postprandial drowsiness',
    'casos.problems.digestive.symptoms.2': 'Mood swings or irritability without reason',
    'casos.problems.digestive.symptoms.3': 'Food intolerances or sensitivities',
    'casos.problems.digestive.causes.0': 'Undetected food intolerances',
    'casos.problems.digestive.causes.1': 'Irregular eating or stress during meals',
    'casos.problems.digestive.causes.2': 'Emotional stress affecting digestion',
    'casos.problems.digestive.causes.3': 'Visceral blockages affecting organ mobility',
    'casos.problems.digestive.treatment':
      'With nutritional kinesiology to detect intolerances or deficits, gentle visceral massage techniques and personalized dietary recommendations.',
    'casos.problems.digestive.results':
      'Digestion improves, bloating disappears and daily energy increases. The client learns to listen to their body and adapt their diet.',
    'casos.problems.digestive.successStory':
      'Laura, 41 years old, mother: "years of digestive problems disappeared when we discovered my intolerances. My energy has completely changed and now i enjoy food without fear."',

    'casos.problems.migraines.title': 'Migraines and cranial tension',
    'casos.problems.migraines.description':
      'Recurrent headaches, photophobia, noises that bother or extreme tiredness. The mind cannot flow when the body is tense.',
    'casos.problems.migraines.symptoms.0': 'Intense pain on one side of the head or neck',
    'casos.problems.migraines.symptoms.1': 'Eye pressure or helmet sensation',
    'casos.problems.migraines.symptoms.2': 'Dizziness or nausea',
    'casos.problems.migraines.symptoms.3': 'Sensitivity to light and noises',
    'casos.problems.migraines.causes.0': 'Cervical blockage and muscle tension',
    'casos.problems.migraines.causes.1': 'Jaw tension (bruxism)',
    'casos.problems.migraines.causes.2': 'Lack of rest or excess mental stimulation',
    'casos.problems.migraines.causes.3': 'Hormonal or dietary imbalances',
    'casos.problems.migraines.treatment':
      'With cranial Osteobalance, muscle discharge and vagal techniques to Balance the nervous system. We also review breathing and posture.',
    'casos.problems.migraines.results':
      'Reduction in the frequency and intensity of migraines. In many cases, they disappear completely after regulating the neck and skull.',
    'casos.problems.migraines.successStory':
      'Carla, 39 years old, designer: "I had migraines 3-4 times a week. After the cranial treatment, i haven\'t had any for 6 months. It has been a total life change."',

    'casos.problems.lowEnergy.title': 'Lack of strength and energy',
    'casos.problems.lowEnergy.description':
      'When everything is difficult, when you wake up tired or feel that the body "does not respond". It is not laziness —it is lack of internal regulation.',
    'casos.problems.lowEnergy.symptoms.0': 'Constant tiredness despite sleeping well',
    'casos.problems.lowEnergy.symptoms.1': 'Low concentration and memory',
    'casos.problems.lowEnergy.symptoms.2': 'Irritability or apathy',
    'casos.problems.lowEnergy.symptoms.3': 'Feeling of "running on autopilot"',
    'casos.problems.lowEnergy.causes.0': 'Prolonged stress and burnout',
    'casos.problems.lowEnergy.causes.1': 'Nutritional deficits or metabolic imbalances',
    'casos.problems.lowEnergy.causes.2': 'Hormonal problems (thyroid, adrenals)',
    'casos.problems.lowEnergy.causes.3': 'Emotional wear and tear and lack of purpose',
    'casos.problems.lowEnergy.treatment':
      'With kinesiology to identify chemical or emotional imbalances, natural supplementation and conscious movement techniques.',
    'casos.problems.lowEnergy.results':
      'Notable improvement in energy, mental clarity and more stable mood.',
    'casos.problems.lowEnergy.successStory':
      'David, 45 years old, executive: "i lived constantly exhausted. We discovered a thyroid problem and nutritional imbalances. Now I feel with more energy than 10 years ago."',

    'casos.problems.hormonal.title': 'Hormonal problems or irregular cycles',
    'casos.problems.hormonal.description':
      'The female body speaks through the cycle. When there is pain, imbalance or exhaustion, it means that something is not in Balance.',
    'casos.problems.hormonal.symptoms.0': 'Menstrual pain, mood swings or irregular periods',
    'casos.problems.hormonal.symptoms.1': 'Premenstrual fatigue or insomnia',
    'casos.problems.hormonal.symptoms.2': 'Difficulty getting pregnant',
    'casos.problems.hormonal.symptoms.3': 'Menopause or perimenopause symptoms',
    'casos.problems.hormonal.causes.0': 'Chronic stress affecting the hormonal axis',
    'casos.problems.hormonal.causes.1': 'Inadequate diet or nutritional imbalances',
    'casos.problems.hormonal.causes.2': 'Blockage at the hypothalamus or endocrine glands level',
    'casos.problems.hormonal.causes.3': 'Environmental factors and endocrine disruptors',
    'casos.problems.hormonal.treatment':
      "With hormonal kinesiology, pelvic Osteobalance and personalized nutritional support. We also work on the relationship with one's own body and femininity.",
    'casos.problems.hormonal.results':
      'The cycle improves, pain disappears and a natural and healthy rhythm is restored.',
    'casos.problems.hormonal.successStory':
      'Sofia, 32 years old, teacher: "my cycles were chaos and menstrual pain paralyzed me. After hormonal treatment, my cycle is regular and painless. I feel reconnected with my body."',

    'casos.problems.sleep.title': 'Sleep difficulties',
    'casos.problems.sleep.description':
      'The mind does not stop, the body neither. Rest is essential to regenerate and maintain physical and mental health.',
    'casos.problems.sleep.symptoms.0': 'Difficulty falling asleep or night awakenings',
    'casos.problems.sleep.symptoms.1': 'Morning fatigue, tension or intense dreams',
    'casos.problems.sleep.symptoms.2': 'Recurrent thoughts before sleeping',
    'casos.problems.sleep.symptoms.3': 'Light or unrefreshing sleep',
    'casos.problems.sleep.causes.0': 'Excess stress and mental hyperactivation',
    'casos.problems.sleep.causes.1': 'Nervous system imbalance and circadian rhythms',
    'casos.problems.sleep.causes.2': 'Lack of routine or sleep hygiene',
    'casos.problems.sleep.causes.3': 'Digestive or hormonal problems',
    'casos.problems.sleep.treatment':
      'With Feldenkrais, guided breathing, vagal techniques and kinesiology to Balance the hormonal system.',
    'casos.problems.sleep.results':
      'Improvement of deep sleep and restorative rest after a few sessions.',
    'casos.problems.sleep.successStory':
      'Elena, 38 years old, lawyer: "i haven\'t slept through the night for years. Breathing and relaxation techniques have completely changed the quality of my sleep. Now I really rest."',

    'casos.problems.recovery.title': 'Recovery after an injury',
    'casos.problems.recovery.description':
      'After a fall, an operation or an accident, the body can remain with stiffness or fear of movement.',
    'casos.problems.recovery.symptoms.0': 'Residual pain or joint limitation',
    'casos.problems.recovery.symptoms.1': 'Feeling of weakness or imbalance',
    'casos.problems.recovery.symptoms.2': 'Emotional blockages associated with the injury',
    'casos.problems.recovery.symptoms.3': 'Fear of movement or reactivity',
    'casos.problems.recovery.causes.0': 'Internal scars and adhesions',
    'casos.problems.recovery.causes.1': 'Muscle and postural compensations',
    'casos.problems.recovery.causes.2': 'Physical trauma with emotional component',
    'casos.problems.recovery.causes.3': 'Body memory of the traumatic experience',
    'casos.problems.recovery.treatment':
      'With Osteobalance, postural re-education and fascial system work. We also accompany body confidence and body memory.',
    'casos.problems.recovery.results':
      'Recovery of mobility, pain relief and feeling of safety in movement.',
    'casos.problems.recovery.successStory':
      'Jordi, 42 years old, athlete: "after a knee injury, I was afraid to move. The integral work helped me not only physically, but also to regain confidence in my body."',

    // Massatge Page
    'massage.page.title': 'Therapeutic massage',
    'massage.page.subtitle': 'Release tension and truly rest.',
    'massage.page.description':
      'Decontracting and relaxing massage adapted to you to reduce pain, stress and stiffness. Key benefits: muscle relief, improved circulation, mental calm, freer posture.',
    'massage.page.availableToday': 'Available today',
    'massage.page.bookSession': 'Book your session',
    'massage.page.fillForm': 'Fill out the form and we will send you a prepared WhatsApp message',
    'massage.page.benefitsTitle': 'Benefits of therapeutic massage',
    'massage.page.benefitsSubtitle': 'Discover how massage can improve your quality of life',
    'massage.page.durationsTitle': 'Available durations',
    'massage.page.durationsSubtitle': 'Choose the duration that best suits your needs',
    'massage.page.duration60': 'Perfect to start',
    'massage.page.duration90': 'Complete treatment',
    'massage.page.duration120': 'Premium experience',
    'massage.page.testimonialsTitle': 'What our clients say',

    // Kinesiologia Page
    'kinesiology.page.title': 'Holistic kinesiology',
    'kinesiology.page.subtitle': 'Listen to the body, find the root.',
    'kinesiology.page.imageAlt':
      'Holistic kinesiology session in a professional and natural environment',
    'kinesiology.page.description':
      'Neuromuscular test and gentle corrections to rebalance body, emotions and habits. Key benefits: less stress, better coordination and stable energy.',
    'kinesiology.page.energyBalance': 'Energy Balance',
    'kinesiology.page.benefitsTitle': 'Benefits of kinesiology',
    'kinesiology.page.benefitsSubtitle': 'Discover how kinesiology can transform your well-being',
    'kinesiology.page.durationsSubtitle': 'Sessions adapted to your needs',
    'kinesiology.page.duration60': 'Introduction and basic Balance session',
    'kinesiology.page.duration90': 'Complete and in-depth treatment',

    // Nutricio Page
    'nutrition.page.badge': 'Conscious eating',
    'nutrition.page.title': 'Conscious nutrition',
    'nutrition.page.subtitle': 'Eat with meaning to have real energy.',
    'nutrition.page.description':
      'Personalized advice for clear habits, digestion and energy. Key benefits: sustainable habits, vitality and support for body composition.',
    'nutrition.page.personalized': 'Personalized nutrition',
    'nutrition.page.benefitsTitle': 'Benefits of nutritional counseling',
    'nutrition.page.benefitsSubtitle': 'Discover how good nutrition can transform your life',
    'nutrition.page.sessionTypes': 'Session types',
    'nutrition.page.sessionSubtitle': 'Personalized accompaniment for your nutritional goals',

    // Agenyz Page
    'agenyz.page.title': 'Agenyz cellular nutrition',
    'agenyz.page.subtitle': 'Advanced supplements for cellular regeneration.',
    'agenyz.page.description':
      'Biohacking and nutrition working at the cellular level. Restore energy, immunity, and youthfulness from the inside out.',
    'agenyz.benefits.cell': 'Cognitive clarity',
    'agenyz.benefits.energy': 'Infinite energy',
    'agenyz.benefits.immunity': 'Immune defense',
    'agenyz.benefits.antiaging': 'Anti-aging effect',
    'agenyz.why.title': 'Why Agenyz?',
    'agenyz.why.subtitle': 'Science-backed benefits for your body and mind.',
    'agenyz.benefits.energy.desc': 'Restores mitochondrial function for sustained daily energy.',
    'agenyz.benefits.immunity.desc': "Strengthens your body's natural defense systems.",
    'agenyz.benefits.cell.desc': 'Enhances focus, memory, and mental performance.',
    'agenyz.benefits.antiaging.desc': 'Combats oxidative stress and slows down aging processes.',
    'agenyz.cta.title': 'Ready to upgrade your health?',
    'agenyz.cta.consult': 'Consult with Elena',
    'agenyz.cta.visitStore': 'Visit Agenyz store',
    'agenyz.hero.biohacking': 'Biohacking & nutrition',
    'agenyz.hero.available': 'Available for order',

    // Testimonials
    'massage.testimonial.1.text':
      "I come in tight and knotted. Leave totally loose. That's it. Simple. Lasts for days.",
    'massage.testimonial.2.text':
      "Best massage i've had. Really knows what she's doing. The space feels great too.",
    'kinesiology.testimonial.1.text':
      'Kinesiology has helped me better understand my body and emotions. Now I have more energy and mental clarity.',
    'kinesiology.testimonial.2.text':
      'After the kinesiology sessions i noticed an incredible improvement in my posture and coordination. I totally recommend it.',
    'nutrition.testimonial.1.text':
      'Nutritional counseling has completely changed my relationship with food. Now I have more energy and feel much better.',
    'nutrition.testimonial.2.text':
      'Personalized advice has helped me create healthy habits that I can easily maintain. Result: more vitality every day.',

    // 360 Revision
    'hero.title': '360° body review',
    'hero.subtitle': 'Listen to your body. Understand your story. Reclaim your life.',
    'hero.description':
      "A 90-minute journey to map your physical, emotional, and energetic landscape. It's not just a diagnosis — it's the first step to coming home to your body.",
    'hero.cta': 'Begin your journey',
    'hero.scroll': 'Discover the 360° approach',
    'why.title': 'Why 360°?',
    'why.subtitle': 'Because you are not just a collection of parts. You are a whole system.',
    'why.physical.title': 'The physical body',
    'why.physical.desc':
      'Where tension lives. We read structure, fascia, and posture to find where you are holding on.',
    'why.emotional.title': 'The emotional body',
    'why.emotional.desc':
      'Where history is stored. Unprocessed emotions become physical blockages.',
    'why.energetic.title': 'The energetic body',
    'why.energetic.desc': 'Where vitality flows. We restore flow so healing can happen naturally.',
    'service.title': 'The experience',
    'service.step1.title': '1. The deep interview',
    'service.step1.desc':
      'Beyond medical history. We talk about your life, your stress, your dreams, and what your body has been trying to tell you.',
    'service.step2.title': '2. The body mapping',
    'service.step2.desc':
      'A hands-on reading of your structure. We identify imbalances, fascial restrictions, and areas of stagnant energy.',
    'service.step3.title': '3. The integration session',
    'service.step3.desc':
      'Using a blend of modalities (massage, kinesiology, energy work) to begin the process of unlocking and realigning.',
    'service.step4.title': '4. The roadmap',
    'service.step4.desc':
      "You don't leave empty-handed. You receive a personalized plan with exercises, lifestyle tips, and treatment recommendations.",
    'variants.title': 'Choose your path',
    'variants.mapping.title': '360° mapping',
    'variants.mapping.price': '€90',
    'variants.mapping.duration': '90 min',
    'variants.mapping.desc': 'The foundational session. Full diagnosis + first treatment.',
    'variants.alignment.title': '360° alignment',
    'variants.alignment.price': '€250',
    'variants.alignment.duration': '3 session pack',
    'variants.alignment.desc': 'For deeper work. Includes mapping + 2 focused follow-up sessions.',
    'variants.integral.title': 'Integral transformation',
    'variants.integral.price': '€450',
    'variants.integral.duration': '6 week program',
    'variants.integral.desc': 'Complete life shift. Mapping + 5 sessions + ongoing support.',
    'variants.book': 'Book now',
    'prompt.title': 'My approach',
    'prompt.diagnosis': 'Gentle and precise diagnosis',
    'prompt.diagnosisDesc': 'Listening to the body with hands and short questions',
    'prompt.integrativeTechniques': 'Integrative techniques',
    'prompt.techniquesDesc':
      'Therapeutic massage, kinesiology, Osteobalance, conscious movement (Feldenkrais), breathing and nervous system regulation',
    'prompt.layeredProcesses': 'Layered processes',
    'prompt.layeredDesc':
      'Release tension, reorder patterns and consolidate new bodily and emotional habits',
    'prompt.session': 'Session',
    'prompt.firstVisit': 'First visit with diagnosis and gentle work. From here, i outline the',
    'prompt.personalPlan': 'Personal plan',
    'prompt.sessionsRange': '(usually 3–6 sessions) to go layer by layer',
    'prompt.forWho': "Who it's for",
    'prompt.forWhoDesc':
      'For people who want real and consistent changes, not quick solutions. If you are ready to listen to yourself and commit to your well-being, this work is for you.',
    'prompt.booking': 'Book',
    'prompt.consultation': 'Consultation',
    'prompt.promptLabel': 'Prompt',
    'prompt.signature': '— Elena Kucherova',
    'common.ekaBalance': 'EKA Balance',
    'common.copyright': '© 2024',
    'benefits.benefit1.title': 'Mental clarity',
    'benefits.benefit1.description': 'Improved focus and cognitive function',
    'benefits.benefit1.science':
      'Integrative bodywork stimulates the vagus nerve, improving brain-body communication and executive function.',
    'benefits.benefit2.title': 'Emotional Balance',
    'benefits.benefit2.description': 'Greater emotional resilience and regulation',
    'benefits.benefit2.science':
      'Somatic techniques help process stored trauma and regulate nervous system stress response patterns.',
    'benefits.benefit3.title': 'Sustained energy',
    'benefits.benefit3.description': 'Natural vitality without artificial stimulation',
    'benefits.benefit3.science':
      'Addressing fascial restrictions and postural imbalances reduces metabolic energy waste, increasing natural vitality.',
    'benefits.benefit4.title': 'Pain relief',
    'benefits.benefit4.description': 'Lasting relief from chronic pain patterns',
    'benefits.benefit4.science':
      'The 360° approach addresses root causes rather than symptoms, creating lasting neuroplastic changes in pain perception.',
    'benefits.benefit5.title': 'Better sleep',
    'benefits.benefit5.description': 'Deeper, more restorative sleep cycles',
    'benefits.benefit5.science':
      'Nervous system regulation and tension release promote healthy circadian rhythms and sleep architecture.',
    'benefits.benefit6.title': 'Stress resilience',
    'benefits.benefit6.description': "Greater capacity to handle life's challenges",
    'benefits.benefit6.science':
      'Building parasympathetic tone through bodywork increases stress resilience and recovery capacity.',
    'benefits.benefit7.title': 'Movement freedom',
    'benefits.benefit7.description': 'Improved mobility and body awareness',
    'benefits.benefit7.science':
      'Fascial release and movement re-education restore natural movement patterns and proprioceptive awareness.',
    'benefits.benefit8.title': 'Inner compass',
    'benefits.benefit8.description': 'Stronger connection to intuition and inner wisdom',
    'benefits.benefit8.science':
      'Interoceptive awareness developed through bodywork enhances gut feelings and decision-making clarity.',
    'benefits.benefit9.title': 'Vitality',
    'benefits.benefit9.description': 'Renewed sense of aliveness and presence',
    'benefits.benefit9.science':
      'Clearing energetic blockages and restoring flow creates measurable improvements in life force and presence.',
    'benefits.science': 'The science',
    'benefits.philosophy':
      'We measure success not just in the absence of symptoms, but in the presence of vitality, joy, and the deep knowing that your body is your ally in life.',
    'service.step1.details.1': 'Comprehensive health and lifestyle assessment',
    'service.step1.details.2': 'Movement pattern analysis',
    'service.step1.details.3': 'Emotional mapping and stress pattern analysis',
    'service.step1.details.4': 'Goal setting and intention alignment',
    'service.step2.details.1': 'Postural and structural analysis',
    'service.step2.details.2': 'Fascial tension and mobility assessment',
    'service.step2.details.3': 'Energy flow assessment',
    'service.step2.details.4': 'Nervous system state assessment',
    'service.step3.details.1': 'Manual therapy and bodywork',
    'service.step3.details.2': 'Breathing and nervous system regulation',
    'service.step3.details.3': 'Movement re-education',
    'service.step3.details.4': 'Energy balancing techniques',
    'service.step4.details.1': 'Personalized movement sequences',
    'service.step4.details.2': 'Self-care practices and tools',
    'service.step4.details.3': 'Lifestyle modification suggestions',
    'service.step4.details.4': 'Follow-up session planning',
    'testimonials.maria.name': 'Maria',
    'testimonials.maria.issue': 'Chronic neck pain and stress',
    'testimonials.maria.quote':
      "After 15 years of pain, i finally feel like myself again. The 360° approach didn't just fix my neck — it gave me back my confidence.",
    'testimonials.maria.result':
      'Pain reduced from 8/10 to 1/10, stress levels dramatically improved',
    'testimonials.maria.timeframe': '3 months',
    'testimonials.maria.before': 'Constant tension, poor posture, anxiety affecting daily life',
    'testimonials.maria.after': 'Pain-free movement, confident posture, peaceful nervous system',
    'testimonials.david.name': 'David',
    'testimonials.david.issue': 'Athletic performance and recovery',
    'testimonials.david.quote':
      'I thought i knew my body as an athlete. The 360° mapping revealed patterns i never knew existed. My performance and recovery have reached new levels.',
    'testimonials.david.result': '25% improvement in recovery time, eliminated recurring injuries',
    'testimonials.david.timeframe': '6 weeks',
    'testimonials.david.before': 'Frequent injuries, slow recovery, performance plateaus',
    'testimonials.david.after': 'Injury-free training, faster recovery, new personal records',
    'testimonials.jennifer.name': 'Jennifer',
    'testimonials.jennifer.issue': 'Post-surgical recovery and mobility',
    'testimonials.jennifer.quote':
      'After my surgery, i felt disconnected from my body. The healing here went beyond physical — i learned to trust my body again.',
    'testimonials.jennifer.result': 'Full mobility restored, movement confidence returned',
    'testimonials.jennifer.timeframe': '4 months',
    'testimonials.jennifer.before': 'Limited mobility, fear of movement, depression',
    'testimonials.jennifer.after': 'Full range of motion, joy in movement, emotional healing',
    'testimonials.alex.name': 'Alex',
    'testimonials.alex.issue': 'Anxiety and nervous system dysregulation',
    'testimonials.alex.quote':
      'I came for anxiety, not expecting bodywork to help. But when they explained how my nervous system was stuck, it all made sense. I feel calm in my body for the first time in years.',
    'testimonials.alex.result': 'Anxiety reduced by 80%, sleep quality dramatically improved',
    'testimonials.alex.timeframe': '8 weeks',
    'testimonials.alex.before': 'Chronic anxiety, insomnia, feeling unsafe in body',
    'testimonials.alex.after': 'Calm nervous system, restorative sleep, embodied confidence',
    'testimonials.resultsAchieved': 'Results achieved:',
    'testimonials.timeframe': 'Time:',
    'testimonials.watchVideo': 'Watch video story',
    'testimonials.showBeforeAfter': 'Show before & after',
    'testimonials.hideBeforeAfter': 'Hide',
    'testimonials.before': 'Before:',
    'testimonials.after': 'After:',
    'testimonials.videoStory': 'Story of',
    'testimonials.keyInsights': 'Key insights from',
    'testimonials.keyInsight1': 'How the 360° approach addressed root causes, not just symptoms',
    'testimonials.keyInsight2': 'The emotional breakthrough that accelerated physical healing',
    'testimonials.keyInsight3': 'Practical tools that continue to support ongoing wellness',
    'testimonials.keyInsight4': 'Why this approach succeeded where others had failed',
    'testimonials.videoPlaceholder': 'Video testimonial would play here',
    'testimonials.videoImplementation':
      'In a real implementation, this would be embedded video content',
    'story.title': 'A healing journey',
    'story.intro': 'Sarah came to us carrying the weight of ten years...',
    'story.paragraph1':
      "Sarah's shoulders spoke before she did. Curved inward like a protective shell, they held the story of countless sleepless nights, of emails answered at midnight, of a promotion that came with a price her body was still paying.",
    'story.paragraph2':
      '"i just want my neck to stop hurting," she said during our first session. But her body whispered deeper truths — about the fear lodged in her chest, the anxiety that had taken residence in her jaw, the exhaustion that lived in her very bones.',
    'story.paragraph3':
      "The 360° approach didn't just address her neck. We worked with the emotional patterns that created the tension, the structural imbalances that maintained it, and the energetic blockages that prevented healing. We listened to what her body needed to feel safe again.",
    'story.paragraph4':
      'Three months later, sarah carried herself differently. Not just straighter — she carried herself like someone who remembered she had permission to take up space. Her neck pain had become a doorway to reclaiming parts of herself she had forgotten existed.',
    'story.paragraph5': '"i didn\'t just get my body back," she told us. "I got my life back."',
    'story.philosophy':
      'Every body has a story. Every story deserves to be heard in its fullness — not just the symptoms, but the whole human experience beneath them.',
    'services.completeReview': 'Complete 360° body review',
    'services.reset360': 'Reset 360°',
    'services.mapping360': '360° body mapping',
    'services.alignment360': 'Alignment 360°',
    'services.followUpConsultations': 'Follow-up consultations',
    'cta.scheduleDiscoveryCall': 'Schedule a discovery call',
    'cta.downloadGuide': 'Download our guide',
    'labels.noInsuranceNeeded': 'No insurance needed',
    'labels.flexibleSchedules': 'Flexible schedules',
    'labels.personalizedApproach': 'Personalized approach',
    'labels.presentialConsultations': 'In-person consultations',
    'labels.onlineSessionsAvailable': 'And online sessions available',
    'alt.ekaLogo': 'EKA Balance logo',
    'footer.brand': 'Integral healing 360°',
    'footer.description':
      'Transforming lives through integral healing of body, mind and spirit. Your journey to complete wellness begins here.',
    'footer.healingWithIntention': 'Healing with intention',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.copyright': '© 2024 EKA Balance. All rights reserved.',
    'footer.madeWith': 'Made with',
    'footer.forHealing': 'For healing',
  },

  es: {
    'booking.smart.title': '¿cómo quieres reservar?',
    'booking.smart.subtitle': 'Elige la opción que te sea más cómoda',
    'booking.smart.quick': 'WhatsApp directo',
    'booking.smart.quickDesc': 'Abre el chat y escribe directamente',
    'booking.smart.form': 'Formulario guiado',
    'booking.smart.formDesc': 'Rellena los datos para agilizar el proceso',
    'booking.service.consultation': 'Consulta gratuita 15 min',
    'booking.smart.name': 'Tu nombre',
    'booking.smart.service': 'Servicio deseado',
    'booking.smart.time': 'Preferencia horaria',
    'booking.smart.send': 'Enviar por WhatsApp',
    'booking.smart.back': 'Atrás',

    // Service-specific translations
    'service.duration': 'Duración',
    'service.price': 'Precio',
    'service.supplements.title': 'Suplementos personalizados',
    'service.systemic.title': 'Terapia sistémica',
    'service.benefits': 'Beneficios',
    'service.ideal.for': 'Ideal para',
    'service.what.to.expect': 'Qué esperar',
    'service.preparation': 'Preparación',
    'service.aftercare': 'Cuidados posteriores',
    'service.contraindications': 'Contraindicaciones',
    'service.booking.note': 'Nota de reserva',
    'service.sessions.recommended': 'Sesiones recomendadas',
    'service.frequency': 'Frecuencia',

    // Onboarding Goals & Feelings
    'onboarding.goals.stress': 'Estrés y ansiedad',
    'onboarding.goals.pain': 'Dolor o molestias',
    'onboarding.goals.posture': 'Mejorar postura',
    'onboarding.goals.sleep': 'Dormir mejor',
    'onboarding.goals.energy': 'Más energía',
    'onboarding.goals.focus': 'Enfoque mental',
    'onboarding.goals.bodyAwareness': 'Conexión con el cuerpo',
    'onboarding.goals.feelGood': 'Sentirme bien',
    'onboarding.goals.lightness': 'Ligereza',
    'onboarding.goals.inspiration': 'Inspiración',
    'onboarding.goals.vitality': 'Vitalidad',
    'onboarding.goals.money': 'Dinero y abundancia',
    'onboarding.goals.relationships': 'Relaciones y pareja',
    'onboarding.goals.family': 'Familia y raíces',
    'onboarding.goals.selfworth': 'Autoestima',

    'onboarding.results.howYouWillFeel': 'Cómo te sentirás:',
    'services.consultation.title': 'Consulta gratuita 15 min',
    'services.consultation.description': '¿no estás segura? Hablemos 15 minutos sin compromiso.',
    'services.consultation.feeling': 'Claridad sobre tu camino',

    'recommendations.massage.feeling': 'Cuerpo relajado y mente en calma',
    'recommendations.kinesiology.feeling': 'Claridad mental y energía renovada',
    'recommendations.kinesiology.emotional_feeling': 'Equilibrio emocional y paz interior',
    'recommendations.feldenkrais.feeling': 'Movimiento libre y sin dolor',
    'recommendations.systemic.feeling': 'Orden interno y alivio',
    'recommendations.supplements.feeling': 'Vitalidad y soporte físico',
    'recommendations.supplements.description':
      'Nutrición celular avanzada para aumentar tu productividad diaria.',

    // Services page
    'services.integralWellbeingFor': 'Terapias para el bienestar integral',
    'services.ourServices': 'Nuestros servicios',
    'services.ourServices2': 'Profesionales',
    'services.wellnessPath':
      'Descubre el camino hacia tu bienestar físico y emocional con nuestros servicios profesionales',
    'services.mainBenefits': 'Beneficios principales',
    'services.quickBooking': 'Reserva rápida',
    'services.quickBookingSubtitle': 'Contáctanos por WhatsApp o telegram para reservar',
    'services.readyToStart': '¿listo para empezar?',
    'services.contactUsToBook': 'Contáctanos para reservar tu sesión',

    // Service benefits
    'services.benefits.reduces': 'Reduce el dolor',
    'services.benefits.stress': 'Alivia el estrés',
    'services.benefits.circulation': 'Mejora la circulación',
    'services.benefits.relaxation': 'Relajación profunda',
    'services.benefits.blockages': 'Libera bloqueos',
    'services.benefits.posture': 'Mejora la postura',
    'services.benefits.energy': 'Aumenta la energía',
    'services.benefits.habits': 'Hábitos saludables',
    'services.benefits.vitality': 'Más vitalidad',
    'services.benefits.weight': 'Control de peso',
    'services.benefits.longterm': 'Beneficios a largo plazo',
    'services.benefits.assessment': 'Evaluación completa',
    'services.benefits.plan': 'Plan personalizado',
    'services.benefits.recommendations': 'Recomendaciones claras',
    'services.benefits.followup': 'Seguimiento continuo',

    // Pricing specific
    'pricing.from': 'Desde',
    'pricing.session': 'Sesión',
    'pricing.package': 'Paquete',
    'pricing.discount': 'Descuento',
    'pricing.save': 'Ahorra',
    'pricing.popular': 'Popular',
    'pricing.best.value': 'Mejor valor',
    'pricing.limited.time': 'Tiempo limitado',

    // VIP specific
    'vip.title': 'Planes VIP - control de salud y bienestar | EKA Balance',
    'vip.description':
      'Planes VIP exclusivos con sesiones a domicilio, control de salud mensual y beneficios familiares. Bronze, silver y gold VIP en Barcelona.',
    'vip.badge': 'Atención personal y exclusiva',
    'vip.hero.title': 'Planes VIP de control de salud',
    'vip.hero.subtitle':
      'Sesiones a domicilio • control mensual • beneficios familiares • Barcelona',
    'vip.stats.sessions': 'Sesiones 1,5h',
    'vip.stats.barcelona': 'En Barcelona',
    'vip.stats.family': 'Familia incluida',
    'vip.stats.control': 'Control salud',
    'vip.cta.consultation': 'Consulta VIP',
    'vip.cta.normal': 'Ver servicios normales',
    'vip.benefits.sessions': 'Sesiones de 1,5h',
    'vip.benefits.sessionsDesc': 'Sesiones completas y personalizadas',
    'vip.benefits.barcelona': 'En Barcelona',
    'vip.benefits.barcelonaDesc': 'Desplazamientos por toda Barcelona',
    'vip.benefits.transferable': 'Sesiones transferibles',
    'vip.benefits.transferableDesc': 'Comparte con tu familia',
    'vip.benefits.monthly': 'Control mensual',
    'vip.benefits.monthlyDesc': 'Seguimiento de tu salud',
    'vip.service.displacements.title': 'Desplazamientos exclusivos',
    'vip.service.displacements.description':
      'Servicio VIP a domicilio u oficina con total discreción',
    'vip.service.health.title': 'Seguimiento de salud',
    'vip.service.health.description': 'Control mensual de tu estado físico y emocional',
    'vip.service.family.title': 'Beneficios familiares',
    'vip.service.family.description': 'Extensión de beneficios a tu familia',
    'vip.service.priority.title': 'Acceso prioritario',
    'vip.service.priority.description': 'Atención preferente y respuesta rápida',
    'vip.includes.title': '¿qué incluye el servicio VIP?',
    'vip.includes.subtitle': 'Todos los planes VIP incluyen estos beneficios exclusivos',
    'vip.plan.comparison': 'Comparación de planes VIP',
    'vip.plan.comparisonDesc': 'Encuentra el plan perfecto para tus necesidades',
    'vip.plan.bronze': 'Bronze VIP',
    'vip.plan.bronze.price': '390€',
    'vip.plan.bronze.description': 'Entrada al mundo VIP',
    'vip.plan.silver': 'Silver VIP',
    'vip.plan.silver.price': '690€',
    'vip.plan.silver.description': 'Perfecto para profesionales',
    'vip.plan.gold': 'Gold VIP',
    'vip.plan.gold.price': '990€',
    'vip.plan.gold.description': 'La experiencia VIP definitiva',
    'vip.plan.popular': 'Popular',
    'vip.plan.premium': 'Premium',
    'vip.tier.standard': 'Estándar',
    'vip.testimonials.title': 'Clientes VIP satisfechos',
    'vip.testimonials.subtitle': 'Experiencias reales de nuestros planes VIP',
    'vip.testimonials.comment1':
      'El servicio gold VIP ha transformado completamente mi calidad de vida. La atención personalizada y la disponibilidad 24/7 son incomparables.',
    'vip.testimonials.comment2':
      'Como profesional de la salud, puedo afirmar que EKA Balance ofrece un estándar de excelencia que supera mis expectativas más exigentes.',
    'vip.testimonials.comment3':
      'El plan silver VIP me ha permitido cuidar de mi familia y mantener el equilibrio entre vida profesional y personal. Una inversión que vale la pena.',
    'vip.final.title': 'Únete al círculo VIP',
    'vip.final.subtitle': 'Comienza a disfrutar de los beneficios exclusivos hoy mismo',
    'vip.final.address': 'Carrer Pelai, 12, 08001 Barcelona',
    'vip.final.addressNote': 'Desplazamientos incluidos según el plan',
    'vip.monthlySessionsOf': 'Sesiones mensuales de 1,5h',
    'vip.contactFor': 'Contacta para',
    'vip.innerCircle': 'Círculo de bienestar',
    'vip.beyond': 'Más allá del',
    'vip.wellness': 'Bienestar',
    'vip.experienceDescription':
      'Una experiencia exclusiva de salud y bienestar diseñada para profesionales exigentes',
    'vip.eliteMemberships': 'Planes de acompañamiento',
    'vip.eliteSubtitle': 'Elige el nivel de excelencia que mereces',
    'vip.mostExclusive': 'Más exclusivo',
    'vip.exclusivePrivileges': 'Ventajas únicas',
    'vip.privilegesSubtitle': 'Beneficios que solo los miembros VIP pueden disfrutar',
    'vip.voicesOfExcellence': 'Voces de excelencia',
    'vip.testimonialsSubtitle': 'Historias reales de nuestros miembros VIP',
    'vip.elite': 'Premium',
    'vip.innerCircleAwaits': 'Tu espacio de cuidado te espera',
    'vip.readyToTranscend': 'Listo para trascender',
    'vip.transcend': 'Dar el siguiente paso?',
    'vip.transcendSubtitle':
      'Únete a la élite del bienestar y experimenta un nuevo nivel de cuidado personal',
    'vip.joinInnerCircle': 'Únete a nuestro programa',
    'vip.exclusiveExperiences': 'Experiencias exclusivas para miembros VIP',

    // About Elena page
    'elena.title': 'Elena Kucherova - terapeuta integradora | EKA Balance',
    'elena.subtitle': 'Especialista en kinesiología y sanación somática',
    'elena.quote':
      'Ayudando a las personas a reconectar con su cuerpo, su mente y su potencial de vida.',
    'elena.experience': 'Más de 10 años de experiencia • estudios en 9 países',
    'elena.about.title': 'Sobre Elena',
    'elena.about.p1':
      'Elena Kucherova es una terapeuta integradora con una trayectoria de más de 10 años dedicada al trabajo profundo con el cuerpo, la mente y el estado emocional de las personas. Ha estudiado en 9 países diferentes y ha resuelto más de 500 casos, transformando el sufrimiento físico y emocional en consciencia, libertad y vitalidad.',
    'elena.about.p2':
      'Su trabajo no consiste solo en aliviar los síntomas, sino en descubrir y trabajar las causas profundas que impiden vivir plenamente. Su mirada es global: ve al ser humano como una unidad viva donde cuerpo, mente, emociones y experiencia vital están profundamente interconectados.',
    'elena.about.p3':
      'A través de un enfoque suave pero profundo, acompaña procesos de cambio que activan el potencial natural de autorregulación y sanación que todos tenemos dentro.',
    'elena.education.title': 'Formación y educación',
    'elena.education.subtitle':
      'Elena ha dedicado décadas a formarse en diferentes disciplinas terapéuticas, creando un enfoque único e integrador',
    'elena.education.kinesiology': 'Kinesiología y neurofisiología aplicada',
    'elena.education.feldenkrais': 'Método Feldenkrais',
    'elena.education.psychosomatic': 'Psicosomática',
    'elena.education.massage': 'Masaje terapéutico y estructural',
    'elena.education.vibrational': 'Medicina vibracional',
    'elena.education.transformation': 'Técnicas de transformación y desarrollo personal',
    'elena.specializations.title': 'Áreas de especialización',
    'elena.specialization.pain': 'Dolores crónicos y desequilibrios posturales',
    'elena.specialization.stress': 'Estrés, ansiedad y trastornos psicosomáticos',
    'elena.specialization.nervous': 'Regulación del sistema nervioso y mejora del sueño',
    'elena.specialization.emotional': 'Reequilibrio emocional y trauma',
    'elena.specialization.personal': 'Desarrollo personal y transformación interior',
    'elena.specialization.support': 'Apoyo en relaciones, vínculos y procesos vitales complejos',
    'elena.philosophy.title': 'Filosofía y enfoque',
    'elena.philosophy.p1':
      'Elena trabaja desde el principio de que el cuerpo es mucho más que un vehículo físico: es una memoria viva de todo lo que hemos vivido. Cada tensión, cada dolor, cada bloqueo contiene información valiosa sobre nosotros.',
    'elena.philosophy.p2':
      'Cuando aprendemos a escuchar esta información y a trabajar con ella conscientemente, se abre la posibilidad de transformar no solo el cuerpo, sino toda nuestra experiencia vital.',
    'elena.philosophy.p3':
      'Su enfoque combina ciencia e intuición, técnicas corporales y trabajo con la consciencia, en un proceso profundamente personalizado y adaptado a cada persona.',
    'elena.work.title': 'Opciones de contacto',
    'elena.work.subtitle':
      'Si quieres iniciar un proceso profundo de cambio o simplemente explorar nuevas formas de cuidarte',
    'elena.work.book': 'Reservar una sesión',
    'elena.work.bookDesc': 'Comienza tu camino hacia el bienestar',
    'elena.work.explore': 'Explorar los servicios',
    'elena.work.exploreDesc': 'Descubre todas las terapias disponibles',
    'elena.work.contact': 'Contactar con Elena',
    'elena.work.contactDesc': 'Haz tus preguntas directamente',
    'elena.connect.title': 'Conecta con Elena',
    'elena.connect.email': 'Email',
    'elena.connect.whatsapp': 'WhatsApp',

    // Revisio360 page
    'revisio360.title': 'Revisión 360° - evaluación integral | EKA Balance',
    'revisio360.badge': 'Visión completa de tu bienestar',
    'revisio360.hero.title': 'Revisión 360°',
    'revisio360.hero.subtitle': 'Visión completa de cuerpo, movimiento y hábitos.',
    'revisio360.hero.description': 'Evaluación integral con plan de acción claro y próximos pasos.',
    'revisio360.includes.title': '¿qué incluye la revisión 360°?',
    'revisio360.includes.subtitle':
      'Una evaluación completa para entender tu estado actual y diseñar tu plan de bienestar',
    'revisio360.includes.postural': 'Análisis postural',
    'revisio360.includes.posturalDesc': 'Evaluamos tu postura y patrones de movimiento',
    'revisio360.includes.energetic': 'Evaluación energética',
    'revisio360.includes.energeticDesc': 'Identificamos desequilibrios y tensiones emocionales',
    'revisio360.includes.report': 'Informe personalizado',
    'revisio360.includes.reportDesc': 'Recibirás un plan detallado con recomendaciones específicas',
    'revisio360.booking.title': 'Reserva tu revisión 360°',
    'revisio360.booking.subtitle':
      'Completa el formulario y te enviaremos un mensaje preparado por WhatsApp',
    'revisio360.benefits.title': 'Beneficios de la revisión 360°',
    'revisio360.benefits.subtitle':
      'Descubre todo lo que puedes lograr con una evaluación completa',
    'revisio360.benefit1': 'Evaluación completa de tu estado físico y emocional',
    'revisio360.benefit2': 'Plan personalizado con recomendaciones prácticas',
    'revisio360.benefit3': 'Identificación de patrones y hábitos a mejorar',
    'revisio360.benefit4': 'Seguimiento y objetivos claros para el futuro',
    'revisio360.duration.title': 'Duraciones disponibles',
    'revisio360.duration.subtitle':
      'Elige la duración que mejor se adapte a la profundidad de evaluación que necesitas',
    'revisio360.duration.minutes': 'Minutos',
    'revisio360.duration.essential': 'Evaluación esencial',
    'revisio360.duration.complete': 'Evaluación completa',
    'revisio360.duration.exhaustive': 'Evaluación exhaustiva',
    'revisio360.process.title': '¿cómo funciona?',
    'revisio360.process.subtitle':
      'Un proceso sencillo para obtener una visión completa de tu bienestar',
    'revisio360.process.step1': 'Reserva',
    'revisio360.process.step1Desc': 'Contáctanos para programar tu sesión',
    'revisio360.process.step2': 'Evaluación',
    'revisio360.process.step2Desc': 'Realizamos un análisis completo de tu estado actual',
    'revisio360.process.step3': 'Informe',
    'revisio360.process.step3Desc': 'Recibirás un plan personalizado con recomendaciones',
    'revisio360.process.step4': 'Seguimiento',
    'revisio360.process.step4Desc': 'Te acompañamos en la implementación del plan',
    'revisio360.testimonials.title': 'Qué dicen nuestros clientes',
    'revisio360.final.title': 'Descubre tu potencial de bienestar',
    'revisio360.final.subtitle':
      'Reserva tu revisión 360° y comienza el camino hacia una vida más equilibrada y saludable',

    // Personalized services
    'personalized.tailored': 'Personalizado',
    'personalized.custom': 'A medida',
    'personalized.specific': 'Específico',
    'personalized.targeted': 'Dirigido',
    'personalized.specialized': 'Especializado',

    // Casos section
    'casos.section.badge': 'Problemas que resolvemos',
    'casos.section.title': 'Descubre si podemos',
    'casos.section.titleHighlight': 'Ayudarte',
    'casos.section.subtitle':
      'Cada cuerpo tiene su historia. Estos son los casos más frecuentes que tratamos con éxito.',
    'casos.section.readMore': 'Leer más',
    'casos.section.viewAll': 'Ver todos los casos',
    'casos.section.findYourCase': 'Encuentra tu caso',

    // Problems
    'casos.problems.backPain.title': 'Dolor de espalda y cuello',
    'casos.problems.backPain.description':
      'Uno de los motivos más frecuentes para venir a consulta. Dolor lumbar, contracturas cervicales, rigidez, o esa sensación de "cargar el mundo en la espalda".',
    'casos.problems.backPain.symptoms.0':
      'Dolor punzante o tensión constante en la zona lumbar o cervical',
    'casos.problems.backPain.symptoms.1': 'Dificultad para girar el cuello o levantar el brazo',
    'casos.problems.backPain.symptoms.2': 'Fatiga después de estar sentado o de pie mucho tiempo',
    'casos.problems.backPain.symptoms.3': 'Sensación de presión en los hombros o cabeza',
    'casos.problems.backPain.causes.0': 'Posturas mantenidas y mala ergonomía',
    'casos.problems.backPain.causes.1': 'Estrés emocional acumulado',
    'casos.problems.backPain.causes.2': 'Falta de movimiento y sedentarismo',
    'casos.problems.backPain.causes.3': 'Respiración bloqueada o superficial',
    'casos.problems.backPain.treatment':
      'Con masaje terapéutico, liberación miofascial, kinesiología para encontrar la causa profunda (estrés, bloqueo articular o visceral), y técnicas de reeducación postural (Feldenkrais).',
    'casos.problems.backPain.results':
      'Muchas personas notan alivio inmediato y más movilidad después de la primera sesión. Con el tiempo, el cuerpo reaprende a sostenerse con menos esfuerzo y más fluidez.',
    'casos.problems.backPain.successStory':
      'Anna, 34 años, trabajadora de oficina: "después de 3 años con dolor cervical constante, en solo 4 sesiones recuperé la movilidad. Ahora sé cómo cuidar mi postura y el dolor ha desaparecido completamente."',

    'casos.problems.stress.title': 'Estrés y ansiedad',
    'casos.problems.stress.description':
      'El cuerpo entra en "alerta permanente" y no sabe desconectar. Muchas personas llegan con palpitaciones, tensión en el pecho, insomnio o sensación de ahogo.',
    'casos.problems.stress.symptoms.0': 'Pensamientos constantes y bucle mental',
    'casos.problems.stress.symptoms.1': 'Dificultad para relajarse o dormir',
    'casos.problems.stress.symptoms.2': 'Dolor cervical, tensión mandibular, fatiga por la mañana',
    'casos.problems.stress.symptoms.3': 'Emociones intensas sin motivo aparente',
    'casos.problems.stress.causes.0': 'Exceso de responsabilidades y presión',
    'casos.problems.stress.causes.1': 'Estrés crónico y falta de tiempo para uno mismo',
    'casos.problems.stress.causes.2': 'Traumas no resueltos o experiencias difíciles',
    'casos.problems.stress.causes.3': 'Desajuste del sistema nervioso autónomo',
    'casos.problems.stress.treatment':
      'Con kinesiología emocional y técnicas del sistema vagal para calmar el sistema nervioso. Añadimos trabajo corporal suave (Feldenkrais, respiración consciente) para enseñar al cuerpo a "salir de la lucha".',
    'casos.problems.stress.results':
      'La persona vuelve a dormir mejor, disminuye la tensión interna y recupera la sensación de control y serenidad.',
    'casos.problems.stress.successStory':
      'Marc, 28 años, estudiante de máster: "la ansiedad me estaba paralizando. Con la kinesiología descubrí que tenía bloqueos emocionales de una experiencia pasada. Ahora me siento mucho más tranquilo y seguro."',

    'casos.problems.digestive.title': 'Problemas digestivos',
    'casos.problems.digestive.description':
      'Cuando el sistema digestivo se bloquea, no solo cuesta digerir la comida —también las emociones y el día a día.',
    'casos.problems.digestive.symptoms.0':
      'Hinchazón abdominal, gases, reflujo o dolor después de comer',
    'casos.problems.digestive.symptoms.1': 'Cansancio o somnolencia postprandial',
    'casos.problems.digestive.symptoms.2': 'Cambios de humor o irritabilidad sin motivo',
    'casos.problems.digestive.symptoms.3': 'Intolerancias alimentarias o sensibilidades',
    'casos.problems.digestive.causes.0': 'Intolerancias alimentarias no detectadas',
    'casos.problems.digestive.causes.1': 'Alimentación irregular o estrés durante las comidas',
    'casos.problems.digestive.causes.2': 'Estrés emocional que afecta la digestión',
    'casos.problems.digestive.causes.3':
      'Bloqueos viscerales que afectan la movilidad de los órganos',
    'casos.problems.digestive.treatment':
      'Con kinesiología nutricional para detectar intolerancias o déficits, técnicas de masaje visceral suave y recomendaciones alimentarias personalizadas.',
    'casos.problems.digestive.results':
      'Mejora la digestión, desaparece la hinchazón y aumenta la energía diaria. El cliente aprende a escuchar su cuerpo y a adaptar su alimentación.',
    'casos.problems.digestive.successStory':
      'Laura, 41 años, madre de familia: "años de problemas digestivos desaparecieron cuando descubrimos mis intolerancias. Mi energía ha cambiado completamente y ahora disfruto de la comida sin miedo."',

    'casos.problems.migraines.title': 'Migrañas y tensión craneal',
    'casos.problems.migraines.description':
      'Dolores recurrentes en la cabeza, fotofobia, ruidos que molestan o cansancio extremo. La mente no puede fluir cuando el cuerpo está tenso.',
    'casos.problems.migraines.symptoms.0': 'Dolor intenso de un lado de la cabeza o en la nuca',
    'casos.problems.migraines.symptoms.1': 'Presión ocular o sensación de casco',
    'casos.problems.migraines.symptoms.2': 'Mareos o náuseas',
    'casos.problems.migraines.symptoms.3': 'Sensibilidad a la luz y a los ruidos',
    'casos.problems.migraines.causes.0': 'Bloqueo cervical y tensión muscular',
    'casos.problems.migraines.causes.1': 'Tensión mandibular (bruxismo)',
    'casos.problems.migraines.causes.2': 'Falta de descanso o exceso de estimulación mental',
    'casos.problems.migraines.causes.3': 'Desequilibrios hormonales o alimentarios',
    'casos.problems.migraines.treatment':
      'Con Osteobalance craneal, descarga muscular y técnicas vagales para equilibrar el sistema nervioso. También revisamos la respiración y la postura.',
    'casos.problems.migraines.results':
      'Reducción de la frecuencia e intensidad de las migrañas. En muchos casos, desaparecen completamente después de regular el cuello y el cráneo.',
    'casos.problems.migraines.successStory':
      'Carla, 39 años, diseñadora: "tenía migrañas 3-4 veces por semana. Después del tratamiento craneal, hace 6 meses que no tengo ninguna. Ha sido un cambio de vida total."',

    'casos.problems.lowEnergy.title': 'Falta de energía o rendimiento bajo',
    'casos.problems.lowEnergy.description':
      'Cuando todo cuesta, cuando te levantas cansada o sientes que el cuerpo "no responde". No es pereza —es falta de regulación interna.',
    'casos.problems.lowEnergy.symptoms.0': 'Cansancio constante a pesar de dormir bien',
    'casos.problems.lowEnergy.symptoms.1': 'Baja concentración y memoria',
    'casos.problems.lowEnergy.symptoms.2': 'Irritabilidad o apatía',
    'casos.problems.lowEnergy.symptoms.3': 'Sensación de "funcionar con el piloto automático"',
    'casos.problems.lowEnergy.causes.0': 'Estrés prolongado y burnout',
    'casos.problems.lowEnergy.causes.1': 'Déficits nutricionales o desequilibrios metabólicos',
    'casos.problems.lowEnergy.causes.2': 'Problemas hormonales (tiroides, adrenales)',
    'casos.problems.lowEnergy.causes.3': 'Desgaste emocional y falta de propósito',
    'casos.problems.lowEnergy.treatment':
      'Con kinesiología para identificar desequilibrios químicos o emocionales, suplementación natural y técnicas de movimiento consciente.',
    'casos.problems.lowEnergy.results':
      'Mejora notable de la energía, claridad mental y estado de ánimo más estable.',
    'casos.problems.lowEnergy.successStory':
      'David, 45 años, ejecutivo: "vivía exhausto constantemente. Descubrimos un problema de tiroides y desequilibrios nutricionales. Ahora me siento con más energía que hace 10 años."',

    'casos.problems.hormonal.title': 'Problemas hormonales o ciclos irregulares',
    'casos.problems.hormonal.description':
      'El cuerpo femenino habla a través del ciclo. Cuando hay dolor, desajuste o agotamiento, quiere decir que algo no está en equilibrio.',
    'casos.problems.hormonal.symptoms.0': 'Dolor menstrual, cambios de humor o reglas irregulares',
    'casos.problems.hormonal.symptoms.1': 'Fatiga premenstrual o insomnio',
    'casos.problems.hormonal.symptoms.2': 'Dificultad para quedar embarazada',
    'casos.problems.hormonal.symptoms.3': 'Síntomas de menopausia o premenopausia',
    'casos.problems.hormonal.causes.0': 'Estrés crónico que afecta el eje hormonal',
    'casos.problems.hormonal.causes.1': 'Dieta inadecuada o desequilibrios nutricionales',
    'casos.problems.hormonal.causes.2': 'Bloqueo a nivel de hipotálamo o glándulas endocrinas',
    'casos.problems.hormonal.causes.3': 'Factores ambientales y disruptores endocrinos',
    'casos.problems.hormonal.treatment':
      'Con kinesiología hormonal, Osteobalance pélvico y apoyo nutricional personalizado. También trabajamos la relación con el propio cuerpo y la feminidad.',
    'casos.problems.hormonal.results':
      'Mejora el ciclo, desaparece el dolor y se restablece un ritmo natural y saludable.',
    'casos.problems.hormonal.successStory':
      'Sofia, 32 años, profesora: "mis ciclos eran un caos y el dolor menstrual me paralizaba. Después del tratamiento hormonal, mi ciclo es regular y sin dolor. Me siento reconectada con mi cuerpo."',

    'casos.problems.sleep.title': 'Dificultades para dormir',
    'casos.problems.sleep.description':
      'La mente no para, el cuerpo tampoco. El descanso es esencial para regenerarte y mantener la salud física y mental.',
    'casos.problems.sleep.symptoms.0': 'Dificultad para dormirse o despertares nocturnos',
    'casos.problems.sleep.symptoms.1': 'Fatiga matinal, tensión o sueños intensos',
    'casos.problems.sleep.symptoms.2': 'Pensamientos recurrentes antes de dormir',
    'casos.problems.sleep.symptoms.3': 'Sueño ligero o poco reparador',
    'casos.problems.sleep.causes.0': 'Exceso de estrés e hiperactivación mental',
    'casos.problems.sleep.causes.1': 'Desajuste del sistema nervioso y ritmos circadianos',
    'casos.problems.sleep.causes.2': 'Falta de rutina o higiene del sueño',
    'casos.problems.sleep.causes.3': 'Problemas digestivos o hormonales',
    'casos.problems.sleep.treatment':
      'Con Feldenkrais, respiración guiada, técnicas vagales y kinesiología para equilibrar el sistema hormonal.',
    'casos.problems.sleep.results':
      'Mejora del sueño profundo y descanso reparador después de pocas sesiones.',
    'casos.problems.sleep.successStory':
      'Elena, 38 años, abogada: "hace años que no dormía de un tirón. Las técnicas de respiración y relajación han cambiado completamente la calidad de mi sueño. Ahora descanso de verdad."',

    'casos.problems.recovery.title': 'Recuperación después de una lesión',
    'casos.problems.recovery.description':
      'Después de una caída, una operación o un accidente, el cuerpo puede quedar con rigidez o miedo al movimiento.',
    'casos.problems.recovery.symptoms.0': 'Dolor residual o limitación articular',
    'casos.problems.recovery.symptoms.1': 'Sensación de debilidad o desequilibrio',
    'casos.problems.recovery.symptoms.2': 'Bloqueos emocionales asociados a la lesión',
    'casos.problems.recovery.symptoms.3': 'Miedo al movimiento o reactividad',
    'casos.problems.recovery.causes.0': 'Cicatrices internas y adherencias',
    'casos.problems.recovery.causes.1': 'Compensaciones musculares y posturales',
    'casos.problems.recovery.causes.2': 'Trauma físico con componente emocional',
    'casos.problems.recovery.causes.3': 'Memoria corporal de la experiencia traumática',
    'casos.problems.recovery.treatment':
      'Con Osteobalance, reeducación postural y trabajo del sistema fascial. Acompañamos también la confianza corporal y la memoria del cuerpo.',
    'casos.problems.recovery.results':
      'Recuperación de la movilidad, alivio del dolor y sensación de seguridad en el movimiento.',
    'casos.problems.recovery.successStory':
      'Jordi, 42 años, deportista: "después de una lesión de rodilla, tenía miedo de moverme. El trabajo integral me ayudó no solo físicamente, sino también a recuperar la confianza en mi cuerpo."',

    // Massatge Page
    'massage.page.title': 'Masaje terapéutico',
    'massage.page.subtitle': 'Libera tensiones y descansa de verdad.',
    'massage.page.description':
      'Masaje descontracturante y relajante adaptado a ti para reducir dolor, estrés y rigidez. Beneficios clave: alivio muscular, mejora de la circulación, calma mental, postura más libre.',
    'massage.page.availableToday': 'Disponible hoy',
    'massage.page.bookSession': 'Reserva tu sesión',
    'massage.page.fillForm':
      'Rellena el formulario y te enviaremos un mensaje preparado por WhatsApp',
    'massage.page.benefitsTitle': 'Beneficios del masaje terapéutico',
    'massage.page.benefitsSubtitle': 'Descubre cómo el masaje puede mejorar tu calidad de vida',
    'massage.page.durationsTitle': 'Duraciones disponibles',
    'massage.page.durationsSubtitle': 'Elige la duración que mejor se adapte a tus necesidades',
    'massage.page.duration60': 'Perfecto para empezar',
    'massage.page.duration90': 'Tratamiento completo',
    'massage.page.duration120': 'Experiencia premium',
    'massage.page.testimonialsTitle': 'Qué dicen nuestros clientes',

    // Kinesiologia Page
    'kinesiology.page.title': 'Kinesiología holística',
    'kinesiology.page.subtitle': 'Escucha al cuerpo, encuentra la raíz.',
    'kinesiology.page.description':
      'Test neuromuscular y correcciones suaves para reequilibrar cuerpo, emociones y hábitos. Beneficios clave: menos estrés, mejor coordinación y energía estable.',
    'kinesiology.page.energyBalance': 'Equilibrio energético',
    'kinesiology.page.benefitsTitle': 'Beneficios de la kinesiología',
    'kinesiology.page.benefitsSubtitle':
      'Descubre cómo la kinesiología puede transformar tu bienestar',
    'kinesiology.page.durationsSubtitle': 'Sesiones adaptadas a tus necesidades',
    'kinesiology.page.duration60': 'Sesión de introducción y equilibrio básico',
    'kinesiology.page.duration90': 'Tratamiento completo y profundo',

    // Nutricio Page
    'nutrition.page.badge': 'Alimentación consciente',
    'nutrition.page.title': 'Nutrición consciente',
    'nutrition.page.subtitle': 'Comer con sentido para tener energía real.',
    'nutrition.page.description':
      'Asesoramiento personalizado para hábitos claros, digestión y energía. Beneficios clave: hábitos sostenibles, vitalidad y apoyo a la composición corporal.',
    'nutrition.page.personalized': 'Nutrición personalizada',
    'nutrition.page.benefitsTitle': 'Beneficios del asesoramiento nutricional',
    'nutrition.page.benefitsSubtitle':
      'Descubre cómo una buena alimentación puede transformar tu vida',
    'nutrition.page.sessionTypes': 'Tipos de sesiones',
    'nutrition.page.sessionSubtitle':
      'Acompañamiento personalizado para tus objetivos nutricionales',

    // Agenyz Page
    'agenyz.page.title': 'Agenyz nutrición celular',
    'agenyz.page.subtitle': 'Suplementos avanzados para la regeneración celular.',
    'agenyz.page.description':
      'Biohacking y nutrición que trabajan a nivel celular. Restaura la energía, la inmunidad y la juventud desde adentro.',
    'agenyz.benefits.cell': 'Claridad cognitiva',
    'agenyz.benefits.energy': 'Energía infinita',
    'agenyz.benefits.immunity': 'Defensa inmunológica',
    'agenyz.benefits.antiaging': 'Efecto antienvejecimiento',
    'agenyz.why.title': '¿por qué Agenyz?',
    'agenyz.why.subtitle': 'Beneficios respaldados por la ciencia para tu cuerpo y mente.',
    'agenyz.benefits.energy.desc':
      'Restaura la función mitocondrial para una energía diaria sostenida.',
    'agenyz.benefits.immunity.desc': 'Fortalece los sistemas de defensa naturales del cuerpo.',
    'agenyz.benefits.cell.desc': 'Mejora el enfoque, la memoria y el rendimiento mental.',
    'agenyz.benefits.antiaging.desc':
      'Combate el estrés oxidativo y ralentiza los procesos de envejecimiento.',
    'agenyz.cta.title': '¿listo para mejorar tu salud?',
    'agenyz.cta.consult': 'Consultar con Elena',
    'agenyz.cta.visitStore': 'Visitar tienda Agenyz',
    'agenyz.hero.biohacking': 'Biohacking y nutrición',
    'agenyz.hero.available': 'Disponible para pedir',

    // Testimonials
    'massage.testimonial.1.text':
      'Llego tenso y con nudos. Salgo totalmente relajado. Así de simple. Dura días.',
    'massage.testimonial.2.text':
      'El mejor masaje que he recibido. Realmente sabe lo que hace. El espacio también es genial.',
    'kinesiology.testimonial.1.text':
      'La kinesiología me ha ayudado a entender mejor mi cuerpo y mis emociones. Ahora tengo más energía y claridad mental.',
    'kinesiology.testimonial.2.text':
      'Después de las sesiones de kinesiología he notado una mejora increíble en mi postura y coordinación. Lo recomiendo totalmente.',
    'nutrition.testimonial.1.text':
      'El asesoramiento nutricional ha cambiado completamente mi relación con la comida. Ahora tengo más energía y me siento mucho mejor.',
    'nutrition.testimonial.2.text':
      'Los consejos personalizados me han ayudado a crear hábitos saludables que puedo mantener fácilmente. Resultado: más vitalidad cada día.',

    // 360 Revision
    'hero.title': 'Revisión corporal 360°',
    'hero.subtitle': 'Escucha tu cuerpo. Entiende tu historia. Recupera tu vida.',
    'hero.description':
      'Un viaje de 90 minutos para mapear tu paisaje físico, emocional y energético. No es solo un diagnóstico — es el primer paso para volver a casa, a tu cuerpo.',
    'hero.cta': 'Comienza tu viaje',
    'hero.scroll': 'Descubre el enfoque 360°',
    'why.title': '¿por qué 360°?',
    'why.subtitle': 'Porque no eres solo una colección de partes. Eres un sistema completo.',
    'why.physical.title': 'El cuerpo físico',
    'why.physical.desc':
      'Donde vive la tensión. Leemos la estructura, la fascia y la postura para encontrar dónde estás aguantando.',
    'why.emotional.title': 'El cuerpo emocional',
    'why.emotional.desc':
      'Donde se almacena la historia. Las emociones no procesadas se convierten en bloqueos físicos.',
    'why.energetic.title': 'El cuerpo energético',
    'why.energetic.desc':
      'Donde fluye la vitalidad. Restauramos el flujo para que la sanación pueda ocurrir naturalmente.',
    'service.title': 'La experiencia',
    'service.step1.title': '1. La entrevista profunda',
    'service.step1.desc':
      'Más allá del historial médico. Hablamos de tu vida, tu estrés, tus sueños y lo que tu cuerpo ha estado tratando de decirte.',
    'service.step2.title': '2. El mapeo corporal',
    'service.step2.desc':
      'Una lectura práctica de tu estructura. Identificamos desequilibrios, restricciones fasciales y áreas de energía estancada.',
    'service.step3.title': '3. La sesión de integración',
    'service.step3.desc':
      'Utilizando una mezcla de modalidades (masaje, kinesiología, trabajo energético) para comenzar el proceso de desbloqueo y realineación.',
    'service.step4.title': '4. El mapa de ruta',
    'service.step4.desc':
      'No te vas con las manos vacías. Recibes un plan personalizado con ejercicios, consejos de estilo de vida y recomendaciones de tratamiento.',
    'variants.title': 'Elige tu camino',
    'variants.mapping.title': 'Mapeo 360°',
    'variants.mapping.price': '90€',
    'variants.mapping.duration': '90 min',
    'variants.mapping.desc': 'La sesión fundamental. Diagnóstico completo + primer tratamiento.',
    'variants.alignment.title': 'Alineación 360°',
    'variants.alignment.price': '250€',
    'variants.alignment.duration': 'Pack de 3 sesiones',
    'variants.alignment.desc':
      'Para un trabajo más profundo. Incluye mapeo + 2 sesiones de seguimiento focalizadas.',
    'variants.integral.title': 'Transformación integral',
    'variants.integral.price': '450€',
    'variants.integral.duration': 'Programa de 6 semanas',
    'variants.integral.desc': 'Cambio de vida completo. Mapeo + 5 sesiones + apoyo continuo.',
    'variants.book': 'Reservar ahora',
    'prompt.title': 'Mi enfoque',
    'prompt.diagnosis': 'Diagnóstico suave y preciso',
    'prompt.diagnosisDesc': 'Escuchando el cuerpo con las manos y preguntas cortas',
    'prompt.integrativeTechniques': 'Técnicas integrativas',
    'prompt.techniquesDesc':
      'Masaje terapéutico, kinesiología, Osteobalance, movimiento consciente (Feldenkrais), respiración y regulación del sistema nervioso',
    'prompt.layeredProcesses': 'Procesos en capas',
    'prompt.layeredDesc':
      'Liberar tensión, reordenar patrones y consolidar nuevos hábitos corporales y emocionales',
    'prompt.session': 'Sesión',
    'prompt.firstVisit':
      'Primera visita con diagnóstico y trabajo suave. A partir de aquí, trazo el',
    'prompt.personalPlan': 'Plan personal',
    'prompt.sessionsRange': '(normalmente 3–6 sesiones) para ir capa por capa',
    'prompt.forWho': 'Para quién es',
    'prompt.forWhoDesc':
      'Para personas que quieren cambios reales y consistentes, no soluciones rápidas. Si estás preparada para escucharte y comprometerte con tu bienestar, este trabajo es para ti.',
    'prompt.booking': 'Reserva',
    'prompt.consultation': 'Consulta',
    'prompt.promptLabel': 'Prompt',
    'prompt.signature': '— Elena Kucherova',
    'common.ekaBalance': 'EKA Balance',
    'common.copyright': '© 2024',
    'benefits.benefit1.title': 'Claridad mental',
    'benefits.benefit1.description': 'Enfoque mejorado y función cognitiva',
    'benefits.benefit1.science':
      'El trabajo corporal integrativo estimula el nervio vago, mejorando la comunicación cerebro-cuerpo y la función ejecutiva.',
    'benefits.benefit2.title': 'Equilibrio emocional',
    'benefits.benefit2.description': 'Mayor resistencia emocional y regulación',
    'benefits.benefit2.science':
      'Las técnicas somáticas ayudan a procesar el trauma almacenado y regular los patrones de respuesta al estrés del sistema nervioso.',
    'benefits.benefit3.title': 'Energía sostenida',
    'benefits.benefit3.description': 'Vitalidad natural sin estimulación artificial',
    'benefits.benefit3.science':
      'Abordar las restricciones fasciales y los desequilibrios posturales reduce el desperdicio de energía metabólica, aumentando la vitalidad natural.',
    'benefits.benefit4.title': 'Alivio del dolor',
    'benefits.benefit4.description': 'Alivio duradero de patrones de dolor crónico',
    'benefits.benefit4.science':
      'El enfoque 360° aborda las causas raíz en lugar de los síntomas, creando cambios neuroplásticos duraderos en la percepción del dolor.',
    'benefits.benefit5.title': 'Mejor sueño',
    'benefits.benefit5.description': 'Ciclos de sueño más profundos y reparadores',
    'benefits.benefit5.science':
      'La regulación del sistema nervioso y la liberación de tensiones promueven ritmos circadianos saludables y arquitectura del sueño.',
    'benefits.benefit6.title': 'Resistencia al estrés',
    'benefits.benefit6.description': 'Mayor capacidad para manejar los desafíos de la vida',
    'benefits.benefit6.science':
      'Construir el tono parasimpático a través del trabajo corporal aumenta la resistencia al estrés y la capacidad de recuperación.',
    'benefits.benefit7.title': 'Libertad de movimiento',
    'benefits.benefit7.description': 'Movilidad mejorada y conciencia corporal',
    'benefits.benefit7.science':
      'La liberación fascial y la reeducación del movimiento restauran los patrones naturales de movimiento y la conciencia propioceptiva.',
    'benefits.benefit8.title': 'Brújula interior',
    'benefits.benefit8.description': 'Conexión más fuerte con la intuición y sabiduría interior',
    'benefits.benefit8.science':
      'La conciencia interoceptiva desarrollada a través del trabajo corporal mejora las sensaciones viscerales y la claridad en la toma de decisiones.',
    'benefits.benefit9.title': 'Vitalidad',
    'benefits.benefit9.description': 'Renovado sentido de vida y presencia',
    'benefits.benefit9.science':
      'Eliminar bloqueos energéticos y restaurar el flujo crea mejoras medibles en la fuerza vital y presencia.',
    'benefits.science': 'La ciencia',
    'benefits.philosophy':
      'Medimos el éxito no solo en la ausencia de síntomas, sino en la presencia de vitalidad, alegría, y el conocimiento profundo de que tu cuerpo es tu aliado en la vida.',
    'service.step1.details.1': 'Evaluación integral de salud y estilo de vida',
    'service.step1.details.2': 'Análisis de patrones de movimiento',
    'service.step1.details.3': 'Mapeo emocional y análisis de patrones de estrés',
    'service.step1.details.4': 'Establecimiento de objetivos y alineación de intenciones',
    'service.step2.details.1': 'Análisis postural y estructural',
    'service.step2.details.2': 'Evaluación de tensión fascial y movilidad',
    'service.step2.details.3': 'Evaluación del flujo energético',
    'service.step2.details.4': 'Evaluación del estado del sistema nervioso',
    'service.step3.details.1': 'Terapia manual y trabajo corporal',
    'service.step3.details.2': 'Regulación de la respiración y sistema nervioso',
    'service.step3.details.3': 'Reeducación del movimiento',
    'service.step3.details.4': 'Técnicas de equilibrio energético',
    'service.step4.details.1': 'Secuencias de movimiento personalizadas',
    'service.step4.details.2': 'Prácticas de autocuidado y herramientas',
    'service.step4.details.3': 'Sugerencias de modificación del estilo de vida',
    'service.step4.details.4': 'Planificación de sesiones de seguimiento',
    'testimonials.maria.name': 'María',
    'testimonials.maria.issue': 'Dolor crónico de cuello y estrés',
    'testimonials.maria.quote':
      'Después de 15 años de dolor, finalmente me siento como yo misma otra vez. El enfoque 360° no solo arregló mi cuello — me devolvió mi confianza.',
    'testimonials.maria.result':
      'Dolor reducido de 8/10 a 1/10, niveles de estrés dramáticamente mejorados',
    'testimonials.maria.timeframe': '3 meses',
    'testimonials.maria.before':
      'Tensión constante, mala postura, ansiedad afectando la vida diaria',
    'testimonials.maria.after': 'Movimiento sin dolor, postura confiada, sistema nervioso en paz',
    'testimonials.david.name': 'David',
    'testimonials.david.issue': 'Rendimiento atlético y recuperación',
    'testimonials.david.quote':
      'Pensaba que conocía mi cuerpo como atleta. El mapeo 360° reveló patrones que nunca supe que existían. Mi rendimiento y recuperación han alcanzado nuevos niveles.',
    'testimonials.david.result':
      '25% de mejora en tiempo de recuperación, eliminó lesiones recurrentes',
    'testimonials.david.timeframe': '6 semanas',
    'testimonials.david.before':
      'Lesiones frecuentes, recuperación lenta, estancamientos en rendimiento',
    'testimonials.david.after':
      'Entrenamiento libre de lesiones, recuperación más rápida, nuevos récords personales',
    'testimonials.jennifer.name': 'Jennifer',
    'testimonials.jennifer.issue': 'Recuperación post-quirúrgica y movilidad',
    'testimonials.jennifer.quote':
      'Después de mi cirugía, me sentía desconectada de mi cuerpo. La sanación aquí fue más allá de lo físico — aprendí a confiar en mi cuerpo otra vez.',
    'testimonials.jennifer.result':
      'Movilidad completa restaurada, confianza en el movimiento retornada',
    'testimonials.jennifer.timeframe': '4 meses',
    'testimonials.jennifer.before': 'Movilidad limitada, miedo al movimiento, depresión',
    'testimonials.jennifer.after':
      'Rango completo de movimiento, alegría en el movimiento, sanación emocional',
    'testimonials.alex.name': 'Alex',
    'testimonials.alex.issue': 'Ansiedad y desregulación del sistema nervioso',
    'testimonials.alex.quote':
      'Vine por ansiedad, sin esperar que el trabajo corporal ayudara. Pero cuando explicaron cómo mi sistema nervioso estaba atascado, todo tuvo sentido. Me siento calmado en mi cuerpo por primera vez en años.',
    'testimonials.alex.result':
      'Ansiedad reducida en 80%, calidad del sueño dramáticamente mejorada',
    'testimonials.alex.timeframe': '8 semanas',
    'testimonials.alex.before': 'Ansiedad crónica, insomnio, sentirse inseguro en el cuerpo',
    'testimonials.alex.after': 'Sistema nervioso calmado, sueño reparador, confianza encarnada',
    'testimonials.resultsAchieved': 'Resultados logrados:',
    'testimonials.timeframe': 'Tiempo:',
    'testimonials.watchVideo': 'Ver historia en vídeo',
    'testimonials.showBeforeAfter': 'Mostrar antes y después',
    'testimonials.hideBeforeAfter': 'Ocultar',
    'testimonials.before': 'Antes:',
    'testimonials.after': 'Después:',
    'testimonials.videoStory': 'Historia de',
    'testimonials.keyInsights': 'Perspectivas clave de',
    'testimonials.keyInsight1': 'Cómo el enfoque 360° abordó las causas raíz, no solo los síntomas',
    'testimonials.keyInsight2': 'El avance emocional que aceleró la sanación física',
    'testimonials.keyInsight3':
      'Herramientas prácticas que continúan apoyando el bienestar continuo',
    'testimonials.keyInsight4': 'Por qué este enfoque tuvo éxito donde otros habían fallado',
    'testimonials.videoPlaceholder': 'El testimonio en vídeo se reproduciría aquí',
    'testimonials.videoImplementation':
      'En una implementación real, esto sería contenido de video incorporado',
    'story.title': 'Un viaje de sanación',
    'story.intro': 'Sarah llegó a nosotros cargando el peso de diez años...',
    'story.paragraph1':
      'Los hombros de sarah hablaron antes que ella. Curvados hacia adentro como un caparazón protector, guardaban la historia de incontables noches sin dormir, de correos respondidos a medianoche, de una promoción que vino con un precio que su cuerpo aún estaba pagando.',
    'story.paragraph2':
      '"solo quiero que mi cuello deje de doler," dijo durante nuestra primera sesión. Pero su cuerpo susurraba verdades más profundas — sobre el miedo alojado en su pecho, la ansiedad que había tomado residencia en su mandíbula, el agotamiento que vivía en sus propios huesos.',
    'story.paragraph3':
      'El enfoque 360° no solo abordó su cuello. Trabajamos con los patrones emocionales que crearon la tensión, los desequilibrios estructurales que la mantenían, y los bloqueos energéticos que impedían la sanación. Escuchamos lo que su cuerpo necesitaba para sentirse seguro otra vez.',
    'story.paragraph4':
      'Tres meses después, sarah se llevaba a sí misma de manera diferente. No solo más derecha — se llevaba como alguien que recordó que tenía permiso para ocupar espacio. Su dolor de cuello se había convertido en una puerta para reclamar partes de sí misma que había olvidado que existían.',
    'story.paragraph5': '"no solo recuperé mi cuerpo," nos dijo. "recuperé mi vida."',
    'story.philosophy':
      'Cada cuerpo tiene una historia. Cada historia merece ser escuchada en su plenitud — no solo los síntomas, sino toda la experiencia humana que hay debajo de ellos.',
    'services.completeReview': 'Revisión corporal 360° completa',
    'services.reset360': 'Reinicio 360°',
    'services.mapping360': 'Mapeo corporal 360°',
    'services.alignment360': 'Alineación 360°',
    'services.followUpConsultations': 'Consultas de seguimiento',
    'cta.scheduleDiscoveryCall': 'Programar una llamada de descubrimiento',
    'cta.downloadGuide': 'Descargar nuestra guía',
    'labels.noInsuranceNeeded': 'No necesita seguro',
    'labels.flexibleSchedules': 'Horarios flexibles',
    'labels.personalizedApproach': 'Enfoque personalizado',
    'labels.presentialConsultations': 'Consultas presenciales',
    'labels.onlineSessionsAvailable': 'Y sesiones online disponibles',
    'alt.ekaLogo': 'Logo EKA Balance',
    'footer.brand': 'Sanación integral 360°',
    'footer.description':
      'Transformando vidas a través de la sanación integral del cuerpo, mente y espíritu. Tu viaje hacia el bienestar completo comienza aquí.',
    'footer.healingWithIntention': 'Sanando con intención',
    'footer.contact': 'Contacto',
    'footer.services': 'Servicios',
    'footer.copyright': '© 2024 EKA Balance. Todos los derechos reservados.',
    'footer.madeWith': 'Hecho con',
    'footer.forHealing': 'Para la sanación',

    // Missing Keys
    'casos.other.title': 'Otras áreas que tratamos',
    'casos.other.money': 'Dinero y finanzas',
    'casos.other.relationships': 'Relaciones y pareja',
    'casos.other.selfworth': 'Autoestima y realización',
    'casos.other.family': 'Conflictos familiares',
    'casos.other.work': 'Orientación profesional',
    'casos.other.trauma': 'Traumas emocionales',
    'kinesiology.page.imageAlt': 'Sesión de kinesiología',
  },

  ru: {
    'booking.smart.title': 'Как вы хотите забронировать?',
    'booking.smart.subtitle': 'Выберите удобный для вас вариант',
    'booking.smart.quick': 'Написать в WhatsApp',
    'booking.smart.quickDesc': 'Открыть чат и написать напрямую',
    'booking.smart.form': 'Заполнить форму',
    'booking.smart.formDesc': 'Укажите детали, чтобы ускорить процесс',
    'booking.service.consultation': 'Бесплатная консультация 15 мин',
    'booking.smart.name': 'Ваше имя',
    'booking.smart.service': 'Желаемая услуга',
    'booking.smart.time': 'Предпочтительное время',
    'booking.smart.send': 'Отправить в WhatsApp',
    'booking.smart.back': 'Назад',

    // Service-specific translations
    'service.duration': 'Продолжительность',
    'service.price': 'Цена',
    'service.benefits': 'Преимущества',
    'service.ideal.for': 'Идеально для',
    'service.what.to.expect': 'Чего ожидать',
    'service.preparation': 'Подготовка',
    'service.aftercare': 'Последующий уход',
    'service.contraindications': 'Противопоказания',
    'service.booking.note': 'Примечание к бронированию',
    'service.sessions.recommended': 'Рекомендуемые сессии',
    'service.frequency': 'Частота',

    // Services page
    'services.integralWellbeingFor': 'Терапии для комплексного благополучия',
    'services.ourServices': 'Наши профессиональные',
    'services.ourServices2': 'Услуги',
    'services.wellnessPath':
      'Откройте путь к физическому и эмоциональному благополучию с нашими профессиональными услугами',
    'services.mainBenefits': 'Основные преимущества',
    'services.quickBooking': 'Быстрое бронирование',
    'services.quickBookingSubtitle':
      'Свяжитесь с нами через WhatsApp или telegram для бронирования',
    'services.readyToStart': 'Готовы начать?',
    'services.contactUsToBook': 'Свяжитесь с нами, чтобы забронировать сессию',

    // Service benefits
    'services.benefits.reduces': 'Уменьшает боль',
    'services.benefits.stress': 'Снимает стресс',
    'services.benefits.circulation': 'Улучшает кровообращение',
    'services.benefits.relaxation': 'Глубокая релаксация',
    'services.benefits.blockages': 'Снимает блокировки',
    'services.benefits.posture': 'Улучшает осанку',
    'services.benefits.energy': 'Увеличивает энергию',
    'services.benefits.habits': 'Здоровые привычки',
    'services.benefits.vitality': 'Больше жизненной силы',
    'services.benefits.weight': 'Контроль веса',
    'services.benefits.longterm': 'Долгосрочные преимущества',
    'services.benefits.assessment': 'Полная оценка',
    'services.benefits.plan': 'Персонализированный план',
    'services.benefits.recommendations': 'Четкие рекомендации',
    'services.benefits.followup': 'Постоянное наблюдение',

    // Pricing specific
    'pricing.from': 'От',
    'pricing.session': 'Сессия',
    'pricing.package': 'Пакет',
    'pricing.discount': 'Скидка',
    'pricing.save': 'Сэкономить',
    'pricing.popular': 'Популярный',
    'pricing.best.value': 'Лучшая цена',
    'pricing.limited.time': 'Ограниченное время',

    // About Elena page
    'elena.title': 'Елена Кучерова - интегративный терапевт | EKA Balance',
    'elena.subtitle': 'Специалист по кинезиологии и соматическому исцелению',
    'elena.quote': 'Помогаю людям восстановить связь с их телом, разумом и жизненным потенциалом.',
    'elena.experience': 'Более 10 лет опыта • обучение в 9 странах',
    'elena.about.title': 'О Елене',
    'elena.about.p1':
      'Елена Кучерова - интегративный терапевт с более чем 10-летним опытом глубокой работы с телом, разумом и эмоциональным состоянием людей. Она училась в 9 разных странах и решила более 500 случаев, трансформируя физические и эмоциональные страдания в сознание, свободу и жизненную силу.',
    'elena.about.p2':
      'Ее работа заключается не только в облегчении симптомов, но и в обнаружении и работе с глубокими причинами, которые мешают жить полноценной жизнью. Ее взгляд целостен: она видит человека как живое единство, где тело, разум, эмоции и жизненный опыт глубоко взаимосвязаны.',
    'elena.about.p3':
      'Через мягкий, но глубокий подход она сопровождает процессы изменений, которые активируют естественный потенциал саморегуляции и исцеления, который есть в каждом из нас.',
    'elena.education.title': 'Обучение и образование',
    'elena.education.subtitle':
      'Елена посвятила десятилетия обучению различным терапевтическим дисциплинам, создав уникальный интегративный подход',
    'elena.education.kinesiology': 'Кинезиология и прикладная нейрофизиология',
    'elena.education.feldenkrais': 'Метод фельденкрайза',
    'elena.education.psychosomatic': 'Психосоматика',
    'elena.education.massage': 'Терапевтический и структурный массаж',
    'elena.education.vibrational': 'Вибрационная медицина',
    'elena.education.transformation': 'Техники трансформации и личностного развития',
    'elena.specializations.title': 'Области специализации',
    'elena.specialization.pain': 'Хронические боли и постуральный дисбаланс',
    'elena.specialization.stress': 'Стресс, тревога и психосоматические расстройства',
    'elena.specialization.nervous': 'Регуляция нервной системы и улучшение сна',
    'elena.specialization.emotional': 'Эмоциональный баланс и травмы',
    'elena.specialization.personal': 'Личностное развитие и внутренняя трансформация',
    'elena.specialization.support': 'Поддержка в отношениях, связях и сложных жизненных процессах',
    'elena.specialization.constellations': 'Полевые расстановки и системная работа',
    'elena.philosophy.title': 'Философия и подход',
    'elena.philosophy.p1':
      'Елена работает исходя из принципа, что тело - это гораздо больше, чем физический инструмент: это живая память всего, что мы пережили. каждое напряжение, каждая боль, каждая блокировка содержит ценную информацию о нас.',
    'elena.philosophy.p2':
      'Когда мы учимся слушать эту информацию и сознательно работать с ней, открывается возможность трансформировать не только тело, но и весь наш жизненный опыт.',
    'elena.philosophy.p3':
      'Ее подход сочетает науку и интуицию, телесные техники и работу с сознанием в глубоко персонализированном процессе, адаптированном к каждому человеку.',
    'elena.work.title': 'Варианты связи',
    'elena.work.subtitle':
      'Если вы хотите начать глубокий процесс изменений или просто исследовать новые способы заботы о себе',
    'elena.work.book': 'Забронировать сессию',
    'elena.work.bookDesc': 'Начните свой путь к благополучию',
    'elena.work.explore': 'Изучить услуги',
    'elena.work.exploreDesc': 'Откройте все доступные терапии',
    'elena.work.contact': 'Связаться с Еленой',
    'elena.work.contactDesc': 'Задайте свои вопросы напрямую',
    'elena.connect.title': 'Свяжитесь с Еленой',
    'elena.connect.email': 'Email',
    'elena.connect.whatsapp': 'WhatsApp',

    // Revisio360 page
    'revisio360.title': 'Обзор 360° - комплексная оценка | EKA Balance',
    'revisio360.badge': 'Полная картина вашего благополучия',
    'revisio360.hero.title': 'Обзор 360°',
    'revisio360.hero.subtitle': 'Полная картина тела, движения и привычек.',
    'revisio360.hero.description':
      'Комплексная оценка с четким планом действий и следующими шагами.',
    'revisio360.includes.title': 'Что включает обзор 360°?',
    'revisio360.includes.subtitle':
      'Комплексная оценка для понимания вашего текущего состояния и разработки плана благополучия',
    'revisio360.includes.postural': 'Анализ осанки',
    'revisio360.includes.posturalDesc': 'Мы оцениваем вашу осанку и паттерны движения',
    'revisio360.includes.energetic': 'Энергетическая оценка',
    'revisio360.includes.energeticDesc': 'Мы выявляем дисбалансы и эмоциональные напряжения',
    'revisio360.includes.report': 'Персонализированный отчет',
    'revisio360.includes.reportDesc': 'Вы получите подробный план с конкретными рекомендациями',
    'revisio360.booking.title': 'Забронируйте свой обзор 360°',
    'revisio360.booking.subtitle':
      'Заполните форму и мы отправим вам подготовленное сообщение в WhatsApp',
    'revisio360.benefits.title': 'Преимущества обзора 360°',
    'revisio360.benefits.subtitle':
      'Откройте все, чего вы можете достичь с помощью комплексной оценки',
    'revisio360.benefit1': 'Полная оценка вашего физического и эмоционального состояния',
    'revisio360.benefit2': 'Персонализированный план с практическими рекомендациями',
    'revisio360.benefit3': 'Выявление паттернов и привычек для улучшения',
    'revisio360.benefit4': 'Последующее наблюдение и четкие цели на будущее',
    'revisio360.duration.title': 'Доступная продолжительность',
    'revisio360.duration.subtitle':
      'Выберите продолжительность, которая лучше всего соответствует глубине необходимой оценки',
    'revisio360.duration.minutes': 'Минут',
    'revisio360.duration.essential': 'Основная оценка',
    'revisio360.duration.complete': 'Полная оценка',
    'revisio360.duration.exhaustive': 'Исчерпывающая оценка',
    'revisio360.process.title': 'Как это работает?',
    'revisio360.process.subtitle':
      'Простой процесс для получения полной картины вашего благополучия',
    'revisio360.process.step1': 'Бронирование',
    'revisio360.process.step1Desc': 'Свяжитесь с нами, чтобы запланировать сессию',
    'revisio360.process.step2': 'Оценка',
    'revisio360.process.step2Desc': 'Мы проводим полный анализ вашего текущего состояния',
    'revisio360.process.step3': 'Отчет',
    'revisio360.process.step3Desc': 'Вы получите персонализированный план с рекомендациями',
    'revisio360.process.step4': 'Последующее наблюдение',
    'revisio360.process.step4Desc': 'Мы сопровождаем вас в реализации плана',
    'revisio360.testimonials.title': 'Что говорят наши клиенты',
    'revisio360.final.title': 'Откройте свой потенциал благополучия',
    'revisio360.final.subtitle':
      'Забронируйте свой обзор 360° и начните путь к более сбалансированной и здоровой жизни',

    // Personalized services
    'personalized.tailored': 'Индивидуальный',
    'personalized.custom': 'На заказ',
    'personalized.specific': 'Специфический',
    'personalized.targeted': 'Целевой',
    'personalized.specialized': 'Специализированный',

    // Casos section
    'casos.section.badge': 'Диагностика и решение',
    'casos.section.title': 'Клиническая идентификация',
    'casos.section.titleHighlight': 'Патологий',
    'casos.section.subtitle':
      'Точный анализ и системное лечение для полного восстановления здоровья.',
    'casos.section.readMore': 'Читать далее',
    'casos.section.viewAll': 'Посмотреть все случаи',
    'casos.section.findYourCase': 'Найти ваш случай',

    // Problems
    'casos.problems.backPain.title': 'Вертебральная и цервикальная дисфункция',
    'casos.problems.backPain.description':
      'Лечение дисковой компрессии, шейного выпрямления и хронических постуральных дисбалансов с помощью осевой декомпрессии и нейромышечного переобучения.',
    'casos.problems.backPain.symptoms.0':
      'Колющая боль или постоянное напряжение в поясничной или шейной области',
    'casos.problems.backPain.symptoms.1': 'Трудности с поворотом шеи или поднятием руки',
    'casos.problems.backPain.symptoms.2': 'Усталость после долгого сидения или стояния',
    'casos.problems.backPain.symptoms.3': 'Ощущение давления на плечи или голову',
    'casos.problems.backPain.causes.0': 'Длительные позы и плохая эргономика',
    'casos.problems.backPain.causes.1': 'Накопленный эмоциональный стресс',
    'casos.problems.backPain.causes.2': 'Недостаток движения и сидячий образ жизни',
    'casos.problems.backPain.causes.3': 'Заблокированное или поверхностное дыхание',
    'casos.problems.backPain.treatment':
      'С помощью терапевтического массажа, миофасциального релиза, кинезиологии для поиска глубокой причины (стресс, суставная или висцеральная блокировка) и техник постурального переобучения (фельденкрайз).',
    'casos.problems.backPain.results':
      'Многие люди замечают немедленное облегчение и большую подвижность после первого сеанса. со временем тело заново учится поддерживать себя с меньшими усилиями и большей плавностью.',
    'casos.problems.backPain.successStory':
      'Анна, 34 года, офисный работник: "после 3 лет постоянной боли в шее всего за 4 сеанса я восстановила подвижность. теперь я знаю, как заботиться о своей осанке, и боль полностью исчезла."',

    'casos.problems.stress.title': 'Дисрегуляция нервной системы',
    'casos.problems.stress.description':
      'Вмешательство при состояниях симпатической гиперактивации, соматизированной тревожности и диафрагмальных блоках для восстановления вагального гомеостаза.',
    'casos.problems.stress.symptoms.0': 'Постоянные мысли и ментальная петля',
    'casos.problems.stress.symptoms.1': 'Трудности с расслаблением или сном',
    'casos.problems.stress.symptoms.2': 'Боль в шее, напряжение челюсти, утренняя усталость',
    'casos.problems.stress.symptoms.3': 'Интенсивные эмоции без видимой причины',
    'casos.problems.stress.causes.0': 'Избыток ответственности и давления',
    'casos.problems.stress.causes.1': 'Хронический стресс и нехватка времени на себя',
    'casos.problems.stress.causes.2': 'Нерешенные травмы или трудный опыт',
    'casos.problems.stress.causes.3': 'Дисбаланс вегетативной нервной системы',
    'casos.problems.stress.treatment':
      'С помощью эмоциональной кинезиологии и техник вагусной системы для успокоения нервной системы. мы добавляем мягкую работу с телом (фельденкрайз, осознанное дыхание), чтобы научить тело "выходить из борьбы".',
    'casos.problems.stress.results':
      'Человек снова лучше спит, внутреннее напряжение уменьшается, и возвращается ощущение контроля и спокойствия.',
    'casos.problems.stress.successStory':
      'Марк, 28 лет, магистрант: "тревога парализовала меня. с помощью кинезиологии я обнаружил, что у меня были эмоциональные блокировки из прошлого опыта. теперь я чувствую себя намного спокойнее и увереннее."',

    'casos.problems.digestive.title': 'Висцеральная и пищеварительная дисфункция',
    'casos.problems.digestive.description':
      'Работа с висцеральной моторикой и осью кишечник-мозг для устранения воспалений, диспепсии и соматизированных эмоциональных блоков.',
    'casos.problems.digestive.symptoms.0': 'Вздутие живота, газы, рефлюкс или боль после еды',
    'casos.problems.digestive.symptoms.1': 'Усталость или сонливость после еды',
    'casos.problems.digestive.symptoms.2': 'Перепады настроения или раздражительность без причины',
    'casos.problems.digestive.symptoms.3': 'Пищевая непереносимость или чувствительность',
    'casos.problems.digestive.causes.0': 'Невыявленная пищевая непереносимость',
    'casos.problems.digestive.causes.1': 'Нерегулярное питание или стресс во время еды',
    'casos.problems.digestive.causes.2': 'Эмоциональный стресс, влияющий на пищеварение',
    'casos.problems.digestive.causes.3': 'Висцеральные блокировки, влияющие на подвижность органов',
    'casos.problems.digestive.treatment':
      'С помощью нутрициологической кинезиологии для выявления непереносимости или дефицита, мягких техник висцерального массажа и персонализированных рекомендаций по питанию.',
    'casos.problems.digestive.results':
      'Пищеварение улучшается, вздутие исчезает, и ежедневная энергия увеличивается. клиент учится слушать свое тело и адаптировать свое питание.',
    'casos.problems.digestive.successStory':
      'Лаура, 41 год, мать семейства: "годы проблем с пищеварением исчезли, когда мы обнаружили мою непереносимость. моя энергия полностью изменилась, и теперь я наслаждаюсь едой без страха."',

    'casos.problems.migraines.title': 'Цефалгии и краниальное напряжение',
    'casos.problems.migraines.description':
      'Декомпрессия основания черепа и черепных швов для облегчения тензионных мигреней, бруксизма и нейросенсорной усталости.',
    'casos.problems.migraines.symptoms.0': 'Интенсивная боль с одной стороны головы или в затылке',
    'casos.problems.migraines.symptoms.1': 'Давление в глазах или ощущение шлема',
    'casos.problems.migraines.symptoms.2': 'Головокружение или тошнота',
    'casos.problems.migraines.symptoms.3': 'Чувствительность к свету и звукам',

    'casos.problems.migraines.causes.0': 'Блокировка шеи и мышечное напряжение',
    'casos.problems.migraines.causes.1': 'Напряжение челюсти (бруксизм)',
    'casos.problems.migraines.causes.2': 'Недостаток отдыха или избыток умственной стимуляции',
    'casos.problems.migraines.causes.3': 'Гормональный или пищевой дисбаланс',
    'casos.problems.migraines.treatment':
      'С помощью краниального остеобаланса, мышечной разгрузки и вагусных техник для балансировки нервной системы. мы также проверяем дыхание и осанку.',
    'casos.problems.migraines.results':
      'Уменьшение частоты и интенсивности мигреней. во многих случаях они полностью исчезают после регулировки шеи и черепа.',
    'casos.problems.migraines.successStory':
      'Карла, 39 лет, дизайнер: "у меня были мигрени 3-4 раза в неделю. после краниального лечения у меня их не было уже 6 месяцев. это полностью изменило мою жизнь."',

    'casos.problems.lowEnergy.title': 'Нехватка сил и энергии',
    'casos.problems.lowEnergy.description':
      'Когда все дается с трудом, когда вы просыпаетесь уставшими или чувствуете, что тело "не отвечает". это не лень —это недостаток внутренней регуляции.',
    'casos.problems.lowEnergy.symptoms.0': 'Постоянная усталость, несмотря на хороший сон',
    'casos.problems.lowEnergy.symptoms.1': 'Низкая концентрация и память',
    'casos.problems.lowEnergy.symptoms.2': 'Раздражительность или апатия',
    'casos.problems.lowEnergy.symptoms.3': 'Ощущение "работы на автопилоте"',
    'casos.problems.lowEnergy.causes.0': 'Длительный стресс и выгорание',
    'casos.problems.lowEnergy.causes.1': 'Дефицит питательных веществ или метаболический дисбаланс',
    'casos.problems.lowEnergy.causes.2': 'Гормональные проблемы (щитовидная железа, надпочечники)',
    'casos.problems.lowEnergy.causes.3': 'Эмоциональное истощение и отсутствие цели',
    'casos.problems.lowEnergy.treatment':
      'С помощью кинезиологии для выявления химического или эмоционального дисбаланса, натуральных добавок и техник осознанного движения.',
    'casos.problems.lowEnergy.results':
      'Заметное улучшение энергии, ясности ума и более стабильного настроения.',
    'casos.problems.lowEnergy.successStory':
      'Давид, 45 лет, руководитель: "я жил в постоянном истощении. мы обнаружили проблему с щитовидной железой и дисбаланс питательных веществ. теперь я чувствую себя энергичнее, чем 10 лет назад."',

    'casos.problems.hormonal.title': 'Гормональные проблемы или нерегулярные циклы',
    'casos.problems.hormonal.description':
      'Женское тело говорит через цикл. когда есть боль, дисбаланс или истощение, это означает, что что-то не в равновесии.',
    'casos.problems.hormonal.symptoms.0':
      'Менструальная боль, перепады настроения или нерегулярные месячные',
    'casos.problems.hormonal.symptoms.1': 'Предменструальная усталость или бессонница',
    'casos.problems.hormonal.symptoms.2': 'Трудности с зачатием',
    'casos.problems.hormonal.symptoms.3': 'Симптомы менопаузы или перименопаузы',
    'casos.problems.hormonal.causes.0': 'Хронический стресс, влияющий на гормональную ось',
    'casos.problems.hormonal.causes.1': 'Неправильное питание или дисбаланс питательных веществ',
    'casos.problems.hormonal.causes.2': 'Блокировка на уровне гипоталамуса или эндокринных желез',
    'casos.problems.hormonal.causes.3': 'Факторы окружающей среды и эндокринные разрушители',
    'casos.problems.hormonal.treatment':
      'С помощью гормональной кинезиологии, тазового остеобаланса и персонализированной нутрициологической поддержки. мы также работаем над отношениями с собственным телом и женственностью.',
    'casos.problems.hormonal.results':
      'Цикл улучшается, боль исчезает, и восстанавливается естественный и здоровый ритм.',
    'casos.problems.hormonal.successStory':
      'София, 32 года, учительница: "мои циклы были хаосом, а менструальная боль парализовала меня. после гормонального лечения мой цикл стал регулярным и безболезненным. я чувствую воссоединение со своим телом."',

    // Service-specific translations
    'service.systemic.title': 'Системная терапия',

    // Onboarding Goals & Feelings
    'onboarding.goals.stress': 'Стресс и тревога',
    'onboarding.goals.pain': 'Боль или дискомфорт',
    'onboarding.goals.posture': 'Улучшить осанку',
    'onboarding.goals.sleep': 'Лучше спать',
    'onboarding.goals.energy': 'Больше энергии',
    'onboarding.goals.focus': 'Умственная концентрация',
    'onboarding.goals.bodyAwareness': 'Связь с телом',
    'onboarding.goals.feelGood': 'Чувствовать себя хорошо',
    'onboarding.goals.lightness': 'Легкость',
    'onboarding.goals.inspiration': 'Вдохновение',
    'onboarding.goals.vitality': 'Витальность',
    'onboarding.goals.money': 'Деньги и изобилие',
    'onboarding.goals.relationships': 'Отношения',
    'onboarding.goals.family': 'Семья и корни',
    'onboarding.goals.selfworth': 'Самооценка',

    'onboarding.results.howYouWillFeel': 'Как вы будете себя чувствовать:',
    'services.consultation.title': 'Бесплатная консультация 15 мин',
    'services.consultation.description': 'Не уверены? поговорим 15 минут без обязательств.',
    'services.consultation.feeling': 'Ясность вашего пути',

    'recommendations.massage.feeling': 'Расслабленное тело и спокойный ум',
    'recommendations.kinesiology.feeling': 'Ясность ума и обновленная энергия',
    'recommendations.kinesiology.emotional_feeling': 'Эмоциональное равновесие и внутренний покой',
    'recommendations.feldenkrais.feeling': 'Свободное движение без боли',
    'recommendations.systemic.feeling': 'Внутренний порядок и облегчение',
    'recommendations.supplements.feeling': 'Витальность и физическая поддержка',

    // New Casos Keys
    'casos.other.title': 'Другие области, с которыми мы работаем',
    'casos.other.money': 'Деньги и финансы',
    'casos.other.relationships': 'Отношения и пара',
    'casos.other.selfworth': 'Самооценка и реализация',
    'casos.other.family': 'Семейные конфликты',
    'casos.other.work': 'Профессиональная ориентация',
    'casos.other.trauma': 'Эмоциональные травмы',

    'casos.problems.sleep.title': 'Трудности со сном',
    'casos.problems.sleep.description':
      'Разум не останавливается, тело тоже. отдых необходим для восстановления и поддержания физического и ментального здоровья.',
    'casos.problems.sleep.symptoms.0': 'Трудности с засыпанием или ночные пробуждения',
    'casos.problems.sleep.symptoms.1': 'Утренняя усталость, напряжение или интенсивные сны',
    'casos.problems.sleep.symptoms.2': 'Повторяющиеся мысли перед сном',
    'casos.problems.sleep.symptoms.3': 'Легкий или неосвежающий сон',
    'casos.problems.sleep.causes.0': 'Избыток стресса и умственная гиперактивация',
    'casos.problems.sleep.causes.1': 'Дисбаланс нервной системы и циркадных ритмов',
    'casos.problems.sleep.causes.2': 'Отсутствие режима или гигиены сна',
    'casos.problems.sleep.causes.3': 'Проблемы с пищеварением или гормонами',
    'casos.problems.sleep.treatment':
      'С помощью фельденкрайза, управляемого дыхания, вагусных техник и кинезиологии для балансировки гормональной системы.',
    'casos.problems.sleep.results':
      'Улучшение глубокого сна и восстанавливающего отдыха после нескольких сеансов.',
    'casos.problems.sleep.successStory':
      'Елена, 38 лет, юрист: "я не спала всю ночь уже много лет. техники дыхания и расслабления полностью изменили качество моего сна. теперь я действительно отдыхаю."',

    'casos.problems.recovery.title': 'Восстановление после травмы',
    'casos.problems.recovery.description':
      'После падения, операции или несчастного случая тело может оставаться скованным или бояться движения.',
    'casos.problems.recovery.symptoms.0': 'Остаточная боль или ограничение суставов',
    'casos.problems.recovery.symptoms.1': 'Ощущение слабости или дисбаланса',
    'casos.problems.recovery.symptoms.2': 'Эмоциональные блокировки, связанные с травмой',
    'casos.problems.recovery.symptoms.3': 'Страх движения или реактивность',
    'casos.problems.recovery.causes.0': 'Внутренние рубцы и спайки',
    'casos.problems.recovery.causes.1': 'Мышечные и постуральные компенсации',
    'casos.problems.recovery.causes.2': 'Физическая травма с эмоциональным компонентом',
    'casos.problems.recovery.causes.3': 'Телесная память о травматическом опыте',
    'casos.problems.recovery.treatment':
      'С помощью остеобаланса, постурального переобучения и работы с фасциальной системой. мы также сопровождаем уверенность в теле и телесную память.',
    'casos.problems.recovery.results':
      'Восстановление подвижности, облегчение боли и ощущение безопасности в движении.',
    'casos.problems.recovery.successStory':
      'Жорди, 42 года, спортсмен: "после травмы колена я боялся двигаться. комплексная работа помогла мне не только физически, но и вернуть уверенность в своем теле."',

    // Massatge Page
    'massage.page.title': 'Терапевтический массаж',
    'massage.page.subtitle': 'Снимите напряжение и по-настоящему отдохните.',
    'massage.page.description':
      'Расслабляющий и снимающий зажимы массаж, адаптированный для вас, чтобы уменьшить боль, стресс и скованность. ключевые преимущества: облегчение мышц, улучшение кровообращения, душевное спокойствие, более свободная осанка.',
    'massage.page.availableToday': 'Доступно сегодня',
    'massage.page.bookSession': 'Забронируйте сеанс',
    'massage.page.fillForm': 'Заполните форму, и мы отправим вам готовое сообщение в WhatsApp',
    'massage.page.benefitsTitle': 'Преимущества терапевтического массажа',
    'massage.page.benefitsSubtitle': 'Узнайте, как массаж может улучшить качество вашей жизни',
    'massage.page.durationsTitle': 'Доступная продолжительность',
    'massage.page.durationsSubtitle':
      'Выберите продолжительность, которая лучше всего соответствует вашим потребностям',
    'massage.page.duration60': 'Идеально для начала',
    'massage.page.duration90': 'Индивидуальный курс терапии',
    'massage.page.duration120': 'Премиум опыт',
    'massage.page.testimonialsTitle': 'Что говорят наши клиенты',

    // Kinesiologia Page
    'kinesiology.page.title': 'Холистическая кинезиология',
    'kinesiology.page.subtitle': 'Слушайте тело, найдите корень.',
    'kinesiology.page.imageAlt':
      'Сеанс холистической кинезиологии в профессиональной и природной обстановке',
    'kinesiology.page.description':
      'Нейромышечный тест и мягкая коррекция для восстановления баланса тела, эмоций и привычек. ключевые преимущества: меньше стресса, лучшая координация и стабильная энергия.',
    'kinesiology.page.energyBalance': 'Энергетический баланс',
    'kinesiology.page.benefitsTitle': 'Преимущества кинезиологии',
    'kinesiology.page.benefitsSubtitle':
      'Узнайте, как кинезиология может изменить ваше самочувствие',
    'kinesiology.page.durationsSubtitle': 'Сеансы, адаптированные к вашим потребностям',
    'kinesiology.page.duration60': 'Вводный сеанс и базовый баланс',
    'kinesiology.page.duration90': 'Полное и углубленное лечение',

    // Nutricio Page
    'nutrition.page.badge': 'Осознанное питание',
    'nutrition.page.title': 'Осознанное питание',
    'nutrition.page.subtitle': 'Ешьте со смыслом, чтобы иметь реальную энергию.',
    'nutrition.page.description':
      'Персонализированные советы для четких привычек, пищеварения и энергии. ключевые преимущества: устойчивые привычки, жизненная сила и поддержка состава тела.',
    'nutrition.page.personalized': 'Персонализированное питание',
    'nutrition.page.benefitsTitle': 'Преимущества консультаций по питанию',
    'nutrition.page.benefitsSubtitle': 'Узнайте, как правильное питание может изменить вашу жизнь',
    'nutrition.page.sessionTypes': 'Типы сеансов',
    'nutrition.page.sessionSubtitle':
      'Персонализированное сопровождение для ваших целей в области питания',

    // Agenyz Page
    'agenyz.page.title': 'Agenyz клеточная нутрициология',
    'agenyz.page.subtitle': 'Передовые добавки для клеточной регенерации.',
    'agenyz.page.description':
      'Биохакинг и нутрициология, работающие на уровне клетки. восстановите энергию, иммунитет и молодость изнутри.',
    'agenyz.benefits.cell': 'Когнитивная ясность',
    'agenyz.benefits.energy': 'Бесконечная энергия',
    'agenyz.benefits.immunity': 'Иммунная защита',
    'agenyz.benefits.antiaging': 'Антивозрастной эффект',
    'agenyz.why.title': 'Почему Agenyz?',
    'agenyz.why.subtitle': 'Научно обоснованные преимущества для вашего тела и разума.',
    'agenyz.benefits.energy.desc':
      'Восстанавливает митохондриальную функцию для устойчивой ежедневной энергии.',
    'agenyz.benefits.immunity.desc': 'Укрепляет естественные защитные системы организма.',
    'agenyz.benefits.cell.desc': 'Улучшает концентрацию, память и умственную работоспособность.',
    'agenyz.benefits.antiaging.desc':
      'Борется с окислительным стрессом и замедляет процессы старения.',
    'agenyz.cta.title': 'Готовы улучшить свое здоровье?',
    'agenyz.cta.consult': 'Консультация с Еленой',
    'agenyz.cta.visitStore': 'Посетить магазин Agenyz',
    'agenyz.hero.biohacking': 'Биохакинг и питание',
    'agenyz.hero.available': 'Доступно для заказа',

    'service.supplements.title': 'Персонализированные добавки',
    'recommendations.supplements.description':
      'Передовое клеточное питание для повышения вашей повседневной продуктивности.',

    // Testimonials
    'massage.testimonial.1.text':
      'Прихожу напряженным и с узлами. ухожу полностью расслабленным. все просто. эффект длится днями.',
    'massage.testimonial.2.text':
      'Лучший массаж, который у меня был. она действительно знает, что делает. пространство тоже отличное.',
    'kinesiology.testimonial.1.text':
      'Кинезиология помогла мне лучше понять свое тело и эмоции. теперь у меня больше энергии и ясности ума.',
    'kinesiology.testimonial.2.text':
      'После сеансов кинезиологии я заметил невероятное улучшение осанки и координации. очень рекомендую.',
    'nutrition.testimonial.1.text':
      'Консультации по питанию полностью изменили мое отношение к еде. теперь у меня больше энергии, и я чувствую себя намного лучше.',
    'nutrition.testimonial.2.text':
      'Персонализированные советы помогли мне создать здоровые привычки, которые я легко могу поддерживать. результат: больше жизненной силы каждый день.',

    // 360 Revision
    'hero.title': 'Телесный обзор 360°',
    'hero.subtitle': 'Слушайте свое тело. поймите свою историю. верните свою жизнь.',
    'hero.description':
      '90-минутное путешествие для картирования вашего физического, эмоционального и энергетического ландшафта. это не просто диагностика — это первый шаг к возвращению домой, в свое тело.',
    'hero.cta': 'Начните свое путешествие',
    'hero.scroll': 'Откройте подход 360°',
    'why.title': 'Почему 360°?',
    'why.subtitle': 'Потому что вы не просто набор частей. вы — целая система.',
    'why.physical.title': 'Физическое тело',
    'why.physical.desc':
      'Где живет напряжение. мы читаем структуру, фасцию и осанку, чтобы найти, где вы держитесь.',
    'why.emotional.title': 'Эмоциональное тело',
    'why.emotional.desc':
      'Где хранится история. необработанные эмоции становятся физическими блоками.',
    'why.energetic.title': 'Энергетическое тело',
    'why.energetic.desc':
      'Где течет жизненная сила. мы восстанавливаем поток, чтобы исцеление могло происходить естественно.',
    'service.title': 'Опыт',
    'service.step1.title': '1. глубокое интервью',
    'service.step1.desc':
      'За пределами медицинской истории. мы говорим о вашей жизни, вашем стрессе, ваших мечтах и о том, что ваше тело пыталось вам сказать.',
    'service.step2.title': '2. телесное картирование',
    'service.step2.desc':
      'Практическое чтение вашей структуры. мы выявляем дисбалансы, фасциальные ограничения и области застойной энергии.',
    'service.step3.title': '3. сессия интеграции',
    'service.step3.desc':
      'Использование смеси модальностей (массаж, кинезиология, энергетическая работа) для начала процесса разблокировки и выравнивания.',
    'service.step4.title': '4. дорожная карта',
    'service.step4.desc':
      'Вы не уходите с пустыми руками. вы получаете персонализированный план с упражнениями, советами по образу жизни и рекомендациями по восстановлению.',
    'variants.title': 'Выберите свой путь',
    'variants.mapping.title': 'Картирование 360°',
    'variants.mapping.price': '90€',
    'variants.mapping.duration': '90 мин',
    'variants.mapping.desc': 'Фундаментальная сессия. полная диагностика + первое лечение.',
    'variants.alignment.title': 'Выравнивание 360°',
    'variants.alignment.price': '250€',
    'variants.alignment.duration': 'Пакет из 3 сессий',
    'variants.alignment.desc':
      'Для более глубокой работы. включает картирование + 2 сфокусированные последующие сессии.',
    'variants.integral.title': 'Интегральная трансформация',
    'variants.integral.price': '450€',
    'variants.integral.duration': '6-недельная программа',
    'variants.integral.desc':
      'Полное изменение жизни. картирование + 5 сессий + постоянная поддержка.',
    'variants.book': 'Забронировать сейчас',
    'prompt.title': 'Мой подход',
    'prompt.diagnosis': 'Мягкая и точная диагностика',
    'prompt.diagnosisDesc': 'Слушая тело руками и короткими вопросами',
    'prompt.integrativeTechniques': 'Интегративные техники',
    'prompt.techniquesDesc':
      'Терапевтический массаж, кинезиология, остеобаланс, осознанное движение (фельденкрайз), дыхание и регуляция нервной системы',
    'prompt.layeredProcesses': 'Многослойные процессы',
    'prompt.layeredDesc':
      'Освобождение напряжения, переупорядочивание паттернов и укрепление новых телесных и эмоциональных привычек',
    'prompt.session': 'Сессия',
    'prompt.firstVisit': 'Первый визит с диагностикой и мягкой работой. отсюда я намечаю',
    'prompt.personalPlan': 'Персональный план',
    'prompt.sessionsRange': '(обычно 3–6 сессий) для работы слой за слоем',
    'prompt.forWho': 'Для кого это',
    'prompt.forWhoDesc':
      'Для людей, которые хотят настоящих и последовательных изменений, а не быстрых решений. если вы готовы слушать себя и посвятить себя своему благополучию, эта работа для вас.',
    'prompt.booking': 'Забронировать',
    'prompt.consultation': 'Консультация',
    'prompt.promptLabel': 'Промпт',
    'prompt.signature': '— Елена Кучерова',
    'common.ekaBalance': 'EKA Balance',
    'common.copyright': '© 2024',
    'benefits.benefit1.title': 'Ментальная ясность',
    'benefits.benefit1.description': 'Улучшенная концентрация и когнитивная функция',
    'benefits.benefit1.science':
      'Интегративная работа с телом стимулирует блуждающий нерв, улучшая связь мозг-тело и исполнительную функцию.',
    'benefits.benefit2.title': 'Эмоциональный баланс',
    'benefits.benefit2.description': 'Большая эмоциональная устойчивость и регуляция',
    'benefits.benefit2.science':
      'Соматические техники помогают обработать накопленную травму и регулировать паттерны стрессовой реакции нервной системы.',
    'benefits.benefit3.title': 'Устойчивая энергия',
    'benefits.benefit3.description': 'Естественная жизненность без искусственной стимуляции',
    'benefits.benefit3.science':
      'Устранение фасциальных ограничений и постуральных дисбалансов снижает метаболическое расточительство энергии, увеличивая естественную жизненность.',
    'benefits.benefit4.title': 'Облегчение боли',
    'benefits.benefit4.description': 'Длительное облегчение хронических болевых паттернов',
    'benefits.benefit4.science':
      '360° подход обращается к корневым причинам, а не к симптомам, создавая длительные нейропластические изменения в восприятии боли.',
    'benefits.benefit5.title': 'Лучший сон',
    'benefits.benefit5.description': 'Более глубокие, восстановительные циклы сна',
    'benefits.benefit5.science':
      'Регуляция нервной системы и освобождение от напряжения способствуют здоровым циркадным ритмам и архитектуре сна.',
    'benefits.benefit6.title': 'Стрессоустойчивость',
    'benefits.benefit6.description': 'Большая способность справляться с жизненными вызовами',
    'benefits.benefit6.science':
      'Построение парасимпатического тонуса через работу с телом увеличивает стрессоустойчивость и способность к восстановлению.',
    'benefits.benefit7.title': 'Свобода движения',
    'benefits.benefit7.description': 'Улучшенная мобильность и осознание тела',
    'benefits.benefit7.science':
      'Фасциальное освобождение и переобучение движению восстанавливают естественные двигательные паттерны и проприоцептивное осознание.',
    'benefits.benefit8.title': 'Внутренний компас',
    'benefits.benefit8.description': 'Более сильная связь с интуицией и внутренней мудростью',
    'benefits.benefit8.science':
      'Интероцептивное осознание, развитое через работу с телом, улучшает интуитивные ощущения и ясность принятия решений.',
    'benefits.benefit9.title': 'Жизненность',
    'benefits.benefit9.description': 'Обновленное чувство живости и присутствия',
    'benefits.benefit9.science':
      'Устранение энергетических блоков и восстановление потока создает измеримые улучшения в жизненной силе и присутствии.',
    'benefits.science': 'Наука',
    'benefits.philosophy':
      'Мы измеряем успех не только отсутствием симптомов, но и присутствием жизненности, радости и глубокого понимания того, что ваше тело — ваш союзник в жизни.',
    'service.step1.details.1': 'Комплексная оценка здоровья и образа жизни',
    'service.step1.details.2': 'Анализ двигательных паттернов',
    'service.step1.details.3': 'Эмоциональное картирование и анализ стрессовых паттернов',
    'service.step1.details.4': 'Постановка целей и выравнивание намерений',
    'service.step2.details.1': 'Постуральный и структурный анализ',
    'service.step2.details.2': 'Оценка фасциального напряжения и подвижности',
    'service.step2.details.3': 'Оценка энергетического потока',
    'service.step2.details.4': 'Оценка состояния нервной системы',
    'service.step3.details.1': 'Мануальная терапия и работа с телом',
    'service.step3.details.2': 'Регуляция дыхания и нервной системы',
    'service.step3.details.3': 'Переобучение движению',
    'service.step3.details.4': 'Техники энергетического баланса',
    'service.step4.details.1': 'Персонализированные двигательные последовательности',
    'service.step4.details.2': 'Практики и инструменты самоухода',
    'service.step4.details.3': 'Рекомендации по изменению образа жизни',
    'service.step4.details.4': 'Планирование последующих сессий',
    'testimonials.maria.name': 'Мария',
    'testimonials.maria.issue': 'Хроническая боль в шее и стресс',
    'testimonials.maria.quote':
      'После 15 лет боли я наконец снова чувствую себя собой. подход 360° не только исправил мою шею — он вернул мне уверенность.',
    'testimonials.maria.result':
      'Боль уменьшилась с 8/10 до 1/10, уровень стресса значительно улучшился',
    'testimonials.maria.timeframe': '3 месяца',
    'testimonials.maria.before':
      'Постоянное напряжение, плохая осанка, тревога, влияющая на повседневную жизнь',
    'testimonials.maria.after': 'Движение без боли, уверенная осанка, спокойная нервная система',
    'testimonials.david.name': 'Давид',
    'testimonials.david.issue': 'Спортивные показатели и восстановление',
    'testimonials.david.quote':
      'Я думал, что знаю свое тело как спортсмен. картирование 360° выявило паттерны, о которых я никогда не знал. мои показатели и восстановление достигли нового уровня.',
    'testimonials.david.result':
      '25% улучшение времени восстановления, устранены повторяющиеся травмы',
    'testimonials.david.timeframe': '6 недель',
    'testimonials.david.before': 'Частые травмы, медленное восстановление, застой в результатах',
    'testimonials.david.after':
      'Тренировки без травм, более быстрое восстановление, новые личные рекорды',
    'testimonials.jennifer.name': 'Дженнифер',
    'testimonials.jennifer.issue': 'Послеоперационное восстановление и подвижность',
    'testimonials.jennifer.quote':
      'После операции я чувствовала себя отключенной от своего тела. исцеление здесь вышло за рамки физического — я научилась снова доверять своему телу.',
    'testimonials.jennifer.result':
      'Полная подвижность восстановлена, уверенность в движении вернулась',
    'testimonials.jennifer.timeframe': '4 месяца',
    'testimonials.jennifer.before': 'Ограниченная подвижность, страх движения, депрессия',
    'testimonials.jennifer.after':
      'Полная амплитуда движений, радость в движении, эмоциональное исцеление',
    'testimonials.alex.name': 'Алекс',
    'testimonials.alex.issue': 'Тревога и дисрегуляция нервной системы',
    'testimonials.alex.quote':
      'Я пришел с тревогой, не ожидая, что работа с телом поможет. но когда они объяснили, как моя нервная система застряла, все обрело смысл. я чувствую спокойствие в своем теле впервые за годы.',
    'testimonials.alex.result': 'Тревога снижена на 80%, качество сна значительно улучшилось',
    'testimonials.alex.timeframe': '8 недель',
    'testimonials.alex.before': 'Хроническая тревога, бессонница, чувство небезопасности в теле',
    'testimonials.alex.after':
      'Спокойная нервная система, восстановительный сон, воплощенная уверенность',
    'testimonials.resultsAchieved': 'Достигнутые результаты:',
    'testimonials.timeframe': 'Время:',
    'testimonials.watchVideo': 'Посмотреть видео-историю',
    'testimonials.showBeforeAfter': 'Показать до и после',
    'testimonials.hideBeforeAfter': 'Скрыть',
    'testimonials.before': 'До:',
    'testimonials.after': 'После:',
    'testimonials.videoStory': 'История',
    'testimonials.keyInsights': 'Ключевые выводы от',
    'testimonials.keyInsight1':
      'Как подход 360° обращался к корневым причинам, а не только к симптомам',
    'testimonials.keyInsight2': 'Эмоциональный прорыв, который ускорил физическое исцеление',
    'testimonials.keyInsight3':
      'Практические инструменты, которые продолжают поддерживать постоянное благополучие',
    'testimonials.keyInsight4': 'Почему этот подход преуспел там, где другие потерпели неудачу',
    'testimonials.videoPlaceholder': 'Здесь воспроизводился бы видео-отзыв',
    'testimonials.videoImplementation':
      'В реальной реализации это было бы встроенное видео-содержание',
    'story.title': 'Путешествие исцеления',
    'story.intro': 'Сара пришла к нам, неся груз десяти лет...',
    'story.paragraph1':
      'Плечи сары заговорили раньше неё. согнутые внутрь, как защитная оболочка, они хранили историю бесчисленных бессонных ночей, писем, отвеченных в полночь, повышения, которое пришло с ценой, которую её тело всё ещё платило.',
    'story.paragraph2':
      '"я просто хочу, чтобы моя шея перестала болеть," — сказала она во время нашей первой сессии. но её тело шептало более глубокие истины — о страхе, поселившемся в её груди, о тревоге, которая обосновалась в её челюсти, об истощении, которое жило в её костях.',
    'story.paragraph3':
      'Подход 360° затронул не только её шею. мы работали с эмоциональными паттернами, которые создавали напряжение, структурными дисбалансами, которые его поддерживали, и энергетическими блоками, которые препятствовали исцелению. мы слушали, что нужно её телу, чтобы снова чувствовать себя в безопасности.',
    'story.paragraph4':
      'Три месяца спустя сара держалась по-другому. не просто прямее — она держалась как кто-то, кто вспомнил, что имеет право занимать пространство. её боль в шее стала дверью к возвращению частей себя, о существовании которых она забыла.',
    'story.paragraph5':
      '"я не просто вернула своё тело," — сказала она нам. "я вернула свою жизнь."',
    'story.philosophy':
      'У каждого тела есть история. каждая история заслуживает того, чтобы быть услышанной в полноте — не только симптомы, но и весь человеческий опыт под ними.',
    'services.completeReview': 'Полный телесный обзор 360°',
    'services.reset360': 'Перезагрузка 360°',
    'services.mapping360': 'Телесное картирование 360°',
    'services.alignment360': 'Выравнивание 360°',
    'services.followUpConsultations': 'Консультации по наблюдению',
    'cta.scheduleDiscoveryCall': 'Запланировать ознакомительный звонок',
    'cta.downloadGuide': 'Скачать наше руководство',
    'labels.noInsuranceNeeded': 'Страховка не нужна',
    'labels.flexibleSchedules': 'Гибкое расписание',
    'labels.personalizedApproach': 'Персонализированный подход',
    'labels.presentialConsultations': 'Очные консультации',
    'labels.onlineSessionsAvailable': 'И онлайн-сессии доступны',
    'alt.ekaLogo': 'Логотип EKA Balance',
    'footer.brand': 'Интегральное исцеление 360°',
    'footer.description':
      'Трансформируем жизни через интегральное исцеление тела, разума и духа. ваше путешествие к полному благополучию начинается здесь.',
    'footer.healingWithIntention': 'Исцеление с намерением',
    'footer.contact': 'Контакт',
    'footer.services': 'Услуги',
    'footer.copyright': '© 2024 EKA Balance. все права защищены.',
    'footer.madeWith': 'Сделано с',
    'footer.forHealing': 'Для исцеления',

    'vip.dashboard.member': 'Участник',
    'vip.dashboard.hello': 'Привет,',
    'vip.dashboard.status': 'Статус:',
    'vip.dashboard.priorityBooking': 'Приоритетное бронирование',
    'vip.dashboard.viewPlans': 'Посмотреть планы',
    'vip.features.badge': 'Особенности',
    'vip.features.title': 'Эксклюзивные особенности',
    'vip.features.subtitle': 'Откройте для себя мир привилегий',
    'vip.plans.badge': 'Планы',
    'vip.plans.title': 'Выберите свой план',
    'vip.plans.perMonth': '/ месяц',
    'vip.plans.contact': 'Связаться',
    'vip.stats.concierge': 'Консьерж сервис',
    'vip.stats.exclusivity': 'Эксклюзивность',
    'vip.testimonials.role1': 'Предприниматель',
    'vip.testimonials.role2': 'Врач',
    'vip.testimonials.role3': 'Архитектор',
    'vip.cta.badge': 'Начните сегодня',
    'vip.cta.title': 'Готовы начать?',
    'vip.cta.subtitle': 'Свяжитесь с нами для консультации',
    'seo.vip.title': 'VIP планы - EKA Balance',
    'seo.vip.description': 'Эксклюзивные VIP планы для вашего здоровья и благополучия.',
    'seo.vip.keywords': 'VIP, здоровье, благополучие, Барселона, эксклюзив',

    // Missing VIP Keys
    'vip.title': 'VIP планы - контроль здоровья | EKA Balance',
    'vip.description': 'Эксклюзивные VIP планы с выездом на дом.',
    'vip.badge': 'Эксклюзивное обслуживание',
    'vip.hero.title': 'VIP планы контроля здоровья',
    'vip.hero.subtitle': 'Сеансы на дому • ежемесячный контроль • для всей семьи • Барселона',
    'vip.stats.sessions': 'Сеансы 1.5ч',
    'vip.stats.barcelona': 'В Барселоне',
    'vip.stats.family': 'Семья включена',
    'vip.stats.control': 'Контроль здоровья',
    'vip.cta.consultation': 'VIP консультация',
    'vip.cta.normal': 'Обычные услуги',
    'vip.benefits.sessions': 'Сеансы 1.5ч',
    'vip.benefits.sessionsDesc': 'Полные персонализированные сеансы',
    'vip.benefits.barcelona': 'В Барселоне',
    'vip.benefits.barcelonaDesc': 'Выезд включен',
    'vip.benefits.transferable': 'Передаваемые сеансы',
    'vip.benefits.transferableDesc': 'Делитесь с семьей',
    'vip.benefits.monthly': 'Ежемесячный контроль',
    'vip.benefits.monthlyDesc': 'Мониторинг здоровья',
    'vip.service.displacements.title': 'Эксклюзивные выезды',
    'vip.service.displacements.description': 'VIP сервис у вас дома или в офисе',
    'vip.service.health.title': 'Мониторинг здоровья',
    'vip.service.health.description': 'Ежемесячный контроль физического и эмоционального состояния',
    'vip.service.family.title': 'Семейные привилегии',
    'vip.service.family.description': 'Распространение преимуществ на семью',
    'vip.service.priority.title': 'Приоритетный доступ',
    'vip.service.priority.description': 'Премиум поддержка и быстрый ответ',
    'vip.includes.title': 'Что включено в VIP?',
    'vip.includes.subtitle': 'Все VIP планы включают эти преимущества',
    'vip.plan.comparison': 'Сравнение планов',
    'vip.plan.comparisonDesc': 'Найдите идеальный план',
    'vip.plan.bronze': 'Bronze VIP',
    'vip.plan.bronze.price': '390€',
    'vip.plan.bronze.description': 'Вход в VIP мир',
    'vip.plan.silver': 'Silver VIP',
    'vip.plan.silver.price': '690€',
    'vip.plan.silver.description': 'Идеально для профессионалов',
    'vip.plan.gold': 'Gold VIP',
    'vip.plan.gold.price': '990€',
    'vip.plan.gold.description': 'Ультимативный VIP опыт',
    'vip.plan.popular': 'Популярный',
    'vip.plan.premium': 'Premium',
    'vip.tier.standard': 'Стандарт',
    'vip.testimonials.title': 'Довольные VIP клиенты',
    'vip.testimonials.subtitle': 'Реальный опыт наших VIP участников',
    'vip.testimonials.comment1':
      'Сервис gold VIP полностью изменил качество моей жизни. персональное внимание и доступность 24/7 не имеют аналогов.',
    'vip.testimonials.comment2':
      'Как врач, я могу подтвердить, что EKA Balance предлагает стандарт качества, превосходящий ожидания.',
    'vip.testimonials.comment3':
      'План silver VIP позволил мне заботиться о семье и сохранять баланс. инвестиция, которая того стоит.',
    'vip.final.title': 'Вступайте в VIP круг',
    'vip.final.subtitle': 'Начните пользоваться эксклюзивными преимуществами уже сегодня',
    'vip.final.address': 'Carrer Pelai, 12, 08001 Barcelona',
    'vip.final.addressNote': 'Выезды включены в зависимости от плана',
    'vip.monthlySessionsOf': 'Сессий в месяц по 1.5ч',
    'vip.contactFor': 'Связаться для',
    'vip.innerCircle': 'Круг благополучия',
    'vip.beyond': 'За пределами',
    'vip.wellness': 'Благополучия',
    'vip.experienceDescription':
      'Эксклюзивный опыт здоровья и благополучия для требовательных профессионалов',
    'vip.eliteMemberships': 'Элитное членство',
    'vip.eliteSubtitle': 'Выберите уровень совершенства, которого вы заслуживаете',
    'vip.mostExclusive': 'Самый эксклюзивный',
    'vip.exclusivePrivileges': 'Уникальные преимущества',
    'vip.privilegesSubtitle': 'Привилегии только для VIP участников',
    'vip.voicesOfExcellence': 'Голоса совершенства',
    'vip.testimonialsSubtitle': 'Реальные истории наших VIP участников',
    'vip.elite': 'Premium',
    'vip.innerCircleAwaits': 'Ваше пространство заботы ждет',
    'vip.readyToTranscend': 'Готовы перейти',
    'vip.transcend': 'На новый уровень?',
    'vip.transcendSubtitle':
      'Присоединяйтесь к элите благополучия и испытайте новый уровень заботы о себе',
    'vip.joinInnerCircle': 'Присоединиться к программе',
    'vip.exclusiveExperiences': 'Эксклюзивный опыт для VIP участников',
  },
};
