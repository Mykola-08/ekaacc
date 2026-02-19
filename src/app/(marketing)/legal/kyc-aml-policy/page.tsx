'use client';

import React, { useState } from 'react';
import { Landmark, Search, FileCheck, AlertOctagon, Globe } from 'lucide-react';
import { CurrentYear } from '@/components/shared/CurrentYear';

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
          icon: <Landmark className="h-6 w-6 text-success" />,
          text: 'We continuously monitor transactions for suspicious activity. This includes analyzing transaction patterns, volumes, and beneficiaries. Unusual or suspicious transactions are flagged for further investigation.',
        },
        {
          id: 'sanctions-screening',
          title: '3. Sanctions Screening',
          icon: <Globe className="h-6 w-6 text-accent" />,
          text: 'We screen customers and transactions against international sanctions lists (e.g., OFAC, UN, EU). We do not do business with sanctioned individuals, entities, or countries.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. Reporting Suspicious Activity',
          icon: <AlertOctagon className="h-6 w-6 text-destructive" />,
          text: 'If we suspect that funds are the proceeds of criminal activity or are related to terrorist financing, we are legally required to report this to the relevant financial intelligence unit (FIU). We are prohibited from tipping off the customer.',
        },
        {
          id: 'record-keeping',
          title: '5. Record Keeping',
          icon: <FileCheck className="h-6 w-6 text-warning" />,
          text: 'We maintain records of customer identification documents and transaction data for a minimum period as required by law (typically 5-10 years). These records must be available to regulatory authorities upon request.',
        },
      ],
    },
    es: {
      title: 'Pol�tica de KYC y AML',
      lastUpdated: '�ltima actualizaci�n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a prevenir el blanqueo de capitales, la financiaci�n del terrorismo y otros delitos financieros. Implementamos procedimientos s�lidos de Conozca a su Cliente (KYC) y Anti-Blanqueo de Capitales (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. Diligencia Debida del Cliente (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: 'Verificamos la identidad de nuestros clientes para asegurarnos de que son quienes dicen ser. Esto implica recopilar y verificar informaci�n personal, identificaciones emitidas por el gobierno y comprobantes de domicilio. Se aplica una diligencia debida reforzada a los clientes de mayor riesgo.',
        },
        {
          id: 'transaction-monitoring',
          title: '2. Monitoreo de Transacciones',
          icon: <Landmark className="h-6 w-6 text-success" />,
          text: 'Monitoreamos continuamente las transacciones en busca de actividades sospechosas. Esto incluye analizar patrones de transacciones, vol�menes y beneficiarios. Las transacciones inusuales o sospechosas se marcan para una mayor investigaci�n.',
        },
        {
          id: 'sanctions-screening',
          title: '3. Control de Sanciones',
          icon: <Globe className="h-6 w-6 text-accent" />,
          text: 'Examinamos a los clientes y las transacciones con respecto a las listas de sanciones internacionales (por ejemplo, OFAC, ONU, UE). No hacemos negocios con personas, entidades o pa�ses sancionados.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. Reporte de Actividades Sospechosas',
          icon: <AlertOctagon className="h-6 w-6 text-destructive" />,
          text: 'Si sospechamos que los fondos son producto de actividades delictivas o est�n relacionados con la financiaci�n del terrorismo, estamos legalmente obligados a informar de ello a la unidad de inteligencia financiera (UIF) pertinente. Tenemos prohibido alertar al cliente.',
        },
        {
          id: 'record-keeping',
          title: '5. Mantenimiento de Registros',
          icon: <FileCheck className="h-6 w-6 text-warning" />,
          text: 'Mantenemos registros de los documentos de identificaci�n del cliente y los datos de las transacciones durante un per�odo m�nimo seg�n lo exija la ley (generalmente de 5 a 10 a�os). Estos registros deben estar disponibles para las autoridades reguladoras cuando lo soliciten.',
        },
      ],
    },
    ca: {
      title: 'Pol�tica de KYC i AML',
      lastUpdated: 'Darrera actualitzaci�: 10 de mar� de 2025',
      intro:
        'EKA Balance es compromet a prevenir el blanqueig de capitals, el finan�ament del terrorisme i altres delictes financers. Implementem procediments s�lids de Conegui el seu Client (KYC) i Anti-Blanqueig de Capitals (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. Dilig�ncia Deguda del Client (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: "Verifiquem la identitat dels nostres clients per assegurar-nos que s�n qui diuen ser. Aix� implica recopilar i verificar informaci� personal, identificacions emeses pel govern i comprovants de domicili. S'aplica una dilig�ncia deguda refor�ada als clients de major risc.",
        },
        {
          id: 'transaction-monitoring',
          title: '2. Monitoratge de Transaccions',
          icon: <Landmark className="h-6 w-6 text-success" />,
          text: "Monitorem cont�nuament les transaccions a la recerca d'activitats sospitoses. Aix� inclou analitzar patrons de transaccions, volums i beneficiaris. Les transaccions inusuals o sospitoses es marquen per a una major investigaci�.",
        },
        {
          id: 'sanctions-screening',
          title: '3. Control de Sancions',
          icon: <Globe className="h-6 w-6 text-accent" />,
          text: 'Examinem els clients i les transaccions respecte a les llistes de sancions internacionals (per exemple, OFAC, ONU, UE). No fem negocis amb persones, entitats o pa�sos sancionats.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: "4. Report d'Activitats Sospitoses",
          icon: <AlertOctagon className="h-6 w-6 text-destructive" />,
          text: "Si sospitem que els fons s�n producte d'activitats delictives o estan relacionats amb el finan�ament del terrorisme, estem legalment obligats a informar-ne a la unitat d'intel�lig�ncia financera (UIF) pertinent. Tenim prohibit alertar el client.",
        },
        {
          id: 'record-keeping',
          title: '5. Manteniment de Registres',
          icon: <FileCheck className="h-6 w-6 text-warning" />,
          text: "Mantenim registres dels documents d'identificaci� del client i les dades de les transaccions durant un per�ode m�nim segons ho exigeixi la llei (generalment de 5 a 10 anys). Aquests registres han d'estar disponibles per a les autoritats reguladores quan ho sol�licitin.",
        },
      ],
    },
    ru: {
      title: '???????? KYC ? AML',
      lastUpdated: '????????? ??????????: 10 ????? 2025 ?.',
      intro:
        'EKA Balance ????????? ????????????? ????????? ?????, ?????????????? ?????????? ? ?????? ?????????? ????????????. ?? ???????? ???????? ????????? �???? ?????? ???????� (KYC) ? ?????? ? ?????????? ????? (AML).',
      sections: [
        {
          id: 'cdd',
          title: '1. ?????????? ???????? ???????? (CDD)',
          icon: <Search className="h-6 w-6 text-primary" />,
          text: '?? ????????? ???????? ????? ????????, ????? ?????????, ??? ??? ??, ?? ???? ???? ??????. ??? ???????? ???? ? ???????? ?????? ??????????, ????????????? ????????, ???????? ??????????????, ? ????????????? ??????. ????????? ???????? ??????????? ? ???????? ? ????? ??????? ??????.',
        },
        {
          id: 'transaction-monitoring',
          title: '2. ?????????? ??????????',
          icon: <Landmark className="h-6 w-6 text-success" />,
          text: '?? ????????? ??????????? ?????????? ?? ??????? ?????????????? ??????????. ??? ???????? ?????? ??????? ??????????, ??????? ? ????????????. ????????? ??? ?????????????? ?????????? ?????????? ??? ??????????? ?????????????.',
        },
        {
          id: 'sanctions-screening',
          title: '3. ???????? ???????',
          icon: <Globe className="h-6 w-6 text-accent" />,
          text: '?? ????????? ???????? ? ?????????? ?? ????????????? ??????????? ??????? (????????, OFAC, ???, ??). ?? ?? ????? ???? ? ??????, ????????????? ??? ????????, ???????????? ??? ?????????.',
        },
        {
          id: 'reporting-suspicious-activity',
          title: '4. ????????? ? ?????????????? ??????????',
          icon: <AlertOctagon className="h-6 w-6 text-destructive" />,
          text: '???? ?? ???????????, ??? ???????? ???????? ???????? ?? ?????????? ???????????? ??? ??????? ? ??????????????? ??????????, ?? ?? ?????? ??????? ???????? ?? ???? ? ??????????????? ????????????? ?????????? ???????? (???). ??? ????????? ????????????? ???????.',
        },
        {
          id: 'record-keeping',
          title: '5. ??????? ???????',
          icon: <FileCheck className="h-6 w-6 text-warning" />,
          text: '?? ?????? ?????? ??????????, ?????????????? ???????? ???????, ? ?????? ? ??????????? ? ??????? ???????????? ???????, ?????????? ??????? (?????? 5-10 ???). ??? ?????? ?????? ???? ???????? ???????????? ??????? ?? ???????.',
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
            � <CurrentYear /> EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

