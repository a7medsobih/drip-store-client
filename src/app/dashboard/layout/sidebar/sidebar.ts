import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@auth/auth.service';

type SidebarIcon =
  | 'chart-bar'
  | 'package'
  | 'category'
  | 'shopping-cart'
  | 'users'
  | 'message'
  | 'report';

interface SidebarNavItem {
  label: string;
  icon: SidebarIcon;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authService = inject(AuthService);

  readonly isCollapsed = input(false);
  readonly isMobileOpen = input(false);
  readonly collapseToggled = output<void>();
  readonly mobileClosed = output<void>();

  protected readonly navItems: readonly SidebarNavItem[] = [
    { label: 'Overview', icon: 'chart-bar', route: '/dashboard/overview', exact: true },
    { label: 'Products', icon: 'package', route: '/dashboard/products' },
    { label: 'Categories', icon: 'category', route: '/dashboard/categories' },
    { label: 'Orders', icon: 'shopping-cart', route: '/dashboard/orders' },
    { label: 'Users', icon: 'users', route: '/dashboard/users' },
    { label: 'Testimonials', icon: 'message', route: '/dashboard/testimonials' },
    { label: 'Reports', icon: 'report', route: '/dashboard/reports' },
  ];

  protected logout(): void {
    this.mobileClosed.emit();
    this.authService.logout();
  }

  protected iconName(icon: SidebarIcon): string {
    switch (icon) {
      case 'chart-bar':
        return 'bar_chart_4_bars';
      case 'package':
        return 'package_2';
      case 'category':
        return 'category';
      case 'shopping-cart':
        return 'shopping_cart';
      case 'users':
        return 'group';
      case 'message':
        return 'chat';
      case 'report':
        return 'description';
    }
  }
}
