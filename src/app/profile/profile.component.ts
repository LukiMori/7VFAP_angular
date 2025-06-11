import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, Address, IFormData, IResponseItem } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { StepSuggestComponent } from '../step-suggest/step-suggest.component';
import { StepFormComponent } from '../step-form/step-form.component';
import { StepCheckComponent } from '../step-check/step-check.component';
import { StepSummaryComponent } from '../step-summary/step-summary.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SignupComponent,
    StepSuggestComponent,
    StepFormComponent,
    StepCheckComponent,
    StepSummaryComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit {
  user: User = environment.EMPTY_USER;
  updatedUser: User = environment.EMPTY_USER;
  addresses: Address[] = [];
  error: string | null = null;
  info: string | null = null;
  activeStep = 1;
  finalResult: IResponseItem | null = null;
  formData: IFormData = environment.EMPTY_MAP_FORM;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<User>(environment.PROFILE_GET_INFO_URL, { headers }).subscribe({
      next: (res) => {
        this.user = res;
        this.updatedUser = { ...res };

        this.http.get<Address[]>(environment.PROFILE_GET_ADDRESS_URL, { headers }).subscribe({
          next: (addrRes) => {
            this.addresses = addrRes || [];
          },
          error: (err) => {
            this.error = 'Nepodařilo se načíst adresy.';
            console.warn('Adresy nejsou dostupné:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'Nepodařilo se načíst profil.';
        console.warn('Profil není dostupný:', err);
      }
    });
  }

  get isValidPhoneNumber(): boolean {
    return /^\d{9}$/.test(this.updatedUser?.phoneNumber ?? '');
  }

  handleSave(): void {
    if (!this.user) return;

    if (!this.isValidPhoneNumber) {
      this.error = 'Telefonní číslo musí mít přesně 9 číslic.';
      return;
    }

    const changes: Partial<User> = {};
    let somethingChanged = false;

    (['firstName', 'lastName', 'phoneNumber'] as (keyof User)[]).forEach((field) => {
      if (this.user[field] !== this.updatedUser[field]) {
        changes[field] = this.updatedUser[field];
        somethingChanged = true;
      }
    });

    if (!somethingChanged) {
      this.info = 'Žádné změny k uložení.';
      return;
    }

    const token = localStorage.getItem('authTokenResponse');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.put<User>(environment.PROFILE_CHANGE_URL, changes, { headers }).subscribe({
      next: (res) => {
        this.user = res;
        this.info = 'Změny byly uloženy.';
        this.error = null;
      },
      error: (err) => {
        this.error = 'Nepodařilo se uložit změny.';
        console.error(err);
      }
    });
  }

  handleAddressAdded(newAddr: Address | null): void {
    const token = localStorage.getItem('authTokenResponse');
    const headers = { Authorization: `Bearer ${token}` };

    if (newAddr) {
      this.addresses = [...this.addresses, newAddr];
    } else {
      this.http.get<Address[]>(environment.PROFILE_GET_ADDRESS_URL, { headers }).subscribe({
        next: (res) => {
          this.addresses = res || [];
        }
      });
    }
  }

  onConfirmed(result: IResponseItem): void {
    this.finalResult = result;
    this.activeStep = 4;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('authTokenResponse');
  }

  onSelected(item: IResponseItem | null): void {
    if (item && item.regionalStructure) {
      const streetIndex = item.regionalStructure.findIndex(region => region.type === 'regional.address');

      this.formData = {
        street: streetIndex === -1
          ? item.regionalStructure.find(region => region.type === 'regional.street')?.name || ''
          : item.regionalStructure.length > streetIndex
            ? item.regionalStructure[streetIndex + 1]?.name || ''
            : '',
        houseNumber: item.regionalStructure.find(region => region.type === 'regional.address')?.name || '',
        city: item.regionalStructure.find(region => region.type === 'regional.municipality')?.name || '',
        zip: item.zip || '',
        country: item.regionalStructure.find(region => region.type === 'regional.country')?.name || ''
      };
    } else {
      this.formData = {
        street: '',
        houseNumber: '',
        city: '',
        zip: '',
        country: ''
      };
    }

    this.activeStep = 2;
  }

  onRestart(): void {
    this.formData = environment.EMPTY_MAP_FORM;
    this.finalResult = null;
    this.activeStep = 1;
  }
}
