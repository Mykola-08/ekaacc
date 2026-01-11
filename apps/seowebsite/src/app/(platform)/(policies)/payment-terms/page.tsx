"use client";

import React, { useState } from "react";
import { CreditCard, Calendar, DollarSign, AlertCircle, FileText } from "lucide-react";

type Language = "en" | "es" | "ca" | "ru";

export default function PaymentTerms() {
  const [language, setLanguage] = useState<Language>("en");

  const content = {
    en: {
      title: "Payment Terms",
      lastUpdated: "Last Updated: March 10, 2025",
      intro: "These Payment Terms govern the payment for services provided by EKA Balance. By using our services, you agree to these terms. Please read them carefully.",
      sections: [
        {
          title: "1. Payment Methods",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          text: "We accept major credit cards (Visa, MasterCard, American Express), debit cards, and other payment methods as indicated on our platform. Payment information must be accurate and up-to-date."
        },
        {
          title: "2. Billing Cycles",
          icon: <Calendar className="w-6 h-6 text-green-600" />,
          text: "For subscription services, you will be billed in advance on a recurring basis (monthly or annually). For one-time services, payment is due at the time of booking or service delivery."
        },
        {
          title: "3. Fees and Charges",
          icon: <DollarSign className="w-6 h-6 text-purple-600" />,
          text: "All fees are stated in the applicable currency and are exclusive of taxes, unless otherwise stated. We reserve the right to change our fees upon notice to you."
        },
        {
          title: "4. Late Payments",
          icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
          text: "If we are unable to process your payment, we may suspend your access to services until payment is received. You are responsible for any fees associated with declined payments or collections."
        },
        {
          title: "5. Invoices and Receipts",
          icon: <FileText className="w-6 h-6 text-red-600" />,
          text: "Invoices and receipts will be provided electronically. You can access your billing history through your account dashboard or by contacting our support team."
        }
      ]
    },
    es: {
      title: "Términos de Pago",
      lastUpdated: "Última actualización: 10 de marzo de 2025",
      intro: "Estos Términos de Pago rigen el pago de los servicios prestados por EKA Balance. Al utilizar nuestros servicios, usted acepta estos términos. Por favor, léalos atentamente.",
      sections: [
        {
          title: "1. Métodos de Pago",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          text: "Aceptamos las principales tarjetas de crédito (Visa, MasterCard, American Express), tarjetas de débito y otros métodos de pago indicados en nuestra plataforma. La información de pago debe ser precisa y estar actualizada."
        },
        {
          title: "2. Ciclos de Facturación",
          icon: <Calendar className="w-6 h-6 text-green-600" />,
          text: "Para los servicios de suscripción, se le facturará por adelantado de forma recurrente (mensual o anual). Para servicios únicos, el pago vence en el momento de la reserva o prestación del servicio."
        },
        {
          title: "3. Tarifas y Cargos",
          icon: <DollarSign className="w-6 h-6 text-purple-600" />,
          text: "Todas las tarifas se indican en la moneda aplicable y no incluyen impuestos, a menos que se indique lo contrario. Nos reservamos el derecho de cambiar nuestras tarifas previa notificación."
        },
        {
          title: "4. Pagos Atrasados",
          icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
          text: "Si no podemos procesar su pago, podemos suspender su acceso a los servicios hasta que se reciba el pago. Usted es responsable de cualquier tarifa asociada con pagos rechazados o cobros."
        },
        {
          title: "5. Facturas y Recibos",
          icon: <FileText className="w-6 h-6 text-red-600" />,
          text: "Las facturas y recibos se proporcionarán electrónicamente. Puede acceder a su historial de facturación a través del panel de su cuenta o comunicándose con nuestro equipo de soporte."
        }
      ]
    },
    ca: {
      title: "Termes de Pagament",
      lastUpdated: "Darrera actualització: 10 de març de 2025",
      intro: "Aquests Termes de Pagament regeixen el pagament dels serveis prestats per EKA Balance. En utilitzar els nostres serveis, accepteu aquests termes. Si us plau, llegiu-los atentament.",
      sections: [
        {
          title: "1. Mètodes de Pagament",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          text: "Acceptem les principals targetes de crèdit (Visa, MasterCard, American Express), targetes de dèbit i altres mètodes de pagament indicats a la nostra plataforma. La informació de pagament ha de ser precisa i estar actualitzada."
        },
        {
          title: "2. Cicles de Facturació",
          icon: <Calendar className="w-6 h-6 text-green-600" />,
          text: "Per als serveis de subscripció, se us facturarà per avançat de forma recurrent (mensual o anual). Per a serveis únics, el pagament venç en el moment de la reserva o prestació del servei."
        },
        {
          title: "3. Tarifes i Càrrecs",
          icon: <DollarSign className="w-6 h-6 text-purple-600" />,
          text: "Totes les tarifes s'indiquen en la moneda aplicable i no inclouen impostos, tret que s'indiqui el contrari. Ens reservem el dret de canviar les nostres tarifes prèvia notificació."
        },
        {
          title: "4. Pagaments Endarrerits",
          icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
          text: "Si no podem processar el vostre pagament, podem suspendre el vostre accés als serveis fins que es rebi el pagament. Sou responsable de qualsevol tarifa associada amb pagaments rebutjats o cobraments."
        },
        {
          title: "5. Factures i Rebuts",
          icon: <FileText className="w-6 h-6 text-red-600" />,
          text: "Les factures i rebuts es proporcionaran electrònicament. Podeu accedir al vostre historial de facturació a través del tauler del vostre compte o comunicant-vos amb el nostre equip de suport."
        }
      ]
    },
    ru: {
      title: "Условия оплаты",
      lastUpdated: "Последнее обновление: 10 марта 2025 г.",
      intro: "Настоящие Условия оплаты регулируют оплату услуг, предоставляемых EKA Balance. Пользуясь нашими услугами, вы соглашаетесь с этими условиями. Пожалуйста, внимательно прочитайте их.",
      sections: [
        {
          title: "1. Способы оплаты",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          text: "Мы принимаем основные кредитные карты (Visa, MasterCard, American Express), дебетовые карты и другие способы оплаты, указанные на нашей платформе. Платежная информация должна быть точной и актуальной."
        },
        {
          title: "2. Циклы выставления счетов",
          icon: <Calendar className="w-6 h-6 text-green-600" />,
          text: "За услуги по подписке вам будет выставляться счет заранее на регулярной основе (ежемесячно или ежегодно). За разовые услуги оплата производится во время бронирования или предоставления услуги."
        },
        {
          title: "3. Сборы и платежи",
          icon: <DollarSign className="w-6 h-6 text-purple-600" />,
          text: "Все сборы указаны в соответствующей валюте и не включают налоги, если не указано иное. Мы оставляем за собой право изменять наши сборы после уведомления вас."
        },
        {
          title: "4. Просроченные платежи",
          icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
          text: "Если мы не сможем обработать ваш платеж, мы можем приостановить ваш доступ к услугам до получения оплаты. Вы несете ответственность за любые сборы, связанные с отклоненными платежами или взысканием задолженности."
        },
        {
          title: "5. Счета и квитанции",
          icon: <FileText className="w-6 h-6 text-red-600" />,
          text: "Счета и квитанции будут предоставляться в электронном виде. Вы можете получить доступ к истории своих счетов через панель управления своей учетной записью или связавшись с нашей службой поддержки."
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
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <CreditCard className="w-12 h-12 opacity-90" />
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
