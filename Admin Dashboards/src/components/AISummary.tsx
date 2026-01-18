import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface SummaryPoint {
  text: string;
  trend: 'up' | 'down' | 'stable' | 'alert' | 'positive';
  priority: 'high' | 'medium' | 'low';
}

export function AISummary() {
  const summaryPoints: SummaryPoint[] = [
    {
      text: "Overall wellbeing score trending upward (+3 points to 67) with 68% of students in the green zone",
      trend: 'up',
      priority: 'high'
    },
    {
      text: "Financial stress mentions increased 23% this week, particularly among international students",
      trend: 'alert',
      priority: 'high'
    },
    {
      text: "Sleep hygiene workshop showed significant impact (+8 point improvement) for participating Engineering cohorts",
      trend: 'positive',
      priority: 'medium'
    },

    {
      text: "Daily active check-ins increased 12% with median streak length at 8 days",
      trend: 'up',
      priority: 'low'
    },
    {
      text: "Placement-related anxiety emerging as top concern for final year Business students",
      trend: 'alert',
      priority: 'medium'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      default:
        return 'border-l-slate-300';
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">This Week's State of Play</CardTitle>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Updated 2 hours ago</span>
                </div>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  AI Model v2.1
                </Badge>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {summaryPoints.map((point, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 border-l-4 bg-slate-50/50 rounded-r-lg ${getPriorityColor(point.priority)}`}
            >
              <div className="mt-0.5">
                {getTrendIcon(point.trend)}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-slate-700">
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-3 w-3 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">AI Recommendation</h4>
              <p className="text-sm text-blue-800">
                Consider launching a targeted financial wellness intervention for international students, 
                building on the success of the recent sleep hygiene program.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}