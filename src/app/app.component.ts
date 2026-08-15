import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WhatsappBubbleComponent } from './shared/whatsapp-bubble/whatsapp-bubble.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WhatsappBubbleComponent],
  template: `
    <router-outlet />
    <app-whatsapp-bubble />
  `
})
export class AppComponent {}
