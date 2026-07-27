import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, Smartphone, Clock, Trash2, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '../Toast';

export default function JobAlertsModal({ isOpen, onClose, currentFilters, alerts, onSaveAlert, onDeleteAlert, mode = 'manage' }) {
  const toast = useToast();
  const [view, setView] = useState(mode); // 'manage' or 'create'
  
  // New alert form state
  const [alertName, setAlertName] = useState('');
  const [frequency, setFrequency] = useState('daily'); // instant, daily, weekly
  const [notifyMethod, setNotifyMethod] = useState('email'); // email, in_app

  // Reset form when opened in create mode
  React.useEffect(() => {
    if (isOpen) {
      setView(mode);
      if (mode === 'create') {
        const queryDesc = currentFilters?.search || currentFilters?.location || 'New Job Alert';
        setAlertName(queryDesc.charAt(0).toUpperCase() + queryDesc.slice(1));
      }
    }
  }, [isOpen, mode, currentFilters]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (alerts.length >= 5) {
      toast('You can only have up to 5 active alerts.', 'error');
      return;
    }
    if (!alertName.trim()) {
      toast('Please provide a name for the alert', 'error');
      return;
    }
    
    onSaveAlert({
      id: Date.now().toString(),
      name: alertName,
      frequency,
      notifyMethod,
      filters: { ...currentFilters },
      newMatches: Math.floor(Math.random() * 5) + 1 // Mock new matches for demo
    });
    
    toast('Job alert saved successfully!', 'success');
    onClose();
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
          className="relative w-full max-w-md bg-surface border border-borderStrong rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-borderSubtle bg-nested/50">
            <h2 className="text-lg font-bold text-txtMain flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              {view === 'create' ? 'Create Job Alert' : 'Manage Alerts'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-borderSubtle text-txtMuted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto max-h-[70vh]">
            {view === 'create' ? (
              <div className="space-y-5">
                {alerts.length >= 5 ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3 text-amber-500 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>You have reached the maximum limit of 5 alerts. Please delete an existing alert to create a new one.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-txtMain mb-1.5">Alert Name</label>
                      <input 
                        type="text" 
                        value={alertName}
                        onChange={(e) => setAlertName(e.target.value)}
                        className="w-full bg-nested border border-borderSubtle rounded-lg px-3 py-2 text-sm text-txtMain focus:border-accent outline-none" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-txtMain mb-2">How often?</label>
                      <div className="flex gap-2">
                        {['instant', 'daily', 'weekly'].map(freq => (
                          <button
                            key={freq}
                            onClick={() => setFrequency(freq)}
                            className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                              frequency === freq 
                                ? 'bg-accent/10 border-accent text-accent' 
                                : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
                            }`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-txtMain mb-2">Notification Method</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setNotifyMethod('email')}
                          className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            notifyMethod === 'email' ? 'bg-accent/10 border-accent text-accent' : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5" /> Email
                        </button>
                        <button
                          onClick={() => setNotifyMethod('in_app')}
                          className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            notifyMethod === 'in_app' ? 'bg-accent/10 border-accent text-accent' : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" /> In-App
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-txtMuted mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-txtMuted">No active alerts yet.</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="flex flex-col gap-2 p-3 rounded-xl border border-borderSubtle bg-nested">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-txtMain">{alert.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold text-txtMuted bg-surface px-1.5 py-0.5 rounded border border-borderSubtle">
                              {alert.frequency}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-txtMuted bg-surface px-1.5 py-0.5 rounded border border-borderSubtle">
                              {alert.notifyMethod.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.newMatches > 0 && (
                            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse-subtle">
                              {alert.newMatches} New
                            </span>
                          )}
                          <button onClick={() => onDeleteAlert(alert.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-txtMuted hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-borderSubtle bg-nested/50 flex justify-end gap-2">
            {view === 'create' ? (
              <>
                <button onClick={() => setView('manage')} className="px-4 py-2 text-sm font-semibold text-txtMain bg-surface border border-borderSubtle rounded-lg hover:bg-borderSubtle transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={alerts.length >= 5} className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50">
                  Save Alert
                </button>
              </>
            ) : (
              <button onClick={() => setView('create')} disabled={alerts.length >= 5} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-accent hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50">
                <Plus className="w-4 h-4" /> Create New Alert
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
