import { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { MindMeasureLogo } from "./MindMeasureLogo";
import { 
  Download, 
  Calendar,
  BarChart3,
  Users,
  BookOpen,
  Megaphone,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface InstitutionalLayoutProps {
  children: React.ReactNode;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export function InstitutionalLayout({ children, timeRange, onTimeRangeChange }: InstitutionalLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'cohorts', label: 'Cohorts', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'nudges', label: 'Nudges', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left side */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <MindMeasureLogo size="md" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Mind Measure</h1>
                <p className="text-sm text-slate-500">Institutional Dashboard</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-sm text-slate-600">
              <Badge variant="outline">Senior Access</Badge>
            </div>
          </div>

          {/* Right side - Time Range & Export */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

        </div>
      </header>

      <div className="flex">
        {/* Left Navigation */}
        <nav className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 border-r bg-slate-50/50`}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mb-4 w-full justify-start"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
            
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeNav === item.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveNav(item.id)}
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}