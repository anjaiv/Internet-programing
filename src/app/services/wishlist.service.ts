import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WishlistItem } from '../models/wishlist-item.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/wishlist';

  // Signal for reactive wishlist count
  wishlistCount = signal<number>(0);

  getAll(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl).pipe(
      tap(items => this.wishlistCount.set(items.length))
    );
  }

  add(item: WishlistItem): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(this.apiUrl, item).pipe(
      tap(() => this.updateWishlistCount())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.updateWishlistCount())
    );
  }

  isInWishlist(productId: number): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}?productId=${productId}`);
  }

  private updateWishlistCount(): void {
    this.getAll().subscribe();
  }
}
