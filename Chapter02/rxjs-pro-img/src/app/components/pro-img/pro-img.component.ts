import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  Subject,
  timer,
  fromEvent,
  map,
  merge,
  tap,
  startWith,
  takeWhile,
  catchError,
  of,
  shareReplay,
  audit,
  auditTime,
} from 'rxjs';

@Component({
  selector: 'app-pro-img',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './pro-img.component.html',
  styleUrl: './pro-img.component.scss',
})
export class ProImgComponent implements OnInit {
  placeholderSrc = 'blurry-image.jpeg';
  src = 'image.jpg';
  imageSrc$!: Observable<string>;
  loadingProgress$ = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    const placeholderImg = new Image();
    placeholderImg.src = !this.placeholderSrc.startsWith('http')
      ? `assets/images/${this.placeholderSrc}`
      : this.placeholderSrc;
    const img = new Image();
    img.src = !this.src.startsWith('http')
      ? `assets/images/${this.src}`
      : this.src;

      // Track actual download progress of an image
      // const loadImageWithProgress$ = (url: string): Observable<string> => {
      //   return new Observable((observer) => {
      //     const xhr = new XMLHttpRequest();
      
      //     xhr.open('GET', url, true);
      //     xhr.responseType = 'blob';
      
      //     xhr.onprogress = (event) => {
      //       if (event.lengthComputable) {
      //         const percentComplete = Math.round((event.loaded / event.total) * 100);
      //         this.loadingProgress$.next(+percentComplete);
      //       }
      //     };
      
      //     xhr.onload = () => {
      //       const blobUrl = URL.createObjectURL(xhr.response);
      //       observer.next(blobUrl);
      //       observer.complete();
      //     };
      
      //     xhr.onerror = () => {
      //       this.loadingProgress$.next(-1);
      //       observer.error(new Error('Image load failed'));
      //     };
      
      //     xhr.send();
      //   });
      // };
      // this.imageSrc$ = loadImageWithProgress$(img.src).pipe(
      //   auditTime(1000),
      //   startWith(placeholderImg.src),
      //   takeWhile((src) => src === placeholderImg.src, true),
      //   catchError(() => of(placeholderImg.src)),
      //   shareReplay(1)
      // );

    const loadProgress$ = timer(0, 100); 
    const loadComplete$ = fromEvent(img, 'load').pipe(map(() => 100)); // Emit 100 on load
    const loadError$ = fromEvent(img, 'error').pipe(map(() => -1)); // Emit -1 on error

    this.imageSrc$ = merge(loadProgress$, loadComplete$, loadError$).pipe( 
      tap((progress) => this.loadingProgress$.next(progress)), 
      map((progress) => (progress === 100 ? img.src : placeholderImg.src)), 
      startWith(placeholderImg.src), 
      takeWhile((src) => src === placeholderImg.src, true), 
      catchError(() => of(placeholderImg.src)), 
      shareReplay(1) 
    ); 
  }
}
