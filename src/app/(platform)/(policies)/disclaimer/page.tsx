'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Disclaimer & Legal Notice',
    updated: 'Last Updated: November 25, 2025',
    sections: [
      {
        id: 'medical-disclaimer',
        title: '1. Medical Disclaimer',
        text: 'The content, products, and services offered by EKA Balance ("Company", "we", "us", or "our") are strictly for informational, educational, and self-help purposes only. Nothing on this website, including text, graphics, images, audio, video, and other material, constitutes medical advice, diagnosis, or treatment. The information provided is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, psychotherapist, or other qualified health provider with any questions you may have regarding a medical condition or mental health concern. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.',
      },
      {
        id: 'emergency-warning',
        title: '2. Emergency Warning',
        text: 'If you are experiencing a medical emergency, a mental health crisis, are thinking about suicide, or feel that you may be a danger to yourself or others, do not use this website or our services. Call your local emergency services immediately (e.g., 911 in the US, 112 in Europe, 999 in the UK) or go to the nearest hospital emergency room. EKA Balance is not a crisis intervention service and does not provide emergency support.',
      },
      {
        id: 'no-relationship',
        title: '3. No Professional Relationship',
        text: 'Your use of this website, including the purchase of any courses, products, or participation in any programs, does not establish a doctor-patient, therapist-client, or any other professional relationship between you and EKA Balance or any of its professionals, employees, or contractors. Such a relationship is only established through a signed written agreement and specific professional engagement where an assessment has been completed.',
      },
      {
        id: 'personal-responsibility',
        title: '4. Personal Responsibility',
        text: 'You acknowledge that you are participating voluntarily in using our website and services and that you are solely and personally responsible for your choices, actions, and results, now and in the future. You accept full responsibility for the consequences of your use, or non-use, of any information provided on or through this website, and you agree to use your own judgment and due diligence before implementing any idea, suggestion, or recommendation from this website to your life, family, or business.',
      },
      {
        id: 'testimonials',
        title: '5. Testimonials and Results',
        text: 'Testimonials, case studies, and examples found on this website are actual results from users of our products and/or services, but they are not intended to represent or guarantee that anyone will achieve the same or similar results. Individual results vary depending on personal history, motivation, commitment, background, and other factors. We do not guarantee any specific results or outcomes.',
      },
      {
        id: 'liability',
        title: '6. Limitation of Liability',
        text: 'To the fullest extent permitted by law, EKA Balance shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service. We expressly exclude any liability for any action you may take or loss or injury you may suffer (direct or indirect including loss of pay, profit, opportunity or time, pain and suffering, any nature of loss) as a result of relying on any information on this website.',
      },
      {
        id: 'external-links',
        title: '7. External Links',
        text: 'This website may contain links to third-party websites. These links are provided solely as a convenience to you and not as an endorsement by us of the contents on such third-party websites. We are not responsible for the content of linked third-party sites and do not make any representations regarding the content or accuracy of materials on such third-party websites. If you decide to access linked third-party websites, you do so at your own risk.',
      },
      {
        id: 'jurisdiction',
        title: '8. Jurisdiction and Governing Law',
        text: 'This disclaimer shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions. Any disputes arising out of or in connection with this disclaimer shall be subject to the exclusive jurisdiction of the courts of Barcelona, Spain.',
      },
    ],
  },
  es: {
    title: 'Descargo de Responsabilidad y Aviso Legal',
    updated: 'Última actualización: 25 de noviembre de 2025',
    sections: [
      {
        title: '1. Descargo Médico',
        text: 'El contenido, productos y servicios ofrecidos por EKA Balance ("Compañía", "nosotros", "nos" o "nuestro") son estrictamente para fines informativos, educativos y de autoayuda. Nada en este sitio web, incluyendo texto, gráficos, imágenes, audio, video y otro material, constituye consejo médico, diagnóstico o tratamiento. La información proporcionada no pretende sustituir el consejo médico profesional, diagnóstico o tratamiento. Busque siempre el consejo de su médico, psicoterapeuta u otro proveedor de salud calificado con cualquier pregunta que pueda tener sobre una condición médica o problema de salud mental. Nunca ignore el consejo médico profesional ni se demore en buscarlo debido a algo que haya leído en este sitio web.',
      },
      {
        title: '2. Advertencia de Emergencia',
        text: 'Si está experimentando una emergencia médica, una crisis de salud mental, está pensando en el suicidio o siente que puede ser un peligro para usted mismo o para otros, no utilice este sitio web ni nuestros servicios. Llame a los servicios de emergencia locales inmediatamente (por ejemplo, 112 en Europa, 911 en EE. UU.) o vaya a la sala de emergencias del hospital más cercano. EKA Balance no es un servicio de intervención en crisis y no proporciona apoyo de emergencia.',
      },
      {
        title: '3. Sin Relación Profesional',
        text: 'El uso de este sitio web, incluida la compra de cursos, productos o la participación en cualquier programa, no establece una relación médico-paciente, terapeuta-cliente o cualquier otra relación profesional entre usted y EKA Balance o cualquiera de sus profesionales, empleados o contratistas. Dicha relación solo se establece a través de un acuerdo escrito firmado y un compromiso profesional específico donde se haya completado una evaluación.',
      },
      {
        title: '4. Responsabilidad Personal',
        text: 'Usted reconoce que participa voluntariamente en el uso de nuestro sitio web y servicios y que es única y personalmente responsable de sus elecciones, acciones y resultados, ahora y en el futuro. Usted acepta la total responsabilidad por las consecuencias de su uso, o no uso, de cualquier información proporcionada en o a través de este sitio web, y acepta utilizar su propio juicio y diligencia debida antes de implementar cualquier idea, sugerencia o recomendación de este sitio web en su vida, familia o negocio.',
      },
      {
        title: '5. Testimonios y Resultados',
        text: 'Los testimonios, estudios de casos y ejemplos que se encuentran en este sitio web son resultados reales de usuarios de nuestros productos y/o servicios, pero no pretenden representar ni garantizar que nadie logre los mismos o similares resultados. Los resultados individuales varían según la historia personal, la motivación, el compromiso, los antecedentes y otros factores. No garantizamos ningún resultado o desenlace específico.',
      },
      {
        title: '6. Limitación de Responsabilidad',
        text: 'En la medida máxima permitida por la ley, EKA Balance no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o ejemplar, incluidos, entre otros, daños por pérdida de beneficios, buena voluntad, uso, datos u otras pérdidas intangibles resultantes del uso o la imposibilidad de usar el servicio. Excluimos expresamente cualquier responsabilidad por cualquier acción que pueda tomar o pérdida o lesión que pueda sufrir (directa o indirecta, incluida la pérdida de pago, beneficio, oportunidad o tiempo, dolor y sufrimiento, cualquier naturaleza de pérdida) como resultado de confiar en cualquier información de este sitio web.',
      },
      {
        title: '7. Enlaces Externos',
        text: 'Este sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia y no como un respaldo por nuestra parte de los contenidos de dichos sitios web de terceros. No somos responsables del contenido de los sitios de terceros vinculados y no hacemos ninguna representación con respecto al contenido o la precisión de los materiales en dichos sitios web de terceros. Si decide acceder a sitios web de terceros vinculados, lo hace bajo su propio riesgo.',
      },
      {
        title: '8. Jurisdicción y Ley Aplicable',
        text: 'Este descargo de responsabilidad se regirá e interpretará de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja de o en relación con este descargo de responsabilidad estará sujeta a la jurisdicción exclusiva de los tribunales de Barcelona, España.',
      },
    ],
  },
  ca: {
    title: 'Descàrrec de Responsabilitat i Avís Legal',
    updated: 'Última actualització: 25 de novembre de 2025',
    sections: [
      {
        title: '1. Descàrrec Mèdic',
        text: 'El contingut, productes i serveis oferts per EKA Balance ("Companyia", "nosaltres", "ens" o "nostre") són estrictament per a finalitats informatives, educatives i d\'autoajuda. Res en aquest lloc web, incloent text, gràfics, imatges, àudio, vídeo i altre material, constitueix consell mèdic, diagnòstic o tractament. La informació proporcionada no pretén substituir el consell mèdic professional, diagnòstic o tractament. Busqueu sempre el consell del vostre metge, psicoterapeuta o altre proveïdor de salut qualificat amb qualsevol pregunta que pugueu tenir sobre una condició mèdica o problema de salut mental. Mai ignoreu el consell mèdic professional ni us demoreu en buscar-lo a causa d\'alguna cosa que hàgiu llegit en aquest lloc web.',
      },
      {
        title: "2. Advertència d'Emergència",
        text: "Si esteu experimentant una emergència mèdica, una crisi de salut mental, esteu pensant en el suïcidi o sentiu que podeu ser un perill per a vosaltres mateixos o per als altres, no utilitzeu aquest lloc web ni els nostres serveis. Truqueu als serveis d'emergència locals immediatament (per exemple, 112 a Europa) o aneu a la sala d'emergències de l'hospital més proper. EKA Balance no és un servei d'intervenció en crisis i no proporciona suport d'emergència.",
      },
      {
        title: '3. Sense Relació Professional',
        text: "L'ús d'aquest lloc web, inclosa la compra de cursos, productes o la participació en qualsevol programa, no estableix una relació metge-pacient, terapeuta-client o qualsevol altra relació professional entre vosaltres i EKA Balance o qualsevol dels seus professionals, empleats o contractistes. Aquesta relació només s'estableix a través d'un acord escrit signat i un compromís professional específic on s'hagi completat una avaluació.",
      },
      {
        title: '4. Responsabilitat Personal',
        text: "Reconeixeu que participeu voluntàriament en l'ús del nostre lloc web i serveis i que sou únicament i personalment responsables de les vostres eleccions, accions i resultats, ara i en el futur. Accepteu la total responsabilitat per les conseqüències del vostre ús, o no ús, de qualsevol informació proporcionada en o a través d'aquest lloc web, i accepteu utilitzar el vostre propi judici i diligència deguda abans d'implementar qualsevol idea, suggeriment o recomanació d'aquest lloc web a la vostra vida, família o negoci.",
      },
      {
        title: '5. Testimonis i Resultats',
        text: "Els testimonis, estudis de casos i exemples que es troben en aquest lloc web són resultats reals d'usuaris dels nostres productes i/o serveis, però no pretenen representar ni garantir que ningú aconsegueixi els mateixos o similars resultats. Els resultats individuals varien segons la història personal, la motivació, el compromís, els antecedents i altres factors. No garantim cap resultat o desenllaç específic.",
      },
      {
        title: '6. Limitació de Responsabilitat',
        text: "En la mesura màxima permesa per la llei, EKA Balance no serà responsable de cap dany directe, indirecte, incidental, especial, conseqüent o exemplar, inclosos, entre d'altres, danys per pèrdua de beneficis, bona voluntat, ús, dades o altres pèrdues intangibles resultants de l'ús o la impossibilitat d'utilitzar el servei. Excloem expressament qualsevol responsabilitat per qualsevol acció que pugueu prendre o pèrdua o lesió que pugueu patir (directa o indirecta, inclosa la pèrdua de pagament, benefici, oportunitat o temps, dolor i patiment, qualsevol naturalesa de pèrdua) com a resultat de confiar en qualsevol informació d'aquest lloc web.",
      },
      {
        title: '7. Enllaços Externs',
        text: "Aquest lloc web pot contenir enllaços a llocs web de tercers. Aquests enllaços es proporcionen únicament per a la vostra conveniència i no com un suport per la nostra part dels continguts d'aquests llocs web de tercers. No som responsables del contingut dels llocs de tercers vinculats i no fem cap representació respecte al contingut o la precisió dels materials en aquests llocs web de tercers. Si decidiu accedir a llocs web de tercers vinculats, ho feu sota el vostre propi risc.",
      },
      {
        title: '8. Jurisdicció i Llei Aplicable',
        text: "Aquest descàrrec de responsabilitat es regirà i interpretarà d'acord amb les lleis d'Espanya, sense tenir en compte les seves disposicions sobre conflictes de lleis. Qualsevol disputa que sorgeixi de o en relació amb aquest descàrrec de responsabilitat estarà subjecta a la jurisdicció exclusiva dels tribunals de Barcelona, Espanya.",
      },
    ],
  },
  ru: {
    title: 'Отказ от ответственности и Юридическое уведомление',
    updated: 'Последнее обновление: 25 ноября 2025 г.',
    sections: [
      {
        title: '1. Медицинский отказ',
        text: 'Контент, продукты и услуги, предлагаемые EKA Balance («Компания», «мы», «нас» или «наш»), предназначены исключительно для информационных, образовательных целей и целей самопомощи. Ничто на этом веб-сайте, включая текст, графику, изображения, аудио, видео и другие материалы, не является медицинской рекомендацией, диагнозом или лечением. Предоставленная информация не предназначена для замены профессиональной медицинской консультации, диагностики или лечения. Всегда обращайтесь за советом к своему врачу, психотерапевту или другому квалифицированному медицинскому работнику по любым вопросам, которые могут у вас возникнуть относительно состояния здоровья или проблем с психическим здоровьем. Никогда не пренебрегайте профессиональной медицинской рекомендацией и не откладывайте ее получение из-за того, что вы прочитали на этом веб-сайте.',
      },
      {
        title: '2. Предупреждение об экстренных случаях',
        text: 'Если у вас возникла неотложная медицинская ситуация, кризис психического здоровья, вы думаете о самоубийстве или чувствуете, что можете представлять опасность для себя или других, не используйте этот веб-сайт или наши услуги. Немедленно позвоните в местные экстренные службы (например, 112 в Европе, 911 в США) или обратитесь в отделение неотложной помощи ближайшей больницы. EKA Balance не является службой кризисного вмешательства и не предоставляет экстренную поддержку.',
      },
      {
        title: '3. Отсутствие профессиональных отношений',
        text: 'Использование вами этого веб-сайта, включая покупку любых курсов, продуктов или участие в любых программах, не создает отношений врач-пациент, терапевт-клиент или любых других профессиональных отношений между вами и EKA Balance или любым из его специалистов, сотрудников или подрядчиков. Такие отношения устанавливаются только посредством подписанного письменного соглашения и конкретного профессионального взаимодействия, в рамках которого была проведена оценка.',
      },
      {
        title: '4. Личная ответственность',
        text: 'Вы подтверждаете, что добровольно участвуете в использовании нашего веб-сайта и услуг и что вы несете единоличную и личную ответственность за свой выбор, действия и результаты, сейчас и в будущем. Вы принимаете на себя полную ответственность за последствия использования или неиспользования любой информации, предоставленной на этом веб-сайте или через него, и вы соглашаетесь использовать свое собственное суждение и должную осмотрительность перед внедрением любой идеи, предложения или рекомендации с этого веб-сайта в свою жизнь, семью или бизнес.',
      },
      {
        title: '5. Отзывы и результаты',
        text: 'Отзывы, тематические исследования и примеры, найденные на этом веб-сайте, являются реальными результатами пользователей наших продуктов и/или услуг, но они не предназначены для того, чтобы представлять или гарантировать, что кто-либо достигнет таких же или аналогичных результатов. Индивидуальные результаты варьируются в зависимости от личной истории, мотивации, приверженности, опыта и других факторов. Мы не гарантируем никаких конкретных результатов или исходов.',
      },
      {
        title: '6. Ограничение ответственности',
        text: 'В максимальной степени, разрешенной законом, EKA Balance не несет ответственности за любой прямой, косвенный, случайный, особый, последующий или штрафной ущерб, включая, помимо прочего, ущерб от потери прибыли, деловой репутации, использования, данных или других нематериальных потерь, возникших в результате использования или невозможности использования сервиса. Мы прямо исключаем любую ответственность за любые действия, которые вы можете предпринять, или убытки или травмы, которые вы можете понести (прямые или косвенные, включая потерю оплаты, прибыли, возможности или времени, боль и страдания, любой характер убытков) в результате использования любой информации на этом веб-сайте.',
      },
      {
        title: '7. Внешние ссылки',
        text: 'Этот веб-сайт может содержать ссылки на сторонние веб-сайты. Эти ссылки предоставляются исключительно для вашего удобства, а не как одобрение нами содержания таких сторонних веб-сайтов. Мы не несем ответственности за содержание связанных сторонних сайтов и не делаем никаких заявлений относительно содержания или точности материалов на таких сторонних веб-сайтах. Если вы решите получить доступ к связанным сторонним веб-сайтам, вы делаете это на свой страх и риск.',
      },
      {
        title: '8. Юрисдикция и применимое право',
        text: 'Этот отказ от ответственности регулируется и толкуется в соответствии с законами Испании, без учета ее коллизионных норм. Любые споры, возникающие из или в связи с этим отказом от ответственности, подлежат исключительной юрисдикции судов Барселоны, Испания.',
      },
    ],
  },
};

export default function DisclaimerPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex justify-end space-x-2">
        <button
          onClick={() => setLang('en')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          English
        </button>
        <button
          onClick={() => setLang('es')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'es' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Español
        </button>
        <button
          onClick={() => setLang('ca')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'ca' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Català
        </button>
        <button
          onClick={() => setLang('ru')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Русский
        </button>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h1 className="mb-2 text-3xl font-bold">{content[lang].title}</h1>
        <p className="text-muted-foreground mb-8 text-sm">{content[lang].updated}</p>

        <div className="space-y-8">
          {content[lang].sections.map((section, index) => (
            <section key={index} id={(section as any).id} className="mb-8 scroll-mt-24">
              <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        <div className="bg-muted/50 text-muted-foreground mt-12 rounded-xl p-4 text-center text-sm">
          <p>
            {lang === 'en' && 'By using this website, you accept this disclaimer in full.'}
            {lang === 'es' &&
              'Al utilizar este sitio web, usted acepta este descargo de responsabilidad en su totalidad.'}
            {lang === 'ca' &&
              'En utilitzar aquest lloc web, accepteu aquest descàrrec de responsabilitat en la seva totalitat.'}
            {lang === 'ru' &&
              'Используя этот веб-сайт, вы принимаете этот отказ от ответственности в полном объеме.'}
          </p>
        </div>
      </div>
    </div>
  );
}
