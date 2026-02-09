'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Acceptable Use Policy',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'This Acceptable Use Policy ("AUP") outlines the examples of prohibited conduct in connection with our services. This policy is an integral part of our Terms of Service and applies to all users, visitors, and customers of EKA Balance. Our goal is to maintain a safe, secure, and respectful environment for all users globally.',
    sections: [
      {
        id: 'general-principles',
        title: '1. General Principles',
        text: 'You agree to use the Services only for lawful purposes and in accordance with this Policy. You are responsible for your conduct and communications while using our Services and for any consequences thereof. We expect all users to uphold the highest standards of courtesy, respect, and legal compliance.',
      },
      {
        id: 'compliance',
        title: '2. Compliance with Laws',
        text: 'You may not use our Services to violate any applicable local, state, national, or international law or regulation. This includes, but is not limited to, laws regarding data privacy, intellectual property, export control, consumer protection, and criminal statutes. It is your responsibility to know and adhere to the laws of your jurisdiction and the jurisdiction of Spain.',
      },
      {
        id: 'security',
        title: '3. System Security and Integrity',
        text: 'You must not violate or attempt to violate the security of the Services. Prohibited actions include, but are not limited to:\n\n• Accessing data not intended for you or logging into a server or account which you are not authorized to access.\n• Attempting to probe, scan, or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization.\n• Interfering with service to any user, host, or network, including, without limitation, via means of submitting a virus to the Services, overloading, "flooding," "spamming," "mailbombing," or "crashing."\n• Forging any TCP/IP packet header or any part of the header information in any email or posting.\n• Using any device, software, or routine to interfere or attempt to interfere with the proper working of the Services.',
      },
      {
        id: 'content-standards',
        title: '4. Content Standards',
        text: "You are strictly prohibited from posting, transmitting, or storing any material that:\n\n• Is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.\n• Exploits or harms minors in any way, including by exposing them to inappropriate content.\n• Impersonates any person or entity or falsely states or otherwise misrepresents your affiliation with a person or entity.\n• Contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment.",
      },
      {
        id: 'ip-rights',
        title: '5. Intellectual Property Rights',
        text: 'You may not use the Services to infringe upon or misappropriate the intellectual property rights of others, including copyrights, trademarks, trade secrets, patents, or other proprietary rights. We reserve the right to terminate the accounts of users who are repeat infringers.',
      },
      {
        id: 'spam',
        title: '6. Spam and Unsolicited Communications',
        text: 'The Services may not be used to send unsolicited commercial messages or communications in any form (spam). You may not use the Services to collect responses from unsolicited email sent from accounts on other Internet service providers or organizations. You may not harvest or collect email addresses or other contact information of other users from the Services by electronic or other means.',
      },
      {
        id: 'scraping',
        title: '7. Data Mining and Scraping',
        text: 'Use of any robot, spider, site search/retrieval application, or other manual or automatic device or process to retrieve, index, "data mine," or in any way reproduce or circumvent the navigational structure or presentation of the Services or its contents is strictly prohibited.',
      },
      {
        id: 'enforcement',
        title: '8. Enforcement',
        text: 'We reserve the right, but do not assume the obligation, to investigate any violation of this Policy or misuse of the Services. We may:\n\n• Investigate violations of this Policy or misuse of the Services.\n• Remove, disable access to, or modify any content or resource that violates this Policy.\n• Suspend or terminate your access to the Services for any reason, including violation of this Policy.\n• Report any activity that we suspect violates any law or regulation to appropriate law enforcement officials, regulators, or other appropriate third parties.',
      },
      {
        id: 'reporting',
        title: '9. Reporting Violations',
        text: 'If you become aware of any violation of this Policy, you are requested to report it to us immediately at legal@ekabalance.com. When reporting, please provide as much detail as possible, including the nature of the violation and any supporting evidence.',
      },
    ],
  },
  es: {
    title: 'Política de Uso Aceptable',
    updated: 'Última actualización: 25 de noviembre de 2025',
    intro:
      'Esta Política de Uso Aceptable ("PUA") describe los ejemplos de conducta prohibida en relación con nuestros servicios. Esta política es una parte integral de nuestros Términos de Servicio y se aplica a todos los usuarios, visitantes y clientes de EKA Balance. Nuestro objetivo es mantener un entorno seguro y respetuoso para todos los usuarios a nivel mundial.',
    sections: [
      {
        title: '1. Principios Generales',
        text: 'Usted acepta utilizar los Servicios solo para fines legales y de acuerdo con esta Política. Usted es responsable de su conducta y comunicaciones mientras utiliza nuestros Servicios y de cualquier consecuencia de los mismos. Esperamos que todos los usuarios mantengan los más altos estándares de cortesía, respeto y cumplimiento legal.',
      },
      {
        title: '2. Cumplimiento de las Leyes',
        text: 'No puede utilizar nuestros Servicios para violar ninguna ley o regulación local, estatal, nacional o internacional aplicable. Esto incluye, entre otros, leyes sobre privacidad de datos, propiedad intelectual, control de exportaciones, protección al consumidor y estatutos penales. Es su responsabilidad conocer y cumplir con las leyes de su jurisdicción y la jurisdicción de España.',
      },
      {
        title: '3. Seguridad e Integridad del Sistema',
        text: 'No debe violar ni intentar violar la seguridad de los Servicios. Las acciones prohibidas incluyen, entre otras:\n\n• Acceder a datos no destinados a usted o iniciar sesión en un servidor o cuenta a la que no tiene autorización para acceder.\n• Intentar sondear, escanear o probar la vulnerabilidad de un sistema o red o violar las medidas de seguridad o autenticación sin la debida autorización.\n• Interferir con el servicio a cualquier usuario, host o red, incluyendo, sin limitación, mediante el envío de virus a los Servicios, sobrecarga, "inundación", "spam", "bombardeo de correo" o "bloqueo".\n• Falsificar cualquier encabezado de paquete TCP/IP o cualquier parte de la información del encabezado en cualquier correo electrónico o publicación.\n• Utilizar cualquier dispositivo, software o rutina para interferir o intentar interferir con el funcionamiento adecuado de los Servicios.',
      },
      {
        title: '4. Estándares de Contenido',
        text: 'Está estrictamente prohibido publicar, transmitir o almacenar cualquier material que:\n\n• Sea ilegal, dañino, amenazante, abusivo, acosador, agraviante, difamatorio, vulgar, obsceno, calumnioso, invasivo de la privacidad de otros, odioso o racial, étnica o de otra manera objetable.\n• Explote o dañe a menores de cualquier manera, incluso exponiéndolos a contenido inapropiado.\n• Suplante a cualquier persona o entidad o declare falsamente o tergiverse su afiliación con una persona o entidad.\n• Contenga virus de software o cualquier otro código informático, archivos o programas diseñados para interrumpir, destruir o limitar la funcionalidad de cualquier software o hardware informático o equipo de telecomunicaciones.',
      },
      {
        title: '5. Derechos de Propiedad Intelectual',
        text: 'No puede utilizar los Servicios para infringir o apropiarse indebidamente de los derechos de propiedad intelectual de otros, incluidos los derechos de autor, marcas comerciales, secretos comerciales, patentes u otros derechos de propiedad. Nos reservamos el derecho de cancelar las cuentas de los usuarios que sean infractores reincidentes.',
      },
      {
        title: '6. Spam y Comunicaciones No Solicitadas',
        text: 'Los Servicios no pueden utilizarse para enviar mensajes comerciales no solicitados o comunicaciones en cualquier forma (spam). No puede utilizar los Servicios para recopilar respuestas de correos electrónicos no solicitados enviados desde cuentas en otros proveedores de servicios de Internet u organizaciones. No puede recolectar o recopilar direcciones de correo electrónico u otra información de contacto de otros usuarios de los Servicios por medios electrónicos u otros.',
      },
      {
        title: '7. Minería de Datos y Scraping',
        text: 'El uso de cualquier robot, araña, aplicación de búsqueda/recuperación de sitios u otro dispositivo o proceso manual o automático para recuperar, indexar, "extraer datos" o de cualquier manera reproducir o eludir la estructura de navegación o presentación de los Servicios o sus contenidos está estrictamente prohibido.',
      },
      {
        title: '8. Aplicación',
        text: 'Nos reservamos el derecho, pero no asumimos la obligación, de investigar cualquier violación de esta Política o mal uso de los Servicios. Podemos:\n\n• Investigar violaciones de esta Política o mal uso de los Servicios.\n• Eliminar, deshabilitar el acceso o modificar cualquier contenido o recurso que viole esta Política.\n• Suspender o terminar su acceso a los Servicios por cualquier motivo, incluida la violación de esta Política.\n• Informar cualquier actividad que sospechemos que viola cualquier ley o regulación a los funcionarios encargados de hacer cumplir la ley, reguladores u otros terceros apropiados.',
      },
      {
        title: '9. Reporte de Violaciones',
        text: 'Si tiene conocimiento de alguna violación de esta Política, le solicitamos que nos la informe de inmediato a legal@ekabalance.com. Al informar, proporcione tantos detalles como sea posible, incluida la naturaleza de la violación y cualquier evidencia de respaldo.',
      },
    ],
  },
  ca: {
    title: "Política d'Ús Acceptable",
    updated: 'Darrera actualització: 25 de novembre de 2025',
    intro:
      "Aquesta Política d'Ús Acceptable (\"PUA\") descriu els exemples de conducta prohibida en relació amb els nostres serveis. Aquesta política és una part integral dels nostres Termes de Servei i s'aplica a tots els usuaris, visitants i clients d'EKA Balance. El nostre objectiu és mantenir un entorn segur i respectuós per a tots els usuaris a nivell mundial.",
    sections: [
      {
        title: '1. Principis Generals',
        text: "Vostè accepta utilitzar els Serveis només per a fins legals i d'acord amb aquesta Política. Vostè és responsable de la seva conducta i comunicacions mentre utilitza els nostres Serveis i de qualsevol conseqüència dels mateixos. Esperem que tots els usuaris mantinguin els més alts estàndards de cortesia, respecte i compliment legal.",
      },
      {
        title: '2. Compliment de les Lleis',
        text: "No pot utilitzar els nostres Serveis per violar cap llei o regulació local, estatal, nacional o internacional aplicable. Això inclou, entre d'altres, lleis sobre privadesa de dades, propietat intel·lectual, control d'exportacions, protecció al consumidor i estatuts penals. És la seva responsabilitat conèixer i complir amb les lleis de la seva jurisdicció i la jurisdicció d'Espanya.",
      },
      {
        title: '3. Seguretat i Integritat del Sistema',
        text: 'No ha de violar ni intentar violar la seguretat dels Serveis. Les accions prohibides inclouen, entre d\'altres:\n\n• Accedir a dades no destinades a vostè o iniciar sessió en un servidor o compte al qual no té autorització per accedir.\n• Intentar sondejar, escanejar o provar la vulnerabilitat d\'un sistema o xarxa o violar les mesures de seguretat o autenticació sense la deguda autorització.\n• Interferir amb el servei a qualsevol usuari, host o xarxa, incloent, sense limitació, mitjançant l\'enviament de virus als Serveis, sobrecàrrega, "inundació", "spam", "bombardeig de correu" o "bloqueig".\n• Falsificar qualsevol encapçalament de paquet TCP/IP o qualsevol part de la informació de l\'encapçalament en qualsevol correu electrònic o publicació.\n• Utilitzar qualsevol dispositiu, programari o rutina per interferir o intentar interferir amb el funcionament adequat dels Serveis.',
      },
      {
        title: '4. Estàndards de Contingut',
        text: "Està estrictament prohibit publicar, transmetre o emmagatzemar qualsevol material que:\n\n• Sigui il·legal, nociu, amenaçador, abusiu, assetjador, agreujant, difamatori, vulgar, obscè, calumniós, invasiu de la privadesa d'altres, odiós o racial, ètnica o d'una altra manera objectable.\n• Exploti o danyi a menors de qualsevol manera, fins i tot exposant-los a contingut inadequat.\n• Suplanti a qualsevol persona o entitat o declari falsament o tergiversi la seva afiliació amb una persona o entitat.\n• Contingui virus de programari o qualsevol altre codi informàtic, fitxers o programes dissenyats per interrompre, destruir o limitar la funcionalitat de qualsevol programari o maquinari informàtic o equip de telecomunicacions.",
      },
      {
        title: '5. Drets de Propietat Intel·lectual',
        text: "No pot utilitzar els Serveis per infringir o apropiar-se indegudament dels drets de propietat intel·lectual d'altres, inclosos els drets d'autor, marques comercials, secrets comercials, patents o altres drets de propietat. Ens reservem el dret de cancel·lar els comptes dels usuaris que siguin infractors reincidents.",
      },
      {
        title: '6. Spam i Comunicacions No Sol·licitades',
        text: "Els Serveis no poden utilitzar-se per enviar missatges comercials no sol·licitats o comunicacions en qualsevol forma (spam). No pot utilitzar els Serveis per recopilar respostes de correus electrònics no sol·licitats enviats des de comptes en altres proveïdors de serveis d'Internet o organitzacions. No pot recol·lectar o recopilar adreces de correu electrònic o altra informació de contacte d'altres usuaris dels Serveis per mitjans electrònics o altres.",
      },
      {
        title: '7. Mineria de Dades i Scraping',
        text: 'L\'ús de qualsevol robot, aranya, aplicació de cerca/recuperació de llocs o un altre dispositiu o procés manual o automàtic per recuperar, indexar, "extreure dades" o de qualsevol manera reproduir o eludir l\'estructura de navegació o presentació dels Serveis o els seus continguts està estrictament prohibit.',
      },
      {
        title: '8. Aplicació',
        text: "Ens reservem el dret, però no assumim l'obligació, d'investigar qualsevol violació d'aquesta Política o mal ús dels Serveis. Podem:\n\n• Investigar violacions d'aquesta Política o mal ús dels Serveis.\n• Eliminar, deshabilitar l'accés o modificar qualsevol contingut o recurs que violi aquesta Política.\n• Suspendre o acabar el seu accés als Serveis per qualsevol motiu, inclosa la violació d'aquesta Política.\n• Informar qualsevol activitat que sospitem que viola qualsevol llei o regulació als funcionaris encarregats de fer complir la llei, reguladors o altres tercers apropiats.",
      },
      {
        title: '9. Report de Violacions',
        text: "Si té coneixement d'alguna violació d'aquesta Política, li sol·licitem que ens la informi immediatament a legal@ekabalance.com. En informar, proporcioni tants detalls com sigui possible, inclosa la naturalesa de la violació i qualsevol evidència de suport.",
      },
    ],
  },
  ru: {
    title: 'Политика допустимого использования',
    updated: 'Последнее обновление: 25 ноября 2025 г.',
    intro:
      'Настоящая Политика допустимого использования («ПДИ») описывает примеры запрещенного поведения в связи с нашими услугами. Эта политика является неотъемлемой частью наших Условий обслуживания и распространяется на всех пользователей, посетителей и клиентов EKA Balance. Наша цель — поддерживать безопасную, надежную и уважительную среду для всех пользователей во всем мире.',
    sections: [
      {
        title: '1. Общие принципы',
        text: 'Вы соглашаетесь использовать Услуги только в законных целях и в соответствии с настоящей Политикой. Вы несете ответственность за свое поведение и общение при использовании наших Услуг, а также за любые последствия этого. Мы ожидаем, что все пользователи будут придерживаться самых высоких стандартов вежливости, уважения и соблюдения правовых норм.',
      },
      {
        title: '2. Соблюдение законов',
        text: 'Вы не можете использовать наши Услуги для нарушения любых применимых местных, государственных, национальных или международных законов или правил. Это включает, помимо прочего, законы о конфиденциальности данных, интеллектуальной собственности, экспортном контроле, защите прав потребителей и уголовные кодексы. Вы несете ответственность за знание и соблюдение законов вашей юрисдикции и юрисдикции Испании.',
      },
      {
        title: '3. Безопасность и целостность системы',
        text: 'Вы не должны нарушать или пытаться нарушить безопасность Услуг. Запрещенные действия включают, помимо прочего:\n\n• Доступ к данным, не предназначенным для вас, или вход на сервер или учетную запись, к которым у вас нет разрешения на доступ.\n• Попытка зондировать, сканировать или тестировать уязвимость системы или сети или нарушать меры безопасности или аутентификации без надлежащего разрешения.\n• Вмешательство в обслуживание любого пользователя, хоста или сети, включая, помимо прочего, отправку вируса в Услуги, перегрузку, «флуд», «спам», «почтовые бомбардировки» или «сбои».\n• Подделка любого заголовка пакета TCP/IP или любой части информации заголовка в любом электронном письме или сообщении.\n• Использование любого устройства, программного обеспечения или процедуры для вмешательства или попытки вмешательства в надлежащую работу Услуг.',
      },
      {
        title: '4. Стандарты контента',
        text: 'Вам строго запрещено публиковать, передавать или хранить любые материалы, которые:\n\n• Являются незаконными, вредными, угрожающими, оскорбительными, домогающимися, деликтными, клеветническими, вульгарными, непристойными, порочащими, вторгающимися в частную жизнь других, ненавистническими или расово, этнически или иным образом предосудительными.\n• Эксплуатируют или наносят вред несовершеннолетним любым способом, в том числе подвергая их воздействию неприемлемого контента.\n• Выдают себя за любое лицо или организацию или ложно заявляют или иным образом искажают вашу связь с лицом или организацией.\n• Содержат программные вирусы или любой другой компьютерный код, файлы или программы, предназначенные для прерывания, уничтожения или ограничения функциональности любого компьютерного программного обеспечения или оборудования или телекоммуникационного оборудования.',
      },
      {
        title: '5. Права интеллектуальной собственности',
        text: 'Вы не можете использовать Услуги для нарушения или незаконного присвоения прав интеллектуальной собственности других лиц, включая авторские права, товарные знаки, коммерческие тайны, патенты или другие права собственности. Мы оставляем за собой право аннулировать учетные записи пользователей, которые являются злостными нарушителями.',
      },
      {
        title: '6. Спам и нежелательные сообщения',
        text: 'Услуги не могут использоваться для отправки нежелательных коммерческих сообщений или коммуникаций в любой форме (спам). Вы не можете использовать Услуги для сбора ответов на нежелательную электронную почту, отправленную с учетных записей других интернет-провайдеров или организаций. Вы не можете собирать или накапливать адреса электронной почты или другую контактную информацию других пользователей Услуг с помощью электронных или иных средств.',
      },
      {
        title: '7. Интеллектуальный анализ данных и скрапинг',
        text: 'Использование любого робота, паука, приложения для поиска/извлечения сайтов или другого ручного или автоматического устройства или процесса для извлечения, индексирования, «интеллектуального анализа данных» или любого другого воспроизведения или обхода навигационной структуры или представления Услуг или их содержимого строго запрещено.',
      },
      {
        title: '8. Применение',
        text: 'Мы оставляем за собой право, но не берем на себя обязательство, расследовать любое нарушение настоящей Политики или неправомерное использование Услуг. Мы можем:\n\n• Расследовать нарушения настоящей Политики или неправомерное использование Услуг.\n• Удалять, отключать доступ или изменять любой контент или ресурс, нарушающий настоящую Политику.\n• Приостанавливать или прекращать ваш доступ к Услугам по любой причине, включая нарушение настоящей Политики.\n• Сообщать о любой деятельности, которая, по нашему мнению, нарушает какой-либо закон или постановление, соответствующим должностным лицам правоохранительных органов, регулирующим органам или другим соответствующим третьим лицам.',
      },
      {
        title: '9. Сообщение о нарушениях',
        text: 'Если вам станет известно о каком-либо нарушении настоящей Политики, мы просим вас немедленно сообщить нам об этом по адресу legal@ekabalance.com. При сообщении укажите как можно больше подробностей, включая характер нарушения и любые подтверждающие доказательства.',
      },
    ],
  },
};

export default function AcceptableUsePage() {
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
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.updated}</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{t.intro}</p>

        {t.sections.map((section, index) => (
          <section key={index} id={(section as any).id} className="mb-8 scroll-mt-24">
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
