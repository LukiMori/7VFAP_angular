import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  search = '';
  sort = 'name,asc';
  page = 0;
  totalPages = 0;
  size = 12;

  sortOptions = [
    { label: 'Název ↑', value: 'name,asc' },
    { label: 'Název ↓', value: 'name,desc' },
    { label: 'Cena ↑', value: 'price,asc' },
    { label: 'Cena ↓', value: 'price,desc' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;

    const params = new HttpParams()
      .set('search', this.search)
      .set('sort', this.sort)
      .set('page', this.page)
      .set('size', this.size);

    this.http.get<any>(environment.GET_PRODUCTS_URL, { params }).subscribe({
      next: (res) => {
        this.products = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Nepodařilo se načíst produkty.';
        this.loading = false;
      }
    });
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.page = 0;
    this.fetchProducts();
  }

  setPage(p: number): void {
    this.page = p;
    this.fetchProducts();
  }
}
