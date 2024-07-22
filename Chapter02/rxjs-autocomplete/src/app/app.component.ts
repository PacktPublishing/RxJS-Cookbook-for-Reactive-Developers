import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { fromEvent, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs';
import { LocationService } from './services/location.service';
import { LocationResponse } from './types/LocationResponse.type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatAutocompleteModule, CommonModule, MatInputModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-autocomplete';

  @ViewChild('locationInput', { static: true }) input!: ElementRef;
  results: LocationResponse = { predictions: [{
    'description': 'New York, NY, USA',
    'matched_substrings': [{ length: 7, offset: 0 }],
    'place_id': 'ChIJOwg_06VPwokRYv534QaPC8g',
    'reference': 'ChIJOwg_06VPwokRYv534QaPC8g',
    'structured_formatting': {
      'main_text': 'New York',
      'main_text_matched_substrings': [{ length: 7, offset: 0 }],
      'secondary_text': 'NY, USA'
    },
    'terms': [{ offset: 0, value: 'New York' }, { offset: 11, value: 'NY' }, { offset: 15, value: 'USA' }],
    'types': ['locality', 'political', 'geocode']
  }], status: '' };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    fromEvent<InputEvent>(this.input.nativeElement, 'input').pipe(
      debounceTime(200),
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      switchMap((query: string) => this.locationService.searchLocation(query))
    ).subscribe((results: LocationResponse) => this.results = results);
  }
}
