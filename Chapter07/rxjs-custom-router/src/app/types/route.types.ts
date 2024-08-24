import { Observable } from "rxjs";

export interface CustomRoute {
    path: string;
    queryParams?: Map<string, string>;
    component: any;
    canActivate?: (path: string) => Observable<boolean | URL>;
  }