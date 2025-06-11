import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrderInformation } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { OrderCardComponent } from '../order-card/order-card.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './orders.component.html',
  styleUrls: []
})
export class OrdersComponent implements OnInit {
  orders: OrderInformation[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) {
      this.error = 'Musíte být přihlášeni.';
      this.loading = false;
      return;
    }

    this.http.get<OrderInformation[]>(environment.GET_ORDERS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nepodařilo se načíst objednávky.';
        this.loading = false;
      }
    });
  }
}
