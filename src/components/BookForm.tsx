import React, { useState, useEffect } from 'react';
import { Book, NewBook, Student } from '../types';
import { X, Save, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: NewBook | Book) => void;
  editingBook?: Book | null;
  students: Student[];
}

export default function BookForm({ isOpen, onClose, onSubmit, editingBook, students }: BookFormProps) {
  const [formData, setFormData] = useState<NewBook>({
    title: '',
    author: '',
    isbn: '',
    received_date: '',
    renew_date: '',
    category: '',
    borrowed_by: '',
    remarks: ''
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author || '',
        isbn: editingBook.isbn || '',
        received_date: editingBook.received_date || '',
        renew_date: editingBook.renew_date || '',
        category: editingBook.category || '',
        borrowed_by: editingBook.borrowed_by || '',
        remarks: editingBook.remarks || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        received_date: '',
        renew_date: '',
        category: '',
        borrowed_by: '',
        remarks: ''
      });
    }
  }, [editingBook, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      onSubmit({ ...formData, id: editingBook.id } as Book);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-brand-red/10"
          >
            <div className="bg-brand-red p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-serif font-bold">
                  {editingBook ? 'Edit Book Record' : 'Add New Book Record'}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Book Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="Enter book title"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">ISBN Number</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="Enter ISBN"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="e.g. Ayurveda, Medicine"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Received Date (Nepali)</label>
                  <input
                    type="text"
                    value={formData.received_date}
                    onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Renew Date (Nepali)</label>
                  <input
                    type="text"
                    value={formData.renew_date}
                    onChange={(e) => setFormData({ ...formData, renew_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Borrowed By (Student Name)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.borrowed_by}
                      onChange={(e) => setFormData({ ...formData, borrowed_by: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50 appearance-none"
                    >
                      <option value="">Select a student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} {s.student_id ? `(${s.student_id})` : ''}</option>
                      ))}
                      <option value="Other">Other / Manual Entry</option>
                    </select>
                  </div>
                  {formData.borrowed_by === 'Other' && (
                    <input
                      type="text"
                      className="mt-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                      placeholder="Enter student name manually"
                      onChange={(e) => setFormData({ ...formData, borrowed_by: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50 h-20 resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-brand-red text-white font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingBook ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
