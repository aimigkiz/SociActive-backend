import mongoose from 'mongoose';

// --- Global State Management ---
export let useDB = false;

export const setUseDB = (status) => {
  useDB = status;
  console.log(`[DATA] Switched to ${status ? 'DATABASE' : 'MOCK'} mode.`);
};

// Helper function to convert [d, m, y] array to Date object
const arrayToDate = (dateArray) => {
  if (!dateArray || dateArray.length !== 3) return null;
  const [d, m, y] = dateArray;
  return new Date(y, m - 1, d);
};

// 🎯 ΔΙΟΡΘΩΣΗ: Η συνάρτηση τώρα δέχεται ΚΑΙ παύλες (YYYY-MM-DD)
const stringToDate = (dateString) => {
    if (!dateString) return null;
    
    // Περίπτωση 1: YYYY-MM-DD (Αυτό στέλνει το frontend ημερολόγιο)
    if (dateString.includes('-')) {
        const [y, m, d] = dateString.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    
    // Περίπτωση 2: DD/MM/YYYY (Αν το στείλουμε ως κείμενο με κάθετους)
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if(parts.length === 3) {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            return new Date(y, m - 1, d);
        }
    }
    return null;
};

// --- Mock Data Definitions ---

let mockUsers = [
  { userId: 1, username: 'johndoe', friendIds: [2, 4, 6], profile: { age: 25, gender: 'Male', totalPoints: 120, savedActivityIds: [101, 103, 106] } },
  { userId: 2, username: 'janedoe', friendIds: [1, 3, 5], profile: { age: 28, gender: 'Female', totalPoints: 180, savedActivityIds: [102, 104, 107] } },
  { userId: 3, username: 'alice', friendIds: [2, 5], profile: { age: 30, gender: 'Female', totalPoints: 95, savedActivityIds: [101, 105] } },
  { userId: 4, username: 'giannis', friendIds: [1, 6, 7], profile: { age: 27, gender: 'Male', totalPoints: 210, savedActivityIds: [103, 108] } },
  { userId: 5, username: 'maria', friendIds: [2, 3, 8], profile: { age: 24, gender: 'Female', totalPoints: 160, savedActivityIds: [104, 105, 106] } },
  { userId: 6, username: 'nickrunner', friendIds: [1, 4], profile: { age: 32, gender: 'Male', totalPoints: 250, savedActivityIds: [103, 108] } },
  { userId: 7, username: 'sofia', friendIds: [4, 8], profile: { age: 29, gender: 'Female', totalPoints: 130, savedActivityIds: [101, 107] } },
  { userId: 8, username: 'kostas', friendIds: [5, 7], profile: { age: 26, gender: 'Male', totalPoints: 75, savedActivityIds: [102, 106] } }
];

// Mock Activities
let mockActivities = [
  {
    activityId: 101,
    hostId: 1,
    completed: false, 
    details: { activityType: 'Hiking', date: [29, 5, 2025], location: 'Thessaloniki', maxParticipants: 10, difficultyLevel: 'Intermediate', equipment: ['Hiking sticks', 'Backpack', 'Water'], time: '07:00' },
    participants: [1, 2, 3, 7]
  },
  {
    activityId: 102,
    hostId: 2,
    completed: true, 
    details: { activityType: 'Cycling', date: [15, 4, 2025], location: 'Thessaloniki', maxParticipants: 5, difficultyLevel: 'Beginner', equipment: ['Bicycle', 'Helmet', 'Gloves'], time: '18:30' },
    participants: [2, 1, 8]
  },
  {
    activityId: 103,
    hostId: 6,
    completed: false,
    details: { activityType: 'Running', date: [17, 2, 2025], location: 'Thessaloniki', maxParticipants: 8, difficultyLevel: 'Intermediate', equipment: ['Running shoes', 'Smartwatch'], time: '08:30' },
    participants: [6, 1, 4]
  },
  {
    activityId: 104,
    hostId: 4,
    completed: false,
    details: { activityType: 'Running', date: [25, 3, 2025], location: 'Thessaloniki', maxParticipants: 10, difficultyLevel: 'Beginner', equipment: ['Running shoes', 'Water bottle'], time: '19:00' },
    participants: [4, 2, 5, 8]
  },
  {
    activityId: 105,
    hostId: 5,
    completed: false,
    details: { activityType: 'Hiking', date: [5, 6, 2025], location: 'Thessaloniki', maxParticipants: 12, difficultyLevel: 'Beginner', equipment: ['Backpack', 'Hat', 'Water'], time: '09:30' },
    participants: [5, 3, 7]
  },
  {
    activityId: 106,
    hostId: 3,
    completed: true,
    details: { activityType: 'Yoga', date: [2, 1, 2025], location: 'Athens', maxParticipants: 6, difficultyLevel: 'Beginner', equipment: ['Yoga mat', 'Towel'], time: '20:00' },
    participants: [3, 1, 2, 5, 8]
  },
  {
    activityId: 107,
    hostId: 7,
    completed: true,
    details: { activityType: 'Hiking', date: [10, 11, 2024], location: 'Thessaloniki', maxParticipants: 15, difficultyLevel: 'Advanced', equipment: ['Hiking boots', 'Jacket', 'Headlamp'], time: '06:30' },
    participants: [7, 2, 6]
  },
  {
    activityId: 108,
    hostId: 6,
    completed: false,
    details: { activityType: 'Walking', date: [30, 7, 2025], location: 'Patras', maxParticipants: 10, difficultyLevel: 'Intermediate', equipment: ['Comfortable shoes', 'Hat'], time: '17:00' },
    participants: [6, 1, 4, 5]
  },
  {
    activityId: 109,
    hostId: 8,
    completed: false,
    details: { activityType: 'Beach Volley', date: [12, 8, 2025], location: 'Ioannina', maxParticipants: 6, difficultyLevel: 'Intermediate', equipment: ['Sunscreen', 'Sunglasses'], time: '21:00' },
    participants: [2, 3, 4, 5, 6, 7]
  },
  {
    activityId: 110,
    hostId: 9,
    completed: false,
    details: { activityType: 'Running', date: [7, 9, 2025], location: 'Athens', maxParticipants: 4, difficultyLevel: 'Advanced', equipment: ['Running shoes', 'Heart rate monitor'], time: '18:00' },
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

const toActivityPreview = (act) => {
  const pinned = mockPins.some(p => p.activityId === act.activityId);
  return {
    activityId: act.activityId,
    completed: act.completed,
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
  // 1. Completed
  const normalizedCompleted =
    filters.completed === undefined || filters.completed === '' || filters.completed === 'ALL'
      ? undefined
      : String(filters.completed) === 'true';

  // 2. Type
  const typeFilter = (!filters.type || String(filters.type).trim().toUpperCase() === 'ALL')
      ? null : String(filters.type).trim().toLowerCase();

  // 3. Location
  const locFilter = (!filters.location || String(filters.location).trim().toUpperCase() === 'ALL')
      ? null : String(filters.location).trim().toLowerCase();

  // 4. Difficulty
  const diffFilter = (!filters.difficultyLevel || String(filters.difficultyLevel).trim().toUpperCase() === 'ALL')
      ? null : String(filters.difficultyLevel).trim().toLowerCase();
      
  // 5. Date
  const dateFrom = stringToDate(filters.dateFrom);
  const dateTo = stringToDate(filters.dateTo);

  // 6. Max Participants
  const maxParticipantsFilter = 
    !filters.maxParticipants || isNaN(parseInt(filters.maxParticipants)) || parseInt(filters.maxParticipants) <= 0
      ? null
      : parseInt(filters.maxParticipants);
      
  // --- Actual filtering ---
  const filtered = mockActivities.filter((act) => {
    let match = true;

    if (normalizedCompleted !== undefined) match = match && act.completed === normalizedCompleted;
    if (typeFilter) match = match && act.details.activityType.toLowerCase() === typeFilter;
    if (locFilter) match = match && act.details.location.toLowerCase().includes(locFilter);

    if (diffFilter) {
      const actDiff = act.details.difficultyLevel ? act.details.difficultyLevel.toLowerCase() : '';
      if (actDiff !== diffFilter) match = false;
    }

    const activityDate = arrayToDate(act.details.date);
    if (activityDate) {
        if (dateFrom && dateTo) {
            match = match && activityDate >= dateFrom && activityDate <= dateTo;
        } else if (dateFrom) {
            match = match && activityDate >= dateFrom;
        } else if (dateTo) {
            match = match && activityDate <= dateTo;
        }
    }

    if (maxParticipantsFilter !== null) {
        match = match && act.details.maxParticipants <= maxParticipantsFilter;
    }

    return match;
  });

  return filtered.map(toActivityPreview);
};

export const getActivityById = async (activityId) => {
  const id = parseInt(activityId);
  return mockActivities.find((a) => a.activityId === id) || null;
};

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
  const requestData = { joinRequestId: newId, userId: parseInt(userId), activityId: parseInt(activityId), status: 'pending' };
  mockJoinRequests.push(requestData);
  return requestData;
};

export const manageJoinRequest = async (joinRequestId, status) => {
  const id = parseInt(joinRequestId);
  const index = mockJoinRequests.findIndex((r) => r.joinRequestId === id);
  if (index === -1) return null;

  mockJoinRequests[index].status = status;

  if (status === 'accepted') {
    const activity = mockActivities.find((a) => a.activityId === mockJoinRequests[index].activityId);
    if (activity && !activity.participants.includes(mockJoinRequests[index].userId)) {
      activity.participants.push(mockJoinRequests[index].userId);
    }
  }
  return mockJoinRequests[index];
};

export const deleteParticipation = async (userId, activityId) => {
  const activity = mockActivities.find((a) => a.activityId === parseInt(activityId));
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
  const pin = { pinId: newId, userId: parseInt(userId), activityId: parseInt(activityId) };
  mockPins.push(pin);
  return pin;
};

export const deletePin = async (userId, activityId) => {
  const uId = parseInt(userId);
  const aId = parseInt(activityId);
  const index = mockPins.findIndex((p) => p.userId === uId && p.activityId === aId);
  if (index === -1) return null;
  const removed = mockPins.splice(index, 1);
  return removed[0];
};

export const createFriendRequest = async (senderId, receiverId) => {
  const newId = generateId();
  const requestData = { friendRequestId: newId, senderId: parseInt(senderId), receiverId: parseInt(receiverId), status: 'pending' };
  const sender = mockUsers.find((u) => u.userId === parseInt(senderId));
  const receiver = mockUsers.find((u) => u.userId === parseInt(receiverId));
  if (sender && receiver && !sender.friendIds.includes(parseInt(receiverId))) {
    sender.friendIds.push(parseInt(receiverId));
    receiver.friendIds.push(parseInt(senderId));
  }
  return requestData;
};

export const createShare = async (userId, activityId, receiverIds) => {
  const newId = generateId();
  return { shareId: newId, userId: parseInt(userId), activityId: parseInt(activityId), receiverIds: receiverIds.map((id) => parseInt(id)) };
};

export const createMessage = async (userId, activityId, content) => {
  const newId = generateId();
  return { messageId: newId, userId: parseInt(userId), activityId: parseInt(activityId), messageContent: content };
};

export const createNotification = async (receiverId, senderId, content, type) => {
  const newId = generateId();
  const notification = { notificationId: newId, receiverId: parseInt(receiverId), senderId: parseInt(senderId), content, type };
  mockNotifications.push(notification);
  return notification;
};

export const createReview = async (userId, activityId, data) => {
  const newId = generateId();
  const reviewData = { reviewId: newId, userId: parseInt(userId), activityId: parseInt(activityId), rating: data.rating, comment: data.comment };
  mockReviews.push(reviewData);
  return reviewData;
};

export const createUserRating = async (userId, ratedUserId, rating) => {
  const newId = generateId();
  const ratedUser = mockUsers.find((u) => u.userId === parseInt(ratedUserId));
  if (ratedUser) { ratedUser.profile.totalPoints += rating; }
  return { ratingId: newId, userId: parseInt(userId), ratedUserId: parseInt(ratedUserId), rating: parseInt(rating) };
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
  return { saveId: newId, userId: parseInt(userId), activityId: parseInt(activityId) };
};

export const updatePoints = async (userId, addedPoints) => {
  const user = mockUsers.find((u) => u.userId === parseInt(userId));
  if (!user) return null;
  user.profile.totalPoints += parseInt(addedPoints);
  return { totalPoints: user.profile.totalPoints };
};

export const getUserProfile = async (requesterId, profileId) => {
  const reqId = parseInt(requesterId);
  const pId = parseInt(profileId);
  let user = mockUsers.find((u) => u.userId === pId);
  if (!user) return null;
  const savedActivityIds = mockActivities.filter((a) => a.participants.includes(pId)).map((a) => a.activityId);
  const baseProfile = { profileId: pId, userId: pId, username: user.username, totalPoints: user.profile.totalPoints, rating: 4.5, savedActivityIds: savedActivityIds };

  if (reqId === pId) {
    return {
      ...baseProfile,
      participatingActivityIds: mockActivities.filter((a) => a.participants.includes(pId) && !a.completed).map((a) => a.activityId),
      completedActivityIds: mockActivities.filter((a) => a.participants.includes(pId) && a.completed).map((a) => a.activityId),
      pinnedActivityIds: mockPins.filter((p) => p.userId === pId).map((p) => p.activityId),
      friendIds: user.friendIds
    };
  }
  return baseProfile;
};

export const getParticipatingActivities = async (userId) => {
  const uId = parseInt(userId);
  const list = mockActivities.filter((a) => a.participants.includes(uId) && !a.completed);
  return list.map(toActivityPreview);
};

export const getParticipatedActivities = async (userId) => {
  const uId = parseInt(userId);
  const list = mockActivities.filter((a) => a.participants.includes(uId) && a.completed);
  return list.map(toActivityPreview);
};

export const getPinnedActivities = async (userId) => {
  const uId = parseInt(userId);
  const pinnedIds = mockPins.filter((p) => p.userId === uId).map((p) => p.activityId);
  if (pinnedIds.length === 0) return [];
  const activities = mockActivities.filter((a) => pinnedIds.includes(a.activityId));
  return activities.map(toActivityPreview);
};