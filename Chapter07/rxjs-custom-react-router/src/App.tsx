import './App.css'
import { RouterProvider } from './contexts/RouterContext'
import { Routes } from './components/Routes'

function App() {
  return (
    <>
    <RouterProvider>
      {/* <Navigation />
      <Routes /> */}
      <Routes />
    </RouterProvider>
    </>
  )
}

export default App
