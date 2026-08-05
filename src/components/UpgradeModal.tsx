import React from 'react';
import { X, Lock, Sparkles, ArrowRight, ShieldAlert, Crown } from 'lucide-react';
import { UserTier } from '../types';

interface UpgradeModalProps {
  requiredTier: 'pro' | 'studio';
  featureName?: string;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  requiredTier,
  featureName = 'Bu Özellik',
  onClose,
  onOpenPricing,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#1A1A1A] hover:bg-red-600 hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-[#1A1A1A] text-white">
              {requiredTier === 'studio' ? 'CHRISTOPHER NOLAN (1.185 TL) PAKET' : 'AARON SORKIN (475 TL) PAKET'}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
              Paketinizi Yükseltin
            </h3>
          </div>
        </div>

        <div className="space-y-2 bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A]">
          <p className="text-sm font-sans font-bold text-[#1A1A1A]">
            "{featureName}" özelliğine erişim {requiredTier === 'studio' ? 'Christopher Nolan (1.185 TL / 25$)' : 'Aaron Sorkin (475 TL / 10$)'} paketinde mevcuttur.
          </p>
          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            {requiredTier === 'studio'
              ? 'Barton Fink veya Aaron Sorkin paketinde Canlı Görsel Storyboard ve otomatik Pitch Deck indirimi kısıtlıdır. Stüdyo kalitesinde yapımcı sunumu için yükseltin.'
              : 'Barton Fink (ücretsiz) pakette dışa aktarma (FDX, PDF, Fountain) ve sınırsız beat analizi kısıtlıdır. Profesyonel senaryo araçları için Aaron Sorkin paketine geçin.'}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 px-3 text-xs font-mono font-bold uppercase bg-white hover:bg-slate-100 text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="w-1/2 py-2.5 px-3 text-xs font-mono font-bold uppercase bg-red-600 hover:bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Paketini Yükselt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
