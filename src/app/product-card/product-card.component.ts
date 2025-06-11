import { Component, Input } from '@angular/core';
import { Product } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: []
})
export class ProductCardComponent {
  @Input() product!: Product;
}
