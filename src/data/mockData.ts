
import { TimeSlot, getUniqueId } from '../utils/calendarUtils';
import { addDays, format, getWeek, getWeekOfMonth } from 'date-fns';

// Generate mock data for a week or multiple weeks
export const generateMockTimeSlots = (currentDate: Date): TimeSlot[] => {
  const mockSlots: TimeSlot[] = [];
  
  // Get the week number of the current date to determine which week's data to show
  const currentWeekNumber = getWeek(currentDate);
  
  // Projects
  const projects = [
    'Oceanview Residences',
    'Highland Park Towers',
    'Central Heights Condos',
    'Riverside Apartments',
    'Metro Lofts',
    'Parkside Gardens',
    'Sunset Hills Estate',
    'Downtown Collection',
  ];
  
  // Locations
  const locations = [
    'Main Office',
    'On-site Location',
    'Client Office',
    'Virtual Meeting',
    'Property Site',
  ];

  // Brokers
  const brokers = [
    'Sarah Johnson',
    'Michael Chen',
    'Emma Williams',
    'David Rodriguez',
    'Jessica Kim',
    'Robert Taylor',
    'Lisa Garcia',
    'John Smith',
  ];

  // Generate first week's data
  if (currentWeekNumber % 2 === 0) {
    // First week data (Even weeks)
    // Property time slots (existing slots)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '11:00',
        day: 1, // Monday
        projectName: projects[0],
        location: locations[0],
        isBooked: true,
        parties: 2,
        duration: 20,
        broker: brokers[0],
      },
      {
        id: getUniqueId(),
        startTime: '13:30',
        endTime: '15:00',
        day: 1, // Monday
        projectName: projects[1],
        location: locations[2],
        isBooked: false,
        parties: 3,
        duration: 30,
        broker: brokers[1],
      },
      // Adding overlapping slots for Monday
      {
        id: getUniqueId(),
        startTime: '09:30',
        endTime: '10:30',
        day: 1, // Monday - overlaps with Oceanview
        projectName: projects[3],
        location: locations[1],
        isBooked: true,
        parties: 1,
        duration: 15,
        broker: brokers[3],
      },
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '11:30',
        day: 1, // Monday - overlaps with Oceanview
        projectName: projects[5],
        location: locations[0],
        isBooked: false,
        parties: 2,
        duration: 25,
        broker: brokers[5],
      },
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '15:30',
        day: 1, // Monday - overlaps with Highland Park
        projectName: projects[7],
        location: locations[4],
        isBooked: true,
        parties: 4,
        duration: 15,
        broker: brokers[7],
      }
    );

    // Tuesday slots (day 2)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:30',
        day: 2, // Tuesday
        projectName: projects[2],
        location: locations[1],
        isBooked: true,
        parties: 1,
        duration: 25,
        broker: brokers[2],
      },
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 2, // Tuesday
        projectName: projects[3],
        location: locations[0],
        isBooked: false,
        parties: 2,
        duration: 30,
        broker: brokers[3],
      },
      // Adding overlapping slots for Tuesday
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '13:00',
        day: 2, // Tuesday - overlaps with Central Heights
        projectName: projects[6],
        location: locations[3],
        isBooked: true,
        parties: 3,
        duration: 20,
        broker: brokers[6],
      },
      {
        id: getUniqueId(),
        startTime: '11:30',
        endTime: '12:45',
        day: 2, // Tuesday - overlaps with Central Heights and Sunset Hills
        projectName: projects[4],
        location: locations[2],
        isBooked: false,
        parties: 1,
        duration: 15,
        broker: brokers[4],
      },
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '16:45',
        day: 2, // Tuesday - overlaps with Riverside Apartments
        projectName: projects[7],
        location: locations[4],
        isBooked: true,
        parties: 2,
        duration: 20,
        broker: brokers[7],
      }
    );

    // Wednesday slots (day 3)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:30',
        endTime: '11:30',
        day: 3, // Wednesday
        projectName: projects[4],
        location: locations[3],
        isBooked: false,
        parties: 2,
        duration: 60,
        broker: brokers[4],
      },
      // Adding more overlapping slots for Wednesday
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 3, // Wednesday - overlaps with Metro Lofts
        projectName: projects[2],
        location: locations[1],
        isBooked: true,
        parties: 3,
        duration: 30,
        broker: brokers[2],
      },
      {
        id: getUniqueId(),
        startTime: '10:30',
        endTime: '11:45',
        day: 3, // Wednesday - overlaps with Metro Lofts and Central Heights
        projectName: projects[0],
        location: locations[0],
        isBooked: false,
        parties: 1,
        duration: 15,
        broker: brokers[0],
      },
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '12:30',
        day: 3, // Wednesday - complex overlap with multiple events
        projectName: projects[1],
        location: locations[2],
        isBooked: true,
        parties: 2,
        duration: 20,
        broker: brokers[1],
      }
    );

    // Thursday slots (day 4)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '08:00',
        endTime: '10:00',
        day: 4, // Thursday
        projectName: projects[5],
        location: locations[4],
        isBooked: true,
        parties: 3,
        duration: 40,
        broker: brokers[5],
      },
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:30',
        day: 4, // Thursday
        projectName: projects[0],
        location: locations[2],
        isBooked: true,
        parties: 4,
        duration: 15,
        broker: brokers[0],
      },
      // Adding overlapping slots for Thursday
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '10:30',
        day: 4, // Thursday - overlaps with Parkside Gardens
        projectName: projects[3],
        location: locations[1],
        isBooked: false,
        parties: 2,
        duration: 30,
        broker: brokers[3],
      },
      {
        id: getUniqueId(),
        startTime: '08:30',
        endTime: '09:45',
        day: 4, // Thursday - overlaps with Parkside Gardens
        projectName: projects[1],
        location: locations[3],
        isBooked: true,
        parties: 1,
        duration: 15,
        broker: brokers[1],
      },
      {
        id: getUniqueId(),
        startTime: '14:30',
        endTime: '16:00',
        day: 4, // Thursday - overlaps with Oceanview
        projectName: projects[2],
        location: locations[0],
        isBooked: false,
        parties: 3,
        duration: 20,
        broker: brokers[2],
      },
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '17:00',
        day: 4, // Thursday - overlaps with Oceanview and Central Heights
        projectName: projects[7],
        location: locations[4],
        isBooked: true,
        parties: 2,
        duration: 30,
        broker: brokers[7],
      }
    );

    // Friday slots (day 5)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '13:00',
        day: 5, // Friday
        projectName: projects[6],
        location: locations[1],
        isBooked: false,
        parties: 2,
        duration: 30,
        broker: brokers[6],
      },
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '17:00',
        day: 5, // Friday
        projectName: projects[7],
        location: locations[0],
        isBooked: true,
        parties: 1,
        duration: 90,
        broker: brokers[7],
      },
      // Adding overlapping slots for Friday
      {
        id: getUniqueId(),
        startTime: '11:30',
        endTime: '12:45',
        day: 5, // Friday - overlaps with Sunset Hills
        projectName: projects[4],
        location: locations[2],
        isBooked: true,
        parties: 3,
        duration: 25,
        broker: brokers[4],
      },
      {
        id: getUniqueId(),
        startTime: '12:00',
        endTime: '13:30',
        day: 5, // Friday - overlaps with Sunset Hills and Metro Lofts
        projectName: projects[0],
        location: locations[4],
        isBooked: false,
        parties: 2,
        duration: 15,
        broker: brokers[0],
      },
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:30',
        day: 5, // Friday - overlaps with Downtown Collection
        projectName: projects[3],
        location: locations[3],
        isBooked: true,
        parties: 1,
        duration: 30,
        broker: brokers[3],
      }
    );

    // Cross-week events for first week (ending in next week)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 5, // Friday of the first week
        projectName: 'Cross-Week Workshop',
        location: locations[0],
        isBooked: true,
        parties: 6,
        duration: 120,
        broker: brokers[0],
        isCrossWeek: true,
        endDay: 1, // Ends on Monday of next week
        endTime: '14:00',
      },
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 5, // Friday of the first week
        projectName: projects[1],
        location: locations[2],
        isBooked: true,
        parties: 4,
        duration: 180,
        broker: brokers[1],
        isCrossWeek: true,
        endDay: 2, // Ends on Tuesday of next week
        endTime: '12:00',
      }
    );
  } else {
    // Second week data (Odd weeks) - Different pattern for variety
    // Monday slots (day 1)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 1, // Monday
        projectName: projects[7],
        location: locations[2],
        isBooked: true,
        parties: 3,
        duration: 30,
        broker: brokers[7],
      },
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 1, // Monday
        projectName: projects[4],
        location: locations[3],
        isBooked: false,
        parties: 2,
        duration: 25,
        broker: brokers[4],
      },
      {
        id: getUniqueId(),
        startTime: '11:30',
        endTime: '13:00',
        day: 1, // Monday - overlapping
        projectName: projects[2],
        location: locations[1],
        isBooked: true,
        parties: 1,
        duration: 20,
        broker: brokers[2],
      }
    );

    // Tuesday slots (day 2)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '11:00',
        day: 2, // Tuesday
        projectName: projects[0],
        location: locations[0],
        isBooked: true,
        parties: 2,
        duration: 30,
        broker: brokers[0],
      },
      {
        id: getUniqueId(),
        startTime: '13:00',
        endTime: '15:00',
        day: 2, // Tuesday
        projectName: projects[5],
        location: locations[4],
        isBooked: false,
        parties: 4,
        duration: 40,
        broker: brokers[5],
      },
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:30',
        day: 2, // Tuesday - overlapping
        projectName: projects[3],
        location: locations[2],
        isBooked: true,
        parties: 2,
        duration: 25,
        broker: brokers[3],
      }
    );

    // Wednesday slots (day 3)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:30',
        endTime: '12:30',
        day: 3, // Wednesday
        projectName: projects[1],
        location: locations[1],
        isBooked: true,
        parties: 3,
        duration: 30,
        broker: brokers[1],
      },
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '17:00',
        day: 3, // Wednesday
        projectName: projects[6],
        location: locations[3],
        isBooked: false,
        parties: 2,
        duration: 20,
        broker: brokers[6],
      },
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '13:30',
        day: 3, // Wednesday - overlapping
        projectName: projects[4],
        location: locations[0],
        isBooked: true,
        parties: 1,
        duration: 15,
        broker: brokers[4],
      }
    );

    // Thursday slots (day 4)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:30',
        endTime: '11:30',
        day: 4, // Thursday
        projectName: projects[3],
        location: locations[2],
        isBooked: false,
        parties: 3,
        duration: 25,
        broker: brokers[3],
      },
      {
        id: getUniqueId(),
        startTime: '14:30',
        endTime: '16:30',
        day: 4, // Thursday
        projectName: projects[7],
        location: locations[4],
        isBooked: true,
        parties: 2,
        duration: 30,
        broker: brokers[7],
      },
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 4, // Thursday - overlapping
        projectName: projects[5],
        location: locations[1],
        isBooked: false,
        parties: 1,
        duration: 20,
        broker: brokers[5],
      }
    );

    // Friday slots (day 5)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 5, // Friday
        projectName: projects[2],
        location: locations[0],
        isBooked: true,
        parties: 2,
        duration: 25,
        broker: brokers[2],
      },
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 5, // Friday
        projectName: projects[0],
        location: locations[3],
        isBooked: false,
        parties: 3,
        duration: 30,
        broker: brokers[0],
      },
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '13:00',
        day: 5, // Friday - overlapping
        projectName: projects[6],
        location: locations[2],
        isBooked: true,
        parties: 1,
        duration: 15,
        broker: brokers[6],
      }
    );

    // Cross-week events for second week (ending in next week)
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '13:00',
        endTime: '15:00',
        day: 5, // Friday of second week
        projectName: 'Multi-Day Training',
        location: locations[1],
        isBooked: true,
        parties: 5,
        duration: 240,
        broker: brokers[2],
        isCrossWeek: true,
        endDay: 2, // Ends on Tuesday of next week
        endTime: '15:00',
      },
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 5, // Friday of second week
        projectName: projects[4],
        location: locations[0],
        isBooked: false,
        parties: 2,
        duration: 120,
        broker: brokers[4],
        isCrossWeek: true,
        endDay: 1, // Ends on Monday of next week
        endTime: '12:00',
      }
    );
  }

  // Add broker events (personal calendar items)
  // Common broker events that appear in both weeks
  // Sarah Johnson's events
  mockSlots.push(
    {
      id: getUniqueId(),
      startTime: '12:00',
      endTime: '13:00',
      day: 1, // Monday
      projectName: 'Lunch with Client',
      isBooked: true,
      broker: brokers[0],
      isBrokerEvent: true,
      location: 'Restaurant',
      parties: 2,
      duration: 60
    },
    {
      id: getUniqueId(),
      startTime: '16:00',
      endTime: '17:00',
      day: 3, // Wednesday
      projectName: 'Team Meeting',
      isBooked: true,
      broker: brokers[0],
      isBrokerEvent: true,
      location: 'Office',
      parties: 5,
      duration: 60
    }
  );
  
  // Michael Chen's events
  mockSlots.push(
    {
      id: getUniqueId(),
      startTime: '09:00',
      endTime: '10:00',
      day: 2, // Tuesday
      projectName: 'Property Inspection',
      isBooked: true,
      broker: brokers[1],
      isBrokerEvent: true,
      location: 'Property Site',
      parties: 1,
      duration: 60
    },
    {
      id: getUniqueId(),
      startTime: '14:00',
      endTime: '15:30',
      day: 5, // Friday
      projectName: 'Contract Review',
      isBooked: true,
      broker: brokers[1],
      isBrokerEvent: true,
      location: 'Office',
      parties: 2,
      duration: 90
    }
  );
  
  // Emma Williams's events
  mockSlots.push(
    {
      id: getUniqueId(),
      startTime: '13:00',
      endTime: '14:00',
      day: 4, // Thursday
      projectName: 'Client Call',
      isBooked: true,
      broker: brokers[2],
      isBrokerEvent: true,
      location: 'Virtual',
      parties: 1,
      duration: 60
    }
  );

  // Week-specific broker events
  if (currentWeekNumber % 2 === 0) {
    // Additional broker events for even weeks
    // Sarah Johnson's events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:30',
        endTime: '10:30',
        day: 2, // Tuesday
        projectName: 'Market Research',
        isBooked: true,
        broker: brokers[0],
        isBrokerEvent: true,
        location: 'Office',
        parties: 1,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '14:30',
        endTime: '15:30',
        day: 5, // Friday
        projectName: 'Weekly Planning',
        isBooked: true,
        broker: brokers[0],
        isBrokerEvent: true,
        location: 'Office',
        parties: 1,
        duration: 60
      },
      // Overlapping with property showing
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '10:45',
        day: 1, // Monday - overlaps with Oceanview showing
        projectName: 'Emergency Call',
        isBooked: true,
        broker: brokers[0],
        isBrokerEvent: true,
        location: 'Virtual',
        parties: 1,
        duration: 45
      }
    );
    
    // Michael Chen's events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '11:30',
        endTime: '12:30',
        day: 1, // Monday
        projectName: 'Client Meeting',
        isBooked: true,
        broker: brokers[1],
        isBrokerEvent: true,
        location: 'Office',
        parties: 2,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 3, // Wednesday
        projectName: 'Professional Development',
        isBooked: true,
        broker: brokers[1],
        isBrokerEvent: true,
        location: 'Training Room',
        parties: 10,
        duration: 60
      },
      // Overlapping event
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '14:45',
        day: 1, // Monday - overlaps with property showing
        projectName: 'Urgent Client Call',
        isBooked: true,
        broker: brokers[1],
        isBrokerEvent: true,
        location: 'Virtual',
        parties: 1,
        duration: 45
      }
    );
    
    // Emma Williams's events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '08:30',
        endTime: '09:30',
        day: 1, // Monday
        projectName: 'Morning Review',
        isBooked: true,
        broker: brokers[2],
        isBrokerEvent: true,
        location: 'Office',
        parties: 1,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 3, // Wednesday
        projectName: 'Marketing Meeting',
        isBooked: true,
        broker: brokers[2],
        isBrokerEvent: true,
        location: 'Conference Room',
        parties: 4,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '12:30',
        day: 2, // Tuesday - overlaps with property showing
        projectName: 'Professional Photoshoot',
        isBooked: true,
        broker: brokers[2],
        isBrokerEvent: true,
        location: 'Property Site',
        parties: 3,
        duration: 90
      }
    );

    // Additional brokers' events for even weeks
    // David Rodriguez's events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '08:00',
        endTime: '09:00',
        day: 1, // Monday
        projectName: 'Team Breakfast',
        isBooked: true,
        broker: brokers[3],
        isBrokerEvent: true,
        location: 'Cafe',
        parties: 6,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '12:30',
        endTime: '13:30',
        day: 3, // Wednesday
        projectName: 'Lunch and Learn',
        isBooked: true,
        broker: brokers[3],
        isBrokerEvent: true,
        location: 'Training Room',
        parties: 10,
        duration: 60
      }
    );

    // Robert Taylor's events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '12:00',
        day: 1, // Monday
        projectName: 'Property Valuation',
        isBooked: true,
        broker: brokers[5],
        isBrokerEvent: true,
        location: 'Property Site',
        parties: 2,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '13:30',
        endTime: '14:30',
        day: 3, // Wednesday
        projectName: 'Department Meeting',
        isBooked: true,
        broker: brokers[5],
        isBrokerEvent: true,
        location: 'Conference Room',
        parties: 8,
        duration: 60
      }
    );
  } else {
    // Additional broker events for odd weeks
    // Sarah Johnson's odd week events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '12:00',
        day: 2, // Tuesday
        projectName: 'Strategy Session',
        isBooked: true,
        broker: brokers[0],
        isBrokerEvent: true,
        location: 'Office',
        parties: 4,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 4, // Thursday
        projectName: 'Client Presentation',
        isBooked: true,
        broker: brokers[0],
        isBrokerEvent: true,
        location: 'Conference Room',
        parties: 5,
        duration: 60
      }
    );
    
    // Michael Chen's odd week events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '11:00',
        day: 3, // Wednesday
        projectName: 'Sales Training',
        isBooked: true,
        broker: brokers[1],
        isBrokerEvent: true,
        location: 'Training Room',
        parties: 10,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '13:00',
        endTime: '14:00',
        day: 5, // Friday
        projectName: 'Team Review',
        isBooked: true,
        broker: brokers[1],
        isBrokerEvent: true,
        location: 'Office',
        parties: 6,
        duration: 60
      }
    );
    
    // Emma Williams's odd week events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '10:00',
        day: 1, // Monday
        projectName: 'Weekly Kickoff',
        isBooked: true,
        broker: brokers[2],
        isBrokerEvent: true,
        location: 'Office',
        parties: 3,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 5, // Friday
        projectName: 'Market Analysis',
        isBooked: true,
        broker: brokers[2],
        isBrokerEvent: true,
        location: 'Office',
        parties: 1,
        duration: 60
      }
    );

    // Additional brokers' odd week events
    // David Rodriguez's odd week events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '10:30',
        endTime: '11:30',
        day: 2, // Tuesday
        projectName: 'Virtual Showing',
        isBooked: true,
        broker: brokers[3],
        isBrokerEvent: true,
        location: 'Virtual',
        parties: 3,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '14:30',
        endTime: '15:30',
        day: 4, // Thursday
        projectName: 'Client Follow-up',
        isBooked: true,
        broker: brokers[3],
        isBrokerEvent: true,
        location: 'Office',
        parties: 1,
        duration: 60
      }
    );

    // Jessica Kim's odd week events
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '09:30',
        endTime: '10:30',
        day: 1, // Monday
        projectName: 'Marketing Review',
        isBooked: true,
        broker: brokers[4],
        isBrokerEvent: true,
        location: 'Conference Room',
        parties: 4,
        duration: 60
      },
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '16:30',
        day: 3, // Wednesday
        projectName: 'Content Planning',
        isBooked: true,
        broker: brokers[4],
        isBrokerEvent: true,
        location: 'Office',
        parties: 2,
        duration: 60
      }
    );
  }

  return mockSlots;
};
