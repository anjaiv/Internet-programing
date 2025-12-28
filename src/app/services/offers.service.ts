import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/offers';

  getAll(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }
}
