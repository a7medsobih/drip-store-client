import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.authService.isAuthenticated()) {
        return;
      }

      void this.router.navigate([
        this.authService.isAdmin() ? '/dashboard' : '/',
      ]);
    });
  }

  protected submit(): void {
    if (
      this.isSubmitting() ||
      !this.email().trim() ||
      !this.password().trim()
    ) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        void this.router.navigate([
          this.authService.isAdmin() ? '/dashboard' : '/',
        ]);
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 403) {
            this.errorMessage.set('This account is inactive');
          } else if (error.status === 401) {
            this.errorMessage.set('Invalid email or password');
          } else {
            this.errorMessage.set('Login failed. Please try again.');
          }
        } else {
          this.errorMessage.set('Login failed. Please try again.');
        }

        this.isSubmitting.set(false);
      },
    });
  }
}
