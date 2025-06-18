import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

// Try to import react-loader-spinner, fallback to custom spinner
let ThreeDots: any;
try {
  const { ThreeDots: Spinner } = require('react-loader-spinner');
  ThreeDots = Spinner;
} catch (error) {
  // Fallback to custom spinner if react-loader-spinner fails
  ThreeDots = ({ height, width, color, ...props }: any) => (
    <LoadingSpinner size={Math.max(height, width)} color={color} />
  );
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear auth error when component mounts
  useEffect(() => {
    clearError();
  }, []); // Only run once on mount

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-5 transition-colors duration-300">
      <div className="bg-bg-secondary border border-border-color rounded-2xl p-10 w-full max-w-md shadow-lg backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-text-primary text-3xl font-bold mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-text-secondary text-base">
            Sign in to continue to Tryit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {authError && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {authError}
            </div>
          )}

          <div className="space-y-2 min-h-[85px]">
            <label htmlFor="email" className="text-text-primary text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 px-4 border-2 border-border-color rounded-lg text-base bg-bg-primary text-text-primary transition-all duration-300 font-inherit focus:outline-none focus:border-accent-primary focus:ring-3 focus:ring-accent-primary ${
                errors.email ? 'border-danger ring-danger' : ''
              }`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-danger text-xs font-medium block min-h-[16px]">
                {errors.email}
              </span>
            )}
          </div>

          <div className="space-y-2 min-h-[85px]">
            <label htmlFor="password" className="text-text-primary text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-12 px-4 pr-12 border-2 border-border-color rounded-lg text-base bg-bg-primary text-text-primary transition-all duration-300 font-inherit focus:outline-none focus:border-accent-primary focus:ring-3 focus:ring-accent-primary ${
                  errors.password ? 'border-danger ring-danger' : ''
                }`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-bg-primary border-none cursor-pointer text-text-muted transition-colors duration-300 p-1 rounded flex items-center justify-center w-6 h-6 hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2 12 2 12C2 12 4.5 7.5 8.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 22 12 22 12C22 12 21.5 13.5 20.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-danger text-xs font-medium block min-h-[16px]">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent-primary text-white border-none rounded-lg py-4 text-base font-semibold cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2 mt-2 hover:bg-accent-secondary disabled:bg-text-muted disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ThreeDots 
                height="20" 
                width="20" 
                radius="9"
                color="#ffffff" 
                ariaLabel="loading"
                visible={true}
              />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-border-color">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-primary font-semibold transition-colors duration-300 hover:text-accent-secondary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 