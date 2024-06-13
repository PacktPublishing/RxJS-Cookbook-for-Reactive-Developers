import { Subscribe } from '@react-rxjs/core'
import './App.css'
import RecipesList from './compoenents/RecipesList/RecipesList'


function App() {
  console.log('App rendered')

  return (
    <Subscribe>
      <RecipesList />
    </Subscribe>
  )
}

export default App
