/**
 * User Form Modal Component
 * 
 * Why Modal-based form:
 * - Better UX for create/edit flows
 * - Keeps context (doesn't navigate away)
 * - Reusable for both create and edit
 * - Clean separation of concerns
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import type { User, UserRole } from '../../../types';
import LoadingSpinner from '../../../components/LoadingSpinner';

// Form schema - password is optional for edit mode
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'manager', 'viewer']),
  isActive: z.boolean(),
});

const editUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'manager', 'viewer']),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof createUserSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: User | null;
  isLoading?: boolean;
}

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: UserFormModalProps) => {
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
      name: user?.name || '',
      role: user?.role || 'viewer',
      isActive: user?.isActive ?? true,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        password: '',
        name: user.name,
        role: user.role,
        isActive: user.isActive ?? true,
      });
    } else {
      reset({
        email: '',
        password: '',
        name: '',
        role: 'viewer',
        isActive: true,
      });
    }
  }, [user, reset]);

  const onFormSubmit = async (data: UserFormData) => {
    // Remove password if empty (for edit mode)
    if (isEditMode && !data.password) {
      const { password, ...rest } = data;
      await onSubmit(rest as UserFormData);
    } else {
      await onSubmit(data);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            {isEditMode ? 'Edit User' : 'Create New User'}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isEditMode}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password {isEditMode ? '(leave empty to keep current)' : '*'}
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                {...register('role')}
                id="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="viewer">Viewer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default UserFormModal;

