import { Navigate } from "react-router-dom";
import { useAuthValue } from "../context/AuthContextProvider";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthValue();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;