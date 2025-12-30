/**
 * Registration Page
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
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../api/authApiSlice';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../slice/authSlice';
import { ROUTES } from '../../../utils/constants';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Zod schema for form validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['admin', 'manager', 'viewer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'viewer',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
          })
        );

        toast.success('Registration successful!');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

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
                Create your account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get started with your free account today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Full name
                </label>
                <input
                  {...registerField('name')}
                  type="text"
                  id="name"
                  autoComplete="name"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                  disabled={isLoading}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  {...registerField('email')}
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
                    {...registerField('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...registerField('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Role
                </label>
                <select
                  {...registerField('role')}
                  id="role"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                  disabled={isLoading}
                  aria-invalid={errors.role ? 'true' : 'false'}
                  aria-describedby={errors.role ? 'role-error' : undefined}
                >
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p id="role-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98] mt-6"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Secondary Action */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
