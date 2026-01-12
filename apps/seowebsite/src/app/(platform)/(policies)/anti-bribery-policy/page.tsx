"use client";

import React, { useState } from "react";
import { Ban, Gift, Globe, Shield, FileText } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function AntiBriberyPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Anti-Bribery & Corruption Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "EKA Balance has a zero-tolerance policy towards bribery and corruption. We are committed to acting professionally, fairly, and with integrity in all our business dealings and relationships wherever we operate.",
   sections: [
    {
     title: "1. Prohibition of Bribery",
     icon: <Ban className="w-6 h-6 text-red-600" />,
     text: "Employees and partners must never offer, promise, give, request, agree to receive, or accept any bribe. A bribe is a financial or other advantage intended to induce or reward improper performance of a function or activity."
    },
    {
     title: "2. Gifts and Hospitality",
     icon: <Gift className="w-6 h-6 text-purple-600" />,
     text: "Gifts and hospitality must be reasonable, proportionate, and for a legitimate business purpose. They must never be used to influence a business decision or gain an unfair advantage. All gifts must be recorded transparently."
    },
    {
     title: "3. Facilitation Payments",
     icon: <FileText className="w-6 h-6 text-blue-600" />,
     text: "We do not make, and will not accept, facilitation payments or 'kickbacks' of any kind. Facilitation payments are typically small, unofficial payments made to secure or expedite a routine government action."
    },
    {
     title: "4. Third Parties",
     icon: <Globe className="w-6 h-6 text-green-600" />,
     text: "We expect all third parties acting on our behalf to share our commitment to zero tolerance for bribery and corruption. We will conduct due diligence on third parties and monitor their compliance."
    },
    {
     title: "5. Reporting and Whistleblowing",
     icon: <Shield className="w-6 h-6 text-indigo-600" />,
     text: "We encourage employees and partners to report any suspicions of bribery or corruption. We provide a safe and confidential channel for reporting and protect whistleblowers from retaliation."
    }
   ]
  },
  es: {
   title: "Política Anticorrupción y Soborno",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "EKA Balance tiene una política de tolerancia cero hacia el soborno y la corrupción. Nos comprometemos a actuar de manera profesional, justa e íntegra en todos nuestros tratos y relaciones comerciales dondequiera que operemos.",
   sections: [
    {
     title: "1. Prohibición del Soborno",
     icon: <Ban className="w-6 h-6 text-red-600" />,
     text: "Los empleados y socios nunca deben ofrecer, prometer, dar, solicitar, aceptar recibir o aceptar ningún soborno. Un soborno es una ventaja financiera o de otro tipo destinada a inducir o recompensar el desempeño inadecuado de una función o actividad."
    },
    {
     title: "2. Regalos y Hospitalidad",
     icon: <Gift className="w-6 h-6 text-purple-600" />,
     text: "Los regalos y la hospitalidad deben ser razonables, proporcionados y con un propósito comercial legítimo. Nunca deben usarse para influir en una decisión comercial u obtener una ventaja injusta. Todos los regalos deben registrarse de forma transparente."
    },
    {
     title: "3. Pagos de Facilitación",
     icon: <FileText className="w-6 h-6 text-blue-600" />,
     text: "No realizamos ni aceptaremos pagos de facilitación o 'comisiones ilegales' de ningún tipo. Los pagos de facilitación suelen ser pequeños pagos no oficiales realizados para asegurar o acelerar una acción gubernamental de rutina."
    },
    {
     title: "4. Terceros",
     icon: <Globe className="w-6 h-6 text-green-600" />,
     text: "Esperamos que todos los terceros que actúen en nuestro nombre compartan nuestro compromiso de tolerancia cero con el soborno y la corrupción. Realizaremos la debida diligencia con terceros y supervisaremos su cumplimiento."
    },
    {
     title: "5. Denuncias y Confidencialidad",
     icon: <Shield className="w-6 h-6 text-indigo-600" />,
     text: "Alentamos a los empleados y socios a denunciar cualquier sospecha de soborno o corrupción. Proporcionamos un canal seguro y confidencial para denunciar y protegemos a los denunciantes de represalias."
    }
   ]
  },
  ca: {
   title: "Política Anticorrupció i Suborn",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "EKA Balance té una política de tolerància zero cap al suborn i la corrupció. Ens comprometem a actuar de manera professional, justa i íntegra en tots els nostres tractes i relacions comercials allà on operem.",
   sections: [
    {
     title: "1. Prohibició del Suborn",
     icon: <Ban className="w-6 h-6 text-red-600" />,
     text: "Els empleats i socis mai no han d'oferir, prometre, donar, sol·licitar, acceptar rebre o acceptar cap suborn. Un suborn és un avantatge financer o d'un altre tipus destinat a induir o recompensar l'exercici inadequat d'una funció o activitat."
    },
    {
     title: "2. Regals i Hospitalitat",
     icon: <Gift className="w-6 h-6 text-purple-600" />,
     text: "Els regals i l'hospitalitat han de ser raonables, proporcionats i amb un propòsit comercial legítim. Mai no s'han d'utilitzar per influir en una decisió comercial o obtenir un avantatge injust. Tots els regals s'han de registrar de manera transparent."
    },
    {
     title: "3. Pagaments de Facilitació",
     icon: <FileText className="w-6 h-6 text-blue-600" />,
     text: "No realitzem ni acceptarem pagaments de facilitació o 'comissions il·legals' de cap mena. Els pagaments de facilitació solen ser petits pagaments no oficials realitzats per assegurar o accelerar una acció governamental de rutina."
    },
    {
     title: "4. Tercers",
     icon: <Globe className="w-6 h-6 text-green-600" />,
     text: "Esperem que tots els tercers que actuïn en nom nostre comparteixin el nostre compromís de tolerància zero amb el suborn i la corrupció. Realitzarem la deguda diligència amb tercers i supervisarem el seu compliment."
    },
    {
     title: "5. Denúncies i Confidencialitat",
     icon: <Shield className="w-6 h-6 text-indigo-600" />,
     text: "Encoratgem els empleats i socis a denunciar qualsevol sospita de suborn o corrupció. Proporcionem un canal segur i confidencial per denunciar i protegim els denunciants de represàlies."
    }
   ]
  },
  ru: {
   title: "Политика по борьбе со взяточничеством и коррупцией",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "EKA Balance придерживается политики нулевой терпимости к взяточничеству и коррупции. Мы обязуемся действовать профессионально, справедливо и честно во всех наших деловых отношениях, где бы мы ни работали.",
   sections: [
    {
     title: "1. Запрет взяточничества",
     icon: <Ban className="w-6 h-6 text-red-600" />,
     text: "Сотрудники и партнеры никогда не должны предлагать, обещать, давать, запрашивать, соглашаться получить или принимать какие-либо взятки. Взятка — это финансовое или иное преимущество, предназначенное для побуждения или вознаграждения за ненадлежащее выполнение функции или деятельности."
    },
    {
     title: "2. Подарки и гостеприимство",
     icon: <Gift className="w-6 h-6 text-purple-600" />,
     text: "Подарки и гостеприимство должны быть разумными, соразмерными и иметь законную деловую цель. Они никогда не должны использоваться для влияния на деловое решение или получения несправедливого преимущества. Все подарки должны регистрироваться прозрачно."
    },
    {
     title: "3. Платежи за упрощение формальностей",
     icon: <FileText className="w-6 h-6 text-blue-600" />,
     text: "Мы не производим и не принимаем платежи за упрощение формальностей или «откаты» любого рода. Платежи за упрощение формальностей — это, как правило, небольшие неофициальные платежи, производимые для обеспечения или ускорения рутинных действий правительства."
    },
    {
     title: "4. Третьи стороны",
     icon: <Globe className="w-6 h-6 text-green-600" />,
     text: "Мы ожидаем, что все третьи стороны, действующие от нашего имени, разделяют нашу приверженность нулевой терпимости к взяточничеству и коррупции. Мы будем проводить комплексную проверку третьих сторон и контролировать их соблюдение."
    },
    {
     title: "5. Отчетность и информирование",
     icon: <Shield className="w-6 h-6 text-indigo-600" />,
     text: "Мы призываем сотрудников и партнеров сообщать о любых подозрениях во взяточничестве или коррупции. Мы предоставляем безопасный и конфиденциальный канал для отчетности и защищаем информаторов от преследования."
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
    <div className="bg-gradient-to-r from-red-700 to-pink-700 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Ban className="w-12 h-12 opacity-90" />
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
