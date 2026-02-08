"use client";

import React, { useState } from "react";
import { Video, Wifi, UserCheck, AlertTriangle, FileSignature } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function TelehealthConsent() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Telehealth Consent",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This document outlines your consent to receive health care services via telehealth technologies. Telehealth involves the use of electronic communications to enable health care providers at different locations to share individual patient medical information for the purpose of improving patient care.",
   sections: [
    {
     title: "1. Nature of Telehealth",
     icon: <Video className="w-6 h-6 text-blue-600" />,
     text: "Telehealth services may include health care delivery, diagnosis, consultation, treatment, transfer of medical data, and education using interactive audio, video, or data communications."
    },
    {
     title: "2. Benefits and Risks",
     icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
     text: "Benefits include improved access to care and convenience. Risks include potential technical failures, security breaches, or the need for in-person care if the provider determines telehealth is not appropriate."
    },
    {
     title: "3. Technology Requirements",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "You are responsible for ensuring you have a private location, a secure internet connection, and the necessary device (computer, tablet, or smartphone) to participate in the telehealth session."
    },
    {
     title: "4. Confidentiality",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "The laws that protect the privacy and confidentiality of medical information also apply to telehealth. No recording of the session is permitted without the written consent of both parties."
    },
    {
     title: "5. Your Rights",
     icon: <FileSignature className="w-6 h-6 text-red-600" />,
     text: "You have the right to withhold or withdraw your consent to the use of telehealth in the course of your care at any time, without affecting your right to future care or treatment."
    }
   ]
  },
  es: {
   title: "Consentimiento de Telesalud",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Este documento describe su consentimiento para recibir servicios de atención médica a través de tecnologías de telesalud. La telesalud implica el uso de comunicaciones electrónicas para permitir que los proveedores de atención médica en diferentes ubicaciones compartan información médica individual del paciente con el fin de mejorar la atención al paciente.",
   sections: [
    {
     title: "1. Naturaleza de la Telesalud",
     icon: <Video className="w-6 h-6 text-blue-600" />,
     text: "Los servicios de telesalud pueden incluir la prestación de atención médica, diagnóstico, consulta, tratamiento, transferencia de datos médicos y educación mediante comunicaciones interactivas de audio, video o datos."
    },
    {
     title: "2. Beneficios y Riesgos",
     icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
     text: "Los beneficios incluyen un mejor acceso a la atención y conveniencia. Los riesgos incluyen posibles fallas técnicas, violaciones de seguridad o la necesidad de atención en persona si el proveedor determina que la telesalud no es adecuada."
    },
    {
     title: "3. Requisitos Tecnológicos",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Usted es responsable de asegurarse de tener una ubicación privada, una conexión a Internet segura y el dispositivo necesario (computadora, tableta o teléfono inteligente) para participar en la sesión de telesalud."
    },
    {
     title: "4. Confidencialidad",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Las leyes que protegen la privacidad y confidencialidad de la información médica también se aplican a la telesalud. No se permite la grabación de la sesión sin el consentimiento por escrito de ambas partes."
    },
    {
     title: "5. Sus Derechos",
     icon: <FileSignature className="w-6 h-6 text-red-600" />,
     text: "Tiene derecho a negar o retirar su consentimiento para el uso de la telesalud en el curso de su atención en cualquier momento, sin afectar su derecho a atención o tratamiento futuros."
    }
   ]
  },
  ca: {
   title: "Consentiment de Telesalut",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquest document descriu el vostre consentiment per rebre serveis d'atenció mèdica mitjançant tecnologies de telesalut. La telesalut implica l'ús de comunicacions electròniques per permetre que els proveïdors d'atenció mèdica en diferents ubicacions comparteixin informació mèdica individual del pacient amb la finalitat de millorar l'atenció al pacient.",
   sections: [
    {
     title: "1. Naturalesa de la Telesalut",
     icon: <Video className="w-6 h-6 text-blue-600" />,
     text: "Els serveis de telesalut poden incloure la prestació d'atenció mèdica, diagnòstic, consulta, tractament, transferència de dades mèdiques i educació mitjançant comunicacions interactives d'àudio, vídeo o dades."
    },
    {
     title: "2. Beneficis i Riscos",
     icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
     text: "Els beneficis inclouen un millor accés a l'atenció i conveniència. Els riscos inclouen possibles fallades tècniques, violacions de seguretat o la necessitat d'atenció presencial si el proveïdor determina que la telesalut no és adequada."
    },
    {
     title: "3. Requisits Tecnològics",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Sou responsable d'assegurar-vos de tenir una ubicació privada, una connexió a Internet segura i el dispositiu necessari (ordinador, tauleta o telèfon intel·ligent) per participar en la sessió de telesalut."
    },
    {
     title: "4. Confidencialitat",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Les lleis que protegeixen la privacitat i confidencialitat de la informació mèdica també s'apliquen a la telesalut. No es permet l'enregistrament de la sessió sense el consentiment per escrit d'ambdues parts."
    },
    {
     title: "5. Els Vostres Drets",
     icon: <FileSignature className="w-6 h-6 text-red-600" />,
     text: "Teniu dret a negar o retirar el vostre consentiment per a l'ús de la telesalut en el curs de la vostra atenció en qualsevol moment, sense afectar el vostre dret a atenció o tractament futurs."
    }
   ]
  },
  ru: {
   title: "Согласие на телемедицину",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "В этом документе изложено ваше согласие на получение медицинских услуг с помощью технологий телемедицины. Телемедицина предполагает использование электронных коммуникаций, позволяющих медицинским работникам в разных местах обмениваться индивидуальной медицинской информацией о пациенте с целью улучшения ухода за пациентами.",
   sections: [
    {
     title: "1. Природа телемедицины",
     icon: <Video className="w-6 h-6 text-blue-600" />,
     text: "Услуги телемедицины могут включать оказание медицинской помощи, диагностику, консультации, лечение, передачу медицинских данных и обучение с использованием интерактивных аудио-, видео- или информационных коммуникаций."
    },
    {
     title: "2. Преимущества и риски",
     icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
     text: "Преимущества включают улучшенный доступ к медицинской помощи и удобство. Риски включают возможные технические сбои, нарушения безопасности или необходимость очного лечения, если поставщик решит, что телемедицина не подходит."
    },
    {
     title: "3. Технологические требования",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Вы несете ответственность за обеспечение наличия у вас уединенного места, безопасного подключения к Интернету и необходимого устройства (компьютера, планшета или смартфона) для участия в сеансе телемедицины."
    },
    {
     title: "4. Конфиденциальность",
     icon: <UserCheck className="w-6 h-6 text-purple-600" />,
     text: "Законы, защищающие конфиденциальность медицинской информации, также распространяются на телемедицину. Запись сеанса без письменного согласия обеих сторон запрещена."
    },
    {
     title: "5. Ваши права",
     icon: <FileSignature className="w-6 h-6 text-red-600" />,
     text: "Вы имеете право отказать или отозвать свое согласие на использование телемедицины в ходе вашего лечения в любое время, не затрагивая ваше право на будущее лечение или уход."
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
    <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Video className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} className="flex gap-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted transition-colors">
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

