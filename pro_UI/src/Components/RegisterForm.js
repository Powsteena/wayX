import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, X } from 'lucide-react';

const ModalRegister = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('email', formData.email);
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setFormData({ username: '', email: '', password: '' });
      setErrors({});
      setServerError('');
      
      // Delay navigation to show success message
      setTimeout(() => {
        onClose();
        navigate('/user-panel');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSwitchToLogin = () => {
    setFormData({ username: '', email: '', password: '' });
    setErrors({});
    setServerError('');
    setSuccessMessage('');
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-md mx-4">
          <div className="group relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-600/20">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-yellow-600 hover:text-yellow-400 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-600 rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-600 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-600 rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-600 rounded-br-lg" />

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-300 bg-clip-text text-transparent">
                Join Us Today
              </h2>
              <p className="text-yellow-600/60 text-sm mt-2">Create your account</p>
            </div>

            {/* Error/Success Messages */}
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center">
                {serverError}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="relative group/input">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600/50" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/50 text-yellow-600 border border-yellow-600/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-600 placeholder-yellow-600/30"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative group/input">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 text-yellow-600 border border-yellow-600/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-600 placeholder-yellow-600/30"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative group/input">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/50 text-yellow-600 border border-yellow-600/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-600 placeholder-yellow-600/30"
                  placeholder="Choose a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600/50 hover:text-yellow-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group/button"
              >
                <div className="absolute inset-0 bg-yellow-600 rounded-xl opacity-50 blur-lg group-hover/button:opacity-100 transition-opacity duration-500" />
                <div className="relative w-full bg-yellow-600 text-black py-3 px-4 rounded-xl font-bold hover:bg-yellow-400 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 animate-bounce-x" />
                    </>
                  )}
                </div>
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-yellow-600/60">
                  Already have an account?{' '}
                  <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-yellow-600 hover:text-yellow-400 font-medium inline-flex items-center space-x-1 group"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegister;

