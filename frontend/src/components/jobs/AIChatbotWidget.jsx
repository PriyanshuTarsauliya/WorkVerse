import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Zap, Code, FileText, DollarSign } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hi! I'm your career assistant. I can help with technical interview prep, resume optimization, salary benchmarks, and more. What can I help with?",
  },
];

const QUICK_PROMPTS = [
  { icon: Code, label: 'Interview prep', query: 'What are key technical interview questions for senior full-stack roles?' },
  { icon: FileText, label: 'Resume tips', query: 'How can I optimize my resume to pass ATS screening?' },
  { icon: DollarSign, label: 'Salary guide', query: 'What is the salary range for senior engineers in 2025?' },
  { icon: Zap, label: 'Career advice', query: 'How should I approach career growth from mid to senior level?' },
];

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('interview') || q.includes('question')) {
      return `Here are key areas to prepare for:\n\n1. System Design — Distributed systems, database sharding, caching strategies\n2. Data Structures — Trees, graphs, dynamic programming\n3. Language-specific — Java concurrency, React hooks lifecycle, TypeScript generics\n4. Behavioral — STAR method for describing impact and leadership\n\nWould you like me to go deeper on any of these topics?`;
    }
    if (q.includes('resume') || q.includes('ats')) {
      return `ATS optimization checklist:\n\n1. Use exact keywords from the job description (e.g., "React", "Spring Boot 3")\n2. Quantify achievements — "Reduced API latency by 40% serving 2M daily requests"\n3. Standard format — .pdf or .docx, no tables or graphics\n4. Clean section headers — Experience, Education, Skills\n\nNeed help with a specific section?`;
    }
    if (q.includes('salary') || q.includes('compensation') || q.includes('negotiation')) {
      return `2025 salary benchmarks (INR / USD, total comp):\n\n• Mid-level (3-5 yrs): ₹18L – ₹30L ($130k – $180k)\n• Senior (5-8 yrs): ₹28L – ₹50L ($170k – $250k)\n• Staff/Principal (8+ yrs): ₹45L+ ($250k – $400k+)\n\nNegotiation tips:\n1. Research company-specific ranges on Levels.fyi\n2. Negotiate total package (equity, signing bonus, PTO)\n3. Get competing offers for leverage`;
    }
    if (q.includes('career') || q.includes('growth') || q.includes('senior')) {
      return `Career growth framework:\n\n1. Technical depth — Own a significant system end-to-end\n2. Impact scope — Move from feature work to architecture decisions\n3. Mentorship — Guide junior engineers, lead code reviews\n4. Communication — Write RFCs, present at team/org level\n5. Business context — Understand how your work drives metrics`;
    }

    return `That's a great question. As a career assistant, I can help with:\n• Technical interview preparation\n• Resume and ATS optimization\n• Salary research and negotiation\n• Career growth strategies\n\nCould you tell me more about what specific area you'd like help with?`;
  };

  const handleSend = (text) => {
    const msg = text || inputValue;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: msg }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateResponse(msg);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/25 transition-all"
          aria-label="Toggle Assistant"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-5 z-50 w-[360px] h-[500px] bg-surface border border-borderSubtle rounded-xl shadow-2xl flex flex-col overflow-hidden theme-transition"
          >
            {/* Header */}
            <div className="p-3.5 bg-nested border-b border-borderSubtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-txtMain">Career Assistant</p>
                  <p className="text-[11px] text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg bg-surface hover:bg-borderSubtle border border-borderStrong flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-accent text-white rounded-br-sm shadow-sm'
                      : 'bg-nested border border-borderStrong text-txtMain rounded-bl-sm shadow-sm'
                  }`}>
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-nested border border-borderStrong text-accent text-sm px-3 py-2 rounded-xl rounded-bl-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 border-t border-borderSubtle bg-nested overflow-x-auto flex gap-1.5 no-scrollbar">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.query)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-surface hover:bg-borderSubtle text-txtMuted hover:text-txtMain rounded-md border border-borderStrong whitespace-nowrap transition-colors"
                >
                  <p.icon className="w-3 h-3 text-accent" />
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-2.5 bg-nested border-t border-borderSubtle flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-surface border border-borderStrong focus:border-accent rounded-lg px-3 py-2 text-sm text-txtMain placeholder-txtMuted focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 bg-accent hover:bg-accent-gradient text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
