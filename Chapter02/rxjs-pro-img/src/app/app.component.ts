import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, map, startWith, catchError, of, finalize, shareReplay, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'rxjs-pro-img';
  src = 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505';
  placeholderSrc = 'https://atasteofalaska.com/wp-content/uploads/2017/05/Small-Image-Landscape-Placeholder-500x350.jpg';
  imageSrc$!: Observable<string>;

  ngOnInit(): void {
    const img = new Image();
    img.src = this.src;

    this.imageSrc$ = fromEvent(img, 'load').pipe(
      tap((x) => console.log('x', x)),
      map(() => this.src),
      startWith(this.placeholderSrc),
      catchError(() => of(this.placeholderSrc)), // Fallback to placeholder on error
      finalize(() => { /* Any cleanup logic */ })
    );
    
    // this.currentImage$ = img$.pipe(shareReplay(1)); 
  }
}
