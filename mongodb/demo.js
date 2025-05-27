const { MongoClient } = require('mongodb');

async function updateStatusField() {
    const uri = 'mongodb+srv://saswith:saswith@cluster0.rtqlfvi.mongodb.net/datapro'; // Replace with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('datapro'); // Replace with your database name
        const collection = database.collection('enquiries'); // Replace with your collection name

        const filter = {}; // Empty filter to select all documents
        const updateDoc = {
            $set: { remarks: '' }
        };

        const result = await collection.updateMany(filter, updateDoc);

        console.log(`${result.matchedCount} documents matched the filter, updated ${result.modifiedCount} documents`);
    } finally {
        await client.close();
    }
}

updateStatusField().catch(console.error);
