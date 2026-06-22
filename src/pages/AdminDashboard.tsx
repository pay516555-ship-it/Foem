/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getApplications, 
  deleteApplication, 
  downloadApplicantCV, 
  isSupabaseConfigured,
  getContactMessages,
  dbMode
} from '../lib/supabase';
import { JobApplication, ContactMessage } from '../types';
import { 
  LogOut, Search, UserCheck, ShieldAlert, FileDown, Eye, RefreshCw, 
  Filter, Trash2, Calendar, FileText, CheckCircle2, Copy, Check, Info, Mail, FileCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'messages' | 'setup'>('applications');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [adminUser, setAdminUser] = useState('');

  const navigate = useNavigate();

  // Load datasets & check user authenticated
  useEffect(() => {
    const isAuth = sessionStorage.getItem('job_portal_admin_authenticated') === 'true';
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }
    const user = sessionStorage.getItem('job_portal_admin_user') || 'Admin';
    setAdminUser(user);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await getApplications();
      const msgs = await getContactMessages();
      setApplications(apps);
      setMessages(msgs);
    } catch (err) {
      console.error('Error fetching admin dashboard datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('job_portal_admin_authenticated');
    sessionStorage.removeItem('job_portal_admin_user');
    sessionStorage.removeItem('job_portal_auth_timestamp');
    navigate('/admin/login');
  };

  const handleDeleteApplicant = async (id: string, e: MouseEvent) => {
    e.stopPropagation(); // Avoid opening the details modal
    if (!window.confirm('Are you absolutely sure you want to delete this applicant records?')) return;
    
    const flag = await deleteApplication(id);
    if (flag) {
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    } else {
      alert('Delete operation failed.');
    }
  };

  // Filter candidates
  const filteredApps = applications.filter(app => {
    const matchesQuery = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.workExperience.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGender = selectedGender === '' || app.gender === selectedGender;
    const matchesBlood = selectedBlood === '' || app.bloodGroup === selectedBlood;

    return matchesQuery && matchesGender && matchesBlood;
  });

  const downloadCVFileDirectly = (app: JobApplication, e: MouseEvent) => {
    e.stopPropagation(); // Prevent modal trigger
    downloadApplicantCV(app);
  };

  const SQL_BLUEPRINT = `-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR TO GENERATE TARGET SCHEMAS:

-- 1. Create applications table
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  temporary_address text not null,
  permanent_address text not null,
  age integer not null check (age >= 18 and age <= 60),
  gender text not null,
  passport_number text not null,
  blood_group text not null,
  work_experience text,
  cv_url text not null,
  cv_filename text not null,
  cv_size_label text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create contact_messages table
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Configure Row-Level Security (RLS) policies
-- Supabase projects have RLS enabled by default. Run the following to allow inserts, reads, and deletes.

alter table applications enable row level security;
alter table contact_messages enable row level security;

-- Applications policies
create policy "Allow public insert to applications" on applications
  for insert with check (true);

create policy "Allow public select from applications" on applications
  for select using (true);

create policy "Allow public delete from applications" on applications
  for delete using (true);

-- Contact messages policies
create policy "Allow public insert to contact_messages" on contact_messages
  for insert with check (true);

create policy "Allow public select from contact_messages" on contact_messages
  for select using (true);

create policy "Allow public delete from contact_messages" on contact_messages
  for delete using (true);

-- 4. Configure a Storage Bucket named "cv-uploads" in your Supabase Dashboard
-- Set public read permissions or configure active Storage RLS rules.
`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_BLUEPRINT);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="bg-[#0A192F] min-h-screen font-sans text-slate-300">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#112240] text-white shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-md shadow-blue-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Apex Admin Board</h1>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Signed in as: <span className="text-blue-400 font-bold select-all">{adminUser}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition-colors border border-slate-800 cursor-pointer"
              title="Refresh lists"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black font-mono tracking-widest uppercase px-4 py-3 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Database Status Alert */}
        <div className={`p-4 rounded-xl border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          dbMode === 'supabase'
            ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
            : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
        }`}>
          <div className="flex items-start md:items-center space-x-3">
            <div className={`p-2.5 rounded-lg shrink-0 ${
              dbMode === 'supabase' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
            }`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-slate-205">
                Database Provider: <span className="font-bold underline">{dbMode === 'supabase' ? 'Supabase Live Cloud' : 'Offline Persistence Emulator'}</span>
              </h4>
              <p className="text-xs text-slate-450 mt-1 max-w-2xl leading-relaxed">
                {dbMode === 'supabase'
                  ? 'Connected and persisting applicant profiles directly into your cloud repository. Storage bucket upload is verified.'
                  : 'Currently storing submissions locally in the browser’s LocalStorage. Seeded mock variables are active for instant evaluation. Connect your live Supabase database, bucket, and keys by configuring credentials in the Secrets panel.'
                }
              </p>
            </div>
          </div>
          {dbMode !== 'supabase' && (
            <button
              onClick={() => setActiveTab('setup')}
              className="text-xs font-black uppercase tracking-widest text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 px-4 py-3 rounded-lg transition-colors inline-block shrink-0 cursor-pointer"
            >
              Setup Cloud Database API
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => { setActiveTab('applications'); setSelectedApp(null); }}
            className={`pb-3 px-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'applications'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-505 hover:text-slate-300'
            }`}
          >
            Job Applications ({applications.length})
          </button>
          <button
            onClick={() => { setActiveTab('messages'); setSelectedApp(null); }}
            className={`pb-3 px-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-550 hover:text-slate-300'
            }`}
          >
            Contact Inquiries ({messages.length})
          </button>
          <button
            onClick={() => { setActiveTab('setup'); setSelectedApp(null); }}
            className={`pb-3 px-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'setup'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-550 hover:text-slate-300'
            }`}
          >
            Supabase Schema Script
          </button>
        </div>

        {/* Tab 1: Candidate Applications Table */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            {/* Table Filters Panel */}
            <div className="bg-[#112240] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search */}
              <div className="md:col-span-5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Query Name, Passport, and Skills..."
                  className="block w-full pl-9 pr-4 py-2.5 text-sm bg-[#0A192F] text-white border border-slate-805 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Gender Filter */}
              <div className="md:col-span-3 flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-450 shrink-0" />
                <select
                  className="block w-full text-xs text-white bg-[#0A192F] border border-slate-805 py-2.5 px-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group Filter */}
              <div className="md:col-span-3 flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-450 shrink-0" />
                <select
                  className="block w-full text-xs text-white bg-[#0A192F] border border-slate-805 py-2.5 px-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={selectedBlood}
                  onChange={(e) => setSelectedBlood(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Refresh buttons */}
              <div className="md:col-span-1 text-right">
                <button
                  onClick={() => { setSearchQuery(''); setSelectedGender(''); setSelectedBlood(''); }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-black uppercase tracking-wider cursor-pointer font-sans"
                >
                  Reset
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 bg-[#112240] border border-slate-800 rounded-xl">
                <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest font-semibold">Gathering candidate databases...</p>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-20 bg-[#112240] border border-slate-800 rounded-xl space-y-3">
                <p className="text-sm font-black uppercase tracking-wider text-white">No applicants found matching this criteria</p>
                <p className="text-xs text-slate-450 max-w-sm mx-auto">Try refining search labels, passport codes, or filter choices.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Candidates Table Grid */}
                <div className={`transition-all bg-[#112240] border border-slate-800 rounded-xl shadow-2xl overflow-hidden ${
                  selectedApp ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-xs text-slate-300">
                      <thead className="bg-[#0A192F] text-white font-mono uppercase tracking-widest text-[9px] font-black">
                        <tr>
                          <th className="px-4 py-4 border-r border-slate-800">Candidate Name</th>
                          <th className="px-4 py-4 border-r border-slate-800 text-center">Age</th>
                          <th className="px-4 py-4 border-r border-slate-800 text-center">Gen</th>
                          <th className="px-4 py-4 border-r border-slate-800 text-center">Passport</th>
                          <th className="px-4 py-4 border-r border-slate-800 text-center">Blood</th>
                          <th className="px-4 py-4 border-r border-slate-800">CV File</th>
                          <th className="px-4 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-805">
                        {filteredApps.map((app) => (
                          <tr
                            key={app.id}
                            className={`hover:bg-[#0A192F]/65 cursor-pointer transition-colors ${
                              selectedApp?.id === app.id ? 'bg-[#0A192F] border-l-4 border-blue-600' : ''
                            }`}
                            onClick={() => setSelectedApp(app)}
                          >
                            {/* Candidate Info */}
                            <td className="px-4 py-4 font-black text-white">
                              <div>{app.fullName}</div>
                              <div className="text-[10px] text-slate-450 font-medium mt-1 max-w-xs truncate">{app.temporaryAddress}</div>
                            </td>

                            {/* Age */}
                            <td className="px-4 py-4 text-center font-mono font-bold text-slate-300">
                              {app.age}
                            </td>

                            {/* Gender */}
                            <td className="px-4 py-4 text-center text-slate-400 font-semibold text-[11px]">
                              {app.gender}
                            </td>

                            {/* Passport */}
                            <td className="px-4 py-4 text-center font-mono font-black text-blue-400 uppercase text-[10px]">
                              {app.passportNumber}
                            </td>

                            {/* Blood */}
                            <td className="px-4 py-4 text-center font-bold">
                              <span className="bg-red-950/40 text-red-400 border border-red-900/40 rounded px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">{app.bloodGroup}</span>
                            </td>

                            {/* CV PDF Link */}
                            <td className="px-4 py-4">
                              <button
                                type="button"
                                onClick={(e) => downloadCVFileDirectly(app, e)}
                                className="inline-flex items-center space-x-1.5 py-1 px-2 border border-blue-900/50 bg-blue-950/20 hover:border-blue-500 rounded text-blue-400 hover:text-white transition-all text-2xs truncate max-w-xs cursor-pointer"
                                title={app.cvFilename}
                              >
                                <FileDown className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{app.cvFilename}</span>
                              </button>
                            </td>

                            {/* Action panel triggers */}
                            <td className="px-4 py-4 text-center whitespace-nowrap">
                              <div className="flex justify-center items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedApp(app)}
                                  className="p-1 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                                  title="Expand profile details"
                                >
                                  <Eye className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteApplicant(app.id, e)}
                                  className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Delete Applicant"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Footer Stats row */}
                  <div className="bg-[#0A192F] border-t border-slate-800 p-3.5 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    <span>Active submissions schema catalog</span>
                    <span>Total matching: <span className="text-blue-400 font-bold">{filteredApps.length} candidates</span></span>
                  </div>
                </div>

                {/* Candidate Nested Detail Drawer */}
                {selectedApp && (
                  <div className="lg:col-span-5 xl:col-span-4 bg-[#112240] border border-slate-800 rounded-xl shadow-2xl p-6 sticky top-24 space-y-6 animate-fade-in text-slate-300">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-base font-black text-white font-sans tracking-tight uppercase">{selectedApp.fullName}</h3>
                        <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-wider">Reference ID: {selectedApp.id}</p>
                      </div>
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-white bg-[#0A192F] hover:bg-slate-850 px-3 py-1.5 rounded-lg transition-colors border border-slate-800 shrink-0 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      
                      {/* Addresses stats Grid */}
                      <div className="space-y-3">
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-400">Candidate Bio Card</div>
                        <div className="grid grid-cols-2 gap-3 bg-[#0A192F] p-4 rounded-xl border border-slate-805 text-slate-355 font-semibold">
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-sans uppercase tracking-widest text-[9px] font-bold">Age:</span>
                            <span className="font-black text-white">{selectedApp.age} years</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-sans uppercase tracking-widest text-[9px] font-bold">Gender:</span>
                            <span className="font-black text-white">{selectedApp.gender}</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block mb-0.5 font-sans uppercase tracking-widest text-[9px] font-bold">Passport:</span>
                            <span className="font-mono font-black text-blue-400 uppercase">{selectedApp.passportNumber}</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block mb-0.5 font-sans uppercase tracking-widest text-[9px] font-bold">Blood Group:</span>
                            <span className="font-black text-red-400 uppercase font-mono">{selectedApp.bloodGroup}</span>
                          </div>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="space-y-3 pt-1">
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-400">Address Coordinates</div>
                        <div className="space-y-3 leading-relaxed text-slate-300 font-semibold bg-[#0A192F] p-4 rounded-xl border border-slate-805">
                          <div>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] block mb-1">Temporary Address:</span>
                            <span className="font-medium text-white">{selectedApp.temporaryAddress}</span>
                          </div>
                          <div className="h-px bg-slate-800/60" />
                          <div>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] block mb-1">Permanent Address:</span>
                            <span className="font-medium text-white">{selectedApp.permanentAddress}</span>
                          </div>
                        </div>
                      </div>

                      {/* Experience statement block */}
                      {selectedApp.workExperience && (
                        <div className="space-y-2 pt-1">
                          <div className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-400">Professional Experience Summary</div>
                          <div className="bg-[#0A192F] border border-slate-805 p-4 rounded-lg leading-relaxed text-slate-300 font-medium">
                            {selectedApp.workExperience}
                          </div>
                        </div>
                      )}

                      {/* File actions */}
                      <div className="pt-2 border-t border-slate-800 space-y-3">
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-400">Intake Document Link</div>
                        <div className="flex items-center justify-between p-3 border border-blue-900 bg-blue-950/20 rounded-lg">
                          <div className="flex items-center space-x-2.5 truncate">
                            <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                            <div className="truncate max-w-[120px] sm:max-w-[160px]">
                              <p className="font-bold text-white truncate text-[11px]">{selectedApp.cvFilename}</p>
                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{selectedApp.cvSizeLabel}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => downloadCVFileDirectly(selectedApp, e)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest px-3 py-2.5 rounded transition-all shrink-0 cursor-pointer"
                          >
                            <FileDown className="h-3.5 w-3.5 " />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contact Messages Inquiries */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">Contact Form Inquiries</h3>
            
            {messages.length === 0 ? (
              <div className="text-center py-20 bg-[#112240] border border-slate-800 rounded-xl">
                <p className="text-sm font-black uppercase tracking-wider text-white">No contact messages received yet</p>
                <p className="text-xs text-slate-450 mt-1">Direct customer inquiries will accumulate here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-[#112240] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="font-black text-white text-sm uppercase tracking-tight leading-tight">{msg.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-bold shrink-0">
                          {new Date(msg.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="underline select-all">{msg.email}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800 mt-2 italic font-medium">
                        "{msg.message}"
                      </p>
                    </div>

                    <div className="text-[9px] text-slate-550 font-mono self-end pt-3">
                      ID: {msg.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Supabase setup script drawer */}
        {activeTab === 'setup' && (
          <div className="bg-[#112240] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2 text-white">
              <FileCheck className="h-6 w-6 text-blue-400" />
              <h2 className="text-lg font-black uppercase tracking-tighter">Supabase Schema Generation Scripts</h2>
            </div>
            
            <p className="text-slate-350 text-sm leading-relaxed max-w-3xl font-medium">
              Below is the database table generation blueprint structured for direct integration with the `@supabase/supabase-js` triggers used in this app. Run these guidelines inside your targeted Supabase SQL Editor.
            </p>

            <div className="relative">
              <div className="absolute top-2.5 right-2.5 z-10">
                <button
                  onClick={handleCopySQL}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-lg border-none shadow-lg flex items-center transition-all cursor-pointer"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>Copy SQL Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 sm:p-5 text-2xs font-mono text-blue-450 bg-[#0A192F] rounded-xl overflow-x-auto border border-slate-805 leading-normal">
                {SQL_BLUEPRINT}
              </pre>
            </div>

            <div className="p-5 bg-blue-950/25 border border-blue-900/35 rounded-xl text-xs text-slate-300 space-y-3 font-semibold">
              <div className="font-black uppercase tracking-wider text-blue-400 flex items-center text-[11px] font-mono">
                <Info className="h-4 w-4 mr-1.5 text-blue-405" /> Connecting Supabase Environmental Variables:
              </div>
              <p className="font-semibold leading-relaxed">
                Add two keys into the Secrets/Environment Variables panel inside your AI Studio UI:
              </p>
              <ul className="list-disc pl-5 font-mono space-y-2 mt-1 text-slate-400 select-all tracking-wider text-[11px]">
                <li>VITE_SUPABASE_URL = <span className="text-white">"https://your-project.supabase.co"</span></li>
                <li>VITE_SUPABASE_ANON_KEY = <span className="text-white">"eyJhbGc..."</span></li>
              </ul>
              <p className="pt-2 font-bold leading-normal text-slate-500 text-[10px] uppercase font-mono tracking-widest">
                * Once loaded, this page auto-refreshes, hooks into your database, and deactivates client-side LocalStorage replication automatically!
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
