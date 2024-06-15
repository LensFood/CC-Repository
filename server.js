const express = require('express');
const app = express();
const usersRoutes = require('./routes/user.routes');
const predictsRoutes = require('./routes/predict.routes');
const admin = require('./config/firebaseAdmin');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRoutes);
//app.use('/api', predictsRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
