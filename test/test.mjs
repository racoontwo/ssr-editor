process.env.NODE_ENV = 'test'; 

import assert from 'assert';
import request from 'supertest';
import appdata from '../app.mjs';


const server = appdata.server;

describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            request(server)
                .get("/")
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });
    });
});
