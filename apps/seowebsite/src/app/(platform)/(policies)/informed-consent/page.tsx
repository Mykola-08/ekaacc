"use client";

import React, { useState } from "react";
import { FileSignature, CheckSquare, AlertCircle, HelpCircle, UserPlus } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function InformedConsent() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Informed Consent Form",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This document serves as a general informed consent form for treatment at EKA Balance. Specific procedures may require additional consent forms. Please read this carefully and ask any questions you may have.",
   sections: [
    {
     title: "1. Consent to Treatment",
     icon: <FileSignature className="w-6 h-6 text-blue-600" />,
     text: "I voluntarily consent to evaluation, assessment, and treatment by the providers at EKA Balance. I understand that I have the right to withdraw my consent at any time."
    },
    {
     title: "2. Understanding Risks and Benefits",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "I understand that all treatments carry potential risks and benefits. My provider will explain the specific risks and benefits associated with my treatment plan, as well as any alternative options."
    },
    {
     title: "3. Financial Responsibility",
     icon: <CheckSquare className="w-6 h-6 text-green-600" />,
     text: "I understand that I am financially responsible for all charges incurred for the services provided, regardless of insurance coverage. I agree to pay for services at the time they are rendered unless other arrangements have been made."
    },
    {
     title: "4. Emergency Situations",
     icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
     text: "I understand that EKA Balance is not an emergency service. In case of a medical or psychiatric emergency, I agree to call emergency services (112 or 911) or go to the nearest emergency room."
    },
    {
     title: "5. Collaboration with Other Providers",
     icon: <UserPlus className="w-6 h-6 text-red-600" />,
     text: "I authorize EKA Balance to communicate with my other healthcare providers as necessary for the coordination of my care, provided that such communication is in my best interest and complies with privacy laws."
    }
   ]
  },
  es: {
   title: "Formulario de Consentimiento Informado",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Este documento sirve como un formulario de consentimiento informado general para el tratamiento en EKA Balance. Los procedimientos específicos pueden requerir formularios de consentimiento adicionales. Lea esto detenidamente y haga cualquier pregunta que pueda tener.",
   sections: [
    {
     title: "1. Consentimiento para el Tratamiento",
     icon: <FileSignature className="w-6 h-6 text-blue-600" />,
     text: "Doy mi consentimiento voluntario para la evaluación, valoración y tratamiento por parte de los proveedores de EKA Balance. Entiendo que tengo derecho a retirar mi consentimiento en cualquier momento."
    },
    {
     title: "2. Comprensión de Riesgos y Beneficios",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Entiendo que todos los tratamientos conllevan riesgos y beneficios potenciales. Mi proveedor explicará los riesgos y beneficios específicos asociados con mi plan de tratamiento, así como cualquier opción alternativa."
    },
    {
     title: "3. Responsabilidad Financiera",
     icon: <CheckSquare className="w-6 h-6 text-green-600" />,
     text: "Entiendo que soy financieramente responsable de todos los cargos incurridos por los servicios prestados, independientemente de la cobertura del seguro. Acepto pagar los servicios en el momento en que se presten, a menos que se hayan hecho otros arreglos."
    },
    {
     title: "4. Situaciones de Emergencia",
     icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
     text: "Entiendo que EKA Balance no es un servicio de emergencia. En caso de una emergencia médica o psiquiátrica, acepto llamar a los servicios de emergencia (112 o 911) o acudir a la sala de emergencias más cercana."
    },
    {
     title: "5. Colaboración con Otros Proveedores",
     icon: <UserPlus className="w-6 h-6 text-red-600" />,
     text: "Autorizo a EKA Balance a comunicarse con mis otros proveedores de atención médica según sea necesario para la coordinación de mi atención, siempre que dicha comunicación sea en mi mejor interés y cumpla con las leyes de privacidad."
    }
   ]
  },
  ca: {
   title: "Formulari de Consentiment Informat",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquest document serveix com a formulari de consentiment informat general per al tractament a EKA Balance. Els procediments específics poden requerir formularis de consentiment addicionals. Llegiu-ho detingudament i feu qualsevol pregunta que tingueu.",
   sections: [
    {
     title: "1. Consentiment per al Tractament",
     icon: <FileSignature className="w-6 h-6 text-blue-600" />,
     text: "Dono el meu consentiment voluntari per a l'avaluació, valoració i tractament per part dels proveïdors d'EKA Balance. Entenc que tinc dret a retirar el meu consentiment en qualsevol moment."
    },
    {
     title: "2. Comprensió de Riscos i Beneficis",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Entenc que tots els tractaments comporten riscos i beneficis potencials. El meu proveïdor explicarà els riscos i beneficis específics associats amb el meu pla de tractament, així com qualsevol opció alternativa."
    },
    {
     title: "3. Responsabilitat Financera",
     icon: <CheckSquare className="w-6 h-6 text-green-600" />,
     text: "Entenc que sóc financerament responsable de tots els càrrecs incorreguts pels serveis prestats, independentment de la cobertura de l'assegurança. Accepto pagar els serveis en el moment en què es prestin, tret que s'hagin fet altres acords."
    },
    {
     title: "4. Situacions d'Emergència",
     icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
     text: "Entenc que EKA Balance no és un servei d'emergència. En cas d'una emergència mèdica o psiquiàtrica, accepto trucar als serveis d'emergència (112 o 911) o anar a la sala d'emergències més propera."
    },
    {
     title: "5. Col·laboració amb Altres Proveïdors",
     icon: <UserPlus className="w-6 h-6 text-red-600" />,
     text: "Autoritzo a EKA Balance a comunicar-se amb els meus altres proveïdors d'atenció mèdica segons sigui necessari per a la coordinació de la meva atenció, sempre que aquesta comunicació sigui en el meu millor interès i compleixi amb les lleis de privacitat."
    }
   ]
  },
  ru: {
   title: "Форма информированного согласия",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "Этот документ служит общей формой информированного согласия на лечение в EKA Balance. Конкретные процедуры могут потребовать дополнительных форм согласия. Пожалуйста, внимательно прочитайте это и задайте любые вопросы, которые могут у вас возникнуть.",
   sections: [
    {
     title: "1. Согласие на лечение",
     icon: <FileSignature className="w-6 h-6 text-blue-600" />,
     text: "Я добровольно даю согласие на оценку, обследование и лечение поставщиками услуг EKA Balance. Я понимаю, что имею право отозвать свое согласие в любое время."
    },
    {
     title: "2. Понимание рисков и преимуществ",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Я понимаю, что все методы лечения несут потенциальные риски и преимущества. Мой лечащий врач объяснит конкретные риски и преимущества, связанные с моим планом лечения, а также любые альтернативные варианты."
    },
    {
     title: "3. Финансовая ответственность",
     icon: <CheckSquare className="w-6 h-6 text-green-600" />,
     text: "Я понимаю, что несу финансовую ответственность за все расходы, понесенные за предоставленные услуги, независимо от страхового покрытия. Я соглашаюсь оплачивать услуги в момент их оказания, если не были приняты иные договоренности."
    },
    {
     title: "4. Чрезвычайные ситуации",
     icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
     text: "Я понимаю, что EKA Balance не является службой экстренной помощи. В случае неотложной медицинской или психиатрической помощи я соглашаюсь позвонить в службу экстренной помощи (112 или 911) или обратиться в ближайшее отделение неотложной помощи."
    },
    {
     title: "5. Сотрудничество с другими поставщиками",
     icon: <UserPlus className="w-6 h-6 text-red-600" />,
     text: "Я разрешаю EKA Balance общаться с другими моими поставщиками медицинских услуг по мере необходимости для координации моего лечения, при условии, что такое общение отвечает моим интересам и соответствует законам о конфиденциальности."
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
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <FileSignature className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} className="flex gap-4 p-6 rounded-[32px] bg-muted/30 hover:bg-muted transition-colors">
       <div className="flex-shrink-0 mt-1">{section.icon}</div>
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
