'use client';

import React, { useState } from 'react';
import { Laptop, Wifi, Clock, Home, Shield } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function RemoteWorkPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Remote Work Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance supports remote work to provide flexibility and promote work-life balance. This policy outlines the guidelines and expectations for employees working remotely.',
      sections: [
        {
          title: '1. Eligibility and Approval',
          icon: <Home className="h-6 w-6 text-primary" />,
          text: 'Remote work is available to eligible employees whose roles allow for it. Approval must be obtained from the immediate supervisor and HR. We assess eligibility based on job responsibilities, performance, and the ability to work independently.',
        },
        {
          title: '2. Workspace and Equipment',
          icon: <Laptop className="text-muted-foreground h-6 w-6" />,
          text: 'Employees are responsible for maintaining a safe and productive workspace at home. EKA Balance provides necessary equipment, such as laptops and software. Employees must ensure they have a reliable internet connection.',
        },
        {
          title: '3. Security and Confidentiality',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'Security is paramount when working remotely. Employees must use secure connections (VPN), keep devices updated, and protect confidential information from unauthorized access. Physical security of devices must also be maintained.',
        },
        {
          title: '4. Availability and Communication',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'Remote employees are expected to be available during agreed-upon working hours. Regular communication with the team and supervisor is essential. We use various collaboration tools to stay connected and ensure seamless teamwork.',
        },
        {
          title: '5. Health and Well-being',
          icon: <Clock className="h-6 w-6 text-purple-600" />,
          text: 'We encourage employees to maintain a healthy work-life balance. This includes taking regular breaks, setting boundaries between work and personal time, and setting up an ergonomic workspace to prevent strain or injury.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Trabajo Remoto',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance apoya el trabajo remoto para brindar flexibilidad y promover el equilibrio entre la vida laboral y personal. Esta polÃ­tica describe las pautas y expectativas para los empleados que trabajan de forma remota.',
      sections: [
        {
          title: '1. Elegibilidad y AprobaciÃ³n',
          icon: <Home className="h-6 w-6 text-primary" />,
          text: 'El trabajo remoto estÃ¡ disponible para los empleados elegibles cuyos roles lo permitan. Se debe obtener la aprobaciÃ³n del supervisor inmediato y de RR.HH. Evaluamos la elegibilidad en funciÃ³n de las responsabilidades laborales, el desempeÃ±o y la capacidad para trabajar de forma independiente.',
        },
        {
          title: '2. Espacio de Trabajo y Equipo',
          icon: <Laptop className="text-muted-foreground h-6 w-6" />,
          text: 'Los empleados son responsables de mantener un espacio de trabajo seguro y productivo en casa. EKA Balance proporciona el equipo necesario, como computadoras portÃ¡tiles y software. Los empleados deben asegurarse de tener una conexiÃ³n a Internet confiable.',
        },
        {
          title: '3. Seguridad y Confidencialidad',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'La seguridad es primordial cuando se trabaja de forma remota. Los empleados deben usar conexiones seguras (VPN), mantener los dispositivos actualizados y proteger la informaciÃ³n confidencial del acceso no autorizado. TambiÃ©n se debe mantener la seguridad fÃ­sica de los dispositivos.',
        },
        {
          title: '4. Disponibilidad y ComunicaciÃ³n',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'Se espera que los empleados remotos estÃ©n disponibles durante las horas de trabajo acordadas. La comunicaciÃ³n regular con el equipo y el supervisor es esencial. Utilizamos varias herramientas de colaboraciÃ³n para mantenernos conectados y garantizar un trabajo en equipo fluido.',
        },
        {
          title: '5. Salud y Bienestar',
          icon: <Clock className="h-6 w-6 text-purple-600" />,
          text: 'Alentamos a los empleados a mantener un equilibrio saludable entre el trabajo y la vida personal. Esto incluye tomar descansos regulares, establecer lÃ­mites entre el trabajo y el tiempo personal, y configurar un espacio de trabajo ergonÃ³mico para evitar tensiones o lesiones.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de Treball Remot',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "EKA Balance dÃ³na suport al treball remot per oferir flexibilitat i promoure l'equilibri entre la vida laboral i personal. Aquesta polÃ­tica descriu les directrius i expectatives per als empleats que treballen de forma remota.",
      sections: [
        {
          title: '1. Elegibilitat i AprovaciÃ³',
          icon: <Home className="h-6 w-6 text-primary" />,
          text: "El treball remot estÃ  disponible per als empleats elegibles els rols dels quals ho permetin. S'ha d'obtenir l'aprovaciÃ³ del supervisor immediat i de RR.HH. Avaluem l'elegibilitat en funciÃ³ de les responsabilitats laborals, el rendiment i la capacitat per treballar de forma independent.",
        },
        {
          title: '2. Espai de Treball i Equip',
          icon: <Laptop className="text-muted-foreground h-6 w-6" />,
          text: "Els empleats sÃ³n responsables de mantenir un espai de treball segur i productiu a casa. EKA Balance proporciona l'equip necessari, com ordinadors portÃ tils i programari. Els empleats han d'assegurar-se de tenir una connexiÃ³ a Internet fiable.",
        },
        {
          title: '3. Seguretat i Confidencialitat',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: "La seguretat Ã©s primordial quan es treballa de forma remota. Els empleats han d'utilitzar connexions segures (VPN), mantenir els dispositius actualitzats i protegir la informaciÃ³ confidencial de l'accÃ©s no autoritzat. TambÃ© s'ha de mantenir la seguretat fÃ­sica dels dispositius.",
        },
        {
          title: '4. Disponibilitat i ComunicaciÃ³',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: "S'espera que els empleats remots estiguin disponibles durant les hores de treball acordades. La comunicaciÃ³ regular amb l'equip i el supervisor Ã©s essencial. Utilitzem diverses eines de colÂ·laboraciÃ³ per mantenir-nos connectats i garantir un treball en equip fluid.",
        },
        {
          title: '5. Salut i Benestar',
          icon: <Clock className="h-6 w-6 text-purple-600" />,
          text: 'Encoratgem els empleats a mantenir un equilibri saludable entre la feina i la vida personal. AixÃ² inclou fer pauses regulars, establir lÃ­mits entre la feina i el temps personal, i configurar un espai de treball ergonÃ²mic per evitar tensions o lesions.',
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° ÑƒÐ´Ð°Ð»ÐµÐ½Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÑ‚ ÑƒÐ´Ð°Ð»ÐµÐ½Ð½ÑƒÑŽ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð³Ð¸Ð±ÐºÐ¾ÑÑ‚ÑŒ Ð¸ ÑÐ¿Ð¾ÑÐ¾Ð±ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð±Ð°Ð»Ð°Ð½ÑÑƒ Ð¼ÐµÐ¶Ð´Ñƒ Ñ€Ð°Ð±Ð¾Ñ‚Ð¾Ð¹ Ð¸ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¶Ð¸Ð·Ð½ÑŒÑŽ. Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´ÑÑ‰Ð¸Ðµ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹ Ð¸ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ Ð´Ð»Ñ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð², Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÑŽÑ‰Ð¸Ñ… ÑƒÐ´Ð°Ð»ÐµÐ½Ð½Ð¾.',
      sections: [
        {
          title: '1. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° ÑƒÑ‡Ð°ÑÑ‚Ð¸Ðµ Ð¸ ÑƒÑ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ðµ',
          icon: <Home className="h-6 w-6 text-primary" />,
          text: 'Ð£Ð´Ð°Ð»ÐµÐ½Ð½Ð°Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð° Ð´Ð»Ñ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð², Ñ‡ÑŒÐ¸ Ñ€Ð¾Ð»Ð¸ ÑÑ‚Ð¾ Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÑŽÑ‚. ÐÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð¾Ð´Ð¾Ð±Ñ€ÐµÐ½Ð¸Ðµ Ð½ÐµÐ¿Ð¾ÑÑ€ÐµÐ´ÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»Ñ Ð¸ Ð¾Ñ‚Ð´ÐµÐ»Ð° ÐºÐ°Ð´Ñ€Ð¾Ð². ÐœÑ‹ Ð¾Ñ†ÐµÐ½Ð¸Ð²Ð°ÐµÐ¼ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° ÑƒÑ‡Ð°ÑÑ‚Ð¸Ðµ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ÑÑ‚Ð½Ñ‹Ñ… Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚ÐµÐ¹, Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸ ÑÐ¿Ð¾ÑÐ¾Ð±Ð½Ð¾ÑÑ‚Ð¸ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ ÑÐ°Ð¼Ð¾ÑÑ‚Ð¾ÑÑ‚ÐµÐ»ÑŒÐ½Ð¾.',
        },
        {
          title: '2. Ð Ð°Ð±Ð¾Ñ‡ÐµÐµ Ð¼ÐµÑÑ‚Ð¾ Ð¸ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <Laptop className="text-muted-foreground h-6 w-6" />,
          text: 'Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð½ÐµÑÑƒÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð°Ð½Ð¸Ðµ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾Ð³Ð¾ Ð¸ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¸Ð²Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ³Ð¾ Ð¼ÐµÑÑ‚Ð° Ð´Ð¾Ð¼Ð°. EKA Balance Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾Ðµ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ, Ñ‚Ð°ÐºÐ¾Ðµ ÐºÐ°Ðº Ð½Ð¾ÑƒÑ‚Ð±ÑƒÐºÐ¸ Ð¸ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ðµ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ. Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ Ð½Ð°Ð´ÐµÐ¶Ð½Ð¾Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ðº Ð˜Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚Ñƒ.',
        },
        {
          title: '3. Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸Ð¼ÐµÐµÑ‚ Ð¿ÐµÑ€Ð²Ð¾ÑÑ‚ÐµÐ¿ÐµÐ½Ð½Ð¾Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¸ ÑƒÐ´Ð°Ð»ÐµÐ½Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ. Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ñ‹Ðµ ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ñ (VPN), Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÑ‚ÑŒ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð° Ð¸ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¾Ñ‚ Ð½ÐµÑÐ°Ð½ÐºÑ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°. Ð¢Ð°ÐºÐ¶Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ð²Ð°Ñ‚ÑŒÑÑ Ñ„Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð².',
        },
        {
          title: '4. Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð¸ ÐºÐ¾Ð¼Ð¼ÑƒÐ½Ð¸ÐºÐ°Ñ†Ð¸Ñ',
          icon: <Wifi className="h-6 w-6 text-green-600" />,
          text: 'ÐžÐ¶Ð¸Ð´Ð°ÐµÑ‚ÑÑ, Ñ‡Ñ‚Ð¾ ÑƒÐ´Ð°Ð»ÐµÐ½Ð½Ñ‹Ðµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ð² ÑÐ¾Ð³Ð»Ð°ÑÐ¾Ð²Ð°Ð½Ð½Ð¾Ðµ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐµ Ð²Ñ€ÐµÐ¼Ñ. Ð ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾Ðµ Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ñ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾Ð¹ Ð¸ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¼ Ð¸Ð¼ÐµÐµÑ‚ Ð²Ð°Ð¶Ð½Ð¾Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ. ÐœÑ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ñ€Ð°Ð·Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð½Ð¾Ð¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾ÑÑ‚Ð°Ð²Ð°Ñ‚ÑŒÑÑ Ð½Ð° ÑÐ²ÑÐ·Ð¸ Ð¸ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ð²Ð°Ñ‚ÑŒ Ð±ÐµÑÐ¿ÐµÑ€ÐµÐ±Ð¾Ð¹Ð½ÑƒÑŽ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð½ÑƒÑŽ Ñ€Ð°Ð±Ð¾Ñ‚Ñƒ.',
        },
        {
          title: '5. Ð—Ð´Ð¾Ñ€Ð¾Ð²ÑŒÐµ Ð¸ Ð±Ð»Ð°Ð³Ð¾Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ðµ',
          icon: <Clock className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¸Ð·Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð² Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð·Ð´Ð¾Ñ€Ð¾Ð²Ñ‹Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ Ð¼ÐµÐ¶Ð´Ñƒ Ñ€Ð°Ð±Ð¾Ñ‚Ð¾Ð¹ Ð¸ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¶Ð¸Ð·Ð½ÑŒÑŽ. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð² ÑÐµÐ±Ñ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ñ‹Ðµ Ð¿ÐµÑ€ÐµÑ€Ñ‹Ð²Ñ‹, ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð³Ñ€Ð°Ð½Ð¸Ñ† Ð¼ÐµÐ¶Ð´Ñƒ Ñ€Ð°Ð±Ð¾Ñ‚Ð¾Ð¹ Ð¸ Ð»Ð¸Ñ‡Ð½Ñ‹Ð¼ Ð²Ñ€ÐµÐ¼ÐµÐ½ÐµÐ¼, Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸ÑŽ ÑÑ€Ð³Ð¾Ð½Ð¾Ð¼Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ³Ð¾ Ð¼ÐµÑÑ‚Ð° Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ Ð¿ÐµÑ€ÐµÐ½Ð°Ð¿Ñ€ÑÐ¶ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ñ‚Ñ€Ð°Ð²Ð¼.',
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
        <div className="bg-linear-to-r from-blue-600 to-emerald-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Laptop className="h-12 w-12 opacity-90" />
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
