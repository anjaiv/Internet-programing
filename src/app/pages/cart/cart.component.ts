import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <section class="section">
        <div class="container" style="max-width: 900px;">
          <h1>Shopping Cart</h1>

          @if (cartItems.length === 0) {
            <div style="text-align: center; padding: 60px 20px;">
              <p class="muted" style="font-size: 18px; margin-bottom: 24px;">
                Your cart is empty
              </p>
              <a routerLink="/" class="btn">Continue Shopping</a>
            </div>
          } @else {
            <div class="cart-items">
              @for (item of cartItems; track item.id) {
                <div class="cart-item">
                  <img [src]="item.image" [alt]="item.name" class="cart-item__image" />
                  <div class="cart-item__details">
                    <h3>{{ item.name }}</h3>
                    <p class="muted">{{ item.price }} den</p>
                  </div>
                  <div class="cart-item__quantity">
                    <button (click)="updateQuantity(item, -1)" class="btn btn--ghost">−</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="updateQuantity(item, 1)" class="btn btn--ghost">+</button>
                  </div>
                  <div class="cart-item__total">
                    <strong>{{ item.price * item.quantity }} den</strong>
                  </div>
                  <button (click)="removeItem(item)" class="btn btn--ghost">Remove</button>
                </div>
              }
            </div>

            <div class="cart-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <strong>{{ getSubtotal() }} den</strong>
              </div>
              <div class="summary-row">
                <span>Delivery:</span>
                <strong>{{ getDeliveryFee() === 0 ? 'FREE' : getDeliveryFee() + ' den' }}</strong>
              </div>
              @if (getSubtotal() < 2000) {
                <p class="muted" style="font-size: 14px; text-align: center; margin: 12px 0;">
                  Add {{ 2000 - getSubtotal() }} den more for free delivery!
                </p>
              }
              <div class="summary-row" style="border-top: 2px solid #ffc6dd; padding-top: 16px; margin-top: 16px;">
                <span><strong>Total:</strong></span>
                <strong style="font-size: 24px; color: #ff1493;">{{ getTotal() }} den</strong>
              </div>

              <button (click)="checkout()" class="btn" style="width: 100%; margin-top: 24px;">
                Proceed to Checkout
              </button>
            </div>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    .cart-items {
      margin-bottom: 32px;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      margin-bottom: 16px;
      border: 1px solid #ffc6dd;
    }
    .cart-item__image {
      width: 80px;
      height: 80px;
      object-fit: contain;
      background: white;
      border-radius: 8px;
    }
    .cart-item__details {
      flex: 1;
    }
    .cart-item__quantity {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cart-item__quantity button {
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cart-item__total {
      min-width: 100px;
      text-align: right;
    }
    .cart-summary {
      background: white;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #ffc6dd;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
  `]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getAll().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.toastService.show('Error loading cart');
      }
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }

    if (item.id) {
      this.cartService.update(item.id, { ...item, quantity: newQuantity }).subscribe({
        next: () => {
          this.loadCart();
        }
      });
    }
  }

  removeItem(item: CartItem): void {
    if (item.id) {
      this.cartService.delete(item.id).subscribe({
        next: () => {
          this.loadCart();
          this.toastService.show('Item removed');
        }
      });
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDeliveryFee(): number {
    return this.getSubtotal() >= 2000 ? 0 : 150;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getDeliveryFee();
  }

  checkout(): void {
    if (confirm('Confirm your order?')) {
      this.cartService.clear().subscribe({
        next: () => {
          this.toastService.show('Order placed successfully! ✨');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        }
      });
    }
  }
}
