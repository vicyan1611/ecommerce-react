import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, logout } from "../store/authSlice";
import { ME_QUERY } from "../api/queries";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [meQuery] = useLazyQuery(ME_QUERY);

  useEffect(() => {
    // Check if there's a stored token and validate it
    if (accessToken) {
      // Make a query to validate the token and get user info
      meQuery()
        .then(({ data, error }) => {
          if (data?.me) {
            dispatch(setUser(data.me));
          } else if (error) {
            // Token is invalid, remove it
            console.error("Token validation failed:", error);
            dispatch(logout());
          }
        })
        .catch((error) => {
          console.error("Error validating token:", error);
          dispatch(logout());
        });
    }
  }, [accessToken, dispatch, meQuery]);

  return <>{children}</>;
};

export default AuthInitializer;
