import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../../services/books.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'add-book-dialog',
  templateUrl: './add-book-modal.component.html',
  styleUrl: './add-book-modal.component.scss',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBookModalComponent {
  private _dialogRef = inject(MatDialogRef<AddBookModalComponent>);
  private _booksService = inject(BookService);
  private _addForm = inject(FormBuilder);

  form = this._addForm.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    cover: [''],
    description: [''],
  });

  submit() {
    if (!this.form.valid) return;

    const book = this.form.value as any;

    this._booksService.addBook(book);
    this._dialogRef.close(book);
  }
}
