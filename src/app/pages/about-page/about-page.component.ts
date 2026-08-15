import { Component } from '@angular/core';

import { StaticPageComponent } from '../../shared/static-page/static-page.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [StaticPageComponent],
  template: `<app-static-page page="about" />`
})
export class AboutPageComponent {}
