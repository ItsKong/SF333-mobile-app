const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /users
router.post("/", async (req, res) => {
  try {
    const { username, password, gender, birth_date, phone_number } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }
    const docRef = await db.collection("users").add({
      username,
      password,
      gender,
      birth_date,
      phone_number,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users - get all users
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id - get user by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("users").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
