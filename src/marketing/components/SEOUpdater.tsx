'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';

interface SEOUpdaterProps {
  titleKey: string;
  descriptionKey: string;
  keywordsKey?: string;
}

export default function SEOUpdater({ titleKey, descriptionKey, keywordsKey }: SEOUpdaterProps) {
  const { t, language } = useLanguage();

  useEffect(() => {
    // Update Title
    const title = t(titleKey);
    if (title && title !== titleKey) {
      document.title = title;
    }

    // Update Meta Description
    const desc = t(descriptionKey);
    if (desc && desc !== descriptionKey) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', desc);
      
      // Also update OpenGraph description if present
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', desc);
      }
    }

    // Update Keywords
    if (keywordsKey) {
      const keywords = t(keywordsKey);
      if (keywords && keywords !== keywordsKey) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
      }
    }
  }, [titleKey, descriptionKey, keywordsKey, t, language]);

  return null;
}
