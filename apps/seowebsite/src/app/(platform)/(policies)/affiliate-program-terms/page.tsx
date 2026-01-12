"use client";

import React, { useState } from "react";
import { Users, DollarSign, TrendingUp, FileText, XCircle } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function AffiliateProgramTerms() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Affiliate Program Terms",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "These terms and conditions govern your participation in the EKA Balance Affiliate Program. By joining our program, you agree to promote our services in accordance with these terms.",
   sections: [
    {
     title: "1. Enrollment and Approval",
     icon: <Users className="w-6 h-6 text-blue-600" />,
     text: "To join the Affiliate Program, you must submit an application. We review all applications and reserve the right to reject any application at our sole discretion. Once approved, you will receive access to affiliate links and marketing materials."
    },
    {
     title: "2. Commissions and Payments",
     icon: <DollarSign className="w-6 h-6 text-green-600" />,
     text: "You will earn a commission for each qualifying sale generated through your unique affiliate link. Commissions are paid out monthly, subject to a minimum payout threshold. We reserve the right to adjust commission rates with prior notice."
    },
    {
     title: "3. Promotion Guidelines",
     icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
     text: "You agree to promote EKA Balance in a positive and professional manner. You must not use misleading or deceptive claims, spam, or any unethical marketing practices. All promotional materials must be approved by us or provided by us."
    },
    {
     title: "4. Intellectual Property",
     icon: <FileText className="w-6 h-6 text-orange-600" />,
     text: "We grant you a limited, non-exclusive, non-transferable license to use our trademarks and logos solely for the purpose of promoting our services as an affiliate. You may not modify our branding without our written consent."
    },
    {
     title: "5. Termination",
     icon: <XCircle className="w-6 h-6 text-red-600" />,
     text: "Either party may terminate this agreement at any time, with or without cause, by giving written notice. Upon termination, you must immediately cease all promotion of EKA Balance and remove all affiliate links from your channels."
    }
   ]
  },
  es: {
   title: "Términos del Programa de Afiliados",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Estos términos y condiciones rigen su participación en el Programa de Afiliados de EKA Balance. Al unirse a nuestro programa, acepta promocionar nuestros servicios de acuerdo con estos términos.",
   sections: [
    {
     title: "1. Inscripción y Aprobación",
     icon: <Users className="w-6 h-6 text-blue-600" />,
     text: "Para unirse al Programa de Afiliados, debe enviar una solicitud. Revisamos todas las solicitudes y nos reservamos el derecho de rechazar cualquier solicitud a nuestra entera discreción. Una vez aprobado, recibirá acceso a enlaces de afiliados y materiales de marketing."
    },
    {
     title: "2. Comisiones y Pagos",
     icon: <DollarSign className="w-6 h-6 text-green-600" />,
     text: "Ganará una comisión por cada venta calificada generada a través de su enlace de afiliado único. Las comisiones se pagan mensualmente, sujetas a un umbral mínimo de pago. Nos reservamos el derecho de ajustar las tasas de comisión con previo aviso."
    },
    {
     title: "3. Pautas de Promoción",
     icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
     text: "Acepta promocionar EKA Balance de una manera positiva y profesional. No debe utilizar afirmaciones engañosas o falsas, spam o cualquier práctica de marketing poco ética. Todos los materiales promocionales deben ser aprobados por nosotros o proporcionados por nosotros."
    },
    {
     title: "4. Propiedad Intelectual",
     icon: <FileText className="w-6 h-6 text-orange-600" />,
     text: "Le otorgamos una licencia limitada, no exclusiva e intransferible para utilizar nuestras marcas comerciales y logotipos únicamente con el fin de promocionar nuestros servicios como afiliado. No puede modificar nuestra marca sin nuestro consentimiento por escrito."
    },
    {
     title: "5. Terminación",
     icon: <XCircle className="w-6 h-6 text-red-600" />,
     text: "Cualquiera de las partes puede rescindir este acuerdo en cualquier momento, con o sin causa, mediante notificación por escrito. Tras la terminación, debe cesar inmediatamente toda promoción de EKA Balance y eliminar todos los enlaces de afiliados de sus canales."
    }
   ]
  },
  ca: {
   title: "Termes del Programa d'Afiliats",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquests termes i condicions regeixen la vostra participació en el Programa d'Afiliats d'EKA Balance. En unir-vos al nostre programa, accepteu promocionar els nostres serveis d'acord amb aquests termes.",
   sections: [
    {
     title: "1. Inscripció i Aprovació",
     icon: <Users className="w-6 h-6 text-blue-600" />,
     text: "Per unir-vos al Programa d'Afiliats, heu d'enviar una sol·licitud. Revisem totes les sol·licituds i ens reservem el dret de rebutjar qualsevol sol·licitud a la nostra discreció. Un cop aprovat, rebreu accés a enllaços d'afiliats i materials de màrqueting."
    },
    {
     title: "2. Comissions i Pagaments",
     icon: <DollarSign className="w-6 h-6 text-green-600" />,
     text: "Guanyareu una comissió per cada venda qualificada generada a través del vostre enllaç d'afiliat únic. Les comissions es paguen mensualment, subjectes a un llindar mínim de pagament. Ens reservem el dret d'ajustar les taxes de comissió amb previ avís."
    },
    {
     title: "3. Pautes de Promoció",
     icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
     text: "Accepteu promocionar EKA Balance d'una manera positiva i professional. No heu d'utilitzar afirmacions enganyoses o falses, correu brossa o qualsevol pràctica de màrqueting poc ètica. Tots els materials promocionals han de ser aprovats per nosaltres o proporcionats per nosaltres."
    },
    {
     title: "4. Propietat Intel·lectual",
     icon: <FileText className="w-6 h-6 text-orange-600" />,
     text: "Us atorguem una llicència limitada, no exclusiva i intransferible per utilitzar les nostres marques comercials i logotips únicament amb la finalitat de promocionar els nostres serveis com a afiliat. No podeu modificar la nostra marca sense el nostre consentiment per escrit."
    },
    {
     title: "5. Terminació",
     icon: <XCircle className="w-6 h-6 text-red-600" />,
     text: "Qualsevol de les parts pot rescindir aquest acord en qualsevol moment, amb o sense causa, mitjançant notificació per escrit. Després de la terminació, heu de cessar immediatament tota promoció d'EKA Balance i eliminar tots els enllaços d'afiliats dels vostres canals."
    }
   ]
  },
  ru: {
   title: "Условия партнерской программы",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "Эти условия регулируют ваше участие в партнерской программе EKA Balance. Присоединяясь к нашей программе, вы соглашаетесь продвигать наши услуги в соответствии с этими условиями.",
   sections: [
    {
     title: "1. Регистрация и утверждение",
     icon: <Users className="w-6 h-6 text-blue-600" />,
     text: "Чтобы присоединиться к партнерской программе, вы должны подать заявку. Мы рассматриваем все заявки и оставляем за собой право отклонить любую заявку по нашему собственному усмотрению. После одобрения вы получите доступ к партнерским ссылкам и маркетинговым материалам."
    },
    {
     title: "2. Комиссионные и выплаты",
     icon: <DollarSign className="w-6 h-6 text-green-600" />,
     text: "Вы будете получать комиссию за каждую квалифицированную продажу, совершенную по вашей уникальной партнерской ссылке. Комиссионные выплачиваются ежемесячно при условии достижения минимального порога выплат. Мы оставляем за собой право корректировать ставки комиссии с предварительным уведомлением."
    },
    {
     title: "3. Руководство по продвижению",
     icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
     text: "Вы соглашаетесь продвигать EKA Balance в позитивном и профессиональном ключе. Вы не должны использовать вводящие в заблуждение или ложные утверждения, спам или любые неэтичные маркетинговые практики. Все рекламные материалы должны быть одобрены нами или предоставлены нами."
    },
    {
     title: "4. Интеллектуальная собственность",
     icon: <FileText className="w-6 h-6 text-orange-600" />,
     text: "Мы предоставляем вам ограниченную, неисключительную, непередаваемую лицензию на использование наших товарных знаков и логотипов исключительно с целью продвижения наших услуг в качестве партнера. Вы не можете изменять наш бренд без нашего письменного согласия."
    },
    {
     title: "5. Прекращение действия",
     icon: <XCircle className="w-6 h-6 text-red-600" />,
     text: "Любая из сторон может расторгнуть это соглашение в любое время, с указанием причины или без таковой, направив письменное уведомление. После расторжения вы должны немедленно прекратить любое продвижение EKA Balance и удалить все партнерские ссылки со своих каналов."
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
         : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
       }`}
      >
       {lang.toUpperCase()}
      </button>
     ))}
    </div>
   </div>

   <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Users className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} className="flex gap-4 p-6 rounded-[32px] bg-gray-50 hover:bg-gray-100 transition-colors">
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
