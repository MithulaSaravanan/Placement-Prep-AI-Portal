import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Search, Loader2, Download, Printer, Share2, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function StudyMaterial() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setContent('');

    try {
      const res = await fetch('/api/study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Failed to generate material');
      setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-full min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/10 rounded flex items-center justify-center border border-orange-500/20">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Study Hub</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Roadmap System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 border border-orange-100 rounded-lg shadow-sm">
          <Share2 className="w-3 h-3" />
          SYNC: CLOUD_STORAGE
        </div>
      </div>

      <div className="shrink-0">
        <form onSubmit={generateMaterial} className="relative shadow-sm group">
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Search core concepts or enter a custom topic..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-32 py-4 text-slate-900 text-sm focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-400 transition-colors" />
          <button
            type="submit"
            disabled={!topic || loading}
            className="absolute right-2 top-2 bottom-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 text-xs shadow-lg shadow-orange-200"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'GENERATE'}
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden relative shadow-sm min-h-0 flex flex-col">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            <div className="text-center">
              <p className="text-slate-900 font-bold text-sm">Structuring Knowledge Flow...</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono mt-1">Status: Extracting key vectors</p>
            </div>
          </div>
        )}

        {!content && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40 py-32">
            <Terminal className="w-12 h-12 text-slate-300" />
            <div className="max-w-xs">
              <p className="font-bold text-sm text-slate-900 uppercase tracking-widest mb-1">Null Content Buffer</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Awaiting topic input for material generation. All materials are grounded in educational standards.</p>
            </div>
          </div>
        )}

        {content && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Document: Grounded_Reference_V3</div>
              </div>
              <div className="flex gap-2">
                <button className="h-8 w-8 flex items-center justify-center bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors text-slate-400 group">
                  <Download className="w-3.5 h-3.5 group-hover:text-slate-600" />
                </button>
                <button className="h-8 w-8 flex items-center justify-center bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors text-slate-400 group">
                  <Printer className="w-3.5 h-3.5 group-hover:text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="markdown-body">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
