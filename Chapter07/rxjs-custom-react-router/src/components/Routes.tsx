import { useObservableGetState } from "observable-hooks";
import { useRouter } from "../hooks/useRouter";
import { map } from "rxjs";
import { RouteConfig } from "../types/RouteConfig.type";

export const findMathingRoutePattern = (
  pathname: string,
  router: RouteConfig[]
): RouteConfig | null => {
  const pathArray = pathname.split("/");

  return (
    router.find(
      (route: RouteConfig) =>
        route.path.split("/").length === pathArray.length &&
        route.path
          .split("/")
          .every(
            (path: string, index: number) =>
              path === "" || path.startsWith(":") || path === pathArray[index]
          )
    ) || null
  );
};

export function Routes() {
  const { path$, router } = useRouter();
  const component = useObservableGetState(
    path$.pipe(
      map((pathname: string) => findMathingRoutePattern(pathname, router))
    ),
    null
  );

  if (!component) return;

  return (component as RouteConfig).element;
}
