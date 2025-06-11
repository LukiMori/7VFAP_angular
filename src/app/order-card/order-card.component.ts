import { Component, Input } from '@angular/core';
import { OrderInformation } from '../shared/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrls: []
})
export class OrderCardComponent {
  @Input() orderInformation!: OrderInformation;
}
