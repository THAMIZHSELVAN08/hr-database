'use client';

import { useEffect, useRef } from 'react';
import { STATUS_COLORS } from '@/lib/statusColors';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    'Awaiting Response': number;
    'Accepted Invite': number;
    'Email Sent': number;
    'Called Declined': number;
    'Emailed Declined': number;
    'Blacklisted': number;
    'Wrong Number': number;
    'Call Postponed': number;
    'Not Reachable': number;
  };
}

export default function StatsModal({ isOpen, onClose, stats }: StatsModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = STATUS_COLORS;

  const totalContacts = Object.values(stats).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const card = `rgb(${style.getPropertyValue('--card').trim()})`;
    const foreground = `rgb(${style.getPropertyValue('--foreground').trim()})`;
    const muted = `rgb(${style.getPropertyValue('--muted-foreground').trim()})`;
    const border = `rgb(${style.getPropertyValue('--border').trim()})`;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = -Math.PI / 2;

    Object.entries(stats).forEach(([status, count]) => {
      if (count === 0) return;

      const sliceAngle = (count / totalContacts) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[status as keyof typeof colors];
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = card;
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = foreground;
    ctx.font = 'bold 36px Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(totalContacts.toString(), centerX, centerY - 15);
    
    ctx.font = '15px Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText('Total Contacts', centerX, centerY + 20);
  }, [isOpen, stats, totalContacts, colors]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
      style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div
        className="bg-card border border-border rounded-2xl p-8 max-w-5xl w-full mx-6 max-h-[90vh] overflow-y-auto shadow-2xl text-card-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-heading">Contact Statistics</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex items-center justify-center bg-muted rounded-xl p-8">
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-heading mb-6">Status Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(stats).map(([status, count]) => {
                const percentage = totalContacts > 0 ? ((count / totalContacts) * 100).toFixed(1) : '0.0';
                return (
                  <div key={status} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded shadow-sm border border-border"
                        style={{ backgroundColor: colors[status as keyof typeof colors] }}
                      />
                      <span className="text-sm font-medium text-card-foreground">{status}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground min-w-12 text-right">{percentage}%</span>
                      <span className="text-sm font-semibold text-card-foreground min-w-12 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}