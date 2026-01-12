"use client";

import React, { useState } from "react";
import { Shield, Lock, EyeOff, UserMinus, AlertCircle } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function ChildrensPrivacyPolicy() {
 const [language, setLanguage] = useState<Language>("en");

 const content = {
  en: {
   title: "Children's Privacy Policy",
   lastUpdated: "Last Updated: March 10, 2025",
   intro: "EKA Balance is committed to protecting the privacy of children. This policy explains our practices regarding the collection, use, and disclosure of personal information from children under the age of 13 (or applicable age in your jurisdiction).",
   sections: [
    {
     title: "1. No Collection of Children's Data",
     icon: <UserMinus className="w-6 h-6 text-red-600" />,
     text: "We do not knowingly collect, use, or disclose personal information from children under the age of 13. If you believe that we have collected personal information from a child under the age of 13, please contact us immediately."
    },
    {
     title: "2. Parental Consent",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "In the event that we discover we have collected information from a child without parental consent, we will delete that information as quickly as possible. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity."
    },
    {
     title: "3. Age Restrictions",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Our services are intended for a general audience and are not directed to children. Users must be at least 18 years old to register for an account. Any account found to be created by a child will be terminated."
    },
    {
     title: "4. Third-Party Services",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "We do not allow third-party advertising networks to collect information about children on our site. We carefully vet our service providers to ensure they comply with applicable children's privacy laws."
    },
    {
     title: "5. Contact for Parents",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "If you are a parent or guardian and believe your child has provided us with personal information, please contact our Privacy Officer at privacy@eka-balance.com to request deletion."
    }
   ]
  },
  es: {
   title: "Política de Privacidad para Niños",
   lastUpdated: "Última actualización: 10 de marzo de 2025",
   intro: "EKA Balance se compromete a proteger la privacidad de los niños. Esta política explica nuestras prácticas con respecto a la recopilación, el uso y la divulgación de información personal de niños menores de 13 años (o la edad aplicable en su jurisdicción).",
   sections: [
    {
     title: "1. No Recopilación de Datos de Niños",
     icon: <UserMinus className="w-6 h-6 text-red-600" />,
     text: "No recopilamos, utilizamos ni divulgamos a sabiendas información personal de niños menores de 13 años. Si cree que hemos recopilado información personal de un niño menor de 13 años, contáctenos de inmediato."
    },
    {
     title: "2. Consentimiento de los Padres",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "En el caso de que descubramos que hemos recopilado información de un niño sin el consentimiento de los padres, eliminaremos esa información lo más rápido posible. Alentamos a los padres y tutores a observar, participar y/o monitorear y guiar su actividad en línea."
    },
    {
     title: "3. Restricciones de Edad",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Nuestros servicios están destinados a una audiencia general y no están dirigidos a niños. Los usuarios deben tener al menos 18 años para registrarse en una cuenta. Cualquier cuenta que se descubra que ha sido creada por un niño será cancelada."
    },
    {
     title: "4. Servicios de Terceros",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "No permitimos que las redes publicitarias de terceros recopilen información sobre niños en nuestro sitio. Examinamos cuidadosamente a nuestros proveedores de servicios para asegurarnos de que cumplan con las leyes de privacidad infantil aplicables."
    },
    {
     title: "5. Contacto para Padres",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, comuníquese con nuestro Oficial de Privacidad en privacy@eka-balance.com para solicitar la eliminación."
    }
   ]
  },
  ca: {
   title: "Política de Privacitat per a Menors",
   lastUpdated: "Darrera actualització: 10 de març de 2025",
   intro: "EKA Balance es compromet a protegir la privacitat dels menors. Aquesta política explica les nostres pràctiques pel que fa a la recopilació, l'ús i la divulgació d'informació personal de menors de 13 anys (o l'edat aplicable a la vostra jurisdicció).",
   sections: [
    {
     title: "1. No Recopilació de Dades de Menors",
     icon: <UserMinus className="w-6 h-6 text-red-600" />,
     text: "No recopilem, utilitzem ni divulguem conscientment informació personal de menors de 13 anys. Si creieu que hem recopilat informació personal d'un menor de 13 anys, poseu-vos en contacte amb nosaltres immediatament."
    },
    {
     title: "2. Consentiment dels Pares",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "En el cas que descobrim que hem recopilat informació d'un menor sense el consentiment dels pares, eliminarem aquesta informació el més ràpid possible. Encoratgem els pares i tutors a observar, participar i/o supervisar i guiar la seva activitat en línia."
    },
    {
     title: "3. Restriccions d'Edat",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Els nostres serveis estan destinats a un públic general i no estan dirigits a menors. Els usuaris han de tenir almenys 18 anys per registrar-se en un compte. Qualsevol compte que es descobreixi que ha estat creat per un menor serà cancel·lat."
    },
    {
     title: "4. Serveis de Tercers",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "No permetem que les xarxes publicitàries de tercers recopilin informació sobre menors al nostre lloc. Examinem acuradament els nostres proveïdors de serveis per assegurar-nos que compleixin amb les lleis de privacitat infantil aplicables."
    },
    {
     title: "5. Contacte per a Pares",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Si sou pare o tutor i creieu que el vostre fill ens ha proporcionat informació personal, poseu-vos en contacte amb el nostre Oficial de Privacitat a privacy@eka-balance.com per sol·licitar l'eliminació."
    }
   ]
  },
  ru: {
   title: "Политика конфиденциальности для детей",
   lastUpdated: "Последнее обновление: 10 марта 2025 г.",
   intro: "EKA Balance обязуется защищать конфиденциальность детей. Эта политика объясняет наши методы сбора, использования и раскрытия личной информации детей в возрасте до 13 лет (или соответствующего возраста в вашей юрисдикции).",
   sections: [
    {
     title: "1. Отсутствие сбора данных о детях",
     icon: <UserMinus className="w-6 h-6 text-red-600" />,
     text: "Мы сознательно не собираем, не используем и не раскрываем личную информацию детей в возрасте до 13 лет. Если вы считаете, что мы собрали личную информацию ребенка в возрасте до 13 лет, немедленно свяжитесь с нами."
    },
    {
     title: "2. Согласие родителей",
     icon: <Shield className="w-6 h-6 text-blue-600" />,
     text: "В случае, если мы обнаружим, что собрали информацию от ребенка без согласия родителей, мы удалим эту информацию как можно быстрее. Мы призываем родителей и опекунов наблюдать, участвовать и/или контролировать и направлять их деятельность в Интернете."
    },
    {
     title: "3. Возрастные ограничения",
     icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
     text: "Наши услуги предназначены для широкой аудитории и не направлены на детей. Пользователям должно быть не менее 18 лет для регистрации учетной записи. Любая учетная запись, созданная ребенком, будет аннулирована."
    },
    {
     title: "4. Сторонние сервисы",
     icon: <EyeOff className="w-6 h-6 text-purple-600" />,
     text: "Мы не разрешаем сторонним рекламным сетям собирать информацию о детях на нашем сайте. Мы тщательно проверяем наших поставщиков услуг, чтобы убедиться, что они соблюдают применимые законы о конфиденциальности детей."
    },
    {
     title: "5. Контакт для родителей",
     icon: <Lock className="w-6 h-6 text-green-600" />,
     text: "Если вы являетесь родителем или опекуном и считаете, что ваш ребенок предоставил нам личную информацию, свяжитесь с нашим сотрудником по вопросам конфиденциальности по адресу privacy@eka-balance.com, чтобы запросить удаление."
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
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-12 text-white">
     <div className="flex items-center gap-4 mb-4">
      <Shield className="w-12 h-12 opacity-90" />
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
