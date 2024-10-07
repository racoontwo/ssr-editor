import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";
// import { createServer } from 'http';
import { Server } from 'socket.io';


const port = process.env.PORT || 1337;
const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// const httpServer = createServer(app);

// Setup Socket.IO
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Adjust origin as needed
//         methods: ["GET", "POST"]
//     }
// });

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

// io.on('connection', (socket) => {
//     console.log(`A user connected: ${socket.id}`);
    

//     socket.on('frontend', (message) => {
//         let servermessge = "hello from server";
//         socket.emit("servermsg", servermessge);
//         console.log(message);
//     });

//     socket.on('create', function(room) {
//         socket.join(room);
//     });

//     // Handle disconnect
//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });


const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust origin as needed
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('selectedItem', (itemData) => {
        if (itemData) {
            console.log("this is the id", itemData._id);
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

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// httpServer.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// export default { app, httpServer };

export default { app, server }
// export default app
