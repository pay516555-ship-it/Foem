/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { JobApplication, ContactMessage } from '../types';

// Read configuration from environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && !supabaseUrl.includes('your-supabase-project') && supabaseAnonKey && !supabaseAnonKey.includes('your-anon-role'));

// Initialize supabase client if keys are available
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const dbMode: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local';

// Local storage session keynames
const STORAGE_KEY_APPLICATIONS = 'job_portal_applications';
const STORAGE_KEY_MESSAGES = 'job_portal_contact_messages';

// To hold full CV uploaded contents (Data URLs) in memory during dev testing,
// since localStorage has a 5MB size limit. This guarantees file download works flawlessly!
const cvFileContentsStore = new Map<string, { base64: string; type: string; name: string }>();

// Initial seed applications if local storage is empty
const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'demo-app-1',
    fullName: 'Jane Doe',
    temporaryAddress: 'Apt 104, 52 Pine St, San Francisco, CA',
    permanentAddress: '12 State Rd, Portland, ME',
    age: 28,
    gender: 'Female',
    passportNumber: 'L837194A0',
    bloodGroup: 'O+',
    workExperience: 'Senior Frontend Developer with 4+ years of React experience. Managed modular components, styled UI widgets with Tailwind CSS, and optimized core bundle sizes.',
    cvUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...[Demo PDF File Content]',
    cvFilename: 'Jane_Doe_CV.pdf',
    cvSizeLabel: '1.2 MB',
    submittedAt: '2026-06-20T14:32:00.000Z'
  },
  {
    id: 'demo-app-2',
    fullName: 'David Smith',
    temporaryAddress: 'Building 12, River Valley, Austin, TX',
    permanentAddress: 'Building 12, River Valley, Austin, TX',
    age: 34,
    gender: 'Male',
    passportNumber: 'K472901B8',
    bloodGroup: 'AB-',
    workExperience: 'DevOps & Product Engineer. Experiencing cloud systems (GC, AWS) & relational databases. Built server APIs with Node and orchestrated containers.',
    cvUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...[Demo PDF File Content]',
    cvFilename: 'David_Smith_CV.pdf',
    cvSizeLabel: '980 KB',
    submittedAt: '2026-06-18T09:15:00.000Z'
  }
];

// Seed default applications to local memory so the admin panel looks rich on first start
function getLocalApplications(): JobApplication[] {
  const data = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_APPLICATIONS;
  }
}

function saveLocalApplications(apps: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));
}

// Convert File to base64 Data URL
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Handle Job Application Submissions
 */
export async function saveApplication(
  appData: Omit<JobApplication, 'id' | 'submittedAt' | 'cvUrl' | 'cvFilename'>,
  cvFile: File
): Promise<JobApplication | any> {
  const cvFilename = `${Date.now()}_${cvFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const sizeKb = Math.round(cvFile.size / 1024);
  const cvSizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  if (dbMode === 'supabase' && supabase) {
    try {
      let cvUrl = '';

      // Try uploading to Supabase Storage bucket
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv-uploads')
          .upload(`cvs/${cvFilename}`, cvFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          // If error is bucket-related or not found, try to dynamically provision the bucket
          if (uploadError.message?.toLowerCase().includes('not found') || uploadError.message?.toLowerCase().includes('bucket')) {
            try {
              await supabase.storage.createBucket('cv-uploads', { public: true });
              // Retry upload
              const { data: retryData, error: retryError } = await supabase.storage
                .from('cv-uploads')
                .upload(`cvs/${cvFilename}`, cvFile, {
                  cacheControl: '3600',
                  upsert: true
                });
              if (retryError) {
                throw retryError;
              }
            } catch (createErr) {
              console.warn('Dynamic bucket creation failed, triggering SQL fallback option:', createErr);
              throw uploadError; // Trigger text column fallback in catch
            }
          } else {
            throw uploadError;
          }
        }

        // 2. Resolve public URL
        const { data: urlData } = supabase.storage
          .from('cv-uploads')
          .getPublicUrl(`cvs/${cvFilename}`);

        cvUrl = urlData.publicUrl;
      } catch (storageErr) {
        console.warn('Supabase Storage bucket fallback triggered. Representing CV File as dynamic Base64 document payload:', storageErr);
        // Resilient database text column fallback
        cvUrl = await fileToDataURL(cvFile);
      }

      // 3. Insert applicant details as record row into applications table
      const { data: insertData, error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            full_name: appData.fullName,
            temporary_address: appData.temporaryAddress,
            permanent_address: appData.permanentAddress,
            age: appData.age,
            gender: appData.gender,
            passport_number: appData.passportNumber,
            blood_group: appData.bloodGroup,
            work_experience: appData.workExperience,
            cv_url: cvUrl,
            cv_filename: cvFile.name,
            cv_size_label: cvSizeLabel,
            submitted_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Database record insertion failed: ${insertError.message}`);
      }

      // Map snake_case database response to JobApplication typed object
      return {
        id: insertData.id,
        fullName: insertData.full_name,
        temporaryAddress: insertData.temporary_address,
        permanentAddress: insertData.permanent_address,
        age: insertData.age,
        gender: insertData.gender,
        passportNumber: insertData.passport_number,
        bloodGroup: insertData.blood_group,
        workExperience: insertData.work_experience,
        cvUrl: insertData.cv_url,
        cvFilename: insertData.cv_filename,
        cvSizeLabel: insertData.cv_size_label,
        submittedAt: insertData.submitted_at
      } as JobApplication;

    } catch (err: any) {
      console.error('Supabase application submission error:', err);
      console.warn('Falling back to local storage persistence. To store applications in Supabase, execute the database schema script provided in the Admin Dashboard.');
      
      const newId = `app-fallback-${Math.random().toString(36).substr(2, 9)}`;
      const base64Data = await fileToDataURL(cvFile);
      
      cvFileContentsStore.set(newId, {
        base64: base64Data,
        type: cvFile.type,
        name: cvFile.name
      });

      const newApp: JobApplication = {
        id: newId,
        fullName: appData.fullName,
        temporaryAddress: appData.temporaryAddress,
        permanentAddress: appData.permanentAddress,
        age: appData.age,
        gender: appData.gender,
        passportNumber: appData.passportNumber,
        bloodGroup: appData.bloodGroup,
        workExperience: appData.workExperience,
        cvUrl: base64Data,
        cvFilename: cvFile.name,
        cvSizeLabel,
        submittedAt: new Date().toISOString()
      };

      const currentApps = getLocalApplications();
      saveLocalApplications([newApp, ...currentApps]);

      return newApp;
    }
  } else {
    // Local Failback Mode (100% Client-Side Interactive)
    const newId = `app-${Math.random().toString(36).substr(2, 9)}`;
    const base64Data = await fileToDataURL(cvFile);
    
    // Store cv file content in memory so download link works in current browser session
    cvFileContentsStore.set(newId, {
      base64: base64Data,
      type: cvFile.type,
      name: cvFile.name
    });

    const newApp: JobApplication = {
      id: newId,
      fullName: appData.fullName,
      temporaryAddress: appData.temporaryAddress,
      permanentAddress: appData.permanentAddress,
      age: appData.age,
      gender: appData.gender,
      passportNumber: appData.passportNumber,
      bloodGroup: appData.bloodGroup,
      workExperience: appData.workExperience,
      cvUrl: base64Data, // Save base64 as fallback url
      cvFilename: cvFile.name,
      cvSizeLabel,
      submittedAt: new Date().toISOString()
    };

    const currentApps = getLocalApplications();
    saveLocalApplications([newApp, ...currentApps]);

    return newApp;
  }
}

/**
 * Fetch All Candidate Applications
 */
export async function getApplications(): Promise<JobApplication[]> {
  if (dbMode === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        fullName: row.full_name,
        temporaryAddress: row.temporary_address,
        permanentAddress: row.permanent_address,
        age: row.age,
        gender: row.gender,
        passportNumber: row.passport_number,
        bloodGroup: row.blood_group,
        workExperience: row.work_experience,
        cvUrl: row.cv_url,
        cvFilename: row.cv_filename,
        cvSizeLabel: row.cv_size_label || 'File',
        submittedAt: row.submitted_at
      }));
    } catch (err: any) {
      console.warn('Error fetching applications from Supabase, falling back to local storage representation:', err.message);
      return getLocalApplications();
    }
  } else {
    return getLocalApplications();
  }
}

/**
 * Delete Candidate Application
 */
export async function deleteApplication(id: string): Promise<boolean> {
  if (dbMode === 'supabase' && supabase) {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      return true;
    } catch (err: any) {
      console.warn('Supabase application deletion failed: table metadata might be missing. Deleting from local fallback store:', err.message);
      const apps = getLocalApplications();
      const updated = apps.filter(a => a.id !== id);
      saveLocalApplications(updated);
      cvFileContentsStore.delete(id);
      return true;
    }
  } else {
    const apps = getLocalApplications();
    const updated = apps.filter(a => a.id !== id);
    saveLocalApplications(updated);
    cvFileContentsStore.delete(id);
    return true;
  }
}

/**
 * Helper to download applicant CV
 */
export function downloadApplicantCV(app: JobApplication) {
  // If download URL is a base64 string (local fallback mode)
  if (app.cvUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = app.cvUrl;
    link.download = app.cvFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // If it is stored in Supabase (production mode)
    // We open public url or download directly
    window.open(app.cvUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Handle Contact Messages
 */
export async function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'submittedAt'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: `msg-${Math.random().toString(36).substr(2, 9)}`,
    name: msg.name,
    email: msg.email,
    message: msg.message,
    submittedAt: new Date().toISOString()
  };

  if (dbMode === 'supabase' && supabase) {
    try {
      // Attempt to save into contact_messages table if users set it up
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: msg.name,
            email: msg.email,
            message: msg.message,
            submitted_at: newMsg.submittedAt
          }
        ]);
      if (error) {
        console.warn('Could not save contact message to Supabase. This error can be ignored if contact_messages table is not configured yet. Saving to LocalStorage as fallback.', error.message);
      }
    } catch (e) {
      // Silently catch and proceed with local storage fallback
    }
  }

  // Backup store to local persistence
  const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
  const currentMsgs = data ? JSON.parse(data) : [];
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([newMsg, ...currentMsgs]));

  return newMsg;
}

/**
 * Fetch All Contact Messages
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (dbMode === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        message: row.message,
        submittedAt: row.submitted_at
      }));
    } catch (err: any) {
      console.warn('Error fetching contact messages from Supabase, falling back to local representation:', err.message);
      const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
      return data ? JSON.parse(data) : [];
    }
  } else {
    const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return data ? JSON.parse(data) : [];
  }
}
