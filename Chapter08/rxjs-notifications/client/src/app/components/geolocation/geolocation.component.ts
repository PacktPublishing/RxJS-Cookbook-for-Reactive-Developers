import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geolocation',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './geolocation.component.html',
  styleUrl: './geolocation.component.scss'
})
export class GeolocationComponent implements OnInit {
  geolocation: { lat: number; long: number } = { lat: 0, long: 0 };
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.geolocation.lat = params['lat'];
      this.geolocation.long = params['long'];
      console.log(params); // Log the query parameters
      // You can access specific query parameters like this:
      // const paramValue = params['paramName'];
    });
  }
}