import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import {} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import DashboardLayout from './layouts/dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  ChakraProvider,
  ColorModeScript,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
// Chakra imports

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <>
      <ColorModeScript initialColorMode="light" />
      <ChakraProvider theme={currentTheme}>
        <AuthProvider>
          <Routes>
            <Route path="auth/*" element={<AuthLayout />} />
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
          </Routes>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
