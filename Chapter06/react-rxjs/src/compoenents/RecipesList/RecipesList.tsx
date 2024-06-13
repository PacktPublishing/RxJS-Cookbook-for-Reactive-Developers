import { CircularProgress } from "@mui/material";
import { Recipe, ResponseStatus } from "../../types/recipes.type";
import RecipeItem from "../RecipeItem/RecipeItem";
import { useRecipes } from "../../state/recipes.state";

const RecipesList = () => {
  const { data, status } = useRecipes();

  if (status === ResponseStatus.Loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {data &&
        data.map((recipe: Recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
    </div>
  );
};

export default RecipesList;
