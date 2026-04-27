import React, { useState } from 'react';
import axios from 'axios';
import { 
  Terminal,
  Cpu,
  Code2,
  Activity,
  ChevronRight,
  Zap,
  Box,
  Hash,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface UserProfile {
  username: string;
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  tag: string;
  status?: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    profile: UserProfile;
    recommendations: Problem[];
  } | null>(null);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/user/sync', { username });
      setUserData(response.data);
    } catch (error) {
      console.error('Sync failed', error);
      alert('Failed to sync. Please check the username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-accent/30 bg-grid relative overflow-hidden">
      <div className="scanline"></div>
      
      {/* System Status Bar */}
      <nav className="h-10 border-b border-[#222] bg-[#0A0A0A] px-4 flex items-center justify-between mono text-[10px] tracking-widest uppercase text-[#555]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
            <span className="text-white">SYSTEM ACTIVE</span>
          </div>
          <span>NODE: v20.11.0</span>
          <span>LATENCY: 12MS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-accent">LEET_AI v1.0.4</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-20">
        <AnimatePresence mode="wait">
          {!userData ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="text-center mb-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block p-2 border border-accent/20 bg-accent/5 rounded mb-6"
                >
                  <Cpu size={24} className="text-accent" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl font-bold mono tracking-tighter mb-4"
                >
                  LEET_<span className="text-accent">AI</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#666] mono text-sm uppercase tracking-[0.2em]"
                >
                  Advanced Practice Recommendation Engine
                </motion.p>
              </div>
              
              <div className="w-full max-w-lg terminal-window rounded-none">
                <div className="terminal-header">
                  <div className="dot bg-[#ff5f56]"></div>
                  <div className="dot bg-[#ffbd2e]"></div>
                  <div className="dot bg-[#27c93f]"></div>
                  <span className="mono text-[10px] text-[#444] ml-2">ssh root@leetai.system</span>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSync} className="space-y-6">
                    <div className="space-y-2">
                      <label className="mono text-[10px] text-[#666] uppercase">Authentication</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 mono text-accent">$</span>
                        <input
                          type="text"
                          placeholder="ENTER_USERNAME"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-[#0F0F0F] border border-[#222] py-4 px-10 focus:outline-none focus:border-accent/50 transition-all mono text-sm tracking-widest placeholder:text-[#333]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black font-bold py-4 mono text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          SYNCING...
                        </>
                      ) : (
                        <>
                          INITIALIZE_SESSION <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="mt-12 flex gap-12 opacity-30 mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2"><Database size={12} /> GraphQL Sync</div>
                <div className="flex items-center gap-2"><Code2 size={12} /> pattern analysis</div>
                <div className="flex items-center gap-2"><Activity size={12} /> gap diagnostics</div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Header Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222] border border-[#222]">
                <DataPoint label="PROBLEMS_SOLVED" value={userData.profile.total} icon={<Hash size={14}/>} />
                <DataPoint label="DIFFICULTY_EASY" value={userData.profile.easy} />
                <DataPoint label="DIFFICULTY_MED" value={userData.profile.medium} />
                <DataPoint label="DIFFICULTY_HARD" value={userData.profile.hard} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Recommendations */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-[#222] pb-4">
                    <h2 className="text-xl font-bold mono uppercase tracking-widest flex items-center gap-3">
                      <Terminal size={18} className="text-accent" />
                      QUEUE_RECOMMENDATIONS
                    </h2>
                    <span className="mono text-[10px] text-[#444]">LIMIT: 08_ENTRIES</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {userData.recommendations.map((problem, index) => (
                      <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <ProblemRow 
                          problem={problem} 
                          onToggleDone={() => {
                            const newRecs = [...userData.recommendations];
                            newRecs[index].status = newRecs[index].status === 'done' ? 'pending' : 'done';
                            setUserData({ ...userData, recommendations: newRecs });
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Diagnostics */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="flex items-center gap-3 border-b border-[#222] pb-4">
                    <Activity size={18} className="text-accent" />
                    <h2 className="text-xl font-bold mono uppercase tracking-widest">DIAGNOSTICS</h2>
                  </div>
                  
                  <div className="terminal-window p-6 space-y-6">
                    <div className="space-y-4">
                      <Diagnostic label="DYNAMIC_PROG" value={20} />
                      <Diagnostic label="TREES_HIERARCHY" value={45} />
                      <Diagnostic label="GRAPH_TRAVERSAL" value={15} />
                      <Diagnostic label="BACKTRACKING" value={30} />
                    </div>
                    
                    <div className="pt-6 border-t border-[#222]">
                      <div className="flex items-center gap-2 mb-4">
                        <Box size={14} className="text-accent" />
                        <span className="mono text-[10px] text-white uppercase tracking-widest">Daily Streak</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold mono">12</span>
                        <span className="mono text-xs text-[#444]">CYCLES</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 border border-[#333] hover:border-accent hover:text-accent transition-all py-3 mono text-[10px] uppercase tracking-[0.2em]">
                      EXECUTE_DETAILED_ANALYSIS
                    </button>
                  </div>

                  <div className="p-4 border border-accent/20 bg-accent/[0.02] rounded-none">
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <Zap size={14} />
                      <span className="mono text-[10px] font-bold uppercase">System Recommendation</span>
                    </div>
                    <p className="text-[11px] mono text-[#666] leading-relaxed">
                      Focus on "GRAPH_TRAVERSAL" for optimal interview readiness. Current success rate is below threshold.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DataPoint({ label, value, icon }: { label: string, value: number, icon?: React.ReactNode }) {
  return (
    <div className="bg-[#0A0A0A] p-6 text-center">
      <div className="mono text-[10px] text-[#444] mb-3 flex items-center justify-center gap-2 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="text-4xl font-bold mono tracking-tighter">{value.toString().padStart(2, '0')}</div>
    </div>
  );
}

function Diagnostic({ label, value }: { label: string, progress?: number, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between mono text-[10px] tracking-widest">
        <span className="text-[#666]">{label}</span>
        <span className="text-accent">{value}%</span>
      </div>
      <div className="w-full h-1 bg-[#1A1A1A] overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}

function ProblemRow({ problem, onToggleDone }: { problem: Problem, onToggleDone?: () => void }) {
  const isDone = problem.status === 'done';
  const diffClass = {
    'Easy': 'text-green-500',
    'Medium': 'text-accent',
    'Hard': 'text-red-500'
  }[problem.difficulty] || 'text-gray-500';

  return (
    <div className={`group flex items-center justify-between p-4 border border-[#1A1A1A] hover:border-[#333] bg-[#0C0C0C] transition-all relative ${isDone ? 'opacity-30' : ''}`}>
      <div className="flex items-center gap-6">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone?.();
          }}
          className={`mono text-[10px] border px-2 py-1 transition-all ${isDone ? 'border-green-500/50 text-green-500' : 'border-[#222] text-[#444] group-hover:text-accent group-hover:border-accent/30'}`}
        >
          {isDone ? 'COMPLETED' : 'PENDING'}
        </button>
        <div>
          <h4 className={`mono text-sm tracking-tight transition-colors ${isDone ? 'line-through text-[#333]' : 'text-gray-200 group-hover:text-white'}`}>
            {problem.title.toUpperCase().replace(/ /g, '_')}
          </h4>
          <div className="flex items-center gap-4 mt-1">
            <span className={`mono text-[9px] uppercase tracking-widest font-bold ${diffClass}`}>
              {problem.difficulty}
            </span>
            <span className="mono text-[9px] text-[#444] uppercase tracking-widest">TAG::{problem.tag}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a 
          href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/ /g, '-')}/`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mono text-[10px] text-[#333] hover:text-accent transition-colors flex items-center gap-1"
        >
          OPEN_SRC <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}

export default App;
