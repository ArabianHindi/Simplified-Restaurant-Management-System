const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const MenuItem = require('./MenuItem');

const OrderItem = sequelize.define('OrderItem', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  price_at_order: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
  },
}, {
  timestamps: false,
});

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

module.exports = OrderItem;
