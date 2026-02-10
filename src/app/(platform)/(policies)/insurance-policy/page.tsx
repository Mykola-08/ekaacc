'use client';

import React, { useState } from 'react';
import { Shield, FileCheck, Umbrella, AlertOctagon, CreditCard } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function InsurancePolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Insurance Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This policy outlines how EKA Balance interacts with insurance providers, coverage limitations, and your responsibilities regarding insurance claims and payments.',
      sections: [
        {
          title: '1. Insurance Coverage',
          icon: <Umbrella className="h-6 w-6 text-primary" />,
          text: 'We accept a variety of insurance plans. However, coverage varies significantly by plan and provider. It is your responsibility to understand your specific benefits, including deductibles, copays, and covered services.',
        },
        {
          title: '2. Verification of Benefits',
          icon: <FileCheck className="h-6 w-6 text-green-600" />,
          text: 'We will attempt to verify your insurance benefits prior to your first appointment. However, verification is not a guarantee of payment. You are responsible for any charges not covered by your insurance.',
        },
        {
          title: '3. Claims Processing',
          icon: <Shield className="h-6 w-6 text-purple-600" />,
          text: 'As a courtesy, we will file claims with your insurance provider on your behalf. You must provide accurate and up-to-date insurance information. If a claim is denied, you become responsible for the full balance.',
        },
        {
          title: '4. Out-of-Network Benefits',
          icon: <CreditCard className="h-6 w-6 text-orange-600" />,
          text: "If we are not in-network with your insurance provider, you may still be able to use out-of-network benefits. We can provide you with a 'Superbill' to submit to your insurance for potential reimbursement.",
        },
        {
          title: '5. Liability and Responsibility',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'You are ultimately financially responsible for all services rendered. If your insurance coverage changes or terminates, you must notify us immediately to avoid unexpected costs.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Seguros',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Esta polÃ­tica describe cÃ³mo EKA Balance interactÃºa con los proveedores de seguros, las limitaciones de cobertura y sus responsabilidades con respecto a las reclamaciones y pagos de seguros.',
      sections: [
        {
          title: '1. Cobertura de Seguro',
          icon: <Umbrella className="h-6 w-6 text-primary" />,
          text: 'Aceptamos una variedad de planes de seguro. Sin embargo, la cobertura varÃ­a significativamente segÃºn el plan y el proveedor. Es su responsabilidad comprender sus beneficios especÃ­ficos, incluidos los deducibles, copagos y servicios cubiertos.',
        },
        {
          title: '2. VerificaciÃ³n de Beneficios',
          icon: <FileCheck className="h-6 w-6 text-green-600" />,
          text: 'Intentaremos verificar sus beneficios de seguro antes de su primera cita. Sin embargo, la verificaciÃ³n no es una garantÃ­a de pago. Usted es responsable de cualquier cargo no cubierto por su seguro.',
        },
        {
          title: '3. Procesamiento de Reclamaciones',
          icon: <Shield className="h-6 w-6 text-purple-600" />,
          text: 'Como cortesÃ­a, presentaremos reclamaciones a su proveedor de seguros en su nombre. Debe proporcionar informaciÃ³n de seguro precisa y actualizada. Si se deniega una reclamaciÃ³n, usted serÃ¡ responsable del saldo total.',
        },
        {
          title: '4. Beneficios Fuera de la Red',
          icon: <CreditCard className="h-6 w-6 text-orange-600" />,
          text: "Si no estamos dentro de la red de su proveedor de seguros, es posible que aÃºn pueda utilizar los beneficios fuera de la red. Podemos proporcionarle una 'Superfactura' para enviar a su seguro para un posible reembolso.",
        },
        {
          title: '5. Responsabilidad y ObligaciÃ³n',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'Usted es, en Ãºltima instancia, financieramente responsable de todos los servicios prestados. Si su cobertura de seguro cambia o termina, debe notificarnos de inmediato para evitar costos inesperados.',
        },
      ],
    },
    ca: {
      title: "PolÃ­tica d'Assegurances",
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquesta polÃ­tica descriu com EKA Balance interactua amb els proveÃ¯dors d'assegurances, les limitacions de cobertura i les vostres responsabilitats pel que fa a les reclamacions i pagaments d'assegurances.",
      sections: [
        {
          title: "1. Cobertura d'AsseguranÃ§a",
          icon: <Umbrella className="h-6 w-6 text-primary" />,
          text: "Acceptem una varietat de plans d'asseguranÃ§a. No obstant aixÃ², la cobertura varia significativament segons el pla i el proveÃ¯dor. Ã‰s la vostra responsabilitat comprendre els vostres beneficis especÃ­fics, inclosos els deduÃ¯bles, copagaments i serveis coberts.",
        },
        {
          title: '2. VerificaciÃ³ de Beneficis',
          icon: <FileCheck className="h-6 w-6 text-green-600" />,
          text: "Intentarem verificar els vostres beneficis d'asseguranÃ§a abans de la vostra primera cita. No obstant aixÃ², la verificaciÃ³ no Ã©s una garantia de pagament. Sou responsable de qualsevol cÃ rrec no cobert per la vostra asseguranÃ§a.",
        },
        {
          title: '3. Processament de Reclamacions',
          icon: <Shield className="h-6 w-6 text-purple-600" />,
          text: "Com a cortesia, presentarem reclamacions al vostre proveÃ¯dor d'assegurances en nom vostre. Heu de proporcionar informaciÃ³ d'asseguranÃ§a precisa i actualitzada. Si es denega una reclamaciÃ³, sereu responsable del saldo total.",
        },
        {
          title: '4. Beneficis Fora de la Xarxa',
          icon: <CreditCard className="h-6 w-6 text-orange-600" />,
          text: "Si no estem dins de la xarxa del vostre proveÃ¯dor d'assegurances, Ã©s possible que encara pugueu utilitzar els beneficis fora de la xarxa. Podem proporcionar-vos una 'Superfactura' per enviar a la vostra asseguranÃ§a per a un possible reemborsament.",
        },
        {
          title: '5. Responsabilitat i ObligaciÃ³',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: "Sou, en Ãºltima instÃ ncia, financerament responsable de tots els serveis prestats. Si la vostra cobertura d'asseguranÃ§a canvia o finalitza, heu de notificar-nos immediatament per evitar costos inesperats.",
        },
      ],
    },
    ru: {
      title: 'Ð¡Ñ‚Ñ€Ð°Ñ…Ð¾Ð²Ð°Ñ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ°',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑ‚, ÐºÐ°Ðº EKA Balance Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÐµÑ‚ ÑÐ¾ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ñ‹Ð¼Ð¸ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸ÑÐ¼Ð¸, Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ Ð¿Ð¾ÐºÑ€Ñ‹Ñ‚Ð¸Ñ Ð¸ Ð²Ð°ÑˆÐ¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸ Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ñ‹Ñ… Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ð¹ Ð¸ Ð¿Ð»Ð°Ñ‚ÐµÐ¶ÐµÐ¹.',
      sections: [
        {
          title: '1. Ð¡Ñ‚Ñ€Ð°Ñ…Ð¾Ð²Ð¾Ðµ Ð¿Ð¾ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ',
          icon: <Umbrella className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÐ¼ Ñ€Ð°Ð·Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¿Ð»Ð°Ð½Ñ‹ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð°Ð½Ð¸Ñ. ÐžÐ´Ð½Ð°ÐºÐ¾ Ð¿Ð¾ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð·Ð½Ð°Ñ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð²Ð°Ñ€ÑŒÐ¸Ñ€ÑƒÐµÑ‚ÑÑ Ð² Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚Ð¸ Ð¾Ñ‚ Ð¿Ð»Ð°Ð½Ð° Ð¸ Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ð°. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ð¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ Ð²Ð°ÑˆÐ¸Ñ… ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ñ… Ð»ÑŒÐ³Ð¾Ñ‚, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ñ„Ñ€Ð°Ð½ÑˆÐ¸Ð·Ñ‹, Ð´Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹ Ð¸ Ð¿Ð¾ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸.',
        },
        {
          title: '2. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð»ÑŒÐ³Ð¾Ñ‚',
          icon: <FileCheck className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð°ÐµÐ¼ÑÑ Ð¿Ñ€Ð¾Ð²ÐµÑ€Ð¸Ñ‚ÑŒ Ð²Ð°ÑˆÐ¸ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ñ‹Ðµ Ð»ÑŒÐ³Ð¾Ñ‚Ñ‹ Ð´Ð¾ Ð²Ð°ÑˆÐµÐ¹ Ð¿ÐµÑ€Ð²Ð¾Ð¹ Ð²ÑÑ‚Ñ€ÐµÑ‡Ð¸. ÐžÐ´Ð½Ð°ÐºÐ¾ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸ÐµÐ¹ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð»ÑŽÐ±Ñ‹Ðµ Ñ€Ð°ÑÑ…Ð¾Ð´Ñ‹, Ð½Ðµ Ð¿Ð¾ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ð²Ð°ÑˆÐµÐ¹ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²ÐºÐ¾Ð¹.',
        },
        {
          title: '3. ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¿Ñ€ÐµÑ‚ÐµÐ½Ð·Ð¸Ð¹',
          icon: <Shield className="h-6 w-6 text-purple-600" />,
          text: 'Ð’ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ðµ Ð»ÑŽÐ±ÐµÐ·Ð½Ð¾ÑÑ‚Ð¸ Ð¼Ñ‹ Ð¿Ð¾Ð´Ð°Ð´Ð¸Ð¼ Ð¿Ñ€ÐµÑ‚ÐµÐ½Ð·Ð¸Ð¸ Ð²Ð°ÑˆÐµÐ¼Ñƒ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð¾Ð¼Ñƒ Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ñƒ Ð¾Ñ‚ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð¸Ð¼ÐµÐ½Ð¸. Ð’Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ñ‚Ð¾Ñ‡Ð½ÑƒÑŽ Ð¸ Ð°ÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¾ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð°Ð½Ð¸Ð¸. Ð•ÑÐ»Ð¸ Ð² Ð¿Ñ€ÐµÑ‚ÐµÐ½Ð·Ð¸Ð¸ Ð±ÑƒÐ´ÐµÑ‚ Ð¾Ñ‚ÐºÐ°Ð·Ð°Ð½Ð¾, Ð²Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ð¾Ð»Ð½ÑƒÑŽ Ð¾Ð¿Ð»Ð°Ñ‚Ñƒ.',
        },
        {
          title: '4. Ð›ÑŒÐ³Ð¾Ñ‚Ñ‹ Ð²Ð½Ðµ ÑÐµÑ‚Ð¸',
          icon: <CreditCard className="h-6 w-6 text-orange-600" />,
          text: "Ð•ÑÐ»Ð¸ Ð¼Ñ‹ Ð½Ðµ Ð²Ñ…Ð¾Ð´Ð¸Ð¼ Ð² ÑÐµÑ‚ÑŒ Ð²Ð°ÑˆÐµÐ³Ð¾ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð²Ð°Ð¹Ð´ÐµÑ€Ð°, Ð²Ñ‹ Ð²ÑÐµ Ñ€Ð°Ð²Ð½Ð¾ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð²Ð¾ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð»ÑŒÐ³Ð¾Ñ‚Ð°Ð¼Ð¸ Ð²Ð½Ðµ ÑÐµÑ‚Ð¸. ÐœÑ‹ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ð²Ð°Ð¼ 'Ð¡ÑƒÐ¿ÐµÑ€ÑÑ‡ÐµÑ‚' Ð´Ð»Ñ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐ¸ Ð² Ð²Ð°ÑˆÑƒ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²ÑƒÑŽ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸ÑŽ Ð´Ð»Ñ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾Ð³Ð¾ Ð²Ð¾Ð·Ð¼ÐµÑ‰ÐµÐ½Ð¸Ñ.",
        },
        {
          title: '5. ÐžÑ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'Ð’ ÐºÐ¾Ð½ÐµÑ‡Ð½Ð¾Ð¼ Ð¸Ñ‚Ð¾Ð³Ðµ Ð²Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¾Ð²ÑƒÑŽ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð²ÑÐµ Ð¾ÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸. Ð•ÑÐ»Ð¸ Ð²Ð°ÑˆÐµ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð¾Ðµ Ð¿Ð¾ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑÑ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑÑ, Ð²Ñ‹ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð¸Ñ‚ÑŒ Ð½Ð°Ñ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ð·Ð±ÐµÐ¶Ð°Ñ‚ÑŒ Ð½ÐµÐ¿Ñ€ÐµÐ´Ð²Ð¸Ð´ÐµÐ½Ð½Ñ‹Ñ… Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð².',
        },
      ],
    },
  };

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-card mx-auto max-w-4xl overflow-hidden rounded-lg shadow-sm">
        <div className="flex items-center justify-between bg-primary px-8 py-8 text-primary-foreground">
          <div>
            <h1 className="text-3xl font-semibold">{content[language].title}</h1>
            <p className="mt-2 text-primary-foreground/80">{content[language].lastUpdated}</p>
          </div>
          <div className="flex space-x-2">
            {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded px-3 py-1 text-sm font-semibold uppercase transition-colors ${
                  language === lang
                    ? 'bg-card text-foreground'
                    : 'bg-primary/90 text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <p className="text-foreground/90 mb-8 border-b pb-8 text-lg leading-relaxed">
            {content[language].intro}
          </p>

          <div className="space-y-8">
            {content[language].sections.map((section, index) => (
              <div
                key={index}
                className="bg-muted/30 flex items-start rounded-xl p-6 transition-shadow hover:shadow-md"
              >
                <div className="bg-card mt-1 shrink-0 rounded-full p-3 shadow-sm">
                  {section.icon}
                </div>
                <div className="ml-6">
                  <h2 className="text-foreground mb-3 text-xl font-semibold">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>&copy; 2025 EKA Balance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
