import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IFormData, IResponseItem } from '../shared/interfaces';
import { MapService } from '../shared/map.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-check.component.html',
  styleUrls: []
})
export class StepCheckComponent implements OnChanges {
  @Input() formData!: IFormData;
  @Output() confirmed = new EventEmitter<IResponseItem>();
  @Output() previous = new EventEmitter<void>();

  geocode: IResponseItem[] = [];
  suggestions: IResponseItem[] = [];
  isLoading = false;
  hasAttempted = false;

  constructor(private mapService: MapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && this.formData) {
      this.runGeocode();
    }
  }

  runGeocode(): void {
    const hasInput = this.formData.street || this.formData.houseNumber || this.formData.city || this.formData.zip || this.formData.country;

    this.geocode = [];
    this.suggestions = [];
    this.hasAttempted = false;

    if (!hasInput) {
      return;
    }

    this.isLoading = true;

    this.mapService.runGeocode('cs', this.formData).subscribe(results => {
      this.geocode = results;
      this.isLoading = false;
      this.hasAttempted = true;

      if (this.geocode.length === 1) {
        this.confirmed.emit(this.geocode[0]); // same as setFinalResult + onNext
      } else if (this.geocode.length > 1 || this.hasAttempted) {
        this.runSuggest();
      }
    });
  }

  runSuggest(): void {
    const query = `${this.formData.street} ${this.formData.houseNumber}, ${this.formData.city}, ${this.formData.zip}, ${this.formData.country}`;

    this.mapService.runSuggest('cs', query).subscribe(results => {
      this.suggestions = results;
    });
  }

  onSelectSuggestion(item: IResponseItem): void {
    this.confirmed.emit(item);
  }

  onManualNext(): void {
    if (this.geocode.length > 0) {
      this.confirmed.emit(this.geocode[0]);
    }
  }

  onPreviousClick(): void {
    this.previous.emit();
  }
}
