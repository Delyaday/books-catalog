import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/books.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';

@Component({
  selector: 'book-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, FormsModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit, OnDestroy {
  private _booksService = inject(BookService);

  private _booksChangedSubscription!: Subscription;

  private _internalSearchString = signal('');
  private _searchTimer: any;

  books = signal<Book[]>([]);

  searchString = model<string>('');

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    let loadedBooks = await this._booksService.getAll();

    this.books.set(loadedBooks);

    this._booksChangedSubscription = this._booksService.onBooksChanged.subscribe((updatedBooks) => {
      this.books.set(updatedBooks);
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddBookModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._booksService.addBook(result);
      }
    });
  }

  filteredBooks = computed(() => {
    if (!this._internalSearchString()) return this.books();

    let searchString = this._internalSearchString().toLowerCase();

    return this.books().filter(
      (book) =>
        book.title.toLowerCase().includes(searchString) ||
        book.author.toLowerCase().includes(searchString)
    );
  });

  changeSearchString(event: Event) {
    this.searchString.set((event.target as HTMLInputElement)?.value);

    if (this._searchTimer) clearTimeout(this._searchTimer);

    let newSearchString = this.searchString();

    this._searchTimer = setTimeout(() => {
      if (this._internalSearchString() != newSearchString)
        this._internalSearchString.set(newSearchString);
    }, 800);
  }

  viewDetails(book: Book) {
    console.log('View details for', book);
  }

  ngOnDestroy() {
    this._booksChangedSubscription.unsubscribe();
  }
}
