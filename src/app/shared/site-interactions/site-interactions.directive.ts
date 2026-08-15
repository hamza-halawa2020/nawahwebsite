import { AfterViewInit, Directive, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Directive({
  selector: '[appSiteInteractions]',
  standalone: true
})
export class SiteInteractionsDirective implements AfterViewInit, OnDestroy {
  private routeSubscription?: Subscription;

  constructor(private readonly router: Router) {}

  ngAfterViewInit(): void {
    this.preparePage();
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        window.setTimeout(() => this.preparePage());
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const burger = target.closest<HTMLButtonElement>('.burger');

    if (burger) {
      event.preventDefault();
      this.toggleMobileMenu(burger);
      return;
    }

    if (target.closest('.block-header-layout-mobile__dropdown a')) {
      this.closeAllMobileMenus();
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.syncHeaderShadow();
  }

  private preparePage(): void {
    this.closeAllMobileMenus();
    this.activateTransitions();
    this.syncHeaderShadow();
  }

  private toggleMobileMenu(burger: HTMLButtonElement): void {
    const mobileHeader = burger.closest('.block-header-layout-mobile');
    const dropdown = mobileHeader?.querySelector('.block-header-layout-mobile__dropdown');

    if (!dropdown) {
      return;
    }

    const isOpen = dropdown.classList.toggle('block-header-layout-mobile__dropdown--open');
    burger.classList.toggle('burger--open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  }

  private closeAllMobileMenus(): void {
    document.querySelectorAll('.burger--open').forEach((burger) => {
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });

    document.querySelectorAll('.block-header-layout-mobile__dropdown--open').forEach((dropdown) => {
      dropdown.classList.remove('block-header-layout-mobile__dropdown--open');
    });
  }

  private activateTransitions(): void {
    document.querySelectorAll<HTMLElement>('.transition').forEach((element) => {
      element.dataset['animationState'] = 'active';
    });

    document.querySelectorAll<HTMLElement>('[data-animation-role]').forEach((element) => {
      element.dataset['animationState'] = 'active';
      element.classList.add('loaded');
    });
  }

  private syncHeaderShadow(): void {
    const hasShadow = window.scrollY > 1;

    document.querySelectorAll('.block-header').forEach((header) => {
      header.classList.toggle('block-header--with-shadow', hasShadow);
    });
  }
}
