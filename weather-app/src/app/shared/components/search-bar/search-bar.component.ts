import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeoService } from '../../../core/services/geo.service';
import { Place } from '../../../core/models/geo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  template: `
    <div class="container" style="margin-top:24px">
      <input
        placeholder="Search for a place..."
        [(ngModel)]="q"
        (keyup.enter)="search()"
      />
      <button (click)="search()">Search</button>
    </div>
    <div class="container" *ngIf="results().length">
      <div class="card" style="width:100%">
        <div
          *ngFor="let p of results()"
          (click)="pick(p)"
          style="padding:8px;cursor:pointer"
        >
          {{ p.name }}, {{ p.country }}
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule, FormsModule],
})
export class SearchBarComponent {
  private geo = inject(GeoService);
  q = '';
  results = signal<Place[]>([]);
  @Output() select = new EventEmitter<Place>();

  search() {
    if (!this.q.trim()) return;
    this.geo.search(this.q).subscribe((r) => this.results.set(r));
  }
  pick(p: Place) {
    this.results.set([]);
    this.q = `${p.name}`;
    this.select.emit(p);
  }
}
