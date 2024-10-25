process.env.NODE_ENV = "test"; 

import { expect } from "chai";
import request from "supertest";
import appData from "../app.mjs";

const app = appData.app;

describe("GraphQL", () => {

    it("should fetch a list of documents with all subfields", async () => {
        const query = {
            query: `
                {
                    documents {
                        _id
                        title
                        content
                    }
                }
            `,
        };

        const res = await request(app)
            .post("/graphql")
            .send(query)
            .expect(200);

        const { data } = res.body;

        // This is to check if documents are returned and that they are of type array
        expect(data).to.have.property("documents");
        expect(data.documents).to.be.an("array");

        // Check that each returned document have the expected fields
        if (data.documents.length > 0) {
            data.documents.forEach(doc => {
                expect(doc).to.have.property("_id");
                expect(doc).to.have.property("title");
                expect(doc).to.have.property("content");
            });
        }
    });


    it("should fetch a list of documents with only the subfields _id and title", async () => {
        const query = {
            query: `
                {
                    documents {
                        _id
                        title
                    }
                }
            `,
        };

        const res = await request(app)
            .post("/graphql")
            .send(query)
            .expect(200);

        const { data } = res.body;

        // This is to check if documents are returned and that they are of type array
        expect(data).to.have.property("documents");
        expect(data.documents).to.be.an('array');

        // Check that each returned document have the expected fields and length
        if (data.documents.length > 0) {
            data.documents.forEach(doc => {
                expect(doc).to.have.property("_id");
                expect(doc).to.have.property("title");
                expect(Object.keys(doc)).to.have.lengthOf(2);
            });
        }
    });


    it("should return an error message when no subfield is given in the query", async () => {
        const query = {
            query: `
                {
                    documents
                }
            `,
        };

        const res = await request(app)
            .post("/graphql")
            .send(query)
            .expect(400);

        // Check that the result are of type error and contains the correct error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].message).to.include(
            'Field "documents" of type "[Document]" must have a selection of subfields. Did you mean "documents { ... }"?'
        );
    });


    it("should return a syntax error message on empty subfield in query", async () => {
        const query = {
            query: `
                {
                    documents {
                        
                    }
                }
            `,
        };

        const res = await request(app)
            .post("/graphql")
            .send(query)
            .expect(400);

        // Check that the result are of type error and contains the correct error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].message).to.include('Syntax Error: Expected Name, found "}".');
    });


    it("should return an error message on misspelled subfield in query", async () => {
        const query = {
            query: `
                {
                    documents {
                        id
                        title
                        content
                    }
                }
            `,
        };

        const res = await request(app)
            .post("/graphql")
            .send(query)
            .expect(400);

        // Check that the result are of type error and contains the correct error message
        expect(res.body).to.have.property("errors");
        expect(res.body.errors[0].message).to.include('Cannot query field "id" on type "Document". Did you mean "_id"?');
    });
});
