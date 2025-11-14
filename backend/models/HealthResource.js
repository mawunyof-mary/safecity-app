const mongoose = require('mongoose');

const healthResourceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Hospital', 'Clinic', 'Emergency Center', 'Pharmacy', 'Ambulance Service', 'Blood Bank', 'Mental Health', 'Dental', 'Other'] },
  description: String,
  phone: { type: String, required: true },
  email: String,
  website: String,
  address: { type: String, required: true },
  location: { type: { type: String, enum: ['Point'], required: true }, coordinates: { type: [Number], required: true } },
  services: [String],
  operatingHours: String,
  availableBeds: Number,
  isOpen24Hours: { type: Boolean, default: false },
  acceptsInsurance: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  imageUrl: String,
  verified: { type: Boolean, default: false }
}, { timestamps: true });

healthResourceSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('HealthResource', healthResourceSchema);
