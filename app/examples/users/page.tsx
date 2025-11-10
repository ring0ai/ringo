"use client"

import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

// Different data type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  lastActive: Date;
  status: 'active' | 'inactive';
};

// Different columns
const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <span
          style={{
            padding: '0.25rem 0.625rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor:
              role === 'admin'
                ? 'var(--destructive)'
                : role === 'moderator'
                ? 'var(--primary)'
                : 'var(--secondary)',
            color:
              role === 'admin'
                ? 'var(--destructive-foreground)'
                : role === 'moderator'
                ? 'var(--primary-foreground)'
                : 'var(--secondary-foreground)',
          }}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          style={{
            color:
              status === 'active'
                ? 'rgb(34, 197, 94)'
                : 'var(--muted-foreground)',
          }}
        >
          ● {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastActive',
    header: 'Last Active',
    cell: ({ row }) => {
      const date = new Date(row.getValue('lastActive'));
      return date.toLocaleDateString();
    },
  },
];

// Mock user data
const users: User[] = [
  {
    id: '1',
    name: 'John Administrator',
    email: 'admin@example.com',
    role: 'admin',
    lastActive: new Date(),
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Moderator',
    email: 'mod@example.com',
    role: 'moderator',
    lastActive: new Date(Date.now() - 86400000),
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob User',
    email: 'user@example.com',
    role: 'user',
    lastActive: new Date(Date.now() - 172800000),
    status: 'inactive',
  },
  // Add more mock data as needed...
];

export default async function UsersExamplePage() {
  return (
    <div
      className='container mx-auto py-10'
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
      }}
    >
      <h1
        className='text-3xl font-bold tracking-tight mb-8'
        style={{
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Users Management
      </h1>

      {/* Reusing the same DataTable component with different data */}
      <DataTable columns={userColumns} data={users} searchKey='name' />
    </div>
  );
}
