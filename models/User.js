const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  role: {
      type: DataTypes.ENUM('admin', 'staff'),
      allowNull: false,
  },
  resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
  },
}, {
  timestamps: true,
});


module.exports = User;
