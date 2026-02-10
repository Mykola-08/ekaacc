'use client';

import React, { useState } from 'react';
import { Code, Key, Shield, Zap, FileText } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ApiTermsOfUse() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'API Terms of Use',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'These terms govern your access to and use of the EKA Balance Application Programming Interface (API). By accessing or using our API, you agree to comply with these terms.',
      sections: [
        {
          title: '1. Access and Authentication',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'You must obtain an API key to access our API. You are responsible for maintaining the confidentiality of your API key and for all activities that occur under your key. Do not share your API key with third parties.',
        },
        {
          title: '2. Usage Limits',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'We may impose limits on the number of API requests you can make within a certain time period (rate limits). You agree not to circumvent these limits. Excessive use may result in temporary or permanent suspension of your access.',
        },
        {
          title: '3. Acceptable Use',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'You agree to use the API only for lawful purposes and in accordance with our Acceptable Use Policy. You must not use the API to transmit malware, spam, or any content that infringes on the rights of others.',
        },
        {
          title: '4. Intellectual Property',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance owns all rights, title, and interest in and to the API and related documentation. We grant you a limited, non-exclusive, non-transferable license to use the API for the purpose of developing and testing your applications.',
        },
        {
          title: '5. Modifications and Termination',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'We reserve the right to modify or discontinue the API at any time, with or without notice. We may also terminate your access to the API if you violate these terms. We are not liable for any damages resulting from such modifications or termination.',
        },
      ],
    },
    es: {
      title: 'TÃ©rminos de Uso de la API',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Estos tÃ©rminos rigen su acceso y uso de la Interfaz de ProgramaciÃ³n de Aplicaciones (API) de EKA Balance. Al acceder o utilizar nuestra API, acepta cumplir con estos tÃ©rminos.',
      sections: [
        {
          title: '1. Acceso y AutenticaciÃ³n',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'Debe obtener una clave API para acceder a nuestra API. Usted es responsable de mantener la confidencialidad de su clave API y de todas las actividades que ocurran bajo su clave. No comparta su clave API con terceros.',
        },
        {
          title: '2. LÃ­mites de Uso',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'Podemos imponer lÃ­mites en la cantidad de solicitudes de API que puede realizar dentro de un cierto perÃ­odo de tiempo (lÃ­mites de velocidad). Acepta no eludir estos lÃ­mites. El uso excesivo puede resultar en la suspensiÃ³n temporal o permanente de su acceso.',
        },
        {
          title: '3. Uso Aceptable',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'Acepta utilizar la API solo para fines legales y de acuerdo con nuestra PolÃ­tica de Uso Aceptable. No debe utilizar la API para transmitir malware, spam o cualquier contenido que infrinja los derechos de otros.',
        },
        {
          title: '4. Propiedad Intelectual',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance posee todos los derechos, tÃ­tulos e intereses sobre la API y la documentaciÃ³n relacionada. Le otorgamos una licencia limitada, no exclusiva e intransferible para utilizar la API con el fin de desarrollar y probar sus aplicaciones.',
        },
        {
          title: '5. Modificaciones y TerminaciÃ³n',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Nos reservamos el derecho de modificar o descontinuar la API en cualquier momento, con o sin previo aviso. TambiÃ©n podemos rescindir su acceso a la API si viola estos tÃ©rminos. No somos responsables de ningÃºn daÃ±o resultante de dichas modificaciones o terminaciÃ³n.',
        },
      ],
    },
    ca: {
      title: "Termes d'Ãšs de l'API",
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquests termes regeixen el vostre accÃ©s i Ãºs de la InterfÃ­cie de ProgramaciÃ³ d'Aplicacions (API) d'EKA Balance. En accedir o utilitzar la nostra API, accepteu complir amb aquests termes.",
      sections: [
        {
          title: '1. AccÃ©s i AutenticaciÃ³',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: "Heu d'obtenir una clau API per accedir a la nostra API. Sou responsable de mantenir la confidencialitat de la vostra clau API i de totes les activitats que es produeixin sota la vostra clau. No compartiu la vostra clau API amb tercers.",
        },
        {
          title: "2. LÃ­mits d'Ãšs",
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: "Podem imposar lÃ­mits en el nombre de solÂ·licituds d'API que podeu fer dins d'un cert perÃ­ode de temps (lÃ­mits de velocitat). Accepteu no eludir aquests lÃ­mits. L'Ãºs excessiu pot resultar en la suspensiÃ³ temporal o permanent del vostre accÃ©s.",
        },
        {
          title: '3. Ãšs Acceptable',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: "Accepteu utilitzar l'API nomÃ©s per a fins legals i d'acord amb la nostra PolÃ­tica d'Ãšs Acceptable. No heu d'utilitzar l'API per transmetre programari maliciÃ³s, correu brossa o qualsevol contingut que infringeixi els drets d'altres.",
        },
        {
          title: '4. Propietat IntelÂ·lectual',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: "EKA Balance posseeix tots els drets, tÃ­tols i interessos sobre l'API i la documentaciÃ³ relacionada. Us atorguem una llicÃ¨ncia limitada, no exclusiva i intransferible per utilitzar l'API amb la finalitat de desenvolupar i provar les vostres aplicacions.",
        },
        {
          title: '5. Modificacions i TerminaciÃ³',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: "Ens reservem el dret de modificar o discontinuar l'API en qualsevol moment, amb o sense previ avÃ­s. TambÃ© podem rescindir el vostre accÃ©s a l'API si violeu aquests termes. No som responsables de cap dany resultant d'aquestes modificacions o terminaciÃ³.",
        },
      ],
    },
    ru: {
      title: 'Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ API',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‚ Ð²Ð°Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹ÑÑƒ Ð¿Ñ€Ð¸ÐºÐ»Ð°Ð´Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ (API) EKA Balance Ð¸ ÐµÐ³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ. ÐŸÐ¾Ð»ÑƒÑ‡Ð°Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð½Ð°ÑˆÐµÐ¼Ñƒ API Ð¸Ð»Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑ ÐµÐ³Ð¾, Ð²Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ ÑÑ‚Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ.',
      sections: [
        {
          title: '1. Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ð¸ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'Ð’Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ ÐºÐ»ÑŽÑ‡ API Ð´Ð»Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð° Ðº Ð½Ð°ÑˆÐµÐ¼Ñƒ API. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð²Ð°ÑˆÐµÐ³Ð¾ ÐºÐ»ÑŽÑ‡Ð° API Ð¸ Ð·Ð° Ð²ÑÐµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð´ÑÑ‚ Ð¿Ð¾Ð´ Ð²Ð°ÑˆÐ¸Ð¼ ÐºÐ»ÑŽÑ‡Ð¾Ð¼. ÐÐµ Ð¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°Ð¹Ñ‚Ðµ ÑÐ²Ð¾Ð¹ ÐºÐ»ÑŽÑ‡ API Ñ‚Ñ€ÐµÑ‚ÑŒÐ¸Ð¼ Ð»Ð¸Ñ†Ð°Ð¼.',
        },
        {
          title: '2. Ð›Ð¸Ð¼Ð¸Ñ‚Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'ÐœÑ‹ Ð¼Ð¾Ð¶ÐµÐ¼ Ð½Ð°ÐºÐ»Ð°Ð´Ñ‹Ð²Ð°Ñ‚ÑŒ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ Ð½Ð° ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð² API, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð²Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð° Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ (Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ ÑÐºÐ¾Ñ€Ð¾ÑÑ‚Ð¸). Ð’Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ð½Ðµ Ð¾Ð±Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ ÑÑ‚Ð¸ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ. Ð§Ñ€ÐµÐ·Ð¼ÐµÑ€Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ñ€Ð¸Ð²ÐµÑÑ‚Ð¸ Ðº Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð¹ Ð¸Ð»Ð¸ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾Ð¹ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐµ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°.',
        },
        {
          title: '3. Ð”Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ API Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² Ð·Ð°ÐºÐ¾Ð½Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÑÑ… Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð½Ð°ÑˆÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¾Ð¹ Ð´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ð¾Ð³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ. Ð’Ñ‹ Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ API Ð´Ð»Ñ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ð¸ Ð²Ñ€ÐµÐ´Ð¾Ð½Ð¾ÑÐ½Ñ‹Ñ… Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼, ÑÐ¿Ð°Ð¼Ð° Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð°, Ð½Ð°Ñ€ÑƒÑˆÐ°ÑŽÑ‰ÐµÐ³Ð¾ Ð¿Ñ€Ð°Ð²Ð° Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ†.',
        },
        {
          title: '4. Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance Ð²Ð»Ð°Ð´ÐµÐµÑ‚ Ð²ÑÐµÐ¼Ð¸ Ð¿Ñ€Ð°Ð²Ð°Ð¼Ð¸, Ñ‚Ð¸Ñ‚ÑƒÐ»Ð°Ð¼Ð¸ Ð¸ Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ°Ð¼Ð¸ Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ API Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ¹ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ð¸Ð¸. ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð²Ð°Ð¼ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½ÑƒÑŽ, Ð½ÐµÐ¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ, Ð½ÐµÐ¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°ÐµÐ¼ÑƒÑŽ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸ÑŽ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ API Ñ Ñ†ÐµÐ»ÑŒÑŽ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð¸ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð²Ð°ÑˆÐ¸Ñ… Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¹.',
        },
        {
          title: '5. Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ Ð¸ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'ÐœÑ‹ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰Ð°Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ API Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ, Ñ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸ÐµÐ¼ Ð¸Ð»Ð¸ Ð±ÐµÐ· Ð½ÐµÐ³Ð¾. ÐœÑ‹ Ñ‚Ð°ÐºÐ¶Ðµ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒ Ð²Ð°Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº API, ÐµÑÐ»Ð¸ Ð²Ñ‹ Ð½Ð°Ñ€ÑƒÑˆÐ¸Ñ‚Ðµ ÑÑ‚Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ. ÐœÑ‹ Ð½Ðµ Ð½ÐµÑÐµÐ¼ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð·Ð° Ð»ÑŽÐ±Ð¾Ð¹ ÑƒÑ‰ÐµÑ€Ð±, Ð²Ð¾Ð·Ð½Ð¸ÐºÑˆÐ¸Ð¹ Ð² Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ðµ Ñ‚Ð°ÐºÐ¸Ñ… Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¹ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰ÐµÐ½Ð¸Ñ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-xl shadow-sm" role="group">
          {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-4 py-2 text-sm font-medium first:rounded-l-lg last:rounded-r-lg ${
                language === lang
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card text-foreground/90 border-border hover:bg-muted/30'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <div className="bg-linear-to-r from-eka-dark to-eka-dark/90 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Code className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-semibold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              className="bg-muted/30 hover:bg-muted flex gap-4 rounded-lg p-6 transition-colors"
            >
              <div className="mt-1 shrink-0">{section.icon}</div>
              <div>
                <h2 className="text-foreground mb-2 text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 border-t border-border px-8 py-6">
          <p className="text-muted-foreground text-center text-sm">
            Â© {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
