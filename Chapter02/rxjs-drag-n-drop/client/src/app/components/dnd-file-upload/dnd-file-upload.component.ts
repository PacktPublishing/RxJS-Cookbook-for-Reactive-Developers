import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
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
  repeat, from, mergeAll,
  Observable,
  EMPTY, Subject
} from 'rxjs';
import { FileWithProgress } from '../../types/file-upload.type';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-dnd-file-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './dnd-file-upload.component.html',
  styleUrl: './dnd-file-upload.component.scss'
})
export class DndFileUploadComponent {
  validFiles = new Map<string, FileWithProgress>();
  @ViewChild('dropzoneElement') dropzoneElement!: ElementRef;
  private destroy$ = new Subject<void>();

  constructor(private fileUploadService: FileUploadService, private _snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    const dropzone = this.dropzoneElement.nativeElement as HTMLDivElement;

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
        tap((event: DragEvent) => event.preventDefault()),
        switchMap((event: DragEvent) => {
          const files$ = from(Array.from(event.dataTransfer!.files));

          return this.fileUploadService.validateFiles$(files$);
        }),
        map((file: FileWithProgress) => this.handleFileValidation$(file)),
        mergeAll(),
        takeUntil(droppable$.pipe(filter((isDroppable) => !isDroppable))),
        repeat()
      )
      .subscribe({
        next: (file: FileWithProgress) => this.validFiles.set(file.name, file),
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleFileValidation$(file: FileWithProgress): Observable<FileWithProgress | never> {
    if (!file.valid) {
      this._snackBar.open(`Invalid file ${file.name} upload.`, 'Close', {
        duration: 4000
      });

      return EMPTY;
    }

    return this.fileUploadService.uploadFileWithProgress$(file);
  }

  retryUpload(file: FileWithProgress): void {
    this.fileUploadService.uploadFileWithProgress$(file).subscribe({
      next: (file: FileWithProgress) => this.validFiles.set(file.name, file),
      error: (err) => console.error(err),
    });
  }
}
