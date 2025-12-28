import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

export interface ProductDiscount {
  hasDiscount: boolean;
  discount?: number;
  originalPrice?: number;
  discountedPrice?: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="card card--product">
      <div class="card__media">
        <img
          [src]="product.image"
          [alt]="product.name"
          style="width: 100%; height: 200px; object-fit: contain; background: white;"
        />
      </div>
      <div class="card__body">
        <p *ngIf="product.badge"
           [class]="'badge ' + getBadgeClass(product.badge)">
          {{ product.badge }}
        </p>
        <p *ngIf="discount?.hasDiscount" class="badge badge--deal">
          -{{ discount!.discount }}%
        </p>

        <h3 class="product__title">{{ product.name }}</h3>
        <p class="muted">{{ product.brand }}</p>
        <p class="muted" style="font-size: 12px; margin-top: 4px;">
          {{ product.skinTypes.join(', ') }}
        </p>

        <div class="product__meta">
          <div *ngIf="discount?.hasDiscount; else normalPrice"
               style="display: flex; flex-direction: column; gap: 4px;">
            <span class="price" style="color: #ff1493; font-weight: bold;">
              {{ discount!.discountedPrice }} den
            </span>
            <span style="text-decoration: line-through; color: #999; font-size: 14px;">
              {{ discount!.originalPrice }} den
            </span>
          </div>
          <ng-template #normalPrice>
            <span class="price">{{ product.price }} den</span>
          </ng-template>

          <span class="rating">{{ getStars() }}</span>
        </div>

        <div class="product__actions">
          <button class="btn btn--ghost" type="button" (click)="addToCart.emit()">
            Add to Cart
          </button>
          <button class="btn btn--ghost" type="button" (click)="addToWishlist.emit()">
            ♥
          </button>
        </div>
      </div>
    </article>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() discount: ProductDiscount | null = null;
  @Output() addToCart = new EventEmitter<void>();
  @Output() addToWishlist = new EventEmitter<void>();

  getStars(): string {
    return '★'.repeat(this.product.rating) + '☆'.repeat(5 - this.product.rating);
  }

  getBadgeClass(badge: string): string {
    if (badge.includes('New')) return 'badge--soft';
    if (badge.includes('%') || badge.includes('Deal')) return 'badge--deal';
    return '';
  }
}
