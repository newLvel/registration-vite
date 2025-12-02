import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiCalendar, FiBook, FiLogOut } from "react-icons/fi";

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state || {};

  if (!student.matricule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white text-center p-10 rounded-2xl shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            Please log in to view your dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">IUG Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-600 font-semibold"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Welcome, {student.firstName}!
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Your student dashboard is ready.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xl font-semibold text-gray-700">
              Your Matricule Number is:
            </p>
            <p className="text-4xl font-bold text-red-600 tracking-widest bg-gray-100 inline-block px-4 py-2 rounded-lg mt-2">
              {student.matricule}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoCard
                icon={<FiUser />}
                label="Full Name"
                value={`${student.firstName} ${student.lastName}`}
              />
              <InfoCard
                icon={<FiMail />}
                label="Email Address"
                value={student.email}
              />
              <InfoCard
                icon={<FiCalendar />}
                label="Date of Birth"
                value={student.dateOfBirth || "Not Provided"}
              />
              <InfoCard
                icon={<FiBook />}
                label="Faculty"
                value={student.faculty || "Not Provided"}
              />
              <InfoCard
                icon={<FiBook />}
                label="Department"
                value={student.department || "Not Provided"}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
    <div className="text-2xl text-red-500 mr-4">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default LandingPage;
