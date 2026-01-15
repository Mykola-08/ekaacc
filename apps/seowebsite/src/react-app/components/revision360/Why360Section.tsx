import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Modal from './Modal';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Sparkles, Layers } from 'lucide-react';

export default function Why360Section() {
  const [showModal, setShowModal] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const { t } = useLanguage();

  const layers = [
    { 
      name: t('why360.layers.physical'), 
      description: t('why360.physical.desc'), 
      color: 'from-amber-500/20 to-yellow-400/20',
      borderColor: 'border-amber-500/30',
      glowColor: 'shadow-amber-500/20',
      iconColor: 'text-amber-400'
    },
    { 
      name: t('why360.layers.structural'), 
      description: t('why360.structural.desc'), 
      color: 'from-yellow-400/20 to-amber-300/20',
      borderColor: 'border-yellow-400/30',
      glowColor: 'shadow-yellow-500/20',
      iconColor: 'text-yellow-300'
    },
    { 
      name: t('why360.layers.emotional'), 
      description: t('why360.emotional.desc'), 
      color: 'from-amber-300/20 to-yellow-200/20',
      borderColor: 'border-amber-300/30',
      glowColor: 'shadow-amber-400/20',
      iconColor: 'text-amber-200'
    },
    { 
      name: t('why360.layers.energetic'), 
      description: t('why360.energetic.desc'), 
      color: 'from-yellow-200/20 to-amber-100/20',
      borderColor: 'border-yellow-300/30',
      glowColor: 'shadow-yellow-400/20',
      iconColor: 'text-yellow-100'
    }
  ];

  return (
    <motion.section 
      ref={ref}
      className="relative py-32 bg-black overflow-hidden"
      style={{ opacity }}
    >
      {/* Deep Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black" />
        <motion.div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: "rgba(245, 158, 11, 0.4)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Complete Integration</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 mb-8 tracking-tight leading-[0.9]">
            {t('why360.title')}
          </h2>
          
          <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            {t('why360.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-20 lg:gap-32">
          {/* Visual Diagram - Ethereal Concentric Circles */}
          <motion.div 
            className="relative w-full max-w-[600px] aspect-square mx-auto xl:mx-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {/* Rotating Rings */}
            {layers.map((layer, index) => {
              const size = 100 - index * 20; // Percentage based sizing
              const isHovered = hoveredLayer === index;
              
              return (
                <motion.div
                  key={layer.name}
                  className={`absolute rounded-full border border-amber-500/10 backdrop-blur-[1px] transition-all duration-500 ${isHovered ? 'border-amber-400/40 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : ''}`}
                  style={{
                    width: `${size}%`,
                    height: `${size}%`,
                    zIndex: 10 - index
                  }}
                  animate={{ 
                    rotate: index % 2 === 0 ? 360 : -360,
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 60 + index * 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.4, ease: "easeOut" }
                  }}
                  onMouseEnter={() => setHoveredLayer(index)}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  {/* Orbital Dot */}
                  <motion.div 
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isHovered ? 'bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-amber-500/30'}`}
                  />
                </motion.div>
              );
            })}
            
            {/* Center Core */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative group cursor-pointer">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl group-hover:bg-amber-500/30 transition-colors duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl group-hover:border-amber-400/50 transition-colors duration-300">
                  <span className="text-4xl font-light text-amber-100">360°</span>
                  <span className="text-[10px] uppercase tracking-widest text-amber-500/80 mt-1">Balance</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Description Cards - Minimalist & Elegant */}
          <div className="flex-1 max-w-xl w-full space-y-4">
            {layers.map((layer, index) => {
              const isHovered = hoveredLayer === index;
              return (
                <motion.div
                  key={layer.name}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-md ${isHovered ? 'bg-card/10 border-amber-500/30' : 'bg-card/5 border-white/10 hover:bg-card/10 hover:border-white/20'}`}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredLayer(index)}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  {/* Hover Glow Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${layer.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative flex items-start gap-5">
                    <div className={`mt-1 p-2 rounded-xl bg-black/40 border border-white/10 ${isHovered ? 'border-amber-500/20' : ''} transition-colors duration-300`}>
                      <Layers className={`w-5 h-5 ${layer.iconColor} opacity-80`} />
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-medium mb-1 transition-colors duration-300 ${isHovered ? 'text-amber-100' : 'text-zinc-200'}`}>
                        {layer.name}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300 font-light">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* CTA Button */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t('why360.philosophy')}
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('why360.modal.title')} size="lg">
        <div className="space-y-8 text-zinc-300 font-light">
          <p className="text-lg leading-relaxed text-zinc-200">
            {t('why360.modal.intro')}
          </p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-normal text-amber-200 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t('why360.modal.integration.title')}
            </h3>
            <p className="leading-relaxed pl-10">
              {t('why360.modal.integration.description')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-normal text-amber-200 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t('why360.modal.dimensions.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
              {layers.map((layer) => (
                <div key={layer.name} className="p-5 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-amber-500/20 transition-colors duration-300">
                  <h4 className={`font-medium mb-2 ${layer.iconColor}`}>{layer.name}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-normal text-amber-200 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t('why360.modal.importance.title')}
            </h3>
            <p className="leading-relaxed pl-10">
              {t('why360.modal.importance.description')}
            </p>
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}


