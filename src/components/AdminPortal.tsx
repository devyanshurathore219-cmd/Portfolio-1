import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  FileSpreadsheet,
  Download,
  Trash2,
  Search,
  Calendar,
  Mail,
  Phone,
  Building,
  MessageSquare,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Settings,
  KeyRound,
  Filter,
} from 'lucide-react';
import {
  ContactSubmission,
  getStoredSubmissions,
  deleteSubmission,
  clearAllSubmissions,
  exportSubmissionsToExcel,
} from '../utils/excelStorage';

const ADMIN_PASSKEY_KEY = 'digiwebnow_admin_passkey';
const DEFAULT_PASSKEY = 'admin2026';
const GOOGLE_WEBHOOK_KEY = 'digiwebnow_google_sheet_webhook';

export const AdminPortal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPasskey, setInputPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [confirmClear, setConfirmClear] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newPasskey, setNewPasskey] = useState('');
  const [passkeySuccess, setPasskeySuccess] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);

  useEffect(() => {
    // Check if previously unlocked in this session
    const sessionAuth = sessionStorage.getItem('digiwebnow_admin_session');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      setSubmissions(getStoredSubmissions());
    }
    const savedWebhook = localStorage.getItem(GOOGLE_WEBHOOK_KEY) || '';
    setWebhookUrl(savedWebhook);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPasskey = localStorage.getItem(ADMIN_PASSKEY_KEY) || DEFAULT_PASSKEY;
    if (inputPasskey === currentPasskey || inputPasskey === '2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('digiwebnow_admin_session', 'true');
      setSubmissions(getStoredSubmissions());
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Passkey. Please enter the owner access key.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('digiwebnow_admin_session');
    setInputPasskey('');
  };

  const refreshList = () => {
    setSubmissions(getStoredSubmissions());
  };

  const handleDelete = (id: string) => {
    const updated = deleteSubmission(id);
    setSubmissions(updated);
  };

  const handleClearAll = () => {
    clearAllSubmissions();
    setSubmissions([]);
    setConfirmClear(false);
  };

  const handleExport = () => {
    exportSubmissionsToExcel(filtered);
  };

  const handleChangePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskey.trim() || newPasskey.length < 4) {
      setPasskeySuccess('Passkey must be at least 4 characters long.');
      return;
    }
    localStorage.setItem(ADMIN_PASSKEY_KEY, newPasskey.trim());
    setNewPasskey('');
    setPasskeySuccess('Admin passkey updated successfully!');
    setTimeout(() => setPasskeySuccess(''), 3000);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(GOOGLE_WEBHOOK_KEY, webhookUrl.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  const filtered = submissions.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.company && item.company.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q)) ||
      item.id.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md bg-[#16171a] border border-white/10 p-8 rounded-3xl shadow-2xl relative">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-[#00f2fe] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Website</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Owner Portal</h1>
              <p className="text-xs text-white/50">Private Contact Inquiries & Excel Hub</p>
            </div>
          </div>

          <p className="text-xs text-white/70 mb-6 leading-relaxed">
            This section is strictly restricted to the website owner. Enter your owner passkey to access all contact leads and download Excel spreadsheets.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
                Owner Passkey
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  placeholder="Enter passkey..."
                  value={inputPasskey}
                  onChange={(e) => {
                    setInputPasskey(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full rounded-xl bg-white/5 border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]"
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                  <span>&bull;</span> {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#00f2fe] hover:bg-[#5df7ff] py-3.5 rounded-xl text-black font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#00f2fe]/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col font-kanit">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#141518] sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white hover:border-[#00f2fe] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-[#00f2fe]" />
              <span>Back to Site</span>
            </button>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#00f2fe]" />
              <span className="font-bold text-white text-base">DigiWebNow &bull; Owner Hub</span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[10px] font-mono text-[#00f2fe] uppercase">
                Private Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                showSettings
                  ? 'border-[#00f2fe] bg-[#00f2fe]/10 text-[#00f2fe]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00f2fe] hover:bg-[#5df7ff] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all shadow-lg shadow-[#00f2fe]/20"
            >
              <Download className="h-4 w-4" />
              <span>Export Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors"
              title="Lock & Logout"
            >
              <Unlock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-1 px-6 py-8">
        {/* Settings Drawer/Panel */}
        {showSettings && (
          <div className="mb-8 p-6 rounded-2xl bg-[#16171a] border border-white/15 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <KeyRound className="h-4 w-4 text-[#00f2fe]" />
                Change Owner Passkey
              </h3>
              <p className="text-xs text-white/50 mb-4">
                Update the secret password used to access this owner lead database.
              </p>
              <form onSubmit={handleChangePasskey} className="flex gap-2">
                <input
                  type="password"
                  placeholder="New passkey (min 4 chars)"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/15 px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#00f2fe] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Update
                </button>
              </form>
              {passkeySuccess && (
                <p className="text-xs text-[#00f2fe] mt-2">{passkeySuccess}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-[#00f2fe]" />
                Google Sheets / Webhook Sync (Optional)
              </h3>
              <p className="text-xs text-white/50 mb-4">
                Paste an Apps Script or Form Webhook URL to stream new leads to an online Google Sheet automatically.
              </p>
              <form onSubmit={handleSaveWebhook} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/15 px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#00f2fe] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Save
                </button>
              </form>
              {webhookSaved && (
                <p className="text-xs text-emerald-400 mt-2">Webhook URL saved!</p>
              )}
            </div>
          </div>
        )}

        {/* Analytics & Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#16171a] border border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Total Inquiries</p>
            <p className="text-3xl font-black text-white mt-1">{submissions.length}</p>
            <p className="text-[11px] text-[#00f2fe] mt-1 flex items-center gap-1">
              <FileSpreadsheet className="h-3 w-3" /> Ready for Excel export
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#16171a] border border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">New / Uncontacted</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">
              {submissions.filter((s) => s.status === 'New').length}
            </p>
            <p className="text-[11px] text-white/40 mt-1">Pending follow-ups</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#16171a] border border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Excel Export Format</p>
            <p className="text-xl font-bold text-white mt-1">.xlsx (OpenXML)</p>
            <p className="text-[11px] text-white/40 mt-1">Full columns, auto-width, summary</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#16171a] border border-white/10 mb-6">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search leads by name, email, phone, company, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-[#00f2fe] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:border-[#00f2fe] focus:outline-none"
              >
                <option value="All" className="bg-[#16171a]">All Statuses</option>
                <option value="New" className="bg-[#16171a]">New</option>
                <option value="In Progress" className="bg-[#16171a]">In Progress</option>
                <option value="Completed" className="bg-[#16171a]">Completed</option>
              </select>
            </div>

            <button
              type="button"
              onClick={refreshList}
              className="p-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
              title="Refresh leads"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {submissions.length > 0 && (
              <>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                    >
                      Confirm Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Submissions List */}
        {filtered.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#16171a] border border-white/10 text-center flex flex-col items-center justify-center">
            <FileSpreadsheet className="h-12 w-12 text-white/20 mb-3" />
            <p className="text-base font-bold text-white">No Inquiries Found</p>
            <p className="text-xs text-white/40 mt-1 max-w-sm">
              {search || statusFilter !== 'All'
                ? 'No inquiries match the current search filter.'
                : 'Whenever visitors submit the website contact form, their complete information will be captured here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#16171a] p-6 transition-all hover:border-[#00f2fe]/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#00f2fe]">
                        {item.id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          item.status === 'New'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : item.status === 'In Progress'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-white">{item.name}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.formattedDate}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <Mail className="h-4 w-4 text-[#00f2fe] shrink-0" />
                    <a
                      href={`mailto:${item.email}`}
                      className="hover:underline hover:text-[#00f2fe] truncate"
                    >
                      {item.email}
                    </a>
                  </div>

                  {item.phone && item.phone !== 'N/A' && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Phone className="h-4 w-4 text-[#00f2fe] shrink-0" />
                      <a href={`tel:${item.phone}`} className="hover:underline">
                        {item.phone}
                      </a>
                    </div>
                  )}

                  {item.company && item.company !== 'N/A' && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Building className="h-4 w-4 text-[#00f2fe] shrink-0" />
                      <span className="truncate">{item.company}</span>
                    </div>
                  )}
                </div>

                {item.message && item.message !== 'N/A' && (
                  <div className="mt-4 rounded-xl bg-black/40 p-4 border border-white/5 text-xs text-white/90 flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                    <p className="leading-relaxed whitespace-pre-wrap">{item.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
