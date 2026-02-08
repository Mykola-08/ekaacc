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
        text: 'EKA Balance takes the following measures to ensure accessibility of our website:\n\n• Include accessibility as part of our mission statement.\n• Integrate accessibility into our procurement practices.\n• Appoint an accessibility officer and/or ombudsperson.\n• Provide continual accessibility training for our staff.\n• Assign clear accessibility targets and responsibilities.\n• Employ formal accessibility quality assurance methods.',
      },
      {
        id: 'compatibility',
        title: '3. Compatibility with Browsers and Assistive Technology',
        text: 'The EKA Balance website is designed to be compatible with the following assistive technologies:\n\n• Popular screen readers (e.g., NVDA, JAWS, VoiceOver).\n• Screen magnifiers and speech recognition software.\n• Standard operating system accessibility features.\n\nThe website is designed to be compatible with the latest versions of major web browsers, including Chrome, Firefox, Safari, and Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Technical Specifications',
        text: 'Accessibility of EKA Balance relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:\n\n• HTML\n• WAI-ARIA\n• CSS\n• JavaScript\n\nThese technologies are relied upon for conformance with the accessibility standards used.',
      },
      {
        id: 'limitations',
        title: '5. Limitations and Alternatives',
        text: 'Despite our best efforts to ensure accessibility of the EKA Balance website, there may be some limitations. Below is a description of known limitations and potential solutions. Please contact us if you observe an issue not listed below.\n\nKnown limitations:\n• **User-generated content**: Some content uploaded by users may not have text alternatives. We monitor user content and typically repair issues within 2 business days.\n• **Archived documents**: Older documents might not work with current assistive technologies because they were published before our current accessibility standards were implemented. We convert documents to accessible formats upon request.',
      },
      {
        id: 'assessment',
        title: '6. Assessment Approach',
        text: 'EKA Balance assessed the accessibility of our website by the following approaches:\n\n• Self-evaluation.\n• External evaluation by a third-party accessibility expert (periodic audits).',
      },
      {
        id: 'feedback',
        title: '7. Feedback',
        text: 'We welcome your feedback on the accessibility of EKA Balance. Please let us know if you encounter accessibility barriers on our website:\n\n• E-mail: accessibility@ekabalance.com\n\nWe try to respond to feedback within 2 business days.',
      },
      {
        id: 'approval',
        title: '8. Formal Approval of this Accessibility Statement',
        text: 'This Accessibility Statement is approved by:\n\nEKA Balance Legal & Compliance Department\nBarcelona, Spain',
      },
    ],
  },
  es: {
    title: 'Declaración de Accesibilidad',
    updated: 'Última actualización: 25 de noviembre de 2025',
    intro:
      'EKA Balance se compromete a garantizar la accesibilidad digital para personas con discapacidades. Estamos mejorando continuamente la experiencia del usuario para todos y aplicando los estándares de accesibilidad pertinentes. Creemos que Internet debe estar disponible y ser accesible para cualquier persona, y nos comprometemos a proporcionar un sitio web que sea accesible para la audiencia más amplia posible, independientemente de las circunstancias y la capacidad.',
    sections: [
      {
        id: 'conformance-status',
        title: '1. Estado de Conformidad',
        text: 'Las Pautas de Accesibilidad al Contenido en la Web (WCAG) definen los requisitos para diseñadores y desarrolladores para mejorar la accesibilidad para personas con discapacidades. Define tres niveles de conformidad: Nivel A, Nivel AA y Nivel AAA. EKA Balance es parcialmente conforme con WCAG 2.1 nivel AA. Parcialmente conforme significa que algunas partes del contenido no cumplen totalmente con el estándar de accesibilidad, aunque estamos trabajando activamente para resolver estas brechas.',
      },
      {
        id: 'measures',
        title: '2. Medidas para Apoyar la Accesibilidad',
        text: 'EKA Balance toma las siguientes medidas para garantizar la accesibilidad de nuestro sitio web:\n\n• Incluir la accesibilidad como parte de nuestra declaración de misión.\n• Integrar la accesibilidad en nuestras prácticas de adquisición.\n• Nombrar un oficial de accesibilidad y/o defensor del pueblo.\n• Proporcionar capacitación continua en accesibilidad para nuestro personal.\n• Asignar objetivos y responsabilidades de accesibilidad claros.\n• Emplear métodos formales de garantía de calidad de accesibilidad.',
      },
      {
        id: 'compatibility',
        title: '3. Compatibilidad con Navegadores y Tecnología de Asistencia',
        text: 'El sitio web de EKA Balance está diseñado para ser compatible con las siguientes tecnologías de asistencia:\n\n• Lectores de pantalla populares (por ejemplo, NVDA, JAWS, VoiceOver).\n• Lupas de pantalla y software de reconocimiento de voz.\n• Características de accesibilidad estándar del sistema operativo.\n\nEl sitio web está diseñado para ser compatible con las últimas versiones de los principales navegadores web, incluidos Chrome, Firefox, Safari y Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Especificaciones Técnicas',
        text: "La accesibilidad de EKA Balance se basa en les següents tecnologies per funcionar amb la combinació particular de navegador web i qualsevol tecnologia d'assistència o complements instal·lats al seu ordinador:\n\n• HTML\n• WAI-ARIA\n• CSS\n• JavaScript\n\nSe confía en estas tecnologías para la conformidad con los estándares de accesibilidad utilizados.",
      },
      {
        id: 'limitations',
        title: '5. Limitaciones y Alternativas',
        text: 'A pesar de nuestros mejores esfuerzos para garantizar la accesibilidad del sitio web de EKA Balance, puede haber algunas limitaciones. A continuación se describe una descripción de las limitaciones conocidas y las posibles soluciones. Póngase en contacto con nosotros si observa un problema que no figura a continuación.\n\nLimitaciones conocidas:\n• **Contenido generado por el usuario**: Parte del contenido subido por los usuarios puede no tener alternativas de texto. Supervisamos el contenido del usuario y generalmente reparamos los problemas dentro de los 2 días hábiles.\n• **Documentos archivados**: Es posible que los documentos más antiguos no funcionen con las tecnologías de asistencia actuales porque se publicaron antes de que se implementaran nuestros estándares de accesibilidad actuales. Convertimos documentos a formatos accesibles a pedido.',
      },
      {
        id: 'assessment',
        title: '6. Enfoque de Evaluación',
        text: 'EKA Balance evaluó la accesibilidad de nuestro sitio web mediante los siguientes enfoques:\n\n• Autoevaluación.\n• Evaluación externa por un experto en accesibilidad externo (auditorías periódicas).',
      },
      {
        id: 'feedback',
        title: '7. Comentarios',
        text: 'Agradecemos sus comentarios sobre la accesibilidad de EKA Balance. Háganos saber si encuentra barreras de accesibilidad en nuestro sitio web:\n\n• Correo electrónico: accessibility@ekabalance.com\n\nIntentamos responder a los comentarios dentro de los 2 días hábiles.',
      },
      {
        id: 'approval',
        title: '8. Aprobación Formal de esta Declaración de Accesibilidad',
        text: 'Esta Declaración de Accesibilidad está aprobada por:\n\nDepartamento Legal y de Cumplimiento de EKA Balance\nBarcelona, España',
      },
    ],
  },
  ca: {
    title: "Declaració d'Accessibilitat",
    updated: 'Darrera actualització: 25 de novembre de 2025',
    intro:
      "EKA Balance es compromet a garantir l'accessibilitat digital per a persones amb discapacitats. Estem millorant contínuament l'experiència de l'usuari per a tothom i aplicant els estàndards d'accessibilitat pertinents. Creiem que Internet ha d'estar disponible i ser accessible per a qualsevol persona, i ens comprometem a proporcionar un lloc web que sigui accessible per a l'audiència més àmplia possible, independentment de les circumstàncies i la capacitat.",
    sections: [
      {
        id: 'conformance-status',
        title: '1. Estat de Conformitat',
        text: "Les Pautes d'Accessibilitat al Contingut a la Web (WCAG) defineixen els requisits per a dissenyadors i desenvolupadors per millorar l'accessibilitat per a persones amb discapacitats. Defineix tres nivells de conformitat: Nivell A, Nivell AA i Nivell AAA. EKA Balance és parcialment conforme amb WCAG 2.1 nivell AA. Parcialment conforme significa que algunes parts del contingut no compleixen totalment amb l'estàndard d'accessibilitat, tot i que estem treballant activament per resoldre aquestes bretxes.",
      },
      {
        id: 'measures',
        title: "2. Mesures per Donar Suport a l'Accessibilitat",
        text: "EKA Balance pren les següents mesures per garantir l'accessibilitat del nostre lloc web:\n\n• Incloure l'accessibilitat com a part de la nostra declaració de missió.\n• Integrar l'accessibilitat en les nostres pràctiques d'adquisició.\n• Nomenar un oficial d'accessibilitat i/o defensor del poble.\n• Proporcionar formació contínua en accessibilitat per al nostre personal.\n• Assignar objectius i responsabilitats d'accessibilitat clars.\n• Emprar mètodes formals de garantia de qualitat d'accessibilitat.",
      },
      {
        id: 'compatibility',
        title: "3. Compatibilitat amb Navegadors i Tecnologia d'Assistència",
        text: "El lloc web d'EKA Balance està dissenyat per ser compatible amb les següents tecnologies d'assistència:\n\n• Lectors de pantalla populars (per exemple, NVDA, JAWS, VoiceOver).\n• Lupes de pantalla i programari de reconeixement de veu.\n• Característiques d'accessibilitat estàndard del sistema operatiu.\n\nEl lloc web està dissenyat per ser compatible amb les últimes versions dels principals navegadors web, inclosos Chrome, Firefox, Safari i Edge.",
      },
      {
        id: 'technical-specifications',
        title: '4. Especificacions Tècniques',
        text: "L'accessibilitat d'EKA Balance es basa en les següents tecnologies per funcionar amb la combinació particular de navegador web i qualsevol tecnologia d'assistència o complements instal·lats al seu ordinador:\n\n• HTML\n• WAI-ARIA\n• CSS\n• JavaScript\n\nEs confia en aquestes tecnologies per a la conformitat amb els estàndards d'accessibilitat utilitzats.",
      },
      {
        id: 'limitations',
        title: '5. Limitacions i Alternatives',
        text: "Malgrat els nostres millors esforços per garantir l'accessibilitat del lloc web d'EKA Balance, pot haver-hi algunes limitacions. A continuació es descriu una descripció de les limitacions conegudes i les possibles solucions. Posi's en contacte amb nosaltres si observa un problema que no figura a continuació.\n\nLimitacions conegudes:\n• **Contingut generat per l'usuari**: Part del contingut pujat pels usuaris pot no tenir alternatives de text. Supervisem el contingut de l'usuari i generalment reparem els problemes dins dels 2 dies hàbils.\n• **Documents arxivats**: És possible que els documents més antics no funcionin amb les tecnologies d'assistència actuals perquè es van publicar abans que s'implementessin els nostres estàndards d'accessibilitat actuals. Convertim documents a formats accessibles a petició.",
      },
      {
        id: 'assessment',
        title: "6. Enfocament d'Avaluació",
        text: "EKA Balance va avaluar l'accessibilitat del nostre lloc web mitjançant els següents enfocaments:\n\n• Autoavaluació.\n• Avaluació externa per un expert en accessibilitat extern (auditories periòdiques).",
      },
      {
        id: 'feedback',
        title: '7. Comentaris',
        text: "Agraïm els seus comentaris sobre l'accessibilitat d'EKA Balance. Faci'ns saber si troba barreres d'accessibilitat al nostre lloc web:\n\n• Correu electrònic: accessibility@ekabalance.com\n\nIntentem respondre als comentaris dins dels 2 dies hàbils.",
      },
      {
        id: 'approval',
        title: "8. Aprobació Formal d'aquesta Declaració d'Accessibilitat",
        text: "Aquesta Declaració d'Accessibilitat està aprovada per:\n\nDepartament Legal i de Compliment d'EKA Balance\nBarcelona, Espanya",
      },
    ],
  },
  ru: {
    title: 'Заявление о доступности',
    updated: 'Последнее обновление: 25 ноября 2025 г.',
    intro:
      'EKA Balance стремится обеспечить цифровую доступность для людей с ограниченными возможностями. Мы постоянно улучшаем пользовательский опыт для всех и применяем соответствующие стандарты доступности. Мы считаем, что Интернет должен быть доступен и открыт для всех, и стремимся предоставить веб-сайт, доступный для максимально широкой аудитории, независимо от обстоятельств и способностей.',
    sections: [
      {
        id: 'conformance-status',
        title: '1. Статус соответствия',
        text: 'Руководство по обеспечению доступности веб-контента (WCAG) определяет требования для дизайнеров и разработчиков по улучшению доступности для людей с ограниченными возможностями. Оно определяет три уровня соответствия: Уровень A, Уровень AA и Уровень AAA. EKA Balance частично соответствует уровню AA WCAG 2.1. Частичное соответствие означает, что некоторые части контента не полностью соответствуют стандарту доступности, хотя мы активно работаем над устранением этих пробелов.',
      },
      {
        id: 'measures',
        title: '2. Меры по поддержке доступности',
        text: 'EKA Balance принимает следующие меры для обеспечения доступности нашего веб-сайта:\n\n• Включение доступности в нашу миссию.\n• Интеграция доступности в наши практики закупок.\n• Назначение ответственного за доступность и/или омбудсмена.\n• Обеспечение постоянного обучения доступности для нашего персонала.\n• Назначение четких целей и обязанностей по обеспечению доступности.\n• Использование формальных методов обеспечения качества доступности.',
      },
      {
        id: 'compatibility',
        title: '3. Совместимость с браузерами и вспомогательными технологиями',
        text: 'Веб-сайт EKA Balance разработан для совместимости со следующими вспомогательными технологиями:\n\n• Популярные программы чтения с экрана (например, NVDA, JAWS, VoiceOver).\n• Экранные лупы и программное обеспечение для распознавания речи.\n• Стандартные функции доступности операционной системы.\n\nВеб-сайт разработан для совместимости с последними версиями основных веб-браузеров, включая Chrome, Firefox, Safari и Edge.',
      },
      {
        id: 'technical-specifications',
        title: '4. Технические характеристики',
        text: 'Доступность EKA Balance зависит от следующих технологий для работы с конкретной комбинацией веб-браузера и любых вспомогательных технологий или плагинов, установленных на вашем компьютере:\n\n• HTML\n• WAI-ARIA\n• CSS\n• JavaScript\n\nЭти технологии используются для обеспечения соответствия используемым стандартам доступности.',
      },
      {
        id: 'limitations',
        title: '5. Ограничения и альтернативы',
        text: 'Несмотря на наши усилия по обеспечению доступности веб-сайта EKA Balance, могут быть некоторые ограничения. Ниже приведено описание известных ограничений и возможных решений. Пожалуйста, свяжитесь с нами, если вы заметите проблему, не указанную ниже.\n\nИзвестные ограничения:\n• **Пользовательский контент**: Некоторый контент, загруженный пользователями, может не иметь текстовых альтернатив. Мы отслеживаем пользовательский контент и обычно устраняем проблемы в течение 2 рабочих дней.\n• **Архивные документы**: Старые документы могут не работать с текущими вспомогательными технологиями, поскольку они были опубликованы до внедрения наших текущих стандартов доступности. Мы конвертируем документы в доступные форматы по запросу.',
      },
      {
        id: 'assessment',
        title: '6. Подход к оценке',
        text: 'EKA Balance оценила доступность нашего веб-сайта с помощью следующих подходов:\n\n• Самооценка.\n• Внешняя оценка сторонним экспертом по доступности (периодические аудиты).',
      },
      {
        id: 'feedback',
        title: '7. Отзывы',
        text: 'Мы приветствуем ваши отзывы о доступности EKA Balance. Пожалуйста, сообщите нам, если вы столкнетесь с барьерами доступности на нашем веб-сайте:\n\n• Электронная почта: accessibility@ekabalance.com\n\nМы стараемся отвечать на отзывы в течение 2 рабочих дней.',
      },
      {
        id: 'approval',
        title: '8. Официальное утверждение этого Заявления о доступности',
        text: 'Это Заявление о доступности утверждено:\n\nЮридический отдел и отдел соответствия EKA Balance\nБарселона, Испания',
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
          className={`rounded px-3 py-1 text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`rounded px-3 py-1 text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('ca')}
          className={`rounded px-3 py-1 text-sm ${language === 'ca' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          CA
        </button>
        <button
          onClick={() => setLanguage('ru')}
          className={`rounded px-3 py-1 text-sm ${language === 'ru' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          RU
        </button>
      </div>

      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{t.title}</h1>
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
