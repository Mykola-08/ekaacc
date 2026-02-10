'use client';

import React, { useState } from 'react';
import { Activity, CloudRain, RefreshCw, Phone, Users } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function BusinessContinuityPlan() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Business Continuity Plan',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This plan outlines the strategies and procedures EKA Balance employs to ensure the continuity of critical business functions in the event of a disruption or disaster.',
      sections: [
        {
          title: '1. Purpose and Scope',
          icon: <Activity className="h-6 w-6 text-primary" />,
          text: 'The purpose of this plan is to minimize the impact of disruptions on our operations, customers, and stakeholders. It covers all critical business functions, including IT systems, customer support, and service delivery.',
        },
        {
          title: '2. Risk Assessment',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'We regularly assess potential risks to our business, such as natural disasters, cyberattacks, power outages, and pandemics. We identify critical assets and processes and evaluate the potential impact of their loss.',
        },
        {
          title: '3. Recovery Strategies',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'We have developed recovery strategies for various scenarios. These include data backups, redundant systems, alternative work locations, and remote work capabilities. Our goal is to restore critical functions within defined recovery time objectives (RTOs).',
        },
        {
          title: '4. Communication Plan',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'Effective communication is vital during a crisis. We have established communication protocols to keep employees, customers, and partners informed. This includes emergency contact lists, notification systems, and designated spokespersons.',
        },
        {
          title: '5. Training and Testing',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'We provide regular training to employees on their roles and responsibilities during a disruption. We also conduct periodic tests and exercises to validate the effectiveness of our business continuity plan and identify areas for improvement.',
        },
      ],
    },
    es: {
      title: 'Plan de Continuidad del Negocio',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este plan describe las estrategias y procedimientos que emplea EKA Balance para garantizar la continuidad de las funciones comerciales crÃ­ticas en caso de interrupciÃ³n o desastre.',
      sections: [
        {
          title: '1. PropÃ³sito y Alcance',
          icon: <Activity className="h-6 w-6 text-primary" />,
          text: 'El propÃ³sito de este plan es minimizar el impacto de las interrupciones en nuestras operaciones, clientes y partes interesadas. Cubre todas las funciones comerciales crÃ­ticas, incluidos los sistemas de TI, la atenciÃ³n al cliente y la prestaciÃ³n de servicios.',
        },
        {
          title: '2. EvaluaciÃ³n de Riesgos',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'Evaluamos periÃ³dicamente los riesgos potenciales para nuestro negocio, como desastres naturales, ciberataques, cortes de energÃ­a y pandemias. Identificamos activos y procesos crÃ­ticos y evaluamos el impacto potencial de su pÃ©rdida.',
        },
        {
          title: '3. Estrategias de RecuperaciÃ³n',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'Hemos desarrollado estrategias de recuperaciÃ³n para varios escenarios. Estos incluyen copias de seguridad de datos, sistemas redundantes, lugares de trabajo alternativos y capacidades de trabajo remoto. Nuestro objetivo es restaurar las funciones crÃ­ticas dentro de los objetivos de tiempo de recuperaciÃ³n (RTO) definidos.',
        },
        {
          title: '4. Plan de ComunicaciÃ³n',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'La comunicaciÃ³n efectiva es vital durante una crisis. Hemos establecido protocolos de comunicaciÃ³n para mantener informados a los empleados, clientes y socios. Esto incluye listas de contactos de emergencia, sistemas de notificaciÃ³n y portavoces designados.',
        },
        {
          title: '5. CapacitaciÃ³n y Pruebas',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'Brindamos capacitaciÃ³n periÃ³dica a los empleados sobre sus roles y responsabilidades durante una interrupciÃ³n. TambiÃ©n realizamos pruebas y ejercicios periÃ³dicos para validar la efectividad de nuestro plan de continuidad del negocio e identificar Ã¡reas de mejora.',
        },
      ],
    },
    ca: {
      title: 'Pla de ContinuÃ¯tat de Negoci',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquest pla descriu les estratÃ¨gies i procediments que utilitza EKA Balance per garantir la continuÃ¯tat de les funcions empresarials crÃ­tiques en cas d'interrupciÃ³ o desastre.",
      sections: [
        {
          title: '1. PropÃ²sit i Abast',
          icon: <Activity className="h-6 w-6 text-primary" />,
          text: "El propÃ²sit d'aquest pla Ã©s minimitzar l'impacte de les interrupcions en les nostres operacions, clients i parts interessades. Cobreix totes les funcions empresarials crÃ­tiques, inclosos els sistemes informÃ tics, l'atenciÃ³ al client i la prestaciÃ³ de serveis.",
        },
        {
          title: '2. AvaluaciÃ³ de Riscos',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: "Avaluem periÃ²dicament els riscos potencials per al nostre negoci, com ara desastres naturals, ciberatacs, talls d'energia i pandÃ¨mies. Identifiquem actius i processos crÃ­tics i avaluem l'impacte potencial de la seva pÃ¨rdua.",
        },
        {
          title: '3. EstratÃ¨gies de RecuperaciÃ³',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'Hem desenvolupat estratÃ¨gies de recuperaciÃ³ per a diversos escenaris. Aquests inclouen cÃ²pies de seguretat de dades, sistemes redundants, llocs de treball alternatius i capacitats de treball remot. El nostre objectiu Ã©s restaurar les funcions crÃ­tiques dins dels objectius de temps de recuperaciÃ³ (RTO) definits.',
        },
        {
          title: '4. Pla de ComunicaciÃ³',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: "La comunicaciÃ³ efectiva Ã©s vital durant una crisi. Hem establert protocols de comunicaciÃ³ per mantenir informats els empleats, clients i socis. AixÃ² inclou llistes de contactes d'emergÃ¨ncia, sistemes de notificaciÃ³ i portaveus designats.",
        },
        {
          title: '5. FormaciÃ³ i Proves',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: "Oferim formaciÃ³ periÃ²dica als empleats sobre els seus rols i responsabilitats durant una interrupciÃ³. TambÃ© realitzem proves i exercicis periÃ²dics per validar l'eficÃ cia del nostre pla de continuÃ¯tat de negoci i identificar Ã rees de millora.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ»Ð°Ð½ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÐ¿Ñ€ÐµÑ€Ñ‹Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð±Ð¸Ð·Ð½ÐµÑÐ°',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ ÑÑ‚Ð¾Ð¼ Ð¿Ð»Ð°Ð½Ðµ Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½Ñ‹ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ EKA Balance Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÐ¿Ñ€ÐµÑ€Ñ‹Ð²Ð½Ð¾ÑÑ‚Ð¸ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸ Ð²Ð°Ð¶Ð½Ñ‹Ñ… Ð±Ð¸Ð·Ð½ÐµÑ-Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¹ Ð² ÑÐ»ÑƒÑ‡Ð°Ðµ ÑÐ±Ð¾Ñ Ð¸Ð»Ð¸ ÐºÐ°Ñ‚Ð°ÑÑ‚Ñ€Ð¾Ñ„Ñ‹.',
      sections: [
        {
          title: '1. Ð¦ÐµÐ»ÑŒ Ð¸ ÑÑ„ÐµÑ€Ð° Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ',
          icon: <Activity className="h-6 w-6 text-primary" />,
          text: 'Ð¦ÐµÐ»ÑŒÑŽ ÑÑ‚Ð¾Ð³Ð¾ Ð¿Ð»Ð°Ð½Ð° ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð¼Ð¸Ð½Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ ÑÐ±Ð¾ÐµÐ² Ð½Ð° Ð½Ð°ÑˆÑƒ Ð´ÐµÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ, ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð¸ Ð·Ð°Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ¾Ð²Ð°Ð½Ð½Ñ‹Ðµ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹. ÐžÐ½ Ð¾Ñ…Ð²Ð°Ñ‚Ñ‹Ð²Ð°ÐµÑ‚ Ð²ÑÐµ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸ Ð²Ð°Ð¶Ð½Ñ‹Ðµ Ð±Ð¸Ð·Ð½ÐµÑ-Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð˜Ð¢-ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹, Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÑƒ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑƒÑÐ»ÑƒÐ³.',
        },
        {
          title: '2. ÐžÑ†ÐµÐ½ÐºÐ° Ñ€Ð¸ÑÐºÐ¾Ð²',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'ÐœÑ‹ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾ Ð¾Ñ†ÐµÐ½Ð¸Ð²Ð°ÐµÐ¼ Ð¿Ð¾Ñ‚ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ñ€Ð¸ÑÐºÐ¸ Ð´Ð»Ñ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð±Ð¸Ð·Ð½ÐµÑÐ°, Ñ‚Ð°ÐºÐ¸Ðµ ÐºÐ°Ðº ÑÑ‚Ð¸Ñ…Ð¸Ð¹Ð½Ñ‹Ðµ Ð±ÐµÐ´ÑÑ‚Ð²Ð¸Ñ, ÐºÐ¸Ð±ÐµÑ€Ð°Ñ‚Ð°ÐºÐ¸, Ð¿ÐµÑ€ÐµÐ±Ð¾Ð¸ Ð² Ð¿Ð¾Ð´Ð°Ñ‡Ðµ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾ÑÐ½ÐµÑ€Ð³Ð¸Ð¸ Ð¸ Ð¿Ð°Ð½Ð´ÐµÐ¼Ð¸Ð¸. ÐœÑ‹ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÐ¼ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸ Ð²Ð°Ð¶Ð½Ñ‹Ðµ Ð°ÐºÑ‚Ð¸Ð²Ñ‹ Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÑÑÑ‹ Ð¸ Ð¾Ñ†ÐµÐ½Ð¸Ð²Ð°ÐµÐ¼ Ð¿Ð¾Ñ‚ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ð»Ð¸ÑÐ½Ð¸Ðµ Ð¸Ñ… Ð¿Ð¾Ñ‚ÐµÑ€Ð¸.',
        },
        {
          title: '3. Ð¡Ñ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð»Ð¸ ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ñ€Ð°Ð·Ð»Ð¸Ñ‡Ð½Ñ‹Ñ… ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ². Ðš Ð½Ð¸Ð¼ Ð¾Ñ‚Ð½Ð¾ÑÑÑ‚ÑÑ Ñ€ÐµÐ·ÐµÑ€Ð²Ð½Ð¾Ðµ ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ…, Ñ€ÐµÐ·ÐµÑ€Ð²Ð½Ñ‹Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹, Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ðµ Ð¼ÐµÑÑ‚Ð° Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ ÑƒÐ´Ð°Ð»ÐµÐ½Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹. ÐÐ°ÑˆÐ° Ñ†ÐµÐ»ÑŒ â€” Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸ Ð²Ð°Ð¶Ð½Ñ‹Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð² Ñ€Ð°Ð¼ÐºÐ°Ñ… Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÐµÐ²Ñ‹Ñ… Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ (RTO).',
        },
        {
          title: '4. ÐŸÐ»Ð°Ð½ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¸',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'Ð­Ñ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð°Ñ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ñ Ð¶Ð¸Ð·Ð½ÐµÐ½Ð½Ð¾ Ð²Ð°Ð¶Ð½Ð° Ð²Ð¾ Ð²Ñ€ÐµÐ¼Ñ ÐºÑ€Ð¸Ð·Ð¸ÑÐ°. ÐœÑ‹ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ñ‚Ð¾ÐºÐ¾Ð»Ñ‹ ÑÐ²ÑÐ·Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð², ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð¸ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð¾Ð². Ð¡ÑŽÐ´Ð° Ð²Ñ…Ð¾Ð´ÑÑ‚ ÑÐ¿Ð¸ÑÐºÐ¸ ÐºÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð¾Ð² Ð´Ð»Ñ ÑÐºÑÑ‚Ñ€ÐµÐ½Ð½Ñ‹Ñ… ÑÐ»ÑƒÑ‡Ð°ÐµÐ², ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ Ð¾Ð¿Ð¾Ð²ÐµÑ‰ÐµÐ½Ð¸Ñ Ð¸ Ð½Ð°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð½Ñ‹Ðµ Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð¸Ñ‚ÐµÐ»Ð¸.',
        },
        {
          title: '5. ÐžÐ±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾Ðµ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð² Ð¸Ñ… Ñ€Ð¾Ð»ÑÐ¼ Ð¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚ÑÐ¼ Ð²Ð¾ Ð²Ñ€ÐµÐ¼Ñ ÑÐ±Ð¾ÐµÐ². ÐœÑ‹ Ñ‚Ð°ÐºÐ¶Ðµ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ‚ÐµÑÑ‚Ñ‹ Ð¸ ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð¿Ð»Ð°Ð½Ð° Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÐ¿Ñ€ÐµÑ€Ñ‹Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð±Ð¸Ð·Ð½ÐµÑÐ° Ð¸ Ð²Ñ‹ÑÐ²Ð»ÐµÐ½Ð¸Ñ Ð¾Ð±Ð»Ð°ÑÑ‚ÐµÐ¹ Ð´Ð»Ñ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ñ.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-[12px] shadow-sm" role="group">
          {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-4 py-2 text-sm font-medium first:rounded-l-[12px] last:rounded-r-[12px] ${
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
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Activity className="h-12 w-12 opacity-90" />
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
