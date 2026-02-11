'use client';

import ContactFormOptimized from '@/components/marketing/ContactFormOptimized';
import { MessageCircle, Phone, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Button } from '@/components/ui/button';
import PageLayout from './PageLayout';
import { motion } from 'motion/react';

export default function ContactContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        title: t('contact.hero.title') || 'Contacta amb nosaltres',
        subtitle:
          t('contact.hero.description') ||
          "Estem aquí per ajudar-te. Envia'ns un missatge i et respondrem el més aviat possible.",
        badge: t('contact.hero.badge') || 'Contacte',
        icon: <MessageCircle className="h-4 w-4" />,
      }}
    >
      {/* Quick buttons overlay */}
      <div className="relative z-20 -mt-8 mb-16">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="https://wa.me/34658867133" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="rounded-apple border-none bg-whatsapp px-8 py-4 font-medium text-white normal-case shadow-xl hover:bg-whatsapp-hover"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              {t('contact.whatsapp')}
            </Button>
          </a>
          <a href="tel:+34658867133">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 rounded-apple border-none px-8 py-4 font-medium text-primary-foreground normal-case shadow-xl"
            >
              <Phone className="mr-2 h-6 w-6" />
              {t('contact.callNow')}
            </Button>
          </a>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="relative bg-transparent pb-24">
        <div className="section-container">
          <div className="card rounded-apple-lg mx-auto max-w-2xl border-border/50 bg-card p-6 shadow-2xl sm:p-10">
            <ContactFormOptimized />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-muted py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="mb-12 text-center">
            <div className="text-primary-600 mb-4 inline-flex items-center justify-center rounded-full bg-info/20 p-3">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="heading-2">{t('contact.faq.title')}</h2>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="card p-8 hover:shadow-md"
              >
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {t(`contact.faq.q${i}.title`)}
                </h3>
                <p className="text-body">{t(`contact.faq.q${i}.answer`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
