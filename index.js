const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const port = 3000

const app = express();
app.use(express.json());

let db;

async function connectToMongoDB() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        db = client.db("testDB");
    } catch (err) {
        console.error("Error", err);
    }
}
connectToMongoDB().then(() => {

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
});

// GET /rides - Fetch all rides
app.get('/rides', async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rides' });
    }
});

// POST /rides - Create a new ride
app.post('/rides', async (req, res) => {
    console.log("POST /rides called");
    console.log("Body:", req.body);
    try {
        const result = await db.collection('rides').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ride' });
    }
});

// PATCH update ride status
app.patch('/rides/:id', async (req, res) => {
    try {
        const id = req.params.id.trim();
        console.log("PATCH called with ID:", id, "and body:", req.body);

        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: req.body.status } }
        );

        if (result.matchedCount === 0) {
            console.log("No ride found with that ID");
            return res.status(404).json({ error: 'Ride not found' });
        }

        console.log("Ride updated:", id);
        res.status(200).json({ message: "Ride status updated successfully" });

    } catch (err) {
        console.error("PATCH error:", err);
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});

// DELETE ride
app.delete('/rides/:id', async (req, res) => {
    try {
        const id = req.params.id.trim();
        console.log("DELETE called with ID:", id);

        const result = await db.collection('rides').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            console.log("No ride found to delete for ID:", id);
            return res.status(404).json({ error: 'Ride not found' });
        }

        console.log("Ride deleted:", id);
        res.status(200).json({ message: "Ride deleted successfully" });

    } catch (err) {
        console.error("DELETE error:", err);
        res.status(400).json({ error: "Invalid ride ID or data" });
    }
});