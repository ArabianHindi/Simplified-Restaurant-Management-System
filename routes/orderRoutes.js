const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItems');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser');
const isStaff = require('../middleware/isStaff');
const isAdmin = require('../middleware/isAdmin');

// Staff Creating an Order
router.post('/orders', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { created_by } = req.body;
        // Check if the `created_by` user is an admin
        const user = await User.findByPk(created_by);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Admins cannot be assigned with orders.' });
        }
        const order = await Order.create({ status: 'pending', created_by });
        
        res.status(201).json({ message: 'Order created successfully.', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Staff: Add an item to a pending order
router.post('/orders/:id/items',authenticateUser, isStaff, async (req, res) => {
    try {
        const { id } = req.params;
        const { menu_item_id, quantity } = req.body;
        const order = await Order.findByPk(id);
        if (!order || order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not in pending status or not found' });
        }
        const menuItem = await MenuItem.findByPk(menu_item_id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        const totalPrice = (menuItem.price * quantity).toFixed(2);
        const orderItem = await OrderItem.create({
            order_id: id,
            menu_item_id,
            quantity,
            price_at_order: totalPrice
        });
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Staff: Remove an item from a pending order
router.delete('/orders/:orderId/items/:itemId',authenticateUser, isStaff, async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const order = await Order.findByPk(orderId);
        if (!order || order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not in pending status or not found' });
        }
        const deleted = await OrderItem.destroy({ where: { id: itemId, order_id: orderId } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Order item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Staff: Mark a pending order as complete
router.put('/orders/:id/complete',authenticateUser, isStaff, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Order.update(
            { status: 'complete' },
            { where: { id, status: 'pending' } }
        );
        if (updated) {
            const updatedOrder = await Order.findByPk(id);
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found or not in pending status' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//***************************************************STAFF ROUTE CRUD END*********************************************** */


//****************************************************INCOMPLETE ADMIN ACTION ON ORDER START********************************** */
// Admin: View all orders
router.get('/orders', authenticateUser, isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({ include: OrderItem });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Admin Deleting an entire Order
router.delete('/orders/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can be deleted.' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Admin Changing Status of the Order
router.put('/orders/:id/status', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['complete', 'expired'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values are "complete" or "expired".' });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can have their status updated.' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: `Order status updated to "${status}".`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;