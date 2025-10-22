const express = require('express');
const { body, validationResult } = require('express-validator');
const Incident = require('../models/Incident');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all incidents (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;

    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new incident
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['Theft', 'Vandalism', 'Assault', 'Suspicious Activity', 'Environmental Hazard', 'Infrastructure Issue', 'Other']).withMessage('Valid category is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = new Incident({
      ...req.body,
      reportedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: req.body.location.coordinates
      }
    });

    await incident.save();
    await incident.populate('reportedBy', 'name email');

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new_incident', {
      message: 'New ' + incident.category + ' incident reported: ' + incident.title,
      incident: incident,
      type: 'info'
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single incident
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email');
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update incident status (admin only)
router.patch('/:id/status', [adminAuth, 
  body('status').isIn(['Reported', 'Under Review', 'Resolved']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('reportedBy', 'name email');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Emit status update notification
    const io = req.app.get('io');
    io.emit('incident_updated', {
      message: 'Incident "' + incident.title + '" status updated to ' + incident.status,
      incident: incident,
      type: 'warning'
    });

    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
