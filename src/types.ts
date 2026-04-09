export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  received_date: string;
  renew_date: string;
  category: string;
  borrowed_by: string;
  remarks: string;
  created_at: string;
}

export type NewBook = Omit<Book, 'id' | 'created_at'>;
