'use client';

import React, { useState } from 'react';
import { Scale, Heart, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function PatientRights() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Patient Rights & Responsibilities',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'At EKA Balance, we believe that a successful therapeutic relationship is built on mutual respect and understanding. This document outlines your rights as a patient and your responsibilities to ensure the best possible care.',
      sections: [
        {
          title: '1. Right to Respectful Care',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'You have the right to receive care that is respectful, non-discriminatory, and considerate of your personal values and beliefs. We are committed to providing a safe and inclusive environment for all patients.',
        },
        {
          title: '2. Right to Information',
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          text: 'You have the right to be fully informed about your diagnosis, treatment options, and expected outcomes in a language you understand. You have the right to ask questions and participate in decisions about your care.',
        },
        {
          title: '3. Right to Privacy and Confidentiality',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'You have the right to privacy regarding your medical care and confidentiality of your medical records. Your information will only be shared in accordance with our Privacy Policy and applicable laws.',
        },
        {
          title: '4. Responsibility to Provide Information',
          icon: <Scale className="h-6 w-6 text-purple-600" />,
          text: 'You are responsible for providing accurate and complete information about your health history, current medications, and any other matters relevant to your care. This helps us provide the most effective treatment.',
        },
        {
          title: '5. Responsibility for Appointments',
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          text: 'You are responsible for keeping appointments and notifying us in advance if you cannot attend. Late cancellations or missed appointments may be subject to fees as outlined in our cancellation policy.',
        },
      ],
    },
    es: {
      title: 'Derechos y Responsabilidades del Paciente',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'En EKA Balance, creemos que una relaciÃ³n terapÃ©utica exitosa se basa en el respeto y la comprensiÃ³n mutuos. Este documento describe sus derechos como paciente y sus responsabilidades para garantizar la mejor atenciÃ³n posible.',
      sections: [
        {
          title: '1. Derecho a una AtenciÃ³n Respetuosa',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'Tiene derecho a recibir una atenciÃ³n respetuosa, no discriminatoria y considerada con sus valores y creencias personales. Nos comprometemos a proporcionar un entorno seguro e inclusivo para todos los pacientes.',
        },
        {
          title: '2. Derecho a la InformaciÃ³n',
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          text: 'Tiene derecho a estar plenamente informado sobre su diagnÃ³stico, opciones de tratamiento y resultados esperados en un idioma que comprenda. Tiene derecho a hacer preguntas y participar en las decisiones sobre su atenciÃ³n.',
        },
        {
          title: '3. Derecho a la Privacidad y Confidencialidad',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Tiene derecho a la privacidad con respecto a su atenciÃ³n mÃ©dica y a la confidencialidad de sus registros mÃ©dicos. Su informaciÃ³n solo se compartirÃ¡ de acuerdo con nuestra PolÃ­tica de Privacidad y las leyes aplicables.',
        },
        {
          title: '4. Responsabilidad de Proporcionar InformaciÃ³n',
          icon: <Scale className="h-6 w-6 text-purple-600" />,
          text: 'Usted es responsable de proporcionar informaciÃ³n precisa y completa sobre su historial de salud, medicamentos actuales y cualquier otro asunto relevante para su atenciÃ³n. Esto nos ayuda a proporcionar el tratamiento mÃ¡s eficaz.',
        },
        {
          title: '5. Responsabilidad de las Citas',
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          text: 'Usted es responsable de asistir a las citas y notificarnos con anticipaciÃ³n si no puede asistir. Las cancelaciones tardÃ­as o las citas perdidas pueden estar sujetas a tarifas como se describe en nuestra polÃ­tica de cancelaciÃ³n.',
        },
      ],
    },
    ca: {
      title: 'Drets i Responsabilitats del Pacient',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'A EKA Balance, creiem que una relaciÃ³ terapÃ¨utica exitosa es basa en el respecte i la comprensiÃ³ mutus. Aquest document descriu els vostres drets com a pacient i les vostres responsabilitats per garantir la millor atenciÃ³ possible.',
      sections: [
        {
          title: '1. Dret a una AtenciÃ³ Respectuosa',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'Teniu dret a rebre una atenciÃ³ respectuosa, no discriminatÃ²ria i considerada amb els vostres valors i creences personals. Ens comprometem a proporcionar un entorn segur i inclusiu per a tots els pacients.',
        },
        {
          title: '2. Dret a la InformaciÃ³',
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          text: 'Teniu dret a estar plenament informat sobre el vostre diagnÃ²stic, opcions de tractament i resultats esperats en un idioma que comprengueu. Teniu dret a fer preguntes i participar en les decisions sobre la vostra atenciÃ³.',
        },
        {
          title: '3. Dret a la Privacitat i Confidencialitat',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: "Teniu dret a la privacitat pel que fa a la vostra atenciÃ³ mÃ¨dica i a la confidencialitat dels vostres registres mÃ¨dics. La vostra informaciÃ³ nomÃ©s es compartirÃ  d'acord amb la nostra PolÃ­tica de Privacitat i les lleis aplicables.",
        },
        {
          title: '4. Responsabilitat de Proporcionar InformaciÃ³',
          icon: <Scale className="h-6 w-6 text-purple-600" />,
          text: 'Sou responsable de proporcionar informaciÃ³ precisa i completa sobre el vostre historial de salut, medicaments actuals i qualsevol altre assumpte rellevant per a la vostra atenciÃ³. AixÃ² ens ajuda a proporcionar el tractament mÃ©s eficaÃ§.',
        },
        {
          title: '5. Responsabilitat de les Cites',
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          text: "Sou responsable d'assistir a les cites i notificar-nos amb antelaciÃ³ si no podeu assistir. Les cancelÂ·lacions tardanes o les cites perdudes poden estar subjectes a tarifes com es descriu a la nostra polÃ­tica de cancelÂ·laciÃ³.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÑ€Ð°Ð²Ð° Ð¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ð°',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ EKA Balance Ð¼Ñ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ ÑƒÑÐ¿ÐµÑˆÐ½Ñ‹Ðµ Ñ‚ÐµÑ€Ð°Ð¿ÐµÐ²Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ñ ÑÑ‚Ñ€Ð¾ÑÑ‚ÑÑ Ð½Ð° Ð²Ð·Ð°Ð¸Ð¼Ð½Ð¾Ð¼ ÑƒÐ²Ð°Ð¶ÐµÐ½Ð¸Ð¸ Ð¸ Ð¿Ð¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ð¸. Ð’ ÑÑ‚Ð¾Ð¼ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ðµ Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½Ñ‹ Ð²Ð°ÑˆÐ¸ Ð¿Ñ€Ð°Ð²Ð° ÐºÐ°Ðº Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ð° Ð¸ Ð²Ð°ÑˆÐ¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸ Ð¿Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸ÑŽ Ð½Ð°Ð¸Ð»ÑƒÑ‡ÑˆÐµÐ³Ð¾ ÑƒÑ…Ð¾Ð´Ð°.',
      sections: [
        {
          title: '1. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° ÑƒÐ²Ð°Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ðµ',
          icon: <Heart className="h-6 w-6 text-red-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸, ÐºÐ¾Ñ‚Ð¾Ñ€Ð°Ñ ÑÐ²Ð»ÑÐµÑ‚ÑÑ ÑƒÐ²Ð°Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹, Ð½ÐµÐ´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð¸ ÑƒÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°ÐµÑ‚ Ð²Ð°ÑˆÐ¸ Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ Ñ†ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð¸ ÑƒÐ±ÐµÐ¶Ð´ÐµÐ½Ð¸Ñ. ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½ÑƒÑŽ Ð¸ Ð¸Ð½ÐºÐ»ÑŽÐ·Ð¸Ð²Ð½ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ Ð´Ð»Ñ Ð²ÑÐµÑ… Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ð¾Ð².',
        },
        {
          title: '2. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ',
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð±Ñ‹Ñ‚ÑŒ Ð¿Ð¾Ð»Ð½Ð¾ÑÑ‚ÑŒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¼ Ð¾ ÑÐ²Ð¾ÐµÐ¼ Ð´Ð¸Ð°Ð³Ð½Ð¾Ð·Ðµ, Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ð°Ñ… Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Ð¸ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ñ… Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°Ñ… Ð½Ð° Ð¿Ð¾Ð½ÑÑ‚Ð½Ð¾Ð¼ Ð²Ð°Ð¼ ÑÐ·Ñ‹ÐºÐµ. Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð·Ð°Ð´Ð°Ð²Ð°Ñ‚ÑŒ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ð¸ ÑƒÑ‡Ð°ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð² Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð¸Ð¸ Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹ Ð¾ Ð²Ð°ÑˆÐµÐ¼ Ð»ÐµÑ‡ÐµÐ½Ð¸Ð¸.',
        },
        {
          title: '3. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð³Ð¾ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ Ð¸ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð²Ð°ÑˆÐ¸Ñ… Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ñ… Ð·Ð°Ð¿Ð¸ÑÐµÐ¹. Ð’Ð°ÑˆÐ° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð±ÑƒÐ´ÐµÑ‚ Ð¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°Ñ‚ÑŒÑÑ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð½Ð°ÑˆÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¾Ð¹ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ð¼Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð°Ð¼Ð¸.',
        },
        {
          title: '4. ÐžÐ±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ',
          icon: <Scale className="h-6 w-6 text-purple-600" />,
          text: 'Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ñ‚Ð¾Ñ‡Ð½Ð¾Ð¹ Ð¸ Ð¿Ð¾Ð»Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ð²Ð°ÑˆÐµÐ¹ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ð±Ð¾Ð»ÐµÐ·Ð½Ð¸, Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… Ð»ÐµÐºÐ°Ñ€ÑÑ‚Ð²Ð°Ñ… Ð¸ Ð»ÑŽÐ±Ñ‹Ñ… Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°Ñ…, Ð¸Ð¼ÐµÑŽÑ‰Ð¸Ñ… Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ðµ Ðº Ð²Ð°ÑˆÐµÐ¼Ñƒ Ð»ÐµÑ‡ÐµÐ½Ð¸ÑŽ. Ð­Ñ‚Ð¾ Ð¿Ð¾Ð¼Ð¾Ð³Ð°ÐµÑ‚ Ð½Ð°Ð¼ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð½Ð°Ð¸Ð±Ð¾Ð»ÐµÐµ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾Ðµ Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ.',
        },
        {
          title: '5. ÐžÑ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ð¾ÑÐµÑ‰ÐµÐ½Ð¸Ðµ',
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          text: 'Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ð¾ÑÐµÑ‰ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¸ÐµÐ¼Ð¾Ð² Ð¸ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð½Ð°Ñ Ð·Ð°Ñ€Ð°Ð½ÐµÐµ, ÐµÑÐ»Ð¸ Ð²Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿Ñ€Ð¸Ð¹Ñ‚Ð¸. Ð—Ð° Ð¿Ð¾Ð·Ð´Ð½ÑŽÑŽ Ð¾Ñ‚Ð¼ÐµÐ½Ñƒ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ð¿ÑƒÑ‰ÐµÐ½Ð½Ñ‹Ðµ Ð¿Ñ€Ð¸ÐµÐ¼Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚ Ð²Ð·Ð¸Ð¼Ð°Ñ‚ÑŒÑÑ Ð¿Ð»Ð°Ñ‚Ð°, ÐºÐ°Ðº ÑƒÐºÐ°Ð·Ð°Ð½Ð¾ Ð² Ð½Ð°ÑˆÐµÐ¹ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐµ Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹.',
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
        <div className="bg-linear-to-r from-blue-500 to-emerald-500 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Scale className="h-12 w-12 opacity-90" />
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
