import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/brands';

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }
}
