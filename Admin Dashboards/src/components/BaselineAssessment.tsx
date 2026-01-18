import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, ExternalLink, Award } from "lucide-react";

const baselineProgressionData = [
  { interval: 'Baseline', avgScore: 52, completed: 2847, due: 2847 },
  { interval: '3 Months', avgScore: 58, completed: 2341, due: 2847 },
  { interval: '6 Months', avgScore: 61, completed: 1987, due: 2341 },
  { interval: '9 Months', avgScore: 64, completed: 1654, due: 1987 },
  { interval: '12 Months', avgScore: 67, completed: 1398, due: 1654 },
];

const cohortProgressData = [
  { cohort: 'Year 1', baseline: 48, current: 62, improvement: 14, count: 892 },
  { cohort: 'Year 2', baseline: 54, current: 65, improvement: 11, count: 743 },
  { cohort: 'Year 3', baseline: 51, current: 68, improvement: 17, count: 621 },
  { cohort: 'Postgrad', baseline: 56, current: 71, improvement: 15, count: 591 },
];

const retentionData = [
  { interval: 'Baseline', retention: 100 },
  { interval: '3M', retention: 82 },
  { interval: '6M', retention: 85 },
  { interval: '9M', retention: 83 },
  { interval: '12M', retention: 84 },
];

export function BaselineAssessment() {
  const currentCompletion = Math.round((baselineProgressionData[1].completed / baselineProgressionData[1].due) * 100);
  const latestScore = baselineProgressionData[baselineProgressionData.length - 1].avgScore;
  const baselineScore = baselineProgressionData[0].avgScore;
  const overallImprovement = latestScore - baselineScore;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-sm mt-1 text-blue-600">
            Average Score: <span className="font-bold">{data.avgScore}</span>
          </p>
          <p className="text-sm text-slate-600">
            Completed: {data.completed?.toLocaleString() || 'N/A'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Baseline Assessment Journey</h3>
          <p className="text-sm text-slate-600 mt-1">
            Tracking wellbeing progression from initial assessment through 3-month intervals
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View full journey
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progression Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Wellbeing Score Progression</CardTitle>
                <CardDescription>
                  Average Mind Measure scores across assessment intervals
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +{overallImprovement} improvement
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={baselineProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="interval" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  domain={[40, 80]} 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#0BA66D"
                  strokeWidth={3}
                  dot={{ fill: '#0BA66D', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Strong Progression</h4>
                  <p className="text-sm text-green-800">
                    Students show consistent wellbeing improvement over time, with {overallImprovement}-point average gain
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Completion Status */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Current 3-Month Cycle</CardTitle>
                <CardDescription>Assessment completion status</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Ring */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="40"
                      stroke="#0BA66D"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentCompletion / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600">{currentCompletion}%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{baselineProgressionData[1].completed.toLocaleString()}</div>
                <div className="text-sm text-slate-600">
                  of {baselineProgressionData[1].due.toLocaleString()} students completed
                </div>
              </div>
              
              {/* Retention Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Assessment Retention</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {retentionData[1].retention}%
                  </Badge>
                </div>
                <Progress value={retentionData[1].retention} className="h-3" />
                <div className="text-xs text-slate-600">
                  Students continuing with follow-up assessments
                </div>
              </div>
              
              {/* Upcoming Deadlines */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-700 mb-2">Upcoming Cycles</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>6-month assessment</span>
                    <span>Due in 2 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New student baseline</span>
                    <span>Due in 4 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Performance Comparison */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Cohort Improvement Analysis</CardTitle>
          <CardDescription>
            Wellbeing progression by student group from baseline to current
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bar Chart */}
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cohortProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="cohort" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} points`,
                      name === 'baseline' ? 'Baseline Score' : 'Current Score'
                    ]}
                  />
                  <Bar dataKey="baseline" fill="#94A3B8" name="baseline" />
                  <Bar dataKey="current" fill="#0BA66D" name="current" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Table */}
            <div className="space-y-3">
              {cohortProgressData.map((cohort) => (
                <div key={cohort.cohort} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{cohort.cohort}</div>
                    <div className="text-xs text-slate-600">{cohort.count} students</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">+{cohort.improvement}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {cohort.baseline} → {cohort.current}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Cohort Insight</h4>
                <p className="text-sm text-blue-800">
                  Year 3 students show the highest improvement (+17 points), suggesting effective 
                  adaptation and resilience building over their academic journey.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}