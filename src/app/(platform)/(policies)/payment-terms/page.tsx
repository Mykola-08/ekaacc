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
          icon: <Calendar className="h-6 w-6 text-success" />,
          text: 'For subscription services, you will be billed in advance on a recurring basis (monthly or annually). For one-time services, payment is due at the time of booking or service delivery.',
        },
        {
          title: '3. Fees and Charges',
          icon: <DollarSign className="h-6 w-6 text-accent" />,
          text: 'All fees are stated in the applicable currency and are exclusive of taxes, unless otherwise stated. We reserve the right to change our fees upon notice to you.',
        },
        {
          title: '4. Late Payments',
          icon: <AlertCircle className="h-6 w-6 text-warning" />,
          text: 'If we are unable to process your payment, we may suspend your access to services until payment is received. You are responsible for any fees associated with declined payments or collections.',
        },
        {
          title: '5. Invoices and Receipts',
          icon: <FileText className="h-6 w-6 text-destructive" />,
          text: 'Invoices and receipts will be provided electronically. You can access your billing history through your account dashboard or by contacting our support team.',
        },
      ],
    },
    es: {
      title: 'T�rminos de Pago',
      lastUpdated: '�ltima actualizaci�n: 10 de marzo de 2025',
      intro:
        'Estos T�rminos de Pago rigen el pago de los servicios prestados por EKA Balance. Al utilizar nuestros servicios, usted acepta estos t�rminos. Por favor, l�alos atentamente.',
      sections: [
        {
          title: '1. M�todos de Pago',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'Aceptamos las principales tarjetas de cr�dito (Visa, MasterCard, American Express), tarjetas de d�bito y otros m�todos de pago indicados en nuestra plataforma. La informaci�n de pago debe ser precisa y estar actualizada.',
        },
        {
          title: '2. Ciclos de Facturaci�n',
          icon: <Calendar className="h-6 w-6 text-success" />,
          text: 'Para los servicios de suscripci�n, se le facturar� por adelantado de forma recurrente (mensual o anual). Para servicios �nicos, el pago vence en el momento de la reserva o prestaci�n del servicio.',
        },
        {
          title: '3. Tarifas y Cargos',
          icon: <DollarSign className="h-6 w-6 text-accent" />,
          text: 'Todas las tarifas se indican en la moneda aplicable y no incluyen impuestos, a menos que se indique lo contrario. Nos reservamos el derecho de cambiar nuestras tarifas previa notificaci�n.',
        },
        {
          title: '4. Pagos Atrasados',
          icon: <AlertCircle className="h-6 w-6 text-warning" />,
          text: 'Si no podemos procesar su pago, podemos suspender su acceso a los servicios hasta que se reciba el pago. Usted es responsable de cualquier tarifa asociada con pagos rechazados o cobros.',
        },
        {
          title: '5. Facturas y Recibos',
          icon: <FileText className="h-6 w-6 text-destructive" />,
          text: 'Las facturas y recibos se proporcionar�n electr�nicamente. Puede acceder a su historial de facturaci�n a trav�s del panel de su cuenta o comunic�ndose con nuestro equipo de soporte.',
        },
      ],
    },
    ca: {
      title: 'Termes de Pagament',
      lastUpdated: 'Darrera actualitzaci�: 10 de mar� de 2025',
      intro:
        'Aquests Termes de Pagament regeixen el pagament dels serveis prestats per EKA Balance. En utilitzar els nostres serveis, accepteu aquests termes. Si us plau, llegiu-los atentament.',
      sections: [
        {
          title: '1. M�todes de Pagament',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: 'Acceptem les principals targetes de cr�dit (Visa, MasterCard, American Express), targetes de d�bit i altres m�todes de pagament indicats a la nostra plataforma. La informaci� de pagament ha de ser precisa i estar actualitzada.',
        },
        {
          title: '2. Cicles de Facturaci�',
          icon: <Calendar className="h-6 w-6 text-success" />,
          text: 'Per als serveis de subscripci�, se us facturar� per avan�at de forma recurrent (mensual o anual). Per a serveis �nics, el pagament ven� en el moment de la reserva o prestaci� del servei.',
        },
        {
          title: '3. Tarifes i C�rrecs',
          icon: <DollarSign className="h-6 w-6 text-accent" />,
          text: "Totes les tarifes s'indiquen en la moneda aplicable i no inclouen impostos, tret que s'indiqui el contrari. Ens reservem el dret de canviar les nostres tarifes pr�via notificaci�.",
        },
        {
          title: '4. Pagaments Endarrerits',
          icon: <AlertCircle className="h-6 w-6 text-warning" />,
          text: 'Si no podem processar el vostre pagament, podem suspendre el vostre acc�s als serveis fins que es rebi el pagament. Sou responsable de qualsevol tarifa associada amb pagaments rebutjats o cobraments.',
        },
        {
          title: '5. Factures i Rebuts',
          icon: <FileText className="h-6 w-6 text-destructive" />,
          text: 'Les factures i rebuts es proporcionaran electr�nicament. Podeu accedir al vostre historial de facturaci� a trav�s del tauler del vostre compte o comunicant-vos amb el nostre equip de suport.',
        },
      ],
    },
    ru: {
      title: '??????? ??????',
      lastUpdated: '????????? ??????????: 10 ????? 2025 ?.',
      intro:
        '????????? ??????? ?????? ?????????? ?????? ?????, ??????????????? EKA Balance. ????????? ?????? ????????, ?? ???????????? ? ????? ?????????. ??????????, ??????????? ?????????? ??.',
      sections: [
        {
          title: '1. ??????? ??????',
          icon: <CreditCard className="h-6 w-6 text-primary" />,
          text: '?? ????????? ???????? ????????? ????? (Visa, MasterCard, American Express), ????????? ????? ? ?????? ??????? ??????, ????????? ?? ????? ?????????. ????????? ?????????? ?????? ???? ?????? ? ??????????.',
        },
        {
          title: '2. ????? ??????????? ??????',
          icon: <Calendar className="h-6 w-6 text-success" />,
          text: '?? ?????? ?? ???????? ??? ????? ???????????? ???? ??????? ?? ?????????? ?????? (?????????? ??? ????????). ?? ??????? ?????? ?????? ???????????? ?? ????? ???????????? ??? ?????????????? ??????.',
        },
        {
          title: '3. ????? ? ???????',
          icon: <DollarSign className="h-6 w-6 text-accent" />,
          text: '??? ????? ??????? ? ??????????????? ?????? ? ?? ???????? ??????, ???? ?? ??????? ????. ?? ????????? ?? ????? ????? ???????? ???? ????? ????? ??????????? ???.',
        },
        {
          title: '4. ???????????? ???????',
          icon: <AlertCircle className="h-6 w-6 text-warning" />,
          text: '???? ?? ?? ?????? ?????????? ??? ??????, ?? ????? ????????????? ??? ?????? ? ??????? ?? ????????? ??????. ?? ?????? ??????????????? ?? ????? ?????, ????????? ? ???????????? ????????? ??? ?????????? ?????????????.',
        },
        {
          title: '5. ????? ? ?????????',
          icon: <FileText className="h-6 w-6 text-destructive" />,
          text: '????? ? ????????? ????? ??????????????? ? ??????????? ????. ?? ?????? ???????? ?????? ? ??????? ????? ?????? ????? ?????? ?????????? ????? ??????? ??????? ??? ?????????? ? ????? ??????? ?????????.',
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
        <div className="bg-linear-to-r from-success to-success px-8 py-12 text-primary-foreground">
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
            � {new Date().getFullYear()} EKA Balance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
