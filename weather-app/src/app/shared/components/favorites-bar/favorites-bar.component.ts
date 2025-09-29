import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-favorites-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-bar.component.html',
  styleUrls: ['./favorites-bar.component.css'],
})
export class FavoritesBarComponent {
  fav = inject(FavoritesService);
  @Output() open = new EventEmitter<{
    lat: number;
    lon: number;
    name: string;
  }>();
}
