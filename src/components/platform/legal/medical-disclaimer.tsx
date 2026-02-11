'use client';

export default function MedicalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mt-6 rounded-md border border-warning/40 bg-warning px-4 py-3 text-sm text-warning ${className}`}
    >
      The content and AI insights provided by EKA Account are for informational and educational
      purposes only and do not constitute medical, psychological, or professional advice. If you are
      experiencing a medical or mental health emergency, call your local emergency number
      immediately.
    </div>
  );
}
