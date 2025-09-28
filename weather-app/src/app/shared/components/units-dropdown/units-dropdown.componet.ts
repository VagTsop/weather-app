import { Component, inject } from '@angular/core';
import { UnitsStore } from '../../../core/stores/units.store';

@Component({
  selector: 'app-units-dropdown',
  standalone: true,
  templateUrl: './units-dropdown.component.html',
  styleUrls: ['./units-dropdown.component.css'],
})
export class UnitsDropdownComponent {
  private store = inject(UnitsStore);
  toggle() {
    this.store.toggleSystem();
  }
}
