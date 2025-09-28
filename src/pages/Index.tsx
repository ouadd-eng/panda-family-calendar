
import React, { useState, useMemo } from 'react';
import CalendarHeader from '@/components/CalendarHeader';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { addWeeks, subWeeks } from 'date-fns';
import { generateMockTimeSlots } from '@/data/mockData';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Calendar as CalendarIcon, Search, X, LogOut } from 'lucide-react';
import type { TimeSlot } from '@/utils/calendarUtils';
import { getProjectColor } from '@/utils/calendarUtils';
import { PropertyRadioItem } from '@/components/PropertyRadioItem';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const allTimeSlots = generateMockTimeSlots(currentDate);
  const { signOut, user } = useAuth();
  
  const projectBrokerMap = useMemo(() => {
    const map = new Map<string, string>();
    allTimeSlots
      .filter(slot => !slot.isBrokerEvent && slot.broker)
      .forEach(slot => {
        map.set(slot.projectName, slot.broker!);
      });
    return map;
  }, [allTimeSlots]);
  
  const projectNames = useMemo(() => {
    return Array.from(projectBrokerMap.keys());
  }, [projectBrokerMap]);
  
  const brokerProjectMap = useMemo(() => {
    const map = new Map<string, string>();
    projectBrokerMap.forEach((broker, project) => {
      map.set(broker, project);
    });
    return map;
  }, [projectBrokerMap]);
  
  const filteredTimeSlots = useMemo(() => {
    const filtered = allTimeSlots.filter(slot => {
      if (selectedProject === "ALL") {
        return !slot.isBrokerEvent;
      }
      
      if (!slot.isBrokerEvent) {
        return slot.projectName === selectedProject;
      }
      
      if (slot.isBrokerEvent && slot.broker) {
        return projectBrokerMap.get(selectedProject) === slot.broker;
      }
      
      return false;
    });
    
    return filtered.map(slot => {
      if (slot.isBrokerEvent && slot.broker) {
        const associatedProject = selectedProject !== "ALL" 
          ? selectedProject
          : brokerProjectMap.get(slot.broker);
          
        if (associatedProject) {
          return { ...slot, associatedProject };
        }
      }
      return slot;
    });
  }, [allTimeSlots, selectedProject, projectBrokerMap, brokerProjectMap]);

  const filteredProjectNames = useMemo(() => {
    if (!searchQuery.trim()) return projectNames;
    
    return projectNames.filter(name => 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (projectBrokerMap.get(name)?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projectNames, searchQuery, projectBrokerMap]);

  const handlePreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-medium text-foreground tracking-tight">Family Calendar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground font-medium hidden sm:block">Welcome, {user?.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="h-8">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
        
      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-card border-r border-border lg:h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {/* Project filter */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 tracking-tight">Filter by Family Member</h3>
                <RadioGroup 
                  value={selectedProject} 
                  onValueChange={setSelectedProject}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <PropertyRadioItem value="ALL" id="all" color="#9ca3af" />
                    <Label htmlFor="all" className="text-sm font-medium text-foreground cursor-pointer">
                      All Family Members
                    </Label>
                  </div>
                  {filteredProjectNames.map(projectName => (
                    <div key={projectName} className="flex items-center space-x-3">
                      <PropertyRadioItem value={projectName} id={projectName} color={getProjectColor(projectName)} />
                      <Label 
                        htmlFor={projectName} 
                        className="text-sm font-medium text-foreground cursor-pointer flex items-center"
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: getProjectColor(projectName) }}
                        ></span>
                        {projectName}
                        {brokerProjectMap.get(projectName) && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({brokerProjectMap.get(projectName)})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Search */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 tracking-tight">Search Family Members</h3>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search family members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {searchQuery && filteredProjectNames.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    No family members found matching "{searchQuery}"
                  </p>
                )}
                
                {!searchQuery && filteredProjectNames.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    No family members available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar area */}
        <div className="flex-1 p-4 lg:p-6">
          <CalendarHeader 
            currentDate={currentDate}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onTodayClick={handleTodayClick}
          />
          
          <WeeklyCalendar 
            currentDate={currentDate}
            timeSlots={filteredTimeSlots}
            projectNames={projectNames}
            selectedProject={selectedProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
