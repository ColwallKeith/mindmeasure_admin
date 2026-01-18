import { useState } from 'react';
import { Layout } from './components/Layout';
import { SuperuserControlPanel } from './components/SuperuserControlPanel';
import { InstitutionalDashboard } from './components/InstitutionalDashboard';

export default function App() {
  const [timeRange, setTimeRange] = useState("30d");
  const [dashboardMode, setDashboardMode] = useState<'network' | 'institutional'>('network');

  return (
    <Layout 
      timeRange={timeRange} 
      onTimeRangeChange={setTimeRange}
      dashboardMode={dashboardMode}
      onDashboardModeChange={setDashboardMode}
    >
      {dashboardMode === 'network' ? (
        <SuperuserControlPanel />
      ) : (
        <InstitutionalDashboard />
      )}
    </Layout>
  );
}