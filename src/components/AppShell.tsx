import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';
import { MapPin, PlusCircle, History, UserCircle, LogOut } from 'lucide-react';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentUser, userProfile, signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="font-semibold text-lg">
            <span className="text-emerald-500">Golf</span>
            <span> with Dad</span>
          </Link>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => signOut()} 
              className="text-stone-500 hover:text-stone-700 flex items-center gap-1 text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <Link to="/profile" className="flex items-center gap-2">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName || 'Profile'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                  <UserCircle size={20} className="text-stone-500" />
                </div>
              )}
            </Link>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {currentUser && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around items-center h-16 px-2 z-10">
          <Link to="/dashboard" className="flex flex-1 flex-col items-center justify-center py-2 text-stone-600 hover:text-emerald-500">
            <MapPin size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link to="/add" className="flex flex-1 flex-col items-center justify-center py-2 text-stone-600 hover:text-emerald-500">
            <PlusCircle size={20} />
            <span className="text-xs mt-1">Add Round</span>
          </Link>
          <Link to="/history" className="flex flex-1 flex-col items-center justify-center py-2 text-stone-600 hover:text-emerald-500">
            <History size={20} />
            <span className="text-xs mt-1">History</span>
          </Link>
          <Link to="/profile" className="flex flex-1 flex-col items-center justify-center py-2 text-stone-600 hover:text-emerald-500">
            <UserCircle size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </nav>
      )}
    </div>
  );
};
