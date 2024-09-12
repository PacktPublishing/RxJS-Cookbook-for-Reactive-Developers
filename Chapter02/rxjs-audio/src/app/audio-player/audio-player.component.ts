import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderDragEvent, MatSliderModule } from '@angular/material/slider';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, map, merge } from 'rxjs';
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
  currentTrack: Track | null = null;
  errorMessage = '';

  constructor(private audioService: AudioService, private cdRef: ChangeDetectorRef) {}

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
    const error$ = fromEvent(audio, 'error');
  
    time$.subscribe(({ time }) => this.currentTime = time);
    error$.subscribe((error: Event) => this.errorMessage = 'An error occurred while loading the audio file.');

    merge(duration$, playPauseClick$, pauseClick$, volumeChange$).subscribe(
      (state) => {
        this.audioService.updateState(state);
      }
    );

    this.audioService.audioState$.subscribe(({ isPlaying, duration, volume, currentTrackIndex, tracks }) => {
      this.isPlaying = isPlaying;
      this.duration = duration;
      this.volume = volume;

      if (tracks[currentTrackIndex].title !== this.currentTrack?.title) {
        this.audioElement.nativeElement.src = tracks[currentTrackIndex].song;
        this.currentTrack = tracks[currentTrackIndex];
        this.cdRef.detectChanges();
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

  skip({ target: { value } }: any): void {
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
