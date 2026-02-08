'use client';

import React, { useState } from 'react';
import { Clock, BarChart, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ServiceLevelAgreement() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Service Level Agreement (SLA)',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This Service Level Agreement (SLA) outlines the performance commitments and guarantees provided by EKA Balance to our enterprise customers.',
      sections: [
        {
          title: '1. Service Availability',
          icon: <Clock className="h-6 w-6 text-blue-600" />,
          text: 'We guarantee a Monthly Uptime Percentage of at least 99.9% for our core services. Availability is calculated by subtracting the percentage of minutes during the month in which the service was unavailable from 100%.',
        },
        {
          title: '2. Performance Metrics',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'We monitor key performance indicators such as response time, throughput, and error rates. We are committed to maintaining optimal performance levels to ensure a seamless user experience.',
        },
        {
          title: '3. Support Response Times',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'Our support team is available 24/7 for critical issues. We commit to the following initial response times: Critical (1 hour), High (4 hours), Medium (8 hours), and Low (24 hours).',
        },
        {
          title: '4. Scheduled Maintenance',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: "We perform regular maintenance to ensure the stability and security of our platform. We will provide at least 48 hours' notice for scheduled maintenance that may impact service availability.",
        },
        {
          title: '5. Service Credits',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'If we fail to meet the guaranteed Monthly Uptime Percentage, customers may be eligible for service credits. Credits are calculated as a percentage of the monthly subscription fee and are applied to future invoices.',
        },
      ],
    },
    es: {
      title: 'Acuerdo de Nivel de Servicio (SLA)',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'Este Acuerdo de Nivel de Servicio (SLA) describe los compromisos de rendimiento y las garantías proporcionadas por EKA Balance a nuestros clientes empresariales.',
      sections: [
        {
          title: '1. Disponibilidad del Servicio',
          icon: <Clock className="h-6 w-6 text-blue-600" />,
          text: 'Garantizamos un Porcentaje de Tiempo de Actividad Mensual de al menos el 99.9% para nuestros servicios principales. La disponibilidad se calcula restando el porcentaje de minutos durante el mes en que el servicio no estuvo disponible del 100%.',
        },
        {
          title: '2. Métricas de Rendimiento',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'Monitoreamos indicadores clave de rendimiento como el tiempo de respuesta, el rendimiento y las tasas de error. Nos comprometemos a mantener niveles de rendimiento óptimos para garantizar una experiencia de usuario perfecta.',
        },
        {
          title: '3. Tiempos de Respuesta de Soporte',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'Nuestro equipo de soporte está disponible las 24 horas, los 7 días de la semana para problemas críticos. Nos comprometemos a los siguientes tiempos de respuesta inicial: Crítico (1 hora), Alto (4 horas), Medio (8 horas) y Bajo (24 horas).',
        },
        {
          title: '4. Mantenimiento Programado',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'Realizamos un mantenimiento regular para garantizar la estabilidad y seguridad de nuestra plataforma. Avisaremos con al menos 48 horas de antelación sobre el mantenimiento programado que pueda afectar la disponibilidad del servicio.',
        },
        {
          title: '5. Créditos de Servicio',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'Si no cumplimos con el Porcentaje de Tiempo de Actividad Mensual garantizado, los clientes pueden ser elegibles para créditos de servicio. Los créditos se calculan como un porcentaje de la tarifa de suscripción mensual y se aplican a facturas futuras.',
        },
      ],
    },
    ca: {
      title: 'Acord de Nivell de Servei (SLA)',
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        'Aquest Acord de Nivell de Servei (SLA) descriu els compromisos de rendiment i les garanties proporcionades per EKA Balance als nostres clients empresarials.',
      sections: [
        {
          title: '1. Disponibilitat del Servei',
          icon: <Clock className="h-6 w-6 text-blue-600" />,
          text: "Garantim un Percentatge de Temps d'Activitat Mensual d'almenys el 99.9% per als nostres serveis principals. La disponibilitat es calcula restant el percentatge de minuts durant el mes en què el servei no va estar disponible del 100%.",
        },
        {
          title: '2. Mètriques de Rendiment',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: "Monitoritzem indicadors clau de rendiment com el temps de resposta, el rendiment i les taxes d'error. Ens comprometem a mantenir nivells de rendiment òptims per garantir una experiència d'usuari perfecta.",
        },
        {
          title: '3. Temps de Resposta de Suport',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'El nostre equip de suport està disponible les 24 hores, els 7 dies de la setmana per a problemes crítics. Ens comprometem als següents temps de resposta inicial: Crític (1 hora), Alt (4 hores), Mitjà (8 hores) i Baix (24 hores).',
        },
        {
          title: '4. Manteniment Programat',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: "Realitzem un manteniment regular per garantir l'estabilitat i seguretat de la nostra plataforma. Avisarem amb almenys 48 hores d'antelació sobre el manteniment programat que pugui afectar la disponibilitat del servei.",
        },
        {
          title: '5. Crèdits de Servei',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: "Si no complim amb el Percentatge de Temps d'Activitat Mensual garantit, els clients poden ser elegibles per a crèdits de servei. Els crèdits es calculen com un percentatge de la tarifa de subscripció mensual i s'apliquen a factures futures.",
        },
      ],
    },
    ru: {
      title: 'Соглашение об уровне обслуживания (SLA)',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'В этом Соглашении об уровне обслуживания (SLA) изложены обязательства по производительности и гарантии, предоставляемые EKA Balance нашим корпоративным клиентам.',
      sections: [
        {
          title: '1. Доступность сервиса',
          icon: <Clock className="h-6 w-6 text-blue-600" />,
          text: 'Мы гарантируем ежемесячный процент безотказной работы не менее 99,9% для наших основных сервисов. Доступность рассчитывается путем вычитания процента минут в течение месяца, когда сервис был недоступен, из 100%.',
        },
        {
          title: '2. Показатели производительности',
          icon: <BarChart className="h-6 w-6 text-green-600" />,
          text: 'Мы отслеживаем ключевые показатели эффективности, такие как время отклика, пропускная способность и частота ошибок. Мы стремимся поддерживать оптимальный уровень производительности, чтобы обеспечить бесперебойную работу пользователей.',
        },
        {
          title: '3. Время отклика службы поддержки',
          icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
          text: 'Наша служба поддержки доступна 24/7 для решения критических проблем. Мы обязуемся соблюдать следующее начальное время отклика: Критический (1 час), Высокий (4 часа), Средний (8 часов) и Низкий (24 часа).',
        },
        {
          title: '4. Плановое обслуживание',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          text: 'Мы проводим регулярное техническое обслуживание для обеспечения стабильности и безопасности нашей платформы. Мы будем уведомлять не менее чем за 48 часов о плановом техническом обслуживании, которое может повлиять на доступность сервиса.',
        },
        {
          title: '5. Сервисные кредиты',
          icon: <DollarSign className="h-6 w-6 text-red-600" />,
          text: 'Если мы не выполним гарантированный ежемесячный процент безотказной работы, клиенты могут иметь право на получение сервисных кредитов. Кредиты рассчитываются как процент от ежемесячной абонентской платы и применяются к будущим счетам.',
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-[12px] shadow-sm" role="group">
          {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`border px-4 py-2 text-sm font-medium first:rounded-l-[12px] last:rounded-r-[12px] ${
                language === lang
                  ? 'bg-primary border-primary text-white'
                  : 'bg-card text-foreground/90 border-border hover:bg-muted/30'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-2xl shadow-xl">
        <div className="bg-linear-to-r from-blue-700 to-indigo-800 px-8 py-12 text-white">
          <div className="mb-4 flex items-center gap-4">
            <Clock className="h-12 w-12 opacity-90" />
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

        <div className="bg-muted/30 border-t border-gray-100 px-8 py-6">
          <p className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
