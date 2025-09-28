import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UnitsDropdownComponent } from './shared/components/units-dropdown/units-dropdown.componet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UnitsDropdownComponent],
  templateUrl: './app.html',
})
export class AppComponent {}
