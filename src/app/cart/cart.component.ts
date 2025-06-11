import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartItem, StockCheckResponse } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrls: []
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      this.error = 'Musíte být přihlášeni.';
      this.loading = false;
      return;
    }

    this.http.get<CartItem[]>(environment.GET_CART_URL, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.cartItems = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nepodařilo se načíst košík.';
        this.loading = false;
      }
    });
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  handleCartItemChange(updatedItem: CartItem | null, removedItemId: number | null): void {
    if (updatedItem) {
      this.cartItems = this.cartItems.map((item) =>
        item.productId === updatedItem.productId ? updatedItem : item
      );
    }

    if (removedItemId !== null) {
      this.cartItems = this.cartItems.filter((item) => item.productId !== removedItemId);
    }

    this.loadCart();
  }

  verifyAvailability(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      alert('Musíte být přihlášeni.');
      return;
    }

    const cartRequestBody = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    this.http.post<StockCheckResponse[]>(environment.CHECK_CART_AVAILABILITY_URL, cartRequestBody, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        const anyUnavailable = res.some(item => item.available < item.requested);
        if (!anyUnavailable) {
          this.router.navigate(['/checkout']);
        } else {
          alert('Košík je neplatný. Některé produkty nejsou dostupné.');
        }
      },
      error: () => {
        alert('Nepodařilo se ověřit dostupnost.');
      }
    });
  }
}
