require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes');
app.use('/api/auth', authRoutes);

// Item routes
const itemRoutes = require('./itemRoutes');
app.use('/api/items', itemRoutes);

// Import models
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

// Associations
User.hasMany(Claim, { foreignKey: 'userId' });
Claim.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Claim, { foreignKey: 'itemId', as: 'claims' });
Claim.belongsTo(Item, { foreignKey: 'itemId' });

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced.'))
  .catch(err => console.error('Database sync error:', err));

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});