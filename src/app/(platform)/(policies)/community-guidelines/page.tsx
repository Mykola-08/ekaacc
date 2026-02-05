"use client";

import { useState } from "react";
import { Globe, ArrowLeft, HeartHandshake } from "lucide-react";
import Link from "next/link";

type Language = "en" | "es" | "ca" | "ru";

export default function CommunityGuidelines() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Community Guidelines",
   lastUpdated: "Last Updated: March 15, 2024",
   intro: "EKA Balance is a community dedicated to mental health and well-being. To maintain a safe, supportive, and respectful environment for everyone, we ask that you follow these guidelines.",
   sections: [
    {
     title: "1. Be Respectful",
     content: "Treat everyone with respect and kindness. We do not tolerate harassment, hate speech, bullying, or discrimination of any kind based on race, ethnicity, national origin, religion, gender, gender identity, sexual orientation, age, or disability."
    },
    {
     title: "2. Maintain Confidentiality",
     content: "Respect the privacy of others. Do not share personal information about others without their consent. What happens in therapy sessions or support groups stays in those spaces."
    },
    {
     title: "3. No Harmful Content",
     content: "Do not post or share content that encourages self-harm, violence, or illegal acts. If you or someone else is in immediate danger, please contact emergency services immediately."
    },
    {
     title: "4. Professional Boundaries",
     content: "Respect the professional boundaries between therapists and clients. Do not attempt to contact therapists outside of the platform's approved communication channels or for non-therapeutic purposes."
    },
    {
     title: "5. Authentic Representation",
     content: "Be yourself. Do not impersonate others or provide false information about your credentials or identity."
    },
    {
     title: "6. Reporting Violations",
     content: "If you see something that violates these guidelines, please report it to us immediately. We review all reports and take appropriate action, which may include warning the user, suspending their account, or banning them from the platform."
    }
   ]
  },
  es: {
   title: "Directrices de la Comunidad",
   lastUpdated: "Última actualización: 15 de marzo de 2024",
   intro: "EKA Balance es una comunidad dedicada a la salud mental y el bienestar. Para mantener un entorno seguro, de apoyo y respetuoso para todos, le pedimos que siga estas directrices.",
   sections: [
    {
     title: "1. Sea Respetuoso",
     content: "Trate a todos con respeto y amabilidad. No toleramos el acoso, el discurso de odio, la intimidación o la discriminación de ningún tipo por motivos de raza, etnia, origen nacional, religión, género, identidad de género, orientación sexual, edad o discapacidad."
    },
    {
     title: "2. Mantenga la Confidencialidad",
     content: "Respete la privacidad de los demás. No comparta información personal sobre otros sin su consentimiento. Lo que sucede en las sesiones de terapia o grupos de apoyo se queda en esos espacios."
    },
    {
     title: "3. Sin Contenido Dañino",
     content: "No publique ni comparta contenido que fomente la autolesión, la violencia o actos ilegales. Si usted o alguien más está en peligro inmediato, comuníquese con los servicios de emergencia de inmediato."
    },
    {
     title: "4. Límites Profesionales",
     content: "Respete los límites profesionales entre terapeutas y clientes. No intente contactar a los terapeutas fuera de los canales de comunicación aprobados por la plataforma o para fines no terapéuticos."
    },
    {
     title: "5. Representación Auténtica",
     content: "Sea usted mismo. No se haga pasar por otros ni proporcione información falsa sobre sus credenciales o identidad."
    },
    {
     title: "6. Informar de Violaciones",
     content: "Si ve algo que viola estas directrices, infórmenos de inmediato. Revisamos todos los informes y tomamos las medidas adecuadas, que pueden incluir advertir al usuario, suspender su cuenta o prohibirle el acceso a la plataforma."
    }
   ]
  },
  ca: {
   title: "Directrius de la Comunitat",
   lastUpdated: "Última actualització: 15 de març de 2024",
   intro: "EKA Balance és una comunitat dedicada a la salut mental i el benestar. Per mantenir un entorn segur, de suport i respectuós per a tothom, us demanem que seguiu aquestes directrius.",
   sections: [
    {
     title: "1. Sigues Respectuós",
     content: "Tracta tothom amb respecte i amabilitat. No tolerem l'assetjament, el discurs d'odi, la intimidació o la discriminació de cap tipus per motius de raça, ètnia, origen nacional, religió, gènere, identitat de gènere, orientació sexual, edat o discapacitat."
    },
    {
     title: "2. Mantingues la Confidencialitat",
     content: "Respecta la privadesa dels altres. No comparteixis informació personal sobre altres sense el seu consentiment. El que passa a les sessions de teràpia o grups de suport es queda en aquests espais."
    },
    {
     title: "3. Sense Contingut Perjudiciós",
     content: "No publiquis ni comparteixis contingut que fomenti l'autolesió, la violència o actes il·legals. Si tu o algú altre està en perill immediat, posa't en contacte amb els serveis d'emergència immediatament."
    },
    {
     title: "4. Límits Professionals",
     content: "Respecta els límits professionals entre terapeutes i clients. No intentis contactar amb els terapeutes fora dels canals de comunicació aprovats per la plataforma o per a fins no terapèutics."
    },
    {
     title: "5. Representació Autèntica",
     content: "Sigues tu mateix. No et facis passar per altres ni proporcionis informació falsa sobre les teves credencials o identitat."
    },
    {
     title: "6. Informar de Violacions",
     content: "Si veus alguna cosa que viola aquestes directrius, informa'ns immediatament. Revisem tots els informes i prenem les mesures adequades, que poden incloure advertir l'usuari, suspendre el seu compte o prohibir-li l'accés a la plataforma."
    }
   ]
  },
  ru: {
   title: "Правила сообщества",
   lastUpdated: "Последнее обновление: 15 марта 2024 г.",
   intro: "EKA Balance — это сообщество, посвященное психическому здоровью и благополучию. Чтобы поддерживать безопасную, благоприятную и уважительную среду для всех, мы просим вас следовать этим правилам.",
   sections: [
    {
     title: "1. Будьте уважительны",
     content: "Относитесь ко всем с уважением и добротой. Мы не терпим домогательств, разжигания ненависти, издевательств или дискриминации любого рода по признаку расы, этнической принадлежности, национального происхождения, религии, пола, гендерной идентичности, сексуальной ориентации, возраста или инвалидности."
    },
    {
     title: "2. Соблюдайте конфиденциальность",
     content: "Уважайте конфиденциальность других. Не делитесь личной информацией о других без их согласия. То, что происходит на терапевтических сеансах или в группах поддержки, остается в этих пространствах."
    },
    {
     title: "3. Никакого вредоносного контента",
     content: "Не публикуйте и не делитесь контентом, который поощряет самоповреждение, насилие или незаконные действия. Если вы или кто-то другой находитесь в непосредственной опасности, немедленно свяжитесь со службами экстренной помощи."
    },
    {
     title: "4. Профессиональные границы",
     content: "Уважайте профессиональные границы между терапевтами и клиентами. Не пытайтесь связаться с терапевтами вне утвержденных каналов связи платформы или в нетерапевтических целях."
    },
    {
     title: "5. Подлинное представление",
     content: "Будьте собой. Не выдавайте себя за других и не предоставляйте ложную информацию о своих полномочиях или личности."
    },
    {
     title: "6. Сообщение о нарушениях",
     content: "Если вы видите что-то, что нарушает эти правила, немедленно сообщите нам об этом. Мы рассматриваем все отчеты и принимаем соответствующие меры, которые могут включать предупреждение пользователя, приостановку его учетной записи или блокировку его на платформе."
    }
   ]
  }
 };

 return (
  <div className="min-h-screen bg-muted/30 pb-12">
   {/* Header */}
   <div className="bg-card border-b sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
     <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
      <ArrowLeft className="w-5 h-5 mr-2" />
      <span className="font-medium">Back to Legal Center</span>
     </Link>
     
     <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <select 
       value={language}
       onChange={(e) => setLanguage(e.target.value as Language)}
       className="text-sm border-none bg-transparent focus:ring-0 text-muted-foreground font-medium cursor-pointer"
      >
       <option value="en">English</option>
       <option value="es">Español</option>
       <option value="ca">Català</option>
       <option value="ru">Русский</option>
      </select>
     </div>
    </div>
   </div>

   {/* Content */}
   <div className="max-w-3xl mx-auto px-4 py-12">
    <div className="bg-card rounded-2xl shadow-sm p-8 md:p-12">
     <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-8 mx-auto">
      <HeartHandshake className="w-8 h-8 text-green-600" />
     </div>
     
     <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
      {content[language].title}
     </h1>
     
     <p className="text-muted-foreground text-center mb-12">
      {content[language].lastUpdated}
     </p>

     <div className="prose prose-lg max-w-none text-muted-foreground">
      <p className="lead text-xl text-foreground mb-8">
       {content[language].intro}
      </p>

      <div className="space-y-8">
       {content[language].sections.map((section, index) => (
        <div key={index} className="border-b border-gray-100 pb-8 last:border-0">
         <h2 className="text-xl font-bold text-foreground mb-4">
          {section.title}
         </h2>
         <p className="whitespace-pre-line leading-relaxed">
          {section.content}
         </p>
        </div>
       ))}
      </div>
     </div>

     <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
      <p className="text-sm text-muted-foreground text-center">
       {language === 'en' && "Together we can create a safe and supportive space for healing."}
       {language === 'es' && "Juntos podemos crear un espacio seguro y de apoyo para la curación."}
       {language === 'ca' && "Junts podem crear un espai segur i de suport per a la curació."}
       {language === 'ru' && "Вместе мы можем создать безопасное и поддерживающее пространство для исцеления."}
      </p>
     </div>
    </div>
   </div>
  </div>
 );
}