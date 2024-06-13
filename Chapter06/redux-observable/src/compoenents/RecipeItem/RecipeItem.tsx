import {
  Card,
  CardContent,
  Typography,
  Chip,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { Recipe } from "../../types/recipes.type";

interface IRecipeItem {
  recipe: Recipe;
}

const RecipeItem = ({ recipe }: IRecipeItem) => {
  return (
    <>
      <CardActionArea>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {recipe.name}
            </Typography>
            <CardMedia
              component="img"
              height="140"
              image={recipe.image}
              alt={recipe.name}
            />
            {recipe.ingredients.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  );
};

export default RecipeItem;
