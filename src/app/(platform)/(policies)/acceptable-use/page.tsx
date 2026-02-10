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
        text: 'You must not violate or attempt to violate the security of the Services. Prohibited actions include, but are not limited to:\n\nâ€¢ Accessing data not intended for you or logging into a server or account which you are not authorized to access.\nâ€¢ Attempting to probe, scan, or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization.\nâ€¢ Interfering with service to any user, host, or network, including, without limitation, via means of submitting a virus to the Services, overloading, "flooding," "spamming," "mailbombing," or "crashing."\nâ€¢ Forging any TCP/IP packet header or any part of the header information in any email or posting.\nâ€¢ Using any device, software, or routine to interfere or attempt to interfere with the proper working of the Services.',
      },
      {
        id: 'content-standards',
        title: '4. Content Standards',
        text: "You are strictly prohibited from posting, transmitting, or storing any material that:\n\nâ€¢ Is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.\nâ€¢ Exploits or harms minors in any way, including by exposing them to inappropriate content.\nâ€¢ Impersonates any person or entity or falsely states or otherwise misrepresents your affiliation with a person or entity.\nâ€¢ Contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment.",
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
        text: 'We reserve the right, but do not assume the obligation, to investigate any violation of this Policy or misuse of the Services. We may:\n\nâ€¢ Investigate violations of this Policy or misuse of the Services.\nâ€¢ Remove, disable access to, or modify any content or resource that violates this Policy.\nâ€¢ Suspend or terminate your access to the Services for any reason, including violation of this Policy.\nâ€¢ Report any activity that we suspect violates any law or regulation to appropriate law enforcement officials, regulators, or other appropriate third parties.',
      },
      {
        id: 'reporting',
        title: '9. Reporting Violations',
        text: 'If you become aware of any violation of this Policy, you are requested to report it to us immediately at legal@ekabalance.com. When reporting, please provide as much detail as possible, including the nature of the violation and any supporting evidence.',
      },
    ],
  },
  es: {
    title: 'PolÃ­tica de Uso Aceptable',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'Esta PolÃ­tica de Uso Aceptable ("PUA") describe los ejemplos de conducta prohibida en relaciÃ³n con nuestros servicios. Esta polÃ­tica es una parte integral de nuestros TÃ©rminos de Servicio y se aplica a todos los usuarios, visitantes y clientes de EKA Balance. Nuestro objetivo es mantener un entorno seguro y respetuoso para todos los usuarios a nivel mundial.',
    sections: [
      {
        title: '1. Principios Generales',
        text: 'Usted acepta utilizar los Servicios solo para fines legales y de acuerdo con esta PolÃ­tica. Usted es responsable de su conducta y comunicaciones mientras utiliza nuestros Servicios y de cualquier consecuencia de los mismos. Esperamos que todos los usuarios mantengan los mÃ¡s altos estÃ¡ndares de cortesÃ­a, respeto y cumplimiento legal.',
      },
      {
        title: '2. Cumplimiento de las Leyes',
        text: 'No puede utilizar nuestros Servicios para violar ninguna ley o regulaciÃ³n local, estatal, nacional o internacional aplicable. Esto incluye, entre otros, leyes sobre privacidad de datos, propiedad intelectual, control de exportaciones, protecciÃ³n al consumidor y estatutos penales. Es su responsabilidad conocer y cumplir con las leyes de su jurisdicciÃ³n y la jurisdicciÃ³n de EspaÃ±a.',
      },
      {
        title: '3. Seguridad e Integridad del Sistema',
        text: 'No debe violar ni intentar violar la seguridad de los Servicios. Las acciones prohibidas incluyen, entre otras:\n\nâ€¢ Acceder a datos no destinados a usted o iniciar sesiÃ³n en un servidor o cuenta a la que no tiene autorizaciÃ³n para acceder.\nâ€¢ Intentar sondear, escanear o probar la vulnerabilidad de un sistema o red o violar las medidas de seguridad o autenticaciÃ³n sin la debida autorizaciÃ³n.\nâ€¢ Interferir con el servicio a cualquier usuario, host o red, incluyendo, sin limitaciÃ³n, mediante el envÃ­o de virus a los Servicios, sobrecarga, "inundaciÃ³n", "spam", "bombardeo de correo" o "bloqueo".\nâ€¢ Falsificar cualquier encabezado de paquete TCP/IP o cualquier parte de la informaciÃ³n del encabezado en cualquier correo electrÃ³nico o publicaciÃ³n.\nâ€¢ Utilizar cualquier dispositivo, software o rutina para interferir o intentar interferir con el funcionamiento adecuado de los Servicios.',
      },
      {
        title: '4. EstÃ¡ndares de Contenido',
        text: 'EstÃ¡ estrictamente prohibido publicar, transmitir o almacenar cualquier material que:\n\nâ€¢ Sea ilegal, daÃ±ino, amenazante, abusivo, acosador, agraviante, difamatorio, vulgar, obsceno, calumnioso, invasivo de la privacidad de otros, odioso o racial, Ã©tnica o de otra manera objetable.\nâ€¢ Explote o daÃ±e a menores de cualquier manera, incluso exponiÃ©ndolos a contenido inapropiado.\nâ€¢ Suplante a cualquier persona o entidad o declare falsamente o tergiverse su afiliaciÃ³n con una persona o entidad.\nâ€¢ Contenga virus de software o cualquier otro cÃ³digo informÃ¡tico, archivos o programas diseÃ±ados para interrumpir, destruir o limitar la funcionalidad de cualquier software o hardware informÃ¡tico o equipo de telecomunicaciones.',
      },
      {
        title: '5. Derechos de Propiedad Intelectual',
        text: 'No puede utilizar los Servicios para infringir o apropiarse indebidamente de los derechos de propiedad intelectual de otros, incluidos los derechos de autor, marcas comerciales, secretos comerciales, patentes u otros derechos de propiedad. Nos reservamos el derecho de cancelar las cuentas de los usuarios que sean infractores reincidentes.',
      },
      {
        title: '6. Spam y Comunicaciones No Solicitadas',
        text: 'Los Servicios no pueden utilizarse para enviar mensajes comerciales no solicitados o comunicaciones en cualquier forma (spam). No puede utilizar los Servicios para recopilar respuestas de correos electrÃ³nicos no solicitados enviados desde cuentas en otros proveedores de servicios de Internet u organizaciones. No puede recolectar o recopilar direcciones de correo electrÃ³nico u otra informaciÃ³n de contacto de otros usuarios de los Servicios por medios electrÃ³nicos u otros.',
      },
      {
        title: '7. MinerÃ­a de Datos y Scraping',
        text: 'El uso de cualquier robot, araÃ±a, aplicaciÃ³n de bÃºsqueda/recuperaciÃ³n de sitios u otro dispositivo o proceso manual o automÃ¡tico para recuperar, indexar, "extraer datos" o de cualquier manera reproducir o eludir la estructura de navegaciÃ³n o presentaciÃ³n de los Servicios o sus contenidos estÃ¡ estrictamente prohibido.',
      },
      {
        title: '8. AplicaciÃ³n',
        text: 'Nos reservamos el derecho, pero no asumimos la obligaciÃ³n, de investigar cualquier violaciÃ³n de esta PolÃ­tica o mal uso de los Servicios. Podemos:\n\nâ€¢ Investigar violaciones de esta PolÃ­tica o mal uso de los Servicios.\nâ€¢ Eliminar, deshabilitar el acceso o modificar cualquier contenido o recurso que viole esta PolÃ­tica.\nâ€¢ Suspender o terminar su acceso a los Servicios por cualquier motivo, incluida la violaciÃ³n de esta PolÃ­tica.\nâ€¢ Informar cualquier actividad que sospechemos que viola cualquier ley o regulaciÃ³n a los funcionarios encargados de hacer cumplir la ley, reguladores u otros terceros apropiados.',
      },
      {
        title: '9. Reporte de Violaciones',
        text: 'Si tiene conocimiento de alguna violaciÃ³n de esta PolÃ­tica, le solicitamos que nos la informe de inmediato a legal@ekabalance.com. Al informar, proporcione tantos detalles como sea posible, incluida la naturaleza de la violaciÃ³n y cualquier evidencia de respaldo.',
      },
    ],
  },
  ca: {
    title: "PolÃ­tica d'Ãšs Acceptable",
    updated: 'Darrera actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "Aquesta PolÃ­tica d'Ãšs Acceptable (\"PUA\") descriu els exemples de conducta prohibida en relaciÃ³ amb els nostres serveis. Aquesta polÃ­tica Ã©s una part integral dels nostres Termes de Servei i s'aplica a tots els usuaris, visitants i clients d'EKA Balance. El nostre objectiu Ã©s mantenir un entorn segur i respectuÃ³s per a tots els usuaris a nivell mundial.",
    sections: [
      {
        title: '1. Principis Generals',
        text: "VostÃ¨ accepta utilitzar els Serveis nomÃ©s per a fins legals i d'acord amb aquesta PolÃ­tica. VostÃ¨ Ã©s responsable de la seva conducta i comunicacions mentre utilitza els nostres Serveis i de qualsevol conseqÃ¼Ã¨ncia dels mateixos. Esperem que tots els usuaris mantinguin els mÃ©s alts estÃ ndards de cortesia, respecte i compliment legal.",
      },
      {
        title: '2. Compliment de les Lleis',
        text: "No pot utilitzar els nostres Serveis per violar cap llei o regulaciÃ³ local, estatal, nacional o internacional aplicable. AixÃ² inclou, entre d'altres, lleis sobre privadesa de dades, propietat intelÂ·lectual, control d'exportacions, protecciÃ³ al consumidor i estatuts penals. Ã‰s la seva responsabilitat conÃ¨ixer i complir amb les lleis de la seva jurisdicciÃ³ i la jurisdicciÃ³ d'Espanya.",
      },
      {
        title: '3. Seguretat i Integritat del Sistema',
        text: 'No ha de violar ni intentar violar la seguretat dels Serveis. Les accions prohibides inclouen, entre d\'altres:\n\nâ€¢ Accedir a dades no destinades a vostÃ¨ o iniciar sessiÃ³ en un servidor o compte al qual no tÃ© autoritzaciÃ³ per accedir.\nâ€¢ Intentar sondejar, escanejar o provar la vulnerabilitat d\'un sistema o xarxa o violar les mesures de seguretat o autenticaciÃ³ sense la deguda autoritzaciÃ³.\nâ€¢ Interferir amb el servei a qualsevol usuari, host o xarxa, incloent, sense limitaciÃ³, mitjanÃ§ant l\'enviament de virus als Serveis, sobrecÃ rrega, "inundaciÃ³", "spam", "bombardeig de correu" o "bloqueig".\nâ€¢ Falsificar qualsevol encapÃ§alament de paquet TCP/IP o qualsevol part de la informaciÃ³ de l\'encapÃ§alament en qualsevol correu electrÃ²nic o publicaciÃ³.\nâ€¢ Utilitzar qualsevol dispositiu, programari o rutina per interferir o intentar interferir amb el funcionament adequat dels Serveis.',
      },
      {
        title: '4. EstÃ ndards de Contingut',
        text: "EstÃ  estrictament prohibit publicar, transmetre o emmagatzemar qualsevol material que:\n\nâ€¢ Sigui ilÂ·legal, nociu, amenaÃ§ador, abusiu, assetjador, agreujant, difamatori, vulgar, obscÃ¨, calumniÃ³s, invasiu de la privadesa d'altres, odiÃ³s o racial, Ã¨tnica o d'una altra manera objectable.\nâ€¢ Exploti o danyi a menors de qualsevol manera, fins i tot exposant-los a contingut inadequat.\nâ€¢ Suplanti a qualsevol persona o entitat o declari falsament o tergiversi la seva afiliaciÃ³ amb una persona o entitat.\nâ€¢ Contingui virus de programari o qualsevol altre codi informÃ tic, fitxers o programes dissenyats per interrompre, destruir o limitar la funcionalitat de qualsevol programari o maquinari informÃ tic o equip de telecomunicacions.",
      },
      {
        title: '5. Drets de Propietat IntelÂ·lectual',
        text: "No pot utilitzar els Serveis per infringir o apropiar-se indegudament dels drets de propietat intelÂ·lectual d'altres, inclosos els drets d'autor, marques comercials, secrets comercials, patents o altres drets de propietat. Ens reservem el dret de cancelÂ·lar els comptes dels usuaris que siguin infractors reincidents.",
      },
      {
        title: '6. Spam i Comunicacions No SolÂ·licitades',
        text: "Els Serveis no poden utilitzar-se per enviar missatges comercials no solÂ·licitats o comunicacions en qualsevol forma (spam). No pot utilitzar els Serveis per recopilar respostes de correus electrÃ²nics no solÂ·licitats enviats des de comptes en altres proveÃ¯dors de serveis d'Internet o organitzacions. No pot recolÂ·lectar o recopilar adreces de correu electrÃ²nic o altra informaciÃ³ de contacte d'altres usuaris dels Serveis per mitjans electrÃ²nics o altres.",
      },
      {
        title: '7. Mineria de Dades i Scraping',
        text: 'L\'Ãºs de qualsevol robot, aranya, aplicaciÃ³ de cerca/recuperaciÃ³ de llocs o un altre dispositiu o procÃ©s manual o automÃ tic per recuperar, indexar, "extreure dades" o de qualsevol manera reproduir o eludir l\'estructura de navegaciÃ³ o presentaciÃ³ dels Serveis o els seus continguts estÃ  estrictament prohibit.',
      },
      {
        title: '8. AplicaciÃ³',
        text: "Ens reservem el dret, perÃ² no assumim l'obligaciÃ³, d'investigar qualsevol violaciÃ³ d'aquesta PolÃ­tica o mal Ãºs dels Serveis. Podem:\n\nâ€¢ Investigar violacions d'aquesta PolÃ­tica o mal Ãºs dels Serveis.\nâ€¢ Eliminar, deshabilitar l'accÃ©s o modificar qualsevol contingut o recurs que violi aquesta PolÃ­tica.\nâ€¢ Suspendre o acabar el seu accÃ©s als Serveis per qualsevol motiu, inclosa la violaciÃ³ d'aquesta PolÃ­tica.\nâ€¢ Informar qualsevol activitat que sospitem que viola qualsevol llei o regulaciÃ³ als funcionaris encarregats de fer complir la llei, reguladors o altres tercers apropiats.",
      },
      {
        title: '9. Report de Violacions',
        text: "Si tÃ© coneixement d'alguna violaciÃ³ d'aquesta PolÃ­tica, li solÂ·licitem que ens la informi immediatament a legal@ekabalance.com. En informar, proporcioni tants detalls com sigui possible, inclosa la naturalesa de la violaciÃ³ i qualsevol evidÃ¨ncia de suport.",
      },
    ],
  },
  ru: {
    title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ð¾Ð³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'ÐÐ°ÑÑ‚Ð¾ÑÑ‰Ð°Ñ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ð¾Ð³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ (Â«ÐŸÐ”Ð˜Â») Ð¾Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑ‚ Ð¿Ñ€Ð¸Ð¼ÐµÑ€Ñ‹ Ð·Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð² ÑÐ²ÑÐ·Ð¸ Ñ Ð½Ð°ÑˆÐ¸Ð¼Ð¸ ÑƒÑÐ»ÑƒÐ³Ð°Ð¼Ð¸. Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð½ÐµÐ¾Ñ‚ÑŠÐµÐ¼Ð»ÐµÐ¼Ð¾Ð¹ Ñ‡Ð°ÑÑ‚ÑŒÑŽ Ð½Ð°ÑˆÐ¸Ñ… Ð£ÑÐ»Ð¾Ð²Ð¸Ð¹ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ Ð¸ Ñ€Ð°ÑÐ¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÑÐµÑ‚ÑÑ Ð½Ð° Ð²ÑÐµÑ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹, Ð¿Ð¾ÑÐµÑ‚Ð¸Ñ‚ÐµÐ»ÐµÐ¹ Ð¸ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² EKA Balance. ÐÐ°ÑˆÐ° Ñ†ÐµÐ»ÑŒ â€” Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½ÑƒÑŽ, Ð½Ð°Ð´ÐµÐ¶Ð½ÑƒÑŽ Ð¸ ÑƒÐ²Ð°Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ Ð´Ð»Ñ Ð²ÑÐµÑ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð²Ð¾ Ð²ÑÐµÐ¼ Ð¼Ð¸Ñ€Ðµ.',
    sections: [
      {
        title: '1. ÐžÐ±Ñ‰Ð¸Ðµ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹',
        text: 'Ð’Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð£ÑÐ»ÑƒÐ³Ð¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² Ð·Ð°ÐºÐ¾Ð½Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÑÑ… Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¾Ð¹. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° ÑÐ²Ð¾Ðµ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¸ Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ð½Ð°ÑˆÐ¸Ñ… Ð£ÑÐ»ÑƒÐ³, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð·Ð° Ð»ÑŽÐ±Ñ‹Ðµ Ð¿Ð¾ÑÐ»ÐµÐ´ÑÑ‚Ð²Ð¸Ñ ÑÑ‚Ð¾Ð³Ð¾. ÐœÑ‹ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð²ÑÐµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð¿Ñ€Ð¸Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°Ñ‚ÑŒÑÑ ÑÐ°Ð¼Ñ‹Ñ… Ð²Ñ‹ÑÐ¾ÐºÐ¸Ñ… ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð¾Ð² Ð²ÐµÐ¶Ð»Ð¸Ð²Ð¾ÑÑ‚Ð¸, ÑƒÐ²Ð°Ð¶ÐµÐ½Ð¸Ñ Ð¸ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð°Ð²Ð¾Ð²Ñ‹Ñ… Ð½Ð¾Ñ€Ð¼.',
      },
      {
        title: '2. Ð¡Ð¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð²',
        text: 'Ð’Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸ Ð£ÑÐ»ÑƒÐ³Ð¸ Ð´Ð»Ñ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð»ÑŽÐ±Ñ‹Ñ… Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ñ… Ð¼ÐµÑÑ‚Ð½Ñ‹Ñ…, Ð³Ð¾ÑÑƒÐ´Ð°Ñ€ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ñ…, Ð½Ð°Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¸Ð»Ð¸ Ð¼ÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ñ‹Ñ… Ð·Ð°ÐºÐ¾Ð½Ð¾Ð² Ð¸Ð»Ð¸ Ð¿Ñ€Ð°Ð²Ð¸Ð». Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚, Ð¿Ð¾Ð¼Ð¸Ð¼Ð¾ Ð¿Ñ€Ð¾Ñ‡ÐµÐ³Ð¾, Ð·Ð°ÐºÐ¾Ð½Ñ‹ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ñ…, Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸, ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð½Ð¾Ð¼ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ðµ, Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð¿Ñ€Ð°Ð² Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹ Ð¸ ÑƒÐ³Ð¾Ð»Ð¾Ð²Ð½Ñ‹Ðµ ÐºÐ¾Ð´ÐµÐºÑÑ‹. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð·Ð½Ð°Ð½Ð¸Ðµ Ð¸ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð² Ð²Ð°ÑˆÐµÐ¹ ÑŽÑ€Ð¸ÑÐ´Ð¸ÐºÑ†Ð¸Ð¸ Ð¸ ÑŽÑ€Ð¸ÑÐ´Ð¸ÐºÑ†Ð¸Ð¸ Ð˜ÑÐ¿Ð°Ð½Ð¸Ð¸.',
      },
      {
        title: '3. Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ñ†ÐµÐ»Ð¾ÑÑ‚Ð½Ð¾ÑÑ‚ÑŒ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹',
        text: 'Ð’Ñ‹ Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð½Ð°Ñ€ÑƒÑˆÐ°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿Ñ‹Ñ‚Ð°Ñ‚ÑŒÑÑ Ð½Ð°Ñ€ÑƒÑˆÐ¸Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð£ÑÐ»ÑƒÐ³. Ð—Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð½Ñ‹Ðµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚, Ð¿Ð¾Ð¼Ð¸Ð¼Ð¾ Ð¿Ñ€Ð¾Ñ‡ÐµÐ³Ð¾:\n\nâ€¢ Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð´Ð°Ð½Ð½Ñ‹Ð¼, Ð½Ðµ Ð¿Ñ€ÐµÐ´Ð½Ð°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð½Ñ‹Ð¼ Ð´Ð»Ñ Ð²Ð°Ñ, Ð¸Ð»Ð¸ Ð²Ñ…Ð¾Ð´ Ð½Ð° ÑÐµÑ€Ð²ÐµÑ€ Ð¸Ð»Ð¸ ÑƒÑ‡ÐµÑ‚Ð½ÑƒÑŽ Ð·Ð°Ð¿Ð¸ÑÑŒ, Ðº ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ Ñƒ Ð²Ð°Ñ Ð½ÐµÑ‚ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ñ Ð½Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿.\nâ€¢ ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð·Ð¾Ð½Ð´Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ, ÑÐºÐ°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑƒÑÐ·Ð²Ð¸Ð¼Ð¾ÑÑ‚ÑŒ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ Ð¸Ð»Ð¸ ÑÐµÑ‚Ð¸ Ð¸Ð»Ð¸ Ð½Ð°Ñ€ÑƒÑˆÐ°Ñ‚ÑŒ Ð¼ÐµÑ€Ñ‹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸ Ð¸Ð»Ð¸ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð±ÐµÐ· Ð½Ð°Ð´Ð»ÐµÐ¶Ð°Ñ‰ÐµÐ³Ð¾ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ñ.\nâ€¢ Ð’Ð¼ÐµÑˆÐ°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ Ð² Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ, Ñ…Ð¾ÑÑ‚Ð° Ð¸Ð»Ð¸ ÑÐµÑ‚Ð¸, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ, Ð¿Ð¾Ð¼Ð¸Ð¼Ð¾ Ð¿Ñ€Ð¾Ñ‡ÐµÐ³Ð¾, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÑƒ Ð²Ð¸Ñ€ÑƒÑÐ° Ð² Ð£ÑÐ»ÑƒÐ³Ð¸, Ð¿ÐµÑ€ÐµÐ³Ñ€ÑƒÐ·ÐºÑƒ, Â«Ñ„Ð»ÑƒÐ´Â», Â«ÑÐ¿Ð°Ð¼Â», Â«Ð¿Ð¾Ñ‡Ñ‚Ð¾Ð²Ñ‹Ðµ Ð±Ð¾Ð¼Ð±Ð°Ñ€Ð´Ð¸Ñ€Ð¾Ð²ÐºÐ¸Â» Ð¸Ð»Ð¸ Â«ÑÐ±Ð¾Ð¸Â».\nâ€¢ ÐŸÐ¾Ð´Ð´ÐµÐ»ÐºÐ° Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° Ð¿Ð°ÐºÐµÑ‚Ð° TCP/IP Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð¹ Ñ‡Ð°ÑÑ‚Ð¸ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° Ð² Ð»ÑŽÐ±Ð¾Ð¼ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¼ Ð¿Ð¸ÑÑŒÐ¼Ðµ Ð¸Ð»Ð¸ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ð¸.\nâ€¢ Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð»ÑŽÐ±Ð¾Ð³Ð¾ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð°, Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ð³Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹ Ð´Ð»Ñ Ð²Ð¼ÐµÑˆÐ°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° Ð¸Ð»Ð¸ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐ¸ Ð²Ð¼ÐµÑˆÐ°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° Ð² Ð½Ð°Ð´Ð»ÐµÐ¶Ð°Ñ‰ÑƒÑŽ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ Ð£ÑÐ»ÑƒÐ³.',
      },
      {
        title: '4. Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ñ‹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°',
        text: 'Ð’Ð°Ð¼ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð¾ Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ñ‚ÑŒ, Ð¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ð»ÑŽÐ±Ñ‹Ðµ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ñ‹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ:\n\nâ€¢ Ð¯Ð²Ð»ÑÑŽÑ‚ÑÑ Ð½ÐµÐ·Ð°ÐºÐ¾Ð½Ð½Ñ‹Ð¼Ð¸, Ð²Ñ€ÐµÐ´Ð½Ñ‹Ð¼Ð¸, ÑƒÐ³Ñ€Ð¾Ð¶Ð°ÑŽÑ‰Ð¸Ð¼Ð¸, Ð¾ÑÐºÐ¾Ñ€Ð±Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸, Ð´Ð¾Ð¼Ð¾Ð³Ð°ÑŽÑ‰Ð¸Ð¼Ð¸ÑÑ, Ð´ÐµÐ»Ð¸ÐºÑ‚Ð½Ñ‹Ð¼Ð¸, ÐºÐ»ÐµÐ²ÐµÑ‚Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼Ð¸, Ð²ÑƒÐ»ÑŒÐ³Ð°Ñ€Ð½Ñ‹Ð¼Ð¸, Ð½ÐµÐ¿Ñ€Ð¸ÑÑ‚Ð¾Ð¹Ð½Ñ‹Ð¼Ð¸, Ð¿Ð¾Ñ€Ð¾Ñ‡Ð°Ñ‰Ð¸Ð¼Ð¸, Ð²Ñ‚Ð¾Ñ€Ð³Ð°ÑŽÑ‰Ð¸Ð¼Ð¸ÑÑ Ð² Ñ‡Ð°ÑÑ‚Ð½ÑƒÑŽ Ð¶Ð¸Ð·Ð½ÑŒ Ð´Ñ€ÑƒÐ³Ð¸Ñ…, Ð½ÐµÐ½Ð°Ð²Ð¸ÑÑ‚Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼Ð¸ Ð¸Ð»Ð¸ Ñ€Ð°ÑÐ¾Ð²Ð¾, ÑÑ‚Ð½Ð¸Ñ‡ÐµÑÐºÐ¸ Ð¸Ð»Ð¸ Ð¸Ð½Ñ‹Ð¼ Ð¾Ð±Ñ€Ð°Ð·Ð¾Ð¼ Ð¿Ñ€ÐµÐ´Ð¾ÑÑƒÐ´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸.\nâ€¢ Ð­ÐºÑÐ¿Ð»ÑƒÐ°Ñ‚Ð¸Ñ€ÑƒÑŽÑ‚ Ð¸Ð»Ð¸ Ð½Ð°Ð½Ð¾ÑÑÑ‚ Ð²Ñ€ÐµÐ´ Ð½ÐµÑÐ¾Ð²ÐµÑ€ÑˆÐµÐ½Ð½Ð¾Ð»ÐµÑ‚Ð½Ð¸Ð¼ Ð»ÑŽÐ±Ñ‹Ð¼ ÑÐ¿Ð¾ÑÐ¾Ð±Ð¾Ð¼, Ð² Ñ‚Ð¾Ð¼ Ñ‡Ð¸ÑÐ»Ðµ Ð¿Ð¾Ð´Ð²ÐµÑ€Ð³Ð°Ñ Ð¸Ñ… Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑŽ Ð½ÐµÐ¿Ñ€Ð¸ÐµÐ¼Ð»ÐµÐ¼Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°.\nâ€¢ Ð’Ñ‹Ð´Ð°ÑŽÑ‚ ÑÐµÐ±Ñ Ð·Ð° Ð»ÑŽÐ±Ð¾Ðµ Ð»Ð¸Ñ†Ð¾ Ð¸Ð»Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸ÑŽ Ð¸Ð»Ð¸ Ð»Ð¾Ð¶Ð½Ð¾ Ð·Ð°ÑÐ²Ð»ÑÑŽÑ‚ Ð¸Ð»Ð¸ Ð¸Ð½Ñ‹Ð¼ Ð¾Ð±Ñ€Ð°Ð·Ð¾Ð¼ Ð¸ÑÐºÐ°Ð¶Ð°ÑŽÑ‚ Ð²Ð°ÑˆÑƒ ÑÐ²ÑÐ·ÑŒ Ñ Ð»Ð¸Ñ†Ð¾Ð¼ Ð¸Ð»Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸ÐµÐ¹.\nâ€¢ Ð¡Ð¾Ð´ÐµÑ€Ð¶Ð°Ñ‚ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ñ‹Ðµ Ð²Ð¸Ñ€ÑƒÑÑ‹ Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð¹ Ð´Ñ€ÑƒÐ³Ð¾Ð¹ ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ð½Ñ‹Ð¹ ÐºÐ¾Ð´, Ñ„Ð°Ð¹Ð»Ñ‹ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹, Ð¿Ñ€ÐµÐ´Ð½Ð°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð»Ñ Ð¿Ñ€ÐµÑ€Ñ‹Ð²Ð°Ð½Ð¸Ñ, ÑƒÐ½Ð¸Ñ‡Ñ‚Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð»ÑŽÐ±Ð¾Ð³Ð¾ ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ð³Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸Ð»Ð¸ Ñ‚ÐµÐ»ÐµÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ.',
      },
      {
        title: '5. ÐŸÑ€Ð°Ð²Ð° Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸',
        text: 'Ð’Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð£ÑÐ»ÑƒÐ³Ð¸ Ð´Ð»Ñ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð½ÐµÐ·Ð°ÐºÐ¾Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¸ÑÐ²Ð¾ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð°Ð² Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ†, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ðµ Ð¿Ñ€Ð°Ð²Ð°, Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð½Ð°ÐºÐ¸, ÐºÐ¾Ð¼Ð¼ÐµÑ€Ñ‡ÐµÑÐºÐ¸Ðµ Ñ‚Ð°Ð¹Ð½Ñ‹, Ð¿Ð°Ñ‚ÐµÐ½Ñ‚Ñ‹ Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ðµ Ð¿Ñ€Ð°Ð²Ð° ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸. ÐœÑ‹ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð°Ð½Ð½ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ðµ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð·Ð»Ð¾ÑÑ‚Ð½Ñ‹Ð¼Ð¸ Ð½Ð°Ñ€ÑƒÑˆÐ¸Ñ‚ÐµÐ»ÑÐ¼Ð¸.',
      },
      {
        title: '6. Ð¡Ð¿Ð°Ð¼ Ð¸ Ð½ÐµÐ¶ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ',
        text: 'Ð£ÑÐ»ÑƒÐ³Ð¸ Ð½Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð´Ð»Ñ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐ¸ Ð½ÐµÐ¶ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… ÐºÐ¾Ð¼Ð¼ÐµÑ€Ñ‡ÐµÑÐºÐ¸Ñ… ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ð¹ Ð¸Ð»Ð¸ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¹ Ð² Ð»ÑŽÐ±Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ (ÑÐ¿Ð°Ð¼). Ð’Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð£ÑÐ»ÑƒÐ³Ð¸ Ð´Ð»Ñ ÑÐ±Ð¾Ñ€Ð° Ð¾Ñ‚Ð²ÐµÑ‚Ð¾Ð² Ð½Ð° Ð½ÐµÐ¶ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½ÑƒÑŽ Ð¿Ð¾Ñ‡Ñ‚Ñƒ, Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð½ÑƒÑŽ Ñ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ñ… Ð·Ð°Ð¿Ð¸ÑÐµÐ¹ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¸Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚-Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ð¾Ð² Ð¸Ð»Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¹. Ð’Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑÐ¾Ð±Ð¸Ñ€Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð½Ð°ÐºÐ°Ð¿Ð»Ð¸Ð²Ð°Ñ‚ÑŒ Ð°Ð´Ñ€ÐµÑÐ° ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¹ Ð¿Ð¾Ñ‡Ñ‚Ñ‹ Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³ÑƒÑŽ ÐºÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð£ÑÐ»ÑƒÐ³ Ñ Ð¿Ð¾Ð¼Ð¾Ñ‰ÑŒÑŽ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ñ‹Ñ… Ð¸Ð»Ð¸ Ð¸Ð½Ñ‹Ñ… ÑÑ€ÐµÐ´ÑÑ‚Ð².',
      },
      {
        title: '7. Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ ÑÐºÑ€Ð°Ð¿Ð¸Ð½Ð³',
        text: 'Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ñ€Ð¾Ð±Ð¾Ñ‚Ð°, Ð¿Ð°ÑƒÐºÐ°, Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ð¿Ð¾Ð¸ÑÐºÐ°/Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ ÑÐ°Ð¹Ñ‚Ð¾Ð² Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¾Ð³Ð¾ Ñ€ÑƒÑ‡Ð½Ð¾Ð³Ð¾ Ð¸Ð»Ð¸ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð° Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÑÑÐ° Ð´Ð»Ñ Ð¸Ð·Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ, Ð¸Ð½Ð´ÐµÐºÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ, Â«Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…Â» Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ð´Ñ€ÑƒÐ³Ð¾Ð³Ð¾ Ð²Ð¾ÑÐ¿Ñ€Ð¾Ð¸Ð·Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð¾Ð±Ñ…Ð¾Ð´Ð° Ð½Ð°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð£ÑÐ»ÑƒÐ³ Ð¸Ð»Ð¸ Ð¸Ñ… ÑÐ¾Ð´ÐµÑ€Ð¶Ð¸Ð¼Ð¾Ð³Ð¾ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð¾.',
      },
      {
        title: '8. ÐŸÑ€Ð¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ',
        text: 'ÐœÑ‹ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾, Ð½Ð¾ Ð½Ðµ Ð±ÐµÑ€ÐµÐ¼ Ð½Ð° ÑÐµÐ±Ñ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾, Ñ€Ð°ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ñ‚ÑŒ Ð»ÑŽÐ±Ð¾Ðµ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸Ð»Ð¸ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¾Ð¼ÐµÑ€Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð£ÑÐ»ÑƒÐ³. ÐœÑ‹ Ð¼Ð¾Ð¶ÐµÐ¼:\n\nâ€¢ Ð Ð°ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ñ‚ÑŒ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸Ð»Ð¸ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¾Ð¼ÐµÑ€Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð£ÑÐ»ÑƒÐ³.\nâ€¢ Ð£Ð´Ð°Ð»ÑÑ‚ÑŒ, Ð¾Ñ‚ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ð¸Ð»Ð¸ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ Ð»ÑŽÐ±Ð¾Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¸Ð»Ð¸ Ñ€ÐµÑÑƒÑ€Ñ, Ð½Ð°Ñ€ÑƒÑˆÐ°ÑŽÑ‰Ð¸Ð¹ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÑƒÑŽ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ.\nâ€¢ ÐŸÑ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰Ð°Ñ‚ÑŒ Ð²Ð°Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð£ÑÐ»ÑƒÐ³Ð°Ð¼ Ð¿Ð¾ Ð»ÑŽÐ±Ð¾Ð¹ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½Ðµ, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸.\nâ€¢ Ð¡Ð¾Ð¾Ð±Ñ‰Ð°Ñ‚ÑŒ Ð¾ Ð»ÑŽÐ±Ð¾Ð¹ Ð´ÐµÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸, ÐºÐ¾Ñ‚Ð¾Ñ€Ð°Ñ, Ð¿Ð¾ Ð½Ð°ÑˆÐµÐ¼Ñƒ Ð¼Ð½ÐµÐ½Ð¸ÑŽ, Ð½Ð°Ñ€ÑƒÑˆÐ°ÐµÑ‚ ÐºÐ°ÐºÐ¾Ð¹-Ð»Ð¸Ð±Ð¾ Ð·Ð°ÐºÐ¾Ð½ Ð¸Ð»Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ, ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¼ Ð´Ð¾Ð»Ð¶Ð½Ð¾ÑÑ‚Ð½Ñ‹Ð¼ Ð»Ð¸Ñ†Ð°Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¾Ñ€Ð³Ð°Ð½Ð¾Ð², Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ð¼ Ð¾Ñ€Ð³Ð°Ð½Ð°Ð¼ Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¼ Ñ‚Ñ€ÐµÑ‚ÑŒÐ¸Ð¼ Ð»Ð¸Ñ†Ð°Ð¼.',
      },
      {
        title: '9. Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÑÑ…',
        text: 'Ð•ÑÐ»Ð¸ Ð²Ð°Ð¼ ÑÑ‚Ð°Ð½ÐµÑ‚ Ð¸Ð·Ð²ÐµÑÑ‚Ð½Ð¾ Ð¾ ÐºÐ°ÐºÐ¾Ð¼-Ð»Ð¸Ð±Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ð¸ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸, Ð¼Ñ‹ Ð¿Ñ€Ð¾ÑÐ¸Ð¼ Ð²Ð°Ñ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ ÑÐ¾Ð¾Ð±Ñ‰Ð¸Ñ‚ÑŒ Ð½Ð°Ð¼ Ð¾Ð± ÑÑ‚Ð¾Ð¼ Ð¿Ð¾ Ð°Ð´Ñ€ÐµÑÑƒ legal@ekabalance.com. ÐŸÑ€Ð¸ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ð¸ ÑƒÐºÐ°Ð¶Ð¸Ñ‚Ðµ ÐºÐ°Ðº Ð¼Ð¾Ð¶Ð½Ð¾ Ð±Ð¾Ð»ÑŒÑˆÐµ Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½Ð¾ÑÑ‚ÐµÐ¹, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð¸ Ð»ÑŽÐ±Ñ‹Ðµ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´Ð°ÑŽÑ‰Ð¸Ðµ Ð´Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°.',
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
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">{t.title}</h1>
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
