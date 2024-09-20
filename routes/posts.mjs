
import express from 'express';
import mongodocs from "../documents.mjs";

const router = express.Router();

// Main router used mainly to identify connection success and should return the routes available.
router.get('/', async (req, res) => {
    res.status(201).json({ success: 'Connectivity found' });
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
        return res.status(400).json({ error: 'Name and location are required' });
    }

    try {
        const result = await mongodocs.addOne({ title, content });
        res.json({ message: 'Data received and inserted', data: { title, content }, result });
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

export default router;
