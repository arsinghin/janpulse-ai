import { DashboardMetrics } from '@/lib/types';
import { Activity, Flame, MapPin, Users, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export default function KPICards({ metrics }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Citizen Signals',
      value: metrics.totalSignals.toLocaleString(),
      subtext: 'Multilingual reports ingested',
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200/60',
    },
    {
      label: 'Active Hotspots',
      value: metrics.activeHotspots.toString(),
      subtext: 'Geospatial failure clusters',
      icon: Flame,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200/60',
    },
    {
      label: 'Districts Covered',
      value: metrics.districtsCovered.toString(),
      subtext: 'Across 10 Indian states',
      icon: MapPin,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/60',
    },
    {
      label: 'Estimated Citizens Affected',
      value: `~${metrics.estimatedAffectedCitizens.toLocaleString()}`,
      subtext: 'Impacted community population',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200/60',
    },
    {
      label: 'High/Critical Urgency',
      value: metrics.highUrgencyCount.toString(),
      subtext: 'Requires rapid intervention',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`bg-white rounded-xl p-4 border ${card.border} shadow-xs space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 line-clamp-1">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
