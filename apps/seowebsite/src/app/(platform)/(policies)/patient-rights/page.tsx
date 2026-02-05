"use client";

import React, { useState } from "react";
import { Scale, Heart, MessageSquare, ShieldCheck, Clock } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function PatientRights() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Patient Rights & Responsibilities",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "At EKA Balance, we believe that a successful therapeutic relationship is built on mutual respect and understanding. This document outlines your rights as a patient and your responsibilities to ensure the best possible care.",
   sections: [
    {
     title: "1. Right to Respectful Care",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "You have the right to receive care that is respectful, non-discriminatory, and considerate of your personal values and beliefs. We are committed to providing a safe and inclusive environment for all patients."
    },
    {
     title: "2. Right to Information",
     icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
     text: "You have the right to be fully informed about your diagnosis, treatment options, and expected outcomes in a language you understand. You have the right to ask questions and participate in decisions about your care."
    },
    {
     title: "3. Right to Privacy and Confidentiality",
     icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
     text: "You have the right to privacy regarding your medical care and confidentiality of your medical records. Your information will only be shared in accordance with our Privacy Policy and applicable laws."
    },
    {
     title: "4. Responsibility to Provide Information",
     icon: <Scale className="w-6 h-6 text-purple-600" />,
     text: "You are responsible for providing accurate and complete information about your health history, current medications, and any other matters relevant to your care. This helps us provide the most effective treatment."
    },
    {
     title: "5. Responsibility for Appointments",
     icon: <Clock className="w-6 h-6 text-orange-600" />,
     text: "You are responsible for keeping appointments and notifying us in advance if you cannot attend. Late cancellations or missed appointments may be subject to fees as outlined in our cancellation policy."
    }
   ]
  },
  es: {
   title: "Derechos y Responsabilidades del Paciente",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "En EKA Balance, creemos que una relación terapéutica exitosa se basa en el respeto y la comprensión mutuos. Este documento describe sus derechos como paciente y sus responsabilidades para garantizar la mejor atención posible.",
   sections: [
    {
     title: "1. Derecho a una Atención Respetuosa",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Tiene derecho a recibir una atención respetuosa, no discriminatoria y considerada con sus valores y creencias personales. Nos comprometemos a proporcionar un entorno seguro e inclusivo para todos los pacientes."
    },
    {
     title: "2. Derecho a la Información",
     icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
     text: "Tiene derecho a estar plenamente informado sobre su diagnóstico, opciones de tratamiento y resultados esperados en un idioma que comprenda. Tiene derecho a hacer preguntas y participar en las decisiones sobre su atención."
    },
    {
     title: "3. Derecho a la Privacidad y Confidencialidad",
     icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
     text: "Tiene derecho a la privacidad con respecto a su atención médica y a la confidencialidad de sus registros médicos. Su información solo se compartirá de acuerdo con nuestra Política de Privacidad y las leyes aplicables."
    },
    {
     title: "4. Responsabilidad de Proporcionar Información",
     icon: <Scale className="w-6 h-6 text-purple-600" />,
     text: "Usted es responsable de proporcionar información precisa y completa sobre su historial de salud, medicamentos actuales y cualquier otro asunto relevante para su atención. Esto nos ayuda a proporcionar el tratamiento más eficaz."
    },
    {
     title: "5. Responsabilidad de las Citas",
     icon: <Clock className="w-6 h-6 text-orange-600" />,
     text: "Usted es responsable de asistir a las citas y notificarnos con anticipación si no puede asistir. Las cancelaciones tardías o las citas perdidas pueden estar sujetas a tarifas como se describe en nuestra política de cancelación."
    }
   ]
  },
  ca: {
   title: "Drets i Responsabilitats del Pacient",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "A EKA Balance, creiem que una relació terapèutica exitosa es basa en el respecte i la comprensió mutus. Aquest document descriu els vostres drets com a pacient i les vostres responsabilitats per garantir la millor atenció possible.",
   sections: [
    {
     title: "1. Dret a una Atenció Respectuosa",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Teniu dret a rebre una atenció respectuosa, no discriminatòria i considerada amb els vostres valors i creences personals. Ens comprometem a proporcionar un entorn segur i inclusiu per a tots els pacients."
    },
    {
     title: "2. Dret a la Informació",
     icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
     text: "Teniu dret a estar plenament informat sobre el vostre diagnòstic, opcions de tractament i resultats esperats en un idioma que comprengueu. Teniu dret a fer preguntes i participar en les decisions sobre la vostra atenció."
    },
    {
     title: "3. Dret a la Privacitat i Confidencialitat",
     icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
     text: "Teniu dret a la privacitat pel que fa a la vostra atenció mèdica i a la confidencialitat dels vostres registres mèdics. La vostra informació només es compartirà d'acord amb la nostra Política de Privacitat i les lleis aplicables."
    },
    {
     title: "4. Responsabilitat de Proporcionar Informació",
     icon: <Scale className="w-6 h-6 text-purple-600" />,
     text: "Sou responsable de proporcionar informació precisa i completa sobre el vostre historial de salut, medicaments actuals i qualsevol altre assumpte rellevant per a la vostra atenció. Això ens ajuda a proporcionar el tractament més eficaç."
    },
    {
     title: "5. Responsabilitat de les Cites",
     icon: <Clock className="w-6 h-6 text-orange-600" />,
     text: "Sou responsable d'assistir a les cites i notificar-nos amb antelació si no podeu assistir. Les cancel·lacions tardanes o les cites perdudes poden estar subjectes a tarifes com es descriu a la nostra política de cancel·lació."
    }
   ]
  },
  ru: {
   title: "Права и обязанности пациента",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "В EKA Balance мы считаем, что успешные терапевтические отношения строятся на взаимном уважении и понимании. В этом документе изложены ваши права как пациента и ваши обязанности по обеспечению наилучшего ухода.",
   sections: [
    {
     title: "1. Право на уважительное отношение",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Вы имеете право на получение помощи, которая является уважительной, недискриминационной и учитывает ваши личные ценности и убеждения. Мы стремимся обеспечить безопасную и инклюзивную среду для всех пациентов."
    },
    {
     title: "2. Право на информацию",
     icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
     text: "Вы имеете право быть полностью информированным о своем диагнозе, вариантах лечения и ожидаемых результатах на понятном вам языке. Вы имеете право задавать вопросы и участвовать в принятии решений о вашем лечении."
    },
    {
     title: "3. Право на конфиденциальность",
     icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
     text: "Вы имеете право на конфиденциальность в отношении вашего медицинского обслуживания и конфиденциальность ваших медицинских записей. Ваша информация будет передаваться только в соответствии с нашей Политикой конфиденциальности и применимыми законами."
    },
    {
     title: "4. Обязанность предоставлять информацию",
     icon: <Scale className="w-6 h-6 text-purple-600" />,
     text: "Вы несете ответственность за предоставление точной и полной информации о вашей истории болезни, текущих лекарствах и любых других вопросах, имеющих отношение к вашему лечению. Это помогает нам обеспечить наиболее эффективное лечение."
    },
    {
     title: "5. Ответственность за посещение",
     icon: <Clock className="w-6 h-6 text-orange-600" />,
     text: "Вы несете ответственность за посещение приемов и уведомление нас заранее, если вы не можете прийти. За позднюю отмену или пропущенные приемы может взиматься плата, как указано в нашей политике отмены."
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
    <div className="bg-linear-to-r from-blue-500 to-emerald-500 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Scale className="w-12 h-12 opacity-90" />
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
