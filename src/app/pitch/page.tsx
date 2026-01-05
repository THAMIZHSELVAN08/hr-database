'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Will I be paid for the event?',
    answer:
      "As this is a student-organized event, we regret that we don't have the means to offer any payment. However, we greatly value your participation. Your support would be invaluable to our students (Sir/Ma'am).",
  },
  {
    question: 'What benefits does an HR gain from attending mock placements?',
    answer:
      'HR professionals can leverage mock placements to assess candidate suitability, provide feedback, evaluate cultural fit, identify talent, network amongst HRs, and contribute to employee development.',
  },
  {
    question: 'Can the timings be adjusted?',
    answer:
      "Yes sure (Sir/Ma'am), the timing can be tailored to meet your requirements.",
  },
  {
    question: 'What arrangements do you offer?',
    answer:
      "If you choose to attend online, the event will be held in Google Meet with break-out rooms. The arrangements can be tailored according to your preferences (ma'am or sir). If you choose to attend offline, we will arrange for a cab to and from our college, as well as breakfast, lunch, and refreshments (ma'am or sir).",
  },
  {
    question: 'Are these actual placements?',
    answer:
      "No (Sir/Ma'am), this is only a mock placement where we provide our students with an interview-like experience.",
  },
  {
    question: 'For whom is this event being held?',
    answer:
      'This event is held for pre-final year students to prepare them for upcoming placements.',
  },
  {
    question: 'What advantages do the students gain?',
    answer:
      "Mock placements build students' confidence and interview skills, provide actionable feedback for improvement, offer industry insights, and establish a competitive advantage in the job market.",
  },
  {
    question: 'What courses are offered by the college?',
    answer:
      'A total of 11 courses are offered, namely CS, IT, AI, ECE, EEE, MECH, MECH AND AUTO, BIOTECH, CIVIL, and CHEMICAL.',
  },
  {
    question: 'How many students attend the event?',
    answer:
      'Over 900 pre-final students attend the event every year.',
  },
  {
    question: 'What are the companies that are usually in attendance?',
    answer:
      'Amazon, Hyundai, HTC, Schneider, and many more are seen in attendance.',
  },
];

export default function HRCallingScript() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>('Student Name');
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [backUrl, setBackUrl] = useState<string>('/dashboard');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const displayName = data.name || data.username || data.email || 'Student Name';
          setStudentName(displayName);
          setUserRole(data.role || '');
          setUserEmail(data.email || '');

          const allowedEmails = ['2023ee0724@svce.ac.in', '2023cs0051@svce.ac.in'];
          const isAllowedAdmin = allowedEmails.includes(data.email);
          
          if (data.role === 'super_admin' && !isAllowedAdmin) {
            setBackUrl('/admin/dashboard');
          } else if (data.role === 'admin') {
            setBackUrl('/dashboard/team-stats');
          } else {
            setBackUrl('/dashboard');
          }
        } else {
          const name = localStorage.getItem('studentName') || sessionStorage.getItem('studentName') || 'Student Name';
          setStudentName(name);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        const name = localStorage.getItem('studentName') || sessionStorage.getItem('studentName') || 'Student Name';
        setStudentName(name);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-12 relative">
      <button
        onClick={() => router.push(backUrl)}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2 px-5 py-3 bg-card hover:bg-accent text-card-foreground rounded-lg border border-border transition-all shadow-lg group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-base font-medium">Back to Dashboard</span>
      </button>

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <h1 className="text-4xl md:text-5xl font-bold text-card-foreground mb-6">
            HR Calling Script
          </h1>

          <div className="bg-muted border-l-4 border-primary p-4 mb-8">
            <p className="text-lg font-semibold text-primary">
              Call the HR (Office Hours: 9 AM to 4 PM)
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg">
              Good Morning/Good Afternoon. Am I speaking to (Mr./Ms.) (HR Name) from (COMPANY NAME)?
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-card-foreground underline">If yes</h2>
              <p className="text-lg leading-relaxed">
                Hello, (Sir/Ma'am). My name is{' '}
                {loading ? (
                  <span className="font-bold text-primary">Loading...</span>
                ) : (
                  <span className="font-bold text-primary">{studentName}</span>
                )}{' '}
                and I am calling on behalf of Mr. Muraleedharan, Chief Placement Officer of Sri Venkateswara College of Engineering, Sriperumbudur. Could I please borrow 5 minutes of your time?
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-card-foreground underline">If no</h2>
              <p className="text-lg">
                I am so sorry for the disturbance, (Sir/Ma'am). What time is suitable to call you back?
              </p>
              <p className="font-bold text-yellow-500">
                (Note down the time)
              </p>
              <p className="text-lg">
                Thank you, (Sir/Ma'am).
              </p>
              <p className="font-bold text-yellow-500">
                (End Call)
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-bold text-card-foreground underline">If yes</h2>
              
              <p className="text-lg leading-relaxed">
                Sir/Ma'am, we're organizing an event called the "MOCK PLACEMENTS" at our college. The event is conducted exclusively for the pre-final year students of our college, to help them prepare for their actual placements that will be held next academic year. Through this initiative, the students participate in a one-on-one interview-like setting with HR professionals, allowing them to understand the industry requirements and improve their interview skills.
              </p>

              <p className="text-lg leading-relaxed">
                We've been organizing this event successfully for the past 17 years by inviting HRs and company executives to interview our pre-final-year students in a mock placement setting, with over 100 HR professionals participating every year.
              </p>

              <p className="text-lg leading-relaxed">
                This year, we're having the event in both online and offline modes. The online event is held on the 8th of March, and the offline event is held on the 15th of March, both of which fall on a Sunday. It'll begin at 9:30 AM and will conclude by 3:00 PM.
              </p>

              <p className="text-lg leading-relaxed">
                If you choose to attend our offline event, you will be provided with breakfast, lunch, and refreshments. Transportation will be arranged to and from our college as well.
              </p>

              <p className="text-lg leading-relaxed">
                If you prefer our online event, it'll be held on Google Meet using breakout rooms. Based on your availability and preferences, timings and other arrangements can be tailored accordingly.
              </p>

              <p className="text-lg leading-relaxed">
                We would be honoured if you could participate and share your expertise to help our students prepare for their actual placements.
              </p>

              <div className="space-y-3 mt-6">
                <p className="text-lg leading-relaxed">
                  Do you have any questions for me, (Sir/Ma'am)?
                </p>
                
                <p className="text-muted-foreground text-base italic">
                  (Refer FAQs)
                </p>
                
                <p className="text-lg leading-relaxed">
                  Could I please have your E-Mail ID to send you a formal invite?
                </p>
                
                <p className="font-bold text-yellow-500">
                  (Note down the mail ID)
                </p>
                
                <p className="text-lg leading-relaxed">
                  We will send you an email regarding the event details in a short while.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Thank you so much for your time and patience. Have a nice day (Sir/Ma'am).
                </p>
                
                <p className="font-bold text-yellow-500">
                  (End Call)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {FAQ_DATA.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
              >
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between bg-muted hover:bg-accent transition-colors"
                >
                  <span className="text-lg font-semibold text-card-foreground text-left">
                    {item.question}
                  </span>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-primary shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div className="px-6 py-5 bg-card border-t border-border">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}