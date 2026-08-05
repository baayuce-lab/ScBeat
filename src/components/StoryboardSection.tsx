import React, { useState } from 'react';
import { 
  Film, 
  Camera, 
  Sparkles, 
  Layers, 
  Download, 
  Eye, 
  RefreshCw, 
  Sun, 
  User, 
  Sliders, 
  Maximize2,
  Lock,
  Printer,
  FileCheck
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n';
import { UserTier } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StoryboardFrame {
  id: string;
  sceneNumber: number;
  heading: string;
  actionText: string;
  characters: string[];
  shotType: string;
  cameraAngle: string;
  lightingMood: string;
  imageUrl: string;
  seed: string;
  directorNote: string;
}

interface StoryboardSectionProps {
  scriptText: string;
  projectTitle?: string;
  language: Language;
  userTier?: UserTier;
  onRequireUpgrade?: (tier: 'pro' | 'studio', featureName?: string) => void;
}

export const StoryboardSection: React.FC<StoryboardSectionProps> = ({
  scriptText,
  projectTitle = 'Senaryo',
  language,
  userTier = 'free',
  onRequireUpgrade,
}) => {
  const t = TRANSLATIONS[language];
  const [isExporting, setIsExporting] = useState(false);

  // Parse scene headings and action lines from script text
  const parseScenesToStoryboard = (text: string): StoryboardFrame[] => {
    const rawLines = text.split('\n');
    const scenes: StoryboardFrame[] = [];
    let currentHeading = '';
    let currentAction = '';
    let currentChars: string[] = [];
    let sceneCount = 0;

    const shotTypes = language === 'tr' 
      ? ['Genel Plan (Wide Shot)', 'Yakın Plan (Close-up)', 'Orta Plan (Medium Shot)', 'Omuz Üstü (Over-the-shoulder)', 'Kuş Bakışı (High Angle)']
      : ['Wide Shot', 'Close-up', 'Medium Shot', 'Over-the-shoulder', 'High Angle'];

    const cameraAngles = language === 'tr'
      ? ['Göz Hizası (Eye-Level)', 'Alt Açı (Low Angle)', 'Dinamik Pan (Tracking)', 'Sabit Kitle (Static Lock)']
      : ['Eye-Level', 'Low Angle', 'Tracking Pan', 'Static Lock'];

    const lightingMoods = language === 'tr'
      ? ['Düşük Işık / Chiaroscuro Noir', 'Soğuk Mavi Neon / Siberpunk', 'Sıcak Altın Saat Sıcaklığı', 'Dramatik Yüksek Kontrast']
      : ['Low Light / Chiaroscuro Noir', 'Cold Blue Neon', 'Golden Hour Warmth', 'Dramatic High Contrast'];

    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith('INT.') || 
        trimmed.startsWith('EXT.') || 
        trimmed.startsWith('İÇ.') || 
        trimmed.startsWith('DIŞ.') ||
        trimmed.startsWith('INT/EXT') ||
        trimmed.startsWith('İÇ/DIŞ')
      ) {
        if (currentHeading) {
          sceneCount++;
          const seedStr = `sc_${sceneCount}_${encodeURIComponent(currentHeading.slice(0, 10))}`;
          scenes.push({
            id: `sb_${sceneCount}_${Date.now()}`,
            sceneNumber: sceneCount,
            heading: currentHeading,
            actionText: currentAction.trim() || (language === 'tr' ? 'Atmosferik sahne açılışı ve ana aksiyon.' : 'Atmospheric scene opening action.'),
            characters: Array.from(new Set(currentChars)),
            shotType: shotTypes[sceneCount % shotTypes.length],
            cameraAngle: cameraAngles[sceneCount % cameraAngles.length],
            lightingMood: lightingMoods[sceneCount % lightingMoods.length],
            imageUrl: `https://picsum.photos/seed/${seedStr}/640/360`,
            seed: seedStr,
            directorNote: language === 'tr' 
              ? 'Dramatik odağı güçlendirmek için derinlik hissini ön plana çıkarın.'
              : 'Enhance depth of field to emphasize protagonist isolation.',
          });
        }
        currentHeading = trimmed;
        currentAction = '';
        currentChars = [];
      } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 30 && !trimmed.includes('.')) {
        currentChars.push(trimmed);
      } else if (trimmed && !trimmed.startsWith('(')) {
        if (currentAction.length < 200) {
          currentAction += ' ' + trimmed;
        }
      }
    });

    // Push last scene if exists
    if (currentHeading) {
      sceneCount++;
      const seedStr = `sc_${sceneCount}_last`;
      scenes.push({
        id: `sb_${sceneCount}_${Date.now()}`,
        sceneNumber: sceneCount,
        heading: currentHeading,
        actionText: currentAction.trim() || (language === 'tr' ? 'Sahne final aksiyonu.' : 'Scene final action.'),
        characters: Array.from(new Set(currentChars)),
        shotType: shotTypes[sceneCount % shotTypes.length],
        cameraAngle: cameraAngles[0],
        lightingMood: lightingMoods[0],
        imageUrl: `https://picsum.photos/seed/${seedStr}/640/360`,
        seed: seedStr,
        directorNote: language === 'tr' ? 'Görsel temayı güçlendirin.' : 'Strengthen visual motif.',
      });
    }

    // Default fallback if no INT./EXT. found
    if (scenes.length === 0) {
      scenes.push({
        id: `sb_1_default`,
        sceneNumber: 1,
        heading: language === 'tr' ? 'İÇ. AYNA ODA - GECE' : 'INT. MIRROR ROOM - NIGHT',
        actionText: text.slice(0, 180) || (language === 'tr' ? 'Karakter loş odada durur ve geçmişiyle yüzleşir.' : 'Character stands in dim room.'),
        characters: [language === 'tr' ? 'PROTAGONİST' : 'PROTAGONIST'],
        shotType: shotTypes[0],
        cameraAngle: cameraAngles[0],
        lightingMood: lightingMoods[0],
        imageUrl: `https://picsum.photos/seed/scriptbeat_hero_storyboard/640/360`,
        seed: 'scriptbeat_hero_storyboard',
        directorNote: language === 'tr' ? 'Sinematik klostrofobik atmosfer.' : 'Cinematic claustrophobic atmosphere.',
      });
    }

    return scenes;
  };

  const [frames, setFrames] = useState<StoryboardFrame[]>(() => parseScenesToStoryboard(scriptText));

  // Regenerate frame image seed
  const handleRegenerateFrame = (frameId: string) => {
    setFrames((prev) =>
      prev.map((f) => {
        if (f.id !== frameId) return f;
        const newSeed = `seed_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        return {
          ...f,
          seed: newSeed,
          imageUrl: `https://picsum.photos/seed/${newSeed}/640/360`,
        };
      })
    );
  };

  // Export Storyboard PDF
  const handleExportPDF = async () => {
    if (userTier === 'free') {
      onRequireUpgrade?.('pro', 'Görsel Storyboard PDF Çıktısı');
      return;
    }

    setIsExporting(true);
    try {
      const container = document.getElementById('storyboard-grid-export');
      if (!container) return;

      const canvas = await html2canvas(container, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#F9F7F2',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectTitle.replace(/[^a-z0-9]/gi, '_')}_storyboard.pdf`);
    } catch (err) {
      console.error('Storyboard PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Storyboard Header Banner */}
      <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 shadow-[6px_6px_0px_#DC2626] flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white border-2 border-white shadow-[2px_2px_0px_#EAB308] shrink-0">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-serif font-bold text-white">Canlı Yapay Zeka Storyboard Görselleştirici</h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-yellow-400 text-[#1A1A1A]">
                FİLM KARELERİ
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Senaryonuzdaki her sahne başlığı ve betimleme anında sinematik görsel karelere dönüştürülür.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-red-600 hover:bg-white hover:text-[#1A1A1A] text-white font-mono font-bold uppercase text-xs border-2 border-white shadow-[2px_2px_0px_#EAB308] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isExporting ? 'PDF Hazırlanıyor...' : 'Storyboard PDF İndir'}</span>
          </button>
        </div>
      </div>

      {/* Storyboard Grid */}
      <div id="storyboard-grid-export" className="bg-[#F9F7F2] p-6 border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-red-600" />
            <span className="text-sm font-serif font-bold uppercase tracking-wider text-[#1A1A1A]">
              {projectTitle} — Sinematik Sahne Görsel Tablosu ({frames.length} Sahne Kare)
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            ScriptBeat Auto-Storyboard System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] overflow-hidden flex flex-col justify-between group hover:shadow-[6px_6px_0px_#DC2626] transition-all"
            >
              {/* Frame Card Top */}
              <div className="p-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b-2 border-[#1A1A1A]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-600 text-white">
                    SAHNE {frame.sceneNumber}
                  </span>
                  <span className="text-xs font-mono font-bold truncate max-w-[180px] text-yellow-300">
                    {frame.heading}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRegenerateFrame(frame.id)}
                  className="p-1 hover:bg-red-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Yeni Görsel Üret"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Storyboard Artwork Display */}
              <div className="relative aspect-video bg-black overflow-hidden border-b-2 border-[#1A1A1A]">
                <img
                  src={frame.imageUrl}
                  alt={frame.heading}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 hover:opacity-100"
                />
                
                {/* Cinematic Shot Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-yellow-400 text-[9px] font-mono font-bold uppercase border border-yellow-500/40">
                  {frame.shotType}
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-slate-200 text-[9px] font-mono font-bold uppercase border border-slate-700">
                  {frame.cameraAngle}
                </div>
              </div>

              {/* Storyboard Frame Details */}
              <div className="p-4 space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                    Aksiyon & Sahne Betimlemesi:
                  </span>
                  <p className="text-slate-800 line-clamp-3 leading-relaxed font-sans italic bg-[#F9F7F2] p-2 border border-slate-300">
                    "{frame.actionText}"
                  </p>
                </div>

                {/* Technical Camera & Lighting Specs */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-slate-200 pt-2">
                  <div>
                    <span className="text-slate-500 block">IŞIK & ATMOSFER:</span>
                    <span className="font-bold text-[#1A1A1A]">{frame.lightingMood}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SAHNEDEKİ KARAKTERLER:</span>
                    <span className="font-bold text-indigo-700">
                      {frame.characters.length > 0 ? frame.characters.join(', ') : 'İsimsiz Karakter'}
                    </span>
                  </div>
                </div>

                {/* Director Note */}
                <div className="bg-yellow-50 border border-yellow-300 p-2 text-[11px] font-mono text-slate-700">
                  <span className="font-bold text-red-600 block text-[9px]">YÖNETMEN VE GÖRÜNTÜ YÖNETMENİ NOTU:</span>
                  {frame.directorNote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
