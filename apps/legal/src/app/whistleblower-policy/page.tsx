"use client";

import React, { useState } from "react";
import { Megaphone, Lock, Shield, UserCheck, AlertTriangle } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function WhistleblowerPolicy() {
  const [language, setLanguage] = useState<Language>("en");

  const content = {
    en: {
      title: "Whistleblower Policy",
      lastUpdated: "Last Updated: March 10, 2025",
      intro: "EKA Balance is committed to high standards of ethical, moral, and legal business conduct. This policy provides a channel for employees and stakeholders to report concerns without fear of retaliation.",
      sections: [
        {
          title: "1. Scope of Reporting",
          icon: <Megaphone className="w-6 h-6 text-orange-600" />,
          text: "This policy covers the reporting of any suspected illegal or unethical conduct, including fraud, corruption, health and safety violations, harassment, discrimination, or breaches of company policy."
        },
        {
          title: "2. Protection from Retaliation",
          icon: <Shield className="w-6 h-6 text-green-600" />,
          text: "EKA Balance strictly prohibits retaliation against any individual who reports a concern in good faith. Any employee found to have retaliated against a whistleblower will be subject to disciplinary action, up to and including termination."
        },
        {
          title: "3. Confidentiality and Anonymity",
          icon: <Lock className="w-6 h-6 text-blue-600" />,
          text: "Reports can be made confidentially or anonymously. We will make every effort to protect the identity of the whistleblower, subject to legal requirements. Information will only be disclosed on a 'need-to-know' basis."
        },
        {
          title: "4. Reporting Channels",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          text: "Concerns can be reported to your manager, HR, or through our dedicated Ethics Hotline. Reports should include as much detail as possible to facilitate an investigation."
        },
        {
          title: "5. Investigation Process",
          icon: <UserCheck className="w-6 h-6 text-purple-600" />,
          text: "All reports will be taken seriously and investigated promptly and impartially. Appropriate corrective action will be taken if the investigation substantiates the concern. The whistleblower will be informed of the outcome where appropriate."
        }
      ]
    },
    es: {
      title: "Política de Denuncias (Whistleblower)",
      lastUpdated: "Última actualización: 10 de marzo de 2025",
      intro: "EKA Balance se compromete a mantener altos estándares de conducta empresarial ética, moral y legal. Esta política proporciona un canal para que los empleados y las partes interesadas informen inquietudes sin temor a represalias.",
      sections: [
        {
          title: "1. Alcance de la Denuncia",
          icon: <Megaphone className="w-6 h-6 text-orange-600" />,
          text: "Esta política cubre la denuncia de cualquier conducta sospechosa ilegal o poco ética, incluidos fraude, corrupción, violaciones de salud y seguridad, acoso, discriminación o incumplimiento de la política de la empresa."
        },
        {
          title: "2. Protección contra Represalias",
          icon: <Shield className="w-6 h-6 text-green-600" />,
          text: "EKA Balance prohíbe estrictamente las represalias contra cualquier persona que informe una inquietud de buena fe. Cualquier empleado que tome represalias contra un denunciante estará sujeto a medidas disciplinarias, incluido el despido."
        },
        {
          title: "3. Confidencialidad y Anonimato",
          icon: <Lock className="w-6 h-6 text-blue-600" />,
          text: "Las denuncias se pueden realizar de forma confidencial o anónima. Haremos todo lo posible para proteger la identidad del denunciante, sujeto a los requisitos legales. La información solo se divulgará cuando sea estrictamente necesario."
        },
        {
          title: "4. Canales de Denuncia",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          text: "Las inquietudes se pueden informar a su gerente, RR.HH. o a través de nuestra Línea Directa de Ética dedicada. Los informes deben incluir tantos detalles como sea posible para facilitar una investigación."
        },
        {
          title: "5. Proceso de Investigación",
          icon: <UserCheck className="w-6 h-6 text-purple-600" />,
          text: "Todos los informes se tomarán en serio y se investigarán de manera rápida e imparcial. Se tomarán las medidas correctivas adecuadas si la investigación corrobora la inquietud. Se informará al denunciante del resultado cuando corresponda."
        }
      ]
    },
    ca: {
      title: "Política de Denúncies (Whistleblower)",
      lastUpdated: "Darrera actualització: 10 de març de 2025",
      intro: "EKA Balance es compromet a mantenir alts estàndards de conducta empresarial ètica, moral i legal. Aquesta política proporciona un canal perquè els empleats i les parts interessades informin d'inquietuds sense por a represàlies.",
      sections: [
        {
          title: "1. Abast de la Denúncia",
          icon: <Megaphone className="w-6 h-6 text-orange-600" />,
          text: "Aquesta política cobreix la denúncia de qualsevol conducta sospitosa il·legal o poc ètica, inclosos frau, corrupció, violacions de salut i seguretat, assetjament, discriminació o incompliment de la política de l'empresa."
        },
        {
          title: "2. Protecció contra Represàlies",
          icon: <Shield className="w-6 h-6 text-green-600" />,
          text: "EKA Balance prohibeix estrictament les represàlies contra qualsevol persona que informi d'una inquietud de bona fe. Qualsevol empleat que prengui represàlies contra un denunciant estarà subjecte a mesures disciplinàries, inclòs l'acomiadament."
        },
        {
          title: "3. Confidencialitat i Anonimat",
          icon: <Lock className="w-6 h-6 text-blue-600" />,
          text: "Les denúncies es poden realitzar de forma confidencial o anònima. Farem tot el possible per protegir la identitat del denunciant, subjecte als requisits legals. La informació només es divulgarà quan sigui estrictament necessari."
        },
        {
          title: "4. Canals de Denúncia",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          text: "Les inquietuds es poden informar al vostre gerent, RR.HH. o a través de la nostra Línia Directa d'Ètica dedicada. Els informes han d'incloure tants detalls com sigui possible per facilitar una investigació."
        },
        {
          title: "5. Procés d'Investigació",
          icon: <UserCheck className="w-6 h-6 text-purple-600" />,
          text: "Tots els informes es prendran seriosament i s'investigaran de manera ràpida i imparcial. Es prendran les mesures correctives adequades si la investigació corrobora la inquietud. S'informarà al denunciant del resultat quan correspongui."
        }
      ]
    },
    ru: {
      title: "Политика информирования о нарушениях",
      lastUpdated: "Последнее обновление: 10 марта 2025 г.",
      intro: "EKA Balance придерживается высоких стандартов этичного, морального и законного делового поведения. Эта политика предоставляет канал для сотрудников и заинтересованных сторон, чтобы сообщать о проблемах, не опасаясь преследования.",
      sections: [
        {
          title: "1. Область отчетности",
          icon: <Megaphone className="w-6 h-6 text-orange-600" />,
          text: "Эта политика охватывает сообщения о любых подозрительных незаконных или неэтичных действиях, включая мошенничество, коррупцию, нарушения охраны труда и техники безопасности, домогательства, дискриминацию или нарушения политики компании."
        },
        {
          title: "2. Защита от преследования",
          icon: <Shield className="w-6 h-6 text-green-600" />,
          text: "EKA Balance строго запрещает преследование любого лица, добросовестно сообщившего о проблеме. Любой сотрудник, уличенный в преследовании информатора, будет подвергнут дисциплинарному взысканию, вплоть до увольнения."
        },
        {
          title: "3. Конфиденциальность и анонимность",
          icon: <Lock className="w-6 h-6 text-blue-600" />,
          text: "Сообщения могут быть сделаны конфиденциально или анонимно. Мы приложим все усилия для защиты личности информатора в соответствии с требованиями законодательства. Информация будет раскрываться только по принципу «необходимости знать»."
        },
        {
          title: "4. Каналы отчетности",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          text: "О проблемах можно сообщить своему руководителю, в отдел кадров или через нашу специальную горячую линию по этике. Отчеты должны содержать как можно больше подробностей для облегчения расследования."
        },
        {
          title: "5. Процесс расследования",
          icon: <UserCheck className="w-6 h-6 text-purple-600" />,
          text: "Все сообщения будут восприняты серьезно и расследованы оперативно и беспристрастно. В случае подтверждения проблемы будут приняты соответствующие корректирующие меры. Информатор будет проинформирован о результатах, где это уместно."
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
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 px-8 py-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Megaphone className="w-12 h-12 opacity-90" />
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
