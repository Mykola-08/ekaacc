'use client';

import { useState } from 'react';
import { Globe, ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ModernSlaveryStatement() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Modern Slavery Statement',
      lastUpdated: 'Last Updated: March 15, 2024',
      intro:
        'EKA Balance is committed to preventing acts of modern slavery and human trafficking from occurring within its business and supply chain, and imposes the same high standards on its suppliers.',
      sections: [
        {
          title: '1. Structure and Business',
          content:
            'EKA Balance is a digital mental health platform operating globally. We work with a network of therapists, technology providers, and other partners to deliver our services.',
        },
        {
          title: '2. Policies',
          content:
            'We have implemented policies to ensure that we are conducting business in an ethical and transparent manner. These include:\n\n- Recruitment Policy: We operate a robust recruitment policy, including conducting eligibility to work checks for all employees to safeguard against human trafficking or individuals being forced to work against their will.\n- Whistleblowing Policy: We operate a whistleblowing policy so that all employees know that they can raise concerns about how colleagues are being treated, or practices within our business or supply chain, without fear of reprisals.\n- Code of Conduct: This code explains the manner in which we behave as an organization and how we expect our employees and suppliers to act.',
        },
        {
          title: '3. Supply Chain',
          content:
            'Our supply chain includes IT hardware and software suppliers, professional services (legal, accounting), and office management services. We conduct due diligence on all suppliers before allowing them to become a preferred supplier.',
        },
        {
          title: '4. Risk Assessment',
          content:
            'We consider the risk of modern slavery within our business to be low. However, we remain vigilant and review our risks regularly.',
        },
        {
          title: '5. Training',
          content:
            'To ensure a high level of understanding of the risks of modern slavery and human trafficking in our supply chains and our business, we provide training to our staff.',
        },
        {
          title: '6. Future Steps',
          content:
            'We will continue to review our policies and procedures to ensure they are effective in preventing modern slavery from occurring in our business or supply chain.',
        },
      ],
    },
    es: {
      title: 'DeclaraciÃ³n sobre la Esclavitud Moderna',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 15 de marzo de 2024',
      intro:
        'EKA Balance se compromete a prevenir que ocurran actos de esclavitud moderna y trata de personas dentro de su negocio y cadena de suministro, e impone los mismos altos estÃ¡ndares a sus proveedores.',
      sections: [
        {
          title: '1. Estructura y Negocio',
          content:
            'EKA Balance es una plataforma digital de salud mental que opera a nivel mundial. Trabajamos con una red de terapeutas, proveedores de tecnologÃ­a y otros socios para prestar nuestros servicios.',
        },
        {
          title: '2. PolÃ­ticas',
          content:
            'Hemos implementado polÃ­ticas para garantizar que realizamos negocios de manera Ã©tica y transparente. Estas incluyen:\n\n- PolÃ­tica de ContrataciÃ³n: Operamos una polÃ­tica de contrataciÃ³n sÃ³lida, que incluye la realizaciÃ³n de comprobaciones de elegibilidad para trabajar para todos los empleados con el fin de proteger contra la trata de personas o las personas obligadas a trabajar en contra de su voluntad.\n- PolÃ­tica de Denuncias: Operamos una polÃ­tica de denuncias para que todos los empleados sepan que pueden plantear inquietudes sobre cÃ³mo se trata a los colegas, o prÃ¡cticas dentro de nuestro negocio o cadena de suministro, sin temor a represalias.\n- CÃ³digo de Conducta: Este cÃ³digo explica la manera en que nos comportamos como organizaciÃ³n y cÃ³mo esperamos que actÃºen nuestros empleados y proveedores.',
        },
        {
          title: '3. Cadena de Suministro',
          content:
            'Nuestra cadena de suministro incluye proveedores de hardware y software de TI, servicios profesionales (legales, contables) y servicios de gestiÃ³n de oficinas. Realizamos la debida diligencia con todos los proveedores antes de permitirles convertirse en proveedores preferentes.',
        },
        {
          title: '4. EvaluaciÃ³n de Riesgos',
          content:
            'Consideramos que el riesgo de esclavitud moderna dentro de nuestro negocio es bajo. Sin embargo, nos mantenemos vigilantes y revisamos nuestros riesgos regularmente.',
        },
        {
          title: '5. FormaciÃ³n',
          content:
            'Para garantizar un alto nivel de comprensiÃ³n de los riesgos de la esclavitud moderna y la trata de personas en nuestras cadenas de suministro y nuestro negocio, brindamos formaciÃ³n a nuestro personal.',
        },
        {
          title: '6. Pasos Futuros',
          content:
            'Continuaremos revisando nuestras polÃ­ticas y procedimientos para garantizar que sean efectivos para prevenir que ocurra la esclavitud moderna en nuestro negocio o cadena de suministro.',
        },
      ],
    },
    ca: {
      title: "DeclaraciÃ³ sobre l'Esclavitud Moderna",
      lastUpdated: 'Ãšltima actualitzaciÃ³: 15 de marÃ§ de 2024',
      intro:
        "EKA Balance es compromet a prevenir que es produeixin actes d'esclavitud moderna i trÃ fic de persones dins del seu negoci i cadena de subministrament, i imposa els mateixos alts estÃ ndards als seus proveÃ¯dors.",
      sections: [
        {
          title: '1. Estructura i Negoci',
          content:
            'EKA Balance Ã©s una plataforma digital de salut mental que opera a nivell mundial. Treballem amb una xarxa de terapeutes, proveÃ¯dors de tecnologia i altres socis per prestar els nostres serveis.',
        },
        {
          title: '2. PolÃ­tiques',
          content:
            "Hem implementat polÃ­tiques per garantir que realitzem negocis de manera Ã¨tica i transparent. Aquestes inclouen:\n\n- PolÃ­tica de ContractaciÃ³: Operem una polÃ­tica de contractaciÃ³ sÃ²lida, que inclou la realitzaciÃ³ de comprovacions d'elegibilitat per treballar per a tots els empleats amb la finalitat de protegir contra el trÃ fic de persones o les persones obligades a treballar en contra de la seva voluntat.\n- PolÃ­tica de DenÃºncies: Operem una polÃ­tica de denÃºncies perquÃ¨ tots els empleats sÃ piguen que poden plantejar inquietuds sobre com es tracta els colÂ·legues, o prÃ ctiques dins del nostre negoci o cadena de subministrament, sense por a represÃ lies.\n- Codi de Conducta: Aquest codi explica la manera en quÃ¨ ens comportem com a organitzaciÃ³ i com esperem que actuÃ¯n els nostres empleats i proveÃ¯dors.",
        },
        {
          title: '3. Cadena de Subministrament',
          content:
            "La nostra cadena de subministrament inclou proveÃ¯dors de maquinari i programari de TI, serveis professionals (legals, comptables) i serveis de gestiÃ³ d'oficines. Realitzem la deguda diligÃ¨ncia amb tots els proveÃ¯dors abans de permetre'ls convertir-se en proveÃ¯dors preferents.",
        },
        {
          title: '4. AvaluaciÃ³ de Riscos',
          content:
            "Considerem que el risc d'esclavitud moderna dins del nostre negoci Ã©s baix. No obstant aixÃ², ens mantenim vigilants i revisem els nostres riscos regularment.",
        },
        {
          title: '5. FormaciÃ³',
          content:
            "Per garantir un alt nivell de comprensiÃ³ dels riscos de l'esclavitud moderna i el trÃ fic de persones en les nostres cadenes de subministrament i el nostre negoci, oferim formaciÃ³ al nostre personal.",
        },
        {
          title: '6. Passos Futurs',
          content:
            "Continuarem revisant les nostres polÃ­tiques i procediments per garantir que siguin efectius per prevenir que es produeixi l'esclavitud moderna en el nostre negoci o cadena de subministrament.",
        },
      ],
    },
    ru: {
      title: 'Ð—Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ Ð¾ ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð¼ Ñ€Ð°Ð±ÑÑ‚Ð²Ðµ',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 15 Ð¼Ð°Ñ€Ñ‚Ð° 2024 Ð³.',
      intro:
        'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰Ð°Ñ‚ÑŒ Ð°ÐºÑ‚Ñ‹ ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±ÑÑ‚Ð²Ð° Ð¸ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸ Ð»ÑŽÐ´ÑŒÐ¼Ð¸ Ð² Ñ€Ð°Ð¼ÐºÐ°Ñ… ÑÐ²Ð¾ÐµÐ³Ð¾ Ð±Ð¸Ð·Ð½ÐµÑÐ° Ð¸ Ñ†ÐµÐ¿Ð¾Ñ‡ÐºÐ¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº Ð¸ Ð¿Ñ€ÐµÐ´ÑŠÑÐ²Ð»ÑÐµÑ‚ Ñ‚Ð°ÐºÐ¸Ðµ Ð¶Ðµ Ð²Ñ‹ÑÐ¾ÐºÐ¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº ÑÐ²Ð¾Ð¸Ð¼ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°Ð¼.',
      sections: [
        {
          title: '1. Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð¸ Ð±Ð¸Ð·Ð½ÐµÑ',
          content:
            'EKA Balance â€” ÑÑ‚Ð¾ Ñ†Ð¸Ñ„Ñ€Ð¾Ð²Ð°Ñ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð° Ð¿ÑÐ¸Ñ…Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ Ð·Ð´Ð¾Ñ€Ð¾Ð²ÑŒÑ, Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‰Ð°Ñ Ð¿Ð¾ Ð²ÑÐµÐ¼Ñƒ Ð¼Ð¸Ñ€Ñƒ. ÐœÑ‹ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÐ¼ Ñ ÑÐµÑ‚ÑŒÑŽ Ñ‚ÐµÑ€Ð°Ð¿ÐµÐ²Ñ‚Ð¾Ð², Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð² Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¹ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð¾Ð² Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð½Ð°ÑˆÐ¸Ñ… ÑƒÑÐ»ÑƒÐ³.',
        },
        {
          title: '2. ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸',
          content:
            'ÐœÑ‹ Ð²Ð½ÐµÐ´Ñ€Ð¸Ð»Ð¸ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸, Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ðµ, Ñ‡Ñ‚Ð¾ Ð¼Ñ‹ Ð²ÐµÐ´ÐµÐ¼ Ð±Ð¸Ð·Ð½ÐµÑ ÑÑ‚Ð¸Ñ‡Ð½Ð¾ Ð¸ Ð¿Ñ€Ð¾Ð·Ñ€Ð°Ñ‡Ð½Ð¾. Ðš Ð½Ð¸Ð¼ Ð¾Ñ‚Ð½Ð¾ÑÑÑ‚ÑÑ:\n\n- ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð½Ð°Ð¹Ð¼Ð°: ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ð½Ð°Ð´ÐµÐ¶Ð½ÑƒÑŽ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ Ð½Ð°Ð¹Ð¼Ð°, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÑƒ Ð¿Ñ€Ð°Ð²Ð° Ð½Ð° Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ Ð´Ð»Ñ Ð²ÑÐµÑ… ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð², Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð·Ð°Ñ‰Ð¸Ñ‚Ð¸Ñ‚ÑŒ Ð¾Ñ‚ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸ Ð»ÑŽÐ´ÑŒÐ¼Ð¸ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¸Ð½ÑƒÐ¶Ð´ÐµÐ½Ð¸Ñ Ð»ÑŽÐ´ÐµÐ¹ Ðº Ñ€Ð°Ð±Ð¾Ñ‚Ðµ Ð¿Ñ€Ð¾Ñ‚Ð¸Ð² Ð¸Ñ… Ð²Ð¾Ð»Ð¸.\n- ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÑÑ…: ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¾ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÑÑ…, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð²ÑÐµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð·Ð½Ð°Ð»Ð¸, Ñ‡Ñ‚Ð¾ Ð¾Ð½Ð¸ Ð¼Ð¾Ð³ÑƒÑ‚ Ð²Ñ‹ÑÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ð¾Ð¿Ð°ÑÐµÐ½Ð¸Ñ Ð¿Ð¾ Ð¿Ð¾Ð²Ð¾Ð´Ñƒ Ñ‚Ð¾Ð³Ð¾, ÐºÐ°Ðº Ð¾Ð±Ñ€Ð°Ñ‰Ð°ÑŽÑ‚ÑÑ Ñ ÐºÐ¾Ð»Ð»ÐµÐ³Ð°Ð¼Ð¸, Ð¸Ð»Ð¸ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ¸ Ð² Ð½Ð°ÑˆÐµÐ¼ Ð±Ð¸Ð·Ð½ÐµÑÐµ Ð¸Ð»Ð¸ Ñ†ÐµÐ¿Ð¾Ñ‡ÐºÐµ Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº, Ð½Ðµ Ð¾Ð¿Ð°ÑÐ°ÑÑÑŒ Ñ€ÐµÐ¿Ñ€ÐµÑÑÐ¸Ð¹.\n- ÐšÐ¾Ð´ÐµÐºÑ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ: Ð­Ñ‚Ð¾Ñ‚ ÐºÐ¾Ð´ÐµÐºÑ Ð¾Ð±ÑŠÑÑÐ½ÑÐµÑ‚, ÐºÐ°Ðº Ð¼Ñ‹ Ð²ÐµÐ´ÐµÐ¼ ÑÐµÐ±Ñ ÐºÐ°Ðº Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¸ ÐºÐ°Ðº Ð¼Ñ‹ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð±ÑƒÐ´ÑƒÑ‚ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸.',
        },
        {
          title: '3. Ð¦ÐµÐ¿Ð¾Ñ‡ÐºÐ° Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº',
          content:
            'ÐÐ°ÑˆÐ° Ñ†ÐµÐ¿Ð¾Ñ‡ÐºÐ° Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð² Ð˜Ð¢-Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ð³Ð¾ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ, Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸ (ÑŽÑ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ, Ð±ÑƒÑ…Ð³Ð°Ð»Ñ‚ÐµÑ€ÑÐºÐ¸Ðµ) Ð¸ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð¿Ð¾ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸ÑŽ Ð¾Ñ„Ð¸ÑÐ¾Ð¼. ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ ÐºÐ¾Ð¼Ð¿Ð»ÐµÐºÑÐ½ÑƒÑŽ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÑƒ Ð²ÑÐµÑ… Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð², Ð¿Ñ€ÐµÐ¶Ð´Ðµ Ñ‡ÐµÐ¼ Ñ€Ð°Ð·Ñ€ÐµÑˆÐ¸Ñ‚ÑŒ Ð¸Ð¼ ÑÑ‚Ð°Ñ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ñ‡Ñ‚Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð¼.',
        },
        {
          title: '4. ÐžÑ†ÐµÐ½ÐºÐ° Ñ€Ð¸ÑÐºÐ¾Ð²',
          content:
            'ÐœÑ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÐ¼ Ñ€Ð¸ÑÐº ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±ÑÑ‚Ð²Ð° Ð² Ð½Ð°ÑˆÐµÐ¼ Ð±Ð¸Ð·Ð½ÐµÑÐµ Ð½Ð¸Ð·ÐºÐ¸Ð¼. Ð¢ÐµÐ¼ Ð½Ðµ Ð¼ÐµÐ½ÐµÐµ, Ð¼Ñ‹ ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÐµÐ¼ Ð±Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾ Ð¿ÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°ÐµÐ¼ Ð½Ð°ÑˆÐ¸ Ñ€Ð¸ÑÐºÐ¸.',
        },
        {
          title: '5. ÐžÐ±ÑƒÑ‡ÐµÐ½Ð¸Ðµ',
          content:
            'Ð§Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð²Ñ‹ÑÐ¾ÐºÐ¸Ð¹ ÑƒÑ€Ð¾Ð²ÐµÐ½ÑŒ Ð¿Ð¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ñ Ñ€Ð¸ÑÐºÐ¾Ð² ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±ÑÑ‚Ð²Ð° Ð¸ Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸ Ð»ÑŽÐ´ÑŒÐ¼Ð¸ Ð² Ð½Ð°ÑˆÐ¸Ñ… Ñ†ÐµÐ¿Ð¾Ñ‡ÐºÐ°Ñ… Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº Ð¸ Ð½Ð°ÑˆÐµÐ¼ Ð±Ð¸Ð·Ð½ÐµÑÐµ, Ð¼Ñ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð½Ð°ÑˆÐ¸Ñ… ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð².',
        },
        {
          title: '6. Ð‘ÑƒÐ´ÑƒÑ‰Ð¸Ðµ ÑˆÐ°Ð³Ð¸',
          content:
            'ÐœÑ‹ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ð¼ Ð¿ÐµÑ€ÐµÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸Ñ… ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð² Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ð¸ ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±ÑÑ‚Ð²Ð° Ð² Ð½Ð°ÑˆÐµÐ¼ Ð±Ð¸Ð·Ð½ÐµÑÐµ Ð¸Ð»Ð¸ Ñ†ÐµÐ¿Ð¾Ñ‡ÐºÐµ Ð¿Ð¾ÑÑ‚Ð°Ð²Ð¾Ðº.',
        },
      ],
    },
  };

  return (
    <div className="bg-muted/30 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Legal Center</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Globe className="text-muted-foreground h-4 w-4" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-muted-foreground cursor-pointer border-none bg-transparent text-sm font-medium focus:ring-0"
            >
              <option value="en">English</option>
              <option value="es">EspaÃ±ol</option>
              <option value="ca">CatalÃ </option>
              <option value="ru">Ð ÑƒÑÑÐºÐ¸Ð¹</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-card rounded-lg p-8 shadow-sm md:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Scale className="h-8 w-8 text-indigo-600" />
          </div>

          <h1 className="text-foreground mb-4 text-center text-3xl font-semibold md:text-4xl">
            {content[language].title}
          </h1>

          <p className="text-muted-foreground mb-12 text-center">{content[language].lastUpdated}</p>

          <div className="prose prose-lg text-muted-foreground max-w-none">
            <p className="lead text-foreground mb-8 text-xl">{content[language].intro}</p>

            <div className="space-y-8">
              {content[language].sections.map((section, index) => (
                <div key={index} className="border-b border-border pb-8 last:border-0">
                  <h2 className="text-foreground mb-4 text-xl font-semibold">{section.title}</h2>
                  <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 border-border mt-12 rounded-xl border p-6">
            <p className="text-muted-foreground text-center text-sm">
              {language === 'en' &&
                'This statement is made pursuant to section 54(1) of the Modern Slavery Act 2015.'}
              {language === 'es' &&
                'Esta declaraciÃ³n se realiza de conformidad con la secciÃ³n 54(1) de la Ley de Esclavitud Moderna de 2015.'}
              {language === 'ca' &&
                "Aquesta declaraciÃ³ es realitza de conformitat amb la secciÃ³ 54(1) de la Llei d'Esclavitud Moderna de 2015."}
              {language === 'ru' &&
                'Ð­Ñ‚Ð¾ Ð·Ð°ÑÐ²Ð»ÐµÐ½Ð¸Ðµ ÑÐ´ÐµÐ»Ð°Ð½Ð¾ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ñ€Ð°Ð·Ð´ÐµÐ»Ð¾Ð¼ 54(1) Ð—Ð°ÐºÐ¾Ð½Ð° Ð¾ ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ð¾Ð¼ Ñ€Ð°Ð±ÑÑ‚Ð²Ðµ 2015 Ð³Ð¾Ð´Ð°.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
