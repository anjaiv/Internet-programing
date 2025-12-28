import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div class="toast toast--show">
        {{ toast.message }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%) translateY(10px);
      background: #ff69b4;
      color: #fff;
      padding: 10px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(255,105,180,.3);
    }
    .toast--show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
