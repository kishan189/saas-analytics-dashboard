/**
 * User Table Component
 * 
 * Why TanStack Table:
 * - Powerful sorting, filtering, pagination
 * - Virtual scrolling for large datasets
 * - Type-safe column definitions
 * - Flexible and performant
 */

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import type { User } from '../../../types';
import { useToggleUserStatusMutation } from '../api/usersApiSlice';
import toast from 'react-hot-toast';
import { Badge } from '../../../components/ui';

interface UserTableProps {
  data: User[];
  isLoading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  currentUserId?: string; // Current logged-in user ID to prevent self-deletion
}

const UserTable = ({ data, isLoading, onEdit, onDelete, currentUserId }: UserTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [toggleStatus] = useToggleUserStatusMutation();

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleStatus(userId).unwrap();
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to toggle user status');
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => {
        const role = info.getValue() as string;
        const roleVariants: Record<string, 'default' | 'danger' | 'info'> = {
          admin: 'danger',
          manager: 'info',
          viewer: 'default',
        };
        return (
          <Badge variant={roleVariants[role] || 'default'} size="sm">
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <Badge variant={isActive ? 'success' : 'default'} size="sm">
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleToggleStatus(user._id, user.isActive ?? true)}
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(user._id)}
                disabled={user._id === currentUserId}
                className={`text-sm font-medium transition-colors ${
                  user._id === currentUserId
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                }`}
                title={user._id === currentUserId ? 'You cannot delete your own account' : 'Delete user'}
              >
                Delete
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="text-gray-400 dark:text-gray-500">
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted() as string] ?? '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

