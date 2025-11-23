'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: "Terms of Service",
    updated: "Last Updated: November 23, 2025",
    intro: "Please read these Terms of Service (\"Terms\", \"Terms of Service\") carefully before using the EKA Balance website and services (the \"Service\") operated by EKA Balance (\"us\", \"we\", or \"our\"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        text: "By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service."
      },
      {
        title: "2. Accounts",
        text: "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.\n\nYou are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account."
      },
      {
        title: "3. Intellectual Property",
        text: "The Service and its original content, features, and functionality are and will remain the exclusive property of EKA Balance and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EKA Balance."
      },
      {
        title: "4. Links To Other Web Sites",
        text: "Our Service may contain links to third-party web sites or services that are not owned or controlled by EKA Balance.\n\nEKA Balance has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that EKA Balance shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services."
      },
      {
        title: "5. Termination",
        text: "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.\n\nAll provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.\n\nUpon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service."
      },
      {
        title: "6. Limitation of Liability",
        text: "In no event shall EKA Balance, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose."
      },
      {
        title: "7. Disclaimer",
        text: "Your use of the Service is at your sole risk. The Service is provided on an \"AS IS\" and \"AS AVAILABLE\" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.\n\nEKA Balance does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements."
      },
      {
        title: "8. Governing Law",
        text: "These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.\n\nOur failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service."
      },
      {
        title: "9. Changes",
        text: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.\n\nBy continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service."
      },
      {
        title: "10. Contact Us",
        text: "If you have any questions about these Terms, please contact us at legal@ekabalance.com."
      }
    ]
  },
  es: {
    title: "Términos de Servicio",
    updated: "Última actualización: 23 de noviembre de 2025",
    intro: "Lea estos Términos de Servicio (\"Términos\", \"Términos de Servicio\") detenidamente antes de utilizar el sitio web y los servicios de EKA Balance (el \"Servicio\") operados por EKA Balance (\"nosotros\", \"nos\" o \"nuestro\"). Su acceso y uso del Servicio está condicionado a su aceptación y cumplimiento de estos Términos. Estos Términos se aplican a todos los visitantes, usuarios y otras personas que acceden o utilizan el Servicio.",
    sections: [
      {
        title: "1. Aceptación de los Términos",
        text: "Al acceder o utilizar el Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio."
      },
      {
        title: "2. Cuentas",
        text: "Cuando crea una cuenta con nosotros, debe proporcionarnos información que sea precisa, completa y actual en todo momento. El no hacerlo constituye un incumplimiento de los Términos, lo que puede resultar en la terminación inmediata de su cuenta en nuestro Servicio.\n\nUsted es responsable de salvaguardar la contraseña que utiliza para acceder al Servicio y de cualquier actividad o acción bajo su contraseña, ya sea que su contraseña sea con nuestro Servicio o un servicio de terceros. Acepta no revelar su contraseña a ningún tercero. Debe notificarnos inmediatamente al darse cuenta de cualquier violación de seguridad o uso no autorizado de su cuenta."
      },
      {
        title: "3. Propiedad Intelectual",
        text: "El Servicio y su contenido, características y funcionalidad originales son y seguirán siendo propiedad exclusiva de EKA Balance y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de los Estados Unidos como de países extranjeros. Nuestras marcas comerciales y nuestra imagen comercial no pueden utilizarse en relación con ningún producto o servicio sin el consentimiento previo por escrito de EKA Balance."
      },
      {
        title: "4. Enlaces a Otros Sitios Web",
        text: "Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por EKA Balance.\n\nEKA Balance no tiene control ni asume ninguna responsabilidad por el contenido, las políticas de privacidad o las prácticas de sitios web o servicios de terceros. Además, reconoce y acepta que EKA Balance no será responsable, directa o indirectamente, de ningún daño o pérdida causado o supuestamente causado por o en relación con el uso o la confianza en dicho contenido, bienes o servicios disponibles en o a través de dichos sitios web o servicios."
      },
      {
        title: "5. Terminación",
        text: "Podemos terminar o suspender el acceso a nuestro Servicio inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluido, entre otros, si incumple los Términos.\n\nTodas las disposiciones de los Términos que, por su naturaleza, deban sobrevivir a la terminación, sobrevivirán a la terminación, incluidas, entre otras, las disposiciones de propiedad, las renuncias de garantía, la indemnización y las limitaciones de responsabilidad.\n\nAl finalizar, su derecho a utilizar el Servicio cesará inmediatamente. Si desea cancelar su cuenta, simplemente puede dejar de utilizar el Servicio."
      },
      {
        title: "6. Limitación de Responsabilidad",
        text: "En ningún caso EKA Balance, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluidos, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de (i) su acceso o uso o incapacidad para acceder o utilizar el Servicio; (ii) cualquier conducta o contenido de cualquier tercero en el Servicio; (iii) cualquier contenido obtenido del Servicio; y (iv) acceso no autorizado, uso o alteración de sus transmisiones o contenido, ya sea basado en garantía, contrato, agravio (incluida negligencia) o cualquier otra teoría legal, ya sea que hayamos sido informados o no de la posibilidad de tal daño, e incluso si se determina que un remedio establecido en este documento ha fallado en su propósito esencial."
      },
      {
        title: "7. Descargo de Responsabilidad",
        text: "Su uso del Servicio es bajo su propio riesgo. El Servicio se proporciona \"TAL CUAL\" y \"SEGÚN DISPONIBILIDAD\". El Servicio se proporciona sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas, entre otras, las garantías implícitas de comerciabilidad, idoneidad para un propósito particular, no infracción o curso de ejecución.\n\nEKA Balance no garantiza que a) el Servicio funcionará ininterrumpidamente, seguro o disponible en cualquier momento o lugar en particular; b) se corregirán los errores o defectos; c) el Servicio está libre de virus u otros componentes dañinos; o d) los resultados del uso del Servicio cumplirán con sus requisitos."
      },
      {
        title: "8. Ley Aplicable",
        text: "Estos Términos se regirán e interpretarán de acuerdo con las leyes de [Su País/Estado], sin tener en cuenta sus disposiciones sobre conflictos de leyes.\n\nNuestra falta de hacer valer cualquier derecho o disposición de estos Términos no se considerará una renuncia a esos derechos. Si alguna disposición de estos Términos es considerada inválida o inaplicable por un tribunal, las disposiciones restantes de estos Términos permanecerán vigentes. Estos Términos constituyen el acuerdo completo entre nosotros con respecto a nuestro Servicio, y reemplazan y reemplazan cualquier acuerdo anterior que podamos tener entre nosotros con respecto al Servicio."
      },
      {
        title: "9. Cambios",
        text: "Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigencia los nuevos términos. Lo que constituye un cambio material se determinará a nuestra sola discreción.\n\nAl continuar accediendo o utilizando nuestro Servicio después de que esas revisiones entren en vigencia, usted acepta estar sujeto a los términos revisados. Si no está de acuerdo con los nuevos términos, deje de usar el Servicio."
      },
      {
        title: "10. Contáctenos",
        text: "Si tiene alguna pregunta sobre estos Términos, contáctenos en legal@ekabalance.com."
      }
    ]
  },
  ca: {
    title: "Termes del Servei",
    updated: "Última actualització: 23 de novembre de 2025",
    intro: "Llegiu aquests Termes del Servei (\"Termes\", \"Termes del Servei\") detingudament abans d'utilitzar el lloc web i els serveis d'EKA Balance (el \"Servei\") operats per EKA Balance (\"nosaltres\", \"ens\" o \"nostre\"). El vostre accés i ús del Servei està condicionat a la vostra acceptació i compliment d'aquests Termes. Aquests Termes s'apliquen a tots els visitants, usuaris i altres persones que accedeixen o utilitzen el Servei.",
    sections: [
      {
        title: "1. Acceptació dels Termes",
        text: "En accedir o utilitzar el Servei, accepteu estar subjecte a aquests Termes. Si no esteu d'acord amb alguna part dels termes, no podreu accedir al Servei."
      },
      {
        title: "2. Comptes",
        text: "Quan creeu un compte amb nosaltres, heu de proporcionar-nos informació que sigui precisa, completa i actual en tot moment. El fet de no fer-ho constitueix un incompliment dels Termes, la qual cosa pot resultar en la terminació immediata del vostre compte al nostre Servei.\n\nSou responsable de salvaguardar la contrasenya que utilitzeu per accedir al Servei i de qualsevol activitat o acció sota la vostra contrasenya, ja sigui que la vostra contrasenya sigui amb el nostre Servei o un servei de tercers. Accepteu no revelar la vostra contrasenya a cap tercer. Ens heu de notificar immediatament en adonar-vos de qualsevol violació de seguretat o ús no autoritzat del vostre compte."
      },
      {
        title: "3. Propietat Intel·lectual",
        text: "El Servei i el seu contingut, característiques i funcionalitat originals són i seguiran sent propietat exclusiva d'EKA Balance i els seus llicenciants. El Servei està protegit per drets d'autor, marques registrades i altres lleis tant dels Estats Units com de països estrangers. Les nostres marques comercials i la nostra imatge comercial no es poden utilitzar en relació amb cap producte o servei sense el consentiment previ per escrit d'EKA Balance."
      },
      {
        title: "4. Enllaços a Altres Llocs Web",
        text: "El nostre Servei pot contenir enllaços a llocs web o serveis de tercers que no són propietat ni estan controlats per EKA Balance.\n\nEKA Balance no té control ni assumeix cap responsabilitat pel contingut, les polítiques de privacitat o les pràctiques de llocs web o serveis de tercers. A més, reconeixeu i accepteu que EKA Balance no serà responsable, directament o indirectament, de cap dany o pèrdua causat o suposadament causat per o en relació amb l'ús o la confiança en aquest contingut, béns o serveis disponibles en o a través d'aquests llocs web o serveis."
      },
      {
        title: "5. Terminació",
        text: "Podem terminar o suspendre l'accés al nostre Servei immediatament, sense previ avís o responsabilitat, per qualsevol motiu, inclòs, entre d'altres, si incompliu els Termes.\n\nTotes les disposicions dels Termes que, per la seva naturalesa, hagin de sobreviure a la terminació, sobreviuran a la terminació, incloses, entre d'altres, les disposicions de propietat, les renúncies de garantia, la indemnització i les limitacions de responsabilitat.\n\nEn finalitzar, el vostre dret a utilitzar el Servei cessarà immediatament. Si voleu cancel·lar el vostre compte, simplement podeu deixar d'utilitzar el Servei."
      },
      {
        title: "6. Limitació de Responsabilitat",
        text: "En cap cas EKA Balance, ni els seus directors, empleats, socis, agents, proveïdors o afiliats, seran responsables de cap dany indirecte, incidental, especial, conseqüent o punitiu, inclosos, entre d'altres, la pèrdua de beneficis, dades, ús, bona voluntat o altres pèrdues intangibles, resultants de (i) el vostre accés o ús o incapacitat per accedir o utilitzar el Servei; (ii) qualsevol conducta o contingut de qualsevol tercer al Servei; (iii) qualsevol contingut obtingut del Servei; i (iv) accés no autoritzat, ús o alteració de les vostres transmissions o contingut, ja sigui basat en garantia, contracte, greuge (inclosa negligència) o qualsevol altra teoria legal, ja sigui que hàgim estat informats o no de la possibilitat d'aquest dany, i fins i tot si es determina que un remei establert en aquest document ha fallat en el seu propòsit essencial."
      },
      {
        title: "7. Descàrrec de Responsabilitat",
        text: "El vostre ús del Servei és sota el vostre propi risc. El Servei es proporciona \"TAL QUAL\" i \"SEGONS DISPONIBILITAT\". El Servei es proporciona sense garanties de cap tipus, ja siguin expresses o implícites, incloses, entre d'altres, les garanties implícites de comercialització, idoneïtat per a un propòsit particular, no infracció o curs d'execució.\n\nEKA Balance no garanteix que a) el Servei funcionarà ininterrompudament, segur o disponible en qualsevol moment o lloc en particular; b) es corregiran els errors o defectes; c) el Servei està lliure de virus o altres components nocius; o d) els resultats de l'ús del Servei compliran amb els vostres requisits."
      },
      {
        title: "8. Llei Aplicable",
        text: "Aquests Termes es regiran e interpretaran d'acord amb les lleis de [El Vostre País/Estat], sense tenir en compte les seves disposicions sobre conflictes de lleis.\n\nLa nostra falta de fer valer qualsevol dret o disposició d'aquests Termes no es considerarà una renúncia a aquests drets. Si alguna disposició d'aquests Termes és considerada invàlida o inaplicable per un tribunal, les disposicions restants d'aquests Termes romandran vigents. Aquests Termes constitueixen l'acord complet entre nosaltres pel que fa al nostre Servei, i substitueixen i reemplacen qualsevol acord anterior que puguem tenir entre nosaltres pel que fa al Servei."
      },
      {
        title: "9. Canvis",
        text: "Ens reservem el dret, a la nostra sola discreció, de modificar o reemplaçar aquests Termes en qualsevol moment. Si una revisió és material, intentarem proporcionar un avís d'almenys 30 dies abans que entrin en vigor els nous termes. El que constitueix un canvi material es determinarà a la nostra sola discreció.\n\nEn continuar accedint o utilitzant el nostre Servei després que aquestes revisions entrin en vigor, accepteu estar subjecte als termes revisats. Si no esteu d'acord amb els nous termes, deixeu d'utilitzar el Servei."
      },
      {
        title: "10. Contacteu-nos",
        text: "Si teniu alguna pregunta sobre aquests Termes, contacteu-nos a legal@ekabalance.com."
      }
    ]
  },
  ru: {
    title: "Условия обслуживания",
    updated: "Последнее обновление: 23 ноября 2025 г.",
    intro: "Пожалуйста, внимательно прочитайте эти Условия обслуживания («Условия», «Условия обслуживания») перед использованием веб-сайта и услуг EKA Balance («Сервис»), управляемых EKA Balance («нас», «мы» или «наш»). Ваш доступ к Сервису и его использование зависят от вашего принятия и соблюдения этих Условий. Эти Условия распространяются на всех посетителей, пользователей и других лиц, которые получают доступ к Сервису или используют его.",
    sections: [
      {
        title: "1. Принятие условий",
        text: "Получая доступ к Сервису или используя его, вы соглашаетесь соблюдать эти Условия. Если вы не согласны с какой-либо частью условий, вы не можете получить доступ к Сервису."
      },
      {
        title: "2. Учетные записи",
        text: "Когда вы создаете у нас учетную запись, вы должны предоставлять нам информацию, которая является точной, полной и актуальной в любое время. Невыполнение этого требования представляет собой нарушение Условий, что может привести к немедленному прекращению действия вашей учетной записи в нашем Сервисе.\n\nВы несете ответственность за защиту пароля, который вы используете для доступа к Сервису, и за любые действия или действия под вашим паролем, независимо от того, находится ли ваш пароль в нашем Сервисе или в стороннем сервисе. Вы соглашаетесь не разглашать свой пароль третьим лицам. Вы должны немедленно уведомить нас, как только узнаете о любом нарушении безопасности или несанкционированном использовании вашей учетной записи."
      },
      {
        title: "3. Интеллектуальная собственность",
        text: "Сервис и его оригинальный контент, функции и функциональные возможности являются и останутся исключительной собственностью EKA Balance и ее лицензиаров. Сервис защищен авторским правом, товарными знаками и другими законами как Соединенных Штатов, так и других стран. Наши товарные знаки и фирменный стиль не могут использоваться в связи с каким-либо продуктом или услугой без предварительного письменного согласия EKA Balance."
      },
      {
        title: "4. Ссылки на другие веб-сайты",
        text: "Наш Сервис может содержать ссылки на сторонние веб-сайты или сервисы, которые не принадлежат и не контролируются EKA Balance.\n\nEKA Balance не контролирует и не несет ответственности за контент, политику конфиденциальности или практику любых сторонних веб-сайтов или сервисов. Вы также признаете и соглашаетесь с тем, что EKA Balance не несет ответственности, прямой или косвенной, за любой ущерб или убытки, вызванные или предположительно вызванные или в связи с использованием или доверием к любому такому контенту, товарам или услугам, доступным на или через любые такие веб-сайты или сервисы."
      },
      {
        title: "5. Прекращение",
        text: "Мы можем прекратить или приостановить доступ к нашему Сервису немедленно, без предварительного уведомления или ответственности, по любой причине, включая, помимо прочего, нарушение вами Условий.\n\nВсе положения Условий, которые по своей природе должны пережить прекращение, переживут прекращение, включая, помимо прочего, положения о праве собственности, отказ от гарантий, возмещение убытков и ограничения ответственности.\n\nПосле прекращения ваше право на использование Сервиса немедленно прекратится. Если вы хотите удалить свою учетную запись, вы можете просто прекратить использование Сервиса."
      },
      {
        title: "6. Ограничение ответственности",
        text: "Ни при каких обстоятельствах EKA Balance, ни ее директора, сотрудники, партнеры, агенты, поставщики или аффилированные лица не несут ответственности за любые косвенные, случайные, специальные, побочные или штрафные убытки, включая, помимо прочего, потерю прибыли, данных, использования, деловой репутации или другие нематериальные убытки, возникшие в результате (i) вашего доступа к Сервису или его использования или невозможности доступа к Сервису или его использования; (ii) любого поведения или контента любой третьей стороны в Сервисе; (iii) любого контента, полученного из Сервиса; и (iv) несанкционированного доступа, использования или изменения ваших передач или контента, будь то на основании гарантии, контракта, правонарушения (включая халатность) или любой другой правовой теории, независимо от того, были ли мы проинформированы о возможности такого ущерба, и даже если средство правовой защиты, изложенное в настоящем документе, не достигло своей основной цели."
      },
      {
        title: "7. Отказ от ответственности",
        text: "Вы используете Сервис на свой страх и риск. Сервис предоставляется на условиях «КАК ЕСТЬ» и «КАК ДОСТУПНО». Сервис предоставляется без каких-либо гарантий, явных или подразумеваемых, включая, помимо прочего, подразумеваемые гарантии товарной пригодности, пригодности для определенной цели, ненарушения прав или хода исполнения.\n\nEKA Balance не гарантирует, что a) Сервис будет работать бесперебойно, безопасно или доступно в любое конкретное время или в любом месте; b) любые ошибки или дефекты будут исправлены; c) Сервис не содержит вирусов или других вредных компонентов; или d) результаты использования Сервиса будут соответствовать вашим требованиям."
      },
      {
        title: "8. Применимое право",
        text: "Эти Условия регулируются и толкуются в соответствии с законами [Ваша страна/штат], без учета положений коллизионного права.\n\nНаше невыполнение какого-либо права или положения этих Условий не будет считаться отказом от этих прав. Если какое-либо положение этих Условий будет признано судом недействительным или не имеющим исковой силы, остальные положения этих Условий останутся в силе. Эти Условия составляют полное соглашение между нами в отношении нашего Сервиса и заменяют собой любые предыдущие соглашения, которые могли быть у нас между нами в отношении Сервиса."
      },
      {
        title: "9. Изменения",
        text: "Мы оставляем за собой право по собственному усмотрению изменять или заменять эти Условия в любое время. Если пересмотр является существенным, мы постараемся предоставить уведомление не менее чем за 30 дней до вступления в силу любых новых условий. Что представляет собой существенное изменение, будет определяться по нашему собственному усмотрению.\n\nПродолжая получать доступ к нашему Сервису или использовать его после вступления в силу этих изменений, вы соглашаетесь соблюдать пересмотренные условия. Если вы не согласны с новыми условиями, пожалуйста, прекратите использование Сервиса."
      },
      {
        title: "10. Свяжитесь с нами",
        text: "Если у вас есть какие-либо вопросы об этих Условиях, свяжитесь с нами по адресу legal@ekabalance.com."
      }
    ]
  }
};

export default function TermsPage() {
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
            <section key={index} className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">{section.title}</h2>
              <div className="text-card-foreground/80 leading-relaxed whitespace-pre-wrap">
                {section.text}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
