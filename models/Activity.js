const ActivitySchema = new mongoose.Schema({
  activityId: { type: Number, required: true, unique: true },
  hostId: { type: Number, required: true },
  completed: { type: Boolean, default: false },

  // Προσθέτουμε pinned flag
  isPinned: { type: Boolean, default: false },

  details: {
    activityType: { type: String, enum: ACTIVITY_TYPES, required: true },
    date: [{ type: Number }],
    location: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    difficultyLevel: { type: String, enum: DIFFICULTY_LEVELS, required: true },
    equipment: [{ type: String, enum: EQUIPMENT_LIST }]
  },

  participants: [{ type: Number }]
}, { timestamps: true });
