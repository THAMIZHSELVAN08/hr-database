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
    <div className="bg-card rounded-2xl border border-border p-10 shadow-2xl" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
      {!loading && !result && (
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                : 'border-border bg-muted/30 hover:border-border/80 hover:bg-muted/40'
            }`}
          >
            <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-5" strokeWidth={1.5} />
            <p className="text-card-foreground mb-2 text-lg font-medium tracking-tight">
              Select a CSV file to upload
            </p>
            <p className="text-muted-foreground text-sm mb-8 font-normal">or drag and drop it here</p>

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
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg hover:scale-[1.02]"
            >
              Choose CSV File
            </label>
          </div>

          <button
            onClick={downloadTemplate}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:scale-[1.01]"
          >
            Download CSV Template
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-card-foreground text-lg font-medium mb-2">Uploading file...</p>
          <p className="text-muted-foreground text-sm font-normal">{fileName}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={resetUpload}
              className="text-muted-foreground hover:text-card-foreground transition-colors duration-200 p-2 hover:bg-accent rounded-lg"
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
                <div className="bg-muted border border-border rounded-xl p-6 text-center hover:border-border/80 transition-colors duration-200">
                  <p className="text-4xl font-bold text-green-400 mb-2 tracking-tight">{result.inserted || 0}</p>
                  <p className="text-muted-foreground text-sm font-medium">Records Inserted</p>
                </div>

                {result.duplicates?.length > 0 && (
                  <div className="bg-muted border border-border rounded-xl p-6 text-center hover:border-border/80 transition-colors duration-200">
                    <p className="text-4xl font-bold text-yellow-400 mb-2 tracking-tight">
                      {result.duplicates.length}
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">Duplicates</p>
                  </div>
                )}

                {result.errors?.length > 0 && (
                  <div className="bg-muted border border-border rounded-xl p-6 text-center hover:border-border/80 transition-colors duration-200">
                    <p className="text-4xl font-bold text-red-400 mb-2 tracking-tight">
                      {result.errors.length}
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">Errors</p>
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

              <div className="flex gap-4 pt-6 border-t border-border">
                <button
                  onClick={resetUpload}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:scale-[1.01]"
                >
                  Upload Another File
                </button>
                <button
                  onClick={downloadTemplate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:scale-[1.01]"
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