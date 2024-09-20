process.env.NODE_ENV = 'test'; 

import request from 'supertest';
import { expect } from 'chai';
import app from '../app.mjs';

describe('POST /add_docs', () => {
    it('should add a new document when title and content are provided', (done) => {
        const newDoc = {
            title: 'Test Title',
            content: 'Test Content'
        };

        request(app)
            .post('/posts/add_docs')
            .send(newDoc)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Data received and inserted');
                expect(res.body.data).to.deep.equal(newDoc);
                done();
            });
    });

    it('should return an error when title or content are missing', (done) => {
        const incompleteDoc = {
            content: 'Test Content'
        };

        request(app)
            .post('/posts/add_docs')
            .send(incompleteDoc)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error', 'Name and location are required');
                done();
            });
    });
}); 
