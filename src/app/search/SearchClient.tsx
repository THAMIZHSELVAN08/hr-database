'use client';

import { useState, useMemo } from 'react';
import HRTableWithHighlight from '@/app/dashboard/components/HRTableWithHighlight';

export default function SearchClient({ contacts }: { contacts: any[] }) {
  const [searchAll, setSearchAll] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchMode, setSearchMode] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesAll = !searchAll || 
        contact.hr_name?.toLowerCase().includes(searchAll.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchAll.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchAll.toLowerCase()) ||
        contact.phone?.toLowerCase().includes(searchAll.toLowerCase());

      const matchesName = !searchName || 
        contact.hr_name?.toLowerCase().includes(searchName.toLowerCase());

      const matchesPhone = !searchPhone || 
        contact.phone?.toLowerCase().includes(searchPhone.toLowerCase());

      const matchesStatus = !searchStatus || 
        contact.status === searchStatus;

      const matchesMode = !searchMode || 
        contact.interview_mode === searchMode;

      return matchesAll && matchesName && matchesPhone && matchesStatus && matchesMode;
    });
  }, [contacts, searchAll, searchName, searchPhone, searchStatus, searchMode]);

  const hasFilters = searchAll || searchName || searchPhone || searchStatus || searchMode;

  return (
    <>
      <div className="rounded-xl border border-gray-800 bg-[#111111] p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Search All Fields"
            value={searchAll}
            onChange={(e) => setSearchAll(e.target.value)}
            placeholder="Search across all fields"
          />

          <Input
            label="HR Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="HR Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Phone Number"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Phone Number"
          />

          <Select
            label="Interview Mode"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
            options={['Online', 'Offline', 'Both']}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <Select
            label="Status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            options={[
              'Awaiting Response',
              'Accepted Invite',
              'Email Sent',
              'Called Declined',
              'Emailed Declined',
              'Blacklisted',
              'Wrong Number',
              'Call Postponed',
              'Not Reachable',
            ]}
          />

          <button
            type="button"
            onClick={() => {
              setSearchAll('');
              setSearchName('');
              setSearchPhone('');
              setSearchStatus('');
              setSearchMode('');
            }}
            className="h-[42px] rounded-lg bg-gray-700 font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
        </div>

        <div className="text-sm text-gray-400 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
      </div>

      {hasFilters && (
        <div className="mt-6">
          <HRTableWithHighlight 
            contacts={filteredContacts}
            searchTerms={{
              all: searchAll,
              name: searchName,
              phone: searchPhone,
            }}
          />
        </div>
      )}

      {!hasFilters && (
        <div className="text-center py-12 text-gray-400">
          Enter search criteria to find HR contacts
        </div>
      )}
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}