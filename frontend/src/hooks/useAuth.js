import { useSelector, useDispatch } from "react-redux";
import { login, logout, updateProfile } from "../redux/slices/authSlice";

export function useAuth() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return {
    user,
    isAuthenticated,
    login: (userData) => dispatch(login(userData)),
    logout: () => dispatch(logout()),
    updateProfile: (data) => dispatch(updateProfile(data)),
  };
}
