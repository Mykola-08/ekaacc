'use client';

import React, { useState } from 'react';
import { Clock, BarChart, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ServiceLevelAgreement() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Service Level Agreement (SLA)',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This Service Level Agreement (SLA) outlines the performance commitments and guarantees provided by EKA Balance to our enterprise customers.',
      sections: [
        {
          title: '1. Service Availability',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: 'We guarantee a Monthly Uptime Percentage of at least 99.9% for our core services. Availability is calculated by subtracting the percentage of minutes during the month in which the service was unavailable from 100%.',
        },
        {
          title: '2. Performance Metrics',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'We monitor key performance indicators such as response time, throughput, and error rates. We are committed to maintaining optimal performance levels to ensure a seamless user experience.',
        },
        {
          title: '3. Support Response Times',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'Our support team is available 24/7 for critical issues. We commit to the following initial response times: Critical (1 hour), High (4 hours), Medium (8 hours), and Low (24 hours).',
        },
        {
          title: '4. Scheduled Maintenance',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: "We perform regular maintenance to ensure the stability and security of our platform. We will provide at least 48 hours' notice for scheduled maintenance that may impact service availability.",
        },
        {
          title: '5. Service Credits',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'If we fail to meet the guaranteed Monthly Uptime Percentage, customers may be eligible for service credits. Credits are calculated as a percentage of the monthly subscription fee and are applied to future invoices.',
        },
      ],
    },
    es: {
      title: 'Acuerdo de Nivel de Servicio (SLA)',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este Acuerdo de Nivel de Servicio (SLA) describe los compromisos de rendimiento y las garantÃ­as proporcionadas por EKA Balance a nuestros clientes empresariales.',
      sections: [
        {
          title: '1. Disponibilidad del Servicio',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: 'Garantizamos un Porcentaje de Tiempo de Actividad Mensual de al menos el 99.9% para nuestros servicios principales. La disponibilidad se calcula restando el porcentaje de minutos durante el mes en que el servicio no estuvo disponible del 100%.',
        },
        {
          title: '2. MÃ©tricas de Rendimiento',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'Monitoreamos indicadores clave de rendimiento como el tiempo de respuesta, el rendimiento y las tasas de error. Nos comprometemos a mantener niveles de rendimiento Ã³ptimos para garantizar una experiencia de usuario perfecta.',
        },
        {
          title: '3. Tiempos de Respuesta de Soporte',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'Nuestro equipo de soporte estÃ¡ disponible las 24 horas, los 7 dÃ­as de la semana para problemas crÃ­ticos. Nos comprometemos a los siguientes tiempos de respuesta inicial: CrÃ­tico (1 hora), Alto (4 horas), Medio (8 horas) y Bajo (24 horas).',
        },
        {
          title: '4. Mantenimiento Programado',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'Realizamos un mantenimiento regular para garantizar la estabilidad y seguridad de nuestra plataforma. Avisaremos con al menos 48 horas de antelaciÃ³n sobre el mantenimiento programado que pueda afectar la disponibilidad del servicio.',
        },
        {
          title: '5. CrÃ©ditos de Servicio',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'Si no cumplimos con el Porcentaje de Tiempo de Actividad Mensual garantizado, los clientes pueden ser elegibles para crÃ©ditos de servicio. Los crÃ©ditos se calculan como un porcentaje de la tarifa de suscripciÃ³n mensual y se aplican a facturas futuras.',
        },
      ],
    },
    ca: {
      title: 'Acord de Nivell de Servei (SLA)',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'Aquest Acord de Nivell de Servei (SLA) descriu els compromisos de rendiment i les garanties proporcionades per EKA Balance als nostres clients empresarials.',
      sections: [
        {
          title: '1. Disponibilitat del Servei',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: "Garantim un Percentatge de Temps d'Activitat Mensual d'almenys el 99.9% per als nostres serveis principals. La disponibilitat es calcula restant el percentatge de minuts durant el mes en quÃ¨ el servei no va estar disponible del 100%.",
        },
        {
          title: '2. MÃ¨triques de Rendiment',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: "Monitoritzem indicadors clau de rendiment com el temps de resposta, el rendiment i les taxes d'error. Ens comprometem a mantenir nivells de rendiment Ã²ptims per garantir una experiÃ¨ncia d'usuari perfecta.",
        },
        {
          title: '3. Temps de Resposta de Suport',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'El nostre equip de suport estÃ  disponible les 24 hores, els 7 dies de la setmana per a problemes crÃ­tics. Ens comprometem als segÃ¼ents temps de resposta inicial: CrÃ­tic (1 hora), Alt (4 hores), MitjÃ  (8 hores) i Baix (24 hores).',
        },
        {
          title: '4. Manteniment Programat',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: "Realitzem un manteniment regular per garantir l'estabilitat i seguretat de la nostra plataforma. Avisarem amb almenys 48 hores d'antelaciÃ³ sobre el manteniment programat que pugui afectar la disponibilitat del servei.",
        },
        {
          title: '5. CrÃ¨dits de Servei',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: "Si no complim amb el Percentatge de Temps d'Activitat Mensual garantit, els clients poden ser elegibles per a crÃ¨dits de servei. Els crÃ¨dits es calculen com un percentatge de la tarifa de subscripciÃ³ mensual i s'apliquen a factures futures.",
        },
      ],
    },
    ru: {
      title: 'Ð¡Ð¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ðµ Ð¾Ð± ÑƒÑ€Ð¾Ð²Ð½Ðµ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ (SLA)',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ ÑÑ‚Ð¾Ð¼ Ð¡Ð¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ð¸ Ð¾Ð± ÑƒÑ€Ð¾Ð²Ð½Ðµ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ (SLA) Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½Ñ‹ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° Ð¿Ð¾ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ð¸, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼Ñ‹Ðµ EKA Balance Ð½Ð°ÑˆÐ¸Ð¼ ÐºÐ¾Ñ€Ð¿Ð¾Ñ€Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ð¼ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°Ð¼.',
      sections: [
        {
          title: '1. Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ ÑÐµÑ€Ð²Ð¸ÑÐ°',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€ÑƒÐµÐ¼ ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚ Ð±ÐµÐ·Ð¾Ñ‚ÐºÐ°Ð·Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð½Ðµ Ð¼ÐµÐ½ÐµÐµ 99,9% Ð´Ð»Ñ Ð½Ð°ÑˆÐ¸Ñ… Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ñ… ÑÐµÑ€Ð²Ð¸ÑÐ¾Ð². Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°ÐµÑ‚ÑÑ Ð¿ÑƒÑ‚ÐµÐ¼ Ð²Ñ‹Ñ‡Ð¸Ñ‚Ð°Ð½Ð¸Ñ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚Ð° Ð¼Ð¸Ð½ÑƒÑ‚ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¼ÐµÑÑÑ†Ð°, ÐºÐ¾Ð³Ð´Ð° ÑÐµÑ€Ð²Ð¸Ñ Ð±Ñ‹Ð» Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½, Ð¸Ð· 100%.',
        },
        {
          title: '2. ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÐµÐ¼ ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸, Ñ‚Ð°ÐºÐ¸Ðµ ÐºÐ°Ðº Ð²Ñ€ÐµÐ¼Ñ Ð¾Ñ‚ÐºÐ»Ð¸ÐºÐ°, Ð¿Ñ€Ð¾Ð¿ÑƒÑÐºÐ½Ð°Ñ ÑÐ¿Ð¾ÑÐ¾Ð±Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ð° Ð¾ÑˆÐ¸Ð±Ð¾Ðº. ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð¾Ð¿Ñ‚Ð¸Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ð¹ ÑƒÑ€Ð¾Ð²ÐµÐ½ÑŒ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð±ÐµÑÐ¿ÐµÑ€ÐµÐ±Ð¾Ð¹Ð½ÑƒÑŽ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹.',
        },
        {
          title: '3. Ð’Ñ€ÐµÐ¼Ñ Ð¾Ñ‚ÐºÐ»Ð¸ÐºÐ° ÑÐ»ÑƒÐ¶Ð±Ñ‹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'ÐÐ°ÑˆÐ° ÑÐ»ÑƒÐ¶Ð±Ð° Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð° 24/7 Ð´Ð»Ñ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼. ÐœÑ‹ Ð¾Ð±ÑÐ·ÑƒÐµÐ¼ÑÑ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐµ Ð½Ð°Ñ‡Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ñ‚ÐºÐ»Ð¸ÐºÐ°: ÐšÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ (1 Ñ‡Ð°Ñ), Ð’Ñ‹ÑÐ¾ÐºÐ¸Ð¹ (4 Ñ‡Ð°ÑÐ°), Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ (8 Ñ‡Ð°ÑÐ¾Ð²) Ð¸ ÐÐ¸Ð·ÐºÐ¸Ð¹ (24 Ñ‡Ð°ÑÐ°).',
        },
        {
          title: '4. ÐŸÐ»Ð°Ð½Ð¾Ð²Ð¾Ðµ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾Ðµ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸ Ð½Ð°ÑˆÐµÐ¹ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹. ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÑÑ‚ÑŒ Ð½Ðµ Ð¼ÐµÐ½ÐµÐµ Ñ‡ÐµÐ¼ Ð·Ð° 48 Ñ‡Ð°ÑÐ¾Ð² Ð¾ Ð¿Ð»Ð°Ð½Ð¾Ð²Ð¾Ð¼ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¾Ð¼ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ð¸, ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ð¾Ð²Ð»Ð¸ÑÑ‚ÑŒ Ð½Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ ÑÐµÑ€Ð²Ð¸ÑÐ°.',
        },
        {
          title: '5. Ð¡ÐµÑ€Ð²Ð¸ÑÐ½Ñ‹Ðµ ÐºÑ€ÐµÐ´Ð¸Ñ‚Ñ‹',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'Ð•ÑÐ»Ð¸ Ð¼Ñ‹ Ð½Ðµ Ð²Ñ‹Ð¿Ð¾Ð»Ð½Ð¸Ð¼ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚ Ð±ÐµÐ·Ð¾Ñ‚ÐºÐ°Ð·Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹, ÐºÐ»Ð¸ÐµÐ½Ñ‚Ñ‹ Ð¼Ð¾Ð³ÑƒÑ‚ Ð¸Ð¼ÐµÑ‚ÑŒ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÐ½Ñ‹Ñ… ÐºÑ€ÐµÐ´Ð¸Ñ‚Ð¾Ð². ÐšÑ€ÐµÐ´Ð¸Ñ‚Ñ‹ Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ ÐºÐ°Ðº Ð¿Ñ€Ð¾Ñ†ÐµÐ½Ñ‚ Ð¾Ñ‚ ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ð¾Ð¹ Ð°Ð±Ð¾Ð½ÐµÐ½Ñ‚ÑÐºÐ¾Ð¹ Ð¿Ð»Ð°Ñ‚Ñ‹ Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÑŽÑ‚ÑÑ Ðº Ð±ÑƒÐ´ÑƒÑ‰Ð¸Ð¼ ÑÑ‡ÐµÑ‚Ð°Ð¼.',
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
        <div className="bg-linear-to-r from-blue-700 to-indigo-800 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Clock className="h-12 w-12 opacity-90" />
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
