import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResponse } from '../types/LocationResponse.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  searchLocation(query: string): Observable<LocationResponse> {
    return this.httpClient
      .get<LocationResponse>(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&key=${environment.googleMapsApiKey}`
    );
  }
}
