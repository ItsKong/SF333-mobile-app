const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /users
router.post("/", async (req, res) => {
  try {
    const {
      username,
      password,
      gender,
      birth_date,
      phone_number,
      emergency_contact,
      diagnosis,
      user_role,
    } = req.body;

    // ✅ Required fields
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    // ✅ Validate role
    const allowedRoles = ["caregiver", "caretaker"];
    const role = allowedRoles.includes(user_role) ? user_role : "caretaker";

    const docRef = await db.collection("users").add({
      username,
      password,
      gender,
      birth_date,
      phone_number,
      emergency_contact: emergency_contact || null,
      diagnosis: diagnosis || null,
      user_role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      id: docRef.id,
      user_role: role,
    });
  } catch (error) {
    console.error("Error creating user:", error);
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
router.get("/id/:id", async (req, res) => {
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

// GET Random Code
router.get("/username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("username", "==", username).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return document IDs (usually only 1 since username is unique)
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
