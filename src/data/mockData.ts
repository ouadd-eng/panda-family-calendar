import { TimeSlot, getUniqueId } from '../utils/calendarUtils';
import { addDays, format, getWeek, getWeekOfMonth } from 'date-fns';

// Generate mock data for a week or multiple weeks
export const generateMockTimeSlots = (currentDate: Date): TimeSlot[] => {
  const mockSlots: TimeSlot[] = [];
  
  // Get the week number of the current date to determine which week's data to show
  const currentWeekNumber = getWeek(currentDate);
  
  // Family Events & Activities
  const familyEvents = [
    'Soccer Practice',
    'Piano Lessons', 
    'Work Meeting',
    'Dentist Appointment',
    'Birthday Party',
    'School Event',
    'Family Dinner',
    'Grocery Shopping',
    'Swimming Lessons',
    'Parent-Teacher Conference',
    'Homework Time',
    'Movie Night',
    'Playdate',
    'Basketball Practice',
    'Art Class',
    'Doctor Visit',
    'Team Project Meeting',
    'Cooking Together',
    'Reading Time',
    'Dance Class',
    'Study Group',
    'Math Tutoring',
    'Client Presentation',
    'Board Meeting',
    'Yoga Class',
    'Book Club',
    'Guitar Practice',
    'Science Fair',
    'Karate Class',
    'Shopping with Friends'
  ];
  
  // Locations
  const locations = [
    'Home',
    'School',
    'Soccer Field', 
    'Music Studio',
    'Office',
    'Doctor\'s Office',
    'Community Center',
    'Library',
    'Park',
    'Mall',
    'Dance Studio',
    'Restaurant',
    'Gym',
    'Pool',
    'Friend\'s House',
    'Karate Dojo',
    'Tutor Center',
    'Coffee Shop',
    'Conference Room'
  ];

  // Family Members
  const familyMembers = [
    'Lisa (Mom)',
    'Ahmed (Dad)', 
    'Selma (16)',
    'Youssef (12)',
    'Sofia (8)'
  ];

  // Generate first week's data
  if (currentWeekNumber % 2 === 0) {
    // Monday Events
    mockSlots.push(
      // Lisa's work meeting
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '10:30',
        day: 1,
        projectName: 'Team Strategy Meeting',
        location: locations[4], // Office
        isBooked: true,
        parties: 5,
        duration: 90,
        broker: familyMembers[0], // Lisa
      },
      // Ahmed's client call
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '15:00',
        day: 1,
        projectName: 'Client Presentation',
        location: locations[18], // Conference Room
        isBooked: true,
        parties: 3,
        duration: 60,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's study group
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '18:00',
        day: 1,
        projectName: 'AP Chemistry Study Group',
        location: locations[7], // Library
        isBooked: true,
        parties: 4,
        duration: 120,
        broker: familyMembers[2], // Selma
      },
      // Youssef's soccer practice
      {
        id: getUniqueId(),
        startTime: '17:00',
        endTime: '18:30',
        day: 1,
        projectName: 'Soccer Practice',
        location: locations[2], // Soccer Field
        isBooked: true,
        parties: 15,
        duration: 90,
        broker: familyMembers[3], // Youssef
      },
      // Sofia's dance class
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '16:30',
        day: 1,
        projectName: 'Ballet Class',
        location: locations[10], // Dance Studio
        isBooked: true,
        parties: 8,
        duration: 60,
        broker: familyMembers[4], // Sofia
      }
    );

    // Tuesday Events
    mockSlots.push(
      // Lisa's yoga class
      {
        id: getUniqueId(),
        startTime: '07:00',
        endTime: '08:00',
        day: 2,
        projectName: 'Morning Yoga',
        location: locations[12], // Gym
        isBooked: true,
        parties: 12,
        duration: 60,
        broker: familyMembers[0], // Lisa
      },
      // Ahmed's board meeting
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '12:00',
        day: 2,
        projectName: 'Board Meeting',
        location: locations[4], // Office
        isBooked: true,
        parties: 8,
        duration: 120,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's piano lesson
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 2,
        projectName: 'Piano Lessons',
        location: locations[3], // Music Studio
        isBooked: true,
        parties: 1,
        duration: 60,
        broker: familyMembers[2], // Selma
      },
      // Youssef's math tutoring
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 2,
        projectName: 'Math Tutoring',
        location: locations[16], // Tutor Center
        isBooked: true,
        parties: 1,
        duration: 60,
        broker: familyMembers[3], // Youssef
      },
      // Sofia's playdate
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 2,
        projectName: 'Playdate with Emma',
        location: locations[14], // Friend's House
        isBooked: true,
        parties: 2,
        duration: 120,
        broker: familyMembers[4], // Sofia
      }
    );

    // Wednesday Events
    mockSlots.push(
      // Family dentist appointments
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '11:00',
        day: 3,
        projectName: 'Sofia\'s Dentist Appointment',
        location: locations[5], // Doctor's Office
        isBooked: true,
        parties: 2,
        duration: 60,
        broker: familyMembers[4], // Sofia
      },
      {
        id: getUniqueId(),
        startTime: '11:30',
        endTime: '12:30',
        day: 3,
        projectName: 'Youssef\'s Dentist Appointment',
        location: locations[5], // Doctor's Office
        isBooked: true,
        parties: 2,
        duration: 60,
        broker: familyMembers[3], // Youssef
      },
      // Ahmed's work from home
      {
        id: getUniqueId(),
        startTime: '09:00',
        endTime: '17:00',
        day: 3,
        projectName: 'Work from Home',
        location: locations[0], // Home
        isBooked: true,
        parties: 1,
        duration: 480,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's basketball practice
      {
        id: getUniqueId(),
        startTime: '17:30',
        endTime: '19:00',
        day: 3,
        projectName: 'Basketball Practice',
        location: locations[12], // Gym
        isBooked: true,
        parties: 12,
        duration: 90,
        broker: familyMembers[2], // Selma
      }
    );

    // Thursday Events
    mockSlots.push(
      // Lisa's book club
      {
        id: getUniqueId(),
        startTime: '19:00',
        endTime: '21:00',
        day: 4,
        projectName: 'Book Club Meeting',
        location: locations[17], // Coffee Shop
        isBooked: true,
        parties: 6,
        duration: 120,
        broker: familyMembers[0], // Lisa
      },
      // Ahmed's client dinner
      {
        id: getUniqueId(),
        startTime: '18:00',
        endTime: '20:00',
        day: 4,
        projectName: 'Client Dinner',
        location: locations[11], // Restaurant
        isBooked: true,
        parties: 4,
        duration: 120,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's driving lesson
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 4,
        projectName: 'Driving Lesson',
        location: locations[0], // Home
        isBooked: true,
        parties: 2,
        duration: 60,
        broker: familyMembers[2], // Selma
      },
      // Youssef's karate class
      {
        id: getUniqueId(),
        startTime: '16:30',
        endTime: '17:30',
        day: 4,
        projectName: 'Karate Class',
        location: locations[15], // Karate Dojo
        isBooked: true,
        parties: 10,
        duration: 60,
        broker: familyMembers[3], // Youssef
      },
      // Sofia's swimming lesson
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 4,
        projectName: 'Swimming Lessons',
        location: locations[13], // Pool
        isBooked: true,
        parties: 6,
        duration: 60,
        broker: familyMembers[4], // Sofia
      }
    );

    // Friday Events
    mockSlots.push(
      // Family movie night preparation
      {
        id: getUniqueId(),
        startTime: '18:00',
        endTime: '21:00',
        day: 5,
        projectName: 'Family Movie Night',
        location: locations[0], // Home
        isBooked: true,
        parties: 5,
        duration: 180,
        broker: 'Family',
      },
      // Lisa's grocery shopping
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:30',
        day: 5,
        projectName: 'Grocery Shopping',
        location: locations[9], // Mall
        isBooked: true,
        parties: 1,
        duration: 90,
        broker: familyMembers[0], // Lisa
      },
      // Selma's part-time job
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '19:00',
        day: 5,
        projectName: 'Part-time Job (Cafe)',
        location: locations[17], // Coffee Shop
        isBooked: true,
        parties: 1,
        duration: 240,
        broker: familyMembers[2], // Selma
      },
      // Youssef's guitar practice
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '16:30',
        day: 5,
        projectName: 'Guitar Practice',
        location: locations[3], // Music Studio
        isBooked: true,
        parties: 1,
        duration: 60,
        broker: familyMembers[3], // Youssef
      }
    );

    // Weekend prep events spanning into next week
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 5,
        projectName: 'Weekend Family Trip Planning',
        location: locations[0], // Home
        isBooked: true,
        parties: 5,
        duration: 120,
        broker: 'Family',
        isCrossWeek: true,
        endDay: 1, // Continues planning on Monday
      }
    );

  } else {
    // Second week data - Different schedule
    // Monday Events
    mockSlots.push(
      // Ahmed's early morning workout
      {
        id: getUniqueId(),
        startTime: '06:30',
        endTime: '07:30',
        day: 1,
        projectName: 'Morning Workout',
        location: locations[12], // Gym
        isBooked: true,
        parties: 1,
        duration: 60,
        broker: familyMembers[1], // Ahmed
      },
      // Lisa's team meeting
      {
        id: getUniqueId(),
        startTime: '11:00',
        endTime: '12:30',
        day: 1,
        projectName: 'Project Review Meeting',
        location: locations[4], // Office
        isBooked: true,
        parties: 6,
        duration: 90,
        broker: familyMembers[0], // Lisa
      },
      // Selma's SAT prep
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '16:00',
        day: 1,
        projectName: 'SAT Prep Class',
        location: locations[16], // Tutor Center
        isBooked: true,
        parties: 8,
        duration: 120,
        broker: familyMembers[2], // Selma
      },
      // Youssef's science club
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '16:30',
        day: 1,
        projectName: 'Science Club Meeting',
        location: locations[1], // School
        isBooked: true,
        parties: 12,
        duration: 60,
        broker: familyMembers[3], // Youssef
      },
      // Sofia's art class
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:00',
        day: 1,
        projectName: 'Art Class',
        location: locations[6], // Community Center
        isBooked: true,
        parties: 10,
        duration: 60,
        broker: familyMembers[4], // Sofia
      }
    );

    // Tuesday Events
    mockSlots.push(
      // Parent-teacher conferences
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '16:30',
        day: 2,
        projectName: 'Youssef\'s Parent-Teacher Conference',
        location: locations[1], // School
        isBooked: true,
        parties: 3,
        duration: 30,
        broker: familyMembers[3], // Youssef
      },
      {
        id: getUniqueId(),
        startTime: '16:45',
        endTime: '17:15',
        day: 2,
        projectName: 'Sofia\'s Parent-Teacher Conference',
        location: locations[1], // School
        isBooked: true,
        parties: 3,
        duration: 30,
        broker: familyMembers[4], // Sofia
      },
      // Ahmed's important presentation
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '15:30',
        day: 2,
        projectName: 'Quarterly Business Review',
        location: locations[18], // Conference Room
        isBooked: true,
        parties: 12,
        duration: 90,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's volunteer work
      {
        id: getUniqueId(),
        startTime: '17:30',
        endTime: '19:00',
        day: 2,
        projectName: 'Volunteer at Animal Shelter',
        location: locations[6], // Community Center
        isBooked: true,
        parties: 1,
        duration: 90,
        broker: familyMembers[2], // Selma
      }
    );

    // Wednesday Events
    mockSlots.push(
      // Mid-week family dinner
      {
        id: getUniqueId(),
        startTime: '18:30',
        endTime: '20:00',
        day: 3,
        projectName: 'Family Dinner at Restaurant',
        location: locations[11], // Restaurant
        isBooked: true,
        parties: 5,
        duration: 90,
        broker: 'Family',
      },
      // Lisa's doctor appointment
      {
        id: getUniqueId(),
        startTime: '10:00',
        endTime: '11:00',
        day: 3,
        projectName: 'Annual Checkup',
        location: locations[5], // Doctor's Office
        isBooked: true,
        parties: 1,
        duration: 60,
        broker: familyMembers[0], // Lisa
      },
      // Youssef's basketball game
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '17:30',
        day: 3,
        projectName: 'Basketball Game vs Eagles',
        location: locations[12], // Gym
        isBooked: true,
        parties: 25,
        duration: 90,
        broker: familyMembers[3], // Youssef
      }
    );

    // Thursday Events  
    mockSlots.push(
      // Ahmed's golf meeting
      {
        id: getUniqueId(),
        startTime: '13:00',
        endTime: '16:00',
        day: 4,
        projectName: 'Business Golf Meeting',
        location: locations[8], // Park
        isBooked: true,
        parties: 4,
        duration: 180,
        broker: familyMembers[1], // Ahmed
      },
      // Selma's college prep meeting
      {
        id: getUniqueId(),
        startTime: '15:00',
        endTime: '16:00',
        day: 4,
        projectName: 'College Counselor Meeting',
        location: locations[1], // School
        isBooked: true,
        parties: 3,
        duration: 60,
        broker: familyMembers[2], // Selma
      },
      // Sofia's friend's birthday party
      {
        id: getUniqueId(),
        startTime: '15:30',
        endTime: '17:30',
        day: 4,
        projectName: 'Lily\'s Birthday Party',
        location: locations[14], // Friend's House
        isBooked: true,
        parties: 10,
        duration: 120,
        broker: familyMembers[4], // Sofia
      }
    );

    // Friday Events
    mockSlots.push(
      // Lisa's team building
      {
        id: getUniqueId(),
        startTime: '14:00',
        endTime: '18:00',
        day: 5,
        projectName: 'Team Building Event',
        location: locations[8], // Park
        isBooked: true,
        parties: 15,
        duration: 240,
        broker: familyMembers[0], // Lisa
      },
      // Ahmed's networking event
      {
        id: getUniqueId(),
        startTime: '18:30',
        endTime: '21:00',
        day: 5,
        projectName: 'Business Networking Event',
        location: locations[11], // Restaurant
        isBooked: true,
        parties: 40,
        duration: 150,
        broker: familyMembers[1], // Ahmed
      },
      // Kids' homework time
      {
        id: getUniqueId(),
        startTime: '16:00',
        endTime: '18:00',
        day: 5,
        projectName: 'Family Homework Time',
        location: locations[0], // Home
        isBooked: true,
        parties: 3,
        duration: 120,
        broker: 'Kids',
      }
    );

    // Weekend preparation
    mockSlots.push(
      {
        id: getUniqueId(),
        startTime: '19:00',
        endTime: '20:00',
        day: 5,
        projectName: 'Saturday Soccer Tournament Prep',
        location: locations[0], // Home
        isBooked: true,
        parties: 3,
        duration: 60,
        broker: familyMembers[3], // Youssef
        isCrossWeek: true,
        endDay: 2, // Tournament continues on Tuesday
      }
    );
  }

  return mockSlots;
};