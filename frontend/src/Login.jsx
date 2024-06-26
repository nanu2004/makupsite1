import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: 'top-center',
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: 'top-center',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', inputValue);
      const { message, token, userId } = data;

      if (token) {
        handleSuccess(message);
        Cookies.set('token', token, { expires: 1 });
        setAuth({ user: { userId }, token });

        // Redirect to the path the user was trying to access or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from); // Perform navigation after setting auth state
      } else {
        handleError('Login failed');
      }
    } catch (error) {
      handleError(error.response.data.message);
    }
  };

  // Check if user is already authenticated and redirect
  if (auth && auth.token) {
    navigate('/dashboard');
    return null; // Or render a loading spinner or redirect immediately
  }

  return (
    <div className="form_container mx-auto max-w-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Login Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
        <span className="text-gray-600">
          Do not have an account?{' '}
          <Link to={'/signup'} className="text-blue-600 hover:text-blue-800">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
