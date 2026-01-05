import { db } from '@/lib/db';

const FOLLOW_UP_KEYWORDS = [
  'call tomorrow',
  'follow up',
  'call back',
  'mail later',
  'reconnect',
];

const FOLLOW_UP_STATUSES = [
  'Awaiting Response',
  'Call Postponed',
  'Not Reachable',
];

const RESOLVED_STATUSES = [
  'Accepted Invite',
  'Email Sent',
  'Called Declined',
  'Emailed Declined',
  'Blacklisted',
];

export async function handleNotification({
  contactId,
  hrName,
  company,
  status,
  remark,
}: {
  contactId: number;
  hrName: string;
  company: string;
  status: string;
  remark: string | null;
}) {
  const remarkLower = remark?.toLowerCase() ?? '';

  const hasKeyword = FOLLOW_UP_KEYWORDS.some(k =>
    remarkLower.includes(k)
  );

  const shouldCreate =
    FOLLOW_UP_STATUSES.includes(status) || hasKeyword;

  const shouldResolve =
    RESOLVED_STATUSES.includes(status);

  if (shouldCreate) {
    const message = `Follow-up: ${hrName} – ${company}`;

    await db.query(
      `
      INSERT INTO notifications (contact_id, message)
      VALUES ($1, $2)
      `,
      [contactId, message]
    );
  }

  if (shouldResolve) {
    await db.query(
      `
      UPDATE notifications
      SET read = true
      WHERE contact_id = $1 AND read = false
      `,
      [contactId]
    );
  }
}
