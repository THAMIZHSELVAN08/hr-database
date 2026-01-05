'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function CSVUpload() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!file.name.endsWith('.csv')) {
      setResult({ error: 'Please upload a CSV file' });
      return;
    }

    setLoading(true);
    setFileName(file.name);
    setResult(null);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Upload failed. Please try again.' });
    }
    setLoading(false);
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'HR Name,Phone,Company,Email\nHello,9876543210,ABC,hello@gmail.com';
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    );
    element.setAttribute('download', 'hr_contacts_template.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetUpload = () => {
    setResult(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800/50 p-10 shadow-2xl" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      {!loading && !result && (
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/20'
                : 'border-gray-700/50 bg-gray-900/30 hover:border-gray-600/50 hover:bg-gray-900/40'
            }`}
          >
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-5" strokeWidth={1.5} />
            <p className="text-gray-200 mb-2 text-lg font-medium tracking-tight">
              Select a CSV file to upload
            </p>
            <p className="text-gray-500 text-sm mb-8 font-normal">or drag and drop it here</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-input"
            />
            <label
              htmlFor="csv-input"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02]"
            >
              Choose CSV File
            </label>
          </div>

          <button
            onClick={downloadTemplate}
            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:scale-[1.01]"
          >
            Download CSV Template
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-200 text-lg font-medium mb-2">Uploading file...</p>
          <p className="text-gray-500 text-sm font-normal">{fileName}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          {result.error ? (
            <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-7 shadow-lg shadow-red-900/10">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-7 h-7 text-red-400" strokeWidth={2} />
                <p className="text-red-300 font-semibold text-lg tracking-tight">Upload Failed</p>
              </div>
              <p className="text-red-300/90 text-sm font-normal ml-10">{result.error}</p>
            </div>
          ) : (
            <>
              <div className="bg-green-900/20 border border-green-600/50 rounded-xl p-7 shadow-lg shadow-green-900/10">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-7 h-7 text-green-400" strokeWidth={2} />
                  <p className="text-green-300 font-semibold text-lg tracking-tight">Upload Complete</p>
                </div>
                <p className="text-green-300/90 text-sm font-normal ml-10">{fileName}</p>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-center hover:border-gray-600/50 transition-colors duration-200">
                  <p className="text-4xl font-bold text-green-400 mb-2 tracking-tight">{result.inserted || 0}</p>
                  <p className="text-gray-400 text-sm font-medium">Records Inserted</p>
                </div>

                {result.duplicates?.length > 0 && (
                  <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-center hover:border-gray-600/50 transition-colors duration-200">
                    <p className="text-4xl font-bold text-yellow-400 mb-2 tracking-tight">
                      {result.duplicates.length}
                    </p>
                    <p className="text-gray-400 text-sm font-medium">Duplicates</p>
                  </div>
                )}

                {result.errors?.length > 0 && (
                  <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-center hover:border-gray-600/50 transition-colors duration-200">
                    <p className="text-4xl font-bold text-red-400 mb-2 tracking-tight">
                      {result.errors.length}
                    </p>
                    <p className="text-gray-400 text-sm font-medium">Errors</p>
                  </div>
                )}
              </div>

              {result.errors?.length > 0 && (
                <div className="bg-red-900/10 border border-red-700/50 rounded-xl p-6">
                  <p className="text-red-300 font-semibold mb-4 text-base tracking-tight">Error Details:</p>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {result.errors.map((error: any, idx: number) => (
                      <div key={idx} className="text-red-300/90 text-sm bg-red-900/10 p-3 rounded-lg border border-red-800/30">
                        <p className="font-semibold mb-1">Row {error.row}:</p>
                        <p className="text-red-400/90 font-normal">{error.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-800/50">
                <button
                  onClick={resetUpload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.01]"
                >
                  Upload Another File
                </button>
                <button
                  onClick={downloadTemplate}
                  className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:scale-[1.01]"
                >
                  Download Template
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}