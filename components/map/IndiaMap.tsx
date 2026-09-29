'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InfrastructureHotspot } from '@/lib/types';
import {
  projectIndia,
  coordsToSvgPath,
  INDIAN_STATES,
  INDIA_COASTLINE_OUTLINE,
  MAP_WIDTH,
  MAP_HEIGHT,
  StateRegion,
} from './india-geo-data';
import { MapPin, ArrowUpRight, Compass, Layers } from 'lucide-react';

interface IndiaMapProps {
  hotspots: InfrastructureHotspot[];
  selectedHotspotId?: string;
  onSelectHotspot?: (hotspot: InfrastructureHotspot) => void;
  className?: string;
}

export default function IndiaMap({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  className = '',
}: IndiaMapProps) {
  const router = useRouter();
  const [hoveredHotspot, setHoveredHotspot] = useState<InfrastructureHotspot | null>(null);
  const [hoveredState, setHoveredState] = useState<StateRegion | null>(null);

  const handleMarkerClick = (hotspot: InfrastructureHotspot) => {
    if (onSelectHotspot) {
      onSelectHotspot(hotspot);
    } else {
      router.push(`/hotspots/${hotspot.id}`);
    }
  };

  const getMarkerColor = (score: number) => {
    if (score >= 80) {
      return {
        fill: '#dc2626',
        ring: 'rgba(220, 38, 38, 0.45)',
        badge: 'bg-red-950/90 text-red-300 border-red-800',
        text: 'text-red-400',
      };
    }
    if (score >= 70) {
      return {
        fill: '#ea580c',
        ring: 'rgba(234, 88, 12, 0.45)',
        badge: 'bg-amber-950/90 text-amber-300 border-amber-800',
        text: 'text-amber-400',
      };
    }
    return {
      fill: '#2563eb',
      ring: 'rgba(37, 99, 235, 0.45)',
      badge: 'bg-blue-950/90 text-blue-300 border-blue-800',
      text: 'text-blue-400',
    };
  };

  // Find active state of currently selected or hovered hotspot
  const activeHotspotStateName = (hoveredHotspot || hotspots.find(h => h.id === selectedHotspotId))?.state;

  return (
    <div className={`relative bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 select-none ${className}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-lg border border-slate-700/80 shadow-md max-w-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            National Infrastructure Hotspot Grid
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          Geospatial clusters plotted with Albers Conic projection across 10 Indian states.
        </p>
        {activeHotspotStateName && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Inspecting Region:</span>
            <span className="font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
              {activeHotspotStateName}
            </span>
          </div>
        )}
      </div>

      {/* Compass / Maritime Indicator */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-300">
        <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
        <span className="font-mono text-[10px] text-slate-400">EPSG:7755 · 82°E Central</span>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-700/80 text-[11px] text-slate-300 space-y-1.5 shadow-md">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Priority Severity</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-400/40 inline-block shrink-0" />
          <span className="text-slate-200 font-medium">Critical (80–100)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-400/40 inline-block shrink-0" />
          <span className="text-slate-200 font-medium">High (70–79)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-400/40 inline-block shrink-0" />
          <span className="text-slate-200 font-medium">Moderate (&lt;70)</span>
        </div>
      </div>

      {/* SVG Canvas with India Projection */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-auto max-h-[660px] select-none"
      >
        <defs>
          {/* Deep oceanic gradient */}
          <radialGradient id="oceanBg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>

          {/* Mainland contour drop shadow */}
          <filter id="landGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.25" />
          </filter>

          {/* Active pulse gradient */}
          <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ocean Background */}
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanBg)" />

        {/* Maritime / Waterbody subtle labels */}
        <text x="70" y="470" fill="#334155" fontSize="10" fontWeight="700" letterSpacing="2" opacity="0.4">
          ARABIAN SEA
        </text>
        <text x="360" y="490" fill="#334155" fontSize="10" fontWeight="700" letterSpacing="2" opacity="0.4">
          BAY OF BENGAL
        </text>
        <text x="180" y="635" fill="#334155" fontSize="9" fontWeight="700" letterSpacing="2" opacity="0.4">
          INDIAN OCEAN
        </text>

        {/* India Continental Base Outline */}
        <path
          d={INDIA_COASTLINE_OUTLINE}
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#landGlow)"
        />

        {/* Individual Indian State Polygons with Distinct Borders */}
        <g id="indian-states-layer">
          {INDIAN_STATES.map((state) => {
            const pathData = coordsToSvgPath(state.coordinates);
            const isStateActive = activeHotspotStateName?.toLowerCase().includes(state.name.toLowerCase()) ||
              state.name.toLowerCase().includes(activeHotspotStateName?.toLowerCase() || '___');
            const isStateHovered = hoveredState?.id === state.id;

            // Center coords for state label
            const labelPos = projectIndia(state.center[0], state.center[1]);

            return (
              <g key={state.id} className="transition-all duration-200">
                <path
                  d={pathData}
                  fill={isStateActive ? '#1e3a8a' : isStateHovered ? '#334155' : '#1e293b'}
                  fillOpacity={isStateActive ? 0.6 : isStateHovered ? 0.8 : 0.4}
                  stroke={isStateActive ? '#60a5fa' : '#475569'}
                  strokeWidth={isStateActive ? 1.8 : 1}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-colors duration-200"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* State Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fill={isStateActive ? '#93c5fd' : '#94a3b8'}
                  fontSize={isStateActive ? '10' : '8.5'}
                  fontWeight={isStateActive ? '700' : '600'}
                  letterSpacing="0.5"
                  opacity={isStateActive ? 0.95 : 0.6}
                  className="pointer-events-none select-none"
                >
                  {state.shortName}
                </text>
              </g>
            );
          })}
        </g>

        {/* Hotspot Markers placed with exact Albers Conic projection */}
        <g id="hotspot-markers-layer">
          {hotspots.map((hotspot) => {
            const { x, y } = projectIndia(
              hotspot.coordinates.lat,
              hotspot.coordinates.lng
            );

            const isSelected = selectedHotspotId === hotspot.id;
            const isHovered = hoveredHotspot?.id === hotspot.id;
            const colors = getMarkerColor(hotspot.priorityScore);

            // Scale marker radius by report volume: ~10px to ~20px
            const markerRadius = Math.min(20, Math.max(10, Math.round(Math.sqrt(hotspot.reportCount) * 3.1)));

            return (
              <g
                key={hotspot.id}
                className="cursor-pointer transition-transform duration-200 group"
                transform={`translate(${x}, ${y})`}
                onClick={() => handleMarkerClick(hotspot)}
                onMouseEnter={() => setHoveredHotspot(hotspot)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                {/* Outer Pulsing Radar Ring for Critical Priority */}
                {hotspot.priorityScore >= 75 && (
                  <circle
                    r={markerRadius * 1.9}
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth="1.5"
                    opacity="0.35"
                    className="animate-ping pointer-events-none"
                  />
                )}

                {/* Halo Background */}
                <circle
                  r={markerRadius + (isSelected ? 6 : isHovered ? 4 : 2)}
                  fill={colors.ring}
                  stroke={isSelected ? '#ffffff' : colors.fill}
                  strokeWidth={isSelected ? '2.5' : '1'}
                />

                {/* Core Colored Node */}
                <circle
                  r={markerRadius}
                  fill={colors.fill}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all"
                />

                {/* Report Count inside marker */}
                <text
                  textAnchor="middle"
                  dy="3.5"
                  fill="#ffffff"
                  fontSize={markerRadius > 13 ? '11' : '9'}
                  fontWeight="700"
                  className="pointer-events-none select-none"
                >
                  {hotspot.reportCount}
                </text>

                {/* District Label next to marker for immediate geographic recognition */}
                <g className="pointer-events-none select-none">
                  {/* Backdrop pill */}
                  <rect
                    x={markerRadius + 4}
                    y="-10"
                    width={hotspot.district.length * 7 + 16}
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.85"
                    stroke="#334155"
                    strokeWidth="0.8"
                  />
                  <text
                    x={markerRadius + 12}
                    y="3"
                    fill={isSelected || isHovered ? '#60a5fa' : '#e2e8f0'}
                    fontSize="9.5"
                    fontWeight={isSelected || isHovered ? '700' : '600'}
                  >
                    {hotspot.district}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card (Tooltip) for Hotspot */}
      {hoveredHotspot && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-950/95 backdrop-blur-md text-white rounded-lg p-3.5 shadow-2xl border border-blue-500/60 w-80 transition-all transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${(projectIndia(hoveredHotspot.coordinates.lat, hoveredHotspot.coordinates.lng).x / MAP_WIDTH) * 100}%`,
            top: `${(projectIndia(hoveredHotspot.coordinates.lat, hoveredHotspot.coordinates.lng).y / MAP_HEIGHT) * 100}%`,
          }}
        >
          {/* Category & Priority Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
              {hoveredHotspot.category}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getMarkerColor(hoveredHotspot.priorityScore).badge}`}>
              Priority {hoveredHotspot.priorityScore}/100
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">
            {hoveredHotspot.title}
          </h4>

          {/* Exact Verified State and District */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">{hoveredHotspot.district}</span>
            <span className="text-slate-500">·</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-medium">
              {hoveredHotspot.state} State
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Citizen Signals</span>
              <span className="font-bold text-white text-sm">{hoveredHotspot.reportCount} reports</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Population Impact</span>
              <span className="font-bold text-white text-sm">~{hoveredHotspot.estimatedAffectedPopulation.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-blue-300 font-semibold">
            <span>Click to inspect action brief</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* State Hover Card (when hovering over a state with no hotspot hovered) */}
      {!hoveredHotspot && hoveredState && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700 text-xs text-white shadow-lg">
          <div className="font-bold text-slate-200">{hoveredState.name}</div>
          <div className="text-[11px] text-slate-400">Capital: {hoveredState.capital}</div>
        </div>
      )}
    </div>
  );
}
