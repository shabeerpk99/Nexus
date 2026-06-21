import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign, Calendar, Video, Share2, FileText, Settings, ChevronDown, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen((current) => !current);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // User dashboard route based on role
  const dashboardRoute = user?.role === 'entrepreneur' 
    ? '/dashboard/entrepreneur' 
    : '/dashboard/investor';
  
  // User profile route based on role and ID
  const profileRoute = user 
    ? `/profile/${user.role}/${user.id}` 
    : '/login';
  
  const navLinks = [
    {
      icon: user?.role === 'entrepreneur' ? <Building2 size={18} /> : <CircleDollarSign size={18} />,
      text: 'Dashboard',
      path: dashboardRoute,
      tourId: 'dashboard-link',
    },
    {
      icon: <Calendar size={18} />,
      text: 'Calendar',
      path: user ? '/calendar' : '/login',
    },
    {
      icon: <MessageCircle size={18} />,
      text: 'Messages',
      path: user ? '/messages' : '/login',
      tourId: 'messages-link',
    },
    {
      icon: <Video size={18} />,
      text: 'Video Call',
      path: user ? '/video' : '/login',
    },
    {
      icon: <Share2 size={18} />,
      text: 'Document Chamber',
      path: user ? '/documents/chamber' : '/login',
    },
    {
      icon: <Wallet size={18} />,
      text: 'Payments',
      path: user ? '/payments' : '/login',
      tourId: 'payments-link',
    },
    {
      icon: <Bell size={18} />,
      text: 'Notifications',
      path: user ? '/notifications' : '/login',
    }
  ];
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" data-tour="brand" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Business Nexus</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:ml-6 md:flex-1 md:min-w-0 md:justify-between">
            {user ? (
              <>
                <div className="flex flex-1 min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap pr-2">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      data-tour={link.tourId}
                      className="inline-flex flex-shrink-0 items-center gap-2 min-w-max rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
                    >
                      <span className="shrink-0">{link.icon}</span>
                      <span className="text-sm font-medium">{link.text}</span>
                    </Link>
                  ))}
                </div>

                <div ref={profileRef} className="relative flex items-center flex-shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={toggleProfileMenu}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      size="sm"
                      status={user.isOnline ? 'online' : 'offline'}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <Link
                        to={profileRoute}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} />
                        View profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? 'online' : 'offline'}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      data-tour={link.tourId}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link 
                  to="/login" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link 
                  to="/register" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button fullWidth>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};