import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User, Address, IFormData, IResponseItem, CartItem } from '../shared/interfaces';
import { environment } from '../../environments/environment';

import { StepSuggestComponent } from '../step-suggest/step-suggest.component';
import { StepFormComponent } from '../step-form/step-form.component';
import { StepCheckComponent } from '../step-check/step-check.component';
import { StepSummaryComponent } from '../step-summary/step-summary.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepSuggestComponent,
    StepFormComponent,
    StepCheckComponent,
    StepSummaryComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: []
})

export class CheckoutComponent implements OnInit {
  user: User | null = null;
  addresses: Address[] = [];
  selectedAddressIndex: number = -1;
  activeStep: number = 0;
  formData: IFormData = environment.EMPTY_MAP_FORM;
  finalResult: IResponseItem | null = null;
  error: string | null = null;
  cartItems: CartItem[] = [];   // ← FIX: CartItem, not CartItemInfo
  showNewAddressForm: boolean = false;
  deliveryDate: string = '';

  minDate: string = '';
  maxDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const now = new Date();
    const min = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const max = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    this.minDate = min.toISOString().split('T')[0];
    this.maxDate = max.toISOString().split('T')[0];

    // Load user
    this.http.get<User>(environment.PROFILE_GET_INFO_URL, { headers }).subscribe({
      next: (res) => this.user = res,
      error: () => this.error = 'Nepodařilo se načíst uživatelská data.'
    });

    // Load addresses
    this.http.get<Address[]>(environment.PROFILE_GET_ADDRESS_URL, { headers }).subscribe({
      next: (res) => {
        const addr = res || [];
        this.addresses = addr;
        if (addr.length === 0) {
          this.showNewAddressForm = true;
          this.activeStep = 1;
        }
      },
      error: () => this.error = 'Nepodařilo se načíst adresy.'
    });

    // Load cart
    this.http.get<CartItem[]>(environment.GET_CART_URL, { headers }).subscribe({
      next: (res) => this.cartItems = res || [],
      error: () => this.error = 'Nepodařilo se načíst položky v košíku.'
    });
  }

  onSelected(item: IResponseItem | null): void {
    if (item && item.regionalStructure) {
      const streetIndex = item.regionalStructure.findIndex(r => r.type === 'regional.address');
      this.formData = {
        street: streetIndex === -1
          ? item.regionalStructure.find(r => r.type === 'regional.street')?.name || ''
          : item.regionalStructure.length > streetIndex
            ? item.regionalStructure[streetIndex + 1]?.name || ''
            : '',
        houseNumber: item.regionalStructure.find(r => r.type === 'regional.address')?.name || '',
        city: item.regionalStructure.find(r => r.type === 'regional.municipality')?.name || '',
        zip: item.zip || '',
        country: item.regionalStructure.find(r => r.type === 'regional.country')?.name || ''
      };
    } else {
      this.formData = environment.EMPTY_MAP_FORM;
    }

    this.activeStep = 2;
  }

  onRestart(): void {
    this.formData = environment.EMPTY_MAP_FORM;
    this.finalResult = null;
    this.activeStep = 1;
  }

  handleAddressAdded(newAddr: Address | null): void {
    const token = localStorage.getItem('authTokenResponse');
    const headers = { Authorization: `Bearer ${token}` };

    if (newAddr) {
      this.addresses = [...this.addresses, newAddr];
      this.selectedAddressIndex = this.addresses.length - 1;
      this.showNewAddressForm = false;
    } else {
      this.http.get<Address[]>(environment.PROFILE_GET_ADDRESS_URL, { headers }).subscribe({
        next: (res) => {
          this.addresses = res || [];
          if (this.addresses.length > 0) {
            this.selectedAddressIndex = this.addresses.length - 1;
            this.showNewAddressForm = false;
          }
        }
      });
    }
  }

  isValidDeliveryDate(dateStr: string): boolean {
    if (!dateStr) return false;

    const today = new Date();
    const selected = new Date(dateStr);

    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return diffInDays >= 2 && diffInDays <= 14;
  }

  handleOrderConfirm(): void {
    if (this.selectedAddressIndex === -1 || !this.addresses[this.selectedAddressIndex]?.id) {
      alert('Musíte vybrat doručovací adresu.');
      return;
    }

    if (!this.isValidDeliveryDate(this.deliveryDate)) {
      alert('Zvolené datum doručení musí být mezi 2 a 14 dny od dneška.');
      return;
    }

    const token = localStorage.getItem('authTokenResponse');
    const headers = { Authorization: `Bearer ${token}` };

    const addressId = this.addresses[this.selectedAddressIndex].id;

    this.http.post(`${environment.CONFIRM_ORDER_URL}?addressId=${addressId}&deliveryDate=${this.deliveryDate}`, {}, { headers }).subscribe({
      next: () => {
        alert('Objednávka byla úspěšně vytvořena.');
        window.location.href = '/orders'; // Angular Router can be injected if needed
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Některé produkty nejsou dostupné v požadovaném množství.');
        } else {
          alert('Chyba při vytváření objednávky.');
        }
      }
    });
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
