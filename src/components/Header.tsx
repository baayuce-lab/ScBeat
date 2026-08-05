import React from 'react';
import { History, MessageSquare, Presentation, Globe, PenTool, Sparkles, Film, User, Crown, Lock } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenDoctorChat: () => void;
  onOpenPitchDeckModal: () => void;
  hasReport: boolean;
  historyCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  mode: 'analysis' | 'editor';
  onModeChange: (mode: 'analysis' | 'editor') => void;
  user: UserProfile;
  onOpenAuthPricing: (defaultTab?: 'plans' | 'login') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenDoctorChat,
  onOpenPitchDeckModal,
  hasReport,
  historyCount,
  language,
  onLanguageChange,
  mode,
  onModeChange,
  user,
  onOpenAuthPricing,
}) => {
  const t = TRANSLATIONS[language];

  // Membership tier badge styling
  const getTierBadge = () => {
    switch (user.tier) {
      case 'studio':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-yellow-400 text-[#1A1A1A] border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
            <Crown className="w-3 h-3 text-[#1A1A1A]" />
            <span>Christopher Nolan ($25)</span>
          </span>
        );
      case 'pro':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-600 text-white border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Aaron Sorkin ($10)</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-slate-200 text-[#1A1A1A] border border-[#1A1A1A]">
            <span>Barton Fink (Ücretsiz)</span>
          </span>
        );
    }
  };

  return (
    <header className="border-b-2 border-[#1A1A1A] bg-[#FDFCFB] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] flex items-center justify-center shrink-0">
            <Film className="w-6 h-6 text-red-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-[#1A1A1A]">
                Script<span className="text-red-600">Beat</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-white bg-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
                Studio
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#F9F7F2] p-1 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
          <button
            onClick={() => onModeChange('analysis')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'analysis'
                ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                : 'text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>{t.analysisMode}</span>
          </button>

          <button
            onClick={() => onModeChange('editor')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'editor'
                ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                : 'text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.editorMode}</span>
          </button>
        </div>

        {/* Action Controls & User Auth */}
        <div className="flex items-center gap-2">
          {/* User Profile & Membership Badge Button */}
          <button
            onClick={() => onOpenAuthPricing('plans')}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#F9F7F2] hover:bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            title="Üyelik Paketleri ve Giriş"
          >
            <User className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="text-xs font-mono font-bold hidden lg:inline">{user.name}</span>
            {getTierBadge()}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-[#F9F7F2] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-700 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value="tr">TR (Türkçe)</option>
              <option value="en">EN (English)</option>
              <option value="es">ES (Español)</option>
            </select>
          </div>

          {hasReport && (
            <button
              onClick={onOpenPitchDeckModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer"
              title={t.pitchDeckBtn}
            >
              <Presentation className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden md:inline">{t.pitchDeckBtn}</span>
            </button>
          )}

          <button
            onClick={onOpenDoctorChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] hover:bg-[#DC2626] hover:border-[#DC2626] transition-all cursor-pointer"
            title={t.scriptDoctorBtn}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.scriptDoctorBtn}</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer"
            title={t.historyBtn}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.historyBtn}</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white bg-red-600">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

