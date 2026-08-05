import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  User, 
  Lock, 
  Mail, 
  Crown, 
  ArrowRight,
  Download,
  FileText,
  Film
} from 'lucide-react';
import { UserProfile, UserTier } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface AuthPricingModalProps {
  user: UserProfile;
  language?: Language;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  defaultTab?: 'plans' | 'login';
}

export const AuthPricingModal: React.FC<AuthPricingModalProps> = ({
  user,
  language = 'tr',
  onClose,
  onUpdateUser,
  defaultTab = 'plans',
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'login'>(defaultTab);
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.name || '');
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');

  const handleSelectTier = (tier: UserTier) => {
    onUpdateUser({
      ...user,
      tier,
      isLoggedIn: true,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    onUpdateUser({
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      tier: user.tier === 'free' ? 'pro' : user.tier, // Default to Pro on new login if free
      isLoggedIn: true,
    });
  };

  const handleLogout = () => {
    onUpdateUser({
      id: 'guest',
      name: 'Misafir Yazar',
      email: '',
      tier: 'free',
      isLoggedIn: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border-2 border-[#1A1A1A] shadow-[10px_10px_0px_#1A1A1A] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] p-4 bg-[#F9F7F2]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">ScriptBeat Üyelik Stüdyosu</h3>
              <p className="text-xs font-mono uppercase text-slate-600">
                Giriş Yap • Üyelik Paketlerini Karşılaştır
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-white border-2 border-[#1A1A1A] p-0.5">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeTab === 'plans'
                    ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                    : 'text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                Üyelik Paketleri
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                    : 'text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{user.isLoggedIn ? user.name : 'Giriş Yap'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A] hover:bg-red-600 hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'plans' ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-red-600 text-white border border-[#1A1A1A]">
                  YAZAR DÜZEYİNİZİ SEÇİN
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
                  İhtiyacınıza Uygun ScriptBeat Paketi
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-sans">
                  Ücretsiz senaryo yazımından tam stüdyo pitch deck üretimine kadar tüm katmanlar.
                </p>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* TIER 1: BARTON FINK (ÜCRETSİZ) */}
                <div className={`relative bg-[#F9F7F2] border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between ${user.tier === 'free' ? 'ring-2 ring-red-600' : ''}`}>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        BAŞLANGIÇ PAKETİ
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Barton Fink</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black text-[#1A1A1A]">0 TL</span>
                        <span className="text-xs font-mono text-slate-500">/ sonsuza dek</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-sans border-t border-[#1A1A1A] pt-3">
                      Senaryo taslaklarınızı özgürce yazın, fikirlerinizden temel logline ve sinopsis üretin.
                    </p>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Senaryo Editörü (Standart Format)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Konu Verip Logline & Sinopsis Alma</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Tarayıcı İçi Senaryo Saklama</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 line-through">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>FDX, PDF, Fountain Dışa Aktarma</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 line-through">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Sahne Mekaniği & Pacing Analizi</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTier('free')}
                    className={`mt-6 w-full py-2 px-4 text-xs font-mono font-bold uppercase border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer ${
                      user.tier === 'free'
                        ? 'bg-slate-200 text-[#1A1A1A] cursor-default'
                        : 'bg-white hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                  >
                    {user.tier === 'free' ? 'Mevcut Planınız' : 'Barton Fink Kullan'}
                  </button>
                </div>

                {/* TIER 2: AARON SORKIN (PRO $10 = 475 TL) */}
                <div className={`relative bg-white border-2 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_#DC2626] flex flex-col justify-between ${user.tier === 'pro' ? 'ring-2 ring-red-600' : ''}`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-600 text-white border border-[#1A1A1A] text-[9px] font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_#1A1A1A]">
                    EN POPÜLER YAZAR PAKETİ
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 block">
                        PROFESYONEL SENARİST
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Aaron Sorkin</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black text-[#1A1A1A]">475 TL</span>
                        <span className="text-xs font-mono text-slate-500">($10 / ay)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-sans border-t border-[#1A1A1A] pt-3">
                      Gelişmiş AI dramaturji, sınırsız beat doğrulama ve tam senaryo dışa aktarma yetkisi.
                    </p>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-bold">Sınırsız AI 15-Beat Doğrulama</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-bold">Karakter Özeti Üreteci & Ark Analizi</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-bold">FDX, PDF, Fountain, TXT Dışa Aktarma</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Senaryo Doktoru Sohbeti</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 line-through">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Otomatik Görsel Pitch Deck PDF</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTier('pro')}
                    className={`mt-6 w-full py-2.5 px-4 text-xs font-mono font-bold uppercase border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer ${
                      user.tier === 'pro'
                        ? 'bg-slate-200 text-[#1A1A1A] cursor-default'
                        : 'bg-red-600 hover:bg-[#1A1A1A] text-white'
                    }`}
                  >
                    {user.tier === 'pro' ? 'Mevcut Planınız' : 'Aaron Sorkin Paketine Geç (475 TL)'}
                  </button>
                </div>

                {/* TIER 3: CHRISTOPHER NOLAN (STUDIO $25 = 1.185 TL) */}
                <div className={`relative bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_#EAB308] flex flex-col justify-between ${user.tier === 'studio' ? 'ring-2 ring-yellow-400' : ''}`}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-400 block">
                          USTA YÖNETMEN & STÜDYO
                        </span>
                        <Crown className="w-4 h-4 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white">Christopher Nolan</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black text-yellow-400">1.185 TL</span>
                        <span className="text-xs font-mono text-slate-300">($25 / ay)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans border-t border-slate-700 pt-3">
                      Yapımcı sunumları için görsel Pitch Deck, Canlı Storyboard çizimi ve tam dramaturji analizi.
                    </p>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <span className="font-bold text-yellow-200">Canlı Görsel Storyboard Üreteci</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <span className="font-bold text-yellow-200">Otomatik Pitch Deck PDF & JSON İndirme</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Sahne Mekaniği & Derin Pacing Doktoru</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Sınırsız AI Beat Doğrulama & Karakter Özeti</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Tüm Senaryo Formatlarında Dışa Aktarma</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTier('studio')}
                    className={`mt-6 w-full py-2.5 px-4 text-xs font-mono font-bold uppercase border-2 border-white shadow-[2px_2px_0px_#EAB308] transition-all cursor-pointer ${
                      user.tier === 'studio'
                        ? 'bg-yellow-400 text-[#1A1A1A] font-black cursor-default'
                        : 'bg-yellow-400 hover:bg-white text-[#1A1A1A]'
                    }`}
                  >
                    {user.tier === 'studio' ? 'Mevcut Planınız' : 'Christopher Nolan Paketine Geç (1.185 TL)'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login & Account Tab */
            <div className="max-w-md mx-auto space-y-6 py-4">
              {user.isLoggedIn ? (
                <div className="bg-[#F9F7F2] p-6 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto text-xl font-serif font-bold border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">{user.name}</h3>
                    <p className="text-xs font-mono text-slate-600">{user.email || 'yazar@scriptbeat.io'}</p>
                  </div>

                  <div className="inline-block px-3 py-1 bg-[#1A1A1A] text-white font-mono text-xs font-bold uppercase tracking-wider">
                    Aktif Üyelik: {user.tier === 'free' ? 'Ücretsiz Yazar' : user.tier === 'pro' ? 'Pro Yazar Paket' : 'Studio Pitch Deck Pro ($10)'}
                  </div>

                  <div className="pt-4 border-t border-[#1A1A1A] flex gap-2 justify-center">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-xs font-mono font-bold uppercase bg-white hover:bg-red-600 hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                    >
                      Hesaptan Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="bg-white p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                      {loginMode === 'login' ? 'Yazar Hesabınıza Giriş Yapın' : 'Yeni Yazar Hesabı Oluşturun'}
                    </h3>
                    <p className="text-xs font-sans text-slate-600">
                      Senaryolarınızı ve analiz raporlarınızı kaydetmek için giriş yapın.
                    </p>
                  </div>

                  {loginMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block">
                        Adınız & Soyadınız
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ör. Senarist Ali Yılmaz"
                        className="w-full p-2 text-sm bg-[#F9F7F2] border-2 border-[#1A1A1A] focus:bg-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yazar@scriptbeat.io"
                      className="w-full p-2 text-sm bg-[#F9F7F2] border-2 border-[#1A1A1A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold uppercase text-[#1A1A1A] block">
                      Şifre
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2 text-sm bg-[#F9F7F2] border-2 border-[#1A1A1A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-mono font-bold uppercase bg-[#1A1A1A] hover:bg-red-600 text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                  >
                    {loginMode === 'login' ? 'Giriş Yap' : 'Hesabımı Oluştur'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setLoginMode(loginMode === 'login' ? 'signup' : 'login')}
                      className="text-xs font-sans text-slate-700 hover:text-red-600 underline cursor-pointer"
                    >
                      {loginMode === 'login' ? 'Hesabınız yok mu? Hemen kaydolun' : 'Zaten hesabınız var mı? Giriş yapın'}
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Demo Switchers */}
              <div className="bg-[#F9F7F2] p-4 border-2 border-[#1A1A1A] space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                  Hızlı Test / Üyelik Rol Değiştirici:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSelectTier('free')}
                    className="p-2 text-[10px] font-mono font-bold uppercase bg-white border border-[#1A1A1A] hover:bg-slate-200 cursor-pointer"
                  >
                    Ücretsiz Yazar
                  </button>
                  <button
                    onClick={() => handleSelectTier('pro')}
                    className="p-2 text-[10px] font-mono font-bold uppercase bg-red-600 text-white border border-[#1A1A1A] hover:bg-black cursor-pointer"
                  >
                    Pro Yazar ($5)
                  </button>
                  <button
                    onClick={() => handleSelectTier('studio')}
                    className="p-2 text-[10px] font-mono font-bold uppercase bg-yellow-400 text-[#1A1A1A] border border-[#1A1A1A] hover:bg-black hover:text-white cursor-pointer"
                  >
                    Studio ($10)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
