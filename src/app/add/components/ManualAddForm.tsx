'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TEAMS, getTeamDataByEmail } from './TeamData';

const INTERVIEW_MODES = ['Select Mode', 'Online', 'Offline', 'Both'];
const STATUS_OPTIONS = [
  'Select Status',
  'Awaiting Response',
  'Accepted Invite',
  'Email Sent',
  'Called Declined',
  'Emailed Declined',
  'Blacklisted',
  'Wrong Number',
  'Call Postponed',
  'Not Reachable',
];
const TRANSPORT_OPTIONS = ['None', 'Own', 'Required'];
const INTERNSHIP_OPTIONS = ['Yes', 'No'];

export default function ManualAddForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [inchargeEmail, setInchargeEmail] = useState('');
  const [inchargeName, setInchargeName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    hr_name: '',
    phone: '',
    email: '',
    interview_mode: 'Select Mode',
    company: '',
    member_name: '',
    member_email: '',
    incharge: '',
    incharge_email: '',
    status: 'Select Status',
    hr_count: '1',
    transport: '',
    address: '',
    internship: 'No',
    remark: '',
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const user = await res.json();
          setUserEmail(user.email);
          setUserName(user.name);

          const teamData = getTeamDataByEmail(user.email);
          if (teamData) {
            setFormData((prev) => ({
              ...prev,
              member_name: user.name,
              member_email: user.email,
              incharge: teamData.incharge,
              incharge_email: teamData.inchargeEmail,
            }));
            setInchargeEmail(teamData.inchargeEmail);
            setInchargeName(teamData.incharge);
          } else {
            setFormData((prev) => ({
              ...prev,
              member_name: user.name,
              member_email: user.email,
            }));
            setInchargeEmail('');
            setInchargeName('');
          }
        }
      } catch (err) {
        console.error('Failed to get user info', err);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          hr_name: '',
          phone: '',
          email: '',
          interview_mode: 'Online',
          company: '',
          member_name: userName,
          member_email: userEmail,
          incharge: inchargeName,
          incharge_email: inchargeEmail,
          status: 'Awaiting Response',
          hr_count: '1',
          transport: 'None',
          address: '',
          internship: 'No',
          remark: '',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setError(data.error || 'Failed to add HR');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-10 shadow-2xl" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
        <div className="flex items-center justify-center py-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-10 shadow-2xl" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      <h2 className="text-3xl font-semibold text-card-foreground mb-8 tracking-tight">Add New HR Record</h2>

      {error && (
        <div className="mb-6 p-5 bg-red-900/20 border border-red-600/50 rounded-xl text-red-300 shadow-lg shadow-red-900/10">
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-5 bg-blue-900/20 border border-blue-600/50 rounded-xl text-blue-300 shadow-lg shadow-blue-900/10">
          <p className="font-medium text-sm">✅ HR Record added successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <h3 className="text-base font-semibold text-card-foreground mb-4 tracking-tight">HR Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                HR Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="hr_name"
                value={formData.hr_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                placeholder="Enter HR name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-card-foreground mb-4 tracking-tight">Company & Interview Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Interview Mode
              </label>
              <select
                name="interview_mode"
                value={formData.interview_mode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
              >
                {INTERVIEW_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                required
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-card-foreground mb-4 tracking-tight">Member & Team Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Member <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="member_name"
                value={formData.member_name}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Member Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="member_email"
                value={formData.member_email}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Incharge <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="incharge"
                value={formData.incharge}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Incharge Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="incharge_email"
                value={formData.incharge_email}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-card-foreground mb-4 tracking-tight">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                HR Count <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="hr_count"
                value={formData.hr_count}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Transport
              </label>
              <select
                name="transport"
                value={formData.transport}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
              >
                {TRANSPORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
                Internship
              </label>
              <select
                name="internship"
                value={formData.internship}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
              >
                {INTERNSHIP_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2.5 tracking-wide">
              Comments
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 resize-none"
              rows={4}
              placeholder="Add any additional notes or comments..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-medium py-4 rounded-xl transition-all duration-200 shadow-lg hover:scale-[1.01] disabled:hover:scale-100"
        >
          {loading ? 'Adding HR Record...' : 'Add HR Record'}
        </button>
      </form>
    </div>
  );
}