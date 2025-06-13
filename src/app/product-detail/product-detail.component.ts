import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductDetailedInfo } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

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

  showSnack(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Zavřít', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  addToCart(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      this.showSnack('Pro tuto akci musíte být přihlášeni.', 'error');
      return;
    }
    if (this.product && this.product.quantityInStock <= 0) {
      this.showSnack('Produkt není skladem.', 'error');
      return;
    }

    this.http.post('http://localhost:8081/api/cart/add', {
      productId: this.product?.id,
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.showSnack('Produkt byl přidán do košíku.', 'success'),
      error: () => this.showSnack('Chyba při přidávání do košíku.', 'error')
    });
  }
}
