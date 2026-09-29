import { Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-2 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <p>
            <strong className="font-semibold">Prototype Demonstration Data:</strong> All complaints, cluster
            metrics, and priority scores are synthetic demonstrations for Hack2Skill{' '}
            <span className="font-medium underline decoration-amber-400">Build with AI: Code for Communities (Track 1)</span>.
            Priority scores provide decision support, not official government orders.
          </p>
        </div>
        <span className="hidden lg:inline text-[11px] font-mono text-amber-700/80 shrink-0">
          Vercel Serverless Ready
        </span>
      </div>
    </div>
  );
}
