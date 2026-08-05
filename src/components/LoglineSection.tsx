import React, { useState } from 'react';
import { Sparkles, Copy, Check, Target, Flame, ShieldAlert, Zap, Award } from 'lucide-react';
import { LoglineAnalysis } from '../types';

interface LoglineSectionProps {
  analysis: LoglineAnalysis;
}

export const LoglineSection: React.FC<LoglineSectionProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.refinedLogline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Side-by-Side Logline Polish Card */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#1A1A1A] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Logline & Premise Polish</h3>
              <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                Transforming raw concepts into Studio-Grade Pitch Loglines
              </p>
            </div>
          </div>

          {/* Hook Rating Badge */}
          <div className="flex items-center gap-3 bg-[#F9F7F2] px-4 py-2 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <Flame className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest block">
                Hook Power Rating
              </span>
              <span className="text-base font-mono font-black text-[#1A1A1A]">
                {analysis.hookScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original */}
          <div className="bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                Original Submitted Logline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed italic">
              "{analysis.originalLogline}"
            </p>
          </div>

          {/* Refined */}
          <div className="bg-red-50/50 p-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#DC2626] space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-600" />
                Refined Studio Logline
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-red-600 text-white text-[10px] font-mono uppercase tracking-wider font-bold border border-[#1A1A1A] transition-all cursor-pointer"
                title="Copy Refined Logline"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#1A1A1A] font-serif font-bold leading-relaxed italic">
              "{analysis.refinedLogline}"
            </p>
          </div>
        </div>

        {/* Hook Critique */}
        <div className="bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Hook & High-Concept Critique
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {analysis.hookCritique}
          </p>
        </div>
      </div>

      {/* Mechanics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Protagonist Drive */}
        <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            <Target className="w-4 h-4 text-red-600" />
            <span>Protagonist & Goal</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {analysis.protagonistAnalysis}
          </p>
        </div>

        {/* Core Conflict */}
        <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-600" />
            <span>Core Central Conflict</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            {analysis.coreConflict}
          </p>
        </div>

        {/* Stakes */}
        <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Stakes Breakdown</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#F9F7F2] p-2.5 border-2 border-[#1A1A1A]">
              <span className="font-mono font-bold text-red-600 block mb-0.5 uppercase tracking-wider text-[10px]">External Stakes:</span>
              <span className="text-slate-800 font-sans">{analysis.stakes.external}</span>
            </div>

            <div className="bg-[#F9F7F2] p-2.5 border-2 border-[#1A1A1A]">
              <span className="font-mono font-bold text-emerald-700 block mb-0.5 uppercase tracking-wider text-[10px]">Internal Stakes:</span>
              <span className="text-slate-800 font-sans">{analysis.stakes.internal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Script Doctor Verdict */}
      <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 space-y-2 shadow-[6px_6px_0px_#DC2626]">
        <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-400">
          Dramaturge Verdict on Premise
        </h4>
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-serif italic">
          "{analysis.engineVerdict}"
        </p>
      </div>
    </div>
  );
};
