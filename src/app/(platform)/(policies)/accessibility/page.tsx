'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Accessibility Statement',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'EKA Balance is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards. We believe that the internet should be available and accessible to anyone, and are committed to providing a website that is accessible to the widest possible audience, regardless of circumstance and ability.',
    sections: [
      {
        id: 'conformance-status',
        title: '1. Conformance Status',
        text: 'The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. EKA Balance is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard, though we are actively working to resolve these gaps.',
      },
      {
        id: 'measures',
        title: '2. Measures to Support Accessibility',
        text: 'EKA Balance takes the following measures to ensure accessibility of our website:\n\nâ€¢ Include accessibility as part of our mission statement.\nâ€¢ Integrate accessibility into our procurement practices.\nâ€¢ Appoint an accessibility officer and/or ombudsperson.\nâ€¢ Provide continual accessibility training for our staff.\nâ€¢ Assign clear accessibility targets and responsibilities.\nâ€¢ Employ formal accessibility quality assurance methods.',
      },
      {
        id: 'compatibility',
        title: '3. Compatibility with Browsers and Assistive Technology',
        text: 'The EKA Balance website is designed to be compatible with the following assistive technologies:\n\nâ€¢ Popular screen readers (e.g., NVDA, JAWS, VoiceOver).\nâ€¢ Screen magnifiers and speech recognition software.\nâ€¢ Standard operating system accessibility features.\n\nThe website is designed to be compatible with the latest versions of major web browsers, including Chrome, Firefox, Safari, and Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Technical Specifications',
        text: 'Accessibility of EKA Balance relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:\n\nâ€¢ HTML\nâ€¢ WAI-ARIA\nâ€¢ CSS\nâ€¢ JavaScript\n\nThese technologies are relied upon for conformance with the accessibility standards used.',
      },
      {
        id: 'limitations',
        title: '5. Limitations and Alternatives',
        text: 'Despite our best efforts to ensure accessibility of the EKA Balance website, there may be some limitations. Below is a description of known limitations and potential solutions. Please contact us if you observe an issue not listed below.\n\nKnown limitations:\nâ€¢ **User-generated content**: Some content uploaded by users may not have text alternatives. We monitor user content and typically repair issues within 2 business days.\nâ€¢ **Archived documents**: Older documents might not work with current assistive technologies because they were published before our current accessibility standards were implemented. We convert documents to accessible formats upon request.',
      },
      {
        id: 'assessment',
        title: '6. Assessment Approach',
        text: 'EKA Balance assessed the accessibility of our website by the following approaches:\n\nâ€¢ Self-evaluation.\nâ€¢ External evaluation by a third-party accessibility expert (periodic audits).',
      },
      {
        id: 'feedback',
        title: '7. Feedback',
        text: 'We welcome your feedback on the accessibility of EKA Balance. Please let us know if you encounter accessibility barriers on our website:\n\nâ€¢ E-mail: accessibility@ekabalance.com\n\nWe try to respond to feedback within 2 business days.',
      },
      {
        id: 'approval',
        title: '8. Formal Approval of this Accessibility Statement',
        text: 'This Accessibility Statement is approved by:\n\nEKA Balance Legal & Compliance Department\nBarcelona, Spain',
      },
    ],
  },
  es: {
    title: 'DeclaraciÃ³n de Accesibilidad',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'EKA Balance se compromete a garantizar la accesibilidad digital para personas con discapacidades. Estamos mejorando continuamente la experiencia del usuario para todos y aplicando los estÃ¡ndares de accesibilidad pertinentes. Creemos que Internet debe estar disponible y ser accesible para cualquier persona, y nos comprometemos a proporcionar un sitio web que sea accesible para la audiencia mÃ¡s amplia posible, independientemente de las circunstancias y la capacidad.',
    sections: [
      {
        id: 'conformance-status',
        title: '1. Estado de Conformidad',
        text: 'Las Pautas de Accesibilidad al Contenido en la Web (WCAG) definen los requisitos para diseÃ±adores y desarrolladores para mejorar la accesibilidad para personas con discapacidades. Define tres niveles de conformidad: Nivel A, Nivel AA y Nivel AAA. EKA Balance es parcialmente conforme con WCAG 2.1 nivel AA. Parcialmente conforme significa que algunas partes del contenido no cumplen totalmente con el estÃ¡ndar de accesibilidad, aunque estamos trabajando activamente para resolver estas brechas.',
      },
      {
        id: 'measures',
        title: '2. Medidas para Apoyar la Accesibilidad',
        text: 'EKA Balance toma las siguientes medidas para garantizar la accesibilidad de nuestro sitio web:\n\nâ€¢ Incluir la accesibilidad como parte de nuestra declaraciÃ³n de misiÃ³n.\nâ€¢ Integrar la accesibilidad en nuestras prÃ¡cticas de adquisiciÃ³n.\nâ€¢ Nombrar un oficial de accesibilidad y/o defensor del pueblo.\nâ€¢ Proporcionar capacitaciÃ³n continua en accesibilidad para nuestro personal.\nâ€¢ Asignar objetivos y responsabilidades de accesibilidad claros.\nâ€¢ Emplear mÃ©todos formales de garantÃ­a de calidad de accesibilidad.',
      },
      {
        id: 'compatibility',
        title: '3. Compatibilidad con Navegadores y TecnologÃ­a de Asistencia',
        text: 'El sitio web de EKA Balance estÃ¡ diseÃ±ado para ser compatible con las siguientes tecnologÃ­as de asistencia:\n\nâ€¢ Lectores de pantalla populares (por ejemplo, NVDA, JAWS, VoiceOver).\nâ€¢ Lupas de pantalla y software de reconocimiento de voz.\nâ€¢ CaracterÃ­sticas de accesibilidad estÃ¡ndar del sistema operativo.\n\nEl sitio web estÃ¡ diseÃ±ado para ser compatible con las Ãºltimas versiones de los principales navegadores web, incluidos Chrome, Firefox, Safari y Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Especificaciones TÃ©cnicas',
        text: "La accesibilidad de EKA Balance se basa en les segÃ¼ents tecnologies per funcionar amb la combinaciÃ³ particular de navegador web i qualsevol tecnologia d'assistÃ¨ncia o complements instalÂ·lats al seu ordinador:\n\nâ€¢ HTML\nâ€¢ WAI-ARIA\nâ€¢ CSS\nâ€¢ JavaScript\n\nSe confÃ­a en estas tecnologÃ­as para la conformidad con los estÃ¡ndares de accesibilidad utilizados.",
      },
      {
        id: 'limitations',
        title: '5. Limitaciones y Alternativas',
        text: 'A pesar de nuestros mejores esfuerzos para garantizar la accesibilidad del sitio web de EKA Balance, puede haber algunas limitaciones. A continuaciÃ³n se describe una descripciÃ³n de las limitaciones conocidas y las posibles soluciones. PÃ³ngase en contacto con nosotros si observa un problema que no figura a continuaciÃ³n.\n\nLimitaciones conocidas:\nâ€¢ **Contenido generado por el usuario**: Parte del contenido subido por los usuarios puede no tener alternativas de texto. Supervisamos el contenido del usuario y generalmente reparamos los problemas dentro de los 2 dÃ­as hÃ¡biles.\nâ€¢ **Documentos archivados**: Es posible que los documentos mÃ¡s antiguos no funcionen con las tecnologÃ­as de asistencia actuales porque se publicaron antes de que se implementaran nuestros estÃ¡ndares de accesibilidad actuales. Convertimos documentos a formatos accesibles a pedido.',
      },
      {
        id: 'assessment',
        title: '6. Enfoque de EvaluaciÃ³n',
        text: 'EKA Balance evaluÃ³ la accesibilidad de nuestro sitio web mediante los siguientes enfoques:\n\nâ€¢ AutoevaluaciÃ³n.\nâ€¢ EvaluaciÃ³n externa por un experto en accesibilidad externo (auditorÃ­as periÃ³dicas).',
      },
      {
        id: 'feedback',
        title: '7. Comentarios',
        text: 'Agradecemos sus comentarios sobre la accesibilidad de EKA Balance. HÃ¡ganos saber si encuentra barreras de accesibilidad en nuestro sitio web:\n\nâ€¢ Correo electrÃ³nico: accessibility@ekabalance.com\n\nIntentamos responder a los comentarios dentro de los 2 dÃ­as hÃ¡biles.',
      },
      {
        id: 'approval',
        title: '8. AprobaciÃ³n Formal de esta DeclaraciÃ³n de Accesibilidad',
        text: 'Esta DeclaraciÃ³n de Accesibilidad estÃ¡ aprobada por:\n\nDepartamento Legal y de Cumplimiento de EKA Balance\nBarcelona, EspaÃ±a',
      },
    ],
  },
  ca: {
    title: "DeclaraciÃ³ d'Accessibilitat",
    updated: 'Darrera actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "EKA Balance es compromet a garantir l'accessibilitat digital per a persones amb discapacitats. Estem millorant contÃ­nuament l'experiÃ¨ncia de l'usuari per a tothom i aplicant els estÃ ndards d'accessibilitat pertinents. Creiem que Internet ha d'estar disponible i ser accessible per a qualsevol persona, i ens comprometem a proporcionar un lloc web que sigui accessible per a l'audiÃ¨ncia mÃ©s Ã mplia possible, independentment de les circumstÃ ncies i la capacitat.",
    sections: [
      {
        id: 'conformance-status',
        title: '1. Estat de Conformitat',
        text: "Les Pautes d'Accessibilitat al Contingut a la Web (WCAG) defineixen els requisits per a dissenyadors i desenvolupadors per millorar l'accessibilitat per a persones amb discapacitats. Defineix tres nivells de conformitat: Nivell A, Nivell AA i Nivell AAA. EKA Balance Ã©s parcialment conforme amb WCAG 2.1 nivell AA. Parcialment conforme significa que algunes parts del contingut no compleixen totalment amb l'estÃ ndard d'accessibilitat, tot i que estem treballant activament per resoldre aquestes bretxes.",
      },
      {
        id: 'measures',
        title: "2. Mesures per Donar Suport a l'Accessibilitat",
        text: "EKA Balance pren les segÃ¼ents mesures per garantir l'accessibilitat del nostre lloc web:\n\nâ€¢ Incloure l'accessibilitat com a part de la nostra declaraciÃ³ de missiÃ³.\nâ€¢ Integrar l'accessibilitat en les nostres prÃ ctiques d'adquisiciÃ³.\nâ€¢ Nomenar un oficial d'accessibilitat i/o defensor del poble.\nâ€¢ Proporcionar formaciÃ³ contÃ­nua en accessibilitat per al nostre personal.\nâ€¢ Assignar objectius i responsabilitats d'accessibilitat clars.\nâ€¢ Emprar mÃ¨todes formals de garantia de qualitat d'accessibilitat.",
      },
      {
        id: 'compatibility',
        title: "3. Compatibilitat amb Navegadors i Tecnologia d'AssistÃ¨ncia",
        text: "El lloc web d'EKA Balance estÃ  dissenyat per ser compatible amb les segÃ¼ents tecnologies d'assistÃ¨ncia:\n\nâ€¢ Lectors de pantalla populars (per exemple, NVDA, JAWS, VoiceOver).\nâ€¢ Lupes de pantalla i programari de reconeixement de veu.\nâ€¢ CaracterÃ­stiques d'accessibilitat estÃ ndard del sistema operatiu.\n\nEl lloc web estÃ  dissenyat per ser compatible amb les Ãºltimes versions dels principals navegadors web, inclosos Chrome, Firefox, Safari i Edge.",
      },
      {
        id: 'technical-specifications',
        title: '4. Especificacions TÃ¨cniques',
        text: "L'accessibilitat d'EKA Balance es basa en les segÃ¼ents tecnologies per funcionar amb la combinaciÃ³ particular de navegador web i qualsevol tecnologia d'assistÃ¨ncia o complements instalÂ·lats al seu ordinador:\n\nâ€¢ HTML\nâ€¢ WAI-ARIA\nâ€¢ CSS\nâ€¢ JavaScript\n\nEs confia en aquestes tecnologies per a la conformitat amb els estÃ ndards d'accessibilitat utilitzats.",
      },
      {
        id: 'limitations',
        title: '5. Limitacions i Alternatives',
        text: "Malgrat els nostres millors esforÃ§os per garantir l'accessibilitat del lloc web d'EKA Balance, pot haver-hi algunes limitacions. A continuaciÃ³ es descriu una descripciÃ³ de les limitacions conegudes i les possibles solucions. Posi's en contacte amb nosaltres si observa un problema que no figura a continuaciÃ³.\n\nLimitacions conegudes:\nâ€¢ **Contingut generat per l'usuari**: Part del contingut pujat pels usuaris pot no tenir alternatives de text. Supervisem el contingut de l'usuari i generalment reparem els problemes dins dels 2 dies hÃ bils.\nâ€¢ **Documents arxivats**: Ã‰s possible que els documents mÃ©s antics no funcionin amb les tecnologies d'assistÃ¨ncia actuals perquÃ¨ es van publicar abans que s'implementessin els nostres estÃ ndards d'accessibilitat actuals. Convertim documents a formats accessibles a peticiÃ³.",
      },
      {
        id: 'assessment',
        title: "6. Enfocament d'AvaluaciÃ³",
        text: "EKA Balance va avaluar l'accessibilitat del nostre lloc web mitjanÃ§ant els segÃ¼ents enfocaments:\n\nâ€¢ AutoavaluaciÃ³.\nâ€¢ AvaluaciÃ³ externa per un expert en accessibilitat extern (auditories periÃ²diques).",
      },
      {
        id: 'feedback',
        title: '7. Comentaris',
        text: "AgraÃ¯m els seus comentaris sobre l'accessibilitat d'EKA Balance. Faci'ns saber si troba barreres d'accessibilitat al nostre lloc web:\n\nâ€¢ Correu electrÃ²nic: accessibility@ekabalance.com\n\nIntentem respondre als comentaris dins dels 2 dies hÃ bils.",
      },
      {
        id: 'approval',
        title: "8. AprobaciÃ³ Formal d'aquesta DeclaraciÃ³ d'Accessibilitat",
        text: "Aquesta DeclaraciÃ³ d'Accessibilitat estÃ  aprovada per:\n\nDepartament Legal i de Compliment d'EKA Balance\nBarcelona, Espanya",
      },
    ],
  },
  ru: {
    title: 'Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ñ†Ð¸Ñ„Ñ€Ð¾Ð²ÑƒÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð´Ð»Ñ Ð»ÑŽÐ´ÐµÐ¹ Ñ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¼Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑÐ¼Ð¸. ÐœÑ‹ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°ÐµÐ¼ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ Ð¾Ð¿Ñ‹Ñ‚ Ð´Ð»Ñ Ð²ÑÐµÑ… Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÐ¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ñ‹ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸. ÐœÑ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð˜Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ Ð¸ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚ Ð´Ð»Ñ Ð²ÑÐµÑ…, Ð¸ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚, Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ð¹ Ð´Ð»Ñ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾ ÑˆÐ¸Ñ€Ð¾ÐºÐ¾Ð¹ Ð°ÑƒÐ´Ð¸Ñ‚Ð¾Ñ€Ð¸Ð¸, Ð½ÐµÐ·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ Ð¾Ñ‚ Ð¾Ð±ÑÑ‚Ð¾ÑÑ‚ÐµÐ»ÑŒÑÑ‚Ð² Ð¸ ÑÐ¿Ð¾ÑÐ¾Ð±Ð½Ð¾ÑÑ‚ÐµÐ¹.',
    sections: [
      {
        id: 'conformance-status',
        title: '1. Ð¡Ñ‚Ð°Ñ‚ÑƒÑ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ñ',
        text: 'Ð ÑƒÐºÐ¾Ð²Ð¾Ð´ÑÑ‚Ð²Ð¾ Ð¿Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸ÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð²ÐµÐ±-ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° (WCAG) Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ð´Ð»Ñ Ð´Ð¸Ð·Ð°Ð¹Ð½ÐµÑ€Ð¾Ð² Ð¸ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¾Ð² Ð¿Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸ÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ Ð»ÑŽÐ´ÐµÐ¹ Ñ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¼Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑÐ¼Ð¸. ÐžÐ½Ð¾ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ñ‚Ñ€Ð¸ ÑƒÑ€Ð¾Ð²Ð½Ñ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ñ: Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ A, Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ AA Ð¸ Ð£Ñ€Ð¾Ð²ÐµÐ½ÑŒ AAA. EKA Balance Ñ‡Ð°ÑÑ‚Ð¸Ñ‡Ð½Ð¾ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚ ÑƒÑ€Ð¾Ð²Ð½ÑŽ AA WCAG 2.1. Ð§Ð°ÑÑ‚Ð¸Ñ‡Ð½Ð¾Ðµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ðµ Ð¾Ð·Ð½Ð°Ñ‡Ð°ÐµÑ‚, Ñ‡Ñ‚Ð¾ Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ‡Ð°ÑÑ‚Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ð½Ðµ Ð¿Ð¾Ð»Ð½Ð¾ÑÑ‚ÑŒÑŽ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‚ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ñƒ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸, Ñ…Ð¾Ñ‚Ñ Ð¼Ñ‹ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÐ¼ Ð½Ð°Ð´ ÑƒÑÑ‚Ñ€Ð°Ð½ÐµÐ½Ð¸ÐµÐ¼ ÑÑ‚Ð¸Ñ… Ð¿Ñ€Ð¾Ð±ÐµÐ»Ð¾Ð².',
      },
      {
        id: 'measures',
        title: '2. ÐœÐµÑ€Ñ‹ Ð¿Ð¾ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐµ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸',
        text: 'EKA Balance Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÑ‚ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ðµ Ð¼ÐµÑ€Ñ‹ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°:\n\nâ€¢ Ð’ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð² Ð½Ð°ÑˆÑƒ Ð¼Ð¸ÑÑÐ¸ÑŽ.\nâ€¢ Ð˜Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð² Ð½Ð°ÑˆÐ¸ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ¸ Ð·Ð°ÐºÑƒÐ¿Ð¾Ðº.\nâ€¢ ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð·Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð¸/Ð¸Ð»Ð¸ Ð¾Ð¼Ð±ÑƒÐ´ÑÐ¼ÐµÐ½Ð°.\nâ€¢ ÐžÐ±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾Ð³Ð¾ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð°.\nâ€¢ ÐÐ°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ñ‡ÐµÑ‚ÐºÐ¸Ñ… Ñ†ÐµÐ»ÐµÐ¹ Ð¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚ÐµÐ¹ Ð¿Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸ÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸.\nâ€¢ Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¼ÐµÑ‚Ð¾Ð´Ð¾Ð² Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸.',
      },
      {
        id: 'compatibility',
        title: '3. Ð¡Ð¾Ð²Ð¼ÐµÑÑ‚Ð¸Ð¼Ð¾ÑÑ‚ÑŒ Ñ Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°Ð¼Ð¸ Ð¸ Ð²ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸ÑÐ¼Ð¸',
        text: 'Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚ EKA Balance Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½ Ð´Ð»Ñ ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð¸Ð¼Ð¾ÑÑ‚Ð¸ ÑÐ¾ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ð¼Ð¸ Ð²ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸ÑÐ¼Ð¸:\n\nâ€¢ ÐŸÐ¾Ð¿ÑƒÐ»ÑÑ€Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹ Ñ‡Ñ‚ÐµÐ½Ð¸Ñ Ñ ÑÐºÑ€Ð°Ð½Ð° (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, NVDA, JAWS, VoiceOver).\nâ€¢ Ð­ÐºÑ€Ð°Ð½Ð½Ñ‹Ðµ Ð»ÑƒÐ¿Ñ‹ Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ðµ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ñ€Ð°ÑÐ¿Ð¾Ð·Ð½Ð°Ð²Ð°Ð½Ð¸Ñ Ñ€ÐµÑ‡Ð¸.\nâ€¢ Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹.\n\nÐ’ÐµÐ±-ÑÐ°Ð¹Ñ‚ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½ Ð´Ð»Ñ ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð¸Ð¼Ð¾ÑÑ‚Ð¸ Ñ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¼Ð¸ Ð²ÐµÑ€ÑÐ¸ÑÐ¼Ð¸ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ñ… Ð²ÐµÐ±-Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð¾Ð², Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Chrome, Firefox, Safari Ð¸ Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Ð¢ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸',
        text: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ EKA Balance Ð·Ð°Ð²Ð¸ÑÐ¸Ñ‚ Ð¾Ñ‚ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ñ… Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹ Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ñ ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð¾Ð¹ ÐºÐ¾Ð¼Ð±Ð¸Ð½Ð°Ñ†Ð¸ÐµÐ¹ Ð²ÐµÐ±-Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð° Ð¸ Ð»ÑŽÐ±Ñ‹Ñ… Ð²ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹ Ð¸Ð»Ð¸ Ð¿Ð»Ð°Ð³Ð¸Ð½Ð¾Ð², ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ñ… Ð½Ð° Ð²Ð°ÑˆÐµÐ¼ ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ðµ:\n\nâ€¢ HTML\nâ€¢ WAI-ARIA\nâ€¢ CSS\nâ€¢ JavaScript\n\nÐ­Ñ‚Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ÑÑ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼Ñ‹Ð¼ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð°Ð¼ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸.',
      },
      {
        id: 'limitations',
        title: '5. ÐžÐ³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ Ð¸ Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ñ‹',
        text: 'ÐÐµÑÐ¼Ð¾Ñ‚Ñ€Ñ Ð½Ð° Ð½Ð°ÑˆÐ¸ ÑƒÑÐ¸Ð»Ð¸Ñ Ð¿Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸ÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð° EKA Balance, Ð¼Ð¾Ð³ÑƒÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ. ÐÐ¸Ð¶Ðµ Ð¿Ñ€Ð¸Ð²ÐµÐ´ÐµÐ½Ð¾ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¸Ð·Ð²ÐµÑÑ‚Ð½Ñ‹Ñ… Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ð¹ Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ‹Ñ… Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹. ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°Ð¼Ð¸, ÐµÑÐ»Ð¸ Ð²Ñ‹ Ð·Ð°Ð¼ÐµÑ‚Ð¸Ñ‚Ðµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñƒ, Ð½Ðµ ÑƒÐºÐ°Ð·Ð°Ð½Ð½ÑƒÑŽ Ð½Ð¸Ð¶Ðµ.\n\nÐ˜Ð·Ð²ÐµÑÑ‚Ð½Ñ‹Ðµ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ:\nâ€¢ **ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚**: ÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚, Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½Ð½Ñ‹Ð¹ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑÐ¼Ð¸, Ð¼Ð¾Ð¶ÐµÑ‚ Ð½Ðµ Ð¸Ð¼ÐµÑ‚ÑŒ Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ñ‹Ñ… Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð². ÐœÑ‹ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÐµÐ¼ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¸ Ð¾Ð±Ñ‹Ñ‡Ð½Ð¾ ÑƒÑÑ‚Ñ€Ð°Ð½ÑÐµÐ¼ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 2 Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ñ… Ð´Ð½ÐµÐ¹.\nâ€¢ **ÐÑ€Ñ…Ð¸Ð²Ð½Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹**: Ð¡Ñ‚Ð°Ñ€Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð¼Ð¾Ð³ÑƒÑ‚ Ð½Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ñ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¼Ð¸ Ð²ÑÐ¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸ÑÐ¼Ð¸, Ð¿Ð¾ÑÐºÐ¾Ð»ÑŒÐºÑƒ Ð¾Ð½Ð¸ Ð±Ñ‹Ð»Ð¸ Ð¾Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ñ‹ Ð´Ð¾ Ð²Ð½ÐµÐ´Ñ€ÐµÐ½Ð¸Ñ Ð½Ð°ÑˆÐ¸Ñ… Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð¾Ð² Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸. ÐœÑ‹ ÐºÐ¾Ð½Ð²ÐµÑ€Ñ‚Ð¸Ñ€ÑƒÐµÐ¼ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð² Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ñ‹ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ.',
      },
      {
        id: 'assessment',
        title: '6. ÐŸÐ¾Ð´Ñ…Ð¾Ð´ Ðº Ð¾Ñ†ÐµÐ½ÐºÐµ',
        text: 'EKA Balance Ð¾Ñ†ÐµÐ½Ð¸Ð»Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð° Ñ Ð¿Ð¾Ð¼Ð¾Ñ‰ÑŒÑŽ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ñ… Ð¿Ð¾Ð´Ñ…Ð¾Ð´Ð¾Ð²:\n\nâ€¢ Ð¡Ð°Ð¼Ð¾Ð¾Ñ†ÐµÐ½ÐºÐ°.\nâ€¢ Ð’Ð½ÐµÑˆÐ½ÑÑ Ð¾Ñ†ÐµÐ½ÐºÐ° ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ð¼ ÑÐºÑÐ¿ÐµÑ€Ñ‚Ð¾Ð¼ Ð¿Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ (Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð°ÑƒÐ´Ð¸Ñ‚Ñ‹).',
      },
      {
        id: 'feedback',
        title: '7. ÐžÑ‚Ð·Ñ‹Ð²Ñ‹',
        text: 'ÐœÑ‹ Ð¿Ñ€Ð¸Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÐ¼ Ð²Ð°ÑˆÐ¸ Ð¾Ñ‚Ð·Ñ‹Ð²Ñ‹ Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ EKA Balance. ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, ÑÐ¾Ð¾Ð±Ñ‰Ð¸Ñ‚Ðµ Ð½Ð°Ð¼, ÐµÑÐ»Ð¸ Ð²Ñ‹ ÑÑ‚Ð¾Ð»ÐºÐ½ÐµÑ‚ÐµÑÑŒ Ñ Ð±Ð°Ñ€ÑŒÐµÑ€Ð°Ð¼Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð° Ð½Ð°ÑˆÐµÐ¼ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ðµ:\n\nâ€¢ Ð­Ð»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¿Ð¾Ñ‡Ñ‚Ð°: accessibility@ekabalance.com\n\nÐœÑ‹ ÑÑ‚Ð°Ñ€Ð°ÐµÐ¼ÑÑ Ð¾Ñ‚Ð²ÐµÑ‡Ð°Ñ‚ÑŒ Ð½Ð° Ð¾Ñ‚Ð·Ñ‹Ð²Ñ‹ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 2 Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ñ… Ð´Ð½ÐµÐ¹.',
      },
      {
        id: 'approval',
        title: '8. ÐžÑ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ðµ ÑÑ‚Ð¾Ð³Ð¾ Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ñ Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸',
        text: 'Ð­Ñ‚Ð¾ Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¾:\n\nÐ®Ñ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð¾Ñ‚Ð´ÐµÐ» Ð¸ Ð¾Ñ‚Ð´ÐµÐ» ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ñ EKA Balance\nÐ‘Ð°Ñ€ÑÐµÐ»Ð¾Ð½Ð°, Ð˜ÑÐ¿Ð°Ð½Ð¸Ñ',
      },
    ],
  },
};

export default function AccessibilityPage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = content[language];

  return (
    <div className="space-y-8">
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={() => setLanguage('en')}
          className={`rounded px-3 py-1 text-sm ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`rounded px-3 py-1 text-sm ${language === 'es' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('ca')}
          className={`rounded px-3 py-1 text-sm ${language === 'ca' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          CA
        </button>
        <button
          onClick={() => setLanguage('ru')}
          className={`rounded px-3 py-1 text-sm ${language === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          RU
        </button>
      </div>

      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.updated}</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{t.intro}</p>

        {t.sections.map((section, index) => (
          <section key={index} id={section.id} className="mb-8 scroll-mt-24">
            <h2 className="text-foreground mb-4 text-xl font-semibold">{section.title}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.text}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
