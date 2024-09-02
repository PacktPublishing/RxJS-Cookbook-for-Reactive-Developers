import { LoaderFunctionArgs, Params, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { About } from './components/About';
import { ajax } from 'rxjs/ajax';

const routes = [
  {
    path: "/home/:recipeId",
    element: <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  },
  {
    path: "/about",
    element: <About />,
    loader: ({ params }: LoaderFunctionArgs) => {
      return ajax<any>(`https://super-recipes.com/api/recipes/${params.recipeId}`).subscribe()
    },
  },
]

const router = createBrowserRouter(routes);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;