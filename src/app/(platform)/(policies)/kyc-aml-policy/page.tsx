'use client';

import React, { useState } from 'react';
import { Landmark, Search, FileCheck, AlertOctagon, Globe } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function KycAmlPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'KYC & AML Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to preventing money laundering, terrorist financing, and other financial crimes. We implement robust Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures.',
      sections: [
        {
          id: 'cdd',
          title: '1. Customer Due Diligence (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: 'We verify the identity of our customers to ensure they are who they claim to be. This involves collecting and verifying personal information, government-issued IDs, and proof of address. Enhanced due diligence is applied to higher-risk customers.',
        },
        {
          id: 'transaction-monitoring',
          title: '2. Transaction Monitoring',
          icon: <Landmark className="h-6 w-6 text-green-600" />,
          text: 'We continuously monitor transactions for suspicious activity. This includes analyzing transaction patterns, volumes, and beneficiaries. Unusual or suspicious transactions are flagged for further investigation.',
        },
        {
          id: 'sanctions-screening',
          title: '3. Sanctions Screening',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'We screen customers and transactions against international sanctions lists (e.g., OFAC, UN, EU). We do not do business with sanctioned individuals, entities, or countries.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. Reporting Suspicious Activity',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'If we suspect that funds are the proceeds of criminal activity or are related to terrorist financing, we are legally required to report this to the relevant financial intelligence unit (FIU). We are prohibited from tipping off the customer.',
        },
        {
          id: 'record-keeping',
          title: '5. Record Keeping',
          icon: <FileCheck className="h-6 w-6 text-orange-600" />,
          text: 'We maintain records of customer identification documents and transaction data for a minimum period as required by law (typically 5-10 years). These records must be available to regulatory authorities upon request.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de KYC y AML',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a prevenir el blanqueo de capitales, la financiaciÃ³n del terrorismo y otros delitos financieros. Implementamos procedimientos sÃ³lidos de Conozca a su Cliente (KYC) y Anti-Blanqueo de Capitales (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. Diligencia Debida del Cliente (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: 'Verificamos la identidad de nuestros clientes para asegurarnos de que son quienes dicen ser. Esto implica recopilar y verificar informaciÃ³n personal, identificaciones emitidas por el gobierno y comprobantes de domicilio. Se aplica una diligencia debida reforzada a los clientes de mayor riesgo.',
        },
        {
          id: 'transaction-monitoring',
          title: '2. Monitoreo de Transacciones',
          icon: <Landmark className="h-6 w-6 text-green-600" />,
          text: 'Monitoreamos continuamente las transacciones en busca de actividades sospechosas. Esto incluye analizar patrones de transacciones, volÃºmenes y beneficiarios. Las transacciones inusuales o sospechosas se marcan para una mayor investigaciÃ³n.',
        },
        {
          id: 'sanctions-screening',
          title: '3. Control de Sanciones',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Examinamos a los clientes y las transacciones con respecto a las listas de sanciones internacionales (por ejemplo, OFAC, ONU, UE). No hacemos negocios con personas, entidades o paÃ­ses sancionados.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. Reporte de Actividades Sospechosas',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'Si sospechamos que los fondos son producto de actividades delictivas o estÃ¡n relacionados con la financiaciÃ³n del terrorismo, estamos legalmente obligados a informar de ello a la unidad de inteligencia financiera (UIF) pertinente. Tenemos prohibido alertar al cliente.',
        },
        {
          id: 'record-keeping',
          title: '5. Mantenimiento de Registros',
          icon: <FileCheck className="h-6 w-6 text-orange-600" />,
          text: 'Mantenemos registros de los documentos de identificaciÃ³n del cliente y los datos de las transacciones durante un perÃ­odo mÃ­nimo segÃºn lo exija la ley (generalmente de 5 a 10 aÃ±os). Estos registros deben estar disponibles para las autoridades reguladoras cuando lo soliciten.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de KYC i AML',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'EKA Balance es compromet a prevenir el blanqueig de capitals, el finanÃ§ament del terrorisme i altres delictes financers. Implementem procediments sÃ²lids de Conegui el seu Client (KYC) i Anti-Blanqueig de Capitals (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. DiligÃ¨ncia Deguda del Client (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: "Verifiquem la identitat dels nostres clients per assegurar-nos que sÃ³n qui diuen ser. AixÃ² implica recopilar i verificar informaciÃ³ personal, identificacions emeses pel govern i comprovants de domicili. S'aplica una diligÃ¨ncia deguda reforÃ§ada als clients de major risc.",
        },
        {
          id: 'transaction-monitoring',
          title: '2. Monitoratge de Transaccions',
          icon: <Landmark className="h-6 w-6 text-green-600" />,
          text: "Monitorem contÃ­nuament les transaccions a la recerca d'activitats sospitoses. AixÃ² inclou analitzar patrons de transaccions, volums i beneficiaris. Les transaccions inusuals o sospitoses es marquen per a una major investigaciÃ³.",
        },
        {
          id: 'sanctions-screening',
          title: '3. Control de Sancions',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Examinem els clients i les transaccions respecte a les llistes de sancions internacionals (per exemple, OFAC, ONU, UE). No fem negocis amb persones, entitats o paÃ¯sos sancionats.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: "4. Report d'Activitats Sospitoses",
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: "Si sospitem que els fons sÃ³n producte d'activitats delictives o estan relacionats amb el finanÃ§ament del terrorisme, estem legalment obligats a informar-ne a la unitat d'intelÂ·ligÃ¨ncia financera (UIF) pertinent. Tenim prohibit alertar el client.",
        },
        {
          id: 'record-keeping',
          title: '5. Manteniment de Registres',
          icon: <FileCheck className="h-6 w-6 text-orange-600" />,
          text: "Mantenim registres dels documents d'identificaciÃ³ del client i les dades de les transaccions durant un perÃ­ode mÃ­nim segons ho exigeixi la llei (generalment de 5 a 10 anys). Aquests registres han d'estar disponibles per a les autoritats reguladores quan ho solÂ·licitin.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° KYC Ð¸ AML',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance ÑÑ‚Ñ€ÐµÐ¼Ð¸Ñ‚ÑÑ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰Ð°Ñ‚ÑŒ Ð¾Ñ‚Ð¼Ñ‹Ð²Ð°Ð½Ð¸Ðµ Ð´ÐµÐ½ÐµÐ³, Ñ„Ð¸Ð½Ð°Ð½ÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÑ€Ñ€Ð¾Ñ€Ð¸Ð·Ð¼Ð° Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ðµ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ñ‹Ðµ Ð¿Ñ€ÐµÑÑ‚ÑƒÐ¿Ð»ÐµÐ½Ð¸Ñ. ÐœÑ‹ Ð²Ð½ÐµÐ´Ñ€ÑÐµÐ¼ Ð½Ð°Ð´ÐµÐ¶Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ñ†ÐµÐ´ÑƒÑ€Ñ‹ Â«Ð—Ð½Ð°Ð¹ ÑÐ²Ð¾ÐµÐ³Ð¾ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°Â» (KYC) Ð¸ Ð±Ð¾Ñ€ÑŒÐ±Ñ‹ Ñ Ð¾Ñ‚Ð¼Ñ‹Ð²Ð°Ð½Ð¸ÐµÐ¼ Ð´ÐµÐ½ÐµÐ³ (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. ÐÐ°Ð´Ð»ÐµÐ¶Ð°Ñ‰Ð°Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ Ð½Ð°ÑˆÐ¸Ñ… ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð², Ñ‡Ñ‚Ð¾Ð±Ñ‹ ÑƒÐ±ÐµÐ´Ð¸Ñ‚ÑŒÑÑ, Ñ‡Ñ‚Ð¾ Ð¾Ð½Ð¸ Ñ‚Ðµ, Ð·Ð° ÐºÐ¾Ð³Ð¾ ÑÐµÐ±Ñ Ð²Ñ‹Ð´Ð°ÑŽÑ‚. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ ÑÐ±Ð¾Ñ€ Ð¸ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÑƒ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸, ÑƒÐ´Ð¾ÑÑ‚Ð¾Ð²ÐµÑ€ÐµÐ½Ð¸Ð¹ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸, Ð²Ñ‹Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð¾Ð¼, Ð¸ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´ÐµÐ½Ð¸Ñ Ð°Ð´Ñ€ÐµÑÐ°. Ð£ÑÐ¸Ð»ÐµÐ½Ð½Ð°Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ Ðº ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°Ð¼ Ñ Ð±Ð¾Ð»ÐµÐµ Ð²Ñ‹ÑÐ¾ÐºÐ¸Ð¼ Ñ€Ð¸ÑÐºÐ¾Ð¼.',
        },
        {
          id: 'transaction-monitoring',
          title: '2. ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹',
          icon: <Landmark className="h-6 w-6 text-green-600" />,
          text: 'ÐœÑ‹ Ð¿Ð¾ÑÑ‚Ð¾ÑÐ½Ð½Ð¾ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÐµÐ¼ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð½Ð° Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚ Ð¿Ð¾Ð´Ð¾Ð·Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸. Ð­Ñ‚Ð¾ Ð²ÐºÐ»ÑŽÑ‡Ð°ÐµÑ‚ Ð°Ð½Ð°Ð»Ð¸Ð· Ð¼Ð¾Ð´ÐµÐ»ÐµÐ¹ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹, Ð¾Ð±ÑŠÐµÐ¼Ð¾Ð² Ð¸ Ð±ÐµÐ½ÐµÑ„Ð¸Ñ†Ð¸Ð°Ñ€Ð¾Ð². ÐÐµÐ¾Ð±Ñ‹Ñ‡Ð½Ñ‹Ðµ Ð¸Ð»Ð¸ Ð¿Ð¾Ð´Ð¾Ð·Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ðµ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð¿Ð¾Ð¼ÐµÑ‡Ð°ÑŽÑ‚ÑÑ Ð´Ð»Ñ Ð´Ð°Ð»ÑŒÐ½ÐµÐ¹ÑˆÐµÐ³Ð¾ Ñ€Ð°ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ.',
        },
        {
          id: 'sanctions-screening',
          title: '3. ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ°Ð½ÐºÑ†Ð¸Ð¹',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð¸ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð¿Ð¾ Ð¼ÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ñ‹Ð¼ ÑÐ°Ð½ÐºÑ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼ ÑÐ¿Ð¸ÑÐºÐ°Ð¼ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, OFAC, ÐžÐžÐ, Ð•Ð¡). ÐœÑ‹ Ð½Ðµ Ð²ÐµÐ´ÐµÐ¼ Ð´ÐµÐ»Ð° Ñ Ð»Ð¸Ñ†Ð°Ð¼Ð¸, Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð°Ñ†Ð¸ÑÐ¼Ð¸ Ð¸Ð»Ð¸ ÑÑ‚Ñ€Ð°Ð½Ð°Ð¼Ð¸, Ð½Ð°Ñ…Ð¾Ð´ÑÑ‰Ð¸Ð¼Ð¸ÑÑ Ð¿Ð¾Ð´ ÑÐ°Ð½ÐºÑ†Ð¸ÑÐ¼Ð¸.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾ Ð¿Ð¾Ð´Ð¾Ð·Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸',
          icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
          text: 'Ð•ÑÐ»Ð¸ Ð¼Ñ‹ Ð¿Ð¾Ð´Ð¾Ð·Ñ€ÐµÐ²Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ ÑÑ€ÐµÐ´ÑÑ‚Ð²Ð° ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð´Ð¾Ñ…Ð¾Ð´Ð°Ð¼Ð¸ Ð¾Ñ‚ Ð¿Ñ€ÐµÑÑ‚ÑƒÐ¿Ð½Ð¾Ð¹ Ð´ÐµÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¸Ð»Ð¸ ÑÐ²ÑÐ·Ð°Ð½Ñ‹ Ñ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼ Ñ‚ÐµÑ€Ñ€Ð¾Ñ€Ð¸Ð·Ð¼Ð°, Ð¼Ñ‹ Ð¿Ð¾ Ð·Ð°ÐºÐ¾Ð½Ñƒ Ð¾Ð±ÑÐ·Ð°Ð½Ñ‹ ÑÐ¾Ð¾Ð±Ñ‰Ð¸Ñ‚ÑŒ Ð¾Ð± ÑÑ‚Ð¾Ð¼ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐµ Ð¿Ð¾Ð´Ñ€Ð°Ð·Ð´ÐµÐ»ÐµÐ½Ð¸Ðµ Ñ„Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð¾Ð¹ Ñ€Ð°Ð·Ð²ÐµÐ´ÐºÐ¸ (ÐŸÐ¤Ð ). ÐÐ°Ð¼ Ð·Ð°Ð¿Ñ€ÐµÑ‰ÐµÐ½Ð¾ Ð¿Ñ€ÐµÐ´ÑƒÐ¿Ñ€ÐµÐ¶Ð´Ð°Ñ‚ÑŒ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°.',
        },
        {
          id: 'record-keeping',
          title: '5. Ð’ÐµÐ´ÐµÐ½Ð¸Ðµ Ð·Ð°Ð¿Ð¸ÑÐµÐ¹',
          icon: <FileCheck className="h-6 w-6 text-orange-600" />,
          text: 'ÐœÑ‹ Ñ…Ñ€Ð°Ð½Ð¸Ð¼ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð², ÑƒÐ´Ð¾ÑÑ‚Ð¾Ð²ÐµÑ€ÑÑŽÑ‰Ð¸Ñ… Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð°, Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¾ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸ÑÑ… Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¼Ð¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð°, Ñ‚Ñ€ÐµÐ±ÑƒÐµÐ¼Ð¾Ð³Ð¾ Ð·Ð°ÐºÐ¾Ð½Ð¾Ð¼ (Ð¾Ð±Ñ‹Ñ‡Ð½Ð¾ 5-10 Ð»ÐµÑ‚). Ð­Ñ‚Ð¸ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‰Ð¸Ð¼ Ð¾Ñ€Ð³Ð°Ð½Ð°Ð¼ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ.',
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
            <Landmark className="h-12 w-12 opacity-90" />
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
