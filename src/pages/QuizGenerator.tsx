import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Settings, Play, CheckCircle2, XCircle, RefreshCw, Loader2, Trophy, Terminal } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const generateQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Failed to generate quiz');
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentIdx].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quiz Generator</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Placement Mock Assessment Mode</p>
        </div>
        {!questions.length && !loading && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
            <Settings className="w-3 h-3" />
            CONFIG: LLM_V1
          </div>
        )}
      </div>

      {questions.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Target Topic</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Memory Segmentation or BFS"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Difficulty Complexity</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Competitive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Question Count</label>
              <input
                type="number"
                min="1"
                max="15"
                value={count}
                onChange={e => setCount(parseInt(e.target.value) || 5)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>
          <button
            onClick={generateQuiz}
            disabled={!topic}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
          >
            <Play className="w-4 h-4 fill-current" />
            INITIALIZE ASSESSMENT
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <div className="text-center space-y-1">
            <p className="text-slate-900 font-bold text-sm">Generating Context-Aware Questions...</p>
            <p className="text-slate-500 text-[11px] uppercase tracking-widest font-mono">LLM Instance: gemini-1.5-flash</p>
          </div>
        </div>
      )}

      {questions.length > 0 && !showResult && (
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
        >
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              ACCURACY: {Math.round((score / (currentIdx || 1)) * 100)}%
            </span>
          </div>
          
          <div className="p-8 space-y-8">
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{questions[currentIdx].question}</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {questions[currentIdx].options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex justify-between items-center group text-sm font-medium
                    ${!isAnswered ? 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50' : 
                      option === questions[currentIdx].answer ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 
                      selectedOption === option ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}
                  `}
                >
                  <span>{option}</span>
                  {isAnswered && option === questions[currentIdx].answer && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {isAnswered && selectedOption === option && option !== questions[currentIdx].answer && <XCircle className="w-4 h-4 text-red-600" />}
                </button>
              ))}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" />
                  Contextual Explanation
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{questions[currentIdx].explanation}</p>
                <button
                  onClick={nextQuestion}
                  className="mt-2 w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10 text-xs"
                >
                  {currentIdx < questions.length - 1 ? 'PROCEED TO NEXT' : 'FINALIZE ASSESSMENT'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-6 shadow-sm relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mx-auto">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assessment Review</h2>
              <p className="text-slate-500 text-sm">You registered an accuracy score of <strong className="text-slate-900">{Math.round((score/questions.length)*100)}%</strong></p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-lg font-bold text-slate-900">{score}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Correct</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-lg font-bold text-slate-900">{questions.length - score}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</div>
              </div>
            </div>

            <div className="flex gap-3 max-w-xs mx-auto">
              <button
                onClick={() => { setQuestions([]); setTopic(''); }}
                className="flex-1 bg-white text-slate-900 border border-slate-200 font-bold py-2.5 rounded-lg text-xs hover:bg-slate-50 transition-colors"
              >
                CLOSE
              </button>
              <button
                onClick={generateQuiz}
                className="flex-1 bg-slate-900 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                RETRY
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
}
