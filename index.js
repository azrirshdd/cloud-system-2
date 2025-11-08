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

// =====================  CUSTOMER ROUTES =====================
app.post('/customers', async (req, res) => {
  try {
    const result = await db.collection('customers').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ error: "Failed to register customer" });
  }
});

// View Driver Info (Customer)
app.get('/customers/drivers/:id', async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log("Customer requests driver info:", id);

    const driver = await db.collection('drivers').findOne({ _id: new ObjectId(id) });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Send driver info
    const driverInfo = {
      name: driver.name,
      vehicle: driver.vehicle,
      status: driver.status || "available",
      contact: driver.contact || "N/A"
    };

    res.status(200).json(driverInfo);

  } catch (err) {
    console.error("Error fetching driver info:", err);
    res.status(400).json({ error: "Invalid driver ID" });
  }
});


app.post('/rides/request', async (req, res) => {
  try {
    const result = await db.collection('rides').insertOne(req.body);
    res.status(201).json({ rideId: result.insertedId });
  } catch {
    res.status(400).json({ error: "Failed to request ride" });
  }
});

// Customer Login
app.post('/customers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check in database
    const customer = await db.collection('customers').findOne({ email, password });

    if (!customer) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      customerId: customer._id,
      name: customer.name,
      email: customer.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =====================  DRIVER ROUTES =====================
app.post('/drivers', async (req, res) => {
  try {
    const result = await db.collection('drivers').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch {
    res.status(400).json({ error: "Failed to register driver" });
  }
});

app.get('/drivers/:id/passengers', async (req, res) => {
  try {
    const passengers = await db.collection('rides').find({ driverId: req.params.id }).toArray();
    res.status(200).json(passengers);
  } catch {
    res.status(400).json({ error: "Failed to fetch passengers" });
  }
});

app.patch('/drivers/:id', async (req, res) => {
  try {
    const result = await db.collection('drivers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Driver not found" });
    res.status(200).json({ message: "Driver profile updated" });
  } catch {
    res.status(400).json({ error: "Invalid driver ID" });
  }
});

app.delete('/drivers/:id', async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log(" DELETE driver:", id);

    // Pastikan ID valid sebelum convert
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const result = await db.collection('drivers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.log(" Driver not found for ID:", id);
      return res.status(404).json({ error: "Driver not found" });
    }

    console.log(" Driver deleted:", id);
    res.status(200).json({ message: "Driver account deleted successfully" });

  } catch (err) {
    console.error(" DELETE error:", err);
    res.status(500).json({ error: "Server error deleting driver" });
  }
});

// DRIVER LOGIN
app.post('/drivers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check in database
    const driver = await db.collection('drivers').findOne({ email: email, password: password });

    if (!driver) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // If Successful
    res.status(200).json({
      message: "Login successful",
      driverId: driver._id,
      name: driver.name,
      status: driver.status || "available"
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.patch('/rides/:id/accept', async (req, res) => {
  try {
    const result = await db.collection('rides').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "accepted" } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Ride not found" });
    res.status(200).json({ message: "Ride accepted" });
  } catch {
    res.status(400).json({ error: "Invalid ride ID" });
  }
});


// =====================  ADMIN  =====================
app.get('/admin/users', async (req, res) => {
  try {
    const users = await db.collection('customers').find().toArray();
    const drivers = await db.collection('drivers').find().toArray();
    res.status(200).json({ customers: users, drivers: drivers });
  } catch {
    res.status(400).json({ error: "Failed to fetch users" });
  }
});

app.get('/admin/rides', async (req, res) => {
  try {
    const rides = await db.collection('rides').find().toArray();
    res.status(200).json(rides);
  } catch {
    res.status(400).json({ error: "Failed to fetch rides" });
  }
});

app.delete('/admin/users/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const driverResult = await db.collection('drivers').deleteOne({ _id: id });
    if (driverResult.deletedCount > 0) {
       return res.status(200).json({ message: "Driver account deleted successfully" });
    }

    return res.status(404).json({ error: "User not found" });

  } catch (err) {
    console.error("DELETE admin error:", err);
    res.status(400).json({ error: "Invalid user ID" });
  }
});