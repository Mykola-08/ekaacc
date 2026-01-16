"use client";

import React, { useState } from "react";
import { UserCog, FileLock, Eye, Server, Trash2 } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function EmployeePrivacyNotice() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Employee Privacy Notice",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This notice describes how EKA Balance collects, uses, and protects the personal information of its employees, contractors, and job applicants. We are committed to respecting your privacy and managing your data responsibly.",
   sections: [
    {
     title: "1. Information We Collect",
     icon: <UserCog className="w-6 h-6 text-blue-600" />,
     text: "We collect personal information necessary for employment purposes, such as contact details, identification documents, banking information for payroll, performance evaluations, and attendance records."
    },
    {
     title: "2. Use of Information",
     icon: <FileLock className="w-6 h-6 text-green-600" />,
     text: "Your information is used for personnel administration, payroll processing, benefits management, performance management, and compliance with legal obligations. We do not sell your personal information."
    },
    {
     title: "3. Monitoring",
     icon: <Eye className="w-6 h-6 text-purple-600" />,
     text: "We may monitor the use of company systems and devices to ensure security, compliance with policies, and productivity. You should have no expectation of privacy when using company-provided equipment or networks."
    },
    {
     title: "4. Data Storage and Security",
     icon: <Server className="w-6 h-6 text-orange-600" />,
     text: "We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse. Data is stored securely and access is restricted to authorized personnel."
    },
    {
     title: "5. Data Retention",
     icon: <Trash2 className="w-6 h-6 text-red-600" />,
     text: "We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, or as required by law. After the retention period, your data will be securely deleted or anonymized."
    }
   ]
  },
  es: {
   title: "Aviso de Privacidad para Empleados",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Este aviso describe cómo EKA Balance recopila, utiliza y protege la información personal de sus empleados, contratistas y solicitantes de empleo. Nos comprometemos a respetar su privacidad y gestionar sus datos de manera responsable.",
   sections: [
    {
     title: "1. Información que Recopilamos",
     icon: <UserCog className="w-6 h-6 text-blue-600" />,
     text: "Recopilamos información personal necesaria para fines laborales, como datos de contacto, documentos de identificación, información bancaria para nómina, evaluaciones de desempeño y registros de asistencia."
    },
    {
     title: "2. Uso de la Información",
     icon: <FileLock className="w-6 h-6 text-green-600" />,
     text: "Su información se utiliza para la administración de personal, procesamiento de nómina, gestión de beneficios, gestión del desempeño y cumplimiento de obligaciones legales. No vendemos su información personal."
    },
    {
     title: "3. Monitoreo",
     icon: <Eye className="w-6 h-6 text-purple-600" />,
     text: "Podemos monitorear el uso de los sistemas y dispositivos de la empresa para garantizar la seguridad, el cumplimiento de las políticas y la productividad. No debe tener expectativas de privacidad al utilizar equipos o redes proporcionados por la empresa."
    },
    {
     title: "4. Almacenamiento y Seguridad de Datos",
     icon: <Server className="w-6 h-6 text-orange-600" />,
     text: "Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o el uso indebido. Los datos se almacenan de forma segura y el acceso está restringido al personal autorizado."
    },
    {
     title: "5. Retención de Datos",
     icon: <Trash2 className="w-6 h-6 text-red-600" />,
     text: "Conservamos su información personal durante el tiempo que sea necesario para cumplir con los fines para los que se recopiló, o según lo exija la ley. Después del período de retención, sus datos se eliminarán o anonimizarán de forma segura."
    }
   ]
  },
  ca: {
   title: "Avís de Privacitat per a Empleats",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquest avís descriu com EKA Balance recopila, utilitza i protegeix la informació personal dels seus empleats, contractistes i sol·licitants d'ocupació. Ens comprometem a respectar la vostra privacitat i gestionar les vostres dades de manera responsable.",
   sections: [
    {
     title: "1. Informació que Recopilem",
     icon: <UserCog className="w-6 h-6 text-blue-600" />,
     text: "Recopilem informació personal necessària per a finalitats laborals, com dades de contacte, documents d'identificació, informació bancària per a nòmines, avaluacions de rendiment i registres d'assistència."
    },
    {
     title: "2. Ús de la Informació",
     icon: <FileLock className="w-6 h-6 text-green-600" />,
     text: "La vostra informació s'utilitza per a l'administració de personal, processament de nòmines, gestió de beneficis, gestió del rendiment i compliment d'obligacions legals. No venem la vostra informació personal."
    },
    {
     title: "3. Monitoratge",
     icon: <Eye className="w-6 h-6 text-purple-600" />,
     text: "Podem monitorar l'ús dels sistemes i dispositius de l'empresa per garantir la seguretat, el compliment de les polítiques i la productivitat. No heu de tenir expectatives de privacitat en utilitzar equips o xarxes proporcionats per l'empresa."
    },
    {
     title: "4. Emmagatzematge i Seguretat de Dades",
     icon: <Server className="w-6 h-6 text-orange-600" />,
     text: "Implementem mesures tècniques i organitzatives apropiades per protegir les vostres dades personals contra l'accés no autoritzat, la pèrdua o l'ús indegut. Les dades s'emmagatzemen de forma segura i l'accés està restringit al personal autoritzat."
    },
    {
     title: "5. Retenció de Dades",
     icon: <Trash2 className="w-6 h-6 text-red-600" />,
     text: "Conservem la vostra informació personal durant el temps que sigui necessari per complir amb les finalitats per a les quals es va recopilar, o segons ho exigeixi la llei. Després del període de retenció, les vostres dades s'eliminaran o anonimitzaran de forma segura."
    }
   ]
  },
  ru: {
   title: "Уведомление о конфиденциальности для сотрудников",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "В этом уведомлении описывается, как EKA Balance собирает, использует и защищает личную информацию своих сотрудников, подрядчиков и соискателей. Мы обязуемся уважать вашу конфиденциальность и ответственно управлять вашими данными.",
   sections: [
    {
     title: "1. Информация, которую мы собираем",
     icon: <UserCog className="w-6 h-6 text-blue-600" />,
     text: "Мы собираем личную информацию, необходимую для целей трудоустройства, такую как контактные данные, документы, удостоверяющие личность, банковскую информацию для начисления заработной платы, оценки эффективности и записи о посещаемости."
    },
    {
     title: "2. Использование информации",
     icon: <FileLock className="w-6 h-6 text-green-600" />,
     text: "Ваша информация используется для администрирования персонала, обработки заработной платы, управления льготами, управления эффективностью и соблюдения юридических обязательств. Мы не продаем вашу личную информацию."
    },
    {
     title: "3. Мониторинг",
     icon: <Eye className="w-6 h-6 text-purple-600" />,
     text: "Мы можем контролировать использование систем и устройств компании для обеспечения безопасности, соблюдения политик и производительности. Вы не должны ожидать конфиденциальности при использовании оборудования или сетей, предоставленных компанией."
    },
    {
     title: "4. Хранение и безопасность данных",
     icon: <Server className="w-6 h-6 text-orange-600" />,
     text: "Мы внедряем соответствующие технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, потери или неправомерного использования. Данные хранятся надежно, а доступ к ним ограничен уполномоченным персоналом."
    },
    {
     title: "5. Хранение данных",
     icon: <Trash2 className="w-6 h-6 text-red-600" />,
     text: "Мы храним вашу личную информацию до тех пор, пока это необходимо для выполнения целей, для которых она была собрана, или в соответствии с требованиями закона. По истечении срока хранения ваши данные будут надежно удалены или анонимизированы."
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
    <div className="bg-linear-to-r from-slate-600 to-gray-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <UserCog className="w-12 h-12 opacity-90" />
      <h1 className="text-3xl font-bold">{t.title}</h1>
     </div>
     <p className="opacity-90 max-w-2xl">{t.intro}</p>
     <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
    </div>

    <div className="p-8 space-y-8">
     {t.sections.map((section, index) => (
      <div key={index} className="flex gap-4 p-6 rounded-[32px] bg-muted/30 hover:bg-muted transition-colors">
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
