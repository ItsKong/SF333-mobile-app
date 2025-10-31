
const { nanoid } = require('nanoid');

const db = global.db;

exports.createCaretaker = async (req, res) => {
  try {
    const data = req.body; // e.g., { name: "John" }
    const caretakerCode = nanoid(8); // generate unique code
    await db.collection('caretakers').doc(caretakerCode).set({
      ...data,
      createdAt: new Date().toISOString()
    });
    res.json({ caretakerCode });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getCaretaker = async (req, res) => {
  try {
    const caretakerCode = req.params.code;
    const caretakerDoc = await db.collection('caretakers').doc(caretakerCode).get();
    if (!caretakerDoc.exists) return res.status(404).json({ error: 'Caretaker not found' });
    res.json(caretakerDoc.data());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
