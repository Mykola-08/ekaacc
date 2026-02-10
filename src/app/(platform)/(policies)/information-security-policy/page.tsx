'use client';

import React, { useState } from 'react';
import { Lock, Server, Key, ShieldCheck, FileWarning } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function InformationSecurityPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Information Security Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to protecting the confidentiality, integrity, and availability of our information assets. This policy outlines our approach to information security management.',
      sections: [
        {
          id: 'access-control',
          title: '1. Access Control',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'Access to information and systems is granted based on the principle of least privilege. Users are only granted access to the data and resources necessary for their role. Strong authentication measures, including multi-factor authentication, are enforced.',
        },
        {
          id: 'data-protection',
          title: '2. Data Protection',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'Sensitive data is encrypted both in transit and at rest. We implement strict controls to prevent unauthorized disclosure, modification, or destruction of data. Regular backups are performed to ensure data availability.',
        },
        {
          id: 'network-security',
          title: '3. Network Security',
          icon: <Server className="h-6 w-6 text-purple-600" />,
          text: 'Our network infrastructure is protected by firewalls, intrusion detection systems, and regular security assessments. We monitor network traffic for suspicious activity and maintain secure configurations for all network devices.',
        },
        {
          id: 'incident-management',
          title: '4. Incident Management',
          icon: <FileWarning className="h-6 w-6 text-orange-600" />,
          text: 'We have established procedures for reporting and responding to information security incidents. All employees are required to report suspected security breaches immediately. Incidents are investigated, and corrective actions are taken to prevent recurrence.',
        },
        {
          id: 'compliance',
          title: '5. Compliance and Auditing',
          icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
          text: 'We regularly audit our information security controls to ensure compliance with internal policies and external regulations. We are committed to continuous improvement of our information security management system.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Seguridad de la InformaciÃ³n',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a proteger la confidencialidad, integridad y disponibilidad de nuestros activos de informaciÃ³n. Esta polÃ­tica describe nuestro enfoque para la gestiÃ³n de la seguridad de la informaciÃ³n.',
      sections: [
        {
          id: 'access-control',
          title: '1. Control de Acceso',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'El acceso a la informaciÃ³n y los sistemas se otorga segÃºn el principio de privilegi mÃ­nimo. A los usuarios solo se les otorga acceso a los datos y recursos necesarios para su funciÃ³n. Se aplican medidas de autenticaciÃ³n sÃ³lidas, incluida la autenticaciÃ³n multifactor.',
        },
        {
          id: 'data-protection',
          title: '2. ProtecciÃ³n de Datos',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'Los datos confidenciales se cifran tanto en trÃ¡nsito como en reposo. Implementamos controles estrictos para evitar la divulgaciÃ³n, modificaciÃ³n o destrucciÃ³n no autorizada de datos. Se realizan copias de seguridad periÃ³dicas para garantizar la disponibilidad de los datos.',
        },
        {
          id: 'network-security',
          title: '3. Seguridad de la Red',
          icon: <Server className="h-6 w-6 text-purple-600" />,
          text: 'Nuestra infraestructura de red estÃ¡ protegida por firewalls, sistemas de detecciÃ³n de intrusos y evaluaciones de seguridad periÃ³dicas. Monitoreamos el trÃ¡fico de la red en busca de actividades sospechosas y mantenemos configuraciones seguras para todos los dispositivos de red.',
        },
        {
          id: 'incident-management',
          title: '4. GestiÃ³n de Incidentes',
          icon: <FileWarning className="h-6 w-6 text-orange-600" />,
          text: 'Hemos establecido procedimientos para informar y responder a incidentes de seguridad de la informaciÃ³n. Todos los empleados deben informar de inmediato las sospechas de violaciones de seguridad. Los incidentes se investigan y se toman medidas correctivas para evitar que vuelvan a ocurrir.',
        },
        {
          id: 'compliance',
          title: '5. Cumplimiento y AuditorÃ­a',
          icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
          text: 'Auditamos periÃ³dicamente nuestros controles de seguridad de la informaciÃ³n para garantizar el cumplimiento de las polÃ­ticas internas y las regulaciones externas. Estamos comprometidos con la mejora continua de nuestro sistema de gestiÃ³n de seguridad de la informaciÃ³n.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de Seguretat de la InformaciÃ³',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "EKA Balance es compromet a protegir la confidencialitat, integritat i disponibilitat dels nostres actius d'informaciÃ³. Aquesta polÃ­tica descriu el nostre enfocament per a la gestiÃ³ de la seguretat de la informaciÃ³.",
      sections: [
        {
          id: 'access-control',
          title: "1. Control d'AccÃ©s",
          icon: <Key className="h-6 w-6 text-primary" />,
          text: "L'accÃ©s a la informaciÃ³ i als sistemes s'atorga segons el principi de privilegi mÃ­nim. Als usuaris nomÃ©s se'ls atorga accÃ©s a les dades i recursos necessaris per a la seva funciÃ³. S'apliquen mesures d'autenticaciÃ³ sÃ²lides, inclosa l'autenticaciÃ³ multifactor.",
        },
        {
          id: 'data-protection',
          title: '2. ProtecciÃ³ de Dades',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'Les dades confidencials es xifren tant en trÃ nsit com en repÃ²s. Implementem controls estrictes per evitar la divulgaciÃ³, modificaciÃ³ o destrucciÃ³ no autoritzada de dades. Es realitzen cÃ²pies de seguretat periÃ²diques per garantir la disponibilitat de les dades.',
        },
        {
          id: 'network-security',
          title: '3. Seguretat de la Xarxa',
          icon: <Server className="h-6 w-6 text-purple-600" />,
          text: "La nostra infraestructura de xarxa estÃ  protegida per tallafocs, sistemes de detecciÃ³ d'intrusos i avaluacions de seguretat periÃ²diques. Monitoritzem el trÃ nsit de la xarxa a la recerca d'activitats sospitoses i mantenim configuracions segures per a tots els dispositius de xarxa.",
        },
        {
          id: 'incident-management',
          title: "4. GestiÃ³ d'Incidents",
          icon: <FileWarning className="h-6 w-6 text-orange-600" />,
          text: "Hem establert procediments per informar i respondre a incidents de seguretat de la informaciÃ³. Tots els empleats han d'informar immediatament les sospites de violacions de seguretat. Els incidents s'investiguen i es prenen mesures correctives per evitar que tornin a ocÃ³rrer.",
        },
        {
          id: 'compliance',
          title: '5. Compliment i Auditoria',
          icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
          text: 'Auditem periÃ²dicament els nostres controls de seguretat de la informaciÃ³ per garantir el compliment de les polÃ­tiques internes i les regulacions externes. Estem compromesos amb la millora contÃ­nua del nostre sistema de gestiÃ³ de seguretat de la informaciÃ³.',
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ, Ñ†ÐµÐ»Ð¾ÑÑ‚Ð½Ð¾ÑÑ‚ÑŒ Ð¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð½Ð°ÑˆÐ¸Ñ… Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ñ… Ð°ÐºÑ‚Ð¸Ð²Ð¾Ð². Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ð½Ð°Ñˆ Ð¿Ð¾Ð´Ñ…Ð¾Ð´ Ðº ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸ÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒÑŽ.',
      sections: [
        {
          id: 'access-control',
          title: '1. ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°',
          icon: <Key className="h-6 w-6 text-primary" />,
          text: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¸ ÑÐ¸ÑÑ‚ÐµÐ¼Ð°Ð¼ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ÑÑ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿Ð° Ð½Ð°Ð¸Ð¼ÐµÐ½ÑŒÑˆÐ¸Ñ… Ð¿Ñ€Ð¸Ð²Ð¸Ð»ÐµÐ³Ð¸Ð¹. ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑÐ¼ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ÑÑ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ðº Ñ‚ÐµÐ¼ Ð´Ð°Ð½Ð½Ñ‹Ð¼ Ð¸ Ñ€ÐµÑÑƒÑ€ÑÐ°Ð¼, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹ Ð´Ð»Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð¸Ñ… Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚ÐµÐ¹. ÐŸÑ€Ð¸Ð¼ÐµÐ½ÑÑŽÑ‚ÑÑ ÑÑ‚Ñ€Ð¾Ð³Ð¸Ðµ Ð¼ÐµÑ€Ñ‹ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð¼Ð½Ð¾Ð³Ð¾Ñ„Ð°ÐºÑ‚Ð¾Ñ€Ð½ÑƒÑŽ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸ÑŽ.',
        },
        {
          id: 'data-protection',
          title: '2. Ð—Ð°Ñ‰Ð¸Ñ‚Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ ÑˆÐ¸Ñ„Ñ€ÑƒÑŽÑ‚ÑÑ ÐºÐ°Ðº Ð¿Ñ€Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ðµ, Ñ‚Ð°Ðº Ð¸ Ð¿Ñ€Ð¸ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ð¸. ÐœÑ‹ Ð²Ð½ÐµÐ´Ñ€ÑÐµÐ¼ ÑÑ‚Ñ€Ð¾Ð³Ð¸Ðµ Ð¼ÐµÑ€Ñ‹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ñ Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ Ð½ÐµÑÐ°Ð½ÐºÑ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð·Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ñ, Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ ÑƒÐ½Ð¸Ñ‡Ñ‚Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…. Ð ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÑÑŽÑ‚ÑÑ Ñ€ÐµÐ·ÐµÑ€Ð²Ð½Ñ‹Ðµ ÐºÐ¾Ð¿Ð¸Ð¸ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ñ….',
        },
        {
          id: 'network-security',
          title: '3. Ð¡ÐµÑ‚ÐµÐ²Ð°Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <Server className="h-6 w-6 text-purple-600" />,
          text: 'ÐÐ°ÑˆÐ° ÑÐµÑ‚ÐµÐ²Ð°Ñ Ð¸Ð½Ñ„Ñ€Ð°ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ð° Ð±Ñ€Ð°Ð½Ð´Ð¼Ð°ÑƒÑÑ€Ð°Ð¼Ð¸, ÑÐ¸ÑÑ‚ÐµÐ¼Ð°Ð¼Ð¸ Ð¾Ð±Ð½Ð°Ñ€ÑƒÐ¶ÐµÐ½Ð¸Ñ Ð²Ñ‚Ð¾Ñ€Ð¶ÐµÐ½Ð¸Ð¹ Ð¸ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ñ‹Ð¼Ð¸ Ð¾Ñ†ÐµÐ½ÐºÐ°Ð¼Ð¸ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸. ÐœÑ‹ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÐµÐ¼ ÑÐµÑ‚ÐµÐ²Ð¾Ð¹ Ñ‚Ñ€Ð°Ñ„Ð¸Ðº Ð½Ð° Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚ Ð¿Ð¾Ð´Ð¾Ð·Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÐ¼ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ñ‹Ðµ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸Ð¸ Ð´Ð»Ñ Ð²ÑÐµÑ… ÑÐµÑ‚ÐµÐ²Ñ‹Ñ… ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð².',
        },
        {
          id: 'incident-management',
          title: '4. Ð£Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¸Ð½Ñ†Ð¸Ð´ÐµÐ½Ñ‚Ð°Ð¼Ð¸',
          icon: <FileWarning className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹ Ð´Ð»Ñ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ñ Ð¾Ð± Ð¸Ð½Ñ†Ð¸Ð´ÐµÐ½Ñ‚Ð°Ñ… Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ€ÐµÐ°Ð³Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð½Ð° Ð½Ð¸Ñ…. Ð’ÑÐµ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð¾Ð±ÑÐ·Ð°Ð½Ñ‹ Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ ÑÐ¾Ð¾Ð±Ñ‰Ð°Ñ‚ÑŒ Ð¾ Ð¿Ð¾Ð´Ð¾Ð·Ñ€ÐµÐ½Ð¸ÑÑ… Ð½Ð° Ð½Ð°Ñ€ÑƒÑˆÐµÐ½Ð¸Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸. Ð˜Ð½Ñ†Ð¸Ð´ÐµÐ½Ñ‚Ñ‹ Ñ€Ð°ÑÑÐ»ÐµÐ´ÑƒÑŽÑ‚ÑÑ, Ð¸ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÑŽÑ‚ÑÑ ÐºÐ¾Ñ€Ñ€ÐµÐºÑ‚Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ðµ Ð¼ÐµÑ€Ñ‹ Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ Ð¸Ñ… Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÐµÐ½Ð¸Ñ.',
        },
        {
          id: 'compliance',
          title: '5. Ð¡Ð¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ð¹ Ð¸ Ð°ÑƒÐ´Ð¸Ñ‚',
          icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
          text: 'ÐœÑ‹ Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ð°ÑƒÐ´Ð¸Ñ‚ Ð½Ð°ÑˆÐ¸Ñ… ÑÑ€ÐµÐ´ÑÑ‚Ð² ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡Ð¸Ñ‚ÑŒ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ðµ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ñ… Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸Ðº Ð¸ Ð²Ð½ÐµÑˆÐ½Ð¸Ñ… Ð½Ð¾Ñ€Ð¼. ÐœÑ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ðº Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾Ð¼Ñƒ ÑÐ¾Ð²ÐµÑ€ÑˆÐµÐ½ÑÑ‚Ð²Ð¾Ð²Ð°Ð½Ð¸ÑŽ Ð½Ð°ÑˆÐµÐ¹ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒÑŽ.',
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
        <div className="bg-linear-to-r from-eka-dark/90 to-eka-dark px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <ShieldCheck className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-semibold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              id={section.id}
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
