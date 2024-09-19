import 'dotenv/config'


const port = process.env.PORT || 3001;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";
import mumin from "./mumin.mjs";
import mongodocs from "./documents.mjs";
import ObjectId from 'mongodb';




const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(cors({
    origin: 'http://localhost:3000'
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    
    return res.redirect(`/${result.lastID}`);
});

app.post("/update", async (req, res) => {
    const result = await documents.update(req.body);
    return res.render(
        "doc",
        { doc: await documents.getOne(req.body.rowid.slice(0, -1)) }
    );
});


app.get('/json', async (req, res) => {
    try {
        // const data = await mumin.fetchData();
        const data = await mongodocs.fetchData();
        console.log(data);
        res.json({ data });  // Wrapping the data in a JSON object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


app.post('/add_docs', async (req, res) => {
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


app.post('/update_docs', async (req, res) => {
    const { _id, title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Name and location are required' });
    }
    console.log(req.body);
    console.log(_id, title, content);

    try {
        const result = await mongodocs.updateDocs({ _id, title, content });
        res.json({ message: 'Data received and inserted', data: { _id, title, content }, result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert data into database' });
    }
});

app.get('/docs/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});


// app.get('/docs/:id', async (req, res) => {
//     return res.render(
//         "doc",
//         { doc: await documents.getOne(req.params.id) }
//     );
// });

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

