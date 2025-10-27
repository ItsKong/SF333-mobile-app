// index.js
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();
const app = express();

app.use(express.json());

// Health check endpoint (important for Render)
// app.get('/', (req, res) => {
//   res.json({ status: 'Server is running' });
// });

const testRoutes = require('./src/routes/test');
const disabilityRoutes = require('./src/routes/disability');


// Your API endpoints
app.use('/', testRoutes);
app.use('/disability', disabilityRoutes);


// ----user api call----
// app.post('/users', async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const docRef = await db.collection('users').add({ 
//       name, 
//       email,
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });
//     res.status(201).json({ 
//       success: true, 
//       id: docRef.id 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});