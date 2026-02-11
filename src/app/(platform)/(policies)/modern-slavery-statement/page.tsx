'use client';

import { useState } from 'react';
import { Globe, ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ModernSlaveryStatement() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Modern Slavery Statement',
      lastUpdated: 'Last Updated: March 15, 2024',
      intro:
        'EKA Balance is committed to preventing acts of modern slavery and human trafficking from occurring within its business and supply chain, and imposes the same high standards on its suppliers.',
      sections: [
        {
          title: '1. Structure and Business',
          content:
            'EKA Balance is a digital mental health platform operating globally. We work with a network of therapists, technology providers, and other partners to deliver our services.',
        },
        {
          title: '2. Policies',
          content:
            'We have implemented policies to ensure that we are conducting business in an ethical and transparent manner. These include:\n\n- Recruitment Policy: We operate a robust recruitment policy, including conducting eligibility to work checks for all employees to safeguard against human trafficking or individuals being forced to work against their will.\n- Whistleblowing Policy: We operate a whistleblowing policy so that all employees know that they can raise concerns about how colleagues are being treated, or practices within our business or supply chain, without fear of reprisals.\n- Code of Conduct: This code explains the manner in which we behave as an organization and how we expect our employees and suppliers to act.',
        },
        {
          title: '3. Supply Chain',
          content:
            'Our supply chain includes IT hardware and software suppliers, professional services (legal, accounting), and office management services. We conduct due diligence on all suppliers before allowing them to become a preferred supplier.',
        },
        {
          title: '4. Risk Assessment',
          content:
            'We consider the risk of modern slavery within our business to be low. However, we remain vigilant and review our risks regularly.',
        },
        {
          title: '5. Training',
          content:
            'To ensure a high level of understanding of the risks of modern slavery and human trafficking in our supply chains and our business, we provide training to our staff.',
        },
        {
          title: '6. Future Steps',
          content:
            'We will continue to review our policies and procedures to ensure they are effective in preventing modern slavery from occurring in our business or supply chain.',
        },
      ],
    },
    es: {
      title: 'Declaración sobre la Esclavitud Moderna',
      lastUpdated: 'Última actualización: 15 de marzo de 2024',
      intro:
        'EKA Balance se compromete a prevenir que ocurran actos de esclavitud moderna y trata de personas dentro de su negocio y cadena de suministro, e impone los mismos altos estándares a sus proveedores.',
      sections: [
        {
          title: '1. Estructura y Negocio',
          content:
            'EKA Balance es una plataforma digital de salud mental que opera a nivel mundial. Trabajamos con una red de terapeutas, proveedores de tecnología y otros socios para prestar nuestros servicios.',
        },
        {
          title: '2. Políticas',
          content:
            'Hemos implementado políticas para garantizar que realizamos negocios de manera ética y transparente. Estas incluyen:\n\n- Política de Contratación: Operamos una política de contratación sólida, que incluye la realización de comprobaciones de elegibilidad para trabajar para todos los empleados con el fin de proteger contra la trata de personas o las personas obligadas a trabajar en contra de su voluntad.\n- Política de Denuncias: Operamos una política de denuncias para que todos los empleados sepan que pueden plantear inquietudes sobre cómo se trata a los colegas, o prácticas dentro de nuestro negocio o cadena de suministro, sin temor a represalias.\n- Código de Conducta: Este código explica la manera en que nos comportamos como organización y cómo esperamos que actúen nuestros empleados y proveedores.',
        },
        {
          title: '3. Cadena de Suministro',
          content:
            'Nuestra cadena de suministro incluye proveedores de hardware y software de TI, servicios profesionales (legales, contables) y servicios de gestión de oficinas. Realizamos la debida diligencia con todos los proveedores antes de permitirles convertirse en proveedores preferentes.',
        },
        {
          title: '4. Evaluación de Riesgos',
          content:
            'Consideramos que el riesgo de esclavitud moderna dentro de nuestro negocio es bajo. Sin embargo, nos mantenemos vigilantes y revisamos nuestros riesgos regularmente.',
        },
        {
          title: '5. Formación',
          content:
            'Para garantizar un alto nivel de comprensión de los riesgos de la esclavitud moderna y la trata de personas en nuestras cadenas de suministro y nuestro negocio, brindamos formación a nuestro personal.',
        },
        {
          title: '6. Pasos Futuros',
          content:
            'Continuaremos revisando nuestras políticas y procedimientos para garantizar que sean efectivos para prevenir que ocurra la esclavitud moderna en nuestro negocio o cadena de suministro.',
        },
      ],
    },
    ca: {
      title: "Declaració sobre l'Esclavitud Moderna",
      lastUpdated: 'Última actualització: 15 de març de 2024',
      intro:
        "EKA Balance es compromet a prevenir que es produeixin actes d'esclavitud moderna i tràfic de persones dins del seu negoci i cadena de subministrament, i imposa els mateixos alts estàndards als seus proveïdors.",
      sections: [
        {
          title: '1. Estructura i Negoci',
          content:
            'EKA Balance és una plataforma digital de salut mental que opera a nivell mundial. Treballem amb una xarxa de terapeutes, proveïdors de tecnologia i altres socis per prestar els nostres serveis.',
        },
        {
          title: '2. Polítiques',
          content:
            "Hem implementat polítiques per garantir que realitzem negocis de manera ètica i transparent. Aquestes inclouen:\n\n- Política de Contractació: Operem una política de contractació sòlida, que inclou la realització de comprovacions d'elegibilitat per treballar per a tots els empleats amb la finalitat de protegir contra el tràfic de persones o les persones obligades a treballar en contra de la seva voluntat.\n- Política de Denúncies: Operem una política de denúncies perquè tots els empleats sàpiguen que poden plantejar inquietuds sobre com es tracta els col·legues, o pràctiques dins del nostre negoci o cadena de subministrament, sense por a represàlies.\n- Codi de Conducta: Aquest codi explica la manera en què ens comportem com a organització i com esperem que actuïn els nostres empleats i proveïdors.",
        },
        {
          title: '3. Cadena de Subministrament',
          content:
            "La nostra cadena de subministrament inclou proveïdors de maquinari i programari de TI, serveis professionals (legals, comptables) i serveis de gestió d'oficines. Realitzem la deguda diligència amb tots els proveïdors abans de permetre'ls convertir-se en proveïdors preferents.",
        },
        {
          title: '4. Avaluació de Riscos',
          content:
            "Considerem que el risc d'esclavitud moderna dins del nostre negoci és baix. No obstant això, ens mantenim vigilants i revisem els nostres riscos regularment.",
        },
        {
          title: '5. Formació',
          content:
            "Per garantir un alt nivell de comprensió dels riscos de l'esclavitud moderna i el tràfic de persones en les nostres cadenes de subministrament i el nostre negoci, oferim formació al nostre personal.",
        },
        {
          title: '6. Passos Futurs',
          content:
            "Continuarem revisant les nostres polítiques i procediments per garantir que siguin efectius per prevenir que es produeixi l'esclavitud moderna en el nostre negoci o cadena de subministrament.",
        },
      ],
    },
    ru: {
      title: 'Заявление о современном рабстве',
      lastUpdated: 'Последнее обновление: 15 марта 2024 г.',
      intro:
        'EKA Balance стремится предотвращать акты современного рабства и торговли людьми в рамках своего бизнеса и цепочки поставок и предъявляет такие же высокие требования к своим поставщикам.',
      sections: [
        {
          title: '1. Структура и бизнес',
          content:
            'EKA Balance — это цифровая платформа психического здоровья, работающая по всему миру. Мы работаем с сетью терапевтов, поставщиков технологий и других партнеров для предоставления наших услуг.',
        },
        {
          title: '2. Политики',
          content:
            'Мы внедрили политики, гарантирующие, что мы ведем бизнес этично и прозрачно. К ним относятся:\n\n- Политика найма: Мы проводим надежную политику найма, включая проверку права на работу для всех сотрудников, чтобы защитить от торговли людьми или принуждения людей к работе против их воли.\n- Политика информирования о нарушениях: Мы проводим политику информирования о нарушениях, чтобы все сотрудники знали, что они могут высказывать опасения по поводу того, как обращаются с коллегами, или практики в нашем бизнесе или цепочке поставок, не опасаясь репрессий.\n- Кодекс поведения: Этот кодекс объясняет, как мы ведем себя как организация и как мы ожидаем, что будут действовать наши сотрудники и поставщики.',
        },
        {
          title: '3. Цепочка поставок',
          content:
            'Наша цепочка поставок включает поставщиков ИТ-оборудования и программного обеспечения, профессиональные услуги (юридические, бухгалтерские) и услуги по управлению офисом. Мы проводим комплексную проверку всех поставщиков, прежде чем разрешить им стать предпочтительным поставщиком.',
        },
        {
          title: '4. Оценка рисков',
          content:
            'Мы считаем риск современного рабства в нашем бизнесе низким. Тем не менее, мы сохраняем бдительность и регулярно пересматриваем наши риски.',
        },
        {
          title: '5. Обучение',
          content:
            'Чтобы обеспечить высокий уровень понимания рисков современного рабства и торговли людьми в наших цепочках поставок и нашем бизнесе, мы проводим обучение для наших сотрудников.',
        },
        {
          title: '6. Будущие шаги',
          content:
            'Мы продолжим пересматривать наши политики и процедуры, чтобы гарантировать их эффективность в предотвращении современного рабства в нашем бизнесе или цепочке поставок.',
        },
      ],
    },
  };

  return (
    <div className="bg-muted/30 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Legal Center</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Globe className="text-muted-foreground h-4 w-4" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-muted-foreground cursor-pointer border-none bg-transparent text-sm font-medium focus:ring-0"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="ca">Català</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-card rounded-lg p-8 shadow-sm md:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Scale className="h-8 w-8 text-accent-foreground" />
          </div>

          <h1 className="text-foreground mb-4 text-center text-3xl font-semibold md:text-4xl">
            {content[language].title}
          </h1>

          <p className="text-muted-foreground mb-12 text-center">{content[language].lastUpdated}</p>

          <div className="prose prose-lg text-muted-foreground max-w-none">
            <p className="lead text-foreground mb-8 text-xl">{content[language].intro}</p>

            <div className="space-y-8">
              {content[language].sections.map((section, index) => (
                <div key={index} className="border-b border-border pb-8 last:border-0">
                  <h2 className="text-foreground mb-4 text-xl font-semibold">{section.title}</h2>
                  <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 border-border mt-12 rounded-xl border p-6">
            <p className="text-muted-foreground text-center text-sm">
              {language === 'en' &&
                'This statement is made pursuant to section 54(1) of the Modern Slavery Act 2015.'}
              {language === 'es' &&
                'Esta declaración se realiza de conformidad con la sección 54(1) de la Ley de Esclavitud Moderna de 2015.'}
              {language === 'ca' &&
                "Aquesta declaració es realitza de conformitat amb la secció 54(1) de la Llei d'Esclavitud Moderna de 2015."}
              {language === 'ru' &&
                'Это заявление сделано в соответствии с разделом 54(1) Закона о современном рабстве 2015 года.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
