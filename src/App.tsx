// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContexts';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterPassenger from './pages/auth/RegisterPassenger';
import RegisterRider from './pages/auth/RegisterRider';

// Passenger Pages
import PassengerDashboard from './pages/passenger/Dashboard';
import CreatePackage from './pages/passenger/CreatePackage';
import MyPackages from './pages/passenger/MyPackages';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import AvailablePackages from './pages/rider/AvailablePackages';
import MyDeliveries from './pages/rider/MyDeliveries';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageUsers from './pages/admin/ManageUsers';

// Common Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Private route component
import PrivateRoute from './components/common/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
              </Route>
              
              {/* Auth routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register/passenger" element={<RegisterPassenger />} />
                <Route path="register/rider" element={<RegisterRider />} />
              </Route>
              
              {/* Passenger routes */}
              <Route path="/passenger" element={
                <PrivateRoute allowedUserType="passenger">
                  <MainLayout />
                </PrivateRoute>
              }>
                <Route index element={<PassengerDashboard />} />
                <Route path="packages/new" element={<CreatePackage />} />
                <Route path="packages" element={<MyPackages />} />
              </Route>
              
              {/* Rider routes */}
              <Route path="/rider" element={
                <PrivateRoute allowedUserType="rider">
                  <MainLayout />
                </PrivateRoute>
              }>
                <Route index element={<RiderDashboard />} />
                <Route path="packages/available" element={<AvailablePackages />} />
                <Route path="deliveries" element={<MyDeliveries />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <PrivateRoute allowedUserType="admin">
                  <MainLayout />
                </PrivateRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="packages" element={<ManagePackages />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;