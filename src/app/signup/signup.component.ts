import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegistrationDTO } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  signupButtonClicked = false;
  responseMsg = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    protected router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$')]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{9}$')]]
    });
  }

  signup(): void {
    this.signupButtonClicked = true;

    if (this.signupForm.invalid || !this.passwordsMatch()) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formValue = this.signupForm.value;
    const registrationDTO: RegistrationDTO = {
      email: formValue.email.trim(),
      password: formValue.password,
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      phoneNumber: formValue.phoneNumber.trim()
    };

    this.http.post(environment.SIGNUP_TOKEN_URL, registrationDTO).subscribe({
      next: (res: any) => {
        this.responseMsg = res;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        try {
          this.responseMsg = err.error;
        } catch {
          this.responseMsg = 'Nelze se připojit k autentizačnímu serveru.';
        }
      }
    });

    this.signupButtonClicked = false;
  }

  passwordsMatch(): boolean {
    return this.signupForm.value.password === this.signupForm.value.confirmPassword;
  }
}
