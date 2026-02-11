import React, { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
}

interface PageLayoutProps {
  children: ReactNode;
  hero?: ReactNode | HeroProps;
  className?: string;
}

export default function PageLayout({ children, hero, className }: PageLayoutProps) {
  const isCustomHero = React.isValidElement(hero);

  const renderHero = () => {
    if (!hero) return null;

    if (isCustomHero) {
      return hero;
    }

    const heroProps = hero as HeroProps;

    return (
      <div className="relative overflow-hidden px-6 pt-32 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {heroProps.badge && (
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-info bg-card/80 px-3 py-1 text-sm text-primary shadow-sm backdrop-blur-sm">
              {heroProps.icon}
              <span className="font-medium">{heroProps.badge}</span>
            </div>
          )}
          <h1 className="mb-6 text-5xl leading-tight font-light tracking-tight text-foreground md:text-7xl">
            {heroProps.title}
          </h1>
          {heroProps.subtitle && (
            <p className="mb-8 text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
              {heroProps.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-card ${className || ''}`}>
      {hero && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center opacity-50 [mask-image:linear-gradient(180deg,white,oklch(1 0 0 / 0))]" />
          {renderHero()}
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}
