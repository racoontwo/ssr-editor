import { describe, it, after, before } from 'mocha';
import { io as Client } from 'socket.io-client';

import io from '../app.mjs';

const port = process.env.PORT || 1337;
const testUrl = `http://localhost:${port}`;
let clientSocket;
let listenerSocket;

describe('Socket.IO Server', function () {
    before((done) => {
        setTimeout(() => {
            clientSocket = Client(testUrl, {
                reconnectionDelay: 0,
                forceNew: true,
                transports: ['websocket'],
            });
    
            clientSocket.on('connect', () => {
                done();
            });
    
            clientSocket.on('connect_error', (error) => {
                done(error);
            });
        }, 5000);
    });

    after((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }

        if (listenerSocket.connected) {
            listenerSocket.disconnect();
        }
        
        if (io.server && io.server.listening) {
            io.server.close(done);
        } else {
            done();
        }
    });

    it('should connect to the server', (done) => {
        if (clientSocket.connected) {
            done();
        } else {
            done(new Error('Client failed to connect.'));
        }
    });

    it('should broadcast document changes to room clients', (done) => {
        const roomId = 'testRoom';
        const testData = { _id: roomId, content: 'Updated document content' };
    
        listenerSocket = Client(testUrl, {
            reconnectionDelay: 0,
            forceNew: true,
            transports: ['websocket'],
        });
    
        listenerSocket.on('connect', () => {
            listenerSocket.emit('selectedItem', { _id: roomId });
            // console.log(`Listener socket joined room: ${roomId}`);
    
            clientSocket.emit('selectedItem', { _id: roomId });
            // console.log(`Client socket joined room: ${roomId}`);
    
            setTimeout(() => {
                // console.log('Emitting document:', testData);
                clientSocket.emit('doc', testData);
            }, 100);
        });
    
        listenerSocket.on('doc', (data) => {
            if (JSON.stringify(data) === JSON.stringify(testData)) {
            done();
            } else {
            done(new Error('Document broadcast did not match the expected data.'));
            }
        });
    });

        // it('should broadcast document changes to room clients', (done) => {
    //     const roomId = 'testRoom';
    //     const testData = { _id: roomId, content: 'Updated document content' };
        
    //     clientSocket.emit('selectedItem', { _id: roomId });
    //     clientSocket.emit('doc', testData);

    //     clientSocket.on('doc', (data) => {
    //         if (JSON.stringify(data) === JSON.stringify(testData)) {
    //             done();
    //         } else {
    //             done(new Error('Document broadcast did not match the expected data.'));
    //         }
    //     });
    // });
});
