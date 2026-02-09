'use client';

import { useState } from 'react';
import { Globe, ArrowLeft, Leaf } from 'lucide-react';
import Link from 'next/link';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function EnvironmentalPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Environmental Policy',
      lastUpdated: 'Last Updated: March 15, 2024',
      intro:
        'EKA Balance recognizes that it has a responsibility to the environment beyond legal and regulatory requirements. We are committed to reducing our environmental impact and continually improving our environmental performance as an integral part of our business strategy and operating methods.',
      sections: [
        {
          title: '1. Responsibility',
          content:
            'The CEO is responsible for ensuring that the environmental policy is implemented. However, all employees have a responsibility in their area to ensure that the aims and objectives of the policy are met.',
        },
        {
          title: '2. Policy Aims',
          content:
            'We endeavor to:\n\n- Comply with and exceed all relevant regulatory requirements.\n- Continually improve and monitor environmental performance.\n- Continually improve and reduce environmental impacts.\n- Incorporate environmental factors into business decisions.\n- Increase employee awareness and training.',
        },
        {
          title: '3. Paper',
          content:
            '- We will minimize the use of paper in the office.\n- We will reduce packaging as much as possible.\n- We will seek to buy recycled and recyclable paper products.\n- We will reuse and recycle all paper where possible.',
        },
        {
          title: '4. Energy and Water',
          content:
            '- We will seek to reduce the amount of energy used as much as possible.\n- Lights and electrical equipment will be switched off when not in use.\n- Heating will be adjusted with energy consumption in mind.\n- The energy consumption and efficiency of new products will be taken into account when purchasing.',
        },
        {
          title: '5. Office Supplies',
          content:
            '- We will evaluate if the need can be met in another way.\n- We will evaluate if renting/sharing is an option before purchasing equipment.\n- We will evaluate the environmental impact of any new products we intend to purchase.\n- We will favor more environmentally friendly and efficient products wherever possible.',
        },
        {
          title: '6. Transportation',
          content:
            '- We will reduce the need to travel, restricting to necessity trips only.\n- We will promote the use of travel alternatives such as e-mail or video/phone conferencing.\n- We will make additional efforts to accommodate the needs of those using public transport or bicycles.',
        },
        {
          title: '7. Maintenance and Cleaning',
          content:
            '- Cleaning materials used will be as environmentally friendly as possible.\n- Materials used in office refurbishment will be as environmentally friendly as possible.\n- We will only use licensed and appropriate organizations to dispose of waste.',
        },
        {
          title: '8. Monitoring and Improvement',
          content:
            '- We will comply with and exceed all relevant regulatory requirements.\n- We will continually improve and monitor environmental performance.\n- We will continually improve and reduce environmental impacts.\n- We will incorporate environmental factors into business decisions.\n- We will increase employee awareness and training.',
        },
        {
          title: '9. Culture',
          content:
            '- We will involve staff in the implementation of this policy, for greater commitment and improved performance.\n- We will update this policy at least once annually in consultation with staff and other stakeholders where necessary.\n- We will provide staff with relevant environmental training.\n- We will work with suppliers, contractors and sub-contractors to improve their environmental performance.',
        },
      ],
    },
    es: {
      title: 'Política Ambiental',
      lastUpdated: 'Última actualización: 15 de marzo de 2024',
      intro:
        'EKA Balance reconoce que tiene una responsabilidad con el medio ambiente más allá de los requisitos legales y reglamentarios. Estamos comprometidos a reducir nuestro impacto ambiental y mejorar continuamente nuestro desempeño ambiental como parte integral de nuestra estrategia comercial y métodos operativos.',
      sections: [
        {
          title: '1. Responsabilidad',
          content:
            'El CEO es responsable de garantizar que se implemente la política ambiental. Sin embargo, todos los empleados tienen la responsabilidad en su área de garantizar que se cumplan los objetivos de la política.',
        },
        {
          title: '2. Objetivos de la Política',
          content:
            'Nos esforzamos por:\n\n- Cumplir y superar todos los requisitos reglamentarios pertinentes.\n- Mejorar y monitorear continuamente el desempeño ambiental.\n- Mejorar y reducir continuamente los impactos ambientales.\n- Incorporar factores ambientales en las decisiones comerciales.\n- Aumentar la conciencia y la formación de los empleados.',
        },
        {
          title: '3. Papel',
          content:
            '- Minimizaremos el uso de papel en la oficina.\n- Reduciremos el embalaje tanto como sea posible.\n- Buscaremos comprar productos de papel reciclado y reciclable.\n- Reutilizaremos y reciclaremos todo el papel siempre que sea posible.',
        },
        {
          title: '4. Energía y Agua',
          content:
            '- Buscaremos reducir la cantidad de energía utilizada tanto como sea posible.\n- Las luces y los equipos eléctricos se apagarán cuando no estén en uso.\n- La calefacción se ajustará teniendo en cuenta el consumo de energía.\n- El consumo de energía y la eficiencia de los nuevos productos se tendrán en cuenta al comprar.',
        },
        {
          title: '5. Suministros de Oficina',
          content:
            '- Evaluaremos si la necesidad se puede satisfacer de otra manera.\n- Evaluaremos si alquilar/compartir es una opción antes de comprar equipos.\n- Evaluaremos el impacto ambiental de cualquier producto nuevo que tengamos la intención de comprar.\n- Favoreceremos productos más ecológicos y eficientes siempre que sea posible.',
        },
        {
          title: '6. Transporte',
          content:
            '- Reduciremos la necesidad de viajar, restringiéndonos solo a viajes necesarios.\n- Promoveremos el uso de alternativas de viaje como el correo electrónico o las videoconferencias/conferencias telefónicas.\n- Haremos esfuerzos adicionales para satisfacer las necesidades de quienes utilizan el transporte público o bicicletas.',
        },
        {
          title: '7. Mantenimiento y Limpieza',
          content:
            '- Los materiales de limpieza utilizados serán lo más ecológicos posible.\n- Los materiales utilizados en la remodelación de oficinas serán lo más ecológicos posible.\n- Solo utilizaremos organizaciones autorizadas y apropiadas para eliminar los residuos.',
        },
        {
          title: '8. Monitoreo y Mejora',
          content:
            '- Cumpliremos y superaremos todos los requisitos reglamentarios pertinentes.\n- Mejoraremos y monitorearemos continuamente el desempeño ambiental.\n- Mejoraremos y reduciremos continuamente los impactos ambientales.\n- Incorporaremos factores ambientales en las decisiones comerciales.\n- Aumentaremos la conciencia y la formación de los empleados.',
        },
        {
          title: '9. Cultura',
          content:
            '- Involucraremos al personal en la implementación de esta política, para un mayor compromiso y un mejor desempeño.\n- Actualizaremos esta política al menos una vez al año en consulta con el personal y otras partes interesadas cuando sea necesario.\n- Proporcionaremos al personal formación ambiental relevante.\n- Trabajaremos con proveedores, contratistas y subcontratistas para mejorar su desempeño ambiental.',
        },
      ],
    },
    ca: {
      title: 'Política Ambiental',
      lastUpdated: 'Última actualització: 15 de març de 2024',
      intro:
        'EKA Balance reconeix que té una responsabilitat amb el medi ambient més enllà dels requisits legals i reglamentaris. Estem compromesos a reduir el nostre impacte ambiental i millorar contínuament el nostre rendiment ambiental com a part integral de la nostra estratègia comercial i mètodes operatius.',
      sections: [
        {
          title: '1. Responsabilitat',
          content:
            "El CEO és responsable de garantir que s'implementi la política ambiental. No obstant això, tots els empleats tenen la responsabilitat en la seva àrea de garantir que es compleixin els objectius de la política.",
        },
        {
          title: '2. Objectius de la Política',
          content:
            'Ens esforcem per:\n\n- Complir i superar tots els requisits reglamentaris pertinents.\n- Millorar i monitoritzar contínuament el rendiment ambiental.\n- Millorar i reduir contínuament els impactes ambientals.\n- Incorporar factors ambientals en les decisions comercials.\n- Augmentar la consciència i la formació dels empleats.',
        },
        {
          title: '3. Paper',
          content:
            "- Minimitzarem l'ús de paper a l'oficina.\n- Reduirem l'embalatge tant com sigui possible.\n- Buscarem comprar productes de paper reciclat i reciclable.\n- Reutilitzarem i reciclarem tot el paper sempre que sigui possible.",
        },
        {
          title: '4. Energia i Aigua',
          content:
            "- Buscarem reduir la quantitat d'energia utilitzada tant com sigui possible.\n- Els llums i els equips elèctrics s'apagaran quan no estiguin en ús.\n- La calefacció s'ajustarà tenint en compte el consum d'energia.\n- El consum d'energia i l'eficiència dels nous productes es tindran en compte en comprar.",
        },
        {
          title: "5. Subministraments d'Oficina",
          content:
            "- Avaluarem si la necessitat es pot satisfer d'una altra manera.\n- Avaluarem si llogar/compartir és una opció abans de comprar equips.\n- Avaluarem l'impacte ambiental de qualsevol producte nou que tinguem la intenció de comprar.\n- Afavorirem productes més ecològics i eficients sempre que sigui possible.",
        },
        {
          title: '6. Transport',
          content:
            "- Reduirem la necessitat de viatjar, restringint-nos només a viatges necessaris.\n- Promourem l'ús d'alternatives de viatge com el correu electrònic o les videoconferències/conferències telefòniques.\n- Farem esforços addicionals per satisfer les necessitats dels qui utilitzen el transport públic o bicicletes.",
        },
        {
          title: '7. Manteniment i Neteja',
          content:
            "- Els materials de neteja utilitzats seran el més ecològics possible.\n- Els materials utilitzats en la remodelació d'oficines seran el més ecològics possible.\n- Només utilitzarem organitzacions autoritzades i apropiades per eliminar els residus.",
        },
        {
          title: '8. Monitorització i Millora',
          content:
            '- Complirem i superarem tots els requisits reglamentaris pertinents.\n- Millorarem i monitoritzarem contínuament el rendiment ambiental.\n- Millorarem i reduirem contínuament els impactes ambientals.\n- Incorporarem factors ambientals en les decisions comercials.\n- Augmentarem la consciència i la formació dels empleats.',
        },
        {
          title: '9. Cultura',
          content:
            "- Involucrarem el personal en la implementació d'aquesta política, per a un major compromís i un millor rendiment.\n- Actualitzarem aquesta política almenys una vegada a l'any en consulta amb el personal i altres parts interessades quan sigui necessari.\n- Proporcionarem al personal formació ambiental rellevant.\n- Treballarem amb proveïdors, contractistes i subcontractistes per millorar el seu rendiment ambiental.",
        },
      ],
    },
    ru: {
      title: 'Экологическая политика',
      lastUpdated: 'Последнее обновление: 15 марта 2024 г.',
      intro:
        'EKA Balance признает, что несет ответственность перед окружающей средой, выходящую за рамки законодательных и нормативных требований. Мы стремимся снизить наше воздействие на окружающую среду и постоянно улучшать наши экологические показатели как неотъемлемую часть нашей бизнес-стратегии и методов работы.',
      sections: [
        {
          title: '1. Ответственность',
          content:
            'Генеральный директор несет ответственность за обеспечение реализации экологической политики. Тем не менее, все сотрудники несут ответственность в своей области за обеспечение достижения целей и задач политики.',
        },
        {
          title: '2. Цели политики',
          content:
            'Мы стремимся:\n\n- Соблюдать и превосходить все соответствующие нормативные требования.\n- Постоянно улучшать и контролировать экологические показатели.\n- Постоянно улучшать и снижать воздействие на окружающую среду.\n- Включать экологические факторы в бизнес-решения.\n- Повышать осведомленность и обучение сотрудников.',
        },
        {
          title: '3. Бумага',
          content:
            '- Мы сведем к минимуму использование бумаги в офисе.\n- Мы сократим упаковку, насколько это возможно.\n- Мы будем стремиться покупать переработанные и пригодные для вторичной переработки бумажные изделия.\n- Мы будем повторно использовать и перерабатывать всю бумагу, где это возможно.',
        },
        {
          title: '4. Энергия и вода',
          content:
            '- Мы будем стремиться сократить количество потребляемой энергии, насколько это возможно.\n- Свет и электрооборудование будут выключаться, когда они не используются.\n- Отопление будет регулироваться с учетом потребления энергии.\n- Потребление энергии и эффективность новых продуктов будут учитываться при покупке.',
        },
        {
          title: '5. Офисные принадлежности',
          content:
            '- Мы оценим, можно ли удовлетворить потребность другим способом.\n- Мы оценим, является ли аренда/совместное использование вариантом перед покупкой оборудования.\n- Мы оценим воздействие на окружающую среду любых новых продуктов, которые мы намерены приобрести.\n- Мы будем отдавать предпочтение более экологически чистым и эффективным продуктам, где это возможно.',
        },
        {
          title: '6. Транспорт',
          content:
            '- Мы сократим необходимость в поездках, ограничиваясь только необходимыми поездками.\n- Мы будем поощрять использование альтернатив поездкам, таких как электронная почта или видео/телефонные конференции.\n- Мы приложим дополнительные усилия для удовлетворения потребностей тех, кто пользуется общественным транспортом или велосипедами.',
        },
        {
          title: '7. Техническое обслуживание и уборка',
          content:
            '- Используемые чистящие средства будут максимально экологически чистыми.\n- Материалы, используемые при ремонте офиса, будут максимально экологически чистыми.\n- Мы будем использовать только лицензированные и соответствующие организации для утилизации отходов.',
        },
        {
          title: '8. Мониторинг и улучшение',
          content:
            '- Мы будем соблюдать и превосходить все соответствующие нормативные требования.\n- Мы будем постоянно улучшать и контролировать экологические показатели.\n- Мы будем постоянно улучшать и снижать воздействие на окружающую среду.\n- Мы будем включать экологические факторы в бизнес-решения.\n- Мы будем повышать осведомленность и обучение сотрудников.',
        },
        {
          title: '9. Культура',
          content:
            '- Мы будем привлекать персонал к реализации этой политики для большей приверженности и улучшения показателей.\n- Мы будем обновлять эту политику не реже одного раза в год после консультаций с персоналом и другими заинтересованными сторонами, где это необходимо.\n- Мы предоставим персоналу соответствующее экологическое обучение.\n- Мы будем работать с поставщиками, подрядчиками и субподрядчиками для улучшения их экологических показателей.',
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
        <div className="bg-card rounded-2xl p-8 shadow-sm md:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
            {content[language].title}
          </h1>

          <p className="text-muted-foreground mb-12 text-center">{content[language].lastUpdated}</p>

          <div className="prose prose-lg text-muted-foreground max-w-none">
            <p className="lead text-foreground mb-8 text-xl">{content[language].intro}</p>

            <div className="space-y-8">
              {content[language].sections.map((section, index) => (
                <div key={index} className="border-b border-border pb-8 last:border-0">
                  <h2 className="text-foreground mb-4 text-xl font-bold">{section.title}</h2>
                  <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 border-border mt-12 rounded-xl border p-6">
            <p className="text-muted-foreground text-center text-sm">
              {language === 'en' && 'We are committed to a sustainable future.'}
              {language === 'es' && 'Estamos comprometidos con un futuro sostenible.'}
              {language === 'ca' && 'Estem compromesos amb un futur sostenible.'}
              {language === 'ru' && 'Мы стремимся к устойчивому будущему.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
