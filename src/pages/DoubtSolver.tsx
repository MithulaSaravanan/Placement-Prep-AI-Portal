import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isRetrieved?: boolean;
}

export default function DoubtSolver() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "System initialized. RAG pipeline active. How can I assist with your technical doubts today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/solve-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to get answer');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        isRetrieved: true
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `System Error: ${err.message}. Please verify your GROQ_API_KEY in the Secrets settings and ensure the backend is running.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Interactive Session</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">STATUS: 200 OK</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-white"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                    msg.role === 'user' 
                      ? 'bg-slate-100 border-slate-200 text-slate-600' 
                      : 'bg-blue-600 border-blue-500 text-white'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    {msg.isRetrieved && (
                      <div className="flex items-center gap-1.5 mb-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[9px] font-bold text-blue-600 uppercase">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Retrieved Context Verified
                      </div>
                    )}
                    <div className={`p-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-100 text-slate-800 rounded-tr-none border border-slate-200 shadow-sm' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-blue-100 shadow-sm ring-1 ring-blue-500/5'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold border border-blue-500">
                    AI
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span className="text-[11px] text-slate-500 font-medium">QUERYING VECTOR DATABASE...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Analyze concept..."
                className="flex-1 bg-white border border-slate-300 rounded-lg pl-4 pr-24 py-2.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm placeholder:text-slate-400 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md text-[11px] font-bold transition-all shadow-md shadow-blue-500/20"
              >
                RUN QUERY
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="w-full md:w-[280px] shrink-0 space-y-6 flex flex-col h-full min-h-0">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">RAG Trace Log</h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
                  <span>Knowledge Base</span>
                  <span className="text-green-500">READY</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">Indexed 3 .txt files successfully.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
                  <span>Embedding Sim</span>
                  <span className="text-blue-500">COSINE</span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[84%] transition-all duration-1000" />
                </div>
                <div className="text-[9px] text-right font-mono text-slate-500">MAX_SCORE: 0.842</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-xl p-5 text-white flex flex-col relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-5">System Environment</h3>
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 border border-white/5 rounded bg-white/5">
                    <div className="text-xs font-bold text-white">Chroma</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Storage</div>
                  </div>
                  <div className="p-2 border border-white/5 rounded bg-white/5">
                    <div className="text-xs font-bold text-white">1,242</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Chunks</div>
                  </div>
                </div>
                <div className="p-3 border border-white/5 rounded bg-white/5 font-mono text-[10px] text-slate-400 space-y-1">
                  <p># API Endpoint: v1/genai</p>
                  <p># Model: llama3-70b-8192</p>
                  <p># Region: multi-modal-1</p>
                </div>
              </div>
              <div className="pt-4 mt-auto border-t border-white/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[11px] font-bold text-slate-400">PIPELINE SECURE</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mb-16 -mr-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
