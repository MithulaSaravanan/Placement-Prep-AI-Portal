/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, MessageSquare, Brain, FileText, ChevronRight, LayoutDashboard, Database, Activity } from 'lucide-react';
import DoubtSolver from './pages/DoubtSolver';
import QuizGenerator from './pages/QuizGenerator';
import StudyMaterial from './pages/StudyMaterial';
import HomePage from './pages/HomePage';

function SidebarItem({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 transition-colors text-sm font-medium border-r-4 ${
        active 
          ? 'bg-blue-600/10 text-blue-400 border-blue-500' 
          : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center ${active ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
        <Icon className={`w-3 h-3 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
      </div>
      <span>{label}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#0f172a] text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700/50">
          <Link to="/" className="block group">
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight group-hover:text-blue-400 transition-colors">
              Placement<br/>
              <span className="text-blue-400 group-hover:text-white transition-colors">Prep Portal</span>
            </h1>
          </Link>
          <p className="text-[10px] mt-2 text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Activity className="w-2.5 h-2.5" />
            RAG ENGINE ACTIVE
          </p>
        </div>

        <nav className="flex-1 py-4 custom-scrollbar overflow-y-auto">
          <div className="px-4 mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Main Interface</div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/doubts" icon={MessageSquare} label="Doubt Solver" active={location.pathname === '/doubts'} />
          <SidebarItem to="/quiz" icon={Brain} label="Quiz Generator" active={location.pathname === '/quiz'} />
          <SidebarItem to="/study" icon={BookOpen} label="Study Material" active={location.pathname === '/study'} />

          <div className="px-4 mt-8 mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
            <Database className="w-2.5 h-2.5" />
            Knowledge Base
          </div>
          <div className="px-4 py-2 space-y-3">
            {[
              { name: 'dsa_notes.txt', status: 'LOADED', color: 'bg-green-500/20 text-green-400' },
              { name: 'sql_os_notes.txt', status: 'LOADED', color: 'bg-green-500/20 text-green-400' },
              { name: 'custom_data.md', status: 'WAITING', color: 'bg-yellow-500/20 text-yellow-400' },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-700/30">
                <span className="opacity-70 truncate max-w-[100px]">{file.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${file.color}`}>{file.status}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 bg-slate-900 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[11px] text-slate-400 font-mono">API: CONNECTED</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-tight font-mono">
            gemini-1.5-flash<br/>
            Lat: ~120ms | RAG: ON
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium capitalize">{location.pathname.replace('/', '') || 'Dashboard'}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold tracking-tight">Placement Prep Suite</span>
          </div>
          <div className="flex gap-3">
            <div className="h-8 px-3 rounded border border-slate-200 flex items-center gap-2 bg-slate-50 hidden sm:flex">
              <span className="text-[10px] font-bold text-slate-400 uppercase">User:</span>
              <span className="text-xs font-semibold text-slate-600 truncate max-w-[150px]">Student_Portal</span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="h-8 px-4 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              REFRESH
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doubts" element={<DoubtSolver />} />
          <Route path="/quiz" element={<QuizGenerator />} />
          <Route path="/study" element={<StudyMaterial />} />
        </Routes>
      </Layout>
    </Router>
  );
}

