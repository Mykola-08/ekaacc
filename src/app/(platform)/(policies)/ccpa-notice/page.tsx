"use client";

import React, { useState } from "react";
import { MapPin, EyeOff, FileX, Shield, Phone } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function CcpaNotice() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "CCPA Privacy Notice",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This Privacy Notice for California Residents supplements the information contained in EKA Balance's general Privacy Policy and applies solely to visitors, users, and others who reside in the State of California.",
   sections: [
    {
     id: "rights",
     title: "1. Your Rights Under CCPA",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "The California Consumer Privacy Act (CCPA) provides consumers (California residents) with specific rights regarding their personal information. This includes the right to know what personal information we collect, use, disclose, and sell."
    },
    {
     id: "access",
     title: "2. Right to Know and Access",
     icon: <MapPin className="w-6 h-6 text-green-600" />,
     text: "You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. Once we receive and confirm your verifiable consumer request, we will disclose it to you."
    },
    {
     id: "delete",
     title: "3. Right to Delete",
     icon: <FileX className="w-6 h-6 text-red-600" />,
     text: "You have the right to request that we delete any of your personal information that we collected from you and retained, subject to certain exceptions. Once we receive and confirm your verifiable consumer request, we will delete your personal information from our records."
    },
    {
     id: "do-not-sell",
     title: "4. Do Not Sell My Personal Information",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "You have the right to opt-out of the sale of your personal information. EKA Balance does not sell personal information. However, if we did, you would have the right to direct us to not sell your personal information at any time."
    },
    {
     id: "non-discrimination",
     title: "5. Non-Discrimination",
     icon: <Phone className="w-6 h-6 text-orange-600" />,
     text: "We will not discriminate against you for exercising any of your CCPA rights. Unless permitted by the CCPA, we will not deny you goods or services, charge you different prices or rates, or provide you with a different level or quality of goods or services."
    }
   ]
  },
  es: {
   title: "Aviso de Privacidad de la CCPA",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Este Aviso de Privacidad para Residentes de California complementa la información contenida en la Política de Privacidad general de EKA Balance y se aplica únicamente a los visitantes, usuarios y otras personas que residen en el Estado de California.",
   sections: [
    {
     title: "1. Sus Derechos Bajo la CCPA",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "La Ley de Privacidad del Consumidor de California (CCPA) otorga a los consumidores (residentes de California) derechos específicos con respecto a su información personal. Esto incluye el derecho a saber qué información personal recopilamos, usamos, divulgamos y vendemos."
    },
    {
     title: "2. Derecho a Saber y Acceder",
     icon: <MapPin className="w-6 h-6 text-green-600" />,
     text: "Tiene derecho a solicitar que le revelemos cierta información sobre nuestra recopilación y uso de su información personal durante los últimos 12 meses. Una vez que recibamos y confirmemos su solicitud de consumidor verificable, se la revelaremos."
    },
    {
     title: "3. Derecho a Eliminar",
     icon: <FileX className="w-6 h-6 text-red-600" />,
     text: "Tiene derecho a solicitar que eliminemos cualquier información personal que hayamos recopilado de usted y conservado, sujeto a ciertas excepciones. Una vez que recibamos y confirmemos su solicitud de consumidor verificable, eliminaremos su información personal de nuestros registros."
    },
    {
     title: "4. No Vender Mi Información Personal",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "Tiene derecho a optar por no participar en la venta de su información personal. EKA Balance no vende información personal. Sin embargo, si lo hiciéramos, tendría derecho a indicarnos que no vendamos su información personal en cualquier momento."
    },
    {
     title: "5. No Discriminación",
     icon: <Phone className="w-6 h-6 text-orange-600" />,
     text: "No lo discriminaremos por ejercer cualquiera de sus derechos de la CCPA. A menos que lo permita la CCPA, no le negaremos bienes o servicios, no le cobraremos precios o tarifas diferentes, ni le proporcionaremos un nivel o calidad diferente de bienes o servicios."
    }
   ]
  },
  ca: {
   title: "Avís de Privadesa de la CCPA",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquest Avís de Privadesa per a Residents de Califòrnia complementa la informació continguda en la Política de Privadesa general d'EKA Balance i s'aplica únicament als visitants, usuaris i altres persones que resideixen a l'Estat de Califòrnia.",
   sections: [
    {
     title: "1. Els Vostres Drets Sota la CCPA",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "La Llei de Privadesa del Consumidor de Califòrnia (CCPA) atorga als consumidors (residents de Califòrnia) drets específics pel que fa a la seva informació personal. Això inclou el dret a saber quina informació personal recopilem, utilitzem, divulguem i venem."
    },
    {
     title: "2. Dret a Saber i Accedir",
     icon: <MapPin className="w-6 h-6 text-green-600" />,
     text: "Teniu dret a sol·licitar que us revelem certa informació sobre la nostra recopilació i ús de la vostra informació personal durant els darrers 12 mesos. Un cop rebem i confirmem la vostra sol·licitud de consumidor verificable, us la revelarem."
    },
    {
     title: "3. Dret a Eliminar",
     icon: <FileX className="w-6 h-6 text-red-600" />,
     text: "Teniu dret a sol·licitar que eliminem qualsevol informació personal que hàgim recopilat de vosaltres i conservat, subjecte a certes excepcions. Un cop rebem i confirmem la vostra sol·licitud de consumidor verificable, eliminarem la vostra informació personal dels nostres registres."
    },
    {
     title: "4. No Vendre la Meva Informació Personal",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "Teniu dret a optar per no participar en la venda de la vostra informació personal. EKA Balance no ven informació personal. No obstant això, si ho féssim, tindríeu dret a indicar-nos que no venguem la vostra informació personal en qualsevol moment."
    },
    {
     title: "5. No Discriminació",
     icon: <Phone className="w-6 h-6 text-orange-600" />,
     text: "No us discriminarem per exercir qualsevol dels vostres drets de la CCPA. A menys que ho permeti la CCPA, no us negarem béns o serveis, no us cobrarem preus o tarifes diferents, ni us proporcionarem un nivell o qualitat diferent de béns o serveis."
    }
   ]
  },
  ru: {
   title: "Уведомление о конфиденциальности CCPA",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "Это Уведомление о конфиденциальности для жителей Калифорнии дополняет информацию, содержащуюся в общей Политике конфиденциальности EKA Balance, и применяется исключительно к посетителям, пользователям и другим лицам, проживающим в штате Калифорния.",
   sections: [
    {
     title: "1. Ваши права в соответствии с CCPA",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "Закон о конфиденциальности потребителей Калифорнии (CCPA) предоставляет потребителям (жителям Калифорнии) определенные права в отношении их личной информации. Это включает в себя право знать, какую личную информацию мы собираем, используем, раскрываем и продаем."
    },
    {
     title: "2. Право знать и получать доступ",
     icon: <MapPin className="w-6 h-6 text-green-600" />,
     text: "Вы имеете право запросить, чтобы мы раскрыли вам определенную информацию о нашем сборе и использовании вашей личной информации за последние 12 месяцев. Как только мы получим и подтвердим ваш поддающийся проверке запрос потребителя, мы раскроем его вам."
    },
    {
     title: "3. Право на удаление",
     icon: <FileX className="w-6 h-6 text-red-600" />,
     text: "Вы имеете право запросить, чтобы мы удалили любую вашу личную информацию, которую мы собрали у вас и сохранили, за некоторыми исключениями. Как только мы получим и подтвердим ваш поддающийся проверке запрос потребителя, мы удалим вашу личную информацию из наших записей."
    },
    {
     title: "4. Не продавать мою личную информацию",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "Вы имеете право отказаться от продажи вашей личной информации. EKA Balance не продает личную информацию. Однако, если бы мы это сделали, вы имели бы право в любое время указать нам не продавать вашу личную информацию."
    },
    {
     title: "5. Недискриминация",
     icon: <Phone className="w-6 h-6 text-orange-600" />,
     text: "Мы не будем дискриминировать вас за осуществление любого из ваших прав CCPA. Если это не разрешено CCPA, мы не будем отказывать вам в товарах или услугах, взимать с вас разные цены или тарифы или предоставлять вам другой уровень или качество товаров или услуг."
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
    <div className="bg-linear-to-r from-yellow-600 to-orange-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <MapPin className="w-12 h-12 opacity-90" />
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

