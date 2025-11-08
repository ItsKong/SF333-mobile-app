const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      due_time,
      due_date,
      status,
      frequency,
      created_by, // Firestore document ID (e.g., "abc123xyz") of the user creating the task
      assigned_to, // Optional: Firestore document ID to override auto-assignment
    } = req.body;

    // Validate required fields
    if (!title || !created_by) {
      return res.status(400).json({
        success: false,
        error: "Title and created_by are required"
      });
    }

    // Get the creator's user document using the Firestore document ID
    const creatorRef = db.collection("users").doc(created_by);
    const creatorDoc = await creatorRef.get();
    
    if (!creatorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const creatorData = creatorDoc.data();

    // Determine who to assign the task to
    // Priority: 1. Manual assignment, 2. linked_to field, 3. Self-assignment
    let assignedToId = assigned_to || creatorData.linked_to || created_by;

    // Verify assigned user exists
    const assignedDoc = await db.collection("users").doc(assignedToId).get();
    if (!assignedDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Assigned user not found"
      });
    }

    // Create the task document
    const docRef = await db.collection("tasks").add({
      title,
      content: content || null,
      due_time: due_time || null,
      due_date: due_date || null,
      status: status || "pending",
      frequency: frequency || null,
      created_by: created_by, // Firestore document ID of creator
      assigned_to: assignedToId, // Firestore document ID of assigned user
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Return success response with task ID
    res.status(201).json({
      success: true,
      task_id: docRef.id,
      message: "Task created successfully",
      data: {
        created_by: created_by,
        assigned_to: assignedToId
      }
    });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create task",
      details: error.message
    });
  }
});

// GET /tasks/:id - Get a specific task with user details populated
router.get("/:id", async (req, res) => {
  try {
    const taskDoc = await db.collection("tasks").doc(req.params.id).get();
    
    if (!taskDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    const taskData = taskDoc.data();

    // Populate creator details using the Firestore document ID stored in created_by
    let creatorDetails = null;
    if (taskData.created_by) {
      const creatorDoc = await db.collection("users").doc(taskData.created_by).get();
      if (creatorDoc.exists) {
        const creator = creatorDoc.data();
        creatorDetails = {
          id: creatorDoc.id, // Firestore document ID
          name: creator.name,
          email: creator.email
        };
      }
    }

    // Populate assigned user details using the Firestore document ID stored in assigned_to
    let assignedDetails = null;
    if (taskData.assigned_to) {
      const assignedDoc = await db.collection("users").doc(taskData.assigned_to).get();
      if (assignedDoc.exists) {
        const assigned = assignedDoc.data();
        assignedDetails = {
          id: assignedDoc.id, // Firestore document ID
          name: assigned.name,
          email: assigned.email
        };
      }
    }

    res.status(200).json({
      success: true,
      task: {
        id: taskDoc.id,
        ...taskData,
        created_by_details: creatorDetails,
        assigned_to_details: assignedDetails
      }
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch task"
    });
  }
});

// GET /tasks/user/:userId - Get all tasks for a specific user
// :userId is the Firestore document ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { role } = req.query; // Optional: filter by role (created/assigned/all)
    const userId = req.params.userId; // Firestore document ID

    let tasks = [];

    if (role === "created") {
      // Only tasks created by this user (using Firestore doc ID)
      const snapshot = await db.collection("tasks")
        .where("created_by", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
      
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
    } else if (role === "assigned") {
      // Only tasks assigned to this user (using Firestore doc ID)
      const snapshot = await db.collection("tasks")
        .where("assigned_to", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
      
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
    } else {
      // Get both created and assigned tasks (default)
      const createdSnapshot = await db.collection("tasks")
        .where("created_by", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
      
      const assignedSnapshot = await db.collection("tasks")
        .where("assigned_to", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      const taskMap = new Map();
      
      createdSnapshot.forEach(doc => {
        taskMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      assignedSnapshot.forEach(doc => {
        if (!taskMap.has(doc.id)) {
          taskMap.set(doc.id, { id: doc.id, ...doc.data() });
        }
      });

      tasks = Array.from(taskMap.values());
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks"
    });
  }
});

// GET /tasks - Get all tasks
router.get("/", async (req, res) => {
  try {
    const { status, assigned_to, created_by } = req.query;
    
    let query = db.collection("tasks");

    // Apply filters if provided (using Firestore document IDs)
    if (status) {
      query = query.where("status", "==", status);
    }
    if (assigned_to) {
      query = query.where("assigned_to", "==", assigned_to);
    }
    if (created_by) {
      query = query.where("created_by", "==", created_by);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks"
    });
  }
});

// PUT /tasks/:id - Update a task
router.put("/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Prevent changing created_by and createdAt (these contain Firestore doc IDs)
    delete updateData.created_by;
    delete updateData.createdAt;

    await taskRef.update(updateData);

    res.status(200).json({
      success: true,
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update task"
    });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    await taskRef.delete();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete task"
    });
  }
});

module.exports = router;