import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PlusCircle, History, UserCircle, LogOut, BarChart3 } from 'lucide-react';
import golfIcon from '../assets/golf-icon.svg';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard', shortLabel: 'Home' },
    { to: '/add', icon: PlusCircle, label: 'Add Round', shortLabel: 'Add' },
    { to: '/history', icon: History, label: 'History', shortLabel: 'History' },
    { to: '/profile', icon: UserCircle, label: 'Profile', shortLabel: 'Profile' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-50 to-emerald-50/30">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-100 px-4 lg:px-6 h-16 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img src={golfIcon} alt="Golf Icon" className="w-9 h-9 group-hover:scale-105 transition-transform duration-200" />
            <div className="hidden sm:block">
              <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Golf with Dad
              </div>
              <div className="text-xs text-emerald-600/70 -mt-1">Adventures Await</div>
            </div>
          </Link>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                          : 'text-stone-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3 ml-4">
              <button 
                onClick={handleSignOut} 
                className="text-stone-500 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl hover:bg-emerald-50 transition-all duration-200"
                aria-label="Sign out of your account"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              
              <Link 
                to="/profile" 
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-50 transition-all duration-200"
                aria-label={`View profile${userProfile?.displayName ? ` for ${userProfile.displayName}` : ''}`}
              >
                {userProfile?.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt={userProfile.displayName || 'Profile'} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-sm">
                    <UserCircle size={18} className="text-white" />
                  </div>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 relative pb-20 lg:pb-0">
        {children || <Outlet />}
      </main>

      {/* Mobile Bottom Navigation */}
      {currentUser && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-emerald-100 px-4 py-2 z-50" aria-label="Mobile navigation">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${
                      isActive ? 'text-emerald-600 bg-emerald-50' : 'text-stone-500 hover:text-emerald-600'
                    }`
                  }
                  aria-label={item.label}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.shortLabel}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
