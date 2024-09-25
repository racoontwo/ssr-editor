// process.env.NODE_ENV = 'test'; 

import { expect } from 'chai';
import database from '../db/mongodb/ssr_base.mjs';

describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
        let db;

        try {
            let db = await database.getDb();
            expect(db).to.not.be.null;
        } catch (error) {
            expect.fail('Failed to connect to the database');
        } finally {
            if (db) {
                db.client.close();
            }
        }
    });
});
