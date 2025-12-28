import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { ToastService } from '../../services/toast.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main>
      <section class="section">
        <div class="container" style="max-width: 900px;">
          <h1>My Notes</h1>

          <!-- Note Form -->
          <div class="card" style="margin-bottom: 32px;">
            <form (submit)="saveNote($event)">
              <h3>{{ currentEditId ? 'Edit Note' : 'New Note' }}</h3>

              <div style="margin-bottom: 16px;">
                <label>
                  <strong>Title</strong>
                  <input type="text" [(ngModel)]="noteForm.title" name="title" required style="width: 100%; margin-top: 8px;" />
                </label>
              </div>

              <div style="margin-bottom: 16px;">
                <label>
                  <strong>Note</strong>
                  <textarea [(ngModel)]="noteForm.body" name="body" required rows="4" style="width: 100%; margin-top: 8px;"></textarea>
                </label>
              </div>

              <div style="margin-bottom: 16px;">
                <label>
                  <strong>Tag</strong>
                  <select [(ngModel)]="noteForm.tag" name="tag" required style="width: 100%; margin-top: 8px;">
                    <option value="">Select a tag</option>
                    <option value="Routine">Routine</option>
                    <option value="Product">Product</option>
                    <option value="Skin">Skin Condition</option>
                    <option value="Review">Review</option>
                    <option value="Goal">Goal</option>
                  </select>
                </label>
              </div>

              <div style="display: flex; gap: 12px;">
                <button type="submit" class="btn">
                  {{ currentEditId ? 'Update Note' : 'Save Note' }}
                </button>
                @if (currentEditId) {
                  <button type="button" class="btn btn--ghost" (click)="cancelEdit()">
                    Cancel
                  </button>
                }
              </div>
            </form>
          </div>

          <!-- Notes List -->
          @if (notes.length === 0) {
            <p class="muted" style="text-align: center; padding: 40px;">
              No notes yet. Create your first note above!
            </p>
          } @else {
            <div style="display: grid; gap: 16px;">
              @for (note of notes; track note.id) {
                <div class="card">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                      <h3 style="margin-bottom: 4px;">{{ note.title }}</h3>
                      <span class="badge">{{ note.tag }}</span>
                      <span class="muted" style="margin-left: 12px; font-size: 14px;">{{ note.date }}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn btn--ghost" (click)="editNote(note)">Edit</button>
                      <button class="btn btn--ghost" (click)="deleteNote(note)">Delete</button>
                    </div>
                  </div>
                  <p style="white-space: pre-wrap;">{{ note.body }}</p>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </main>
  `
})
export class NotesComponent implements OnInit {
  private notesService = inject(NotesService);
  private toastService = inject(ToastService);

  notes: Note[] = [];
  currentEditId: number | null = null;

  noteForm = {
    title: '',
    body: '',
    tag: '',
    date: ''
  };

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notesService.getAll().subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.toastService.show('Error loading notes');
      }
    });
  }

  saveNote(event: Event): void {
    event.preventDefault();

    const noteData: Note = {
      title: this.noteForm.title,
      body: this.noteForm.body,
      tag: this.noteForm.tag,
      date: new Date().toISOString().slice(0, 10)
    };

    if (this.currentEditId) {
      this.notesService.update(this.currentEditId, { ...noteData, id: this.currentEditId }).subscribe({
        next: () => {
          this.loadNotes();
          this.resetForm();
          this.toastService.show('Note updated ✓');
        }
      });
    } else {
      this.notesService.create(noteData).subscribe({
        next: () => {
          this.loadNotes();
          this.resetForm();
          this.toastService.show('Note saved ✓');
        }
      });
    }
  }

  editNote(note: Note): void {
    this.currentEditId = note.id!;
    this.noteForm = {
      title: note.title,
      body: note.body,
      tag: note.tag,
      date: note.date
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteNote(note: Note): void {
    if (confirm('Delete this note?')) {
      this.notesService.delete(note.id!).subscribe({
        next: () => {
          this.loadNotes();
          this.toastService.show('Note deleted 🗑️');
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentEditId = null;
    this.noteForm = {
      title: '',
      body: '',
      tag: '',
      date: ''
    };
  }
}
