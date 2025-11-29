import { DataTable } from '@/components/ui/data-table';
import Pill, { PillVariant } from '@/components/ui/pill';
import { useCampaignsList } from '@/hooks/query/useCampaignsList';
import { getddMMMYYYYFormat } from '@/utils/helper';
import { SquareArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

const statusMap = {
  active: PillVariant.Info,
  inactive: PillVariant.Default,
  completed: PillVariant.Success,
  paused: PillVariant.Warning,
};

const CampaignsTable = () => {
  const { data } = useCampaignsList();
  const router = useRouter();

  const campaignColumns = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return <Pill variant={statusMap[status]}>{status}</Pill>;
      },
    },
    {
      accessorKey: 'completedCalls',
      header: 'Completed Calls',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        return getddMMMYYYYFormat(createdAt);
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => {
        const updatedAt = row.getValue('updatedAt') as string;
        return getddMMMYYYYFormat(updatedAt);
      },
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const id = row.getValue('id') as string;
        return (
          <SquareArrowUpRight
            width={16}
            onClick={() => router.push(`/dashboard/campaigns/${id}`)}
          />
        );
      },
    },
  ];

  return (
    <div
      className='container mx-auto py-5'
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
      }}
    >
      <DataTable
        columns={campaignColumns}
        data={data ?? []}
        searchKey='campaigns'
      />
    </div>
  );
};

export default CampaignsTable;
