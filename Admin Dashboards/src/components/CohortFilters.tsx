import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { 
  Filter, 
  Lock, 
  X,
  ChevronDown 
} from "lucide-react";

interface Filter {
  type: string;
  label: string;
  value: string;
}

export function CohortFilters() {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);

  const faculties = [
    'Arts & Humanities',
    'Business School',
    'Engineering',
    'Law',
    'Medicine',
    'Natural Sciences',
    'Social Sciences'
  ];

  const addFilter = (type: string, label: string, value: string) => {
    const newFilter = { type, label, value };
    setActiveFilters(prev => [...prev.filter(f => !(f.type === type && f.value === value)), newFilter]);
  };

  const removeFilter = (filterToRemove: Filter) => {
    setActiveFilters(prev => prev.filter(f => f !== filterToRemove));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedFaculties([]);
  };

  const handleFacultyChange = (faculty: string, checked: boolean) => {
    if (checked) {
      setSelectedFaculties(prev => [...prev, faculty]);
      addFilter('faculty', `Faculty: ${faculty}`, faculty);
    } else {
      setSelectedFaculties(prev => prev.filter(f => f !== faculty));
      removeFilter({ type: 'faculty', label: `Faculty: ${faculty}`, value: faculty });
    }
  };

  return (
    <Card className="sticky top-20 z-40 border shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-slate-600" />
            <div>
              <CardTitle className="text-base">Cohort Filters</CardTitle>
              <CardDescription className="text-sm">
                Filter data by student demographics
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Lock className="h-3 w-3" />
              <span>Privacy protected</span>
            </div>
            {activeFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Filter Controls */}
        <div className="grid gap-4 md:grid-cols-5">
          {/* Faculty Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                Faculty
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="p-4 space-y-2">
                {faculties.map((faculty) => (
                  <div key={faculty} className="flex items-center space-x-2">
                    <Checkbox
                      id={faculty}
                      checked={selectedFaculties.includes(faculty)}
                      onCheckedChange={(checked) => 
                        handleFacultyChange(faculty, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={faculty} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {faculty}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Year Group */}
          <Select onValueChange={(value) => addFilter('year', `Year: ${value}`, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Year Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year1">Year 1</SelectItem>
              <SelectItem value="year2">Year 2</SelectItem>
              <SelectItem value="year3">Year 3</SelectItem>
              <SelectItem value="year4">Year 4+</SelectItem>
              <SelectItem value="postgrad">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Domicile */}
          <Select onValueChange={(value) => addFilter('domicile', `Domicile: ${value}`, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Domicile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="eu">EU</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Residence */}
          <Select onValueChange={(value) => addFilter('residence', `Residence: ${value}`, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Residence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-campus">On Campus</SelectItem>
              <SelectItem value="off-campus">Off Campus</SelectItem>
              <SelectItem value="family-home">Family Home</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Study Mode */}
          <Select onValueChange={(value) => addFilter('mode', `Mode: ${value}`, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Study Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="distance">Distance Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Active filters:</div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center space-x-1 px-2 py-1"
                  >
                    <span className="text-xs">{filter.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Current Selection Summary */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-600">
            Showing data for <span className="font-medium">2,847 students</span> 
            {activeFilters.length > 0 && (
              <span> matching {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}