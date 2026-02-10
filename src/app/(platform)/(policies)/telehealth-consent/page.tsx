'use client';

import React, { useState } from 'react';
import { Video, Wifi, UserCheck, AlertTriangle, FileSignature } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function TelehealthConsent() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Telehealth Consent',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This document outlines your consent to receive health care services via telehealth technologies. Telehealth involves the use of electronic communications to enable health care providers at different locations to share individual patient medical information for the purpose of improving patient care.',
      sections: [
        {
          title: '1. Nature of Telehealth',
          icon: <Video className="h-6 w-6 text-primary" />,
          text: 'Telehealth services may include health care delivery, diagnosis, consultation, treatment, transfer of medical data, and education using interactive audio, video, or data communications.',
        },
        {
          title: '2. Benefits and Risks',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'Benefits include improved access to care and convenience. Risks include potential technical failures, security breaches, or the need for in-person care if the provider determines telehealth is not appropriate.',
        },
        {
          title: '3. Technology Requirements',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'You are responsible for ensuring you have a private location, a secure internet connection, and the necessary device (computer, tablet, or smartphone) to participate in the telehealth session.',
        },
        {
          title: '4. Confidentiality',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'The laws that protect the privacy and confidentiality of medical information also apply to telehealth. No recording of the session is permitted without the written consent of both parties.',
        },
        {
          title: '5. Your Rights',
          icon: <FileSignature className="h-6 w-6 text-red-600" />,
          text: 'You have the right to withhold or withdraw your consent to the use of telehealth in the course of your care at any time, without affecting your right to future care or treatment.',
        },
      ],
    },
    es: {
      title: 'Consentimiento de Telesalud',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este documento describe su consentimiento para recibir servicios de atenciÃ³n mÃ©dica a travÃ©s de tecnologÃ­as de telesalud. La telesalud implica el uso de comunicaciones electrÃ³nicas para permitir que los proveedores de atenciÃ³n mÃ©dica en diferentes ubicaciones compartan informaciÃ³n mÃ©dica individual del paciente con el fin de mejorar la atenciÃ³n al paciente.',
      sections: [
        {
          title: '1. Naturaleza de la Telesalud',
          icon: <Video className="h-6 w-6 text-primary" />,
          text: 'Los servicios de telesalud pueden incluir la prestaciÃ³n de atenciÃ³n mÃ©dica, diagnÃ³stico, consulta, tratamiento, transferencia de datos mÃ©dicos y educaciÃ³n mediante comunicaciones interactivas de audio, video o datos.',
        },
        {
          title: '2. Beneficios y Riesgos',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'Los beneficios incluyen un mejor acceso a la atenciÃ³n y conveniencia. Los riesgos incluyen posibles fallas tÃ©cnicas, violaciones de seguridad o la necesidad de atenciÃ³n en persona si el proveedor determina que la telesalud no es adecuada.',
        },
        {
          title: '3. Requisitos TecnolÃ³gicos',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'Usted es responsable de asegurarse de tener una ubicaciÃ³n privada, una conexiÃ³n a Internet segura y el dispositivo necesario (computadora, tableta o telÃ©fono inteligente) para participar en la sesiÃ³n de telesalud.',
        },
        {
          title: '4. Confidencialidad',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'Las leyes que protegen la privacidad y confidencialidad de la informaciÃ³n mÃ©dica tambiÃ©n se aplican a la telesalud. No se permite la grabaciÃ³n de la sesiÃ³n sin el consentimiento por escrito de ambas partes.',
        },
        {
          title: '5. Sus Derechos',
          icon: <FileSignature className="h-6 w-6 text-red-600" />,
          text: 'Tiene derecho a negar o retirar su consentimiento para el uso de la telesalud en el curso de su atenciÃ³n en cualquier momento, sin afectar su derecho a atenciÃ³n o tratamiento futuros.',
        },
      ],
    },
    ca: {
      title: 'Consentiment de Telesalut',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquest document descriu el vostre consentiment per rebre serveis d'atenciÃ³ mÃ¨dica mitjanÃ§ant tecnologies de telesalut. La telesalut implica l'Ãºs de comunicacions electrÃ²niques per permetre que els proveÃ¯dors d'atenciÃ³ mÃ¨dica en diferents ubicacions comparteixin informaciÃ³ mÃ¨dica individual del pacient amb la finalitat de millorar l'atenciÃ³ al pacient.",
      sections: [
        {
          title: '1. Naturalesa de la Telesalut',
          icon: <Video className="h-6 w-6 text-primary" />,
          text: "Els serveis de telesalut poden incloure la prestaciÃ³ d'atenciÃ³ mÃ¨dica, diagnÃ²stic, consulta, tractament, transferÃ¨ncia de dades mÃ¨diques i educaciÃ³ mitjanÃ§ant comunicacions interactives d'Ã udio, vÃ­deo o dades.",
        },
        {
          title: '2. Beneficis i Riscos',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: "Els beneficis inclouen un millor accÃ©s a l'atenciÃ³ i conveniÃ¨ncia. Els riscos inclouen possibles fallades tÃ¨cniques, violacions de seguretat o la necessitat d'atenciÃ³ presencial si el proveÃ¯dor determina que la telesalut no Ã©s adequada.",
        },
        {
          title: '3. Requisits TecnolÃ²gics',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: "Sou responsable d'assegurar-vos de tenir una ubicaciÃ³ privada, una connexiÃ³ a Internet segura i el dispositiu necessari (ordinador, tauleta o telÃ¨fon intelÂ·ligent) per participar en la sessiÃ³ de telesalut.",
        },
        {
          title: '4. Confidencialitat',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: "Les lleis que protegeixen la privacitat i confidencialitat de la informaciÃ³ mÃ¨dica tambÃ© s'apliquen a la telesalut. No es permet l'enregistrament de la sessiÃ³ sense el consentiment per escrit d'ambdues parts.",
        },
        {
          title: '5. Els Vostres Drets',
          icon: <FileSignature className="h-6 w-6 text-red-600" />,
          text: "Teniu dret a negar o retirar el vostre consentiment per a l'Ãºs de la telesalut en el curs de la vostra atenciÃ³ en qualsevol moment, sense afectar el vostre dret a atenciÃ³ o tractament futurs.",
        },
      ],
    },
    ru: {
      title: 'Ð¡Ð¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð½Ð° Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñƒ',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ ÑÑ‚Ð¾Ð¼ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ðµ Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½Ð¾ Ð²Ð°ÑˆÐµ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð½Ð° Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ñ… ÑƒÑÐ»ÑƒÐ³ Ñ Ð¿Ð¾Ð¼Ð¾Ñ‰ÑŒÑŽ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹ Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñ‹. Ð¢ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ð° Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÑ‚ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ñ‹Ñ… ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¹, Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÑŽÑ‰Ð¸Ñ… Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ð½Ð¸ÐºÐ°Ð¼ Ð² Ñ€Ð°Ð·Ð½Ñ‹Ñ… Ð¼ÐµÑÑ‚Ð°Ñ… Ð¾Ð±Ð¼ÐµÐ½Ð¸Ð²Ð°Ñ‚ÑŒÑÑ Ð¸Ð½Ð´Ð¸Ð²Ð¸Ð´ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÐµÐ¹ Ð¾ Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ðµ Ñ Ñ†ÐµÐ»ÑŒÑŽ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ñ ÑƒÑ…Ð¾Ð´Ð° Ð·Ð° Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ð°Ð¼Ð¸.',
      sections: [
        {
          title: '1. ÐŸÑ€Ð¸Ñ€Ð¾Ð´Ð° Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñ‹',
          icon: <Video className="h-6 w-6 text-primary" />,
          text: 'Ð£ÑÐ»ÑƒÐ³Ð¸ Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñ‹ Ð¼Ð¾Ð³ÑƒÑ‚ Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ Ð¾ÐºÐ°Ð·Ð°Ð½Ð¸Ðµ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸, Ð´Ð¸Ð°Ð³Ð½Ð¾ÑÑ‚Ð¸ÐºÑƒ, ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸Ð¸, Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ, Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ñƒ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¸ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ Ð¸Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð°ÑƒÐ´Ð¸Ð¾-, Ð²Ð¸Ð´ÐµÐ¾- Ð¸Ð»Ð¸ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ñ… ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ð¹.',
        },
        {
          title: '2. ÐŸÑ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð° Ð¸ Ñ€Ð¸ÑÐºÐ¸',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'ÐŸÑ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð° Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð½Ñ‹Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸ Ð¸ ÑƒÐ´Ð¾Ð±ÑÑ‚Ð²Ð¾. Ð Ð¸ÑÐºÐ¸ Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ‹Ðµ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ ÑÐ±Ð¾Ð¸, Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸ Ð¸Ð»Ð¸ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚ÑŒ Ð¾Ñ‡Ð½Ð¾Ð³Ð¾ Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ, ÐµÑÐ»Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸Ðº Ñ€ÐµÑˆÐ¸Ñ‚, Ñ‡Ñ‚Ð¾ Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ð° Ð½Ðµ Ð¿Ð¾Ð´Ñ…Ð¾Ð´Ð¸Ñ‚.',
        },
        {
          title: '3. Ð¢ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ Ñƒ Ð²Ð°Ñ ÑƒÐµÐ´Ð¸Ð½ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð¼ÐµÑÑ‚Ð°, Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾Ð³Ð¾ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ Ðº Ð˜Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚Ñƒ Ð¸ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾Ð³Ð¾ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð° (ÐºÐ¾Ð¼Ð¿ÑŒÑŽÑ‚ÐµÑ€Ð°, Ð¿Ð»Ð°Ð½ÑˆÐµÑ‚Ð° Ð¸Ð»Ð¸ ÑÐ¼Ð°Ñ€Ñ‚Ñ„Ð¾Ð½Ð°) Ð´Ð»Ñ ÑƒÑ‡Ð°ÑÑ‚Ð¸Ñ Ð² ÑÐµÐ°Ð½ÑÐµ Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñ‹.',
        },
        {
          title: '4. ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <UserCheck className="h-6 w-6 text-purple-600" />,
          text: 'Ð—Ð°ÐºÐ¾Ð½Ñ‹, Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÑŽÑ‰Ð¸Ðµ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸, Ñ‚Ð°ÐºÐ¶Ðµ Ñ€Ð°ÑÐ¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÑÑŽÑ‚ÑÑ Ð½Ð° Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñƒ. Ð—Ð°Ð¿Ð¸ÑÑŒ ÑÐµÐ°Ð½ÑÐ° Ð±ÐµÐ· Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ Ð¾Ð±ÐµÐ¸Ñ… ÑÑ‚Ð¾Ñ€Ð¾Ð½ Ð·Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð°.',
        },
        {
          title: '5. Ð’Ð°ÑˆÐ¸ Ð¿Ñ€Ð°Ð²Ð°',
          icon: <FileSignature className="h-6 w-6 text-red-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¾Ñ‚Ð¾Ð·Ð²Ð°Ñ‚ÑŒ ÑÐ²Ð¾Ðµ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÐ»ÐµÐ¼ÐµÐ´Ð¸Ñ†Ð¸Ð½Ñ‹ Ð² Ñ…Ð¾Ð´Ðµ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ, Ð½Ðµ Ð·Ð°Ñ‚Ñ€Ð°Ð³Ð¸Ð²Ð°Ñ Ð²Ð°ÑˆÐµ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° Ð±ÑƒÐ´ÑƒÑ‰ÐµÐµ Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ ÑƒÑ…Ð¾Ð´.',
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
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Video className="h-12 w-12 opacity-90" />
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
