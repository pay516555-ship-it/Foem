/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Briefcase, Mail, Lock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main_footer" className="bg-[#112240] border-t border-slate-800 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">A</div>
              <span className="font-sans font-black text-base uppercase tracking-wider text-white">Apex<span className="text-blue-400">Careers</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Connecting elite talent with world-class opportunities. Your next career milestone begins with Apex Enterprises.
            </p>
          </div>

          {/* Core Access Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 tracking-widest uppercase font-sans">Corporate</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">Candidate Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Quick Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-200 tracking-widest uppercase font-sans">Contact & Careers</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Send Inquiry</Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-blue-400 transition-colors font-bold text-blue-400">Current Job Openings</Link>
              </li>
              <li className="flex items-center space-x-2 text-xs pt-1 font-mono text-blue-300">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>recruitment@apex-enterprises.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal copyrights & Hidden Admin Access */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono">
          <p className="mb-4 sm:mb-0">
            &copy; {currentYear} Apex Enterprises LLC. All rights reserved. Registered under GDPR compliance guidelines.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:underline hover:text-slate-400">Privacy Notice</Link>
            <span>&bull;</span>
            <Link to="/admin/login" className="flex items-center space-x-1 hover:text-blue-400 transition-colors opacity-65 hover:opacity-100 uppercase tracking-widest font-black text-[9px]">
              <Lock className="h-3 w-3" />
              <span>Staff portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
