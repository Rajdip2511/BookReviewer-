import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/apiSlice';
import { logout } from '../slices/authSlice';
import './Header.css';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      // First clear the Redux state and localStorage
      dispatch(logout());
      
      // Then call the API to logout on the server
      await logoutApiCall().unwrap();
      
      // Force navigate to login page
      navigate('/login', { replace: true });
      
      // Reload the page to ensure clean state
      window.location.reload();
    } catch (err) {
      console.error(err);
      // Even if API call fails, still logout locally and redirect
      dispatch(logout());
      navigate('/login', { replace: true });
      window.location.reload();
    }
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            Book Reviewer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <>
                  <Nav.Link as={Link} to='/profile'>
                    Profile
                  </Nav.Link>
                  <Nav.Link onClick={logoutHandler} role="button">Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to='/login'>
                    Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to='/register'>
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 