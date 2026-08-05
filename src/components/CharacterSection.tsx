import React from 'react';
import { Users, UserCheck, Heart, ShieldAlert, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { CharacterAnalysis } from '../types';

interface CharacterSectionProps {
  characters: CharacterAnalysis[];
}

export const CharacterSection: React.FC<CharacterSectionProps> = ({ characters }) => {
  if (!characters || characters.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No character data available for this analysis.
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'protagonist':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'antagonist':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'catalyst':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[8px_8px_0px_#1A1A1A] flex items-center gap-3">
        <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Character Arc & Dynamic Analysis</h3>
          <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
            Evaluating flaw mechanics, external wants vs internal needs, and dynamics
          </p>
        </div>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((char, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b-2 border-[#1A1A1A] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                      {char.role}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1A1A1A] bg-[#F9F7F2] px-2 py-0.5 border border-[#1A1A1A]">
                      {char.arcType}
                    </span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#1A1A1A]">{char.name}</h4>
                </div>
              </div>

              {/* Core Flaw */}
              <div className="bg-rose-50/80 p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  Fatal Flaw / Blindspot
                </span>
                <p className="text-xs text-slate-800 font-sans">{char.flaw}</p>
              </div>

              {/* Want vs Need Contrast Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Want */}
                <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] p-3 shadow-[2px_2px_0px_#1A1A1A] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider block">
                    External Want (Goal)
                  </span>
                  <p className="text-xs text-slate-800 font-sans">{char.want}</p>
                </div>

                {/* Need */}
                <div className="bg-emerald-50/80 border-2 border-[#1A1A1A] p-3 shadow-[2px_2px_0px_#1A1A1A] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block">
                    Internal Need (Truth)
                  </span>
                  <p className="text-xs text-slate-800 font-sans">{char.need}</p>
                </div>
              </div>

              {/* Personal Stakes */}
              <div className="bg-[#F9F7F2] p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block">
                  Personal Stakes
                </span>
                <p className="text-xs text-slate-800 font-sans">{char.stakes}</p>
              </div>
            </div>

            {/* Relationships Dynamic */}
            {char.keyRelationships && char.keyRelationships.length > 0 && (
              <div className="pt-3 border-t-2 border-[#1A1A1A] space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
                  Key Dynamic Tension
                </span>
                <div className="space-y-1.5">
                  {char.keyRelationships.map((rel, rIdx) => (
                    <div
                      key={rIdx}
                      className="text-xs bg-[#F9F7F2] px-3 py-2 border-2 border-[#1A1A1A] flex items-center justify-between"
                    >
                      <span className="font-serif font-bold text-[#1A1A1A]">{rel.withCharacter}</span>
                      <span className="text-slate-600 font-sans italic line-clamp-1 max-w-[200px]">
                        {rel.dynamic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
