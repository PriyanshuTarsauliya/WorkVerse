import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Code, Play, CheckCircle2, Trophy, BookOpen, Brain, Terminal, Sparkles, Send, Award, Clock, Users, ArrowRight, Zap, RefreshCw, FileCode, Check, Video, Globe, Search, MessageSquare, Loader2, CalendarDays, Maximize2, Minimize2
} from 'lucide-react';

const MOCK_CODING_PROBLEMS = [
  {
    id: 'p1',
    title: 'Two Sum',
    difficulty: 'Easy',
    companyTags: ['Google', 'Amazon', 'Flipkart'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
    defaultCode: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
    },
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
  },
  {
    id: 'p2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    companyTags: ['Microsoft', 'Razorpay', 'Amazon'],
    description: 'Given a string `s` containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    defaultCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char in pairs) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else stack.push(char);\n  }\n  return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else: stack.append(char)\n    return not stack`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
    },
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
  },
  {
    id: 'p3',
    title: 'LRU Cache Architecture',
    difficulty: 'Medium',
    companyTags: ['Uber', 'Goldman Sachs', 'Google'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.',
    defaultCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            val = self.cache.pop(key)\n            self.cache[key] = val\n            return val\n        return -1`,
      java: `class LRUCache {\n    private LinkedHashMap<Integer, Integer> map;\n    private final int CAPACITY;\n    public LRUCache(int capacity) {\n        CAPACITY = capacity;\n        map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry eldest) {\n                return size() > CAPACITY;\n            }\n        };\n    }\n}`,
    },
    sampleInput: 'capacity = 2, put(1, 1), put(2, 2), get(1)',
    sampleOutput: '1',
  },
];

const MOCK_HACKATHONS = [
  {
    id: 'h1',
    title: 'WorkVerse National AI & Full-Stack Challenge 2025',
    organizer: 'WorkVerse & Google Cloud',
    prizePool: '₹10,00,000',
    participants: 14200,
    deadline: 'Registration closes in 4 days',
    tags: ['AI/ML', 'Full Stack', 'Hiring Drive'],
  },
  {
    id: 'h2',
    title: 'FinTech Innovation Hackathon',
    organizer: 'Razorpay & HDFC Bank',
    prizePool: '₹5,00,000',
    participants: 8400,
    deadline: 'Registration closes in 8 days',
    tags: ['FinTech', 'Web3', 'Direct Interviews'],
  },
  {
    id: 'h3',
    title: 'India CodeSprint 2025',
    organizer: 'Tata Consultancy & WorkVerse',
    prizePool: '₹3,50,000',
    participants: 22000,
    deadline: 'Starts tomorrow',
    tags: ['Competitive Coding', 'Fresher Hiring'],
  },
];

const MOCK_INTERVIEW_QUESTIONS = [
  { company: 'Google', question: 'How would you design a distributed URL shortening service handling 100M daily active requests?', topic: 'System Design' },
  { company: 'Amazon', question: 'Explain how React virtual DOM diffing algorithm works under the hood.', topic: 'Frontend' },
  { company: 'Flipkart', question: 'Write SQL query to find top 3 highest spending customers per product category.', topic: 'Database' },
  { company: 'Goldman Sachs', question: 'How do thread pools operate in Java Spring Boot and what prevents deadlock during thread exhaustion?', topic: 'Backend Systems' },
];

const MOCK_MENTORS = [
  { id: 1, name: 'Priya Sharma', role: 'Sr. Engineering Manager', company: 'Google', expertise: ['System Design', 'Leadership', 'Frontend'], rate: 'Free', available: true, imageColor: 'bg-emerald-600' },
  { id: 2, name: 'Rahul Desai', role: 'Staff Software Engineer', company: 'Uber', expertise: ['Algorithms', 'Backend Scaling', 'Java'], rate: 'Free', available: true, imageColor: 'bg-blue-600' },
  { id: 3, name: 'Ananya Gupta', role: 'Principal Product Designer', company: 'Atlassian', expertise: ['UX Portfolio', 'Whiteboarding', 'Figma'], rate: 'Free', available: true, imageColor: 'bg-rose-600' },
  { id: 4, name: 'Vikram Singh', role: 'Lead Data Scientist', company: 'Flipkart', expertise: ['Machine Learning', 'Python', 'SQL'], rate: 'Free', available: false, imageColor: 'bg-amber-600' },
];

export default function PrepHubModal({ isOpen, onClose, isPremium, onUpgradeClick }) {
  const [activeTab, setActiveTab] = useState('coding'); // 'coding' | 'mock_interview' | 'hackathons' | 'questions'
  const [selectedProblem, setSelectedProblem] = useState(MOCK_CODING_PROBLEMS[0]);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState(MOCK_CODING_PROBLEMS[0].defaultCode.javascript);
  const [outputConsole, setOutputConsole] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Mock Interview State
  const [interviewQuestionIdx, setInterviewQuestionIdx] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);

  // Deep Search State
  const [deepSearchQuery, setDeepSearchQuery] = useState('');
  const [isDeepSearching, setIsDeepSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0); // 0: input, 1: scanning, 2: results
  const [searchResult, setSearchResult] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen) return null;

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setUserCode(prob.defaultCode[codeLanguage] || prob.defaultCode.javascript);
    setExecutionResult(null);
    setOutputConsole('');
  };

  const handleLanguageChange = (lang) => {
    setCodeLanguage(lang);
    if (selectedProblem.defaultCode[lang]) {
      setUserCode(selectedProblem.defaultCode[lang]);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionResult(null);
    setOutputConsole('Compiling and executing test cases against sandbox runtime...');

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'ACCEPTED',
        runtime: '42ms',
        memory: '14.2 MB',
        passedCases: '3 / 3 Test Cases Passed',
      });
      setOutputConsole(
        `✓ [SUCCESS] Test Case 1: Input: ${selectedProblem.sampleInput} => Output: ${selectedProblem.sampleOutput}\n✓ [SUCCESS] Test Case 2: Corner boundary conditions validated.\n✓ [SUCCESS] Test Case 3: Performance benchmark within target O(N) complexity.`
      );
    }, 1200);
  };

  const handleEvaluateAnswer = () => {
    if (!userAnswerText.trim()) return;

    setAiFeedback({
      score: 88,
      rating: 'Strong Candidate Response',
      strengths: [
        'Clear architectural trade-off discussion',
        'Addressed high-availability & fault-tolerance constraints',
      ],
      improvements: [
        'Could elaborate further on database replication lag mitigations',
      ],
    });
  };

  const handleDeepSearchSubmit = () => {
    if (!deepSearchQuery.trim()) return;

    setIsDeepSearching(true);
    setSearchStep(1);

    setTimeout(() => {
      setSearchStep(2);
      setIsDeepSearching(false);
      setSearchResult({
        query: deepSearchQuery,
        summary: `Comprehensive web analysis for "${deepSearchQuery}". Identified 14 verified interview questions, 3 salary reports, and key system design architectural patterns from recent engineering blogs.`,
        sourcesCount: 8,
        topics: ['System Design', 'Behavioral STAR', 'Live Coding Standards'],
      });
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ${
          isFullScreen ? 'p-0' : 'p-4'
        }`}
        data-testid="prephub-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative bg-main border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullScreen
              ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10'
              : 'w-full max-w-6xl max-h-[92vh] rounded-2xl p-0'
          }`}
        >
          {/* Header */}
          <div className="bg-surface border-b border-borderSubtle p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight flex items-center gap-2">
                  WorkVerse Preparation Hub
                  <span className="px-2 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                    Unstop & LeetCode Powered
                  </span>
                </h2>
                <p className="text-xs text-txtMuted">
                  Practice coding, AI mock interviews, hiring challenges & company interview questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                  isFullScreen
                    ? 'bg-accent/20 border-accent/40 text-accent'
                    : 'bg-nested hover:bg-surface border-borderSubtle text-txtMuted hover:text-txtMain'
                }`}
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen / Full Page Mode'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-nested hover:bg-navy-700 flex items-center justify-center text-txtMuted opacity-80 hover:text-txtMain transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-surface border-b border-borderSubtle px-6 flex gap-2 overflow-x-auto">
            {[
              { id: 'coding', label: 'Coding Playground', icon: Code },
              { id: 'mock_interview', label: 'AI Mock Interview', icon: Brain },
              { id: 'mentorship', label: '1-on-1 Mentorship', icon: Video },
              { id: 'hackathons', label: 'Hackathons', icon: Trophy },
              { id: 'questions', label: 'Q&A', icon: BookOpen },
              { id: 'deep_search', label: 'Deep Web Search', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo text-txtMain'
                    : 'border-transparent text-txtMuted opacity-80 hover:text-txtMuted'
                }`}
              >
                <tab.icon className="w-4 h-4 text-indigo-light" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-hidden relative">
            {!isPremium && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-main/60 backdrop-blur-sm">
                <div className="bg-surface border border-borderStrong p-8 rounded-2xl max-w-md text-center shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-tr from-accent to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-txtMain" />
                  </div>
                  <h3 className="text-xl font-bold text-txtMain mb-2">Unlock Prep Hub Pro</h3>
                  <p className="text-sm text-txtMuted mb-6">
                    Get access to AI Mock Interviews, 1-on-1 Mentorship, Deep Web Search, and Premium Coding Challenges to ace your next tech interview.
                  </p>
                  <button
                    onClick={onUpgradeClick}
                    className="w-full py-3 bg-gradient-to-r from-accent to-indigo-500 hover:from-accent-hover hover:to-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
                  >
                    Upgrade to Premium <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            <div className={`h-full p-6 bg-main overflow-hidden ${!isPremium ? 'opacity-40 pointer-events-none blur-[2px]' : ''}`}>
            {/* ── 1. CODING PLAYGROUND ── */}
            {activeTab === 'coding' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full overflow-hidden">
                {/* Left: Problem Selector & Details */}
                <div className="lg:col-span-5 flex flex-col h-full bg-surface border border-borderSubtle rounded-xl p-4 overflow-y-auto no-scrollbar">
                  <p className="text-xs font-semibold text-txtMuted opacity-80 uppercase tracking-wider mb-3">Select Problem</p>
                  <div className="space-y-2 mb-4">
                    {MOCK_CODING_PROBLEMS.map((prob) => (
                      <button
                        key={prob.id}
                        onClick={() => handleSelectProblem(prob)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedProblem.id === prob.id
                            ? 'bg-indigo-500/15 border-indigo-500/50 text-txtMain'
                            : 'bg-main border-borderSubtle text-txtMuted hover:border-borderStrong'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{prob.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            prob.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prob.companyTags.map((t, i) => (
                            <span key={i} className="text-[10px] text-txtMuted opacity-80 bg-nested px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-borderSubtle space-y-3">
                    <h4 className="text-sm font-bold text-txtMain">{selectedProblem.title}</h4>
                    <p className="text-xs text-txtMuted leading-relaxed">{selectedProblem.description}</p>
                    <div className="bg-main border border-borderSubtle p-2.5 rounded-lg text-xs space-y-1">
                      <p className="text-txtMuted opacity-80">Sample Input: <code className="text-indigo-light">{selectedProblem.sampleInput}</code></p>
                      <p className="text-txtMuted opacity-80">Sample Output: <code className="text-emerald-400">{selectedProblem.sampleOutput}</code></p>
                    </div>
                  </div>
                </div>

                {/* Right: Code Sandbox & Execution */}
                <div className="lg:col-span-7 flex flex-col h-full bg-surface border border-borderSubtle rounded-xl overflow-hidden">
                  {/* Top Editor Control */}
                  <div className="p-3 bg-nested border-b border-borderStrong flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-light" />
                      <select
                        value={codeLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-surface border border-borderStrong text-xs text-txtMain rounded px-2.5 py-1 focus:outline-none"
                      >
                        <option value="javascript">JavaScript (ES6)</option>
                        <option value="python">Python 3.10</option>
                        <option value="java">Java 21</option>
                      </select>
                    </div>
                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isRunning ? 'Running...' : 'Run & Submit Code'}
                    </button>
                  </div>

                  {/* Code textarea editor (Atom Material Theme) */}
                  <div className="flex-1 bg-[#263238] p-4 font-mono text-xs overflow-y-auto no-scrollbar">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-full bg-transparent text-[#EEFFFF] font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-[#546E7A]/50"
                      spellCheck={false}
                    />
                  </div>

                  {/* Bottom Console */}
                  <div className="h-36 bg-surface border-t border-borderSubtle p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-semibold text-txtMuted opacity-80 mb-1">
                      <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Output Console</span>
                      {executionResult && (
                        <span className="text-success font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {executionResult.casesPassed} ({executionResult.runtime})
                        </span>
                      )}
                    </div>
                    <pre className="flex-1 font-mono text-[11px] text-[#C3E88D] bg-[#1E272C] border border-[#263238] p-2.5 rounded-lg overflow-y-auto no-scrollbar whitespace-pre-wrap selection:bg-[#546E7A]/50">
                      {outputConsole || 'Click "Run & Submit Code" to compile and run against hidden test cases.'}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. AI MOCK INTERVIEW ── */}
            {activeTab === 'mock_interview' && (
              <div className="max-w-3xl mx-auto h-full flex flex-col justify-between space-y-4">
                <div className="bg-surface border border-borderSubtle rounded-xl p-5">
                  <div className="flex items-center gap-2 text-indigo-light text-xs font-semibold mb-2">
                    <Sparkles className="w-4 h-4" /> AI Technical Round Interviewer
                  </div>
                  <h3 className="text-base font-bold text-txtMain mb-2">
                    {MOCK_INTERVIEW_QUESTIONS[interviewQuestionIdx].question}
                  </h3>
                  <span className="px-2.5 py-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                    Target Domain: {MOCK_INTERVIEW_QUESTIONS[interviewQuestionIdx].topic}
                  </span>
                </div>

                <div className="flex-1 bg-surface border border-borderSubtle rounded-xl p-4 flex flex-col">
                  <label className="text-xs font-semibold text-txtMuted opacity-80 mb-2">Your Structured Response:</label>
                  <textarea
                    value={userAnswerText}
                    onChange={(e) => setUserAnswerText(e.target.value)}
                    placeholder="Type your explanation using STAR format or system design components (Load Balancers, Database Sharding, Caching layers)..."
                    className="flex-1 bg-main border border-borderSubtle rounded-lg p-3 text-xs text-txtMain focus:outline-none resize-none leading-relaxed"
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <button
                      onClick={() => setInterviewQuestionIdx((prev) => (prev + 1) % MOCK_INTERVIEW_QUESTIONS.length)}
                      className="text-xs text-txtMuted opacity-80 hover:text-txtMain flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Next Question
                    </button>
                    <button
                      onClick={handleMockAnswerSubmit}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo hover:bg-indigo-light rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Answer for AI Evaluation
                    </button>
                  </div>
                </div>

                {aiFeedback && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">AI Evaluation Score</span>
                      <span className="text-base font-extrabold text-emerald-400">{aiFeedback.score}/100</span>
                    </div>
                    <div className="text-xs text-txtMuted">
                      <strong className="text-txtMain">Strengths:</strong> {aiFeedback.strengths.join(', ')}
                    </div>
                    <div className="text-xs text-amber-400">
                      <strong>Tip:</strong> {aiFeedback.improvementTip}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 3. HACKATHONS & HIRING CHALLENGES ── */}
            {activeTab === 'hackathons' && (
              <div className="space-y-4 overflow-y-auto no-scrollbar h-full pr-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MOCK_HACKATHONS.map((hack) => (
                    <div key={hack.id} className="bg-surface border border-borderSubtle hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                            Prize: {hack.prizePool}
                          </span>
                          <span className="text-[11px] text-txtMuted opacity-80 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {hack.participants.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-txtMain mb-1 leading-snug">{hack.title}</h4>
                        <p className="text-xs text-txtMuted">{hack.organizer}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {hack.tags.map((t, i) => (
                            <span key={i} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => alert(`Registered for ${hack.title}! Check your email for challenge link.`)}
                          className="w-full py-2 text-xs font-semibold text-white bg-indigo hover:bg-indigo-light rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          Register Free <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. COMPANY INTERVIEW QUESTIONS ── */}
            {activeTab === 'questions' && (
              <div className="space-y-3 overflow-y-auto no-scrollbar h-full pr-1">
                {MOCK_INTERVIEW_QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-surface border border-borderSubtle rounded-xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-light">{q.company}</span>
                        <span className="text-[10px] text-txtMuted opacity-80 bg-nested px-2 py-0.5 rounded">{q.topic}</span>
                      </div>
                      <p className="text-xs text-txtMain leading-relaxed font-medium">{q.question}</p>
                    </div>
                    <button
                      onClick={() => alert('Viewing detailed solution guide & answer breakdown.')}
                      className="px-3 py-1.5 text-xs font-semibold text-txtMuted hover:text-txtMain bg-nested hover:bg-navy-750 border border-borderStrong rounded-lg transition-colors shrink-0"
                    >
                      View Guide
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* ── 5. 1-ON-1 MENTORSHIP ── */}
            {activeTab === 'mentorship' && (
              <div className="space-y-6 h-full overflow-y-auto no-scrollbar pr-1">
                <div className="bg-gradient-to-r from-indigo-900/40 to-navy-900 border border-indigo-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-light" /> Mock Interviews with Industry Experts
                  </h3>
                  <p className="text-sm text-txtMuted max-w-2xl">
                    Schedule 1-on-1 video sessions with mentors from top tech companies. Practice system design, behavioral, or coding rounds and receive actionable feedback.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_MENTORS.map((mentor) => (
                    <div key={mentor.id} className="bg-surface border border-borderSubtle rounded-xl p-5 flex flex-col justify-between">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-full ${mentor.imageColor} flex items-center justify-center text-xl font-bold text-white shrink-0`}>
                          {mentor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="text-base font-bold text-txtMain">{mentor.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {mentor.rate}
                            </span>
                          </div>
                          <p className="text-xs text-txtMuted mt-0.5">{mentor.role} at <strong className="text-txtMain">{mentor.company}</strong></p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {mentor.expertise.map((exp, i) => (
                              <span key={i} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        disabled={!mentor.available}
                        onClick={() => alert(`Scheduling modal opened for ${mentor.name}`)}
                        className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                          mentor.available 
                            ? 'bg-indigo hover:bg-indigo-light text-txtMain shadow-md hover:shadow-indigo/25'
                            : 'bg-nested text-txtMuted opacity-80 cursor-not-allowed'
                        }`}
                      >
                        <CalendarDays className="w-4 h-4" />
                        {mentor.available ? 'Book a Session' : 'Currently Unavailable'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 6. DEEP INTERNET SEARCH ── */}
            {activeTab === 'deep_search' && (
              <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="text-center mb-6 pt-4">
                  <div className="w-16 h-16 bg-nested rounded-full flex items-center justify-center mx-auto mb-4 border border-borderStrong shadow-xl">
                    <Globe className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-txtMain mb-2">Deep Web Search Assistant</h3>
                  <p className="text-sm text-txtMuted">
                    Our AI scours obscure forums, blind posts, and recent interview leaks to give you the ultimate prep guide.
                  </p>
                </div>

                <div className="flex gap-2 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-txtMuted opacity-80" />
                    <input
                      type="text"
                      value={deepSearchQuery}
                      onChange={(e) => setDeepSearchQuery(e.target.value)}
                      placeholder="e.g. 'Stripe Frontend Engineer interview process' or 'Uber System Design'"
                      className="w-full bg-surface border border-borderStrong rounded-xl py-4 pl-12 pr-4 text-sm text-txtMain focus:outline-none focus:border-emerald-500/50 shadow-inner"
                      onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
                      disabled={isDeepSearching}
                    />
                  </div>
                  <button
                    onClick={handleDeepSearch}
                    disabled={isDeepSearching || !deepSearchQuery.trim()}
                    className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-nested disabled:text-txtMuted opacity-80 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isDeepSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Search
                  </button>
                </div>

                {searchStep === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-borderSubtle border-t-emerald-500 rounded-full animate-spin"></div>
                      <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-txtMuted opacity-80" />
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-sm font-semibold text-emerald-400 text-center"
                    >
                      Bypassing surface web... <br />
                      <span className="text-xs text-txtMuted opacity-80">Analyzing recent leaks and employee reviews</span>
                    </motion.p>
                  </div>
                )}

                {searchStep === 2 && searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 bg-surface border border-emerald-500/30 rounded-xl p-6 overflow-y-auto no-scrollbar space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-txtMain mb-1">Deep Web Insights: {searchResult.query}</h4>
                        <p className="text-sm text-txtMuted leading-relaxed">{searchResult.summary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-main border border-borderSubtle rounded-lg p-4">
                        <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> Likely Tech Stack</h5>
                        <ul className="list-disc list-inside text-sm text-txtMuted space-y-1">
                          {searchResult.techStack.map((tech, i) => <li key={i}>{tech}</li>)}
                        </ul>
                      </div>
                      <div className="bg-main border border-borderSubtle rounded-lg p-4">
                        <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Culture / Vibe</h5>
                        <p className="text-sm text-txtMuted">{searchResult.culture}</p>
                      </div>
                    </div>

                    <div className="bg-main border border-borderSubtle rounded-lg p-4">
                      <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Recently Asked Questions</h5>
                      <div className="space-y-2">
                        {searchResult.recentQuestions.map((q, i) => (
                          <div key={i} className="flex gap-3 text-sm text-txtMuted bg-surface p-3 rounded border border-borderSubtle">
                            <span className="text-emerald-500 font-bold">Q.</span> {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-main border border-borderSubtle rounded-lg p-4 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Recent Company Intel</h5>
                        <p className="text-sm text-txtMuted">{searchResult.news}</p>
                      </div>
                    </div>

                  </motion.div>
                )}
              </div>
            )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
