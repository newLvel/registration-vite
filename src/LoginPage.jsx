import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import loginImage from './assets/IUG-university.jpg'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setError('Invalid credentials. Please check your email and password.');
        } else {
          throw new Error(data.error || 'Login failed.');
        }
      } else {
        login(data); // Set user data in context
        // Navigation will happen automatically via ProtectedRoute logic
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
        {/* Left side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <InputField label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            <InputField label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                <label htmlFor="rememberMe" className="ml-2 block text-gray-900">Remember me</label>
              </div>
              <a href="#" className="font-medium text-red-600 hover:text-red-500">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105 disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account? <Link to="/register" className="font-medium text-red-600 hover:text-red-500">Sign up for free!</Link>
            </p>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="hidden md:block w-1/2">
          <img src={loginImage} alt="University illustration" className="object-cover w-full h-full rounded-r-2xl" />
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
    />
  </div>
);

export default LoginPage;
