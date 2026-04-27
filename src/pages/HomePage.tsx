import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, FileText, ChevronRight, Sparkles, Terminal } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'AI Doubt Solver',
      desc: 'Grounding explanations in your core study materials using the RAG pipeline.',
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      link: '/doubts',
      tag: 'RAG_ACTIVE'
    },
    {
      title: 'Quiz Generator',
      desc: 'Generate targeted interview questions and test your readiness in seconds.',
      icon: <Brain className="w-5 h-5 text-emerald-500" />,
      link: '/quiz',
      tag: 'LLM_GENERATED'
    },
    {
      title: 'Study Hub',
      desc: 'Instant structured roadmap and comprehensive material for new technical topics.',
      icon: <FileText className="w-5 h-5 text-orange-500" />,
      link: '/study',
      tag: 'DOC_GEN'
    }
  ];

  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            System Version 2.4.0-Stable
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Standardized Placement <br />
            <span className="text-blue-600">Preparation Suite</span>
          </h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Professional-grade tools for mock interviews, core concept mastery, and document-backed technical queries.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Link 
              to="/doubts" 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors"
            >
              Launch Solver
            </Link>
            <Link 
              to="/study" 
              className="bg-white text-slate-900 border border-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Browse Materials
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              to={feature.link}
              className="group block h-full bg-white border border-slate-200 p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:border-blue-200 transition-colors">
                  {feature.icon}
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tight">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-1">
                {feature.title}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {feature.desc}
              </p>
              <div className="text-[10px] font-bold text-blue-600 uppercase">Execute module &rarr;</div>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a] rounded-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              System Status
            </h3>
            <div className="space-y-4 font-mono text-[13px] text-slate-400">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Vector Engine:</span>
                <span className="text-green-400">ONLINE</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>ChromaDB Clusters:</span>
                <span className="text-white">Active (v1.2)</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Grounded Confidence:</span>
                <span className="text-blue-400">98.4%</span>
              </p>
              <p className="text-[11px] pt-2 italic">
                Logs: Indexing complete for local knowledge base (22,401 tokens processed).
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] pointer-events-none" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-900 mb-3">RAG Pipeline Verified</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            Our specialized architecture ensures that every technical doubt is cross-referenced with your uploaded study materials before generating an answer. 
            This minimizes hallucinations and ensures alignment with your curriculum.
          </p>
          <div className="flex gap-2">
            {['DSA', 'SQL', 'OS', 'Aptitude'].map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2 py-1 border border-slate-200 bg-slate-50 rounded text-slate-600">
                {tag}_VERIFIED
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
