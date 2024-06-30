import { Injectable } from '@angular/core';
import { Observable, map, mergeAll, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileWithProgress } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  validateFiles(files: Observable<File>): Observable<{ valid: boolean, file: FileWithProgress }> {
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

  uploadFile(file: File): Observable<any> {
    return this.httpClient.post('https://super-recipes.com/api/recipes/upload', file);
  }

}
