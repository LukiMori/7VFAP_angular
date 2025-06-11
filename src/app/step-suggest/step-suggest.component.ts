import { Component, EventEmitter, Output } from '@angular/core';
import { IResponseItem } from '../shared/interfaces';
import { MapService } from '../shared/map.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-suggest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-suggest.component.html',
  styleUrls: []
})
export class StepSuggestComponent {
  value: string = '';
  suggestions: IResponseItem[] = [];

  @Output() selected = new EventEmitter<IResponseItem | null>();

  constructor(private mapService: MapService) {}

  onInputChange(newValue: string): void {
    this.value = newValue;

    if (!this.value.trim()) {
      this.suggestions = [];
      return;
    }

    this.mapService.runSuggest('cs', this.value).subscribe({
      next: (results) => {
        this.suggestions = results;
      },
      error: (err) => {
        console.error('Error fetching suggestions:', err);
        this.suggestions = [];
      }
    });
  }

  onSuggestionClick(suggestion: IResponseItem): void {
    this.selected.emit(suggestion);
  }

  onManualEntry(): void {
    this.selected.emit(null);
  }
}
