import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, fromEvent, map, of, startWith } from 'rxjs';

import { DashboardHeader } from '../dashboard-header/dashboard-header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardHeader, RouterOutlet, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
    ),
    { initialValue: null },
  );

  private readonly viewportWidth = toSignal(
    this.window
      ? fromEvent(this.window, 'resize').pipe(
          startWith(null),
          map(() => this.window!.innerWidth),
        )
      : of(1280),
    {
      initialValue: this.window?.innerWidth ?? 1280,
    },
  );

  protected readonly isCollapsed = signal(false);
  protected readonly isMobileOpen = signal(false);

  protected readonly isMobile = computed(() => this.viewportWidth() < 768);
  protected readonly pageTitle = computed(() => {
    this.navigationEnd();

    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return (
      route.snapshot.data['dashboardTitle'] ??
      this.formatRouteTitle(route.routeConfig?.path) ??
      'Dashboard'
    );
  });

  constructor() {
    effect(() => {
      if (!this.isMobile()) {
        this.isMobileOpen.set(false);
      }
    });
  }

  protected handleMenuClick(): void {
    if (this.isMobile()) {
      this.isMobileOpen.set(true);
      return;
    }

    this.isCollapsed.update((value) => !value);
  }

  protected toggleCollapsed(): void {
    this.isCollapsed.update((value) => !value);
  }

  protected closeMobileSidebar(): void {
    this.isMobileOpen.set(false);
  }

  private formatRouteTitle(path?: string): string | null {
    if (!path) {
      return null;
    }

    const normalized = path.replace(/[-_]/g, ' ').trim();

    if (!normalized) {
      return null;
    }

    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
