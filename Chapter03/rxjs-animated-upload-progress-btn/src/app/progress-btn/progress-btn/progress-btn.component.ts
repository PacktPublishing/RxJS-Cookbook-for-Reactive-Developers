import {
  animationFrames,
  BehaviorSubject,
  distinctUntilChanged, finalize, range, Subject, switchMap,
  take,
  tap,
  timer,
  zipWith
} from 'rxjs';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { map, takeWhile, withLatestFrom } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

export enum EBtnStates {
  IDLE = 'idle',
  LOADING = 'loading',
  DONE = 'done'
}

@Component({
    selector: 'app-progress-btn',
    imports: [CommonModule, AsyncPipe],
    templateUrl: './progress-btn.component.html',
    styleUrl: './progress-btn.component.scss'
})
export class ProgressBtnComponent {
  @ViewChild('button', { static: false }) buttonRef!: ElementRef;
  buttonProgressWidth = signal<string>('');
  private upload$ = new Subject<void>();
  public btnState$ = new BehaviorSubject<string>(EBtnStates.IDLE);

  ngAfterViewInit() {
    const uploadProgress$ = range(0, 101).pipe(
      zipWith(timer(0, 50)),
      map(([value, _]) => value),
      take(101) 
    );
    const clickStream$ = this.upload$.pipe(
      tap(() => this.btnState$.next(EBtnStates.LOADING)),
      switchMap(() => animationFrames()),
      withLatestFrom(uploadProgress$, this.btnState$),
      distinctUntilChanged(([_, progress], [__, prevProgress]) => progress === prevProgress),
      tap(([_, progress]) => {
        if (progress === 100) {
          this.btnState$.next(EBtnStates.DONE);
        }
      }),
      takeWhile(([_, __, btnState]) => btnState !== EBtnStates.DONE, true),
    );

    clickStream$.subscribe(([_, progress]) => {
      const progressWidth =
        (this.buttonRef.nativeElement.clientWidth / 100) * progress;
      this.buttonProgressWidth.set(`${progressWidth}`);
    });
  }

  startUpload() {
    this.upload$.next();
  }
}
