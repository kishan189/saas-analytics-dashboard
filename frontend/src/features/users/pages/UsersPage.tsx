/**
 * Users Management Page
 * 
 * Why this structure:
 * - Feature-based organization
 * - Clear separation of concerns
 * - Reusable components
 * - Optimistic UI updates
 * - Comprehensive error handling
 */

import { useState } from 'react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '../api/usersApiSlice';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import type { User } from '../../../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAppSelector } from '../../../app/hooks';
import { PageHeader, Button, Card } from '../../../components/ui';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Get current user to prevent self-deletion
  const currentUser = useAppSelector((state) => state.auth.user);

  // Query users
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery({
    page,
    limit: 10,
    search,
    role: (roleFilter as 'admin' | 'manager' | 'viewer') || undefined,
    isActive: isActiveFilter || undefined,
  });

  // Mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleCreateUser = async (data: CreateUserPayload) => {
    try {
      await createUser(data).unwrap();
      toast.success('User created successfully');
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (data: UpdateUserPayload) => {
    if (!editingUser) return;

    try {
      await updateUser({ id: editingUser._id, data }).unwrap();
      toast.success('User updated successfully');
      setIsModalOpen(false);
      setEditingUser(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      toast.success('User deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  if (isError) {
    return (
      <div>
        <PageHeader
          title="User Management"
          description="Manage users and their permissions"
        />
        <Card variant="default" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-300 mb-4">
            Error loading users: {error && 'data' in error ? (error.data as any)?.message : 'Unknown error'}
          </p>
          <Button variant="danger" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage users and their permissions"
        actions={
          <Button variant="primary" onClick={handleCreate}>
            + Create User
          </Button>
        }
      />

      {/* Toolbar: Filters */}
      <Card variant="default" className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="sm:w-48">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="sm:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              value={isActiveFilter}
              onChange={(e) => {
                setIsActiveFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <Card variant="default">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : (
        <>
          <Card variant="default" className="overflow-hidden">
            <UserTable
              data={usersData?.data || []}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
              currentUserId={currentUser?._id}
            />
          </Card>

          {/* Pagination */}
          {usersData?.pagination && usersData.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((page - 1) * 10) + 1} to{' '}
                {Math.min(page * 10, usersData.pagination.total)} of{' '}
                {usersData.pagination.total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= usersData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={async (data) => {
          if (editingUser) {
            // For edit mode, password is optional
            const updateData: UpdateUserPayload = {
              email: data.email,
              name: data.name,
              role: data.role,
              isActive: data.isActive,
            };
            // Only include password if provided
            if ('password' in data && data.password) {
              updateData.password = data.password;
            }
            await handleUpdateUser(updateData);
          } else {
            // For create mode, password is required
            await handleCreateUser(data as CreateUserPayload);
          }
        }}
        user={editingUser}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default UsersPage;
