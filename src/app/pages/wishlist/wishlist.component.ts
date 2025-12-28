import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { WishlistItem } from '../../models/wishlist-item.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <section class="section">
        <div class="container">
          <h1>My Wishlist</h1>

          @if (wishlistItems.length === 0) {
            <div style="text-align: center; padding: 60px 20px;">
              <p class="muted" style="font-size: 18px; margin-bottom: 24px;">
                Your wishlist is empty
              </p>
              <a routerLink="/" class="btn">Browse Products</a>
            </div>
          } @else {
            <div class="grid grid--products">
              @for (item of wishlistItems; track item.id) {
                <article class="card card--product">
                  <div class="card__media">
                    <img [src]="item.image" [alt]="item.name" style="width: 100%; height: 200px; object-fit: contain; background: white;" />
                  </div>
                  <div class="card__body">
                    <h3 class="product__title">{{ item.name }}</h3>
                    <p class="muted">{{ item.brand }}</p>
                    <div class="product__meta">
                      <span class="price">{{ item.price }} den</span>
                    </div>
                    <div class="product__actions">
                      <button class="btn btn--ghost" (click)="moveToCart(item)">Add to Cart</button>
                      <button class="btn btn--ghost" (click)="removeItem(item)">Remove</button>
                    </div>
                  </div>
                </article>
              }
            </div>
          }
        </div>
      </section>
    </main>
  `
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  wishlistItems: WishlistItem[] = [];

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getAll().subscribe({
      next: (items) => {
        this.wishlistItems = items;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.toastService.show('Error loading wishlist');
      }
    });
  }

  moveToCart(item: WishlistItem): void {
    this.cartService.add({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    }).subscribe({
      next: () => {
        this.toastService.show('Added to cart ✓');
      }
    });
  }

  removeItem(item: WishlistItem): void {
    if (item.id) {
      this.wishlistService.delete(item.id).subscribe({
        next: () => {
          this.loadWishlist();
          this.toastService.show('Removed from wishlist');
        }
      });
    }
  }
}
