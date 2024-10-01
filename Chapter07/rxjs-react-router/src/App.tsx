import { LoaderFunctionArgs, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { About } from './components/About';
import { ajax } from 'rxjs/ajax';
import { Login } from './components/Login';

const routes = [
  {
    path: "/home",
    element: <ProtectedRoute>
      <Home />
    </ProtectedRoute>,
  },
  {
    path: "/about/:recipeId",
    element: <About />,
    loader: ({ params }: LoaderFunctionArgs) => {
      return ajax<any>(`https://super-recipes.com/api/recipes/${params.recipeId}`).subscribe()
    },
  },
  {
    path: "/login",
    element: <Login />,
  },
]

const router = createBrowserRouter(routes);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;