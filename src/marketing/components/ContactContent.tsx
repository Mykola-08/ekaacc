'use client';

import ContactFormOptimized from '@/marketing/components/ContactForm';
import { useLanguage } from '@/marketing/contexts/LanguageContext';

import PageLayout from './PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon } from '@hugeicons/core-free-icons';

export default function ContactContent() {
  const { t } = useLanguage();

  return (
    <>
      <SEOUpdater
        titleKey="seo.contact.title"
        descriptionKey="seo.contact.description"
        keywordsKey="seo.contact.keywords"
      />
      <PageLayout
        hero={{
          title: t('contact.hero.title') || 'Contacta amb nosaltres',
          subtitle:
            t('contact.hero.description') ||
            "Estem aquí per ajudar-te. Envia'ns un missatge i et respondrem el més aviat possible.",
          badge: t('contact.hero.badge') || 'Contacte',
          icon: <HugeiconsIcon icon={Message01Icon} className="size-4"  />,
        }}
      >
        {/* Contact Layout Section */}
        <section className="relative bg-transparent pt-12 pb-24">
          <ContactFormOptimized />
        </section>

        {/* FAQ Section */}
        <FAQ
          title={t('contact.faq.title')}
          subtitle={t('contact.faq.subtitle') || 'Everything you need to know about contacting us'}
          items={[
            { id: '1', question: t('contact.faq.q1.title'), answer: t('contact.faq.q1.answer') },
            { id: '2', question: t('contact.faq.q2.title'), answer: t('contact.faq.q2.answer') },
            { id: '3', question: t('contact.faq.q3.title'), answer: t('contact.faq.q3.answer') },
            { id: '4', question: t('contact.faq.q4.title'), answer: t('contact.faq.q4.answer') },
          ]}
        />
      </PageLayout>
    </>
  );
}
