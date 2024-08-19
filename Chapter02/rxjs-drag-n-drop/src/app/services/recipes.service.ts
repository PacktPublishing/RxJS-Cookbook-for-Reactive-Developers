import { Injectable } from '@angular/core';
import { Observable, concat, endWith, finalize, interval, map, merge, mergeAll, of, scan, takeUntil, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileWithProgress } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  validateFiles$(files: Observable<File>): Observable<{ valid: boolean, file: FileWithProgress }> {
    return files.pipe(
      map((file) => {
        const newFile: FileWithProgress = new File([file], file.name, { type: file.type });

        if (file.type === 'image/png') {
          newFile.progress = 0;
        } else {
          newFile.error = 'Invalid file type';
        }

        return newFile;
      }),
      map((file: FileWithProgress) => {
        return of({
          valid: !file.error,
          file
        });
      }),
      mergeAll()
    );
  }

  uploadFile$(file: File): Observable<any> {
    return this.httpClient.post('https://super-recipes.com/api/recipes/upload', file).pipe(
      map(() => {
        const newFile: FileWithProgress = new File([file], file.name, { type: file.type });
        newFile.progress = 100;
        newFile.valid = true;

        return newFile;
      })
    );
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

  uploadFileWithProgress$(file: FileWithProgress): Observable<any> {
    return this.fileUploadProgress$(file);
  }

}
