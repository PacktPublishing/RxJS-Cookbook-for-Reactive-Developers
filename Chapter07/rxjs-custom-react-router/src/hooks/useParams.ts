import { useObservable } from "observable-hooks";
import { fromEvent, startWith, scan, Observable } from "rxjs";
import { useRouter } from "./useRouter";
import { findMathingRoutePattern } from "../components/Routes";

function extractParamsFromPath(
  params: Record<string, string>,
  path: string,
  patternParts: string[]
): Record<string, string> {
  const pathParts = path?.split("/");

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i] || "";
    }
  }

  return params;
}

export function useParams(): Observable<{ [key: string]: string }> {
  const { router } = useRouter();
  const currentPathPatternParts =
    findMathingRoutePattern(window.location.pathname, router)?.path.split(
      "/"
    ) || [];

  const params$ = useObservable(() =>
    fromEvent(window, "popstate").pipe(
      startWith(window.location.pathname),
      scan(
        (params: {}, path: string) =>
          extractParamsFromPath(params, path, currentPathPatternParts),
        {}
      )
    )
  );

  return params$;
}
