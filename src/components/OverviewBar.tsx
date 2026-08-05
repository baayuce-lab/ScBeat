import React from 'react';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Presentation, 
  Sparkles,
  BarChart2,
  Users,
  Film,
  Zap,
  Clock,
  Camera
} from 'lucide-react';
import { DramaturgyReport } from '../types';

interface OverviewBarProps {
  report: DramaturgyReport;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPitchDeck: () => void;
  onOpenDoctorChat: () => void;
}

export const OverviewBar: React.FC<OverviewBarProps> = ({
  report,
  activeTab,
  setActiveTab,
  onOpenPitchDeck,
  onOpenDoctorChat,
}) => {
  const { scriptDoctorVerdict, inputSummary, projectTitle } = report;

  const TABS = [
    { id: 'logline', label: 'Logline & Premise', icon: Sparkles },
    { id: 'beats', label: '3-Act Structure Beats', icon: Film },
    { id: 'tension', label: 'Tension & Pacing Curve', icon: BarChart2 },
    { id: 'characters', label: 'Character Arcs & Dynamics', icon: Users },
    { id: 'pacing', label: 'Pacing & Flat Spots', icon: Clock },
    { id: 'storyboard', label: 'Canlı Görsel Storyboard', icon: Camera },
    { id: 'pitchdeck', label: 'Producer Pitch Deck', icon: Presentation },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Banner Card */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#1A1A1A] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Project Title & Summary */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-white">
                {inputSummary.genre}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#F9F7F2] text-[#1A1A1A] border-2 border-[#1A1A1A]">
                {inputSummary.targetMedium}
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                {inputSummary.wordCount} kelime analiz edildi
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight">
              {projectTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic border-l-4 border-red-600 pl-3 py-1 bg-[#F9F7F2] border-y border-r border-[#1A1A1A]/10">
              "{report.loglineAnalysis.refinedLogline || report.loglineAnalysis.originalLogline}"
            </p>
          </div>

          {/* Scores Matrix */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap lg:flex-nowrap w-full lg:w-auto justify-start lg:justify-end">
            {/* Main Score Box */}
            <div className="flex items-center gap-3 bg-[#F9F7F2] p-3.5 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
              <div className="w-16 h-16 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-mono font-black text-white">
                  {scriptDoctorVerdict.overallScore}
                </span>
                <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-tighter">
                  / 100
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest block">
                  Senaryo Doktor Skoru
                </span>
                <span className="text-sm font-serif font-bold text-[#1A1A1A]">
                  {scriptDoctorVerdict.overallScore >= 85
                    ? 'Stüdyoya Hazır'
                    : scriptDoctorVerdict.overallScore >= 70
                    ? 'Güçlü Potansiyel'
                    : 'Revizyon Gerekli'}
                </span>
              </div>
            </div>

            {/* Sub Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-3 bg-[#F9F7F2] border-2 border-[#1A1A1A] text-center min-w-[100px] shadow-[3px_3px_0px_#1A1A1A]">
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">Ticari Değer</span>
                <span className="text-lg font-mono font-black text-[#1A1A1A]">
                  %{scriptDoctorVerdict.commercialViability}
                </span>
              </div>

              <div className="px-4 py-3 bg-[#F9F7F2] border-2 border-[#1A1A1A] text-center min-w-[100px] shadow-[3px_3px_0px_#1A1A1A]">
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">Yazım İşçiliği</span>
                <span className="text-lg font-mono font-black text-red-600">
                  %{scriptDoctorVerdict.craftExecution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary & Priority Fixes */}
        <div className="mt-6 pt-6 border-t-2 border-[#1A1A1A] grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Senaryo Doktoru Kararı</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-[#F9F7F2] p-3.5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] font-sans">
              {scriptDoctorVerdict.executiveSummary}
            </p>
          </div>

          {/* Strengths & Priority Fixes */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Strengths */}
              <div className="bg-emerald-50/80 border-2 border-[#1A1A1A] p-3 space-y-1.5 shadow-[3px_3px_0px_#1A1A1A]">
                <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Güçlü Yönler
                </span>
                <ul className="space-y-1 text-xs text-emerald-950 font-sans">
                  {scriptDoctorVerdict.topStrengths.slice(0, 2).map((str, i) => (
                    <li key={i} className="line-clamp-2">
                      • {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fixes */}
              <div className="bg-rose-50/80 border-2 border-[#1A1A1A] p-3 space-y-1.5 shadow-[3px_3px_0px_#DC2626]">
                <span className="text-[10px] font-mono font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Öncelikli Tamirler
                </span>
                <ul className="space-y-1 text-xs text-rose-950 font-sans">
                  {scriptDoctorVerdict.topPriorityFixes.slice(0, 2).map((fix, i) => (
                    <li key={i} className="line-clamp-2">
                      • {fix}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'pitchdeck') {
                  onOpenPitchDeck();
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#1A1A1A] cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#DC2626]'
                  : 'bg-[#F9F7F2] text-[#1A1A1A] hover:bg-white shadow-[3px_3px_0px_#1A1A1A]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-[#1A1A1A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
