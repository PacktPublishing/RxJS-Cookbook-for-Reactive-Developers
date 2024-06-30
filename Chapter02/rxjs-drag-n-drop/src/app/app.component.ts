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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'rxjs-drag-n-drop';
  validFiles: FileWithProgress[] = [];
  invalidFiles: FileWithProgress[] = [];
  @ViewChild('dropzoneElement') dropzoneElement!: ElementRef;

  constructor(private recipeService: RecipesService) {}

  ngAfterViewInit(): void {
    const dropzone = this.dropzoneElement.nativeElement;

    const dragenter$ = fromEvent<DragEvent>(dropzone, 'dragenter');
    const dragover$ = fromEvent<DragEvent>(dropzone, 'dragover').pipe(
      tap((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'copy';
        (event.target as Element).classList.add('dragover');
      })
    );
    const dragleave$ = fromEvent<DragEvent>(dropzone, 'dragleave').pipe(
      tap((event: DragEvent) => {
        (event.target as Element).classList.remove('dragover');
      })
    );
    const drop$ = fromEvent<DragEvent>(dropzone, 'drop').pipe(
      tap((event: DragEvent) => {
        (event.target as Element).classList.remove('dragover');
      })
    );

    const droppable$ = merge(
      dragenter$.pipe(map(() => true)),
      dragover$.pipe(map(() => true)),
      dragleave$.pipe(map(() => false))
    );

    drop$
      .pipe(
        tap((event) => event.preventDefault()),
        switchMap((event) => {
          const files$ = from(Array.from(event.dataTransfer!.files));

          return this.recipeService.validateFiles(files$);
        }),
        concatMap(file => {
          if (!file.valid) {
            return of(file);
          }

          return merge(
            of(file), 
            this.recipeService.uploadFile(file.file)
          );
        }),
        takeUntil(droppable$.pipe(filter((isDroppable) => !isDroppable))),
        repeat()
      )
      .subscribe({
        next: (file) => {
          if (file.valid) {
            this.validFiles.push(file.file);
          }  
          
          if (!file.valid){
            this.invalidFiles.push(file.file);
          }
        }
      });
  }

  
}
