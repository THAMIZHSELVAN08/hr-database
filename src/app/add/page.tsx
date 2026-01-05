'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, UserPlus, ArrowLeft } from 'lucide-react';
import CSVUpload from './components/CSVUpload';
import ManualAddForm from './components/ManualAddForm';

export default function AddHRPage() {
  const [tab, setTab] = useState<'csv' | 'manual'>('csv');
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-white mb-3 tracking-tight">Add HR Records</h1>
        <p className="text-gray-400 text-base font-normal">Choose your preferred method to add new HR contacts to the database</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab('csv')}
          className={`group relative px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
            tab === 'csv'
              ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 border border-gray-800/50 hover:border-gray-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet 
              className={`w-5 h-5 transition-transform duration-300 ${tab === 'csv' ? 'scale-110' : 'group-hover:scale-105'}`} 
              strokeWidth={2}
            />
            <span className="tracking-tight">Upload CSV</span>
          </div>
          {tab === 'csv' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-400 to-blue-400 rounded-full"></div>
          )}
        </button>

        <button
          onClick={() => setTab('manual')}
          className={`group relative px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
            tab === 'manual'
              ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 border border-gray-800/50 hover:border-gray-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserPlus 
              className={`w-5 h-5 transition-transform duration-300 ${tab === 'manual' ? 'scale-110' : 'group-hover:scale-105'}`} 
              strokeWidth={2}
            />
            <span className="tracking-tight">Add Manually</span>
          </div>
          {tab === 'manual' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-400 to-blue-400 rounded-full"></div>
          )}
        </button>
      </div>

      <div className="transition-all duration-300 mb-8">
        {tab === 'csv' && <CSVUpload />}
        {tab === 'manual' && <ManualAddForm />}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800/50">
        <button
          onClick={handleBackToDashboard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200 border border-gray-800/50 hover:border-gray-700/50"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}