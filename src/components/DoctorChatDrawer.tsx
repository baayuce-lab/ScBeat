import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Zap, 
} from 'lucide-react';
import { DoctorChatMessage, DramaturgyReport } from '../types';
import { Language, TRANSLATIONS } from '../i18n';

interface DoctorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report?: DramaturgyReport;
  scriptText?: string;
  language?: Language;
}

export const DoctorChatDrawer: React.FC<DoctorChatDrawerProps> = ({
  isOpen,
  onClose,
  report,
  scriptText,
  language = 'tr',
}) => {
  const t = TRANSLATIONS[language];

  const QUICK_PROMPTS = language === 'tr' ? [
    '2. Perde A\'daki tıkanıklığı ve tempo düşüşünü nasıl çözerim?',
    'Açılış sahnemi daha keskin örtük anlamlarla (subtext) yeniden yaz',
    'Bu hipotez için şaşırtıcı bir Orta Nokta (Midpoint) Kırılması öner',
    'Logline\'ımı dijital platform sunumu için parlat',
  ] : language === 'es' ? [
    '¿Cómo corrijo el estancamiento en el Acto 2A?',
    'Reescribe mi escena de apertura con un subtexto más agudo',
    'Sugiere un giro sorprendente en el Punto Medio',
    'Pule mi logline para una presentación a estudio',
  ] : [
    'How do I fix the flat spot in Act 2A?',
    'Rewrite my opening scene with sharper subtext',
    'Suggest a shocking Midpoint Twist for this premise',
    'Sharpen my logline for a Streamer pitch',
  ];

  const [messages, setMessages] = useState<DoctorChatMessage[]>([
    {
      id: 'init_1',
      sender: 'doctor',
      timestamp: Date.now(),
      text: language === 'tr' 
        ? `Merhaba. "${report?.projectTitle || 'senaryo projeniz'}" için sunduğunuz taslağı inceledim. Sahne revizyonu, diyalog güçlendirme veya 3 perdeli yapı düzenlemesinde nereden başlayalım?`
        : language === 'es'
        ? `Saludos. He examinado su entrega para "${report?.projectTitle || 'su guion'}". ¿Qué área deseamos perfeccionar juntos?`
        : `Greetings. I've examined your submission for "${report?.projectTitle || 'your screenplay'}". What area of the script or pitch deck shall we punch up together?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isSending) return;

    const userMsg: DoctorChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      timestamp: Date.now(),
      text: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/doctor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          scriptText: scriptText || report?.rawScriptSnippet || '',
          dramaturgyContext: report,
          userPrompt: prompt,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_doc_${Date.now()}`,
            sender: 'doctor',
            timestamp: Date.now(),
            text: data.reply || (language === 'tr' ? "Bu vuruşu birlikte revize edelim." : "Let's refine that beat together."),
          },
        ]);
      } else {
        throw new Error(data.message || 'Error communicating with script doctor');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'doctor',
          timestamp: Date.now(),
          text: `Doctor Note: ${err?.message || 'Unable to process request.'}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white border-l-4 border-[#1A1A1A] h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#F9F7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">{t.chatTitle}</h3>
              <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{t.chatSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#1A1A1A] hover:bg-red-600 hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-[#F9F7F2] border-b-2 border-[#1A1A1A] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Zap className="w-3.5 h-3.5 text-red-600 shrink-0" />
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isSending}
              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] whitespace-nowrap transition-all shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'doctor' && (
                <div className="w-7 h-7 bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#DC2626] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 text-xs sm:text-sm leading-relaxed space-y-2 relative group border-2 border-[#1A1A1A] ${
                  msg.sender === 'user'
                    ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#DC2626] font-sans'
                    : 'bg-[#F9F7F2] text-slate-800 shadow-[3px_3px_0px_#1A1A1A] font-sans'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {msg.sender === 'doctor' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-[#1A1A1A] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 bg-[#F9F7F2] border-2 border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_#1A1A1A]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-red-600 font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin text-red-600" />
              <span>{t.chatAnalyzing}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t-2 border-[#1A1A1A] bg-[#F9F7F2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] px-3.5 py-2 text-xs sm:text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2.5 bg-[#1A1A1A] hover:bg-red-600 disabled:bg-slate-300 text-white font-bold border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
