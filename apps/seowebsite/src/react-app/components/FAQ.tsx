'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const { t } = useLanguage();
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer')
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-[20px] overflow-hidden transition-all duration-300 hover:bg-muted"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="text-base font-medium text-foreground pr-4">
                  {item.question}
                </span>
                <div className="shrink-0">
                  {openItem === index ? (
                    <Minus className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-foreground/90 leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

