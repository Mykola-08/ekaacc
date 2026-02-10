'use client';

import React, { useState } from 'react';
import { CreditCard, Calendar, DollarSign, AlertCircle, FileText } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function PaymentTerms() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Payment Terms',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'These Payment Terms govern the payment for services provided by EKA Balance. By using our services, you agree to these terms. Please read them carefully.',
      sections: [
        {
          title: '1. Payment Methods',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, and other payment methods as indicated on our platform. Payment information must be accurate and up-to-date.',
        },
        {
          title: '2. Billing Cycles',
          icon: <Calendar className="h-6 w-6 text-green-600" />,
          text: 'For subscription services, you will be billed in advance on a recurring basis (monthly or annually). For one-time services, payment is due at the time of booking or service delivery.',
        },
        {
          title: '3. Fees and Charges',
          icon: <DollarSign className="h-6 w-6 text-purple-600" />,
          text: 'All fees are stated in the applicable currency and are exclusive of taxes, unless otherwise stated. We reserve the right to change our fees upon notice to you.',
        },
        {
          title: '4. Late Payments',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'If we are unable to process your payment, we may suspend your access to services until payment is received. You are responsible for any fees associated with declined payments or collections.',
        },
        {
          title: '5. Invoices and Receipts',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Invoices and receipts will be provided electronically. You can access your billing history through your account dashboard or by contacting our support team.',
        },
      ],
    },
    es: {
      title: 'TÃ©rminos de Pago',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Estos TÃ©rminos de Pago rigen el pago de los servicios prestados por EKA Balance. Al utilizar nuestros servicios, usted acepta estos tÃ©rminos. Por favor, lÃ©alos atentamente.',
      sections: [
        {
          title: '1. MÃ©todos de Pago',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'Aceptamos las principales tarjetas de crÃ©dito (Visa, MasterCard, American Express), tarjetas de dÃ©bito y otros mÃ©todos de pago indicados en nuestra plataforma. La informaciÃ³n de pago debe ser precisa y estar actualizada.',
        },
        {
          title: '2. Ciclos de FacturaciÃ³n',
          icon: <Calendar className="h-6 w-6 text-green-600" />,
          text: 'Para los servicios de suscripciÃ³n, se le facturarÃ¡ por adelantado de forma recurrente (mensual o anual). Para servicios Ãºnicos, el pago vence en el momento de la reserva o prestaciÃ³n del servicio.',
        },
        {
          title: '3. Tarifas y Cargos',
          icon: <DollarSign className="h-6 w-6 text-purple-600" />,
          text: 'Todas las tarifas se indican en la moneda aplicable y no incluyen impuestos, a menos que se indique lo contrario. Nos reservamos el derecho de cambiar nuestras tarifas previa notificaciÃ³n.',
        },
        {
          title: '4. Pagos Atrasados',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Si no podemos procesar su pago, podemos suspender su acceso a los servicios hasta que se reciba el pago. Usted es responsable de cualquier tarifa asociada con pagos rechazados o cobros.',
        },
        {
          title: '5. Facturas y Recibos',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Las facturas y recibos se proporcionarÃ¡n electrÃ³nicamente. Puede acceder a su historial de facturaciÃ³n a travÃ©s del panel de su cuenta o comunicÃ¡ndose con nuestro equipo de soporte.',
        },
      ],
    },
    ca: {
      title: 'Termes de Pagament',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        'Aquests Termes de Pagament regeixen el pagament dels serveis prestats per EKA Balance. En utilitzar els nostres serveis, accepteu aquests termes. Si us plau, llegiu-los atentament.',
      sections: [
        {
          title: '1. MÃ¨todes de Pagament',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'Acceptem les principals targetes de crÃ¨dit (Visa, MasterCard, American Express), targetes de dÃ¨bit i altres mÃ¨todes de pagament indicats a la nostra plataforma. La informaciÃ³ de pagament ha de ser precisa i estar actualitzada.',
        },
        {
          title: '2. Cicles de FacturaciÃ³',
          icon: <Calendar className="h-6 w-6 text-green-600" />,
          text: 'Per als serveis de subscripciÃ³, se us facturarÃ  per avanÃ§at de forma recurrent (mensual o anual). Per a serveis Ãºnics, el pagament venÃ§ en el moment de la reserva o prestaciÃ³ del servei.',
        },
        {
          title: '3. Tarifes i CÃ rrecs',
          icon: <DollarSign className="h-6 w-6 text-purple-600" />,
          text: "Totes les tarifes s'indiquen en la moneda aplicable i no inclouen impostos, tret que s'indiqui el contrari. Ens reservem el dret de canviar les nostres tarifes prÃ¨via notificaciÃ³.",
        },
        {
          title: '4. Pagaments Endarrerits',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Si no podem processar el vostre pagament, podem suspendre el vostre accÃ©s als serveis fins que es rebi el pagament. Sou responsable de qualsevol tarifa associada amb pagaments rebutjats o cobraments.',
        },
        {
          title: '5. Factures i Rebuts',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Les factures i rebuts es proporcionaran electrÃ²nicament. Podeu accedir al vostre historial de facturaciÃ³ a travÃ©s del tauler del vostre compte o comunicant-vos amb el nostre equip de suport.',
        },
      ],
    },
    ru: {
      title: 'Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'ÐÐ°ÑÑ‚Ð¾ÑÑ‰Ð¸Ðµ Ð£ÑÐ»Ð¾Ð²Ð¸Ñ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹ Ñ€ÐµÐ³ÑƒÐ»Ð¸Ñ€ÑƒÑŽÑ‚ Ð¾Ð¿Ð»Ð°Ñ‚Ñƒ ÑƒÑÐ»ÑƒÐ³, Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼Ñ‹Ñ… EKA Balance. ÐŸÐ¾Ð»ÑŒÐ·ÑƒÑÑÑŒ Ð½Ð°ÑˆÐ¸Ð¼Ð¸ ÑƒÑÐ»ÑƒÐ³Ð°Ð¼Ð¸, Ð²Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐ°ÐµÑ‚ÐµÑÑŒ Ñ ÑÑ‚Ð¸Ð¼Ð¸ ÑƒÑÐ»Ð¾Ð²Ð¸ÑÐ¼Ð¸. ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð²Ð½Ð¸Ð¼Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð¸Ñ….',
      sections: [
        {
          title: '1. Ð¡Ð¿Ð¾ÑÐ¾Ð±Ñ‹ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'ÐœÑ‹ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÐµÐ¼ Ð¾ÑÐ½Ð¾Ð²Ð½Ñ‹Ðµ ÐºÑ€ÐµÐ´Ð¸Ñ‚Ð½Ñ‹Ðµ ÐºÐ°Ñ€Ñ‚Ñ‹ (Visa, MasterCard, American Express), Ð´ÐµÐ±ÐµÑ‚Ð¾Ð²Ñ‹Ðµ ÐºÐ°Ñ€Ñ‚Ñ‹ Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ðµ ÑÐ¿Ð¾ÑÐ¾Ð±Ñ‹ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹, ÑƒÐºÐ°Ð·Ð°Ð½Ð½Ñ‹Ðµ Ð½Ð° Ð½Ð°ÑˆÐµÐ¹ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ. ÐŸÐ»Ð°Ñ‚ÐµÐ¶Ð½Ð°Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð±Ñ‹Ñ‚ÑŒ Ñ‚Ð¾Ñ‡Ð½Ð¾Ð¹ Ð¸ Ð°ÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾Ð¹.',
        },
        {
          title: '2. Ð¦Ð¸ÐºÐ»Ñ‹ Ð²Ñ‹ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ‡ÐµÑ‚Ð¾Ð²',
          icon: <Calendar className="h-6 w-6 text-green-600" />,
          text: 'Ð—Ð° ÑƒÑÐ»ÑƒÐ³Ð¸ Ð¿Ð¾ Ð¿Ð¾Ð´Ð¿Ð¸ÑÐºÐµ Ð²Ð°Ð¼ Ð±ÑƒÐ´ÐµÑ‚ Ð²Ñ‹ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒÑÑ ÑÑ‡ÐµÑ‚ Ð·Ð°Ñ€Ð°Ð½ÐµÐµ Ð½Ð° Ñ€ÐµÐ³ÑƒÐ»ÑÑ€Ð½Ð¾Ð¹ Ð¾ÑÐ½Ð¾Ð²Ðµ (ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ð¾ Ð¸Ð»Ð¸ ÐµÐ¶ÐµÐ³Ð¾Ð´Ð½Ð¾). Ð—Ð° Ñ€Ð°Ð·Ð¾Ð²Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð¾Ð¿Ð»Ð°Ñ‚Ð° Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´Ð¸Ñ‚ÑÑ Ð²Ð¾ Ð²Ñ€ÐµÐ¼Ñ Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑƒÑÐ»ÑƒÐ³Ð¸.',
        },
        {
          title: '3. Ð¡Ð±Ð¾Ñ€Ñ‹ Ð¸ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸',
          icon: <DollarSign className="h-6 w-6 text-purple-600" />,
          text: 'Ð’ÑÐµ ÑÐ±Ð¾Ñ€Ñ‹ ÑƒÐºÐ°Ð·Ð°Ð½Ñ‹ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ¹ Ð²Ð°Ð»ÑŽÑ‚Ðµ Ð¸ Ð½Ðµ Ð²ÐºÐ»ÑŽÑ‡Ð°ÑŽÑ‚ Ð½Ð°Ð»Ð¾Ð³Ð¸, ÐµÑÐ»Ð¸ Ð½Ðµ ÑƒÐºÐ°Ð·Ð°Ð½Ð¾ Ð¸Ð½Ð¾Ðµ. ÐœÑ‹ Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð¸Ð·Ð¼ÐµÐ½ÑÑ‚ÑŒ Ð½Ð°ÑˆÐ¸ ÑÐ±Ð¾Ñ€Ñ‹ Ð¿Ð¾ÑÐ»Ðµ ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ Ð²Ð°Ñ.',
        },
        {
          title: '4. ÐŸÑ€Ð¾ÑÑ€Ð¾Ñ‡ÐµÐ½Ð½Ñ‹Ðµ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Ð•ÑÐ»Ð¸ Ð¼Ñ‹ Ð½Ðµ ÑÐ¼Ð¾Ð¶ÐµÐ¼ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ð²Ð°Ñˆ Ð¿Ð»Ð°Ñ‚ÐµÐ¶, Ð¼Ñ‹ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ñ€Ð¸Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ð²Ð°Ñˆ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº ÑƒÑÐ»ÑƒÐ³Ð°Ð¼ Ð´Ð¾ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹. Ð’Ñ‹ Ð½ÐµÑÐµÑ‚Ðµ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ÑÑ‚ÑŒ Ð·Ð° Ð»ÑŽÐ±Ñ‹Ðµ ÑÐ±Ð¾Ñ€Ñ‹, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ñ Ð¾Ñ‚ÐºÐ»Ð¾Ð½ÐµÐ½Ð½Ñ‹Ð¼Ð¸ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð°Ð¼Ð¸ Ð¸Ð»Ð¸ Ð²Ð·Ñ‹ÑÐºÐ°Ð½Ð¸ÐµÐ¼ Ð·Ð°Ð´Ð¾Ð»Ð¶ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸.',
        },
        {
          title: '5. Ð¡Ñ‡ÐµÑ‚Ð° Ð¸ ÐºÐ²Ð¸Ñ‚Ð°Ð½Ñ†Ð¸Ð¸',
          icon: <FileText className="h-6 w-6 text-red-600" />,
          text: 'Ð¡Ñ‡ÐµÑ‚Ð° Ð¸ ÐºÐ²Ð¸Ñ‚Ð°Ð½Ñ†Ð¸Ð¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒÑÑ Ð² ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ð¾Ð¼ Ð²Ð¸Ð´Ðµ. Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ðº Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ ÑÐ²Ð¾Ð¸Ñ… ÑÑ‡ÐµÑ‚Ð¾Ð² Ñ‡ÐµÑ€ÐµÐ· Ð¿Ð°Ð½ÐµÐ»ÑŒ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÐ²Ð¾ÐµÐ¹ ÑƒÑ‡ÐµÑ‚Ð½Ð¾Ð¹ Ð·Ð°Ð¿Ð¸ÑÑŒÑŽ Ð¸Ð»Ð¸ ÑÐ²ÑÐ·Ð°Ð²ÑˆÐ¸ÑÑŒ Ñ Ð½Ð°ÑˆÐµÐ¹ ÑÐ»ÑƒÐ¶Ð±Ð¾Ð¹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸.',
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

      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <div className="bg-linear-to-r from-green-600 to-emerald-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <CreditCard className="h-12 w-12 opacity-90" />
            <h1 className="text-3xl font-semibold">{t.title}</h1>
          </div>
          <p className="max-w-2xl opacity-90">{t.intro}</p>
          <p className="mt-4 text-sm opacity-75">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 p-8">
          {t.sections.map((section, index) => (
            <div
              key={index}
              className="bg-muted/30 hover:bg-muted flex gap-4 rounded-lg p-6 transition-colors"
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
            Â© {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
