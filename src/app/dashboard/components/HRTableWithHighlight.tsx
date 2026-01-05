'use client';

import React from 'react';

interface Contact {
  id: number;
  hr_name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  interview_mode: string;
  [key: string]: any;
}

interface SearchTerms {
  all?: string;
  name?: string;
  phone?: string;
}

interface HRTableProps {
  contacts: Contact[];
  searchTerms?: SearchTerms;
}

function highlightText(text: string, searchTerms: SearchTerms): React.ReactNode {
  if (!text) return text;
  
  const terms: string[] = [];
  if (searchTerms.all) terms.push(searchTerms.all);
  if (searchTerms.name) terms.push(searchTerms.name);
  if (searchTerms.phone) terms.push(searchTerms.phone);
  
  if (terms.length === 0) return text;
  
  const pattern = terms
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    const isMatch = terms.some(term => 
      part.toLowerCase() === term.toLowerCase()
    );
    
    if (isMatch) {
      return (
        <span key={index} className="bg-yellow-400 text-black font-semibold px-1 rounded">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function HRTableWithHighlight({ contacts, searchTerms = {} }: HRTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#111111] p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-300">No contacts found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#111111] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                HR Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Mode
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {contacts.map((contact, idx) => (
              <tr 
                key={contact.id || idx}
                className="hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-200">
                  {highlightText(contact.hr_name, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {highlightText(contact.company, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {highlightText(contact.email, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {highlightText(contact.phone, searchTerms)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800">
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-200">
                  {contact.interview_mode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-900 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{contacts.length}</span> result{contacts.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}