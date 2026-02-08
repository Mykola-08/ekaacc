'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: 'Refund & Cancellation Policy',
    updated: 'Last Updated: November 25, 2025',
    intro:
      'At EKA Balance, we strive to provide high-quality therapy and wellness services. We understand that circumstances may change, and you may need to cancel or reschedule your appointments. This policy outlines the terms for refunds and cancellations.',
    sections: [
      {
        id: 'cancellation',
        title: '1. Appointment Cancellation',
        text: 'You may cancel or reschedule your appointment up to 24 hours before the scheduled start time without any penalty. In this case, you will receive a full refund of any fees paid.',
      },
      {
        id: 'late-cancellation',
        title: '2. Late Cancellations and No-Shows',
        text: 'Cancellations made less than 24 hours before the scheduled appointment time are considered "Late Cancellations". Late Cancellations and failure to attend a scheduled appointment ("No-Shows") are not eligible for a refund. The full fee for the session will be charged.',
      },
      {
        id: 'withdrawal',
        title: '3. Right of Withdrawal (EU Consumers)',
        text: 'If you are a consumer in the European Union, you have a statutory right to withdraw from a contract for digital services within 14 days without giving any reason. However, by booking a session to take place within this 14-day period, you expressly request that the service performance begins during the withdrawal period. If the service is fully performed (i.e., the session takes place), you lose your right of withdrawal.',
      },
      {
        id: 'process',
        title: '4. Refund Process',
        text: 'Approved refunds will be processed within 5-10 business days to the original payment method used for the booking. Please note that your bank or credit card provider may take additional time to post the refund to your account.',
      },
      {
        id: 'technical-issues',
        title: '5. Technical Issues',
        text: 'If a session cannot be completed due to technical issues on our end (e.g., platform outage), we will offer you the choice of a full refund or rescheduling the session at no additional cost. If the technical issue is on your end (e.g., internet connection failure), the standard cancellation policy applies, but we may offer rescheduling at our discretion.',
      },
      {
        id: 'contact',
        title: '6. Contact Us',
        text: 'If you have any questions about our Refund & Cancellation Policy, please contact us at support@ekabalance.com.',
      },
    ],
  },
  es: {
    title: 'Política de Reembolso y Cancelación',
    updated: 'Última actualización: 25 de noviembre de 2025',
    intro:
      'En EKA Balance, nos esforzamos por brindar servicios de terapia y bienestar de alta calidad. Entendemos que las circunstancias pueden cambiar y es posible que deba cancelar o reprogramar sus citas. Esta política describe los términos para reembolsos y cancelaciones.',
    sections: [
      {
        title: '1. Cancelación de Citas',
        text: 'Puede cancelar o reprogramar su cita hasta 24 horas antes de la hora de inicio programada sin ninguna penalización. En este caso, recibirá un reembolso completo de las tarifas pagadas.',
      },
      {
        title: '2. Cancelaciones Tardías y No Presentación',
        text: 'Las cancelaciones realizadas con menos de 24 horas de antelación a la hora programada de la cita se consideran "Cancelaciones Tardías". Las Cancelaciones Tardías y la falta de asistencia a una cita programada ("No Presentación") no son elegibles para reembolso. Se cobrará la tarifa completa de la sesión.',
      },
      {
        title: '3. Derecho de Desistimiento (Consumidores UE)',
        text: 'Si usted es un consumidor en la Unión Europea, tiene el derecho legal de desistir de un contrato de servicios digitales dentro de los 14 días sin dar ninguna razón. Sin embargo, al reservar una sesión para que tenga lugar dentro de este período de 14 días, usted solicita expresamente que la prestación del servicio comience durante el período de desistimiento. Si el servicio se presta completamente (es decir, la sesión tiene lugar), pierde su derecho de desistimiento.',
      },
      {
        title: '4. Proceso de Reembolso',
        text: 'Los reembolsos aprobados se procesarán dentro de los 5-10 días hábiles al método de pago original utilizado para la reserva. Tenga en cuenta que su banco o proveedor de tarjeta de crédito puede tardar un tiempo adicional en publicar el reembolso en su cuenta.',
      },
      {
        title: '5. Problemas Técnicos',
        text: 'Si una sesión no puede completarse debido a problemas técnicos por nuestra parte (por ejemplo, interrupción de la plataforma), le ofreceremos la opción de un reembolso completo o reprogramar la sesión sin costo adicional. Si el problema técnico es por su parte (por ejemplo, fallo de conexión a internet), se aplica la política de cancelación estándar, pero podemos ofrecer reprogramación a nuestra discreción.',
      },
      {
        title: '6. Contáctenos',
        text: 'Si tiene alguna pregunta sobre nuestra Política de Reembolso y Cancelación, contáctenos en support@ekabalance.com.',
      },
    ],
  },
  ca: {
    title: 'Política de Reemborsament i Cancel·lació',
    updated: 'Darrera actualització: 25 de novembre de 2025',
    intro:
      "A EKA Balance, ens esforcem per oferir serveis de teràpia i benestar d'alta qualitat. Entenem que les circumstàncies poden canviar i és possible que hagi de cancel·lar o reprogramar les seves cites. Aquesta política descriu els termes per a reemborsaments i cancel·lacions.",
    sections: [
      {
        title: '1. Cancel·lació de Cites',
        text: "Pot cancel·lar o reprogramar la seva cita fins a 24 hores abans de l'hora d'inici programada sense cap penalització. En aquest cas, rebrà un reemborsament complet de les tarifes pagades.",
      },
      {
        title: '2. Cancel·lacions Tardanes i No Presentació',
        text: 'Les cancel·lacions realitzades amb menys de 24 hores d\'antelació a l\'hora programada de la cita es consideren "Cancel·lacions Tardanes". Les Cancel·lacions Tardanes i la falta d\'assistència a una cita programada ("No Presentació") no són elegibles per a reemborsament. Es cobrarà la tarifa completa de la sessió.',
      },
      {
        title: '3. Dret de Desistiment (Consumidors UE)',
        text: "Si vostè és un consumidor a la Unió Europea, té el dret legal de desistir d'un contracte de serveis digitals dins dels 14 dies sense donar cap raó. No obstant això, en reservar una sessió perquè tingui lloc dins d'aquest període de 14 dies, vostè sol·licita expressament que la prestació del servei comenci durant el període de desistiment. Si el servei es presta completament (és a dir, la sessió té lloc), perd el seu dret de desistiment.",
      },
      {
        title: '4. Procés de Reemborsament',
        text: 'Els reemborsaments aprovats es processaran dins dels 5-10 dies hàbils al mètode de pagament original utilitzat per a la reserva. Tingui en compte que el seu banc o proveïdor de targeta de crèdit pot trigar un temps addicional a publicar el reemborsament al seu compte.',
      },
      {
        title: '5. Problemes Tècnics',
        text: "Si una sessió no es pot completar a causa de problemes tècnics per la nostra part (per exemple, interrupció de la plataforma), li oferirem l'opció d'un reemborsament complet o reprogramar la sessió sense cost addicional. Si el problema tècnic és per la seva part (per exemple, fallada de connexió a internet), s'aplica la política de cancel·lació estàndard, però podem oferir reprogramació a la nostra discreció.",
      },
      {
        title: "6. Contacti'ns",
        text: "Si té alguna pregunta sobre la nostra Política de Reemborsament i Cancel·lació, contacti'ns a support@ekabalance.com.",
      },
    ],
  },
  ru: {
    title: 'Политика возврата и отмены',
    updated: 'Последнее обновление: 25 ноября 2025 г.',
    intro:
      'В EKA Balance мы стремимся предоставлять высококачественные услуги терапии и оздоровления. Мы понимаем, что обстоятельства могут измениться, и вам может потребоваться отменить или перенести ваши встречи. Эта политика описывает условия возврата и отмены.',
    sections: [
      {
        title: '1. Отмена встречи',
        text: 'Вы можете отменить или перенести встречу не позднее чем за 24 часа до запланированного времени начала без каких-либо штрафов. В этом случае вы получите полный возврат уплаченных сборов.',
      },
      {
        title: '2. Поздняя отмена и неявка',
        text: 'Отмены, сделанные менее чем за 24 часа до запланированного времени встречи, считаются «Поздними отменами». Поздние отмены и неявка на запланированную встречу («Неявка») не подлежат возврату. Взимается полная стоимость сеанса.',
      },
      {
        title: '3. Право на отказ (Потребители ЕС)',
        text: 'Если вы являетесь потребителем в Европейском Союзе, у вас есть законное право отказаться от договора на цифровые услуги в течение 14 дней без объяснения причин. Однако, бронируя сеанс, который должен состояться в течение этого 14-дневного периода, вы прямо просите начать предоставление услуги в течение периода отказа. Если услуга полностью предоставлена (т.е. сеанс состоялся), вы теряете право на отказ.',
      },
      {
        title: '4. Процесс возврата',
        text: 'Одобренные возвраты будут обработаны в течение 5-10 рабочих дней на исходный способ оплаты, использованный для бронирования. Обратите внимание, что вашему банку или поставщику кредитной карты может потребоваться дополнительное время для зачисления возврата на ваш счет.',
      },
      {
        title: '5. Технические проблемы',
        text: 'Если сеанс не может быть завершен из-за технических проблем с нашей стороны (например, сбой платформы), мы предложим вам выбор: полный возврат средств или перенос сеанса без дополнительных затрат. Если техническая проблема возникла с вашей стороны (например, сбой интернет-соединения), применяется стандартная политика отмены, но мы можем предложить перенос по нашему усмотрению.',
      },
      {
        title: '6. Свяжитесь с нами',
        text: 'Если у вас есть какие-либо вопросы о нашей Политике возврата и отмены, свяжитесь с нами по адресу support@ekabalance.com.',
      },
    ],
  },
};

export default function RefundPolicyPage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = content[language];

  return (
    <div className="space-y-8">
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={() => setLanguage('en')}
          className={`rounded px-3 py-1 text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`rounded px-3 py-1 text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('ca')}
          className={`rounded px-3 py-1 text-sm ${language === 'ca' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          CA
        </button>
        <button
          onClick={() => setLanguage('ru')}
          className={`rounded px-3 py-1 text-sm ${language === 'ru' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-gray-200'}`}
        >
          RU
        </button>
      </div>

      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.updated}</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{t.intro}</p>

        {t.sections.map((section, index) => (
          <section key={index} id={(section as any).id} className="mb-8 scroll-mt-24">
            <h2 className="text-foreground mb-4 text-xl font-semibold">{section.title}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.text}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
