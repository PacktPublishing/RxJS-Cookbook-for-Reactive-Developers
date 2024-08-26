import { useObservable } from "observable-hooks";
import { fromEvent, startWith, scan } from "rxjs";

function extractParamsFromPath(params: { [key: string]: string }, path: string, patternParts: string[]): { [key: string]: string } {
  const pathParts = path.split('/');

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i] || '';
    }
  }

  return params;
}

export function useParams() {
  const params$ = useObservable(() =>
    fromEvent(window, 'popstate').pipe(
      startWith(window.location.pathname),
      scan((params: any, path: any) => extractParamsFromPath(params, path, ['', 'about', ':id']), {})
    )
  );
  
  return params$;
}