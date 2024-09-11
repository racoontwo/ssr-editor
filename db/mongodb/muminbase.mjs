import { MongoClient } from "mongodb";

const collectionName = "crowd";

const database = {
    async getDb() {
        let dsn = `mongodb://localhost:27017/mumin`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await MongoClient.connect(dsn);
        const db = client.db();
        const collection = db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

export default database
