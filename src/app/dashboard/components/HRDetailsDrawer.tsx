'use client';

import { X } from 'lucide-react';

type HRContact = {
  id: number;
  hr_name: string;
  company: string;
  email: string;
  phone: string;
  interview_mode: string;
  status: string;
  remark?: string;
  member_name?: string;
  incharge?: string;
  hr_count?: number;
  transport?: string;
  internship?: string;
  address?: string;
  member_email?: string;
  incharge_email?: string;
};

interface HRDetailsDrawerProps {
  hr: HRContact | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HRDetailsDrawer({
  hr,
  isOpen,
  onClose,
}: HRDetailsDrawerProps) {
  if (!isOpen || !hr) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div 
        className="fixed right-0 top-0 h-full w-[420px] bg-white dark:bg-[#0B0F05] border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-y-auto"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="sticky top-0 bg-white dark:bg-[#0B0F05] border-b border-gray-200 dark:border-gray-800 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">HR Contact Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Name</p>
            <p className="text-base text-gray-900 dark:text-gray-100 font-medium">{hr.hr_name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Company</p>
            <p className="text-base text-gray-900 dark:text-gray-100 font-medium">{hr.company}</p>
          </div>

          {hr.hr_count && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">HR Count</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.hr_count}</p>
            </div>
          )}

          {hr.address && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Address</p>
              <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed">{hr.address}</p>
            </div>
          )}

          {hr.transport && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Transport</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.transport}</p>
            </div>
          )}

          {hr.internship && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Internship</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.internship}</p>
            </div>
          )}

          {hr.email && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</p>
              <p className="text-base text-gray-900 dark:text-gray-100 break-all">{hr.email}</p>
            </div>
          )}

          {hr.phone && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone</p>
              <p className="text-base text-gray-900 dark:text-gray-100 font-medium">{hr.phone}</p>
            </div>
          )}

          {hr.interview_mode && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Interview Mode</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.interview_mode}</p>
            </div>
          )}

          {hr.status && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.status}</p>
            </div>
          )}

          {hr.member_name && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Member</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.member_name}</p>
            </div>
          )}

          {hr.incharge && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Incharge</p>
              <p className="text-base text-gray-900 dark:text-gray-100">{hr.incharge}</p>
            </div>
          )}

          {hr.remark && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Comments</p>
              <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{hr.remark}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#0B0F05] border-t border-gray-200 dark:border-gray-800 px-8 py-6 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}