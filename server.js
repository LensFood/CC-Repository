const express = require('express');
const app = express();
const usersRoutes = require('./routes/user.routes');
const db = require('./models');
const admin = require('./config/firebase');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRoutes);

// Database synchronization
db.sequelize.sync().then(() => {
    console.log('Database synced');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
