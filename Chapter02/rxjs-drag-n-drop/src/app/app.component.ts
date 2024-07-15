import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AfterViewInit,
  Component,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  fromEvent,
  tap,
  merge,
  map,
  filter,
  switchMap,
  takeUntil,
  of,
  repeat, from, concatMap
} from 'rxjs';
import { RecipesService } from './services/recipes.service';
import { FileWithProgress } from './types/recipes.type';
import { DndFileUploadComponent } from './components/dnd-file-upload/dnd-file-upload.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DndFileUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rxjs-drag-n-drop';
   
}
