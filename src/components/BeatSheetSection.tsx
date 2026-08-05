import React, { useState } from 'react';
import { Film, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { BeatInfo, BeatStatus } from '../types';

interface BeatSheetSectionProps {
  beatSheet: BeatInfo[];
}

export const BeatSheetSection: React.FC<BeatSheetSectionProps> = ({ beatSheet }) => {
  const [selectedAct, setSelectedAct] = useState<string>('All');

  const filteredBeats =
    selectedAct === 'All'
      ? beatSheet
      : beatSheet.filter((beat) => beat.act === selectedAct);

  const getStatusBadge = (status: BeatStatus) => {
    switch (status) {
      case 'strong':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Strong Beat
          </span>
        );
      case 'needs_punch':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Needs Punch
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-900 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Missing Beat
          </span>
        );
      case 'misplaced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <RefreshCw className="w-3.5 h-3.5 text-purple-700" />
            Misplaced
          </span>
        );
    }
  };

  const acts = ['All', 'Act 1', 'Act 2A', 'Act 2B', 'Act 3'];

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[8px_8px_0px_#1A1A1A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">3-Act Structure Beat Verification</h3>
            <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
              Evaluating narrative mechanics & plot turning points
            </p>
          </div>
        </div>

        {/* Act Switcher */}
        <div className="flex items-center gap-1 bg-[#F9F7F2] p-1 border-2 border-[#1A1A1A] self-stretch sm:self-auto overflow-x-auto">
          {acts.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAct(act)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedAct === act
                  ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                  : 'text-[#1A1A1A] hover:bg-white'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Beat List Cards */}
      <div className="space-y-4">
        {filteredBeats.map((beat, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3 relative group shadow-[4px_4px_0px_#1A1A1A]"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-[#1A1A1A] text-white">
                  {beat.act}
                </span>
                <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                  {beat.beatName}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-[#F9F7F2] px-2.5 py-1 border border-[#1A1A1A]">
                  {beat.pageOrPercentage}
                </span>
                {getStatusBadge(beat.status)}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {beat.description}
            </p>

            {/* Doctor Note */}
            <div className="bg-[#F9F7F2] p-3.5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-start gap-2.5 mt-2">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block mb-0.5">
                  Script Doctor Diagnosis & Fix
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  {beat.doctorNote}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
