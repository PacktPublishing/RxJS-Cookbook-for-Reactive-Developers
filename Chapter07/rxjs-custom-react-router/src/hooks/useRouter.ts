import { useContext } from "react";
import { RouterContext } from "../contexts/RouterContext";

export function useRouter() {
  return useContext(RouterContext);
}