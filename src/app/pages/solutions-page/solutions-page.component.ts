import { Component } from '@angular/core';

import { StaticPageComponent } from '../../shared/static-page/static-page.component';

@Component({
  selector: 'app-solutions-page',
  standalone: true,
  imports: [StaticPageComponent],
  template: `<app-static-page page="solutions" />`
})
export class SolutionsPageComponent {}
