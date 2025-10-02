import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { UnitsDropdownComponent } from './shared/components/units-dropdown/units-dropdown.componet';
import { PwaInstallComponent } from './shared/components/pwa-install/pwa-install.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    UnitsDropdownComponent,
    PwaInstallComponent,
  ],
  templateUrl: './app.html',
})
export class AppComponent {
  // make it public so (click)="theme.set(...)" works in the template
  constructor(public theme: ThemeService) {}
}
