import './App.css'
import { RouterProvider } from './contexts/RouterContext'
import { Routes } from './components/Routes'
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import { RouteConfig } from './types/RouteConfig.type';

export const routeConfig: RouteConfig[] = [
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/about/:id',
    element: <AboutPage />,
  },
];

function App() {
  return (
    <RouterProvider router={routeConfig}>
      <Routes />
    </RouterProvider>
  )
}

export default App
