import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const getDecodedToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

const isTokenValid = (decoded) => {
  const now = Date.now() / 1000;
  return decoded?.exp && decoded.exp > now && decoded.role !== 'USER';
};

const AuthGuard = ({ requireAuth, restrictedArea = false, children }) => {
  const token = localStorage.getItem('token');
  const decoded = getDecodedToken(token);
  const isAuthenticated = token && isTokenValid(decoded);

  if (requireAuth && !isAuthenticated) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAuth && restrictedArea && decoded?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

AuthGuard.propTypes = {
  requireAuth: PropTypes.bool.isRequired,
  restrictedArea: PropTypes.bool,
  children: PropTypes.any,
};

export default AuthGuard;