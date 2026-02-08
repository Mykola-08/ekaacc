'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
 en: {
  title: "Intellectual Property Policy",
  updated: "Last Updated: November 25, 2025",
  intro: "EKA Balance respects the intellectual property rights of others and expects its users to do the same. It is our policy, in appropriate circumstances and at our discretion, to disable and/or terminate the accounts of users who repeatedly infringe or are repeatedly charged with infringing the copyrights or other intellectual property rights of others.",
  sections: [
   {
    id: "eka-ip",
    title: "1. EKA Balance Intellectual Property",
    text: "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of EKA Balance and its licensors. The Service is protected by copyright, trademark, and other laws of both Spain and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EKA Balance."
   },
   {
    id: "user-content-license",
    title: "2. User Content License",
    text: "By posting, uploading, or otherwise submitting content to the Service (\"User Content\"), you grant EKA Balance a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service and EKA Balance's (and its successors' and affiliates') business, including without limitation for promoting and redistributing part or all of the Service (and derivative works thereof) in any media formats and through any media channels. You retain all ownership rights to your User Content."
   },
   {
    id: "copyright-infringement",
    title: "3. Copyright Infringement Notification",
    text: "If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, you must submit your notice in writing to the attention of \"Copyright Agent\" of EKA Balance and include in your notice a detailed description of the alleged infringement.\n\nYou may be held accountable for damages (including costs and attorneys' fees) for misrepresenting that any Content is infringing your copyright."
   },
   {
    id: "dmca-notice",
    title: "4. DMCA Notice and Procedure for Copyright Infringement Claims",
    text: "You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):\n\n• An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.\n• A description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.\n• Identification of the URL or other specific location on the Service where the material that you claim is infringing is located.\n• Your address, telephone number, and email address.\n• A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.\n• A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.\n\nYou can contact our Copyright Agent via email at legal@ekabalance.com."
   },
   {
    id: "counter-notice",
    title: "5. Counter-Notice",
    text: "If you believe that your Content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your Content, you may send a counter-notice containing the following information to the Copyright Agent:\n\n• Your physical or electronic signature.\n• Identification of the Content that has been removed or to which access has been disabled and the location at which the Content appeared before it was removed or disabled.\n• A statement that you have a good faith belief that the Content was removed or disabled as a result of mistake or a misidentification of the Content.\n• Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the courts in Barcelona, Spain, and a statement that you will accept service of process from the person who provided notification of the alleged infringement."
   },
   {
    id: "trademark-complaints",
    title: "6. Trademark Complaints",
    text: "EKA Balance also respects the trademark rights of others. Accounts with any other content that misleads others or violates another's trademark may be updated, suspended, disabled, or terminated by EKA Balance in its sole discretion. If you are concerned that someone may be using your trademark in an infringing way on our Service, please email us at legal@ekabalance.com, and we will review your complaint. If we deem appropriate, we may remove the offending content, warn the individual who posted the content, and/or temporarily or permanently suspend or terminate the individual's account."
   }
  ]
 },
 es: {
  title: "Política de Propiedad Intelectual",
  updated: "Última actualización: 25 de noviembre de 2025",
  intro: "EKA Balance respeta los derechos de propiedad intelectual de otros y espera que sus usuarios hagan lo mismo. Es nuestra política, en las circunstancias apropiadas y a nuestra discreción, deshabilitar y/o cancelar las cuentas de los usuarios que infrinjan repetidamente o sean acusados repetidamente de infringir los derechos de autor u otros derechos de propiedad intelectual de otros.",
  sections: [
   {
    id: "eka-ip",
    title: "1. Propiedad Intelectual de EKA Balance",
    text: "El Servicio y su contenido original (excluyendo el Contenido proporcionado por los usuarios), características y funcionalidad son y seguirán siendo propiedad exclusiva de EKA Balance y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de España como de países extranjeros. Nuestras marcas comerciales e imagen comercial no pueden utilizarse en relación con ningún producto o servicio sin el consentimiento previo por escrito de EKA Balance."
   },
   {
    id: "user-content-license",
    title: "2. Licencia de Contenido de Usuario",
    text: "Al publicar, cargar o enviar contenido al Servicio (\"Contenido de Usuario\"), usted otorga a EKA Balance una licencia no exclusiva, mundial, libre de regalías, sublicenciable y transferible para usar, reproducir, distribuir, preparar trabajos derivados de, mostrar y realizar el Contenido de Usuario en relación con el Servicio y el negocio de EKA Balance (y sus sucesores y afiliados), incluyendo, entre otros, para promover y redistribuir parte o la totalidad del Servicio (y trabajos derivados del mismo) en cualquier formato de medios y a través de cualquier canal de medios. Usted conserva todos los derechos de propiedad sobre su Contenido de Usuario."
   },
   {
    id: "copyright-infringement",
    title: "3. Notificación de Infracción de Derechos de Autor",
    text: "Si usted es propietario de derechos de autor, o está autorizado en nombre de uno, y cree que el trabajo protegido por derechos de autor ha sido copiado de una manera que constituye una infracción de derechos de autor que está teniendo lugar a través del Servicio, debe enviar su aviso por escrito a la atención del \"Agente de Derechos de Autor\" de EKA Balance e incluir en su aviso una descripción detallada de la supuesta infracción.\n\nUsted puede ser considerado responsable de los daños (incluidos los costos y los honorarios de los abogados) por tergiversar que cualquier Contenido infringe sus derechos de autor."
   },
   {
    id: "dmca-notice",
    title: "4. Aviso y Procedimiento de la DMCA para Reclamaciones de Infracción de Derechos de Autor",
    text: "Puede enviar una notificación de conformidad con la Ley de Derechos de Autor del Milenio Digital (DMCA) proporcionando a nuestro Agente de Derechos de Autor la siguiente información por escrito (consulte 17 U.S.C 512(c)(3) para obtener más detalles):\n\n• Una firma electrónica o física de la persona autorizada para actuar en nombre del propietario del interés de los derechos de autor.\n• Una descripción del trabajo protegido por derechos de autor que usted afirma que ha sido infringido, incluida la URL (es decir, la dirección de la página web) de la ubicación donde existe el trabajo protegido por derechos de autor o una copia del trabajo protegido por derechos de autor.\n• Identificación de la URL u otra ubicación específica en el Servicio donde se encuentra el material que usted afirma que infringe.\n• Su dirección, número de teléfono y dirección de correo electrónico.\n• Una declaración suya de que cree de buena fe que el uso en disputa no está autorizado por el propietario de los derechos de autor, su agente o la ley.\n• Una declaración suya, hecha bajo pena de perjurio, de que la información anterior en su aviso es precisa y que usted es el propietario de los derechos de autor o está autorizado para actuar en nombre del propietario de los derechos de autor.\n\nPuede ponerse en contacto con nuestro Agente de Derechos de Autor por correo electrónico en legal@ekabalance.com."
   },
   {
    id: "counter-notice",
    title: "5. Contranotificación",
    text: "Si cree que su Contenido que fue eliminado (o al que se deshabilitó el acceso) no infringe, o que tiene la autorización del propietario de los derechos de autor, el agente del propietario de los derechos de autor, o de conformidad con la ley, para publicar y usar el material en su Contenido, puede enviar una contranotificación que contenga la siguiente información al Agente de Derechos de Autor:\n\n• Su firma física o electrónica.\n• Identificación del Contenido que ha sido eliminado o al que se ha deshabilitado el acceso y la ubicación en la que apareció el Contenido antes de ser eliminado o deshabilitado.\n• Una declaración de que cree de buena fe que el Contenido fue eliminado o deshabilitado como resultado de un error o una identificación errónea del Contenido.\n• Su nombre, dirección, número de teléfono y dirección de correo electrónico, una declaración de que acepta la jurisdicción de los tribunales de Barcelona, España, y una declaración de que aceptará la notificación del proceso de la persona que proporcionó la notificación de la supuesta infracción."
   },
   {
    id: "trademark-complaints",
    title: "6. Quejas de Marcas Comerciales",
    text: "EKA Balance también respeta los derechos de marca comercial de otros. Las cuentas con cualquier otro contenido que engañe a otros o viole la marca comercial de otro pueden ser actualizadas, suspendidas, deshabilitadas o terminadas por EKA Balance a su entera discreción. Si le preocupa que alguien pueda estar utilizando su marca comercial de manera infractora en nuestro Servicio, envíenos un correo electrónico a legal@ekabalance.com y revisaremos su queja. Si lo consideramos apropiado, podemos eliminar el contenido ofensivo, advertir a la persona que publicó el contenido y/o suspender o cancelar temporal o permanentemente la cuenta de la persona."
   }
  ]
 },
 ca: {
  title: "Política de Propietat Intel·lectual",
  updated: "Darrera actualització: 25 de novembre de 2025",
  intro: "EKA Balance respecta els drets de propietat intel·lectual d'altres i espera que els seus usuaris facin el mateix. És la nostra política, en les circumstàncies apropiades i a la nostra discreció, deshabilitar i/o cancel·lar els comptes dels usuaris que infringeixin repetidament o siguin acusats repetidament d'infringir els drets d'autor o altres drets de propietat intel·lectual d'altres.",
  sections: [
   {
    id: "eka-ip",
    title: "1. Propietat Intel·lectual d'EKA Balance",
    text: "El Servei i el seu contingut original (excloent el Contingut proporcionat pels usuaris), característiques i funcionalitat són i seguiran sent propietat exclusiva d'EKA Balance i els seus llicenciants. El Servei està protegit per drets d'autor, marques registrades i altres lleis tant d'Espanya com de països estrangers. Les nostres marques comercials i imatge comercial no poden utilitzar-se en relació amb cap producte o servei sense el consentiment previ per escrit d'EKA Balance."
   },
   {
    id: "user-content-license",
    title: "2. Llicència de Contingut d'Usuari",
    text: "En publicar, carregar o enviar contingut al Servei (\"Contingut d'Usuari\"), vostè atorga a EKA Balance una llicència no exclusiva, mundial, lliure de regalies, sublicenciable i transferible per utilitzar, reproduir, distribuir, preparar treballs derivats de, mostrar i realitzar el Contingut d'Usuari en relació amb el Servei i el negoci d'EKA Balance (i els seus successors i afiliats), incloent, entre d'altres, per promoure i redistribuir part o la totalitat del Servei (i treballs derivats del mateix) en qualsevol format de mitjans i a través de qualsevol canal de mitjans. Vostè conserva tots els drets de propietat sobre el seu Contingut d'Usuari."
   },
   {
    id: "copyright-infringement",
    title: "3. Notificació d'Infracció de Drets d'Autor",
    text: "Si vostè és propietari de drets d'autor, o està autoritzat en nom d'un, i creu que el treball protegit per drets d'autor ha estat copiat d'una manera que constitueix una infracció de drets d'autor que està tenint lloc a través del Servei, ha d'enviar el seu avís per escrit a l'atenció de l'\"Agent de Drets d'Autor\" d'EKA Balance i incloure en el seu avís una descripció detallada de la suposada infracció.\n\nVostè pot ser considerat responsable dels danys (inclosos els costos i els honoraris dels advocats) per tergiversar que qualsevol Contingut infringeix els seus drets d'autor."
   },
   {
    id: "dmca-notice",
    title: "4. Avís i Procediment de la DMCA per a Reclamacions d'Infracció de Drets d'Autor",
    text: "Pot enviar una notificació de conformitat amb la Llei de Drets d'Autor del Mil·lenni Digital (DMCA) proporcionant al nostre Agent de Drets d'Autor la següent informació per escrit (consulti 17 U.S.C 512(c)(3) per obtenir més detalls):\n\n• Una signatura electrònica o física de la persona autoritzada per actuar en nom del propietari de l'interès dels drets d'autor.\n• Una descripció del treball protegit per drets d'autor que vostè afirma que ha estat infringit, inclosa la URL (és a dir, l'adreça de la pàgina web) de la ubicació on existeix el treball protegit per drets d'autor o una còpia del treball protegit per drets d'autor.\n• Identificació de la URL o una altra ubicació específica en el Servei on es troba el material que vostè afirma que infringeix.\n• La seva adreça, número de telèfon i adreça de correu electrònic.\n• Una declaració seva de que creu de bona fe que l'ús en disputa no està autoritzat pel propietari dels drets d'autor, el seu agent o la llei.\n• Una declaració seva, feta sota pena de perjuri, de que la informació anterior en el seu avís és precisa i que vostè és el propietari dels drets d'autor o està autoritzat per actuar en nom del propietari dels drets d'autor.\n\nPot posar-se en contacte amb el nostre Agent de Drets d'Autor per correu electrònic a legal@ekabalance.com."
   },
   {
    id: "counter-notice",
    title: "5. Contranotificació",
    text: "Si creu que el seu Contingut que va ser eliminat (o al qual es va deshabilitar l'accés) no infringeix, o que té l'autorització del propietari dels drets d'autor, l'agent del propietari dels drets d'autor, o de conformitat amb la llei, per publicar i utilitzar el material en el seu Contingut, pot enviar una contranotificació que contingui la següent informació a l'Agent de Drets d'Autor:\n\n• La seva signatura física o electrònica.\n• Identificació del Contingut que ha estat eliminat o al qual s'ha deshabilitat l'accés i la ubicació en la qual va aparèixer el Contingut abans de ser eliminat o deshabilitat.\n• Una declaració de que creu de bona fe que el Contingut va ser eliminat o deshabilitat com a resultat d'un error o una identificació errònia del Contingut.\n• El seu nom, adreça, número de telèfon i adreça de correu electrònic, una declaració de que accepta la jurisdicdicció dels tribunals de Barcelona, Espanya, i una declaració de que acceptarà la notificació del procés de la persona que va proporcionar la notificació de la suposada infracció."
   },
   {
    id: "trademark-complaints",
    title: "6. Queixes de Marques Comercials",
    text: "EKA Balance també respecta els drets de marca comercial d'altres. Els comptes amb qualsevol altre contingut que enganyi a altres o violi la marca comercial d'un altre poden ser actualitzades, suspeses, deshabilitades o terminades per EKA Balance a la seva sencera discreció. Si li preocupa que algú pugui estar utilitzant la seva marca comercial de manera infractora en el nostre Servei, enviï'ns un correu electrònic a legal@ekabalance.com i revisarem la seva queixa. Si ho considerem apropiat, podem eliminar el contingut ofensiu, advertir a la persona que va publicar el contingut i/o suspendre o cancel·lar temporalment o permanentment el compte de la persona."
   }
  ]
 },
 ru: {
  title: "Политика интеллектуальной собственности",
  updated: "Последнее обновление: 25 ноября 2025 г.",
  intro: "EKA Balance уважает права интеллектуальной собственности других лиц и ожидает, что ее пользователи будут делать то же самое. Наша политика заключается в том, чтобы при соответствующих обстоятельствах и по нашему усмотрению отключать и/или аннулировать учетные записи пользователей, которые неоднократно нарушают или неоднократно обвиняются в нарушении авторских прав или других прав интеллектуальной собственности других лиц.",
  sections: [
   {
    id: "eka-ip",
    title: "1. Интеллектуальная собственность EKA Balance",
    text: "Сервис и его оригинальный контент (за исключением Контента, предоставленного пользователями), функции и функциональность являются и останутся исключительной собственностью EKA Balance и ее лицензиаров. Сервис защищен авторским правом, товарными знаками и другими законами как Испании, так и зарубежных стран. Наши товарные знаки и фирменный стиль не могут использоваться в связи с каким-либо продуктом или услугой без предварительного письменного согласия EKA Balance."
   },
   {
    id: "user-content-license",
    title: "2. Лицензия на пользовательский контент",
    text: "Размещая, загружая или иным образом отправляя контент в Сервис («Пользовательский контент»), вы предоставляете EKA Balance неисключительную, всемирную, безвозмездную, сублицензируемую и передаваемую лицензию на использование, воспроизведение, распространение, подготовку производных работ, отображение и исполнение Пользовательского контента в связи с Сервисом и бизнесом EKA Balance (и ее правопреемников и аффилированных лиц), включая, помимо прочего, для продвижения и перераспределения части или всего Сервиса (и производных работ от него) в любых медиаформатах и через любые медиаканалы. Вы сохраняете все права собственности на свой Пользовательский контент."
   },
   {
    id: "copyright-infringement",
    title: "3. Уведомление о нарушении авторских прав",
    text: "Если вы являетесь владельцем авторских прав или уполномочены от имени одного из них, и вы считаете, что защищенная авторским правом работа была скопирована способом, который представляет собой нарушение авторских прав, которое происходит через Сервис, вы должны отправить свое уведомление в письменной форме на имя «Агента по авторским правам» EKA Balance и включить в свое уведомление подробное описание предполагаемого нарушения.\n\nВы можете быть привлечены к ответственности за ущерб (включая расходы и гонорары адвокатов) за ложное заявление о том, что какой-либо Контент нарушает ваши авторские права."
   },
   {
    id: "dmca-notice",
    title: "4. Уведомление DMCA и процедура подачи исков о нарушении авторских прав",
    text: "Вы можете отправить уведомление в соответствии с Законом об авторском праве в цифровую эпоху (DMCA), предоставив нашему Агенту по авторским правам следующую информацию в письменной форме (см. 17 U.S.C 512(c)(3) для получения более подробной информации):\n\n• Электронная или физическая подпись лица, уполномоченного действовать от имени владельца интереса авторского права.\n• Описание защищенной авторским правом работы, которая, по вашему утверждению, была нарушена, включая URL-адрес (т. е. адрес веб-страницы) местоположения, где существует защищенная авторским правом работа, или копию защищенной авторским правом работы.\n• Идентификация URL-адреса или другого конкретного местоположения в Сервисе, где находится материал, который, по вашему утверждению, нарушает права.\n• Ваш адрес, номер телефона и адрес электронной почты.\n• Заявление от вас о том, что вы добросовестно полагаете, что спорное использование не разрешено владельцем авторских прав, его агентом или законом.\n• Заявление от вас, сделанное под страхом наказания за лжесвидетельство, о том, что вышеуказанная информация в вашем уведомлении является точной и что вы являетесь владельцем авторских прав или уполномочены действовать от имени владельца авторских прав.\n\nВы можете связаться с нашим Агентом по авторским правам по электронной почте legal@ekabalance.com."
   },
   {
    id: "counter-notice",
    title: "5. Встречное уведомление",
    text: "Если вы считаете, что ваш Контент, который был удален (или доступ к которому был отключен), не нарушает права, или что у вас есть разрешение от владельца авторских прав, агента владельца авторских прав или в соответствии с законом на публикацию и использование материала в вашем Контенте, вы можете отправить встречное уведомление, содержащее следующую информацию, Агенту по авторским правам:\n\n• Ваша физическая или электронная подпись.\n• Идентификация Контента, который был удален или доступ к которому был отключен, и местоположение, в котором Контент появился до того, как он был удален или отключен.\n• Заявление о том, что вы добросовестно полагаете, что Контент был удален или отключен в результате ошибки или неправильной идентификации Контента.\n• Ваше имя, адрес, номер телефона и адрес электронной почты, заявление о том, что вы соглашаетесь с юрисдикцией судов в Барселоне, Испания, и заявление о том, что вы примете вручение процессуальных документов от лица, предоставившего уведомление о предполагаемом нарушении."
   },
   {
    id: "trademark-complaints",
    title: "6. Жалобы на товарные знаки",
    text: "EKA Balance также уважает права на товарные знаки других лиц. Учетные записи с любым другим контентом, который вводит других в заблуждение или нарушает товарный знак другого лица, могут быть обновлены, приостановлены, отключены или аннулированы EKA Balance по своему усмотрению. Если вы обеспокоены тем, что кто-то может использовать ваш товарный знак с нарушением прав в нашем Сервисе, напишите нам по адресу legal@ekabalance.com, и мы рассмотрим вашу жалобу. Если мы сочтем это целесообразным, мы можем удалить оскорбительный контент, предупредить лицо, разместившее контент, и/или временно или навсегда приостановить или аннулировать учетную запись этого лица."
   }
  ]
 }
};

export default function IntellectualPropertyPage() {
 const [language, setLanguage] = useState<Language>('en');
 const t = content[language];

 return (
  <div className="space-y-8">
   <div className="flex justify-end space-x-2 mb-4">
    <button 
     onClick={() => setLanguage('en')}
     className={`px-3 py-1 rounded text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
    >
     EN
    </button>
    <button 
     onClick={() => setLanguage('es')}
     className={`px-3 py-1 rounded text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
    >
     ES
    </button>
    <button 
     onClick={() => setLanguage('ca')}
     className={`px-3 py-1 rounded text-sm ${language === 'ca' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
    >
     CA
    </button>
    <button 
     onClick={() => setLanguage('ru')}
     className={`px-3 py-1 rounded text-sm ${language === 'ru' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
    >
     RU
    </button>
   </div>

   <div className="border-b pb-6">
    <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
    <p className="text-muted-foreground">{t.updated}</p>
   </div>

   <div className="prose prose-gray max-w-none">
    <p className="text-lg leading-relaxed text-muted-foreground mb-8">
     {t.intro}
    </p>

    {t.sections.map((section, index) => (
     <section key={index} id={section.id} className="mb-8 scroll-mt-24">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
       {section.title}
      </h2>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
       {section.text}
      </div>
     </section>
    ))}
   </div>
  </div>
 );
}

