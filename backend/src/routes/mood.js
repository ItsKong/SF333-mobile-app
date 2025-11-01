const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /moods - Create a new mood record
router.post("/", async (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Body raw:", req.body);
  try {
    const {
      mood, // e.g., "happy", "sad", "anxious", "excited", etc.
      record_by, // Firestore document ID of the user recording the mood
      record_time, // Optional: ISO timestamp, defaults to server time
    } = req.body;

    // Validate required fields
    if (!mood || !record_by) {
      return res.status(400).json({
        success: false,
        error: "mood and record_by are required"
      });
    }

    // Verify user exists
    const userDoc = await db.collection("users").doc(record_by).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Create the mood document
    const docRef = await db.collection("moods").add({
        mood,
        record_by, // Firestore document ID of user
        record_time: record_time || new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      success: true,
      mood_id: docRef.id,
      message: "Mood recorded successfully"
    });

  } catch (error) {
    console.error("Error creating mood:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record mood",
      details: error.message
    });
  }
});

// GET /moods/:id - Get a specific mood record with user details
router.get("/:id", async (req, res) => {
  try {
    const moodDoc = await db.collection("moods").doc(req.params.id).get();
    
    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Mood record not found"
      });
    }

    const moodData = moodDoc.data();

    // Populate user details
    let userDetails = null;
    if (moodData.record_by) {
      const userDoc = await db.collection("users").doc(moodData.record_by).get();
      if (userDoc.exists) {
        const user = userDoc.data();
        userDetails = {
          id: userDoc.id,
          name: user.name,
          email: user.email
        };
      }
    }

    res.status(200).json({
      success: true,
      mood: {
        id: moodDoc.id,
        ...moodData,
        user_details: userDetails
      }
    });
  } catch (error) {
    console.error("Error fetching mood:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mood"
    });
  }
});

// GET /moods/user/:userId - Get all mood records for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Firestore document ID
    const { limit, start_date, end_date } = req.query;

    let query = db.collection("moods")
      .where("record_by", "==", userId)
      .orderBy("record_time", "desc");

    // Apply date filters if provided
    if (start_date) {
      query = query.where("record_time", ">=", start_date);
    }
    if (end_date) {
      query = query.where("record_time", "<=", end_date);
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();

    const moods = [];
    snapshot.forEach(doc => {
      moods.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      count: moods.length,
      moods
    });
  } catch (error) {
    console.error("Error fetching moods:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch moods"
    });
  }
});

// GET /moods - Get all mood records
router.get("/", async (req, res) => {
  try {
    const { mood, record_by, limit } = req.query;
    
    let query = db.collection("moods");

    // Apply filters if provided
    if (record_by) {
      query = query.where("record_by", "==", record_by);
    }
    if (mood) {
      query = query.where("mood", "==", mood);
    }

    query = query.orderBy("record_time", "desc");

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();

    const moods = [];
    snapshot.forEach(doc => {
      moods.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      count: moods.length,
      moods
    });
  } catch (error) {
    console.error("Error fetching moods:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch moods"
    });
  }
});

// PUT /moods/:id - Update a mood record
router.put("/:id", async (req, res) => {
  try {
    const moodRef = db.collection("moods").doc(req.params.id);
    const moodDoc = await moodRef.get();

    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Mood record not found"
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Prevent changing record_by and createdAt
    delete updateData.record_by;
    delete updateData.createdAt;

    await moodRef.update(updateData);

    res.status(200).json({
      success: true,
      message: "Mood updated successfully"
    });
  } catch (error) {
    console.error("Error updating mood:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update mood"
    });
  }
});

// DELETE /moods/:id - Delete a mood record
router.delete("/:id", async (req, res) => {
  try {
    const moodRef = db.collection("moods").doc(req.params.id);
    const moodDoc = await moodRef.get();

    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Mood record not found"
      });
    }

    await moodRef.delete();

    res.status(200).json({
      success: true,
      message: "Mood deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting mood:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete mood"
    });
  }
});

module.exports = router;