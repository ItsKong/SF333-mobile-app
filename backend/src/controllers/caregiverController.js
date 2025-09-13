const db = global.db;

// Create caregiver and link to caretaker
exports.createCaregiver = async (req, res) => {
  try {
    const { name, caretakerCode } = req.body;

    // Check if caretaker exists
    const caretakerDoc = await db.collection('caretakers').doc(caretakerCode).get();
    if (!caretakerDoc.exists) {
      return res.status(400).json({ error: 'Invalid caretaker code' });
    }

    // Save caregiver info with reference to caretaker
    const docRef = await db.collection('caregivers').add({
      name,
      linkedCaretakerID: caretakerCode,
      createdAt: new Date().toISOString()
    });

    res.json({ id: docRef.id, message: 'Caregiver linked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get caretaker info for a caregiver
exports.getCaregiverCaretaker = async (req, res) => {
  try {
    const caregiverId = req.params.id;

    // Fetch caregiver document
    const caregiverDoc = await db.collection('caregivers').doc(caregiverId).get();
    if (!caregiverDoc.exists) return res.status(404).json({ error: 'Caregiver not found' });

    const linkedCaretakerID = caregiverDoc.data().linkedCaretakerID;

    // Fetch caretaker document
    const caretakerDoc = await db.collection('caretakers').doc(linkedCaretakerID).get();
    if (!caretakerDoc.exists) return res.status(404).json({ error: 'Caretaker not found' });

    res.json({ caretaker: caretakerDoc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
