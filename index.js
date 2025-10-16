const { MongoClient } = require('mongodb');

const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvalaible: true,
        rating: 4.8
    },
    {
        name: "Alice Smith",
        vehicleType: "SUV",
        isAvalaible: false,
        rating: 4.5
    }
];

// show the data in console
console.log("All driver data:", drivers);

// Show all the drivers’ names
console.log("\nDriver Names:");
drivers.forEach(driver => console.log(driver.name));

// Add additional driver to the driver array
drivers.push({
    name: "Azri",
    vehicleType: "Hatchback",
    isAvalaible: true,
    rating: 4.2
});

console.log("\nUpdated driver list:", drivers);

//  MongoDB connection section
async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("\nConnected to MongoDB!");

        const db = client.db("testDB");
        const collection = db.collection("users");

        // insert a doc
        await collection.insertOne({ name: "Alice", age: 25 });
        console.log("Document Inserted!");

        // query the doc
        const result = await collection.findOne({ name: "Alice" });
        console.log("Query result:", result);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();