import type { ServiceItem, PersonalizedServiceItem } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'massage',
    slug: 'massage',
    titleKey: 'services.massage.title',
    subtitleKey: 'services.massage.subtitle',
    descriptionKey: 'services.massage.description',
    image:
      'https://images.pexels.com/photos/6628817/pexels-photo-6628817.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/massage',
    benefitsKeys: [
      'services.massage.benefits.0',
      'services.massage.benefits.1',
      'services.massage.benefits.2',
    ],
    color: 'orange',
  },
  {
    id: 'kinesiology',
    slug: 'kinesiology',
    titleKey: 'services.kinesiology.title',
    subtitleKey: 'services.kinesiology.subtitle',
    descriptionKey: 'services.kinesiology.description',
    image:
      'https://images.pexels.com/photos/6628700/pexels-photo-6628700.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/kinesiology',
    benefitsKeys: [
      'services.kinesiology.benefits.0',
      'services.kinesiology.benefits.1',
      'services.kinesiology.benefits.2',
    ],
    color: 'blue',
  },
  {
    id: 'nutrition',
    slug: 'nutrition',
    titleKey: 'services.nutrition.title',
    subtitleKey: 'services.nutrition.subtitle',
    descriptionKey: 'services.nutrition.description',
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/nutrition',
    benefitsKeys: [
      'services.nutrition.benefits.0',
      'services.nutrition.benefits.1',
      'services.nutrition.benefits.2',
    ],
    color: 'green',
  },
  {
    id: 'revision360',
    slug: 'revision-360',
    titleKey: 'services.revision360.title',
    subtitleKey: 'services.revision360.subtitle',
    descriptionKey: 'services.revision360.description',
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/revision-360',
    benefitsKeys: [
      'services.revision360.benefits.0',
      'services.revision360.benefits.1',
      'services.revision360.benefits.2',
    ],
    color: 'purple',
  },
];

export const PERSONALIZED_SERVICES_DATA: PersonalizedServiceItem[] = [
  {
    id: 'office-workers',
    titleKey: 'services.officeWorkers.title',
    descriptionKey: 'services.officeWorkers.description',
    image:
      'https://images.pexels.com/photos/4050308/pexels-photo-4050308.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/office-workers',
    benefitsKeys: ['services.officeWorkers.benefits.0', 'services.officeWorkers.benefits.1'],
    duration: '60 min',
  },
  {
    id: 'athletes',
    titleKey: 'services.athletes.title',
    descriptionKey: 'services.athletes.description',
    image:
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/athletes',
    benefitsKeys: ['services.athletes.benefits.0', 'services.athletes.benefits.1'],
    duration: '60 min',
  },
  {
    id: 'artists',
    titleKey: 'services.artists.title',
    descriptionKey: 'services.artists.description',
    image:
      'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/services/artists',
    benefitsKeys: ['services.artists.benefits.0', 'services.artists.benefits.1'],
    duration: '60 min',
  },
];
