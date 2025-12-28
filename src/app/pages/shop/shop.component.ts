import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { OffersService } from '../../services/offers.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { ProductCardComponent, ProductDiscount } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private offersService = inject(OffersService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  allOffers: Offer[] = [];

  // Pagination
  currentPage = 1;
  productsPerPage = 12;
  totalPages = 0;

  // Filters
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedSkinTypes: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'recommended';

  // Filter options
  categories = ['Cleansers', 'Serums', 'Actives', 'Creams', 'SPF', 'Masks', 'Oils'];
  brands = ['The Ordinary', 'CeraVe', 'COSRX', "Paula's Choice"];
  skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'All'];

  ngOnInit(): void {
    this.loadProducts();
    this.loadOffers();

    // Handle URL parameters
    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.selectedBrands = [params['brand']];
        this.applyFilters();
      }
      if (params['category']) {
        this.selectedCategories = [params['category']];
        this.applyFilters();
      }
      if (params['search']) {
        // Search will be handled in filter logic
        this.applyFilters();
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.filteredProducts = [...products];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastService.show('Error loading products');
      }
    });
  }

  loadOffers(): void {
    this.offersService.getAll().subscribe({
      next: (offers) => {
        this.allOffers = offers;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
      }
    });
  }

  applyFilters(): void {
    const searchQuery = this.route.snapshot.queryParams['search']?.toLowerCase() || '';

    this.filteredProducts = this.allProducts.filter(product => {
      // Category filter
      if (this.selectedCategories.length > 0 && !this.selectedCategories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (this.selectedBrands.length > 0 && !this.selectedBrands.includes(product.brand)) {
        return false;
      }

      // Skin type filter
      if (this.selectedSkinTypes.length > 0) {
        const matchesSkinType = product.skinTypes.some(type => this.selectedSkinTypes.includes(type));
        if (!matchesSkinType) return false;
      }

      // Price filter
      if (this.minPrice !== null && product.price < this.minPrice) {
        return false;
      }
      if (this.maxPrice !== null && product.price > this.maxPrice) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const searchableText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
        if (!searchableText.includes(searchQuery)) {
          return false;
        }
      }

      return true;
    });

    this.sortProducts();
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.toastService.show('Filters applied ✓');
  }

  sortProducts(): void {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default: // recommended
        this.filteredProducts.sort((a, b) => {
          if (a.badge && !b.badge) return -1;
          if (!a.badge && b.badge) return 1;
          return b.rating - a.rating;
        });
    }
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedSkinTypes = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'recommended';
    this.filteredProducts = [...this.allProducts];
    this.currentPage = 1;
    this.toastService.show('Filters cleared');
  }

  getPaginatedProducts(): Product[] {
    const startIdx = (this.currentPage - 1) * this.productsPerPage;
    const endIdx = startIdx + this.productsPerPage;
    return this.filteredProducts.slice(startIdx, endIdx);
  }

  getProductDiscount(product: Product): ProductDiscount {
    const applicableOffer = this.allOffers.find(offer =>
      offer.discount > 0 && offer.categories.includes(product.category)
    );

    if (applicableOffer) {
      const discountedPrice = Math.round(product.price * (1 - applicableOffer.discount / 100));
      return {
        hasDiscount: true,
        discount: applicableOffer.discount,
        originalPrice: product.price,
        discountedPrice: discountedPrice
      };
    }

    return { hasDiscount: false };
  }

  onAddToCart(product: Product): void {
    const discount = this.getProductDiscount(product);
    const finalPrice = discount.hasDiscount ? discount.discountedPrice! : product.price;

    this.cartService.getAll().subscribe({
      next: (cartItems) => {
        const existingItem = cartItems.find(item => item.productId === product.id);

        if (existingItem && existingItem.id) {
          this.cartService.update(existingItem.id, {
            ...existingItem,
            quantity: existingItem.quantity + 1
          }).subscribe(() => {
            this.toastService.show('Added to cart ✓');
          });
        } else {
          this.cartService.add({
            productId: product.id,
            name: product.name,
            price: finalPrice,
            image: product.image,
            quantity: 1
          }).subscribe(() => {
            this.toastService.show('Added to cart ✓');
          });
        }
      }
    });
  }

  onAddToWishlist(product: Product): void {
    this.wishlistService.getAll().subscribe({
      next: (wishlistItems) => {
        const existingItem = wishlistItems.find(item => item.productId === product.id);

        if (existingItem) {
          this.toastService.show('Already in wishlist');
          return;
        }

        this.wishlistService.add({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand
        }).subscribe(() => {
          this.toastService.show('Added to wishlist ♥');
        });
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        pages.push(i);
      }
    }
    return pages;
  }

  onCategoryChange(category: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
  }

  onBrandChange(brand: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
  }

  onSkinTypeChange(skinType: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedSkinTypes.push(skinType);
    } else {
      this.selectedSkinTypes = this.selectedSkinTypes.filter(s => s !== skinType);
    }
  }

  // Expose Math to template
  Math = Math;
}
