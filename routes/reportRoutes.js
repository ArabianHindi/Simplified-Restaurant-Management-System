const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItems');
const MenuItem = require('../models/MenuItem');
const authenticateUser = require('../middleware/authenticateUser');
const isAdmin = require('../middleware/isAdmin');
const { Parser } = require('json2csv');
const {Sequelize, Op } = require('sequelize')
const XLSX = require('xlsx');

router.get('/orders/report', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { startDate, endDate, format } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: {
                model: OrderItem,
                include: {
                    model: MenuItem,
                    attributes: ['name', 'price']
                }
            }
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the specified date range.' });
        }

        if (format === 'csv') {
            const fields = ['id', 'status', 'created_by', 'createdAt', 'updatedAt'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(orders.map(order => ({
                id: order.id,
                status: order.status,
                created_by: order.created_by
            })));
            res.header('Content-Type', 'text/csv');
            res.attachment('orders_report.csv');
            return res.send(csv);
        } else if (format === 'xlsx') {
            const workbook = XLSX.utils.book_new();
            const worksheetData = orders.map(order => ({
                id: order.id,
                status: order.status,
                created_by: order.created_by
            }));
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('orders_report.xlsx');
            return res.send(buffer);
        } else {
            return res.status(200).json(orders);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export Top 10 Selling Items in the Last 30 Days
router.get('/menu/top-selling', authenticateUser, isAdmin, async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const topItems = await OrderItem.findAll({
            attributes: [
                'menu_item_id',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold']
            ],
            include: [
                {
                    model: MenuItem,
                    attributes: ['name', 'price']
                },
                {
                    model: Order,
                    attributes: [],
                    where: {
                        createdAt: {
                            [Sequelize.Op.gte]: startDate
                        }
                    }
                }
            ],
            group: ['menu_item_id'],
            order: [[Sequelize.literal('total_sold'), 'DESC']],
            limit: 10
        });

        const format = req.query.format || 'json';

        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(topItems.map(item => ({
                name: item.MenuItem.name,
                price: item.MenuItem.price,
                total_sold: item.dataValues.total_sold
            })));
            res.header('Content-Type', 'text/csv');
            res.attachment('top_selling_items.csv');
            return res.send(csv);
        } else if (format === 'xlsx') {
            const workbook = XLSX.utils.book_new();
            const worksheetData = topItems.map(item => ({
                name: item.MenuItem.name,
                price: item.MenuItem.price,
                total_sold: item.dataValues.total_sold
            }));
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Top Selling Items');
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('top_selling_items.xlsx');
            return res.send(buffer);
        } else {
            return res.status(200).json(topItems);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;