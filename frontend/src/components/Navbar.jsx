import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileAvatar from './ProfileAvatar';
import { FiHome, FiBell } from 'react-icons/fi';
import { MdOutlineApartment } from 'react-icons/md';
import { PiBedBold } from 'react-icons/pi';
import notificationService from '../services/notificationService';

export default function ResponsiveNavbarWithZoomInHover() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const { user, logout, token } = useContext(AuthContext);

  // Close menu if screen resized larger than mobile breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // ESC closes menu
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.querySelector('.profile-dropdown');
      const profileSection = document.querySelector('.profile-section');
      if (
        profileMenuOpen &&
        dropdown &&
        !dropdown.contains(event.target) &&
        profileSection &&
        !profileSection.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Navigate to the Login route
  const handleLoginClick = () => {
    navigate('/LoginPage'); // Navigate to the Login page
  };

  // Handle logout
  const handleLogoutClick = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  // Handle scroll to show/hide navbar
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch unread notifications count
  useEffect(() => {
    if (user && token) {
      const fetchNotifications = async () => {
        try {
          const notifications = await notificationService.getNotifications(token);
          const unreadCount = notifications.filter(notification => !notification.read).length;
          setUnreadNotifications(unreadCount);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  // Common classes for nav links and login/logout with zoom in hover effect
  const linkClassNames =
    "text-black px-3 py-2 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 select-none flex items-center gap-2 group relative overflow-hidden";

  // Animated nav link for logged-in users
  const AnimatedNavLink = ({ href, children, ariaLabel }) => (
    <a
      href={href}
      className={linkClassNames + " border border-gray-200 rounded-full"}
      aria-label={ariaLabel}
    >
      {/* Animated background fill */}
      <span className="absolute inset-0 bg-amber-200 scale-y-0 origin-bottom transition-transform duration-700 ease-in-out group-hover:scale-y-100 pointer-events-none z-0" />
      {/* Text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </a>
  );

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-opacity transition-transform duration-300 ${scrollingUp ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo */}
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className="text-black font-bold text-xl select-none"
              aria-label="Logo"
            >
              <img src={logo} alt="Logo" className="h-30 w-30 mr-2 mt-4" />
            </a>
          </div>

          {/* Mobile: Profile avatar, Notification bell, Hamburger */}
          <div className="flex items-center md:hidden">
            {user && (
              <>
                {/* Notification bell */}
                <button
                  className="relative group text-black px-2 py-2 flex items-center mr-2"
                  aria-label="Notifications"
                  onClick={() => {
                    navigate('/notifications');
                  }}
                >
                  <FiBell className="text-xl text-black group-hover:text-yellow-600 transition-colors duration-300" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                {/* Profile avatar for mobile */}
                <div
                  className="flex items-center cursor-pointer select-none mr-2"
                  onClick={() => navigate('/profile')}
                >
                  <ProfileAvatar user={user} size="sm" />
                </div>
              </>
            )}
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-black text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <span className="sr-only">Open main menu</span>
              <div className="flex flex-col space-y-1">
                <span className={`block w-6 h-0.5 bg-black`} />
                <span className={`block w-6 h-0.5 bg-black`} />
                <span className={`block w-6 h-0.5 bg-black`} />
              </div>
            </button>
          </div>

          {/* Right side navigation for Home, Flat, PG, and Login/Logout sections */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <AnimatedNavLink href="/" ariaLabel="Home page"><FiHome className=" text-black group-hover:text-yellow-400 transition-colors duration-300" />Home</AnimatedNavLink>
                <AnimatedNavLink href="/pg" ariaLabel="PG section"><PiBedBold className=" text-black group-hover:text-yellow-400 transition-colors duration-300" />PG</AnimatedNavLink>
                <AnimatedNavLink href="/flat" ariaLabel="Flat section"><MdOutlineApartment className=" text-black group-hover:text-yellow-400 transition-colors duration-300" />Flat</AnimatedNavLink>
                {/* Notification Button (laptop only) */}
                <button
                  className={`relative group text-black px-3 py-2 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 select-none flex items-center gap-2 group mr-6`}
                  aria-label="Notifications"
                  onClick={() => {
                    navigate('/notifications');
                  }}
                >
                  <FiBell className="text-xl text-black group-hover:text-yellow-600 transition-colors duration-300" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <a
                  href="/"
                  className={linkClassNames + " hover:text-yellow-600"}
                  aria-label="Home page"
                >
                  <FiHome className="text-xl text-black group-hover:text-yellow-600 transition-colors duration-300" />
                  Home
                </a>
                <a
                  href="/pg"
                  className={linkClassNames + " hover:text-yellow-600"}
                  aria-label="PG section"
                >
                  <PiBedBold className="text-xl text-black group-hover:text-yellow-600 transition-colors duration-300" />
                  PG
                </a>
                <a
                  href="/flat"
                  className={linkClassNames + " hover:text-yellow-600"}
                  aria-label="Flat section"
                >
                  <MdOutlineApartment className="text-xl text-black group-hover:text-yellow-600 transition-colors duration-300" />
                  Flat
                </a>
              </>
            )}
            {!user ? (
              <button
                className={`relative group ${linkClassNames} font-semibold border border-gray-300 rounded-full overflow-hidden`}
                aria-label="Login"
                onClick={handleLoginClick}
              >
                {/* Background fill span */}
                <span className="absolute inset-0 bg-yellow-300 scale-y-0 origin-bottom transition-transform duration-700 ease-in-out group-hover:scale-y-100 pointer-events-none" />
                {/* Text */}
                <span className="relative z-10 text-black">Login</span>
              </button>
            ) : (
              <>
                {/* Profile Section with dropdown */}
                <div className="relative profile-section" >
                  <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => setProfileMenuOpen(prev => !prev)}
                  >
                    <ProfileAvatar user={user} size="sm" />
                  </div>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-amber-100 rounded-xl shadow-lg z-50 profile-dropdown">
                      <button
                        className="block w-full text-left px-4 py-2 rounded-t-xl hover:bg-cyan-50 hover:text-cyan-500 text-gray-700 transition-colors"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/profile');
                        }}
                      >
                        My Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-cyan-50 hover:text-cyan-500 text-gray-700 transition-colors"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate('/edit-profile');
                        }}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 rounded-b-xl hover:bg-red-50 hover:text-red-500 text-red-400 transition-colors"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogoutClick();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu items */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-black"
          role="menu"
          aria-label="Mobile navigation"
        >
          <a
            href="/"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/Flat"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Flat
          </a>
          <a
            href="/Pg"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            PG
          </a>
          {!user ? (
            <button
              className={`${linkClassNames} block px-4 py-3 font-semibold border border-black m-3 rounded-md text-center`}
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                handleLoginClick();
              }}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className={`${linkClassNames} block px-4 py-3 border-b border-black`}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
              >
                My Profile
              </button>
              <button
                className={`${linkClassNames} block px-4 py-3 font-semibold border border-black m-3 rounded-md text-center`}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogoutClick();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
