import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { NetworkTrendCharts } from "./NetworkTrendCharts";
import { 
  Building2, 
  Users, 
  Settings, 
  Smartphone, 
  Code, 
  Shield, 
  Activity,
  Globe,
  Database,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Zap,
  Monitor,
  ExternalLink,
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  Heart,
  Frown
} from "lucide-react";

export function SuperuserControlPanel() {
  const systemStats = [
    { label: "Active Universities", value: "12", trend: "+2", icon: Building2, color: "text-mm-green" },
    { label: "Total Users", value: "45.2k", trend: "+8.1%", icon: Users, color: "text-mm-green" },
    { label: "System Health", value: "99.8%", trend: "Optimal", icon: Activity, color: "text-mm-green" },
    { label: "Active Sessions", value: "2.1k", trend: "+12%", icon: Globe, color: "text-mm-amber" }
  ];

  const universities = [
    { name: "University of Worcester", status: "active", users: "8.2k", lastSync: "2 min ago", color: "blue" },
    { name: "University of Birmingham", status: "active", users: "12.1k", lastSync: "1 min ago", color: "green" },
    { name: "University of Manchester", status: "maintenance", users: "18.7k", lastSync: "15 min ago", color: "purple" },
    { name: "Imperial College London", status: "pending", users: "0", lastSync: "Setup required", color: "amber" }
  ];

  const systemModules = [
    {
      title: "Network Messaging Tool",
      description: "Send alerts and communications across network",
      icon: Monitor,
      status: "operational",
      users: "156",
      lastUpdate: "Live",
      action: "Send Message",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      title: "Admin Dashboard",
      description: "System administration and user management",
      icon: Settings,
      status: "operational", 
      users: "42",
      lastUpdate: "Live",
      action: "Manage System",
      color: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
    },
    {
      title: "Institutional Onboarding",
      description: "Set up new university partnerships",
      icon: Plus,
      status: "ready",
      users: "8",
      lastUpdate: "Ready",
      action: "Add University",
      color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    }
  ];

  const devTools = [
    {
      title: "Mobile App Simulator",
      description: "Test mobile app functionality",
      icon: Smartphone,
      status: "operational",
      action: "Launch Simulator"
    },
    {
      title: "User Dashboard",
      description: "Individual user dashboard view",
      icon: UserCheck,
      status: "operational",
      action: "View User Panel"
    },
    {
      title: "Test Components",
      description: "Development testing interface",
      icon: Code,
      status: "operational",
      action: "Run Tests"
    },
    {
      title: "Admin Assets",
      description: "Asset management and configuration",
      icon: Database,
      status: "operational",
      action: "Manage Assets"
    }
  ];

  const positiveThemes = [
    { name: "Friends", count: 892, trend: "+22%", trendType: "up" },
    { name: "Exercise", count: 743, trend: "+8%", trendType: "up" },
    { name: "Progress", count: 621, trend: "±0%", trendType: "neutral" },
    { name: "Motivated", count: 534, trend: "+15%", trendType: "up" },
    { name: "Support", count: 478, trend: "+6%", trendType: "up" },
    { name: "Relaxed", count: 412, trend: "-3%", trendType: "down" },
    { name: "Confident", count: 389, trend: "+9%", trendType: "up" },
    { name: "Hopeful", count: 356, trend: "±0%", trendType: "neutral" }
  ];

  const studentConcerns = [
    { name: "Finances", count: 1247, trend: "+23%", trendType: "up", severity: "high" },
    { name: "Deadlines", count: 1089, trend: "+18%", trendType: "up", severity: "high" },
    { name: "Placement", count: 892, trend: "+31%", trendType: "up", severity: "medium" },
    { name: "Sleep", count: 756, trend: "±0%", trendType: "neutral", severity: "medium" },
    { name: "Anxiety", count: 689, trend: "-5%", trendType: "down", severity: "medium" },
    { name: "Overwhelmed", count: 543, trend: "+12%", trendType: "up", severity: "medium" },
    { name: "Isolation", count: 434, trend: "+4%", trendType: "up", severity: "low" },
    { name: "Pressure", count: 389, trend: "-7%", trendType: "down", severity: "low" }
  ];

  return (
    <div className="p-6 space-y-8 max-w-none mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1>Superuser Control Panel</h1>
        <p className="text-muted-foreground">
          Access all Mind Measure systems and university dashboards from this central portal.
        </p>
      </div>

      {/* System Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="p-6 border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold">{stat.value}</span>
                  <Badge variant="secondary" className={`${stat.color} bg-transparent text-xs`}>
                    {stat.trend}
                  </Badge>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Network Analytics */}
      <NetworkTrendCharts />

      {/* University Dashboards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>University Dashboards</h2>
            <p className="text-muted-foreground">Access institutional dashboards for each university</p>
          </div>
          <Button className="bg-mm-green hover:bg-mm-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add University
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {universities.map((uni) => (
            <Card key={uni.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${uni.color}-100 flex items-center justify-center`}>
                    <Building2 className={`w-5 h-5 text-${uni.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{uni.name}</h4>
                    <p className="text-sm text-muted-foreground">{uni.users} active users</p>
                  </div>
                </div>
                <Badge 
                  variant={uni.status === 'active' ? 'default' : uni.status === 'maintenance' ? 'secondary' : 'outline'}
                  className={
                    uni.status === 'active' ? 'bg-mm-green/10 text-mm-green border-mm-green/20' :
                    uni.status === 'maintenance' ? 'bg-mm-amber/10 text-mm-amber border-mm-amber/20' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }
                >
                  {uni.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  Last sync: {uni.lastSync}
                </div>
                <Button variant="ghost" size="sm" className="text-mm-slate hover:bg-mm-panel">
                  Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Core System Modules */}
      <div className="space-y-6">
        <div>
          <h2>Core System Modules</h2>
          <p className="text-muted-foreground">Essential system administration and oversight tools</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {systemModules.map((module) => (
            <Card key={module.title} className={`p-6 border-2 ${module.color} hover:shadow-lg transition-all`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-white shadow-sm">
                    <module.icon className="w-6 h-6 text-mm-slate" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mm-green" />
                    <span className="text-xs text-mm-green font-medium">{module.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {module.users}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {module.lastUpdate}
                    </span>
                  </div>
                  <Button size="sm" className="bg-mm-slate hover:bg-mm-slate/90">
                    {module.action}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Development & Management Tools */}
      <div className="space-y-6">
        <div>
          <h2>Development & Management Tools</h2>
          <p className="text-muted-foreground">Testing interfaces and system management utilities</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {devTools.map((tool) => (
            <Card key={tool.title} className="p-6 hover:shadow-md transition-shadow group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-mm-panel group-hover:bg-mm-green/10 transition-colors">
                    <tool.icon className="w-5 h-5 text-mm-slate group-hover:text-mm-green transition-colors" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-mm-green"></div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{tool.title}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full justify-start text-mm-slate hover:bg-mm-panel">
                  {tool.action}
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Aggregated Student Insights */}
      <div className="pt-8 border-t border-border space-y-6">
        <div>
          <h2>Aggregated Student Insights</h2>
          <p className="text-muted-foreground">Network-wide analysis of student wellbeing themes and concerns</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Positive Themes - Compact */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mm-green/10">
                  <Heart className="w-5 h-5 text-mm-green" />
                </div>
                <div>
                  <h3 className="font-medium">Positive Themes</h3>
                  <p className="text-sm text-muted-foreground">Most mentioned positive themes</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-mm-green hover:bg-mm-green/10">
                View details
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {positiveThemes.slice(0, 6).map((theme, index) => (
                <div key={theme.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-mm-panel/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-mm-green rounded-full"></div>
                    <span className="font-medium text-sm">{theme.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{theme.count.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${
                      theme.trendType === 'up' ? 'text-mm-green bg-mm-green/10' :
                      theme.trendType === 'down' ? 'text-mm-amber bg-mm-amber/10' :
                      'text-muted-foreground bg-mm-panel'
                    }`}>
                      {theme.trendType === 'up' && <ArrowUp className="w-2 h-2" />}
                      {theme.trendType === 'down' && <ArrowDown className="w-2 h-2" />}
                      {theme.trendType === 'neutral' && <Minus className="w-2 h-2" />}
                      {theme.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-mm-green/5 rounded-lg border border-mm-green/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-mm-green flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-mm-green text-sm">Positive Trend: Social Connections</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strong increase in mentions of friends and social support across all universities.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Student Concerns - Compact */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mm-amber/10">
                  <Frown className="w-5 h-5 text-mm-amber" />
                </div>
                <div>
                  <h3 className="font-medium">Student Concerns</h3>
                  <p className="text-sm text-muted-foreground">Top student concerns</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-mm-amber hover:bg-mm-amber/10">
                View details
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {studentConcerns.slice(0, 6).map((concern, index) => (
                <div key={concern.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-mm-panel/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-4 rounded-full ${
                      concern.severity === 'high' ? 'bg-mm-red' :
                      concern.severity === 'medium' ? 'bg-mm-amber' :
                      'bg-slate-300'
                    }`}></div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{concern.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-1.5 py-0 ${
                          concern.severity === 'high' ? 'bg-mm-red/10 text-mm-red border-mm-red/20' :
                          concern.severity === 'medium' ? 'bg-mm-amber/10 text-mm-amber border-mm-amber/20' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {concern.severity[0].toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{concern.count.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${
                      concern.trendType === 'up' ? 'text-mm-red bg-mm-red/10' :
                      concern.trendType === 'down' ? 'text-mm-green bg-mm-green/10' :
                      'text-muted-foreground bg-mm-panel'
                    }`}>
                      {concern.trendType === 'up' && <ArrowUp className="w-2 h-2" />}
                      {concern.trendType === 'down' && <ArrowDown className="w-2 h-2" />}
                      {concern.trendType === 'neutral' && <Minus className="w-2 h-2" />}
                      {concern.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-mm-red/5 rounded-lg border border-mm-red/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-mm-red flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-mm-red text-sm">Alert: Rising Financial Stress</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Financial concerns up 23% across the network, particularly affecting international students.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}