import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceArea } from 'recharts';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

const mindMeasureData = [
  { date: '2024-01-15', score: 58, week: 'W3' },
  { date: '2024-01-22', score: 61, week: 'W4' },
  { date: '2024-01-29', score: 59, week: 'W5' },
  { date: '2024-02-05', score: 63, week: 'W6' },
  { date: '2024-02-12', score: 65, week: 'W7' },
  { date: '2024-02-19', score: 62, week: 'W8' },
  { date: '2024-02-26', score: 67, week: 'W9' },
];

const distributionData = [
  { name: "Green (≥60)", value: 68, color: "#0BA66D", count: 1936 },
  { name: "Amber (45-59)", value: 24, color: "#F4A742", count: 683 },
  { name: "Red (<45)", value: 8, color: "#EB5757", count: 228 },
];



export function MindMeasureChart() {
  const currentScore = mindMeasureData[mindMeasureData.length - 1]?.score || 67;
  const previousScore = mindMeasureData[mindMeasureData.length - 2]?.score || 62;
  const change = currentScore - previousScore;
  
  const getBandColor = (score: number) => {
    if (score >= 60) return '#0BA66D';
    if (score >= 45) return '#F4A742';
    return '#EB5757';
  };

  const getBandName = (score: number) => {
    if (score >= 60) return 'Green';
    if (score >= 45) return 'Amber';
    return 'Red';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const band = score >= 60 ? 'Green' : score >= 45 ? 'Amber' : 'Red';
      const color = getBandColor(score);
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            {label}
          </p>
          <p className="text-sm mt-1" style={{ color }}>
            Mind Measure Score: <span className="font-bold">{score}</span> ({band} Zone)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Large Trend Chart */}
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Mind Measure Score Trend</CardTitle>
              <CardDescription className="text-sm text-slate-600 mt-1">
                7-day rolling average with wellbeing zones
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Drill down
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Zone Legend */}
          <div className="mb-6 p-4" style={{ backgroundColor: '#F3F4F6' }}>
            <div className="text-sm font-medium text-slate-700 mb-3">Wellbeing Score Zones</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0BA66D' }}></div>
                <span className="text-sm"><strong>Green ≥60:</strong> Good wellbeing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F4A742' }}></div>
                <span className="text-sm"><strong>Amber 45-59:</strong> At-risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EB5757' }}></div>
                <span className="text-sm"><strong>Red &lt;45:</strong> Concerning</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={mindMeasureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              
              {/* Wellbeing zone background areas */}
              <ReferenceArea y1={60} y2={100} fill="#0BA66D" fillOpacity={0.08} />
              <ReferenceArea y1={45} y2={60} fill="#F4A742" fillOpacity={0.08} />
              <ReferenceArea y1={0} y2={45} fill="#EB5757" fillOpacity={0.08} />
              
              <XAxis 
                dataKey="week" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#6B7280"
                fontSize={12}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#1F2937"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={getBandColor(payload.score)}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Current Score Display */}
          <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-3xl font-bold" style={{ color: getBandColor(currentScore) }}>
                {currentScore}
              </div>
              <div className="text-sm text-slate-600">
                Current Score ({getBandName(currentScore)} Zone)
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {change >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change} vs last week
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Donut */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Current Distribution</CardTitle>
          <CardDescription>
            Population across wellbeing zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${props.payload.count} students)`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            {distributionData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.value}%</div>
                    <div className="text-xs text-slate-500">{item.count.toLocaleString()}</div>
                  </div>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm font-medium text-green-900 mb-1">Weekly Insight</div>
            <p className="text-sm text-green-800">
              +4% increase in Green zone students this week
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}