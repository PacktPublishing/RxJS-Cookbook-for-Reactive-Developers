import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderDragEvent, MatSliderModule } from '@angular/material/slider';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, map, merge, pluck } from 'rxjs';
import { AudioService, Track } from '../audio-service/audio-service.service';
import { TimePipe } from '../pipes/time.pipe';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatCardModule,
    TimePipe,
  ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
})
export class AudioPlayerComponent {
  @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
  currentTime: number = 0;
  duration: number = 0;
  isPlaying: boolean = false;
  volume: number = 0.5;
  currentTrack: Track = {} as Track;

  constructor(private audioService: AudioService) {}

  ngAfterViewInit(): void {
    const audio = this.audioElement.nativeElement;

    const duration$ = fromEvent(audio, 'loadedmetadata').pipe(
      map(() => ({ duration: audio.duration }))
    );
    const playPauseClick$ = fromEvent(audio, 'play').pipe(
      map(() => ({ isPlaying: true }))
    );
    const pauseClick$ = fromEvent(audio, 'pause').pipe(
      map(() => ({ isPlaying: false }))
    );
    const volumeChange$ = fromEvent(audio, 'volumechange').pipe(
      map(() => ({ volume: audio.volume })),
    );
    const time$ = fromEvent(audio, 'timeupdate').pipe(
      map(() => ({ time: audio.currentTime }))
    );
  
    time$.subscribe(({ time }) => this.currentTime = time);

    merge(duration$, playPauseClick$, pauseClick$, volumeChange$).subscribe(
      (state) => {
        this.audioService.updateState(state);
      }
    );

    this.audioService.audioState$.subscribe(({ isPlaying, duration, volume, currentTrackIndex, tracks }) => {
      this.isPlaying = isPlaying;
      this.duration = duration;
      this.volume = volume;

      if (tracks[currentTrackIndex].title !== this.currentTrack.title) {
        this.audioElement.nativeElement.src = tracks[currentTrackIndex].song;
        this.currentTrack = tracks[currentTrackIndex];
      }
    });
  }

  playPause(): void {
    if (!this.isPlaying) {
      this.audioElement.nativeElement.play();
    } else {
      this.audioElement.nativeElement.pause();
    }
  }

  skip({ value }: MatSliderDragEvent): void {
    this.audioElement.nativeElement.currentTime = value;
  }

  skipPrevious(): void {
    this.audioService.previousSong();
  }

  skipNext(): void {
    this.audioService.nextSong();
  }

  changeVolume({ target: { value } }: any): void {
    this.audioElement.nativeElement.volume = value;
  }
}
