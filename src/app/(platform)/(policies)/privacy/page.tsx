'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
 en: {
  title: "Privacy Policy",
  updated: "Last Updated: November 25, 2025",
  intro: "At EKA Balance, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.",
  sections: [
   {
    id: "collection",
    title: "1. Information We Collect",
    text: "We collect information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device. This includes:\n\n• **Personal Identifiers:** Name, email address, phone number, postal address, unique personal identifier, online identifier, IP address.\n• **Protected Classification Characteristics:** Age, gender, medical condition (when voluntarily provided for therapy purposes).\n• **Commercial Information:** Records of products or services purchased, obtained, or considered.\n• **Internet/Network Activity:** Browsing history, search history, information on a consumer's interaction with a website, application, or advertisement.\n• **Sensory Data:** Audio, electronic, visual, or similar information (e.g., during video consultations, if recorded with consent).\n• **Professional/Employment Information:** Current or past job history (for therapists)."
   },
   {
    id: "usage",
    title: "2. How We Use Your Information",
    text: "We use the information we collect for the following purposes:\n\n• **To Provide Services:** To facilitate account creation, manage your orders, deliver services, and process payments.\n• **To Improve Our Platform:** To understand and analyze how you use our website and services to improve functionality and user experience.\n• **To Communicate:** To send you administrative information, such as updates to our terms, conditions, and policies, and to respond to your inquiries.\n• **Marketing:** To send you marketing and promotional communications (you can opt-out at any time).\n• **Security:** To protect our Site and your account from fraud and unauthorized access.\n• **Legal Compliance:** To comply with applicable laws, regulations, and legal processes."
   },
   {
    id: "sharing",
    title: "3. Sharing Your Information",
    text: "We may share your information in the following situations:\n\n• **Service Providers:** We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., payment processing, data analysis, email delivery, hosting services). We sign Data Processing Agreements (DPAs) with all such processors to ensure they protect your data.\n• **Business Transfers:** We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.\n• **Legal Requirements:** We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process."
   },
   {
    id: "retention",
    title: "4. Data Minimization & Retention",
    text: "We adhere to the principle of data minimization, collecting only the data necessary for the purposes specified. We maintain a Record of Processing Activities (RoPA) to track our data handling practices.\n\nWe will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us."
   },
   {
    id: "security",
    title: "5. Security & Compliance",
    text: "We use administrative, technical, and physical security measures to help protect your personal information. We are ISO 27001 and ISO 27701 certified, SOC 2 Type II compliant, and HIPAA compliant. We conduct regular Data Protection Impact Assessments (DPIAs) for high-risk processing activities.\n\nWhile we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse."
   },
   {
    id: "ccpa",
    title: "6. Your Privacy Rights (GDPR & CCPA)",
    text: "Depending on your location, you may have the following rights:\n\n**GDPR (EEA/UK):**\n• **Access:** Request copies of your personal data.\n• **Rectification:** Request correction of inaccurate data.\n• **Erasure:** Request deletion of your data ('Right to be Forgotten').\n• **Restriction:** Request restriction of processing.\n• **Portability:** Request transfer of your data to another organization.\n• **Objection:** Object to processing based on legitimate interests or direct marketing.\n\n**CCPA/CPRA (California):**\n• **Right to Know:** Request details about categories and specific pieces of personal information we collect.\n• **Right to Delete:** Request deletion of your personal information.\n• **Right to Opt-Out:** We do not sell your personal information. However, you have the right to opt-out of the sale or sharing of personal information if we did.\n• **Non-Discrimination:** We will not discriminate against you for exercising your privacy rights.\n\nTo exercise these rights, please contact us or use the privacy settings in your account."
   },
   {
    id: "dpo",
    title: "7. Data Protection Officer (DPO)",
    text: "We have appointed a Data Protection Officer to oversee our data privacy compliance. You can contact our DPO at:\n\n**Email:** dpo@ekabalance.com\n**Address:** EKA Balance, Attn: DPO, Carrer de [Street Name], [Number], 08001 Barcelona, Spain"
   },
   {
    id: "children",
    title: "8. Children's Privacy",
    text: "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information."
   },
   {
    id: "contact",
    title: "9. Contact Us",
    text: "If you have questions or comments about this policy, you may email us at privacy@ekabalance.com or by post to:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain"
   }
  ]
 },
 es: {
  title: "Política de Privacidad",
  updated: "Última actualización: 25 de noviembre de 2025",
  intro: "En EKA Balance, nos tomamos muy en serio su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web y utiliza nuestros servicios. Lea atentamente esta política de privacidad. Si no está de acuerdo con los términos de esta política de privacidad, no acceda al sitio.",
  sections: [
   {
    id: "collection",
    title: "1. Información que Recopilamos",
    text: "Recopilamos información que identifica, se relaciona, describe, hace referencia, es capaz de asociarse o podría vincularse razonablemente, directa o indirectamente, con un consumidor o dispositivo en particular. Esto incluye:\n\n• **Identificadores Personales:** Nombre, dirección de correo electrónico, número de teléfono, dirección postal, identificador personal único, identificador en línea, dirección IP.\n• **Características de Clasificación Protegida:** Edad, género, condición médica (cuando se proporciona voluntariamente para fines terapéuticos).\n• **Información Comercial:** Registros de productos o servicios comprados, obtenidos o considerados.\n• **Actividad de Internet/Red:** Historial de navegación, historial de búsqueda, información sobre la interacción de un consumidor con un sitio web, aplicación o anuncio.\n• **Datos Sensoriales:** Audio, electrónica, visual o información similar (por ejemplo, durante consultas de vídeo, si es graban con consentimiento).\n• **Información Profesional/Laboral:** Historial laboral actual o pasado (para terapeutas)."
   },
   {
    id: "usage",
    title: "2. Cómo Usamos Su Información",
    text: "Utilizamos la información que recopilamos para los siguientes propósitos:\n\n• **Para Proporcionar Servicios:** Para facilitar la creación de cuentas, gestionar sus pedidos, entregar servicios y procesar pagaments.\n• **Para Mejorar Nuestra Plataforma:** Para comprender y analizar cómo utiliza nuestro sitio web y servicios para mejorar la funcionalidad y la experiencia del usuario.\n• **Para Comunicarnos:** Para enviarle información administrativa, como actualizaciones de nuestros términos, condiciones y políticas, y para responder a sus consultas.\n• **Marketing:** Para enviarle comunicaciones de marketing y promocionales (puede optar por no recibirlas en cualquier momento).\n• **Seguridad:** Para proteger nuestro Sitio y su cuenta contra el fraude y el acceso no autorizado.\n• **Cumplimiento Legal:** Para cumplir con las leyes, regulaciones y procesos legales aplicables."
   },
   {
    id: "sharing",
    title: "3. Compartir Su Información",
    text: "Podemos compartir su información en las siguientes situaciones:\n\n• **Proveedores de Servicios:** Podemos compartir su información con proveedores externos, contratistas o agentes que realizan servicios para nosotros o en nuestro nombre y requieren acceso a dicha información para realizar ese trabajo (por ejemplo, procesamiento de pagos, análisis de datos, entrega de correo electrónico, servicios de alojamiento).\n• **Transferencias Comerciales:** Podemos compartir o transferir su información en relación con, o durante las negociaciones de, cualquier fusión, venta de activos de la empresa, financiamiento o adquisición de todo o una parte de nuestro negocio a otra empresa.\n• **Requisitos Legales:** Podemos divulgar su información cuando estemos legalmente obligados a hacerlo para cumplir con la ley aplicable, solicitudes gubernamentales, un procedimiento judicial, orden judicial o proceso legal."
   },
   {
    id: "retention",
    title: "4. Retención de Datos",
    text: "Solo conservaremos su información personal durante el tiempo que sea necesario para los fines establecidos en esta política de privacidad, a menos que la ley exija o permita un período de retención más largo (como requisitos fiscales, contables u otros requisitos legales). Ningún propósito en esta política requerirá que mantengamos su información personal por más tiempo del período de tiempo en el que los usuarios tienen una cuenta con nosotros."
   },
   {
    id: "security",
    title: "5. Seguridad de Su Información",
    text: "Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para proteger la información personal que nos proporciona, tenga en cuenta que, a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y ningún método de transmisión de datos puede garantizarse contra cualquier intercepción u otro tipo de uso indebido."
   },
   {
    id: "ccpa",
    title: "6. Sus Derechos de Privacidad (RGPD)",
    text: "Si se encuentra en el Espacio Económico Europeo (EEE), tiene ciertos derechos de protección de datos. EKA Balance tiene como objetivo tomar medidas razonables para permitirle corregir, enmendar, eliminar o limitar el uso de sus Datos Personales.\n\nSi desea ser informado sobre qué Datos Personales tenemos sobre usted y si desea que se eliminen de nuestros sistemas, contáctenos.\n\nEn determinadas circunstancias, tiene los siguientes derechos de protección de datos:\n\n• **El derecho a acceder, actualizar o eliminar la información que tenemos sobre usted.**\n• **El derecho de rectificación.** Tiene derecho a que se rectifique su información si esa información es inexacta o incompleta.\n• **El derecho a oponerse.** Tiene derecho a oponerse a nuestro procesamiento de sus Datos Personales.\n• **El derecho de restricción.** Tiene derecho a solicitar que restrinjamos el procesamiento de su información personal.\n• **El derecho a la portabilidad de datos.** Tiene derecho a recibir una copia de la información que tenemos sobre usted en un formato estructurado, legible por máquina y de uso común.\n• **El derecho a retirar el consentimiento.** También tiene derecho a retirar su consentimiento en cualquier momento en que EKA Balance haya confiado en su consentimiento para procesar su información personal."
   },
   {
    id: "children",
    title: "7. Privacidad de los Niños",
    text: "Nuestros servicios no están destinados a niños menores de 13 años. No recopilamos a sabiendas información personal de niños menores de 13 años. Si nos enteramos de que hemos recopilado o recibido información personal de un niño menor de 13 años sin verificación del consentimiento de los padres, eliminaremos esa información."
   },
   {
    id: "contact",
    title: "8. Contáctenos",
    text: "Si tiene preguntas o comentarios sobre esta política, puede enviarnos un correo electrónico a privacy@ekabalance.com o por correo postal a:\n\nEKA Balance\nCarrer de [Nombre de la Calle], [Número]\n08001 Barcelona\nEspaña"
   }
  ]
 },
 ca: {
  title: "Política de Privacitat",
  updated: "Última actualització: 25 de novembre de 2025",
  intro: "A EKA Balance, ens prenem molt seriosament la vostra privacitat. Aquesta Política de Privacitat explica com recopilem, utilitzem, divulguem i protegim la vostra informació quan visiteu el nostre lloc web i utilitzeu els nostres serveis. Llegiu atentament aquesta política de privacitat. Si no esteu d'acord amb els termes d'aquesta política de privacitat, no accediu al lloc.",
  sections: [
   {
    id: "collection",
    title: "1. Informació que Recopilem",
    text: "Recopilem informació que identifica, es relaciona, descriu, fa referència, és capaç d'associar-se o podria vincular-se raonablement, directament o indirectament, amb un consumidor o dispositiu en particular. Això inclou:\n\n• **Identificadors Personals:** Nom, adreça de correu electrònic, número de telèfon, adreça postal, identificador personal únic, identificador en línia, adreça IP.\n• **Característiques de Classificació Protegida:** Edat, gènere, condició mèdica (quan es proporciona voluntàriament per a finalitats terapèutiques).\n• **Informació Comercial:** Registres de productes o serveis comprats, obtinguts o considerats.\n• **Activitat d'Internet/Xarxa:** Historial de navegació, historial de cerca, informació sobre la interacció d'un consumidor amb un lloc web, aplicació o anunci.\n• **Dades Sensorials:** Àudio, electrònica, visual o informació similar (per exemple, durant consultes de vídeo, si es graven amb consentiment).\n• **Informació Professional/Laboral:** Historial laboral actual o passat (per a terapeutes)."
   },
   {
    id: "usage",
    title: "2. Com Utilitzem la Vostra Informació",
    text: "Utilitzem la informació que recopilem per als següents propòsits:\n\n• **Per Proporcionar Serveis:** Per facilitar la creació de comptes, gestionar les vostres comandes, lliurar serveis i processar pagaments.\n• **Per Millorar la Nostra Plataforma:** Per comprendre i analitzar com utilitzeu el nostre lloc web i serveis per millorar la funcionalitat i l'experiència de l'usuari.\n• **Per Comunicar-nos:** Per enviar-vos informació administrativa, com ara actualitzacions dels nostres termes, condicions i polítiques, i per respondre a les vostres consultes.\n• **Màrqueting:** Per enviar-vos comunicacions de màrqueting i promocionals (podeu optar per no rebre-les en qualsevol moment).\n• **Seguretat:** Per protegir el nostre Lloc i el vostre compte contra el frau i l'accés no autoritzat.\n• **Compliment Legal:** Per complir amb les lleis, regulacions i processos legals aplicables."
   },
   {
    id: "sharing",
    title: "3. Compartir la Vostra Informació",
    text: "Podem compartir la vostra informació en les següents situacions:\n\n• **Proveïdors de Serveis:** Podem compartir la vostra informació amb proveïdors externs, contractistes o agents que realitzen serveis per a nosaltres o en nom nostre i requereixen accés a aquesta informació per realitzar aquesta feina (per exemple, processament de pagaments, anàlisi de dades, lliurament de correu electrònic, serveis d'allotjament).\n• **Transferències Comercials:** Podem compartir o transferir la vostra informació en relació amb, o durant les negociacions de, qualsevol fusió, venda d'actius de l'empresa, finançament o adquisició de tot o una part del nostre negoci a una altra empresa.\n• **Requisits Legals:** Podem divulgar la vostra informació quan estiguem legalment obligats a fer-ho per complir amb la llei aplicable, sol·licituds governamentals, un procediment judicial, ordre judicial o procés legal."
   },
   {
    id: "retention",
    title: "4. Retenció de Dades",
    text: "Només conservarem la vostra informació personal durant el temps que sigui necessari per als fins establerts en aquesta política de privacitat, tret que la llei exigeixi o permeti un període de retenció més llarg (com ara requisits fiscals, comptables o altres requisits legals). Cap propòsit en aquesta política requerirà que mantinguem la vostra informació personal per més temps del període de temps en què els usuaris tenen un compte amb nosaltres."
   },
   {
    id: "security",
    title: "5. Seguretat de la Vostra Informació",
    text: "Utilitzem mesures de seguretat administratives, tècniques i físiques per ajudar a protegir la vostra informació personal. Tot i que hem pres mesures raonables per protegir la informació personal que ens proporcioneu, tingueu en compte que, malgrat els nostres esforços, cap mesura de seguretat és perfecta o impenetrable, i cap mètode de transmissió de dades pot garantir-se contra qualsevol intercepció o altre tipus d'ús indegut."
   },
   {
    id: "ccpa",
    title: "6. Els Vostres Drets de Privacitat (RGPD)",
    text: "Si us trobeu a l'Espai Econòmic Europeu (EEE), teniu certs drets de protecció de dades. EKA Balance té com a objectiu prendre mesures raonables per permetre-us corregir, esmenar, eliminar o limitar l'ús de les vostres Dades Personals.\n\nSi voleu ser informat sobre quines Dades Personals tenim sobre vosaltres i si voleu que s'eliminin dels nostres sistemes, contacteu-nos.\n\nEn determinades circumstàncies, teniu els següents drets de protecció de dades:\n\n• **El dret a accedir, actualitzar o eliminar la informació que tenim sobre vosaltres.**\n• **El dret de rectificació.** Teniu dret a que es rectifiqui la vostra informació si aquesta informació és inexacta o incompleta.\n• **El dret a oposar-se.** Teniu dret a oposar-vos al nostre processament de les vostres Dades Personals.\n• **El dret de restricció.** Teniu dret a sol·licitar que restringim el processament de la vostra informació personal.\n• **El dret a la portabilitat de dades.** Teniu dret a rebre una còpia de la informació que tenim sobre vosaltres en un format estructurat, llegible per màquina i d'ús comú.\n• **El dret a retirar el consentiment.** També teniu dret a retirar el vostre consentiment en qualsevol moment en què EKA Balance hagi confiat en el vostre consentiment per processar la vostra informació personal."
   },
   {
    id: "children",
    title: "7. Privacitat dels Nens",
    text: "Els nostres serveis no estan destinats a nens menors de 13 anys. No recopilem a gratcient informació personal de nens menors de 13 anys. Si ens assabentem que hem recopilat o rebut informació personal d'un nen menor de 13 anys sense verificació del consentiment dels pares, eliminarem aquesta informació."
   },
   {
    id: "contact",
    title: "8. Contacteu-nos",
    text: "Si teniu preguntes o comentaris sobre aquesta política, podeu enviar-nos un correu electrònic a privacy@ekabalance.com o per correu postal a:\n\nEKA Balance\nCarrer de [Nom del Carrer], [Número]\n08001 Barcelona\nEspanya"
   }
  ]
 },
 ru: {
  title: "Политика конфиденциальности",
  updated: "Последнее обновление: 25 ноября 2025 г.",
  intro: "В EKA Balance мы серьезно относимся к вашей конфиденциальности. Эта Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию, когда вы посещаете наш веб-сайт и пользуетесь нашими услугами. Пожалуйста, внимательно прочитайте эту политику конфиденциальности. Если вы не согласны с условиями этой политики конфиденциальности, пожалуйста, не заходите на сайт.",
  sections: [
   {
    id: "collection",
    title: "1. Информация, которую мы собираем",
    text: "Мы собираем информацию, которая идентифицирует, относится, описывает, ссылается, может быть связана или может быть разумно связана, прямо или косвенно, с конкретным потребителем или устройством. Сюда входит:\n\n• **Личные идентификаторы:** Имя, адрес электронной почты, номер телефона, почтовый адрес, уникальный личный идентификатор, онлайн-идентификатор, IP-адрес.\n• **Характеристики защищенной классификации:** Возраст, пол, состояние здоровья (при добровольном предоставлении для целей терапии).\n• **Коммерческая информация:** Записи о продуктах или услугах, приобретенных, полученных или рассмотренных.\n• **Интернет/сетевая активность:** История просмотров, история поиска, информация о взаимодействии потребителя с веб-сайтом, приложением или рекламой.\n• **Сенсорные данные:** Аудио, электронная, визуальная или аналогичная информация (например, во время видеоконсультаций, если они записываются с согласия).\n• **Профессиональная/трудовая информация:** Текущая или прошлая история работы (для терапевтов)."
   },
   {
    id: "usage",
    title: "2. Как мы используем вашу информацию",
    text: "Мы используем собранную информацию для следующих целей:\n\n• **Для предоставления услуг:** Для облегчения создания учетной записи, управления вашими заказами, предоставления услуг и обработки платежей.\n• **Для улучшения нашей платформы:** Для понимания и анализа того, как вы используете наш веб-сайт и услуги, для улучшения функциональности и пользовательского опыта.\n• **Для связи:** Для отправки вам административной информации, такой как обновления наших условий и политик, а также для ответа на ваши запросы.\n• **Маркетинг:** Для отправки вам маркетинговых и рекламных сообщений (вы можете отказаться от них в любое время).\n• **Безопасность:** Для защиты нашего Сайта и вашей учетной записи от мошенничества и несанкционированного доступа.\n• **Соблюдение правовых норм:** Для соблюдения применимых законов, правил и юридических процессов."
   },
   {
    id: "sharing",
    title: "3. Обмен вашей информацией",
    text: "Мы можем передавать вашу информацию в следующих ситуациях:\n\n• **Поставщики услуг:** Мы можем передавать вашу информацию сторонним поставщикам, подрядчикам или агентам, которые предоставляют услуги нам или от нашего имени и требуют доступа к такой информации для выполнения этой работы (например, обработка платежей, анализ данных, доставка электронной почты, услуги хостинга).\n• **Передача бизнеса:** Мы можем передавать или переуступать вашу информацию в связи с или во время переговоров о любом слиянии, продаже активов компании, финансировании или приобретении всего или части нашего бизнеса другой компанией.\n• **Юридические требования:** Мы можем раскрывать вашу информацию, когда мы обязаны это делать по закону для соблюдения применимого законодательства, правительственных запросов, судебного разбирательства, постановления суда или судебного процесса."
   },
   {
    id: "retention",
    title: "4. Хранение данных",
    text: "Мы будем хранить вашу личную информацию только до тех пор, пока это необходимо для целей, изложенных в этой политике конфиденциальности, если только более длительный срок хранения не требуется или не разрешен законом (например, налоговые, бухгалтерские или другие юридические требования). Никакая цель в этой политике не потребует от нас хранения вашей личной информации дольше периода времени, в течение которого у пользователей есть учетная запись у нас."
   },
   {
    id: "security",
    title: "5. Безопасность вашей информации",
    text: "Мы используем административные, технические и физические меры безопасности для защиты вашей личной информации. Хотя мы предприняли разумные шаги для защиты личной информации, которую вы нам предоставляете, имейте в виду, что, несмотря на наши усилия, никакие меры безопасности не являются совершенными или непроницаемыми, и никакой метод передачи данных не может быть гарантирован от любого перехвата или другого типа неправомерного использования."
   },
   {
    id: "ccpa",
    title: "6. Ваши права на конфиденциальность (GDPR)",
    text: "В зависимости от вашего местоположения у вас могут быть следующие права в отношении ваших персональных данных:\n\n• **Право на доступ:** Вы имеете право запрашивать копии ваших персональных данных.\n• **Право на исправление:** Вы имеете право требовать, чтобы мы исправили любую информацию, которую вы считаете неточной.\n• **Право на удаление:** Вы имеете право требовать, чтобы мы удалили ваши персональные данные при определенных условиях.\n• **Право на ограничение обработки:** Вы имеете право требовать, чтобы мы ограничили обработку ваших персональных данных.\n• **Право на возражение против обработки:** Вы имеете право возражать против нашей обработки ваших персональных данных.\n• **Право на переносимость данных:** Вы имеете право требовать, чтобы мы передали данные, которые мы собрали, другой организации или непосредственно вам."
   },
   {
    id: "children",
    title: "7. Конфиденциальность детей",
    text: "Наши услуги не предназначены для детей младше 13 лет. Мы сознательно не собираем личную информацию от детей младше 13 лет. Если мы узнаем, что мы собрали или получили личную информацию от ребенка младше 13 лет без подтверждения согласия родителей, мы удалим эту информацию."
   },
   {
    id: "contact",
    title: "8. Свяжитесь с нами",
    text: "Если у вас есть вопросы или комментарии по поводу этой политики, вы можете написать нам по адресу privacy@ekabalance.com или по почте:\n\nEKA Balance\nCarrer de [Street Name], [Number]\n08001 Barcelona\nSpain"
   }
  ]
 }
};

export default function PrivacyPage() {
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
      <section key={index} id={section.id} className="mb-8 scroll-mt-24">
       <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
       <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {section.text}
       </div>
       {section.id === 'ccpa' && (
        <button
         onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
         className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors text-sm font-medium"
        >
         Manage Cookie Preferences
        </button>
       )}
      </section>
     ))}
    </div>
   </div>
  </div>
 );
}

