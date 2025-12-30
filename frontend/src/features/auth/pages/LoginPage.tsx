/**
 * Login Page
 * 
 * Visual Design:
 * - Modern, enterprise-grade authentication page
 * - Full-height centered layout
 * - Clean form with labels above inputs
 * - Subtle micro-interactions
 * - Professional SaaS appearance
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../api/authApiSlice';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../slice/authSlice';
import { ROUTES } from '../../../utils/constants';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      if (result.success && result.data) {
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
          })
        );

        toast.success('Login successful!');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 
        error?.data?.error || 
        error?.message || 
        'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };
  console.log("hhhh")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      {/* Optional split layout on large screens */}
      <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left side: Brand/Illustration (hidden on mobile, shown on large screens) */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="mb-8">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">SA</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
              SaaS Analytics
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track your business metrics and make data-driven decisions.
            </p>
          </div>
        </div>

        {/* Right side: Auth Card */}
        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
            {/* Logo/Brand (shown on mobile, hidden on large screens) */}
            <div className="lg:hidden mb-8 text-center">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                SaaS Analytics
              </h1>
            </div>

            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  autoComplete="email"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Secondary Action */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
