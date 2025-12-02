import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import registrationImage from './assets/IUG-university.jpg'; 

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    faculty: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const faculties = {
    "Science": ["Physics", "Chemistry", "Biology"],
    "Arts": ["History", "Literature", "Languages"],
    "Engineering": ["Mechanical", "Electrical", "Civil"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset department if faculty changes
      ...(name === 'faculty' && { department: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register.');
      }

      navigate('/landing', { state: { ...data } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl max-w-5xl w-full">
        {/* Left side: Image */}
        <div className="hidden md:block w-full md:w-1/2">
          <img src={registrationImage} alt="University illustration" className="object-cover w-full h-full rounded-l-2xl" />
        </div>

        {/* Right side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Account</h1>
          <p className="text-gray-600 mb-8">Join our community of students.</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First Name" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <InputField label="Last Name" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <InputField label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <InputField label="Date of Birth" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Faculty" id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} options={Object.keys(faculties)} />
              <SelectField label="Department" id="department" name="department" value={formData.department} onChange={handleChange} options={formData.faculty ? faculties[formData.faculty] : []} disabled={!formData.faculty} />
            </div>

            <InputField label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <InputField label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105 disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Already have an account? <Link to="/login" className="font-medium text-red-600 hover:text-red-500">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components for form fields
const InputField = ({ label, id, name, type = 'text', value, onChange, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} id={id} name={name} value={value} onChange={onChange} required={required} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"/>
  </div>
);

const SelectField = ({ label, id, name, value, onChange, options, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
      <option value="">Select {label}</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

export default RegistrationPage;

