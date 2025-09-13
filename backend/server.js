const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fantistic-11b5f.firebaseio.com",
});

const db = admin.firestore();
global.db = db;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example route
app.get("/users", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(users);
});

app.post("/users", async (req, res) => {
  const data = req.body;
  const docRef = await db.collection("users").add(data);
  res.json({ id: docRef.id });
});

// Link routes
const caretakersRoutes = require('./routes/caretakers');
const caregiversRoutes = require('./routes/caregivers');

app.use('/caretakers', caretakersRoutes);
app.use('/caregivers', caregiversRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
