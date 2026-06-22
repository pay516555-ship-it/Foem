/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from 'react';
import { FileDown, FileText, CheckCircle2, UploadCloud, AlertCircle, RefreshCw, Star, Info, Check, Trash2 } from 'lucide-react';
import { saveApplication } from '../lib/supabase';
import { motion } from 'motion/react';

interface FormFields {
  fullName: string;
  temporaryAddress: string;
  permanentAddress: string;
  age: string; // stored as string, parsed to number
  gender: 'Male' | 'Female' | 'Other' | '';
  passportNumber: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | '';
  workExperience: string;
}

interface ValidationErrors {
  fullName?: string;
  temporaryAddress?: string;
  permanentAddress?: string;
  age?: string;
  gender?: string;
  passportNumber?: string;
  bloodGroup?: string;
  workExperience?: string;
  cvFile?: string;
}

export default function ApplyNow() {
  const [fields, setFields] = useState<FormFields>({
    fullName: '',
    temporaryAddress: '',
    permanentAddress: '',
    age: '',
    gender: '',
    passportNumber: '',
    bloodGroup: '',
    workExperience: '',
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [sameAddress, setSameAddress] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFields(prev => {
      const updated = { ...prev, [id]: value };
      // Sync address if sameAddress is ticked and temporaryAddress altered
      if (sameAddress && id === 'temporaryAddress') {
        updated.permanentAddress = value;
      }
      return updated;
    });

    if (errors[id as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSameAddressToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setFields(prev => ({
        ...prev,
        permanentAddress: prev.temporaryAddress
      }));
      setErrors(prev => ({ ...prev, permanentAddress: undefined }));
    }
  };

  /**
   * PDF FILE VALIDATOR
   */
  const handleCVFileValidation = (file: File): boolean => {
    setErrors(prev => ({ ...prev, cvFile: undefined }));
    
    // Check type: We enforce PDF ONLY
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      setErrors(prev => ({
        ...prev,
        cvFile: "Rejected: Only PDF document formats (.pdf) are allowed."
      }));
      setCvFile(null);
      return false;
    }

    // Check size limit: We enforce Max 2MB (2,097,152 bytes)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setErrors(prev => ({
        ...prev,
        cvFile: `Rejected: File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum allowed PDF size is 2MB.`
      }));
      setCvFile(null);
      return false;
    }

    setCvFile(file);
    return true;
  };

  // Handle file select manual click
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleCVFileValidation(selected);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleCVFileValidation(droppedFile);
    }
  };

  const removeCVFile = () => {
    setCvFile(null);
    setErrors(prev => ({ ...prev, cvFile: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerManualClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * FORM SUBMISSION AND VERIFICATION
   */
  const validateForm = (): boolean => {
    const tempErrors: ValidationErrors = {};

    if (!fields.fullName.trim()) {
      tempErrors.fullName = "Candidate full name is required";
    } else if (fields.fullName.trim().length < 3) {
      tempErrors.fullName = "Name must be at least 3 characters long";
    }

    if (!fields.temporaryAddress.trim()) {
      tempErrors.temporaryAddress = "Temporary residential address is required";
    }

    if (!fields.permanentAddress.trim()) {
      tempErrors.permanentAddress = "Permanent residential address is required";
    }

    // Age bounds check: integer 18–60 range
    const parsedAge = parseInt(fields.age, 10);
    if (!fields.age) {
      tempErrors.age = "Candidate age is required";
    } else if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 60) {
      tempErrors.age = "Candidate age must be between 18 and 60 years old";
    }

    if (!fields.gender) {
      tempErrors.gender = "Please select your gender";
    }

    // Passport selection check: alphanumeric, required
    if (!fields.passportNumber.trim()) {
      tempErrors.passportNumber = "Valid passport number is required";
    } else if (!/^[a-z0-9]+$/i.test(fields.passportNumber.trim())) {
      tempErrors.passportNumber = "Passport number must be alphanumeric characters only (no spaces or symbols)";
    }

    if (!fields.bloodGroup) {
      tempErrors.bloodGroup = "Please select your blood group";
    }

    if (!cvFile) {
      tempErrors.cvFile = "Please upload an executable PDF copy of your CV";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedAge = parseInt(fields.age, 10);
      const appData = {
        fullName: fields.fullName,
        temporaryAddress: fields.temporaryAddress,
        permanentAddress: fields.permanentAddress,
        age: parsedAge,
        gender: fields.gender as any,
        passportNumber: fields.passportNumber.toUpperCase().trim(),
        bloodGroup: fields.bloodGroup as any,
        workExperience: fields.workExperience.trim(),
      };

      // Call database wrapper
      await saveApplication(appData, cvFile!);

      // Generate random receipt serial: e.g., APX-91823-74
      const serialPart = Math.floor(10000 + Math.random() * 90000);
      const yearPart = new Date().getFullYear().toString().substring(2);
      setReceiptNumber(`APX-${serialPart}-${yearPart}`);
      
      // Clear states
      setFields({
        fullName: '',
        temporaryAddress: '',
        permanentAddress: '',
        age: '',
        gender: '',
        passportNumber: '',
        bloodGroup: '',
        workExperience: '',
      });
      setCvFile(null);
      setSameAddress(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error on form action:', err);
      setErrors(prev => ({
        ...prev,
        fullName: `Submission failed: ${err.message || 'Server Error. Please retry.'}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };  return (
    <div className="bg-[#0A192F] min-h-screen py-20 font-sans text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h1 className="text-xs font-black text-blue-400 uppercase tracking-widest font-mono">Careers Portal</h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">Structured Job Application</h2>
          <div className="h-1 bg-blue-600 w-12 mx-auto rounded"></div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-bold leading-relaxed pt-2">
            Please fill out all sections carefully. Fields marked with an asterisk (<span className="text-red-500 font-bold">*</span>) are mandatory and checked for legal compliance.
          </p>
        </div>

        {/* Success Card */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#112240] border border-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 text-center space-y-8 animate-fade-in"
          >
            <div className="inline-flex items-center justify-center p-4 bg-emerald-950/40 text-emerald-400 border border-emerald-550/30 rounded-full">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Application Received</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
                Thank you! Your job application files, credentials, and PDF questionnaire have been logged. Our talent matching engine is reviewing your candidacy against active openings.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-[#0A192F] border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Reference Serial Code</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-blue-400 tracking-wider uppercase">
                {receiptNumber}
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div className="flex justify-between text-xs text-slate-450 font-sans">
                <span>Verification State:</span>
                <span className="font-bold text-blue-400 flex items-center uppercase tracking-wider text-[10px]">
                  <Star className="h-3.5 w-3.5 fill-blue-400 mr-1" /> Queued / Pending Review
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
              A copy of this reference code has been indexed with your candidate profile. Please use this tracking serial when inquiring about your schedule status.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setIsSuccess(false)}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-lg shadow-lg transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Submit Another Application
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#112240] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header band */}
            <div className="bg-[#0A192F] px-6 py-5 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="font-sans font-black uppercase tracking-wider text-sm sm:text-base">Candidate Profile File</span>
              </div>
              <span className="text-xs text-blue-400 font-mono tracking-widest uppercase">Standardized Intake</span>
            </div>

            {/* Form Fields */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Section 1: Basic Bio */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">1. Personal Identity Metrics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-8">
                    <label htmlFor="fullName" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. John Albert Smith"
                      value={fields.fullName}
                      onChange={handleInputChange}
                    />
                    {errors.fullName && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.fullName}</p>}
                  </div>

                  {/* Age */}
                  <div className="md:col-span-4">
                    <label htmlFor="age" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Age (18–60) <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="age"
                      type="number"
                      min={18}
                      max={60}
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.age
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. 29"
                      value={fields.age}
                      onChange={handleInputChange}
                    />
                    {errors.age && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.age}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Gender */}
                  <div className="md:col-span-6">
                    <label htmlFor="gender" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Gender Marker <span className="text-red-500 font-bold">*</span>
                    </label>
                    <select
                      id="gender"
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.gender
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-550 focus:border-red-550'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={fields.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Choose Option --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.gender}</p>}
                  </div>

                  {/* Blood Group */}
                  <div className="md:col-span-6">
                    <label htmlFor="bloodGroup" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Blood Group <span className="text-red-500 font-bold">*</span>
                    </label>
                    <select
                      id="bloodGroup"
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.bloodGroup
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-550 focus:border-red-550'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={fields.bloodGroup}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Choose Option --</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodGroup && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.bloodGroup}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Residential Addresses */}
              <div className="space-y-6 pt-2">
                <div className="border-l-4 border-blue-600 pl-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">2. Residential Addresses</h3>
                  <label className="inline-flex items-center text-xs text-slate-400 cursor-pointer font-sans select-none hover:text-white">
                    <input
                      type="checkbox"
                      className="rounded border-slate-800 bg-[#0A192F] text-blue-600 focus:ring-blue-500 mr-2 h-4 w-4"
                      checked={sameAddress}
                      onChange={handleSameAddressToggle}
                    />
                    Permanent same as temporary
                  </label>
                </div>

                <div className="space-y-6">
                  {/* Temporary Address */}
                  <div>
                    <label htmlFor="temporaryAddress" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Temporary Residential Address <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="temporaryAddress"
                      type="text"
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.temporaryAddress
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. Apt 4B, 500 Broadway, New York, NY"
                      value={fields.temporaryAddress}
                      onChange={handleInputChange}
                    />
                    {errors.temporaryAddress && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.temporaryAddress}</p>}
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <label htmlFor="permanentAddress" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Permanent Residential Address <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="permanentAddress"
                      type="text"
                      disabled={sameAddress}
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                        errors.permanentAddress
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. Mother Country Address, General Post Office box..."
                      value={sameAddress ? fields.temporaryAddress : fields.permanentAddress}
                      onChange={handleInputChange}
                    />
                    {errors.permanentAddress && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.permanentAddress}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Professional Credentials */}
              <div className="space-y-6 pt-2">
                <div className="border-l-4 border-blue-600 pl-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">3. Travel & Experience Credentials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Passport Number */}
                  <div className="md:col-span-12">
                    <label htmlFor="passportNumber" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Passport Serial Number (Alphanumeric) <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="passportNumber"
                      type="text"
                      className={`block w-full px-4 py-3 bg-[#0A192F] text-white border rounded-lg text-sm uppercase transition-all focus:outline-none focus:ring-2 ${
                        errors.passportNumber
                          ? 'border-red-500/50 text-red-200 bg-red-950/20 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-805 text-white focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. L9382170A"
                      value={fields.passportNumber}
                      onChange={handleInputChange}
                    />
                    {errors.passportNumber && <p className="mt-2 text-xs text-red-400 font-semibold font-mono">{errors.passportNumber}</p>}
                    <p className="mt-1.5 text-slate-500 text-[10px] font-mono leading-normal uppercase tracking-widest">
                      Must be alphanumeric with no spacing. Required to confirm passport viability limits during global relocation reviews.
                    </p>
                  </div>
                </div>

                {/* Work Experience */}
                <div>
                  <label htmlFor="workExperience" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                    Professional Work Experience Summaries
                  </label>
                  <textarea
                    id="workExperience"
                    rows={4}
                    className="block w-full px-4 py-3 bg-[#0A192F] text-white border border-slate-805 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Briefly state your last roles, code languages, engineering domains, and system architectures managed..."
                    value={fields.workExperience}
                    onChange={handleInputChange}
                  />
                  <p className="mt-1.5 text-slate-500 text-[10px] font-mono leading-normal uppercase tracking-widest">
                    Describe any specific tools, databases (Postgres, SQL), hosting systems, or project timelines completed.
                  </p>
                </div>
              </div>

              {/* Section 4: CV Upload Section */}
              <div className="space-y-6 pt-2">
                <div className="border-l-4 border-blue-600 pl-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white font-mono">4. Curricula Vitae (CV) File</h3>
                </div>

                {/* Drag and Drop Container */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                    Upload PDF Curricula Vitae <span className="text-red-500 font-bold">*</span>
                  </label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`mt-1 border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center transition-all duration-250 ${
                      dragActive
                        ? 'border-blue-500 bg-blue-950/30'
                        : cvFile
                        ? 'border-emerald-500 bg-emerald-950/10'
                        : errors.cvFile
                        ? 'border-red-500/50 bg-red-950/10'
                        : 'border-slate-800 bg-[#0A192F] hover:border-blue-500 hover:bg-[#112240]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      id="cv_file_picker"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {cvFile ? (
                      <div className="text-center space-y-3">
                        <div className="inline-flex p-3 bg-emerald-950/50 text-emerald-405 border border-emerald-500/30 rounded-full">
                          <Check className="h-6 w-6 text-emerald-400" strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{cvFile.name}</p>
                          <p className="text-xs text-slate-500 mt-1 font-mono">
                            {(cvFile.size / 1024).toFixed(0)} KB &bull; PDF copy verified
                          </p>
                        </div>
                        <div className="pt-2 flex justify-center space-x-3 text-xs">
                          <button
                            type="button"
                            onClick={triggerManualClick}
                            className="text-blue-400 hover:text-white font-bold underline flex items-center cursor-pointer"
                          >
                            Replace File
                          </button>
                          <span className="text-slate-800">|</span>
                          <button
                            type="button"
                            onClick={removeCVFile}
                            className="text-red-400 hover:text-red-300 font-bold flex items-center cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="inline-flex p-3 bg-blue-600/10 border border-blue-500/10 text-blue-400 rounded-full">
                          <UploadCloud className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-white">
                            Drag and drop your PDF CV here, or{' '}
                            <button
                              type="button"
                              onClick={triggerManualClick}
                              className="text-blue-400 hover:text-blue-300 underline font-black focus:outline-none cursor-pointer"
                            >
                              browse files
                            </button>
                          </p>
                          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                            PDF format only (Max 2MB file size)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.cvFile && (
                    <div className="mt-3 flex items-start text-xs text-red-400 font-semibold bg-red-950/10 border border-red-500/20 p-2.5 rounded-lg font-mono">
                      <AlertCircle className="h-4 w-4 mr-1.5 text-red-400 shrink-0" />
                      <span>{errors.cvFile}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy agreement */}
              <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-900/30 text-slate-400 text-xs leading-relaxed flex items-start space-x-3">
                <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="font-semibold text-xs leading-normal">
                  By clicking Submit Application below, you confirm that all entered details are accurate and authorize Apex Careers to securely save, process, and query your candidate profile records for hiring evaluation purposes under active GDPR rules.
                </p>
              </div>

            </div>

            {/* Footer button section */}
            <div className="bg-[#0A192F] px-6 sm:px-10 py-5 border-t border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Review code validations before submission.
              </span>
              <button
                id="submit_app_btn"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-lg shadow-lg font-mono transition-all disabled:opacity-50 duration-200 cursor-pointer shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Profile Documents...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application File</span>
                    <FileDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
