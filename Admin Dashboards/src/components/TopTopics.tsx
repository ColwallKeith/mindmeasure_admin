import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, ExternalLink, Heart, AlertTriangle } from "lucide-react";

interface Topic {
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  severity?: 'high' | 'medium' | 'low';
}

const positiveTopics: Topic[] = [
  { keyword: "friends", count: 892, trend: 'up', trendValue: '+12%' },
  { keyword: "exercise", count: 743, trend: 'up', trendValue: '+8%' },
  { keyword: "progress", count: 621, trend: 'stable', trendValue: '±0%' },
  { keyword: "motivated", count: 534, trend: 'up', trendValue: '+15%' },
  { keyword: "support", count: 478, trend: 'up', trendValue: '+6%' },
  { keyword: "relaxed", count: 412, trend: 'down', trendValue: '-3%' },
  { keyword: "confident", count: 389, trend: 'up', trendValue: '+9%' },
  { keyword: "hopeful", count: 356, trend: 'stable', trendValue: '±0%' },
];

const concernTopics: Topic[] = [
  { keyword: "finances", count: 1247, trend: 'up', trendValue: '+23%', severity: 'high' },
  { keyword: "deadlines", count: 1089, trend: 'up', trendValue: '+18%', severity: 'high' },
  { keyword: "placement", count: 892, trend: 'up', trendValue: '+31%', severity: 'medium' },
  { keyword: "sleep", count: 756, trend: 'stable', trendValue: '±0%', severity: 'medium' },
  { keyword: "anxiety", count: 689, trend: 'down', trendValue: '-5%', severity: 'medium' },
  { keyword: "overwhelmed", count: 543, trend: 'up', trendValue: '+12%', severity: 'medium' },
  { keyword: "isolation", count: 434, trend: 'up', trendValue: '+8%', severity: 'low' },
  { keyword: "pressure", count: 389, trend: 'down', trendValue: '-7%', severity: 'low' },
];

interface TopicListProps {
  title: string;
  topics: Topic[];
  type: 'positive' | 'concern';
}

function TopicList({ title, topics, type }: TopicListProps) {
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <div className="h-3 w-3 rounded-full bg-slate-400" />;
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-amber-500 bg-amber-50';
      case 'low': return 'border-slate-300 bg-slate-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getTypeIcon = () => {
    if (type === 'positive') return <Heart className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>
                {type === 'positive' ? 'Most mentioned positive themes' : 'Top student concerns'}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div 
              key={topic.keyword} 
              className={`flex items-center justify-between p-3 border-l-4 rounded-r-lg ${getSeverityColor(topic.severity)}`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(topic.trend)}
                  <span className="font-medium text-slate-900 capitalize">{topic.keyword}</span>
                </div>
                {topic.severity && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      topic.severity === 'high' ? 'border-red-400 text-red-700' :
                      topic.severity === 'medium' ? 'border-amber-400 text-amber-700' :
                      'border-slate-400 text-slate-700'
                    }`}
                  >
                    {topic.severity}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{topic.count.toLocaleString()}</div>
                <div className={`text-xs ${
                  topic.trend === 'up' ? 'text-red-600' :
                  topic.trend === 'down' ? 'text-green-600' :
                  'text-slate-500'
                }`}>
                  {topic.trendValue}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {type === 'concern' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900 mb-1">Alert: Rising Financial Stress</h4>
                <p className="text-sm text-red-800">
                  Financial concerns up 23% this week, particularly among international students. 
                  Consider targeted intervention.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {type === 'positive' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Heart className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-1">Positive Trend: Social Connections</h4>
                <p className="text-sm text-green-800">
                  Strong increase in mentions of friends and social support, indicating improved 
                  community wellbeing.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopTopics() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TopicList 
        title="Positive Themes" 
        topics={positiveTopics} 
        type="positive" 
      />
      <TopicList 
        title="Student Concerns" 
        topics={concernTopics} 
        type="concern" 
      />
    </div>
  );
}