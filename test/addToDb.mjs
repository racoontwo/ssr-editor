process.env.NODE_ENV = 'test'; 

import request from 'supertest';
import { expect } from 'chai';
import app from '../app.mjs';

describe('POST /add_docs', () => {
    it('should add a new document when title and content are provided', async () => {
        const newDoc = {
            title: 'Test Title',
            content: 'Test Content'
        };

        const res = await request(app)
            .post('/posts/add_docs')
            .send(newDoc)
            .expect(200);

        expect(res.body).to.have.property('message', 'Data received and inserted');
        expect(res.body.data).to.deep.equal(newDoc);
    });

    it('should return an error when title or content are missing', async () => {
        const incompleteDoc = {
            content: 'Test Content'
        };

        const res = await request(app)
            .post('/posts/add_docs')
            .send(incompleteDoc)
            .expect(400);

        expect(res.body).to.have.property('error', 'Title and content are required');
    });
});
