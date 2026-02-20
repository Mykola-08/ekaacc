'use client';

import React, { useState } from 'react';
import { XCircle, Clock, RefreshCw, DollarSign, AlertTriangle } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function CancellationPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Cancellation Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'We understand that life happens and you may need to cancel or reschedule your appointment. This policy outlines the procedures and fees associated with cancellations to ensure fair treatment for both clients and providers.',
      sections: [
        {
          title: '1. Cancellation Window',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: "We require at least 24 hours' notice for all cancellations. This allows us to offer the appointment slot to other clients who may need care. Cancellations made with less than 24 hours' notice are considered late cancellations.",
        },
        {
          title: '2. Late Cancellation Fees',
          icon: <DollarSign className="h-6 w-6 text-destructive" />,
          text: 'Cancellations made within 24 hours of the scheduled appointment time will incur a late cancellation fee equal to 50% of the service cost. This fee is necessary to compensate the provider for their reserved time.',
        },
        {
          title: '3. No-Show Policy',
          icon: <AlertTriangle className="h-6 w-6 text-warning" />,
          text: "If you do not attend a scheduled appointment and do not provide any notice ('No-Show'), you will be charged the full amount of the service. Repeated no-shows may result in restrictions on booking future appointments.",
        },
        {
          title: '4. Rescheduling',
          icon: <RefreshCw className="h-6 w-6 text-success" />,
          text: 'You may reschedule your appointment without penalty if you do so at least 24 hours in advance. Rescheduling requests made within the 24-hour window are subject to the late cancellation fee policy.',
        },
        {
          title: '5. Provider Cancellations',
          icon: <XCircle className="h-6 w-6 text-accent" />,
          text: 'In the rare event that your provider needs to cancel, you will be notified as soon as possible. You will not be charged, and we will work with you to reschedule at your earliest convenience or provide a full refund.',
        },
      ],
    },
    es: {
      title: 'Política de Cancelación',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'Entendemos que la vida sucede y es posible que deba cancelar o reprogramar su cita. Esta política describe los procedimientos y tarifas asociados con las cancelaciones para garantizar un trato justo tanto para los clientes como para los proveedores.',
      sections: [
        {
          title: '1. Ventana de Cancelación',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: 'Requerimos un aviso de al menos 24 horas para todas las cancelaciones. Esto nos permite ofrecer el horario de la cita a otros clientes que puedan necesitar atención. Las cancelaciones realizadas con menos de 24 horas de antelación se consideran cancelaciones tardías.',
        },
        {
          title: '2. Tarifas por Cancelación Tardía',
          icon: <DollarSign className="h-6 w-6 text-destructive" />,
          text: 'Las cancelaciones realizadas dentro de las 24 horas previas a la hora programada de la cita incurrirán en una tarifa de cancelación tardía equivalente al 50% del costo del servicio. Esta tarifa es necesaria para compensar al proveedor por su tiempo reservado.',
        },
        {
          title: '3. Política de No Presentación',
          icon: <AlertTriangle className="h-6 w-6 text-warning" />,
          text: "Si no asiste a una cita programada y no proporciona ningún aviso ('No Presentación'), se le cobrará el monto total del servicio. Las no presentaciones repetidas pueden resultar en restricciones para reservar citas futuras.",
        },
        {
          title: '4. Reprogramación',
          icon: <RefreshCw className="h-6 w-6 text-success" />,
          text: 'Puede reprogramar su cita sin penalización si lo hace con al menos 24 horas de antelación. Las solicitudes de reprogramación realizadas dentro de la ventana de 24 horas están sujetas a la política de tarifas por cancelación tardía.',
        },
        {
          title: '5. Cancelaciones del Proveedor',
          icon: <XCircle className="h-6 w-6 text-accent" />,
          text: 'En el raro caso de que su proveedor deba cancelar, se le notificará lo antes posible. No se le cobrará y trabajaremos con usted para reprogramar a su conveniencia más temprana o proporcionar un reembolso completo.',
        },
      ],
    },
    ca: {
      title: 'Política de Cancel·lació',
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        'Entenem que la vida passa i és possible que hàgiu de cancel·lar o reprogramar la vostra cita. Aquesta política descriu els procediments i tarifes associats amb les cancel·lacions per garantir un tracte just tant per als clients com per als proveïdors.',
      sections: [
        {
          title: '1. Finestra de Cancel·lació',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: "Requerim un avís d'almenys 24 hores per a totes les cancel·lacions. Això ens permet oferir l'horari de la cita a altres clients que puguin necessitar atenció. Les cancel·lacions realitzades amb menys de 24 hores d'antelació es consideren cancel·lacions tardanes.",
        },
        {
          title: '2. Tarifes per Cancel·lació Tardana',
          icon: <DollarSign className="h-6 w-6 text-destructive" />,
          text: "Les cancel·lacions realitzades dins de les 24 hores prèvies a l'hora programada de la cita incorreran en una tarifa de cancel·lació tardana equivalent al 50% del cost del servei. Aquesta tarifa és necessària per compensar el proveïdor pel seu temps reservat.",
        },
        {
          title: '3. Política de No Presentació',
          icon: <AlertTriangle className="h-6 w-6 text-warning" />,
          text: "Si no assistiu a una cita programada i no proporcioneu cap avís ('No Presentació'), se us cobrarà l'import total del servei. Les no presentacions repetides poden resultar en restriccions per reservar cites futures.",
        },
        {
          title: '4. Reprogramació',
          icon: <RefreshCw className="h-6 w-6 text-success" />,
          text: "Podeu reprogramar la vostra cita sense penalització si ho feu amb almenys 24 hores d'antelació. Les sol·licituds de reprogramació realitzades dins de la finestra de 24 hores estan subjectes a la política de tarifes per cancel·lació tardana.",
        },
        {
          title: '5. Cancel·lacions del Proveïdor',
          icon: <XCircle className="h-6 w-6 text-accent" />,
          text: 'En el rar cas que el vostre proveïdor hagi de cancel·lar, se us notificarà el més aviat possible. No se us cobrarà i treballarem amb vosaltres per reprogramar a la vostra conveniència més primerenca o proporcionar un reemborsament complet.',
        },
      ],
    },
    ru: {
      title: 'Политика отмены',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'Мы понимаем, что обстоятельства могут измениться, и вам может потребоваться отменить или перенести встречу. Эта политика описывает процедуры и сборы, связанные с отменой, чтобы обеспечить справедливое отношение как к клиентам, так и к специалистам.',
      sections: [
        {
          title: '1. Срок отмены',
          icon: <Clock className="h-6 w-6 text-primary" />,
          text: 'Мы требуем уведомления об отмене не менее чем за 24 часа. Это позволяет нам предложить время встречи другим клиентам, которым может потребоваться помощь. Отмены, сделанные менее чем за 24 часа, считаются поздними отменами.',
        },
        {
          title: '2. Сборы за позднюю отмену',
          icon: <DollarSign className="h-6 w-6 text-destructive" />,
          text: 'За отмену, сделанную в течение 24 часов до запланированного времени встречи, взимается сбор за позднюю отмену в размере 50% от стоимости услуги. Этот сбор необходим для компенсации специалисту за зарезервированное время.',
        },
        {
          title: '3. Политика неявки',
          icon: <AlertTriangle className="h-6 w-6 text-warning" />,
          text: "Если вы не пришли на запланированную встречу и не предоставили никакого уведомления ('Неявка'), с вас будет списана полная стоимость услуги. Повторные неявки могут привести к ограничениям на бронирование будущих встреч.",
        },
        {
          title: '4. Перенос встречи',
          icon: <RefreshCw className="h-6 w-6 text-success" />,
          text: 'Вы можете перенести встречу без штрафа, если сделаете это не менее чем за 24 часа. Запросы на перенос, сделанные в течение 24-часового окна, подпадают под действие политики сборов за позднюю отмену.',
        },
        {
          title: '5. Отмена со стороны специалиста',
          icon: <XCircle className="h-6 w-6 text-accent" />,
          text: 'В редких случаях, когда вашему специалисту необходимо отменить встречу, вы будете уведомлены как можно скорее. С вас не будет взиматься плата, и мы будем работать с вами, чтобы перенести встречу на удобное для вас время или предоставить полный возврат средств.',
        },
      ],
    },
  };

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-card mx-auto max-w-4xl overflow-hidden rounded-lg shadow-sm">
        <div className="flex items-center justify-between bg-primary px-8 py-8 text-primary-foreground">
          <div>
            <h1 className="text-3xl font-semibold">{content[language].title}</h1>
            <p className="mt-2 text-primary-foreground/80">{content[language].lastUpdated}</p>
          </div>
          <div className="flex space-x-2">
            {(['en', 'es', 'ca', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded px-3 py-1 text-sm font-semibold uppercase transition-colors ${
                  language === lang
                    ? 'bg-card text-primary'
                    : 'bg-primary/80 text-primary-foreground/60 hover:bg-primary/70'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <p className="text-foreground/90 mb-8 border-b pb-8 text-lg leading-relaxed">
            {content[language].intro}
          </p>

          <div className="space-y-8">
            {content[language].sections.map((section, index) => (
              <div
                key={index}
                className="bg-muted/30 flex items-start rounded-lg p-6 transition-shadow hover:shadow-md"
              >
                <div className="bg-card mt-1 shrink-0 rounded-full p-3 shadow-sm">
                  {section.icon}
                </div>
                <div className="ml-6">
                  <h2 className="text-foreground mb-3 text-xl font-semibold">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>&copy; 2025 EKA Balance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
