const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('lost', 'found', 'claimed'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Item; 