import { Component, HostListener, inject, signal } from '@angular/core';
import { UnitsStore } from '../../../core/stores/units.store';

@Component({
  selector: 'app-units-dropdown',
  standalone: true,
  templateUrl: './units-dropdown.component.html',
  styleUrls: ['./units-dropdown.component.css'],
})
export class UnitsDropdownComponent {
  store = inject(UnitsStore);
  open = signal(false);

  toggleMenu() {
    this.open.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(ev: MouseEvent) {
    const t = ev.target as HTMLElement;
    if (!t.closest('.menu-wrap')) this.open.set(false);
  }

  toggleSystem() {
    this.store.toggleSystem();
  }
  setTemp(v: 'c' | 'f') {
    this.store.set({ temp: v });
  }
  setWind(v: 'kmh' | 'mph') {
    this.store.set({ wind: v });
  }
  setPrecip(v: 'mm' | 'in') {
    this.store.set({ precip: v });
  }
}
