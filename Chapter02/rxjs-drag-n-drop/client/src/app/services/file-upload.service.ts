import { Injectable } from '@angular/core';
import { Observable, catchError, endWith, filter, map, mergeAll, of } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { FileWithProgress } from '../types/file-upload.type';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

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

  getFileUploadProgress(event: HttpEvent<any>): number {
    const { type } = event;

    if (type === HttpEventType.Sent) {
      return 0;
    }

    if (type === HttpEventType.UploadProgress) {
      const percentDone = Math.round(100 * event.loaded / event.total!);
      return percentDone;
    }

    if (type === HttpEventType.Response) {
      return 100;
    }

    return 0;
  }

  createFileWithProgress(file: File, progress: number, error?: string): FileWithProgress {
    const newFile: FileWithProgress = new File([file], file.name, { type: file.type });
    newFile.progress = progress;
    newFile.valid = true;
    newFile.error = error ?? '';

    return newFile;
  }

  uploadFile$(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('upload', file);
    const req = new HttpRequest('POST', 'http://localhost:3333/api/recipes/upload', formData, {
      reportProgress: true,
      responseType: 'blob'
    });
    
    return this.httpClient.request(req).pipe(
      map((event: HttpEvent<any>) => this.getFileUploadProgress(event)),
      filter(progress => progress < 100),
    );
  }

  uploadFileWithProgress$(file: FileWithProgress): Observable<FileWithProgress> {
    return this.uploadFile$(file).pipe(
      map((progress: number) => this.createFileWithProgress(file, progress)),
      endWith(this.createFileWithProgress(file, 100)),
      catchError(() => {
        const newFile: FileWithProgress = this.createFileWithProgress(file, -1, 'Upload failed');

        return of(newFile);
      })
    );
  }
}
