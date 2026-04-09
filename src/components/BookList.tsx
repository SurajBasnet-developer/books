import React, { useState } from 'react';
import { Book } from '../types';
import { Search, Download, Printer, Edit2, Trash2, Book as BookIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onPrint: (book: Book) => void;
}

export default function BookList({ books, onEdit, onDelete, onPrint }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.borrowed_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(books.map(b => ({
      'Title': b.title,
      'Author': b.author,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors, students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 bg-gray-50"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-red/90 transition-all w-full md:w-auto justify-center shadow-lg shadow-brand-red/10"
        >
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
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
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex gap-2"><span className="text-gray-400">Rec:</span> <span className="font-medium">{book.received_date || '-'}</span></div>
                      <div className="flex gap-2"><span className="text-gray-400">Ren:</span> <span className="font-medium text-brand-red">{book.renew_date || '-'}</span></div>
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
