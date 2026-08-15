import { Component } from '@angular/core';

import { StaticPageComponent } from '../../shared/static-page/static-page.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [StaticPageComponent],
  template: `<app-static-page page="contact" />`
})
export class ContactPageComponent {}
