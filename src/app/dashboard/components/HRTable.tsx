'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil } from 'lucide-react';
import HRDetailsDrawer from './HRDetailsDrawer';
import { STATUS_STYLES } from '@/lib/statusColors';

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

export default function HRTable({
  contacts,
}: {
  contacts: HRContact[];
}) {
  const [selectedHR, setSelectedHR] = useState<HRContact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const PAGE_SIZE = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(contacts.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPageContacts = contacts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleViewDetails = (hr: HRContact) => {
    setSelectedHR(hr);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedHR(null);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (!contacts.length) {
    return (
      <div 
        className="text-center py-12 text-muted-foreground"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        No HR contacts found.
      </div>
    );
  }

  return (
    <>
      <div 
        className="overflow-x-auto rounded-xl border border-border shadow-md bg-card"
        style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">S.No</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">HR Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Incharge</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Number</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Interview Mode</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-heading uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border">
            {currentPageContacts.map((hr, index) => {
              const isEven = index % 2 === 0;
              const rowBase =
                'transition-colors';
              const rowBg = isEven
                ? 'bg-card'
                : 'bg-background';
              const rowHover = 'hover:bg-muted/50';

              return (
                <tr
                  key={hr.id}
                  className={`${rowBase} ${rowBg} ${rowHover}`}
                >
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">{hr.hr_name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{hr.member_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{hr.incharge || '-'}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{hr.company}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{hr.email}</td>
                <td className="px-6 py-4 text-sm text-card-foreground font-medium">{hr.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[hr.status] || 'bg-gray-600 text-white'
                    }`}
                  >
                    {hr.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">{hr.interview_mode}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {contacts.length > 0 && (
        <div
          className="mt-4 rounded-2xl bg-card border border-border px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-sm"
          style={{
            fontFamily:
              'Segoe UI, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-card-foreground">
              {startIndex + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-card-foreground">
              {Math.min(startIndex + currentPageContacts.length, contacts.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-card-foreground">
              {contacts.length}
            </span>{' '}
            results
          </p>

          <div className="flex items-center gap-3 md:gap-4 justify-end">
            <span className="text-sm text-muted-foreground">
              Page{' '}
              <span className="font-semibold text-card-foreground">
                {currentPage}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-card-foreground">
                {totalPages}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-transparent bg-[#9DB3F5] text-white hover:bg-[#8CA3EE] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold border border-transparent bg-[#1743CE] text-white hover:bg-[#1238BF] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      )}

      <HRDetailsDrawer
        hr={selectedHR}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}