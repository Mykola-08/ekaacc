'use client';

import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, FileText, XCircle } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function AffiliateProgramTerms() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Affiliate Program Terms',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'These terms and conditions govern your participation in the EKA Balance Affiliate Program. By joining our program, you agree to promote our services in accordance with these terms.',
      sections: [
        {
          title: '1. Enrollment and Approval',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'To join the Affiliate Program, you must submit an application. We review all applications and reserve the right to reject any application at our sole discretion. Once approved, you will receive access to affiliate links and marketing materials.',
        },
        {
          title: '2. Commissions and Payments',
          icon: <DollarSign className="h-6 w-6 text-green-600" />,
          text: 'You will earn a commission for each qualifying sale generated through your unique affiliate link. Commissions are paid out monthly, subject to a minimum payout threshold. We reserve the right to adjust commission rates with prior notice.',
        },
        {
          title: '3. Promotion Guidelines',
          icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
          text: 'You agree to promote EKA Balance in a positive and professional manner. You must not use misleading or deceptive claims, spam, or any unethical marketing practices. All promotional materials must be approved by us or provided by us.',
        },
        {
          title: '4. Intellectual Property',
          icon: <FileText className="h-6 w-6 text-orange-600" />,
          text: 'We grant you a limited, non-exclusive, non-transferable license to use our trademarks and logos solely for the purpose of promoting our services as an affiliate. You may not modify our branding without our written consent.',
        },
        {
          title: '5. Termination',
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          text: 'Either party may terminate this agreement at any time, with or without cause, by giving written notice. Upon termination, you must immediately cease all promotion of EKA Balance and remove all affiliate links from your channels.',
        },
      ],
    },
    es: {
      title: 'TÃ©rminos del Programa de Afiliados',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Estos tÃ©rminos y condiciones rigen su participaciÃ³n en el Programa de Afiliados de EKA Balance. Al unirse a nuestro programa, acepta promocionar nuestros servicios de acuerdo con estos tÃ©rminos.',
      sections: [
        {
          title: '1. InscripciÃ³n y AprobaciÃ³n',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'Para unirse al Programa de Afiliados, debe enviar una solicitud. Revisamos todas las solicitudes y nos reservamos el derecho de rechazar cualquier solicitud a nuestra entera discreciÃ³n. Una vez aprobado, recibirÃ¡ acceso a enlaces de afiliados y materiales de marketing.',
        },
        {
          title: '2. Comisiones y Pagos',
          icon: <DollarSign className="h-6 w-6 text-green-600" />,
          text: 'GanarÃ¡ una comisiÃ³n por cada venta calificada generada a travÃ©s de su enlace de afiliado Ãºnico. Las comisiones se pagan mensualmente, sujetas a un umbral mÃ­nimo de pago. Nos reservamos el derecho de ajustar las tasas de comisiÃ³n con previo aviso.',
        },
        {
          title: '3. Pautas de PromociÃ³n',
          icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
          text: 'Acepta promocionar EKA Balance de una manera positiva y profesional. No debe utilizar afirmaciones engaÃ±osas o falsas, spam o cualquier prÃ¡ctica de marketing poco Ã©tica. Todos los materiales promocionales deben ser aprobados por nosotros o proporcionados por nosotros.',
        },
        {
          title: '4. Propiedad Intelectual',
          icon: <FileText className="h-6 w-6 text-orange-600" />,
          text: 'Le otorgamos una licencia limitada, no exclusiva e intransferible para utilizar nuestras marcas comerciales y logotipos Ãºnicamente con el fin de promocionar nuestros servicios como afiliado. No puede modificar nuestra marca sin nuestro consentimiento por escrito.',
        },
        {
          title: '5. TerminaciÃ³n',
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          text: 'Cualquiera de las partes puede rescindir este acuerdo en cualquier momento, con o sin causa, mediante notificaciÃ³n por escrito. Tras la terminaciÃ³n, debe cesar inmediatamente toda promociÃ³n de EKA Balance y eliminar todos los enlaces de afiliados de sus canales.',
        },
      ],
    },
    ca: {
      title: "Termes del Programa d'Afiliats",
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquests termes i condicions regeixen la vostra participaciÃ³ en el Programa d'Afiliats d'EKA Balance. En unir-vos al nostre programa, accepteu promocionar els nostres serveis d'acord amb aquests termes.",
      sections: [
        {
          title: '1. InscripciÃ³ i AprovaciÃ³',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: "Per unir-vos al Programa d'Afiliats, heu d'enviar una solÂ·licitud. Revisem totes les solÂ·licituds i ens reservem el dret de rebutjar qualsevol solÂ·licitud a la nostra discreciÃ³. Un cop aprovat, rebreu accÃ©s a enllaÃ§os d'afiliats i materials de mÃ rqueting.",
        },
        {
          title: '2. Comissions i Pagaments',
          icon: <DollarSign className="h-6 w-6 text-green-600" />,
          text: "Guanyareu una comissiÃ³ per cada venda qualificada generada a travÃ©s del vostre enllaÃ§ d'afiliat Ãºnic. Les comissions es paguen mensualment, subjectes a un llindar mÃ­nim de pagament. Ens reservem el dret d'ajustar les taxes de comissiÃ³ amb previ avÃ­s.",
        },
        {
          title: '3. Pautes de PromociÃ³',
          icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
          text: "Accepteu promocionar EKA Balance d'una manera positiva i professional. No heu d'utilitzar afirmacions enganyoses o falses, correu brossa o qualsevol prÃ ctica de mÃ rqueting poc Ã¨tica. Tots els materials promocionals han de ser aprovats per nosaltres o proporcionats per nosaltres.",
        },
        {
          title: '4. Propietat IntelÂ·lectual',
          icon: <FileText className="h-6 w-6 text-orange-600" />,
          text: 'Us atorguem una llicÃ¨ncia limitada, no exclusiva i intransferible per utilitzar les nostres marques comercials i logotips Ãºnicament amb la finalitat de promocionar els nostres serveis com a afiliat. No podeu modificar la nostra marca sense el nostre consentiment per escrit.',
        },
        {
          title: '5. TerminaciÃ³',
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          text: "Qualsevol de les parts pot rescindir aquest acord en qualsevol moment, amb o sense causa, mitjanÃ§ant notificaciÃ³ per escrit. DesprÃ©s de la terminaciÃ³, heu de cessar immediatament tota promociÃ³ d'EKA Balance i eliminar tots els enllaÃ§os d'afiliats dels vostres canals.",
        },
      ],
    },
    ru: {
      title: 'Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¾Ð¹ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ñ‹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‚ Ð²Ð°ÑˆÐµ ÑƒÑ‡Ð°ÑÑ‚Ð¸Ðµ Ð² Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¾Ð¹ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ðµ EKA Balance. ÐŸÑ€Ð¸ÑÐ¾ÐµÐ´Ð¸Ð½ÑÑÑÑŒ Ðº Ð½Ð°ÑˆÐµÐ¹ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ðµ, Ð²Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð³Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ ÑÑ‚Ð¸Ð¼Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸ÑÐ¼Ð¸.',
      sections: [
        {
          title: '1. Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð¸ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ðµ',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'Ð§Ñ‚Ð¾Ð±Ñ‹ Ð¿Ñ€Ð¸ÑÐ¾ÐµÐ´Ð¸Ð½Ð¸Ñ‚ÑŒÑÑ Ðº Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¾Ð¹ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ðµ, Ð²Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¿Ð¾Ð´Ð°Ñ‚ÑŒ Ð·Ð°ÑÐ²ÐºÑƒ. ÐœÑ‹ Ñ€Ð°ÑÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°ÐµÐ¼ Ð²ÑÐµ Ð·Ð°ÑÐ²ÐºÐ¸ Ð¸ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚ÐºÐ»Ð¾Ð½Ð¸Ñ‚ÑŒ Ð»ÑŽÐ±ÑƒÑŽ Ð·Ð°ÑÐ²ÐºÑƒ Ð¿Ð¾ Ð½Ð°ÑˆÐµÐ¼Ñƒ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ð¼Ñƒ ÑƒÑÐ¼Ð¾Ñ‚Ñ€ÐµÐ½Ð¸ÑŽ. ÐŸÐ¾ÑÐ»Ðµ Ð¾Ð´Ð¾Ð±Ñ€ÐµÐ½Ð¸Ñ Ð²Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¸Ð¼ ÑÑÑ‹Ð»ÐºÐ°Ð¼ Ð¸ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¸Ð½Ð³Ð¾Ð²Ñ‹Ð¼ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ð°Ð¼.',
        },
        {
          title: '2. ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ð¾Ð½Ð½Ñ‹Ðµ Ð¸ Ð²Ñ‹Ð¿Ð»Ð°Ñ‚Ñ‹',
          icon: <DollarSign className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ñ‹ Ð±ÑƒÐ´ÐµÑ‚Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð°Ñ‚ÑŒ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸ÑŽ Ð·Ð° ÐºÐ°Ð¶Ð´ÑƒÑŽ ÐºÐ²Ð°Ð»Ð¸Ñ„Ð¸Ñ†Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½ÑƒÑŽ Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ñƒ, ÑÐ¾Ð²ÐµÑ€ÑˆÐµÐ½Ð½ÑƒÑŽ Ð¿Ð¾ Ð²Ð°ÑˆÐµÐ¹ ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¾Ð¹ ÑÑÑ‹Ð»ÐºÐµ. ÐšÐ¾Ð¼Ð¸ÑÑÐ¸Ð¾Ð½Ð½Ñ‹Ðµ Ð²Ñ‹Ð¿Ð»Ð°Ñ‡Ð¸Ð²Ð°ÑŽÑ‚ÑÑ ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ð¾ Ð¿Ñ€Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ð¸ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ð¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ð¾Ñ€Ð¾Ð³Ð° Ð²Ñ‹Ð¿Ð»Ð°Ñ‚. ÐœÑ‹ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÑ‚Ð°Ð²ÐºÐ¸ ÐºÐ¾Ð¼Ð¸ÑÑÐ¸Ð¸ Ñ Ð¿Ñ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸ÐµÐ¼.',
        },
        {
          title: '3. Ð ÑƒÐºÐ¾Ð²Ð¾Ð´ÑÑ‚Ð²Ð¾ Ð¿Ð¾ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸ÑŽ',
          icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
          text: 'Ð’Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð³Ð°Ñ‚ÑŒ EKA Balance Ð² Ð¿Ð¾Ð·Ð¸Ñ‚Ð¸Ð²Ð½Ð¾Ð¼ Ð¸ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¼ ÐºÐ»ÑŽÑ‡Ðµ. Ð’Ñ‹ Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð²Ð²Ð¾Ð´ÑÑ‰Ð¸Ðµ Ð² Ð·Ð°Ð±Ð»ÑƒÐ¶Ð´ÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ Ð»Ð¾Ð¶Ð½Ñ‹Ðµ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ, ÑÐ¿Ð°Ð¼ Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ñ‹Ðµ Ð½ÐµÑÑ‚Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¼Ð°Ñ€ÐºÐµÑ‚Ð¸Ð½Ð³Ð¾Ð²Ñ‹Ðµ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ¸. Ð’ÑÐµ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ðµ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ð¾Ð´Ð¾Ð±Ñ€ÐµÐ½Ñ‹ Ð½Ð°Ð¼Ð¸ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ñ‹ Ð½Ð°Ð¼Ð¸.',
        },
        {
          title: '4. Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
          icon: <FileText className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð²Ð°Ð¼ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð½ÑƒÑŽ, Ð½ÐµÐ¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½ÑƒÑŽ, Ð½ÐµÐ¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°ÐµÐ¼ÑƒÑŽ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸ÑŽ Ð½Ð° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð½Ð°ÑˆÐ¸Ñ… Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð·Ð½Ð°ÐºÐ¾Ð² Ð¸ Ð»Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿Ð¾Ð² Ð¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ñ Ñ†ÐµÐ»ÑŒÑŽ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð½Ð°ÑˆÐ¸Ñ… ÑƒÑÐ»ÑƒÐ³ Ð² ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ðµ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð°. Ð’Ñ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ Ð½Ð°Ñˆ Ð±Ñ€ÐµÐ½Ð´ Ð±ÐµÐ· Ð½Ð°ÑˆÐµÐ³Ð¾ Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ.',
        },
        {
          title: '5. ÐŸÑ€ÐµÐºÑ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ',
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          text: 'Ð›ÑŽÐ±Ð°Ñ Ð¸Ð· ÑÑ‚Ð¾Ñ€Ð¾Ð½ Ð¼Ð¾Ð¶ÐµÑ‚ Ñ€Ð°ÑÑ‚Ð¾Ñ€Ð³Ð½ÑƒÑ‚ÑŒ ÑÑ‚Ð¾ ÑÐ¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ðµ Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ, Ñ ÑƒÐºÐ°Ð·Ð°Ð½Ð¸ÐµÐ¼ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½Ñ‹ Ð¸Ð»Ð¸ Ð±ÐµÐ· Ñ‚Ð°ÐºÐ¾Ð²Ð¾Ð¹, Ð½Ð°Ð¿Ñ€Ð°Ð²Ð¸Ð² Ð¿Ð¸ÑÑŒÐ¼ÐµÐ½Ð½Ð¾Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ. ÐŸÐ¾ÑÐ»Ðµ Ñ€Ð°ÑÑ‚Ð¾Ñ€Ð¶ÐµÐ½Ð¸Ñ Ð²Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒ Ð»ÑŽÐ±Ð¾Ðµ Ð¿Ñ€Ð¾Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ EKA Balance Ð¸ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ Ð²ÑÐµ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€ÑÐºÐ¸Ðµ ÑÑÑ‹Ð»ÐºÐ¸ ÑÐ¾ ÑÐ²Ð¾Ð¸Ñ… ÐºÐ°Ð½Ð°Ð»Ð¾Ð².',
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
        <div className="bg-linear-to-r from-orange-500 to-red-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Users className="h-12 w-12 opacity-90" />
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
