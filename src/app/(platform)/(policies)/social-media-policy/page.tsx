'use client';

import React, { useState } from 'react';
import { Share2, MessageCircle, ThumbsUp, Eye, Shield } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function SocialMediaPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'Social Media Policy',
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'This policy outlines the guidelines for employees and associates of EKA Balance when using social media, both professionally and personally, to protect our brand and reputation.',
      sections: [
        {
          title: '1. Professional Use',
          icon: <Share2 className="h-6 w-6 text-primary" />,
          text: 'When using social media on behalf of EKA Balance, employees must be authorized to do so. Content should be professional, accurate, and aligned with our brand values. Confidential information must never be shared.',
        },
        {
          title: '2. Personal Use',
          icon: <ThumbsUp className="h-6 w-6 text-green-600" />,
          text: 'Employees are free to use social media personally. However, they should make it clear that their views are their own and do not represent EKA Balance. Avoid using company logos or trademarks without permission.',
        },
        {
          title: '3. Respect and Conduct',
          icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
          text: 'We expect employees to be respectful and courteous online. Harassment, bullying, discrimination, or hate speech will not be tolerated. Avoid engaging in heated arguments or making disparaging remarks about competitors or colleagues.',
        },
        {
          title: '4. Privacy and Confidentiality',
          icon: <Eye className="h-6 w-6 text-orange-600" />,
          text: 'Protect the privacy of colleagues and customers. Do not post photos or personal information of others without their consent. Never disclose internal company matters, trade secrets, or sensitive data.',
        },
        {
          title: '5. Monitoring and Enforcement',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'EKA Balance reserves the right to monitor public social media activity that may impact the company. Violations of this policy may result in disciplinary action, up to and including termination.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Redes Sociales',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'Esta polÃ­tica describe las pautas para los empleados y asociados de EKA Balance al usar las redes sociales, tanto profesional como personalmente, para proteger nuestra marca y reputaciÃ³n.',
      sections: [
        {
          title: '1. Uso Profesional',
          icon: <Share2 className="h-6 w-6 text-primary" />,
          text: 'Al usar las redes sociales en nombre de EKA Balance, los empleados deben estar autorizados para hacerlo. El contenido debe ser profesional, preciso y estar alineado con los valores de nuestra marca. Nunca se debe compartir informaciÃ³n confidencial.',
        },
        {
          title: '2. Uso Personal',
          icon: <ThumbsUp className="h-6 w-6 text-green-600" />,
          text: 'Los empleados son libres de usar las redes sociales personalmente. Sin embargo, deben dejar claro que sus opiniones son propias y no representan a EKA Balance. Evite usar logotipos o marcas comerciales de la empresa sin permiso.',
        },
        {
          title: '3. Respeto y Conducta',
          icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
          text: 'Esperamos que los empleados sean respetuosos y corteses en lÃ­nea. No se tolerarÃ¡ el acoso, la intimidaciÃ³n, la discriminaciÃ³n o el discurso de odio. Evite participar en discusiones acaloradas o hacer comentarios despectivos sobre competidores o colegas.',
        },
        {
          title: '4. Privacidad y Confidencialidad',
          icon: <Eye className="h-6 w-6 text-orange-600" />,
          text: 'Proteja la privacidad de colegas y clientes. No publique fotos o informaciÃ³n personal de otros sin su consentimiento. Nunca revele asuntos internos de la empresa, secretos comerciales o datos confidenciales.',
        },
        {
          title: '5. Monitoreo y Cumplimiento',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'EKA Balance se reserva el derecho de monitorear la actividad pÃºblica en las redes sociales que pueda afectar a la empresa. Las violaciones de esta polÃ­tica pueden resultar en medidas disciplinarias, incluido el despido.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de Xarxes Socials',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "Aquesta polÃ­tica descriu les directrius per als empleats i associats d'EKA Balance en utilitzar les xarxes socials, tant professionalment com personalment, per protegir la nostra marca i reputaciÃ³.",
      sections: [
        {
          title: '1. Ãšs Professional',
          icon: <Share2 className="h-6 w-6 text-primary" />,
          text: "En utilitzar les xarxes socials en nom d'EKA Balance, els empleats han d'estar autoritzats per fer-ho. El contingut ha de ser professional, precÃ­s i estar alineat amb els valors de la nostra marca. Mai no s'ha de compartir informaciÃ³ confidencial.",
        },
        {
          title: '2. Ãšs Personal',
          icon: <ThumbsUp className="h-6 w-6 text-green-600" />,
          text: "Els empleats sÃ³n lliures d'utilitzar les xarxes socials personalment. No obstant aixÃ², han de deixar clar que les seves opinions sÃ³n prÃ²pies i no representen EKA Balance. Eviteu utilitzar logotips o marques comercials de l'empresa sense permÃ­s.",
        },
        {
          title: '3. Respecte i Conducta',
          icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
          text: "Esperem que els empleats siguin respectuosos i cortesos en lÃ­nia. No es tolerarÃ  l'assetjament, la intimidaciÃ³, la discriminaciÃ³ o el discurs d'odi. Eviteu participar en discussions acalorades o fer comentaris despectius sobre competidors o colÂ·legues.",
        },
        {
          title: '4. Privacitat i Confidencialitat',
          icon: <Eye className="h-6 w-6 text-orange-600" />,
          text: "Protegiu la privacitat de colÂ·legues i clients. No publiqueu fotos o informaciÃ³ personal d'altres sense el seu consentiment. Mai reveleu assumptes interns de l'empresa, secrets comercials o dades confidencials.",
        },
        {
          title: '5. Monitoratge i Compliment',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: "EKA Balance es reserva el dret de monitorar l'activitat pÃºblica a les xarxes socials que pugui afectar l'empresa. Les violacions d'aquesta polÃ­tica poden resultar en mesures disciplinÃ ries, inclÃ²s l'acomiadament.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð² Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ð¸ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÑÐµÑ‚ÐµÐ¹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ñ€ÑƒÐºÐ¾Ð²Ð¾Ð´ÑÑ‰Ð¸Ðµ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿Ñ‹ Ð´Ð»Ñ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð² Ð¸ Ð¿Ð°Ñ€Ñ‚Ð½ÐµÑ€Ð¾Ð² EKA Balance Ð¿Ñ€Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÑÐµÑ‚ÐµÐ¹, ÐºÐ°Ðº Ð² Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ…, Ñ‚Ð°Ðº Ð¸ Ð² Ð»Ð¸Ñ‡Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÑÑ…, Ð´Ð»Ñ Ð·Ð°Ñ‰Ð¸Ñ‚Ñ‹ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð±Ñ€ÐµÐ½Ð´Ð° Ð¸ Ñ€ÐµÐ¿ÑƒÑ‚Ð°Ñ†Ð¸Ð¸.',
      sections: [
        {
          title: '1. ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <Share2 className="h-6 w-6 text-primary" />,
          text: 'ÐŸÑ€Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ð¸ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÑÐµÑ‚ÐµÐ¹ Ð¾Ñ‚ Ð¸Ð¼ÐµÐ½Ð¸ EKA Balance ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ð¸Ð¼ÐµÑ‚ÑŒ Ð½Ð° ÑÑ‚Ð¾ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ. ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¼, Ñ‚Ð¾Ñ‡Ð½Ñ‹Ð¼ Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ñ†ÐµÐ½Ð½Ð¾ÑÑ‚ÑÐ¼ Ð½Ð°ÑˆÐµÐ³Ð¾ Ð±Ñ€ÐµÐ½Ð´Ð°. ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð°Ñ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ Ð½Ð¸ÐºÐ¾Ð³Ð´Ð° Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð° Ñ€Ð°Ð·Ð³Ð»Ð°ÑˆÐ°Ñ‚ÑŒÑÑ.',
        },
        {
          title: '2. Ð›Ð¸Ñ‡Ð½Ð¾Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ðµ',
          icon: <ThumbsUp className="h-6 w-6 text-green-600" />,
          text: 'Ð¡Ð¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð¼Ð¾Ð³ÑƒÑ‚ ÑÐ²Ð¾Ð±Ð¾Ð´Ð½Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¼Ð¸ ÑÐµÑ‚ÑÐ¼Ð¸ Ð² Ð»Ð¸Ñ‡Ð½Ñ‹Ñ… Ñ†ÐµÐ»ÑÑ…. ÐžÐ´Ð½Ð°ÐºÐ¾ Ð¾Ð½Ð¸ Ð´Ð¾Ð»Ð¶Ð½Ñ‹ Ñ‡ÐµÑ‚ÐºÐ¾ Ð´Ð°Ñ‚ÑŒ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, Ñ‡Ñ‚Ð¾ Ð¸Ñ… Ð²Ð·Ð³Ð»ÑÐ´Ñ‹ ÑÐ²Ð»ÑÑŽÑ‚ÑÑ Ð¸Ñ… ÑÐ¾Ð±ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¼Ð¸ Ð¸ Ð½Ðµ Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð»ÑÑŽÑ‚ EKA Balance. Ð˜Ð·Ð±ÐµÐ³Ð°Ð¹Ñ‚Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð»Ð¾Ð³Ð¾Ñ‚Ð¸Ð¿Ð¾Ð² Ð¸Ð»Ð¸ Ñ‚Ð¾Ð²Ð°Ñ€Ð½Ñ‹Ñ… Ð·Ð½Ð°ÐºÐ¾Ð² ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸ Ð±ÐµÐ· Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ñ.',
        },
        {
          title: '3. Ð£Ð²Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð¸ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ',
          icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¸ Ð±ÑƒÐ´ÑƒÑ‚ ÑƒÐ²Ð°Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹ Ð¸ Ð²ÐµÐ¶Ð»Ð¸Ð²Ñ‹ Ð² Ð˜Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚Ðµ. Ð”Ð¾Ð¼Ð¾Ð³Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°, Ð¸Ð·Ð´ÐµÐ²Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð°, Ð´Ð¸ÑÐºÑ€Ð¸Ð¼Ð¸Ð½Ð°Ñ†Ð¸Ñ Ð¸Ð»Ð¸ Ñ€Ð°Ð·Ð¶Ð¸Ð³Ð°Ð½Ð¸Ðµ Ð½ÐµÐ½Ð°Ð²Ð¸ÑÑ‚Ð¸ Ð½ÐµÐ´Ð¾Ð¿ÑƒÑÑ‚Ð¸Ð¼Ñ‹. Ð˜Ð·Ð±ÐµÐ³Ð°Ð¹Ñ‚Ðµ ÑƒÑ‡Ð°ÑÑ‚Ð¸Ñ Ð² Ð¶Ð°Ñ€ÐºÐ¸Ñ… ÑÐ¿Ð¾Ñ€Ð°Ñ… Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ½ÐµÐ±Ñ€ÐµÐ¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð²Ñ‹ÑÐºÐ°Ð·Ñ‹Ð²Ð°Ð½Ð¸Ð¹ Ð¾ ÐºÐ¾Ð½ÐºÑƒÑ€ÐµÐ½Ñ‚Ð°Ñ… Ð¸Ð»Ð¸ ÐºÐ¾Ð»Ð»ÐµÐ³Ð°Ñ….',
        },
        {
          title: '4. ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ',
          icon: <Eye className="h-6 w-6 text-orange-600" />,
          text: 'Ð—Ð°Ñ‰Ð¸Ñ‰Ð°Ð¹Ñ‚Ðµ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ ÐºÐ¾Ð»Ð»ÐµÐ³ Ð¸ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð². ÐÐµ Ð¿ÑƒÐ±Ð»Ð¸ÐºÑƒÐ¹Ñ‚Ðµ Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð¸Ð¸ Ð¸Ð»Ð¸ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð»Ð¸Ñ† Ð±ÐµÐ· Ð¸Ñ… ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ. ÐÐ¸ÐºÐ¾Ð³Ð´Ð° Ð½Ðµ Ñ€Ð°Ð·Ð³Ð»Ð°ÑˆÐ°Ð¹Ñ‚Ðµ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ðµ Ð´ÐµÐ»Ð° ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸, ÐºÐ¾Ð¼Ð¼ÐµÑ€Ñ‡ÐµÑÐºÐ¸Ðµ Ñ‚Ð°Ð¹Ð½Ñ‹ Ð¸Ð»Ð¸ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ.',
        },
        {
          title: '5. ÐœÐ¾Ð½Ð¸Ñ‚Ð¾Ñ€Ð¸Ð½Ð³ Ð¸ Ð¾Ð±ÐµÑÐ¿ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÐ¾Ð±Ð»ÑŽÐ´ÐµÐ½Ð¸Ñ',
          icon: <Shield className="h-6 w-6 text-red-600" />,
          text: 'EKA Balance Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ Ð·Ð° ÑÐ¾Ð±Ð¾Ð¹ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð² ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÑÐµÑ‚ÑÑ…, ÐºÐ¾Ñ‚Ð¾Ñ€Ð°Ñ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ð¾Ð²Ð»Ð¸ÑÑ‚ÑŒ Ð½Ð° ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸ÑŽ. ÐÐ°Ñ€ÑƒÑˆÐµÐ½Ð¸Ðµ ÑÑ‚Ð¾Ð¹ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ¸ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ñ€Ð¸Ð²ÐµÑÑ‚Ð¸ Ðº Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ð°Ñ€Ð½Ð¾Ð¼Ñƒ Ð²Ð·Ñ‹ÑÐºÐ°Ð½Ð¸ÑŽ, Ð²Ð¿Ð»Ð¾Ñ‚ÑŒ Ð´Ð¾ ÑƒÐ²Ð¾Ð»ÑŒÐ½ÐµÐ½Ð¸Ñ.',
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

      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <div className="bg-linear-to-r from-cyan-600 to-blue-600 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Share2 className="h-12 w-12 opacity-90" />
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
