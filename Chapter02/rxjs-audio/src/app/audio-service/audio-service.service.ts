import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Track {
  title: string;
  artist: string;
  album: string;
  year: number;
  song: string;
  cover: string;
}

interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentTrackIndex: number;
  duration: number;
  tracks: Track[];
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public audioState$ = new BehaviorSubject<AudioState>({
    isPlaying: false,
    volume: 0.5,
    currentTrackIndex: 0,
    duration: 0,
    tracks: [
      {
        title: 'If You Really Love Me',
        artist: 'Stevie Wonder',
        album: 'Magnon',
        year: 1973,
        song: 'http://www.jplayer.org/audio/mp3/Miaow-10-Thin-ice.mp3',
        cover: '/assets/track.jpg'
      },
      {
        title: 'Tammy Terrell',
        artist: 'Aint No Mountain High Enough',
        album: 'The Stark Palace',
        year: 1977,
        song: 'http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3',
        cover: '/assets/track-cover.jpg'
      }
    ]
  });

  constructor() {}

  updateState(state: Partial<AudioState>): void {
    this.audioState$.next({ ...this.audioState$.value, ...state });
  }

  previousSong(): void {
    let prevIndex = this.audioState$.value.currentTrackIndex - 1;
    const tracks = this.audioState$.value.tracks;

    if (prevIndex < 0) {
      prevIndex = tracks.length - 1; // Loop back to the end
    }

    this.updateState({ isPlaying: false, currentTrackIndex: prevIndex });
  }

  nextSong(): void {
    let nextIndex = this.audioState$.value.currentTrackIndex + 1;
    const tracks = this.audioState$.value.tracks;

    if (nextIndex >= tracks.length) {
      nextIndex = 0; // Loop back to the beginning
    }

    this.updateState({ isPlaying: false, currentTrackIndex: nextIndex });
  }
}
