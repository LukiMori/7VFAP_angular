import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductDetailedInfo } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: ProductDetailedInfo | null = null;
  loading = true;
  error = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    if (!this.productId) return;

    this.http.get<ProductDetailedInfo>(`${environment.GET_PRODUCTS_URL}/${this.productId}`).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Produkt se nepodařilo načíst.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      alert('Pro tuto akci musíte být přihlášeni.');
      return;
    }
    if (this.product && this.product.quantityInStock <= 0) {
      alert('Produkt není skladem.');
      return;
    }

    this.http.post('http://localhost:8081/api/cart/add', {
      productId: this.product?.id,
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => alert('Produkt byl přidán do košíku'),
      error: () => alert('Chyba při přidávání do košíku')
    });
  }
}
