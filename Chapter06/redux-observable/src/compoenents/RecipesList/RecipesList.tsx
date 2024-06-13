import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchRecipes } from '../../store/reducer';
import { RootState } from "../../store";
import RecipeItem from "../RecipeItem/RecipeItem";

const RecipesList = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state:  RootState) => state.recipesState);

  useEffect(() => {
    dispatch(fetchRecipes()); 
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {recipes.map((recipe) => (<RecipeItem recipe={recipe} />))}
    </div>
  );
};

export default RecipesList;
