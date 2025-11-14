const express = require('express');
const router = express.Router();
const HealthResource = require('../models/HealthResource');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const resources = await HealthResource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const resources = await HealthResource.find({ type: req.params.type });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/nearby/:longitude/:latitude/:distance', async (req, res) => {
  try {
    const { longitude, latitude, distance } = req.params;
    const resources = await HealthResource.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(distance) * 1000
        }
      }
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const resource = await HealthResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  const resource = new HealthResource({
    name: req.body.name,
    type: req.body.type,
    phone: req.body.phone,
    address: req.body.address,
    location: { type: 'Point', coordinates: [req.body.longitude, req.body.latitude] },
    services: req.body.services,
    operatingHours: req.body.operatingHours,
    isOpen24Hours: req.body.isOpen24Hours,
    acceptsInsurance: req.body.acceptsInsurance
  });

  try {
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
