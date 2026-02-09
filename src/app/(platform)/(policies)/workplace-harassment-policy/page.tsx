'use client';

import React, { useState } from 'react';
import { Ban, Users, MessageCircle, Gavel, HeartHandshake } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function WorkplaceHarassmentPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Workplace Harassment Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to providing a work environment that is free from harassment and discrimination. We have a zero-tolerance policy for any form of harassment based on race, color, religion, sex, national origin, age, disability, or any other protected characteristic.',
      sections: [
        {
          title: '1. Definition of Harassment',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Harassment includes unwelcome conduct that is based on a protected characteristic. This can include offensive jokes, slurs, epithets or name calling, physical assaults or threats, intimidation, ridicule or mockery, insults or put-downs, offensive objects or pictures, and interference with work performance.',
        },
        {
          title: '2. Sexual Harassment',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'Sexual harassment includes unwelcome sexual advances, requests for sexual favors, and other verbal or physical conduct of a sexual nature. This applies to conduct between employees, as well as between employees and clients or other third parties.',
        },
        {
          title: '3. Reporting Procedure',
          icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
          text: 'If you believe you have been subjected to harassment, you should report it immediately to your supervisor, HR department, or through our anonymous reporting channel. All complaints will be investigated promptly and impartially.',
        },
        {
          title: '4. No Retaliation',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'We strictly prohibit retaliation against any individual who reports harassment or participates in an investigation. Retaliation is a serious violation of this policy and will result in disciplinary action.',
        },
        {
          title: '5. Disciplinary Action',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Any employee found to have engaged in harassment will be subject to disciplinary action, up to and including termination of employment. We may also take legal action if appropriate.',
        },
      ],
    },
    es: {
      title: 'Política de Acoso Laboral',
      lastUpdated: 'Última actualización: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a proporcionar un entorno de trabajo libre de acoso y discriminación. Tenemos una política de tolerancia cero para cualquier forma de acoso basado en raza, color, religión, sexo, origen nacional, edad, discapacidad o cualquier otra característica protegida.',
      sections: [
        {
          title: '1. Definición de Acoso',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'El acoso incluye conductas no deseadas basadas en una característica protegida. Esto puede incluir bromas ofensivas, insultos, epítetos o apodos, agresiones físicas o amenazas, intimidación, burlas o mofas, insultos o menosprecios, objetos o imágenes ofensivos e interferencia con el desempeño laboral.',
        },
        {
          title: '2. Acoso Sexual',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'El acoso sexual incluye insinuaciones sexuales no deseadas, solicitudes de favores sexuales y otra conducta verbal o física de naturaleza sexual. Esto se aplica a la conducta entre empleados, así como entre empleados y clientes u otros terceros.',
        },
        {
          title: '3. Procedimiento de Denuncia',
          icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
          text: 'Si cree que ha sido objeto de acoso, debe informarlo de inmediato a su supervisor, al departamento de recursos humanos o a través de nuestro canal de denuncia anónimo. Todas las quejas se investigarán de manera rápida e imparcial.',
        },
        {
          title: '4. No Represalias',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'Prohibimos estrictamente las represalias contra cualquier persona que denuncie acoso o participe en una investigación. Las represalias son una violación grave de esta política y darán lugar a medidas disciplinarias.',
        },
        {
          title: '5. Acción Disciplinaria',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Cualquier empleado que se descubra que ha participado en acoso estará sujeto a medidas disciplinarias, hasta e incluyendo la terminación del empleo. También podemos tomar acciones legales si es apropiado.',
        },
      ],
    },
    ca: {
      title: "Política d'Assetjament Laboral",
      lastUpdated: 'Darrera actualització: 10 de març de 2025',
      intro:
        "EKA Balance es compromet a proporcionar un entorn de treball lliure d'assetjament i discriminació. Tenim una política de tolerància zero per a qualsevol forma d'assetjament basat en raça, color, religió, sexe, origen nacional, edat, discapacitat o qualsevol altra característica protegida.",
      sections: [
        {
          title: "1. Definició d'Assetjament",
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: "L'assetjament inclou conductes no desitjades basades en una característica protegida. Això pot incloure acudits ofensius, insults, epítets o malnoms, agressions físiques o amenaces, intimidació, burles o mofes, insults o menyspreus, objectes o imatges ofensius i interferència amb el rendiment laboral.",
        },
        {
          title: '2. Assetjament Sexual',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: "L'assetjament sexual inclou insinuacions sexuals no desitjades, sol·licituds de favors sexuals i altra conducta verbal o física de naturalesa sexual. Això s'aplica a la conducta entre empleats, així com entre empleats i clients o altres tercers.",
        },
        {
          title: '3. Procediment de Denúncia',
          icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
          text: "Si creieu que heu estat objecte d'assetjament, heu d'informar-ne immediatament al vostre supervisor, al departament de recursos humans o a través del nostre canal de denúncia anònim. Totes les queixes s'investigaran de manera ràpida i imparcial.",
        },
        {
          title: '4. No Represàlies',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: "Prohibim estrictament les represàlies contra qualsevol persona que denunciï assetjament o participi en una investigació. Les represàlies són una violació greu d'aquesta política i donaran lloc a mesures disciplinàries.",
        },
        {
          title: '5. Acció Disciplinària',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: "Qualsevol empleat que es descobreixi que ha participat en assetjament estarà subjecte a mesures disciplinàries, fins i tot la terminació de l'ocupació. També podem emprendre accions legals si és apropiat.",
        },
      ],
    },
    ru: {
      title: 'Политика в отношении домогательств на рабочем месте',
      lastUpdated: 'Последнее обновление: 10 марта 2025 г.',
      intro:
        'EKA Balance стремится обеспечить рабочую среду, свободную от домогательств и дискриминации. У нас действует политика абсолютной нетерпимости к любой форме домогательств на основе расы, цвета кожи, религии, пола, национального происхождения, возраста, инвалидности или любой другой защищаемой характеристики.',
      sections: [
        {
          title: '1. Определение домогательства',
          icon: <Ban className="h-6 w-6 text-red-600" />,
          text: 'Домогательство включает нежелательное поведение, основанное на защищаемой характеристике. Это может включать оскорбительные шутки, оскорбления, эпитеты или обзывания, физические нападения или угрозы, запугивание, насмешки или издевательства, оскорбления или унижения, оскорбительные предметы или изображения, а также вмешательство в выполнение работы.',
        },
        {
          title: '2. Сексуальное домогательство',
          icon: <Users className="h-6 w-6 text-purple-600" />,
          text: 'Сексуальное домогательство включает нежелательные сексуальные домогательства, просьбы о сексуальных услугах и другое словесное или физическое поведение сексуального характера. Это относится к поведению между сотрудниками, а также между сотрудниками и клиентами или другими третьими лицами.',
        },
        {
          title: '3. Процедура подачи жалобы',
          icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
          text: 'Если вы считаете, что подверглись домогательствам, вам следует немедленно сообщить об этом своему руководителю, в отдел кадров или через наш анонимный канал отчетности. Все жалобы будут расследованы быстро и беспристрастно.',
        },
        {
          title: '4. Отсутствие возмездия',
          icon: <HeartHandshake className="h-6 w-6 text-green-600" />,
          text: 'Мы строго запрещаем преследование любого лица, которое сообщает о домогательствах или участвует в расследовании. Возмездие является серьезным нарушением этой политики и повлечет за собой дисциплинарные меры.',
        },
        {
          title: '5. Дисциплинарные меры',
          icon: <Gavel className="h-6 w-6 text-orange-600" />,
          text: 'Любой сотрудник, уличенный в домогательствах, будет подвергнут дисциплинарным мерам, вплоть до увольнения. Мы также можем предпринять юридические действия, если это уместно.',
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
        <div className="bg-linear-to-r from-red-600 to-rose-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Ban className="h-12 w-12 opacity-90" />
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
