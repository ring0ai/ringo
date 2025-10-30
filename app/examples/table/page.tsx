import { DataTable } from '@/components/ui/data-table';
import { columns, Payment } from './columns';

// Generate mock data
function generateMockData(): Payment[] {
  const statuses: Payment['status'][] = [
    'pending',
    'processing',
    'success',
    'failed',
  ];
  const emails = [
    'john.doe@example.com',
    'jane.smith@company.org',
    'bob.wilson@startup.io',
    'alice.johnson@enterprise.com',
    'charlie.brown@agency.net',
    'emma.davis@tech.co',
    'michael.jones@business.com',
    'sophia.garcia@design.studio',
    'william.martinez@consulting.firm',
    'olivia.rodriguez@marketing.pro',
    'james.lee@development.io',
    'isabella.walker@creative.agency',
    'benjamin.hall@finance.corp',
    'mia.allen@education.org',
    'lucas.young@health.care',
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: Math.random().toString(36).substring(2, 10),
    amount: Math.floor(Math.random() * 1000) + 50,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
  }));
}

// Server Component
export default async function TableExamplePage() {
  // In a real app, this would be fetched from a database
  const payments = generateMockData();

  return <DataTable columns={columns} data={payments} searchKey='email' />;
}
