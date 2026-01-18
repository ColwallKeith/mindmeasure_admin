import { useState } from 'react';
import { InstitutionalLayout } from './components/InstitutionalLayout';
import { InstitutionalDashboard } from './components/InstitutionalDashboard';

export default function InstitutionalApp() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <InstitutionalLayout 
      timeRange={timeRange} 
      onTimeRangeChange={setTimeRange}
    >
      <InstitutionalDashboard />
    </InstitutionalLayout>
  );
}