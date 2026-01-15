"use client";

import React, { useState } from "react";
import { Laptop, Wifi, Clock, Home, Shield } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function RemoteWorkPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Remote Work Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "EKA Balance supports remote work to provide flexibility and promote work-life balance. This policy outlines the guidelines and expectations for employees working remotely.",
   sections: [
    {
     title: "1. Eligibility and Approval",
     icon: <Home className="w-6 h-6 text-blue-600" />,
     text: "Remote work is available to eligible employees whose roles allow for it. Approval must be obtained from the immediate supervisor and HR. We assess eligibility based on job responsibilities, performance, and the ability to work independently."
    },
    {
     title: "2. Workspace and Equipment",
     icon: <Laptop className="w-6 h-6 text-muted-foreground" />,
     text: "Employees are responsible for maintaining a safe and productive workspace at home. EKA Balance provides necessary equipment, such as laptops and software. Employees must ensure they have a reliable internet connection."
    },
    {
     title: "3. Security and Confidentiality",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "Security is paramount when working remotely. Employees must use secure connections (VPN), keep devices updated, and protect confidential information from unauthorized access. Physical security of devices must also be maintained."
    },
    {
     title: "4. Availability and Communication",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Remote employees are expected to be available during agreed-upon working hours. Regular communication with the team and supervisor is essential. We use various collaboration tools to stay connected and ensure seamless teamwork."
    },
    {
     title: "5. Health and Well-being",
     icon: <Clock className="w-6 h-6 text-purple-600" />,
     text: "We encourage employees to maintain a healthy work-life balance. This includes taking regular breaks, setting boundaries between work and personal time, and setting up an ergonomic workspace to prevent strain or injury."
    }
   ]
  },
  es: {
   title: "Política de Trabajo Remoto",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "EKA Balance apoya el trabajo remoto para brindar flexibilidad y promover el equilibrio entre la vida laboral y personal. Esta política describe las pautas y expectativas para los empleados que trabajan de forma remota.",
   sections: [
    {
     title: "1. Elegibilidad y Aprobación",
     icon: <Home className="w-6 h-6 text-blue-600" />,
     text: "El trabajo remoto está disponible para los empleados elegibles cuyos roles lo permitan. Se debe obtener la aprobación del supervisor inmediato y de RR.HH. Evaluamos la elegibilidad en función de las responsabilidades laborales, el desempeño y la capacidad para trabajar de forma independiente."
    },
    {
     title: "2. Espacio de Trabajo y Equipo",
     icon: <Laptop className="w-6 h-6 text-muted-foreground" />,
     text: "Los empleados son responsables de mantener un espacio de trabajo seguro y productivo en casa. EKA Balance proporciona el equipo necesario, como computadoras portátiles y software. Los empleados deben asegurarse de tener una conexión a Internet confiable."
    },
    {
     title: "3. Seguridad y Confidencialidad",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "La seguridad es primordial cuando se trabaja de forma remota. Los empleados deben usar conexiones seguras (VPN), mantener los dispositivos actualizados y proteger la información confidencial del acceso no autorizado. También se debe mantener la seguridad física de los dispositivos."
    },
    {
     title: "4. Disponibilidad y Comunicación",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Se espera que los empleados remotos estén disponibles durante las horas de trabajo acordadas. La comunicación regular con el equipo y el supervisor es esencial. Utilizamos varias herramientas de colaboración para mantenernos conectados y garantizar un trabajo en equipo fluido."
    },
    {
     title: "5. Salud y Bienestar",
     icon: <Clock className="w-6 h-6 text-purple-600" />,
     text: "Alentamos a los empleados a mantener un equilibrio saludable entre el trabajo y la vida personal. Esto incluye tomar descansos regulares, establecer límites entre el trabajo y el tiempo personal, y configurar un espacio de trabajo ergonómico para evitar tensiones o lesiones."
    }
   ]
  },
  ca: {
   title: "Política de Treball Remot",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "EKA Balance dóna suport al treball remot per oferir flexibilitat i promoure l'equilibri entre la vida laboral i personal. Aquesta política descriu les directrius i expectatives per als empleats que treballen de forma remota.",
   sections: [
    {
     title: "1. Elegibilitat i Aprovació",
     icon: <Home className="w-6 h-6 text-blue-600" />,
     text: "El treball remot està disponible per als empleats elegibles els rols dels quals ho permetin. S'ha d'obtenir l'aprovació del supervisor immediat i de RR.HH. Avaluem l'elegibilitat en funció de les responsabilitats laborals, el rendiment i la capacitat per treballar de forma independent."
    },
    {
     title: "2. Espai de Treball i Equip",
     icon: <Laptop className="w-6 h-6 text-muted-foreground" />,
     text: "Els empleats són responsables de mantenir un espai de treball segur i productiu a casa. EKA Balance proporciona l'equip necessari, com ordinadors portàtils i programari. Els empleats han d'assegurar-se de tenir una connexió a Internet fiable."
    },
    {
     title: "3. Seguretat i Confidencialitat",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "La seguretat és primordial quan es treballa de forma remota. Els empleats han d'utilitzar connexions segures (VPN), mantenir els dispositius actualitzats i protegir la informació confidencial de l'accés no autoritzat. També s'ha de mantenir la seguretat física dels dispositius."
    },
    {
     title: "4. Disponibilitat i Comunicació",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "S'espera que els empleats remots estiguin disponibles durant les hores de treball acordades. La comunicació regular amb l'equip i el supervisor és essencial. Utilitzem diverses eines de col·laboració per mantenir-nos connectats i garantir un treball en equip fluid."
    },
    {
     title: "5. Salut i Benestar",
     icon: <Clock className="w-6 h-6 text-purple-600" />,
     text: "Encoratgem els empleats a mantenir un equilibri saludable entre la feina i la vida personal. Això inclou fer pauses regulars, establir límits entre la feina i el temps personal, i configurar un espai de treball ergonòmic per evitar tensions o lesions."
    }
   ]
  },
  ru: {
   title: "Политика удаленной работы",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "EKA Balance поддерживает удаленную работу, чтобы обеспечить гибкость и способствовать балансу между работой и личной жизнью. Эта политика определяет руководящие принципы и ожидания для сотрудников, работающих удаленно.",
   sections: [
    {
     title: "1. Право на участие и утверждение",
     icon: <Home className="w-6 h-6 text-blue-600" />,
     text: "Удаленная работа доступна для сотрудников, чьи роли это позволяют. Необходимо получить одобрение непосредственного руководителя и отдела кадров. Мы оцениваем право на участие на основе должностных обязанностей, производительности и способности работать самостоятельно."
    },
    {
     title: "2. Рабочее место и оборудование",
     icon: <Laptop className="w-6 h-6 text-muted-foreground" />,
     text: "Сотрудники несут ответственность за поддержание безопасного и продуктивного рабочего места дома. EKA Balance предоставляет необходимое оборудование, такое как ноутбуки и программное обеспечение. Сотрудники должны обеспечить надежное подключение к Интернету."
    },
    {
     title: "3. Безопасность и конфиденциальность",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "Безопасность имеет первостепенное значение при удаленной работе. Сотрудники должны использовать безопасные соединения (VPN), обновлять устройства и защищать конфиденциальную информацию от несанкционированного доступа. Также должна обеспечиваться физическая безопасность устройств."
    },
    {
     title: "4. Доступность и коммуникация",
     icon: <Wifi className="w-6 h-6 text-green-600" />,
     text: "Ожидается, что удаленные сотрудники будут доступны в согласованное рабочее время. Регулярное общение с командой и руководителем имеет важное значение. Мы используем различные инструменты совместной работы, чтобы оставаться на связи и обеспечивать бесперебойную командную работу."
    },
    {
     title: "5. Здоровье и благополучие",
     icon: <Clock className="w-6 h-6 text-purple-600" />,
     text: "Мы призываем сотрудников поддерживать здоровый баланс между работой и личной жизнью. Это включает в себя регулярные перерывы, установление границ между работой и личным временем, а также организацию эргономичного рабочего места для предотвращения перенапряжения или травм."
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
    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Laptop className="w-12 h-12 opacity-90" />
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
