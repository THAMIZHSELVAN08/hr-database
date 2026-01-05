'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loginStatus = searchParams.get('login');
    const user = searchParams.get('username');

    if (loginStatus === 'success' && user) {
      setUsername(user);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      url.searchParams.delete('username');
      router.replace(url.pathname);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-9999 animate-slide-down"
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[320px]">
        <div className="shrink-0">
          <svg 
            className="w-6 h-6 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-green-800 font-semibold text-base">
            Login successful, {username.toUpperCase()}!
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="shrink-0 text-green-600 hover:text-green-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}