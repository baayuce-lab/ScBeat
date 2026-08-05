import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  FileCode, 
  FileText, 
  Trash2, 
  BookOpen, 
  Layers,
  HelpCircle,
  Zap,
  CheckCircle2,
  Maximize2,
  Minimize2,
  List,
  User,
  Film,
  Lock,
  ChevronRight,
  Printer,
  FileCheck
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n';
import { AnalysisRequest, UserTier } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ScreenplayEditorProps {
  language: Language;
  onAnalyzeScreenplay: (request: AnalysisRequest) => void;
  isAnalyzing: boolean;
  userTier?: UserTier;
  onRequireUpgrade?: (tier: 'pro' | 'studio', featureName?: string) => void;
}

export type ScreenplayElementType = 
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition';

export interface ScreenplayLine {
  id: string;
  type: ScreenplayElementType;
  text: string;
}

export const ScreenplayEditor: React.FC<ScreenplayEditorProps> = ({
  language,
  onAnalyzeScreenplay,
  isAnalyzing,
  userTier = 'free',
  onRequireUpgrade,
}) => {
  const t = TRANSLATIONS[language];

  const [projectTitle, setProjectTitle] = useState(() => {
    return language === 'tr' ? 'Yeni Senaryo' : language === 'es' ? 'Nuevo Guion' : 'New Script';
  });

  const [activeElementType, setActiveElementType] = useState<ScreenplayElementType>('scene_heading');
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Initialize with clean empty scene template
  const [lines, setLines] = useState<ScreenplayLine[]>(() => [
    {
      id: 'line-1',
      type: 'scene_heading',
      text: language === 'tr' ? 'İÇ. KARANLIK ODA - GECE' : language === 'es' ? 'INT. HABITACION OSCURA - NOCHE' : 'INT. DARK ROOM - NIGHT',
    },
    {
      id: 'line-2',
      type: 'action',
      text: '',
    },
  ]);

  const editorRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Helper to parse plain screenplay text into structured line objects
  function parseTextToLines(text: string): ScreenplayLine[] {
    const rawLines = text.split('\n');
    return rawLines.map((raw, idx) => {
      const trimmed = raw.trim();
      let type: ScreenplayElementType = 'action';

      if (
        trimmed.startsWith('EXT.') || 
        trimmed.startsWith('INT.') || 
        trimmed.startsWith('DIŞ.') || 
        trimmed.startsWith('İÇ.') ||
        trimmed.startsWith('INT/EXT') ||
        trimmed.startsWith('İÇ/DIŞ')
      ) {
        type = 'scene_heading';
      } else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        type = 'parenthetical';
      } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 35 && !trimmed.includes('.')) {
        if (trimmed.includes('CUT TO') || trimmed.includes('FADE') || trimmed.includes('GEÇİŞ') || trimmed.endsWith(':')) {
          type = 'transition';
        } else {
          type = 'character';
        }
      } else if (
        idx > 0 && 
        (rawLines[idx - 1].trim() === rawLines[idx - 1].trim().toUpperCase() || rawLines[idx - 1].trim().startsWith('('))
      ) {
        type = 'dialogue';
      }

      return {
        id: `line-${idx}-${Date.now()}-${Math.random()}`,
        type,
        text: raw,
      };
    });
  }

  // Line modification with smart auto-detection
  const handleLineChange = (id: string, newText: string) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;

        let detectedType = line.type;
        const upper = newText.trim().toUpperCase();

        // Smart element detection (Fade In style)
        if (upper.startsWith('INT.') || upper.startsWith('EXT.') || upper.startsWith('İÇ.') || upper.startsWith('DIŞ.')) {
          detectedType = 'scene_heading';
        } else if (newText.trim().startsWith('(') && newText.trim().endsWith(')')) {
          detectedType = 'parenthetical';
        } else if (upper.includes('CUT TO:') || upper.includes('FADE IN:') || upper.includes('FADE OUT.') || upper.includes('GEÇİŞ:')) {
          detectedType = 'transition';
        }

        return {
          ...line,
          text: newText,
          type: detectedType,
        };
      })
    );
  };

  const handleLineTypeChange = (id: string, newType: ScreenplayElementType) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, type: newType } : line))
    );
    setActiveElementType(newType);
  };

  // Keyboard navigation shortcuts (Fade In / Celtx feel)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, currentLine: ScreenplayLine, index: number) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      // Cycle element type: scene_heading -> action -> character -> parenthetical -> dialogue -> transition
      const types: ScreenplayElementType[] = ['scene_heading', 'action', 'character', 'parenthetical', 'dialogue', 'transition'];
      const nextIdx = (types.indexOf(currentLine.type) + 1) % types.length;
      handleLineTypeChange(currentLine.id, types[nextIdx]);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Smart Auto-advance element type
      let nextType: ScreenplayElementType = 'action';
      if (currentLine.type === 'scene_heading') nextType = 'action';
      if (currentLine.type === 'character') nextType = 'dialogue';
      if (currentLine.type === 'dialogue') nextType = 'action';
      if (currentLine.type === 'parenthetical') nextType = 'dialogue';

      const newLineId = `line-${Date.now()}-${Math.random()}`;
      const newLine: ScreenplayLine = {
        id: newLineId,
        type: nextType,
        text: '',
      };

      const updated = [...lines];
      updated.splice(index + 1, 0, newLine);
      setLines(updated);
      setActiveElementType(nextType);

      // Auto-focus next line after render
      setTimeout(() => {
        const nextEl = lineRefs.current[newLineId];
        if (nextEl) nextEl.focus();
      }, 50);
    } else if (e.key === 'Backspace' && currentLine.text === '' && lines.length > 1) {
      e.preventDefault();
      const updated = lines.filter((l) => l.id !== currentLine.id);
      setLines(updated);
      // Focus previous line
      const prevId = lines[index - 1]?.id;
      if (prevId && lineRefs.current[prevId]) {
        lineRefs.current[prevId]?.focus();
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      const prevId = lines[index - 1]?.id;
      if (prevId && lineRefs.current[prevId]) {
        lineRefs.current[prevId]?.focus();
      }
    } else if (e.key === 'ArrowDown' && index < lines.length - 1) {
      const nextId = lines[index + 1]?.id;
      if (nextId && lineRefs.current[nextId]) {
        lineRefs.current[nextId]?.focus();
      }
    }
  };

  const handleClear = () => {
    setLines([
      {
        id: `line-1`,
        type: 'scene_heading',
        text: language === 'tr' ? 'İÇ. SAHNE - GECE' : language === 'es' ? 'INT. ESCENA - NOCHE' : 'INT. SCENE - NIGHT',
      },
    ]);
  };

  const fullText = lines.map((l) => l.text).join('\n');
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  
  // Extract scene headings for Celtx Navigator
  const scenesList = lines
    .map((l, index) => ({ line: l, index }))
    .filter((item) => item.line.type === 'scene_heading' && item.line.text.trim());

  // Extract unique character names for Celtx Character List
  const charactersMap: { [key: string]: number } = {};
  lines.forEach((l) => {
    if (l.type === 'character' && l.text.trim()) {
      const name = l.text.trim().toUpperCase();
      charactersMap[name] = (charactersMap[name] || 0) + 1;
    }
  });
  const characterNames = Object.keys(charactersMap);

  const estimatedPages = Math.max(1, Math.round((wordCount / 220) * 10) / 10);
  const estimatedRuntimeMinutes = Math.max(1, Math.round(estimatedPages * 1));

  // Jump to specific line in script
  const scrollToLine = (lineId: string) => {
    const targetEl = lineRefs.current[lineId];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.focus();
    }
  };

  // Send to Doctor for Analysis
  const handleAnalyzeFromEditor = () => {
    if (!fullText.trim()) return;

    onAnalyzeScreenplay({
      title: projectTitle || 'Screenplay Draft',
      inputType: 'screenplay_excerpt',
      genre: 'Drama',
      targetMedium: 'Feature Film',
      scriptText: fullText,
      focusAreas: ['Full Dramaturgy Report', '3-Act Structure & Beat Verification'],
    });
  };

  // Tier Guard Check for Exports
  const checkExportAllowed = (formatName: string) => {
    if (userTier === 'free') {
      onRequireUpgrade?.('pro', `Senaryo Dışa Aktarma (${formatName})`);
      return false;
    }
    return true;
  };

  // 1. Export Fade In (.fadein)
  const exportFadeIn = () => {
    if (!checkExportAllowed('Fade In (.fadein)')) return;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<fadein version="1.0">\n<metadata>\n  <title>${projectTitle}</title>\n  <author>ScriptBeat Writer</author>\n</metadata>\n<screenplay>\n`;
    lines.forEach((l) => {
      let typeStr = 'Action';
      if (l.type === 'scene_heading') typeStr = 'Scene Heading';
      if (l.type === 'character') typeStr = 'Character';
      if (l.type === 'dialogue') typeStr = 'Dialogue';
      if (l.type === 'parenthetical') typeStr = 'Parenthetical';
      if (l.type === 'transition') typeStr = 'Transition';
      xml += `  <para type="${typeStr}"><text>${l.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></para>\n`;
    });
    xml += `</screenplay>\n</fadein>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.fadein`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Export Celtx (.celtx / .html)
  const exportCeltx = () => {
    if (!checkExportAllowed('Celtx (.celtx / HTML)')) return;
    let html = `<!DOCTYPE html>\n<html>\n<head>\n<title>${projectTitle} - Celtx Export</title>\n<style>\nbody { font-family: 'Courier New', Courier, monospace; margin: 40px; background: #fff; color: #000; }\n.scene_heading { font-weight: bold; text-transform: uppercase; margin-top: 20px; }\n.action { margin-top: 10px; }\n.character { text-align: center; font-weight: bold; margin-top: 15px; text-transform: uppercase; }\n.parenthetical { text-align: center; font-style: italic; }\n.dialogue { margin: 0 15%; }\n.transition { text-align: right; font-weight: bold; text-transform: uppercase; margin-top: 15px; }\n</style>\n</head>\n<body>\n<h1>${projectTitle}</h1>\n<hr/>\n`;
    lines.forEach((l) => {
      html += `<div class="${l.type}">${l.text.replace(/</g, '&lt;')}</div>\n`;
    });
    html += `</body>\n</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}_celtx.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Export Final Draft (.fdx)
  const exportFdx = () => {
    if (!checkExportAllowed('Final Draft .fdx')) return;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<FinalDraft DocumentType="Script" Version="1">\n<Content>\n`;
    lines.forEach((l) => {
      let fdxType = 'Action';
      if (l.type === 'scene_heading') fdxType = 'Scene Heading';
      if (l.type === 'character') fdxType = 'Character';
      if (l.type === 'dialogue') fdxType = 'Dialogue';
      if (l.type === 'parenthetical') fdxType = 'Parenthetical';
      if (l.type === 'transition') fdxType = 'Transition';

      xml += `  <Paragraph Type="${fdxType}"><Text>${l.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Text></Paragraph>\n`;
    });
    xml += `</Content>\n</FinalDraft>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.fdx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 4. Export Fountain (.fountain)
  const exportFountain = () => {
    if (!checkExportAllowed('Fountain')) return;
    let fountainContent = `Title: ${projectTitle}\nCredit: Written with ScriptBeat Studio\n\n${fullText}`;
    const blob = new Blob([fountainContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.fountain`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 5. Export Plain Text (.txt)
  const exportTxt = () => {
    if (!checkExportAllowed('TXT')) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 6. Export Hollywood Formatted PDF
  const exportPDF = async () => {
    if (!checkExportAllowed('Hollywood PDF')) return;
    setIsExportingPdf(true);
    try {
      const pageElement = document.getElementById('screenplay-paper-page');
      if (!pageElement) return;

      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('screenplay-paper-page');
          if (el) {
            el.style.backgroundColor = '#FFFFFF';
            el.style.color = '#000000';
            const allElements = el.querySelectorAll('*');
            allElements.forEach((node) => {
              const htmlEl = node as HTMLElement;
              htmlEl.style.color = '#000000';
              if (htmlEl.style.borderColor) htmlEl.style.borderColor = '#CCCCCC';
            });
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.pdf`);
    } catch (err) {
      console.warn('html2canvas failed, falling back to clean direct jsPDF text generator:', err);
      try {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.setFont('Courier', 'normal');
        pdf.setFontSize(11);

        let y = 20;
        pdf.text(`${projectTitle.toUpperCase()} - SAYFA 1`, 20, y);
        y += 15;

        lines.forEach((l) => {
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }
          if (l.type === 'scene_heading') {
            pdf.setFont('Courier', 'bold');
            pdf.text((l.text || '').toUpperCase(), 20, y);
            y += 8;
          } else if (l.type === 'character') {
            pdf.setFont('Courier', 'bold');
            pdf.text((l.text || '').toUpperCase(), 80, y);
            y += 6;
          } else if (l.type === 'dialogue') {
            pdf.setFont('Courier', 'normal');
            const splitDialogue = pdf.splitTextToSize(l.text || '', 100);
            pdf.text(splitDialogue, 50, y);
            y += splitDialogue.length * 6;
          } else {
            pdf.setFont('Courier', 'normal');
            const splitAction = pdf.splitTextToSize(l.text || '', 160);
            pdf.text(splitAction, 20, y);
            y += splitAction.length * 6;
          }
        });

        pdf.save(`${projectTitle.replace(/[^a-z0-9]/gi, '_') || 'screenplay'}.pdf`);
      } catch (pdfErr) {
        console.error('PDF export fallback error:', pdfErr);
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className={`space-y-4 animate-fade-in ${isZenMode ? 'fixed inset-0 z-50 bg-[#121212] p-4 overflow-y-auto' : ''}`}>
      {/* Studio Header & Main Toolbar (Fade In / Final Draft Style) */}
      <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-4 shadow-[6px_6px_0px_#1A1A1A] rounded-lg">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-700">
          {/* Title & Screenplay Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white border border-white shrink-0 shadow-[2px_2px_0px_#FFFFFF]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-transparent border-b border-dashed border-slate-500 hover:border-white focus:border-red-500 focus:outline-none font-serif font-bold text-lg text-white w-56 sm:w-80"
                  placeholder="Senaryo Başlığı..."
                />
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-yellow-400 text-[#1A1A1A]">
                  FADE IN MODU
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Sade, odağı dağıtmayan profesyonel senaryo stüdyosu
              </p>
            </div>
          </div>

          {/* Action Controls & AI Doctor Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsZenMode(!isZenMode)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer rounded"
              title="Tam Ekran Odaklanma Modu"
            >
              {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isZenMode ? 'Normal Ekran' : 'Tam Odaklanma'}</span>
            </button>

            <button
              type="button"
              onClick={handleAnalyzeFromEditor}
              disabled={isAnalyzing || !fullText.trim()}
              className="px-4 py-1.5 bg-red-600 hover:bg-white hover:text-[#1A1A1A] disabled:opacity-50 text-white font-mono font-bold uppercase text-xs border border-white shadow-[2px_2px_0px_#EAB308] transition-all flex items-center gap-2 cursor-pointer rounded"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isAnalyzing ? 'Analiz Ediliyor...' : 'Senaryo Doktoruna Gönder'}</span>
            </button>
          </div>
        </div>

        {/* Format Toolbar Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 mr-1 shrink-0">
              Format:
            </span>
            {[
              { type: 'scene_heading', label: '1. SAHNE BAŞLIĞI' },
              { type: 'action', label: '2. AKSİYON' },
              { type: 'character', label: '3. KARAKTER' },
              { type: 'parenthetical', label: '4. (PARANTEZ)' },
              { type: 'dialogue', label: '5. DİYALOG' },
              { type: 'transition', label: '6. GEÇİŞ' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  setActiveElementType(item.type as ScreenplayElementType);
                  if (activeLineId) handleLineTypeChange(activeLineId, item.type as ScreenplayElementType);
                }}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border rounded transition-all cursor-pointer shrink-0 ${
                  activeElementType === item.type
                    ? 'bg-red-600 text-white border-white shadow-[2px_2px_0px_#FFFFFF]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Script Stats Pill */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 bg-slate-900 px-3 py-1 border border-slate-700 rounded">
            <div>
              <span className="text-yellow-400 font-bold">{scenesList.length}</span> Sahne
            </div>
            <div>
              <span className="text-yellow-400 font-bold">{wordCount}</span> Kelime
            </div>
            <div>
              <span className="text-red-400 font-bold">~{estimatedPages}</span> Sayfa (~{estimatedRuntimeMinutes} Dk)
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Sahne Navigatörü ve Dışa Aktarma */}
        <div className="lg:col-span-1 space-y-4">
          {/* Sahneler Listesi (Celtx / Fade In Sahne Dizin Kartları) */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A] rounded-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#1A1A1A]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <List className="w-4 h-4 text-red-600" />
                <span>Sahne Navigatörü</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5">
                {scenesList.length} Sahne
              </span>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {scenesList.length === 0 ? (
                <p className="text-xs text-slate-500 font-sans p-2 italic text-center">
                  Henüz sahne başlığı bulunmuyor. İÇ. veya DIŞ. yazarak başlayabilirsiniz.
                </p>
              ) : (
                scenesList.map((sc, idx) => (
                  <button
                    key={sc.line.id}
                    onClick={() => scrollToLine(sc.line.id)}
                    className="w-full text-left p-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[11px] font-mono font-bold truncate transition-all flex items-center justify-between group cursor-pointer rounded"
                  >
                    <span className="truncate">
                      {idx + 1}. {sc.line.text || 'İÇ. İSİMSİZ SAHNE'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Dışa Aktar Paneli */}
          <div className="bg-white border-2 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A] rounded-lg space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b-2 border-[#1A1A1A]">
              Dışa Aktar ve İndir
            </h3>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={exportPDF}
                disabled={isExportingPdf}
                className="py-2 px-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>{isExportingPdf ? '...' : 'PDF İndir'}</span>
              </button>

              <button
                onClick={exportFdx}
                className="py-2 px-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded"
              >
                <FileCode className="w-3.5 h-3.5 text-red-600" />
                <span>Final Draft</span>
              </button>

              <button
                onClick={exportFadeIn}
                className="py-2 px-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fade In</span>
              </button>

              <button
                onClick={exportFountain}
                className="py-2 px-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fountain</span>
              </button>
            </div>

            <button
              onClick={handleClear}
              className="w-full py-2 px-3 bg-red-50 hover:bg-red-600 hover:text-white border border-red-300 text-[11px] font-mono font-bold uppercase tracking-wider text-red-700 transition-all flex items-center justify-between cursor-pointer mt-3 rounded"
            >
              <span>Sayfayı Temizle</span>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Kısayol İpuçları */}
          <div className="bg-[#F9F7F2] border-2 border-[#1A1A1A] p-3 text-[11px] font-mono text-slate-700 space-y-1 rounded-lg">
            <span className="font-bold text-[#1A1A1A] block uppercase border-b border-[#1A1A1A] pb-1 mb-1">
              Kısayollar:
            </span>
            <p><span className="font-bold text-red-600">Tab:</span> Format Öğesini Değiştir</p>
            <p><span className="font-bold text-red-600">Enter:</span> Sonraki Satıra Geç</p>
            <p><span className="font-bold text-red-600">İÇ. / DIŞ.</span> otomatik Sahne Başlığı yapar</p>
          </div>
        </div>

        {/* Right Canvas: Gerçek Beyaz Senaryo Sayfası (Courier Prime) */}
        <div className="lg:col-span-3">
          <div className="bg-[#2B2B2B] p-4 sm:p-8 rounded-lg border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A]">
            <div 
              id="screenplay-paper-page"
              className="bg-white border-2 border-[#1A1A1A] p-8 sm:p-14 shadow-[6px_6px_0px_#000000] min-h-[820px] font-mono leading-relaxed relative select-text rounded-sm"
              style={{ fontFamily: "'Courier Prime', 'Courier New', Courier, monospace", color: '#1A1A1A' }}
            >
              {/* Standart Senaryo Sayfası Üst Başlığı */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-8 text-[11px] text-slate-500 uppercase tracking-widest font-mono select-none">
                <span>{projectTitle || 'İSİMSİZ SENARYO'}</span>
                <span>SAYFA 1.</span>
              </div>

              {/* Senaryo Satırları */}
              <div ref={editorRef} className="space-y-3">
                {lines.map((line, idx) => {
                  let alignStyle = 'pl-0 max-w-full text-[#1A1A1A]';
                  
                  // Otantik Hollywood & Fade In Format Kuralları
                  if (line.type === 'scene_heading') {
                    alignStyle = 'font-bold uppercase tracking-wider text-[#1A1A1A] bg-slate-100 p-1.5 border-l-4 border-[#1A1A1A] my-4';
                  } else if (line.type === 'character') {
                    alignStyle = 'text-center uppercase font-bold tracking-widest pl-0 sm:pl-32 pr-0 sm:pr-32 text-[#1A1A1A] mt-5';
                  } else if (line.type === 'parenthetical') {
                    alignStyle = 'text-center pl-0 sm:pl-36 pr-0 sm:pr-36 text-slate-700 italic text-xs';
                  } else if (line.type === 'dialogue') {
                    alignStyle = 'pl-4 sm:pl-24 pr-4 sm:pr-24 text-[#1A1A1A]';
                  } else if (line.type === 'transition') {
                    alignStyle = 'text-right uppercase font-bold tracking-widest text-[#1A1A1A] my-3 pr-4';
                  }

                  return (
                    <div key={line.id} className="relative group">
                      <textarea
                        ref={(el) => (lineRefs.current[line.id] = el)}
                        rows={1}
                        value={line.text}
                        onFocus={() => {
                          setActiveLineId(line.id);
                          setActiveElementType(line.type);
                        }}
                        onChange={(e) => handleLineChange(line.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, line, idx)}
                        placeholder={
                          line.type === 'scene_heading'
                            ? 'İÇ. KARANLIK ODA - GECE'
                            : line.type === 'character'
                            ? 'KARAKTER İSMİ'
                            : line.type === 'parenthetical'
                            ? '(fısıldayarak)'
                            : line.type === 'dialogue'
                            ? 'Diyalog cümlesi buraya yazılır...'
                            : 'Aksiyon ve mekan betimlemesi...'
                        }
                        className={`w-full bg-transparent border-b border-dashed border-transparent hover:border-slate-300 focus:border-red-600 focus:outline-none resize-none overflow-hidden ${alignStyle}`}
                        style={{ height: 'auto' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
