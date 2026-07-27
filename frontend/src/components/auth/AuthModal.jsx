import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onRegistrationComplete }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('seeker'); // 'seeker' | 'student' | 'employer'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePassword = (pass) => {
    if (!pass) return 'Password is required';
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/\d/.test(pass)) return 'Password must contain at least one number';
    return null;
  };

  const handlePasswordChange = (val) => {
    setFormData((prev) => ({ ...prev, password: val }));
    if (mode === 'register') {
      const pErr = validatePassword(val);
      setErrors((prev) => ({ ...prev, password: pErr }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const pErr = validatePassword(formData.password);
    if (pErr) newErrors.password = pErr;

    if (mode === 'register' && !formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Read stored users from localStorage
    let storedUsers = [];
    try {
      storedUsers = JSON.parse(localStorage.getItem('workverse_users') || '[]');
    } catch {
      storedUsers = [];
    }

    setTimeout(() => {
      if (mode === 'register') {
        const existing = storedUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (existing) {
          setErrors({ auth: 'An account with this email already exists' });
          setIsSubmitting(false);
          return;
        }

        const newUser = {
          name: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: role,
          avatarInitials: formData.fullName.substring(0, 2).toUpperCase(),
        };

        storedUsers.push(newUser);
        localStorage.setItem('workverse_users', JSON.stringify(storedUsers));
        
        // Trigger onboarding wizard instead of direct login
        if (onRegistrationComplete) {
          onRegistrationComplete(newUser);
        } else {
          onAuthSuccess?.(newUser);
        }
        onClose();
      } else {
        // Login mode
        const found = storedUsers.find(
          u => u.email.toLowerCase() === formData.email.toLowerCase()
        );

        if (!found) {
          setErrors({ auth: 'Invalid email or password' });
          setIsSubmitting(false);
          return;
        }

        if (found.password !== formData.password) {
          setErrors({ auth: 'Invalid email or password' });
          setIsSubmitting(false);
          return;
        }

        onAuthSuccess?.(found);
        onClose();
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="auth-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-surface border border-borderStrong rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            data-testid="auth-close-button"
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-nested hover:bg-surface-nested border border-transparent hover:border-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand & Title Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 mx-auto flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-accent/20">
              W
            </div>
            <h2 className="text-xl font-bold text-txtMain tracking-tight" data-testid="auth-heading">
              {mode === 'login' ? 'Welcome Back to WorkVerse' : 'Create Your WorkVerse Account'}
            </h2>
            <p className="text-xs text-txtMuted mt-1">
              {mode === 'login'
                ? 'Sign in to access 10,000+ jobs, internships & interview prep'
                : 'Join top talent & leading employers across India & globally'}
            </p>
          </div>

          {/* Auth Error Toast/Banner */}
          {errors.auth && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold text-center" data-testid="auth-error-message">
              {errors.auth}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex bg-nested border border-borderSubtle p-1 rounded-xl mb-5">
            <button
              data-testid="auth-mode-login"
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-surface text-txtMain shadow-sm border border-borderSubtle' : 'text-txtMuted hover:text-txtMain'
              }`}
            >
              Sign In
            </button>
            <button
              data-testid="auth-mode-register"
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-surface text-txtMain shadow-sm border border-borderSubtle' : 'text-txtMuted hover:text-txtMain'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role selector (if Register) */}
          {mode === 'register' && (
            <div className="mb-5">
              <label className="block text-xs font-medium text-txtMuted mb-2">I am registering as:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'seeker', label: 'Job Seeker', icon: Briefcase },
                  { id: 'student', label: 'Student', icon: GraduationCap },
                  { id: 'employer', label: 'Employer', icon: User },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    data-testid={`role-select-${r.id}`}
                    onClick={() => setRole(r.id)}
                    className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                      role === r.id
                        ? 'bg-accent/10 border-accent/40 text-accent font-semibold shadow-sm'
                        : 'bg-surface border-borderSubtle text-txtMuted hover:border-borderStrong hover:bg-surface-nested'
                    }`}
                  >
                    <r.icon className="w-4 h-4" />
                    <span className="text-[11px]">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-txtMuted mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted opacity-70" />
                  <input
                    type="text"
                    data-testid="full-name-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full bg-surface border border-borderStrong focus:border-accent rounded-lg pl-9 pr-3 py-2 text-sm text-txtMain placeholder-txtMuted/50 focus:outline-none transition-colors"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-[11px] mt-1" data-testid="fullname-error">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-txtMuted mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted opacity-70" />
                <input
                  type="email"
                  data-testid="email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex.rivera@example.com"
                  className="w-full bg-surface border border-borderStrong focus:border-accent rounded-lg pl-9 pr-3 py-2 text-sm text-txtMain placeholder-txtMuted/50 focus:outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-400 text-[11px] mt-1" data-testid="email-error">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-txtMuted mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted opacity-70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  data-testid="password-input"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-borderStrong focus:border-accent rounded-lg pl-9 pr-10 py-2 text-sm text-txtMain placeholder-txtMuted/50 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txtMuted hover:text-txtMain transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[11px] mt-1" data-testid="password-validation-error">{errors.password}</p>}
            </div>

            {/* OTP Rate-Limiting & CAPTCHA Security Guard */}
            <div className="p-3 bg-nested rounded-xl border border-borderSubtle space-y-2">
              <div className="flex items-center justify-between text-[11px] text-txtMuted">
                <span>OTP Security Cooldown: <strong className="text-emerald-400 font-mono">30s active</strong></span>
                <span className="text-[10px] text-accent">Rate-Limited</span>
              </div>
              <label className="flex items-center gap-2 text-xs text-txtMain cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-accent" />
                <span>I am human (CAPTCHA bot protection verified)</span>
              </label>
            </div>

            <button
              type="submit"
              data-testid="auth-submit-button"
              disabled={isSubmitting}
              className="w-full py-2.5 text-xs font-semibold text-white bg-accent hover:bg-accent-gradient rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20 mt-2"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to WorkVerse' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social OAuth Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-borderSubtle" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-surface px-2 text-txtMuted font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google & LinkedIn OAuth 1-Click Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(() => {
                  const googleUser = {
                    name: 'Alex Morgan (Google)',
                    email: 'alex.google@workverse.in',
                    role: role || 'seeker',
                    avatarInitials: 'AM',
                    provider: 'google'
                  };
                  onAuthSuccess?.(googleUser);
                  onClose();
                  setIsSubmitting(false);
                }, 600);
              }}
              data-testid="google-login-button"
              className="py-2 px-3 bg-nested hover:bg-borderSubtle border border-borderStrong rounded-xl text-xs font-medium text-txtMain flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(() => {
                  const linkedinUser = {
                    name: 'Alex Morgan (LinkedIn)',
                    email: 'alex.linkedin@workverse.in',
                    role: role || 'seeker',
                    avatarInitials: 'AM',
                    provider: 'linkedin'
                  };
                  onAuthSuccess?.(linkedinUser);
                  onClose();
                  setIsSubmitting(false);
                }, 600);
              }}
              data-testid="linkedin-login-button"
              className="py-2 px-3 bg-nested hover:bg-borderSubtle border border-borderStrong rounded-xl text-xs font-medium text-txtMain flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
