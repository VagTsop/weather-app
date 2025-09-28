import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Place } from '../models/geo.model';

@Injectable({ providedIn: 'root' })
export class GeoService {
  private http = inject(HttpClient);
  private base = 'https://geocoding-api.open-meteo.com/v1/search';
  search(query: string): Observable<Place[]> {
    return this.http
      .get<any>(`${this.base}?name=${encodeURIComponent(query)}&count=5`)
      .pipe(
        map((r) =>
          (r.results || []).map(
            (x: any) =>
              ({
                name: `${x.name}${x.admin1 ? `, ${x.admin1}` : ''}`,
                country: x.country,
                latitude: x.latitude,
                longitude: x.longitude,
                timezone: x.timezone,
              } as Place)
          )
        )
      );
  }
}
