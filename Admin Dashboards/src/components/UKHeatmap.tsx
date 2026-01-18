import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, MapPin, AlertTriangle } from "lucide-react";
import ukMapImage from 'figma:asset/8c111dd95f9b3bc255ae8ff96984cd1b719ba44f.png';

export function UKHeatmap() {
  // University locations with stress levels
  const universityData = [
    { name: 'Worcester', x: 45, y: 60, level: 'low', score: 72, region: 'West Midlands' },
    { name: 'Birmingham', x: 48, y: 58, level: 'medium', score: 69, region: 'West Midlands' },
    { name: 'Manchester', x: 45, y: 40, level: 'medium', score: 66, region: 'North West' },
    { name: 'Imperial', x: 52, y: 78, level: 'low', score: 73, region: 'London' },
    { name: 'Edinburgh', x: 42, y: 15, level: 'high', score: 58, region: 'Scotland' },
    { name: 'Cardiff', x: 35, y: 72, level: 'medium', score: 62, region: 'Wales' },
    { name: 'Leeds', x: 48, y: 35, level: 'high', score: 59, region: 'Yorkshire' },
    { name: 'Bristol', x: 40, y: 75, level: 'low', score: 71, region: 'South West' },
    { name: 'Liverpool', x: 42, y: 42, level: 'medium', score: 64, region: 'North West' },
    { name: 'Newcastle', x: 48, y: 25, level: 'high', score: 57, region: 'North East' },
  ];

  const regionSummary = [
    { region: 'London', avgScore: 73, universities: 1, level: 'low' },
    { region: 'North West', avgScore: 65, universities: 2, level: 'medium' },
    { region: 'West Midlands', avgScore: 70.5, universities: 2, level: 'low' },
    { region: 'Yorkshire', avgScore: 59, universities: 1, level: 'high' },
    { region: 'Scotland', avgScore: 58, universities: 1, level: 'high' },
    { region: 'North East', avgScore: 57, universities: 1, level: 'high' },
    { region: 'South West', avgScore: 69, universities: 1, level: 'medium' },
    { region: 'Wales', avgScore: 62, universities: 1, level: 'medium' }
  ];

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'low': return '#0BA66D';
      case 'medium': return '#F4A742';
      case 'high': return '#EB5757';
      default: return '#6B7280';
    }
  };

  const getMarkerSize = (level: string) => {
    switch (level) {
      case 'low': return 8;
      case 'medium': return 10;
      case 'high': return 12;
      default: return 8;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3>Stress Heat map</h3>
          <p className="text-sm text-muted-foreground">Live regional activity across network</p>
        </div>
        <Button variant="ghost" size="sm" className="text-mm-slate hover:bg-mm-panel">
          View live sessions
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* UK Map with Regional Overlays - Full Height */}
      <div className="flex-1 px-6 pb-6">
        <div className="relative w-full h-full rounded-lg overflow-hidden border bg-slate-50">
          <img 
            src={ukMapImage} 
            alt="UK Map" 
            className="w-full h-full object-contain"
          />
          
          {/* Regional Overlays */}
          <svg 
            viewBox="0 0 360 480" 
            className="absolute inset-0 w-full h-full"
          >
            {/* Scotland - Top region */}
            <circle
              cx="180"
              cy="80"
              r="45"
              fill={regionSummary.find(r => r.region === 'Scotland')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'Scotland')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* North East */}
            <circle
              cx="220"
              cy="160"
              r="25"
              fill={regionSummary.find(r => r.region === 'North East')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'North East')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* North West */}
            <circle
              cx="140"
              cy="180"
              r="30"
              fill={regionSummary.find(r => r.region === 'North West')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'North West')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* Yorkshire */}
            <circle
              cx="180"
              cy="200"
              r="25"
              fill={regionSummary.find(r => r.region === 'Yorkshire')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'Yorkshire')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* West Midlands */}
            <circle
              cx="160"
              cy="250"
              r="25"
              fill={regionSummary.find(r => r.region === 'West Midlands')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'West Midlands')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* Wales */}
            <circle
              cx="100"
              cy="270"
              r="30"
              fill={regionSummary.find(r => r.region === 'Wales')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'Wales')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* South West */}
            <circle
              cx="130"
              cy="340"
              r="25"
              fill={regionSummary.find(r => r.region === 'South West')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'South West')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* London & South East */}
            <circle
              cx="200"
              cy="320"
              r="20"
              fill={regionSummary.find(r => r.region === 'London')?.level === 'high' ? '#EB5757' : 
                    regionSummary.find(r => r.region === 'London')?.level === 'medium' ? '#F4A742' : '#0BA66D'}
              fillOpacity="0.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            
            {/* University markers */}
            {universityData.map((uni) => (
              <g key={uni.name}>
                <circle
                  cx={uni.x * 3.6}
                  cy={uni.y * 4.8}
                  r="4"
                  fill="white"
                  stroke={getMarkerColor(uni.level)}
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <circle
                  cx={uni.x * 3.6}
                  cy={uni.y * 4.8}
                  r="2"
                  fill={getMarkerColor(uni.level)}
                  className="pointer-events-none"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Card>
  );
}