'use client';

import React, { useState } from 'react';
import { Truck, Globe, Users, ShieldCheck, Leaf } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function SupplierCodeOfConduct() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Supplier Code of Conduct',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to conducting business with integrity and in compliance with all applicable laws. We expect our suppliers and business partners to share this commitment.',
      sections: [
        {
          title: '1. Labor and Human Rights',
          icon: <Users className="h-6 w-6 text-blue-600" />,
          text: 'Suppliers must uphold the human rights of workers and treat them with dignity and respect. This includes prohibiting forced labor, child labor, and discrimination. Suppliers must ensure safe working conditions, fair wages, and freedom of association.',
        },
        {
          title: '2. Health and Safety',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Suppliers must provide a safe and healthy work environment for all employees. This includes complying with all applicable health and safety laws, providing appropriate training, and minimizing workplace hazards.',
        },
        {
          title: '3. Environmental Responsibility',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Suppliers should minimize their environmental impact. This includes complying with environmental laws, reducing waste and emissions, and using resources efficiently. We encourage suppliers to adopt sustainable practices.',
        },
        {
          title: '4. Business Ethics',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Suppliers must conduct business ethically and transparently. This includes prohibiting bribery, corruption, and conflicts of interest. Suppliers must also respect intellectual property rights and protect confidential information.',
        },
        {
          title: '5. Compliance and Reporting',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'Suppliers are expected to monitor their own compliance with this Code. EKA Balance reserves the right to audit suppliers. Violations should be reported immediately. Failure to comply may result in termination of the business relationship.',
        },
      ],
    },
    es: {
      title: 'Código de Conducta para Proveedores',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a realizar negocios con integridad y en cumplimiento de todas las leyes aplicables. Esperamos que nuestros proveedores y socios comerciales compartan este compromiso.',
      sections: [
        {
          title: '1. Trabajo y Derechos Humanos',
          icon: <Users className="h-6 w-6 text-blue-600" />,
          text: 'Los proveedores deben defender los derechos humanos de los trabajadores y tratarlos con dignidad y respeto. Esto incluye prohibir el trabajo forzoso, el trabajo infantil y la discriminación. Los proveedores deben garantizar condiciones de trabajo seguras, salarios justos y libertad de asociación.',
        },
        {
          title: '2. Salud y Seguridad',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Los proveedores deben proporcionar un entorno de trabajo seguro y saludable para todos los empleados. Esto incluye cumplir con todas las leyes de salud y seguridad aplicables, proporcionar capacitación adecuada y minimizar los riesgos en el lugar de trabajo.',
        },
        {
          title: '3. Responsabilidad Ambiental',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Los proveedores deben minimizar su impacto ambiental. Esto incluye cumplir con las leyes ambientales, reducir los residuos y las emisiones, y utilizar los recursos de manera eficiente. Alentamos a los proveedores a adoptar prácticas sostenibles.',
        },
        {
          title: '4. Ética Empresarial',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Los proveedores deben realizar negocios de manera ética y transparente. Esto incluye prohibir el soborno, la corrupción y los conflictos de intereses. Los proveedores también deben respetar los derechos de propiedad intelectual y proteger la información confidencial.',
        },
        {
          title: '5. Cumplimiento e Informes',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'Se espera que los proveedores supervisen su propio cumplimiento de este Código. EKA Balance se reserva el derecho de auditar a los proveedores. Las violaciones deben informarse de inmediato. El incumplimiento puede resultar en la terminación de la relación comercial.',
        },
      ],
    },
    ca: {
      title: 'Codi de Conducta per a Proveïdors',
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        'EKA Balance es compromet a fer negocis amb integritat i complint totes les lleis aplicables. Esperem que els nostres proveïdors i socis comercials comparteixin aquest compromís.',
      sections: [
        {
          title: '1. Treball i Drets Humans',
          icon: <Users className="h-6 w-6 text-blue-600" />,
          text: "Els proveïdors han de defensar els drets humans dels treballadors i tractar-los amb dignitat i respecte. Això inclou prohibir el treball forçós, el treball infantil i la discriminació. Els proveïdors han de garantir condicions de treball segures, salaris justos i llibertat d'associació.",
        },
        {
          title: '2. Salut i Seguretat',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Els proveïdors han de proporcionar un entorn de treball segur i saludable per a tots els empleats. Això inclou complir amb totes les lleis de salut i seguretat aplicables, proporcionar formació adequada i minimitzar els riscos al lloc de treball.',
        },
        {
          title: '3. Responsabilitat Ambiental',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Els proveïdors han de minimitzar el seu impacte ambiental. Això inclou complir amb les lleis ambientals, reduir els residus i les emissions, i utilitzar els recursos de manera eficient. Encoratgem els proveïdors a adoptar pràctiques sostenibles.',
        },
        {
          title: '4. Ètica Empresarial',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: "Els proveïdors han de fer negocis de manera ètica i transparent. Això inclou prohibir el suborn, la corrupció i els conflictes d'interessos. Els proveïdors també han de respectar els drets de propietat intel·lectual i protegir la informació confidencial.",
        },
        {
          title: '5. Compliment i Informes',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: "S'espera que els proveïdors supervisin el seu propi compliment d'aquest Codi. EKA Balance es reserva el dret d'auditar els proveïdors. Les violacions s'han d'informar immediatament. L'incompliment pot resultar en la terminació de la relació comercial.",
        },
      ],
    },
    ru: {
      title: 'Кодекс поведения поставщиков',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'EKA Balance стремится вести бизнес честно и в соответствии со всеми применимыми законами. Мы ожидаем, что наши поставщики и деловые партнеры разделяют это обязательство.',
      sections: [
        {
          title: '1. Труд и права человека',
          icon: <Users className="h-6 w-6 text-blue-600" />,
          text: 'Поставщики должны соблюдать права человека работников и относиться к ним с достоинством и уважением. Это включает запрет принудительного труда, детского труда и дискриминации. Поставщики должны обеспечивать безопасные условия труда, справедливую заработную плату и свободу ассоциаций.',
        },
        {
          title: '2. Здоровье и безопасность',
          icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
          text: 'Поставщики должны обеспечивать безопасную и здоровую рабочую среду для всех сотрудников. Это включает соблюдение всех применимых законов об охране труда и технике безопасности, проведение соответствующего обучения и минимизацию опасностей на рабочем месте.',
        },
        {
          title: '3. Экологическая ответственность',
          icon: <Leaf className="h-6 w-6 text-green-600" />,
          text: 'Поставщики должны минимизировать свое воздействие на окружающую среду. Это включает соблюдение экологических законов, сокращение отходов и выбросов, а также эффективное использование ресурсов. Мы поощряем поставщиков внедрять устойчивые практики.',
        },
        {
          title: '4. Деловая этика',
          icon: <Globe className="h-6 w-6 text-purple-600" />,
          text: 'Поставщики должны вести бизнес этично и прозрачно. Это включает запрет взяточничества, коррупции и конфликтов интересов. Поставщики также должны уважать права интеллектуальной собственности и защищать конфиденциальную информацию.',
        },
        {
          title: '5. Соблюдение и отчетность',
          icon: <Truck className="h-6 w-6 text-orange-600" />,
          text: 'Ожидается, что поставщики будут контролировать соблюдение ими настоящего Кодекса. EKA Balance оставляет за собой право проводить аудит поставщиков. О нарушениях следует сообщать немедленно. Несоблюдение может привести к прекращению деловых отношений.',
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
        <div className="bg-linear-to-r from-orange-600 to-red-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Truck className="h-12 w-12 opacity-90" />
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
