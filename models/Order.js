const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  status: {
      type: DataTypes.ENUM('pending', 'complete', 'expired'),
      defaultValue: 'pending',
      allowNull: false,
  },
  created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Users',
          key: 'id',
      },
      onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
});

User.hasMany(Order, { foreignKey: 'created_by' });
Order.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Order;
