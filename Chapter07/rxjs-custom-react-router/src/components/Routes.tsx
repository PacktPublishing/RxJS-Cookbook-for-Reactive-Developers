import { useObservableState } from "observable-hooks";
import { useRouter } from "../hooks/useRouter";
import { routeConfig } from "../contexts/RouterContext";

export const findMathingRoutePattern = (pathname: string, pattern: string) => {
    const pathPattern = pattern.split('/');
    const pathArray = pathname.split('/');

    if (pathPattern.length === pathArray.length && pathPattern[1] === pathArray[1]) {
      return pathname;
    }
}

export function Routes() {
    const { path$ } = useRouter();
    const pathname = useObservableState<any>(path$)
    
    if (!pathname) return;

    return routeConfig.map((route) => {
      const routePattern = findMathingRoutePattern(pathname, route.path);

      if (routePattern) {
        return route.element;
      }

      return null;
    });
  }