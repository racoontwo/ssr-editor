
import express from 'express';
import mongodocs from "../documents.mjs";

const router = express.Router();

// Main router used to identify connection success.
router.get('/', async (req, res) => {
    res.status(201).json({ success: 'Connectivity found' });
    res.render('index');
});

// Fetches all the data from all the documents in the database and returns it as a JSON-object.
router.get('/json', async (req, res) => {
    try {
        const data = await mongodocs.fetchData();
        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// This route pulls the data from a new document and adds it to the database.
router.post('/add_docs', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const result = await mongodocs.addOne({ title, content });
        res.status(200).json({ message: 'Data received and inserted', data: { title, content }, result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert data into database' });
    }
});


// This route updates the docs connecting to the database the req.body as argument.
// Req.body should contain the _id and the rest of the data that's going to be updated
router.post('/update_docs', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Name and location are required' });
    }

    try {
        const result = await mongodocs.updateDocs(req.body);
        res.json({ message: 'Data received and inserted', data: req.body, result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert data into database' });
    }
});

// A route to delete all data in the database
router.delete('/delete-all-docs', async (req, res) => {
    try {
        const result = await mongodocs.deleteAllDocs();
        res.status(200).json({ message: 'All documents deleted successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete documents', error: error.message });
    }
});

router.delete('/delete-one-doc', async (req, res) => {
    const docId = req.body._id;
    try {
        const result = await mongodocs.deleteOneDoc(docId);
        console.log(result)
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Document deleted successfully" });
        } else {
            res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete document" });
    }
});

export default router;
