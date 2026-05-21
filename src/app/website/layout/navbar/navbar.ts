import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-angular';

import { AuthService } from '@auth/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly authService = inject(AuthService);

  readonly Search = Search;
  readonly ShoppingBag = ShoppingBag;
  readonly User = User;
  readonly Menu = Menu;
  readonly X = X;
  readonly LayoutDashboard = LayoutDashboard;
  readonly LogOut = LogOut;

  protected readonly isMobileMenuOpen = signal(false);

  protected readonly displayName = computed(() => {
    const user = this.authService.currentUser();
    return user?.name?.trim() || user?.email?.split('@')[0] || 'Account';
  });

  protected readonly userInitial = computed(() =>
    this.displayName().charAt(0).toUpperCase(),
  );

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }
}
