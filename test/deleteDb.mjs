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

        // Call the /delete-database
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

describe('DELETE /delete-one-doc', function() {
    let testDocId;

    before(async function() {
        // Step 1: Insert a test document into the database
        // const res = await request(app)
        // .delete('/posts/delete-all-docs')
        // .expect(200);

        const newDoc = {
            title: 'Test Title',
            content: 'Test Content'
        };

        const response = await request(app)
            .post('/posts/add_docs') // Adjust the path if necessary
            .send(newDoc)
            .expect(200);
        
        testDocId = response.body._id; // Store the ID for later use
    });

    it('should delete the document by ID', async function() {
        // Step 2: Delete the document by ID
        const res = await request(app)
            .delete('/posts/delete-one-doc') // Adjust the path if necessary
            .send({ _id: testDocId })
            .expect(200);
        
        // Step 3: Check the response message
        expect(res.body).to.have.property('message', 'Document deleted successfully');

        // Step 4: Verify the document has been deleted
        const fetchRes = await request(app)
            .get('/posts/json') // Adjust the path if necessary
            .expect(200);
        
        // Check that the document is not in the database anymore
        const deletedDoc = fetchRes.body.find(doc => doc._id === testDocId);
        expect(deletedDoc).to.be.undefined; // Document should be undefined
    });

    after(async function() {
        // Cleanup: Optionally delete the document if it was not deleted
        await request(app)
            .delete('/posts/delete-one-doc')
            .send({ _id: testDocId });
    });
});
