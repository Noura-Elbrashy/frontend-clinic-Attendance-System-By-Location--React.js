

// دمج اليوزر والداش بورد ادمن بعد 
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { apiGet } from './helpers/api';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Attendance from './pages/Attendance';
// import NotFound from './pages/NotFound';
// import Navbar from './components/Navbar';
// import UserProfile from './pages/UserProfile';
// import AdminDashboard from './pages/AdminDashboard';
// import AdminBranches from './pages/AdminBranches';
// import ErrorBoundary from './components/ErrorBoundary';
// import ActivateAccount from './components/ActivateAccount';
// import './index.css';

// function ProtectedRoute({ children }) {
//   const [isAdmin, setIsAdmin] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const checkAdmin = async () => {
//       try {
//         const res = await apiGet('/auth/profile');
//         setIsAdmin(res.data.role === 'admin');
//       } catch (err) {
//         console.error('Auth check error:', err);
//         setError(err.response?.data?.message || 'Authentication failed');
//         setIsAdmin(false);
//       }
//     };
//     checkAdmin();
//   }, []);

//   if (isAdmin === null) {
//     return <div>Loading...</div>;
//   }

//   if (!isAdmin) {
//     return <Navigate to="/not-found" replace />;
//   }

//   return error ? <div className="alert alert-danger">{error}</div> : children;
// }

// // New: For protected pages (non-admin) - redirect to / if no token
// function AuthenticatedRoute({ children }) {
//   const navigate = useNavigate();
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/');
//     }
//   }, [navigate]);

//   return children;
// }

// // New: For public pages like login and activation - redirect to /dashboard if token exists
// function PublicRoute({ children, isActivation = false }) {
//   const navigate = useNavigate();
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token && !isActivation) {
//       navigate('/dashboard');
//     }
//     // For activation, additional backend check is handled in ActivateAccount component
//   }, [navigate, isActivation]);

//   return children;
// }

// function App() {
//   const changeLanguage = (lang) => {
//     document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
//     document.documentElement.setAttribute('lang', lang);
//   };

//   document.documentElement.setAttribute('dir', 'rtl');
//   document.documentElement.setAttribute('lang', 'ar');

//   function Layout() {
//     const location = useLocation();
//     const noNavbarRoutes = ['/', '/not-found'];
//     const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/activate/');

//     return (
//       <>
//         {!isNoNavbarRoute && <Navbar changeLanguage={changeLanguage} />}
//         <div className="container mt-4">
//           <Routes>
//             <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
//             <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
//             <Route path="/attendance" element={<AuthenticatedRoute><Attendance /></AuthenticatedRoute>} />
//             <Route
//               path="/adminbranches"
//               element={
//                 <ProtectedRoute>
//                   <ErrorBoundary>
//                     <AdminBranches />
//                   </ErrorBoundary>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <ErrorBoundary>
//                     <AdminDashboard />
//                   </ErrorBoundary>
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/profile/:id" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
//             <Route path="/activate/:token" element={<PublicRoute isActivation={true}><ActivateAccount /></PublicRoute>} />
//             <Route path="/not-found" element={<NotFound />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </>
//     );
//   }

//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }

// export default App;
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from './helpers/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBranches from './pages/AdminBranches';
import ErrorBoundary from './components/ErrorBoundary';
import ActivateAccount from './components/ActivateAccount';
import AddEmployee from './pages/AddEmployee'; // New component for adding employees
import './index.css';

// ProtectedRoute for admin-only pages
function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiGet('/auth/profile');
        setIsAdmin(res.data.role === 'admin');
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.response?.data?.message || 'Authentication failed');
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/not-found" replace />;
  }

  return error ? <div className="alert alert-danger">{error}</div> : children;
}

// For protected pages (non-admin) - redirect to / if no token
function AuthenticatedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

// For public pages like login and activation - redirect to /dashboard if token exists
function PublicRoute({ children, isActivation = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isActivation) {
      navigate('/dashboard');
    }
    // For activation, additional backend check is handled in ActivateAccount component
  }, [navigate, isActivation]);

  return children;
}

function App() {
  const changeLanguage = (lang) => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');

  function Layout() {
    const location = useLocation();
    const noNavbarRoutes = ['/', '/not-found'];
    const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/activate/');

    return (
      <>
        {!isNoNavbarRoute && <Navbar changeLanguage={changeLanguage} />}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
            <Route path="/attendance" element={<AuthenticatedRoute><Attendance /></AuthenticatedRoute>} />
            <Route
              path="/adminbranches"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminBranches />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AddEmployee />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="/profile/:id" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            <Route path="/activate/:token" element={<PublicRoute isActivation={true}><ActivateAccount /></PublicRoute>} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;