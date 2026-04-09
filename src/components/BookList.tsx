import React, { useState } from 'react';
import { Book } from '../types';
import { Search, Download, Printer, Edit2, Trash2, Book as BookIcon, RefreshCw, BarChart3, Users, AlertCircle, Upload, FileJson } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onPrint: (book: Book) => void;
  onRenew: (book: Book) => void;
}

export default function BookList({ books, onEdit, onDelete, onPrint, onRenew }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.borrowed_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalBooks = books.length;
  const borrowedBooks = books.filter(b => b.borrowed_by && b.borrowed_by.trim() !== '').length;
  
  // Simple overdue check (comparing string YYYY-MM-DD)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  // Note: This is a rough check for Nepali dates if they follow YYYY-MM-DD
  const overdueBooks = books.filter(b => b.renew_date && b.renew_date < todayStr).length;

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(books.map(b => ({
      'Title': b.title,
      'Author': b.author,
      'ISBN': b.isbn,
      'Received Date': b.received_date,
      'Renew Date': b.renew_date,
      'Category': b.category,
      'Borrowed By': b.borrowed_by,
      'Remarks': b.remarks,
      'Created At': b.created_at
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");
    XLSX.writeFile(workbook, "University_Book_Records.xlsx");
  };

  const exportBackup = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `library_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (Array.isArray(importedData)) {
          if (confirm(`Are you sure you want to import ${importedData.length} records? This will replace your current data.`)) {
            localStorage.setItem('university_books', content);
            window.location.reload();
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-red/5 flex items-center justify-center text-brand-red">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Collection</div>
            <div className="text-3xl font-serif font-bold text-brand-ink">{totalBooks}</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Currently Borrowed</div>
            <div className="text-3xl font-serif font-bold text-brand-ink">{borrowedBooks}</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Overdue Records</div>
            <div className="text-3xl font-serif font-bold text-brand-ink">{overdueBooks}</div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors, students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 bg-gray-50"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={importBackup} 
            accept=".json" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm border border-gray-200"
            title="Import Data Backup"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={exportBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm border border-gray-200"
            title="Download Data Backup"
          >
            <FileJson className="w-4 h-4" />
            Backup
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10"
          >
            <Download className="w-5 h-5" />
            Excel Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-serif text-base font-bold text-brand-ink">Book Details</th>
                <th className="px-6 py-4 font-serif text-base font-bold text-brand-ink">Dates (Nepali)</th>
                <th className="px-6 py-4 font-serif text-base font-bold text-brand-ink">Borrowed By</th>
                <th className="px-6 py-4 font-serif text-base font-bold text-brand-ink">Category</th>
                <th className="px-6 py-4 font-serif text-base font-bold text-brand-ink text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBooks.map((book, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={book.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-red/5 flex items-center justify-center text-brand-red">
                        <BookIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-brand-ink">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author || 'Unknown Author'}</div>
                        {book.isbn && <div className="text-[10px] text-brand-red/60 font-mono mt-0.5">ISBN: {book.isbn}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex gap-2"><span className="text-gray-400">Rec:</span> <span className="font-medium">{book.received_date || '-'}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Ren:</span> 
                        <span className={cn(
                          "font-medium",
                          book.renew_date && book.renew_date < todayStr ? "text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded animate-pulse" : "text-brand-red"
                        )}>
                          {book.renew_date || '-'}
                        </span>
                        {book.renew_date && (
                          <button
                            onClick={() => onRenew(book)}
                            className="p-1 text-brand-red hover:bg-brand-red/10 rounded-md transition-all"
                            title="Renew (+7 Days)"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-brand-ink">{book.borrowed_by || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                      {book.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onPrint(book)}
                        className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
                        title="Print Record"
                      >
                        <Printer className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    No book records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
