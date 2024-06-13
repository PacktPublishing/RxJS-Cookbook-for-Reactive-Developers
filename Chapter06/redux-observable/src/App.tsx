import { Provider } from 'react-redux';
import './App.css'
import RecipesList from './compoenents/RecipesList/RecipesList'
import { store } from './store';

function App() {

  return (
    <Provider store={store}> 
      <RecipesList /> 
    </Provider>
  )
}

export default App
