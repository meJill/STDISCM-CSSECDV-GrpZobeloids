const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: 'mysql',
  });

// Define the Admin model
const Admin = sequelize.define('admin', {
  adminid: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_no: {
    type: DataTypes.BIGINT,
    defaultValue: null
  }
}, {
  tableName: 'admin',
  timestamps: false // Disable timestamps (createdAt, updatedAt)
});

// Define the Users model
const Users = sequelize.define('users', {
  userid: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_no: {
    type: DataTypes.BIGINT,
    defaultValue: null
  },
  profile_photo_path: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'users',
  timestamps: false // Disable timestamps (createdAt, updatedAt)
});

// Synchronize the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

// Export the models
module.exports = {
  Admin,
  Users
};