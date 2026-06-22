/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, FileCheck, Landmark, Scale } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#0A192F] min-h-screen py-20 font-sans text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header decoration */}
        <div className="bg-[#112240] border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 text-blue-400">
            <ShieldCheck className="h-8 w-8" />
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Candidate Privacy Policy</h1>
          </div>
          <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Last Updated: June 21, 2026 | Directive 2016/679 (GDPR)</p>
          <div className="h-px bg-slate-800 w-full" />

          {/* Intro description */}
          <div className="prose prose-slate max-w-none space-y-6 text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            <p>
              Apex Careers (“We”, “Us”, or “Our”) is committed to protecting the privacy, confidentiality, and integrity of the personal data submitted by candidates and job seekers (“You” or “Applicants”). This document explains how we collect, process, and protect your information when you register, apply, and upload your CV through our Job Application Portal.
            </p>

            {/* Structured Card Grid for data usage info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
              <div className="p-5 border border-slate-800 rounded-xl bg-[#1d2d44] space-y-2">
                <FileCheck className="h-5 w-5 text-blue-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">What We Collect</h4>
                <p className="text-xs text-slate-400 leading-normal font-medium">
                  Identifiable information including full names, physical addresses, passport credentials, gender markers, blood groups, and technical curricula vitae (CVs in PDF format).
                </p>
              </div>
              <div className="p-5 border border-slate-800 rounded-xl bg-[#1d2d44] space-y-2">
                <Scale className="h-5 w-5 text-blue-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">GDPR Compliance Basis</h4>
                <p className="text-xs text-slate-400 leading-normal font-medium">
                  Data processing is conducted strictly under Article 6(1)(b) – necessary in pre-contractual steps at the request of the data subject (your explicit application).
                </p>
              </div>
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-wide pt-4">1. Detailed Data Collection Notice</h3>
            <p>
              During your application process, we collect and store:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Contact Coordinates:</strong> Temporary and Permanent residential addresses.</li>
              <li><strong>Personal Metrics:</strong> Age (minimum threshold 18, maximum 60, as mandated for insurance and physical relocation compliance) and gender selection.</li>
              <li><strong>Proof of Identity:</strong> Passport numbers to initiate visa, background checks, and travel clearance workflows.</li>
              <li><strong>Medical/Safety Indicators:</strong> Blood Group details to immediately register inside the hazardous-workspace emergency logs and medical benefits files.</li>
              <li><strong>Professional Experience:</strong> Self-declared work history, duration labels, and specific sector capabilities.</li>
              <li><strong>Uploaded Work Files:</strong> Curricula Vitae (CV) in PDF format under 2MB, containing direct academic and historical project summaries.</li>
            </ul>

            <h3 className="text-sm font-black text-white uppercase tracking-wide pt-4">2. How Personal Data is Secured & Processed</h3>
            <p>
              Your candidate data is submitted through secure HTTPS channels. Depending on deployment configurations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Cloud Storage:</strong> Data is pushed via encrypted pipelines to secure Postgres schemas and sandboxed storage buckets hosted on Supabase.</li>
              <li><strong>Access Restrictions:</strong> Database records are strictly guarded. Only authenticated recruitment personnel using verified systems can view personal CV outputs.</li>
              <li><strong>No Third-Party Sales:</strong> We never sell, transfer, rent, or trade applicant credentials to auxiliary advertising agencies. Your data remains solely within our corporate perimeter.</li>
            </ul>

            <h3 className="text-sm font-black text-white uppercase tracking-wide pt-4">3. Retention Periods</h3>
            <p>
              Unsuccessful candidate submissions are purged from our live database records twelve (12) months after the closing of the target role, unless the candidate grants written extension approval, or local labor law dictates alternative preservation of employment applications.
            </p>

            <h3 className="text-sm font-black text-white uppercase tracking-wide pt-4">4. Your legal Rights Under GDPR</h3>
            <p>
              If you reside within the European Economic Area (EEA), you possess the following critical rights under active GDPR rules:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-400">
              <li><strong>Right of Access:</strong> Request a full structured report of all personal records we have cataloged or stored.</li>
              <li><strong>Right to Rectification:</strong> Request corrections to erroneous addresses, incorrect passport letters, or outdated phone credentials.</li>
              <li><strong>Right to Erasure (“Right to be Forgotten”):</strong> Request that our recruitment team immediately delete all database entries and purge your uploaded CV.</li>
              <li><strong>Right to Data Portability:</strong> Obtain a structured, machine-readable export of the inputs you submitted.</li>
            </ol>
            
            <p className="pt-4 text-xs italic text-blue-400 font-mono">
              To exercise any of your data safety rights, please send an inquiry with a proof of identity verification flag directly to our compliance officer at <strong className="hover:underline">privacy@apex-enterprises.com</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
