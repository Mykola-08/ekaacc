'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/marketing/components/Accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

const FAQ = ({ items, title, subtitle }: FAQProps) => {
  const { t } = useLanguage();

  const defaultItems: FAQItem[] = [
    {
      id: 'item-1',
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer'),
    },
    {
      id: 'item-2',
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer'),
    },
    {
      id: 'item-3',
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer'),
    },
    {
      id: 'item-4',
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer'),
    },
    {
      id: 'item-5',
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer'),
    },
  ];

  const faqItems = items || defaultItems;

  if (faqItems.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <div className="section-container mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {title || t('faq.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-normal text-gray-500">
            {subtitle || t('faq.subtitle')}
          </p>
        </div>

        <div className="border-t border-gray-100">
          <Accordion type="single" collapsible defaultValue="item-1">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-gray-100 px-0"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-medium text-gray-900 transition-colors duration-200 hover:text-blue-600 hover:no-underline sm:text-xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pr-4 pb-6 text-lg leading-relaxed font-normal text-gray-500">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
