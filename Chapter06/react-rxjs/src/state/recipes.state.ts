import { bind } from "@react-rxjs/core";
import { getRecipe$, getRecipes$ } from "../services/recipes.service";
import { switchMap } from "rxjs";
import { createSignal } from "@react-rxjs/utils";

export const [useRecipes, recipes$] = bind(getRecipes$());

const [selectedRecipe$, setSelectedRecipe] = createSignal<number>();

export const [useSelectedRecipes] = bind(
  selectedRecipe$.pipe(
    switchMap((selectRecipeId) => getRecipe$(selectRecipeId))
  ),
  null
);

export { setSelectedRecipe };
