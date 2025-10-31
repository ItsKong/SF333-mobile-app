// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Import routes
// const userRoutes = require('./src/routes/users');

// // Use routes
// app.use('/api/users', userRoutes);

// // Test route
// app.get('/', (req, res) => {
//   res.json({ message: 'Server is running!' });
// });

// // const PORT = process.env.PORT || 5000;
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log('STILL RUNNING...');
// });