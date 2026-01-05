'use client';

import React, { useState } from 'react';

interface Props {
  contactId: number;
  contactName?: string;
  company?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function CallPostponeModal({
  contactId,
  contactName,
  company,
  onClose,
  onSaved,
}: Props) {
  const [date, setDate] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const messageDefault = `Follow-up: ${contactName ?? 'Contact'} – ${company ?? ''}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      alert('Please pick a callback date');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contact_id: contactId,
          message: messageDefault,
          callback_date: date, 
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Failed to save: ' + (err?.error ?? res.statusText));
        setSaving(false);
        return;
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Unexpected error saving notification');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-sm rounded bg-white p-6 shadow-lg"
      >
        <h3 className="mb-2 text-lg font-semibold">Call postponed — Pick callback date</h3>

        <label className="mb-1 block text-sm">Callback date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
          required
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-3 py-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-purple-600 px-3 py-1 text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}