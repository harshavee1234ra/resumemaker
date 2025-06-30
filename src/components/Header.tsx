import React, { useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './Auth/AuthModal';
import UserMenu from './Auth/UserMenu';

type View = 'home' | 'dashboard' | 'builder' | 'analyzer' | 'templates' | 'pricing';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, isAuthenticated, loading } = useAuth();

  const publicNavItems = [
    { label: 'Home', view: 'home' as View },
    { label: 'Templates', view: 'templates' as View },
    { label: 'Analyzer', view: 'analyzer' as View },
    { label: 'Pricing', view: 'pricing' as View },
  ];

  const authenticatedNavItems = [
    { label: 'Dashboard', view: 'dashboard' as View },
    { label: 'Builder', view: 'builder' as View },
    { label: 'Templates', view: 'templates' as View },
    { label: 'Analyzer', view: 'analyzer' as View },
  ];

  const activeNavItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onNavigate('dashboard');
  };

  const handleSignOut = () => {
    onNavigate('home');
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResuMaster
              </span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'home')}
            >
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg transition-shadow">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResuMaster
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {activeNavItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    currentView === item.view
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => openAuthModal('signin')}
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <UserMenu 
                  user={user} 
                  onSignOut={handleSignOut}
                  onNavigate={onNavigate}
                />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                {activeNavItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onNavigate(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 text-left text-sm font-medium transition-colors rounded-lg ${
                      currentView === item.view
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button 
                      onClick={() => {
                        openAuthModal('signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 text-sm font-medium"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        openAuthModal('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200">
                    <UserMenu 
                      user={user} 
                      onSignOut={handleSignOut}
                      onNavigate={onNavigate}
                    />
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;