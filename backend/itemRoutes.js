const express = require('express');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const { authenticateToken, requireAdmin } = require('./middleware');

const router = express.Router();

// Get all items
router.get('/', authenticateToken, async (req, res) => {
  const items = await Item.findAll({
    include: [{
      model: Claim,
      as: 'claims',
      include: ['user']
    }]
  });
  res.json(items);
});

// Create item (lost/found)
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, status, date, owner } = req.body;
  try {
    const item = await Item.create({ name, description, status, date, owner });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Error creating item', error: err.message });
  }
});

// Update item (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Error updating item', error: err.message });
  }
});

// Delete item (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting item', error: err.message });
  }
});

// Claim an item
router.post('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.status === 'claimed') {
      return res.status(400).json({ message: 'Item already claimed' });
    }
    await item.update({ status: 'claimed' });
    const claim = await Claim.create({ userId: req.user.id, itemId: item.id, status: 'approved' });
    res.status(201).json({ claim, claimedBy: req.user.username });
  } catch (err) {
    res.status(400).json({ message: 'Error claiming item', error: err.message });
  }
});

module.exports = router; 