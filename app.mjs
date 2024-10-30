
import 'dotenv/config'

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import posts from "./routes/posts.mjs";
import RootQueryType from "./graphql/root.js";
import { Server } from 'socket.io';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';

const port = process.env.PORT || 1337;

const app = express();
const visual = true;

const schema = new GraphQLSchema({
    query: RootQueryType
});

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

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual, // Visual är satt till true under utveckling
}));

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

//Setting upp the socker.io server
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "*",
        // origin: "https://www.student.bth.se/~olrs23/editor/",
        methods: ["GET", "POST"]
    }
});

//så som emil gjorde i sin föreläsning
// io.on('connection', function(socket) {
//     socket.on("select", function (data) {
//         console.log(data);

//         io.emit("content", data);

//         //spara till databas och gör annat med data

//     })
// })

//Handling new connections to the server
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    //Add client to the room when entering a document.
    socket.on('selectedItem', (itemData) => {
        if (itemData) {
            const roomId = itemData._id;

            socket.join(roomId)
            console.log(`User ${socket.id} joined room: ${roomId}`);
        }
    });

    //Handles any changes in a document so that it is immediately reflected for all clients in the room.
    socket.on("doc", (data) => {
        if (data) {
            const roomId = data._id;
            io.to(roomId).emit('doc', data);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

export default { app, server, io }
