
import React, { useState, useMemo } from 'react';
import CalendarHeader from '@/components/CalendarHeader';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { addWeeks, subWeeks } from 'date-fns';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { TimeSlot } from '@/utils/calendarUtils';
import { getProjectColor } from '@/utils/calendarUtils';
import { PropertyRadioItem } from '@/components/PropertyRadioItem';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents, Event } from '@/hooks/useEvents';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { signOut, user } = useAuth();
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useEvents(currentDate);
  
  // Get unique family members from events
  const familyMembers = useMemo(() => {
    const members = new Set(events.map(e => e.family_member));
    return Array.from(members);
  }, [events]);

  // Filter events by selected member and search query
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesMember = selectedMember === "ALL" || event.family_member === selectedMember;
      const matchesSearch = !searchQuery.trim() || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.family_member.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesMember && matchesSearch;
    });
  }, [events, selectedMember, searchQuery]);

  // Filter family members by search query
  const filteredFamilyMembers = useMemo(() => {
    if (!searchQuery.trim()) return familyMembers;
    
    return familyMembers.filter(member => 
      member.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [familyMembers, searchQuery]);

  const handlePreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Wrap mutation functions to match expected interface
  const handleUpdateEvent = (id: string, eventData: Partial<Event>) => {
    updateEvent({ id, ...eventData });
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
                  value={selectedMember} 
                  onValueChange={setSelectedMember}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <PropertyRadioItem value="ALL" id="all" color="#9ca3af" />
                    <Label htmlFor="all" className="text-sm font-medium text-foreground cursor-pointer">
                      All Family Members
                    </Label>
                  </div>
                  {filteredFamilyMembers.map(member => (
                    <div key={member} className="flex items-center space-x-3">
                      <PropertyRadioItem value={member} id={member} color={getProjectColor(member)} />
                      <Label 
                        htmlFor={member} 
                        className="text-sm font-medium text-foreground cursor-pointer flex items-center"
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: getProjectColor(member) }}
                        ></span>
                        {member}
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

                {searchQuery && (filteredFamilyMembers.length === 0 || filteredEvents.length === 0) && (
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    No matches found for "{searchQuery}"
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
            onDateChange={handleDateChange}
          />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-muted-foreground">Loading events...</div>
            </div>
          ) : (
            <WeeklyCalendar 
              currentDate={currentDate}
              events={filteredEvents}
              familyMembers={Array.from(new Set(['Lisa', 'Ahmed', 'Selma', 'Youssef', 'Sofia']))}
              selectedMember={selectedMember}
              onCreateEvent={createEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={deleteEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
