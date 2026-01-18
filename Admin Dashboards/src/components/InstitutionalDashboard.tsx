import { useState } from 'react';
import { MindMeasureChart } from './TrendCharts';
import { CohortFilters } from './CohortFilters';
import { EngagementMetrics } from './EngagementMetrics';
import { TopTopics } from './TopTopics';
import { InterventionImpact } from './WellbeingInsights';
import { BaselineAssessment } from './BaselineAssessment';
import { AISummary } from './AISummary';

export function InstitutionalDashboard() {
  const [selectedCohorts, setSelectedCohorts] = useState({
    faculty: 'all',
    year: 'all',
    domicile: 'all',
    residence: 'all'
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Cohort Filters */}
      <CohortFilters />

      {/* Main Charts Section */}
      <MindMeasureChart />

      {/* Engagement Metrics */}
      <EngagementMetrics />

      {/* Topics and Insights Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopTopics />
        <div className="space-y-6">
          <BaselineAssessment />
        </div>
      </div>

      {/* Intervention Impact */}
      <InterventionImpact />

      {/* AI Summary */}
      <AISummary />
    </div>
  );
}