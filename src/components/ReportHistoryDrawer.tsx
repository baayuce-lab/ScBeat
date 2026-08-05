import React from 'react';
import { History, X, Trash2, ArrowRight, Film } from 'lucide-react';
import { DramaturgyReport } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface ReportHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: DramaturgyReport[];
  onSelectReport: (report: DramaturgyReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  language?: Language;
}

export const ReportHistoryDrawer: React.FC<ReportHistoryDrawerProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  language = 'tr',
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white border-l-4 border-[#1A1A1A] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#F9F7F2]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">{t.historyTitle}</h3>
          </div>

          <div className="flex items-center gap-2">
            {reports.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[10px] font-mono font-bold uppercase text-red-600 hover:text-white hover:bg-red-600 px-2.5 py-1 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                {t.historyClearAll}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A] hover:bg-red-600 hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9F7F2]">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono uppercase space-y-2">
              <Film className="w-8 h-8 mx-auto text-[#1A1A1A]" />
              <p>{t.historyEmpty}</p>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A] transition-all space-y-2 group hover:bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-red-600 uppercase tracking-widest block">
                      {rep.inputSummary.genre} • {rep.inputSummary.targetMedium}
                    </span>
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A] group-hover:text-red-600 transition-colors">
                      {rep.projectTitle}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(rep.timestamp).toLocaleDateString()} at{' '}
                      {new Date(rep.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectReport(rep);
                        onClose();
                      }}
                      className="p-1.5 bg-[#1A1A1A] hover:bg-red-600 text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                      title={t.historyLoad}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteReport(rep.id)}
                      className="p-1.5 bg-white hover:bg-red-600 text-[#1A1A1A] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-800 line-clamp-2 italic font-serif">
                  "{rep.loglineAnalysis.refinedLogline || rep.loglineAnalysis.originalLogline}"
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 pt-2 border-t border-[#1A1A1A]">
                  <span>Script Doctor Score:</span>
                  <span className="font-extrabold text-[#1A1A1A] bg-[#F9F7F2] px-2 py-0.5 border border-[#1A1A1A]">
                    {rep.scriptDoctorVerdict.overallScore} / 100
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
