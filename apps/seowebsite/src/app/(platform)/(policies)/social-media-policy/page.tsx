"use client";

import React, { useState } from "react";
import { Share2, MessageCircle, ThumbsUp, Eye, Shield } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function SocialMediaPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Social Media Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "This policy outlines the guidelines for employees and associates of EKA Balance when using social media, both professionally and personally, to protect our brand and reputation.",
   sections: [
    {
     title: "1. Professional Use",
     icon: <Share2 className="w-6 h-6 text-blue-600" />,
     text: "When using social media on behalf of EKA Balance, employees must be authorized to do so. Content should be professional, accurate, and aligned with our brand values. Confidential information must never be shared."
    },
    {
     title: "2. Personal Use",
     icon: <ThumbsUp className="w-6 h-6 text-green-600" />,
     text: "Employees are free to use social media personally. However, they should make it clear that their views are their own and do not represent EKA Balance. Avoid using company logos or trademarks without permission."
    },
    {
     title: "3. Respect and Conduct",
     icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
     text: "We expect employees to be respectful and courteous online. Harassment, bullying, discrimination, or hate speech will not be tolerated. Avoid engaging in heated arguments or making disparaging remarks about competitors or colleagues."
    },
    {
     title: "4. Privacy and Confidentiality",
     icon: <Eye className="w-6 h-6 text-orange-600" />,
     text: "Protect the privacy of colleagues and customers. Do not post photos or personal information of others without their consent. Never disclose internal company matters, trade secrets, or sensitive data."
    },
    {
     title: "5. Monitoring and Enforcement",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "EKA Balance reserves the right to monitor public social media activity that may impact the company. Violations of this policy may result in disciplinary action, up to and including termination."
    }
   ]
  },
  es: {
   title: "Política de Redes Sociales",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "Esta política describe las pautas para los empleados y asociados de EKA Balance al usar las redes sociales, tanto profesional como personalmente, para proteger nuestra marca y reputación.",
   sections: [
    {
     title: "1. Uso Profesional",
     icon: <Share2 className="w-6 h-6 text-blue-600" />,
     text: "Al usar las redes sociales en nombre de EKA Balance, los empleados deben estar autorizados para hacerlo. El contenido debe ser profesional, preciso y estar alineado con los valores de nuestra marca. Nunca se debe compartir información confidencial."
    },
    {
     title: "2. Uso Personal",
     icon: <ThumbsUp className="w-6 h-6 text-green-600" />,
     text: "Los empleados son libres de usar las redes sociales personalmente. Sin embargo, deben dejar claro que sus opiniones son propias y no representan a EKA Balance. Evite usar logotipos o marcas comerciales de la empresa sin permiso."
    },
    {
     title: "3. Respeto y Conducta",
     icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
     text: "Esperamos que los empleados sean respetuosos y corteses en línea. No se tolerará el acoso, la intimidación, la discriminación o el discurso de odio. Evite participar en discusiones acaloradas o hacer comentarios despectivos sobre competidores o colegas."
    },
    {
     title: "4. Privacidad y Confidencialidad",
     icon: <Eye className="w-6 h-6 text-orange-600" />,
     text: "Proteja la privacidad de colegas y clientes. No publique fotos o información personal de otros sin su consentimiento. Nunca revele asuntos internos de la empresa, secretos comerciales o datos confidenciales."
    },
    {
     title: "5. Monitoreo y Cumplimiento",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "EKA Balance se reserva el derecho de monitorear la actividad pública en las redes sociales que pueda afectar a la empresa. Las violaciones de esta política pueden resultar en medidas disciplinarias, incluido el despido."
    }
   ]
  },
  ca: {
   title: "Política de Xarxes Socials",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "Aquesta política descriu les directrius per als empleats i associats d'EKA Balance en utilitzar les xarxes socials, tant professionalment com personalment, per protegir la nostra marca i reputació.",
   sections: [
    {
     title: "1. Ús Professional",
     icon: <Share2 className="w-6 h-6 text-blue-600" />,
     text: "En utilitzar les xarxes socials en nom d'EKA Balance, els empleats han d'estar autoritzats per fer-ho. El contingut ha de ser professional, precís i estar alineat amb els valors de la nostra marca. Mai no s'ha de compartir informació confidencial."
    },
    {
     title: "2. Ús Personal",
     icon: <ThumbsUp className="w-6 h-6 text-green-600" />,
     text: "Els empleats són lliures d'utilitzar les xarxes socials personalment. No obstant això, han de deixar clar que les seves opinions són pròpies i no representen EKA Balance. Eviteu utilitzar logotips o marques comercials de l'empresa sense permís."
    },
    {
     title: "3. Respecte i Conducta",
     icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
     text: "Esperem que els empleats siguin respectuosos i cortesos en línia. No es tolerarà l'assetjament, la intimidació, la discriminació o el discurs d'odi. Eviteu participar en discussions acalorades o fer comentaris despectius sobre competidors o col·legues."
    },
    {
     title: "4. Privacitat i Confidencialitat",
     icon: <Eye className="w-6 h-6 text-orange-600" />,
     text: "Protegiu la privacitat de col·legues i clients. No publiqueu fotos o informació personal d'altres sense el seu consentiment. Mai reveleu assumptes interns de l'empresa, secrets comercials o dades confidencials."
    },
    {
     title: "5. Monitoratge i Compliment",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "EKA Balance es reserva el dret de monitorar l'activitat pública a les xarxes socials que pugui afectar l'empresa. Les violacions d'aquesta política poden resultar en mesures disciplinàries, inclòs l'acomiadament."
    }
   ]
  },
  ru: {
   title: "Политика в отношении социальных сетей",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "Эта политика определяет руководящие принципы для сотрудников и партнеров EKA Balance при использовании социальных сетей, как в профессиональных, так и в личных целях, для защиты нашего бренда и репутации.",
   sections: [
    {
     title: "1. Профессиональное использование",
     icon: <Share2 className="w-6 h-6 text-blue-600" />,
     text: "При использовании социальных сетей от имени EKA Balance сотрудники должны иметь на это разрешение. Контент должен быть профессиональным, точным и соответствовать ценностям нашего бренда. Конфиденциальная информация никогда не должна разглашаться."
    },
    {
     title: "2. Личное использование",
     icon: <ThumbsUp className="w-6 h-6 text-green-600" />,
     text: "Сотрудники могут свободно пользоваться социальными сетями в личных целях. Однако они должны четко дать понять, что их взгляды являются их собственными и не представляют EKA Balance. Избегайте использования логотипов или товарных знаков компании без разрешения."
    },
    {
     title: "3. Уважение и поведение",
     icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
     text: "Мы ожидаем, что сотрудники будут уважительны и вежливы в Интернете. Домогательства, издевательства, дискриминация или разжигание ненависти недопустимы. Избегайте участия в жарких спорах или пренебрежительных высказываний о конкурентах или коллегах."
    },
    {
     title: "4. Конфиденциальность",
     icon: <Eye className="w-6 h-6 text-orange-600" />,
     text: "Защищайте конфиденциальность коллег и клиентов. Не публикуйте фотографии или личную информацию других лиц без их согласия. Никогда не разглашайте внутренние дела компании, коммерческие тайны или конфиденциальные данные."
    },
    {
     title: "5. Мониторинг и обеспечение соблюдения",
     icon: <Shield className="w-6 h-6 text-red-600" />,
     text: "EKA Balance оставляет за собой право отслеживать публичную активность в социальных сетях, которая может повлиять на компанию. Нарушение этой политики может привести к дисциплинарному взысканию, вплоть до увольнения."
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
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Share2 className="w-12 h-12 opacity-90" />
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
