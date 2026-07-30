import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Server, Code, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';

const API_ENDPOINTS = [
  { id: 'jobs', name: 'Jobs API', method: 'GET', path: '/api/v1/jobs' },
  { id: 'live-jobs', name: 'Live Remotive Jobs', method: 'GET', path: '/api/jobs/live' },
  { id: 'companies', name: 'Companies Directory', method: 'GET', path: '/api/v1/companies' },
  { id: 'salary', name: 'Salary Guide (Roles)', method: 'GET', path: '/api/v1/salary-guide/roles' },
  { id: 'auth', name: 'Auth Check', method: 'GET', path: '/api/auth/me' },
];

export default function BackendDiagnosticsModal({ isOpen, onClose }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const apiBaseUrl = baseUrl.endsWith('/api') ? baseUrl.replace('/api', '') : baseUrl;

  const testEndpoint = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }));
    try {
      const startTime = performance.now();
      const res = await fetch(`${apiBaseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      });
      const endTime = performance.now();
      
      let data = null;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: res.status,
          ok: res.ok,
          time: Math.round(endTime - startTime),
          data: data
        }
      }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: 'ERROR',
          ok: false,
          time: 0,
          data: err.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.id]: false }));
    }
  };

  const testAll = () => {
    API_ENDPOINTS.forEach(ep => testEndpoint(ep));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[var(--panel)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--canvas)]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Backend Integration Diagnostics</h2>
                <p className="text-sm text-[var(--text-muted)] flex items-center gap-2 mt-1">
                  <Server className="w-4 h-4" /> Targeting: <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{apiBaseUrl}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={testAll}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Zap className="w-4 h-4" />
                Run All Tests
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0B0F14]">
            {API_ENDPOINTS.map((ep) => {
              const res = results[ep.id];
              const isLoad = loading[ep.id];
              
              return (
                <div key={ep.id} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--panel)]">
                  <div className="flex items-center justify-between p-4 bg-[var(--canvas)]/30 border-b border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      {isLoad ? (
                        <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                      ) : res ? (
                        res.ok ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-dashed" />
                      )}
                      
                      <div>
                        <h3 className="font-medium text-white">{ep.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                          <span className={`px-1.5 py-0.5 rounded-md ${ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {ep.method}
                          </span>
                          <span className="text-[var(--text-muted)]">{ep.path}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {res && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`font-mono px-2 py-1 rounded-md ${res.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {res.status}
                          </span>
                          <span className="text-[var(--text-muted)] font-mono">{res.time}ms</span>
                        </div>
                      )}
                      <button
                        onClick={() => testEndpoint(ep)}
                        disabled={isLoad}
                        className="px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                  
                  {res && (
                    <div className="p-4 bg-[#090C10] overflow-x-auto text-xs font-mono text-gray-300 max-h-[300px] overflow-y-auto">
                      <pre>{JSON.stringify(res.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
