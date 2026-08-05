import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ScreenplayEditor } from './components/ScreenplayEditor';
import { OverviewBar } from './components/OverviewBar';
import { LoglineSection } from './components/LoglineSection';
import { BeatSheetSection } from './components/BeatSheetSection';
import { TensionGraph } from './components/TensionGraph';
import { CharacterSection } from './components/CharacterSection';
import { PacingDoctorSection } from './components/PacingDoctorSection';
import { StoryboardSection } from './components/StoryboardSection';
import { PitchDeckSlideView } from './components/PitchDeckSlideView';
import { DoctorChatDrawer } from './components/DoctorChatDrawer';
import { ReportHistoryDrawer } from './components/ReportHistoryDrawer';
import { AuthPricingModal } from './components/AuthPricingModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AnalysisRequest, DramaturgyReport, UserProfile, UserTier } from './types';
import { Language, TRANSLATIONS } from './i18n';
import { AlertCircle, Clapperboard } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('scriptbeat_lang');
      if (saved === 'tr' || saved === 'en' || saved === 'es') return saved;
    } catch (e) {}
    return 'tr';
  });

  // User state & membership tier
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('scriptbeat_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'usr_free',
      name: 'Ücretsiz Yazar',
      email: 'yazar@scriptbeat.io',
      tier: 'free',
      isLoggedIn: true,
    };
  });

  const [mode, setMode] = useState<'analysis' | 'editor'>('analysis');
  const [report, setReport] = useState<DramaturgyReport | null>(null);
  const [activeTab, setActiveTab] = useState<string>('logline');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<DramaturgyReport[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDoctorChatOpen, setIsDoctorChatOpen] = useState(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);
  const [isAuthPricingOpen, setIsAuthPricingOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'plans' | 'login'>('plans');

  const [upgradeGuard, setUpgradeGuard] = useState<{
    isOpen: boolean;
    requiredTier: 'pro' | 'studio';
    featureName?: string;
  }>({
    isOpen: false,
    requiredTier: 'pro',
  });

  const t = TRANSLATIONS[language];

  const handleUpdateUser = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('scriptbeat_user', JSON.stringify(newUser));
    } catch (e) {}
  };

  const handleRequireUpgrade = (tier: 'pro' | 'studio', featureName?: string) => {
    setUpgradeGuard({
      isOpen: true,
      requiredTier: tier,
      featureName,
    });
  };

  // Persist language selection
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('scriptbeat_lang', lang);
    } catch (e) {}
  };

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('scriptbeat_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newReport: DramaturgyReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== newReport.id);
      const updated = [newReport, ...filtered].slice(0, 20); // keep last 20
      try {
        localStorage.setItem('scriptbeat_reports', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history', e);
      }
      return updated;
    });
  };

  const handleAnalyze = async (request: AnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Server failed to analyze script');
      }

      setReport(data);
      saveToHistory(data);
      setActiveTab('logline');
      setMode('analysis');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err?.message ||
          'Unable to complete dramaturgy analysis. Please check your text submission or try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteReport = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('scriptbeat_reports', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (report?.id === id) {
      setReport(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('scriptbeat_reports');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenDoctorChat={() => setIsDoctorChatOpen(true)}
          onOpenPitchDeckModal={() => setIsPitchDeckModalOpen(true)}
          hasReport={Boolean(report)}
          historyCount={history.length}
          language={language}
          onLanguageChange={handleLanguageChange}
          mode={mode}
          onModeChange={setMode}
          user={user}
          onOpenAuthPricing={(tab) => {
            setAuthDefaultTab(tab || 'plans');
            setIsAuthPricingOpen(true);
          }}
        />

        {/* Hero Banner - Editorial Masthead */}
        <div className="border-b-2 border-[#1A1A1A] bg-[#F9F7F2] py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white bg-[#1A1A1A]">
                {t.heroTag}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                {t.heroSystemId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              {t.heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed font-sans">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {mode === 'editor' ? (
            <ScreenplayEditor
              language={language}
              onAnalyzeScreenplay={handleAnalyze}
              isAnalyzing={isAnalyzing}
              userTier={user.tier}
              onRequireUpgrade={handleRequireUpgrade}
            />
          ) : (
            <>
              {/* Input Form Section */}
              <InputForm
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                language={language}
                userTier={user.tier}
                onRequireUpgrade={handleRequireUpgrade}
              />

              {/* Error Alert */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm flex items-start gap-3 shadow-[4px_4px_0px_#1A1A1A]">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block text-red-700 uppercase tracking-wider text-xs mb-0.5">
                      Dramaturgy Engine Notice
                    </span>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Report Display */}
              {report ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Overview Scorecard & Tabs */}
                  <OverviewBar
                    report={report}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onOpenPitchDeck={() => setIsPitchDeckModalOpen(true)}
                    onOpenDoctorChat={() => setIsDoctorChatOpen(true)}
                  />

                  {/* Tab Contents */}
                  {activeTab === 'logline' && <LoglineSection analysis={report.loglineAnalysis} />}
                  {activeTab === 'beats' && <BeatSheetSection beatSheet={report.beatSheet} />}
                  {activeTab === 'tension' && <TensionGraph tensionCurve={report.tensionCurve} />}
                  {activeTab === 'characters' && (
                    <CharacterSection characters={report.characterAnalysis} />
                  )}
                  {activeTab === 'pacing' && (
                    <PacingDoctorSection
                      pacingCheck={report.pacingCheck}
                      userTier={user.tier}
                      onRequireUpgrade={handleRequireUpgrade}
                    />
                  )}
                  {activeTab === 'storyboard' && (
                    <StoryboardSection
                      scriptText={report.inputSummary.scriptExcerpt || report.loglineAnalysis.originalLogline}
                      projectTitle={report.projectTitle}
                      language={language}
                      userTier={user.tier}
                      onRequireUpgrade={handleRequireUpgrade}
                    />
                  )}
                </div>
              ) : (
                !isAnalyzing && (
                  <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] p-10 text-center space-y-4 shadow-[6px_6px_0px_#1A1A1A]">
                    <div className="w-14 h-14 bg-[#1A1A1A] text-white mx-auto flex items-center justify-center shadow-[3px_3px_0px_#DC2626]">
                      <Clapperboard className="w-7 h-7 text-white" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                        {t.readyTitle}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {t.readySubtitle}
                      </p>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-[#1A1A1A] bg-white py-6 mt-16 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono uppercase tracking-wider text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A]">© SCRIPTBEAT INDUSTRIES</span>
            <span>•</span>
            <span>DRAMATURGY ENGINE V4.2 PRO</span>
          </div>
          <span>Senaryo Doktoru ve Dramaturji Analiz Stüdyosu</span>
        </div>
      </footer>

      {/* Slide Modal */}
      {isPitchDeckModalOpen && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl">
            <PitchDeckSlideView
              pitchDeck={report.pitchDeckData}
              language={language}
              onClose={() => setIsPitchDeckModalOpen(false)}
              userTier={user.tier}
              onRequireUpgrade={handleRequireUpgrade}
            />
          </div>
        </div>
      )}

      {/* Auth & Pricing Modal */}
      {isAuthPricingOpen && (
        <AuthPricingModal
          user={user}
          language={language}
          defaultTab={authDefaultTab}
          onClose={() => setIsAuthPricingOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Upgrade Guard Modal */}
      {upgradeGuard.isOpen && (
        <UpgradeModal
          requiredTier={upgradeGuard.requiredTier}
          featureName={upgradeGuard.featureName}
          onClose={() => setUpgradeGuard((prev) => ({ ...prev, isOpen: false }))}
          onOpenPricing={() => {
            setAuthDefaultTab('plans');
            setIsAuthPricingOpen(true);
          }}
        />
      )}

      {/* Doctor Chat Drawer */}
      <DoctorChatDrawer
        isOpen={isDoctorChatOpen}
        onClose={() => setIsDoctorChatOpen(false)}
        report={report || undefined}
        language={language}
      />

      {/* History Drawer */}
      <ReportHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        reports={history}
        onSelectReport={(selected) => {
          setReport(selected);
          setActiveTab('logline');
        }}
        onDeleteReport={handleDeleteReport}
        onClearAll={handleClearHistory}
        language={language}
      />
    </div>
  );
}
