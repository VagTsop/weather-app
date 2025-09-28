import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeoService } from '../../../core/services/geo.service';
import { Place } from '../../../core/models/geo.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
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
    this.q = p.name;
    this.select.emit(p);
  }
}
