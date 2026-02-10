'use client';

import React, { useState } from 'react';
import { MapPin, EyeOff, FileX, Shield, Phone } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function CcpaNotice() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'CCPA Privacy Notice',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        "This Privacy Notice for California Residents supplements the information contained in EKA Balance's general Privacy Policy and applies solely to visitors, users, and others who reside in the State of California.",
      sections: [
        {
          id: 'rights',
          title: '1. Your Rights Under CCPA',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'The California Consumer Privacy Act (CCPA) provides consumers (California residents) with specific rights regarding their personal information. This includes the right to know what personal information we collect, use, disclose, and sell.',
        },
        {
          id: 'access',
          title: '2. Right to Know and Access',
          icon: <MapPin className="h-6 w-6 text-green-600" />,
          text: 'You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. Once we receive and confirm your verifiable consumer request, we will disclose it to you.',
        },
        {
          id: 'delete',
          title: '3. Right to Delete',
          icon: <FileX className="h-6 w-6 text-red-600" />,
          text: 'You have the right to request that we delete any of your personal information that we collected from you and retained, subject to certain exceptions. Once we receive and confirm your verifiable consumer request, we will delete your personal information from our records.',
        },
        {
          id: 'do-not-sell',
          title: '4. Do Not Sell My Personal Information',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'You have the right to opt-out of the sale of your personal information. EKA Balance does not sell personal information. However, if we did, you would have the right to direct us to not sell your personal information at any time.',
        },
        {
          id: 'non-discrimination',
          title: '5. Non-Discrimination',
          icon: <Phone className="h-6 w-6 text-orange-600" />,
          text: 'We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not deny you goods or services, charge you different prices or rates, or provide you with a different level or quality of goods or services.',
        },
      ],
    },
    es: {
      title: 'Aviso de Privacidad de la CCPA',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este Aviso de Privacidad para Residentes de California complementa la informaciÃ³n contenida en la PolÃ­tica de Privacidad general de EKA Balance y se aplica Ãºnicamente a los visitantes, usuarios y otras personas que residen en el Estado de California.',
      sections: [
        {
          title: '1. Sus Derechos Bajo la CCPA',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'La Ley de Privacidad del Consumidor de California (CCPA) otorga a los consumidores (residentes de California) derechos especÃ­ficos con respecto a su informaciÃ³n personal. Esto incluye el derecho a saber quÃ© informaciÃ³n personal recopilamos, usamos, divulgamos y vendemos.',
        },
        {
          title: '2. Derecho a Saber y Acceder',
          icon: <MapPin className="h-6 w-6 text-green-600" />,
          text: 'Tiene derecho a solicitar que le revelemos cierta informaciÃ³n sobre nuestra recopilaciÃ³n y uso de su informaciÃ³n personal durante los Ãºltimos 12 meses. Una vez que recibamos y confirmemos su solicitud de consumidor verificable, se la revelaremos.',
        },
        {
          title: '3. Derecho a Eliminar',
          icon: <FileX className="h-6 w-6 text-red-600" />,
          text: 'Tiene derecho a solicitar que eliminemos cualquier informaciÃ³n personal que hayamos recopilado de usted y conservado, sujeto a ciertas excepciones. Una vez que recibamos y confirmemos su solicitud de consumidor verificable, eliminaremos su informaciÃ³n personal de nuestros registros.',
        },
        {
          title: '4. No Vender Mi InformaciÃ³n Personal',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'Tiene derecho a optar por no participar en la venta de su informaciÃ³n personal. EKA Balance no vende informaciÃ³n personal. Sin embargo, si lo hiciÃ©ramos, tendrÃ­a derecho a indicarnos que no vendamos su informaciÃ³n personal en cualquier momento.',
        },
        {
          title: '5. No DiscriminaciÃ³n',
          icon: <Phone className="h-6 w-6 text-orange-600" />,
          text: 'No lo discriminaremos por ejercer cualquiera de sus derechos de la CCPA. A menos que lo permita la CCPA, no le negaremos bienes o servicios, no le cobraremos precios o tarifas diferentes, ni le proporcionaremos un nivel o calidad diferente de bienes o servicios.',
        },
      ],
    },
    ca: {
      title: 'AvÃ­s de Privadesa de la CCPA',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquest AvÃ­s de Privadesa per a Residents de CalifÃ²rnia complementa la informaciÃ³ continguda en la PolÃ­tica de Privadesa general d'EKA Balance i s'aplica Ãºnicament als visitants, usuaris i altres persones que resideixen a l'Estat de CalifÃ²rnia.",
      sections: [
        {
          title: '1. Els Vostres Drets Sota la CCPA',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'La Llei de Privadesa del Consumidor de CalifÃ²rnia (CCPA) atorga als consumidors (residents de CalifÃ²rnia) drets especÃ­fics pel que fa a la seva informaciÃ³ personal. AixÃ² inclou el dret a saber quina informaciÃ³ personal recopilem, utilitzem, divulguem i venem.',
        },
        {
          title: '2. Dret a Saber i Accedir',
          icon: <MapPin className="h-6 w-6 text-green-600" />,
          text: 'Teniu dret a solÂ·licitar que us revelem certa informaciÃ³ sobre la nostra recopilaciÃ³ i Ãºs de la vostra informaciÃ³ personal durant els darrers 12 mesos. Un cop rebem i confirmem la vostra solÂ·licitud de consumidor verificable, us la revelarem.',
        },
        {
          title: '3. Dret a Eliminar',
          icon: <FileX className="h-6 w-6 text-red-600" />,
          text: 'Teniu dret a solÂ·licitar que eliminem qualsevol informaciÃ³ personal que hÃ gim recopilat de vosaltres i conservat, subjecte a certes excepcions. Un cop rebem i confirmem la vostra solÂ·licitud de consumidor verificable, eliminarem la vostra informaciÃ³ personal dels nostres registres.',
        },
        {
          title: '4. No Vendre la Meva InformaciÃ³ Personal',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'Teniu dret a optar per no participar en la venda de la vostra informaciÃ³ personal. EKA Balance no ven informaciÃ³ personal. No obstant aixÃ², si ho fÃ©ssim, tindrÃ­eu dret a indicar-nos que no venguem la vostra informaciÃ³ personal en qualsevol moment.',
        },
        {
          title: '5. No DiscriminaciÃ³',
          icon: <Phone className="h-6 w-6 text-orange-600" />,
          text: 'No us discriminarem per exercir qualsevol dels vostres drets de la CCPA. A menys que ho permeti la CCPA, no us negarem bÃ©ns o serveis, no us cobrarem preus o tarifes diferents, ni us proporcionarem un nivell o qualitat diferent de bÃ©ns o serveis.',
        },
      ],
    },
    ru: {
      title: 'Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ CCPA',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð¾ Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ Ð¶Ð¸Ñ‚ÐµÐ»ÐµÐ¹ ÐšÐ°Ð»Ð¸Ñ„Ð¾Ñ€Ð½Ð¸Ð¸ Ð´Ð¾Ð¿Ð¾Ð»Ð½ÑÐµÑ‚ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, ÑÐ¾Ð´ÐµÑ€Ð¶Ð°Ñ‰ÑƒÑŽÑÑ Ð² Ð¾Ð±Ñ‰ÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐµ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ EKA Balance, Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ Ð¸ÑÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ðº Ð¿Ð¾ÑÐµÑ‚Ð¸Ñ‚ÐµÐ»ÑÐ¼, Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑÐ¼ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼ Ð»Ð¸Ñ†Ð°Ð¼, Ð¿Ñ€Ð¾Ð¶Ð¸Ð²Ð°ÑŽÑ‰Ð¸Ð¼ Ð² ÑˆÑ‚Ð°Ñ‚Ðµ ÐšÐ°Ð»Ð¸Ñ„Ð¾Ñ€Ð½Ð¸Ñ.',
      sections: [
        {
          title: '1. Ð’Ð°ÑˆÐ¸ Ð¿Ñ€Ð°Ð²Ð° Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ CCPA',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'Ð—Ð°ÐºÐ¾Ð½ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¹ ÐšÐ°Ð»Ð¸Ñ„Ð¾Ñ€Ð½Ð¸Ð¸ (CCPA) Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÑÐ¼ (Ð¶Ð¸Ñ‚ÐµÐ»ÑÐ¼ ÐšÐ°Ð»Ð¸Ñ„Ð¾Ñ€Ð½Ð¸Ð¸) Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ñ‹Ðµ Ð¿Ñ€Ð°Ð²Ð° Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ Ð¸Ñ… Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð² ÑÐµÐ±Ñ Ð¿Ñ€Ð°Ð²Ð¾ Ð·Ð½Ð°Ñ‚ÑŒ, ÐºÐ°ÐºÑƒÑŽ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¼Ñ‹ ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÐ¼, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼, Ñ€Ð°ÑÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ Ð¸ Ð¿Ñ€Ð¾Ð´Ð°ÐµÐ¼.',
        },
        {
          title: '2. ÐŸÑ€Ð°Ð²Ð¾ Ð·Ð½Ð°Ñ‚ÑŒ Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡Ð°Ñ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿',
          icon: <MapPin className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¼Ñ‹ Ñ€Ð°ÑÐºÑ€Ñ‹Ð»Ð¸ Ð²Ð°Ð¼ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¾ Ð½Ð°ÑˆÐµÐ¼ ÑÐ±Ð¾Ñ€Ðµ Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ð²Ð°ÑˆÐµÐ¹ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð·Ð° Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ 12 Ð¼ÐµÑÑÑ†ÐµÐ². ÐšÐ°Ðº Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¼Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ð¼ Ð¸ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ð¼ Ð²Ð°Ñˆ Ð¿Ð¾Ð´Ð´Ð°ÑŽÑ‰Ð¸Ð¹ÑÑ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐµ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»Ñ, Ð¼Ñ‹ Ñ€Ð°ÑÐºÑ€Ð¾ÐµÐ¼ ÐµÐ³Ð¾ Ð²Ð°Ð¼.',
        },
        {
          title: '3. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ðµ',
          icon: <FileX className="h-6 w-6 text-red-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¼Ñ‹ ÑƒÐ´Ð°Ð»Ð¸Ð»Ð¸ Ð»ÑŽÐ±ÑƒÑŽ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, ÐºÐ¾Ñ‚Ð¾Ñ€ÑƒÑŽ Ð¼Ñ‹ ÑÐ¾Ð±Ñ€Ð°Ð»Ð¸ Ñƒ Ð²Ð°Ñ Ð¸ ÑÐ¾Ñ…Ñ€Ð°Ð½Ð¸Ð»Ð¸, Ð·Ð° Ð½ÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼Ð¸ Ð¸ÑÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸ÑÐ¼Ð¸. ÐšÐ°Ðº Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¼Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ð¼ Ð¸ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ð¼ Ð²Ð°Ñˆ Ð¿Ð¾Ð´Ð´Ð°ÑŽÑ‰Ð¸Ð¹ÑÑ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐµ Ð·Ð°Ð¿Ñ€Ð¾Ñ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»Ñ, Ð¼Ñ‹ ÑƒÐ´Ð°Ð»Ð¸Ð¼ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¸Ð· Ð½Ð°ÑˆÐ¸Ñ… Ð·Ð°Ð¿Ð¸ÑÐµÐ¹.',
        },
        {
          title: '4. ÐÐµ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ð°Ñ‚ÑŒ Ð¼Ð¾ÑŽ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'Ð’Ñ‹ Ð¸Ð¼ÐµÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚ÐºÐ°Ð·Ð°Ñ‚ÑŒÑÑ Ð¾Ñ‚ Ð¿Ñ€Ð¾Ð´Ð°Ð¶Ð¸ Ð²Ð°ÑˆÐµÐ¹ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸. EKA Balance Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°ÐµÑ‚ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ. ÐžÐ´Ð½Ð°ÐºÐ¾, ÐµÑÐ»Ð¸ Ð±Ñ‹ Ð¼Ñ‹ ÑÑ‚Ð¾ ÑÐ´ÐµÐ»Ð°Ð»Ð¸, Ð²Ñ‹ Ð¸Ð¼ÐµÐ»Ð¸ Ð±Ñ‹ Ð¿Ñ€Ð°Ð²Ð¾ Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ ÑƒÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð½Ð°Ð¼ Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°Ð²Ð°Ñ‚ÑŒ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ.',
        },
        {
          title: '5. ÐÐµÐ´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ñ',
          icon: <Phone className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð½Ðµ Ð±ÑƒÐ´ÐµÐ¼ Ð´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð²Ð°Ñ Ð·Ð° Ð¾ÑÑƒÑ‰ÐµÑÑ‚Ð²Ð»ÐµÐ½Ð¸Ðµ Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ð¸Ð· Ð²Ð°ÑˆÐ¸Ñ… Ð¿Ñ€Ð°Ð² CCPA. Ð•ÑÐ»Ð¸ ÑÑ‚Ð¾ Ð½Ðµ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¾ CCPA, Ð¼Ñ‹ Ð½Ðµ Ð±ÑƒÐ´ÐµÐ¼ Ð¾Ñ‚ÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ð²Ð°Ð¼ Ð² Ñ‚Ð¾Ð²Ð°Ñ€Ð°Ñ… Ð¸Ð»Ð¸ ÑƒÑÐ»ÑƒÐ³Ð°Ñ…, Ð²Ð·Ð¸Ð¼Ð°Ñ‚ÑŒ Ñ Ð²Ð°Ñ Ñ€Ð°Ð·Ð½Ñ‹Ðµ Ñ†ÐµÐ½Ñ‹ Ð¸Ð»Ð¸ Ñ‚Ð°Ñ€Ð¸Ñ„Ñ‹ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒ Ð²Ð°Ð¼ Ð´Ñ€ÑƒÐ³Ð¾Ð¹ ÑƒÑ€Ð¾Ð²ÐµÐ½ÑŒ Ð¸Ð»Ð¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð¸Ð»Ð¸ ÑƒÑÐ»ÑƒÐ³.',
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
        <div className="bg-linear-to-r from-yellow-600 to-orange-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <MapPin className="h-12 w-12 opacity-90" />
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
