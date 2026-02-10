'use client';

import React, { useState } from 'react';
import { Shield, Lock, EyeOff, UserMinus, AlertCircle } from 'lucide-react';

type Language = 'en' | 'es' | 'ca' | 'ru';

export default function ChildrensPrivacyPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: "Children's Privacy Policy",
      lastUpdated: 'Last Updated: March 10, 2025',
      intro:
        'EKA Balance is committed to protecting the privacy of children. This policy explains our practices regarding the collection, use, and disclosure of personal information from children under the age of 13 (or applicable age in your jurisdiction).',
      sections: [
        {
          title: "1. No Collection of Children's Data",
          icon: <UserMinus className="h-6 w-6 text-red-600" />,
          text: 'We do not knowingly collect, use, or disclose personal information from children under the age of 13. If you believe that we have collected personal information from a child under the age of 13, please contact us immediately.',
        },
        {
          title: '2. Parental Consent',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'In the event that we discover we have collected information from a child without parental consent, we will delete that information as quickly as possible. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
        },
        {
          title: '3. Age Restrictions',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Our services are intended for a general audience and are not directed to children. Users must be at least 18 years old to register for an account. Any account found to be created by a child will be terminated.',
        },
        {
          title: '4. Third-Party Services',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: "We do not allow third-party advertising networks to collect information about children on our site. We carefully vet our service providers to ensure they comply with applicable children's privacy laws.",
        },
        {
          title: '5. Contact for Parents',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'If you are a parent or guardian and believe your child has provided us with personal information, please contact our Privacy Officer at privacy@eka-balance.com to request deletion.',
        },
      ],
    },
    es: {
      title: 'PolÃ­tica de Privacidad para NiÃ±os',
      lastUpdated: 'Ãšltima actualizaciÃ³n: 10 de marzo de 2025',
      intro:
        'EKA Balance se compromete a proteger la privacidad de los niÃ±os. Esta polÃ­tica explica nuestras prÃ¡cticas con respecto a la recopilaciÃ³n, el uso y la divulgaciÃ³n de informaciÃ³n personal de niÃ±os menores de 13 aÃ±os (o la edad aplicable en su jurisdicciÃ³n).',
      sections: [
        {
          title: '1. No RecopilaciÃ³n de Datos de NiÃ±os',
          icon: <UserMinus className="h-6 w-6 text-red-600" />,
          text: 'No recopilamos, utilizamos ni divulgamos a sabiendas informaciÃ³n personal de niÃ±os menores de 13 aÃ±os. Si cree que hemos recopilado informaciÃ³n personal de un niÃ±o menor de 13 aÃ±os, contÃ¡ctenos de inmediato.',
        },
        {
          title: '2. Consentimiento de los Padres',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'En el caso de que descubramos que hemos recopilado informaciÃ³n de un niÃ±o sin el consentimiento de los padres, eliminaremos esa informaciÃ³n lo mÃ¡s rÃ¡pido posible. Alentamos a los padres y tutores a observar, participar y/o monitorear y guiar su actividad en lÃ­nea.',
        },
        {
          title: '3. Restricciones de Edad',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Nuestros servicios estÃ¡n destinados a una audiencia general y no estÃ¡n dirigidos a niÃ±os. Los usuarios deben tener al menos 18 aÃ±os para registrarse en una cuenta. Cualquier cuenta que se descubra que ha sido creada por un niÃ±o serÃ¡ cancelada.',
        },
        {
          title: '4. Servicios de Terceros',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'No permitimos que las redes publicitarias de terceros recopilen informaciÃ³n sobre niÃ±os en nuestro sitio. Examinamos cuidadosamente a nuestros proveedores de servicios para asegurarnos de que cumplan con las leyes de privacidad infantil aplicables.',
        },
        {
          title: '5. Contacto para Padres',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'Si usted es padre o tutor y cree que su hijo nos ha proporcionado informaciÃ³n personal, comunÃ­quese con nuestro Oficial de Privacidad en privacy@eka-balance.com para solicitar la eliminaciÃ³n.',
        },
      ],
    },
    ca: {
      title: 'PolÃ­tica de Privacitat per a Menors',
      lastUpdated: 'Darrera actualitzaciÃ³: 10 de marÃ§ de 2025',
      intro:
        "EKA Balance es compromet a protegir la privacitat dels menors. Aquesta polÃ­tica explica les nostres prÃ ctiques pel que fa a la recopilaciÃ³, l'Ãºs i la divulgaciÃ³ d'informaciÃ³ personal de menors de 13 anys (o l'edat aplicable a la vostra jurisdicciÃ³).",
      sections: [
        {
          title: '1. No RecopilaciÃ³ de Dades de Menors',
          icon: <UserMinus className="h-6 w-6 text-red-600" />,
          text: "No recopilem, utilitzem ni divulguem conscientment informaciÃ³ personal de menors de 13 anys. Si creieu que hem recopilat informaciÃ³ personal d'un menor de 13 anys, poseu-vos en contacte amb nosaltres immediatament.",
        },
        {
          title: '2. Consentiment dels Pares',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: "En el cas que descobrim que hem recopilat informaciÃ³ d'un menor sense el consentiment dels pares, eliminarem aquesta informaciÃ³ el mÃ©s rÃ pid possible. Encoratgem els pares i tutors a observar, participar i/o supervisar i guiar la seva activitat en lÃ­nia.",
        },
        {
          title: "3. Restriccions d'Edat",
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'Els nostres serveis estan destinats a un pÃºblic general i no estan dirigits a menors. Els usuaris han de tenir almenys 18 anys per registrar-se en un compte. Qualsevol compte que es descobreixi que ha estat creat per un menor serÃ  cancelÂ·lat.',
        },
        {
          title: '4. Serveis de Tercers',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'No permetem que les xarxes publicitÃ ries de tercers recopilin informaciÃ³ sobre menors al nostre lloc. Examinem acuradament els nostres proveÃ¯dors de serveis per assegurar-nos que compleixin amb les lleis de privacitat infantil aplicables.',
        },
        {
          title: '5. Contacte per a Pares',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: "Si sou pare o tutor i creieu que el vostre fill ens ha proporcionat informaciÃ³ personal, poseu-vos en contacte amb el nostre Oficial de Privacitat a privacy@eka-balance.com per solÂ·licitar l'eliminaciÃ³.",
        },
      ],
    },
    ru: {
      title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð´Ð»Ñ Ð´ÐµÑ‚ÐµÐ¹',
      lastUpdated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 10 Ð¼Ð°Ñ€Ñ‚Ð° 2025 Ð³.',
      intro:
        'EKA Balance Ð¾Ð±ÑÐ·ÑƒÐµÑ‚ÑÑ Ð·Ð°Ñ‰Ð¸Ñ‰Ð°Ñ‚ÑŒ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð´ÐµÑ‚ÐµÐ¹. Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð±ÑŠÑÑÐ½ÑÐµÑ‚ Ð½Ð°ÑˆÐ¸ Ð¼ÐµÑ‚Ð¾Ð´Ñ‹ ÑÐ±Ð¾Ñ€Ð°, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸ Ñ€Ð°ÑÐºÑ€Ñ‹Ñ‚Ð¸Ñ Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð´ÐµÑ‚ÐµÐ¹ Ð² Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ðµ Ð´Ð¾ 13 Ð»ÐµÑ‚ (Ð¸Ð»Ð¸ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ³Ð¾ Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð° Ð² Ð²Ð°ÑˆÐµÐ¹ ÑŽÑ€Ð¸ÑÐ´Ð¸ÐºÑ†Ð¸Ð¸).',
      sections: [
        {
          title: '1. ÐžÑ‚ÑÑƒÑ‚ÑÑ‚Ð²Ð¸Ðµ ÑÐ±Ð¾Ñ€Ð° Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¾ Ð´ÐµÑ‚ÑÑ…',
          icon: <UserMinus className="h-6 w-6 text-red-600" />,
          text: 'ÐœÑ‹ ÑÐ¾Ð·Ð½Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð½Ðµ ÑÐ¾Ð±Ð¸Ñ€Ð°ÐµÐ¼, Ð½Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð¸ Ð½Ðµ Ñ€Ð°ÑÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð´ÐµÑ‚ÐµÐ¹ Ð² Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ðµ Ð´Ð¾ 13 Ð»ÐµÑ‚. Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ Ð¼Ñ‹ ÑÐ¾Ð±Ñ€Ð°Ð»Ð¸ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ñ€ÐµÐ±ÐµÐ½ÐºÐ° Ð² Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ðµ Ð´Ð¾ 13 Ð»ÐµÑ‚, Ð½ÐµÐ¼ÐµÐ´Ð»ÐµÐ½Ð½Ð¾ ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°Ð¼Ð¸.',
        },
        {
          title: '2. Ð¡Ð¾Ð³Ð»Ð°ÑÐ¸Ðµ Ñ€Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¹',
          icon: <Shield className="h-6 w-6 text-primary" />,
          text: 'Ð’ ÑÐ»ÑƒÑ‡Ð°Ðµ, ÐµÑÐ»Ð¸ Ð¼Ñ‹ Ð¾Ð±Ð½Ð°Ñ€ÑƒÐ¶Ð¸Ð¼, Ñ‡Ñ‚Ð¾ ÑÐ¾Ð±Ñ€Ð°Ð»Ð¸ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¾Ñ‚ Ñ€ÐµÐ±ÐµÐ½ÐºÐ° Ð±ÐµÐ· ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ Ñ€Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¹, Ð¼Ñ‹ ÑƒÐ´Ð°Ð»Ð¸Ð¼ ÑÑ‚Ñƒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ ÐºÐ°Ðº Ð¼Ð¾Ð¶Ð½Ð¾ Ð±Ñ‹ÑÑ‚Ñ€ÐµÐµ. ÐœÑ‹ Ð¿Ñ€Ð¸Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ñ€Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¹ Ð¸ Ð¾Ð¿ÐµÐºÑƒÐ½Ð¾Ð² Ð½Ð°Ð±Ð»ÑŽÐ´Ð°Ñ‚ÑŒ, ÑƒÑ‡Ð°ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸/Ð¸Ð»Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¸ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ Ð¸Ñ… Ð´ÐµÑÑ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð² Ð˜Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚Ðµ.',
        },
        {
          title: '3. Ð’Ð¾Ð·Ñ€Ð°ÑÑ‚Ð½Ñ‹Ðµ Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡ÐµÐ½Ð¸Ñ',
          icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
          text: 'ÐÐ°ÑˆÐ¸ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð¿Ñ€ÐµÐ´Ð½Ð°Ð·Ð½Ð°Ñ‡ÐµÐ½Ñ‹ Ð´Ð»Ñ ÑˆÐ¸Ñ€Ð¾ÐºÐ¾Ð¹ Ð°ÑƒÐ´Ð¸Ñ‚Ð¾Ñ€Ð¸Ð¸ Ð¸ Ð½Ðµ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ñ‹ Ð½Ð° Ð´ÐµÑ‚ÐµÐ¹. ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑÐ¼ Ð´Ð¾Ð»Ð¶Ð½Ð¾ Ð±Ñ‹Ñ‚ÑŒ Ð½Ðµ Ð¼ÐµÐ½ÐµÐµ 18 Ð»ÐµÑ‚ Ð´Ð»Ñ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸ ÑƒÑ‡ÐµÑ‚Ð½Ð¾Ð¹ Ð·Ð°Ð¿Ð¸ÑÐ¸. Ð›ÑŽÐ±Ð°Ñ ÑƒÑ‡ÐµÑ‚Ð½Ð°Ñ Ð·Ð°Ð¿Ð¸ÑÑŒ, ÑÐ¾Ð·Ð´Ð°Ð½Ð½Ð°Ñ Ñ€ÐµÐ±ÐµÐ½ÐºÐ¾Ð¼, Ð±ÑƒÐ´ÐµÑ‚ Ð°Ð½Ð½ÑƒÐ»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð°.',
        },
        {
          title: '4. Ð¡Ñ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹',
          icon: <EyeOff className="h-6 w-6 text-purple-600" />,
          text: 'ÐœÑ‹ Ð½Ðµ Ñ€Ð°Ð·Ñ€ÐµÑˆÐ°ÐµÐ¼ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ð¼ Ñ€ÐµÐºÐ»Ð°Ð¼Ð½Ñ‹Ð¼ ÑÐµÑ‚ÑÐ¼ ÑÐ¾Ð±Ð¸Ñ€Ð°Ñ‚ÑŒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¾ Ð´ÐµÑ‚ÑÑ… Ð½Ð° Ð½Ð°ÑˆÐµÐ¼ ÑÐ°Ð¹Ñ‚Ðµ. ÐœÑ‹ Ñ‚Ñ‰Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°ÑˆÐ¸Ñ… Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð² ÑƒÑÐ»ÑƒÐ³, Ñ‡Ñ‚Ð¾Ð±Ñ‹ ÑƒÐ±ÐµÐ´Ð¸Ñ‚ÑŒÑÑ, Ñ‡Ñ‚Ð¾ Ð¾Ð½Ð¸ ÑÐ¾Ð±Ð»ÑŽÐ´Ð°ÑŽÑ‚ Ð¿Ñ€Ð¸Ð¼ÐµÐ½Ð¸Ð¼Ñ‹Ðµ Ð·Ð°ÐºÐ¾Ð½Ñ‹ Ð¾ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð´ÐµÑ‚ÐµÐ¹.',
        },
        {
          title: '5. ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚ Ð´Ð»Ñ Ñ€Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¹',
          icon: <Lock className="h-6 w-6 text-green-600" />,
          text: 'Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÐ²Ð»ÑÐµÑ‚ÐµÑÑŒ Ñ€Ð¾Ð´Ð¸Ñ‚ÐµÐ»ÐµÐ¼ Ð¸Ð»Ð¸ Ð¾Ð¿ÐµÐºÑƒÐ½Ð¾Ð¼ Ð¸ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚Ðµ, Ñ‡Ñ‚Ð¾ Ð²Ð°Ñˆ Ñ€ÐµÐ±ÐµÐ½Ð¾Ðº Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð¸Ð» Ð½Ð°Ð¼ Ð»Ð¸Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ, ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°ÑˆÐ¸Ð¼ ÑÐ¾Ñ‚Ñ€ÑƒÐ´Ð½Ð¸ÐºÐ¾Ð¼ Ð¿Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°Ð¼ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ð¿Ð¾ Ð°Ð´Ñ€ÐµÑÑƒ privacy@eka-balance.com, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¸Ðµ.',
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
        <div className="bg-linear-to-r from-pink-500 to-rose-500 px-8 py-12 text-primary-foreground">
          <div className="mb-4 flex items-center gap-4">
            <Shield className="h-12 w-12 opacity-90" />
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
