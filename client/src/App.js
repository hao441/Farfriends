
//react react-router
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

//components
import Welcome from './components/Welcome';
import Farfriends from './components/Farfriends';
import Loading from './components/Loading';

//css
import './App.css';


const App = () => {

  const router = createBrowserRouter([
    { path: '/', element: <Welcome /> },
    { path: '/:farfriend', element: <Farfriends /> },
    { path: '/loading', element: <Loading /> }
  ])

  return (
    <RouterProvider router={router}>
      {router.routes}
    </RouterProvider>
  );
}

export default App;
