import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFormData } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-form.component.html',
  styleUrls: []
})
export class StepFormComponent {
  @Input() formData!: IFormData;
  @Output() formChange = new EventEmitter<IFormData>();
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}
