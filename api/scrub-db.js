
const { MongoClient } = require('mongodb');

async function scrub() {
    const uri = "mongodb://admin:admin@localhost:27018/frappe_next_crm?authSource=admin";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        const collections = ['clients', 'contacts', 'leads', 'deals', 'users'];
        const fields = ['organization', 'roleId', 'lead', 'client'];

        for (const colName of collections) {
            console.log(`Checking collection: ${colName}`);
            const col = db.collection(colName);

            for (const field of fields) {
                const query = { [field]: "" };
                const update = { $unset: { [field]: 1 } };

                const result = await col.updateMany(query, update);
                if (result.modifiedCount > 0) {
                    console.log(`[Fixed] Removed empty "${field}" from ${result.modifiedCount} docs in ${colName}`);
                }
            }
        }

        console.log('--- Cleanup Complete ---');
    } catch (err) {
        console.error('Cleanup error:', err);
    } finally {
        await client.close();
    }
}

scrub();
