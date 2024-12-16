const User = require('../models/User')
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItems');
const sequelize = require('../config/database');

// Seeder function
const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully.');

        // Seed Users
        // const admin = await User.create({ username: 'admin_user', password: 'admin123', role: 'admin' });
        // const staff1 = await User.create({ username: 'staff_user1', password: 'staff123', role: 'staff' });
        // const staff2 = await User.create({ username: 'staff_user2', password: 'staff123', role: 'staff' });

        // Seed for Staff users
        // const staffUsers = await User.bulkCreate([
        //     { username: 'staff1', password: 'hashedpassword1', role: 'staff' },
        //     { username: 'staff2', password: 'hashedpassword2', role: 'staff' },
        //     { username: 'staff3', password: 'hashedpassword3', role: 'staff' },
        //     { username: 'staff4', password: 'hashedpassword4', role: 'staff' },
        //     { username: 'staff5', password: 'hashedpassword5', role: 'staff' },
        //     { username: 'staff6', password: 'hashedpassword6', role: 'staff' },
        //     { username: 'staff7', password: 'hashedpassword7', role: 'staff' },
        //     { username: 'staff8', password: 'hashedpassword8', role: 'staff' },
        //     { username: 'staff9', password: 'hashedpassword9', role: 'staff' },
        //     { username: 'staff10', password: 'hashedpassword10', role: 'staff' }
        // ]);
        // console.log('Staff Users seeded successfully.');

        const menuItems = await MenuItem.bulkCreate([
            { name: 'Burger', description: 'Delicious beef burger', price: 8.99, category: 'Main Course' },
            { name: 'Pizza', description: 'Cheese-loaded pizza', price: 12.99, category: 'Main Course' },
            { name: 'Pasta', description: 'Creamy Alfredo pasta', price: 10.99, category: 'Main Course' },
            { name: 'Salad', description: 'Fresh green salad', price: 5.99, category: 'Appetizer' },
            { name: 'Soup', description: 'Hot chicken soup', price: 4.99, category: 'Appetizer' },
            { name: 'Steak', description: 'Juicy grilled steak', price: 15.99, category: 'Main Course' },
            { name: 'Sushi', description: 'Assorted sushi platter', price: 18.99, category: 'Main Course' },
            { name: 'Ice Cream', description: 'Vanilla ice cream scoop', price: 3.99, category: 'Dessert' },
            { name: 'Cake', description: 'Chocolate lava cake', price: 6.99, category: 'Dessert' },
            { name: 'Coffee', description: 'Hot brewed coffee', price: 2.99, category: 'Beverage' }
        ]);
        console.log('MenuItems seeded successfully.');

        // Seed Orders
        // const orders = await Order.bulkCreate([
        //     { status: 'pending', created_by: 1 },
        //     { status: 'complete', created_by: 1 },
        //     { status: 'expired', created_by: 2 },
        //     { status: 'pending', created_by: 2 },
        //     { status: 'complete', created_by: 3 },
        //     { status: 'pending', created_by: 3 },
        //     { status: 'expired', created_by: 4 },
        //     { status: 'complete', created_by: 4 },
        //     { status: 'pending', created_by: 5 },
        //     { status: 'expired', created_by: 5 }
        // ]);
        // console.log('Orders seeded successfully.');

        // Seed OrderItems
        // const orderItems = await OrderItem.bulkCreate([
        //     { order_id: 1, menu_item_id: 1, quantity: 2, price_at_order: 8.99 },
        //     { order_id: 1, menu_item_id: 2, quantity: 1, price_at_order: 12.99 },
        //     { order_id: 2, menu_item_id: 3, quantity: 3, price_at_order: 10.99 },
        //     { order_id: 3, menu_item_id: 4, quantity: 1, price_at_order: 5.99 },
        //     { order_id: 4, menu_item_id: 5, quantity: 2, price_at_order: 4.99 },
        //     { order_id: 5, menu_item_id: 6, quantity: 1, price_at_order: 15.99 },
        //     { order_id: 6, menu_item_id: 7, quantity: 3, price_at_order: 18.99 },
        //     { order_id: 7, menu_item_id: 8, quantity: 2, price_at_order: 3.99 },
        //     { order_id: 8, menu_item_id: 9, quantity: 1, price_at_order: 6.99 },
        //     { order_id: 9, menu_item_id: 10, quantity: 4, price_at_order: 2.99 }
        // ]);
        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;