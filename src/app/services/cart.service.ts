import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cart';

  // Signal for reactive cart count
  cartCount = signal<number>(0);

  getAll(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(
      tap(items => this.cartCount.set(items.length))
    );
  }

  add(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, item).pipe(
      tap(() => this.updateCartCount())
    );
  }

  update(id: number, item: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.updateCartCount())
    );
  }

  clear(): Observable<void[]> {
    return this.getAll().pipe(
      tap(items => {
        items.forEach(item => {
          if (item.id) this.delete(item.id).subscribe();
        });
        this.cartCount.set(0);
      })
    ) as any;
  }

  private updateCartCount(): void {
    this.getAll().subscribe();
  }
}
