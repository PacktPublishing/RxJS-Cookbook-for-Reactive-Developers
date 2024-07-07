import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioServiceService {
  private audio = new Audio();
  public currentTime$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<number>(0);
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  // ... other subjects for volume, playlist, etc.

  constructor() {
    this.audio.src = 'http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3'
    // Set up event listeners for time updates, etc.
    combineLatest([
      fromEvent(this.audio, 'timeupdate').pipe(map(() => this.audio.currentTime)),
      fromEvent(this.audio, 'loadedmetadata').pipe(map(() => this.audio.duration))
    ]).subscribe(([currentTime, duration]) => {
      this.currentTime$.next(currentTime);
      this.duration$.next(duration);
    });
  }

  play(): void {
    this.audio.play();
    this.isPlaying$.next(true);
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  setTime(time: number): void {
    this.audio.currentTime = time;
  }
  // ... pause, next, previous, setVolume
}
