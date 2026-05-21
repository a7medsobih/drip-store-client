import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly email = signal(
    this.route.snapshot.queryParamMap.get('email') ?? '',
  );
  protected readonly otp = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected submit(): void {
    if (
      this.isSubmitting() ||
      !this.email().trim() ||
      !this.otp().trim() ||
      !this.newPassword().trim()
    ) {
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const email = this.email().trim();

    this.authService
      .verifyOtp({
        email,
        otp: this.otp().trim(),
      })
      .subscribe({
        next: () => {
          this.authService
            .resetPassword({
              email,
              newPassword: this.newPassword(),
            })
            .subscribe({
              next: () => {
                this.successMessage.set('Password reset successfully.');
                this.isSubmitting.set(false);

                setTimeout(() => {
                  void this.router.navigate(['/login']);
                }, 1200);
              },
              error: () => {
                this.errorMessage.set('Unable to reset password');
                this.isSubmitting.set(false);
              },
            });
        },
        error: () => {
          this.errorMessage.set('Invalid OTP');
          this.isSubmitting.set(false);
        },
      });
  }
}
