import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp && decoded.exp > now;
  } catch (e) {
    return false;
  }
};

const AuthGuard = ({ requireAuth, children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && isTokenValid(token);

  if (requireAuth && !isAuthenticated) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

AuthGuard.propTypes = {
  requireAuth: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default AuthGuard;