'use client';

import React, { useState } from 'react';
import { Ban, Gift, Globe, Shield, FileText } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function AntiBriberyPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Anti-Bribery & Corruption Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance has a zero-tolerance policy towards bribery and corruption. We are committed to acting professionally, fairly, and with integrity in all our business dealings and relationships wherever we operate.',
      sections: [
        {
          title: '1. Prohibition of Bribery',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Employees and partners must never offer, promise, give, request, agree to receive, or accept any bribe. A bribe is a financial or other advantage intended to induce or reward improper performance of a function or activity.',
        },
        {
          title: '2. Gifts and Hospitality',
          icon: <Gift className="h-6 w-6 text-purple-600" />,
          text: 'Gifts and hospitality must be reasonable, proportionate, and for a legitimate business purpose. They must never be used to influence a business decision or gain an unfair advantage. All gifts must be recorded transparently.',
        },
        {
          title: '3. Facilitation Payments',
          icon: <FileText className="h-6 w-6 text-primary" />,
          text: "We do not make, and will not accept, facilitation payments or 'kickbacks' of any kind. Facilitation payments are typically small, unofficial payments made to secure or expedite a routine government action.",
        },
        {
          title: '4. Third Parties',
          icon: <Globe className="h-6 w-6 text-green-600" />,
          text: 'We expect all third parties acting on our behalf to share our commitment to zero tolerance for bribery and corruption. We will conduct due diligence on third parties and monitor their compliance.',
        },
        {
          title: '5. Reporting and Whistleblowing',
          icon: <Shield className="h-6 w-6 text-indigo-600" />,
          text: 'We encourage employees and partners to report any suspicions of bribery or corruption. We provide a safe and confidential channel for reporting and protect whistleblowers from retaliation.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica AnticorrupciÃ³n y Soborno',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance tiene una polÃ­tica de tolerancia cero hacia el soborno y la corrupciÃ³n. Nos comprometemos a actuar de manera profesional, justa e Ã­ntegra en todos nuestros tratos y relaciones comerciales dondequiera que operemos.',
      sections: [
        {
          title: '1. ProhibiciÃ³n del Soborno',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Los empleados y socios nunca deben ofrecer, prometer, dar, solicitar, aceptar recibir o aceptar ningÃºn soborno. Un soborno es una ventaja financiera o de otro tipo destinada a inducir o recompensar el desempeÃ±o inadecuado de una funciÃ³n o actividad.',
        },
        {
          title: '2. Regalos y Hospitalidad',
          icon: <Gift className="h-6 w-6 text-purple-600" />,
          text: 'Los regalos y la hospitalidad deben ser razonables, proporcionados y con un propÃ³sito comercial legÃ­timo. Nunca deben usarse para influir en una decisiÃ³n comercial u obtener una ventaja injusta. Todos los regalos deben registrarse de forma transparente.',
        },
        {
          title: '3. Pagos de FacilitaciÃ³n',
          icon: <FileText className="h-6 w-6 text-primary" />,
          text: "No realizamos ni aceptaremos pagos de facilitaciÃ³n o 'comisiones ilegales' de ningÃºn tipo. Los pagos de facilitaciÃ³n suelen ser pequeÃ±os pagos no oficiales realizados para asegurar o acelerar una acciÃ³n gubernamental de rutina.",
        },
        {
          title: '4. Terceros',
          icon: <Globe className="h-6 w-6 text-green-600" />,
          text: 'Esperamos que todos los terceros que actÃºen en nuestro nombre compartan nuestro compromiso de tolerancia cero con el soborno y la corrupciÃ³n. Realizaremos la debida diligencia con terceros y supervisaremos su cumplimiento.',
        },
        {
          title: '5. Denuncias y Confidencialidad',
          icon: <Shield className="h-6 w-6 text-indigo-600" />,
          text: 'Alentamos a los empleados y socios a denunciar cualquier sospecha de soborno o corrupciÃ³n. Proporcionamos un canal seguro y confidencial para denunciar y protegemos a los denunciantes de represalias.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica AnticorrupciÃ³ i Suborn',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'EKA Balance tÃ© una polÃ­tica de tolerÃ ncia zero cap al suborn i la corrupciÃ³. Ens comprometem a actuar de manera professional, justa i Ã­ntegra en tots els nostres tractes i relacions comercials allÃ  on operem.',
      sections: [
        {
          title: '1. ProhibiciÃ³ del Suborn',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: "Els empleats i socis mai no han d'oferir, prometre, donar, solÂ·licitar, acceptar rebre o acceptar cap suborn. Un suborn Ã©s un avantatge financer o d'un altre tipus destinat a induir o recompensar l'exercici inadequat d'una funciÃ³ o activitat.",
        },
        {
          title: '2. Regals i Hospitalitat',
          icon: <Gift className="h-6 w-6 text-purple-600" />,
          text: "Els regals i l'hospitalitat han de ser raonables, proporcionats i amb un propÃ²sit comercial legÃ­tim. Mai no s'han d'utilitzar per influir en una decisiÃ³ comercial o obtenir un avantatge injust. Tots els regals s'han de registrar de manera transparent.",
        },
        {
          title: '3. Pagaments de FacilitaciÃ³',
          icon: <FileText className="h-6 w-6 text-primary" />,
          text: "No realitzem ni acceptarem pagaments de facilitaciÃ³ o 'comissions ilÂ·legals' de cap mena. Els pagaments de facilitaciÃ³ solen ser petits pagaments no oficials realitzats per assegurar o accelerar una acciÃ³ governamental de rutina.",
        },
        {
          title: '4. Tercers',
          icon: <Globe className="h-6 w-6 text-green-600" />,
          text: 'Esperem que tots els tercers que actuÃ¯n en nom nostre comparteixin el nostre compromÃ­s de tolerÃ ncia zero amb el suborn i la corrupciÃ³. Realitzarem la deguda diligÃ¨ncia amb tercers i supervisarem el seu compliment.',
        },
        {
          title: '5. DenÃºncies i Confidencialitat',
          icon: <Shield className="h-6 w-6 text-indigo-600" />,
          text: 'Encoratgem els empleats i socis a denunciar qualsevol sospita de suborn o corrupciÃ³. Proporcionem un canal segur i confidencial per denunciar i protegim els denunciants de represÃ lies.',
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¿Ð¾ Ð±Ð¾Ñ€ÑŒÐ±Ðµ ÑÐ¾ Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾Ð¼ Ð¸ ÐºÐ¾Ñ€Ñ€ÑƒÐ¿Ñ†Ð¸ÐµÐ¹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance Ð¿Ñ€Ð¸Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÑ‚ÑÑ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð½ÑƒÐ»ÐµÐ²Ð¾Ð¹ Ñ‚ÐµÑ€Ð¿Ð¸Ð¼Ð¾ÑÑ‚Ð¸ Ðº Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ñƒ Ð¸ ÐºÐ¾Ñ€Ñ€ÑƒÐ¿Ñ†Ð¸Ð¸. ÐœÑ‹ Ð¾Ð±ÑÐ·ÑƒÐµÐ¼ÑÑ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾, ÑÐ¿Ñ€Ð°Ð²ÐµÐ´Ð»Ð¸Ð²Ð¾ Ð¸ Ñ‡ÐµÑÑ‚Ð½Ð¾ Ð²Ð¾ Ð²ÑÐµÑ… Ð½Ð°ÑˆÐ¸Ñ… Ð´ÐµÐ»Ð¾Ð²Ñ‹Ñ… Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸ÑÑ…, Ð³Ð´Ðµ Ð±Ñ‹ Ð¼Ñ‹ Ð½Ð¸ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð»Ð¸.',
      sections: [
        {
          title: '1. Ð—Ð°Ð¿Ñ€ÐµÑ‚ Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ð°',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð¸ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ñ‹ Ð½Ð¸ÐºÐ¾Ð³Ð´Ð° Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¿Ñ€ÐµÐ´Ð»Ð°Ð³Ð°Ñ‚ÑŒ, Ð¾Ð±ÐµÑ‰Ð°Ñ‚ÑŒ, Ð´Ð°Ð²Ð°Ñ‚ÑŒ, Ð·Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°Ñ‚ÑŒ, ÑÐ¾Ð³Ð»Ð°ÑˆÐ°Ñ‚ÑŒÑÑ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ ÐºÐ°ÐºÐ¸Ðµ-Ð»Ð¸Ð±Ð¾ Ð²Ð·ÑÑ‚ÐºÐ¸. Ð’Ð·ÑÑ‚ÐºÐ° â€” ÑÑ‚Ð¾ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð¾Ðµ Ð¸Ð»Ð¸ Ð¸Ð½Ð¾Ðµ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð¾, Ð¿Ñ€ÐµÐ´Ð½Ð°Ð·Ð½Ð°Ñ‡ÐµÐ½Ð½Ð¾Ðµ Ð´Ð»Ñ Ð¿Ð¾Ð±ÑƒÐ¶Ð´ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð²Ð¾Ð·Ð½Ð°Ð³Ñ€Ð°Ð¶Ð´ÐµÐ½Ð¸Ñ Ð·Ð° Ð½ÐµÐ½Ð°Ð´Ð»ÐµÐ¶Ð°Ñ‰ÐµÐµ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¸Ð»Ð¸ Ð´ÐµÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '2. ÐŸÐ¾Ð´Ð°Ñ€ÐºÐ¸ Ð¸ Ð³Ð¾ÑÑ‚ÐµÐ¿Ñ€Ð¸Ð¸Ð¼ÑÑ‚Ð²Ð¾',
          icon: <Gift className="h-6 w-6 text-purple-600" />,
          text: 'ÐŸÐ¾Ð´Ð°Ñ€ÐºÐ¸ Ð¸ Ð³Ð¾ÑÑ‚ÐµÐ¿Ñ€Ð¸Ð¸Ð¼ÑÑ‚Ð²Ð¾ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ñ€Ð°Ð·ÑƒÐ¼Ð½Ñ‹Ð¼Ð¸, ÑÐ¾Ñ€Ð°Ð·Ð¼ÐµÑ€Ð½Ñ‹Ð¼Ð¸ Ð¸ Ð¸Ð¼ÐµÑ‚ÑŒ Ð·Ð°ÐºÐ¾Ð½Ð½ÑƒÑŽ Ð´ÐµÐ»Ð¾Ð²ÑƒÑŽ Ñ†ÐµÐ»ÑŒ. ÐžÐ½Ð¸ Ð½Ð¸ÐºÐ¾Ð³Ð´Ð° Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð´Ð»Ñ Ð²Ð»Ð¸ÑÐ½Ð¸Ñ Ð½Ð° Ð´ÐµÐ»Ð¾Ð²Ð¾Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÑÐ¿Ñ€Ð°Ð²ÐµÐ´Ð»Ð¸Ð²Ð¾Ð³Ð¾ Ð¿Ñ€ÐµÐ¸Ð¼ÑƒÑ‰ÐµÑÑ‚Ð²Ð°. Ð’ÑÐµ Ð¿Ð¾Ð´Ð°Ñ€ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð¿Ñ€Ð¾Ð·Ñ€Ð°Ñ‡Ð½Ð¾.',
        },
        {
          title: '3. ÐŸÐ»Ð°Ñ‚ÐµÐ¶Ð¸ Ð·Ð° ÑƒÐ¿Ñ€Ð¾Ñ‰ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÐµÐ¹',
          icon: <FileText className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð½Ðµ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ð¼ Ð¸ Ð½Ðµ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÐ¼ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸ Ð·Ð° ÑƒÐ¿Ñ€Ð¾Ñ‰ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÐµÐ¹ Ð¸Ð»Ð¸ Â«Ð¾Ñ‚ÐºÐ°Ñ‚Ñ‹Â» Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ñ€Ð¾Ð´Ð°. ÐŸÐ»Ð°Ñ‚ÐµÐ¶Ð¸ Ð·Ð° ÑƒÐ¿Ñ€Ð¾Ñ‰ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€Ð¼Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÐµÐ¹ â€” ÑÑ‚Ð¾, ÐºÐ°Ðº Ð¿Ñ€Ð°Ð²Ð¸Ð»Ð¾, Ð½ÐµÐ±Ð¾Ð»ÑŒÑˆÐ¸Ðµ Ð½ÐµÐ¾Ñ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸, Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ð¼Ñ‹Ðµ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ ÑƒÑÐºÐ¾Ñ€ÐµÐ½Ð¸Ñ Ñ€ÑƒÑ‚Ð¸Ð½Ð½Ñ‹Ñ… Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹ Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°.',
        },
        {
          title: '4. Ð¢Ñ€ÐµÑ‚ÑŒÐ¸ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹',
          icon: <Globe className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð²ÑÐµ Ñ‚Ñ€ÐµÑ‚ÑŒÐ¸ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹, Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ð¾Ñ‚ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð¸Ð¼ÐµÐ½Ð¸, Ñ€Ð°Ð·Ð´ÐµÐ»ÑÑŽÑ‚ Ð½Ð°ÑˆÑƒ Ð¿Ñ€Ð¸Ð²ÐµÑ€Ð¶ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð½ÑƒÐ»ÐµÐ²Ð¾Ð¹ Ñ‚ÐµÑ€Ð¿Ð¸Ð¼Ð¾ÑÑ‚Ð¸ Ðº Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ñƒ Ð¸ ÐºÐ¾Ñ€Ñ€ÑƒÐ¿Ñ†Ð¸Ð¸. ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ñ‚ÑŒ ÐºÐ¾Ð¼Ð¿Ð»ÐµÐºÑÐ½ÑƒÑŽ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÑƒ Ñ‚Ñ€ÐµÑ‚ÑŒÐ¸Ñ… ÑÑ‚Ð¾Ñ€Ð¾Ð½ Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸Ñ… ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ.',
        },
        {
          title: '5. ÐžÑ‚Ñ‡ÐµÑ‚Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <Shield className="h-6 w-6 text-indigo-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¸Ð·Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð² Ð¸ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð¾Ð² ÑÐ¾Ð¾Ð±Ñ‰Ð°Ñ‚ÑŒ Ð¾ Ð»ÑŽÐ±Ñ‹Ñ… Ð¿Ð¾Ð´Ð¾Ð·Ñ€ÐµÐ½Ð¸ÑÑ… Ð²Ð¾ Ð²Ð·ÑÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‡ÐµÑÑ‚Ð²Ðµ Ð¸Ð»Ð¸ ÐºÐ¾Ñ€Ñ€ÑƒÐ¿Ñ†Ð¸Ð¸. ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ñ‹Ð¹ Ð¸ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÐ°Ð½Ð°Ð» Ð´Ð»Ñ Ð¾Ñ‚Ñ‡ÐµÑ‚Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÐµÐ¼ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ð¾Ñ€Ð¾Ð² Ð¾Ñ‚ Ð¿Ñ€ÐµÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ.',
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
        <div className="bg-linear-to-r from-red-700 to-pink-700 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Ban className="h-12 w-12 opacity-90" />
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
