import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Rocket, Check } from 'lucide-react';

export default function PostJobModal({ isOpen, onClose, onJobPosted }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyWebsite: '',
    location: '',
    jobType: 'FULL_TIME',
    category: 'Engineering',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    techStack: ['React', 'Spring Boot'],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Job title is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.salaryMin || Number(formData.salaryMin) <= 0) errs.salaryMin = 'Valid salary required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    return errs;
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.techStack.includes(tag)) {
        setFormData({ ...formData, techStack: [...formData.techStack, tag] });
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((t) => t !== tag) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrs = validate();
    if (Object.keys(valErrs).length > 0) { setErrors(valErrs); return; }

    setIsSubmitting(true);
    setErrors({});

    const newJob = {
      id: Date.now(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      jobType: formData.jobType,
      salaryMin: Number(formData.salaryMin),
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      currency: formData.currency,
      description: formData.description,
      techStack: formData.techStack,
      isNew: true,
      applicationCount: 0,
      postedDaysAgo: 0,
      companyRating: 4.5,
      companyReviewCount: 0,
      experienceLevel: 'Mid Level',
      experienceYears: '3+',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onJobPosted?.(newJob);
    }, 1000);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      title: '', company: '', companyWebsite: '', location: '', jobType: 'FULL_TIME',
      category: 'Engineering', salaryMin: '', salaryMax: '', currency: 'USD',
      description: '', techStack: ['React', 'Spring Boot'],
    });
    onClose();
  };

  const inputClass = (err) =>
    `w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
      err ? 'border-rose-500' : 'border-navy-750 focus:border-brand'
    }`;

  const selectClass = 'w-full bg-navy-900 border border-navy-750 focus:border-brand rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl bg-navy-950 border border-navy-750 rounded-xl p-6 shadow-2xl my-6"
        >
          <button onClick={resetAndClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-txt-tertiary hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>

          {!isSuccess ? (
            <div>
              <div className="mb-5">
                <p className="text-xs font-medium text-brand mb-1">Employer portal</p>
                <h2 className="text-lg font-bold text-white">Post a new role</h2>
                <p className="text-sm text-txt-secondary mt-1">Reach thousands of engineers globally.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Job title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Senior React Engineer" className={inputClass(errors.title)} />
                    {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Company *</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Acme Inc." className={inputClass(errors.company)} />
                    {errors.company && <p className="text-rose-400 text-xs mt-1">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Website</label>
                    <input type="url" value={formData.companyWebsite} onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })} placeholder="https://company.com" className={inputClass()} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Location *</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="San Francisco, CA" className={inputClass(errors.location)} />
                    {errors.location && <p className="text-rose-400 text-xs mt-1">{errors.location}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Work type</label>
                    <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} className={selectClass}>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={selectClass}>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="DevOps">DevOps & Cloud</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Min salary *</label>
                    <input type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} placeholder="120000" className={inputClass(errors.salaryMin)} />
                    {errors.salaryMin && <p className="text-rose-400 text-xs mt-1">{errors.salaryMin}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Max salary</label>
                    <input type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} placeholder="170000" className={inputClass()} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">Currency</label>
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className={selectClass}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                {/* Tech stack tags */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Tech stack</label>
                  <div className="flex flex-wrap items-center gap-2 bg-navy-900 border border-navy-750 p-2.5 rounded-lg focus-within:border-brand transition-colors">
                    {formData.techStack.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-brand-muted border border-brand-subtle text-brand-light text-xs px-2.5 py-1 rounded-md">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add skill, press Enter"
                      className="flex-1 bg-transparent text-sm text-white focus:outline-none px-1 py-0.5 min-w-[140px]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Job description *</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                    className={inputClass(errors.description)}
                  />
                  {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-navy-750">
                  <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-lg transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Publishing...' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-brand/15 border border-brand/30 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-7 h-7 text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white">Job Published</h3>
              <p className="text-sm text-txt-secondary max-w-sm mx-auto">
                <span className="text-white font-medium">{formData.title}</span> at {formData.company} is now live on the job board.
              </p>
              <button onClick={resetAndClose} className="px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-lg transition-colors">
                View Feed
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
