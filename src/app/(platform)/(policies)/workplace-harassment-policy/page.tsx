'use client';

import React, { useState } from 'react';
import { Ban, Users, MessageCircle, Gavel, HeartHandshake } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function WorkplaceHarassmentPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Workplace Harassment Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to providing a work environment that is free from harassment and discrimination. We have a zero-tolerance policy for any form of harassment based on race, color, religion, sex, national origin, age, disability, or any other protected characteristic.',
      sections: [
        {
          title: '1. Definition of Harassment',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Harassment includes unwelcome conduct that is based on a protected characteristic. This can include offensive jokes, slurs, epithets or name calling, physical assaults or threats, intimidation, ridicule or mockery, insults or put-downs, offensive objects or pictures, and interference with work performance.',
        },
        {
          title: '2. Sexual Harassment',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'Sexual harassment includes unwelcome sexual advances, requests for sexual favors, and other verbal or physical conduct of a sexual nature. This applies to conduct between employees, as well as between employees and clients or other third parties.',
        },
        {
          title: '3. Reporting Procedure',
          icon: <MessageCircle className="h-6 w-6 text-primary" />,
          text: 'If you believe you have been subjected to harassment, you should report it immediately to your supervisor, HR department, or through our anonymous reporting channel. All complaints will be investigated promptly and impartially.',
        },
        {
          title: '4. No Retaliation',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'We strictly prohibit retaliation against any individual who reports harassment or participates in an investigation. Retaliation is a serious violation of this policy and will result in disciplinary action.',
        },
        {
          title: '5. Disciplinary Action',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Any employee found to have engaged in harassment will be subject to disciplinary action, up to and including termination of employment. We may also take legal action if appropriate.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Acoso Laboral',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a proporcionar un entorno de trabajo libre de acoso y discriminaciÃ³n. Tenemos una polÃ­tica de tolerancia cero para cualquier forma de acoso basado en raza, color, religiÃ³n, sexo, origen nacional, edad, discapacidad o cualquier otra caracterÃ­stica protegida.',
      sections: [
        {
          title: '1. DefiniciÃ³n de Acoso',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'El acoso incluye conductas no deseadas basadas en una caracterÃ­stica protegida. Esto puede incluir bromas ofensivas, insultos, epÃ­tetos o apodos, agresiones fÃ­sicas o amenazas, intimidaciÃ³n, burlas o mofas, insultos o menosprecios, objetos o imÃ¡genes ofensivos e interferencia con el desempeÃ±o laboral.',
        },
        {
          title: '2. Acoso Sexual',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'El acoso sexual incluye insinuaciones sexuales no deseadas, solicitudes de favores sexuales y otra conducta verbal o fÃ­sica de naturaleza sexual. Esto se aplica a la conducta entre empleados, asÃ­ como entre empleados y clientes u otros terceros.',
        },
        {
          title: '3. Procedimiento de Denuncia',
          icon: <MessageCircle className="h-6 w-6 text-primary" />,
          text: 'Si cree que ha sido objeto de acoso, debe informarlo de inmediato a su supervisor, al departamento de recursos humanos o a travÃ©s de nuestro canal de denuncia anÃ³nimo. Todas las quejas se investigarÃ¡n de manera rÃ¡pida e imparcial.',
        },
        {
          title: '4. No Represalias',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'Prohibimos estrictamente las represalias contra cualquier persona que denuncie acoso o participe en una investigaciÃ³n. Las represalias son una violaciÃ³n grave de esta polÃ­tica y darÃ¡n lugar a medidas disciplinarias.',
        },
        {
          title: '5. AcciÃ³n Disciplinaria',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Cualquier empleado que se descubra que ha participado en acoso estarÃ¡ sujeto a medidas disciplinarias, hasta e incluyendo la terminaciÃ³n del empleo. TambiÃ©n podemos tomar acciones legales si es apropiado.',
        },
      ],
    },
    ca: {
      title: "PolÃ­tica d'Assetjament Laboral",
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "EKA Balance es compromet a proporcionar un entorn de treball lliure d'assetjament i discriminaciÃ³. Tenim una polÃ­tica de tolerÃ ncia zero per a qualsevol forma d'assetjament basat en raÃ§a, color, religiÃ³, sexe, origen nacional, edat, discapacitat o qualsevol altra caracterÃ­stica protegida.",
      sections: [
        {
          title: "1. DefiniciÃ³ d'Assetjament",
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: "L'assetjament inclou conductes no desitjades basades en una caracterÃ­stica protegida. AixÃ² pot incloure acudits ofensius, insults, epÃ­tets o malnoms, agressions fÃ­siques o amenaces, intimidaciÃ³, burles o mofes, insults o menyspreus, objectes o imatges ofensius i interferÃ¨ncia amb el rendiment laboral.",
        },
        {
          title: '2. Assetjament Sexual',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: "L'assetjament sexual inclou insinuacions sexuals no desitjades, solÂ·licituds de favors sexuals i altra conducta verbal o fÃ­sica de naturalesa sexual. AixÃ² s'aplica a la conducta entre empleats, aixÃ­ com entre empleats i clients o altres tercers.",
        },
        {
          title: '3. Procediment de DenÃºncia',
          icon: <MessageCircle className="h-6 w-6 text-primary" />,
          text: "Si creieu que heu estat objecte d'assetjament, heu d'informar-ne immediatament al vostre supervisor, al departament de recursos humans o a travÃ©s del nostre canal de denÃºncia anÃ²nim. Totes les queixes s'investigaran de manera rÃ pida i imparcial.",
        },
        {
          title: '4. No RepresÃ lies',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: "Prohibim estrictament les represÃ lies contra qualsevol persona que denunciÃ¯ assetjament o participi en una investigaciÃ³. Les represÃ lies sÃ³n una violaciÃ³ greu d'aquesta polÃ­tica i donaran lloc a mesures disciplinÃ ries.",
        },
        {
          title: '5. AcciÃ³ DisciplinÃ ria',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: "Qualsevol empleat que es descobreixi que ha participat en assetjament estarÃ  subjecte a mesures disciplinÃ ries, fins i tot la terminaciÃ³ de l'ocupaciÃ³. TambÃ© podem emprendre accions legals si Ã©s apropiat.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð² Ð½Ð° Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ¼ Ð¼ÐµÑÑ‚Ðµ',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‡ÑƒÑŽ ÑÑ€ÐµÐ´Ñƒ, ÑÐ²Ð¾Ð±Ð¾Ð´Ð½ÑƒÑŽ Ð¾Ñ‚ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð² Ð¸ Ð´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ð¸. Ð£ Ð½Ð°Ñ Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÐµÑ‚ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð°Ð±ÑÐ¾Ð»ÑŽÑ‚Ð½Ð¾Ð¹ Ð½ÐµÑ‚ÐµÑ€Ð¿Ð¸Ð¼Ð¾ÑÑ‚Ð¸ Ðº Ð»ÑŽÐ±Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð² Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ñ€Ð°ÑÑ‹, Ñ†Ð²ÐµÑ‚Ð° ÐºÐ¾Ð¶Ð¸, Ñ€ÐµÐ»Ð¸Ð³Ð¸Ð¸, Ð¿Ð¾Ð»Ð°, Ð½Ð°Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð¶Ð´ÐµÐ½Ð¸Ñ, Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð°, Ð¸Ð½Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ÑÑ‚Ð¸ Ð¸Ð»Ð¸ Ð»ÑŽÐ±Ð¾Ð¹ Ð´Ñ€ÑƒÐ³Ð¾Ð¹ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÐµÐ¼Ð¾Ð¹ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐ¸.',
      sections: [
        {
          title: '1. ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Ð”Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð½ÐµÐ¶ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ, Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð½Ð¾Ðµ Ð½Ð° Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÐµÐ¼Ð¾Ð¹ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð¸ÑÑ‚Ð¸ÐºÐµ. Ð­Ñ‚Ð¾ Ð¼Ð¾Ð¶ÐµÑ‚ Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒ Ð¾ÑÐºÐ¾Ñ€Ð±Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑˆÑƒÑ‚ÐºÐ¸, Ð¾ÑÐºÐ¾Ñ€Ð±Ð»ÐµÐ½Ð¸Ñ, ÑÐ¿Ð¸Ñ‚ÐµÑ‚Ñ‹ Ð¸Ð»Ð¸ Ð¾Ð±Ð·Ñ‹Ð²Ð°Ð½Ð¸Ñ, Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð½Ð°Ð¿Ð°Ð´ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ ÑƒÐ³Ñ€Ð¾Ð·Ñ‹, Ð·Ð°Ð¿ÑƒÐ³Ð¸Ð²Ð°Ð½Ð¸Ðµ, Ð½Ð°ÑÐ¼ÐµÑˆÐºÐ¸ Ð¸Ð»Ð¸ Ð¸Ð·Ð´ÐµÐ²Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°, Ð¾ÑÐºÐ¾Ñ€Ð±Ð»ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ ÑƒÐ½Ð¸Ð¶ÐµÐ½Ð¸Ñ, Ð¾ÑÐºÐ¾Ñ€Ð±Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚Ñ‹ Ð¸Ð»Ð¸ Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð²Ð¼ÐµÑˆÐ°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ Ð² Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹.',
        },
        {
          title: '2. Ð¡ÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'Ð¡ÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð½ÐµÐ¶ÐµÐ»Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ ÑÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°, Ð¿Ñ€Ð¾ÑÑŒÐ±Ñ‹ Ð¾ ÑÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ñ‹Ñ… ÑƒÑÐ»ÑƒÐ³Ð°Ñ… Ð¸ Ð´Ñ€ÑƒÐ³Ð¾Ðµ ÑÐ»Ð¾Ð²ÐµÑÐ½Ð¾Ðµ Ð¸Ð»Ð¸ Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ ÑÐµÐºÑÑƒÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€Ð°. Ð­Ñ‚Ð¾ Ð¾Ñ‚Ð½Ð¾ÑÐ¸Ñ‚ÑÑ Ðº Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸ÑŽ Ð¼ÐµÐ¶Ð´Ñƒ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ°Ð¼Ð¸, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð¼ÐµÐ¶Ð´Ñƒ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ°Ð¼Ð¸ Ð¸ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°Ð¼Ð¸ Ð¸Ð»Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ñ‚Ñ€ÐµÑ‚ÑŒÐ¸Ð¼Ð¸ Ð»Ð¸Ñ†Ð°Ð¼Ð¸.',
        },
        {
          title: '3. ÐŸÑ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ð° Ð¿Ð¾Ð´Ð°Ñ‡Ð¸ Ð¶Ð°Ð»Ð¾Ð±Ñ‹',
          icon: <MessageCircle className="h-6 w-6 text-primary" />,
          text: 'Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ Ð¿Ð¾Ð´Ð²ÐµÑ€Ð³Ð»Ð¸ÑÑŒ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°Ð¼, Ð²Ð°Ð¼ ÑÐ»ÐµÐ´ÑƒÐµÑ‚ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ ÑÐ¾Ð¾Ð±Ñ‰Ð¸Ñ‚ÑŒ Ð¾Ð± ÑÑ‚Ð¾Ð¼ ÑÐ²Ð¾ÐµÐ¼Ñƒ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŽ, Ð² Ð¾Ñ‚Ð´ÐµÐ» ÐºÐ°Ð´Ñ€Ð¾Ð² Ð¸Ð»Ð¸ Ñ‡ÐµÑ€ÐµÐ· Ð½Ð°Ñˆ Ð°Ð½Ð¾Ð½Ð¸Ð¼Ð½Ñ‹Ð¹ ÐºÐ°Ð½Ð°Ð» Ð¾Ñ‚Ñ‡ÐµÑ‚Ð½Ð¾ÑÑ‚Ð¸. Ð’ÑÐµ Ð¶Ð°Ð»Ð¾Ð±Ñ‹ Ð±ÑƒÐ´ÑƒÑ‚ Ñ€Ð°ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ñ‹ Ð±Ñ‹ÑÑ‚Ñ€Ð¾ Ð¸ Ð±ÐµÑÐ¿Ñ€Ð¸ÑÑ‚Ñ€Ð°ÑÑ‚Ð½Ð¾.',
        },
        {
          title: '4. ÐžÑ‚ÑÑƒÑ‚ÑÑ‚Ð²Ð¸Ðµ Ð²Ð¾Ð·Ð¼ÐµÐ·Ð´Ð¸Ñ',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ ÑÑ‚Ñ€Ð¾Ð³Ð¾ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ð°ÐµÐ¼ Ð¿Ñ€ÐµÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð»ÑŽÐ±Ð¾Ð³Ð¾ Ð»Ð¸Ñ†Ð°, ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ðµ ÑÐ¾Ð¾Ð±Ñ‰Ð°ÐµÑ‚ Ð¾ Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°Ñ… Ð¸Ð»Ð¸ ÑƒÑ‡Ð°ÑÑ‚Ð²ÑƒÐµÑ‚ Ð² Ñ€Ð°ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ð¸. Ð’Ð¾Ð·Ð¼ÐµÐ·Ð´Ð¸Ðµ ÑÐ²Ð»ÑÐµÑ‚ÑÑ ÑÐµÑ€ÑŒÐµÐ·Ð½Ñ‹Ð¼ Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸ÐµÐ¼ ÑÑ‚Ð¾Ð¹ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¸ Ð¿Ð¾Ð²Ð»ÐµÑ‡ÐµÑ‚ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°Ñ€Ð½Ñ‹Ðµ Ð¼ÐµÑ€Ñ‹.',
        },
        {
          title: '5. Ð”Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°Ñ€Ð½Ñ‹Ðµ Ð¼ÐµÑ€Ñ‹',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Ð›ÑŽÐ±Ð¾Ð¹ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸Ðº, ÑƒÐ»Ð¸Ñ‡ÐµÐ½Ð½Ñ‹Ð¹ Ð² Ð´Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°Ñ…, Ð±ÑƒÐ´ÐµÑ‚ Ð¿Ð¾Ð´Ð²ÐµÑ€Ð³Ð½ÑƒÑ‚ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°Ñ€Ð½Ñ‹Ð¼ Ð¼ÐµÑ€Ð°Ð¼, Ð²Ð¿Ð»Ð¾Ñ‚ÑŒ Ð´Ð¾ ÑƒÐ²Ð¾Ð»ÑŒÐ½ÐµÐ½Ð¸Ñ. ÐœÑ‹ Ñ‚Ð°ÐºÐ¶Ðµ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸Ð½ÑÑ‚ÑŒ ÑŽÑ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ, ÐµÑÐ»Ð¸ ÑÑ‚Ð¾ ÑƒÐ¼ÐµÑÑ‚Ð½Ð¾.',
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
        <div className="bg-linear-to-r from-red-600 to-rose-600 px-8 py-12 text-primary-foreground">
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
