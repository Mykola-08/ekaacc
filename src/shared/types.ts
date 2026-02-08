export interface ServiceItem {
  id: string;
  slug?: string;
  titleKey: string;
  subtitleKey?: string;
  descriptionKey: string;
  image: string;
  href: string;
  benefitsKeys?: string[];
  color?: string;
  price?: number;
  duration?: string;
  active?: boolean;
}

export interface PersonalizedServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  href: string;
  benefitsKeys?: string[];
  resultKey?: string;
  duration?: string;
  price?: number;
  active?: boolean;
}
