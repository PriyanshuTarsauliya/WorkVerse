import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Users, UserCheck, MessageSquare } from 'lucide-react';
import { useToast } from '../Toast';

export default function ReferralModal({ isOpen, onClose, job }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(0);

  if (!isOpen || !job) return null;

  const connections = [
    { name: 'Sarah Jenkins', role: 'Senior Software Engineer', mutual: 12, avatar: 'SJ' },
    { name: 'Rohan Sharma', role: 'Product Manager', mutual: 8, avatar: 'RS' },
    { name: 'Priya Patel', role: 'Tech Lead', mutual: 15, avatar: 'PP' }
  ];

  const currentConnection = connections[selectedConnection];

  const templateMessage = `Hi ${currentConnection.name.split(' ')[0]}, I noticed you're working as a ${currentConnection.role} at ${job.company}. I'm applying for the ${job.title} role and would love to ask if you'd be open to giving me a referral or sharing a brief tip! Thanks so much.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(templateMessage);
    setCopied(true);
    toast('Referral request message copied!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-main/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-borderStrong rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-borderSubtle bg-nested/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-txtMain">Request a Referral</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-borderSubtle text-txtMuted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Connection Selector */}
            <div>
              <label className="block text-xs font-bold text-txtMuted uppercase tracking-wider mb-2">
                Connections at {job.company}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {connections.map((conn, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedConnection(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedConnection === idx
                        ? 'bg-accent/10 border-accent text-txtMain'
                        : 'bg-nested border-borderSubtle text-txtMuted hover:border-borderStrong'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center mb-2">
                      {conn.avatar}
                    </div>
                    <p className="font-bold text-xs truncate text-txtMain">{conn.name}</p>
                    <p className="text-[10px] text-txtMuted truncate">{conn.role}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Message Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-accent" /> Pre-written Referral Message
                </label>
                <span className="text-[10px] text-txtMuted">Editable template</span>
              </div>
              <textarea
                readOnly
                value={templateMessage}
                rows={5}
                className="w-full bg-nested border border-borderSubtle rounded-xl p-3 text-xs text-txtMain leading-relaxed outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-borderSubtle bg-nested/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-txtMain bg-surface border border-borderSubtle rounded-xl hover:bg-borderSubtle transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-accent hover:opacity-90 rounded-xl transition-opacity shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Message'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
