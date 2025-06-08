import { Container } from 'react-bootstrap';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // If user is not logged in and trying to access a protected route, redirect to login
  if (!userInfo && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in and trying to access login/register, redirect to home
  if (userInfo && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="main-container">
      <Header />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
