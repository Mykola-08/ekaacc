'use client';

import { notFound } from 'next/navigation';
import { products, getLocalized } from '@/app/(marketing)/agenyz/products';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Tick02Icon,
  Message01Icon,
  Leaf01Icon,
  Clock01Icon,
  ZapIcon,
  ShoppingBag01Icon,
  ShieldIcon,
  MicroscopeIcon,
} from '@hugeicons/core-free-icons';

export default function AgenyzProductContent({ id }: { id: string }) {
  const { language, t } = useLanguage();

  const product = products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());

  if (!product) {
    return notFound();
  }

  const translatedName = getLocalized(product.name, language);
  const translatedDesc = getLocalized(product.longDescription || product.description, language);
  const translatedShortDesc = getLocalized(
    product.shortDescription || product.description,
    language
  );
  const translatedUsage = getLocalized(product.usage, language);

  const rawBenefits =
    product.benefits && product.benefits.length > 0 ? product.benefits : product.features || [];
  const translatedBenefits = rawBenefits.map((b) => getLocalized(b, language));
  const translatedIngredients = (product.ingredients || []).map((i) => getLocalized(i, language));

  const imageUrl =
    product.image ||
    'https://images.pexels.com/photos/3618606/pexels-photo-3618606.jpeg?auto=compress&cs=tinysrgb&w=1200';

  const getStoreUrl = (slug?: string) => {
    if (!slug) return 'https://agenyz.es';
    return `https://agenyz.es/products/${slug}`;
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Mobile CTA */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-lg md:hidden">
        <a
          href={getStoreUrl(product.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-600 h-14 w-full rounded-full text-lg font-semibold text-white"
          >
            {t('agenyz.buyNow') || 'Buy Now'}
          </Button>
        </a>
      </div>

      {/* Back Button */}
      <div className="absolute top-24 left-4 z-20 md:left-8">
        <Link
          href="/agenyz"
          className="group hover: inline-flex items-center rounded-full border border-gray-100 bg-white/80 px-5 py-2.5 text-gray-500 backdrop-blur-md transition-colors hover:text-black"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="mr-2 size-4 transition-transform group-hover:-translate-x-1"
          />
          <span className="text-sm font-semibold tracking-tight">{t('common.back') || 'Back'}</span>
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-48 lg:pb-32">
        <div className='absolute inset-0 bg-[url("/grid.svg")] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-50' />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-1 flex justify-center lg:order-2"
            >
              <div className="group relative aspect-square w-full max-w-lg">
                <div className="bg-primary-100 absolute inset-0 rounded-full opacity-40 blur-[100px] transition-opacity duration-1000 group-hover:opacity-60" />
                <img
                  src={imageUrl}
                  alt={translatedName}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-700 ease-out hover:scale-105"
                />
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute right-0 -bottom-4 z-20 flex items-center gap-4 rounded-[2rem] border border-white/20 bg-white/90 p-5 backdrop-blur-xl md:-right-4 md:bottom-12"
                >
                  <div className="bg-primary-50 text-primary-600 flex h-12 w-12 items-center justify-center rounded-[var(--radius)]">
                    <HugeiconsIcon icon={Leaf01Icon} className="size-6" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                      {t('agenyz.label.type') || 'Type'}
                    </p>
                    <p className="text-sm font-bold tracking-tight text-gray-900">
                      {t('agenyz.label.bioactive') || 'Bio-Active'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 inline-flex items-center rounded-full border border-gray-100 bg-gray-100 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-gray-600 uppercase"
              >
                <HugeiconsIcon icon={ZapIcon} className="text-primary-500 mr-2 size-3" />
                {t(`agenyz.category.${product.category}`) || product.category}{' '}
                {t('agenyz.label.series') || 'Series'}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 text-5xl leading-[0.95] font-semibold tracking-tighter text-gray-900 lg:text-[5rem]"
              >
                {translatedName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10 max-w-xl text-xl leading-relaxed font-medium tracking-tight text-gray-500 md:text-2xl"
              >
                {translatedShortDesc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-12 flex flex-wrap gap-8 border-y border-gray-100 py-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <HugeiconsIcon icon={ShieldIcon} className="size-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gray-900">
                    {t('agenyz.label.dnaProtection') || 'DNA Protection'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                    <HugeiconsIcon icon={MicroscopeIcon} className="size-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gray-900">
                    {t('agenyz.label.labTested') || 'Lab Tested'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50">
                    <HugeiconsIcon icon={ZapIcon} className="size-5 text-yellow-500" />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-gray-900">
                    {t('agenyz.label.highBioavailability') || 'High Bioavailability'}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href={getStoreUrl(product.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="xl"
                    className="bg-primary hover:bg-primary-600 w-full rounded-full px-10 py-7 text-lg font-bold text-white shadow-black/10 transition-all sm:w-auto"
                  >
                    <HugeiconsIcon icon={ShoppingBag01Icon} className="mr-3 size-6" />
                    {t('agenyz.buyNow') || 'Order Now'}
                  </Button>
                </a>
                <Link href="/booking" className="flex-1 sm:flex-none">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full rounded-full border-gray-200 px-10 py-7 text-lg font-bold text-gray-900 transition-all hover:bg-gray-50 sm:w-auto"
                  >
                    <HugeiconsIcon icon={Message01Icon} className="mr-3 size-6" />
                    {t('common.askQuestions') || 'Consult Expert'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS GRID */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-[var(--radius)] border border-gray-100 bg-white p-8 md:p-10">
                <h3 className="mb-6 text-2xl font-light text-gray-900">
                  {t('agenyz.aboutProduct') || 'About the Formula'}
                </h3>
                <div className="prose prose-lg max-w-none leading-relaxed font-light text-gray-600">
                  <p>{translatedDesc}</p>
                </div>
              </div>

              {translatedIngredients.length > 0 && (
                <div className="rounded-[var(--radius)] border border-gray-100 bg-white p-8 md:p-10">
                  <h3 className="mb-8 flex items-center text-2xl font-light text-gray-900">
                    <HugeiconsIcon icon={Leaf01Icon} className="mr-3 size-6 text-green-500" />
                    {t('agenyz.ingredients') || 'Active Interactions'}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {translatedIngredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex items-center rounded-[var(--radius)] border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mr-4 h-2 w-2 rounded-full bg-green-400" />
                        <span className="font-medium text-gray-700">{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="">
              {translatedBenefits.length > 0 && (
                <div className="relative overflow-hidden rounded-[var(--radius)] bg-gradient-to-br from-[#000035] to-[#000060] p-8 text-white">
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
                  <h3 className="relative z-10 mb-6 flex items-center text-xl font-medium">
                    <HugeiconsIcon icon={ZapIcon} className="mr-2 size-5 text-yellow-400" />
                    {t('agenyz.benefits') || 'Key Benefits'}
                  </h3>
                  <ul className="relative z-10">
                    {translatedBenefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm leading-relaxed text-blue-100"
                      >
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className="mt-0.5 mr-3 size-4 flex-shrink-0 text-green-400"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {translatedUsage && (
                <div className="rounded-[var(--radius)] border border-purple-100 bg-purple-50 p-8">
                  <h3 className="mb-4 flex items-center text-lg font-medium text-purple-900">
                    <HugeiconsIcon icon={Clock01Icon} className="mr-2 size-5 text-purple-600" />
                    {t('agenyz.usage') || 'How to Use'}
                  </h3>
                  <p className="leading-relaxed font-light text-purple-800/80">{translatedUsage}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 rounded-[var(--radius)] border border-gray-100 bg-white p-6">
                <div className="p-2 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <HugeiconsIcon icon={ShieldIcon} className="size-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t('agenyz.label.quality') || 'Quality'}
                  </p>
                </div>
                <div className="p-2 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <HugeiconsIcon icon={Leaf01Icon} className="size-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t('agenyz.label.natural') || 'Natural'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
