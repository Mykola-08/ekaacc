'use client';

import { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';
import { motion } from 'framer-motion';

export function ServiceGrid({ services }: { services: Service[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
  };

  return (
    <motion.div 
      variants={container}
      initial='hidden'
      animate='show'
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full'
    >
      {services.length > 0 ? (
        services.map((service) => (
          <motion.div key={service.id} variants={item} className='h-full flex'>
            <ServiceCard service={service} variant={'default'} />
          </motion.div>
        ))
      ) : (
        <div className='col-span-full text-center py-20 text-muted-foreground bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/20 shadow-xl'>
          No services available at the moment.
        </div>
      )}
    </motion.div>
  );
}

