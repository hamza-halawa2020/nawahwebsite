import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteInteractionsDirective } from './shared/site-interactions/site-interactions.directive';
import { WhatsappBubbleComponent } from './shared/whatsapp-bubble/whatsapp-bubble.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteInteractionsDirective, WhatsappBubbleComponent],
  template: `
    <div appSiteInteractions>
      <router-outlet />
      <app-whatsapp-bubble />
    </div>
  `
})
export class AppComponent {}
