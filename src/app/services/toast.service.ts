import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  show(message: string): void {
    const id = this.nextId++;
    const toast: ToastMessage = { message, id };

    this.toasts.update(toasts => [...toasts, toast]);

    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, 1600);
  }
}
