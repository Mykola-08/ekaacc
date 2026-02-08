import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <motion.footer
      className="relative overflow-hidden border-t border-white/10 bg-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <motion.img
                src="/images/eka_logo.png"
                alt={t('alt.ekaLogo')}
                className="h-12 w-12 object-contain opacity-80"
                whileHover={{
                  scale: 1.05,
                  rotate: 360,
                  opacity: 1,
                }}
                transition={{ duration: 0.6 }}
              />
              <div>
                <h3 className="text-xl font-medium text-amber-100/90">EKA Balance</h3>
                <p className="text-sm font-light text-amber-300/60">{t('footer.brand')}</p>
              </div>
            </div>

            <p className="leading-relaxed font-light text-zinc-400">{t('footer.description')}</p>

            <div className="flex items-center space-x-2 text-amber-200">
              <Heart className="h-4 w-4" />
              <span className="text-sm italic">{t('footer.healingWithIntention')}</span>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold text-amber-100">{t('footer.contact')}</h4>

            <div className="space-y-4">
              <motion.a
                href="https://wa.me/34658867133"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 text-zinc-300"
                whileHover={{
                  color: 'rgb(252, 211, 77)',
                  x: 5,
                }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="h-5 w-5 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                <span>+34 658 867 133</span>
              </motion.a>

              <motion.a
                href="mailto:info@ekabalance.com"
                className="group flex items-center space-x-3 text-zinc-300"
                whileHover={{
                  color: 'rgb(252, 211, 77)',
                  x: 5,
                }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-5 w-5 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                <span>info@ekabalance.com</span>
              </motion.a>

              <motion.div
                className="flex items-start space-x-3 text-zinc-300"
                whileHover={{
                  color: 'rgb(252, 211, 77)',
                }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <p>{t('labels.presentialConsultations')}</p>
                  <p className="text-sm text-zinc-400">{t('labels.onlineSessionsAvailable')}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold text-amber-100">{t('footer.services')}</h4>

            <div className="space-y-3">
              {[
                t('services.completeReview'),
                t('services.reset360'),
                t('services.mapping360'),
                t('services.alignment360'),
                t('services.followUpConsultations'),
              ].map((service, index) => (
                <motion.p
                  key={service}
                  className="cursor-pointer text-sm text-zinc-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{
                    color: 'rgb(252, 211, 77)',
                    x: 5,
                  }}
                  viewport={{ once: true }}
                >
                  - {service}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-amber-500/20 pt-6 sm:flex-row lg:mt-12 lg:pt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <p className="text-sm text-zinc-400">{t('footer.copyright')}</p>
            <LanguageSelector />
          </div>

          <motion.div
            className="flex items-center space-x-2 text-sm text-amber-300/80"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span>{t('footer.madeWith')}</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>{t('footer.forHealing')}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
