const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const authenticateUser = require('../middleware/authenticateUser');
const isAdmin = require('../middleware/isAdmin');

router.post('/menu', authenticateUser, isAdmin, async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/menu', authenticateUser, async (req, res) => {
    try {
        const { category, sort } = req.query;
        const where = category ? { category } : {};
        const order = sort === 'desc' ? [['price', 'DESC']] : [['price', 'ASC']];
        const menuItems = await MenuItem.findAll({ where, order });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/menu/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const [updated] = await MenuItem.update(req.body, { where: { id } });
        if (updated) {
            const updatedMenuItem = await MenuItem.findByPk(id);
            res.json(updatedMenuItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/menu/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await MenuItem.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;