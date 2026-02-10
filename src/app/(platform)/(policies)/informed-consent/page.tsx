'use client';

import React, { useState } from 'react';
import { FileSignature, CheckSquare, AlertCircle, HelpCircle, UserPlus } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function InformedConsent() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Informed Consent Form',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This document serves as a general informed consent form for treatment at EKA Balance. Specific procedures may require additional consent forms. Please read this carefully and ask any questions you may have.',
      sections: [
        {
          title: '1. Consent to Treatment',
          icon: <FileSignature className="h-6 w-6 text-primary" />,
          text: 'I voluntarily consent to evaluation, assessment, and treatment by the providers at EKA Balance. I understand that I have the right to withdraw my consent at any time.',
        },
        {
          title: '2. Understanding Risks and Benefits',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'I understand that all treatments carry potential risks and benefits. My provider will explain the specific risks and benefits associated with my treatment plan, as well as any alternative options.',
        },
        {
          title: '3. Financial Responsibility',
          icon: <CheckSquare className="h-6 w-6 text-green-600" />,
          text: 'I understand that I am financially responsible for all charges incurred for the services provided, regardless of insurance coverage. I agree to pay for services at the time they are rendered unless other arrangements have been made.',
        },
        {
          title: '4. Emergency Situations',
          icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
          text: 'I understand that EKA Balance is not an emergency service. In case of a medical or psychiatric emergency, I agree to call emergency services (112 or 911) or go to the nearest emergency room.',
        },
        {
          title: '5. Collaboration with Other Providers',
          icon: <UserPlus className="h-6 w-6 text-red-600" />,
          text: 'I authorize EKA Balance to communicate with my other healthcare providers as necessary for the coordination of my care, provided that such communication is in my best interest and complies with privacy laws.',
        },
      ],
    },
    es: {
      title: 'Formulario de Consentimiento Informado',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este documento sirve como un formulario de consentimiento informado general para el tratamiento en EKA Balance. Los procedimientos especÃ­ficos pueden requerir formularios de consentimiento adicionales. Lea esto detenidamente y haga cualquier pregunta que pueda tener.',
      sections: [
        {
          title: '1. Consentimiento para el Tratamiento',
          icon: <FileSignature className="h-6 w-6 text-primary" />,
          text: 'Doy mi consentimiento voluntario para la evaluaciÃ³n, valoraciÃ³n y tratamiento por parte de los proveedores de EKA Balance. Entiendo que tengo derecho a retirar mi consentimiento en cualquier momento.',
        },
        {
          title: '2. ComprensiÃ³n de Riesgos y Beneficios',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Entiendo que todos los tratamientos conllevan riesgos y beneficios potenciales. Mi proveedor explicarÃ¡ los riesgos y beneficios especÃ­ficos asociados con mi plan de tratamiento, asÃ­ como cualquier opciÃ³n alternativa.',
        },
        {
          title: '3. Responsabilidad Financiera',
          icon: <CheckSquare className="h-6 w-6 text-green-600" />,
          text: 'Entiendo que soy financieramente responsable de todos los cargos incurridos por los servicios prestados, independientemente de la cobertura del seguro. Acepto pagar los servicios en el momento en que se presten, a menos que se hayan hecho otros arreglos.',
        },
        {
          title: '4. Situaciones de Emergencia',
          icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
          text: 'Entiendo que EKA Balance no es un servicio de emergencia. En caso de una emergencia mÃ©dica o psiquiÃ¡trica, acepto llamar a los servicios de emergencia (112 o 911) o acudir a la sala de emergencias mÃ¡s cercana.',
        },
        {
          title: '5. ColaboraciÃ³n con Otros Proveedores',
          icon: <UserPlus className="h-6 w-6 text-red-600" />,
          text: 'Autorizo a EKA Balance a comunicarse con mis otros proveedores de atenciÃ³n mÃ©dica segÃºn sea necesario para la coordinaciÃ³n de mi atenciÃ³n, siempre que dicha comunicaciÃ³n sea en mi mejor interÃ©s y cumpla con las leyes de privacidad.',
        },
      ],
    },
    ca: {
      title: 'Formulari de Consentiment Informat',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'Aquest document serveix com a formulari de consentiment informat general per al tractament a EKA Balance. Els procediments especÃ­fics poden requerir formularis de consentiment addicionals. Llegiu-ho detingudament i feu qualsevol pregunta que tingueu.',
      sections: [
        {
          title: '1. Consentiment per al Tractament',
          icon: <FileSignature className="h-6 w-6 text-primary" />,
          text: "Dono el meu consentiment voluntari per a l'avaluaciÃ³, valoraciÃ³ i tractament per part dels proveÃ¯dors d'EKA Balance. Entenc que tinc dret a retirar el meu consentiment en qualsevol moment.",
        },
        {
          title: '2. ComprensiÃ³ de Riscos i Beneficis',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Entenc que tots els tractaments comporten riscos i beneficis potencials. El meu proveÃ¯dor explicarÃ  els riscos i beneficis especÃ­fics associats amb el meu pla de tractament, aixÃ­ com qualsevol opciÃ³ alternativa.',
        },
        {
          title: '3. Responsabilitat Financera',
          icon: <CheckSquare className="h-6 w-6 text-green-600" />,
          text: "Entenc que sÃ³c financerament responsable de tots els cÃ rrecs incorreguts pels serveis prestats, independentment de la cobertura de l'asseguranÃ§a. Accepto pagar els serveis en el moment en quÃ¨ es prestin, tret que s'hagin fet altres acords.",
        },
        {
          title: "4. Situacions d'EmergÃ¨ncia",
          icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
          text: "Entenc que EKA Balance no Ã©s un servei d'emergÃ¨ncia. En cas d'una emergÃ¨ncia mÃ¨dica o psiquiÃ trica, accepto trucar als serveis d'emergÃ¨ncia (112 o 911) o anar a la sala d'emergÃ¨ncies mÃ©s propera.",
        },
        {
          title: '5. ColÂ·laboraciÃ³ amb Altres ProveÃ¯dors',
          icon: <UserPlus className="h-6 w-6 text-red-600" />,
          text: "Autoritzo a EKA Balance a comunicar-se amb els meus altres proveÃ¯dors d'atenciÃ³ mÃ¨dica segons sigui necessari per a la coordinaciÃ³ de la meva atenciÃ³, sempre que aquesta comunicaciÃ³ sigui en el meu millor interÃ¨s i compleixi amb les lleis de privacitat.",
        },
      ],
    },
    ru: {
      title: 'Ð¤Ð¾Ñ€Ð¼Ð° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð¾Ñ‚ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚ ÑÐ»ÑƒÐ¶Ð¸Ñ‚ Ð¾Ð±Ñ‰ÐµÐ¹ Ñ„Ð¾Ñ€Ð¼Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ Ð½Ð° Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð² EKA Balance. ÐšÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹ Ð¼Ð¾Ð³ÑƒÑ‚ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ñ‚ÑŒ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ñ„Ð¾Ñ€Ð¼ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ. ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð²Ð½Ð¸Ð¼Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ ÑÑ‚Ð¾ Ð¸ Ð·Ð°Ð´Ð°Ð¹Ñ‚Ðµ Ð»ÑŽÐ±Ñ‹Ðµ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ñƒ Ð²Ð°Ñ Ð²Ð¾Ð·Ð½Ð¸ÐºÐ½ÑƒÑ‚ÑŒ.',
      sections: [
        {
          title: '1. Ð¡Ð¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð½Ð° Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ',
          icon: <FileSignature className="h-6 w-6 text-primary" />,
          text: 'Ð¯ Ð´Ð¾Ð±Ñ€Ð¾Ð²Ð¾Ð»ÑŒÐ½Ð¾ Ð´Ð°ÑŽ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð½Ð° Ð¾Ñ†ÐµÐ½ÐºÑƒ, Ð¾Ð±ÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ð»ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°Ð¼Ð¸ ÑƒÑÐ»ÑƒÐ³ EKA Balance. Ð¯ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÑŽ, Ñ‡Ñ‚Ð¾ Ð¸Ð¼ÐµÑŽ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚Ð¾Ð·Ð²Ð°Ñ‚ÑŒ ÑÐ²Ð¾Ðµ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ Ð² Ð»ÑŽÐ±Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ.',
        },
        {
          title: '2. ÐŸÐ¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ Ñ€Ð¸ÑÐºÐ¾Ð² Ð¸ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Ð¯ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÑŽ, Ñ‡Ñ‚Ð¾ Ð²ÑÐµ Ð¼ÐµÑ‚Ð¾Ð´Ñ‹ Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÑÑƒÑ‚ Ð¿Ð¾Ñ‚ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ñ€Ð¸ÑÐºÐ¸ Ð¸ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°. ÐœÐ¾Ð¹ Ð»ÐµÑ‡Ð°Ñ‰Ð¸Ð¹ Ð²Ñ€Ð°Ñ‡ Ð¾Ð±ÑŠÑÑÐ½Ð¸Ñ‚ ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ðµ Ñ€Ð¸ÑÐºÐ¸ Ð¸ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ñ Ð¼Ð¾Ð¸Ð¼ Ð¿Ð»Ð°Ð½Ð¾Ð¼ Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð»ÑŽÐ±Ñ‹Ðµ Ð°Ð»ÑŒÑ‚ÐµÑ€Ð½Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ðµ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ñ‹.',
        },
        {
          title: '3. Ð¤Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð°Ñ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ',
          icon: <CheckSquare className="h-6 w-6 text-green-600" />,
          text: 'Ð¯ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÑŽ, Ñ‡Ñ‚Ð¾ Ð½ÐµÑÑƒ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¾Ð²ÑƒÑŽ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð²ÑÐµ Ñ€Ð°ÑÑ…Ð¾Ð´Ñ‹, Ð¿Ð¾Ð½ÐµÑÐµÐ½Ð½Ñ‹Ðµ Ð·Ð° Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð½Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸, Ð½ÐµÐ·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ Ð¾Ñ‚ ÑÑ‚Ñ€Ð°Ñ…Ð¾Ð²Ð¾Ð³Ð¾ Ð¿Ð¾ÐºÑ€Ñ‹Ñ‚Ð¸Ñ. Ð¯ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÑŽÑÑŒ Ð¾Ð¿Ð»Ð°Ñ‡Ð¸Ð²Ð°Ñ‚ÑŒ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð² Ð¼Ð¾Ð¼ÐµÐ½Ñ‚ Ð¸Ñ… Ð¾ÐºÐ°Ð·Ð°Ð½Ð¸Ñ, ÐµÑÐ»Ð¸ Ð½Ðµ Ð±Ñ‹Ð»Ð¸ Ð¿Ñ€Ð¸Ð½ÑÑ‚Ñ‹ Ð¸Ð½Ñ‹Ðµ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ€ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '4. Ð§Ñ€ÐµÐ·Ð²Ñ‹Ñ‡Ð°Ð¹Ð½Ñ‹Ðµ ÑÐ¸Ñ‚ÑƒÐ°Ñ†Ð¸Ð¸',
          icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
          text: 'Ð¯ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÑŽ, Ñ‡Ñ‚Ð¾ EKA Balance Ð½Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ ÑÐ»ÑƒÐ¶Ð±Ð¾Ð¹ ÑÐºÑÑ‚Ñ€ÐµÐ½Ð½Ð¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸. Ð’ ÑÐ»ÑƒÑ‡Ð°Ðµ Ð½ÐµÐ¾Ñ‚Ð»Ð¾Ð¶Ð½Ð¾Ð¹ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¸Ð»Ð¸ Ð¿ÑÐ¸Ñ…Ð¸Ð°Ñ‚Ñ€Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸ Ñ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÑŽÑÑŒ Ð¿Ð¾Ð·Ð²Ð¾Ð½Ð¸Ñ‚ÑŒ Ð² ÑÐ»ÑƒÐ¶Ð±Ñƒ ÑÐºÑÑ‚Ñ€ÐµÐ½Ð½Ð¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸ (112 Ð¸Ð»Ð¸ 911) Ð¸Ð»Ð¸ Ð¾Ð±Ñ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ Ð² Ð±Ð»Ð¸Ð¶Ð°Ð¹ÑˆÐµÐµ Ð¾Ñ‚Ð´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð½ÐµÐ¾Ñ‚Ð»Ð¾Ð¶Ð½Ð¾Ð¹ Ð¿Ð¾Ð¼Ð¾Ñ‰Ð¸.',
        },
        {
          title: '5. Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ñ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°Ð¼Ð¸',
          icon: <UserPlus className="h-6 w-6 text-red-600" />,
          text: 'Ð¯ Ñ€Ð°Ð·Ñ€ÐµÑˆÐ°ÑŽ EKA Balance Ð¾Ð±Ñ‰Ð°Ñ‚ÑŒÑÑ Ñ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ð¼Ð¾Ð¸Ð¼Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°Ð¼Ð¸ Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ñ… ÑƒÑÐ»ÑƒÐ³ Ð¿Ð¾ Ð¼ÐµÑ€Ðµ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ ÐºÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ†Ð¸Ð¸ Ð¼Ð¾ÐµÐ³Ð¾ Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ, Ð¿Ñ€Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸Ð¸, Ñ‡Ñ‚Ð¾ Ñ‚Ð°ÐºÐ¾Ðµ Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ð²ÐµÑ‡Ð°ÐµÑ‚ Ð¼Ð¾Ð¸Ð¼ Ð¸Ð½Ñ‚ÐµÑ€ÐµÑÐ°Ð¼ Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚ Ð·Ð°ÐºÐ¾Ð½Ð°Ð¼ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸.',
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
        <div className="bg-linear-to-r from-blue-500 to-cyan-500 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <FileSignature className="h-12 w-12 opacity-90" />
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
