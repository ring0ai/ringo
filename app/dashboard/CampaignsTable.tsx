import { DataTable } from '@/components/ui/data-table';
import useCampaignsList from '@/services/campaigns/campaign.data';
import { ColumnDef } from '@tanstack/react-table';
import { Campaign, CampaignStatus } from './utils/types';
import { getddMMMYYYYFormat } from '@/utils/helper';
import Pill, { PillVariant } from '@/components/ui/pill';
import { SquareArrowUpRight } from 'lucide-react';

const statusMap = {
  [CampaignStatus.ACTIVE]: PillVariant.Info,
  [CampaignStatus.INACTIVE]: PillVariant.Default,
  [CampaignStatus.COMPLETED]: PillVariant.Success,
  [CampaignStatus.PAUSED]: PillVariant.Warning,
};

const campaignColumns: ColumnDef<Campaign>[] = [
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
      const status = row.getValue('status') as CampaignStatus;
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
    accessorKey: 'created_by',
    header: 'Created By',
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string;
      return <SquareArrowUpRight width={16} />;
    },
  },
];

const CampaignsTable = () => {
  const { data } = useCampaignsList();
  console.log(data);
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
