"use client";

import React, { useState } from "react";
import { Shield, FileCheck, Umbrella, AlertOctagon, CreditCard } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function InsurancePolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Insurance Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This policy outlines how EKA Balance interacts with insurance providers, coverage limitations, and your responsibilities regarding insurance claims and payments.",
   sections: [
    {
     title: "1. Insurance Coverage",
     icon: <Umbrella className="w-6 h-6 text-blue-600" />,
     text: "We accept a variety of insurance plans. However, coverage varies significantly by plan and provider. It is your responsibility to understand your specific benefits, including deductibles, copays, and covered services."
    },
    {
     title: "2. Verification of Benefits",
     icon: <FileCheck className="w-6 h-6 text-green-600" />,
     text: "We will attempt to verify your insurance benefits prior to your first appointment. However, verification is not a guarantee of payment. You are responsible for any charges not covered by your insurance."
    },
    {
     title: "3. Claims Processing",
     icon: <Shield className="w-6 h-6 text-purple-600" />,
     text: "As a courtesy, we will file claims with your insurance provider on your behalf. You must provide accurate and up-to-date insurance information. If a claim is denied, you become responsible for the full balance."
    },
    {
     title: "4. Out-of-Network Benefits",
     icon: <CreditCard className="w-6 h-6 text-orange-600" />,
     text: "If we are not in-network with your insurance provider, you may still be able to use out-of-network benefits. We can provide you with a 'Superbill' to submit to your insurance for potential reimbursement."
    },
    {
     title: "5. Liability and Responsibility",
     icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
     text: "You are ultimately financially responsible for all services rendered. If your insurance coverage changes or terminates, you must notify us immediately to avoid unexpected costs."
    }
   ]
  },
  es: {
   title: "Política de Seguros",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Esta política describe cómo EKA Balance interactúa con los proveedores de seguros, las limitaciones de cobertura y sus responsabilidades con respecto a las reclamaciones y pagos de seguros.",
   sections: [
    {
     title: "1. Cobertura de Seguro",
     icon: <Umbrella className="w-6 h-6 text-blue-600" />,
     text: "Aceptamos una variedad de planes de seguro. Sin embargo, la cobertura varía significativamente según el plan y el proveedor. Es su responsabilidad comprender sus beneficios específicos, incluidos los deducibles, copagos y servicios cubiertos."
    },
    {
     title: "2. Verificación de Beneficios",
     icon: <FileCheck className="w-6 h-6 text-green-600" />,
     text: "Intentaremos verificar sus beneficios de seguro antes de su primera cita. Sin embargo, la verificación no es una garantía de pago. Usted es responsable de cualquier cargo no cubierto por su seguro."
    },
    {
     title: "3. Procesamiento de Reclamaciones",
     icon: <Shield className="w-6 h-6 text-purple-600" />,
     text: "Como cortesía, presentaremos reclamaciones a su proveedor de seguros en su nombre. Debe proporcionar información de seguro precisa y actualizada. Si se deniega una reclamación, usted será responsable del saldo total."
    },
    {
     title: "4. Beneficios Fuera de la Red",
     icon: <CreditCard className="w-6 h-6 text-orange-600" />,
     text: "Si no estamos dentro de la red de su proveedor de seguros, es posible que aún pueda utilizar los beneficios fuera de la red. Podemos proporcionarle una 'Superfactura' para enviar a su seguro para un posible reembolso."
    },
    {
     title: "5. Responsabilidad y Obligación",
     icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
     text: "Usted es, en última instancia, financieramente responsable de todos los servicios prestados. Si su cobertura de seguro cambia o termina, debe notificarnos de inmediato para evitar costos inesperados."
    }
   ]
  },
  ca: {
   title: "Política d'Assegurances",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquesta política descriu com EKA Balance interactua amb els proveïdors d'assegurances, les limitacions de cobertura i les vostres responsabilitats pel que fa a les reclamacions i pagaments d'assegurances.",
   sections: [
    {
     title: "1. Cobertura d'Assegurança",
     icon: <Umbrella className="w-6 h-6 text-blue-600" />,
     text: "Acceptem una varietat de plans d'assegurança. No obstant això, la cobertura varia significativament segons el pla i el proveïdor. És la vostra responsabilitat comprendre els vostres beneficis específics, inclosos els deduïbles, copagaments i serveis coberts."
    },
    {
     title: "2. Verificació de Beneficis",
     icon: <FileCheck className="w-6 h-6 text-green-600" />,
     text: "Intentarem verificar els vostres beneficis d'assegurança abans de la vostra primera cita. No obstant això, la verificació no és una garantia de pagament. Sou responsable de qualsevol càrrec no cobert per la vostra assegurança."
    },
    {
     title: "3. Processament de Reclamacions",
     icon: <Shield className="w-6 h-6 text-purple-600" />,
     text: "Com a cortesia, presentarem reclamacions al vostre proveïdor d'assegurances en nom vostre. Heu de proporcionar informació d'assegurança precisa i actualitzada. Si es denega una reclamació, sereu responsable del saldo total."
    },
    {
     title: "4. Beneficis Fora de la Xarxa",
     icon: <CreditCard className="w-6 h-6 text-orange-600" />,
     text: "Si no estem dins de la xarxa del vostre proveïdor d'assegurances, és possible que encara pugueu utilitzar els beneficis fora de la xarxa. Podem proporcionar-vos una 'Superfactura' per enviar a la vostra assegurança per a un possible reemborsament."
    },
    {
     title: "5. Responsabilitat i Obligació",
     icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
     text: "Sou, en última instància, financerament responsable de tots els serveis prestats. Si la vostra cobertura d'assegurança canvia o finalitza, heu de notificar-nos immediatament per evitar costos inesperats."
    }
   ]
  },
  ru: {
   title: "Страховая политика",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "Эта политика описывает, как EKA Balance взаимодействует со страховыми компаниями, ограничения покрытия и ваши обязанности в отношении страховых требований и платежей.",
   sections: [
    {
     title: "1. Страховое покрытие",
     icon: <Umbrella className="w-6 h-6 text-blue-600" />,
     text: "Мы принимаем различные планы страхования. Однако покрытие значительно варьируется в зависимости от плана и провайдера. Вы несете ответственность за понимание ваших конкретных льгот, включая франшизы, доплаты и покрываемые услуги."
    },
    {
     title: "2. Проверка льгот",
     icon: <FileCheck className="w-6 h-6 text-green-600" />,
     text: "Мы попытаемся проверить ваши страховые льготы до вашей первой встречи. Однако проверка не является гарантией оплаты. Вы несете ответственность за любые расходы, не покрываемые вашей страховкой."
    },
    {
     title: "3. Обработка претензий",
     icon: <Shield className="w-6 h-6 text-purple-600" />,
     text: "В качестве любезности мы подадим претензии вашему страховому провайдеру от вашего имени. Вы должны предоставить точную и актуальную информацию о страховании. Если в претензии будет отказано, вы несете ответственность за полную оплату."
    },
    {
     title: "4. Льготы вне сети",
     icon: <CreditCard className="w-6 h-6 text-orange-600" />,
     text: "Если мы не входим в сеть вашего страхового провайдера, вы все равно можете воспользоваться льготами вне сети. Мы можем предоставить вам 'Суперсчет' для отправки в вашу страховую компанию для возможного возмещения."
    },
    {
     title: "5. Ответственность и обязательства",
     icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
     text: "В конечном итоге вы несете финансовую ответственность за все оказанные услуги. Если ваше страховое покрытие изменится или прекратится, вы должны немедленно уведомить нас, чтобы избежать непредвиденных расходов."
    }
   ]
  }
 };

 return (
  <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
   <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl overflow-hidden">
    <div className="bg-blue-900 py-8 px-8 text-white flex justify-between items-center">
     <div>
      <h1 className="text-3xl font-bold">{content[language].title}</h1>
      <p className="mt-2 text-blue-100">{content[language].lastUpdated}</p>
     </div>
     <div className="flex space-x-2">
      {(["en", "es", "ca", "ru"] as Language[]).map((lang) => (
       <button
        key={lang}
        onClick={() => setLanguage(lang)}
        className={`px-3 py-1 rounded uppercase text-sm font-bold transition-colors ${
         language === lang
          ? "bg-card text-blue-900"
          : "bg-blue-800 text-blue-200 hover:bg-blue-700"
        }`}
       >
        {lang}
       </button>
      ))}
     </div>
    </div>

    <div className="p-8">
     <p className="text-foreground/90 text-lg mb-8 leading-relaxed border-b pb-8">
      {content[language].intro}
     </p>

     <div className="space-y-8">
      {content[language].sections.map((section, index) => (
       <div key={index} className="flex items-start p-6 bg-muted/30 rounded-xl hover:shadow-md transition-shadow">
        <div className="shrink-0 mt-1 bg-card p-3 rounded-full shadow-sm">
         {section.icon}
        </div>
        <div className="ml-6">
         <h2 className="text-xl font-semibold text-foreground mb-3">
          {section.title}
         </h2>
         <p className="text-muted-foreground leading-relaxed">
          {section.text}
         </p>
        </div>
       </div>
      ))}
     </div>

     <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
      <p>&copy; 2025 EKA Balance. All rights reserved.</p>
     </div>
    </div>
   </div>
  </div>
 );
}
