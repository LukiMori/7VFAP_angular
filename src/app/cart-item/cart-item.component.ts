import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-item.component.html',
  styleUrls: []
})
export class CartItemComponent {
  @Input() cartItem!: CartItem;
  @Output() cartItemChange = new EventEmitter<{ updatedItem: CartItem | null, removedItemId: number | null }>();

  constructor(private http: HttpClient, private router: Router) {}

  navigateToProduct(): void {
    this.router.navigate(['/products', this.cartItem.productId]);
  }

  handleQuantityChange(quantity: number): void {
    if (quantity < 1) {
      this.removeItem();
      return;
    }

    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      alert('Musíte být přihlášeni.');
      return;
    }

    this.http.patch<CartItem>(environment.UPDATE_CART_URL, {
      productId: this.cartItem.productId,
      quantity
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (updatedItem) => {
        this.cartItemChange.emit({ updatedItem, removedItemId: null });
      },
      error: () => {
        alert('Nepodařilo se aktualizovat položku.');
      }
    });
  }

  removeItem(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      alert('Musíte být přihlášeni.');
      return;
    }

    this.http.delete(`${environment.REMOVE_CART_ITEM_URL}/${this.cartItem.productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.cartItemChange.emit({ updatedItem: null, removedItemId: this.cartItem.productId });
      },
      error: () => {
        alert('Nepodařilo se odstranit položku.');
      }
    });
  }

  getValueAsNumber(event: Event): number {
    const target = event.target as HTMLInputElement;
    return target.valueAsNumber;
  }
}
