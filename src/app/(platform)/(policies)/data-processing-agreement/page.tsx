'use client';

import { useState } from 'react';
import { Globe, ArrowLeft, Database } from 'lucide-react';
import Link from 'next/link';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function DataProcessingAgreement() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Data Processing Agreement (DPA)',
      lastUpdated: 'Last Updated: March 15, 2024',
      intro:
        "This Data Processing Agreement ('DPA') forms part of the Terms of Service between EKA Balance ('Processor') and the User ('Controller') and applies to the processing of personal data under the GDPR and other applicable data protection laws.",
      sections: [
        {
          title: '1. Definitions',
          content:
            "For the purposes of this DPA, the terms 'Controller', 'Processor', 'Data Subject', 'Personal Data', 'Processing', and 'Supervisory Authority' shall have the meanings given to them in the General Data Protection Regulation (GDPR) (EU) 2016/679.",
        },
        {
          title: '2. Subject Matter and Duration',
          content:
            'The subject matter of the processing is the performance of the services described in the Terms of Service. The duration of the processing corresponds to the duration of the Terms of Service.',
        },
        {
          title: '3. Nature and Purpose of Processing',
          content:
            'The Processor will process Personal Data on behalf of the Controller for the purpose of providing the EKA Balance platform services, including user account management, appointment booking, and therapy session facilitation.',
        },
        {
          title: '4. Categories of Data Subjects',
          content:
            'The Personal Data processed concerns the following categories of Data Subjects: Users of the EKA Balance platform, including patients, therapists, and administrators.',
        },
        {
          title: '5. Types of Personal Data',
          content:
            'The Personal Data processed includes: Contact information (name, email, phone), health data (if provided for therapy purposes), technical data (IP address, device info), and usage data.',
        },
        {
          title: '6. Rights and Obligations of the Controller',
          content:
            'The Controller is responsible for the lawfulness of the processing of Personal Data. The Controller shall provide all necessary instructions to the Processor regarding the processing of Personal Data.',
        },
        {
          title: '7. Obligations of the Processor',
          content:
            'The Processor shall process Personal Data only on documented instructions from the Controller. The Processor ensures that persons authorized to process the Personal Data have committed themselves to confidentiality. The Processor takes all measures required pursuant to Article 32 of the GDPR (Security of Processing).',
        },
        {
          title: '8. Sub-processing',
          content:
            'The Controller authorizes the Processor to engage sub-processors to support the delivery of the Services. The Processor shall inform the Controller of any intended changes concerning the addition or replacement of other processors.',
        },
        {
          title: '9. International Transfers',
          content:
            'Any transfer of Personal Data to a third country or an international organization by the Processor shall be done only on the basis of documented instructions from the Controller and in compliance with Chapter V of the GDPR.',
        },
        {
          title: '10. Assistance to the Controller',
          content:
            "The Processor shall assist the Controller by appropriate technical and organizational measures, insofar as this is possible, for the fulfillment of the Controller's obligation to respond to requests for exercising the Data Subject's rights.",
        },
        {
          title: '11. Deletion or Return of Data',
          content:
            'At the choice of the Controller, the Processor shall delete or return all the Personal Data to the Controller after the end of the provision of services relating to processing, and delete existing copies unless Union or Member State law requires storage of the Personal Data.',
        },
      ],
    },
    es: {
      title: 'Acuerdo de Procesamiento de Datos (DPA)',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 15 de marzo de 2024',
      intro:
        "Este Acuerdo de Procesamiento de Datos ('DPA') forma parte de los TÃ©rminos de Servicio entre EKA Balance ('Procesador') y el Usuario ('Controlador') y se aplica al procesamiento de datos personales bajo el RGPD y otras leyes de protecciÃ³n de datos aplicables.",
      sections: [
        {
          title: '1. Definiciones',
          content:
            "A los efectos de este DPA, los tÃ©rminos 'Controlador', 'Procesador', 'Interesado', 'Datos Personales', 'Procesamiento' y 'Autoridad de Control' tendrÃ¡n los significados que se les asignan en el Reglamento General de ProtecciÃ³n de Datos (RGPD) (UE) 2016/679.",
        },
        {
          title: '2. Objeto y DuraciÃ³n',
          content:
            'El objeto del procesamiento es la prestaciÃ³n de los servicios descritos en los TÃ©rminos de Servicio. La duraciÃ³n del procesamiento corresponde a la duraciÃ³n de los TÃ©rminos de Servicio.',
        },
        {
          title: '3. Naturaleza y Finalidad del Procesamiento',
          content:
            'El Procesador procesarÃ¡ Datos Personales en nombre del Controlador con el fin de proporcionar los servicios de la plataforma EKA Balance, incluida la gestiÃ³n de cuentas de usuario, la reserva de citas y la facilitaciÃ³n de sesiones de terapia.',
        },
        {
          title: '4. CategorÃ­as de Interesados',
          content:
            'Los Datos Personales procesados se refieren a las siguientes categorÃ­as de Interesados: Usuarios de la plataforma EKA Balance, incluidos pacientes, terapeutas y administradores.',
        },
        {
          title: '5. Tipos de Datos Personales',
          content:
            'Los Datos Personales procesados incluyen: InformaciÃ³n de contacto (nombre, correo electrÃ³nico, telÃ©fono), datos de salud (si se proporcionan con fines terapÃ©uticos), datos tÃ©cnicos (direcciÃ³n IP, informaciÃ³n del dispositivo) y datos de uso.',
        },
        {
          title: '6. Derechos y Obligaciones del Controlador',
          content:
            'El Controlador es responsable de la licitud del procesamiento de Datos Personales. El Controlador proporcionarÃ¡ todas las instrucciones necesarias al Procesador con respecto al procesamiento de Datos Personales.',
        },
        {
          title: '7. Obligaciones del Procesador',
          content:
            'El Procesador procesarÃ¡ Datos Personales solo siguiendo instrucciones documentadas del Controlador. El Procesador garantiza que las personas autorizadas para procesar los Datos Personales se han comprometido a respetar la confidencialidad. El Procesador toma todas las medidas requeridas de conformidad con el ArtÃ­culo 32 del RGPD (Seguridad del Procesamiento).',
        },
        {
          title: '8. Subprocesamiento',
          content:
            'El Controlador autoriza al Procesador a contratar subprocesadores para apoyar la prestaciÃ³n de los Servicios. El Procesador informarÃ¡ al Controlador de cualquier cambio previsto relativo a la incorporaciÃ³n o sustituciÃ³n de otros procesadores.',
        },
        {
          title: '9. Transferencias Internacionales',
          content:
            'Cualquier transferencia de Datos Personales a un tercer paÃ­s o a una organizaciÃ³n internacional por parte del Procesador se realizarÃ¡ Ãºnicamente sobre la base de instrucciones documentadas del Controlador y de conformidad con el CapÃ­tulo V del RGPD.',
        },
        {
          title: '10. Asistencia al Controlador',
          content:
            'El Procesador asistirÃ¡ al Controlador mediante medidas tÃ©cnicas y organizativas apropiadas, siempre que sea posible, para el cumplimiento de la obligaciÃ³n del Controlador de responder a las solicitudes para el ejercicio de los derechos del Interesado.',
        },
        {
          title: '11. SupresiÃ³n o DevoluciÃ³n de Datos',
          content:
            'A elecciÃ³n del Controlador, el Procesador suprimirÃ¡ o devolverÃ¡ todos los Datos Personales al Controlador una vez finalizada la prestaciÃ³n de los servicios de procesamiento, y suprimirÃ¡ las copias existentes a menos que la legislaciÃ³n de la UniÃ³n o de los Estados miembros exija la conservaciÃ³n de los Datos Personales.',
        },
      ],
    },
    ca: {
      title: 'Acord de Processament de Dades (DPA)',
      lastUpdated: 'Ãšltima actualitzaciÃ³: 15 de marÃ§ de 2024',
      intro:
        "Aquest Acord de Processament de Dades ('DPA') forma part dels Termes del Servei entre EKA Balance ('Processador') i l'Usuari ('Controlador') i s'aplica al processament de dades personals sota el RGPD i altres lleis de protecciÃ³ de dades aplicables.",
      sections: [
        {
          title: '1. Definicions',
          content:
            "Als efectes d'aquest DPA, els termes 'Controlador', 'Processador', 'Interessat', 'Dades Personals', 'Processament' i 'Autoritat de Control' tindran els significats que se'ls assignen en el Reglament General de ProtecciÃ³ de Dades (RGPD) (UE) 2016/679.",
        },
        {
          title: '2. Objecte i Durada',
          content:
            "L'objecte del processament Ã©s la prestaciÃ³ dels serveis descrits als Termes del Servei. La durada del processament correspon a la durada dels Termes del Servei.",
        },
        {
          title: '3. Naturalesa i Finalitat del Processament',
          content:
            "El Processador processarÃ  Dades Personals en nom del Controlador amb la finalitat de proporcionar els serveis de la plataforma EKA Balance, inclosa la gestiÃ³ de comptes d'usuari, la reserva de cites i la facilitaciÃ³ de sessions de terÃ pia.",
        },
        {
          title: "4. Categories d'Interessats",
          content:
            "Les Dades Personals processades es refereixen a les segÃ¼ents categories d'Interessats: Usuaris de la plataforma EKA Balance, inclosos pacients, terapeutes i administradors.",
        },
        {
          title: '5. Tipus de Dades Personals',
          content:
            "Les Dades Personals processades inclouen: InformaciÃ³ de contacte (nom, correu electrÃ²nic, telÃ¨fon), dades de salut (si es proporcionen amb finalitats terapÃ¨utiques), dades tÃ¨cniques (adreÃ§a IP, informaciÃ³ del dispositiu) i dades d'Ãºs.",
        },
        {
          title: '6. Drets i Obligacions del Controlador',
          content:
            'El Controlador Ã©s responsable de la licitud del processament de Dades Personals. El Controlador proporcionarÃ  totes les instruccions necessÃ ries al Processador pel que fa al processament de Dades Personals.',
        },
        {
          title: '7. Obligacions del Processador',
          content:
            "El Processador processarÃ  Dades Personals nomÃ©s seguint instruccions documentades del Controlador. El Processador garanteix que les persones autoritzades per processar les Dades Personals s'han compromÃ¨s a respectar la confidencialitat. El Processador pren totes les mesures requerides de conformitat amb l'Article 32 del RGPD (Seguretat del Processament).",
        },
        {
          title: '8. Subprocessament',
          content:
            "El Controlador autoritza al Processador a contractar subprocessadors per donar suport a la prestaciÃ³ dels Serveis. El Processador informarÃ  al Controlador de qualsevol canvi previst relatiu a la incorporaciÃ³ o substituciÃ³ d'altres processadors.",
        },
        {
          title: '9. TransferÃ¨ncies Internacionals',
          content:
            "Qualsevol transferÃ¨ncia de Dades Personals a un tercer paÃ­s o a una organitzaciÃ³ internacional per part del Processador es realitzarÃ  Ãºnicament sobre la base d'instruccions documentades del Controlador i de conformitat amb el CapÃ­tol V del RGPD.",
        },
        {
          title: '10. AssistÃ¨ncia al Controlador',
          content:
            "El Processador assistirÃ  al Controlador mitjanÃ§ant mesures tÃ¨cniques i organitzatives apropiades, sempre que sigui possible, per al compliment de l'obligaciÃ³ del Controlador de respondre a les solÂ·licituds per a l'exercici dels drets de l'Interessat.",
        },
        {
          title: '11. SupressiÃ³ o DevoluciÃ³ de Dades',
          content:
            'A elecciÃ³ del Controlador, el Processador suprimirÃ  o retornarÃ  totes les Dades Personals al Controlador un cop finalitzada la prestaciÃ³ dels serveis de processament, i suprimirÃ  les cÃ²pies existents llevat que la legislaciÃ³ de la UniÃ³ o dels Estats membres exigeixi la conservaciÃ³ de les Dades Personals.',
        },
      ],
    },
    ru: {
      title: 'Ð¡Ð¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ðµ Ð¾Ð± Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐµ Ð´Ð°Ð½Ð½Ñ‹Ñ… (DPA)',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 15 Ð¼Ð°Ñ€Ñ‚Ð° 2024 Ð³.',
      intro:
        "ÐÐ°ÑÑ‚Ð¾ÑÑ‰ÐµÐµ Ð¡Ð¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ðµ Ð¾Ð± Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐµ Ð´Ð°Ð½Ð½Ñ‹Ñ… ('DPA') ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ñ‡Ð°ÑÑ‚ÑŒÑŽ Ð£ÑÐ»Ð¾Ð²Ð¸Ð¹ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ Ð¼ÐµÐ¶Ð´Ñƒ EKA Balance ('ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº') Ð¸ ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¼ ('ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€') Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ Ðº Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐµ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ GDPR Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ð¼Ð¸ Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ð¼Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð°Ð¼Ð¸ Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ….",
      sections: [
        {
          title: '1. ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ñ',
          content:
            "Ð”Ð»Ñ Ñ†ÐµÐ»ÐµÐ¹ Ð½Ð°ÑÑ‚Ð¾ÑÑ‰ÐµÐ³Ð¾ DPA Ñ‚ÐµÑ€Ð¼Ð¸Ð½Ñ‹ 'ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€', 'ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº', 'Ð¡ÑƒÐ±ÑŠÐµÐºÑ‚ Ð´Ð°Ð½Ð½Ñ‹Ñ…', 'ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ', 'ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ°' Ð¸ 'ÐÐ°Ð´Ð·Ð¾Ñ€Ð½Ñ‹Ð¹ Ð¾Ñ€Ð³Ð°Ð½' Ð¸Ð¼ÐµÑŽÑ‚ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ, ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ðµ Ð² ÐžÐ±Ñ‰ÐµÐ¼ Ñ€ÐµÐ³Ð»Ð°Ð¼ÐµÐ½Ñ‚Ðµ Ð¿Ð¾ Ð·Ð°Ñ‰Ð¸Ñ‚Ðµ Ð´Ð°Ð½Ð½Ñ‹Ñ… (GDPR) (Ð•Ð¡) 2016/679.",
        },
        {
          title: '2. ÐŸÑ€ÐµÐ´Ð¼ÐµÑ‚ Ð¸ ÑÑ€Ð¾Ðº Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ',
          content:
            'ÐŸÑ€ÐµÐ´Ð¼ÐµÑ‚Ð¾Ð¼ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑƒÑÐ»ÑƒÐ³, Ð¾Ð¿Ð¸ÑÐ°Ð½Ð½Ñ‹Ñ… Ð² Ð£ÑÐ»Ð¾Ð²Ð¸ÑÑ… Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ. Ð¡Ñ€Ð¾Ðº Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÐµÑ‚ ÑÑ€Ð¾ÐºÑƒ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ Ð£ÑÐ»Ð¾Ð²Ð¸Ð¹ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ.',
        },
        {
          title: '3. Ð¥Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€ Ð¸ Ñ†ÐµÐ»ÑŒ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸',
          content:
            'ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð±ÑƒÐ´ÐµÑ‚ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾Ñ‚ Ð¸Ð¼ÐµÐ½Ð¸ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð° Ñ Ñ†ÐµÐ»ÑŒÑŽ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑƒÑÐ»ÑƒÐ³ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹ EKA Balance, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑƒÑ‡ÐµÑ‚Ð½Ñ‹Ð¼Ð¸ Ð·Ð°Ð¿Ð¸ÑÑÐ¼Ð¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹, Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð²ÑÑ‚Ñ€ÐµÑ‡ Ð¸ Ð¿Ñ€Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ñ‚ÐµÑ€Ð°Ð¿ÐµÐ²Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… ÑÐµÐ°Ð½ÑÐ¾Ð².',
        },
        {
          title: '4. ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ ÑÑƒÐ±ÑŠÐµÐºÑ‚Ð¾Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          content:
            'ÐžÐ±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÐ¼Ñ‹Ðµ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ ÐºÐ°ÑÐ°ÑŽÑ‚ÑÑ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ñ… ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¹ Ð¡ÑƒÐ±ÑŠÐµÐºÑ‚Ð¾Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ…: ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹ EKA Balance, Ð²ÐºÐ»ÑŽÑ‡Ð°Ñ Ð¿Ð°Ñ†Ð¸ÐµÐ½Ñ‚Ð¾Ð², Ñ‚ÐµÑ€Ð°Ð¿ÐµÐ²Ñ‚Ð¾Ð² Ð¸ Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€Ð¾Ð².',
        },
        {
          title: '5. Ð¢Ð¸Ð¿Ñ‹ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          content:
            'ÐžÐ±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÐ¼Ñ‹Ðµ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚: ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ (Ð¸Ð¼Ñ, ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð°Ñ Ð¿Ð¾Ñ‡Ñ‚Ð°, Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½), Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ð·Ð´Ð¾Ñ€Ð¾Ð²ÑŒÐµ (ÐµÑÐ»Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ñ‹ Ð´Ð»Ñ Ñ†ÐµÐ»ÐµÐ¹ Ñ‚ÐµÑ€Ð°Ð¿Ð¸Ð¸), Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ (IP-Ð°Ð´Ñ€ÐµÑ, Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð¾Ð± ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ðµ) Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾Ð± Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸.',
        },
        {
          title: '6. ÐŸÑ€Ð°Ð²Ð° Ð¸ Ð¾Ð±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð°',
          content:
            'ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€ Ð½ÐµÑÐµÑ‚ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð·Ð°ÐºÐ¾Ð½Ð½Ð¾ÑÑ‚ÑŒ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…. ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÑƒ Ð²ÑÐµ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ðµ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¸ Ð¾Ñ‚Ð½Ð¾ÑÐ¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ….',
        },
        {
          title: '7. ÐžÐ±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑ‚Ð¸ ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ°',
          content:
            'ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ð¾ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¼ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸ÑÐ¼ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð°. ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð³Ð°Ñ€Ð°Ð½Ñ‚Ð¸Ñ€ÑƒÐµÑ‚, Ñ‡Ñ‚Ð¾ Ð»Ð¸Ñ†Ð°, ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡ÐµÐ½Ð½Ñ‹Ðµ Ð¾Ð±Ñ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ñ‚ÑŒ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ, Ð¾Ð±ÑÐ·Ð°Ð»Ð¸ÑÑŒ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ. ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÑ‚ Ð²ÑÐµ Ð¼ÐµÑ€Ñ‹, Ñ‚Ñ€ÐµÐ±ÑƒÐµÐ¼Ñ‹Ðµ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ ÑÐ¾ ÑÑ‚Ð°Ñ‚ÑŒÐµÐ¹ 32 GDPR (Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸).',
        },
        {
          title: '8. Ð¡ÑƒÐ±Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ°',
          content:
            'ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€ ÑƒÐ¿Ð¾Ð»Ð½Ð¾Ð¼Ð¾Ñ‡Ð¸Ð²Ð°ÐµÑ‚ ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ° Ð¿Ñ€Ð¸Ð²Ð»ÐµÐºÐ°Ñ‚ÑŒ ÑÑƒÐ±Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¾Ð² Ð´Ð»Ñ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð£ÑÐ»ÑƒÐ³. ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð° Ð¾ Ð»ÑŽÐ±Ñ‹Ñ… Ð¿Ñ€ÐµÐ´Ð¿Ð¾Ð»Ð°Ð³Ð°ÐµÐ¼Ñ‹Ñ… Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸ÑÑ…, ÐºÐ°ÑÐ°ÑŽÑ‰Ð¸Ñ…ÑÑ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¸Ð»Ð¸ Ð·Ð°Ð¼ÐµÐ½Ñ‹ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¾Ð².',
        },
        {
          title: '9. ÐœÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ð°Ñ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ð°',
          content:
            'Ð›ÑŽÐ±Ð°Ñ Ð¿ÐµÑ€ÐµÐ´Ð°Ñ‡Ð° ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð² Ñ‚Ñ€ÐµÑ‚ÑŒÑŽ ÑÑ‚Ñ€Ð°Ð½Ñƒ Ð¸Ð»Ð¸ Ð¼ÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½ÑƒÑŽ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸ÑŽ ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¾Ð¼ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð¾ÑÑƒÑ‰ÐµÑÑ‚Ð²Ð»ÑÑ‚ÑŒÑÑ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ð¸ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð¸Ð½ÑÑ‚Ñ€ÑƒÐºÑ†Ð¸Ð¹ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð° Ð¸ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð“Ð»Ð°Ð²Ð¾Ð¹ V GDPR.',
        },
        {
          title: '10. ÐŸÐ¾Ð¼Ð¾Ñ‰ÑŒ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ñƒ',
          content:
            'ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÑŒ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ñƒ Ñ Ð¿Ð¾Ð¼Ð¾Ñ‰ÑŒÑŽ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ñ… Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¸ Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ñ… Ð¼ÐµÑ€, Ð½Ð°ÑÐºÐ¾Ð»ÑŒÐºÐ¾ ÑÑ‚Ð¾ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾, Ð´Ð»Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð° Ð¾Ñ‚Ð²ÐµÑ‡Ð°Ñ‚ÑŒ Ð½Ð° Ð·Ð°Ð¿Ñ€Ð¾ÑÑ‹ Ð´Ð»Ñ Ð¾ÑÑƒÑ‰ÐµÑÑ‚Ð²Ð»ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð°Ð² Ð¡ÑƒÐ±ÑŠÐµÐºÑ‚Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ….',
        },
        {
          title: '11. Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð¸Ð»Ð¸ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚ Ð´Ð°Ð½Ð½Ñ‹Ñ…',
          content:
            'ÐŸÐ¾ Ð²Ñ‹Ð±Ð¾Ñ€Ñƒ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ð°, ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº Ð´Ð¾Ð»Ð¶ÐµÐ½ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð²ÐµÑ€Ð½ÑƒÑ‚ÑŒ Ð²ÑÐµ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð»ÐµÑ€Ñƒ Ð¿Ð¾ÑÐ»Ðµ Ð¾ÐºÐ¾Ð½Ñ‡Ð°Ð½Ð¸Ñ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑƒÑÐ»ÑƒÐ³, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ñ… Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¾Ð¹, Ð¸ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ ÐºÐ¾Ð¿Ð¸Ð¸, ÐµÑÐ»Ð¸ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð´Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾ Ð¡Ð¾ÑŽÐ·Ð° Ð¸Ð»Ð¸ Ð³Ð¾ÑÑƒÐ´Ð°Ñ€ÑÑ‚Ð²Ð°-Ñ‡Ð»ÐµÐ½Ð° Ð½Ðµ Ñ‚Ñ€ÐµÐ±ÑƒÐµÑ‚ Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ….',
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
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Database className="h-8 w-8 text-primary" />
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
                'This DPA is an integral part of our Terms of Service. By using our services, you agree to these data processing terms.'}
              {language === 'es' &&
                'Este DPA es una parte integral de nuestros TÃ©rminos de Servicio. Al utilizar nuestros servicios, usted acepta estos tÃ©rminos de procesamiento de datos.'}
              {language === 'ca' &&
                'Aquest DPA Ã©s una part integral dels nostres Termes del Servei. En utilitzar els nostres serveis, accepteu aquests termes de processament de dades.'}
              {language === 'ru' &&
                'ÐÐ°ÑÑ‚Ð¾ÑÑ‰ÐµÐµ DPA ÑÐ²Ð»ÑÐµÑ‚ÑÑ Ð½ÐµÐ¾Ñ‚ÑŠÐµÐ¼Ð»ÐµÐ¼Ð¾Ð¹ Ñ‡Ð°ÑÑ‚ÑŒÑŽ Ð½Ð°ÑˆÐ¸Ñ… Ð£ÑÐ»Ð¾Ð²Ð¸Ð¹ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ. Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑ Ð½Ð°ÑˆÐ¸ ÑƒÑÐ»ÑƒÐ³Ð¸, Ð²Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ñ ÑÑ‚Ð¸Ð¼Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸ÑÐ¼Ð¸ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ñ….'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
