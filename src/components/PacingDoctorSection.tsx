import React from 'react';
import { Clock, AlertTriangle, Sparkles, CheckCircle2, Activity, Zap, Lock, Crown } from 'lucide-react';
import { PacingCheck, UserTier } from '../types';

interface PacingDoctorSectionProps {
  pacingCheck: PacingCheck;
  userTier?: UserTier;
  onRequireUpgrade?: (tier: 'pro' | 'studio', featureName?: string) => void;
}

export const PacingDoctorSection: React.FC<PacingDoctorSectionProps> = ({ 
  pacingCheck, 
  userTier = 'free',
  onRequireUpgrade
}) => {
  const {
    overallPacingScore = 80,
    rhythmAnalysis = 'Dramatik tempo ve ritim analiz edildi.',
    flatSpots = [],
    actTensionBalance = { act1: 75, act2a: 65, act2b: 80, act3: 90 },
  } = pacingCheck || {};

  const isFree = userTier === 'free';

  return (
    <div className="space-y-6 relative">
      {/* Free Tier Lock Banner */}
      {isFree && (
        <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_#DC2626] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white border border-white">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-400">
                PRO KISITLAMASI
              </span>
              <h4 className="text-base font-serif font-bold text-white">
                Sahne Mekaniği & Pacing Analizi Pro Pakete Dahildir
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                Ücretsiz yazar modunda sahne mekaniği ve detaylı tempo düzeltmeleri kilitlidir.
              </p>
            </div>
          </div>

          <button
            onClick={() => onRequireUpgrade?.('pro', 'Sahne Mekaniği & Pacing Analizi')}
            className="px-4 py-2 bg-red-600 hover:bg-white hover:text-[#1A1A1A] text-white font-mono font-bold uppercase text-xs border-2 border-white shadow-[2px_2px_0px_#EAB308] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pro Yazar Paketine Geç (199 TL)</span>
          </button>
        </div>
      )}

      <div className={isFree ? 'opacity-40 blur-[1px] pointer-events-none select-none' : ''}>
        {/* Top Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#1A1A1A] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Pacing & Tension Doctor Check</h3>
              <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                Pinpointing momentum sags, dialogue padding, and middle fatigue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F9F7F2] px-4 py-2 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <Activity className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest block">
                Overall Pacing Score
              </span>
              <span className="text-base font-mono font-black text-[#1A1A1A]">
                {overallPacingScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Rhythm Analysis */}
        <div className="bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1">
          <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
            Rhythm & Momentum Diagnosis
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">{rhythmAnalysis}</p>
        </div>

        {/* Act Tension Balance Bars */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
            Act-by-Act Tension Distribution
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F9F7F2] p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase block">Act 1</span>
              <div className="w-full bg-white border border-[#1A1A1A] h-2.5 overflow-hidden">
                <div
                  className="bg-[#1A1A1A] h-full"
                  style={{ width: `${actTensionBalance.act1}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] block text-right">
                {actTensionBalance.act1}%
              </span>
            </div>

            <div className="bg-[#F9F7F2] p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase block">Act 2A</span>
              <div className="w-full bg-white border border-[#1A1A1A] h-2.5 overflow-hidden">
                <div
                  className="bg-[#1A1A1A] h-full"
                  style={{ width: `${actTensionBalance.act2a}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] block text-right">
                {actTensionBalance.act2a}%
              </span>
            </div>

            <div className="bg-[#F9F7F2] p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase block">Act 2B</span>
              <div className="w-full bg-white border border-[#1A1A1A] h-2.5 overflow-hidden">
                <div
                  className="bg-[#1A1A1A] h-full"
                  style={{ width: `${actTensionBalance.act2b}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] block text-right">
                {actTensionBalance.act2b}%
              </span>
            </div>

            <div className="bg-[#F9F7F2] p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase block">Act 3</span>
              <div className="w-full bg-white border border-[#1A1A1A] h-2.5 overflow-hidden">
                <div
                  className="bg-[#1A1A1A] h-full"
                  style={{ width: `${actTensionBalance.act3}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] block text-right">
                {actTensionBalance.act3}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flat Spot Diagnostics */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Identified Flat Spots & Script Doctor Fixes</span>
        </h4>

        {flatSpots && flatSpots.length > 0 ? (
          <div className="space-y-3">
            {flatSpots.map((spot, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3 shadow-[4px_4px_0px_#DC2626]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 border border-[#1A1A1A]">
                    {spot.sceneOrBeat}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium">
                  <span className="text-red-600 font-bold uppercase tracking-wider text-xs">Issue: </span>
                  {spot.issue}
                </p>

                <div className="bg-[#F9F7F2] p-3.5 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    Hollywood Doctor Actionable Fix
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {spot.doctorFix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] p-5 text-center text-xs font-mono uppercase text-slate-600 shadow-[3px_3px_0px_#1A1A1A]">
            No severe flat spots detected! Narrative momentum flows effectively.
          </div>
        )}
      </div>
    </div>
  </div>
);
};
