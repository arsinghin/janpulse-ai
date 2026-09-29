'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InfrastructureHotspot, IssueCategory, UrgencyLevel } from '@/lib/types';
import {
  TrendingUp,
  ArrowUpDown,
  Search,
  Filter,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface HotspotTableProps {
  hotspots: InfrastructureHotspot[];
  onSelectHotspot?: (hotspot: InfrastructureHotspot) => void;
}

type SortField = 'priority' | 'reports' | 'population' | 'trend';

export default function HotspotTable({ hotspots, onSelectHotspot }: HotspotTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortAsc, setSortAsc] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique states and categories
  const states = Array.from(new Set(hotspots.map((h) => h.state)));
  const categories = Array.from(new Set(hotspots.map((h) => h.category)));

  // Filter logic
  let filtered = hotspots.filter((h) => {
    if (categoryFilter !== 'All' && h.category !== categoryFilter) return false;
    if (stateFilter !== 'All' && h.state !== stateFilter) return false;
    if (statusFilter !== 'All' && h.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        h.title.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        h.localities.some((l) => l.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    let diff = 0;
    if (sortField === 'priority') diff = a.priorityScore - b.priorityScore;
    else if (sortField === 'reports') diff = a.reportCount - b.reportCount;
    else if (sortField === 'population')
      diff = a.estimatedAffectedPopulation - b.estimatedAffectedPopulation;
    else if (sortField === 'trend') diff = a.trendPercentage - b.trendPercentage;

    return sortAsc ? diff : -diff;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getUrgencyText = (h: InfrastructureHotspot) => {
    if (h.urgencyDistribution.critical > 0) return { label: 'Critical', color: 'text-red-600 font-semibold' };
    if (h.urgencyDistribution.high > 0) return { label: 'High', color: 'text-amber-600 font-semibold' };
    return { label: 'Medium', color: 'text-blue-600 font-medium' };
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
      {/* Table Controls & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotspot, district or locality..."
              className="pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* State */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Domains</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Investigating">Investigating</option>
            <option value="Action Pending">Action Pending</option>
            <option value="Escalated">Escalated</option>
            <option value="Under Review">Under Review</option>
          </select>

          {(categoryFilter !== 'All' || stateFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStateFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort('priority')}
              >
                <div className="flex items-center gap-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Hotspot &amp; Domain</th>
              <th className="py-3 px-4">Location</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort('reports')}
              >
                <div className="flex items-center gap-1">
                  <span>Signals</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort('population')}
              >
                <div className="flex items-center gap-1">
                  <span>Affected Pop.</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort('trend')}
              >
                <div className="flex items-center gap-1">
                  <span>7D Trend</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length > 0 ? (
              filtered.map((hotspot, idx) => {
                const urgency = getUrgencyText(hotspot);
                return (
                  <tr
                    key={hotspot.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Priority Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-semibold text-xs">
                          #{idx + 1}
                        </span>
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded ${
                            hotspot.priorityScore >= 80
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : hotspot.priorityScore >= 70
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {hotspot.priorityScore}
                        </span>
                      </div>
                    </td>

                    {/* Hotspot Title & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        href={`/hotspots/${hotspot.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 block line-clamp-1 transition-colors"
                      >
                        {hotspot.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>{hotspot.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{hotspot.languagesRepresented.join(', ')}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {hotspot.district}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {hotspot.state}
                      </div>
                    </td>

                    {/* Reports Count */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {hotspot.reportCount} reports
                    </td>

                    {/* Affected Population */}
                    <td className="py-3.5 px-4 text-slate-700">
                      ~{hotspot.estimatedAffectedPopulation.toLocaleString()}
                    </td>

                    {/* Trend */}
                    <td className="py-3.5 px-4 font-medium text-emerald-600">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+{hotspot.trendPercentage}%</span>
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4">
                      <span className={urgency.color}>{urgency.label}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          hotspot.status === 'Escalated'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : hotspot.status === 'Action Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {hotspot.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/action-brief/${hotspot.id}`}
                          title="Generate AI Action Brief"
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Brief</span>
                        </Link>
                        <Link
                          href={`/hotspots/${hotspot.id}`}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="View Hotspot Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No hotspots match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
