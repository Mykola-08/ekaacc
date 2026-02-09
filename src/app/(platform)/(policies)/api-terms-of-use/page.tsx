'use client';

import React, { useState } from 'react';
import { Code, Key, Shield, Zap, FileText } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ApiTermsOfUse() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'API Terms of Use',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'These terms govern your access to and use of the EKA Balance Application Programming Interface (API). By accessing or using our API, you agree to comply with these terms.',
      sections: [
        {
          title: '1. Access and Authentication',
          icon: <Key className="h-6 w-6 text-blue-600" />,
          text: 'You must obtain an API key to access our API. You are responsible for maintaining the confidentiality of your API key and for all activities that occur under your key. Do not share your API key with third parties.',
        },
        {
          title: '2. Usage Limits',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'We may impose limits on the number of API requests you can make within a certain time period (rate limits). You agree not to circumvent these limits. Excessive use may result in temporary or permanent suspension of your access.',
        },
        {
          title: '3. Acceptable Use',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'You agree to use the API only for lawful purposes and in accordance with our Acceptable Use Policy. You must not use the API to transmit malware, spam, or any content that infringes on the rights of others.',
        },
        {
          title: '4. Intellectual Property',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance owns all rights, title, and interest in and to the API and related documentation. We grant you a limited, non-exclusive, non-transferable license to use the API for the purpose of developing and testing your applications.',
        },
        {
          title: '5. Modifications and Termination',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'We reserve the right to modify or discontinue the API at any time, with or without notice. We may also terminate your access to the API if you violate these terms. We are not liable for any damages resulting from such modifications or termination.',
        },
      ],
    },
    es: {
      title: 'Términos de Uso de la API',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'Estos términos rigen su acceso y uso de la Interfaz de Programación de Aplicaciones (API) de EKA Balance. Al acceder o utilizar nuestra API, acepta cumplir con estos términos.',
      sections: [
        {
          title: '1. Acceso y Autenticación',
          icon: <Key className="h-6 w-6 text-blue-600" />,
          text: 'Debe obtener una clave API para acceder a nuestra API. Usted es responsable de mantener la confidencialidad de su clave API y de todas las actividades que ocurran bajo su clave. No comparta su clave API con terceros.',
        },
        {
          title: '2. Límites de Uso',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'Podemos imponer límites en la cantidad de solicitudes de API que puede realizar dentro de un cierto período de tiempo (límites de velocidad). Acepta no eludir estos límites. El uso excesivo puede resultar en la suspensión temporal o permanente de su acceso.',
        },
        {
          title: '3. Uso Aceptable',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'Acepta utilizar la API solo para fines legales y de acuerdo con nuestra Política de Uso Aceptable. No debe utilizar la API para transmitir malware, spam o cualquier contenido que infrinja los derechos de otros.',
        },
        {
          title: '4. Propiedad Intelectual',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance posee todos los derechos, títulos e intereses sobre la API y la documentación relacionada. Le otorgamos una licencia limitada, no exclusiva e intransferible para utilizar la API con el fin de desarrollar y probar sus aplicaciones.',
        },
        {
          title: '5. Modificaciones y Terminación',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Nos reservamos el derecho de modificar o descontinuar la API en cualquier momento, con o sin previo aviso. También podemos rescindir su acceso a la API si viola estos términos. No somos responsables de ningún daño resultante de dichas modificaciones o terminación.',
        },
      ],
    },
    ca: {
      title: "Termes d'Ús de l'API",
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        "Aquests termes regeixen el vostre accés i ús de la Interfície de Programació d'Aplicacions (API) d'EKA Balance. En accedir o utilitzar la nostra API, accepteu complir amb aquests termes.",
      sections: [
        {
          title: '1. Accés i Autenticació',
          icon: <Key className="h-6 w-6 text-blue-600" />,
          text: "Heu d'obtenir una clau API per accedir a la nostra API. Sou responsable de mantenir la confidencialitat de la vostra clau API i de totes les activitats que es produeixin sota la vostra clau. No compartiu la vostra clau API amb tercers.",
        },
        {
          title: "2. Límits d'Ús",
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: "Podem imposar límits en el nombre de sol·licituds d'API que podeu fer dins d'un cert període de temps (límits de velocitat). Accepteu no eludir aquests límits. L'ús excessiu pot resultar en la suspensió temporal o permanent del vostre accés.",
        },
        {
          title: '3. Ús Acceptable',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: "Accepteu utilitzar l'API només per a fins legals i d'acord amb la nostra Política d'Ús Acceptable. No heu d'utilitzar l'API per transmetre programari maliciós, correu brossa o qualsevol contingut que infringeixi els drets d'altres.",
        },
        {
          title: '4. Propietat Intel·lectual',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: "EKA Balance posseeix tots els drets, títols i interessos sobre l'API i la documentació relacionada. Us atorguem una llicència limitada, no exclusiva i intransferible per utilitzar l'API amb la finalitat de desenvolupar i provar les vostres aplicacions.",
        },
        {
          title: '5. Modificacions i Terminació',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: "Ens reservem el dret de modificar o discontinuar l'API en qualsevol moment, amb o sense previ avís. També podem rescindir el vostre accés a l'API si violeu aquests termes. No som responsables de cap dany resultant d'aquestes modificacions o terminació.",
        },
      ],
    },
    ru: {
      title: 'Условия использования API',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'Эти условия регулируют ваш доступ к интерфейсу прикладного программирования (API) EKA Balance и его использование. Получая доступ к нашему API или используя его, вы соглашаетесь соблюдать эти условия.',
      sections: [
        {
          title: '1. Доступ и аутентификация',
          icon: <Key className="h-6 w-6 text-blue-600" />,
          text: 'Вы должны получить ключ API для доступа к нашему API. Вы несете ответственность за сохранение конфиденциальности вашего ключа API и за все действия, которые происходят под вашим ключом. Не передавайте свой ключ API третьим лицам.',
        },
        {
          title: '2. Лимиты использования',
          icon: <Zap className="h-6 w-6 text-yellow-600" />,
          text: 'Мы можем накладывать ограничения на количество запросов API, которые вы можете сделать в течение определенного периода времени (ограничения скорости). Вы соглашаетесь не обходить эти ограничения. Чрезмерное использование может привести к временной или постоянной приостановке вашего доступа.',
        },
        {
          title: '3. Допустимое использование',
          icon: <Shield className="h-6 w-6 text-green-600" />,
          text: 'Вы соглашаетесь использовать API только в законных целях и в соответствии с нашей Политикой допустимого использования. Вы не должны использовать API для передачи вредоносных программ, спама или любого контента, нарушающего права других лиц.',
        },
        {
          title: '4. Интеллектуальная собственность',
          icon: <Code className="h-6 w-6 text-purple-600" />,
          text: 'EKA Balance владеет всеми правами, титулами и интересами в отношении API и соответствующей документации. Мы предоставляем вам ограниченную, неисключительную, непередаваемую лицензию на использование API с целью разработки и тестирования ваших приложений.',
        },
        {
          title: '5. Изменения и прекращение действия',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Мы оставляем за собой право изменять или прекращать работу API в любое время, с уведомлением или без него. Мы также можем прекратить ваш доступ к API, если вы нарушите эти условия. Мы не несем ответственности за любой ущерб, возникший в результате таких изменений или прекращения действия.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-xl shadow-sm" role="group">
          {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-4 py-2 text-sm font-medium first:rounded-l-lg last:rounded-r-lg ${
                language === lang
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card text-foreground/90 border-border hover:bg-muted/30'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-2xl shadow-xl">
        <div className="bg-linear-to-r from-eka-dark to-eka-dark/90 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Code className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              className="bg-muted/30 hover:bg-muted flex gap-4 rounded-2xl p-6 transition-colors"
            >
              <div className="mt-1 shrink-0">{section.icon}</div>
              <div>
                <h2 className="text-foreground mb-2 text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 border-t border-border px-8 py-6">
          <p className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
