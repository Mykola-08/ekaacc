'use client';

import { useState } from 'react';

type Language = 'en' | 'es' | 'ca' | 'ru';

const content = {
  en: {
    title: "Legal Notice (Imprint)",
    updated: "Last Updated: November 25, 2025",
    intro: "In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the identifying data of the owner of the website are set out below.",
    sections: [
      {
        title: "1. Identity of the Website Owner",
        text: "Owner: EKA Balance\nRegistered Office: [Insert Address], Barcelona, Spain\nNIF/CIF: [Insert Tax ID]\nEmail: legal@ekabalance.com\n\nRegistered in the Commercial Registry of Barcelona: [Insert Registry Data, e.g., Volume X, Folio Y, Sheet Z]."
      },
      {
        title: "2. Purpose of the Website",
        text: "The purpose of this website is to provide information about therapy services, facilitate booking of appointments, and offer resources related to mental health and well-being."
      },
      {
        title: "3. Terms of Use",
        text: "Access to and use of this website attributes the condition of USER, who accepts, from said access and/or use, the General Terms of Use reflected here. The aforementioned Terms will apply regardless of the General Terms of Contracting that, if applicable, are mandatory."
      },
      {
        title: "4. Data Protection",
        text: "EKA Balance complies with the guidelines of the Organic Law 3/2018 on Personal Data Protection and Guarantee of Digital Rights (LOPDGDD) and the General Data Protection Regulation (GDPR) (EU) 2016/679. For more information, please refer to our Privacy Policy."
      },
      {
        title: "5. Intellectual and Industrial Property",
        text: "EKA Balance, by itself or as an assignee, is the owner of all intellectual and industrial property rights of its website, as well as the elements contained therein (including but not limited to images, sound, audio, video, software or texts; trademarks or logos, color combinations, structure and design, selection of materials used, computer programs necessary for its operation, access and use, etc.). All rights reserved."
      },
      {
        title: "6. Exclusion of Guarantees and Liability",
        text: "EKA Balance is not responsible, in any case, for damages of any nature that may cause, by way of example: errors or omissions in the content, lack of availability of the portal or the transmission of viruses or malicious or harmful programs in the content, despite having adopted all the necessary technological measures to prevent it."
      },
      {
        title: "7. Modifications",
        text: "EKA Balance reserves the right to make unannounced changes it deems appropriate to its portal, being able to change, delete or add both the content and services provided through it and the way in which they are presented or located on its portal."
      },
      {
        title: "8. Applicable Law and Jurisdiction",
        text: "The relationship between EKA Balance and the USER shall be governed by current Spanish regulations and any controversy shall be submitted to the Courts and Tribunals of the city of Barcelona."
      }
    ]
  },
  es: {
    title: "Aviso Legal",
    updated: "Última actualización: 25 de noviembre de 2025",
    intro: "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se exponen a continuación los datos identificativos del titular del sitio web.",
    sections: [
      {
        title: "1. Identidad del Titular de la Web",
        text: "Titular: EKA Balance\nDomicilio Social: [Insertar Dirección], Barcelona, España\nNIF/CIF: [Insertar NIF]\nEmail: legal@ekabalance.com\n\nInscrita en el Registro Mercantil de Barcelona: [Insertar Datos Registrales, ej. Tomo X, Folio Y, Hoja Z]."
      },
      {
        title: "2. Finalidad del Sitio Web",
        text: "La finalidad de este sitio web es proporcionar información sobre servicios de terapia, facilitar la reserva de citas y ofrecer recursos relacionados con la salud mental y el bienestar."
      },
      {
        title: "3. Condiciones de Uso",
        text: "El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento."
      },
      {
        title: "4. Protección de Datos",
        text: "EKA Balance cumple con las directrices de la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y el Reglamento General de Protección de Datos (RGPD) (UE) 2016/679. Para más información, consulte nuestra Política de Privacidad."
      },
      {
        title: "5. Propiedad Intelectual e Industrial",
        text: "EKA Balance por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.). Todos los derechos reservados."
      },
      {
        title: "6. Exclusión de Garantías y Responsabilidad",
        text: "EKA Balance no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo."
      },
      {
        title: "7. Modificaciones",
        text: "EKA Balance se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal."
      },
      {
        title: "8. Legislación Aplicable y Jurisdicción",
        text: "La relación entre EKA Balance y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y Tribunales de la ciudad de Barcelona."
      }
    ]
  },
  ca: {
    title: "Avís Legal",
    updated: "Darrera actualització: 25 de novembre de 2025",
    intro: "En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i del Comerç Electrònic (LSSI-CE), s'exposen a continuació les dades identificatives del titular del lloc web.",
    sections: [
      {
        title: "1. Identitat del Titular del Web",
        text: "Titular: EKA Balance\nDomicili Social: [Inserir Adreça], Barcelona, Espanya\nNIF/CIF: [Inserir NIF]\nEmail: legal@ekabalance.com\n\nInscrita al Registre Mercantil de Barcelona: [Inserir Dades Registrals, ex. Tom X, Foli Y, Full Z]."
      },
      {
        title: "2. Finalitat del Lloc Web",
        text: "La finalitat d'aquest lloc web és proporcionar informació sobre serveis de teràpia, facilitar la reserva de cites i oferir recursos relacionats amb la salut mental i el benestar."
      },
      {
        title: "3. Condicions d'Ús",
        text: "L'accés i/o ús d'aquest portal atribueix la condició d'USUARI, que accepta, des d'aquest accés i/o ús, les Condicions Generals d'Ús aquí reflectides. Les esmentades Condicions seran d'aplicació independentment de les Condicions Generals de Contractació que si s'escau resultin d'obligat compliment."
      },
      {
        title: "4. Protecció de Dades",
        text: "EKA Balance compleix amb les directrius de la Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD) i el Reglament General de Protecció de Dades (RGPD) (UE) 2016/679. Per a més informació, consulti la nostra Política de Privacitat."
      },
      {
        title: "5. Propietat Intel·lectual i Industrial",
        text: "EKA Balance per si o com a cessionària, és titular de tots els drets de propietat intel·lectual i industrial de la seva pàgina web, així com dels elements continguts en la mateixa (a títol enunciatiu, imatges, so, àudio, vídeo, programari o textos; marques o logotips, combinacions de colors, estructura i disseny, selecció de materials usats, programes d'ordinador necessaris per al seu funcionament, accés i ús, etc.). Tots els drets reservats."
      },
      {
        title: "6. Exclusió de Garanties i Responsabilitat",
        text: "EKA Balance no es fa responsable, en cap cas, dels danys i perjudicis de qualsevol naturalesa que poguessin ocasionar, a títol enunciatiu: errors o omissions en els continguts, falta de disponibilitat del portal o la transmissió de virus o programes maliciosos o lesius en els continguts, malgrat haver adoptat totes les mesures tecnològiques necessàries per evitar-ho."
      },
      {
        title: "7. Modificacions",
        text: "EKA Balance es reserva el dret d'efectuar sense previ avís les modificacions que consideri oportunes al seu portal, podent canviar, suprimir o afegir tant els continguts i serveis que es prestin a través de la mateixa com la forma en la qual aquests apareguin presentats o localitzats al seu portal."
      },
      {
        title: "8. Legislació Aplicable i Jurisdicció",
        text: "La relació entre EKA Balance i l'USUARI es regirà per la normativa espanyola vigent i qualsevol controvèrsia se sotmetrà als Jutjats i Tribunals de la ciutat de Barcelona."
      }
    ]
  },
  ru: {
    title: "Правовое уведомление",
    updated: "Последнее обновление: 25 ноября 2025 г.",
    intro: "В соответствии со статьей 10 Закона 34/2002 от 11 июля об услугах информационного общества и электронной коммерции (LSSI-CE), ниже приведены идентификационные данные владельца веб-сайта.",
    sections: [
      {
        title: "1. Личность владельца веб-сайта",
        text: "Владелец: EKA Balance\nЮридический адрес: [Вставить адрес], Барселона, Испания\nNIF/CIF: [Вставить NIF]\nEmail: legal@ekabalance.com\n\nЗарегистрировано в Торговом реестре Барселоны: [Вставить регистрационные данные]."
      },
      {
        title: "2. Цель веб-сайта",
        text: "Целью данного веб-сайта является предоставление информации о терапевтических услугах, облегчение записи на прием и предоставление ресурсов, связанных с психическим здоровьем и благополучием."
      },
      {
        title: "3. Условия использования",
        text: "Доступ к этому веб-сайту и/или его использование присваивает статус ПОЛЬЗОВАТЕЛЯ, который принимает с момента такого доступа и/или использования Общие условия использования, отраженные здесь. Вышеупомянутые Условия применяются независимо от Общих условий заключения договоров, которые, если применимо, являются обязательными."
      },
      {
        title: "4. Защита данных",
        text: "EKA Balance соблюдает руководящие принципы Органического закона 3/2018 о защите персональных данных и гарантии цифровых прав (LOPDGDD) и Общего регламента по защите данных (GDPR) (ЕС) 2016/679. Для получения дополнительной информации см. нашу Политику конфиденциальности."
      },
      {
        title: "5. Интеллектуальная и промышленная собственность",
        text: "EKA Balance самостоятельно или в качестве правопреемника является владельцем всех прав интеллектуальной и промышленной собственности на свой веб-сайт, а также элементов, содержащихся на нем (включая, помимо прочего, изображения, звук, аудио, видео, программное обеспечение или тексты; товарные знаки или логотипы, цветовые сочетания, структуру и дизайн, выбор используемых материалов, компьютерные программы, необходимые для его работы, доступа и использования и т. д.). Все права защищены."
      },
      {
        title: "6. Исключение гарантий и ответственности",
        text: "EKA Balance ни в коем случае не несет ответственности за ущерб любого характера, который может быть причинен, например: ошибки или упущения в контенте, отсутствие доступности портала или передача вирусов или вредоносных программ в контенте, несмотря на принятие всех необходимых технологических мер для его предотвращения."
      },
      {
        title: "7. Модификации",
        text: "EKA Balance оставляет за собой право вносить без предварительного уведомления изменения, которые она сочтет целесообразными, на своем портале, имея возможность изменять, удалять или добавлять как контент и услуги, предоставляемые через него, так и способ их представления или размещения на своем портале."
      },
      {
        title: "8. Применимое право и юрисдикция",
        text: "Отношения между EKA Balance и ПОЛЬЗОВАТЕЛЕМ регулируются действующим законодательством Испании, и любые споры передаются в суды и трибуналы города Барселоны."
      }
    ]
  }
};

export default function ImprintPage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = content[language];

  return (
    <div className="space-y-8">
      <div className="flex justify-end space-x-2 mb-4">
        <button 
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded text-sm ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage('es')}
          className={`px-3 py-1 rounded text-sm ${language === 'es' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          ES
        </button>
        <button 
          onClick={() => setLanguage('ca')}
          className={`px-3 py-1 rounded text-sm ${language === 'ca' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          CA
        </button>
        <button 
          onClick={() => setLanguage('ru')}
          className={`px-3 py-1 rounded text-sm ${language === 'ru' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          RU
        </button>
      </div>

      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
        <p className="text-gray-500">{t.updated}</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg leading-relaxed text-gray-600 mb-8">
          {t.intro}
        </p>

        {t.sections.map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {section.title}
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {section.text}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
