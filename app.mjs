import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";
// import { createServer } from 'http';
import { Server } from 'socket.io';
// import { instrument } from '@socket.io/admin-ui';

const port = process.env.PORT || 1337;
const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}


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

//Setting upp the socker.io server
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://www.student.bth.se/~olrs23/editor/",
        // origin: ["http://localhost:3000", "http://admin.socket.io/"],
        // methods: ["GET", "POST"]
    }
});

//Handling new connections to the server
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    //Add client to the room when entering a document.
    socket.on('selectedItem', (itemData) => {
        if (itemData) {
            const roomId = itemData._id;
            socket.join(roomId)
            console.log(`User ${socket.id} joined room: ${roomId}`);

            // console.log("this is the id", itemData._id);
            // socket.to(itemData._id).emit("doc", itemData);
        }
        // console.log("This is the itemData", itemData);
    });

    //"room" är detsamma som "item._id". blanda inte ihop med user.id
    //this is the id 66f3d02a28bec97216e15e4f
    //this is the room 66f3d02a28bec97216e15e4f
    socket.on('create', function(room) {
        console.log("this is the room", room);
        // socket.join(room);
    });

    //Handles any changes in a document so that it is immediately reflected for all clients in the room.
    socket.on("doc", (data) => {
        if (data) {
            const roomId = data._id;
            io.to(roomId).emit('doc', data);
            // socket.to(data._id).emit("doc", data);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// instrument(io, { auth: false});

export default { app, server }
// export default app
