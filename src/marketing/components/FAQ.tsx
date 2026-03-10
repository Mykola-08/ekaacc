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

  const faqItems = items || defaultItems;

  if (faqItems.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="section-container max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            {title || t('faq.title')}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
            {subtitle || t('faq.subtitle')}
          </p>
        </div>

        <div className="border-t border-gray-100">
          <Accordion type="single" collapsible defaultValue="item-1">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-gray-100 px-0">
                <AccordionTrigger className="text-lg sm:text-xl font-medium text-gray-900 hover:text-blue-600 hover:no-underline py-6 text-left transition-colors duration-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-lg leading-relaxed text-gray-500 pb-6 pr-4 font-normal">
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
