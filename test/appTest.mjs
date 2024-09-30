import request from 'supertest';
import appdata from '../app.mjs';

describe('Express App', function() {
    after(function(done) {
        appdata.server.close(done);
    });

    describe('GET /', function() {
        it('should render the index page', function(done) {
            request(appdata.app)
                .get('/')
                .expect(200)
                .expect('Content-Type', /html/)
                .expect((res) => {
                    if (!res.text.includes('Homepage')) throw new Error('Index page not found'); // Check if index page content is present
                })
                .end(done);
        });
    });

    describe('GET /posts', function() {
        it('should return json-format', function(done) {
            request(appdata.app)
                .get('/posts/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
});
