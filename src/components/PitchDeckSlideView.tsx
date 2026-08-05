import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Film, 
  Sparkles, 
  Code, 
  X,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PitchDeckData, UserTier } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface PitchDeckSlideViewProps {
  pitchDeck: PitchDeckData;
  language?: Language;
  onClose?: () => void;
  userTier?: UserTier;
  onRequireUpgrade?: (tier: 'pro' | 'studio', featureName?: string) => void;
}

export const PitchDeckSlideView: React.FC<PitchDeckSlideViewProps> = ({ 
  pitchDeck, 
  language = 'tr',
  onClose,
  userTier = 'free',
  onRequireUpgrade
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.tr;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<'slides' | 'json'>('slides');

  const slides = [
    { id: 0, title: 'Title & High Concept' },
    { id: 1, title: 'Logline & Hook' },
    { id: 2, title: 'Story Synopsis' },
    { id: 3, title: 'Key Characters' },
    { id: 4, title: 'Tone, Mood & Comps' },
    { id: 5, title: 'Audience & Positioning' },
    { id: 6, title: 'Thematic Core' },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCopyJSON = () => {
    const jsonStr = pitchDeck.pitchDeckJSON || JSON.stringify(pitchDeck, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleDownloadJSON = () => {
    if (userTier !== 'studio') {
      onRequireUpgrade?.('studio', 'Pitch Deck JSON Dışa Aktarımı');
      return;
    }
    const jsonStr = pitchDeck.pitchDeckJSON || JSON.stringify(pitchDeck, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(pitchDeck.projectTitle || 'pitch_deck').toLowerCase().replace(/\s+/g, '_')}_pitch_deck.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (userTier !== 'studio') {
      onRequireUpgrade?.('studio', 'Görsel Pitch Deck PDF İndirme');
      return;
    }
    setIsGeneratingPdf(true);
    const container = document.getElementById('pdf-slides-export-container');
    
    try {
      if (!container) throw new Error('Export container element missing');

      // Display off-screen container for capture
      container.style.display = 'block';

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const slideElements = container.querySelectorAll('[data-pdf-slide]');

      for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#F9F7F2',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage();
        }

        // A4 Landscape is 297mm x 210mm
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      }

      const safeTitle = (pitchDeck.projectTitle || 'pitch_deck')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_');
      pdf.save(`${safeTitle}_pitch_deck.pdf`);
    } catch (err) {
      console.error('Error exporting PDF slides:', err);
    } finally {
      setIsGeneratingPdf(false);
      if (container) {
        container.style.display = 'none';
      }
    }
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#1A1A1A] space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-[#1A1A1A] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626]">
            <Presentation className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Producer Pitch Deck Presentation</h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white bg-[#1A1A1A]">
                Studio Deck
              </span>
            </div>
            <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">
              {pitchDeck.projectTitle} • Producer-facing Pitch Deck
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#F9F7F2] p-1 border-2 border-[#1A1A1A]">
            <button
              onClick={() => setActiveTab('slides')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'slides'
                  ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                  : 'text-[#1A1A1A] hover:bg-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slides View</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#DC2626]'
                  : 'text-[#1A1A1A] hover:bg-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-[#1A1A1A] disabled:bg-slate-400 text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            title={t.downloadPdfBtn}
          >
            {isGeneratingPdf ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isGeneratingPdf ? t.generatingPdf : t.downloadPdfBtn}</span>
          </button>

          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#F9F7F2] hover:bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            title="Copy Pitch Deck JSON"
          >
            {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJSON ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-red-600 text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            title="Download JSON File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON File</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A] hover:bg-red-600 hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Display */}
      {activeTab === 'slides' ? (
        <div className="space-y-4">
          {/* Slide Frame */}
          <div className="relative aspect-[16/9] w-full bg-[#F9F7F2] border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] overflow-hidden p-6 sm:p-10 flex flex-col justify-between">
            {/* Slide Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                PRODUCER PITCH DECK • SLIDE 0{currentSlide + 1} OF 07
              </span>
              <span className="text-xs font-mono uppercase font-bold text-[#1A1A1A]">
                {slides[currentSlide].title}
              </span>
            </div>

            {/* Slide Content Area */}
            <div className="my-auto py-4">
              {/* SLIDE 0: TITLE */}
              {currentSlide === 0 && (
                <div className="space-y-4 text-center max-w-2xl mx-auto">
                  <span className="inline-block px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#1A1A1A] text-white">
                    {pitchDeck.genreAndFormat}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1A1A1A] tracking-tight">
                    {pitchDeck.projectTitle}
                  </h1>
                  <p className="text-sm sm:text-lg text-slate-800 font-serif italic border-b border-t border-[#1A1A1A] py-2 inline-block">
                    "{pitchDeck.tagline}"
                  </p>
                </div>
              )}

              {/* SLIDE 1: LOGLINE & HOOK */}
              {currentSlide === 1 && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                      The Logline
                    </span>
                    <p className="text-base sm:text-2xl text-[#1A1A1A] font-serif leading-relaxed italic border-l-4 border-red-600 pl-4 py-1">
                      "{pitchDeck.refinedLogline}"
                    </p>
                  </div>

                  <div className="bg-white p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] block">
                      High-Concept Hook
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                      {pitchDeck.highConceptHook}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 2: SYNOPSIS */}
              {currentSlide === 2 && (
                <div className="space-y-4 max-w-3xl mx-auto max-h-[300px] overflow-y-auto pr-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                    Narrative Synopsis & Story Arc
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                    {pitchDeck.synopsis}
                  </p>
                </div>
              )}

              {/* SLIDE 3: KEY CHARACTERS */}
              {currentSlide === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {pitchDeck.keyCharacters?.map((char, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-serif font-bold text-[#1A1A1A]">{char.name}</span>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1A1A1A] text-white">
                          {char.role}
                        </span>
                      </div>
                      <p className="text-xs font-serif text-red-600 italic">"{char.tagline}"</p>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans">{char.arcSummary}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* SLIDE 4: TONE, MOOD & COMPS */}
              {currentSlide === 4 && (
                <div className="space-y-5 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                      Tone & Visual Atmosphere
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                      {pitchDeck.toneAndMood?.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {pitchDeck.toneAndMood?.keywords?.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1A1A1A] text-white uppercase tracking-wider"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t-2 border-[#1A1A1A]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                      Comparable Titles ("Comps")
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pitchDeck.comps?.map((comp, cIdx) => (
                        <div key={cIdx} className="bg-white p-3 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                          <span className="text-xs font-serif font-bold text-[#1A1A1A] block">{comp.title}</span>
                          <span className="text-[11px] font-sans text-slate-600 line-clamp-2">
                            {comp.comparisonReason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 5: TARGET AUDIENCE & POSITIONING */}
              {currentSlide === 5 && (
                <div className="space-y-5 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                      Target Audience & Demographics
                    </span>
                    <p className="text-xs sm:text-sm text-[#1A1A1A] font-serif font-bold">
                      {pitchDeck.targetAudience?.primaryDemographic}
                    </p>
                  </div>

                  <div className="space-y-2 bg-white p-4 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] block">
                      Commercial Appeal & Positioning
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                      {pitchDeck.targetAudience?.audienceAppeal}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 6: THEMATIC CORE */}
              {currentSlide === 6 && (
                <div className="space-y-4 text-center max-w-2xl mx-auto">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 block">
                    Thematic Core & Emotional Resonance
                  </span>
                  <p className="text-sm sm:text-xl text-[#1A1A1A] font-serif italic leading-relaxed border-l-4 border-red-600 pl-4 text-left">
                    "{pitchDeck.thematicCore}"
                  </p>
                </div>
              )}
            </div>

            {/* Slide Footer Navigation */}
            <div className="flex items-center justify-between border-t-2 border-[#1A1A1A] pt-4">
              <div className="flex gap-1.5">
                {slides.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(s.id)}
                    className={`h-3 border border-[#1A1A1A] transition-all cursor-pointer ${
                      currentSlide === s.id
                        ? 'bg-[#1A1A1A] w-8'
                        : 'bg-white w-3 hover:bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 bg-white hover:bg-slate-100 text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 bg-[#1A1A1A] hover:bg-red-600 text-white font-bold border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* JSON View */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase">
            <span>Standard Pitch Deck JSON Payload for Studio Integration</span>
            <span>{pitchDeck.pitchDeckJSON?.length || 0} characters</span>
          </div>

          <pre className="p-4 bg-[#1A1A1A] text-emerald-400 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-xs font-mono overflow-x-auto max-h-[500px]">
            {pitchDeck.pitchDeckJSON || JSON.stringify(pitchDeck, null, 2)}
          </pre>
        </div>
      )}

      {/* Hidden PDF Export Canvas Container (Fixed 297mm x 210mm proportional size for A4 Landscape) */}
      <div 
        id="pdf-slides-export-container" 
        style={{ display: 'none', position: 'fixed', left: '-9999px', top: '-9999px' }}
      >
        {[
          /* Slide 1 */
          <div key="pdf-0" data-pdf-slide="0" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 01/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">TITLE & HIGH CONCEPT</span>
            </div>
            <div className="my-auto text-center space-y-6">
              <span className="inline-block px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest bg-[#1A1A1A] text-white">
                {pitchDeck.genreAndFormat}
              </span>
              <h1 className="text-5xl font-serif font-black text-[#1A1A1A]">{pitchDeck.projectTitle}</h1>
              <p className="text-2xl text-slate-800 font-serif italic border-y-2 border-[#1A1A1A] py-3 inline-block max-w-3xl">
                "{pitchDeck.tagline}"
              </p>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 2 */
          <div key="pdf-1" data-pdf-slide="1" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 02/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">LOGLINE & HOOK</span>
            </div>
            <div className="my-auto space-y-8 max-w-4xl mx-auto w-full">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">THE LOGLINE</span>
                <p className="text-2xl text-[#1A1A1A] font-serif italic border-l-8 border-red-600 pl-6 py-2">
                  "{pitchDeck.refinedLogline}"
                </p>
              </div>
              <div className="bg-white p-6 border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A]">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] block mb-2">HIGH-CONCEPT HOOK</span>
                <p className="text-base text-slate-800 leading-relaxed font-sans">{pitchDeck.highConceptHook}</p>
              </div>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 3 */
          <div key="pdf-2" data-pdf-slide="2" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 03/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">STORY SYNOPSIS</span>
            </div>
            <div className="my-auto space-y-4 max-w-4xl mx-auto w-full">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">NARRATIVE SYNOPSIS & STORY ARC</span>
              <p className="text-base text-slate-800 leading-relaxed whitespace-pre-line font-sans bg-white p-6 border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A]">
                {pitchDeck.synopsis}
              </p>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 4 */
          <div key="pdf-3" data-pdf-slide="3" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 04/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">KEY CHARACTERS</span>
            </div>
            <div className="my-auto grid grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              {pitchDeck.keyCharacters?.map((char, i) => (
                <div key={i} className="bg-white p-6 border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-serif font-bold text-[#1A1A1A]">{char.name}</span>
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 bg-[#1A1A1A] text-white">{char.role}</span>
                  </div>
                  <p className="text-sm font-serif text-red-600 italic">"{char.tagline}"</p>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans">{char.arcSummary}</p>
                </div>
              ))}
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 5 */
          <div key="pdf-4" data-pdf-slide="4" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 05/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">TONE, MOOD & COMPS</span>
            </div>
            <div className="my-auto space-y-6 max-w-4xl mx-auto w-full">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">TONE & VISUAL ATMOSPHERE</span>
                <p className="text-base text-slate-800 leading-relaxed font-sans">{pitchDeck.toneAndMood?.summary}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {pitchDeck.toneAndMood?.keywords?.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs font-mono font-bold bg-[#1A1A1A] text-white uppercase">#{kw}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t-4 border-[#1A1A1A]">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">COMPARABLE TITLES ("COMPS")</span>
                <div className="grid grid-cols-2 gap-4">
                  {pitchDeck.comps?.map((comp, idx) => (
                    <div key={idx} className="bg-white p-4 border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                      <span className="text-sm font-serif font-bold text-[#1A1A1A] block mb-1">{comp.title}</span>
                      <span className="text-xs text-slate-700 font-sans">{comp.comparisonReason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 6 */
          <div key="pdf-5" data-pdf-slide="5" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 06/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">AUDIENCE & POSITIONING</span>
            </div>
            <div className="my-auto space-y-6 max-w-4xl mx-auto w-full">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">TARGET AUDIENCE & DEMOGRAPHICS</span>
                <p className="text-lg text-[#1A1A1A] font-serif font-bold">{pitchDeck.targetAudience?.primaryDemographic}</p>
              </div>
              <div className="bg-white p-6 border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] block">COMMERCIAL APPEAL & POSITIONING</span>
                <p className="text-base text-slate-800 leading-relaxed font-sans">{pitchDeck.targetAudience?.audienceAppeal}</p>
              </div>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,

          /* Slide 7 */
          <div key="pdf-6" data-pdf-slide="6" className="w-[1123px] h-[794px] bg-[#F9F7F2] p-16 border-8 border-[#1A1A1A] flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">PRODUCER PITCH DECK • SLIDE 07/07</span>
              <span className="text-sm font-mono uppercase font-bold text-[#1A1A1A]">THEMATIC CORE</span>
            </div>
            <div className="my-auto text-center space-y-6 max-w-3xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 block">THEMATIC CORE & EMOTIONAL RESONANCE</span>
              <p className="text-2xl text-[#1A1A1A] font-serif italic border-l-8 border-red-600 pl-6 py-2 text-left">
                "{pitchDeck.thematicCore}"
              </p>
            </div>
            <div className="border-t-4 border-[#1A1A1A] pt-4 text-right text-xs font-mono text-slate-500 uppercase font-bold">
              SCRIPTBEAT DRAMATURGY STUDIO
            </div>
          </div>,
        ]}
      </div>
    </div>
  );
};
