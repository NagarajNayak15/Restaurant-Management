import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import OwnerLogin from './pages/OwnerLogin';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import { OrderNotificationsProvider } from './components/layout/OrderNotificationsProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <OwnerLogin />,
  },
  {
    path: '/dashboard',
    element: <OwnerRoute><Dashboard /></OwnerRoute>,
  },
  {
    path: '/orders',
    element: <OwnerRoute><Orders /></OwnerRoute>,
  },
  {
    path: '/tables',
    element: <OwnerRoute><Tables /></OwnerRoute>,
  },
  {
    path: '/menu',
    element: <OwnerRoute><Menu /></OwnerRoute>,
  },
  {
    path: '/payments',
    element: <OwnerRoute><Payments /></OwnerRoute>,
  },
  {
    path: '/analytics',
    element: <OwnerRoute><Analytics /></OwnerRoute>,
  },
  {
    path: '/customers',
    element: <OwnerRoute><Customers /></OwnerRoute>,
  },
  {
    path: '/staff',
    element: <OwnerRoute><Staff /></OwnerRoute>,
  },
  {
    path: '/settings',
    element: <OwnerRoute><Settings /></OwnerRoute>,
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

function OwnerRoute({ children }) {
  return localStorage.getItem('ownerToken') ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <OrderNotificationsProvider>
      <RouterProvider router={router} />
    </OrderNotificationsProvider>
  );
}

export default App;