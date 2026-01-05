import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import SearchClient from './SearchClient';

export default async function SearchPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  const user: any = verifyJWT(token);
  if (!user) redirect('/login');

  const result = await db.query(
    `SELECT * FROM hr_contacts ORDER BY created_at DESC`
  );

  const contacts = result.rows;

  return (
    <div
      className="min-h-screen bg-[#0B0F05] px-6 py-10 text-white"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Search HR Contacts
        </h1>

        <SearchClient contacts={contacts} />

        <div className="pt-6 flex justify-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-6 py-3 text-base font-medium hover:bg-gray-800 transition"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to HR Database
          </a>
        </div>
      </div>
    </div>
  );
}