import * as XLSX from 'xlsx';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  submittedAt: string;
  formattedDate: string;
  sourceRoute: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed';
}

const STORAGE_KEY = 'digiwebnow_contact_submissions';

// Initial sample / root data if storage is empty
const DEFAULT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'INQ-20260901-1001',
    name: 'Gaurav Sharma',
    email: 'gaurav.sharma@gaurfurniture.com',
    phone: '+91 98703 24454',
    company: 'Gaur Furniture',
    message: 'Looking for modern 3D custom catalogue integration and landing page revamp.',
    submittedAt: '2026-09-01T09:30:00.000Z',
    formattedDate: '01/09/2026, 09:30 AM',
    sourceRoute: '#/contact',
    status: 'In Progress',
  },
  {
    id: 'INQ-20260901-1002',
    name: 'Emily Watson',
    email: 'emily@iyouglobal.com',
    phone: '+1 817-869-9658',
    company: 'iYOU Global',
    message: 'Custom web architecture and high-performance e-commerce engine requirements.',
    submittedAt: '2026-09-01T09:45:00.000Z',
    formattedDate: '01/09/2026, 09:45 AM',
    sourceRoute: '#/contact',
    status: 'Completed',
  },
];

/**
 * Retrieve all contact submissions from persistent localStorage
 */
export const getStoredSubmissions = (): ContactSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBMISSIONS));
      return DEFAULT_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SUBMISSIONS;
  } catch (error) {
    console.error('Failed to load contact submissions from localStorage:', error);
    return DEFAULT_SUBMISSIONS;
  }
};

/**
 * Save a new contact submission to localStorage
 */
export const saveContactSubmission = (
  data: Omit<ContactSubmission, 'id' | 'submittedAt' | 'formattedDate' | 'status'> & {
    status?: ContactSubmission['status'];
  }
): { submission: ContactSubmission; allSubmissions: ContactSubmission[] } => {
  const current = getStoredSubmissions();
  const now = new Date();
  
  // Format Date and Time
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `INQ-${dateStr}-${randomSuffix}`;
  
  const formattedDate = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const newRecord: ContactSubmission = {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || 'N/A',
    company: data.company?.trim() || 'N/A',
    message: data.message?.trim() || 'N/A',
    submittedAt: now.toISOString(),
    formattedDate,
    sourceRoute: data.sourceRoute || '#/contact',
    status: data.status || 'New',
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to persist contact submission in localStorage:', error);
  }

  return { submission: newRecord, allSubmissions: updated };
};

/**
 * Delete a submission by ID
 */
export const deleteSubmission = (id: string): ContactSubmission[] => {
  const current = getStoredSubmissions();
  const filtered = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to update localStorage:', error);
  }
  return filtered;
};

/**
 * Clear all submissions and reset
 */
export const clearAllSubmissions = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear submissions:', error);
  }
};

/**
 * Export contact submissions into a properly formatted Excel (.xlsx) workbook
 */
export const exportSubmissionsToExcel = (
  submissions?: ContactSubmission[],
  customFileName?: string
): void => {
  const dataList = submissions && submissions.length > 0 ? submissions : getStoredSubmissions();
  
  // 1. Prepare Primary Leads Sheet
  const rows = dataList.map((item, index) => ({
    'S.No.': index + 1,
    'Inquiry ID': item.id,
    'Submission Date & Time': item.formattedDate,
    'Full Name': item.name,
    'Email Address': item.email,
    'Phone Number': item.phone || 'N/A',
    'Company / Organization': item.company || 'N/A',
    'Project Brief / Message': item.message || 'N/A',
    'Source Route': item.sourceRoute || '#/contact',
    'Lead Status': item.status || 'New',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set explicit column widths for clean readability
  worksheet['!cols'] = [
    { wch: 8 },  // S.No.
    { wch: 22 }, // Inquiry ID
    { wch: 24 }, // Submission Date & Time
    { wch: 25 }, // Full Name
    { wch: 32 }, // Email Address
    { wch: 20 }, // Phone Number
    { wch: 28 }, // Company / Organization
    { wch: 45 }, // Project Brief / Message
    { wch: 18 }, // Source Route
    { wch: 14 }, // Lead Status
  ];

  // 2. Prepare Overview / Summary Sheet
  const summaryData = [
    { 'Metric': 'Total Inquiries Recorded', 'Value': dataList.length },
    { 'Metric': 'Export Timestamp', 'Value': new Date().toLocaleString() },
    { 'Metric': 'Platform / Website', 'Value': 'DigiWebNow — Custom Web Engineering' },
    { 'Metric': 'Storage Source', 'Value': 'Root Contact System (Local & Form Registry)' },
    { 'Metric': 'Latest Inquiry ID', 'Value': dataList[0]?.id || 'None' },
    { 'Metric': 'Latest Contact Name', 'Value': dataList[0]?.name || 'None' },
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [
    { wch: 28 },
    { wch: 45 },
  ];

  // 3. Create Workbook and Append Sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Inquiries');
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary Overview');

  // 4. File name with date
  const now = new Date();
  const dateTag = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const fileName = customFileName || `DigiWebNow_Contact_Leads_${dateTag}.xlsx`;

  // 5. Trigger download
  XLSX.writeFile(workbook, fileName);
};
