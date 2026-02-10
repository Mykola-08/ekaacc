'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Legal Notice (Imprint)',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the identifying data of the owner of the website are set out below.',
    sections: [
      {
        id: 'identity',
        title: '1. Identity of the Website Owner',
        text: 'Owner: EKA Balance\nRegistered Office: [Insert Address], Barcelona, Spain\nNIF/CIF: [Insert Tax ID]\nEmail: legal@ekabalance.com\n\nRegistered in the Commercial Registry of Barcelona: [Insert Registry Data, e.g., Volume X, Folio Y, Sheet Z].',
      },
      {
        id: 'purpose',
        title: '2. Purpose of the Website',
        text: 'The purpose of this website is to provide information about therapy services, facilitate booking of appointments, and offer resources related to mental health and well-being.',
      },
      {
        id: 'terms',
        title: '3. Terms of Use',
        text: 'Access to and use of this website attributes the condition of USER, who accepts, from said access and/or use, the General Terms of Use reflected here. The aforementioned Terms will apply regardless of the General Terms of Contracting that, if applicable, are mandatory.',
      },
      {
        id: 'data-protection',
        title: '4. Data Protection',
        text: 'EKA Balance complies with the guidelines of the Organic Law 3/2018 on Personal Data Protection and Guarantee of Digital Rights (LOPDGDD) and the General Data Protection Regulation (GDPR) (EU) 2016/679. For more information, please refer to our Privacy Policy.',
      },
      {
        id: 'ip',
        title: '5. Intellectual and Industrial Property',
        text: 'EKA Balance, by itself or as an assignee, is the owner of all intellectual and industrial property rights of its website, as well as the elements contained therein (including but not limited to images, sound, audio, video, software or texts; trademarks or logos, color combinations, structure and design, selection of materials used, computer programs necessary for its operation, access and use, etc.). All rights reserved.',
      },
      {
        id: 'liability',
        title: '6. Exclusion of Guarantees and Liability',
        text: 'EKA Balance is not responsible, in any case, for damages of any nature that may cause, by way of example: errors or omissions in the content, lack of availability of the portal or the transmission of viruses or malicious or harmful programs in the content, despite having adopted all the necessary technological measures to prevent it.',
      },
      {
        id: 'modifications',
        title: '7. Modifications',
        text: 'EKA Balance reserves the right to make unannounced changes it deems appropriate to its portal, being able to change, delete or add both the content and services provided through it and the way in which they are presented or located on its portal.',
      },
      {
        id: 'jurisdiction',
        title: '8. Applicable Law and Jurisdiction',
        text: 'The relationship between EKA Balance and the USER shall be governed by current Spanish regulations and any controversy shall be submitted to the Courts and Tribunals of the city of Barcelona.',
      },
    ],
  },
  es: {
    title: 'Aviso Legal',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'En cumplimiento del artÃ­culo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la InformaciÃ³n y del Comercio ElectrÃ³nico (LSSI-CE), se exponen a continuaciÃ³n los datos identificativos del titular del sitio web.',
    sections: [
      {
        title: '1. Identidad del Titular de la Web',
        text: 'Titular: EKA Balance\nDomicilio Social: [Insertar DirecciÃ³n], Barcelona, EspaÃ±a\nNIF/CIF: [Insertar NIF]\nEmail: legal@ekabalance.com\n\nInscrita en el Registro Mercantil de Barcelona: [Insertar Datos Registrales, ej. Tomo X, Folio Y, Hoja Z].',
      },
      {
        title: '2. Finalidad del Sitio Web',
        text: 'La finalidad de este sitio web es proporcionar informaciÃ³n sobre servicios de terapia, facilitar la reserva de citas y ofrecer recursos relacionados con la salud mental y el bienestar.',
      },
      {
        title: '3. Condiciones de Uso',
        text: 'El acceso y/o uso de este portal atribuye la condiciÃ³n de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquÃ­ reflejadas. Las citadas Condiciones serÃ¡n de aplicaciÃ³n independientemente de las Condiciones Generales de ContrataciÃ³n que en su caso resulten de obligado cumplimiento.',
      },
      {
        title: '4. ProtecciÃ³n de Datos',
        text: 'EKA Balance cumple con las directrices de la Ley OrgÃ¡nica 3/2018 de ProtecciÃ³n de Datos Personales y garantÃ­a de los derechos digitales (LOPDGDD) y el Reglamento General de ProtecciÃ³n de Datos (RGPD) (UE) 2016/679. Para mÃ¡s informaciÃ³n, consulte nuestra PolÃ­tica de Privacidad.',
      },
      {
        title: '5. Propiedad Intelectual e Industrial',
        text: 'EKA Balance por sÃ­ o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su pÃ¡gina web, asÃ­ como de los elementos contenidos en la misma (a tÃ­tulo enunciativo, imÃ¡genes, sonido, audio, vÃ­deo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseÃ±o, selecciÃ³n de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.). Todos los derechos reservados.',
      },
      {
        title: '6. ExclusiÃ³n de GarantÃ­as y Responsabilidad',
        text: 'EKA Balance no se hace responsable, en ningÃºn caso, de los daÃ±os y perjuicios de cualquier naturaleza que pudieran ocasionar, a tÃ­tulo enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisiÃ³n de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnolÃ³gicas necesarias para evitarlo.',
      },
      {
        title: '7. Modificaciones',
        text: 'EKA Balance se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o aÃ±adir tanto los contenidos y servicios que se presten a travÃ©s de la misma como la forma en la que Ã©stos aparezcan presentados o localizados en su portal.',
      },
      {
        title: '8. LegislaciÃ³n Aplicable y JurisdicciÃ³n',
        text: 'La relaciÃ³n entre EKA Balance y el USUARIO se regirÃ¡ por la normativa espaÃ±ola vigente y cualquier controversia se someterÃ¡ a los Juzgados y Tribunales de la ciudad de Barcelona.',
      },
    ],
  },
  ca: {
    title: 'AvÃ­s Legal',
    updated: 'Darrera actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la InformaciÃ³ i del ComerÃ§ ElectrÃ²nic (LSSI-CE), s'exposen a continuaciÃ³ les dades identificatives del titular del lloc web.",
    sections: [
      {
        title: '1. Identitat del Titular del Web',
        text: 'Titular: EKA Balance\nDomicili Social: [Inserir AdreÃ§a], Barcelona, Espanya\nNIF/CIF: [Inserir NIF]\nEmail: legal@ekabalance.com\n\nInscrita al Registre Mercantil de Barcelona: [Inserir Dades Registrals, ex. Tom X, Foli Y, Full Z].',
      },
      {
        title: '2. Finalitat del Lloc Web',
        text: "La finalitat d'aquest lloc web Ã©s proporcionar informaciÃ³ sobre serveis de terÃ pia, facilitar la reserva de cites i oferir recursos relacionats amb la salut mental i el benestar.",
      },
      {
        title: "3. Condicions d'Ãšs",
        text: "L'accÃ©s i/o Ãºs d'aquest portal atribueix la condiciÃ³ d'USUARI, que accepta, des d'aquest accÃ©s i/o Ãºs, les Condicions Generals d'Ãšs aquÃ­ reflectides. Les esmentades Condicions seran d'aplicaciÃ³ independentment de les Condicions Generals de ContractaciÃ³ que si s'escau resultin d'obligat compliment.",
      },
      {
        title: '4. ProtecciÃ³ de Dades',
        text: 'EKA Balance compleix amb les directrius de la Llei OrgÃ nica 3/2018 de ProtecciÃ³ de Dades Personals i garantia dels drets digitals (LOPDGDD) i el Reglament General de ProtecciÃ³ de Dades (RGPD) (UE) 2016/679. Per a mÃ©s informaciÃ³, consulti la nostra PolÃ­tica de Privacitat.',
      },
      {
        title: '5. Propietat IntelÂ·lectual i Industrial',
        text: "EKA Balance per si o com a cessionÃ ria, Ã©s titular de tots els drets de propietat intelÂ·lectual i industrial de la seva pÃ gina web, aixÃ­ com dels elements continguts en la mateixa (a tÃ­tol enunciatiu, imatges, so, Ã udio, vÃ­deo, programari o textos; marques o logotips, combinacions de colors, estructura i disseny, selecciÃ³ de materials usats, programes d'ordinador necessaris per al seu funcionament, accÃ©s i Ãºs, etc.). Tots els drets reservats.",
      },
      {
        title: '6. ExclusiÃ³ de Garanties i Responsabilitat',
        text: 'EKA Balance no es fa responsable, en cap cas, dels danys i perjudicis de qualsevol naturalesa que poguessin ocasionar, a tÃ­tol enunciatiu: errors o omissions en els continguts, falta de disponibilitat del portal o la transmissiÃ³ de virus o programes maliciosos o lesius en els continguts, malgrat haver adoptat totes les mesures tecnolÃ²giques necessÃ ries per evitar-ho.',
      },
      {
        title: '7. Modificacions',
        text: "EKA Balance es reserva el dret d'efectuar sense previ avÃ­s les modificacions que consideri oportunes al seu portal, podent canviar, suprimir o afegir tant els continguts i serveis que es prestin a travÃ©s de la mateixa com la forma en la qual aquests apareguin presentats o localitzats al seu portal.",
      },
      {
        title: '8. LegislaciÃ³ Aplicable i JurisdicciÃ³',
        text: "La relaciÃ³ entre EKA Balance i l'USUARI es regirÃ  per la normativa espanyola vigent i qualsevol controvÃ¨rsia se sotmetrÃ  als Jutjats i Tribunals de la ciutat de Barcelona.",
      },
    ],
  },
  ru: {
    title: 'ÐŸÑ€Ð°Ð²Ð¾Ð²Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'Ð’ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ ÑÐ¾ ÑÑ‚Ð°Ñ‚ÑŒÐµÐ¹ 10 Ð—Ð°ÐºÐ¾Ð½Ð° 34/2002 Ð¾Ñ‚ 11 Ð¸ÑŽÐ»Ñ Ð¾Ð± ÑƒÑÐ»ÑƒÐ³Ð°Ñ… Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ð¾Ð±Ñ‰ÐµÑÑ‚Ð²Ð° Ð¸ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¹ ÐºÐ¾Ð¼Ð¼ÐµÑ€Ñ†Ð¸Ð¸ (LSSI-CE), Ð½Ð¸Ð¶Ðµ Ð¿Ñ€Ð¸Ð²ÐµÐ´ÐµÐ½Ñ‹ Ð¸Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°.',
    sections: [
      {
        title: '1. Ð›Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°',
        text: 'Ð’Ð»Ð°Ð´ÐµÐ»ÐµÑ†: EKA Balance\nÐ®Ñ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð°Ð´Ñ€ÐµÑ: [Ð’ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ð°Ð´Ñ€ÐµÑ], Ð‘Ð°Ñ€ÑÐµÐ»Ð¾Ð½Ð°, Ð˜ÑÐ¿Ð°Ð½Ð¸Ñ\nNIF/CIF: [Ð’ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ NIF]\nEmail: legal@ekabalance.com\n\nÐ—Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¾ Ð² Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ð¾Ð¼ Ñ€ÐµÐµÑÑ‚Ñ€Ðµ Ð‘Ð°Ñ€ÑÐµÐ»Ð¾Ð½Ñ‹: [Ð’ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ].',
      },
      {
        title: '2. Ð¦ÐµÐ»ÑŒ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°',
        text: 'Ð¦ÐµÐ»ÑŒÑŽ Ð´Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ñ‚ÐµÑ€Ð°Ð¿ÐµÐ²Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… ÑƒÑÐ»ÑƒÐ³Ð°Ñ…, Ð¾Ð±Ð»ÐµÐ³Ñ‡ÐµÐ½Ð¸Ðµ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð½Ð° Ð¿Ñ€Ð¸ÐµÐ¼ Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ€ÐµÑÑƒÑ€ÑÐ¾Ð², ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ñ… Ñ Ð¿ÑÐ¸Ñ…Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼ Ð·Ð´Ð¾Ñ€Ð¾Ð²ÑŒÐµÐ¼ Ð¸ Ð±Ð»Ð°Ð³Ð¾Ð¿Ð¾Ð»ÑƒÑ‡Ð¸ÐµÐ¼.',
      },
      {
        title: '3. Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ',
        text: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ðº ÑÑ‚Ð¾Ð¼Ñƒ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ñƒ Ð¸/Ð¸Ð»Ð¸ ÐµÐ³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ñ€Ð¸ÑÐ²Ð°Ð¸Ð²Ð°ÐµÑ‚ ÑÑ‚Ð°Ñ‚ÑƒÑ ÐŸÐžÐ›Ð¬Ð—ÐžÐ’ÐÐ¢Ð•Ð›Ð¯, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÑ‚ Ñ Ð¼Ð¾Ð¼ÐµÐ½Ñ‚Ð° Ñ‚Ð°ÐºÐ¾Ð³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ð¸/Ð¸Ð»Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ ÐžÐ±Ñ‰Ð¸Ðµ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ, Ð¾Ñ‚Ñ€Ð°Ð¶ÐµÐ½Ð½Ñ‹Ðµ Ð·Ð´ÐµÑÑŒ. Ð’Ñ‹ÑˆÐµÑƒÐ¿Ð¾Ð¼ÑÐ½ÑƒÑ‚Ñ‹Ðµ Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÑŽÑ‚ÑÑ Ð½ÐµÐ·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ Ð¾Ñ‚ ÐžÐ±Ñ‰Ð¸Ñ… ÑƒÑÐ»Ð¾Ð²Ð¸Ð¹ Ð·Ð°ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ€Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ, ÐµÑÐ»Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ð¾, ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸.',
      },
      {
        title: '4. Ð—Ð°Ñ‰Ð¸Ñ‚Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…',
        text: 'EKA Balance ÑÐ¾Ð±Ð»ÑŽÐ´Ð°ÐµÑ‚ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´ÑÑ‰Ð¸Ðµ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹ ÐžÑ€Ð³Ð°Ð½Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð·Ð°ÐºÐ¾Ð½Ð° 3/2018 Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ð¸ Ñ†Ð¸Ñ„Ñ€Ð¾Ð²Ñ‹Ñ… Ð¿Ñ€Ð°Ð² (LOPDGDD) Ð¸ ÐžÐ±Ñ‰ÐµÐ³Ð¾ Ñ€ÐµÐ³Ð»Ð°Ð¼ÐµÐ½Ñ‚Ð° Ð¿Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… (GDPR) (Ð•Ð¡) 2016/679. Ð”Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ ÑÐ¼. Ð½Ð°ÑˆÑƒ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸.',
      },
      {
        title: '5. Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ Ð¸ Ð¿Ñ€Ð¾Ð¼Ñ‹ÑˆÐ»ÐµÐ½Ð½Ð°Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
        text: 'EKA Balance ÑÐ°Ð¼Ð¾ÑÑ‚Ð¾ÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¸Ð»Ð¸ Ð² ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ðµ Ð¿Ñ€Ð°Ð²Ð¾Ð¿Ñ€ÐµÐµÐ¼Ð½Ð¸ÐºÐ° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð²ÑÐµÑ… Ð¿Ñ€Ð°Ð² Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ Ð¸ Ð¿Ñ€Ð¾Ð¼Ñ‹ÑˆÐ»ÐµÐ½Ð½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð° ÑÐ²Ð¾Ð¹ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚, Ð° Ñ‚Ð°ÐºÐ¶Ðµ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð¾Ð², ÑÐ¾Ð´ÐµÑ€Ð¶Ð°Ñ‰Ð¸Ñ…ÑÑ Ð½Ð° Ð½ÐµÐ¼ (Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ, Ð¿Ð¾Ð¼Ð¸Ð¼Ð¾ Ð¿Ñ€Ð¾Ñ‡ÐµÐ³Ð¾, Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ, Ð·Ð²ÑƒÐº, Ð°ÑƒÐ´Ð¸Ð¾, Ð²Ð¸Ð´ÐµÐ¾, Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ðµ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ Ñ‚ÐµÐºÑÑ‚Ñ‹; Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð½Ð°ÐºÐ¸ Ð¸Ð»Ð¸ Ð»Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿Ñ‹, Ñ†Ð²ÐµÑ‚Ð¾Ð²Ñ‹Ðµ ÑÐ¾Ñ‡ÐµÑ‚Ð°Ð½Ð¸Ñ, ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð¸ Ð´Ð¸Ð·Ð°Ð¹Ð½, Ð²Ñ‹Ð±Ð¾Ñ€ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼Ñ‹Ñ… Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ð¾Ð², ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹, Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ðµ Ð´Ð»Ñ ÐµÐ³Ð¾ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹, Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸ Ñ‚. Ð´.). Ð’ÑÐµ Ð¿Ñ€Ð°Ð²Ð° Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ñ‹.',
      },
      {
        title: '6. Ð˜ÑÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ð¹ Ð¸ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸',
        text: 'EKA Balance Ð½Ð¸ Ð² ÐºÐ¾ÐµÐ¼ ÑÐ»ÑƒÑ‡Ð°Ðµ Ð½Ðµ Ð½ÐµÑÐµÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð·Ð° ÑƒÑ‰ÐµÑ€Ð± Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð°, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½ÐµÐ½, Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€: Ð¾ÑˆÐ¸Ð±ÐºÐ¸ Ð¸Ð»Ð¸ ÑƒÐ¿ÑƒÑ‰ÐµÐ½Ð¸Ñ Ð² ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ðµ, Ð¾Ñ‚ÑÑƒÑ‚ÑÑ‚Ð²Ð¸Ðµ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ð¾Ñ€Ñ‚Ð°Ð»Ð° Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ð° Ð²Ð¸Ñ€ÑƒÑÐ¾Ð² Ð¸Ð»Ð¸ Ð²Ñ€ÐµÐ´Ð¾Ð½Ð¾ÑÐ½Ñ‹Ñ… Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼ Ð² ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ðµ, Ð½ÐµÑÐ¼Ð¾Ñ‚Ñ€Ñ Ð½Ð° Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð¸Ðµ Ð²ÑÐµÑ… Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ñ… Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¼ÐµÑ€ Ð´Ð»Ñ ÐµÐ³Ð¾ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ.',
      },
      {
        title: '7. ÐœÐ¾Ð´Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸',
        text: 'EKA Balance Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð²Ð½Ð¾ÑÐ¸Ñ‚ÑŒ Ð±ÐµÐ· Ð¿Ñ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¾Ð½Ð° ÑÐ¾Ñ‡Ñ‚ÐµÑ‚ Ñ†ÐµÐ»ÐµÑÐ¾Ð¾Ð±Ñ€Ð°Ð·Ð½Ñ‹Ð¼Ð¸, Ð½Ð° ÑÐ²Ð¾ÐµÐ¼ Ð¿Ð¾Ñ€Ñ‚Ð°Ð»Ðµ, Ð¸Ð¼ÐµÑ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ, ÑƒÐ´Ð°Ð»ÑÑ‚ÑŒ Ð¸Ð»Ð¸ Ð´Ð¾Ð±Ð°Ð²Ð»ÑÑ‚ÑŒ ÐºÐ°Ðº ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¸ ÑƒÑÐ»ÑƒÐ³Ð¸, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼Ñ‹Ðµ Ñ‡ÐµÑ€ÐµÐ· Ð½ÐµÐ³Ð¾, Ñ‚Ð°Ðº Ð¸ ÑÐ¿Ð¾ÑÐ¾Ð± Ð¸Ñ… Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ñ€Ð°Ð·Ð¼ÐµÑ‰ÐµÐ½Ð¸Ñ Ð½Ð° ÑÐ²Ð¾ÐµÐ¼ Ð¿Ð¾Ñ€Ñ‚Ð°Ð»Ðµ.',
      },
      {
        title: '8. ÐŸÑ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ð¾Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð¸ ÑŽÑ€Ð¸ÑÐ´Ð¸ÐºÑ†Ð¸Ñ',
        text: 'ÐžÑ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ñ Ð¼ÐµÐ¶Ð´Ñƒ EKA Balance Ð¸ ÐŸÐžÐ›Ð¬Ð—ÐžÐ’ÐÐ¢Ð•Ð›Ð•Ðœ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‚ÑÑ Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¼ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾Ð¼ Ð˜ÑÐ¿Ð°Ð½Ð¸Ð¸, Ð¸ Ð»ÑŽÐ±Ñ‹Ðµ ÑÐ¿Ð¾Ñ€Ñ‹ Ð¿ÐµÑ€ÐµÐ´Ð°ÑŽÑ‚ÑÑ Ð² ÑÑƒÐ´Ñ‹ Ð¸ Ñ‚Ñ€Ð¸Ð±ÑƒÐ½Ð°Ð»Ñ‹ Ð³Ð¾Ñ€Ð¾Ð´Ð° Ð‘Ð°Ñ€ÑÐµÐ»Ð¾Ð½Ñ‹.',
      },
    ],
  },
};

export default function ImprintPage() {
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
