import { CircularProgress } from "@mui/material";
import { Recipe, ResponseStatus } from "../../types/recipes.type";
import RecipeItem from "../RecipeItem/RecipeItem";
import { useRecipes } from "../../state/recipes.state";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const RecipesList = () => {
  const { data, status, error } = useRecipes();

  if (status === ResponseStatus.LOADING) {
    return <CircularProgress />;
  }

  if (status === ResponseStatus.ERROR) {
    return <ErrorMessage message={error} />;
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
