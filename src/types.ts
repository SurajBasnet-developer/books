export interface ExchangeHistory {
  old_title: string;
  old_isbn: string;
  exchange_date: string;
}

export interface Student {
  id: number;
  name: string;
  student_id?: string;
  department?: string;
}

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
  history?: ExchangeHistory[];
}

export type NewBook = Omit<Book, 'id' | 'created_at'>;
