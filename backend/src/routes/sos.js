const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// How to use this API
// get your current localtion fron react and create mapLink const
// POST with this body
//   "userId": disability's id,
//   "mapLink": "https://www.google.com/maps?q=${latitude},${longitude}"

//For Frontend, use firebase cloud messaging for push notification
//it will allow backgroup notification without opening the app

// POST /sos
router.post("/", async (req, res) => {
  try {
    const { userId, mapLink } = req.body;

    if (!userId || !mapLink) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Find linked caregiver
    const caregiverSnapshot = await db
      .collection("users")
      .where("linked_to", "==", userId)
      .where("user_role", "==", "caregiver")
      .limit(1)
      .get();

    if (caregiverSnapshot.empty)
      return res.status(404).json({ success: false, error: "No caregiver found" });

    const caregiverDoc = caregiverSnapshot.docs[0];
    const fcmToken = caregiverDoc.data().fcmToken;

    await db.collection("sos_logs").add({
    userId,
    caregiverId: caregiverDoc.id,
    mapLink,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send push notification only — no Firestore record if you don’t need history
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: "🚨 SOS Alert",
          body: "Your patient needs help! Tap to open location.",
        },
        data: { mapLink },
      });
    }

    res.status(201).json({
      success: true,
      message: "SOS alert sent and caregiver notified",
    });
  } catch (error) {
    console.error("Error sending SOS:", error);
    res.status(500).json({ success: false, error: "Failed to send SOS" });
  }
});

// PUT /sos/save-token
router.put("/save-token", async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ error: "Missing userId or fcmToken" });
    }

    // Update the user document in Firestore with the new token
    await db.collection("users").doc(userId).update({
      fcmToken: fcmToken, // This must match what the SOS route looks for!
      lastLogin: admin.firestore.FieldValue.serverTimestamp() // Optional: good for tracking
    });

    res.status(200).json({ success: true, message: "Token saved" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ success: false, error: "Failed to save token" });
  }
});

// DELETE /sos/remove-token
// Call this when the user hits "Logout"
router.delete("/remove-token", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Delete the fcmToken field from this user's document
    await db.collection("users").doc(userId).update({
      fcmToken: admin.firestore.FieldValue.delete() 
    });

    res.status(200).json({ success: true, message: "Token removed" });
  } catch (error) {
    console.error("Error removing token:", error);
    res.status(500).json({ success: false, error: "Failed to remove token" });
  }
});

module.exports = router;
