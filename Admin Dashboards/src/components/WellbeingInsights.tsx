import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, ExternalLink, AlertTriangle } from "lucide-react";

const keywordData = [
  { word: "deadlines", frequency: 78, trend: "up", impact: "high", category: "academic" },
  { word: "finances", frequency: 65, trend: "up", impact: "high", category: "financial" },
  { word: "placement", frequency: 52, trend: "up", impact: "medium", category: "career" },
  { word: "sleep", frequency: 48, trend: "stable", impact: "high", category: "health" },
  { word: "exams", frequency: 44, trend: "down", impact: "medium", category: "academic" },
  { word: "isolation", frequency: 38, trend: "up", impact: "high", category: "social" },
  { word: "workload", frequency: 35, trend: "stable", impact: "medium", category: "academic" },
  { word: "housing", frequency: 29, trend: "up", impact: "medium", category: "living" },
];

const interventionData = [
  {
    name: "Sleep Hygiene Workshop",
    type: "workshop",
    cohort: "Year 1-2 Engineering",
    dateRange: "Jan 15-29, 2024",
    participants: 156,
    beforeScore: 54,
    afterScore: 62,
    improvement: 8,
    status: "completed"
  },
  {
    name: "Financial Wellness Program",
    type: "program",
    cohort: "All International Students",
    dateRange: "Feb 1-21, 2024", 
    participants: 234,
    beforeScore: 51,
    afterScore: 58,
    improvement: 7,
    status: "completed"
  },
  {
    name: "Mindfulness Campaign",
    type: "campaign",
    cohort: "Medicine Faculty",
    dateRange: "Feb 12-26, 2024",
    participants: 98,
    beforeScore: 48,
    afterScore: 55,
    improvement: 7,
    status: "ongoing"
  }
];

export function KeywordPanel() {
  const getCategoryColor = (category: string) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      financial: "bg-red-100 text-red-800", 
      career: "bg-purple-100 text-purple-800",
      health: "bg-green-100 text-green-800",
      social: "bg-orange-100 text-orange-800",
      living: "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Student Stressors</CardTitle>
            <CardDescription>
              Most frequently mentioned concerns in student check-ins
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keywordData.map((item) => (
            <div key={item.word} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(item.trend)}
                  <span className="font-medium capitalize">{item.word}</span>
                </div>
                <Badge variant="secondary" className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                {item.impact === "high" && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="text-right">
                <div className="font-bold">{item.frequency}</div>
                <div className="text-xs text-muted-foreground">mentions</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">Trending Concern: Financial Stress</h4>
              <p className="text-sm text-amber-800 mt-1">
                65% increase in finance-related mentions. Consider targeted financial wellness interventions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InterventionImpact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Impact Tracking</CardTitle>
        <CardDescription>
          Before/after Mind Measure scores for targeted campaigns and programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interventionData.map((intervention, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{intervention.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {intervention.cohort} • {intervention.dateRange}
                  </p>
                </div>
                <Badge 
                  variant={intervention.status === "completed" ? "default" : "secondary"}
                >
                  {intervention.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{intervention.participants}</div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{intervention.beforeScore}</div>
                  <div className="text-xs text-muted-foreground">Before</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{intervention.afterScore}</div>
                  <div className="text-xs text-muted-foreground">After</div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">+{intervention.improvement}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Improvement</div>
                </div>
              </div>
              
              <div className="mt-3">
                <Progress 
                  value={(intervention.improvement / 20) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline">
            View All Interventions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EngagementMetrics() {
  const metrics = [
    {
      title: "Daily Active Users",
      value: "2,847",
      change: "+12%",
      description: "Students checking in today"
    },
    {
      title: "Median Streak",
      value: "8 days",
      change: "+2 days",
      description: "Consecutive check-in days"
    },
    {
      title: "Completion Rate",
      value: "73%",
      change: "+5%",
      description: "Full check-in completion"
    },
    {
      title: "Response Quality",
      value: "4.2/5",
      change: "+0.2",
      description: "Average response depth"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </div>
              <Badge variant="outline" className="text-green-600">
                {metric.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}