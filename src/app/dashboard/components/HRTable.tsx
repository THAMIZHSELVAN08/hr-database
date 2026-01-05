'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil } from 'lucide-react';
import HRDetailsDrawer from './HRDetailsDrawer';

type HRContact = {
  id: number;
  hr_name: string;
  company: string;
  email: string;
  phone: string;
  interview_mode: string;
  status: string;
  remark: string;
  member_name?: string;
  incharge?: string;
};

const STATUS_STYLES: Record<string, string> = {
  'Email Sent': 'bg-purple-600 text-white',
  'Awaiting Response': 'bg-indigo-600 text-white',
  'Call Postponed': 'bg-sky-500 text-white',
  'Wrong Number': 'bg-orange-500 text-white',
  'Called Declined': 'bg-red-600 text-white',
  'Emailed Declined': 'bg-yellow-600 text-white',
  'Blacklisted': 'bg-gray-800 text-white',
  'Not Called': 'bg-yellow-500 text-white',
  'Not Reachable': 'bg-red-500 text-white',
};

export default function HRTable({
  contacts,
}: {
  contacts: HRContact[];
}) {
  const [selectedHR, setSelectedHR] = useState<HRContact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (hr: HRContact) => {
    setSelectedHR(hr);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedHR(null);
  };

  if (!contacts.length) {
    return (
      <div 
        className="text-center py-12 text-gray-500 dark:text-gray-400"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        No HR contacts found.
      </div>
    );
  }

  return (
    <>
      <div 
        className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">S.No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">HR Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Incharge</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Interview Mode</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-[#0B0F05] divide-y divide-gray-200 dark:divide-gray-800">
            {contacts.map((hr, index) => (
              <tr
                key={hr.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{hr.hr_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{hr.member_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{hr.incharge || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{hr.company}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{hr.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 font-medium">{hr.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[hr.status] || 'bg-gray-600 text-white'
                    }`}
                  >
                    {hr.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{hr.interview_mode}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(hr)}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-3 py-2 rounded-lg text-white transition-colors shadow-sm"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/hr/${hr.id}/edit`}
                      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 active:bg-green-800 px-3 py-2 rounded-lg text-white transition-colors shadow-sm"
                      title="Edit contact"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HRDetailsDrawer
        hr={selectedHR}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}