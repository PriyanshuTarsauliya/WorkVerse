import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bot, Sparkles, Send, Award, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, ChevronLeft,
  Volume2, VolumeX, Play, Pause, Mic, MicOff, Radio, FileText, Briefcase, Zap, HelpCircle, Layers, Check, ArrowRight,
  Maximize2, Minimize2
} from 'lucide-react';
import {
  generateMockInterviewQuestions,
  playQuestionAudioTTS,
  stopQuestionAudioTTS,
  playChimeSound,
  saveInterviewSessionHistory,
  checkDailyQuota
} from '../../utils/interviewApi';

const PRACTICE_MODES = [
  {
    id: 'tech_resume',
    title: 'Technical (from Resume)',
    desc: 'Targeted questions tailored to your specific resume projects & skills',
    icon: FileText,
    color: 'from-accent to-indigo-500'
  },
  {
    id: 'tech_general',
    title: 'Technical (Role General)',
    desc: 'Domain architecture & core coding standards for this job title',
    icon: CodeIcon,
    color: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'behavioral',
    title: 'Behavioral / Personality',
    desc: 'Situational STAR method questions on leadership, conflict & delivery',
    icon: Sparkles,
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'resume_review',
    title: 'Resume Review (Text Audit)',
    desc: 'Feedback on resume gaps & alignment relative to this job description',
    icon: Layers,
    color: 'from-purple-500 to-pink-500'
  }
];

function CodeIcon(props) {
  return <Briefcase {...props} />;
}

export default function AIMockInterviewModal({
  isOpen,
  onClose,
  job = null,
  candidateProfile = null,
  onOpenResumeBuilder = null
}) {
  // Config & Mode selection
  const [selectedMode, setSelectedMode] = useState('tech_resume');
  const [questionCount, setQuestionCount] = useState(6);
  const [customJdText, setCustomJdText] = useState('');
  
  // State Machine: 'CONFIG' | 'LOADING' | 'PRACTICE' | 'SUMMARY' | 'REVIEW'
  const [viewState, setViewState] = useState('CONFIG');
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio Player states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isTextOnlyMode, setIsTextOnlyMode] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Candidate Answer / Mic state
  const [userAnswers, setUserAnswers] = useState({});
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  const activeJobTitle = job?.title || 'Senior Software Engineer';
  const activeJobDescription = job?.description || customJdText || 'Build high-throughput distributed applications.';
  const hasResume = candidateProfile?.hasResume || candidateProfile?.skills?.length > 0;
  const quota = checkDailyQuota();

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setViewState('CONFIG');
      setErrorMessage('');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsPlayingAudio(false);
      setIsFullScreen(false);
      stopQuestionAudioTTS();
    }
  }, [isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Keyboard Shortcuts Handler (ArrowLeft, ArrowRight, Spacebar, 'n', 'q')
  const handleKeyDown = useCallback((e) => {
    if (viewState !== 'PRACTICE') return;

    // Ignore if typing in text area
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleAudioPlay();
    } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      handleNextQuestion();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevQuestion();
    } else if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      onClose();
    }
  }, [viewState, currentQuestionIndex, interviewSession, isPlayingAudio]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Audio Play / Pause Toggle
  const toggleAudioPlay = () => {
    if (isPlayingAudio) {
      stopQuestionAudioTTS();
      setIsPlayingAudio(false);
    } else {
      const currentQ = interviewSession?.questions?.[currentQuestionIndex];
      if (!currentQ) return;
      
      setIsPlayingAudio(true);
      playQuestionAudioTTS(
        currentQ.question,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          // Play chime sound and auto-advance after brief pause
          playChimeSound(isAudioMuted);
        },
        () => {
          setIsPlayingAudio(false);
          setIsTextOnlyMode(true);
        }
      );
    }
  };

  // Start Session Request
  const handleStartSession = async () => {
    setViewState('LOADING');
    setErrorMessage('');

    try {
      const resumeString = candidateProfile ? JSON.stringify(candidateProfile) : '';
      const session = await generateMockInterviewQuestions({
        jobDescription: activeJobDescription,
        jobTitle: activeJobTitle,
        resumeText: resumeString,
        mode: selectedMode,
        questionCount: questionCount,
      });

      setInterviewSession(session);
      setStartTime(Date.now());
      setCurrentQuestionIndex(0);

      if (selectedMode === 'resume_review') {
        setViewState('SUMMARY');
      } else {
        setViewState('PRACTICE');
        // Auto play audio for first question if not text-only
        if (!isTextOnlyMode) {
          setTimeout(() => {
            if (session.questions?.[0]) {
              playQuestionAudioTTS(
                session.questions[0].question,
                () => setIsPlayingAudio(true),
                () => setIsPlayingAudio(false),
                () => setIsTextOnlyMode(true)
              );
            }
          }, 400);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to generate interview questions. Please try again.');
      setViewState('CONFIG');
    }
  };

  const handleNextQuestion = () => {
    stopQuestionAudioTTS();
    setIsPlayingAudio(false);

    // Save current answer
    if (currentAnswerText) {
      setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: currentAnswerText }));
      setCurrentAnswerText('');
    }

    if (interviewSession && currentQuestionIndex + 1 < interviewSession.questions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      playChimeSound(isAudioMuted);

      // Play audio for next question
      if (!isTextOnlyMode) {
        setTimeout(() => {
          playQuestionAudioTTS(
            interviewSession.questions[nextIdx].question,
            () => setIsPlayingAudio(true),
            () => setIsPlayingAudio(false),
            () => setIsTextOnlyMode(true)
          );
        }, 300);
      }
    } else {
      // Finish Session
      finishSession();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      stopQuestionAudioTTS();
      setIsPlayingAudio(false);
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);

      if (!isTextOnlyMode) {
        playQuestionAudioTTS(
          interviewSession.questions[prevIdx].question,
          () => setIsPlayingAudio(true),
          () => setIsPlayingAudio(false),
          () => setIsTextOnlyMode(true)
        );
      }
    }
  };

  const finishSession = () => {
    stopQuestionAudioTTS();
    setIsPlayingAudio(false);
    
    const duration = Math.round((Date.now() - (startTime || Date.now())) / 1000);
    setElapsedSeconds(duration);
    setViewState('SUMMARY');

    // Save session to user history
    saveInterviewSessionHistory({
      sessionId: interviewSession?.sessionId,
      jobTitle: activeJobTitle,
      company: job?.company || 'Target Employer',
      mode: selectedMode,
      questionsCount: interviewSession?.questions?.length || 0,
      durationSeconds: duration,
      completedAt: new Date().toISOString(),
    });
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 ${
          isFullScreen ? 'p-0' : 'p-3 sm:p-4'
        }`}
        data-testid="ai-mock-interview-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative bg-surface border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullScreen
              ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10'
              : 'w-full max-w-4xl max-h-[92vh] rounded-2xl p-6 md:p-8'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight">AI Mock Interview Practice</h2>
                <p className="text-xs text-txtMuted">Customized voice practice for <span className="font-semibold text-txtMain">{activeJobTitle}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full hidden sm:inline-block">
                {quota.remaining} / 5 Daily Sessions Remaining
              </span>

              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                  isFullScreen
                    ? 'bg-accent/20 border-accent/40 text-accent'
                    : 'bg-nested hover:bg-surface border-borderSubtle text-txtMuted hover:text-txtMain'
                }`}
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen / Full Page Mode'}
                data-testid="toggle-fullscreen-btn"
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { stopQuestionAudioTTS(); onClose(); }}
                className="w-8 h-8 rounded-lg bg-nested hover:bg-surface border border-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ════ STATE 1: CONFIGURATION & MODE PICKER ════ */}
          {viewState === 'CONFIG' && (
            <div className="flex-1 overflow-y-auto pt-5 pb-2 pr-1 flex flex-col justify-between">
              <div className={`grid grid-cols-1 ${isFullScreen ? 'lg:grid-cols-12 gap-8' : 'gap-5'}`}>
                {/* Main Configuration Column */}
                <div className={`${isFullScreen ? 'lg:col-span-7 space-y-6' : 'space-y-5'}`}>
                  {/* Resume Check Alert */}
                  {!hasResume && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-400">No Resume Detected on Profile</p>
                          <p className="text-[11px] text-txtMuted">Add your resume to enable personalized question generation tailored to your past projects.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { onClose(); onOpenResumeBuilder?.(); }}
                        className="px-3 py-1.5 text-xs font-bold text-txtMain bg-nested border border-borderSubtle hover:bg-surface rounded-xl whitespace-nowrap"
                      >
                        Build Resume →
                      </button>
                    </div>
                  )}

                  {/* Practice Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-txtMain mb-2.5">1. Select Interview Practice Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PRACTICE_MODES.map((m) => {
                        const isSelected = selectedMode === m.id;
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMode(m.id)}
                            className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                              isSelected
                                ? 'bg-accent/10 border-accent text-txtMain shadow-md'
                                : 'bg-main border-borderSubtle text-txtMuted hover:border-borderStrong hover:bg-surface'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5`}>
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-txtMain leading-tight">{m.title}</p>
                              <p className="text-[11px] text-txtMuted mt-1 leading-normal">{m.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Count & Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-txtMuted mb-1.5">Questions Per Session</label>
                      <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-3 py-2 text-xs text-txtMain outline-none cursor-pointer font-semibold"
                      >
                        <option value={4}>4 Questions (Quick Warmup)</option>
                        <option value={6}>6 Questions (Standard Round)</option>
                        <option value={8}>8 Questions (Deep Tech Dive)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-txtMuted mb-1.5">Audio Engine</label>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-main border border-borderSubtle text-xs">
                        <span className="text-txtMuted font-medium">Text-to-Speech Audio Reader</span>
                        <button
                          onClick={() => setIsTextOnlyMode(!isTextOnlyMode)}
                          className={`px-3 py-1 font-bold rounded-lg text-[11px] transition-colors ${isTextOnlyMode ? 'bg-nested text-txtMuted' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
                        >
                          {isTextOnlyMode ? 'Text Flashcards' : 'Voice Audio Enabled 🔊'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Target Job Description & Role Context (Shown in Full Screen) */}
                  {isFullScreen && (
                    <div className="pt-2 space-y-2">
                      <label className="block text-xs font-bold text-txtMain">2. Target Role & Job Description Context</label>
                      <textarea
                        value={customJdText}
                        onChange={(e) => setCustomJdText(e.target.value)}
                        placeholder={`Optional: Paste specific job description or target responsibilities for ${activeJobTitle}...`}
                        rows={3}
                        className="w-full bg-main border border-borderSubtle focus:border-accent rounded-xl p-3 text-xs text-txtMain placeholder-txtMuted/50 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  )}
                </div>

                {/* Right / Studio Strategy & Prep Workspace (Fills vertical blank space in Full Screen) */}
                {isFullScreen && (
                  <div className="lg:col-span-5 space-y-5 flex flex-col justify-between bg-nested/40 border border-borderSubtle rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" /> AI Interview Prep Studio
                      </div>

                      <div className="space-y-3 text-xs text-txtMuted">
                        <div className="bg-main p-4 rounded-xl border border-borderSubtle space-y-2">
                          <p className="font-bold text-txtMain text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" /> Evaluation Strategy
                          </p>
                          <p className="leading-relaxed text-[11px]">
                            Questions are dynamically tailored to <span className="text-txtMain font-semibold">{activeJobTitle}</span>. Use the built-in speech recorder or articulate your answer out loud using the STAR method (Situation, Task, Action, Result).
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="bg-main p-3.5 rounded-xl border border-borderSubtle space-y-1">
                            <p className="text-[10px] text-txtMuted font-medium uppercase">Daily Quota</p>
                            <p className="text-base font-bold text-emerald-400">{quota.remaining} / 5 Sessions</p>
                          </div>
                          <div className="bg-main p-3.5 rounded-xl border border-borderSubtle space-y-1">
                            <p className="text-[10px] text-txtMuted font-medium uppercase">Audio Playback</p>
                            <p className="text-base font-bold text-accent">Voice Synthesis</p>
                          </div>
                        </div>

                        <div className="bg-main p-4 rounded-xl border border-borderSubtle space-y-2.5">
                          <p className="font-bold text-txtMain text-xs flex items-center gap-2">
                            <Award className="w-4 h-4 text-indigo-400" /> Core Competencies Tested
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-surface border border-borderSubtle text-[11px] text-txtMain font-medium">Architecture</span>
                            <span className="px-2.5 py-1 rounded-lg bg-surface border border-borderSubtle text-[11px] text-txtMain font-medium">Problem Solving</span>
                            <span className="px-2.5 py-1 rounded-lg bg-surface border border-borderSubtle text-[11px] text-txtMain font-medium">Communication</span>
                            <span className="px-2.5 py-1 rounded-lg bg-surface border border-borderSubtle text-[11px] text-txtMain font-medium">STAR Method</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-xs text-txtMain flex items-center gap-3 mt-4">
                      <Bot className="w-6 h-6 text-accent shrink-0" />
                      <p className="text-[11px] text-txtMuted leading-normal">
                        Shortcuts: Press <kbd className="px-1.5 py-0.5 bg-surface border border-borderSubtle rounded text-txtMain font-mono text-[10px]">Space</kbd> to play/pause question audio, and <kbd className="px-1.5 py-0.5 bg-surface border border-borderSubtle rounded text-txtMain font-mono text-[10px]">Right Arrow</kbd> to advance questions.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold my-2">
                  {errorMessage}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-borderSubtle flex justify-end mt-4">
                <button
                  onClick={handleStartSession}
                  className="px-8 py-3 text-xs font-bold text-white bg-gradient-to-r from-accent to-indigo-500 hover:opacity-90 rounded-xl transition-opacity shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start Mock Interview
                </button>
              </div>
            </div>
          )}

          {/* ════ STATE 2: SHIMMER SKELETON LOADING ════ */}
          {viewState === 'LOADING' && (
            <div className="flex-1 flex flex-col justify-center items-center py-12 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-accent animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-txtMain">Generating Custom Interview Questions...</h3>
                <p className="text-xs text-txtMuted">Analyzing resume competencies & target job description</p>
              </div>

              {/* Skeleton Shimmer Card */}
              <div className="w-full max-w-lg bg-main border border-borderSubtle rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-borderSubtle rounded-md w-3/4" />
                <div className="h-3 bg-borderSubtle rounded-md w-full" />
                <div className="h-3 bg-borderSubtle rounded-md w-5/6" />
                <div className="h-10 bg-borderSubtle rounded-xl w-full mt-4" />
              </div>
            </div>
          )}

          {/* ════ STATE 3: IN-BROWSER AUDIO PLAYER & PRACTICE ════ */}
          {viewState === 'PRACTICE' && interviewSession && (
            <div className="flex-1 overflow-y-auto pt-4 space-y-5 pr-1 flex flex-col justify-between">
              {/* Question Progress Header */}
              <div className="flex items-center justify-between bg-nested/40 p-3 rounded-2xl border border-borderSubtle">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-xl">
                    Question {currentQuestionIndex + 1} of {interviewSession.questions.length}
                  </span>
                  <span className="text-xs text-txtMuted font-medium">
                    {interviewSession.questions[currentQuestionIndex]?.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-1.5 rounded-lg bg-surface text-txtMuted hover:text-txtMain border border-borderSubtle"
                    title={isAudioMuted ? 'Unmute chime' : 'Mute chime'}
                  >
                    {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <span className="text-txtMuted text-[11px] hidden sm:inline">Shortcuts: Space (Play/Pause), Arrows (Prev/Next), 'q' (Quit)</span>
                </div>
              </div>

              {/* In-Browser Player Card */}
              <div className="bg-main border border-borderSubtle rounded-2xl p-6 space-y-5 relative">
                {/* Waveform / Motion Progress Bar */}
                {isPlayingAudio && (
                  <div className="flex items-center justify-center gap-1.5 h-6">
                    {[16, 24, 12, 32, 20, 28, 14, 22, 18].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, h, 8] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}
                        className="w-1 bg-accent rounded-full"
                      />
                    ))}
                  </div>
                )}

                {/* Question Text */}
                <p className="text-base font-bold text-txtMain leading-relaxed text-center">
                  "{interviewSession.questions[currentQuestionIndex]?.question}"
                </p>

                {/* In-Browser Player Controls (Play/Pause, Prev, Next) */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="w-10 h-10 rounded-xl bg-surface border border-borderSubtle hover:bg-nested flex items-center justify-center text-txtMain disabled:opacity-30 transition-all"
                    title="Previous Question (Left Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={toggleAudioPlay}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-indigo-500 hover:opacity-90 flex items-center justify-center text-white shadow-lg shadow-accent/20 transition-all"
                    title="Play / Pause Audio (Spacebar)"
                  >
                    {isPlayingAudio ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="w-10 h-10 rounded-xl bg-surface border border-borderSubtle hover:bg-nested flex items-center justify-center text-txtMain transition-all"
                    title="Next Question (Right Arrow / 'n')"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Candidate Out-Loud Practice & Text Answer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-txtMuted">Articulate Your Response Out Loud:</label>
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-md' : 'bg-nested text-txtMuted border border-borderSubtle hover:text-txtMain'}`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-accent" />}
                    <span>{isListening ? 'Listening...' : 'Record Speech 🎙️'}</span>
                  </button>
                </div>

                <textarea
                  value={currentAnswerText}
                  onChange={(e) => setCurrentAnswerText(e.target.value)}
                  placeholder="Speak your answer out loud or draft notes here before advancing..."
                  rows={4}
                  className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl p-3.5 text-xs text-txtMain placeholder-txtMuted/50 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between border-t border-borderSubtle pt-3">
                <button
                  onClick={finishSession}
                  className="text-xs text-txtMuted hover:text-txtMain transition-colors"
                >
                  End Practice & View Summary
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-accent hover:opacity-90 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>{currentQuestionIndex + 1 === interviewSession.questions.length ? 'Finish Practice' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════ STATE 4: SUMMARY & REVIEW MODE ════ */}
          {viewState === 'SUMMARY' && (
            <div className="flex-1 overflow-y-auto pt-4 space-y-5 pr-1">
              <div className="text-center space-y-2 py-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-txtMain">Mock Session Completed!</h3>
                <p className="text-xs text-txtMuted max-w-md mx-auto">
                  Great job practicing your response articulation for <span className="font-semibold text-txtMain">{activeJobTitle}</span>.
                </p>

                {/* Session Stats */}
                <div className="flex items-center justify-center gap-6 py-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">{interviewSession?.questions?.length || 0}</p>
                    <p className="text-[11px] text-txtMuted">Questions Covered</p>
                  </div>
                  <div className="text-center border-x border-borderSubtle px-6">
                    <p className="text-xl font-bold text-emerald-400">{Math.round(elapsedSeconds / 60)} min</p>
                    <p className="text-[11px] text-txtMuted">Time Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-400">+5%</p>
                    <p className="text-[11px] text-txtMuted">Profile Prep Boost</p>
                  </div>
                </div>
              </div>

              {/* Resume Feedback Mode output if selected */}
              {interviewSession?.resumeFeedback && (
                <div className="bg-main border border-borderSubtle rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-bold text-txtMain uppercase tracking-wider">Resume Alignment Audit</h4>
                  <p className="text-xs text-txtMuted whitespace-pre-line leading-relaxed">
                    {interviewSession.resumeFeedback}
                  </p>
                </div>
              )}

              {/* Text Review of Questions Asked */}
              {interviewSession?.questions?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-txtMuted uppercase tracking-wider">Questions & Key Concept Review</h4>
                  <div className="space-y-3">
                    {interviewSession.questions.map((q, idx) => (
                      <div key={idx} className="bg-main border border-borderSubtle rounded-2xl p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-txtMain">Q{idx + 1}: {q.question}</p>
                          <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md shrink-0">
                            {q.category}
                          </span>
                        </div>
                        {q.keyPoints && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {q.keyPoints.map((kp, kIdx) => (
                              <span key={kIdx} className="text-[10px] text-txtMuted bg-surface px-2 py-0.5 rounded-md border border-borderSubtle">
                                • {kp}
                              </span>
                            ))}
                          </div>
                        )}
                        {q.sampleAnswer && (
                          <div className="bg-surface p-3 rounded-xl border border-borderSubtle text-[11px] text-txtMuted">
                            <span className="font-semibold text-txtMain block mb-0.5">Sample Ideal Explanation:</span>
                            {q.sampleAnswer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-borderSubtle pt-4 pb-2">
                <button
                  onClick={() => setViewState('CONFIG')}
                  className="px-5 py-2.5 text-xs font-bold text-txtMain bg-nested border border-borderSubtle hover:bg-surface rounded-xl transition-colors"
                >
                  Change Mode / Settings
                </button>

                <button
                  onClick={handleStartSession}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-accent to-indigo-500 hover:opacity-90 rounded-xl transition-opacity shadow-md flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Practice Again
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
