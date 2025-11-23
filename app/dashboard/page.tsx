'use client';

import { StatCardWithChart } from '@/components/stat-card-with-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CampaignsTable from './CampaignsTable';

export default function DashboardPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'completion'>(
    'name'
  );

  // const totalNumbers = campaigns.reduce((sum, c) => sum + c.totalNumbers, 0);
  const totalNumbers = 100;

  // const completedCalls = campaigns.reduce(
  //   (sum, c) => sum + c.completedCalls,
  //   0,
  // );
  const completedCalls = 100;

  // const queuedCalls = campaigns.reduce((sum, c) => sum + c.queuedCalls, 0);
  const queuedCalls = 100;

  const callStatusData = [
    { name: 'Completed', value: completedCalls, fill: '#22c55e' },
    { name: 'Queued', value: queuedCalls, fill: '#eab308' },
  ];

  const dailyCallsData = [
    { date: 'Mon', calls: 12 },
    { date: 'Tue', calls: 19 },
    { date: 'Wed', calls: 15 },
    { date: 'Thu', calls: 22 },
    { date: 'Fri', calls: 18 },
  ];

  // const sortedCampaigns = [...campaigns].sort((a, b) => {
  //   if (sortBy === "name") return a.name.localeCompare(b.name);
  //   if (sortBy === "status") return a.status.localeCompare(b.status);
  //   const aRate = a.completedCalls / a.totalNumbers;
  //   const bRate = b.completedCalls / b.totalNumbers;
  //   return bRate - aRate;
  // });

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-primary'>Campaigns</h1>
            <p className='text-muted-foreground mt-2'>
              Manage and track all your calling campaigns
            </p>
          </div>
          <Link href='/dashboard/campaigns/new'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
              + Create Campaign
            </Button>
          </Link>
        </div>
{/* 
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          {[
            { label: 'Total Numbers', value: totalNumbers },
            { label: 'Completed Calls', value: completedCalls },
            { label: 'In Queue', value: queuedCalls },
          ].map((stat, idx) => (
            <Card key={idx} className='border-border/50'>
              <CardContent className='pt-6'>
                <div className='text-sm text-muted-foreground mb-2'>
                  {stat.label}
                </div>
                <div className='text-4xl font-bold text-primary'>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          <StatCardWithChart
            title='Call Status Distribution'
            data={callStatusData}
            type='pie'
            height={180}
          />
          <StatCardWithChart
            title='Daily Call Volume'
            data={dailyCallsData}
            type='bar'
            height={180}
          />
        </div> */}

        {/* Campaigns DataTable */}
        <CampaignsTable />
      </div>
    </main>
  );
}
