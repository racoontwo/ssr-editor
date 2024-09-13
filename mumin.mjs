import database from "./db/mongodb/muminbase.mjs"

const mumin = {
    fetchData: async function fetchData() {
        const db = await database.getDb();
        const res = await db.collection.find({}).toArray();

        await db.client.close();
        return res;
    },
    addOne: async function addOne({ namn, bor }) {
        try {
            const db = await database.getDb();
            const result = await db.collection.insertOne({ namn, bor });
            await db.client.close();
            return result;
        } catch (error) {
            console.error('Error inserting data into MongoDB:', error);
            throw new Error('Database insertion failed');
        }
    }
};

export default mumin;

