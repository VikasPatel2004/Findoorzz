import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function ResponsiveNavbarWithZoomInHover() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Common classes for nav links and login with zoom in hover effect
  const linkClassNames = 
    "text-black px-3 py-2 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 select-none";

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-opacity duration-300 ${scrollingUp ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-black font-bold text-xl select-none"
              aria-label="Logo"
            >
              <img src={logo} alt="Logo" className="h-30 w-30 mr-2 mt-4" />
            </a>
          </div>

          {/* Right side navigation for Home, Flat, PG, and Login sections */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#home"
              className={linkClassNames}
              aria-label="Home page"
            >
              Home
            </a>
            <a
              href="#flat"
              className={linkClassNames}
              aria-label="Flat section"
            >
              Flat
            </a>
            <a
              href="#pg"
              className={linkClassNames}
              aria-label="PG section"
            >
              PG
            </a>
            <a
              href="#login"
              className={`${linkClassNames} font-semibold border border-black rounded-md transition-all duration-500`}
              aria-label="Login"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f6f0e4'}  // light cream
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Login
            </a>
          </div>

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
            href="#home"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#flat"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Flat
          </a>
          <a
            href="#pg"
            className={`${linkClassNames} block px-4 py-3 border-b border-black`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            PG
          </a>
          <a
            href="#login"
            className={`${linkClassNames} block px-4 py-3 font-semibold border border-black m-3 rounded-md text-center`}
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
