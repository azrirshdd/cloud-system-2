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
        const driverCollection = db.collection("drivers");
        await driverCollection.deleteMany({});

        const result = await driverCollection.insertMany(drivers);
        console.log(`\n Successfully inserted ${result.insertedCount} drivers!`);
        console.log("Inserted IDs:", result.insertedIds);


        const allDrivers = await driverCollection.find().toArray();
        console.log("\n All drivers in database:");
        console.table(allDrivers);

        const availableDrivers = await driverCollection.find({
            isAvalaible: true,
            rating: { $gte: 4.5 }
        }).toArray();
       console.log("\nAvailable drivers:");
       console.table(availableDrivers);

        const updateResult = await driverCollection.updateOne(
            { name: "John Doe" },
            { $inc: { rating: 0.1 } }
        );
        console.log("\n Update Result:", updateResult);

        const updatedDriver = await driverCollection.findOne({ name: "John Doe" });
        console.log("\n Updated John Doe :");
        console.table([updatedDriver]);
       

        // // insert a doc
        // await collection.insertOne({ name: "Alice", age: 25 });
        // console.log("Document Inserted!");

        // // query the doc
        // const result = await collection.findOne({ name: "Alice" });
        // console.log("Query result:", result);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

main();