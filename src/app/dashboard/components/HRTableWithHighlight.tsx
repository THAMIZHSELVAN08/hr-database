'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_STYLES } from '@/lib/statusColors';

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
        <span key={index} className="bg-accent text-accent-foreground font-semibold px-1 rounded">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function HRTableWithHighlight({ contacts, searchTerms = {} }: HRTableProps) {
  const router = useRouter();

  const handleView = (contactId: number) => {
    router.push(`/view/${contactId}`);
  };

  const handleEdit = (contactId: number) => {
    router.push(`/edit/${contactId}`);
  };

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
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
        <h3 className="mt-4 text-lg font-medium text-heading">No contacts found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="app-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                HR Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact, idx) => (
              <tr 
                key={contact.id || idx}
                className="hover:bg-muted/40 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {highlightText(contact.hr_name, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {highlightText(contact.company, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {highlightText(contact.email, searchTerms)}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {highlightText(contact.phone, searchTerms)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[contact.status] || 'bg-gray-500 text-white'
                    }`}
                  >
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {contact.interview_mode}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(contact.id)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      title="View Contact"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(contact.id)}
                      className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                      title="Edit Contact"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-secondary border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-heading">{contacts.length}</span> result{contacts.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}