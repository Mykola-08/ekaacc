'use client';

import React, { useState } from 'react';
import { Activity, CloudRain, RefreshCw, Phone, Users } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function BusinessContinuityPlan() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Business Continuity Plan',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This plan outlines the strategies and procedures EKA Balance employs to ensure the continuity of critical business functions in the event of a disruption or disaster.',
      sections: [
        {
          title: '1. Purpose and Scope',
          icon: <Activity className="h-6 w-6 text-blue-600" />,
          text: 'The purpose of this plan is to minimize the impact of disruptions on our operations, customers, and stakeholders. It covers all critical business functions, including IT systems, customer support, and service delivery.',
        },
        {
          title: '2. Risk Assessment',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'We regularly assess potential risks to our business, such as natural disasters, cyberattacks, power outages, and pandemics. We identify critical assets and processes and evaluate the potential impact of their loss.',
        },
        {
          title: '3. Recovery Strategies',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'We have developed recovery strategies for various scenarios. These include data backups, redundant systems, alternative work locations, and remote work capabilities. Our goal is to restore critical functions within defined recovery time objectives (RTOs).',
        },
        {
          title: '4. Communication Plan',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'Effective communication is vital during a crisis. We have established communication protocols to keep employees, customers, and partners informed. This includes emergency contact lists, notification systems, and designated spokespersons.',
        },
        {
          title: '5. Training and Testing',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'We provide regular training to employees on their roles and responsibilities during a disruption. We also conduct periodic tests and exercises to validate the effectiveness of our business continuity plan and identify areas for improvement.',
        },
      ],
    },
    es: {
      title: 'Plan de Continuidad del Negocio',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'Este plan describe las estrategias y procedimientos que emplea EKA Balance para garantizar la continuidad de las funciones comerciales críticas en caso de interrupción o desastre.',
      sections: [
        {
          title: '1. Propósito y Alcance',
          icon: <Activity className="h-6 w-6 text-blue-600" />,
          text: 'El propósito de este plan es minimizar el impacto de las interrupciones en nuestras operaciones, clientes y partes interesadas. Cubre todas las funciones comerciales críticas, incluidos los sistemas de TI, la atención al cliente y la prestación de servicios.',
        },
        {
          title: '2. Evaluación de Riesgos',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'Evaluamos periódicamente los riesgos potenciales para nuestro negocio, como desastres naturales, ciberataques, cortes de energía y pandemias. Identificamos activos y procesos críticos y evaluamos el impacto potencial de su pérdida.',
        },
        {
          title: '3. Estrategias de Recuperación',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'Hemos desarrollado estrategias de recuperación para varios escenarios. Estos incluyen copias de seguridad de datos, sistemas redundantes, lugares de trabajo alternativos y capacidades de trabajo remoto. Nuestro objetivo es restaurar las funciones críticas dentro de los objetivos de tiempo de recuperación (RTO) definidos.',
        },
        {
          title: '4. Plan de Comunicación',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'La comunicación efectiva es vital durante una crisis. Hemos establecido protocolos de comunicación para mantener informados a los empleados, clientes y socios. Esto incluye listas de contactos de emergencia, sistemas de notificación y portavoces designados.',
        },
        {
          title: '5. Capacitación y Pruebas',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'Brindamos capacitación periódica a los empleados sobre sus roles y responsabilidades durante una interrupción. También realizamos pruebas y ejercicios periódicos para validar la efectividad de nuestro plan de continuidad del negocio e identificar áreas de mejora.',
        },
      ],
    },
    ca: {
      title: 'Pla de Continuïtat de Negoci',
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        "Aquest pla descriu les estratègies i procediments que utilitza EKA Balance per garantir la continuïtat de les funcions empresarials crítiques en cas d'interrupció o desastre.",
      sections: [
        {
          title: '1. Propòsit i Abast',
          icon: <Activity className="h-6 w-6 text-blue-600" />,
          text: "El propòsit d'aquest pla és minimitzar l'impacte de les interrupcions en les nostres operacions, clients i parts interessades. Cobreix totes les funcions empresarials crítiques, inclosos els sistemes informàtics, l'atenció al client i la prestació de serveis.",
        },
        {
          title: '2. Avaluació de Riscos',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: "Avaluem periòdicament els riscos potencials per al nostre negoci, com ara desastres naturals, ciberatacs, talls d'energia i pandèmies. Identifiquem actius i processos crítics i avaluem l'impacte potencial de la seva pèrdua.",
        },
        {
          title: '3. Estratègies de Recuperació',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'Hem desenvolupat estratègies de recuperació per a diversos escenaris. Aquests inclouen còpies de seguretat de dades, sistemes redundants, llocs de treball alternatius i capacitats de treball remot. El nostre objectiu és restaurar les funcions crítiques dins dels objectius de temps de recuperació (RTO) definits.',
        },
        {
          title: '4. Pla de Comunicació',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: "La comunicació efectiva és vital durant una crisi. Hem establert protocols de comunicació per mantenir informats els empleats, clients i socis. Això inclou llistes de contactes d'emergència, sistemes de notificació i portaveus designats.",
        },
        {
          title: '5. Formació i Proves',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: "Oferim formació periòdica als empleats sobre els seus rols i responsabilitats durant una interrupció. També realitzem proves i exercicis periòdics per validar l'eficàcia del nostre pla de continuïtat de negoci i identificar àrees de millora.",
        },
      ],
    },
    ru: {
      title: 'План обеспечения непрерывности бизнеса',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'В этом плане изложены стратегии и процедуры, которые EKA Balance использует для обеспечения непрерывности критически важных бизнес-функций в случае сбоя или катастрофы.',
      sections: [
        {
          title: '1. Цель и сфера применения',
          icon: <Activity className="h-6 w-6 text-blue-600" />,
          text: 'Целью этого плана является минимизация воздействия сбоев на нашу деятельность, клиентов и заинтересованные стороны. Он охватывает все критически важные бизнес-функции, включая ИТ-системы, поддержку клиентов и предоставление услуг.',
        },
        {
          title: '2. Оценка рисков',
          icon: <CloudRain className="text-muted-foreground h-6 w-6" />,
          text: 'Мы регулярно оцениваем потенциальные риски для нашего бизнеса, такие как стихийные бедствия, кибератаки, перебои в подаче электроэнергии и пандемии. Мы определяем критически важные активы и процессы и оцениваем потенциальное влияние их потери.',
        },
        {
          title: '3. Стратегии восстановления',
          icon: <RefreshCw className="h-6 w-6 text-green-600" />,
          text: 'Мы разработали стратегии восстановления для различных сценариев. К ним относятся резервное копирование данных, резервные системы, альтернативные рабочие места и возможности удаленной работы. Наша цель — восстановить критически важные функции в рамках определенных целевых показателей времени восстановления (RTO).',
        },
        {
          title: '4. План коммуникации',
          icon: <Phone className="h-6 w-6 text-purple-600" />,
          text: 'Эффективная коммуникация жизненно важна во время кризиса. Мы установили протоколы связи, чтобы информировать сотрудников, клиентов и партнеров. Сюда входят списки контактов для экстренных случаев, системы оповещения и назначенные представители.',
        },
        {
          title: '5. Обучение и тестирование',
          icon: <Users className="h-6 w-6 text-orange-600" />,
          text: 'Мы проводим регулярное обучение сотрудников их ролям и обязанностям во время сбоев. Мы также проводим периодические тесты и учения для проверки эффективности нашего плана обеспечения непрерывности бизнеса и выявления областей для улучшения.',
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
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Activity className="h-12 w-12 opacity-90" />
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
