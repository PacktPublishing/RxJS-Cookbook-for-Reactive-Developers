import {
  Card,
  CardContent,
  Typography,
  Chip,
  CardMedia,
  CardActionArea,
  Box,
  Modal,
} from "@mui/material";
import { Recipe } from "../../types/recipes.type";
import {
  setSelectedRecipe,
  useSelectedRecipes,
} from "../../state/recipes.state";
import { useState } from "react";

interface IRecipeItem {
  recipe: Recipe;
}

const RecipeItem = ({ recipe }: IRecipeItem) => {
  const [open, setOpen] = useState(false);
  const selectedRecipe = useSelectedRecipes();
  const handleClose = () => setOpen(false);

  const handleSelectRecipe = () => {
    setSelectedRecipe(recipe.id);
    setOpen(true);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedRecipe?.data?.name}
          </Typography>
        </Box>
      </Modal>
      <CardActionArea onClick={handleSelectRecipe}>
        <Card onClick={handleSelectRecipe}>
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
