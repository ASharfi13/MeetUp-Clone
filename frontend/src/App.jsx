import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import AllGroups from './components/Groups/AllGroups';
import AllEvents from './components/Events/AllEvents';
import GroupComponent from './components/Groups/GroupComponent';
import EventComponent from './components/Events/EventComponent';
import CreateGroupForm from './components/Groups/CreateGroupForm';
import CreateEventComponent from './components/Events/CreateEventComponent';
import UpdateGroupComp from './components/Groups/UpdateGroupComp';
import UpdateEventComponent from './components/Events/UpdateEventComponent';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: "/groups",
        element: <AllGroups />
      },
      {
        path: "/events",
        element: <AllEvents />
      },
      {
        path: "/groups/:groupId",
        element: <GroupComponent />
      },
      {
        path: '/events/:eventId',
        element: <EventComponent />
      },
      {
        path: '/groups/new',
        element: <CreateGroupForm />
      },
      {
        path: '/groups/:groupId/events/new',
        element: <CreateEventComponent />
      },
      {
        path: '/groups/:groupId/edit',
        element: <UpdateGroupComp />
      },
      {
        path: '/events/:eventId/edit',
        element: <UpdateEventComponent />
      },
      {
        path: '*',
        element: <Navigate to='/' replace />
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
