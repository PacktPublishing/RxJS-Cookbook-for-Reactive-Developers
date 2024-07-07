import { Component } from '@angular/core';
import { AudioServiceService } from '../audio-service/audio-service.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent {
  currentTime: number = 0;
  isPlaying: boolean = false;
  duration$: Observable<number> = of(0);

  constructor(private audioService: AudioServiceService) {}

  ngOnInit() {
    this.duration$ = this.audioService.duration$;
    this.audioService.currentTime$.subscribe(time => this.currentTime = time);
    this.audioService.isPlaying$.subscribe(playing => this.isPlaying = playing);
  }

  onPlayPause() { 
    this.isPlaying ? this.audioService.pause() : this.audioService.play(); 
  }

  skip(e: any) {
    // console.log(e);
    this.audioService.setTime(this.currentTime + 50);
  }
}
