import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <motion.footer 
      className="bg-black border-t border-white/10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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
                alt={t('revision360.alt.ekaLogo')}
                className="w-12 h-12 object-contain opacity-80"
                whileHover={{ 
                  rotate: 360,
                  opacity: 1
                }}
                transition={{ duration: 0.6 }}
              />
              <div>
                <h3 className="text-xl font-medium text-amber-100/90">
                  EKA Balance
                </h3>
                <p className="text-amber-300/60 text-sm font-light">
                  {t('revision360.footer.brand')}
                </p>
              </div>
            </div>
            
            <p className="text-zinc-400 leading-relaxed font-light">
              {t('revision360.footer.description')}
            </p>
            
            <div 
              className="flex items-center space-x-2 text-amber-200"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm italic">{t('revision360.footer.healingWithIntention')}</span>
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
            <h4 className="text-xl font-semibold text-amber-100">
              {t('revision360.footer.contact')}
            </h4>
            
            <div className="space-y-4">
              <motion.a
                href="https://wa.me/34658867133"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-zinc-300 group"
                whileHover={{ 
                  color: "rgb(252, 211, 77)",
                  x: 5
                }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-5 h-5 text-amber-400 transition-colors duration-200" />
                <span>+34 658 867 133</span>
              </motion.a>
              
              <motion.a
                href="mailto:contact@ekabalance.com"
                className="flex items-center space-x-3 text-zinc-300 group"
                whileHover={{ 
                  color: "rgb(252, 211, 77)",
                  x: 5
                }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 text-amber-400 transition-colors duration-200" />
                <span>contact@ekabalance.com</span>
              </motion.a>
              
              <motion.div
                className="flex items-start space-x-3 text-zinc-300"
                whileHover={{ 
                  color: "rgb(252, 211, 77)"
                }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p>{t('revision360.labels.presentialConsultations')}</p>
                  <p className="text-sm text-zinc-400">{t('revision360.labels.onlineSessionsAvailable')}</p>
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
            <h4 className="text-xl font-semibold text-amber-100">
              {t('revision360.footer.services')}
            </h4>
            
            <div className="space-y-3">
              {[
                t('revision360.services.completeReview'),
                t('revision360.services.reset360'),
                t('revision360.services.mapping360'),
                t('revision360.services.alignment360'),
                t('revision360.services.followUpConsultations')
              ].map((service, index) => (
                <motion.p
                  key={service}
                  className="text-zinc-300 text-sm cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ 
                    color: "rgb(252, 211, 77)",
                    x: 5
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
          className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            <p 
              className="text-zinc-400 text-sm"
            >
              {t('revision360.footer.copyright')}
            </p>
            <LanguageSelector />
          </div>
          
          <motion.div 
            className="flex items-center space-x-2 text-amber-300/80 text-sm"
            transition={{ duration: 0.2 }}
          >
            <span>{t('revision360.footer.madeWith')}</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>{t('revision360.footer.forHealing')}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
