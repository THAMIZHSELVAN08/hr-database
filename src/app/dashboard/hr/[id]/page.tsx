import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import Link from 'next/link';

export default async function HRDetailPage({ params }: { params: { id: string } }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  const user: any = verifyJWT(token);
  if (!user) redirect('/login');


  const query = `
    SELECT 
      hr_contacts.*,
      uploader.name as member_name,
      uploader.email as member_email,
      admin.name as incharge,
      admin.email as incharge_email
    FROM hr_contacts
    LEFT JOIN users uploader ON hr_contacts.uploaded_by = uploader.id
    LEFT JOIN users admin ON hr_contacts.team_id = admin.team_id AND admin.role = 'admin'
    WHERE hr_contacts.id = $1
  `;

  const result = await db.query(query, [params.id]);
  
  if (result.rows.length === 0) {
    redirect('/dashboard');
  }

  const contact = result.rows[0];


  if (user.role === 'member' && contact.uploaded_by !== user.id) {
    redirect('/dashboard');
  }

  if (user.role === 'admin' && contact.team_id !== user.team_id) {
    redirect('/dashboard');
  }

  return (
    <div 
      className="p-8"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >

      <div className="mb-8">
        <Link 
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium mb-4 inline-flex items-center"
        >
          ← Back to Dashboard
        </Link>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
          HR Contact Details
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              contact.status === 'Awaiting Response' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
              contact.status === 'Email Sent' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              contact.status === 'Call Postponed' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' :
              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            }`}>
              {contact.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</label>
                <p className="mt-1 text-gray-900 dark:text-white">{contact.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</label>
                <p className="mt-1">
                  {contact.website ? (
                    <a 
                      href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {contact.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
              </div>
            </div>
          </div>


          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              HR Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="mt-1 text-gray-900 dark:text-white">{contact.hr_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="mt-1">
                  <a 
                    href={`mailto:${contact.hr_email}`}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {contact.hr_email}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="mt-1">
                  {contact.hr_phone ? (
                    <a 
                      href={`tel:${contact.hr_phone}`}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {contact.hr_phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</label>
                <p className="mt-1">
                  {contact.linkedin ? (
                    <a 
                      href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      View Profile
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
              </div>
            </div>
          </div>


          {contact.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {contact.notes}
              </p>
            </div>
          )}


          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tracking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded By</label>
                <p className="mt-1 text-gray-900 dark:text-white">{contact.member_name || 'Unknown'}</p>
                {contact.member_email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contact.member_email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Team In-charge</label>
                <p className="mt-1 text-gray-900 dark:text-white">{contact.incharge || 'N/A'}</p>
                {contact.incharge_email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contact.incharge_email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(contact.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(contact.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <Link
            href={`/dashboard/hr/${contact.id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Edit Contact
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}