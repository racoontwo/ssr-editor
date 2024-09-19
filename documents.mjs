import database from "./db/mongodb/ssr_base.mjs"
import { ObjectId } from 'mongodb';

const docs = {
    fetchData: async function fetchData() {
        const db = await database.getDb();
        const res = await db.collection.find({}).toArray();

        await db.client.close();
        return res;
    },
    addOne: async function addOne({ title, content }) {
        try {
            const db = await database.getDb();
            const result = await db.collection.insertOne({ title, content });
            await db.client.close();
            return result;
        } catch (error) {
            console.error('Error inserting data into MongoDB:', error);
            throw new Error('Database insertion failed');
        }
    },
    updateDocs: async function updateDocs(body) {
        try {
            const db = await database.getDb();
            const filter = { _id: new ObjectId(body._id) };
            const updateDocument = {
                $set: {
                    title: body.title,
                    content: body.content
                }
            };

            const result = await db.collection.updateOne(
                filter,
                updateDocument
            );
            await db.client.close();
            return result;
        } catch (error) {
            console.error('Error inserting data into MongoDB:', error);
            throw new Error('Database insertion failed');
        }
    }
};

export default docs;
