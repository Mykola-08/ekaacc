"use client";

import React, { useState } from "react";
import { Globe, UserCheck, Database, Lock, FileText } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function GdprCompliance() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "GDPR Compliance Statement",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "EKA Balance is committed to complying with the General Data Protection Regulation (GDPR). This statement outlines our approach to data protection and the rights of individuals within the European Economic Area (EEA).",
   sections: [
    {
     id: "principles",
     title: "1. Data Processing Principles",
     icon: <Globe className="w-6 h-6 text-blue-600" />,
     text: "We process personal data lawfully, fairly, and in a transparent manner. Data is collected for specified, explicit, and legitimate purposes and not further processed in a manner that is incompatible with those purposes."
    },
    {
     id: "lawful-basis",
     title: "2. Lawful Basis for Processing",
     icon: <FileText className="w-6 h-6 text-green-600" />,
     text: "We only process personal data when we have a lawful basis to do so. This includes processing necessary for the performance of a contract, compliance with a legal obligation, protection of vital interests, or based on your consent."
    },
    {
     id: "rights",
     title: "3. Data Subject Rights",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Under GDPR, you have the right to access, rectify, erase, restrict processing, object to processing, and data portability. We have established procedures to respond to your requests regarding these rights."
    },
    {
     id: "security",
     title: "4. Data Security",
     icon: <Lock className="w-6 h-6 text-orange-600" />,
     text: "We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk. This includes encryption, pseudonymization, and regular testing of our security controls."
    },
    {
     id: "transfers",
     title: "5. International Data Transfers",
     icon: <Database className="w-6 h-6 text-red-600" />,
     text: "When we transfer personal data outside the EEA, we ensure that appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions by the European Commission."
    }
   ]
  },
  es: {
   title: "Declaración de Cumplimiento del RGPD",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "EKA Balance se compromete a cumplir con el Reglamento General de Protección de Datos (RGPD). Esta declaración describe nuestro enfoque para la protección de datos y los derechos de las personas dentro del Espacio Económico Europeo (EEE).",
   sections: [
    {
     title: "1. Principios de Procesamiento de Datos",
     icon: <Globe className="w-6 h-6 text-blue-600" />,
     text: "Procesamos datos personales de manera lícita, leal y transparente. Los datos se recopilan con fines determinados, explícitos y legítimos y no se procesan posteriormente de manera incompatible con dichos fines."
    },
    {
     title: "2. Base Legal para el Procesamiento",
     icon: <FileText className="w-6 h-6 text-green-600" />,
     text: "Solo procesamos datos personales cuando tenemos una base legal para hacerlo. Esto incluye el procesamiento necesario para la ejecución de un contrato, el cumplimiento de una obligación legal, la protección de intereses vitales o en base a su consentimiento."
    },
    {
     title: "3. Derechos del Interesado",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Según el RGPD, tiene derecho a acceder, rectificar, suprimir, restringir el procesamiento, oponerse al procesamiento y a la portabilidad de los datos. Hemos establecido procedimientos para responder a sus solicitudes con respecto a estos derechos."
    },
    {
     title: "4. Seguridad de Datos",
     icon: <Lock className="w-6 h-6 text-orange-600" />,
     text: "Implementamos medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo. Esto incluye cifrado, seudonimización y pruebas periódicas de nuestros controles de seguridad."
    },
    {
     title: "5. Transferencias Internacionales de Datos",
     icon: <Database className="w-6 h-6 text-red-600" />,
     text: "Cuando transferimos datos personales fuera del EEE, nos aseguramos de que existan las salvaguardias adecuadas, como las Cláusulas Contractuales Estándar (SCC) o las decisiones de adecuación de la Comisión Europea."
    }
   ]
  },
  ca: {
   title: "Declaració de Compliment del RGPD",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "EKA Balance es compromet a complir amb el Reglament General de Protecció de Dades (RGPD). Aquesta declaració descriu el nostre enfocament per a la protecció de dades i els drets de les persones dins de l'Espai Econòmic Europeu (EEE).",
   sections: [
    {
     title: "1. Principis de Processament de Dades",
     icon: <Globe className="w-6 h-6 text-blue-600" />,
     text: "Processem dades personals de manera lícita, lleial i transparent. Les dades es recopilen amb finalitats determinades, explícites i legítimes i no es processen posteriorment de manera incompatible amb aquestes finalitats."
    },
    {
     title: "2. Base Legal per al Processament",
     icon: <FileText className="w-6 h-6 text-green-600" />,
     text: "Només processem dades personals quan tenim una base legal per fer-ho. Això inclou el processament necessari per a l'execució d'un contracte, el compliment d'una obligació legal, la protecció d'interessos vitals o en base al vostre consentiment."
    },
    {
     title: "3. Drets de l'Interessat",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Segons el RGPD, teniu dret a accedir, rectificar, suprimir, restringir el processament, oposar-vos al processament i a la portabilitat de les dades. Hem establert procediments per respondre a les vostres sol·licituds pel que fa a aquests drets."
    },
    {
     title: "4. Seguretat de Dades",
     icon: <Lock className="w-6 h-6 text-orange-600" />,
     text: "Implementem mesures tècniques i organitzatives apropiades per garantir un nivell de seguretat adequat al risc. Això inclou xifratge, pseudonimització i proves periòdiques dels nostres controls de seguretat."
    },
    {
     title: "5. Transferències Internacionals de Dades",
     icon: <Database className="w-6 h-6 text-red-600" />,
     text: "Quan transferim dades personals fora de l'EEE, ens assegurem que existeixin les salvaguardes adequades, com les Clàusules Contractuals Estàndard (SCC) o les decisions d'adequació de la Comissió Europea."
    }
   ]
  },
  ru: {
   title: "Заявление о соответствии GDPR",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "EKA Balance обязуется соблюдать Общий регламент по защите данных (GDPR). В этом заявлении изложен наш подход к защите данных и правам физических лиц в Европейской экономической зоне (ЕЭЗ).",
   sections: [
    {
     title: "1. Принципы обработки данных",
     icon: <Globe className="w-6 h-6 text-blue-600" />,
     text: "Мы обрабатываем персональные данные законно, справедливо и прозрачно. Данные собираются для определенных, явных и законных целей и не обрабатываются в дальнейшем способом, несовместимым с этими целями."
    },
    {
     title: "2. Законное основание для обработки",
     icon: <FileText className="w-6 h-6 text-green-600" />,
     text: "Мы обрабатываем персональные данные только при наличии законных оснований для этого. Сюда входит обработка, необходимая для выполнения контракта, соблюдения юридических обязательств, защиты жизненно важных интересов или на основании вашего согласия."
    },
    {
     title: "3. Права субъекта данных",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "В соответствии с GDPR вы имеете право на доступ, исправление, удаление, ограничение обработки, возражение против обработки и переносимость данных. Мы установили процедуры для ответа на ваши запросы относительно этих прав."
    },
    {
     title: "4. Безопасность данных",
     icon: <Lock className="w-6 h-6 text-orange-600" />,
     text: "Мы внедряем соответствующие технические и организационные меры для обеспечения уровня безопасности, соответствующего риску. Сюда входит шифрование, псевдонимизация и регулярное тестирование наших средств контроля безопасности."
    },
    {
     title: "5. Международная передача данных",
     icon: <Database className="w-6 h-6 text-red-600" />,
     text: "При передаче персональных данных за пределы ЕЭЗ мы гарантируем наличие соответствующих гарантий, таких как Стандартные договорные условия (SCC) или решения Европейской комиссии об адекватности."
    }
   ]
  }
 };

 const t = content[language];

 return (
  <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
   <div className="flex justify-end mb-8">
    <div className="inline-flex rounded-xl shadow-sm" role="group">
     {(["en", "es", "ca", "ru"] as Language[]).map((lang) => (
      <button
       key={lang}
       type="button"
       onClick={() => setLanguage(lang)}
       className={`px-4 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg ${
        language === lang
         ? "bg-primary text-white border-primary"
         : "bg-card text-foreground/90 border-border hover:bg-muted/30"
       }`}
      >
       {lang.toUpperCase()}
      </button>
     ))}
    </div>
   </div>

   <div className="bg-card shadow-xl rounded-2xl overflow-hidden">
    <div className="bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Globe className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} id={(section as any).id} className="flex gap-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted transition-colors scroll-mt-24">
       <div className="shrink-0 mt-1">{section.icon}</div>
       <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{section.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{section.text}</p>
       </div>
      </div>
     ))}
    </div>

    <div className="bg-muted/30 px-8 py-6 border-t border-gray-100">
     <p className="text-sm text-muted-foreground text-center">
      © {new Date().getFullYear()} EKA Balance. All rights reserved.
     </p>
    </div>
   </div>
  </div>
 );
}
