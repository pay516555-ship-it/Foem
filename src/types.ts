/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JobApplication {
  id: string;
  fullName: string;
  temporaryAddress: string;
  permanentAddress: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  workExperience: string;
  cvUrl: string; // URL for downloading/viewing candidate's CV
  cvFilename: string; // The file name upload
  cvSizeLabel?: string; // e.g. "1.2 MB"
  submittedAt: string; // ISO date-time string
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}
