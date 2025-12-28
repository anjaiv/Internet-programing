import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main>
      <section class="section">
        <div class="container">
          <h1>Shop by Brand</h1>
          <p class="muted" style="text-align: center; margin-bottom: 40px;">
            Discover products from your favorite skincare brands
          </p>

          <div class="grid grid--brands" style="max-width: 900px; margin: 0 auto;">
            @for (brand of brands; track brand.id) {
              <div class="card" style="text-align: center; padding: 32px 24px;">
                <h3 style="font-size: 24px; margin-bottom: 8px;">{{ brand.name }}</h3>
                <p class="muted">{{ brand.description }}</p>
                <button (click)="navigateToBrand(brand.name)" class="btn" style="margin-top: 16px;">
                  Shop {{ brand.name }}
                </button>
              </div>
            }
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .grid--brands {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
  `]
})
export class BrandsComponent implements OnInit {
  private brandsService = inject(BrandsService);
  private router = inject(Router);

  brands: Brand[] = [];

  ngOnInit(): void {
    this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }

  navigateToBrand(brandName: string): void {
    this.router.navigate(['/'], { queryParams: { brand: brandName } });
  }
}
