import 'dotenv/config'


const port = process.env.PORT || 3001;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";
import mumin from "./mumin.mjs";


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
        const data = await mumin.fetchData();
        console.log(data);
        res.json({ data });  // Wrapping the data in a JSON object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


app.post('/add_mumin', async (req, res) => {
    const { namn, bor } = req.body;
    if (!namn || !bor) {
        return res.status(400).json({ error: 'Name and location are required' });
    }

    try {
        const result = await mumin.addOne({ namn, bor });
        res.json({ message: 'Data received and inserted', data: { namn, bor }, result });
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

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

