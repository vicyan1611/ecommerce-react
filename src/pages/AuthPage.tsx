import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

type AuthMode = "login" | "register";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const handleAuthSuccess = () => {
    // Redirect to home page after successful auth
    navigate("/");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  mode === "login"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  mode === "register"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setMode("register")}
              >
                Sign Up
              </button>
            </div>

            {/* Form Header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "Welcome Back!" : "Create Account"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {mode === "login"
                  ? "Sign in to your account to continue"
                  : "Join us and start shopping today"}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="mb-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </p>
              </div>
            )}

            {/* Auth Forms */}
            <div className={loading ? "opacity-50 pointer-events-none" : ""}>
              {mode === "login" ? (
                <LoginForm onSuccess={handleAuthSuccess} />
              ) : (
                <RegisterForm onSuccess={handleAuthSuccess} />
              )}
            </div>

            {/* Switch Mode Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {mode === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
