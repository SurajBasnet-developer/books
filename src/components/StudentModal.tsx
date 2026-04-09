import React, { useState } from 'react';
import { Book, Student } from '../types';
import { X, UserPlus, Trash2, Users, Edit2, Save, History, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  books: Book[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: number) => void;
}

export default function StudentModal({ isOpen, onClose, students, books, onAddStudent, onUpdateStudent, onDeleteStudent }: StudentModalProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingHistory, setViewingHistory] = useState<Student | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, name, student_id: studentId, department });
      setEditingStudent(null);
    } else {
      onAddStudent({ name, student_id: studentId, department });
    }

    setName('');
    setStudentId('');
    setDepartment('');
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setStudentId(student.student_id || '');
    setDepartment(student.department || '');
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setName('');
    setStudentId('');
    setDepartment('');
  };

  if (!isOpen) return null;

  const studentBooks = viewingHistory 
    ? books.filter(b => b.borrowed_by === viewingHistory.name)
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-white/20"
        >
          <div className="bg-brand-red px-8 py-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              {viewingHistory ? (
                <button 
                  onClick={() => setViewingHistory(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              ) : (
                <Users className="w-6 h-6" />
              )}
              <div>
                <h2 className="text-xl font-serif font-bold">
                  {viewingHistory ? `History: ${viewingHistory.name}` : 'Manage Students'}
                </h2>
                {viewingHistory && (
                  <p className="text-white/70 text-xs">{viewingHistory.department} • {viewingHistory.student_id}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            {viewingHistory ? (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                {studentBooks.length > 0 ? (
                  <div className="space-y-8">
                    {studentBooks.map((book) => (
                      <div key={book.id} className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="p-2 bg-blue-600 text-white rounded-lg">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-blue-900">{book.title}</div>
                            <div className="text-xs text-blue-700">Currently Borrowed • Received: {book.received_date}</div>
                          </div>
                        </div>

                        {book.history && book.history.length > 0 && (
                          <div className="ml-8 space-y-3 border-l-2 border-gray-100 pl-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Previous Exchanges</div>
                            {book.history.map((h, i) => (
                              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                  <div className="text-sm font-medium text-gray-700">{h.old_title}</div>
                                  <div className="text-[10px] text-gray-400">ISBN: {h.old_isbn || 'N/A'}</div>
                                </div>
                                <div className="text-[10px] font-mono text-gray-400">{h.exchange_date}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 italic">
                    No borrowing history found for this student.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add/Edit Student Form */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Student Full Name</label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Student ID (Optional)</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                        placeholder="Enter ID"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                        placeholder="e.g. Ayurveda"
                      />
                    </div>
                    <div className="flex gap-2">
                      {editingStudent && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className={cn(
                          "flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2",
                          editingStudent ? "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700" : "bg-brand-red shadow-brand-red/20 hover:bg-brand-red/90"
                        )}
                      >
                        {editingStudent ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        {editingStudent ? 'Update Student' : 'Add Student'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Student List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Student List ({students.length})</h3>
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div>
                          <div className="font-bold text-brand-ink text-sm">{student.name}</div>
                          <div className="text-[10px] text-gray-400">{student.department || 'No Dept'} • {student.student_id || 'No ID'}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingHistory(student)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Borrowing History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <div className="text-center py-12 text-gray-400 italic text-sm">
                        No students added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
