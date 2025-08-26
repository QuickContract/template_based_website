import React, { useEffect } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/sidebar/DashboardSidebar';
import Topbar from '../../components/navbar/DashboardTopbar';
import CreateContract from '../../views/dashboard/CreateContract';
import AllContracts from '../../views/dashboard/AllContracts';

export default function DashboardLayout() {
  const { isLoggedIn } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Prevent back navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Keep user on dashboard
      navigate('/dashboard/create-contract', { replace: true });
    };

    // Prevent back button
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Disable browser back button
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, '', window.location.href);
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <Box>
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box
        float="right"
        minHeight="100vh"
        height="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        w={{ base: '100%', lg: 'calc( 100% - 280px )', xl: 'calc( 100% - 300px )' }}
        maxWidth={{ base: '100%', lg: 'calc( 100% - 280px )', xl: 'calc( 100% - 300px )' }}
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Topbar onOpen={onOpen} />
        <Box p={{ base: '20px', md: '30px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/create-contract" replace />} />
            <Route path="create-contract" element={<CreateContract />} />
            <Route path="all-contracts" element={<AllContracts />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
