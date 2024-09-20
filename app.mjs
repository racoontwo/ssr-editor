import 'dotenv/config'

const port = process.env.PORT || 3001;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all routes from routes folder
app.use("/posts", posts);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
