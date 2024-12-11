import { Navigate } from "react-router-dom";
import { logout, selectCurrentUser } from "../redux/features/auth/authSlice";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";

type TProtectedRoute = {
  children: ReactNode;
};

const AdminRoute = ({ children }: TProtectedRoute) => {
  const user = useAppSelector(selectCurrentUser);

  let userRole;
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userRole = (user as any).role;
  }

  const dispatch = useAppDispatch();

  if (userRole !== undefined && userRole !== "admin") {
    dispatch(logout());
    return <Navigate to="/login" replace={true} />;
  }
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

export default AdminRoute;
