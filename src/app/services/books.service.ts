import { inject, Injectable, EventEmitter } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private _books: Book[] = [];
  private _initialized = false;
  private _booksChangedEventEmitter: EventEmitter<Book[]> = new EventEmitter();

  get onBooksChanged() {
    return this._booksChangedEventEmitter.asObservable();
  }

  private async ensureInitialized() {
    if (this._initialized) return;
    try {
      this._books = await lastValueFrom(this.http.get<Book[]>('assets/books.json'));
    } finally {
      this._initialized = true;
    }
  }

  async addBook(book: Book): Promise<void> {
    await this.ensureInitialized();

    this._books.push(book);

    this._booksChangedEventEmitter.next([...this._books]);
  }

  async getById(id: string): Promise<Book | null> {
    await this.ensureInitialized();
    for (let book of this._books) {
      if (book.id == id) return book;
    }
    return null;
  }

  async getAll(): Promise<Book[]> {
    await this.ensureInitialized();
    return [...this._books];
  }
}
