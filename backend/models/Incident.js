const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Theft', 'Vandalism', 'Assault', 'Suspicious Activity', 'Environmental Hazard', 'Infrastructure Issue', 'Other']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'Resolved'],
    default: 'Reported'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: String,
  imageUrl: String
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
