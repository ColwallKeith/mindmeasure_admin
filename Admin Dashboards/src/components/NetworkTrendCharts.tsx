import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UKHeatmap } from "./UKHeatmap";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ExternalLink, Info } from "lucide-react";

export function NetworkTrendCharts() {
  // Network-wide Mind Measure score data
  const trendData = [
    { week: 'W3', score: 64, green: 62, amber: 25, red: 13 },
    { week: 'W4', score: 66, green: 65, amber: 23, red: 12 },
    { week: 'W5', score: 63, green: 61, amber: 26, red: 13 },
    { week: 'W6', score: 67, green: 68, amber: 22, red: 10 },
    { week: 'W7', score: 68, green: 69, amber: 21, red: 10 },
    { week: 'W8', score: 65, green: 66, amber: 24, red: 10 },
    { week: 'W9', score: 69, green: 71, amber: 20, red: 9 }
  ];

  const currentDistribution = [
    { name: 'Green (≥60)', value: 71, count: 32156, color: '#0BA66D' },
    { name: 'Amber (45-59)', value: 20, count: 9074, color: '#F4A742' },
    { name: 'Red (<45)', value: 9, count: 4087, color: '#EB5757' }
  ];

  const universityComparison = [
    { name: 'Worcester', current: 72, previous: 68, trend: '+4', students: 8234 },
    { name: 'Birmingham', current: 69, previous: 71, trend: '-2', students: 12156 },
    { name: 'Manchester', current: 66, previous: 63, trend: '+3', students: 18743 },
    { name: 'Imperial', current: 73, previous: 70, trend: '+3', students: 15892 }
  ];

  const engagementMetrics = [
    {
      title: "Daily Active Check-ins",
      value: "12,847",
      change: "+12%",
      trend: "up",
      subtitle: "Students checking in today",
      color: "text-blue-600"
    },
    {
      title: "Network Median Streak",
      value: "8.2 days",
      change: "+0.4",
      trend: "up", 
      subtitle: "Consecutive check-in days",
      color: "text-mm-green"
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+2%",
      trend: "up",
      subtitle: "Full check-in completion",
      color: "text-mm-amber"
    }
  ];

  const currentScore = trendData[trendData.length - 1].score;
  const previousScore = trendData[trendData.length - 2].score;
  const scoreChange = currentScore - previousScore;

  return (
    <div className="space-y-4">
      {/* Top Row: Network Trend + Heatmap, Bottom Row: Distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Network Mind Measure Trend - Takes 2 columns */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Network Mind Measure Score Trend</h3>
              <p className="text-sm text-muted-foreground">7-day rolling average across all universities</p>
            </div>
            <Button variant="ghost" size="sm" className="text-mm-slate hover:bg-mm-panel">
              Drill down
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Wellbeing Zones Legend */}
          <div className="flex items-center gap-6 mb-6 p-4 bg-mm-panel rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mm-green"></div>
              <span className="text-sm font-medium">Green ≥60: Good wellbeing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mm-amber"></div>
              <span className="text-sm font-medium">Amber 45-59: At-risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mm-red"></div>
              <span className="text-sm font-medium">Red &lt;45: Concerning</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0BA66D" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#0BA66D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0BA66D"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Current Score Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-mm-green">{currentScore}</span>
                <span className="text-sm text-muted-foreground">Current Score (Green Zone)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-mm-green" />
              <span className="font-medium text-mm-green">+{scoreChange} vs last week</span>
            </div>
          </div>
        </Card>

        {/* Active Sessions Heatmap - Takes 1 column, spans both rows */}
        <div className="lg:row-span-2">
          <UKHeatmap />
        </div>

        {/* Current Distribution - Takes 2 columns, second row */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Current Distribution</h3>
              <p className="text-sm text-muted-foreground">Population across wellbeing zones</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Distribution Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {currentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Details */}
            <div className="space-y-4">
              <div className="space-y-3">
                {currentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium">{item.name.split(' ')[0]}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}%</div>
                      <div className="text-xs text-muted-foreground">{item.count.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-mm-green/5 rounded-lg border border-mm-green/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-mm-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-mm-green text-sm">Weekly Insight</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      +4% increase in Green zone students this week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3>Network Engagement Overview</h3>
            <p className="text-muted-foreground">Aggregated engagement metrics across all universities</p>
          </div>
          <Badge variant="secondary" className="bg-mm-green/10 text-mm-green border-mm-green/20">
            All trending positive
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {engagementMetrics.map((metric) => (
            <div key={metric.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  metric.trend === 'up' ? 'bg-mm-green/10 text-mm-green' : 'bg-mm-red/10 text-mm-red'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-semibold ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.subtitle}</div>
              </div>
              <div className="w-full bg-mm-panel rounded-full h-1">
                <div className={`h-1 rounded-full w-3/4 ${
                  metric.color === 'text-blue-600' ? 'bg-blue-600' :
                  metric.color === 'text-mm-green' ? 'bg-mm-green' :
                  metric.color === 'text-mm-amber' ? 'bg-mm-amber' :
                  'bg-purple-600'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* University Comparison */}
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>University Performance Comparison</h3>
              <p className="text-muted-foreground">Current Mind Measure scores by institution</p>
            </div>
            <Button variant="ghost" size="sm" className="text-mm-slate hover:bg-mm-panel">
              View detailed comparison
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {universityComparison.map((uni) => (
              <div key={uni.name} className="p-4 rounded-lg border hover:bg-mm-panel/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{uni.name}</h4>
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    uni.trend.startsWith('+') ? 'bg-mm-green/10 text-mm-green' :
                    uni.trend.startsWith('-') ? 'bg-mm-red/10 text-mm-red' :
                    'bg-mm-panel text-muted-foreground'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {uni.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-mm-green">{uni.current}</span>
                    <span className="text-sm text-muted-foreground">current</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {uni.students.toLocaleString()} students
                  </div>
                  <div className="w-full bg-mm-panel rounded-full h-1">
                    <div 
                      className="h-1 rounded-full bg-mm-green transition-all"
                      style={{ width: `${uni.current}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </div>
  );
}