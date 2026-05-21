import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly mobile = signal('');
  protected readonly gender = signal<'male' | 'female'>('male');
  protected readonly password = signal('');
  protected readonly emailConsent = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected submit(): void {
    if (
      this.isSubmitting() ||
      !this.name().trim() ||
      !this.email().trim() ||
      !this.mobile().trim() ||
      !this.password().trim()
    ) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService
      .register({
        name: this.name().trim(),
        email: this.email().trim(),
        mobile: this.mobile().trim(),
        password: this.password(),
        gender: this.gender(),
        emailConsent: this.emailConsent(),
      })
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            response.otp
              ? `Account created. Verification OTP: ${response.otp}`
              : 'Account created successfully.',
          );
          this.isSubmitting.set(false);

          setTimeout(() => {
            void this.router.navigate(['/login']);
          }, 1200);
        },
        error: () => {
          this.errorMessage.set('Registration failed');
          this.isSubmitting.set(false);
        },
      });
  }
}
