// Service Constants
import { ServiceItem, PersonalizedServiceItem } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'massatge',
    titleKey: 'services.massage.title',
    subtitleKey: 'services.massage.subtitle',
    descriptionKey: 'services.massage.description',
    iconName: 'Heart',
    color: 'orange',
    durations: [60, 90, 120],
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/massage',
    benefitsKeys: ['services.benefits.reduces', 'services.benefits.stress', 'services.benefits.circulation', 'services.benefits.relaxation']
  },
  {
    id: 'kinesiologia',
    titleKey: 'services.kinesiology.title',
    subtitleKey: 'services.kinesiology.subtitle',
    descriptionKey: 'services.kinesiology.description',
    iconName: 'Brain',
    color: 'blue',
    durations: [60, 90],
    image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/kinesiology',
    benefitsKeys: ['services.benefits.blockages', 'services.benefits.posture', 'services.benefits.stress', 'services.benefits.energy']
  },
  {
    id: 'nutritio',
    titleKey: 'services.nutrition.title',
    subtitleKey: 'services.nutrition.subtitle', // Corrected key based on context
    descriptionKey: 'services.nutrition.description',
    iconName: 'Leaf',
    color: 'green',
    durations: [],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/nutrition',
    benefitsKeys: ['services.benefits.habits', 'services.benefits.vitality', 'services.benefits.weight', 'services.benefits.longterm']
  },
  {
    id: 'revisio360',
    titleKey: 'services.revision360.title',
    subtitleKey: 'services.revision360.subtitle',
    descriptionKey: 'services.revision360.description',
    iconName: 'RotateCcw',
    color: 'purple',
    durations: [60, 90, 120],
    image: 'https://images.pexels.com/photos/4099304/pexels-photo-4099304.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/360-revision',
    benefitsKeys: ['services.benefits.assessment', 'services.benefits.plan', 'services.benefits.recommendations', 'services.benefits.followup']
  },
  {
    id: 'suplements',
    titleKey: 'service.supplements.title',
    subtitleKey: 'nutrition.page.subtitle',
    descriptionKey: 'nutrition.page.description',
    iconName: 'Leaf',
    color: 'green',
    durations: [],
    image: 'https://images.pexels.com/photos/8845019/pexels-photo-8845019.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/supplements',
    benefitsKeys: ['services.benefits.vitality', 'services.benefits.habits', 'services.benefits.energy', 'services.benefits.longterm']
  },
  {
    id: 'sistemica',
    titleKey: 'service.systemic.title',
    subtitleKey: 'kinesiology.page.subtitle',
    descriptionKey: 'kinesiology.page.description',
    iconName: 'Heart',
    color: 'pink',
    durations: [],
    image: 'https://images.pexels.com/photos/7176036/pexels-photo-7176036.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/systemic',
    benefitsKeys: ['services.benefits.blockages', 'services.benefits.stress', 'services.benefits.assessment', 'services.benefits.longterm']
  }
];

export const PERSONALIZED_SERVICES_DATA: PersonalizedServiceItem[] = [
  {
    id: 'office-workers',
    titleKey: 'personalizedServices.officeWorkers', // Офисные работники
    descriptionKey: 'personalizedServices.officeWorkers.desc',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
    href: '/services/office-workers',
    benefitsKeys: [
      'personalizedServices.officeWorkers.benefit1', // Relieves neck and back pain
      'personalizedServices.officeWorkers.benefit2', // Improves computer posture
      'personalizedServices.officeWorkers.benefit3'  // Reduces work stress
    ],
    resultKey: 'personalizedServices.officeWorkers.result', // More energy, less pain...
    price: 70,
    duration: '1 h'
  },
  {
    id: 'athletes',
    titleKey: 'personalizedServices.athletes', // Спортсмены
    descriptionKey: 'personalizedServices.athletes.desc',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1920&h=1080&fit=crop',
    href: '/services/athletes',
    benefitsKeys: [
      'personalizedServices.athletes.benefit1', // Muscle recovery
      'personalizedServices.athletes.benefit2', // Injury prevention
      'personalizedServices.athletes.benefit3'  // Optimize performance
    ],
    resultKey: 'personalizedServices.athletes.result', // Faster recovery...
    price: 70,
    duration: '1 h'
  },
  {
    id: 'artists',
    titleKey: 'personalizedServices.artists',
    descriptionKey: 'personalizedServices.artists.desc',
    image: 'https://images.unsplash.com/photo-1599447421405-0c325d26d77e?w=1920&h=1080&fit=crop',
    href: '/services/artists',
    benefitsKeys: [
        'personalizedServices.artists.benefit1',
        'personalizedServices.artists.benefit2',
        'personalizedServices.artists.benefit3'
    ],
    resultKey: 'personalizedServices.artists.result',
    price: 70,
    duration: '1 h'
  },
  {
    id: 'musicians',
    titleKey: 'personalizedServices.musicians',
    descriptionKey: 'personalizedServices.musicians.desc',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop',
    href: '/services/musicians',
     benefitsKeys: [
        'personalizedServices.musicians.benefit1',
        'personalizedServices.musicians.benefit2',
        'personalizedServices.musicians.benefit3'
    ],
    resultKey: 'personalizedServices.musicians.result',
    price: 70,
    duration: '1 h'
  },
  {
    id: 'students',
    titleKey: 'personalizedServices.students',
    descriptionKey: 'personalizedServices.students.desc',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
    href: '/services/students',
    benefitsKeys: [
      'personalizedServices.students.benefit1',
      'personalizedServices.students.benefit2',
      'personalizedServices.students.benefit3'
    ],
    resultKey: 'personalizedServices.students.result',
    price: 60,
    duration: '1 h'
  }
];
