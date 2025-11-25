"use client";

import React, { useState } from "react";
import { Landmark, Search, FileCheck, AlertOctagon, Globe } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function KycAmlPolicy() {
  const [language, setLanguage] = useState<Language>("en");

  const content = {
    en: {
      title: "KYC & AML Policy",
      lastUpdated: "Last Updated: March 10, 2025",
      intro: "EKA Balance is committed to preventing money laundering, terrorist financing, and other financial crimes. We implement robust Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures.",
      sections: [
        {
          title: "1. Customer Due Diligence (CDD)",
          icon: <Search className="w-6 h-6 text-blue-600" />,
          text: "We verify the identity of our customers to ensure they are who they claim to be. This involves collecting and verifying personal information, government-issued IDs, and proof of address. Enhanced due diligence is applied to higher-risk customers."
        },
        {
          title: "2. Transaction Monitoring",
          icon: <Landmark className="w-6 h-6 text-green-600" />,
          text: "We continuously monitor transactions for suspicious activity. This includes analyzing transaction patterns, volumes, and beneficiaries. Unusual or suspicious transactions are flagged for further investigation."
        },
        {
          title: "3. Sanctions Screening",
          icon: <Globe className="w-6 h-6 text-purple-600" />,
          text: "We screen customers and transactions against international sanctions lists (e.g., OFAC, UN, EU). We do not do business with sanctioned individuals, entities, or countries."
        },
        {
          title: "4. Reporting Suspicious Activity",
          icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
          text: "If we suspect that funds are the proceeds of criminal activity or are related to terrorist financing, we are legally required to report this to the relevant financial intelligence unit (FIU). We are prohibited from tipping off the customer."
        },
        {
          title: "5. Record Keeping",
          icon: <FileCheck className="w-6 h-6 text-orange-600" />,
          text: "We maintain records of customer identification documents and transaction data for a minimum period as required by law (typically 5-10 years). These records must be available to regulatory authorities upon request."
        }
      ]
    },
    es: {
      title: "Política de KYC y AML",
      lastUpdated: "Última actualización: 10 de marzo de 2025",
      intro: "EKA Balance se compromete a prevenir el blanqueo de capitales, la financiación del terrorismo y otros delitos financieros. Implementamos procedimientos sólidos de Conozca a su Cliente (KYC) y Anti-Blanqueo de Capitales (AML).",
      sections: [
        {
          title: "1. Diligencia Debida del Cliente (CDD)",
          icon: <Search className="w-6 h-6 text-blue-600" />,
          text: "Verificamos la identidad de nuestros clientes para asegurarnos de que son quienes dicen ser. Esto implica recopilar y verificar información personal, identificaciones emitidas por el gobierno y comprobantes de domicilio. Se aplica una diligencia debida reforzada a los clientes de mayor riesgo."
        },
        {
          title: "2. Monitoreo de Transacciones",
          icon: <Landmark className="w-6 h-6 text-green-600" />,
          text: "Monitoreamos continuamente las transacciones en busca de actividades sospechosas. Esto incluye analizar patrones de transacciones, volúmenes y beneficiarios. Las transacciones inusuales o sospechosas se marcan para una mayor investigación."
        },
        {
          title: "3. Control de Sanciones",
          icon: <Globe className="w-6 h-6 text-purple-600" />,
          text: "Examinamos a los clientes y las transacciones con respecto a las listas de sanciones internacionales (por ejemplo, OFAC, ONU, UE). No hacemos negocios con personas, entidades o países sancionados."
        },
        {
          title: "4. Reporte de Actividades Sospechosas",
          icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
          text: "Si sospechamos que los fondos son producto de actividades delictivas o están relacionados con la financiación del terrorismo, estamos legalmente obligados a informar de ello a la unidad de inteligencia financiera (UIF) pertinente. Tenemos prohibido alertar al cliente."
        },
        {
          title: "5. Mantenimiento de Registros",
          icon: <FileCheck className="w-6 h-6 text-orange-600" />,
          text: "Mantenemos registros de los documentos de identificación del cliente y los datos de las transacciones durante un período mínimo según lo exija la ley (generalmente de 5 a 10 años). Estos registros deben estar disponibles para las autoridades reguladoras cuando lo soliciten."
        }
      ]
    },
    ca: {
      title: "Política de KYC i AML",
      lastUpdated: "Darrera actualització: 10 de març de 2025",
      intro: "EKA Balance es compromet a prevenir el blanqueig de capitals, el finançament del terrorisme i altres delictes financers. Implementem procediments sòlids de Conegui el seu Client (KYC) i Anti-Blanqueig de Capitals (AML).",
      sections: [
        {
          title: "1. Diligència Deguda del Client (CDD)",
          icon: <Search className="w-6 h-6 text-blue-600" />,
          text: "Verifiquem la identitat dels nostres clients per assegurar-nos que són qui diuen ser. Això implica recopilar i verificar informació personal, identificacions emeses pel govern i comprovants de domicili. S'aplica una diligència deguda reforçada als clients de major risc."
        },
        {
          title: "2. Monitoratge de Transaccions",
          icon: <Landmark className="w-6 h-6 text-green-600" />,
          text: "Monitorem contínuament les transaccions a la recerca d'activitats sospitoses. Això inclou analitzar patrons de transaccions, volums i beneficiaris. Les transaccions inusuals o sospitoses es marquen per a una major investigació."
        },
        {
          title: "3. Control de Sancions",
          icon: <Globe className="w-6 h-6 text-purple-600" />,
          text: "Examinem els clients i les transaccions respecte a les llistes de sancions internacionals (per exemple, OFAC, ONU, UE). No fem negocis amb persones, entitats o països sancionats."
        },
        {
          title: "4. Report d'Activitats Sospitoses",
          icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
          text: "Si sospitem que els fons són producte d'activitats delictives o estan relacionats amb el finançament del terrorisme, estem legalment obligats a informar-ne a la unitat d'intel·ligència financera (UIF) pertinent. Tenim prohibit alertar el client."
        },
        {
          title: "5. Manteniment de Registres",
          icon: <FileCheck className="w-6 h-6 text-orange-600" />,
          text: "Mantenim registres dels documents d'identificació del client i les dades de les transaccions durant un període mínim segons ho exigeixi la llei (generalment de 5 a 10 anys). Aquests registres han d'estar disponibles per a les autoritats reguladores quan ho sol·licitin."
        }
      ]
    },
    ru: {
      title: "Политика KYC и AML",
      lastUpdated: "Последнее обновление: 10 марта 2025 г.",
      intro: "EKA Balance стремится предотвращать отмывание денег, финансирование терроризма и другие финансовые преступления. Мы внедряем надежные процедуры «Знай своего клиента» (KYC) и борьбы с отмыванием денег (AML).",
      sections: [
        {
          title: "1. Надлежащая проверка клиентов (CDD)",
          icon: <Search className="w-6 h-6 text-blue-600" />,
          text: "Мы проверяем личность наших клиентов, чтобы убедиться, что они те, за кого себя выдают. Это включает сбор и проверку личной информации, удостоверений личности, выданных правительством, и подтверждения адреса. Усиленная проверка применяется к клиентам с более высоким риском."
        },
        {
          title: "2. Мониторинг транзакций",
          icon: <Landmark className="w-6 h-6 text-green-600" />,
          text: "Мы постоянно отслеживаем транзакции на предмет подозрительной активности. Это включает анализ моделей транзакций, объемов и бенефициаров. Необычные или подозрительные транзакции помечаются для дальнейшего расследования."
        },
        {
          title: "3. Проверка санкций",
          icon: <Globe className="w-6 h-6 text-purple-600" />,
          text: "Мы проверяем клиентов и транзакции по международным санкционным спискам (например, OFAC, ООН, ЕС). Мы не ведем дела с лицами, организациями или странами, находящимися под санкциями."
        },
        {
          title: "4. Сообщение о подозрительной активности",
          icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
          text: "Если мы подозреваем, что средства являются доходами от преступной деятельности или связаны с финансированием терроризма, мы по закону обязаны сообщить об этом в соответствующее подразделение финансовой разведки (ПФР). Нам запрещено предупреждать клиента."
        },
        {
          title: "5. Ведение записей",
          icon: <FileCheck className="w-6 h-6 text-orange-600" />,
          text: "Мы храним записи документов, удостоверяющих личность клиента, и данные о транзакциях в течение минимального периода, требуемого законом (обычно 5-10 лет). Эти записи должны быть доступны регулирующим органам по запросу."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {(["en", "es", "ca", "ru"] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg ${
                language === lang
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-8 py-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Landmark className="w-12 h-12 opacity-90" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
          <p className="opacity-90 max-w-2xl">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="p-8 space-y-8">
          {t.sections.map((section, index) => (
            <div key={index} className="flex gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 mt-1">{section.icon}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
