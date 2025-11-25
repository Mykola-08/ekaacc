'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: "Cookie Policy",
    updated: "Last Updated: November 25, 2025",
    intro: "This Cookie Policy explains how EKA Balance uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.",
    sections: [
      {
        title: "1. What are cookies?",
        text: "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.\n\nCookies set by the website owner (in this case, EKA Balance) are called \"first-party cookies\". Cookies set by parties other than the website owner are called \"third-party cookies\". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics)."
      },
      {
        title: "2. Why do we use cookies?",
        text: "We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as \"essential\" or \"strictly necessary\" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes."
      },
      {
        title: "3. Types of Cookies We Use",
        text: "• **Essential Cookies:** These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.\n• **Performance and Functionality Cookies:** These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.\n• **Analytics and Customization Cookies:** These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.\n• **Advertising Cookies:** These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests."
      },
      {
        title: "4. How can I control cookies?",
        text: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.\n\nYou can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted."
      },
      {
        title: "5. Updates to this Policy",
        text: "We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies."
      },
      {
        title: "6. Contact Us",
        text: "If you have any questions about our use of cookies or other technologies, please email us at privacy@ekabalance.com or by post to:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain"
      }
    ]
  },
  es: {
    title: "Política de Cookies",
    updated: "Última actualización: 25 de noviembre de 2025",
    intro: "Esta Política de Cookies explica cómo EKA Balance utiliza cookies y tecnologías similares para reconocerlo cuando visita nuestro sitio web. Explica qué son estas tecnologías y por qué las usamos, así como sus derechos para controlar nuestro uso de ellas.",
    sections: [
      {
        title: "1. ¿Qué son las cookies?",
        text: "Las cookies son pequeños archivos de datos que se colocan en su computadora o dispositivo móvil cuando visita un sitio web. Los propietarios de sitios web utilizan ampliamente las cookies para que sus sitios web funcionen, o para que funcionen de manera más eficiente, así como para proporcionar información de informes.\n\nLas cookies establecidas por el propietario del sitio web (en este caso, EKA Balance) se denominan \"cookies de origen\". Las cookies establecidas por partes distintas al propietario del sitio web se denominan \"cookies de terceros\". Las cookies de terceros permiten que se proporcionen características o funcionalidades de terceros en o a través del sitio web (por ejemplo, publicidad, contenido interactivo y análisis)."
      },
      {
        title: "2. ¿Por qué utilizamos cookies?",
        text: "Utilizamos cookies de origen y de terceros por varias razones. Algunas cookies son necesarias por razones técnicas para que nuestro sitio web funcione, y nos referimos a ellas como cookies \"esenciales\" o \"estrictamente necesarias\". Otras cookies también nos permiten rastrear y dirigir los intereses de nuestros usuarios para mejorar la experiencia en nuestras Propiedades en línea. Los terceros sirven cookies a través de nuestro sitio web con fines publicitarios, analíticos y otros."
      },
      {
        title: "3. Tipos de Cookies que Utilizamos",
        text: "• **Cookies Esenciales:** Estas cookies son estrictamente necesarias para brindarle los servicios disponibles a través de nuestro sitio web y para utilizar algunas de sus funciones, como el acceso a áreas seguras.\n• **Cookies de Rendimiento y Funcionalidad:** Estas cookies se utilizan para mejorar el rendimiento y la funcionalidad de nuestro sitio web, pero no son esenciales para su uso. Sin embargo, sin estas cookies, ciertas funciones (como videos) pueden no estar disponibles.\n• **Cookies de Análisis y Personalización:** Estas cookies recopilan información que se utiliza en forma agregada para ayudarnos a comprender cómo se utiliza nuestro sitio web o qué tan efectivas son nuestras campañas de marketing, o para ayudarnos a personalizar nuestro sitio web para usted.\n• **Cookies Publicitarias:** Estas cookies se utilizan para hacer que los mensajes publicitarios sean más relevantes para usted. Realizan funciones como evitar que el mismo anuncio reaparezca continuamente, garantizar que los anuncios es muestren correctamente para los anunciantes y, en algunos casos, seleccionar anuncios basados en sus intereses."
      },
      {
        title: "4. ¿Cómo puedo controlar las cookies?",
        text: "Tiene derecho a decidir si acepta o rechaza las cookies. Puede ejercer sus derechos de cookies configurando sus preferencias en el Administrador de Consentimiento de Cookies. El Administrador de Consentimiento de Cookies le permite seleccionar qué categorías de cookies acepta o rechaza. Las cookies esenciales no se pueden rechazar ya que son estrictamente necesarias para brindarle servicios.\n\nTambién puede configurar o modificar los controles de su navegador web para aceptar o rechazar cookies. Si elige rechazar las cookies, aún puede usar nuestro sitio web, aunque su acceso a algunas funciones y áreas de nuestro sitio web puede estar restringido."
      },
      {
        title: "5. Actualizaciones de esta Política",
        text: "Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, vuelva a visitar esta Política de Cookies regularmente para mantenerse informado sobre nuestro uso de cookies y tecnologías relacionadas."
      },
      {
        title: "6. Contáctenos",
        text: "Si tiene alguna pregunta sobre nuestro uso de cookies u otras tecnologías, envíenos un correo electrónico a privacy@ekabalance.com o por correo postal a:\n\nEKA Balance\nCarrer de [Nombre de la Calle], [Número]\n08001 Barcelona\nEspaña"
      }
    ]
  },
  ca: {
    title: "Política de Cookies",
    updated: "Última actualització: 25 de novembre de 2025",
    intro: "Aquesta Política de Cookies explica com EKA Balance utilitza cookies i tecnologies similars per reconèixer-vos quan visiteu el nostre lloc web. Explica què són aquestes tecnologies i per què les utilitzem, així com els vostres drets per controlar el nostre ús d'elles.",
    sections: [
      {
        title: "1. Què són les cookies?",
        text: "Les cookies són petits fitxers de dades que es col·loquen al vostre ordinador o dispositiu mòbil quan visiteu un lloc web. Els propietaris de llocs web utilitzen àmpliament les cookies per fer que els seus llocs web funcionin, o perquè funcionin de manera més eficient, així com per proporcionar informació d'informes.\n\nLes cookies establertes pel propietari del lloc web (en aquest cas, EKA Balance) s'anomenen \"cookies de primera part\". Les cookies establertes per parts diferents del propietari del lloc web s'anomenen \"cookies de tercers\". Les cookies de tercers permeten que es proporcionin característiques o funcionalitats de tercers al lloc web o a través d'ell (per exemple, publicitat, contingut interactiu i anàlisi)."
      },
      {
        title: "2. Per què utilitzem cookies?",
        text: "Utilitzem cookies de primera part i de tercers per diverses raons. Algunes cookies són necessàries per raons tècniques perquè el nostre lloc web funcioni, i ens hi referim com a cookies \"essencials\" o \"estrictament necessàries\". Altres cookies també ens permeten fer un seguiment i orientar els interessos dels nostres usuaris per millorar l'experiència a les nostres Propietats en línia. Els tercers serveixen cookies a través del nostre lloc web amb finalitats publicitàries, analítiques i altres."
      },
      {
        title: "3. Tipus de Cookies que Utilitzem",
        text: "• **Cookies Essencials:** Aquestes cookies són estrictament necessàries per proporcionar-vos els serveis disponibles a través del nostre lloc web i per utilitzar algunes de les seves funcions, com ara l'accés a àrees segures.\n• **Cookies de Rendiment i Funcionalitat:** Aquestes cookies s'utilitzen per millorar el rendiment i la funcionalitat del nostre lloc web, però no són essencials per al seu ús. No obstant això, sense aquestes cookies, certes funcionalitats (com ara vídeos) poden no estar disponibles.\n• **Cookies d'Anàlisi i Personalització:** Aquestes cookies recopilen informació que s'utilitza de forma agregada per ajudar-nos a comprendre com s'utilitza el nostre lloc web o quina eficàcia tenen les nostres campanyes de màrqueting, o per ajudar-nos a personalitzar el nostre lloc web per a vosaltres.\n• **Cookies Publicitàries:** Aquestes cookies s'utilitzen per fer que els missatges publicitaris siguin més rellevants per a vosaltres. Realitzen funcions com evitar que el mateix anunci reaparegui contínuament, garantir que els anuncis es mostrin correctament per als anunciants i, en alguns casos, seleccionar anuncis basats en els vostres interessos."
      },
      {
        title: "4. Com puc controlar les cookies?",
        text: "Teniu dret a decidir si accepteu o rebutgeu les cookies. Podeu exercir els vostres drets de cookies configurant les vostres preferències al Gestor de Consentiment de Cookies. El Gestor de Consentiment de Cookies us permet seleccionar quines categories de cookies accepteu o rebutgeu. Les cookies essencials no es poden rebutjar ja que són estrictament necessàries per proporcionar-vos serveis.\n\nTambé podeu configurar o modificar els controls del vostre navegador web per acceptar o rebutjar cookies. Si trieu rebutjar les cookies, encara podeu utilitzar el nostre lloc web, tot i que el vostre accés a algunes funcionalitats i àrees del nostre lloc web pot estar restringit."
      },
      {
        title: "5. Actualitzacions d'aquesta Política",
        text: "Podem actualitzar aquesta Política de Cookies de tant en tant per reflectir, per exemple, canvis en les cookies que utilitzem o per altres raons operatives, legals o reglamentàries. Per tant, torneu a visitar aquesta Política de Cookies regularment per mantenir-vos informats sobre el nostre ús de cookies i tecnologies relacionades."
      },
      {
        title: "6. Contacteu-nos",
        text: "Si teniu alguna pregunta sobre el nostre ús de cookies o altres tecnologies, envieu-nos un correu electrònic a privacy@ekabalance.com o per correu postal a:\n\nEKA Balance\nCarrer de [Nom del Carrer], [Número]\n08001 Barcelona\nEspanya"
      }
    ]
  },
  ru: {
    title: "Политика использования файлов cookie",
    updated: "Последнее обновление: 25 ноября 2025 г.",
    intro: "Эта Политика использования файлов cookie объясняет, как EKA Balance использует файлы cookie и аналогичные технологии, чтобы распознавать вас, когда вы посещаете наш веб-сайт. В ней объясняется, что это за технологии и почему мы их используем, а также ваши права контролировать их использование нами.",
    sections: [
      {
        title: "1. Что такое файлы cookie?",
        text: "Файлы cookie — это небольшие файлы данных, которые размещаются на вашем компьютере или мобильном устройстве при посещении веб-сайта. Файлы cookie широко используются владельцами веб-сайтов для того, чтобы их веб-сайты работали или работали более эффективно, а также для предоставления отчетной информации.\n\nФайлы cookie, установленные владельцем веб-сайта (в данном случае EKA Balance), называются «основными файлами cookie». Файлы cookie, установленные сторонами, отличными от владельца веб-сайта, называются «сторонними файлами cookie». Сторонние файлы cookie позволяют предоставлять сторонние функции или функциональные возможности на веб-сайте или через него (например, рекламу, интерактивный контент и аналитику)."
      },
      {
        title: "2. Почему мы используем файлы cookie?",
        text: "Мы используем основные и сторонние файлы cookie по нескольким причинам. Некоторые файлы cookie необходимы по техническим причинам для работы нашего Веб-сайта, и мы называем их «существенными» или «строго необходимыми» файлами cookie. Другие файлы cookie также позволяют нам отслеживать и нацеливать интересы наших пользователей для улучшения опыта использования наших Онлайн-ресурсов. Третьи стороны размещают файлы cookie через наш Веб-сайт для рекламы, аналитики и других целей."
      },
      {
        title: "3. Типы файлов cookie, которые мы используем",
        text: "• **Существенные файлы cookie:** Эти файлы cookie строго необходимы для предоставления вам услуг, доступных через наш Веб-сайт, и для использования некоторых его функций, таких как доступ к защищенным областям.\n• **Файлы cookie производительности и функциональности:** Эти файлы cookie используются для повышения производительности и функциональности нашего Веб-сайта, но не являются обязательными для их использования. Однако без этих файлов cookie определенные функции (например, видео) могут стать недоступными.\n• **Файлы cookie аналитики и настройки:** Эти файлы cookie собирают информацию, которая используется либо в совокупной форме, чтобы помочь нам понять, как используется наш Веб-сайт или насколько эффективны наши маркетинговые кампании, либо чтобы помочь нам настроить наш Веб-сайт для вас.\n• **Рекламные файлы cookie:** Эти файлы cookie используются для того, чтобы рекламные сообщения были более релевантными для вас. Они выполняют такие функции, как предотвращение постоянного повторного появления одного и того же объявления, обеспечение правильного отображения объявлений для рекламодателей и, в некоторых случаях, выбор рекламных объявлений, основанных на ваших интересах."
      },
      {
        title: "4. Как я могу управлять файлами cookie?",
        text: "Вы имеете право решать, принимать или отклонять файлы cookie. Вы можете реализовать свои права на использование файлов cookie, настроив свои предпочтения в Менеджере согласия на использование файлов cookie. Менеджер согласия на использование файлов cookie позволяет вам выбирать, какие категории файлов cookie вы принимаете или отклоняете. Существенные файлы cookie не могут быть отклонены, поскольку они строго необходимы для предоставления вам услуг.\n\nВы также можете установить или изменить элементы управления вашего веб-браузера, чтобы принимать или отклонять файлы cookie. Если вы решите отклонить файлы cookie, вы все равно сможете использовать наш веб-сайт, хотя ваш доступ к некоторым функциям и областям нашего веб-сайта может быть ограничен."
      },
      {
        title: "5. Обновления этой Политики",
        text: "Мы можем время от времени обновлять эту Политику использования файлов cookie, чтобы отражать, например, изменения в файлах cookie, которые мы используем, или по другим операционным, юридическим или нормативным причинам. Поэтому, пожалуйста, регулярно посещайте эту Политику использования файлов cookie, чтобы быть в курсе нашего использования файлов cookie и связанных с ними технологий."
      },
      {
        title: "6. Свяжитесь с нами",
        text: "Если у вас есть какие-либо вопросы о нашем использовании файлов cookie или других технологий, напишите нам по адресу privacy@ekabalance.com или по почте:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain"
      }
    ]
  }
};

export default function CookiesPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-8 space-x-2">
        <button 
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLang('es')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === 'es' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Español
        </button>
        <button 
          onClick={() => setLang('ca')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === 'ca' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Català
        </button>
        <button 
          onClick={() => setLang('ru')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Русский
        </button>
      </div>

      <div className="prose max-w-none dark:prose-invert">
        <h1 className="text-3xl font-bold mb-2">{content[lang].title}</h1>
        <p className="text-sm text-muted-foreground mb-8">{content[lang].updated}</p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-blue-700">{content[lang].intro}</p>
        </div>

        <div className="space-y-8">
          {content[lang].sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {section.text}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
