'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Intellectual Property Policy',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'EKA Balance respects the intellectual property rights of others and expects its users to do the same. It is our policy, in appropriate circumstances and at our discretion, to disable and/or terminate the accounts of users who repeatedly infringe or are repeatedly charged with infringing the copyrights or other intellectual property rights of others.',
    sections: [
      {
        id: 'eka-ip',
        title: '1. EKA Balance Intellectual Property',
        text: 'The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of EKA Balance and its licensors. The Service is protected by copyright, trademark, and other laws of both Spain and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EKA Balance.',
      },
      {
        id: 'user-content-license',
        title: '2. User Content License',
        text: "By posting, uploading, or otherwise submitting content to the Service (\"User Content\"), you grant EKA Balance a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service and EKA Balance's (and its successors' and affiliates') business, including without limitation for promoting and redistributing part or all of the Service (and derivative works thereof) in any media formats and through any media channels. You retain all ownership rights to your User Content.",
      },
      {
        id: 'copyright-infringement',
        title: '3. Copyright Infringement Notification',
        text: 'If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, you must submit your notice in writing to the attention of "Copyright Agent" of EKA Balance and include in your notice a detailed description of the alleged infringement.\n\nYou may be held accountable for damages (including costs and attorneys\' fees) for misrepresenting that any Content is infringing your copyright.',
      },
      {
        id: 'dmca-notice',
        title: '4. DMCA Notice and Procedure for Copyright Infringement Claims',
        text: "You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):\n\nâ€¢ An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.\nâ€¢ A description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.\nâ€¢ Identification of the URL or other specific location on the Service where the material that you claim is infringing is located.\nâ€¢ Your address, telephone number, and email address.\nâ€¢ A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.\nâ€¢ A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.\n\nYou can contact our Copyright Agent via email at legal@ekabalance.com.",
      },
      {
        id: 'counter-notice',
        title: '5. Counter-Notice',
        text: "If you believe that your Content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your Content, you may send a counter-notice containing the following information to the Copyright Agent:\n\nâ€¢ Your physical or electronic signature.\nâ€¢ Identification of the Content that has been removed or to which access has been disabled and the location at which the Content appeared before it was removed or disabled.\nâ€¢ A statement that you have a good faith belief that the Content was removed or disabled as a result of mistake or a misidentification of the Content.\nâ€¢ Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the courts in Barcelona, Spain, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.",
      },
      {
        id: 'trademark-complaints',
        title: '6. Trademark Complaints',
        text: "EKA Balance also respects the trademark rights of others. Accounts with any other content that misleads others or violates another's trademark may be updated, suspended, disabled, or terminated by EKA Balance in its sole discretion. If you are concerned that someone may be using your trademark in an infringing way on our Service, please email us at legal@ekabalance.com, and we will review your complaint. If we deem appropriate, we may remove the offending content, warn the individual who posted the content, and/or temporarily or permanently suspend or terminate the individual's account.",
      },
    ],
  },
  es: {
    title: 'PolÃ­tica de Propiedad Intelectual',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'EKA Balance respeta los derechos de propiedad intelectual de otros y espera que sus usuarios hagan lo mismo. Es nuestra polÃ­tica, en las circunstancias apropiadas y a nuestra discreciÃ³n, deshabilitar y/o cancelar las cuentas de los usuarios que infrinjan repetidamente o sean acusados repetidamente de infringir los derechos de autor u otros derechos de propiedad intelectual de otros.',
    sections: [
      {
        id: 'eka-ip',
        title: '1. Propiedad Intelectual de EKA Balance',
        text: 'El Servicio y su contenido original (excluyendo el Contenido proporcionado por los usuarios), caracterÃ­sticas y funcionalidad son y seguirÃ¡n siendo propiedad exclusiva de EKA Balance y sus licenciantes. El Servicio estÃ¡ protegido por derechos de autor, marcas registradas y otras leyes tanto de EspaÃ±a como de paÃ­ses extranjeros. Nuestras marcas comerciales e imagen comercial no pueden utilizarse en relaciÃ³n con ningÃºn producto o servicio sin el consentimiento previo por escrito de EKA Balance.',
      },
      {
        id: 'user-content-license',
        title: '2. Licencia de Contenido de Usuario',
        text: 'Al publicar, cargar o enviar contenido al Servicio ("Contenido de Usuario"), usted otorga a EKA Balance una licencia no exclusiva, mundial, libre de regalÃ­as, sublicenciable y transferible para usar, reproducir, distribuir, preparar trabajos derivados de, mostrar y realizar el Contenido de Usuario en relaciÃ³n con el Servicio y el negocio de EKA Balance (y sus sucesores y afiliados), incluyendo, entre otros, para promover y redistribuir parte o la totalidad del Servicio (y trabajos derivados del mismo) en cualquier formato de medios y a travÃ©s de cualquier canal de medios. Usted conserva todos los derechos de propiedad sobre su Contenido de Usuario.',
      },
      {
        id: 'copyright-infringement',
        title: '3. NotificaciÃ³n de InfracciÃ³n de Derechos de Autor',
        text: 'Si usted es propietario de derechos de autor, o estÃ¡ autorizado en nombre de uno, y cree que el trabajo protegido por derechos de autor ha sido copiado de una manera que constituye una infracciÃ³n de derechos de autor que estÃ¡ teniendo lugar a travÃ©s del Servicio, debe enviar su aviso por escrito a la atenciÃ³n del "Agente de Derechos de Autor" de EKA Balance e incluir en su aviso una descripciÃ³n detallada de la supuesta infracciÃ³n.\n\nUsted puede ser considerado responsable de los daÃ±os (incluidos los costos y los honorarios de los abogados) por tergiversar que cualquier Contenido infringe sus derechos de autor.',
      },
      {
        id: 'dmca-notice',
        title:
          '4. Aviso y Procedimiento de la DMCA para Reclamaciones de InfracciÃ³n de Derechos de Autor',
        text: 'Puede enviar una notificaciÃ³n de conformidad con la Ley de Derechos de Autor del Milenio Digital (DMCA) proporcionando a nuestro Agente de Derechos de Autor la siguiente informaciÃ³n por escrito (consulte 17 U.S.C 512(c)(3) para obtener mÃ¡s detalles):\n\nâ€¢ Una firma electrÃ³nica o fÃ­sica de la persona autorizada para actuar en nombre del propietario del interÃ©s de los derechos de autor.\nâ€¢ Una descripciÃ³n del trabajo protegido por derechos de autor que usted afirma que ha sido infringido, incluida la URL (es decir, la direcciÃ³n de la pÃ¡gina web) de la ubicaciÃ³n donde existe el trabajo protegido por derechos de autor o una copia del trabajo protegido por derechos de autor.\nâ€¢ IdentificaciÃ³n de la URL u otra ubicaciÃ³n especÃ­fica en el Servicio donde se encuentra el material que usted afirma que infringe.\nâ€¢ Su direcciÃ³n, nÃºmero de telÃ©fono y direcciÃ³n de correo electrÃ³nico.\nâ€¢ Una declaraciÃ³n suya de que cree de buena fe que el uso en disputa no estÃ¡ autorizado por el propietario de los derechos de autor, su agente o la ley.\nâ€¢ Una declaraciÃ³n suya, hecha bajo pena de perjurio, de que la informaciÃ³n anterior en su aviso es precisa y que usted es el propietario de los derechos de autor o estÃ¡ autorizado para actuar en nombre del propietario de los derechos de autor.\n\nPuede ponerse en contacto con nuestro Agente de Derechos de Autor por correo electrÃ³nico en legal@ekabalance.com.',
      },
      {
        id: 'counter-notice',
        title: '5. ContranotificaciÃ³n',
        text: 'Si cree que su Contenido que fue eliminado (o al que se deshabilitÃ³ el acceso) no infringe, o que tiene la autorizaciÃ³n del propietario de los derechos de autor, el agente del propietario de los derechos de autor, o de conformidad con la ley, para publicar y usar el material en su Contenido, puede enviar una contranotificaciÃ³n que contenga la siguiente informaciÃ³n al Agente de Derechos de Autor:\n\nâ€¢ Su firma fÃ­sica o electrÃ³nica.\nâ€¢ IdentificaciÃ³n del Contenido que ha sido eliminado o al que se ha deshabilitado el acceso y la ubicaciÃ³n en la que apareciÃ³ el Contenido antes de ser eliminado o deshabilitado.\nâ€¢ Una declaraciÃ³n de que cree de buena fe que el Contenido fue eliminado o deshabilitado como resultado de un error o una identificaciÃ³n errÃ³nea del Contenido.\nâ€¢ Su nombre, direcciÃ³n, nÃºmero de telÃ©fono y direcciÃ³n de correo electrÃ³nico, una declaraciÃ³n de que acepta la jurisdicciÃ³n de los tribunales de Barcelona, EspaÃ±a, y una declaraciÃ³n de que aceptarÃ¡ la notificaciÃ³n del proceso de la persona que proporcionÃ³ la notificaciÃ³n de la supuesta infracciÃ³n.',
      },
      {
        id: 'trademark-complaints',
        title: '6. Quejas de Marcas Comerciales',
        text: 'EKA Balance tambiÃ©n respeta los derechos de marca comercial de otros. Las cuentas con cualquier otro contenido que engaÃ±e a otros o viole la marca comercial de otro pueden ser actualizadas, suspendidas, deshabilitadas o terminadas por EKA Balance a su entera discreciÃ³n. Si le preocupa que alguien pueda estar utilizando su marca comercial de manera infractora en nuestro Servicio, envÃ­enos un correo electrÃ³nico a legal@ekabalance.com y revisaremos su queja. Si lo consideramos apropiado, podemos eliminar el contenido ofensivo, advertir a la persona que publicÃ³ el contenido y/o suspender o cancelar temporal o permanentemente la cuenta de la persona.',
      },
    ],
  },
  ca: {
    title: 'PolÃ­tica de Propietat IntelÂ·lectual',
    updated: 'Darrera actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "EKA Balance respecta els drets de propietat intelÂ·lectual d'altres i espera que els seus usuaris facin el mateix. Ã‰s la nostra polÃ­tica, en les circumstÃ ncies apropiades i a la nostra discreciÃ³, deshabilitar i/o cancelÂ·lar els comptes dels usuaris que infringeixin repetidament o siguin acusats repetidament d'infringir els drets d'autor o altres drets de propietat intelÂ·lectual d'altres.",
    sections: [
      {
        id: 'eka-ip',
        title: "1. Propietat IntelÂ·lectual d'EKA Balance",
        text: "El Servei i el seu contingut original (excloent el Contingut proporcionat pels usuaris), caracterÃ­stiques i funcionalitat sÃ³n i seguiran sent propietat exclusiva d'EKA Balance i els seus llicenciants. El Servei estÃ  protegit per drets d'autor, marques registrades i altres lleis tant d'Espanya com de paÃ¯sos estrangers. Les nostres marques comercials i imatge comercial no poden utilitzar-se en relaciÃ³ amb cap producte o servei sense el consentiment previ per escrit d'EKA Balance.",
      },
      {
        id: 'user-content-license',
        title: "2. LlicÃ¨ncia de Contingut d'Usuari",
        text: "En publicar, carregar o enviar contingut al Servei (\"Contingut d'Usuari\"), vostÃ¨ atorga a EKA Balance una llicÃ¨ncia no exclusiva, mundial, lliure de regalies, sublicenciable i transferible per utilitzar, reproduir, distribuir, preparar treballs derivats de, mostrar i realitzar el Contingut d'Usuari en relaciÃ³ amb el Servei i el negoci d'EKA Balance (i els seus successors i afiliats), incloent, entre d'altres, per promoure i redistribuir part o la totalitat del Servei (i treballs derivats del mateix) en qualsevol format de mitjans i a travÃ©s de qualsevol canal de mitjans. VostÃ¨ conserva tots els drets de propietat sobre el seu Contingut d'Usuari.",
      },
      {
        id: 'copyright-infringement',
        title: "3. NotificaciÃ³ d'InfracciÃ³ de Drets d'Autor",
        text: "Si vostÃ¨ Ã©s propietari de drets d'autor, o estÃ  autoritzat en nom d'un, i creu que el treball protegit per drets d'autor ha estat copiat d'una manera que constitueix una infracciÃ³ de drets d'autor que estÃ  tenint lloc a travÃ©s del Servei, ha d'enviar el seu avÃ­s per escrit a l'atenciÃ³ de l'\"Agent de Drets d'Autor\" d'EKA Balance i incloure en el seu avÃ­s una descripciÃ³ detallada de la suposada infracciÃ³.\n\nVostÃ¨ pot ser considerat responsable dels danys (inclosos els costos i els honoraris dels advocats) per tergiversar que qualsevol Contingut infringeix els seus drets d'autor.",
      },
      {
        id: 'dmca-notice',
        title: "4. AvÃ­s i Procediment de la DMCA per a Reclamacions d'InfracciÃ³ de Drets d'Autor",
        text: "Pot enviar una notificaciÃ³ de conformitat amb la Llei de Drets d'Autor del MilÂ·lenni Digital (DMCA) proporcionant al nostre Agent de Drets d'Autor la segÃ¼ent informaciÃ³ per escrit (consulti 17 U.S.C 512(c)(3) per obtenir mÃ©s detalls):\n\nâ€¢ Una signatura electrÃ²nica o fÃ­sica de la persona autoritzada per actuar en nom del propietari de l'interÃ¨s dels drets d'autor.\nâ€¢ Una descripciÃ³ del treball protegit per drets d'autor que vostÃ¨ afirma que ha estat infringit, inclosa la URL (Ã©s a dir, l'adreÃ§a de la pÃ gina web) de la ubicaciÃ³ on existeix el treball protegit per drets d'autor o una cÃ²pia del treball protegit per drets d'autor.\nâ€¢ IdentificaciÃ³ de la URL o una altra ubicaciÃ³ especÃ­fica en el Servei on es troba el material que vostÃ¨ afirma que infringeix.\nâ€¢ La seva adreÃ§a, nÃºmero de telÃ¨fon i adreÃ§a de correu electrÃ²nic.\nâ€¢ Una declaraciÃ³ seva de que creu de bona fe que l'Ãºs en disputa no estÃ  autoritzat pel propietari dels drets d'autor, el seu agent o la llei.\nâ€¢ Una declaraciÃ³ seva, feta sota pena de perjuri, de que la informaciÃ³ anterior en el seu avÃ­s Ã©s precisa i que vostÃ¨ Ã©s el propietari dels drets d'autor o estÃ  autoritzat per actuar en nom del propietari dels drets d'autor.\n\nPot posar-se en contacte amb el nostre Agent de Drets d'Autor per correu electrÃ²nic a legal@ekabalance.com.",
      },
      {
        id: 'counter-notice',
        title: '5. ContranotificaciÃ³',
        text: "Si creu que el seu Contingut que va ser eliminat (o al qual es va deshabilitar l'accÃ©s) no infringeix, o que tÃ© l'autoritzaciÃ³ del propietari dels drets d'autor, l'agent del propietari dels drets d'autor, o de conformitat amb la llei, per publicar i utilitzar el material en el seu Contingut, pot enviar una contranotificaciÃ³ que contingui la segÃ¼ent informaciÃ³ a l'Agent de Drets d'Autor:\n\nâ€¢ La seva signatura fÃ­sica o electrÃ²nica.\nâ€¢ IdentificaciÃ³ del Contingut que ha estat eliminat o al qual s'ha deshabilitat l'accÃ©s i la ubicaciÃ³ en la qual va aparÃ¨ixer el Contingut abans de ser eliminat o deshabilitat.\nâ€¢ Una declaraciÃ³ de que creu de bona fe que el Contingut va ser eliminat o deshabilitat com a resultat d'un error o una identificaciÃ³ errÃ²nia del Contingut.\nâ€¢ El seu nom, adreÃ§a, nÃºmero de telÃ¨fon i adreÃ§a de correu electrÃ²nic, una declaraciÃ³ de que accepta la jurisdicdicciÃ³ dels tribunals de Barcelona, Espanya, i una declaraciÃ³ de que acceptarÃ  la notificaciÃ³ del procÃ©s de la persona que va proporcionar la notificaciÃ³ de la suposada infracciÃ³.",
      },
      {
        id: 'trademark-complaints',
        title: '6. Queixes de Marques Comercials',
        text: "EKA Balance tambÃ© respecta els drets de marca comercial d'altres. Els comptes amb qualsevol altre contingut que enganyi a altres o violi la marca comercial d'un altre poden ser actualitzades, suspeses, deshabilitades o terminades per EKA Balance a la seva sencera discreciÃ³. Si li preocupa que algÃº pugui estar utilitzant la seva marca comercial de manera infractora en el nostre Servei, enviÃ¯'ns un correu electrÃ²nic a legal@ekabalance.com i revisarem la seva queixa. Si ho considerem apropiat, podem eliminar el contingut ofensiu, advertir a la persona que va publicar el contingut i/o suspendre o cancelÂ·lar temporalment o permanentment el compte de la persona.",
      },
    ],
  },
  ru: {
    title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'EKA Balance ÑƒÐ²Ð°Ð¶Ð°ÐµÑ‚ Ð¿Ñ€Ð°Ð²Ð° Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ† Ð¸ Ð¾Ð¶Ð¸Ð´Ð°ÐµÑ‚, Ñ‡Ñ‚Ð¾ ÐµÐµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð´ÐµÐ»Ð°Ñ‚ÑŒ Ñ‚Ð¾ Ð¶Ðµ ÑÐ°Ð¼Ð¾Ðµ. ÐÐ°ÑˆÐ° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð·Ð°ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ÑÑ Ð² Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ñ€Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ñ… Ð¾Ð±ÑÑ‚Ð¾ÑÑ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°Ñ… Ð¸ Ð¿Ð¾ Ð½Ð°ÑˆÐµÐ¼Ñƒ ÑƒÑÐ¼Ð¾Ñ‚Ñ€ÐµÐ½Ð¸ÑŽ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ Ð¸/Ð¸Ð»Ð¸ Ð°Ð½Ð½ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ðµ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð½ÐµÐ¾Ð´Ð½Ð¾ÐºÑ€Ð°Ñ‚Ð½Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐ°ÑŽÑ‚ Ð¸Ð»Ð¸ Ð½ÐµÐ¾Ð´Ð½Ð¾ÐºÑ€Ð°Ñ‚Ð½Ð¾ Ð¾Ð±Ð²Ð¸Ð½ÑÑŽÑ‚ÑÑ Ð² Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ð¸ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð² Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¿Ñ€Ð°Ð² Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ†.',
    sections: [
      {
        id: 'eka-ip',
        title: '1. Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ EKA Balance',
        text: 'Ð¡ÐµÑ€Ð²Ð¸Ñ Ð¸ ÐµÐ³Ð¾ Ð¾Ñ€Ð¸Ð³Ð¸Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ (Ð·Ð° Ð¸ÑÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸ÐµÐ¼ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑÐ¼Ð¸), Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¸ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð¸ Ð¾ÑÑ‚Ð°Ð½ÑƒÑ‚ÑÑ Ð¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒÑŽ EKA Balance Ð¸ ÐµÐµ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ð°Ñ€Ð¾Ð². Ð¡ÐµÑ€Ð²Ð¸Ñ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¼, Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ð¼Ð¸ Ð·Ð½Ð°ÐºÐ°Ð¼Ð¸ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð°Ð¼Ð¸ ÐºÐ°Ðº Ð˜ÑÐ¿Ð°Ð½Ð¸Ð¸, Ñ‚Ð°Ðº Ð¸ Ð·Ð°Ñ€ÑƒÐ±ÐµÐ¶Ð½Ñ‹Ñ… ÑÑ‚Ñ€Ð°Ð½. ÐÐ°ÑˆÐ¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð½Ð°ÐºÐ¸ Ð¸ Ñ„Ð¸Ñ€Ð¼ÐµÐ½Ð½Ñ‹Ð¹ ÑÑ‚Ð¸Ð»ÑŒ Ð½Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð² ÑÐ²ÑÐ·Ð¸ Ñ ÐºÐ°ÐºÐ¸Ð¼-Ð»Ð¸Ð±Ð¾ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð¼ Ð¸Ð»Ð¸ ÑƒÑÐ»ÑƒÐ³Ð¾Ð¹ Ð±ÐµÐ· Ð¿Ñ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ EKA Balance.',
      },
      {
        id: 'user-content-license',
        title: '2. Ð›Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ Ð½Ð° Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚',
        text: 'Ð Ð°Ð·Ð¼ÐµÑ‰Ð°Ñ, Ð·Ð°Ð³Ñ€ÑƒÐ¶Ð°Ñ Ð¸Ð»Ð¸ Ð¸Ð½Ñ‹Ð¼ Ð¾Ð±Ñ€Ð°Ð·Ð¾Ð¼ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð² Ð¡ÐµÑ€Ð²Ð¸Ñ (Â«ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Â»), Ð²Ñ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚Ðµ EKA Balance Ð½ÐµÐ¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ, Ð²ÑÐµÐ¼Ð¸Ñ€Ð½ÑƒÑŽ, Ð±ÐµÐ·Ð²Ð¾Ð·Ð¼ÐµÐ·Ð´Ð½ÑƒÑŽ, ÑÑƒÐ±Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€ÑƒÐµÐ¼ÑƒÑŽ Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°ÐµÐ¼ÑƒÑŽ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸ÑŽ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ, Ð²Ð¾ÑÐ¿Ñ€Ð¾Ð¸Ð·Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ, Ñ€Ð°ÑÐ¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ, Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²ÐºÑƒ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð½Ñ‹Ñ… Ñ€Ð°Ð±Ð¾Ñ‚, Ð¾Ñ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð¸ Ð¸ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð° Ð² ÑÐ²ÑÐ·Ð¸ Ñ Ð¡ÐµÑ€Ð²Ð¸ÑÐ¾Ð¼ Ð¸ Ð±Ð¸Ð·Ð½ÐµÑÐ¾Ð¼ EKA Balance (Ð¸ ÐµÐµ Ð¿Ñ€Ð°Ð²Ð¾Ð¿Ñ€ÐµÐµÐ¼Ð½Ð¸ÐºÐ¾Ð² Ð¸ Ð°Ñ„Ñ„Ð¸Ð»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð»Ð¸Ñ†), Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ, Ð¿Ð¾Ð¼Ð¸Ð¼Ð¾ Ð¿Ñ€Ð¾Ñ‡ÐµÐ³Ð¾, Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¸ Ð¿ÐµÑ€ÐµÑ€Ð°ÑÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ñ Ñ‡Ð°ÑÑ‚Ð¸ Ð¸Ð»Ð¸ Ð²ÑÐµÐ³Ð¾ Ð¡ÐµÑ€Ð²Ð¸ÑÐ° (Ð¸ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð½Ñ‹Ñ… Ñ€Ð°Ð±Ð¾Ñ‚ Ð¾Ñ‚ Ð½ÐµÐ³Ð¾) Ð² Ð»ÑŽÐ±Ñ‹Ñ… Ð¼ÐµÐ´Ð¸Ð°Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð°Ñ… Ð¸ Ñ‡ÐµÑ€ÐµÐ· Ð»ÑŽÐ±Ñ‹Ðµ Ð¼ÐµÐ´Ð¸Ð°ÐºÐ°Ð½Ð°Ð»Ñ‹. Ð’Ñ‹ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÐµÑ‚Ðµ Ð²ÑÐµ Ð¿Ñ€Ð°Ð²Ð° ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð° ÑÐ²Ð¾Ð¹ ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚.',
      },
      {
        id: 'copyright-infringement',
        title: '3. Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ð¸ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð²',
        text: 'Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÐ²Ð»ÑÐµÑ‚ÐµÑÑŒ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð² Ð¸Ð»Ð¸ ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡ÐµÐ½Ñ‹ Ð¾Ñ‚ Ð¸Ð¼ÐµÐ½Ð¸ Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¸Ð· Ð½Ð¸Ñ…, Ð¸ Ð²Ñ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ð°Ñ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ð° Ð±Ñ‹Ð»Ð° ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð° ÑÐ¿Ð¾ÑÐ¾Ð±Ð¾Ð¼, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ ÑÐ¾Ð±Ð¾Ð¹ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ðµ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ðµ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð´Ð¸Ñ‚ Ñ‡ÐµÑ€ÐµÐ· Ð¡ÐµÑ€Ð²Ð¸Ñ, Ð²Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ ÑÐ²Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð² Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ Ð½Ð° Ð¸Ð¼Ñ Â«ÐÐ³ÐµÐ½Ñ‚Ð° Ð¿Ð¾ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð°Ð¼Â» EKA Balance Ð¸ Ð²ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ Ð² ÑÐ²Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½Ð¾Ðµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÐ¼Ð¾Ð³Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ.\n\nÐ’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð±Ñ‹Ñ‚ÑŒ Ð¿Ñ€Ð¸Ð²Ð»ÐµÑ‡ÐµÐ½Ñ‹ Ðº Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð·Ð° ÑƒÑ‰ÐµÑ€Ð± (Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ñ€Ð°ÑÑ…Ð¾Ð´Ñ‹ Ð¸ Ð³Ð¾Ð½Ð¾Ñ€Ð°Ñ€Ñ‹ Ð°Ð´Ð²Ð¾ÐºÐ°Ñ‚Ð¾Ð²) Ð·Ð° Ð»Ð¾Ð¶Ð½Ð¾Ðµ Ð·Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ ÐºÐ°ÐºÐ¾Ð¹-Ð»Ð¸Ð±Ð¾ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð½Ð°Ñ€ÑƒÑˆÐ°ÐµÑ‚ Ð²Ð°ÑˆÐ¸ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ðµ Ð¿Ñ€Ð°Ð²Ð°.',
      },
      {
        id: 'dmca-notice',
        title: '4. Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ DMCA Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ð° Ð¿Ð¾Ð´Ð°Ñ‡Ð¸ Ð¸ÑÐºÐ¾Ð² Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ð¸ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð²',
        text: 'Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð—Ð°ÐºÐ¾Ð½Ð¾Ð¼ Ð¾Ð± Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¾Ð¼ Ð¿Ñ€Ð°Ð²Ðµ Ð² Ñ†Ð¸Ñ„Ñ€Ð¾Ð²ÑƒÑŽ ÑÐ¿Ð¾Ñ…Ñƒ (DMCA), Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ð² Ð½Ð°ÑˆÐµÐ¼Ñƒ ÐÐ³ÐµÐ½Ñ‚Ñƒ Ð¿Ð¾ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð°Ð¼ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð² Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ (ÑÐ¼. 17 U.S.C 512(c)(3) Ð´Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð±Ð¾Ð»ÐµÐµ Ð¿Ð¾Ð´Ñ€Ð¾Ð±Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸):\n\nâ€¢ Ð­Ð»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¸Ð»Ð¸ Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð¾Ð´Ð¿Ð¸ÑÑŒ Ð»Ð¸Ñ†Ð°, ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð¾Ñ‚ Ð¸Ð¼ÐµÐ½Ð¸ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ° Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¾Ð³Ð¾ Ð¿Ñ€Ð°Ð²Ð°.\nâ€¢ ÐžÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ð¾Ð¹ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹, ÐºÐ¾Ñ‚Ð¾Ñ€Ð°Ñ, Ð¿Ð¾ Ð²Ð°ÑˆÐµÐ¼Ñƒ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸ÑŽ, Ð±Ñ‹Ð»Ð° Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð°, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ URL-Ð°Ð´Ñ€ÐµÑ (Ñ‚. Ðµ. Ð°Ð´Ñ€ÐµÑ Ð²ÐµÐ±-ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹) Ð¼ÐµÑÑ‚Ð¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ, Ð³Ð´Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ð°Ñ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ð°, Ð¸Ð»Ð¸ ÐºÐ¾Ð¿Ð¸ÑŽ Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ð¾Ð¹ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð¾Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹.\nâ€¢ Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ URL-Ð°Ð´Ñ€ÐµÑÐ° Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¾Ð³Ð¾ ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð¾Ð³Ð¾ Ð¼ÐµÑÑ‚Ð¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð² Ð¡ÐµÑ€Ð²Ð¸ÑÐµ, Ð³Ð´Ðµ Ð½Ð°Ñ…Ð¾Ð´Ð¸Ñ‚ÑÑ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð», ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹, Ð¿Ð¾ Ð²Ð°ÑˆÐµÐ¼Ñƒ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸ÑŽ, Ð½Ð°Ñ€ÑƒÑˆÐ°ÐµÑ‚ Ð¿Ñ€Ð°Ð²Ð°.\nâ€¢ Ð’Ð°Ñˆ Ð°Ð´Ñ€ÐµÑ, Ð½Ð¾Ð¼ÐµÑ€ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð° Ð¸ Ð°Ð´Ñ€ÐµÑ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¹ Ð¿Ð¾Ñ‡Ñ‚Ñ‹.\nâ€¢ Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾Ñ‚ Ð²Ð°Ñ Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ Ð´Ð¾Ð±Ñ€Ð¾ÑÐ¾Ð²ÐµÑÑ‚Ð½Ð¾ Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ ÑÐ¿Ð¾Ñ€Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð½Ðµ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¾ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð², ÐµÐ³Ð¾ Ð°Ð³ÐµÐ½Ñ‚Ð¾Ð¼ Ð¸Ð»Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð¼.\nâ€¢ Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾Ñ‚ Ð²Ð°Ñ, ÑÐ´ÐµÐ»Ð°Ð½Ð½Ð¾Ðµ Ð¿Ð¾Ð´ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð¼ Ð½Ð°ÐºÐ°Ð·Ð°Ð½Ð¸Ñ Ð·Ð° Ð»Ð¶ÐµÑÐ²Ð¸Ð´ÐµÑ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾, Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ÑˆÐµÑƒÐºÐ°Ð·Ð°Ð½Ð½Ð°Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð² Ð²Ð°ÑˆÐµÐ¼ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¸ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ñ‚Ð¾Ñ‡Ð½Ð¾Ð¹ Ð¸ Ñ‡Ñ‚Ð¾ Ð²Ñ‹ ÑÐ²Ð»ÑÐµÑ‚ÐµÑÑŒ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð² Ð¸Ð»Ð¸ ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡ÐµÐ½Ñ‹ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð¾Ñ‚ Ð¸Ð¼ÐµÐ½Ð¸ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð².\n\nÐ’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑÐ²ÑÐ·Ð°Ñ‚ÑŒÑÑ Ñ Ð½Ð°ÑˆÐ¸Ð¼ ÐÐ³ÐµÐ½Ñ‚Ð¾Ð¼ Ð¿Ð¾ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð°Ð¼ Ð¿Ð¾ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¹ Ð¿Ð¾Ñ‡Ñ‚Ðµ legal@ekabalance.com.',
      },
      {
        id: 'counter-notice',
        title: '5. Ð’ÑÑ‚Ñ€ÐµÑ‡Ð½Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ',
        text: 'Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ Ð²Ð°Ñˆ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð±Ñ‹Ð» ÑƒÐ´Ð°Ð»ÐµÐ½ (Ð¸Ð»Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¼Ñƒ Ð±Ñ‹Ð» Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½), Ð½Ðµ Ð½Ð°Ñ€ÑƒÑˆÐ°ÐµÑ‚ Ð¿Ñ€Ð°Ð²Ð°, Ð¸Ð»Ð¸ Ñ‡Ñ‚Ð¾ Ñƒ Ð²Ð°Ñ ÐµÑÑ‚ÑŒ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð¾Ñ‚ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð², Ð°Ð³ÐµÐ½Ñ‚Ð° Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ñ… Ð¿Ñ€Ð°Ð² Ð¸Ð»Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð¼ Ð½Ð° Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸ÑŽ Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ð° Ð² Ð²Ð°ÑˆÐµÐ¼ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ðµ, Ð²Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ Ð²ÑÑ‚Ñ€ÐµÑ‡Ð½Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ, ÑÐ¾Ð´ÐµÑ€Ð¶Ð°Ñ‰ÐµÐµ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, ÐÐ³ÐµÐ½Ñ‚Ñƒ Ð¿Ð¾ Ð°Ð²Ñ‚Ð¾Ñ€ÑÐºÐ¸Ð¼ Ð¿Ñ€Ð°Ð²Ð°Ð¼:\n\nâ€¢ Ð’Ð°ÑˆÐ° Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¸Ð»Ð¸ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¿Ð¾Ð´Ð¿Ð¸ÑÑŒ.\nâ€¢ Ð˜Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð±Ñ‹Ð» ÑƒÐ´Ð°Ð»ÐµÐ½ Ð¸Ð»Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¼Ñƒ Ð±Ñ‹Ð» Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½, Ð¸ Ð¼ÐµÑÑ‚Ð¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ, Ð² ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¼ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¿Ð¾ÑÐ²Ð¸Ð»ÑÑ Ð´Ð¾ Ñ‚Ð¾Ð³Ð¾, ÐºÐ°Ðº Ð¾Ð½ Ð±Ñ‹Ð» ÑƒÐ´Ð°Ð»ÐµÐ½ Ð¸Ð»Ð¸ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½.\nâ€¢ Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ Ð´Ð¾Ð±Ñ€Ð¾ÑÐ¾Ð²ÐµÑÑ‚Ð½Ð¾ Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð±Ñ‹Ð» ÑƒÐ´Ð°Ð»ÐµÐ½ Ð¸Ð»Ð¸ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½ Ð² Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ðµ Ð¾ÑˆÐ¸Ð±ÐºÐ¸ Ð¸Ð»Ð¸ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ð¾Ð¹ Ð¸Ð´ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸ ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°.\nâ€¢ Ð’Ð°ÑˆÐµ Ð¸Ð¼Ñ, Ð°Ð´Ñ€ÐµÑ, Ð½Ð¾Ð¼ÐµÑ€ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð° Ð¸ Ð°Ð´Ñ€ÐµÑ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¹ Ð¿Ð¾Ñ‡Ñ‚Ñ‹, Ð·Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ñ ÑŽÑ€Ð¸ÑÐ´Ð¸ÐºÑ†Ð¸ÐµÐ¹ ÑÑƒÐ´Ð¾Ð² Ð² Ð‘Ð°Ñ€ÑÐµÐ»Ð¾Ð½Ðµ, Ð˜ÑÐ¿Ð°Ð½Ð¸Ñ, Ð¸ Ð·Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ñ‚Ð¾Ð¼, Ñ‡Ñ‚Ð¾ Ð²Ñ‹ Ð¿Ñ€Ð¸Ð¼ÐµÑ‚Ðµ Ð²Ñ€ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ñ†ÐµÑÑÑƒÐ°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð² Ð¾Ñ‚ Ð»Ð¸Ñ†Ð°, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ð²ÑˆÐµÐ³Ð¾ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÐ¼Ð¾Ð¼ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ð¸.',
      },
      {
        id: 'trademark-complaints',
        title: '6. Ð–Ð°Ð»Ð¾Ð±Ñ‹ Ð½Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð½Ð°ÐºÐ¸',
        text: 'EKA Balance Ñ‚Ð°ÐºÐ¶Ðµ ÑƒÐ²Ð°Ð¶Ð°ÐµÑ‚ Ð¿Ñ€Ð°Ð²Ð° Ð½Ð° Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð½Ð°ÐºÐ¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ†. Ð£Ñ‡ÐµÑ‚Ð½Ñ‹Ðµ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ñ Ð»ÑŽÐ±Ñ‹Ð¼ Ð´Ñ€ÑƒÐ³Ð¸Ð¼ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð¾Ð¼, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð²Ð²Ð¾Ð´Ð¸Ñ‚ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð² Ð·Ð°Ð±Ð»ÑƒÐ¶Ð´ÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ Ð½Ð°Ñ€ÑƒÑˆÐ°ÐµÑ‚ Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ð¹ Ð·Ð½Ð°Ðº Ð´Ñ€ÑƒÐ³Ð¾Ð³Ð¾ Ð»Ð¸Ñ†Ð°, Ð¼Ð¾Ð³ÑƒÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹, Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹, Ð¾Ñ‚ÐºÐ»ÑŽÑ‡ÐµÐ½Ñ‹ Ð¸Ð»Ð¸ Ð°Ð½Ð½ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹ EKA Balance Ð¿Ð¾ ÑÐ²Ð¾ÐµÐ¼Ñƒ ÑƒÑÐ¼Ð¾Ñ‚Ñ€ÐµÐ½Ð¸ÑŽ. Ð•ÑÐ»Ð¸ Ð²Ñ‹ Ð¾Ð±ÐµÑÐ¿Ð¾ÐºÐ¾ÐµÐ½Ñ‹ Ñ‚ÐµÐ¼, Ñ‡Ñ‚Ð¾ ÐºÑ‚Ð¾-Ñ‚Ð¾ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð²Ð°Ñˆ Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ð¹ Ð·Ð½Ð°Ðº Ñ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÐµÐ¼ Ð¿Ñ€Ð°Ð² Ð² Ð½Ð°ÑˆÐµÐ¼ Ð¡ÐµÑ€Ð²Ð¸ÑÐµ, Ð½Ð°Ð¿Ð¸ÑˆÐ¸Ñ‚Ðµ Ð½Ð°Ð¼ Ð¿Ð¾ Ð°Ð´Ñ€ÐµÑÑƒ legal@ekabalance.com, Ð¸ Ð¼Ñ‹ Ñ€Ð°ÑÑÐ¼Ð¾Ñ‚Ñ€Ð¸Ð¼ Ð²Ð°ÑˆÑƒ Ð¶Ð°Ð»Ð¾Ð±Ñƒ. Ð•ÑÐ»Ð¸ Ð¼Ñ‹ ÑÐ¾Ñ‡Ñ‚ÐµÐ¼ ÑÑ‚Ð¾ Ñ†ÐµÐ»ÐµÑÐ¾Ð¾Ð±Ñ€Ð°Ð·Ð½Ñ‹Ð¼, Ð¼Ñ‹ Ð¼Ð¾Ð¶ÐµÐ¼ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ Ð¾ÑÐºÐ¾Ñ€Ð±Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚, Ð¿Ñ€ÐµÐ´ÑƒÐ¿Ñ€ÐµÐ´Ð¸Ñ‚ÑŒ Ð»Ð¸Ñ†Ð¾, Ñ€Ð°Ð·Ð¼ÐµÑÑ‚Ð¸Ð²ÑˆÐµÐµ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚, Ð¸/Ð¸Ð»Ð¸ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾ Ð¸Ð»Ð¸ Ð½Ð°Ð²ÑÐµÐ³Ð´Ð° Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð°Ð½Ð½ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑƒÑ‡ÐµÑ‚Ð½ÑƒÑŽ Ð·Ð°Ð¿Ð¸ÑÑŒ ÑÑ‚Ð¾Ð³Ð¾ Ð»Ð¸Ñ†Ð°.',
      },
    ],
  },
};

export default function IntellectualPropertyPage() {
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
