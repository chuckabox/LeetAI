import React, { useState } from 'react';
import axios from 'axios';
import { 
  Trophy, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Search, 
  BookOpen, 
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2
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
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-leetcode-orange/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-leetcode-orange to-leetcode-yellow rounded-lg flex items-center justify-center shadow-lg shadow-leetcode-orange/20">
                <Zap size={18} className="text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight">Leet<span className="text-leetcode-orange">AI</span></span>
            </motion.div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!userData ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Accelerate your LeetCode journey.
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Connect your profile and get AI-powered recommendations based on your weak areas and interview patterns.
                </p>
              </div>
              
              <form onSubmit={handleSync} className="w-full max-w-md relative">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter LeetCode Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pl-14 focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 focus:border-leetcode-orange/50 transition-all text-lg glass"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-leetcode-orange transition-colors" size={20} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-leetcode-orange to-leetcode-yellow text-white font-bold py-4 rounded-2xl shadow-xl shadow-leetcode-orange/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? 'Analyzing Profile...' : 'Connect Profile'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                  <StatsCard icon={<Trophy className="text-leetcode-yellow" />} label="Total Solved" value={userData.profile.total} />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <StatsCard icon={<Activity className="text-green-400" />} label="Easy" value={userData.profile.easy} />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <StatsCard icon={<Activity className="text-leetcode-orange" />} label="Medium" value={userData.profile.medium} />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                  <StatsCard icon={<Activity className="text-red-500" />} label="Hard" value={userData.profile.hard} />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Target className="text-leetcode-orange" />
                      Recommended for You
                    </h2>
                    <span className="text-xs font-semibold px-3 py-1 bg-leetcode-orange/10 text-leetcode-orange rounded-full border border-leetcode-orange/20">
                      Interview Focused
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {userData.recommendations.map((problem, index) => (
                      <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
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

                {/* Skill Gaps */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="text-leetcode-orange" />
                    Skill Gaps
                  </h2>
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <SkillProgress label="Dynamic Programming" progress={20} />
                    <SkillProgress label="Trees" progress={45} />
                    <SkillProgress label="Graphs" progress={15} />
                    <SkillProgress label="Backtracking" progress={30} />
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <button className="w-full text-sm font-medium text-leetcode-orange hover:text-leetcode-yellow transition-colors flex items-center justify-center gap-1">
                        View Learning Path <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-leetcode-orange/10 to-transparent">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                      <TrendingUp size={18} className="text-leetcode-orange" />
                      Daily Streak
                    </h3>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold text-leetcode-orange">12</span>
                      <span className="text-gray-400 mb-1">Days</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Keep it up! You're in the top 5% of users this week.</p>
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

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ProblemRow({ problem, onToggleDone }: { problem: Problem, onToggleDone?: () => void }) {
  const isDone = problem.status === 'done';
  const difficultyColor = {
    'Easy': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Medium': 'text-leetcode-orange bg-leetcode-orange/10 border-leetcode-orange/20',
    'Hard': 'text-red-500 bg-red-500/10 border-red-500/20'
  }[problem.difficulty] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';

  return (
    <div className={`glass-card p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.07] transition-all group cursor-pointer border-transparent hover:border-white/10 ${isDone ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone?.();
          }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isDone ? 'bg-green-400/20 text-green-400' : 'bg-white/5 text-gray-400 group-hover:text-leetcode-orange'}`}
        >
          {isDone ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
        </button>
        <div>
          <h4 className={`font-bold transition-colors ${isDone ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>{problem.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor}`}>
              {problem.difficulty}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{problem.tag}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a 
          href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/ /g, '-')}/`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-leetcode-orange transition-colors p-2"
        >
          <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );
}

function SkillProgress({ label, progress }: { label: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-400">{label}</span>
        <span className="text-leetcode-orange">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-leetcode-orange to-leetcode-yellow transition-all duration-1000" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default App;
