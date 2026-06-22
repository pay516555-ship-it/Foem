/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Briefcase, Menu, X, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Apply Now', path: '/apply' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <nav className="bg-[#112240] border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">A</div>
              <span className="font-sans font-black text-xl tracking-tight uppercase">Apex<span className="text-blue-400">Careers</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-[#1d2d44] hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/apply"
              className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              Apply Online
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-[#1d2d44] focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#112240]/95 backdrop-blur-md border-b border-slate-800 px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-[#1d2d44] hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2 px-3">
            <Link
              to="/apply"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20"
            >
              Apply Online
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
