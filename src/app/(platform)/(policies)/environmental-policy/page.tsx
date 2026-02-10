'use client';

import { useState } from 'react';
import { Globe, ArrowLeft, Leaf } from 'lucide-react';
import Link from 'next/link';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function EnvironmentalPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Environmental Policy',
      lastUpdated: 'Last Updated: March 15, 2024',
      intro:
        'EKA Balance recognizes that it has a responsibility to the environment beyond legal and regulatory requirements. We are committed to reducing our environmental impact and continually improving our environmental performance as an integral part of our business strategy and operating methods.',
      sections: [
        {
          title: '1. Responsibility',
          content:
            'The CEO is responsible for ensuring that the environmental policy is implemented. However, all employees have a responsibility in their area to ensure that the aims and objectives of the policy are met.',
        },
        {
          title: '2. Policy Aims',
          content:
            'We endeavor to:\n\n- Comply with and exceed all relevant regulatory requirements.\n- Continually improve and monitor environmental performance.\n- Continually improve and reduce environmental impacts.\n- Incorporate environmental factors into business decisions.\n- Increase employee awareness and training.',
        },
        {
          title: '3. Paper',
          content:
            '- We will minimize the use of paper in the office.\n- We will reduce packaging as much as possible.\n- We will seek to buy recycled and recyclable paper products.\n- We will reuse and recycle all paper where possible.',
        },
        {
          title: '4. Energy and Water',
          content:
            '- We will seek to reduce the amount of energy used as much as possible.\n- Lights and electrical equipment will be switched off when not in use.\n- Heating will be adjusted with energy consumption in mind.\n- The energy consumption and efficiency of new products will be taken into account when purchasing.',
        },
        {
          title: '5. Office Supplies',
          content:
            '- We will evaluate if the need can be met in another way.\n- We will evaluate if renting/sharing is an option before purchasing equipment.\n- We will evaluate the environmental impact of any new products we intend to purchase.\n- We will favor more environmentally friendly and efficient products wherever possible.',
        },
        {
          title: '6. Transportation',
          content:
            '- We will reduce the need to travel, restricting to necessity trips only.\n- We will promote the use of travel alternatives such as e-mail or video/phone conferencing.\n- We will make additional efforts to accommodate the needs of those using public transport or bicycles.',
        },
        {
          title: '7. Maintenance and Cleaning',
          content:
            '- Cleaning materials used will be as environmentally friendly as possible.\n- Materials used in office refurbishment will be as environmentally friendly as possible.\n- We will only use licensed and appropriate organizations to dispose of waste.',
        },
        {
          title: '8. Monitoring and Improvement',
          content:
            '- We will comply with and exceed all relevant regulatory requirements.\n- We will continually improve and monitor environmental performance.\n- We will continually improve and reduce environmental impacts.\n- We will incorporate environmental factors into business decisions.\n- We will increase employee awareness and training.',
        },
        {
          title: '9. Culture',
          content:
            '- We will involve staff in the implementation of this policy, for greater commitment and improved performance.\n- We will update this policy at least once annually in consultation with staff and other stakeholders where necessary.\n- We will provide staff with relevant environmental training.\n- We will work with suppliers, contractors and sub-contractors to improve their environmental performance.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica Ambiental',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 15 de marzo de 2024',
      intro:
        'EKA Balance reconoce que tiene una responsabilidad con el medio ambiente mÃ¡s allÃ¡ de los requisitos legales y reglamentarios. Estamos comprometidos a reducir nuestro impacto ambiental y mejorar continuamente nuestro desempeÃ±o ambiental como parte integral de nuestra estrategia comercial y mÃ©todos operativos.',
      sections: [
        {
          title: '1. Responsabilidad',
          content:
            'El CEO es responsable de garantizar que se implemente la polÃ­tica ambiental. Sin embargo, todos los empleados tienen la responsabilidad en su Ã¡rea de garantizar que se cumplan los objetivos de la polÃ­tica.',
        },
        {
          title: '2. Objetivos de la PolÃ­tica',
          content:
            'Nos esforzamos por:\n\n- Cumplir y superar todos los requisitos reglamentarios pertinentes.\n- Mejorar y monitorear continuamente el desempeÃ±o ambiental.\n- Mejorar y reducir continuamente los impactos ambientales.\n- Incorporar factores ambientales en las decisiones comerciales.\n- Aumentar la conciencia y la formaciÃ³n de los empleados.',
        },
        {
          title: '3. Papel',
          content:
            '- Minimizaremos el uso de papel en la oficina.\n- Reduciremos el embalaje tanto como sea posible.\n- Buscaremos comprar productos de papel reciclado y reciclable.\n- Reutilizaremos y reciclaremos todo el papel siempre que sea posible.',
        },
        {
          title: '4. EnergÃ­a y Agua',
          content:
            '- Buscaremos reducir la cantidad de energÃ­a utilizada tanto como sea posible.\n- Las luces y los equipos elÃ©ctricos se apagarÃ¡n cuando no estÃ©n en uso.\n- La calefacciÃ³n se ajustarÃ¡ teniendo en cuenta el consumo de energÃ­a.\n- El consumo de energÃ­a y la eficiencia de los nuevos productos se tendrÃ¡n en cuenta al comprar.',
        },
        {
          title: '5. Suministros de Oficina',
          content:
            '- Evaluaremos si la necesidad se puede satisfacer de otra manera.\n- Evaluaremos si alquilar/compartir es una opciÃ³n antes de comprar equipos.\n- Evaluaremos el impacto ambiental de cualquier producto nuevo que tengamos la intenciÃ³n de comprar.\n- Favoreceremos productos mÃ¡s ecolÃ³gicos y eficientes siempre que sea posible.',
        },
        {
          title: '6. Transporte',
          content:
            '- Reduciremos la necesidad de viajar, restringiÃ©ndonos solo a viajes necesarios.\n- Promoveremos el uso de alternativas de viaje como el correo electrÃ³nico o las videoconferencias/conferencias telefÃ³nicas.\n- Haremos esfuerzos adicionales para satisfacer las necesidades de quienes utilizan el transporte pÃºblico o bicicletas.',
        },
        {
          title: '7. Mantenimiento y Limpieza',
          content:
            '- Los materiales de limpieza utilizados serÃ¡n lo mÃ¡s ecolÃ³gicos posible.\n- Los materiales utilizados en la remodelaciÃ³n de oficinas serÃ¡n lo mÃ¡s ecolÃ³gicos posible.\n- Solo utilizaremos organizaciones autorizadas y apropiadas para eliminar los residuos.',
        },
        {
          title: '8. Monitoreo y Mejora',
          content:
            '- Cumpliremos y superaremos todos los requisitos reglamentarios pertinentes.\n- Mejoraremos y monitorearemos continuamente el desempeÃ±o ambiental.\n- Mejoraremos y reduciremos continuamente los impactos ambientales.\n- Incorporaremos factores ambientales en las decisiones comerciales.\n- Aumentaremos la conciencia y la formaciÃ³n de los empleados.',
        },
        {
          title: '9. Cultura',
          content:
            '- Involucraremos al personal en la implementaciÃ³n de esta polÃ­tica, para un mayor compromiso y un mejor desempeÃ±o.\n- Actualizaremos esta polÃ­tica al menos una vez al aÃ±o en consulta con el personal y otras partes interesadas cuando sea necesario.\n- Proporcionaremos al personal formaciÃ³n ambiental relevante.\n- Trabajaremos con proveedores, contratistas y subcontratistas para mejorar su desempeÃ±o ambiental.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica Ambiental',
      lastUpdated: 'Ãšltima actualitzaciÃ³: 15 de marÃ§ de 2024',
      intro:
        'EKA Balance reconeix que tÃ© una responsabilitat amb el medi ambient mÃ©s enllÃ  dels requisits legals i reglamentaris. Estem compromesos a reduir el nostre impacte ambiental i millorar contÃ­nuament el nostre rendiment ambiental com a part integral de la nostra estratÃ¨gia comercial i mÃ¨todes operatius.',
      sections: [
        {
          title: '1. Responsabilitat',
          content:
            "El CEO Ã©s responsable de garantir que s'implementi la polÃ­tica ambiental. No obstant aixÃ², tots els empleats tenen la responsabilitat en la seva Ã rea de garantir que es compleixin els objectius de la polÃ­tica.",
        },
        {
          title: '2. Objectius de la PolÃ­tica',
          content:
            'Ens esforcem per:\n\n- Complir i superar tots els requisits reglamentaris pertinents.\n- Millorar i monitoritzar contÃ­nuament el rendiment ambiental.\n- Millorar i reduir contÃ­nuament els impactes ambientals.\n- Incorporar factors ambientals en les decisions comercials.\n- Augmentar la consciÃ¨ncia i la formaciÃ³ dels empleats.',
        },
        {
          title: '3. Paper',
          content:
            "- Minimitzarem l'Ãºs de paper a l'oficina.\n- Reduirem l'embalatge tant com sigui possible.\n- Buscarem comprar productes de paper reciclat i reciclable.\n- Reutilitzarem i reciclarem tot el paper sempre que sigui possible.",
        },
        {
          title: '4. Energia i Aigua',
          content:
            "- Buscarem reduir la quantitat d'energia utilitzada tant com sigui possible.\n- Els llums i els equips elÃ¨ctrics s'apagaran quan no estiguin en Ãºs.\n- La calefacciÃ³ s'ajustarÃ  tenint en compte el consum d'energia.\n- El consum d'energia i l'eficiÃ¨ncia dels nous productes es tindran en compte en comprar.",
        },
        {
          title: "5. Subministraments d'Oficina",
          content:
            "- Avaluarem si la necessitat es pot satisfer d'una altra manera.\n- Avaluarem si llogar/compartir Ã©s una opciÃ³ abans de comprar equips.\n- Avaluarem l'impacte ambiental de qualsevol producte nou que tinguem la intenciÃ³ de comprar.\n- Afavorirem productes mÃ©s ecolÃ²gics i eficients sempre que sigui possible.",
        },
        {
          title: '6. Transport',
          content:
            "- Reduirem la necessitat de viatjar, restringint-nos nomÃ©s a viatges necessaris.\n- Promourem l'Ãºs d'alternatives de viatge com el correu electrÃ²nic o les videoconferÃ¨ncies/conferÃ¨ncies telefÃ²niques.\n- Farem esforÃ§os addicionals per satisfer les necessitats dels qui utilitzen el transport pÃºblic o bicicletes.",
        },
        {
          title: '7. Manteniment i Neteja',
          content:
            "- Els materials de neteja utilitzats seran el mÃ©s ecolÃ²gics possible.\n- Els materials utilitzats en la remodelaciÃ³ d'oficines seran el mÃ©s ecolÃ²gics possible.\n- NomÃ©s utilitzarem organitzacions autoritzades i apropiades per eliminar els residus.",
        },
        {
          title: '8. MonitoritzaciÃ³ i Millora',
          content:
            '- Complirem i superarem tots els requisits reglamentaris pertinents.\n- Millorarem i monitoritzarem contÃ­nuament el rendiment ambiental.\n- Millorarem i reduirem contÃ­nuament els impactes ambientals.\n- Incorporarem factors ambientals en les decisions comercials.\n- Augmentarem la consciÃ¨ncia i la formaciÃ³ dels empleats.',
        },
        {
          title: '9. Cultura',
          content:
            "- Involucrarem el personal en la implementaciÃ³ d'aquesta polÃ­tica, per a un major compromÃ­s i un millor rendiment.\n- Actualitzarem aquesta polÃ­tica almenys una vegada a l'any en consulta amb el personal i altres parts interessades quan sigui necessari.\n- Proporcionarem al personal formaciÃ³ ambiental rellevant.\n- Treballarem amb proveÃ¯dors, contractistes i subcontractistes per millorar el seu rendiment ambiental.",
        },
      ],
    },
    ru: {
      title: 'Ð­ÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ°',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 15 Ð¼Ð°Ñ€Ñ‚Ð° 2024 Ð³.',
      intro:
        'EKA Balance Ð¿Ñ€Ð¸Ð·Ð½Ð°ÐµÑ‚, Ñ‡Ñ‚Ð¾ Ð½ÐµÑÐµÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð¿ÐµÑ€ÐµÐ´ Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÐµÐ¹ ÑÑ€ÐµÐ´Ð¾Ð¹, Ð²Ñ‹Ñ…Ð¾Ð´ÑÑ‰ÑƒÑŽ Ð·Ð° Ñ€Ð°Ð¼ÐºÐ¸ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¸ Ð½Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ñ… Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ð¹. ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ ÑÐ½Ð¸Ð·Ð¸Ñ‚ÑŒ Ð½Ð°ÑˆÐµ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ Ð¸ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸ ÐºÐ°Ðº Ð½ÐµÐ¾Ñ‚ÑŠÐµÐ¼Ð»ÐµÐ¼ÑƒÑŽ Ñ‡Ð°ÑÑ‚ÑŒ Ð½Ð°ÑˆÐµÐ¹ Ð±Ð¸Ð·Ð½ÐµÑ-ÑÑ‚Ñ€Ð°Ñ‚ÐµÐ³Ð¸Ð¸ Ð¸ Ð¼ÐµÑ‚Ð¾Ð´Ð¾Ð² Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹.',
      sections: [
        {
          title: '1. ÐžÑ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
          content:
            'Ð“ÐµÐ½ÐµÑ€Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð´Ð¸Ñ€ÐµÐºÑ‚Ð¾Ñ€ Ð½ÐµÑÐµÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸. Ð¢ÐµÐ¼ Ð½Ðµ Ð¼ÐµÐ½ÐµÐµ, Ð²ÑÐµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð½ÐµÑÑƒÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð² ÑÐ²Ð¾ÐµÐ¹ Ð¾Ð±Ð»Ð°ÑÑ‚Ð¸ Ð·Ð° Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð´Ð¾ÑÑ‚Ð¸Ð¶ÐµÐ½Ð¸Ñ Ñ†ÐµÐ»ÐµÐ¹ Ð¸ Ð·Ð°Ð´Ð°Ñ‡ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸.',
        },
        {
          title: '2. Ð¦ÐµÐ»Ð¸ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸',
          content:
            'ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ:\n\n- Ð¡Ð¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ Ð¸ Ð¿Ñ€ÐµÐ²Ð¾ÑÑ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð²ÑÐµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ð½Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ.\n- ÐŸÐ¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸.\n- ÐŸÐ¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð¸ ÑÐ½Ð¸Ð¶Ð°Ñ‚ÑŒ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ.\n- Ð’ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ„Ð°ÐºÑ‚Ð¾Ñ€Ñ‹ Ð² Ð±Ð¸Ð·Ð½ÐµÑ-Ñ€ÐµÑˆÐµÐ½Ð¸Ñ.\n- ÐŸÐ¾Ð²Ñ‹ÑˆÐ°Ñ‚ÑŒ Ð¾ÑÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð².',
        },
        {
          title: '3. Ð‘ÑƒÐ¼Ð°Ð³Ð°',
          content:
            '- ÐœÑ‹ ÑÐ²ÐµÐ´ÐµÐ¼ Ðº Ð¼Ð¸Ð½Ð¸Ð¼ÑƒÐ¼Ñƒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð±ÑƒÐ¼Ð°Ð³Ð¸ Ð² Ð¾Ñ„Ð¸ÑÐµ.\n- ÐœÑ‹ ÑÐ¾ÐºÑ€Ð°Ñ‚Ð¸Ð¼ ÑƒÐ¿Ð°ÐºÐ¾Ð²ÐºÑƒ, Ð½Ð°ÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÑ‚Ð¾ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑŒÑÑ Ð¿Ð¾ÐºÑƒÐ¿Ð°Ñ‚ÑŒ Ð¿ÐµÑ€ÐµÑ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð¸ Ð¿Ñ€Ð¸Ð³Ð¾Ð´Ð½Ñ‹Ðµ Ð´Ð»Ñ Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¿ÐµÑ€ÐµÑ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð±ÑƒÐ¼Ð°Ð¶Ð½Ñ‹Ðµ Ð¸Ð·Ð´ÐµÐ»Ð¸Ñ.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸ Ð¿ÐµÑ€ÐµÑ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒ Ð²ÑÑŽ Ð±ÑƒÐ¼Ð°Ð³Ñƒ, Ð³Ð´Ðµ ÑÑ‚Ð¾ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾.',
        },
        {
          title: '4. Ð­Ð½ÐµÑ€Ð³Ð¸Ñ Ð¸ Ð²Ð¾Ð´Ð°',
          content:
            '- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑŒÑÑ ÑÐ¾ÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒ ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð»ÑÐµÐ¼Ð¾Ð¹ ÑÐ½ÐµÑ€Ð³Ð¸Ð¸, Ð½Ð°ÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÑ‚Ð¾ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾.\n- Ð¡Ð²ÐµÑ‚ Ð¸ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð±ÑƒÐ´ÑƒÑ‚ Ð²Ñ‹ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒÑÑ, ÐºÐ¾Ð³Ð´Ð° Ð¾Ð½Ð¸ Ð½Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ÑÑ.\n- ÐžÑ‚Ð¾Ð¿Ð»ÐµÐ½Ð¸Ðµ Ð±ÑƒÐ´ÐµÑ‚ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ñ ÑƒÑ‡ÐµÑ‚Ð¾Ð¼ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð»ÐµÐ½Ð¸Ñ ÑÐ½ÐµÑ€Ð³Ð¸Ð¸.\n- ÐŸÐ¾Ñ‚Ñ€ÐµÐ±Ð»ÐµÐ½Ð¸Ðµ ÑÐ½ÐµÑ€Ð³Ð¸Ð¸ Ð¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð½Ð¾Ð²Ñ‹Ñ… Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð² Ð±ÑƒÐ´ÑƒÑ‚ ÑƒÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒÑÑ Ð¿Ñ€Ð¸ Ð¿Ð¾ÐºÑƒÐ¿ÐºÐµ.',
        },
        {
          title: '5. ÐžÑ„Ð¸ÑÐ½Ñ‹Ðµ Ð¿Ñ€Ð¸Ð½Ð°Ð´Ð»ÐµÐ¶Ð½Ð¾ÑÑ‚Ð¸',
          content:
            '- ÐœÑ‹ Ð¾Ñ†ÐµÐ½Ð¸Ð¼, Ð¼Ð¾Ð¶Ð½Ð¾ Ð»Ð¸ ÑƒÐ´Ð¾Ð²Ð»ÐµÑ‚Ð²Ð¾Ñ€Ð¸Ñ‚ÑŒ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð¾ÑÑ‚ÑŒ Ð´Ñ€ÑƒÐ³Ð¸Ð¼ ÑÐ¿Ð¾ÑÐ¾Ð±Ð¾Ð¼.\n- ÐœÑ‹ Ð¾Ñ†ÐµÐ½Ð¸Ð¼, ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð»Ð¸ Ð°Ñ€ÐµÐ½Ð´Ð°/ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ð¾Ð¼ Ð¿ÐµÑ€ÐµÐ´ Ð¿Ð¾ÐºÑƒÐ¿ÐºÐ¾Ð¹ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ.\n- ÐœÑ‹ Ð¾Ñ†ÐµÐ½Ð¸Ð¼ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ Ð»ÑŽÐ±Ñ‹Ñ… Ð½Ð¾Ð²Ñ‹Ñ… Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð², ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¼Ñ‹ Ð½Ð°Ð¼ÐµÑ€ÐµÐ½Ñ‹ Ð¿Ñ€Ð¸Ð¾Ð±Ñ€ÐµÑÑ‚Ð¸.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¾Ñ‚Ð´Ð°Ð²Ð°Ñ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ñ‡Ñ‚ÐµÐ½Ð¸Ðµ Ð±Ð¾Ð»ÐµÐµ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸ Ñ‡Ð¸ÑÑ‚Ñ‹Ð¼ Ð¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¼ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð°Ð¼, Ð³Ð´Ðµ ÑÑ‚Ð¾ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾.',
        },
        {
          title: '6. Ð¢Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚',
          content:
            '- ÐœÑ‹ ÑÐ¾ÐºÑ€Ð°Ñ‚Ð¸Ð¼ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚ÑŒ Ð² Ð¿Ð¾ÐµÐ·Ð´ÐºÐ°Ñ…, Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡Ð¸Ð²Ð°ÑÑÑŒ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ð¼Ð¸ Ð¿Ð¾ÐµÐ·Ð´ÐºÐ°Ð¼Ð¸.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ð¾Ð¾Ñ‰Ñ€ÑÑ‚ÑŒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð² Ð¿Ð¾ÐµÐ·Ð´ÐºÐ°Ð¼, Ñ‚Ð°ÐºÐ¸Ñ… ÐºÐ°Ðº ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¿Ð¾Ñ‡Ñ‚Ð° Ð¸Ð»Ð¸ Ð²Ð¸Ð´ÐµÐ¾/Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð½Ñ‹Ðµ ÐºÐ¾Ð½Ñ„ÐµÑ€ÐµÐ½Ñ†Ð¸Ð¸.\n- ÐœÑ‹ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶Ð¸Ð¼ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑƒÑÐ¸Ð»Ð¸Ñ Ð´Ð»Ñ ÑƒÐ´Ð¾Ð²Ð»ÐµÑ‚Ð²Ð¾Ñ€ÐµÐ½Ð¸Ñ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð½Ð¾ÑÑ‚ÐµÐ¹ Ñ‚ÐµÑ…, ÐºÑ‚Ð¾ Ð¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð¾Ð±Ñ‰ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¼ Ñ‚Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚Ð¾Ð¼ Ð¸Ð»Ð¸ Ð²ÐµÐ»Ð¾ÑÐ¸Ð¿ÐµÐ´Ð°Ð¼Ð¸.',
        },
        {
          title: '7. Ð¢ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð¸ ÑƒÐ±Ð¾Ñ€ÐºÐ°',
          content:
            '- Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼Ñ‹Ðµ Ñ‡Ð¸ÑÑ‚ÑÑ‰Ð¸Ðµ ÑÑ€ÐµÐ´ÑÑ‚Ð²Ð° Ð±ÑƒÐ´ÑƒÑ‚ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸ Ñ‡Ð¸ÑÑ‚Ñ‹Ð¼Ð¸.\n- ÐœÐ°Ñ‚ÐµÑ€Ð¸Ð°Ð»Ñ‹, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼Ñ‹Ðµ Ð¿Ñ€Ð¸ Ñ€ÐµÐ¼Ð¾Ð½Ñ‚Ðµ Ð¾Ñ„Ð¸ÑÐ°, Ð±ÑƒÐ´ÑƒÑ‚ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸ Ñ‡Ð¸ÑÑ‚Ñ‹Ð¼Ð¸.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð´Ð»Ñ ÑƒÑ‚Ð¸Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð¾Ñ‚Ñ…Ð¾Ð´Ð¾Ð².',
        },
        {
          title: '8. ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ð¸ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ðµ',
          content:
            '- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ Ð¸ Ð¿Ñ€ÐµÐ²Ð¾ÑÑ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð²ÑÐµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ð½Ð¾Ñ€Ð¼Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»Ð¸.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ ÑƒÐ»ÑƒÑ‡ÑˆÐ°Ñ‚ÑŒ Ð¸ ÑÐ½Ð¸Ð¶Ð°Ñ‚ÑŒ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ„Ð°ÐºÑ‚Ð¾Ñ€Ñ‹ Ð² Ð±Ð¸Ð·Ð½ÐµÑ-Ñ€ÐµÑˆÐµÐ½Ð¸Ñ.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ð¾Ð²Ñ‹ÑˆÐ°Ñ‚ÑŒ Ð¾ÑÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð².',
        },
        {
          title: '9. ÐšÑƒÐ»ÑŒÑ‚ÑƒÑ€Ð°',
          content:
            '- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ñ€Ð¸Ð²Ð»ÐµÐºÐ°Ñ‚ÑŒ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð» Ðº Ñ€ÐµÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ ÑÑ‚Ð¾Ð¹ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð´Ð»Ñ Ð±Ð¾Ð»ÑŒÑˆÐµÐ¹ Ð¿Ñ€Ð¸Ð²ÐµÑ€Ð¶ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð¸ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ñ Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÐµÐ¹.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÑ‚ÑŒ ÑÑ‚Ñƒ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÑƒ Ð½Ðµ Ñ€ÐµÐ¶Ðµ Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð·Ð° Ð² Ð³Ð¾Ð´ Ð¿Ð¾ÑÐ»Ðµ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸Ð¹ Ñ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð¾Ð¼ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ð·Ð°Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ¾Ð²Ð°Ð½Ð½Ñ‹Ð¼Ð¸ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð°Ð¼Ð¸, Ð³Ð´Ðµ ÑÑ‚Ð¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾.\n- ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ð¼ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ñƒ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐµ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ.\n- ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ñ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°Ð¼Ð¸, Ð¿Ð¾Ð´Ñ€ÑÐ´Ñ‡Ð¸ÐºÐ°Ð¼Ð¸ Ð¸ ÑÑƒÐ±Ð¿Ð¾Ð´Ñ€ÑÐ´Ñ‡Ð¸ÐºÐ°Ð¼Ð¸ Ð´Ð»Ñ ÑƒÐ»ÑƒÑ‡ÑˆÐµÐ½Ð¸Ñ Ð¸Ñ… ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÐµÐ¹.',
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
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Leaf className="h-8 w-8 text-green-600" />
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
              {language === 'en' && 'We are committed to a sustainable future.'}
              {language === 'es' && 'Estamos comprometidos con un futuro sostenible.'}
              {language === 'ca' && 'Estem compromesos amb un futur sostenible.'}
              {language === 'ru' && 'ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ðº ÑƒÑÑ‚Ð¾Ð¹Ñ‡Ð¸Ð²Ð¾Ð¼Ñƒ Ð±ÑƒÐ´ÑƒÑ‰ÐµÐ¼Ñƒ.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
