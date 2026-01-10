"use client";

import { useState } from "react";
import { Globe, ArrowLeft, Database } from "lucide-react";
import Link from "next/link";

type Language = "en" | "es" | "ca" | "ru";

export default function DataProcessingAgreement() {
  const [language, setLanguage] = useState<Language>("en");

  const content = {
    en: {
      title: "Data Processing Agreement (DPA)",
      lastUpdated: "Last Updated: March 15, 2024",
      intro: "This Data Processing Agreement ('DPA') forms part of the Terms of Service between EKA Balance ('Processor') and the User ('Controller') and applies to the processing of personal data under the GDPR and other applicable data protection laws.",
      sections: [
        {
          title: "1. Definitions",
          content: "For the purposes of this DPA, the terms 'Controller', 'Processor', 'Data Subject', 'Personal Data', 'Processing', and 'Supervisory Authority' shall have the meanings given to them in the General Data Protection Regulation (GDPR) (EU) 2016/679."
        },
        {
          title: "2. Subject Matter and Duration",
          content: "The subject matter of the processing is the performance of the services described in the Terms of Service. The duration of the processing corresponds to the duration of the Terms of Service."
        },
        {
          title: "3. Nature and Purpose of Processing",
          content: "The Processor will process Personal Data on behalf of the Controller for the purpose of providing the EKA Balance platform services, including user account management, appointment booking, and therapy session facilitation."
        },
        {
          title: "4. Categories of Data Subjects",
          content: "The Personal Data processed concerns the following categories of Data Subjects: Users of the EKA Balance platform, including patients, therapists, and administrators."
        },
        {
          title: "5. Types of Personal Data",
          content: "The Personal Data processed includes: Contact information (name, email, phone), health data (if provided for therapy purposes), technical data (IP address, device info), and usage data."
        },
        {
          title: "6. Rights and Obligations of the Controller",
          content: "The Controller is responsible for the lawfulness of the processing of Personal Data. The Controller shall provide all necessary instructions to the Processor regarding the processing of Personal Data."
        },
        {
          title: "7. Obligations of the Processor",
          content: "The Processor shall process Personal Data only on documented instructions from the Controller. The Processor ensures that persons authorized to process the Personal Data have committed themselves to confidentiality. The Processor takes all measures required pursuant to Article 32 of the GDPR (Security of Processing)."
        },
        {
          title: "8. Sub-processing",
          content: "The Controller authorizes the Processor to engage sub-processors to support the delivery of the Services. The Processor shall inform the Controller of any intended changes concerning the addition or replacement of other processors."
        },
        {
          title: "9. International Transfers",
          content: "Any transfer of Personal Data to a third country or an international organization by the Processor shall be done only on the basis of documented instructions from the Controller and in compliance with Chapter V of the GDPR."
        },
        {
          title: "10. Assistance to the Controller",
          content: "The Processor shall assist the Controller by appropriate technical and organizational measures, insofar as this is possible, for the fulfillment of the Controller's obligation to respond to requests for exercising the Data Subject's rights."
        },
        {
          title: "11. Deletion or Return of Data",
          content: "At the choice of the Controller, the Processor shall delete or return all the Personal Data to the Controller after the end of the provision of services relating to processing, and delete existing copies unless Union or Member State law requires storage of the Personal Data."
        }
      ]
    },
    es: {
      title: "Acuerdo de Procesamiento de Datos (DPA)",
      lastUpdated: "Última actualización: 15 de marzo de 2024",
      intro: "Este Acuerdo de Procesamiento de Datos ('DPA') forma parte de los Términos de Servicio entre EKA Balance ('Procesador') y el Usuario ('Controlador') y se aplica al procesamiento de datos personales bajo el RGPD y otras leyes de protección de datos aplicables.",
      sections: [
        {
          title: "1. Definiciones",
          content: "A los efectos de este DPA, los términos 'Controlador', 'Procesador', 'Interesado', 'Datos Personales', 'Procesamiento' y 'Autoridad de Control' tendrán los significados que se les asignan en el Reglamento General de Protección de Datos (RGPD) (UE) 2016/679."
        },
        {
          title: "2. Objeto y Duración",
          content: "El objeto del procesamiento es la prestación de los servicios descritos en los Términos de Servicio. La duración del procesamiento corresponde a la duración de los Términos de Servicio."
        },
        {
          title: "3. Naturaleza y Finalidad del Procesamiento",
          content: "El Procesador procesará Datos Personales en nombre del Controlador con el fin de proporcionar los servicios de la plataforma EKA Balance, incluida la gestión de cuentas de usuario, la reserva de citas y la facilitación de sesiones de terapia."
        },
        {
          title: "4. Categorías de Interesados",
          content: "Los Datos Personales procesados se refieren a las siguientes categorías de Interesados: Usuarios de la plataforma EKA Balance, incluidos pacientes, terapeutas y administradores."
        },
        {
          title: "5. Tipos de Datos Personales",
          content: "Los Datos Personales procesados incluyen: Información de contacto (nombre, correo electrónico, teléfono), datos de salud (si se proporcionan con fines terapéuticos), datos técnicos (dirección IP, información del dispositivo) y datos de uso."
        },
        {
          title: "6. Derechos y Obligaciones del Controlador",
          content: "El Controlador es responsable de la licitud del procesamiento de Datos Personales. El Controlador proporcionará todas las instrucciones necesarias al Procesador con respecto al procesamiento de Datos Personales."
        },
        {
          title: "7. Obligaciones del Procesador",
          content: "El Procesador procesará Datos Personales solo siguiendo instrucciones documentadas del Controlador. El Procesador garantiza que las personas autorizadas para procesar los Datos Personales se han comprometido a respetar la confidencialidad. El Procesador toma todas las medidas requeridas de conformidad con el Artículo 32 del RGPD (Seguridad del Procesamiento)."
        },
        {
          title: "8. Subprocesamiento",
          content: "El Controlador autoriza al Procesador a contratar subprocesadores para apoyar la prestación de los Servicios. El Procesador informará al Controlador de cualquier cambio previsto relativo a la incorporación o sustitución de otros procesadores."
        },
        {
          title: "9. Transferencias Internacionales",
          content: "Cualquier transferencia de Datos Personales a un tercer país o a una organización internacional por parte del Procesador se realizará únicamente sobre la base de instrucciones documentadas del Controlador y de conformidad con el Capítulo V del RGPD."
        },
        {
          title: "10. Asistencia al Controlador",
          content: "El Procesador asistirá al Controlador mediante medidas técnicas y organizativas apropiadas, siempre que sea posible, para el cumplimiento de la obligación del Controlador de responder a las solicitudes para el ejercicio de los derechos del Interesado."
        },
        {
          title: "11. Supresión o Devolución de Datos",
          content: "A elección del Controlador, el Procesador suprimirá o devolverá todos los Datos Personales al Controlador una vez finalizada la prestación de los servicios de procesamiento, y suprimirá las copias existentes a menos que la legislación de la Unión o de los Estados miembros exija la conservación de los Datos Personales."
        }
      ]
    },
    ca: {
      title: "Acord de Processament de Dades (DPA)",
      lastUpdated: "Última actualització: 15 de març de 2024",
      intro: "Aquest Acord de Processament de Dades ('DPA') forma part dels Termes del Servei entre EKA Balance ('Processador') i l'Usuari ('Controlador') i s'aplica al processament de dades personals sota el RGPD i altres lleis de protecció de dades aplicables.",
      sections: [
        {
          title: "1. Definicions",
          content: "Als efectes d'aquest DPA, els termes 'Controlador', 'Processador', 'Interessat', 'Dades Personals', 'Processament' i 'Autoritat de Control' tindran els significats que se'ls assignen en el Reglament General de Protecció de Dades (RGPD) (UE) 2016/679."
        },
        {
          title: "2. Objecte i Durada",
          content: "L'objecte del processament és la prestació dels serveis descrits als Termes del Servei. La durada del processament correspon a la durada dels Termes del Servei."
        },
        {
          title: "3. Naturalesa i Finalitat del Processament",
          content: "El Processador processarà Dades Personals en nom del Controlador amb la finalitat de proporcionar els serveis de la plataforma EKA Balance, inclosa la gestió de comptes d'usuari, la reserva de cites i la facilitació de sessions de teràpia."
        },
        {
          title: "4. Categories d'Interessats",
          content: "Les Dades Personals processades es refereixen a les següents categories d'Interessats: Usuaris de la plataforma EKA Balance, inclosos pacients, terapeutes i administradors."
        },
        {
          title: "5. Tipus de Dades Personals",
          content: "Les Dades Personals processades inclouen: Informació de contacte (nom, correu electrònic, telèfon), dades de salut (si es proporcionen amb finalitats terapèutiques), dades tècniques (adreça IP, informació del dispositiu) i dades d'ús."
        },
        {
          title: "6. Drets i Obligacions del Controlador",
          content: "El Controlador és responsable de la licitud del processament de Dades Personals. El Controlador proporcionarà totes les instruccions necessàries al Processador pel que fa al processament de Dades Personals."
        },
        {
          title: "7. Obligacions del Processador",
          content: "El Processador processarà Dades Personals només seguint instruccions documentades del Controlador. El Processador garanteix que les persones autoritzades per processar les Dades Personals s'han compromès a respectar la confidencialitat. El Processador pren totes les mesures requerides de conformitat amb l'Article 32 del RGPD (Seguretat del Processament)."
        },
        {
          title: "8. Subprocessament",
          content: "El Controlador autoritza al Processador a contractar subprocessadors per donar suport a la prestació dels Serveis. El Processador informarà al Controlador de qualsevol canvi previst relatiu a la incorporació o substitució d'altres processadors."
        },
        {
          title: "9. Transferències Internacionals",
          content: "Qualsevol transferència de Dades Personals a un tercer país o a una organització internacional per part del Processador es realitzarà únicament sobre la base d'instruccions documentades del Controlador i de conformitat amb el Capítol V del RGPD."
        },
        {
          title: "10. Assistència al Controlador",
          content: "El Processador assistirà al Controlador mitjançant mesures tècniques i organitzatives apropiades, sempre que sigui possible, per al compliment de l'obligació del Controlador de respondre a les sol·licituds per a l'exercici dels drets de l'Interessat."
        },
        {
          title: "11. Supressió o Devolució de Dades",
          content: "A elecció del Controlador, el Processador suprimirà o retornarà totes les Dades Personals al Controlador un cop finalitzada la prestació dels serveis de processament, i suprimirà les còpies existents llevat que la legislació de la Unió o dels Estats membres exigeixi la conservació de les Dades Personals."
        }
      ]
    },
    ru: {
      title: "Соглашение об обработке данных (DPA)",
      lastUpdated: "Последнее обновление: 15 марта 2024 г.",
      intro: "Настоящее Соглашение об обработке данных ('DPA') является частью Условий обслуживания между EKA Balance ('Обработчик') и Пользователем ('Контроллер') и применяется к обработке персональных данных в соответствии с GDPR и другими применимыми законами о защите данных.",
      sections: [
        {
          title: "1. Определения",
          content: "Для целей настоящего DPA термины 'Контроллер', 'Обработчик', 'Субъект данных', 'Персональные данные', 'Обработка' и 'Надзорный орган' имеют значения, указанные в Общем регламенте по защите данных (GDPR) (ЕС) 2016/679."
        },
        {
          title: "2. Предмет и срок действия",
          content: "Предметом обработки является предоставление услуг, описанных в Условиях обслуживания. Срок обработки соответствует сроку действия Условий обслуживания."
        },
        {
          title: "3. Характер и цель обработки",
          content: "Обработчик будет обрабатывать Персональные данные от имени Контроллера с целью предоставления услуг платформы EKA Balance, включая управление учетными записями пользователей, бронирование встреч и проведение терапевтических сеансов."
        },
        {
          title: "4. Категории субъектов данных",
          content: "Обрабатываемые Персональные данные касаются следующих категорий Субъектов данных: Пользователи платформы EKA Balance, включая пациентов, терапевтов и администраторов."
        },
        {
          title: "5. Типы персональных данных",
          content: "Обрабатываемые Персональные данные включают: Контактную информацию (имя, электронная почта, телефон), данные о здоровье (если предоставлены для целей терапии), технические данные (IP-адрес, информация об устройстве) и данные об использовании."
        },
        {
          title: "6. Права и обязанности Контроллера",
          content: "Контроллер несет ответственность за законность обработки Персональных данных. Контроллер должен предоставить Обработчику все необходимые инструкции относительно обработки Персональных данных."
        },
        {
          title: "7. Обязанности Обработчика",
          content: "Обработчик должен обрабатывать Персональные данные только по документированным инструкциям Контроллера. Обработчик гарантирует, что лица, уполномоченные обрабатывать Персональные данные, обязались соблюдать конфиденциальность. Обработчик принимает все меры, требуемые в соответствии со статьей 32 GDPR (Безопасность обработки)."
        },
        {
          title: "8. Субобработка",
          content: "Контроллер уполномочивает Обработчика привлекать субобработчиков для поддержки предоставления Услуг. Обработчик должен информировать Контроллера о любых предполагаемых изменениях, касающихся добавления или замены других обработчиков."
        },
        {
          title: "9. Международная передача",
          content: "Любая передача Персональных данных в третью страну или международную организацию Обработчиком должна осуществляться только на основании документированных инструкций Контроллера и в соответствии с Главой V GDPR."
        },
        {
          title: "10. Помощь Контроллеру",
          content: "Обработчик должен помогать Контроллеру с помощью соответствующих технических и организационных мер, насколько это возможно, для выполнения обязательства Контроллера отвечать на запросы для осуществления прав Субъекта данных."
        },
        {
          title: "11. Удаление или возврат данных",
          content: "По выбору Контроллера, Обработчик должен удалить или вернуть все Персональные данные Контроллеру после окончания предоставления услуг, связанных с обработкой, и удалить существующие копии, если законодательство Союза или государства-члена не требует хранения Персональных данных."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Legal Center</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 font-medium cursor-pointer"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="ca">Català</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-8 mx-auto">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {content[language].title}
          </h1>
          
          <p className="text-gray-500 text-center mb-12">
            {content[language].lastUpdated}
          </p>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="lead text-xl text-gray-800 mb-8">
              {content[language].intro}
            </p>

            <div className="space-y-8">
              {content[language].sections.map((section, index) => (
                <div key={index} className="border-b border-gray-100 pb-8 last:border-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              {language === 'en' && "This DPA is an integral part of our Terms of Service. By using our services, you agree to these data processing terms."}
              {language === 'es' && "Este DPA es una parte integral de nuestros Términos de Servicio. Al utilizar nuestros servicios, usted acepta estos términos de procesamiento de datos."}
              {language === 'ca' && "Aquest DPA és una part integral dels nostres Termes del Servei. En utilitzar els nostres serveis, accepteu aquests termes de processament de dades."}
              {language === 'ru' && "Настоящее DPA является неотъемлемой частью наших Условий обслуживания. Используя наши услуги, вы соглашаетесь с этими условиями обработки данных."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}