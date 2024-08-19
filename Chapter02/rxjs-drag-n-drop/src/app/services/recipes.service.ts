import { Injectable } from '@angular/core';
import { Observable, endWith, map, mergeAll, of, scan, takeUntil, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileWithProgress } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  validateFiles$(files$: Observable<File>): Observable<FileWithProgress> {
    return files$.pipe(
      map((file: File) => {
        const newFile: FileWithProgress = new File([file], file.name, { type: file.type });

        if (file.type === 'image/png') {
          newFile.progress = 0;
          newFile.valid = true;
        } else {
          newFile.error = 'Invalid file type';
          newFile.progress = -1;
          newFile.valid = false;
        }

        return of(newFile);
      }),
      mergeAll()
    );
  }

  uploadFile$(file: File): Observable<any> {
    return this.httpClient.post('https://super-recipes.com/api/recipes/upload', file);
  }

  fileUploadProgress$(file: File): Observable<FileWithProgress> {
    const uploadedFile: FileWithProgress = new File([file], file.name, { type: file.type });
    uploadedFile.progress = 100;
    uploadedFile.valid = true;

    const progress$ = timer(300, 2000).pipe(
      map(() => Number((Math.random() * 25 + 5).toFixed(2))),
      scan((acc, curr) => Math.min(acc + curr, 95), 0),
      map((progress: number) => {
        const newFile: FileWithProgress = new File([file], file.name, { type: file.type });
        newFile.progress = progress;
        newFile.valid = true;

        return newFile;
      }),
      takeUntil(this.uploadFile$(file)),
      endWith(uploadedFile)
    );

    return progress$;
  }

  uploadFileWithProgress$(file: FileWithProgress): Observable<FileWithProgress> {
    return this.fileUploadProgress$(file);
  }

}
