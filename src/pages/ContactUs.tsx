/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, MessageSquare, User, Send, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { saveContactMessage } from '../lib/supabase';
import { motion } from 'motion/react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const tempErrors: Errors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      tempErrors.email = "Please input a valid email address";
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message content is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must contain at least 10 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Remove errors when typing
    if (errors[id as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Save contact message
      await saveContactMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A192F] min-h-screen py-20 font-sans text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h1 className="text-xs font-black text-blue-400 uppercase tracking-widest font-mono">Get In Touch</h1>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">Contact Our Recruitment Team</h2>
          <div className="h-1 bg-blue-600 w-12 mx-auto rounded"></div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-bold leading-relaxed pt-2">
            Have questions regarding our onboarding pipeline, international relocation sponsorships, or open technical job positions? Write to us and we'll reply shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Side Coordinates Details */}
          <div className="lg:col-span-5 space-y-8 bg-[#112240] text-white p-8 rounded-2xl shadow-xl border border-slate-800">
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-sans">Corporate Coordinates</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Apex Careers is operated by Apex Enterprises LLC. Our HR operations office oversees global technical distribution programs.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600/10 border border-blue-500/10 p-2.5 rounded-lg text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Regional HQ Address</h4>
                  <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                    100 Pine Street, Floor 18<br />
                    Financial District, San Francisco, CA 94111
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600/10 border border-blue-500/10 p-2.5 rounded-lg text-blue-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Corporate HR Line</h4>
                  <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                    +1 (415) 555-0190 (Mon - Fri, 9 AM - 5 PM PST)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600/10 border border-blue-500/10 p-2.5 rounded-lg text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Recruitment Dispatch</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono text-blue-300">
                    recruitment@apex-enterprises.com
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 text-[10px] font-mono text-slate-500 leading-relaxed uppercase tracking-widest">
              * Applications submitted directly via the online portal are stored in a dedicated secure database for direct review, bypassing general emails for instant scheduling priority.
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-7 bg-[#112240] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl relative">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="inline-flex items-center justify-center p-4 bg-emerald-950/40 text-emerald-405 border border-emerald-550/30 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Inquiry Sent Successfully</h3>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed font-bold uppercase tracking-wide">
                    Thank you for contacting us. Your message has been logged under GDPR safety standards and forwarded to our HR team. We respond to all valid messages within 1-2 business days.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-black text-blue-400 hover:text-white border border-blue-550/30 hover:border-blue-500 px-5 py-3 rounded-lg transition-all"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      className={`block w-full pl-11 pr-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. Christopher Nolan"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`block w-full pl-11 pr-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. christopher@interstellar.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                    Inquiry Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <textarea
                      id="message"
                      rows={5}
                      className={`block w-full pl-11 pr-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Write your detailed inquiry here..."
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.message && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.message}</p>}
                </div>

                <div>
                  <button
                    id="submit_btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white py-4 px-4 border border-transparent rounded-lg text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting Message...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
