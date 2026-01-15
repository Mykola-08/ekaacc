"use client";

import React, { useState } from "react";
import { Lock, Server, Key, ShieldCheck, FileWarning } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function InformationSecurityPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Information Security Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "EKA Balance is committed to protecting the confidentiality, integrity, and availability of our information assets. This policy outlines our approach to information security management.",
   sections: [
    {
     id: "access-control",
     title: "1. Access Control",
     icon: <Key className="w-6 h-6 text-blue-600" />,
     text: "Access to information and systems is granted based on the principle of least privilege. Users are only granted access to the data and resources necessary for their role. Strong authentication measures, including multi-factor authentication, are enforced."
    },
    {
     id: "data-protection",
     title: "2. Data Protection",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Sensitive data is encrypted both in transit and at rest. We implement strict controls to prevent unauthorized disclosure, modification, or destruction of data. Regular backups are performed to ensure data availability."
    },
    {
     id: "network-security",
     title: "3. Network Security",
     icon: <Server className="w-6 h-6 text-purple-600" />,
     text: "Our network infrastructure is protected by firewalls, intrusion detection systems, and regular security assessments. We monitor network traffic for suspicious activity and maintain secure configurations for all network devices."
    },
    {
     id: "incident-management",
     title: "4. Incident Management",
     icon: <FileWarning className="w-6 h-6 text-orange-600" />,
     text: "We have established procedures for reporting and responding to information security incidents. All employees are required to report suspected security breaches immediately. Incidents are investigated, and corrective actions are taken to prevent recurrence."
    },
    {
     id: "compliance",
     title: "5. Compliance and Auditing",
     icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
     text: "We regularly audit our information security controls to ensure compliance with internal policies and external regulations. We are committed to continuous improvement of our information security management system."
    }
   ]
  },
  es: {
   title: "Política de Seguridad de la Información",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "EKA Balance se compromete a proteger la confidencialidad, integridad y disponibilidad de nuestros activos de información. Esta política describe nuestro enfoque para la gestión de la seguridad de la información.",
   sections: [
    {
     id: "access-control",
     title: "1. Control de Acceso",
     icon: <Key className="w-6 h-6 text-blue-600" />,
     text: "El acceso a la información y los sistemas se otorga según el principio de privilegi mínimo. A los usuarios solo se les otorga acceso a los datos y recursos necesarios para su función. Se aplican medidas de autenticación sólidas, incluida la autenticación multifactor."
    },
    {
     id: "data-protection",
     title: "2. Protección de Datos",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Los datos confidenciales se cifran tanto en tránsito como en reposo. Implementamos controles estrictos para evitar la divulgación, modificación o destrucción no autorizada de datos. Se realizan copias de seguridad periódicas para garantizar la disponibilidad de los datos."
    },
    {
     id: "network-security",
     title: "3. Seguridad de la Red",
     icon: <Server className="w-6 h-6 text-purple-600" />,
     text: "Nuestra infraestructura de red está protegida por firewalls, sistemas de detección de intrusos y evaluaciones de seguridad periódicas. Monitoreamos el tráfico de la red en busca de actividades sospechosas y mantenemos configuraciones seguras para todos los dispositivos de red."
    },
    {
     id: "incident-management",
     title: "4. Gestión de Incidentes",
     icon: <FileWarning className="w-6 h-6 text-orange-600" />,
     text: "Hemos establecido procedimientos para informar y responder a incidentes de seguridad de la información. Todos los empleados deben informar de inmediato las sospechas de violaciones de seguridad. Los incidentes se investigan y se toman medidas correctivas para evitar que vuelvan a ocurrir."
    },
    {
     id: "compliance",
     title: "5. Cumplimiento y Auditoría",
     icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
     text: "Auditamos periódicamente nuestros controles de seguridad de la información para garantizar el cumplimiento de las políticas internas y las regulaciones externas. Estamos comprometidos con la mejora continua de nuestro sistema de gestión de seguridad de la información."
    }
   ]
  },
  ca: {
   title: "Política de Seguretat de la Informació",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "EKA Balance es compromet a protegir la confidencialitat, integritat i disponibilitat dels nostres actius d'informació. Aquesta política descriu el nostre enfocament per a la gestió de la seguretat de la informació.",
   sections: [
    {
     id: "access-control",
     title: "1. Control d'Accés",
     icon: <Key className="w-6 h-6 text-blue-600" />,
     text: "L'accés a la informació i als sistemes s'atorga segons el principi de privilegi mínim. Als usuaris només se'ls atorga accés a les dades i recursos necessaris per a la seva funció. S'apliquen mesures d'autenticació sòlides, inclosa l'autenticació multifactor."
    },
    {
     id: "data-protection",
     title: "2. Protecció de Dades",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Les dades confidencials es xifren tant en trànsit com en repòs. Implementem controls estrictes per evitar la divulgació, modificació o destrucció no autoritzada de dades. Es realitzen còpies de seguretat periòdiques per garantir la disponibilitat de les dades."
    },
    {
     id: "network-security",
     title: "3. Seguretat de la Xarxa",
     icon: <Server className="w-6 h-6 text-purple-600" />,
     text: "La nostra infraestructura de xarxa està protegida per tallafocs, sistemes de detecció d'intrusos i avaluacions de seguretat periòdiques. Monitoritzem el trànsit de la xarxa a la recerca d'activitats sospitoses i mantenim configuracions segures per a tots els dispositius de xarxa."
    },
    {
     id: "incident-management",
     title: "4. Gestió d'Incidents",
     icon: <FileWarning className="w-6 h-6 text-orange-600" />,
     text: "Hem establert procediments per informar i respondre a incidents de seguretat de la informació. Tots els empleats han d'informar immediatament les sospites de violacions de seguretat. Els incidents s'investiguen i es prenen mesures correctives per evitar que tornin a ocórrer."
    },
    {
     id: "compliance",
     title: "5. Compliment i Auditoria",
     icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
     text: "Auditem periòdicament els nostres controls de seguretat de la informació per garantir el compliment de les polítiques internes i les regulacions externes. Estem compromesos amb la millora contínua del nostre sistema de gestió de seguretat de la informació."
    }
   ]
  },
  ru: {
   title: "Политика информационной безопасности",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "EKA Balance стремится защищать конфиденциальность, целостность и доступность наших информационных активов. Эта политика определяет наш подход к управлению информационной безопасностью.",
   sections: [
    {
     id: "access-control",
     title: "1. Контроль доступа",
     icon: <Key className="w-6 h-6 text-blue-600" />,
     text: "Доступ к информации и системам предоставляется на основе принципа наименьших привилегий. Пользователям предоставляется доступ только к тем данным и ресурсам, которые необходимы для выполнения их обязанностей. Применяются строгие меры аутентификации, включая многофакторную аутентификацию."
    },
    {
     id: "data-protection",
     title: "2. Защита данных",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Конфиденциальные данные шифруются как при передаче, так и при хранении. Мы внедряем строгие меры контроля для предотвращения несанкционированного разглашения, изменения или уничтожения данных. Регулярно выполняются резервные копии для обеспечения доступности данных."
    },
    {
     id: "network-security",
     title: "3. Сетевая безопасность",
     icon: <Server className="w-6 h-6 text-purple-600" />,
     text: "Наша сетевая инфраструктура защищена брандмауэрами, системами обнаружения вторжений и регулярными оценками безопасности. Мы отслеживаем сетевой трафик на предмет подозрительной активности и поддерживаем безопасные конфигурации для всех сетевых устройств."
    },
    {
     id: "incident-management",
     title: "4. Управление инцидентами",
     icon: <FileWarning className="w-6 h-6 text-orange-600" />,
     text: "Мы установили процедуры для сообщения об инцидентах информационной безопасности и реагирования на них. Все сотрудники обязаны немедленно сообщать о подозрениях на нарушения безопасности. Инциденты расследуются, и принимаются корректирующие меры для предотвращения их повторения."
    },
    {
     id: "compliance",
     title: "5. Соблюдение требований и аудит",
     icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
     text: "Мы регулярно проводим аудит наших средств контроля информационной безопасности, чтобы обеспечить соблюдение внутренних политик и внешних норм. Мы стремимся к постоянному совершенствованию нашей системы управления информационной безопасностью."
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
    <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <ShieldCheck className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} id={section.id} className="flex gap-4 p-6 rounded-[32px] bg-muted/30 hover:bg-muted transition-colors scroll-mt-24">
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
