// Hardcoded data for standalone execution
export const mockUsers = [
  { userId: 1, username: 'johndoe', friendIds: [2], profile: { age: 25, gender: 'Male', totalPoints: 100 } },
  { userId: 2, username: 'janedoe', friendIds: [1], profile: { age: 28, gender: 'Female', totalPoints: 150 } },
  { userId: 3, username: 'alice', friendIds: [], profile: { age: 30, gender: 'Female', totalPoints: 50 } }
];

export const mockActivities = [
  {
    activityId: 101,
    hostId: 1,
    completed: false,
    details: {
      activityType: 'Hiking',
      date: [29, 5, 2025], // [Day, Month, Year]
      location: 'Olympus, Litochoro',
      maxParticipants: 10,
      difficultyLevel: 'Intermediate',
      equipment: ['HikingSticks']
    },
    participants: [1, 2]
  },
  {
    activityId: 102,
    hostId: 2,
    completed: true, // Completed activity for review testing
    details: {
      activityType: 'Cycling',
      date: [15, 4, 2025],
      location: 'Beach, Thessaloniki',
      maxParticipants: 5,
      difficultyLevel: 'Beginner',
      equipment: ['Bicycle', 'Helmet']
    },
    participants: [2, 1]
  }
];

export const mockJoinRequests = [];
export const mockReviews = [];