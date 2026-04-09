import React from 'react';
import { Book } from '../types';

interface PrintRecordProps {
  book: Book | null;
}

export const PrintRecord = React.forwardRef<HTMLDivElement, PrintRecordProps>(({ book }, ref) => {
  if (!book) return null;

  return (
    <div ref={ref} className="p-12 bg-white text-black font-serif">
      <div className="text-center border-b-2 border-black pb-8 mb-8">
        <h1 className="text-3xl font-bold uppercase mb-2">Vidushi Yogamaya Himalayan Ayurveda University</h1>
        <h2 className="text-xl">Sankhuwasabha, Khandbari</h2>
        <h3 className="text-lg mt-4 underline">Library Book Record</h3>
      </div>

      <div className="space-y-6 text-lg">
        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Book Title:</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.title}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Author:</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.author || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">ISBN:</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.isbn || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Received Date (Nepali):</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.received_date || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Renew Date (Nepali):</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.renew_date || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Borrowed By:</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.borrowed_by || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <span className="font-bold">Category:</span>
          <span className="col-span-2 border-b border-dotted border-black">{book.category || 'N/A'}</span>
        </div>

        <div className="mt-12">
          <span className="font-bold block mb-2">Remarks:</span>
          <div className="p-4 border border-black min-h-[100px]">
            {book.remarks || 'No additional remarks.'}
          </div>
        </div>

        {book.history && book.history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold uppercase border-b-2 border-black pb-2 mb-4">Exchange History</h3>
            <div className="space-y-4">
              {book.history.map((h, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 text-sm">
                  <span className="font-bold">Previous Book:</span>
                  <span className="col-span-2">{h.old_title} (ISBN: {h.old_isbn || 'N/A'})</span>
                  <span className="text-right font-mono italic">{h.exchange_date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-24 flex justify-between">
        <div className="text-center">
          <div className="w-48 border-t border-black pt-2">Librarian Signature</div>
        </div>
        <div className="text-center">
          <div className="w-48 border-t border-black pt-2">Date</div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm italic text-gray-500">
        Generated on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
});

PrintRecord.displayName = 'PrintRecord';
