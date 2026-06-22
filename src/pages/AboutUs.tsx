/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Target, ShieldCheck, Users, Award } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
      title: "Integrity Above All",
      description: "We hold ourselves to the highest ethical and corporate compliance standards, ensuring transparent interactions with all candidates, clients, and partners."
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Inclusive Innovation",
      description: "Apex believes diversity drives discovery. We maintain equitable pipelines allowing creative, unique technical viewpoints to thrive."
    },
    {
      icon: <Award className="h-6 w-6 text-blue-400" />,
      title: "Professional Craftsmanship",
      description: "Our engineers, systems, and interfaces reject lazy shortcuts. We believe robust code, thoughtful architecture, and clear designs are paramount."
    }
  ];

  return (
    <div className="bg-[#0A192F] min-h-screen py-20 font-sans text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-xs font-black text-blue-400 uppercase tracking-widest font-mono">About Apex Careers</h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
            Empowering Teams, Accelerating Development
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto rounded"></div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#112240] p-8 sm:p-12 rounded-2xl border border-slate-800 shadow-xl mb-16">
          <div className="space-y-6">
            <div className="inline-flex p-3 bg-blue-600/10 text-blue-400 border border-blue-500/10 rounded-xl">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed font-semibold text-xs sm:text-sm">
              To construct secure, elegant, and highly performant technological solutions that bridge corporate capacity with digital demand. We are dedicated to creating fair, rewarding, and deeply transformative employment avenues where global candidates execute exceptional work.
            </p>
          </div>

          <div className="space-y-6">
            <div className="inline-flex p-3 bg-blue-600/10 text-blue-400 border border-blue-500/10 rounded-xl">
              <Target className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed font-semibold text-xs sm:text-sm">
              To remain the globally trusted catalyst for enterprise growth while fostering an offline-first recruitment portal that values candidate dignity, strict security hygiene, and transparent progress reports above administrative overhead.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Corporate Values That Anchor Us</h3>
            <p className="text-slate-400 text-xs uppercase tracking-wide font-bold">
              Our culture is built upon a firm baseline of technical precision, individual growth, and unwavering transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-[#112240] border border-slate-800 p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-blue-600/10 border border-blue-500/10 rounded-xl w-12 h-12 flex items-center justify-center mb-6 text-blue-400">
                  {v.icon}
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-wider mb-2">{v.title}</h4>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing info panel */}
        <div className="bg-[#112240] text-white p-8 sm:p-12 rounded-2xl border border-slate-800 shadow-xl mt-20 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Interested in making an impact?</h3>
          <p className="text-slate-400 max-w-xl mx-auto text-xs uppercase tracking-wide font-bold leading-relaxed">
            We are always reviewing submissions for senior engineering, technical management, architecture, database design, and cloud optimization roles.
          </p>
          <div className="pt-2">
            <a
              href="/apply"
              className="inline-flex bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              See Application Requirements
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
