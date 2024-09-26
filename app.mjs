import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";

const port = process.env.PORT || 1337;
const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// app.use(cors({
//     // origin: 'http://localhost:3000'
//     // origin: 'https://www.student.bth.se/~olrs23/editor/'
// }));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('index');
});

app.use("/posts", posts);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


export default { app, server }
// export default app