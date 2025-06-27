import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../shared/interfaces';
import { environment } from '../../environments/environment';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    PaginatorModule,
    ProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrls: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalRecords = 0;
  loading = false;

  search = '';
  sortField = 'name';
  sortOrder: number = 1;
  page = 0;
  size = 12;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts({first: 0, rows: this.size});
  }

  loadProducts(event: TableLazyLoadEvent): void {
    this.loading = true;

    const page = Math.floor((event.first ?? 0) / (event.rows ?? 12));
    const size = event.rows ?? 12;
    const sortField = event.sortField ?? this.sortField;
    const sortOrder = event.sortOrder ?? this.sortOrder;
    const sort = `${sortField},${sortOrder === -1 ? 'desc' : 'asc'}`;

    const params = new HttpParams()
      .set('search', this.search)
      .set('sort', sort)
      .set('page', page)
      .set('size', size);

    this.http.get<any>(environment.GET_PRODUCTS_URL, { params }).subscribe({
      next: (res) => {
        this.products = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.loadProducts({first: 0, rows: this.size});
  }
}
