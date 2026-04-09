import React, { useState, useEffect } from 'react';
import { Book, NewBook, Student, ExchangeHistory } from '../types';
import { X, Save, ArrowRightLeft, BookOpen, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ExchangeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedBook: Book) => void;
  bookToExchange: Book | null;
  students: Student[];
}

export default function ExchangeForm({ isOpen, onClose, onSubmit, bookToExchange, students }: ExchangeFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    received_date: '',
    renew_date: '',
    remarks: ''
  });

  useEffect(() => {
    if (bookToExchange) {
      // Set today's date (rough Nepali format YYYY-MM-DD)
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      
      // Calculate renew date (+7 days)
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate() + 7;
      if (day > 30) { day -= 30; month += 1; }
      if (month > 12) { month = 1; year += 1; }
      const renewStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      setFormData({
        title: '',
        author: '',
        isbn: '',
        received_date: todayStr,
        renew_date: renewStr,
        remarks: `Exchanged from: ${bookToExchange.title} (${bookToExchange.isbn || 'No ISBN'})`
      });
    }
  }, [bookToExchange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookToExchange) return;

    const newHistoryEntry: ExchangeHistory = {
      old_title: bookToExchange.title,
      old_isbn: bookToExchange.isbn,
      exchange_date: formData.received_date || new Date().toISOString().split('T')[0]
    };

    const updatedBook: Book = {
      ...bookToExchange,
      title: formData.title || '',
      author: formData.author || '',
      isbn: formData.isbn || '',
      received_date: formData.received_date || '',
      renew_date: formData.renew_date || '',
      remarks: formData.remarks || '',
      history: [...(bookToExchange.history || []), newHistoryEntry]
    };

    onSubmit(updatedBook);
    onClose();
  };

  if (!isOpen || !bookToExchange) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold">Exchange Book</h2>
                <p className="text-blue-100 text-xs mt-0.5">Exchanging for: <span className="font-bold">{bookToExchange.borrowed_by}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Book Info (Read Only) */}
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Returning Old Book</div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-blue-900">{bookToExchange.title}</div>
                    <div className="text-xs text-blue-700">ISBN: {bookToExchange.isbn || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* History Section */}
              {bookToExchange.history && bookToExchange.history.length > 0 && (
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    <History className="w-3 h-3" />
                    Previous Books History
                  </div>
                  <div className="space-y-2">
                    {bookToExchange.history.map((h, i) => (
                      <div key={i} className="flex justify-between items-center text-xs border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">{h.old_title}</span>
                          <span className="text-[10px] text-gray-400">ISBN: {h.old_isbn || 'N/A'}</span>
                        </div>
                        <span className="text-gray-400 font-mono">{h.exchange_date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">New Book Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="Enter new book title"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">New Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">New ISBN Number</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="Enter ISBN"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Exchange Date (Nepali)</label>
                <input
                  type="text"
                  value={formData.received_date}
                  onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">New Renew Date (Nepali)</label>
                <input
                  type="text"
                  value={formData.renew_date}
                  onChange={(e) => setFormData({ ...formData, renew_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Borrowed By</label>
                <select
                  value={formData.borrowed_by}
                  onChange={(e) => setFormData({ ...formData, borrowed_by: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                >
                  <option value="">Select a student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Remarks / History</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 h-20 resize-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Complete Exchange
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
