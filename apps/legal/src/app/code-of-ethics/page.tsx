"use client";

import React, { useState } from "react";
import { BookOpen, Users, Shield, Lightbulb, Award } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function CodeOfEthics() {
  const [language, setLanguage] = useState<Language>("en");

  const content = {
    en: {
      title: "Code of Ethics",
      lastUpdated: "Last Updated: March 10, 2025",
      intro: "EKA Balance is dedicated to maintaining the highest standards of integrity and ethical conduct. This Code of Ethics guides our decisions and actions, ensuring we act responsibly towards our patients, colleagues, and the community.",
      sections: [
        {
          title: "1. Integrity and Honesty",
          icon: <Shield className="w-6 h-6 text-blue-600" />,
          text: "We are truthful in all our interactions and communications. We do not mislead or deceive others, and we are transparent about our capabilities and limitations."
        },
        {
          title: "2. Respect for Individuals",
          icon: <Users className="w-6 h-6 text-green-600" />,
          text: "We treat everyone with dignity and respect, regardless of their background, position, or beliefs. We value diversity and foster an inclusive environment where everyone feels safe and heard."
        },
        {
          title: "3. Professional Competence",
          icon: <Award className="w-6 h-6 text-purple-600" />,
          text: "We are committed to continuous learning and improvement. We only provide services within our areas of competence and seek consultation or supervision when necessary."
        },
        {
          title: "4. Confidentiality and Privacy",
          icon: <BookOpen className="w-6 h-6 text-orange-600" />,
          text: "We protect the confidential information entrusted to us by patients, employees, and partners. We only disclose information when legally required or with appropriate consent."
        },
        {
          title: "5. Social Responsibility",
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          text: "We strive to make a positive impact on society and the environment. We conduct our business in a sustainable manner and support initiatives that improve the well-being of our community."
        }
      ]
    },
    es: {
      title: "Código de Ética",
      lastUpdated: "Última actualización: 10 de marzo de 2025",
      intro: "EKA Balance se dedica a mantener los más altos estándares de integridad y conducta ética. Este Código de Ética guía nuestras decisiones y acciones, asegurando que actuemos de manera responsable hacia nuestros pacientes, colegas y la comunidad.",
      sections: [
        {
          title: "1. Integridad y Honestidad",
          icon: <Shield className="w-6 h-6 text-blue-600" />,
          text: "Somos veraces en todas nuestras interacciones y comunicaciones. No engañamos ni confundimos a los demás, y somos transparentes sobre nuestras capacidades y limitaciones."
        },
        {
          title: "2. Respeto por las Personas",
          icon: <Users className="w-6 h-6 text-green-600" />,
          text: "Tratamos a todos con dignidad y respeto, independientemente de su origen, posición o creencias. Valoramos la diversidad y fomentamos un entorno inclusivo donde todos se sientan seguros y escuchados."
        },
        {
          title: "3. Competencia Profesional",
          icon: <Award className="w-6 h-6 text-purple-600" />,
          text: "Estamos comprometidos con el aprendizaje y la mejora continua. Solo brindamos servicios dentro de nuestras áreas de competencia y buscamos consulta o supervisión cuando es necesario."
        },
        {
          title: "4. Confidencialidad y Privacidad",
          icon: <BookOpen className="w-6 h-6 text-orange-600" />,
          text: "Protegemos la información confidencial que nos confían pacientes, empleados y socios. Solo divulgamos información cuando es legalmente requerido o con el consentimiento apropiado."
        },
        {
          title: "5. Responsabilidad Social",
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          text: "Nos esforzamos por tener un impacto positivo en la sociedad y el medio ambiente. Llevamos a cabo nuestro negocio de manera sostenible y apoyamos iniciativas que mejoran el bienestar de nuestra comunidad."
        }
      ]
    },
    ca: {
      title: "Codi Ètic",
      lastUpdated: "Darrera actualització: 10 de març de 2025",
      intro: "EKA Balance es dedica a mantenir els estàndards més alts d'integritat i conducta ètica. Aquest Codi Ètic guia les nostres decisions i accions, assegurant que actuem de manera responsable envers els nostres pacients, col·legues i la comunitat.",
      sections: [
        {
          title: "1. Integritat i Honestedat",
          icon: <Shield className="w-6 h-6 text-blue-600" />,
          text: "Som veraços en totes les nostres interaccions i comunicacions. No enganyem ni confonem els altres, i som transparents sobre les nostres capacitats i limitacions."
        },
        {
          title: "2. Respecte per les Persones",
          icon: <Users className="w-6 h-6 text-green-600" />,
          text: "Tractem a tothom amb dignitat i respecte, independentment del seu origen, posició o creences. Valorem la diversitat i fomentem un entorn inclusiu on tothom se senti segur i escoltat."
        },
        {
          title: "3. Competència Professional",
          icon: <Award className="w-6 h-6 text-purple-600" />,
          text: "Estem compromesos amb l'aprenentatge i la millora contínua. Només oferim serveis dins de les nostres àrees de competència i busquem consulta o supervisió quan és necessari."
        },
        {
          title: "4. Confidencialitat i Privacitat",
          icon: <BookOpen className="w-6 h-6 text-orange-600" />,
          text: "Protegim la informació confidencial que ens confien pacients, empleats i socis. Només divulguem informació quan és legalment requerit o amb el consentiment apropiat."
        },
        {
          title: "5. Responsabilitat Social",
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          text: "Ens esforcem per tenir un impacte positiu en la societat i el medi ambient. Duem a terme el nostre negoci de manera sostenible i donem suport a iniciatives que milloren el benestar de la nostra comunitat."
        }
      ]
    },
    ru: {
      title: "Кодекс этики",
      lastUpdated: "Последнее обновление: 10 марта 2025 г.",
      intro: "EKA Balance стремится поддерживать самые высокие стандарты честности и этического поведения. Этот Кодекс этики направляет наши решения и действия, гарантируя, что мы действуем ответственно по отношению к нашим пациентам, коллегам и обществу.",
      sections: [
        {
          title: "1. Честность и порядочность",
          icon: <Shield className="w-6 h-6 text-blue-600" />,
          text: "Мы правдивы во всех наших взаимодействиях и коммуникациях. Мы не вводим в заблуждение и не обманываем других, и мы прозрачны в отношении наших возможностей и ограничений."
        },
        {
          title: "2. Уважение к личности",
          icon: <Users className="w-6 h-6 text-green-600" />,
          text: "Мы относимся ко всем с достоинством и уважением, независимо от их происхождения, положения или убеждений. Мы ценим разнообразие и создаем инклюзивную среду, в которой каждый чувствует себя в безопасности и услышанным."
        },
        {
          title: "3. Профессиональная компетентность",
          icon: <Award className="w-6 h-6 text-purple-600" />,
          text: "Мы стремимся к постоянному обучению и совершенствованию. Мы предоставляем услуги только в рамках нашей компетенции и при необходимости обращаемся за консультацией или супервизией."
        },
        {
          title: "4. Конфиденциальность и приватность",
          icon: <BookOpen className="w-6 h-6 text-orange-600" />,
          text: "Мы защищаем конфиденциальную информацию, доверенную нам пациентами, сотрудниками и партнерами. Мы раскрываем информацию только в случаях, предусмотренных законом, или при наличии соответствующего согласия."
        },
        {
          title: "5. Социальная ответственность",
          icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
          text: "Мы стремимся оказывать положительное влияние на общество и окружающую среду. Мы ведем свой бизнес устойчивым образом и поддерживаем инициативы, улучшающие благосостояние нашего сообщества."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
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
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-12 h-12 opacity-90" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
          <p className="opacity-90 max-w-2xl">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="p-8 space-y-8">
          {t.sections.map((section, index) => (
            <div key={index} className="flex gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
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
