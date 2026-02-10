'use client';

import React, { useState } from 'react';
import { UserCog, FileLock, Eye, Server, Trash2 } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function EmployeePrivacyNotice() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Employee Privacy Notice',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This notice describes how EKA Balance collects, uses, and protects the personal information of its employees, contractors, and job applicants. We are committed to respecting your privacy and managing your data responsibly.',
      sections: [
        {
          title: '1. Information We Collect',
          icon: <UserCog className="h-6 w-6 text-primary" />,
          text: 'We collect personal information necessary for employment purposes, such as contact details, identification documents, banking information for payroll, performance evaluations, and attendance records.',
        },
        {
          title: '2. Use of Information',
          icon: <FileLock className="h-6 w-6 text-green-600" />,
          text: 'Your information is used for personnel administration, payroll processing, benefits management, performance management, and compliance with legal obligations. We do not sell your personal information.',
        },
        {
          title: '3. Monitoring',
          icon: <Eye className="h-6 w-6 text-purple-600" />,
          text: 'We may monitor the use of company systems and devices to ensure security, compliance with policies, and productivity. You should have no expectation of privacy when using company-provided equipment or networks.',
        },
        {
          title: '4. Data Storage and Security',
          icon: <Server className="h-6 w-6 text-orange-600" />,
          text: 'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse. Data is stored securely and access is restricted to authorized personnel.',
        },
        {
          title: '5. Data Retention',
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          text: 'We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, or as required by law. After the retention period, your data will be securely deleted or anonymized.',
        },
      ],
    },
    es: {
      title: 'Aviso de Privacidad para Empleados',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Este aviso describe cÃ³mo EKA Balance recopila, utiliza y protege la informaciÃ³n personal de sus empleados, contratistas y solicitantes de empleo. Nos comprometemos a respetar su privacidad y gestionar sus datos de manera responsable.',
      sections: [
        {
          title: '1. InformaciÃ³n que Recopilamos',
          icon: <UserCog className="h-6 w-6 text-primary" />,
          text: 'Recopilamos informaciÃ³n personal necesaria para fines laborales, como datos de contacto, documentos de identificaciÃ³n, informaciÃ³n bancaria para nÃ³mina, evaluaciones de desempeÃ±o y registros de asistencia.',
        },
        {
          title: '2. Uso de la InformaciÃ³n',
          icon: <FileLock className="h-6 w-6 text-green-600" />,
          text: 'Su informaciÃ³n se utiliza para la administraciÃ³n de personal, procesamiento de nÃ³mina, gestiÃ³n de beneficios, gestiÃ³n del desempeÃ±o y cumplimiento de obligaciones legales. No vendemos su informaciÃ³n personal.',
        },
        {
          title: '3. Monitoreo',
          icon: <Eye className="h-6 w-6 text-purple-600" />,
          text: 'Podemos monitorear el uso de los sistemas y dispositivos de la empresa para garantizar la seguridad, el cumplimiento de las polÃ­ticas y la productividad. No debe tener expectativas de privacidad al utilizar equipos o redes proporcionados por la empresa.',
        },
        {
          title: '4. Almacenamiento y Seguridad de Datos',
          icon: <Server className="h-6 w-6 text-orange-600" />,
          text: 'Implementamos medidas tÃ©cnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pÃ©rdida o el uso indebido. Los datos se almacenan de forma segura y el acceso estÃ¡ restringido al personal autorizado.',
        },
        {
          title: '5. RetenciÃ³n de Datos',
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          text: 'Conservamos su informaciÃ³n personal durante el tiempo que sea necesario para cumplir con los fines para los que se recopilÃ³, o segÃºn lo exija la ley. DespuÃ©s del perÃ­odo de retenciÃ³n, sus datos se eliminarÃ¡n o anonimizarÃ¡n de forma segura.',
        },
      ],
    },
    ca: {
      title: 'AvÃ­s de Privacitat per a Empleats',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquest avÃ­s descriu com EKA Balance recopila, utilitza i protegeix la informaciÃ³ personal dels seus empleats, contractistes i solÂ·licitants d'ocupaciÃ³. Ens comprometem a respectar la vostra privacitat i gestionar les vostres dades de manera responsable.",
      sections: [
        {
          title: '1. InformaciÃ³ que Recopilem',
          icon: <UserCog className="h-6 w-6 text-primary" />,
          text: "Recopilem informaciÃ³ personal necessÃ ria per a finalitats laborals, com dades de contacte, documents d'identificaciÃ³, informaciÃ³ bancÃ ria per a nÃ²mines, avaluacions de rendiment i registres d'assistÃ¨ncia.",
        },
        {
          title: '2. Ãšs de la InformaciÃ³',
          icon: <FileLock className="h-6 w-6 text-green-600" />,
          text: "La vostra informaciÃ³ s'utilitza per a l'administraciÃ³ de personal, processament de nÃ²mines, gestiÃ³ de beneficis, gestiÃ³ del rendiment i compliment d'obligacions legals. No venem la vostra informaciÃ³ personal.",
        },
        {
          title: '3. Monitoratge',
          icon: <Eye className="h-6 w-6 text-purple-600" />,
          text: "Podem monitorar l'Ãºs dels sistemes i dispositius de l'empresa per garantir la seguretat, el compliment de les polÃ­tiques i la productivitat. No heu de tenir expectatives de privacitat en utilitzar equips o xarxes proporcionats per l'empresa.",
        },
        {
          title: '4. Emmagatzematge i Seguretat de Dades',
          icon: <Server className="h-6 w-6 text-orange-600" />,
          text: "Implementem mesures tÃ¨cniques i organitzatives apropiades per protegir les vostres dades personals contra l'accÃ©s no autoritzat, la pÃ¨rdua o l'Ãºs indegut. Les dades s'emmagatzemen de forma segura i l'accÃ©s estÃ  restringit al personal autoritzat.",
        },
        {
          title: '5. RetenciÃ³ de Dades',
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          text: "Conservem la vostra informaciÃ³ personal durant el temps que sigui necessari per complir amb les finalitats per a les quals es va recopilar, o segons ho exigeixi la llei. DesprÃ©s del perÃ­ode de retenciÃ³, les vostres dades s'eliminaran o anonimitzaran de forma segura.",
        },
      ],
    },
    ru: {
      title: 'Ð£Ð²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð²',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð’ ÑÑ‚Ð¾Ð¼ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ð¸ Ð¾Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑ‚ÑÑ, ÐºÐ°Ðº EKA Balance ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÑ‚, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ Ð¸ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°ÐµÑ‚ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ ÑÐ²Ð¾Ð¸Ñ… ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð², Ð¿Ð¾Ð´Ñ€ÑÐ´Ñ‡Ð¸ÐºÐ¾Ð² Ð¸ ÑÐ¾Ð¸ÑÐºÐ°Ñ‚ÐµÐ»ÐµÐ¹. ÐœÑ‹ Ð¾Ð±ÑÐ·ÑƒÐµÐ¼ÑÑ ÑƒÐ²Ð°Ð¶Ð°Ñ‚ÑŒ Ð²Ð°ÑˆÑƒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ Ð²Ð°ÑˆÐ¸Ð¼Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸.',
      sections: [
        {
          title: '1. Ð˜Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ, ÐºÐ¾Ñ‚Ð¾Ñ€ÑƒÑŽ Ð¼Ñ‹ ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÐ¼',
          icon: <UserCog className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÐ¼ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼ÑƒÑŽ Ð´Ð»Ñ Ñ†ÐµÐ»ÐµÐ¹ Ñ‚Ñ€ÑƒÐ´Ð¾ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð°, Ñ‚Ð°ÐºÑƒÑŽ ÐºÐ°Ðº ÐºÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ, Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹, ÑƒÐ´Ð¾ÑÑ‚Ð¾Ð²ÐµÑ€ÑÑŽÑ‰Ð¸Ðµ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ, Ð±Ð°Ð½ÐºÐ¾Ð²ÑÐºÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´Ð»Ñ Ð½Ð°Ñ‡Ð¸ÑÐ»ÐµÐ½Ð¸Ñ Ð·Ð°Ñ€Ð°Ð±Ð¾Ñ‚Ð½Ð¾Ð¹ Ð¿Ð»Ð°Ñ‚Ñ‹, Ð¾Ñ†ÐµÐ½ÐºÐ¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð¾ Ð¿Ð¾ÑÐµÑ‰Ð°ÐµÐ¼Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '2. Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸',
          icon: <FileLock className="h-6 w-6 text-green-600" />,
          text: 'Ð’Ð°ÑˆÐ° Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð´Ð»Ñ Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð°, Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð·Ð°Ñ€Ð°Ð±Ð¾Ñ‚Ð½Ð¾Ð¹ Ð¿Ð»Ð°Ñ‚Ñ‹, ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð»ÑŒÐ³Ð¾Ñ‚Ð°Ð¼Ð¸, ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒÑŽ Ð¸ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ñ ÑŽÑ€Ð¸Ð´Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð². ÐœÑ‹ Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°ÐµÐ¼ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ.',
        },
        {
          title: '3. ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³',
          icon: <Eye className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ Ð¼Ð¾Ð¶ÐµÐ¼ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ ÑÐ¸ÑÑ‚ÐµÐ¼ Ð¸ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð² ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸ Ð´Ð»Ñ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸, ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ñ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸Ðº Ð¸ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸. Ð’Ñ‹ Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¾Ð¶Ð¸Ð´Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¿Ñ€Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ð¾Ð±Ð¾Ñ€ÑƒÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸Ð»Ð¸ ÑÐµÑ‚ÐµÐ¹, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð½Ñ‹Ñ… ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸ÐµÐ¹.',
        },
        {
          title: '4. Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¸ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Server className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ð²Ð½ÐµÐ´Ñ€ÑÐµÐ¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ð¼ÐµÑ€Ñ‹ Ð´Ð»Ñ Ð·Ð°Ñ‰Ð¸Ñ‚Ñ‹ Ð²Ð°ÑˆÐ¸Ñ… Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾Ñ‚ Ð½ÐµÑÐ°Ð½ÐºÑ†Ð¸Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð°, Ð¿Ð¾Ñ‚ÐµÑ€Ð¸ Ð¸Ð»Ð¸ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¾Ð¼ÐµÑ€Ð½Ð¾Ð³Ð¾ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ. Ð”Ð°Ð½Ð½Ñ‹Ðµ Ñ…Ñ€Ð°Ð½ÑÑ‚ÑÑ Ð½Ð°Ð´ÐµÐ¶Ð½Ð¾, Ð° Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð½Ð¸Ð¼ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½ ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡ÐµÐ½Ð½Ñ‹Ð¼ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð¾Ð¼.',
        },
        {
          title: '5. Ð¥Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          text: 'ÐœÑ‹ Ñ…Ñ€Ð°Ð½Ð¸Ð¼ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´Ð¾ Ñ‚ÐµÑ… Ð¿Ð¾Ñ€, Ð¿Ð¾ÐºÐ° ÑÑ‚Ð¾ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ð¾ Ð´Ð»Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ñ†ÐµÐ»ÐµÐ¹, Ð´Ð»Ñ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ñ… Ð¾Ð½Ð° Ð±Ñ‹Ð»Ð° ÑÐ¾Ð±Ñ€Ð°Ð½Ð°, Ð¸Ð»Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸ÑÐ¼Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð°. ÐŸÐ¾ Ð¸ÑÑ‚ÐµÑ‡ÐµÐ½Ð¸Ð¸ ÑÑ€Ð¾ÐºÐ° Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ Ð²Ð°ÑˆÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð±ÑƒÐ´ÑƒÑ‚ Ð½Ð°Ð´ÐµÐ¶Ð½Ð¾ ÑƒÐ´Ð°Ð»ÐµÐ½Ñ‹ Ð¸Ð»Ð¸ Ð°Ð½Ð¾Ð½Ð¸Ð¼Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹.',
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
        <div className="bg-linear-to-r from-eka-dark/80 to-eka-dark/70 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <UserCog className="h-12 w-12 opacity-90" />
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
