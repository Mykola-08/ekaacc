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
    title: 'PolÃ­tica de Reembolso y CancelaciÃ³n',
    updated: 'Ãšltima actualizaciÃ³n: 25 de noviembre de 2025',
    intro:
      'En EKA Balance, nos esforzamos por brindar servicios de terapia y bienestar de alta calidad. Entendemos que las circunstancias pueden cambiar y es posible que deba cancelar o reprogramar sus citas. Esta polÃ­tica describe los tÃ©rminos para reembolsos y cancelaciones.',
    sections: [
      {
        title: '1. CancelaciÃ³n de Citas',
        text: 'Puede cancelar o reprogramar su cita hasta 24 horas antes de la hora de inicio programada sin ninguna penalizaciÃ³n. En este caso, recibirÃ¡ un reembolso completo de las tarifas pagadas.',
      },
      {
        title: '2. Cancelaciones TardÃ­as y No PresentaciÃ³n',
        text: 'Las cancelaciones realizadas con menos de 24 horas de antelaciÃ³n a la hora programada de la cita se consideran "Cancelaciones TardÃ­as". Las Cancelaciones TardÃ­as y la falta de asistencia a una cita programada ("No PresentaciÃ³n") no son elegibles para reembolso. Se cobrarÃ¡ la tarifa completa de la sesiÃ³n.',
      },
      {
        title: '3. Derecho de Desistimiento (Consumidores UE)',
        text: 'Si usted es un consumidor en la UniÃ³n Europea, tiene el derecho legal de desistir de un contrato de servicios digitales dentro de los 14 dÃ­as sin dar ninguna razÃ³n. Sin embargo, al reservar una sesiÃ³n para que tenga lugar dentro de este perÃ­odo de 14 dÃ­as, usted solicita expresamente que la prestaciÃ³n del servicio comience durante el perÃ­odo de desistimiento. Si el servicio se presta completamente (es decir, la sesiÃ³n tiene lugar), pierde su derecho de desistimiento.',
      },
      {
        title: '4. Proceso de Reembolso',
        text: 'Los reembolsos aprobados se procesarÃ¡n dentro de los 5-10 dÃ­as hÃ¡biles al mÃ©todo de pago original utilizado para la reserva. Tenga en cuenta que su banco o proveedor de tarjeta de crÃ©dito puede tardar un tiempo adicional en publicar el reembolso en su cuenta.',
      },
      {
        title: '5. Problemas TÃ©cnicos',
        text: 'Si una sesiÃ³n no puede completarse debido a problemas tÃ©cnicos por nuestra parte (por ejemplo, interrupciÃ³n de la plataforma), le ofreceremos la opciÃ³n de un reembolso completo o reprogramar la sesiÃ³n sin costo adicional. Si el problema tÃ©cnico es por su parte (por ejemplo, fallo de conexiÃ³n a internet), se aplica la polÃ­tica de cancelaciÃ³n estÃ¡ndar, pero podemos ofrecer reprogramaciÃ³n a nuestra discreciÃ³n.',
      },
      {
        title: '6. ContÃ¡ctenos',
        text: 'Si tiene alguna pregunta sobre nuestra PolÃ­tica de Reembolso y CancelaciÃ³n, contÃ¡ctenos en support@ekabalance.com.',
      },
    ],
  },
  ca: {
    title: 'PolÃ­tica de Reemborsament i CancelÂ·laciÃ³',
    updated: 'Darrera actualitzaciÃ³: 25 de novembre de 2025',
    intro:
      "A EKA Balance, ens esforcem per oferir serveis de terÃ pia i benestar d'alta qualitat. Entenem que les circumstÃ ncies poden canviar i Ã©s possible que hagi de cancelÂ·lar o reprogramar les seves cites. Aquesta polÃ­tica descriu els termes per a reemborsaments i cancelÂ·lacions.",
    sections: [
      {
        title: '1. CancelÂ·laciÃ³ de Cites',
        text: "Pot cancelÂ·lar o reprogramar la seva cita fins a 24 hores abans de l'hora d'inici programada sense cap penalitzaciÃ³. En aquest cas, rebrÃ  un reemborsament complet de les tarifes pagades.",
      },
      {
        title: '2. CancelÂ·lacions Tardanes i No PresentaciÃ³',
        text: 'Les cancelÂ·lacions realitzades amb menys de 24 hores d\'antelaciÃ³ a l\'hora programada de la cita es consideren "CancelÂ·lacions Tardanes". Les CancelÂ·lacions Tardanes i la falta d\'assistÃ¨ncia a una cita programada ("No PresentaciÃ³") no sÃ³n elegibles per a reemborsament. Es cobrarÃ  la tarifa completa de la sessiÃ³.',
      },
      {
        title: '3. Dret de Desistiment (Consumidors UE)',
        text: "Si vostÃ¨ Ã©s un consumidor a la UniÃ³ Europea, tÃ© el dret legal de desistir d'un contracte de serveis digitals dins dels 14 dies sense donar cap raÃ³. No obstant aixÃ², en reservar una sessiÃ³ perquÃ¨ tingui lloc dins d'aquest perÃ­ode de 14 dies, vostÃ¨ solÂ·licita expressament que la prestaciÃ³ del servei comenci durant el perÃ­ode de desistiment. Si el servei es presta completament (Ã©s a dir, la sessiÃ³ tÃ© lloc), perd el seu dret de desistiment.",
      },
      {
        title: '4. ProcÃ©s de Reemborsament',
        text: 'Els reemborsaments aprovats es processaran dins dels 5-10 dies hÃ bils al mÃ¨tode de pagament original utilitzat per a la reserva. Tingui en compte que el seu banc o proveÃ¯dor de targeta de crÃ¨dit pot trigar un temps addicional a publicar el reemborsament al seu compte.',
      },
      {
        title: '5. Problemes TÃ¨cnics',
        text: "Si una sessiÃ³ no es pot completar a causa de problemes tÃ¨cnics per la nostra part (per exemple, interrupciÃ³ de la plataforma), li oferirem l'opciÃ³ d'un reemborsament complet o reprogramar la sessiÃ³ sense cost addicional. Si el problema tÃ¨cnic Ã©s per la seva part (per exemple, fallada de connexiÃ³ a internet), s'aplica la polÃ­tica de cancelÂ·laciÃ³ estÃ ndard, perÃ² podem oferir reprogramaciÃ³ a la nostra discreciÃ³.",
      },
      {
        title: "6. Contacti'ns",
        text: "Si tÃ© alguna pregunta sobre la nostra PolÃ­tica de Reemborsament i CancelÂ·laciÃ³, contacti'ns a support@ekabalance.com.",
      },
    ],
  },
  ru: {
    title: 'ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð° Ð¸ Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹',
    updated: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÐµÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ: 25 Ð½Ð¾ÑÐ±Ñ€Ñ 2025 Ð³.',
    intro:
      'Ð’ EKA Balance Ð¼Ñ‹ ÑÑ‚Ñ€ÐµÐ¼Ð¸Ð¼ÑÑ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÑ‚ÑŒ Ð²Ñ‹ÑÐ¾ÐºÐ¾ÐºÐ°Ñ‡ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸ Ñ‚ÐµÑ€Ð°Ð¿Ð¸Ð¸ Ð¸ Ð¾Ð·Ð´Ð¾Ñ€Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ. ÐœÑ‹ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð¾Ð±ÑÑ‚Ð¾ÑÑ‚ÐµÐ»ÑŒÑÑ‚Ð²Ð° Ð¼Ð¾Ð³ÑƒÑ‚ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒÑÑ, Ð¸ Ð²Ð°Ð¼ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð¾Ñ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ½ÐµÑÑ‚Ð¸ Ð²Ð°ÑˆÐ¸ Ð²ÑÑ‚Ñ€ÐµÑ‡Ð¸. Ð­Ñ‚Ð° Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÑ‚ ÑƒÑÐ»Ð¾Ð²Ð¸Ñ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð° Ð¸ Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹.',
    sections: [
      {
        title: '1. ÐžÑ‚Ð¼ÐµÐ½Ð° Ð²ÑÑ‚Ñ€ÐµÑ‡Ð¸',
        text: 'Ð’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ Ð¾Ñ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ½ÐµÑÑ‚Ð¸ Ð²ÑÑ‚Ñ€ÐµÑ‡Ñƒ Ð½Ðµ Ð¿Ð¾Ð·Ð´Ð½ÐµÐµ Ñ‡ÐµÐ¼ Ð·Ð° 24 Ñ‡Ð°ÑÐ° Ð´Ð¾ Ð·Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð½Ð°Ñ‡Ð°Ð»Ð° Ð±ÐµÐ· ÐºÐ°ÐºÐ¸Ñ…-Ð»Ð¸Ð±Ð¾ ÑˆÑ‚Ñ€Ð°Ñ„Ð¾Ð². Ð’ ÑÑ‚Ð¾Ð¼ ÑÐ»ÑƒÑ‡Ð°Ðµ Ð²Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚ ÑƒÐ¿Ð»Ð°Ñ‡ÐµÐ½Ð½Ñ‹Ñ… ÑÐ±Ð¾Ñ€Ð¾Ð².',
      },
      {
        title: '2. ÐŸÐ¾Ð·Ð´Ð½ÑÑ Ð¾Ñ‚Ð¼ÐµÐ½Ð° Ð¸ Ð½ÐµÑÐ²ÐºÐ°',
        text: 'ÐžÑ‚Ð¼ÐµÐ½Ñ‹, ÑÐ´ÐµÐ»Ð°Ð½Ð½Ñ‹Ðµ Ð¼ÐµÐ½ÐµÐµ Ñ‡ÐµÐ¼ Ð·Ð° 24 Ñ‡Ð°ÑÐ° Ð´Ð¾ Ð·Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð²ÑÑ‚Ñ€ÐµÑ‡Ð¸, ÑÑ‡Ð¸Ñ‚Ð°ÑŽÑ‚ÑÑ Â«ÐŸÐ¾Ð·Ð´Ð½Ð¸Ð¼Ð¸ Ð¾Ñ‚Ð¼ÐµÐ½Ð°Ð¼Ð¸Â». ÐŸÐ¾Ð·Ð´Ð½Ð¸Ðµ Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹ Ð¸ Ð½ÐµÑÐ²ÐºÐ° Ð½Ð° Ð·Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½ÑƒÑŽ Ð²ÑÑ‚Ñ€ÐµÑ‡Ñƒ (Â«ÐÐµÑÐ²ÐºÐ°Â») Ð½Ðµ Ð¿Ð¾Ð´Ð»ÐµÐ¶Ð°Ñ‚ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñƒ. Ð’Ð·Ð¸Ð¼Ð°ÐµÑ‚ÑÑ Ð¿Ð¾Ð»Ð½Ð°Ñ ÑÑ‚Ð¾Ð¸Ð¼Ð¾ÑÑ‚ÑŒ ÑÐµÐ°Ð½ÑÐ°.',
      },
      {
        title: '3. ÐŸÑ€Ð°Ð²Ð¾ Ð½Ð° Ð¾Ñ‚ÐºÐ°Ð· (ÐŸÐ¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»Ð¸ Ð•Ð¡)',
        text: 'Ð•ÑÐ»Ð¸ Ð²Ñ‹ ÑÐ²Ð»ÑÐµÑ‚ÐµÑÑŒ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÐµÐ¼ Ð² Ð•Ð²Ñ€Ð¾Ð¿ÐµÐ¹ÑÐºÐ¾Ð¼ Ð¡Ð¾ÑŽÐ·Ðµ, Ñƒ Ð²Ð°Ñ ÐµÑÑ‚ÑŒ Ð·Ð°ÐºÐ¾Ð½Ð½Ð¾Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð¾Ñ‚ÐºÐ°Ð·Ð°Ñ‚ÑŒÑÑ Ð¾Ñ‚ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ€Ð° Ð½Ð° Ñ†Ð¸Ñ„Ñ€Ð¾Ð²Ñ‹Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 14 Ð´Ð½ÐµÐ¹ Ð±ÐµÐ· Ð¾Ð±ÑŠÑÑÐ½ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½. ÐžÐ´Ð½Ð°ÐºÐ¾, Ð±Ñ€Ð¾Ð½Ð¸Ñ€ÑƒÑ ÑÐµÐ°Ð½Ñ, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð´Ð¾Ð»Ð¶ÐµÐ½ ÑÐ¾ÑÑ‚Ð¾ÑÑ‚ÑŒÑÑ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ ÑÑ‚Ð¾Ð³Ð¾ 14-Ð´Ð½ÐµÐ²Ð½Ð¾Ð³Ð¾ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð°, Ð²Ñ‹ Ð¿Ñ€ÑÐ¼Ð¾ Ð¿Ñ€Ð¾ÑÐ¸Ñ‚Ðµ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð° Ð¾Ñ‚ÐºÐ°Ð·Ð°. Ð•ÑÐ»Ð¸ ÑƒÑÐ»ÑƒÐ³Ð° Ð¿Ð¾Ð»Ð½Ð¾ÑÑ‚ÑŒÑŽ Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð° (Ñ‚.Ðµ. ÑÐµÐ°Ð½Ñ ÑÐ¾ÑÑ‚Ð¾ÑÐ»ÑÑ), Ð²Ñ‹ Ñ‚ÐµÑ€ÑÐµÑ‚Ðµ Ð¿Ñ€Ð°Ð²Ð¾ Ð½Ð° Ð¾Ñ‚ÐºÐ°Ð·.',
      },
      {
        title: '4. ÐŸÑ€Ð¾Ñ†ÐµÑÑ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð°',
        text: 'ÐžÐ´Ð¾Ð±Ñ€ÐµÐ½Ð½Ñ‹Ðµ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ñ‹ Ð±ÑƒÐ´ÑƒÑ‚ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ñ‹ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 5-10 Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ñ… Ð´Ð½ÐµÐ¹ Ð½Ð° Ð¸ÑÑ…Ð¾Ð´Ð½Ñ‹Ð¹ ÑÐ¿Ð¾ÑÐ¾Ð± Ð¾Ð¿Ð»Ð°Ñ‚Ñ‹, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð´Ð»Ñ Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ. ÐžÐ±Ñ€Ð°Ñ‚Ð¸Ñ‚Ðµ Ð²Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ, Ñ‡Ñ‚Ð¾ Ð²Ð°ÑˆÐµÐ¼Ñƒ Ð±Ð°Ð½ÐºÑƒ Ð¸Ð»Ð¸ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÑƒ ÐºÑ€ÐµÐ´Ð¸Ñ‚Ð½Ð¾Ð¹ ÐºÐ°Ñ€Ñ‚Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿Ð¾Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ñ‚ÑŒÑÑ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð´Ð»Ñ Ð·Ð°Ñ‡Ð¸ÑÐ»ÐµÐ½Ð¸Ñ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð° Ð½Ð° Ð²Ð°Ñˆ ÑÑ‡ÐµÑ‚.',
      },
      {
        title: '5. Ð¢ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹',
        text: 'Ð•ÑÐ»Ð¸ ÑÐµÐ°Ð½Ñ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½ Ð¸Ð·-Ð·Ð° Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ñ Ð½Ð°ÑˆÐµÐ¹ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, ÑÐ±Ð¾Ð¹ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹), Ð¼Ñ‹ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶Ð¸Ð¼ Ð²Ð°Ð¼ Ð²Ñ‹Ð±Ð¾Ñ€: Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚ ÑÑ€ÐµÐ´ÑÑ‚Ð² Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ½Ð¾Ñ ÑÐµÐ°Ð½ÑÐ° Ð±ÐµÐ· Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð·Ð°Ñ‚Ñ€Ð°Ñ‚. Ð•ÑÐ»Ð¸ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ð° Ð²Ð¾Ð·Ð½Ð¸ÐºÐ»Ð° Ñ Ð²Ð°ÑˆÐµÐ¹ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, ÑÐ±Ð¾Ð¹ Ð¸Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚-ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ñ), Ð¿Ñ€Ð¸Ð¼ÐµÐ½ÑÐµÑ‚ÑÑ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ð°Ñ Ð¿Ð¾Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹, Ð½Ð¾ Ð¼Ñ‹ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶Ð¸Ñ‚ÑŒ Ð¿ÐµÑ€ÐµÐ½Ð¾Ñ Ð¿Ð¾ Ð½Ð°ÑˆÐµÐ¼Ñƒ ÑƒÑÐ¼Ð¾Ñ‚Ñ€ÐµÐ½Ð¸ÑŽ.',
      },
      {
        title: '6. Ð¡Ð²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°Ð¼Ð¸',
        text: 'Ð•ÑÐ»Ð¸ Ñƒ Ð²Ð°Ñ ÐµÑÑ‚ÑŒ ÐºÐ°ÐºÐ¸Ðµ-Ð»Ð¸Ð±Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ð¾ Ð½Ð°ÑˆÐµÐ¹ ÐŸÐ¾Ð»Ð¸Ñ‚Ð¸ÐºÐµ Ð²Ð¾Ð·Ð²Ñ€Ð°Ñ‚Ð° Ð¸ Ð¾Ñ‚Ð¼ÐµÐ½Ñ‹, ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ð½Ð°Ð¼Ð¸ Ð¿Ð¾ Ð°Ð´Ñ€ÐµÑÑƒ support@ekabalance.com.',
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
          className={`rounded px-3 py-1 text-sm ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`rounded px-3 py-1 text-sm ${language === 'es' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('ca')}
          className={`rounded px-3 py-1 text-sm ${language === 'ca' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          CA
        </button>
        <button
          onClick={() => setLanguage('ru')}
          className={`rounded px-3 py-1 text-sm ${language === 'ru' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'}`}
        >
          RU
        </button>
      </div>

      <div className="border-b pb-6">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">{t.title}</h1>
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
