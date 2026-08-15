import { Component } from '@angular/core';

import { StaticPageComponent } from '../../shared/static-page/static-page.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [StaticPageComponent],
  template: `<app-static-page page="home" />`
})
export class HomePageComponent {}
