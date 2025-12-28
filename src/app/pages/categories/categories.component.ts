import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main>
      <section class="section">
        <div class="container">
          <h1>Shop by Category</h1>
          <p class="muted" style="text-align: center; margin-bottom: 40px;">
            Explore our range of skincare products
          </p>

          <div class="grid grid--categories">
            @for (category of categories; track category.id) {
              <div class="card card--category" (click)="navigateToCategory(category.name)" style="cursor: pointer;">
                <img [src]="category.image" [alt]="category.name" class="category-image" />
                <h3>{{ category.name }}</h3>
                <p class="muted">{{ category.description }}</p>
                <p style="font-size: 14px; color: #ff1493; margin-top: 12px;">
                  {{ category.productCount }} products →
                </p>
              </div>
            }
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .grid--categories {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
    .card--category {
      text-align: center;
      transition: transform 0.2s;
    }
    .card--category:hover {
      transform: translateY(-4px);
    }
    .category-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 16px;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  categories: Category[] = [];

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  navigateToCategory(categoryName: string): void {
    this.router.navigate(['/'], { queryParams: { category: categoryName } });
  }
}
