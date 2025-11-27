// services/dataService.js

// --- Global State Management ---
/**
 * Global flag tracking if the application is using the database (true) or mock data (false).
 */
export let useDB = false;

/**
 * Sets the global flag to indicate if the application is connected to MongoDB.
 * @param {boolean} status - true if connected, false otherwise.
 */
export const setUseDB = (status) => {
  useDB = status;
  console.log(`[DATA] Switched to ${status ? 'DATABASE' : 'MOCK'} mode.`);
};

// --- Mock Data Definitions ---

let mockUsers = [
  {
    userId: 1,
    username: 'johndoe',
    friendIds: [2, 4, 6],
    profile: {
      age: 25,
      gender: 'Male',
      totalPoints: 120,
      savedActivityIds: [101, 103, 106]
    }
  },
  {
    userId: 2,
    username: 'janedoe',
    friendIds: [1, 3, 5],
    profile: {
      age: 28,
      gender: 'Female',
      totalPoints: 180,
      savedActivityIds: [102, 104, 107]
    }
  },
  {
    userId: 3,
    username: 'alice',
    friendIds: [2, 5],
    profile: {
      age: 30,
      gender: 'Female',
      totalPoints: 95,
      savedActivityIds: [101, 105]
    }
  },
  {
    userId: 4,
    username: 'giannis',
    friendIds: [1, 6, 7],
    profile: {
      age: 27,
      gender: 'Male',
      totalPoints: 210,
      savedActivityIds: [103, 108]
    }
  },
  {
    userId: 5,
    username: 'maria',
    friendIds: [2, 3, 8],
    profile: {
      age: 24,
      gender: 'Female',
      totalPoints: 160,
      savedActivityIds: [104, 105, 106]
    }
  },
  {
    userId: 6,
    username: 'nickrunner',
    friendIds: [1, 4],
    profile: {
      age: 32,
      gender: 'Male',
      totalPoints: 250,
      savedActivityIds: [103, 108]
    }
  },
  {
    userId: 7,
    username: 'sofia',
    friendIds: [4, 8],
    profile: {
      age: 29,
      gender: 'Female',
      totalPoints: 130,
      savedActivityIds: [101, 107]
    }
  },
  {
    userId: 8,
    username: 'kostas',
    friendIds: [5, 7],
    profile: {
      age: 26,
      gender: 'Male',
      totalPoints: 75,
      savedActivityIds: [102, 106]
    }
  }
];

let mockActivities = [
  {
    activityId: 101,
    hostId: 1,
    completed: false,
    details: {
      activityType: 'Hiking',
      date: [29, 5, 2025],
      location: 'Mount Olympus, Litochoro',
      maxParticipants: 10,
      difficultyLevel: 'Intermediate',
      equipment: ['Hiking sticks', 'Backpack', 'Water'],
      time: '07:00'
    },
    participants: [1, 2, 3, 7]
  },
  {
    activityId: 102,
    hostId: 2,
    completed: true,
    details: {
      activityType: 'Cycling',
      date: [15, 4, 2025],
      location: 'Beachfront, Thessaloniki',
      maxParticipants: 5,
      difficultyLevel: 'Beginner',
      equipment: ['Bicycle', 'Helmet', 'Gloves'],
      time: '18:30'
    },
    participants: [2, 1, 8]
  },
  {
    activityId: 103,
    hostId: 6,
    completed: false,
    details: {
      activityType: 'Running',
      date: [17, 2, 2025],
      location: 'Nea Paralia, Thessaloniki',
      maxParticipants: 8,
      difficultyLevel: 'Intermediate',
      equipment: ['Running shoes', 'Sports watch'],
      time: '08:30'
    },
    participants: [6, 1, 4]
  },
  {
    activityId: 104,
    hostId: 4,
    completed: false,
    details: {
      activityType: 'Basketball',
      date: [25, 3, 2025],
      location: 'Outdoor Court, Toumba',
      maxParticipants: 10,
      difficultyLevel: 'Beginner',
      equipment: ['Basketball', 'Sportswear'],
      time: '19:00'
    },
    participants: [4, 2, 5, 8]
  },
  {
    activityId: 105,
    hostId: 5,
    completed: false,
    details: {
      activityType: 'Yoga',
      date: [5, 6, 2025],
      location: 'Park, Kalamaria',
      maxParticipants: 12,
      difficultyLevel: 'Beginner',
      equipment: ['Yoga mat', 'Towel', 'Water'],
      time: '09:30'
    },
    participants: [5, 3, 7]
  },
  {
    activityId: 106,
    hostId: 3,
    completed: true,
    details: {
      activityType: 'Board Games',
      date: [2, 1, 2025],
      location: 'Board Game Café, City Center',
      maxParticipants: 6,
      difficultyLevel: 'All Levels',
      equipment: ['Board games', 'Snacks'],
      time: '20:00'
    },
    participants: [3, 1, 2, 5, 8]
  },
  {
    activityId: 107,
    hostId: 7,
    completed: true,
    details: {
      activityType: 'Hiking',
      date: [10, 11, 2024],
      location: 'Chortiatis Mountain',
      maxParticipants: 15,
      difficultyLevel: 'Advanced',
      equipment: ['Hiking boots', 'Jacket', 'Headlamp'],
      time: '06:30'
    },
    participants: [7, 2, 6]
  },
  {
    activityId: 108,
    hostId: 6,
    completed: false,
    details: {
      activityType: 'Swimming',
      date: [30, 7, 2025],
      location: 'Municipal Swimming Pool, Pylaia',
      maxParticipants: 10,
      difficultyLevel: 'Intermediate',
      equipment: ['Swimsuit', 'Goggles', 'Flip-flops'],
      time: '17:00'
    },
    participants: [6, 1, 4, 5]
  },
  // 🔴 NEW: FULL upcoming activity (userId 1 ΔΕΝ συμμετέχει)
  {
    activityId: 109,
    hostId: 8,
    completed: false,
    details: {
      activityType: 'Football',
      date: [12, 8, 2025],
      location: 'Stadium, Menemeni',
      maxParticipants: 6,
      difficultyLevel: 'Intermediate',
      equipment: ['Football shoes', 'Shin guards'],
      time: '21:00'
    },
    // 6 συμμετέχοντες = maxParticipants (FULL) – ΔΕΝ έχει τον 1
    participants: [2, 3, 4, 5, 6, 7]
  },
  // 🔴 NEW: FULL upcoming activity (πάλι χωρίς τον user 1)
  {
    activityId: 110,
    hostId: 9,
    completed: false,
    details: {
      activityType: 'Tennis',
      date: [7, 9, 2025],
      location: 'Tennis Club, Panorama',
      maxParticipants: 4,
      difficultyLevel: 'Advanced',
      equipment: ['Tennis racket', 'Tennis balls'],
      time: '18:00'
    },
    // 4 συμμετέχοντες = maxParticipants (FULL) – ΔΕΝ έχει τον 1
    participants: [2, 3, 8, 9]
  }
];


let mockReviews = [];
let mockJoinRequests = [];
let mockPins = [
  { pinId: 1, userId: 1, activityId: 101 },
  { pinId: 2, userId: 1, activityId: 103 }
];
let mockNotifications = [];

const generateId = () => Math.floor(Math.random() * 100000);

// Helper: μετατροπή internal activity -> view object για λεπτομέρειες
const toActivityView = (a) => {
  if (!a) return null;

  const participants = a.participants.map((pid) => {
    const u = mockUsers.find((x) => x.userId === pid);
    return { userId: pid, username: u?.username || `User ${pid}` };
  });

  return {
    activityId: a.activityId,
    hostId: a.hostId,
    completed: a.completed,
    activityType: a.details.activityType,
    date: a.details.date,
    time: a.details.time || null,
    location: a.details.location,
    maxParticipants: a.details.maxParticipants,
    difficultyLevel: a.details.difficultyLevel,
    equipment: a.details.equipment,
    participants,
    currentParticipants: participants.length
  };
};

// Helper για να φτιάχνουμε το object που βλέπει το frontend στο feed
const toActivityPreview = (act) => {
  const pinned = mockPins.some(p => p.activityId === act.activityId);

  return {
    activityId: act.activityId,
    completed: act.completed,
    // δίνουμε ΚΑΙ pinned ΚΑΙ isPinned για να είμαστε σίγουροι
    pinned,
    isPinned: pinned,
    details: {
      activityType: act.details.activityType,
      date: act.details.date,
      time: act.details.time,
      location: act.details.location,
      maxParticipants: act.details.maxParticipants,
      difficultyLevel: act.details.difficultyLevel,
      equipment: act.details.equipment
    }
  };
};


// --- Activity CRUD & Retrieval ---

export const getAllActivities = async (filters = {}) => {
  // --- Normalize completed filter ---
  // Αν completed είναι undefined / '' / 'ALL' → δεν εφαρμόζουμε φίλτρο
  const normalizedCompleted =
    filters.completed === undefined ||
    filters.completed === '' ||
    filters.completed === 'ALL'
      ? undefined
      : String(filters.completed) === 'true';

  // --- Normalize type filter ---
  const typeFilter =
    !filters.type || filters.type === 'ALL' ? null : filters.type;

  // --- Normalize location filter ---
  const locFilter =
    !filters.location || filters.location.trim() === ''
      ? null
      : filters.location.trim();

  // --- Normalize difficulty filter ---
  const diffFilter =
    !filters.difficultyLevel ||
    filters.difficultyLevel === 'ALL'
      ? null
      : filters.difficultyLevel;

  // --- Actual filtering ---
  const filtered = mockActivities.filter((act) => {
    let match = true;

    // completed filter
    if (normalizedCompleted !== undefined) {
      match = match && act.completed === normalizedCompleted;
    }

    // type filter
    if (typeFilter) {
      match = match && act.details.activityType === typeFilter;
    }

    // location filter (substring match)
    if (locFilter) {
      match =
        match &&
        act.details.location.toLowerCase().includes(
          locFilter.toLowerCase()
        );
    }

    // difficulty filter
    if (diffFilter) {
      match =
        match && act.details.difficultyLevel === diffFilter;
    }

    return match;
  });

  // --- Convert to preview format ---
  return filtered.map(toActivityPreview);
};




export const getActivityById = async (activityId) => {
  const id = parseInt(activityId);
  return mockActivities.find((a) => a.activityId === id) || null;
};

// View-version για λεπτομέρειες προς το frontend
export const getActivityViewById = async (activityId) => {
  const base = await getActivityById(activityId);
  return toActivityView(base);
};

export const createActivity = async (userId, data) => {
  const newId = generateId();
  const activityData = {
    activityId: newId,
    hostId: parseInt(userId),
    completed: false,
    details: data,
    participants: [parseInt(userId)]
  };
  mockActivities.push(activityData);
  return activityData;
};

export const updateActivity = async (activityId, data) => {
  const id = parseInt(activityId);
  const index = mockActivities.findIndex((a) => a.activityId === id);
  if (index === -1) return null;
  mockActivities[index].details = { ...mockActivities[index].details, ...data };
  return mockActivities[index];
};

export const deleteActivity = async (activityId) => {
  const id = parseInt(activityId);
  const index = mockActivities.findIndex((a) => a.activityId === id);
  if (index === -1) return null;
  const deleted = mockActivities.splice(index, 1);
  return deleted[0];
};

// --- Participation / Join Request ---

export const createJoinRequest = async (userId, activityId) => {
  const newId = generateId();
  const requestData = {
    joinRequestId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId),
    status: 'pending'
  };
  mockJoinRequests.push(requestData);
  return requestData;
};

export const manageJoinRequest = async (joinRequestId, status) => {
  const id = parseInt(joinRequestId);
  const index = mockJoinRequests.findIndex((r) => r.joinRequestId === id);

  if (index === -1) return null;

  mockJoinRequests[index].status = status;

  if (status === 'accepted') {
    const activity = mockActivities.find(
      (a) => a.activityId === mockJoinRequests[index].activityId
    );
    if (activity && !activity.participants.includes(mockJoinRequests[index].userId)) {
      activity.participants.push(mockJoinRequests[index].userId);
    }
  }
  return mockJoinRequests[index];
};

export const deleteParticipation = async (userId, activityId) => {
  const activity = mockActivities.find(
    (a) => a.activityId === parseInt(activityId)
  );
  if (activity) {
    const index = activity.participants.indexOf(parseInt(userId));
    if (index > -1) {
      activity.participants.splice(index, 1);
      return true;
    }
  }
  return false;
};

// --- Social & Utility Actions ---

export const createPin = async (userId, activityId) => {
  const newId = generateId();
  const pin = {
    pinId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId)
  };
  mockPins.push(pin);
  return pin;
};

export const deletePin = async (userId, activityId) => {
  const uId = parseInt(userId);
  const aId = parseInt(activityId);

  const index = mockPins.findIndex(
    (p) => p.userId === uId && p.activityId === aId
  );

  if (index === -1) return null;

  const removed = mockPins.splice(index, 1);
  return removed[0];
};

export const createFriendRequest = async (senderId, receiverId) => {
  const newId = generateId();
  const requestData = {
    friendRequestId: newId,
    senderId: parseInt(senderId),
    receiverId: parseInt(receiverId),
    status: 'pending'
  };

  const sender = mockUsers.find((u) => u.userId === parseInt(senderId));
  const receiver = mockUsers.find((u) => u.userId === parseInt(receiverId));
  if (
    sender &&
    receiver &&
    !sender.friendIds.includes(parseInt(receiverId))
  ) {
    sender.friendIds.push(parseInt(receiverId));
    receiver.friendIds.push(parseInt(senderId));
  }
  return requestData;
};

export const createShare = async (userId, activityId, receiverIds) => {
  const newId = generateId();
  return {
    shareId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId),
    receiverIds: receiverIds.map((id) => parseInt(id))
  };
};

export const createMessage = async (userId, activityId, content) => {
  const newId = generateId();
  return {
    messageId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId),
    messageContent: content
  };
};

export const createNotification = async (
  receiverId,
  senderId,
  content,
  type
) => {
  const newId = generateId();
  const notification = {
    notificationId: newId,
    receiverId: parseInt(receiverId),
    senderId: parseInt(senderId),
    content,
    type
  };
  mockNotifications.push(notification);
  return notification;
};

export const createReview = async (userId, activityId, data) => {
  const newId = generateId();
  const reviewData = {
    reviewId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId),
    rating: data.rating,
    comment: data.comment
  };
  mockReviews.push(reviewData);
  return reviewData;
};

export const createUserRating = async (userId, ratedUserId, rating) => {
  const newId = generateId();
  const ratedUser = mockUsers.find(
    (u) => u.userId === parseInt(ratedUserId)
  );
  if (ratedUser) {
    ratedUser.profile.totalPoints += rating;
  }
  return {
    ratingId: newId,
    userId: parseInt(userId),
    ratedUserId: parseInt(ratedUserId),
    rating: parseInt(rating)
  };
};

export const createSave = async (userId, activityId) => {
  const newId = generateId();
  const user = mockUsers.find((u) => u.userId === parseInt(userId));
  if (user && user.profile.savedActivityIds) {
    if (!user.profile.savedActivityIds.includes(parseInt(activityId))) {
      user.profile.savedActivityIds.push(parseInt(activityId));
    }
  } else if (user) {
    user.profile.savedActivityIds = [parseInt(activityId)];
  }
  return {
    saveId: newId,
    userId: parseInt(userId),
    activityId: parseInt(activityId)
  };
};

export const updatePoints = async (userId, addedPoints) => {
  const user = mockUsers.find((u) => u.userId === parseInt(userId));
  if (!user) return null;
  user.profile.totalPoints += parseInt(addedPoints);
  return { totalPoints: user.profile.totalPoints };
};

// --- Profile Retrieval ---

export const getUserProfile = async (requesterId, profileId) => {
  const reqId = parseInt(requesterId);
  const pId = parseInt(profileId);

  let user = mockUsers.find((u) => u.userId === pId);
  if (!user) return null;

  const savedActivityIds = mockActivities
    .filter((a) => a.participants.includes(pId))
    .map((a) => a.activityId);

  const baseProfile = {
    profileId: pId,
    userId: pId,
    username: user.username,
    totalPoints: user.profile.totalPoints,
    rating: 4.5,
    savedActivityIds: savedActivityIds
  };

  if (reqId === pId) {
    return {
      ...baseProfile,
      participatingActivityIds: mockActivities
        .filter((a) => a.participants.includes(pId) && !a.completed)
        .map((a) => a.activityId),
      completedActivityIds: mockActivities
        .filter((a) => a.participants.includes(pId) && a.completed)
        .map((a) => a.activityId),
      pinnedActivityIds: mockPins
        .filter((p) => p.userId === pId)
        .map((p) => p.activityId),
      friendIds: user.friendIds
    };
  }

  return baseProfile;
};

export const getParticipatingActivities = async (userId) => {
  const uId = parseInt(userId);
  const list = mockActivities.filter(
    (a) => a.participants.includes(uId) && !a.completed
  );
  return list.map(toActivityPreview);
};

export const getParticipatedActivities = async (userId) => {
  const uId = parseInt(userId);
  const list = mockActivities.filter(
    (a) => a.participants.includes(uId) && a.completed
  );
  return list.map(toActivityPreview);
};

// --- Pinned Activities (mock) ---
// Επιστρέφει τις pinned activities για έναν χρήστη, σε preview μορφή
export const getPinnedActivities = async (userId) => {
  const uId = parseInt(userId);

  // Βρίσκουμε όλα τα pins του χρήστη
  const pinnedIds = mockPins
    .filter((p) => p.userId === uId)
    .map((p) => p.activityId);

  if (pinnedIds.length === 0) return [];

  // Βρίσκουμε τα αντίστοιχα activities
  const activities = mockActivities.filter((a) =>
    pinnedIds.includes(a.activityId)
  );

  // Τα γυρίζουμε σε preview format όπως το feed
  return activities.map(toActivityPreview);
};
