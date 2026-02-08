import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/platform/utils/css-utils';
import { ChevronDown, Menu, X, Search, User, Settings, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const premiumNavVariants = cva(
  'relative flex items-center justify-between transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card/80 backdrop-blur-xl border-b border-neutral-200',
        glass: 'bg-card/10 backdrop-blur-xl border-b border-white/20',
        minimal: 'bg-transparent border-b border-neutral-100',
        elevated: 'bg-card shadow-lg shadow-neutral-100/50',
        dark: 'bg-neutral-900 border-b border-neutral-800',
        gradient: 'bg-linear-to-r from-primary-50 to-secondary-50 border-b border-primary-100',
      },
      size: {
        sm: 'px-4 py-3',
        md: 'px-6 py-4',
        lg: 'px-8 py-6',
        xl: 'px-12 py-8',
      },
      sticky: {
        true: 'sticky top-0 z-50',
        false: 'relative',
      },
      rounded: {
        true: 'rounded-b-2xl',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      sticky: true,
      rounded: false,
    },
  }
);

const premiumNavItemVariants = cva(
  'relative flex items-center gap-2 text-sm font-medium transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50',
        primary: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50',
        minimal: 'text-neutral-700 hover:text-neutral-900',
        glass: 'text-white/80 hover:text-white hover:bg-card/10',
        accent: 'text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
      shape: {
        default: 'rounded-lg',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
      active: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'default',
      active: false,
    },
    compoundVariants: [
      {
        variant: 'default',
        active: true,
        className: 'text-primary-600 bg-primary-50',
      },
      {
        variant: 'primary',
        active: true,
        className: 'text-primary-700 bg-primary-100',
      },
      {
        variant: 'glass',
        active: true,
        className: 'text-white bg-card/20',
      },
    ],
  }
);

const premiumNavLogoVariants = cva('flex items-center gap-3 transition-all duration-300', {
  variants: {
    size: {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
    variant: {
      default: 'text-neutral-900',
      glass: 'text-white',
      minimal: 'text-neutral-900',
      elevated: 'text-neutral-900',
      dark: 'text-white',
      gradient: 'text-primary-700',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface PremiumNavProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof premiumNavVariants> {
  logo?: React.ReactNode;
  logoText?: string;
  items?: NavItem[];
  rightItems?: NavItem[];
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  search?: boolean;
  userMenu?: boolean;
  transparent?: boolean;
  scrolled?: boolean;
  onSearch?: (query: string) => void;
  onLogoClick?: () => void;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  dropdown?: NavItem[];
  external?: boolean;
  badge?: string | number;
  active?: boolean;
}

const PremiumNav = React.forwardRef<HTMLElement, PremiumNavProps>(
  (
    {
      className,
      variant,
      size,
      sticky,
      rounded,
      logo,
      logoText = 'Premium',
      items = [],
      rightItems = [],
      mobileBreakpoint = 'lg',
      search = false,
      userMenu = false,
      transparent = false,
      scrolled = false,
      onSearch,
      onLogoClick,
      ...props
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [scrolledState, setScrolledState] = React.useState(scrolled);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

    // Handle scroll effects
    React.useEffect(() => {
      if (transparent) {
        const handleScroll = () => {
          setScrolledState(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }
      return () => {}; // Empty cleanup function
    }, [transparent]);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(searchQuery);
    };

    const handleDropdownToggle = (label: string) => {
      setActiveDropdown(activeDropdown === label ? null : label);
    };

    // Mobile menu toggle
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
        if (activeDropdown) {
          setActiveDropdown(null);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen, activeDropdown]);

    const mobileBreakpointClass = {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    }[mobileBreakpoint];

    const desktopBreakpointClass = {
      sm: 'hidden sm:flex',
      md: 'hidden md:flex',
      lg: 'hidden lg:flex',
      xl: 'hidden xl:flex',
    }[mobileBreakpoint];

    // Determine effective variant based on scroll state
    const effectiveVariant = transparent && !scrolledState ? 'glass' : variant;

    // Map main nav variants to item variants
    const getItemVariant = (mainVariant: string | null | undefined) => {
      if (!mainVariant) return 'default';
      switch (mainVariant) {
        case 'gradient':
        case 'elevated':
          return 'primary';
        case 'dark':
          return 'minimal';
        default:
          return 'default';
      }
    };

    return (
      <nav
        ref={ref}
        className={cn(
          premiumNavVariants({
            variant: effectiveVariant,
            size,
            sticky,
            rounded: scrolledState || rounded,
          }),
          transparent && scrolledState && 'bg-card/90 backdrop-blur-xl',
          className
        )}
        {...props}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <div
            className={cn(
              premiumNavLogoVariants({ size, variant: effectiveVariant }),
              'cursor-pointer select-none'
            )}
            onClick={onLogoClick}
          >
            {logo || (
              <span className="from-primary-600 to-secondary-600 bg-linear-to-r bg-clip-text font-bold text-transparent">
                {logoText}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className={cn(desktopBreakpointClass, 'items-center gap-2')}>
            {items.map((item) => (
              <PremiumNavItem
                key={item.label}
                item={item}
                variant={effectiveVariant}
                active={activeDropdown === item.label}
                onDropdownToggle={() => handleDropdownToggle(item.label)}
              />
            ))}
          </div>

          {/* Right Section */}
          <div className={cn(desktopBreakpointClass, 'items-center gap-2')}>
            {search && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  premiumNavItemVariants({ variant: getItemVariant(effectiveVariant) }),
                  'p-2'
                )}
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {rightItems.map((item) => (
              <PremiumNavItem
                key={item.label}
                item={item}
                variant={effectiveVariant}
                active={activeDropdown === item.label}
                onDropdownToggle={() => handleDropdownToggle(item.label)}
              />
            ))}

            {userMenu && <UserMenu variant={effectiveVariant} />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              premiumNavItemVariants({ variant: getItemVariant(effectiveVariant) }),
              mobileBreakpointClass,
              'p-2'
            )}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Search Bar */}
        {search && isSearchOpen && (
          <div className={cn(desktopBreakpointClass, 'mt-4')}>
            <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="focus:ring-primary-500/20 focus:border-primary-500 w-full rounded-full border border-neutral-200 px-4 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                autoFocus
              />
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={cn(mobileBreakpointClass, 'mt-4 border-t border-inherit pb-4')}>
            <div className="flex flex-col gap-2 pt-4">
              {items.map((item) => (
                <MobileNavItem key={item.label} item={item} variant={effectiveVariant} />
              ))}

              {search && (
                <form onSubmit={handleSearch} className="relative mt-2">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="focus:ring-primary-500/20 focus:border-primary-500 w-full rounded-lg border border-neutral-200 px-4 py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                  />
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                </form>
              )}

              {rightItems.map((item) => (
                <MobileNavItem key={item.label} item={item} variant={effectiveVariant} />
              ))}

              {userMenu && (
                <div className="border-t border-inherit pt-4">
                  <MobileNavItem
                    item={{ label: 'Profile', icon: <User className="h-4 w-4" /> }}
                    variant={effectiveVariant}
                  />
                  <MobileNavItem
                    item={{ label: 'Settings', icon: <Settings className="h-4 w-4" /> }}
                    variant={effectiveVariant}
                  />
                  <MobileNavItem
                    item={{ label: 'Logout', icon: <LogOut className="h-4 w-4" /> }}
                    variant={effectiveVariant}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
);

PremiumNav.displayName = 'PremiumNav';

// Sub-components
const PremiumNavItem = ({
  item,
  variant,
  active,
  onDropdownToggle,
}: {
  item: NavItem;
  variant: any;
  active?: boolean;
  onDropdownToggle?: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.dropdown) {
      setIsDropdownOpen(!isDropdownOpen);
      onDropdownToggle?.();
    } else {
      item.onClick?.();
    }
  };

  const content = (
    <div
      className={cn(premiumNavItemVariants({ variant, active: active || item.active }), 'relative')}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span>{item.label}</span>
      {item.dropdown && <ChevronDown className="h-3 w-3 transition-transform" />}
      {item.badge && (
        <span className="bg-primary-100 text-primary-700 rounded-full px-1.5 py-0.5 text-xs font-medium">
          {item.badge}
        </span>
      )}
      {item.external && <ExternalLink className="h-3 w-3" />}
    </div>
  );

  if (item.href && !item.dropdown) {
    return (
      <Link href={item.href} onClick={item.onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className="relative">
      <div onClick={handleClick}>{content}</div>

      {item.dropdown && isDropdownOpen && (
        <div className="bg-card absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-neutral-200 py-1 shadow-lg">
          {item.dropdown.map((dropdownItem) => (
            <Link
              key={dropdownItem.label}
              href={dropdownItem.href || '#'}
              onClick={dropdownItem.onClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              {dropdownItem.icon && <span className="shrink-0">{dropdownItem.icon}</span>}
              <span>{dropdownItem.label}</span>
              {dropdownItem.external && <ExternalLink className="ml-auto h-3 w-3" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileNavItem = ({ item, variant }: { item: NavItem; variant: any }) => {
  const content = (
    <div className={cn(premiumNavItemVariants({ variant }), 'w-full')}>
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span>{item.label}</span>
      {item.badge && (
        <span className="bg-primary-100 text-primary-700 ml-auto rounded-full px-1.5 py-0.5 text-xs font-medium">
          {item.badge}
        </span>
      )}
      {item.external && <ExternalLink className="ml-auto h-3 w-3" />}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={item.onClick}>
        {content}
      </Link>
    );
  }

  return <div onClick={item.onClick}>{content}</div>;
};

const UserMenu = ({ variant }: { variant: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { label: 'Profile', icon: <User className="h-4 w-4" />, href: '/profile' },
    { label: 'Settings', icon: <Settings className="h-4 w-4" />, href: '/settings' },
    { label: 'Logout', icon: <LogOut className="h-4 w-4" />, onClick: () => console.log('Logout') },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(premiumNavItemVariants({ variant }), 'p-2')}
      >
        <User className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="bg-card absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-neutral-200 py-1 shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href || '#'}
              onClick={() => {
                setIsOpen(false);
                item.onClick?.();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export { PremiumNav, premiumNavVariants, premiumNavItemVariants, premiumNavLogoVariants };
