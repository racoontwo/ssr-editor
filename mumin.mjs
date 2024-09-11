import database from "./db/mongodb/muminbase.mjs"

const mumin = {
    fetchData: async function fetchData() {
        const db = await database.getDb();
        const res = await db.collection.find({}).toArray();

        await db.client.close();
        return res;
    }
};

export default mumin;
