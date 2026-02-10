'use client';

import React, { useState } from 'react';
import { Truck, Globe, Users, ShieldCheck, Leaf } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function SupplierCodeOfConduct() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Supplier Code of Conduct',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to conducting business with integrity and in compliance with all applicable laws. We expect our suppliers and business partners to share this commitment.',
      sections: [
        {
          title: '1. Labor and Human Rights',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'Suppliers must uphold the human rights of workers and treat them with dignity and respect. This includes prohibiting forced labor, child labor, and discrimination. Suppliers must ensure safe working conditions, fair wages, and freedom of association.',
        },
        {
          title: '2. Health and Safety',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Suppliers must provide a safe and healthy work environment for all employees. This includes complying with all applicable health and safety laws, providing appropriate training, and minimizing workplace hazards.',
        },
        {
          title: '3. Environmental Responsibility',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Suppliers should minimize their environmental impact. This includes complying with environmental laws, reducing waste and emissions, and using resources efficiently. We encourage suppliers to adopt sustainable practices.',
        },
        {
          title: '4. Business Ethics',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Suppliers must conduct business ethically and transparently. This includes prohibiting bribery, corruption, and conflicts of interest. Suppliers must also respect intellectual property rights and protect confidential information.',
        },
        {
          title: '5. Compliance and Reporting',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'Suppliers are expected to monitor their own compliance with this Code. EKA Balance reserves the right to audit suppliers. Violations should be reported immediately. Failure to comply may result in termination of the business relationship.',
        },
      ],
    },
    es: {
      title: 'CÃ³digo de Conducta para Proveedores',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a realizar negocios con integridad y en cumplimiento de todas las leyes aplicables. Esperamos que nuestros proveedores y socios comerciales compartan este compromiso.',
      sections: [
        {
          title: '1. Trabajo y Derechos Humanos',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'Los proveedores deben defender los derechos humanos de los trabajadores y tratarlos con dignidad y respeto. Esto incluye prohibir el trabajo forzoso, el trabajo infantil y la discriminaciÃ³n. Los proveedores deben garantizar condiciones de trabajo seguras, salarios justos y libertad de asociaciÃ³n.',
        },
        {
          title: '2. Salud y Seguridad',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Los proveedores deben proporcionar un entorno de trabajo seguro y saludable para todos los empleados. Esto incluye cumplir con todas las leyes de salud y seguridad aplicables, proporcionar capacitaciÃ³n adecuada y minimizar los riesgos en el lugar de trabajo.',
        },
        {
          title: '3. Responsabilidad Ambiental',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Los proveedores deben minimizar su impacto ambiental. Esto incluye cumplir con las leyes ambientales, reducir los residuos y las emisiones, y utilizar los recursos de manera eficiente. Alentamos a los proveedores a adoptar prÃ¡cticas sostenibles.',
        },
        {
          title: '4. Ã‰tica Empresarial',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Los proveedores deben realizar negocios de manera Ã©tica y transparente. Esto incluye prohibir el soborno, la corrupciÃ³n y los conflictos de intereses. Los proveedores tambiÃ©n deben respetar los derechos de propiedad intelectual y proteger la informaciÃ³n confidencial.',
        },
        {
          title: '5. Cumplimiento e Informes',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'Se espera que los proveedores supervisen su propio cumplimiento de este CÃ³digo. EKA Balance se reserva el derecho de auditar a los proveedores. Las violaciones deben informarse de inmediato. El incumplimiento puede resultar en la terminaciÃ³n de la relaciÃ³n comercial.',
        },
      ],
    },
    ca: {
      title: 'Codi de Conducta per a ProveÃ¯dors',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'EKA Balance es compromet a fer negocis amb integritat i complint totes les lleis aplicables. Esperem que els nostres proveÃ¯dors i socis comercials comparteixin aquest compromÃ­s.',
      sections: [
        {
          title: '1. Treball i Drets Humans',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: "Els proveÃ¯dors han de defensar els drets humans dels treballadors i tractar-los amb dignitat i respecte. AixÃ² inclou prohibir el treball forÃ§Ã³s, el treball infantil i la discriminaciÃ³. Els proveÃ¯dors han de garantir condicions de treball segures, salaris justos i llibertat d'associaciÃ³.",
        },
        {
          title: '2. Salut i Seguretat',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Els proveÃ¯dors han de proporcionar un entorn de treball segur i saludable per a tots els empleats. AixÃ² inclou complir amb totes les lleis de salut i seguretat aplicables, proporcionar formaciÃ³ adequada i minimitzar els riscos al lloc de treball.',
        },
        {
          title: '3. Responsabilitat Ambiental',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Els proveÃ¯dors han de minimitzar el seu impacte ambiental. AixÃ² inclou complir amb les lleis ambientals, reduir els residus i les emissions, i utilitzar els recursos de manera eficient. Encoratgem els proveÃ¯dors a adoptar prÃ ctiques sostenibles.',
        },
        {
          title: '4. Ãˆtica Empresarial',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: "Els proveÃ¯dors han de fer negocis de manera Ã¨tica i transparent. AixÃ² inclou prohibir el suborn, la corrupciÃ³ i els conflictes d'interessos. Els proveÃ¯dors tambÃ© han de respectar els drets de propietat intelÂ·lectual i protegir la informaciÃ³ confidencial.",
        },
        {
          title: '5. Compliment i Informes',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: "S'espera que els proveÃ¯dors supervisin el seu propi compliment d'aquest Codi. EKA Balance es reserva el dret d'auditar els proveÃ¯dors. Les violacions s'han d'informar immediatament. L'incompliment pot resultar en la terminaciÃ³ de la relaciÃ³ comercial.",
        },
      ],
    },
    ru: {
      title: 'ÐšÐ¾Ð´ÐµÐºÑ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð²',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð²ÐµÑÑ‚Ð¸ Ð±Ð¸Ð·Ð½ÐµÑ Ñ‡ÐµÑÑ‚Ð½Ð¾ Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ ÑÐ¾ Ð²ÑÐµÐ¼Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ð¼Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð°Ð¼Ð¸. ÐœÑ‹ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð½Ð°ÑˆÐ¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð¸ Ð´ÐµÐ»Ð¾Ð²Ñ‹Ðµ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ñ‹ Ñ€Ð°Ð·Ð´ÐµÐ»ÑÑŽÑ‚ ÑÑ‚Ð¾ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾.',
      sections: [
        {
          title: '1. Ð¢Ñ€ÑƒÐ´ Ð¸ Ð¿Ñ€Ð°Ð²Ð° Ñ‡ÐµÐ»Ð¾Ð²ÐµÐºÐ°',
          icon: <Users className="h-6 w-6 text-primary" />,
          text: 'ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ Ð¿Ñ€Ð°Ð²Ð° Ñ‡ÐµÐ»Ð¾Ð²ÐµÐºÐ° Ñ€Ð°Ð±Ð¾Ñ‚Ð½Ð¸ÐºÐ¾Ð² Ð¸ Ð¾Ñ‚Ð½Ð¾ÑÐ¸Ñ‚ÑŒÑÑ Ðº Ð½Ð¸Ð¼ Ñ Ð´Ð¾ÑÑ‚Ð¾Ð¸Ð½ÑÑ‚Ð²Ð¾Ð¼ Ð¸ ÑƒÐ²Ð°Ð¶ÐµÐ½Ð¸ÐµÐ¼. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð·Ð°Ð¿Ñ€ÐµÑ‚ Ð¿Ñ€Ð¸Ð½ÑƒÐ´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð³Ð¾ Ñ‚Ñ€ÑƒÐ´Ð°, Ð´ÐµÑ‚ÑÐºÐ¾Ð³Ð¾ Ñ‚Ñ€ÑƒÐ´Ð° Ð¸ Ð´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ð¸. ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ð²Ð°Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ñ‹Ðµ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ Ñ‚Ñ€ÑƒÐ´Ð°, ÑÐ¿Ñ€Ð°Ð²ÐµÐ´Ð»Ð¸Ð²ÑƒÑŽ Ð·Ð°Ñ€Ð°Ð±Ð¾Ñ‚Ð½ÑƒÑŽ Ð¿Ð»Ð°Ñ‚Ñƒ Ð¸ ÑÐ²Ð¾Ð±Ð¾Ð´Ñƒ Ð°ÑÑÐ¾Ñ†Ð¸Ð°Ñ†Ð¸Ð¹.',
        },
        {
          title: '2. Ð—Ð´Ð¾Ñ€Ð¾Ð²ÑŒÐµ Ð¸ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ð²Ð°Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½ÑƒÑŽ Ð¸ Ð·Ð´Ð¾Ñ€Ð¾Ð²ÑƒÑŽ Ñ€Ð°Ð±Ð¾Ñ‡ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ Ð´Ð»Ñ Ð²ÑÐµÑ… ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð². Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ñ… Ð·Ð°ÐºÐ¾Ð½Ð¾Ð² Ð¾Ð± Ð¾Ñ…Ñ€Ð°Ð½Ðµ Ñ‚Ñ€ÑƒÐ´Ð° Ð¸ Ñ‚ÐµÑ…Ð½Ð¸ÐºÐµ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸, Ð¿Ñ€Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ³Ð¾ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð¸ Ð¼Ð¸Ð½Ð¸Ð¼Ð¸Ð·Ð°Ñ†Ð¸ÑŽ Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÐµÐ¹ Ð½Ð° Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ¼ Ð¼ÐµÑÑ‚Ðµ.',
        },
        {
          title: '3. Ð­ÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¼Ð¸Ð½Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐ²Ð¾Ðµ Ð²Ð¾Ð·Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð°ÑŽÑ‰ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ ÑÐºÐ¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð·Ð°ÐºÐ¾Ð½Ð¾Ð², ÑÐ¾ÐºÑ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ñ…Ð¾Ð´Ð¾Ð² Ð¸ Ð²Ñ‹Ð±Ñ€Ð¾ÑÐ¾Ð², Ð° Ñ‚Ð°ÐºÐ¶Ðµ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ€ÐµÑÑƒÑ€ÑÐ¾Ð². ÐœÑ‹ Ð¿Ð¾Ð¾Ñ‰Ñ€ÑÐµÐ¼ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð² Ð²Ð½ÐµÐ´Ñ€ÑÑ‚ÑŒ ÑƒÑÑ‚Ð¾Ð¹Ñ‡Ð¸Ð²Ñ‹Ðµ Ð¿Ñ€Ð°ÐºÑ‚Ð¸ÐºÐ¸.',
        },
        {
          title: '4. Ð”ÐµÐ»Ð¾Ð²Ð°Ñ ÑÑ‚Ð¸ÐºÐ°',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð²ÐµÑÑ‚Ð¸ Ð±Ð¸Ð·Ð½ÐµÑ ÑÑ‚Ð¸Ñ‡Ð½Ð¾ Ð¸ Ð¿Ñ€Ð¾Ð·Ñ€Ð°Ñ‡Ð½Ð¾. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð·Ð°Ð¿Ñ€ÐµÑ‚ Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ð°, ÐºÐ¾Ñ€Ñ€ÑƒÐ¿Ñ†Ð¸Ð¸ Ð¸ ÐºÐ¾Ð½Ñ„Ð»Ð¸ÐºÑ‚Ð¾Ð² Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ¾Ð². ÐŸÐ¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ñ‚Ð°ÐºÐ¶Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ ÑƒÐ²Ð°Ð¶Ð°Ñ‚ÑŒ Ð¿Ñ€Ð°Ð²Ð° Ð¸Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹ ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ.',
        },
        {
          title: '5. Ð¡Ð¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð¸ Ð¾Ñ‚Ñ‡ÐµÑ‚Ð½Ð¾ÑÑ‚ÑŒ',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'ÐžÐ¶Ð¸Ð´Ð°ÐµÑ‚ÑÑ, Ñ‡Ñ‚Ð¾ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¸ Ð±ÑƒÐ´ÑƒÑ‚ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð¸Ð¼Ð¸ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ³Ð¾ ÐšÐ¾Ð´ÐµÐºÑÐ°. EKA Balance Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ñ‚ÑŒ Ð°ÑƒÐ´Ð¸Ñ‚ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð². Ðž Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÑÑ… ÑÐ»ÐµÐ´ÑƒÐµÑ‚ ÑÐ¾Ð¾Ð±Ñ‰Ð°Ñ‚ÑŒ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾. ÐÐµÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ñ€Ð¸Ð²ÐµÑÑ‚Ð¸ Ðº Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰ÐµÐ½Ð¸ÑŽ Ð´ÐµÐ»Ð¾Ð²Ñ‹Ñ… Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¹.',
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
        <div className="bg-linear-to-r from-orange-600 to-red-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Truck className="h-12 w-12 opacity-90" />
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
