'use client';

import { useState } from 'react';
import HRTable from './HRTable';
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

export default function DashboardClient({ contacts }: { contacts: HRContact[] }) {
  const [selectedHR, setSelectedHR] = useState<HRContact | null>(null);

  return (
    <div 
      className="p-8"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <HRTable contacts={contacts} />

      {selectedHR && (
        <HRDetailsDrawer
          hr={selectedHR}
          isOpen={Boolean(selectedHR)}
          onClose={() => setSelectedHR(null)}
        />
      )}
    </div>
  );
}