import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected submit(): void {
    if (this.isSubmitting() || !this.email().trim()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.forgotPassword(this.email().trim()).subscribe({
      next: (response) => {
        this.successMessage.set(
          response.otp
            ? `OTP sent. Use this code to continue: ${response.otp}`
            : 'OTP sent successfully.',
        );
        this.isSubmitting.set(false);

        setTimeout(() => {
          void this.router.navigate(['/reset-password'], {
            queryParams: { email: response.email },
          });
        }, 1200);
      },
      error: () => {
        this.errorMessage.set('Unable to send OTP');
        this.isSubmitting.set(false);
      },
    });
  }
}
