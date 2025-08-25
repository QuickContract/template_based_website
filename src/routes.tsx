import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
} from 'react-icons/md';
import { asIcon } from 'utils/iconUtils';

// Admin Imports
import MainDashboard from 'views/admin/default';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={asIcon(MdHome)} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={asIcon(MdLock)} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
