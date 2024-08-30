import { Observable } from "rxjs";

export interface CustomRoute {
  path: string;
  component: any;
  queryParams?: Map<string, string>;
  canActivate?: (path: string) => Observable<boolean | URL>;
}