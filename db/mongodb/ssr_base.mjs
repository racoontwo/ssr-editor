import { MongoClient } from "mongodb";

const collectionName = "documents";

const database = {
    async getDb() {
        // let dsn = `mongodb://localhost:27017/ssr-editor`;
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.doxe7.mongodb.net/?retryWrites=true&w=majority&appName=JSRamverk`;

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
