/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Book, NewBook } from './types';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import { PrintRecord } from './components/PrintRecord';
import LoginForm from './components/LoginForm';
import { Plus, Library, GraduationCap, HeartPulse, LogOut } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'motion/react';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [printingBook, setPrintingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('university_books');
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (error) {
        console.error('Error parsing saved books:', error);
      }
    }
    
    const savedUser = localStorage.getItem('library_user');
    if (savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('university_books', JSON.stringify(books));
    }
  }, [books, isLoading]);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('library_user', username);
  };

  const handleLogout = () => {
    if (!confirm('Are you sure you want to logout?')) return;
    setUser(null);
    localStorage.removeItem('library_user');
  };

  const handleSubmit = (bookData: NewBook | Book) => {
    const isEditing = 'id' in bookData;
    
    if (isEditing) {
      setBooks(prev => prev.map(b => b.id === (bookData as Book).id ? (bookData as Book) : b));
    } else {
      const newBook: Book = {
        ...bookData,
        id: Date.now(), // Unique ID using timestamp
        created_at: new Date().toISOString()
      };
      setBooks(prev => [newBook, ...prev]);
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleRenew = (book: Book) => {
    if (!book.renew_date) return;
    
    // Simple Nepali date addition logic (YYYY-MM-DD)
    const parts = book.renew_date.split('-');
    if (parts.length !== 3) return;

    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let day = parseInt(parts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return;

    day += 7;

    // Rough Nepali month overflow logic (assuming 30-32 days)
    // Most Nepali months have 30, 31, or 32 days. 30 is a safe average for simple addition.
    if (day > 30) {
      day -= 30;
      month += 1;
    }

    if (month > 12) {
      month = 1;
      year += 1;
    }

    const newRenewDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, renew_date: newRenewDate } : b));
  };

  const onPrintRequest = (book: Book) => {
    setPrintingBook(book);
    // Small delay to ensure state is updated before printing
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  if (!user && !isLoading) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-red rounded-xl text-white shadow-lg shadow-brand-red/20">
                <Library className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-brand-ink leading-tight">
                  Vidushi Yogamaya Himalayan Ayurveda University
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <GraduationCap className="w-4 h-4" />
                  <span>Sankhuwasabha, Khandbari</span>
                  <span className="mx-1">•</span>
                  <HeartPulse className="w-4 h-4 text-brand-red" />
                  <span>Library Management System</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="p-3.5 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setEditingBook(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 px-7 py-3.5 bg-brand-red text-white rounded-xl font-bold shadow-xl shadow-brand-red/20 hover:bg-brand-red/90 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add New Book
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full no-print">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-ayurveda-olive/20 border-t-ayurveda-olive rounded-full animate-spin" />
            <p className="text-ayurveda-olive/60 font-medium italic">Loading library records...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookList
              books={books}
              onEdit={(book) => {
                setEditingBook(book);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onPrint={onPrintRequest}
              onRenew={handleRenew}
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-red/5 text-brand-red mb-6"
          >
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Made with Love</span>
          </motion.div>
          
          <div className="space-y-4">
            <p className="text-gray-600 font-medium text-lg">
              Developed with dedication by <span className="text-brand-red font-bold">Suraj Basnet</span>
            </p>
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <div className="h-px w-8 bg-gray-200" />
              <p className="font-serif italic text-xl text-gray-500">
                Specially for my beloved wife, <span className="text-brand-red font-bold not-italic">Pratima</span>
              </p>
              <div className="h-px w-8 bg-gray-200" />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50">
            <p className="text-xs text-gray-400 uppercase tracking-tighter">
              © {new Date().getFullYear()} Vidushi Yogamaya Himalayan Ayurveda University
            </p>
          </div>
        </div>
      </footer>

      {/* Hidden Print Component */}
      <div className="hidden">
        <PrintRecord ref={printRef} book={printingBook} />
      </div>

      {/* Form Modal */}
      <BookForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        editingBook={editingBook}
      />
    </div>
  );
}

