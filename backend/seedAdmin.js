const bcrypt = require('bcryptjs');
const sequelize = require('./db');
const User = require('./models/User');

async function seedAdmin() {
  await sequelize.sync();
  const adminExists = await User.findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashed, role: 'admin' });
    console.log('Default admin user created: admin / admin123');
  } else {
    console.log('Admin user already exists.');
  }
  process.exit();
}

seedAdmin(); 