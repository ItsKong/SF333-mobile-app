const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const shouldReset = (updatedAt, frequency) => {
  if (!updatedAt || !frequency) return false;
  const now = new Date();
  const lastUpdate = updatedAt.toDate();
  const diffDays = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  // Make it case-insensitive
  const freq = frequency.toLowerCase();
  
  switch (freq) {
    case "daily": return diffDays >= 1;
    case "weekly": return diffDays >= 7;
    case "biweekly": return diffDays >= 14;
    case "monthly": return diffDays >= 30;
    case "yearly": return diffDays >= 365;
    default: return false;
  }
};

function calculateNextDueDate(oldDueDate, frequency) {
  const newDate = new Date(oldDueDate);
  
  // Make it case-insensitive
  const freq = frequency.toLowerCase();
  
  switch (freq) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "biweekly":
      newDate.setDate(newDate.getDate() + 14);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
    default:
      newDate.setDate(newDate.getDate() + 1);
  }
  
  return newDate;
}

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

    // Convert due_date string to Firestore Timestamp if provided
    let dueDateTimestamp = null;
    if (due_date) {
      try {
        dueDateTimestamp = admin.firestore.Timestamp.fromDate(new Date(due_date));
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "Invalid due_date format. Use ISO 8601 format (e.g., 2025-11-09T10:00:00Z)"
        });
      }
    }

    // Create the task document
    const docRef = await db.collection("tasks").add({
      title,
      content: content || null,
      due_time: due_time || null,
      due_date: dueDateTimestamp, // Store as Firestore Timestamp
      status: status || "DOING",
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
        assigned_to: assignedToId,
        due_date: due_date // Return original string for reference
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

// GET /tasks/eachday/:user_id
router.get("/eachday/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ success: false, error: "user_id is required" });
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(7, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(6, 59, 59, 999);

    const snapshot = await db.collection("tasks")
      .where("assigned_to", "==", user_id)
      .get();

    let tasks = [];
    const batch = db.batch();
    let hasUpdates = false;

    snapshot.forEach(doc => {
      const data = doc.data();
      const { frequency, status, updatedAt, due_date } = data;

      // Auto-reset completed recurring tasks
      if (status === "DONE" && frequency && shouldReset(updatedAt, frequency)) {
        const ref = db.collection("tasks").doc(doc.id);
        
        const oldDueDate = due_date.toDate ? due_date.toDate() : new Date(due_date);
        const newDueDate = calculateNextDueDate(oldDueDate, frequency);
        
        batch.update(ref, {
          status: "DOING",
          due_date: admin.firestore.Timestamp.fromDate(newDueDate),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        data.status = "DOING";
        data.due_date = newDueDate;
        hasUpdates = true;
      }

      // Auto-mark overdue tasks as MISS (TIME-BASED)
      if (due_date && status === "DOING") {
        const dueDate = due_date.toDate ? due_date.toDate() : new Date(due_date);
        
        // Check if due time has passed (includes time)
        if (dueDate < now) {
          const ref = db.collection("tasks").doc(doc.id);
          batch.update(ref, {
            status: "MISSED",
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          data.status = "MISSED";
          hasUpdates = true;
        }
      }

      // Include all tasks with due_date
      if (data.due_date) {
        tasks.push({ id: doc.id, ...data });
      }
    });

    if (hasUpdates) await batch.commit();

    // Sort tasks by due_date
    tasks.sort((a, b) => {
      const dateA = a.due_date.toDate ? a.due_date.toDate() : new Date(a.due_date);
      const dateB = b.due_date.toDate ? b.due_date.toDate() : new Date(b.due_date);
      return dateA - dateB;
    });

    // Group by category
    const categorized = {
      overdue: [],
      thisWeek: {},
      upcoming: []
    };

    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    allDays.forEach(day => {
      categorized.thisWeek[day] = [];
    });

    tasks.forEach(task => {
      const dueDate = task.due_date.toDate ? task.due_date.toDate() : new Date(task.due_date);
      
      if (dueDate < startOfWeek) {
        categorized.overdue.push(task);
      } else if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
        const day = dueDate.toLocaleDateString("en-US", { weekday: "long" });
        categorized.thisWeek[day].push(task);
      } else {
        categorized.upcoming.push(task);
      }
    });

    res.json({
      success: true,
      week_range: {
        start: startOfWeek.toISOString(),
        end: endOfWeek.toISOString()
      },
      overdue: categorized.overdue,
      grouped_tasks: categorized.thisWeek,
      upcoming: categorized.upcoming
    });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks",
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

// GET /tasks/user/:user_id - Get all tasks for a specific user
// :user_id is the Firestore document ID
router.get("/user/:user_id", async (req, res) => {
  try {
    const { role } = req.query; // Optional: filter by role (created/assigned/all)
    const user_id = req.params.user_id; // Firestore document ID

    let tasks = [];

    if (role === "created") {
      // Only tasks created by this user (using Firestore doc ID)
      const snapshot = await db.collection("tasks")
        .where("created_by", "==", user_id)
        .orderBy("createdAt", "desc")
        .get();
      
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
    } else if (role === "assigned") {
      // Only tasks assigned to this user (using Firestore doc ID)
      const snapshot = await db.collection("tasks")
        .where("assigned_to", "==", user_id)
        .orderBy("createdAt", "desc")
        .get();
      
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
    } else {
      // Get both created and assigned tasks (default)
      const createdSnapshot = await db.collection("tasks")
        .where("created_by", "==", user_id)
        .orderBy("createdAt", "desc")
        .get();
      
      const assignedSnapshot = await db.collection("tasks")
        .where("assigned_to", "==", user_id)
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