import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProfile from "../components/UserProfile";

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <UserProfile />
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
