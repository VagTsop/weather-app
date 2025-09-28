import { Component, inject } from '@angular/core';
import { UnitsStore } from '../../../core/stores/units.store';

@Component({
  selector: 'app-units-dropdown',
  standalone: true,
  template: `
    <button (click)="toggle()">
      <img src="assets/icon-units.svg" alt="Units" width="16" height="16" />
      Units
    </button>
  `,
})
export class UnitsDropdownComponent {
  private store = inject(UnitsStore);
  toggle() {
    this.store.toggleSystem();
  }
}
