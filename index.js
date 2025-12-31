const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017"; // MongoDB server
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("projectgrab"); // database baru
    const usersCollection = db.collection("users");
    const ridesCollection = db.collection("rides");

    // Sample Users
    const users = [
      { user_id: 1001, name: "Dom Toretto", email:"domtoretto@gmail.com", password:"toretto1234", phone_num:"0162668832", account_num:"7636038918" },
      { user_id: 1002, name: "Brian Oconner", email:"brianoconner@gmail.com", password:"brian1234", phone_num:"01163998857", account_num:"7636024398" },
      { user_id: 1003, name: "Roman piece", email:"Roman piece@gmail.com", password:"roman1234", phone_num:"01811683209", account_num:"7636051832" },
      { user_id: 1004, name: "Adam Sterling", email:"adamsterling@gmail.com", password:"adam1234", phone_num:"0142644634", account_num:"7636044634" },
      { user_id: 1005, name: "Pablo Aimar", email:"pabloaimar@gmail.com", password:"pablo1234", phone_num:"0133638560", account_num:"7636006232" }
    ];

    // Sample Rides
    const rides = [
      { brand:"Perodua", model:"Bezza", colour:"White", plat_num:"VAP 5203", driver_name:"James Rodriguez", driver_id:5001, seat_num:3, fare:50.0, distance:35, user_id:1001 },
      { brand:"Perodua", model:"Myvi", colour:"Red", plat_num:"VFY 2442", driver_name:"Sergio Danielle", driver_id:5002, seat_num:3, fare:30.0, distance:15, user_id:1002 },
      { brand:"Proton", model:"Saga", colour:"Gray", plat_num:"VGP 6209", driver_name:"Andrea Alison", driver_id:5003, seat_num:3, fare:70.0, distance:55, user_id:1003 },
      { brand:"Toyota", model:"Vellfire", colour:"Black", plat_num:"VQC 1111", driver_name:"Peter Parker", driver_id:5004, seat_num:5, fare:120.0, distance:110, user_id:1004 },
      { brand:"Toyota", model:"Wish", colour:"Blue", plat_num:"VXY 1010", driver_name:"Gareth Bale", driver_id:5005, seat_num:5, fare:150.0, distance:140, user_id:1005 },
      { brand:"Perodua", model:"Bezza", colour:"White", plat_num:"VAP 5204", driver_name:"James Rodriguez", driver_id:5001, seat_num:3, fare:45.0, distance:25, user_id:1001 } // extra ride Dom
    ];

    // Clear old collections (optional)
    await usersCollection.deleteMany({});
    await ridesCollection.deleteMany({});

    // Insert sample data
    await usersCollection.insertMany(users);
    await ridesCollection.insertMany(rides);

    console.log("✅ Sample data inserted successfully into projectgrab!");

    // Debug: print rides & users
    const allUsers = await usersCollection.find({}).toArray();
    const allRides = await ridesCollection.find({}).toArray();
    console.log("Users:", allUsers);
    console.log("Rides:", allRides);

    // Endpoint /analytics/passengers
    app.get("/analytics/passengers", async (req, res) => {
      try {
        const pipeline = [
          {
            $group: {
              _id: "$user_id",
              totalRides: { $sum: 1 },
              totalFare: { $sum: "$fare" },
              avgDistance: { $avg: "$distance" }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "user_id",
              as: "userInfo"
            }
          },
          { $unwind: "$userInfo" },
          {
            $project: {
              _id: 0,
              name: "$userInfo.name",
              totalRides: 1,
              totalFare: { $round: ["$totalFare", 2] },
              avgDistance: { $round: ["$avgDistance", 2] }
            }
          }
        ];

        const analytics = await ridesCollection.aggregate(pipeline).toArray();
        res.json(analytics);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

main();
