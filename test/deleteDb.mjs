process.env.NODE_ENV = "test"; 

import { expect } from "chai";
import request from "supertest";
import appData from "../app.mjs";

const app = appData.app;

describe('DELETE /delete-all-docs', function() {
    it('should delete all documents in the database', async function() {
        // Check that the database is not empty, and insert a test document if it is
        const data = await request(app)
            .get('/posts/json')
            .expect(200)

        if (data.body.length === 0) {
            const newDoc = {
                title: 'Test Title',
                content: 'Test Content'
            };

            await request(app)
            .post('/posts/add_docs')
            .send(newDoc)
            .expect(200);
        }

        const res = await request(app)
            .delete('/posts/delete-all-docs')
            .expect(200);

        // Check the response message
        expect(res.body).to.have.property('message', 'All documents deleted successfully');

        // Verify that the database is now empty
        const finalData = await request(app)
        .get("/posts/json")
        .expect(200)
        expect(finalData.body.data).to.be.an('array').that.has.lengthOf(0);
    });
});
