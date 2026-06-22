/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, Shield, Cpu, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const highlights = [
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Diverse & Elite Teams",
      description: "Collaborate with industry-leading experts and engineers on high-impact projects."
    },
    {
      icon: <Cpu className="h-6 w-6 text-blue-400" />,
      title: "Latest Deep Tech",
      description: "Work with modern frameworks, artificial intelligence systems, and robust cloud scaling."
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "Vigilant Compliance",
      description: "Secure, global employment frameworks built around employee career progression paths."
    }
  ];

  return (
    <div className="bg-[#0A192F] min-h-screen font-sans text-slate-300">
      {/* Hero Section */}
      <section className="bg-[#0A192F] text-white relative overflow-hidden py-24 sm:py-32 border-b border-slate-900">
        {/* Abstract subtle mesh/pattern in background */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/30 px-3 py-1.5 rounded-full text-[10px] text-blue-400 font-extrabold tracking-widest uppercase"
              >
                <Star className="h-3 w-3 fill-blue-400 text-blue-400 mr-1" />
                <span>Now Interviewing for Q3 Openings</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tighter uppercase leading-[0.95] text-white"
              >
                Engineer Your Future <br />
                With <span className="text-blue-400">Apex Careers</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base text-slate-400 leading-relaxed max-w-2xl font-medium"
              >
                Join an elite collective of innovators. We provide exceptional benefits, global work permissions, structured mentorship, and long-term career growth in leading technology and operations sectors.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                >
                  Apply Online Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[#112240] border border-slate-850 text-slate-400 hover:text-white px-6 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  Learn Our Mission
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              {/* Premium abstract card mesh */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-[#112240] border border-slate-800 rounded-2xl p-8 relative shadow-2xl"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-bl-xl rounded-tr-xl tracking-widest uppercase">
                  HR-PORTAL
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">Application Milestones</h3>
                <div className="space-y-6">
                  {[
                    { step: "01", label: "Fast Form Submission", desc: "Submit your details and upload a PDF CV safely in 2 minutes." },
                    { step: "02", label: "Automated Verification", desc: "System files cataloging and profile preparation for HR review." },
                    { step: "03", label: "Expert panel call", desc: "Interactive interview mapping with technical domain heads." },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <span className="font-mono text-xs text-blue-400 font-black bg-blue-900/30 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/10">
                        {s.step}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{s.label}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* About Brief Section */}
      <section className="py-24 bg-[#0A192F]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest font-mono">Who We Are</h2>
            <h3 className="text-3xl sm:text-4xl font-sans font-black text-white uppercase tracking-tighter leading-tight">
              An Industry-Leading Enterprise Focused on Sustainable Innovation
            </h3>
            <div className="h-1 w-16 bg-blue-600 mx-auto rounded"></div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold uppercase tracking-wide pt-2">
              At Apex enterprises, we establish global technological systems that scale businesses, drive insights, and expand user engagement safely. We build cohesive, distributed platforms emphasizing privacy compliance and engineering integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-[#112240] border border-slate-800 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-blue-500/10">
                  {item.icon}
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-wider mb-2 font-sans">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action / Value Proposition Panel */}
      <section className="bg-[#112240] text-white py-24 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">Ready to Advance Your Professional Career?</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wide max-w-2xl mx-auto leading-relaxed font-bold">
            Fill out our standardized, secure application form to make your credentials immediately available to our talent acquisition team. No logins required, just immediate high-impact delivery.
          </p>
          <div className="pt-2">
            <Link
              to="/apply"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 hover:scale-105 duration-200"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 pt-6">
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-1.5" /> Full GDPR Compliance</span>
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-1.5" /> Fast Review within 48 Hours</span>
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-400 mr-1.5" /> Encrypted Cloud Credentials</span>
          </div>
        </div>
      </section>
    </div>
  );
}
