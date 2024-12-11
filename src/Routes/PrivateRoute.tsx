import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { ReactNode } from "react";
import { useAppSelector } from "../redux/hook";

type TProtectedRoute = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: TProtectedRoute) => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

export default PrivateRoute;
