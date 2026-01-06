'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTeamDataByEmail, getAllTeamMembers } from '@/app/add/components/TeamData';

const STATUS_OPTIONS = [
  'Select Status',
  'Awaiting Response',
  'Accepted Invite',
  'Called Declined',
  'Emailed Declined',
  'Email Sent',
  'Blacklisted',
  'Wrong Number',
  'Call Postponed',
  'Not Reachable',
];

const INTERVIEW_MODES = ['Select Mode', 'Online', 'Offline', 'Both'];
const TRANSPORT_OPTIONS = ['None', 'Own', 'Required'];
const INTERNSHIP_OPTIONS = ['Yes', 'No'];

// Define transfer exceptions - emails that have transfer permissions
const TRANSFER_EXCEPTIONS: string[] = [
  'admin@example.com',
  'superadmin@example.com',
  // Add your super admin emails here
];

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
  callback_date?: string;
  callback_time?: string;
};

type TeamMember = {
  name: string;
  email: string;
  incharge: string;
  inchargeEmail: string;
};

export default function HREditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<HRContact>>({});
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState({ hour: '09', minute: '00', period: 'AM' });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [canTransfer, setCanTransfer] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (mounted) {
            setCurrentUserEmail(userData.email);
            const hasTransferPermission = TRANSFER_EXCEPTIONS.includes(userData.email);
            setCanTransfer(hasTransferPermission);
            
            if (hasTransferPermission) {
              try {
                const members = getAllTeamMembers();
                setTeamMembers(members);
              } catch (err) {
                console.warn('Failed to load team members', err);
              }
            }
          }
        }
  
        const { id } = await params;
        const res = await fetch(`/api/hr/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
  
        if (!mounted) return;
  
        let updated = { ...data } as Partial<HRContact>;
        const memberEmail = (data.member_email || '').toString();
        if ((!data.incharge || !data.incharge_email) && memberEmail) {
          try {
            const team = getTeamDataByEmail(memberEmail);
            if (team) {
              if (!updated.incharge) updated.incharge = team.incharge;
              if (!updated.incharge_email) updated.incharge_email = team.inchargeEmail;
            }
          } catch (err) {
            console.warn('Team lookup failed', err);
          }
        }
  
        setFormData(updated);
        
        if (data.callback_date) {
          setSelectedDate(data.callback_date);
        }
      } catch (err) {
        setError('Failed to load HR record');
      }
    };
    
    loadData();
    return () => {
      mounted = false;
    };
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'status' && value === 'Call Postponed') {
      setShowDatePicker(true);
    } else if (name === 'status' && formData.status === 'Call Postponed' && value !== 'Call Postponed') {
      setSelectedDate('');
      setFormData((prev) => ({ ...prev, callback_date: undefined }));
    }
    
    if (name === 'hr_count') {
      // Allow empty field while typing, otherwise clamp to at least 1
      if (value === '') {
        setFormData((prev) => ({ ...prev, hr_count: undefined }));
        return;
      }

      const numeric = parseInt(value, 10);
      const safeValue = isNaN(numeric) ? 1 : Math.max(1, numeric);

      setFormData((prev) => ({ ...prev, hr_count: safeValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${dayStr}`);
  };

  const handleSetCallbackDateTime = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    const formattedTime = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
    
    setFormData((prev) => ({
      ...prev,
      callback_date: selectedDate,
      callback_time: formattedTime,
    }));
    
    setShowDatePicker(false);
  };

  const handleTransfer = async () => {
    if (!selectedMember) {
      alert('Please select a team member to transfer to');
      return;
    }

    const member = teamMembers.find(m => m.email === selectedMember);
    if (!member) {
      alert('Invalid team member selected');
      return;
    }

    if (!confirm(`Are you sure you want to transfer this HR contact to ${member.name}?`)) {
      return;
    }

    setTransferLoading(true);
    try {
      const { id } = await params;
      const transferData = {
        ...formData,
        member_name: member.name,
        member_email: member.email,
        incharge: member.incharge,
        incharge_email: member.inchargeEmail,
      };

      const res = await fetch(`/api/hr/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });

      if (!res.ok) throw new Error('Transfer failed');

      alert(`Successfully transferred to ${member.name}`);
      setFormData(transferData);
      setShowTransferModal(false);
      setSelectedMember('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.status === 'Call Postponed' && !formData.callback_date) {
      setError('Please select a callback date for Call Postponed status');
      setShowDatePicker(true);
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      const { id } = await params; 
      const res = await fetch(`/api/hr/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) throw new Error('Failed to update');
      
      if (formData.status === 'Call Postponed' && formData.callback_date) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact_id: id, 
            message: `Follow-up: ${formData.hr_name} – ${formData.company}`,
            callback_date: formData.callback_date,
          }),
        });
      }
      
      router.push(`/dashboard/hr/${id}`);  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this HR record?')) return;
  
    setLoading(true);
    try {
      const { id } = await params;  
      const res = await fetch(`/api/hr/${id}`, { 
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = today.getDate() === day && 
                      today.getMonth() === currentMonth.getMonth() && 
                      today.getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`p-2 rounded-full text-sm ${
            isSelected 
              ? 'bg-teal-600 text-white' 
              : isToday 
              ? 'bg-teal-700 text-white'
              : 'hover:bg-accent'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-heading">Edit HR Record</h1>
            {canTransfer && (
              <button
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Transfer Contact
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded text-red-400">
              {error}
            </div>
          )}

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  HR Name*
                </label>
                <input
                  type="text"
                  name="hr_name"
                  value={formData.hr_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Interview Mode
                </label>
                <select
                  name="interview_mode"
                  value={formData.interview_mode || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {INTERVIEW_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Company*
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Member*
                </label>
                <input
                  type="text"
                  name="member_name"
                  value={formData.member_name || ''}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-muted-foreground cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Incharge*
                </label>
                <input
                  type="text"
                  name="incharge"
                  value={formData.incharge || ''}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-muted-foreground cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  HR Count
                </label>
                <input
                  type="number"
                  name="hr_count"
                  value={formData.hr_count || ''}
                  onChange={handleChange}
                min={1}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {formData.status === 'Call Postponed' && formData.callback_date && (
              <div className="mb-6 p-4 bg-teal-900/20 border border-teal-600 rounded">
                <p className="text-teal-400">
                  <strong>Callback scheduled:</strong> {formData.callback_date} at {formData.callback_time || '09:00 AM'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(true)}
                  className="mt-2 text-sm text-primary hover:text-primary/80"
                >
                  Change Date/Time
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Transport
                </label>
                <select
                  name="transport"
                  value={formData.transport || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Transport</option>
                  {TRANSPORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Internship
                </label>
                <select
                  name="internship"
                  value={formData.internship || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select</option>
                  {INTERNSHIP_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div></div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-heading mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Member Email*
                </label>
                <input
                  type="email"
                  name="member_email"
                  value={formData.member_email || ''}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-muted-foreground cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-2">
                  Incharge Email*
                </label>
                <input
                  type="email"
                  name="incharge_email"
                  value={formData.incharge_email || ''}
                  className="w-full px-3 py-2 bg-muted border border-border rounded text-muted-foreground cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-heading mb-2">
                Comments
              </label>
              <textarea
                name="remark"
                value={formData.remark || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={5}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded mb-6 transition"
            >
              {loading ? 'Updating...' : 'Update HR Record'}
            </button>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <Link
              href="/dashboard"
              className="text-heading hover:text-heading/90 font-semibold"
            >
              Back to HR Database
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-muted disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold transition"
            >
              Delete HR Record
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-heading mb-4">Transfer HR Contact</h2>
            
            <div className="mb-4 p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground mb-1">Current Assignment</p>
              <p className="font-semibold text-heading">{formData.member_name}</p>
              <p className="text-sm text-foreground">{formData.member_email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-heading mb-2">
                Transfer to:
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a team member...</option>
                {teamMembers
                  .filter(member => member.email !== formData.member_email)
                  .map((member) => (
                    <option key={member.email} value={member.email}>
                      {member.name} ({member.incharge})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedMember('');
                }}
                disabled={transferLoading}
                className="flex-1 px-4 py-2 border border-input rounded text-foreground hover:bg-accent font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={transferLoading || !selectedMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold transition"
              >
                {transferLoading ? 'Transferring...' : 'Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full flex overflow-hidden">
            <div className="flex-1 p-8 bg-muted">
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  className="p-2 hover:bg-accent rounded"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  ‹
                </button>
                <h2 className="text-xl font-bold text-heading">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  type="button"
                  className="p-2 hover:bg-accent rounded"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-heading">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-card-foreground">
                {renderCalendar()}
              </div>

              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="mt-6 w-full py-2 text-muted-foreground hover:bg-accent rounded font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="flex-1 p-8 bg-card border-l border-border">
              <h2 className="text-xl font-bold text-heading mb-6">Set Time</h2>

              <div className="flex justify-center items-center mb-8">
                <div className="relative w-48 h-48 rounded-full border-8 border-border">
                  <div className="absolute top-1/2 left-1/2 w-1 h-20 bg-border origin-bottom -translate-x-1/2 -translate-y-full rotate-30"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-red-500 origin-bottom -translate-x-1/2 -translate-y-full rotate-180"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-border rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mb-6">
                <select
                  value={selectedTime.hour}
                  onChange={(e) => setSelectedTime({ ...selectedTime, hour: e.target.value })}
                  className="px-4 py-2 border border-input rounded text-card-foreground font-semibold bg-background"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>

                <select
                  value={selectedTime.minute}
                  onChange={(e) => setSelectedTime({ ...selectedTime, minute: e.target.value })}
                  className="px-4 py-2 border border-input rounded text-card-foreground font-semibold bg-background"
                >
                  {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={selectedTime.period}
                  onChange={(e) => setSelectedTime({ ...selectedTime, period: e.target.value })}
                  className="px-4 py-2 border border-input rounded text-card-foreground font-semibold bg-background"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSetCallbackDateTime}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold"
              >
                Set Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}