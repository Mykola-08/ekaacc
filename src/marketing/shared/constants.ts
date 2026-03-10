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
    image: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/massage',
    benefitsKeys: ['services.benefits.reduces', 'services.benefits.stress', 'services.benefits.circulation', 'services.benefits.relaxation'],
    price: 60
  },
  {
    id: 'kinesiologia',
    titleKey: 'services.kinesiology.title',
    subtitleKey: 'services.kinesiology.subtitle',
    descriptionKey: 'services.kinesiology.description',
    iconName: 'Brain',
    color: 'blue',
    durations: [60, 90],
    image: 'https://images.pexels.com/photos/4506105/pexels-photo-4506105.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/kinesiology',
    benefitsKeys: ['services.benefits.blockages', 'services.benefits.posture', 'services.benefits.stress', 'services.benefits.energy'],
    price: 70
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
    price: 60,
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
    image: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/360-revision',
    price: 150,
    benefitsKeys: ['services.benefits.assessment', 'services.benefits.plan', 'services.benefits.recommendations', 'services.benefits.followup']
  }
];

export const PERSONALIZED_SERVICES_DATA: PersonalizedServiceItem[] = [
  {
    id: 'office-workers',
    titleKey: 'personalizedServices.officeWorkers', // Офисные работники
    descriptionKey: 'personalizedServices.officeWorkers.desc',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'blue',
    href: '/services/office-workers',
    benefitsKeys: [
      'personalizedServices.officeWorkers.benefit1', // Relieves neck and back pain
      'personalizedServices.officeWorkers.benefit2', // Improves computer posture
      'personalizedServices.officeWorkers.benefit3'  // Reduces work stress
    ],
    resultKey: 'personalizedServices.officeWorkers.result', // More energy, less pain...
    price: 70,
    duration: '60'
  },
  {
    id: 'athletes',
    titleKey: 'personalizedServices.athletes', // Спортсмены
    descriptionKey: 'personalizedServices.athletes.desc',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'orange',
    href: '/services/athletes',
    benefitsKeys: [
      'personalizedServices.athletes.benefit1', // Muscle recovery
      'personalizedServices.athletes.benefit2', // Injury prevention
      'personalizedServices.athletes.benefit3'  // Optimize performance
    ],
    resultKey: 'personalizedServices.athletes.result', // Faster recovery...
    price: 70,
    duration: '60'
  },
  {
    id: 'artists',
    titleKey: 'personalizedServices.artists',
    descriptionKey: 'personalizedServices.artists.desc',
    image: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'purple',
    href: '/services/artists',
    benefitsKeys: [
        'personalizedServices.artists.benefit1',
        'personalizedServices.artists.benefit2',
        'personalizedServices.artists.benefit3'
    ],
    resultKey: 'personalizedServices.artists.result',
    price: 70,
    duration: '60'
  },
  {
    id: 'musicians',
    titleKey: 'personalizedServices.musicians',
    descriptionKey: 'personalizedServices.musicians.desc',
    image: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'amber',
    href: '/services/musicians',
     benefitsKeys: [
        'personalizedServices.musicians.benefit1',
        'personalizedServices.musicians.benefit2',
        'personalizedServices.musicians.benefit3'
    ],
    resultKey: 'personalizedServices.musicians.result',
    price: 70,
    duration: '60'
  },
  {
    id: 'students',
    titleKey: 'personalizedServices.students',
    descriptionKey: 'personalizedServices.students.desc',
    color: 'green',
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/students',
    benefitsKeys: [
      'personalizedServices.students.benefit1',
      'personalizedServices.students.benefit2',
      'personalizedServices.students.benefit3'
    ],
    resultKey: 'personalizedServices.students.result',
    price: 60,
    duration: '60'
  },
  {
    id: 'parents',
    titleKey: 'personalizedServices.parents',
    descriptionKey: 'personalizedServices.parents.desc',
    color: 'pink',
    image: 'https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/services/parents',
    benefitsKeys: [
      'personalizedServices.parents.benefit1',
      'personalizedServices.parents.benefit2',
      'personalizedServices.parents.benefit3'
    ],
    resultKey: 'personalizedServices.parents.result',
    price: 70,
    duration: '60'
  }
];
