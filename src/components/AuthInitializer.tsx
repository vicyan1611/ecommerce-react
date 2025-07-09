import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, logout } from "../store/authSlice";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if there's a stored token and validate it
    if (token) {
      // In a real app, you would validate the token with your backend
      // For now, we'll just check if it's the expected mock token
      if (token === "fake-jwt-token") {
        // In a real app, you would decode the JWT or make an API call to get user info
        // For now, we'll use the demo user
        dispatch(
          setUser({
            id: "user1",
            email: "demo@example.com",
            name: "Demo User",
          })
        );
      } else {
        // Invalid token, remove it
        dispatch(logout());
      }
    }
  }, [token, dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
