import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- TOP BAR -->
    <div class="topbar">
      <div class="container topbar__inner">
        <div class="topbar__left">
          <span class="topbar__item">Free delivery over 2000 den</span>
          <span class="topbar__sep">•</span>
          <span class="topbar__item">Support: +389 XX XXX XXX</span>
        </div>
        <div class="topbar__right">
          <a class="topbar__link" href="#stores">Stores</a>
          <a class="topbar__link" href="#faq">FAQ</a>
          <a class="topbar__link" href="#account">My Account</a>
        </div>
      </div>
    </div>

    <!-- HEADER -->
    <header class="header">
      <div class="container header__inner">
        <a class="logo" routerLink="/">
          <span class="logo__mark">C</span>
          <span class="logo__text">SkinCare Helper</span>
        </a>

        <form class="search" (submit)="onSearch($event)" role="search">
          <label class="sr-only" for="q">Search</label>
          <input
            id="q"
            name="q"
            type="search"
            [(ngModel)]="searchQuery"
            placeholder="Search products, routines, ingredients..."
          />
          <button type="submit">Search</button>
        </form>

        <nav class="header__actions" aria-label="Quick actions">
          <a routerLink="/wishlist">Wishlist ({{ wishlistService.wishlistCount() }})</a>
          <a routerLink="/cart">Cart ({{ cartService.cartCount() }})</a>
        </nav>
      </div>

      <!-- MAIN NAV -->
      <nav class="nav" aria-label="Main navigation">
        <div class="container nav__inner">
          <a class="nav__link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Shop</a>
          <a class="nav__link" routerLink="/categories" routerLinkActive="active">Categories</a>
          <a class="nav__link" routerLink="/brands" routerLinkActive="active">Brands</a>
          <a class="nav__link" routerLink="/routine-builder" routerLinkActive="active">Routine Builder</a>
          <a class="nav__link" routerLink="/notes" routerLinkActive="active">Notes</a>
          <a class="nav__link" routerLink="/offers" routerLinkActive="active">Offers</a>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  searchQuery = '';

  ngOnInit(): void {
    // Load initial counts
    this.cartService.getAll().subscribe();
    this.wishlistService.getAll().subscribe();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/'], { queryParams: { search: this.searchQuery.trim() } });
    }
  }
}
