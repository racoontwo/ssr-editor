import 'dotenv/config'

const port = process.env.PORT || 3000;

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


app.get('/json', async (req, response) => {
    try {
        let res = await mumin.fetchData();

        response.json(res);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Return a JSON object with list of all documents within the collection.
app.get("/list", async (request, response) => {
    try {
        let res = await mumin.fetchData();

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
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

