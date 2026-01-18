import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, CheckCircle, Star } from "lucide-react";

const sparklineData = [
  { day: 1, checkins: 2456, streak: 7.2, completion: 71, quality: 4.1 },
  { day: 2, checkins: 2234, streak: 7.4, completion: 72, quality: 4.0 },
  { day: 3, checkins: 2145, streak: 7.6, completion: 74, quality: 4.2 },
  { day: 4, checkins: 2067, streak: 7.8, completion: 73, quality: 4.1 },
  { day: 5, checkins: 1987, streak: 8.1, completion: 75, quality: 4.3 },
  { day: 6, checkins: 2234, streak: 8.0, completion: 73, quality: 4.2 },
  { day: 7, checkins: 2847, streak: 8.2, completion: 73, quality: 4.2 },
];

interface EngagementTileProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: React.ElementType;
  dataKey: string;
  color: string;
}

function EngagementTile({ title, value, change, trend, description, icon: Icon, dataKey, color }: EngagementTileProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4 rounded-full bg-slate-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}15` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {change}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-600">{description}</div>
          </div>
          
          {/* Sparkline */}
          <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EngagementMetrics() {
  const metrics = [
    {
      title: "Daily Active Check-ins",
      value: "2,847",
      change: "+12%",
      trend: 'up' as const,
      description: "Students checking in today",
      icon: Users,
      dataKey: "checkins",
      color: "#3B82F6"
    },
    {
      title: "Median Streak",
      value: "8.2 days",
      change: "+0.4",
      trend: 'up' as const,
      description: "Consecutive check-in days",
      icon: Target,
      dataKey: "streak",
      color: "#0BA66D"
    },
    {
      title: "Completion Rate",
      value: "73%",
      change: "+2%",
      trend: 'up' as const,
      description: "Full check-in completion",
      icon: CheckCircle,
      dataKey: "completion",
      color: "#F4A742"
    },
    {
      title: "Response Quality",
      value: "4.2/5",
      change: "+0.1",
      trend: 'up' as const,
      description: "Average response depth",
      icon: Star,
      dataKey: "quality",
      color: "#8B5CF6"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Engagement Overview</h3>
        <Badge variant="outline" className="text-green-600 border-green-600">
          All trending positive
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <EngagementTile
            key={metric.title}
            {...metric}
          />
        ))}
      </div>
      
      <div className="p-4 bg-slate-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-slate-900 mb-1">Engagement Health Score</h4>
            <p className="text-xs text-slate-600">
              Based on check-in frequency, completion rates, and response quality
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">87/100</div>
            <div className="text-xs text-slate-600">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}