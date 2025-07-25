import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAppDispatch } from "../store/hooks";
import { setLoading, loginSuccess, loginFailure } from "../store/authSlice";
import { LOGIN_MUTATION } from "../api/queries";
import type { LoginRequest } from "../types/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    dispatch(setLoading(true));

    try {
      const { data } = await loginMutation({
        variables: { data: formData },
      });

      if (data?.login) {
        dispatch(
          loginSuccess({
            user: data.login.user,
            accessToken: data.login.accessToken,
            refreshToken: data.login.refreshToken,
          })
        );
        onSuccess?.();
      } else {
        setError("Invalid email or password");
        dispatch(loginFailure());
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err.graphQLErrors?.[0]?.message || "Login failed. Please try again.";
      setError(errorMessage);
      dispatch(loginFailure());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
