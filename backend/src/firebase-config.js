// firebase-config.js
require('dotenv').config();
const admin = require('firebase-admin');

let db;
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
  db = admin.firestore();
  console.log('✅ Firebase initialized successfully');
} catch (err) {
  console.error('❌ Firebase initialization error:', err.message);
  process.exit(1); // exits if Firebase fails
}

module.exports = { admin, db };
