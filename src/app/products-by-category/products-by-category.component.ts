import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './products-by-category.component.html',
  styleUrls: []
})
export class ProductsByCategoryComponent implements OnInit {
  categoryId: string | null = null;
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  categoryName = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.categoryId = paramMap.get('categoryId');
      if (this.categoryId) {
        this.loadCategoryAndProducts();
      }
    });
  }

  loadCategoryAndProducts(): void {
    this.loading = true;
    this.error = null;
    this.products = [];

    // Load category name
    this.http.get<any>(`${environment.GET_CATEGORY_URL}/${this.categoryId}`).subscribe({
      next: (res) => {
        this.categoryName = res.name;
      },
      error: (err) => {
        console.error('Nepodařilo se načíst název kategorie', err);
        this.categoryName = 'Neznámá kategorie';
      }
    });

    // Load products in category
    this.http.get<Product[]>(`${environment.GET_PRODUCTS_BY_CATEGORY_URL}/${this.categoryId}`).subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nepodařilo se načíst produkty pro tuto kategorii.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
