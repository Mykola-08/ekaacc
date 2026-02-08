'use client';

import { useLanguage } from '@/context/marketing/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/marketing/Accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useLanguage();

  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      id: 'item-2',
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      id: 'item-3',
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      id: 'item-4',
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    },
    {
      id: 'item-5',
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer')
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 text-balance">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed text-sm">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;




