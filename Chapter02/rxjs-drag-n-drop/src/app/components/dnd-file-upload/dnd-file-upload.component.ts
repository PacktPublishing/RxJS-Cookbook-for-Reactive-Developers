import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  Component,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  fromEvent,
  tap,
  merge,
  map,
  filter,
  switchMap,
  takeUntil,
  of,
  repeat, from, mergeAll
} from 'rxjs';
import { RecipesService } from '../../services/recipes.service';
import { FileWithProgress } from '../../types/recipes.type';

@Component({
  selector: 'app-dnd-file-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dnd-file-upload.component.html',
  styleUrl: './dnd-file-upload.component.scss'
})
export class DndFileUploadComponent {
  validFiles = new Map<string, FileWithProgress>();
  @ViewChild('dropzoneElement') dropzoneElement!: ElementRef;

  constructor(private recipeService: RecipesService, private _snackBar: MatSnackBar) {}

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

          return this.recipeService.validateFiles$(files$);
        }),
        map(file => {
          if (!file.valid) {
            return of(file);
          }

          return merge(
            of(file), 
            this.recipeService.uploadFileWithProgress$(file.file)
          );
        }),
        mergeAll(),
        takeUntil(droppable$.pipe(filter((isDroppable) => !isDroppable))),
        repeat()
      )
      .subscribe({
        next: (file) => {
          if (Object.keys(file).length === 0) return;

          if (file.valid && file.name) {
            this.validFiles.set(file.name, file);

            return;
          }
          
          if (!file.valid) {
            this._snackBar.open('Invalid file upload.', 'Close', {
              duration: 4000
            });
          }
        }
      });
  }
}
