'use client';

import React, { useState } from 'react';
import { Globe, UserCheck, Database, Lock, FileText } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function GdprCompliance() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'GDPR Compliance Statement',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to complying with the General Data Protection Regulation (GDPR). This statement outlines our approach to data protection and the rights of individuals within the European Economic Area (EEA).',
      sections: [
        {
          id: 'principles',
          title: '1. Data Processing Principles',
          icon: <Globe className="h-6 w-6 text-primary" />,
          text: 'We process personal data lawfully, fairly, and in a transparent manner. Data is collected for specified, explicit, and legitimate purposes and not further processed in a manner that is incompatible with those purposes.',
        },
        {
          id: 'lawful-basis',
          title: '2. Lawful Basis for Processing',
          icon: <FileText className="h-6 w-6 text-green-600" />,
          text: 'We only process personal data when we have a lawful basis to do so. This includes processing necessary for the performance of a contract, compliance with a legal obligation, protection of vital interests, or based on your consent.',
        },
        {
          id: 'rights',
          title: '3. Data Subject Rights',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'Under GDPR, you have the right to access, rectify, erase, restrict processing, object to processing, and data portability. We have established procedures to respond to your requests regarding these rights.',
        },
        {
          id: 'security',
          title: '4. Data Security',
          icon: <Lock className="h-6 w-6 text-orange-600" />,
          text: 'We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk. This includes encryption, pseudonymization, and regular testing of our security controls.',
        },
        {
          id: 'transfers',
          title: '5. International Data Transfers',
          icon: <Database className="h-6 w-6 text-red-600" />,
          text: 'When we transfer personal data outside the EEA, we ensure that appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions by the European Commission.',
        },
      ],
    },
    es: {
      title: 'DeclaraciÃ³n de Cumplimiento del RGPD',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a cumplir con el Reglamento General de ProtecciÃ³n de Datos (RGPD). Esta declaraciÃ³n describe nuestro enfoque para la protecciÃ³n de datos y los derechos de las personas dentro del Espacio EconÃ³mico Europeo (EEE).',
      sections: [
        {
          title: '1. Principios de Procesamiento de Datos',
          icon: <Globe className="h-6 w-6 text-primary" />,
          text: 'Procesamos datos personales de manera lÃ­cita, leal y transparente. Los datos se recopilan con fines determinados, explÃ­citos y legÃ­timos y no se procesan posteriormente de manera incompatible con dichos fines.',
        },
        {
          title: '2. Base Legal para el Procesamiento',
          icon: <FileText className="h-6 w-6 text-green-600" />,
          text: 'Solo procesamos datos personales cuando tenemos una base legal para hacerlo. Esto incluye el procesamiento necesario para la ejecuciÃ³n de un contrato, el cumplimiento de una obligaciÃ³n legal, la protecciÃ³n de intereses vitales o en base a su consentimiento.',
        },
        {
          title: '3. Derechos del Interesado',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'SegÃºn el RGPD, tiene derecho a acceder, rectificar, suprimir, restringir el procesamiento, oponerse al procesamiento y a la portabilidad de los datos. Hemos establecido procedimientos para responder a sus solicitudes con respecto a estos derechos.',
        },
        {
          title: '4. Seguridad de Datos',
          icon: <Lock className="h-6 w-6 text-orange-600" />,
          text: 'Implementamos medidas tÃ©cnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo. Esto incluye cifrado, seudonimizaciÃ³n y pruebas periÃ³dicas de nuestros controles de seguridad.',
        },
        {
          title: '5. Transferencias Internacionales de Datos',
          icon: <Database className="h-6 w-6 text-red-600" />,
          text: 'Cuando transferimos datos personales fuera del EEE, nos aseguramos de que existan las salvaguardias adecuadas, como las ClÃ¡usulas Contractuales EstÃ¡ndar (SCC) o las decisiones de adecuaciÃ³n de la ComisiÃ³n Europea.',
        },
      ],
    },
    ca: {
      title: 'DeclaraciÃ³ de Compliment del RGPD',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "EKA Balance es compromet a complir amb el Reglament General de ProtecciÃ³ de Dades (RGPD). Aquesta declaraciÃ³ descriu el nostre enfocament per a la protecciÃ³ de dades i els drets de les persones dins de l'Espai EconÃ²mic Europeu (EEE).",
      sections: [
        {
          title: '1. Principis de Processament de Dades',
          icon: <Globe className="h-6 w-6 text-primary" />,
          text: 'Processem dades personals de manera lÃ­cita, lleial i transparent. Les dades es recopilen amb finalitats determinades, explÃ­cites i legÃ­times i no es processen posteriorment de manera incompatible amb aquestes finalitats.',
        },
        {
          title: '2. Base Legal per al Processament',
          icon: <FileText className="h-6 w-6 text-green-600" />,
          text: "NomÃ©s processem dades personals quan tenim una base legal per fer-ho. AixÃ² inclou el processament necessari per a l'execuciÃ³ d'un contracte, el compliment d'una obligaciÃ³ legal, la protecciÃ³ d'interessos vitals o en base al vostre consentiment.",
        },
        {
          title: "3. Drets de l'Interessat",
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'Segons el RGPD, teniu dret a accedir, rectificar, suprimir, restringir el processament, oposar-vos al processament i a la portabilitat de les dades. Hem establert procediments per respondre a les vostres solÂ·licituds pel que fa a aquests drets.',
        },
        {
          title: '4. Seguretat de Dades',
          icon: <Lock className="h-6 w-6 text-orange-600" />,
          text: 'Implementem mesures tÃ¨cniques i organitzatives apropiades per garantir un nivell de seguretat adequat al risc. AixÃ² inclou xifratge, pseudonimitzaciÃ³ i proves periÃ²diques dels nostres controls de seguretat.',
        },
        {
          title: '5. TransferÃ¨ncies Internacionals de Dades',
          icon: <Database className="h-6 w-6 text-red-600" />,
          text: "Quan transferim dades personals fora de l'EEE, ens assegurem que existeixin les salvaguardes adequades, com les ClÃ usules Contractuals EstÃ ndard (SCC) o les decisions d'adequaciÃ³ de la ComissiÃ³ Europea.",
        },
      ],
    },
    ru: {
      title: 'Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ GDPR',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance Ð¾Ð±ÑÐ·ÑƒÐµÑ‚ÑÑ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ ÐžÐ±Ñ‰Ð¸Ð¹ Ñ€ÐµÐ³Ð»Ð°Ð¼ÐµÐ½Ñ‚ Ð¿Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… (GDPR). Ð’ ÑÑ‚Ð¾Ð¼ Ð·Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ð¸ Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½ Ð½Ð°Ñˆ Ð¿Ð¾Ð´Ñ…Ð¾Ð´ Ðº Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ Ð¿Ñ€Ð°Ð²Ð°Ð¼ Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð»Ð¸Ñ† Ð² Ð•Ð²Ñ€Ð¾Ð¿ÐµÐ¹ÑÐºÐ¾Ð¹ ÑÐºÐ¾Ð½Ð¾Ð¼Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð·Ð¾Ð½Ðµ (Ð•Ð­Ð—).',
      sections: [
        {
          title: '1. ÐŸÑ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Globe className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÐ¼ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð·Ð°ÐºÐ¾Ð½Ð½Ð¾, ÑÐ¿Ñ€Ð°Ð²ÐµÐ´Ð»Ð¸Ð²Ð¾ Ð¸ Ð¿Ñ€Ð¾Ð·Ñ€Ð°Ñ‡Ð½Ð¾. Ð”Ð°Ð½Ð½Ñ‹Ðµ ÑÐ¾Ð±Ð¸Ñ€Ð°ÑŽÑ‚ÑÑ Ð´Ð»Ñ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ñ‹Ñ…, ÑÐ²Ð½Ñ‹Ñ… Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÐµÐ¹ Ð¸ Ð½Ðµ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÑŽÑ‚ÑÑ Ð² Ð´Ð°Ð»ÑŒÐ½ÐµÐ¹ÑˆÐµÐ¼ ÑÐ¿Ð¾ÑÐ¾Ð±Ð¾Ð¼, Ð½ÐµÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð¸Ð¼Ñ‹Ð¼ Ñ ÑÑ‚Ð¸Ð¼Ð¸ Ñ†ÐµÐ»ÑÐ¼Ð¸.',
        },
        {
          title: '2. Ð—Ð°ÐºÐ¾Ð½Ð½Ð¾Ðµ Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð´Ð»Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸',
          icon: <FileText className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÐ¼ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ñ€Ð¸ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð½Ñ‹Ñ… Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ð¹ Ð´Ð»Ñ ÑÑ‚Ð¾Ð³Ð¾. Ð¡ÑŽÐ´Ð° Ð²Ñ…Ð¾Ð´Ð¸Ñ‚ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ°, Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð°Ñ Ð´Ð»Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ ÐºÐ¾Ð½Ñ‚Ñ€Ð°ÐºÑ‚Ð°, ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ñ ÑŽÑ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð², Ð·Ð°Ñ‰Ð¸Ñ‚Ñ‹ Ð¶Ð¸Ð·Ð½ÐµÐ½Ð½Ð¾ Ð²Ð°Ð¶Ð½Ñ‹Ñ… Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ¾Ð² Ð¸Ð»Ð¸ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ð²Ð°ÑˆÐµÐ³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ.',
        },
        {
          title: '3. ÐŸÑ€Ð°Ð²Ð° ÑÑƒÐ±ÑŠÐµÐºÑ‚Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'Ð’ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ GDPR Ð²Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿, Ð¸ÑÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ, ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ðµ, Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ðµ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸, Ð²Ð¾Ð·Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ñ‚Ð¸Ð² Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð¸ Ð¿ÐµÑ€ÐµÐ½Ð¾ÑÐ¸Ð¼Ð¾ÑÑ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ñ…. ÐœÑ‹ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹ Ð´Ð»Ñ Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð½Ð° Ð²Ð°ÑˆÐ¸ Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹ Ð¾Ñ‚Ð½Ð¾ÑÐ¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ ÑÑ‚Ð¸Ñ… Ð¿Ñ€Ð°Ð².',
        },
        {
          title: '4. Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Lock className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð²Ð½ÐµÐ´Ñ€ÑÐµÐ¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð¼ÐµÑ€Ñ‹ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ ÑƒÑ€Ð¾Ð²Ð½Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸, ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ³Ð¾ Ñ€Ð¸ÑÐºÑƒ. Ð¡ÑŽÐ´Ð° Ð²Ñ…Ð¾Ð´Ð¸Ñ‚ ÑˆÐ¸Ñ„Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ, Ð¿ÑÐµÐ²Ð´Ð¾Ð½Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¸ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾Ðµ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð½Ð°ÑˆÐ¸Ñ… ÑÑ€ÐµÐ´ÑÑ‚Ð² ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '5. ÐœÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ð°Ñ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Database className="h-6 w-6 text-red-600" />,
          text: 'ÐŸÑ€Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ðµ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð·Ð° Ð¿Ñ€ÐµÐ´ÐµÐ»Ñ‹ Ð•Ð­Ð— Ð¼Ñ‹ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€ÑƒÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ñ… Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ð¹, Ñ‚Ð°ÐºÐ¸Ñ… ÐºÐ°Ðº Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ðµ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ€Ð½Ñ‹Ðµ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ (SCC) Ð¸Ð»Ð¸ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ Ð•Ð²Ñ€Ð¾Ð¿ÐµÐ¹ÑÐºÐ¾Ð¹ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ð¾Ð± Ð°Ð´ÐµÐºÐ²Ð°Ñ‚Ð½Ð¾ÑÑ‚Ð¸.',
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
        <div className="bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Globe className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-semibold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              id={(section as any).id}
              className="bg-muted/30 hover:bg-muted flex scroll-mt-24 gap-4 rounded-lg p-6 transition-colors"
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
