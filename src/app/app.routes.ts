import { Routes } from '@angular/router';

import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ImpactPageComponent } from './pages/impact-page/impact-page.component';
import { InvestmentPageComponent } from './pages/investment-page/investment-page.component';
import { SolutionsPageComponent } from './pages/solutions-page/solutions-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Nawah Energies' },
  { path: 'about-us', component: AboutPageComponent, title: 'About Us | Nawah Energies' },
  { path: 'nawah-energiesabout-us-', component: AboutPageComponent, title: 'About Us | Nawah Energies' },
  { path: 'solutions', component: SolutionsPageComponent, title: 'Solutions | Nawah Energies' },
  { path: 'impact', component: ImpactPageComponent, title: 'Impact | Nawah Energies' },
  { path: 'impact-carbon-savings', component: ImpactPageComponent, title: 'Impact | Nawah Energies' },
  { path: 'investment', component: InvestmentPageComponent, title: 'Investment | Nawah Energies' },
  { path: 'contact-us', component: ContactPageComponent, title: 'Contact | Nawah Energies' },
  {
    path: 'contact-nawahs-team-island-energy-project',
    component: ContactPageComponent,
    title: 'Contact | Nawah Energies'
  },
  { path: '**', redirectTo: '' }
];
