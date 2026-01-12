"use client";

import React, { useState } from "react";
import { Users, Heart, Scale, Briefcase, Smile } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function DeiPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Diversity, Equity & Inclusion Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "At EKA Balance, we believe that diversity is our strength. We are committed to creating an inclusive environment where everyone feels valued, respected, and empowered to contribute their best work.",
   sections: [
    {
     title: "1. Our Commitment",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "We are dedicated to fostering a workplace that reflects the diverse communities we serve. We do not discriminate on the basis of race, color, religion, gender, gender identity, sexual orientation, national origin, age, disability, or any other protected characteristic."
    },
    {
     title: "2. Equal Opportunity",
     icon: <Scale className="w-6 h-6 text-blue-600" />,
     text: "We provide equal opportunities for employment, advancement, and development to all qualified individuals. Our hiring and promotion decisions are based on merit, qualifications, and business needs."
    },
    {
     title: "3. Inclusive Culture",
     icon: <Users className="w-6 h-6 text-green-600" />,
     text: "We strive to create a culture of belonging where everyone can bring their authentic selves to work. We encourage open dialogue, active listening, and mutual respect. We provide training and resources to support inclusive behaviors."
    },
    {
     title: "4. Workplace Accessibility",
     icon: <Briefcase className="w-6 h-6 text-purple-600" />,
     text: "We are committed to providing a workplace that is accessible to everyone. We provide reasonable accommodations for employees with disabilities to ensure they can perform their essential job functions."
    },
    {
     title: "5. Employee Well-being",
     icon: <Smile className="w-6 h-6 text-orange-600" />,
     text: "We prioritize the physical and mental well-being of our employees. We offer comprehensive benefits, flexible work arrangements, and support programs to help our team members thrive both personally and professionally."
    }
   ]
  },
  es: {
   title: "Política de Diversidad, Equidad e Inclusión",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "En EKA Balance, creemos que la diversidad es nuestra fortaleza. Estamos comprometidos a crear un entorno inclusivo donde todos se sientan valorados, respetados y empoderados para contribuir con su mejor trabajo.",
   sections: [
    {
     title: "1. Nuestro Compromiso",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Estamos dedicados a fomentar un lugar de trabajo que refleje las diversas comunidades a las que servimos. No discriminamos por motivos de raza, color, religión, género, identidad de género, orientación sexual, origen nacional, edad, discapacidad o cualquier otra característica protegida."
    },
    {
     title: "2. Igualdad de Oportunidades",
     icon: <Scale className="w-6 h-6 text-blue-600" />,
     text: "Brindamos igualdad de oportunidades de empleo, avance y desarrollo a todas las personas calificadas. Nuestras decisiones de contratación y promoción se basan en el mérito, las calificaciones y las necesidades comerciales."
    },
    {
     title: "3. Cultura Inclusiva",
     icon: <Users className="w-6 h-6 text-green-600" />,
     text: "Nos esforzamos por crear una cultura de pertenencia donde todos puedan ser auténticos en el trabajo. Fomentamos el diálogo abierto, la escucha activa y el respeto mutuo. Brindamos capacitación y recursos para apoyar comportamientos inclusivos."
    },
    {
     title: "4. Accesibilidad en el Lugar de Trabajo",
     icon: <Briefcase className="w-6 h-6 text-purple-600" />,
     text: "Estamos comprometidos a proporcionar un lugar de trabajo que sea accesible para todos. Brindamos adaptaciones razonables para empleados con discapacidades para garantizar que puedan realizar sus funciones laborales esenciales."
    },
    {
     title: "5. Bienestar de los Empleados",
     icon: <Smile className="w-6 h-6 text-orange-600" />,
     text: "Priorizamos el bienestar físico y mental de nuestros empleados. Ofrecemos beneficios integrales, acuerdos de trabajo flexibles y programas de apoyo para ayudar a los miembros de nuestro equipo a prosperar tanto personal como profesionalmente."
    }
   ]
  },
  ca: {
   title: "Política de Diversitat, Equitat i Inclusió",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "A EKA Balance, creiem que la diversitat és la nostra fortalesa. Ens comprometem a crear un entorn inclusiu on tothom se senti valorat, respectat i empoderat per contribuir amb el seu millor treball.",
   sections: [
    {
     title: "1. El Nostre Compromís",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Estem dedicats a fomentar un lloc de treball que reflecteixi les diverses comunitats a les quals servim. No discriminem per motius de raça, color, religió, gènere, identitat de gènere, orientació sexual, origen nacional, edat, discapacitat o qualsevol altra característica protegida."
    },
    {
     title: "2. Igualtat d'Oportunitats",
     icon: <Scale className="w-6 h-6 text-blue-600" />,
     text: "Oferim igualtat d'oportunitats d'ocupació, avançament i desenvolupament a totes les persones qualificades. Les nostres decisions de contractació i promoció es basen en el mèrit, les qualificacions i les necessitats comercials."
    },
    {
     title: "3. Cultura Inclusiva",
     icon: <Users className="w-6 h-6 text-green-600" />,
     text: "Ens esforcem per crear una cultura de pertinença on tothom pugui ser autèntic a la feina. Fomentem el diàleg obert, l'escolta activa i el respecte mutu. Oferim formació i recursos per donar suport a comportaments inclusius."
    },
    {
     title: "4. Accessibilitat al Lloc de Treball",
     icon: <Briefcase className="w-6 h-6 text-purple-600" />,
     text: "Ens comprometem a proporcionar un lloc de treball que sigui accessible per a tothom. Oferim adaptacions raonables per a empleats amb discapacitats per garantir que puguin realitzar les seves funcions laborals essencials."
    },
    {
     title: "5. Benestar dels Empleats",
     icon: <Smile className="w-6 h-6 text-orange-600" />,
     text: "Prioritzem el benestar físic i mental dels nostres empleats. Oferim beneficis integrals, acords de treball flexibles i programes de suport per ajudar els membres del nostre equip a prosperar tant personalment com professionalment."
    }
   ]
  },
  ru: {
   title: "Политика разнообразия, равенства и инклюзивности",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "В EKA Balance мы верим, что разнообразие — это наша сила. Мы стремимся создать инклюзивную среду, в которой каждый чувствует, что его ценят, уважают и наделяют полномочиями вносить свой вклад в работу.",
   sections: [
    {
     title: "1. Наше обязательство",
     icon: <Heart className="w-6 h-6 text-red-600" />,
     text: "Мы стремимся создать рабочее место, отражающее разнообразные сообщества, которым мы служим. Мы не допускаем дискриминации по признаку расы, цвета кожи, религии, пола, гендерной идентичности, сексуальной ориентации, национального происхождения, возраста, инвалидности или любой другой защищенной характеристики."
    },
    {
     title: "2. Равные возможности",
     icon: <Scale className="w-6 h-6 text-blue-600" />,
     text: "Мы предоставляем равные возможности для трудоустройства, продвижения по службе и развития всем квалифицированным лицам. Наши решения о найме и продвижении по службе основаны на заслугах, квалификации и деловых потребностях."
    },
    {
     title: "3. Инклюзивная культура",
     icon: <Users className="w-6 h-6 text-green-600" />,
     text: "Мы стремимся создать культуру принадлежности, в которой каждый может быть самим собой на работе. Мы поощряем открытый диалог, активное слушание и взаимное уважение. Мы предоставляем обучение и ресурсы для поддержки инклюзивного поведения."
    },
    {
     title: "4. Доступность рабочего места",
     icon: <Briefcase className="w-6 h-6 text-purple-600" />,
     text: "Мы стремимся обеспечить рабочее место, доступное для всех. Мы предоставляем разумные приспособления для сотрудников с ограниченными возможностями, чтобы они могли выполнять свои основные должностные обязанности."
    },
    {
     title: "5. Благополучие сотрудников",
     icon: <Smile className="w-6 h-6 text-orange-600" />,
     text: "Мы уделяем приоритетное внимание физическому и психическому благополучию наших сотрудников. Мы предлагаем комплексные льготы, гибкий график работы и программы поддержки, чтобы помочь членам нашей команды процветать как в личном, так и в профессиональном плане."
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
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-white">
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
