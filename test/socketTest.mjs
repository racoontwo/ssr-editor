import { describe, it, after, before } from 'mocha';
import { io as Client } from 'socket.io-client';

import io from '../app.mjs';

const port = process.env.PORT || 1337;
const testUrl = `http://localhost:${port}`;
// let clientSocket;
let clientSocket, clientSocket2;


describe('Socket.IO Server', function () {
    before((done) => {
        setTimeout(() => {
            clientSocket = Client(testUrl, {
                reconnectionDelay: 0,
                forceNew: true,
                transports: ['websocket'],
            });

            clientSocket2 = Client(testUrl, {
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
        }, 500);
    });

    after((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
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

    // it('should not receive document changes when not in the room', (done) => {
    //     const roomId = 'isolatedRoom';
    //     const unrelatedData = { _id: roomId, content: 'Should not be received' };

    //     // Only clientSocket2 joins room; clientSocket should not receive the broadcast
    //     clientSocket2.emit('selectedItem', { _id: roomId });
        
    //     // Fail the test if clientSocket receives the data
    //     clientSocket.on('doc', () => {
    //         done(new Error('ClientSocket received data it should not have received.'));
    //     });

    //     clientSocket2.emit('doc', unrelatedData);

    //     // Wait a bit to see if clientSocket incorrectly receives the event
    //     setTimeout(done, 500);
    // });

});
