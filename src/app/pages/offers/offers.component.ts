import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OffersService } from '../../services/offers.service';
import { Offer } from '../../models/offer.model';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <!-- Hero Banner -->
      <section class="hero hero--offers">
        <div class="container">
          <h1 style="font-size: 48px; margin-bottom: 16px;">Special Offers</h1>
          <p style="font-size: 20px; opacity: 0.9;">Save big on your favorite skincare products</p>
        </div>
      </section>

      <!-- Offers Grid -->
      <section class="section">
        <div class="container">
          <div class="grid grid--offers">
            @for (offer of offers; track offer.id) {
              <article class="offer-card">
                <div class="offer-image-wrapper">
                  <img [src]="offer.image" [alt]="offer.title" class="offer-image" />
                  @if (offer.discount > 0) {
                    <div class="discount-badge">-{{ offer.discount }}%</div>
                  }
                </div>
                <div class="offer-content">
                  <h3>{{ offer.title }}</h3>
                  <p class="muted">{{ offer.description }}</p>
                  <p style="font-size: 14px; color: #999; margin-top: 8px;">
                    Valid until {{ offer.validUntil }}
                  </p>
                  <a routerLink="/" class="btn" style="margin-top: 16px;">
                    Shop Now
                  </a>
                </div>
              </article>
            }
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .hero--offers {
      background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }
    .grid--offers {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 32px;
    }
    .offer-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .offer-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 30px rgba(255,105,180,0.3);
    }
    .offer-image-wrapper {
      position: relative;
      overflow: hidden;
    }
    .offer-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .offer-card:hover .offer-image {
      transform: scale(1.05);
    }
    .discount-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #ff1493;
      color: white;
      padding: 8px 16px;
      border-radius: 999px;
      font-weight: bold;
      font-size: 18px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .offer-content {
      padding: 24px;
    }
  `]
})
export class OffersComponent implements OnInit {
  private offersService = inject(OffersService);

  offers: Offer[] = [];

  ngOnInit(): void {
    this.offersService.getAll().subscribe({
      next: (offers) => {
        this.offers = offers;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
      }
    });
  }
}
