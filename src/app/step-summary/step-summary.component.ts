import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFormData, IResponseItem, Address } from '../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InfoMapComponent } from '../info-map/info-map.component'; // your existing map component!
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [InfoMapComponent, CommonModule],
  templateUrl: './step-summary.component.html',
  styleUrls: []
})
export class StepSummaryComponent {
  @Input() formData!: IFormData;
  @Input() finalResult: IResponseItem | null = null;

  @Output() restart = new EventEmitter<void>();
  @Output() addressAdded = new EventEmitter<Address | null>();

  constructor(private http: HttpClient) {}

  confirm(): void {
    const token = localStorage.getItem('authTokenResponse');
    if (!this.finalResult || !this.finalResult.position) return;

    const payload = {
      street: this.formData.street,
      houseNumber: this.formData.houseNumber,
      city: this.formData.city,
      zipCode: this.formData.zip,
      country: this.formData.country
    };

    console.log('Sending address to backend:', payload);

    this.http.post<Address>(environment.PROFILE_GET_ADDRESS_URL, payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (newAddr) => {
        alert('Adresa byla úspěšně uložena.');
        this.addressAdded.emit(newAddr);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          alert('Tato adresa již byla přidána.');
        } else {
          alert('Nepodařilo se uložit adresu.');
        }
        this.addressAdded.emit(null);
      }
    });
  }

  restartSelection(): void {
    this.restart.emit();
  }

  get hasValidCoords(): boolean {
    return !!this.finalResult?.position?.lat && !!this.finalResult?.position?.lon;
  }
}
