import { Component, Input, OnChanges, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-static-page',
  standalone: true,
  template: `
    <div class="static-page" [innerHTML]="html"></div>
  `
})
export class StaticPageComponent implements OnChanges {
  @Input({ required: true }) page = '';

  html: SafeHtml = '';

  private readonly sanitizer = inject(DomSanitizer);

  async ngOnChanges(): Promise<void> {
    if (!this.page) {
      return;
    }

    const response = await fetch(`/static-pages/${this.page}.html`);

    if (!response.ok) {
      this.html = this.sanitizer.bypassSecurityTrustHtml('');
      return;
    }

    const markup = await response.text();
    this.html = this.sanitizer.bypassSecurityTrustHtml(markup);
  }
}
