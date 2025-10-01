/**
 * Main Calendar Page
 * Displays weekly calendar with events, filtering, and family management
 */

import React, { useState, useMemo, useEffect } from 'react';
import CalendarHeader from '../components/CalendarHeader';
import WeeklyCalendar from '../components/WeeklyCalendar';
import FamilyOnboarding from '../components/FamilyOnboarding';
import FamilySelector from '../components/FamilySelector';
import InviteMemberDialog from '../components/InviteMemberDialog';
import { addWeeks, subWeeks } from 'date-fns';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, UserPlus } from 'lucide-react';
import { getProjectColor } from '../utils/calendarUtils';
import { PropertyRadioItem } from '@/components/PropertyRadioItem';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useFamilies } from '../hooks/useFamilies';
import type { UpdateEventData, CreateEventData } from '../domain/types';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const { signOut, user } = useAuth();
  const { families, isLoading: familiesLoading, createFamily, inviteMember } = useFamilies();
  const { events, isLoading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents(
    currentDate,
    selectedFamilyId
  );

  // Set first family as selected when families load
  useEffect(() => {
    if (families.length > 0 && !selectedFamilyId) {
      setSelectedFamilyId(families[0].id);
    }
  }, [families, selectedFamilyId]);
  
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

  const handleCreateFamily = (name: string) => {
    createFamily.mutate(name);
  };

  const handleInviteMember = (email: string) => {
    if (selectedFamilyId) {
      inviteMember.mutate({ familyId: selectedFamilyId, email, role: 'member' });
    }
  };

  const handleCreateEvent = (eventData: Omit<CreateEventData, 'family_id'>) => {
    if (!selectedFamilyId) return;
    
    createEvent.mutate({
      family_id: selectedFamilyId,
      ...eventData,
    });
  };

  const handleUpdateEvent = (id: string, eventData: Partial<UpdateEventData>) => {
    updateEvent.mutate({ id, data: eventData });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent.mutate(id);
  };

  if (familiesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-medium text-foreground tracking-tight">Family Calendar</h1>
              {selectedFamilyId && families.length > 0 && (
                <div className="hidden sm:block">
                  <FamilySelector
                    families={families}
                    selectedFamilyId={selectedFamilyId}
                    onFamilyChange={setSelectedFamilyId}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {selectedFamilyId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteDialog(true)}
                  className="h-8"
                >
                  <UserPlus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Invite</span>
                </Button>
              )}
              <span className="text-sm text-muted-foreground font-medium hidden md:block">
                {user?.email}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="h-8">
                Sign Out
              </Button>
            </div>
          </div>
          {selectedFamilyId && families.length > 1 && (
            <div className="sm:hidden pb-3">
              <FamilySelector
                families={families}
                selectedFamilyId={selectedFamilyId}
                onFamilyChange={setSelectedFamilyId}
              />
            </div>
          )}
        </header>
          
        {/* Main content */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-card border-r border-border lg:h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6">
              <div className="space-y-6">
                {/* Family member filter */}
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
            
            {eventsLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Loading events...</div>
              </div>
            ) : (
              <WeeklyCalendar 
                currentDate={currentDate}
                events={filteredEvents}
                familyMembers={Array.from(new Set(['Lisa', 'Ahmed', 'Selma', 'Youssef', 'Sofia']))}
                selectedMember={selectedMember}
                onCreateEvent={handleCreateEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </div>
        </div>
      </div>

      <FamilyOnboarding
        isOpen={families.length === 0 && !familiesLoading}
        onCreateFamily={handleCreateFamily}
      />

      <InviteMemberDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onInvite={handleInviteMember}
      />
    </>
  );
};

export default CalendarPage;
