'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Cookie Policy',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'This Cookie Policy explains how EKA Balance uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.',
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What are cookies?',
        text: 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.\n\nCookies set by the website owner (in this case, EKA Balance) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).',
      },
      {
        id: 'why-use-cookies',
        title: '2. Why do we use cookies?',
        text: 'We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.',
      },
      {
        id: 'types-of-cookies',
        title: '3. Types of Cookies We Use',
        text: 'â€¢ **Essential Cookies:** These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.\nâ€¢ **Performance and Functionality Cookies:** These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.\nâ€¢ **Analytics and Customization Cookies:** These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.\nâ€¢ **Advertising Cookies:** These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.',
      },
      {
        id: 'control-cookies',
        title: '4. How can I control cookies?',
        text: 'You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.\n\nYou can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.',
      },
      {
        id: 'updates',
        title: '5. Updates to this Policy',
        text: 'We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.',
      },
      {
        id: 'contact',
        title: '6. Contact Us',
        text: 'If you have any questions about our use of cookies or other technologies, please email us at privacy@ekabalance.com or by post to:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain',
      },
    ],
  },
  es: {
    title: 'PolÃ­tica de Cookies',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'Esta PolÃ­tica de Cookies explica cÃ³mo EKA Balance utiliza cookies y tecnologÃ­as similares para reconocerlo cuando visita nuestro sitio web. Explica quÃ© son estas tecnologÃ­as y por quÃ© las usamos, asÃ­ como sus derechos para controlar nuestro uso de ellas.',
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. Â¿QuÃ© son las cookies?',
        text: 'Las cookies son pequeÃ±os archivos de datos que se colocan en su computadora o dispositivo mÃ³vil cuando visita un sitio web. Los propietarios de sitios web utilizan ampliamente las cookies para que sus sitios web funcionen, o para que funcionen de manera mÃ¡s eficiente, asÃ­ como para proporcionar informaciÃ³n de informes.\n\nLas cookies establecidas por el propietario del sitio web (en este caso, EKA Balance) se denominan "cookies de origen". Las cookies establecidas por partes distintas al propietario del sitio web se denominan "cookies de terceros". Las cookies de terceros permiten que se proporcionen caracterÃ­sticas o funcionalidades de terceros en o a travÃ©s del sitio web (por ejemplo, publicidad, contenido interactivo y anÃ¡lisis).',
      },
      {
        id: 'why-use-cookies',
        title: '2. Â¿Por quÃ© utilizamos cookies?',
        text: 'Utilizamos cookies de origen y de terceros por varias razones. Algunas cookies son necesarias por razones tÃ©cnicas para que nuestro sitio web funcione, y nos referimos a ellas como cookies "esenciales" o "estrictamente necesarias". Otras cookies tambiÃ©n nos permiten rastrear y dirigir los intereses de nuestros usuarios para mejorar la experiencia en nuestras Propiedades en lÃ­nea. Los terceros sirven cookies a travÃ©s de nuestro sitio web con fines publicitarios, analÃ­ticos y otros.',
      },
      {
        id: 'types-of-cookies',
        title: '3. Tipos de Cookies que Utilizamos',
        text: 'â€¢ **Cookies Esenciales:** Estas cookies son estrictamente necesarias para brindarle los servicios disponibles a travÃ©s de nuestro sitio web y para utilizar algunas de sus funciones, como el acceso a Ã¡reas seguras.\nâ€¢ **Cookies de Rendimiento y Funcionalidad:** Estas cookies se utilizan para mejorar el rendimiento y la funcionalidad de nuestro sitio web, pero no son esenciales para su uso. Sin embargo, sin estas cookies, ciertas funciones (como videos) pueden no estar disponibles.\nâ€¢ **Cookies de AnÃ¡lisis y PersonalizaciÃ³n:** Estas cookies recopilan informaciÃ³n que se utiliza en forma agregada para ayudarnos a comprender cÃ³mo se utiliza nuestro sitio web o quÃ© tan efectivas son nuestras campaÃ±as de marketing, o para ayudarnos a personalizar nuestro sitio web para usted.\nâ€¢ **Cookies Publicitarias:** Estas cookies se utilizan para hacer que los mensajes publicitarios sean mÃ¡s relevantes para usted. Realizan funciones como evitar que el mismo anuncio reaparezca continuamente, garantizar que los anuncios es muestren correctamente para los anunciantes y, en algunos casos, seleccionar anuncios basados en sus intereses.',
      },
      {
        id: 'control-cookies',
        title: '4. Â¿CÃ³mo puedo controlar las cookies?',
        text: 'Tiene derecho a decidir si acepta o rechaza las cookies. Puede ejercer sus derechos de cookies configurando sus preferencias en el Administrador de Consentimiento de Cookies. El Administrador de Consentimiento de Cookies le permite seleccionar quÃ© categorÃ­as de cookies acepta o rechaza. Las cookies esenciales no se pueden rechazar ya que son estrictamente necesarias para brindarle servicios.\n\nTambiÃ©n puede configurar o modificar los controles de su navegador web para aceptar o rechazar cookies. Si elige rechazar las cookies, aÃºn puede usar nuestro sitio web, aunque su acceso a algunas funciones y Ã¡reas de nuestro sitio web puede estar restringido.',
      },
      {
        id: 'updates',
        title: '5. Actualizaciones de esta PolÃ­tica',
        text: 'Podemos actualizar esta PolÃ­tica de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, vuelva a visitar esta PolÃ­tica de Cookies regularmente para mantenerse informado sobre nuestro uso de cookies y tecnologÃ­as relacionadas.',
      },
      {
        id: 'contact',
        title: '6. ContÃ¡ctenos',
        text: 'Si tiene alguna pregunta sobre nuestro uso de cookies u otras tecnologÃ­as, envÃ­enos un correo electrÃ³nico a privacy@ekabalance.com o por correo postal a:\n\nEKA Balance\nCarrer de [Nombre de la Calle], [NÃºmero]\n08001 Barcelona\nEspaÃ±a',
      },
    ],
  },
  ca: {
    title: 'PolÃ­tica de Cookies',
    updated: 'Ãšltima actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "Aquesta PolÃ­tica de Cookies explica com EKA Balance utilitza cookies i tecnologies similars per reconÃ¨ixer-vos quan visiteu el nostre lloc web. Explica quÃ¨ sÃ³n aquestes tecnologies i per quÃ¨ les utilitzem, aixÃ­ com els vostres drets per controlar el nostre Ãºs d'elles.",
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. QuÃ¨ sÃ³n les cookies?',
        text: 'Les cookies sÃ³n petits fitxers de dades que es colÂ·loquen al vostre ordinador o dispositiu mÃ²bil quan visiteu un lloc web. Els propietaris de llocs web utilitzen Ã mpliament les cookies per fer que els seus llocs web funcionin, o perquÃ¨ funcionin de manera mÃ©s eficient, aixÃ­ com per proporcionar informaciÃ³ d\'informes.\n\nLes cookies establertes pel propietari del lloc web (en aquest cas, EKA Balance) s\'anomenen "cookies de primera part". Les cookies establertes per parts diferents del propietari del lloc web s\'anomenen "cookies de tercers". Les cookies de tercers permeten que es proporcionin caracterÃ­stiques o funcionalitats de tercers al lloc web o a travÃ©s d\'ell (per exemple, publicitat, contingut interactiu i anÃ lisi).',
      },
      {
        id: 'why-use-cookies',
        title: '2. Per quÃ¨ utilitzem cookies?',
        text: 'Utilitzem cookies de primera part i de tercers per diverses raons. Algunes cookies sÃ³n necessÃ ries per raons tÃ¨cniques perquÃ¨ el nostre lloc web funcioni, i ens hi referim com a cookies "essencials" o "estrictament necessÃ ries". Altres cookies tambÃ© ens permeten fer un seguiment i orientar els interessos dels nostres usuaris per millorar l\'experiÃ¨ncia a les nostres Propietats en lÃ­nia. Els tercers serveixen cookies a travÃ©s del nostre lloc web amb finalitats publicitÃ ries, analÃ­tiques i altres.',
      },
      {
        id: 'types-of-cookies',
        title: '3. Tipus de Cookies que Utilitzem',
        text: "â€¢ **Cookies Essencials:** Aquestes cookies sÃ³n estrictament necessÃ ries per proporcionar-vos els serveis disponibles a travÃ©s del nostre lloc web i per utilitzar algunes de les seves funcions, com ara l'accÃ©s a Ã rees segures.\nâ€¢ **Cookies de Rendiment i Funcionalitat:** Aquestes cookies s'utilitzen per millorar el rendiment i la funcionalitat del nostre lloc web, perÃ² no sÃ³n essencials per al seu Ãºs. No obstant aixÃ², sense aquestes cookies, certes funcionalitats (com ara vÃ­deos) poden no estar disponibles.\nâ€¢ **Cookies d'AnÃ lisi i PersonalitzaciÃ³:** Aquestes cookies recopilen informaciÃ³ que s'utilitza de forma agregada per ajudar-nos a comprendre com s'utilitza el nostre lloc web o quina eficÃ cia tenen les nostres campanyes de mÃ rqueting, o per ajudar-nos a personalitzar el nostre lloc web per a vosaltres.\nâ€¢ **Cookies PublicitÃ ries:** Aquestes cookies s'utilitzen per fer que els missatges publicitaris siguin mÃ©s rellevants per a vosaltres. Realitzen funcions com evitar que el mateix anunci reaparegui contÃ­nuament, garantir que els anuncis es mostrin correctament per als anunciants i, en alguns casos, seleccionar anuncis basats en els vostres interessos.",
      },
      {
        id: 'control-cookies',
        title: '4. Com puc controlar les cookies?',
        text: 'Teniu dret a decidir si accepteu o rebutgeu les cookies. Podeu exercir els vostres drets de cookies configurant les vostres preferÃ¨ncies al Gestor de Consentiment de Cookies. El Gestor de Consentiment de Cookies us permet seleccionar quines categories de cookies accepteu o rebutgeu. Les cookies essencials no es poden rebutjar ja que sÃ³n estrictament necessÃ ries per proporcionar-vos serveis.\n\nTambÃ© podeu configurar o modificar els controls del vostre navegador web per acceptar o rebutjar cookies. Si trieu rebutjar les cookies, encara podeu utilitzar el nostre lloc web, tot i que el vostre accÃ©s a algunes funcionalitats i Ã rees del nostre lloc web pot estar restringit.',
      },
      {
        id: 'updates',
        title: "5. Actualitzacions d'aquesta PolÃ­tica",
        text: 'Podem actualitzar aquesta PolÃ­tica de Cookies de tant en tant per reflectir, per exemple, canvis en les cookies que utilitzem o per altres raons operatives, legals o reglamentÃ ries. Per tant, torneu a visitar aquesta PolÃ­tica de Cookies regularment per mantenir-vos informats sobre el nostre Ãºs de cookies i tecnologies relacionades.',
      },
      {
        id: 'contact',
        title: '6. Contacteu-nos',
        text: 'Si teniu alguna pregunta sobre el nostre Ãºs de cookies o altres tecnologies, envieu-nos un correu electrÃ²nic a privacy@ekabalance.com o per correu postal a:\n\nEKA Balance\nCarrer de [Nom del Carrer], [NÃºmero]\n08001 Barcelona\nEspanya',
      },
    ],
  },
  ru: {
    title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'Ð­Ñ‚Ð° ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð¾Ð±ÑŠÑÑÐ½ÑÐµÑ‚, ÐºÐ°Ðº EKA Balance Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð¸ Ð°Ð½Ð°Ð»Ð¾Ð³Ð¸Ñ‡Ð½Ñ‹Ðµ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ñ€Ð°ÑÐ¿Ð¾Ð·Ð½Ð°Ð²Ð°Ñ‚ÑŒ Ð²Ð°Ñ, ÐºÐ¾Ð³Ð´Ð° Ð²Ñ‹ Ð¿Ð¾ÑÐµÑ‰Ð°ÐµÑ‚Ðµ Ð½Ð°Ñˆ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚. Ð’ Ð½ÐµÐ¹ Ð¾Ð±ÑŠÑÑÐ½ÑÐµÑ‚ÑÑ, Ñ‡Ñ‚Ð¾ ÑÑ‚Ð¾ Ð·Ð° Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¸ Ð¸ Ð¿Ð¾Ñ‡ÐµÐ¼Ñƒ Ð¼Ñ‹ Ð¸Ñ… Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð²Ð°ÑˆÐ¸ Ð¿Ñ€Ð°Ð²Ð° ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸Ñ… Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð½Ð°Ð¼Ð¸.',
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. Ð§Ñ‚Ð¾ Ñ‚Ð°ÐºÐ¾Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie?',
        text: 'Ð¤Ð°Ð¹Ð»Ñ‹ cookie â€” ÑÑ‚Ð¾ Ð½ÐµÐ±Ð¾Ð»ÑŒÑˆÐ¸Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÑŽÑ‚ÑÑ Ð½Ð° Ð²Ð°ÑˆÐµÐ¼ ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ðµ Ð¸Ð»Ð¸ Ð¼Ð¾Ð±Ð¸Ð»ÑŒÐ½Ð¾Ð¼ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ðµ Ð¿Ñ€Ð¸ Ð¿Ð¾ÑÐµÑ‰ÐµÐ½Ð¸Ð¸ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°. Ð¤Ð°Ð¹Ð»Ñ‹ cookie ÑˆÐ¸Ñ€Ð¾ÐºÐ¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ÑÑ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð°Ð¼Ð¸ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð¾Ð² Ð´Ð»Ñ Ñ‚Ð¾Ð³Ð¾, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ñ… Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ñ‹ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð»Ð¸ Ð¸Ð»Ð¸ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð»Ð¸ Ð±Ð¾Ð»ÐµÐµ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¾Ñ‚Ñ‡ÐµÑ‚Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸.\n\nÐ¤Ð°Ð¹Ð»Ñ‹ cookie, ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ðµ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†ÐµÐ¼ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð° (Ð² Ð´Ð°Ð½Ð½Ð¾Ð¼ ÑÐ»ÑƒÑ‡Ð°Ðµ EKA Balance), Ð½Ð°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ Â«Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ð¼Ð¸ Ñ„Ð°Ð¹Ð»Ð°Ð¼Ð¸ cookieÂ». Ð¤Ð°Ð¹Ð»Ñ‹ cookie, ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ðµ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð°Ð¼Ð¸, Ð¾Ñ‚Ð»Ð¸Ñ‡Ð½Ñ‹Ð¼Ð¸ Ð¾Ñ‚ Ð²Ð»Ð°Ð´ÐµÐ»ÑŒÑ†Ð° Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°, Ð½Ð°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ Â«ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ð¼Ð¸ Ñ„Ð°Ð¹Ð»Ð°Ð¼Ð¸ cookieÂ». Ð¡Ñ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÑŽÑ‚ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¸Ð»Ð¸ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð° Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ðµ Ð¸Ð»Ð¸ Ñ‡ÐµÑ€ÐµÐ· Ð½ÐµÐ³Ð¾ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, Ñ€ÐµÐºÐ»Ð°Ð¼Ñƒ, Ð¸Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¸ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÑƒ).',
      },
      {
        id: 'why-use-cookies',
        title: '2. ÐŸÐ¾Ñ‡ÐµÐ¼Ñƒ Ð¼Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ñ„Ð°Ð¹Ð»Ñ‹ cookie?',
        text: 'ÐœÑ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ðµ Ð¸ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð¿Ð¾ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ð¼ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½Ð°Ð¼. ÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹ Ð¿Ð¾ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½Ð°Ð¼ Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°, Ð¸ Ð¼Ñ‹ Ð½Ð°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð¸Ñ… Â«ÑÑƒÑ‰ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¼Ð¸Â» Ð¸Ð»Ð¸ Â«ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ð¼Ð¸Â» Ñ„Ð°Ð¹Ð»Ð°Ð¼Ð¸ cookie. Ð”Ñ€ÑƒÐ³Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ñ‚Ð°ÐºÐ¶Ðµ Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÑŽÑ‚ Ð½Ð°Ð¼ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð¸ Ð½Ð°Ñ†ÐµÐ»Ð¸Ð²Ð°Ñ‚ÑŒ Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÑ‹ Ð½Ð°ÑˆÐ¸Ñ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð´Ð»Ñ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ñ Ð¾Ð¿Ñ‹Ñ‚Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð½Ð°ÑˆÐ¸Ñ… ÐžÐ½Ð»Ð°Ð¹Ð½-Ñ€ÐµÑÑƒÑ€ÑÐ¾Ð². Ð¢Ñ€ÐµÑ‚ÑŒÐ¸ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ Ñ€Ð°Ð·Ð¼ÐµÑ‰Ð°ÑŽÑ‚ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ñ‡ÐµÑ€ÐµÐ· Ð½Ð°Ñˆ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚ Ð´Ð»Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ñ‹, Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ñ†ÐµÐ»ÐµÐ¹.',
      },
      {
        id: 'types-of-cookies',
        title: '3. Ð¢Ð¸Ð¿Ñ‹ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¼Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼',
        text: 'â€¢ **Ð¡ÑƒÑ‰ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie:** Ð­Ñ‚Ð¸ Ñ„Ð°Ð¹Ð»Ñ‹ cookie ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹ Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð²Ð°Ð¼ ÑƒÑÐ»ÑƒÐ³, Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ñ… Ñ‡ÐµÑ€ÐµÐ· Ð½Ð°Ñˆ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚, Ð¸ Ð´Ð»Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ñ… ÐµÐ³Ð¾ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¹, Ñ‚Ð°ÐºÐ¸Ñ… ÐºÐ°Ðº Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð½Ñ‹Ð¼ Ð¾Ð±Ð»Ð°ÑÑ‚ÑÐ¼.\nâ€¢ **Ð¤Ð°Ð¹Ð»Ñ‹ cookie Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸:** Ð­Ñ‚Ð¸ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ÑÑ Ð´Ð»Ñ Ð¿Ð¾Ð²Ñ‹ÑˆÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð°, Ð½Ð¾ Ð½Ðµ ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼Ð¸ Ð´Ð»Ñ Ð¸Ñ… Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ. ÐžÐ´Ð½Ð°ÐºÐ¾ Ð±ÐµÐ· ÑÑ‚Ð¸Ñ… Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, Ð²Ð¸Ð´ÐµÐ¾) Ð¼Ð¾Ð³ÑƒÑ‚ ÑÑ‚Ð°Ñ‚ÑŒ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ð¼Ð¸.\nâ€¢ **Ð¤Ð°Ð¹Ð»Ñ‹ cookie Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸:** Ð­Ñ‚Ð¸ Ñ„Ð°Ð¹Ð»Ñ‹ cookie ÑÐ¾Ð±Ð¸Ñ€Ð°ÑŽÑ‚ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, ÐºÐ¾Ñ‚Ð¾Ñ€Ð°Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð»Ð¸Ð±Ð¾ Ð² ÑÐ¾Ð²Ð¾ÐºÑƒÐ¿Ð½Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð¼Ð¾Ñ‡ÑŒ Ð½Ð°Ð¼ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÐºÐ°Ðº Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð½Ð°Ñˆ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚ Ð¸Ð»Ð¸ Ð½Ð°ÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ñ‹ Ð½Ð°ÑˆÐ¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¸Ð½Ð³Ð¾Ð²Ñ‹Ðµ ÐºÐ°Ð¼Ð¿Ð°Ð½Ð¸Ð¸, Ð»Ð¸Ð±Ð¾ Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð¼Ð¾Ñ‡ÑŒ Ð½Ð°Ð¼ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ Ð½Ð°Ñˆ Ð’ÐµÐ±-ÑÐ°Ð¹Ñ‚ Ð´Ð»Ñ Ð²Ð°Ñ.\nâ€¢ **Ð ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie:** Ð­Ñ‚Ð¸ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ÑÑ Ð´Ð»Ñ Ñ‚Ð¾Ð³Ð¾, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ Ð±Ñ‹Ð»Ð¸ Ð±Ð¾Ð»ÐµÐµ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ñ‹Ð¼Ð¸ Ð´Ð»Ñ Ð²Ð°Ñ. ÐžÐ½Ð¸ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÑŽÑ‚ Ñ‚Ð°ÐºÐ¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸, ÐºÐ°Ðº Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ð¾Ð³Ð¾ Ð¿Ð¾ÑÐ²Ð»ÐµÐ½Ð¸Ñ Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¸ Ñ‚Ð¾Ð³Ð¾ Ð¶Ðµ Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ñ, Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾Ñ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ð¹ Ð´Ð»Ñ Ñ€ÐµÐºÐ»Ð°Ð¼Ð¾Ð´Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð¸, Ð² Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ñ… ÑÐ»ÑƒÑ‡Ð°ÑÑ…, Ð²Ñ‹Ð±Ð¾Ñ€ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ñ… Ð¾Ð±ÑŠÑÐ²Ð»ÐµÐ½Ð¸Ð¹, Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð½Ð° Ð²Ð°ÑˆÐ¸Ñ… Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ°Ñ….',
      },
      {
        id: 'control-cookies',
        title: '4. ÐšÐ°Ðº Ñ Ð¼Ð¾Ð³Ñƒ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ Ñ„Ð°Ð¹Ð»Ð°Ð¼Ð¸ cookie?',
        text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ñ€ÐµÑˆÐ°Ñ‚ÑŒ, Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÑÑ‚ÑŒ Ñ„Ð°Ð¹Ð»Ñ‹ cookie. Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ñ€ÐµÐ°Ð»Ð¸Ð·Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐ²Ð¾Ð¸ Ð¿Ñ€Ð°Ð²Ð° Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie, Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ð² ÑÐ²Ð¾Ð¸ Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ñ‡Ñ‚ÐµÐ½Ð¸Ñ Ð² ÐœÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ðµ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie. ÐœÐµÐ½ÐµÐ´Ð¶ÐµÑ€ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÐµÑ‚ Ð²Ð°Ð¼ Ð²Ñ‹Ð±Ð¸Ñ€Ð°Ñ‚ÑŒ, ÐºÐ°ÐºÐ¸Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð²Ñ‹ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÑ‚Ðµ Ð¸Ð»Ð¸ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÑÐµÑ‚Ðµ. Ð¡ÑƒÑ‰ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ðµ Ñ„Ð°Ð¹Ð»Ñ‹ cookie Ð½Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÐµÐ½Ñ‹, Ð¿Ð¾ÑÐºÐ¾Ð»ÑŒÐºÑƒ Ð¾Ð½Ð¸ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹ Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð²Ð°Ð¼ ÑƒÑÐ»ÑƒÐ³.\n\nÐ’Ñ‹ Ñ‚Ð°ÐºÐ¶Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ñ‹ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð²ÐµÐ±-Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÑÑ‚ÑŒ Ñ„Ð°Ð¹Ð»Ñ‹ cookie. Ð•ÑÐ»Ð¸ Ð²Ñ‹ Ñ€ÐµÑˆÐ¸Ñ‚Ðµ Ð¾Ñ‚ÐºÐ»Ð¾Ð½Ð¸Ñ‚ÑŒ Ñ„Ð°Ð¹Ð»Ñ‹ cookie, Ð²Ñ‹ Ð²ÑÐµ Ñ€Ð°Ð²Ð½Ð¾ ÑÐ¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð½Ð°Ñˆ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚, Ñ…Ð¾Ñ‚Ñ Ð²Ð°Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ Ñ„ÑƒÐ½ÐºÑ†Ð¸ÑÐ¼ Ð¸ Ð¾Ð±Ð»Ð°ÑÑ‚ÑÐ¼ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð²ÐµÐ±-ÑÐ°Ð¹Ñ‚Ð° Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½.',
      },
      {
        id: 'updates',
        title: '5. ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ‚Ð¾Ð¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸',
        text: 'ÐœÑ‹ Ð¼Ð¾Ð¶ÐµÐ¼ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ñ‚ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÑ‚ÑŒ ÑÑ‚Ñƒ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ñ‚Ñ€Ð°Ð¶Ð°Ñ‚ÑŒ, Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ Ð² Ñ„Ð°Ð¹Ð»Ð°Ñ… cookie, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¼Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼, Ð¸Ð»Ð¸ Ð¿Ð¾ Ð´Ñ€ÑƒÐ³Ð¸Ð¼ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼, ÑŽÑ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼ Ð¸Ð»Ð¸ Ð½Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ð¼ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½Ð°Ð¼. ÐŸÐ¾ÑÑ‚Ð¾Ð¼Ñƒ, Ð¿Ð¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾ Ð¿Ð¾ÑÐµÑ‰Ð°Ð¹Ñ‚Ðµ ÑÑ‚Ñƒ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ð² ÐºÑƒÑ€ÑÐµ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð¸ ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ñ… Ñ Ð½Ð¸Ð¼Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹.',
      },
      {
        id: 'contact',
        title: '6. Ð¡Ð²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°Ð¼Ð¸',
        text: 'Ð•ÑÐ»Ð¸ Ñƒ Ð²Ð°Ñ ÐµÑÑ‚ÑŒ ÐºÐ°ÐºÐ¸Ðµ-Ð»Ð¸Ð±Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ð¾ Ð½Ð°ÑˆÐµÐ¼ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ñ„Ð°Ð¹Ð»Ð¾Ð² cookie Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹, Ð½Ð°Ð¿Ð¸ÑˆÐ¸Ñ‚Ðµ Ð½Ð°Ð¼ Ð¿Ð¾ Ð°Ð´Ñ€ÐµÑÑƒ privacy@ekabalance.com Ð¸Ð»Ð¸ Ð¿Ð¾ Ð¿Ð¾Ñ‡Ñ‚Ðµ:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain',
      },
    ],
  },
};

export default function CookiesPage() {
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
          EspaÃ±ol
        </button>
        <button
          onClick={() => setLang('ca')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'ca' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          CatalÃ 
        </button>
        <button
          onClick={() => setLang('ru')}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${lang === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Ð ÑƒÑÑÐºÐ¸Ð¹
        </button>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h1 className="mb-2 text-3xl font-semibold">{content[lang].title}</h1>
        <p className="text-muted-foreground mb-8 text-sm">{content[lang].updated}</p>

        <div className="mb-8 border-l-4 border-primary bg-primary/5 p-4">
          <p className="text-primary">{content[lang].intro}</p>
        </div>

        <div className="space-y-8">
          {content[lang].sections.map((section, index) => (
            <section key={index} id={(section as any).id} className="mb-8 scroll-mt-24">
              <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {section.text}
              </div>
              {(section as any).id === 'control-cookies' && (
                <button
                  onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                >
                  Open Cookie Preferences
                </button>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
