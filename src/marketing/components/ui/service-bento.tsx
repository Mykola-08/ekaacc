'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface BentoItemProps {
  title: string;
  description: string;
  image?: string;
  details?: React.ReactNode;
  benefits?: string[];
  delay?: number;
  className?: string;
  bookUrl?: string;
  bookText?: string;
  readMoreUrl?: string;
  readMoreText?: string;
}

export function ServiceBentoItem({
  title,
  description,
  image,
  details,
  benefits,
  delay = 0,
  className = '',
  bookUrl,
  bookText = 'Book Now',
  readMoreUrl,
  readMoreText = 'Full details',
}: BentoItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { lock, unlock } = useScrollLock({ autoLock: false });
  useEffect(() => {
    if (isOpen) lock();
    else unlock();
  }, [isOpen, lock, unlock]);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative h-full w-full ${className}`}
      >
        <button
          onClick={() => setIsOpen(true)}
          onMouseMove={handleMouseMove}
          className="group border-secondary/50 relative isolate flex h-full min-h-[420px] w-full flex-col justify-end overflow-hidden rounded-[2.5rem] border bg-background text-left transition-all duration-500 will-change-transform outline-none active:scale-[0.98]"
        >
          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px z-[60] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(255,255,255,0.4),
                  transparent 40%
                )
              `,
            }}
          />

          {/* Background Image */}
          {image ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={image}
                fill
                alt={title}
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
          )}

          <div className="relative z-10 flex h-full w-full flex-col justify-end p-8 sm:p-10">
            <motion.div className="transform pr-16 transition-transform duration-500 group-hover:-translate-y-2 md:pr-20">
              <h3
                className={`mb-3 text-2xl font-semibold tracking-tight sm:text-3xl ${image ? 'drop- text-white' : 'text-black'}`}
              >
                {title}
              </h3>
              <p
                className={`mt-2 line-clamp-4 text-base leading-relaxed tracking-tight md:line-clamp-none ${image ? 'drop- text-white/95' : 'text-gray-600'}`}
              >
                {description}
              </p>
              {benefits && benefits.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 opacity-90">
                  {benefits.slice(0, 3).map((benefit, i) => (
                    <span
                      key={i}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${image ? 'border-white/30 bg-black/40 text-white' : 'border-gray-200 bg-gray-50 text-gray-700'} backdrop-blur-md`}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
            <div
              className={`group-hover:bg-opacity-100 absolute right-8 bottom-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-active:scale-95 ${image ? 'group-hover:text-primary border-white/40 bg-white/20 text-white group-hover:border-white group-hover:bg-white' : 'border-primary/10 bg-primary/5 text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-white'}`}
            >
              <svg
                className="h-6 w-6 transition-transform duration-500 group-hover:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Modal */}
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {isOpen && (
                <div
                  className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] bg-white sm:h-[80vh] sm:rounded-[2.5rem]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Mobile draggable indicator */}
                    <div className="absolute top-0 z-30 flex w-full justify-center py-2 sm:hidden">
                      <div className="h-1.5 w-10 rounded-full bg-white/40" />
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl transition-colors hover:bg-black/40 sm:top-5 sm:right-5"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={18}  />
                    </button>

                    <div className="flex h-full w-full flex-col md:flex-row">
                      {image ? (
                        <>
                          <div className="relative flex h-[20vh] w-full shrink-0 flex-col justify-center sm:h-[25vh] sm:justify-end md:h-full md:w-[40%] lg:w-1/2">
                            <Image src={image} fill alt={title} className="object-cover" />
                            <div className="absolute inset-0 bg-black/50 sm:bg-gradient-to-t sm:from-black/90 sm:via-black/40 sm:to-transparent" />
                            <div className="relative z-10 flex h-full w-full flex-col justify-center p-4 text-center sm:justify-end sm:p-5 sm:text-left lg:p-6">
                              <h2 className="drop- mb-1 text-lg leading-tight font-medium tracking-tight text-white sm:mb-2 sm:text-xl md:text-2xl">
                                {title}
                              </h2>

                              {/* Buttons on image for PC */}
                              <div className="mt-2 hidden w-full flex-col gap-2 sm:mt-3 md:flex xl:flex-row">
                                {bookUrl && (
                                  <Link href={bookUrl} className="flex-1">
                                    <span className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-gray-100">
                                      {bookText}
                                    </span>
                                  </Link>
                                )}
                                {readMoreUrl && (
                                  <Link href={readMoreUrl} className="flex-1">
                                    <span className="flex w-full items-center justify-center rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold whitespace-nowrap text-white backdrop-blur-md transition hover:bg-black/60">
                                      {readMoreText} <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1.5 size-3"  />
                                    </span>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="customize-scrollbar flex flex-1 flex-col justify-center overflow-y-auto overscroll-contain bg-white px-4 py-5 sm:p-6">
                            <div className="prose prose-sm mb-0 flex max-w-none flex-1 flex-col justify-center text-gray-600">
                              <p className="mb-4 text-center text-sm leading-relaxed font-normal text-gray-800 sm:text-left sm:text-base">
                                {description}
                              </p>
                              <div className="text-center text-xs sm:text-left">{details}</div>
                            </div>

                            {/* Buttons for Mobile/Tablet */}
                            <div className="mt-4 flex shrink-0 flex-col gap-2 border-t border-gray-100 pt-4 md:hidden">
                              {bookUrl && (
                                <Link href={bookUrl} className="w-full">
                                  <span className="bg-primary hover:bg-primary-600 flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition">
                                    {bookText}
                                  </span>
                                </Link>
                              )}
                              {readMoreUrl && (
                                <Link href={readMoreUrl} className="w-full">
                                  <span className="flex w-full items-center justify-center rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-black transition hover:bg-gray-200">
                                    {readMoreText} <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1.5 size-3"  />
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="customize-scrollbar flex flex-1 flex-col justify-center overflow-y-auto overscroll-contain px-4 py-8 sm:p-8">
                          <h2 className="mb-3 text-center text-xl font-medium tracking-tight text-gray-900 sm:mb-4 sm:text-left sm:text-2xl">
                            {title}
                          </h2>
                          <div className="prose prose-sm mb-4 flex max-w-none flex-1 flex-col justify-center text-center text-gray-600 sm:text-left">
                            <p className="mb-4 text-sm leading-relaxed font-normal text-gray-800 sm:text-base">
                              {description}
                            </p>
                            <div className="text-xs">{details}</div>
                          </div>

                          <div className="mt-4 flex shrink-0 flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                            {bookUrl && (
                              <Link href={bookUrl} className="flex-1">
                                <span className="bg-primary hover:bg-primary-600 flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition">
                                  {bookText}
                                </span>
                              </Link>
                            )}
                            {readMoreUrl && (
                              <Link href={readMoreUrl} className="flex-1">
                                <span className="flex w-full items-center justify-center rounded-full bg-gray-100 px-6 py-3.5 text-base font-medium whitespace-nowrap text-black transition hover:bg-gray-200">
                                  {readMoreText} <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4"  />
                                </span>
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
