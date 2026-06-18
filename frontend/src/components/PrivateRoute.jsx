// src/components/PrivateRoute.jsx
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const PrivateRoute = ({children}) => {
  const {authenticated, loading} = useAuth();

  if (loading) return <div>Loading...</div>; // or a spinner

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
