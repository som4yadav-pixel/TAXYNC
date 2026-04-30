import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Library } from './pages/Library';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import MrQuillTour from './components/MrQuillTour';
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const SharedReport = lazy(() => import('./pages/SharedReport').then(module => ({ default: module.SharedReport })));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shared-report/:reportId" element={<SharedReport />} />
              
              {/* Protected Routes with Layout */}
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/library" element={<Library />} />
                        {/* Add other nested protected routes here */}
                      </Routes>
                      <MrQuillTour />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;