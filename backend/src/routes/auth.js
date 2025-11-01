const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = await db.collection("users").where("username", "==", username).get();
    if (userQuery.empty) return res.status(401).json({ message: "Invalid credentials" });

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Compare entered password with hashed password
    const valid = await bcrypt.compare(password, userData.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { userId: userDoc.id, username: userData.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, 
        user: { 
            username: userData.username, 
            gender: userData.gender,
            birth_date: userData.birth_date,
            phone_number: userData.phone_number,
            emergency_contact: userData.emergency_contact,
            diagnosis: userData.diagnosis,
            stars_point: userData.stars_point,        
            linked_to: userData.linked_to, 
            user_role: userData.user_role,
            createdAt: userData.createdAt}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
