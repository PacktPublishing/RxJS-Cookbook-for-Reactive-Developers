import { useObservable } from "observable-hooks";
import { fromEvent, startWith, map } from "rxjs";

function extractSearchParams(searchParams: string): { [key: string]: string } {
  const params = new URLSearchParams(searchParams);
  const result: { [key: string]: string } = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function useSearchParams() {
  const params$ = useObservable(() =>
    fromEvent(window, "popstate").pipe(
      startWith(window.location.search),
      map(() => extractSearchParams(window.location.search))
    )
  );

  return params$;
}
