import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, History, Target, Home, User, LogOut, Settings, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
const logoImage = 'https://placehold.co/400';

interface DesktopSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userName?: string;
  userId?: string;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function DesktopSidebar({ currentView, onNavigate, userName, userId, onLogout, isCollapsed: externalCollapsed, onToggleCollapse }: DesktopSidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapsed = () => {
    setShowProfileMenu(false); // Close menu when collapsing
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book', label: 'Book Session', icon: Calendar },
    { id: 'past', label: 'Past Sessions', icon: History },
    { id: 'goals', label: 'My Goals', icon: Target },
  ];

  const profileMenuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Sign Out', icon: LogOut },
  ];

  const handleProfileMenuClick = (id: string) => {
    setShowProfileMenu(false);
    if (id === 'logout') {
      onLogout();
    } else {
      onNavigate(id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.div
        animate={{ width: isCollapsed ? '5rem' : '18rem' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 shadow-sm z-40"
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-8 z-50 w-6 h-6 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Logo & Branding */}
        <div className={`${isCollapsed ? 'px-3' : 'px-6'} py-6 border-b border-gray-200/60 transition-all`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="EKA Balance Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <h2 className="text-gray-900 whitespace-nowrap truncate">EKA Balance</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap truncate">Wellness Hub</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate(item.id);
                  }}
                  whileHover={{ x: isCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3.5 rounded-xl text-left transition-all group relative ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : ''}`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className={`${isCollapsed ? 'p-3' : 'p-4'} border-t border-gray-200/60`}>
          <div className="relative">
            <motion.button
              onClick={() => {
                if (!isCollapsed) {
                  setShowProfileMenu(!showProfileMenu);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl transition-all group relative`}
              title={isCollapsed ? userName || 'User' : undefined}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 ring-2 ring-white/50">
                <span className="text-xs">{getInitials(userName || 'User')}</span>
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-sm text-gray-900 truncate">{userName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">View profile</p>
                    </motion.div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200/60 overflow-hidden z-50"
                >
                  {profileMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isLast = index === profileMenuItems.length - 1;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleProfileMenuClick(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all text-left ${
                          isLast ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:text-gray-900'
                        } ${index > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Backdrop when menu is open */}
      <AnimatePresence>
        {showProfileMenu && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30 lg:block hidden"
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

