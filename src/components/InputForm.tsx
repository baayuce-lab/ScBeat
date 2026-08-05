import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  Zap, 
  Sliders, 
  Check, 
  ArrowRight,
  RotateCcw,
  Upload,
  FileCheck,
  Loader2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { InputType, Genre, TargetMedium, AnalysisRequest, UserTier, ImageAttachment } from '../types';
import { Language, TRANSLATIONS } from '../i18n';
import { extractTextFromPDF } from '../utils/pdfParser';

interface InputFormProps {
  onAnalyze: (request: AnalysisRequest) => void;
  isAnalyzing: boolean;
  language: Language;
  userTier?: UserTier;
  onRequireUpgrade?: (tier: 'pro' | 'studio', featureName?: string) => void;
}

const GENRES: Genre[] = [
  'Sci-Fi',
  'Psychological Thriller',
  'Drama',
  'Action / Adventure',
  'Dark Comedy',
  'Horror',
  'Crime / Noir',
  'Fantasy',
  'Romance',
  'Mystery',
];

const TARGET_MEDIUMS: TargetMedium[] = [
  'Feature Film',
  'TV Series (Pilot)',
  'Limited Series',
  'Short Film',
];

export const InputForm: React.FC<InputFormProps> = ({ 
  onAnalyze, 
  isAnalyzing, 
  language,
  userTier = 'free',
  onRequireUpgrade,
}) => {
  const [title, setTitle] = useState('');
  const [inputType, setInputType] = useState<InputType>('screenplay_excerpt');
  const [genre, setGenre] = useState<Genre>('Sci-Fi');
  const [targetMedium, setTargetMedium] = useState<TargetMedium>('Feature Film');
  const [scriptText, setScriptText] = useState('');
  const [imageAttachment, setImageAttachment] = useState<ImageAttachment | undefined>(undefined);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language];

  const FOCUS_OPTIONS = language === 'tr' ? [
    'Tam Dramaturji Raporu',
    '3 Perdeli Yapı & Vuruş Doğrulama',
    'Logline & Çengel Cilalama',
    'Karakter Yayı & İsteğe Karşı İhtiyaç',
    '2. Perde Temposu & Düz Nokta Tamiri',
    'Yapımcı Pitch Deck Verileri',
  ] : language === 'es' ? [
    'Informe Completo de Dramaturgia',
    'Estructura de 3 Actos y Verificación',
    'Pulido de Logline y Gancho',
    'Arco de Personaje y Deseo vs Necesidad',
    'Ritmo de Acto 2 y Corrección',
    'Datos de Pitch Deck de Productor',
  ] : [
    'Full Dramaturgy Report',
    '3-Act Structure & Beat Verification',
    'Logline & Hook Polish',
    'Character Arc & Want vs Need',
    'Act 2 Pacing & Flat Spot Fix',
    'Producer Pitch Deck Data',
  ];

  const [selectedFocus, setSelectedFocus] = useState<string[]>([FOCUS_OPTIONS[0]]);

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const estimatedPages = Math.max(1, Math.round((wordCount / 250) * 10) / 10);

  const handleToggleFocus = (focus: string) => {
    if (focus === FOCUS_OPTIONS[0]) {
      setSelectedFocus([FOCUS_OPTIONS[0]]);
      return;
    }

    let updated = selectedFocus.filter((f) => f !== FOCUS_OPTIONS[0]);
    if (updated.includes(focus)) {
      updated = updated.filter((f) => f !== focus);
    } else {
      updated.push(focus);
    }

    if (updated.length === 0) {
      updated = [FOCUS_OPTIONS[0]];
    }

    setSelectedFocus(updated);
  };

  // PDF, Image & File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      setTitle(cleanName);
    }

    // Check if image file (PNG, JPG, WEBP, etc)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setImageAttachment({
          mimeType: file.type,
          base64: base64Data,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.name.toLowerCase().endsWith('.pdf')) {
      setIsParsingPdf(true);
      try {
        const extractedText = await extractTextFromPDF(file);
        if (extractedText && extractedText.trim()) {
          setScriptText(extractedText);
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
          const b64 = evt.target?.result as string;
          setImageAttachment({
            mimeType: 'application/pdf',
            base64: b64,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('PDF Read error:', err);
      } finally {
        setIsParsingPdf(false);
      }
    } else {
      // Standard plain text, fountain, fdx, txt reader
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setScriptText(text || '');
        setImageAttachment(undefined);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptText.trim() && !imageAttachment) return;

    onAnalyze({
      title: title.trim() || (language === 'tr' ? 'İsimsiz Proje' : language === 'es' ? 'Proyecto Sin Título' : 'Untitled Project'),
      inputType,
      genre,
      targetMedium,
      scriptText,
      imageAttachment,
      focusAreas: selectedFocus,
    });
  };

  const handleClear = () => {
    setTitle('');
    setScriptText('');
    setImageAttachment(undefined);
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 mb-8 shadow-[8px_8px_0px_#1A1A1A]">
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Format Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] mb-1.5">
              {t.projectTitleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.projectTitlePlaceholder}
              className="w-full px-3.5 py-2 bg-[#FDFCFB] border-2 border-[#1A1A1A] text-sm font-sans text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-[2px_2px_0px_#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] mb-1.5">
              {t.inputFormatLabel}
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as InputType)}
              className="w-full px-3.5 py-2 bg-[#FDFCFB] border-2 border-[#1A1A1A] text-sm font-sans text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-red-600 shadow-[2px_2px_0px_#1A1A1A]"
            >
              <option value="screenplay_excerpt">{t.formatScreenplay}</option>
              <option value="pitch_concept">{t.formatPitch}</option>
              <option value="outline">{t.formatOutline}</option>
              <option value="treatment">{t.formatTreatment}</option>
              <option value="logline">{t.formatLogline}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] mb-1.5">
              {t.genreLabel}
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as Genre)}
              className="w-full px-3.5 py-2 bg-[#FDFCFB] border-2 border-[#1A1A1A] text-sm font-sans text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-red-600 shadow-[2px_2px_0px_#1A1A1A]"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] mb-1.5">
              {t.targetMediumLabel}
            </label>
            <select
              value={targetMedium}
              onChange={(e) => setTargetMedium(e.target.value as TargetMedium)}
              className="w-full px-3.5 py-2 bg-[#FDFCFB] border-2 border-[#1A1A1A] text-sm font-sans text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-red-600 shadow-[2px_2px_0px_#1A1A1A]"
            >
              {TARGET_MEDIUMS.map((tm) => (
                <option key={tm} value={tm}>
                  {tm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PDF, Image & Document File Upload Banner */}
        <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {imageAttachment && imageAttachment.mimeType.startsWith('image/') ? (
                <div className="w-12 h-12 border-2 border-[#1A1A1A] overflow-hidden bg-black shrink-0 relative">
                  <img src={imageAttachment.base64} alt="Script page preview" className="w-full h-full object-cover" />
                </div>
              ) : uploadedFileName ? (
                <div className="p-2.5 bg-red-600 text-white border-2 border-[#1A1A1A] shrink-0 shadow-[2px_2px_0px_#1A1A1A]">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="p-2.5 bg-[#1A1A1A] text-white border border-[#1A1A1A] shrink-0">
                  <Upload className="w-5 h-5 text-yellow-400" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                    {uploadedFileName ? `YÜKLENEN DOSYA: ${uploadedFileName}` : 'PDF / Resim (PNG/JPG) / Fountain / TXT Yükle'}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-emerald-700 text-white flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    Gemini Vision & Doküman Okuyucu
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                  {uploadedFileName
                    ? 'Dosyanız temiz bir şekilde aktarıldı. Gemini Yapay Zekâ doğrudan dokümanı analiz edecektir.'
                    : 'Senaryo resimlerinizi (sayfa fotoğrafları, storyboard) veya PDF/metin dosyalarınızı sürükleyip yükleyebilirsiniz.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.fountain,.fdx,image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
                id="script-pdf-file-input"
              />

              <label
                htmlFor="script-pdf-file-input"
                className="px-4 py-2 bg-white hover:bg-[#1A1A1A] hover:text-white border-2 border-[#1A1A1A] text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer flex items-center gap-2"
              >
                {isParsingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    <span>PDF İşleniyor...</span>
                  </>
                ) : imageAttachment ? (
                  <>
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[140px]">{uploadedFileName || 'Görsel Yüklendi'}</span>
                  </>
                ) : uploadedFileName ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[140px]">{uploadedFileName}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-red-600" />
                    <span>PDF veya Metin Seç</span>
                  </>
                )}
              </label>

              {uploadedFileName && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                  title="Dosyayı Kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Script / Pitch Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>{t.scriptTextLabel}</span>
            </label>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
              <span>{wordCount} {t.wordsLabel}</span>
              <span>•</span>
              <span>~{estimatedPages} {t.pagesLabel}</span>
              {scriptText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-red-600 hover:underline flex items-center gap-1 ml-2 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  {t.clearBtn}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={10}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder={
                language === 'tr'
                  ? `Senaryo sahnenizi, pitch fikrinizi veya 3 perdeli taslağınızı buraya yapıştırın veya yukarıdan PDF yükleyin...\n\nÖrnek:\nDIŞ. MAHKEME SALONU - GECE\nJULIAN VANE (40'larında) maun korkuluğun yanında durur...`
                  : language === 'es'
                  ? `Pegue la escena de su guion, concepto o esquema aquí o cargue un PDF...\n\nEjemplo:\nINT. SALA DE TRIBUNAL - NOCHE\nJULIAN VANE (40s) se encuentra junto a la barandilla...`
                  : `Paste your screenplay scene excerpt, pitch concept, or beat outline here, or upload a PDF above...\n\nExample:\nINT. DISTRICT COURT - NIGHT\nJULIAN VANE (40s) stands at the mahogany rail...`
              }
              className="w-full p-4 bg-white border-2 border-[#1A1A1A] text-sm font-mono text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 leading-relaxed shadow-[3px_3px_0px_#1A1A1A] resize-y"
            />
          </div>
        </div>

        {/* Focus Areas Chips */}
        <div>
          <label className="block text-[11px] font-mono uppercase font-bold tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-red-600" />
            <span>{t.analysisFocusLabel}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((focus) => {
              const isSelected = selectedFocus.includes(focus);
              return (
                <button
                  key={focus}
                  type="button"
                  onClick={() => handleToggleFocus(focus)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-[#1A1A1A] transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                      : 'bg-[#F9F7F2] text-[#1A1A1A] hover:bg-white shadow-[2px_2px_0px_#1A1A1A]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                  <span>{focus}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 hidden sm:block">
            {t.heroTag}
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || isParsingPdf || (!scriptText.trim() && !imageAttachment)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#1A1A1A] hover:bg-red-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-mono font-bold uppercase tracking-widest text-xs border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>{t.analyzingState}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t.runAnalysisBtn}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
