import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";
import { createServer } from 'http';
import { Server } from 'socket.io';


const port = process.env.PORT || 1337;
const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Adjust origin as needed
        methods: ["GET", "POST"]
    }
});

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

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    console.log(`what is socket: ${socket}`);

    // Example of emitting a message when connected
    // socket.emit('message', { data: 'Welcome to the Socket.IO server!' });

    socket.on('message', () => {
        console.log('this is message!');
    });

    socket.on('create', function(room) {
        socket.join(room);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// const server = app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default { app, httpServer };

// export default { app, server }
// export default app
