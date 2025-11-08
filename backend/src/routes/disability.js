const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /users - Create a new user
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
      return res.status(400).json({ 
        success: false,
        error: "username and password are required" 
      });
    }

    const existingUser = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        error: "Username already exists.",
      });
    }

    // ✅ Validate role
    const allowedRoles = ["caregiver", "caretaker"];
    const role = allowedRoles.includes(user_role) ? user_role : "caretaker";

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // ✅ Create user document with FIXED values for stars_point and linked_to
    const docRef = await db.collection("users").add({
      username,
      password: hashedPassword, // store hashed password
      gender: gender || null,
      birth_date: birth_date || null,
      phone_number: phone_number || null,
      emergency_contact: emergency_contact || null,
      diagnosis: diagnosis || null,
      stars_point: 0,        
      linked_to: null,       
      user_role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      id: docRef.id,
      user_role: role,
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// PUT /disablity/:id/link - Link user to another user (update linked_to)
router.put("/:id/link", async (req, res) => {
  try {
    const { linked_to } = req.body;

    if (!linked_to) {
      return res.status(400).json({
        success: false,
        error: "linked_to user_id is required"
      });
    }

    // Verify the linked user exists
    const linkedUserDoc = await db.collection("users").doc(linked_to).get();
    if (!linkedUserDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Linked user not found"
      });
    }

    // Update the user's linked_to field
    await db.collection("users").doc(req.params.id).update({
      linked_to: linked_to,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: "User linked successfully"
    });

  } catch (error) {
    console.error("Error linking user:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /disability/:id/unlink - Unlink user (set linked_to back to null)
router.put("/:id/unlink", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update({
      linked_to: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: "User unlinked successfully"
    });

  } catch (error) {
    console.error("Error unlinking user:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /disability/:id/stars - Update stars_point WITH "NUMBER"
router.put("/:id/stars", async (req, res) => {
  try {
    const { stars_point } = req.body;

    if (typeof stars_point !== "number") {
      return res.status(400).json({
        success: false,
        error: "stars_point must be a number"
      });
    }

    await db.collection("users").doc(req.params.id).update({
      stars_point: stars_point,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: "Stars point updated successfully"
    });

  } catch (error) {
    console.error("Error updating stars:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
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
