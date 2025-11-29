require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const port = 3000
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

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

//middleware for authentication and authorization
const authenticate = (req, res, next) => {
 const token = req.headers.authorization?.split(' ')[1];
 if (!token) return res.status(401).json({ error: "Unauthorized" });
 try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded;
 next();
 } catch (err) {
 res.status(401).json({ error: "Invalid token" });
 }
};
const authorize = (roles) => (req, res, next) => {
 if (!roles.includes(req.user.role))
 return res.status(403).json({ error: "Forbidden" });
 next();
}; 


// =====================  CUSTOMER ROUTES =====================
// Customer Login
app.post('/customers/login', async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const user = await db.collection('customers').findOne({ email: req.body.email });
    console.log("User from DB:", user);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(req.body.password, user.password);
    console.log("Password match:", match);

    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Register Customer
app.post('/customers', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
 const user = { ...req.body, password: hashedPassword };
 await db.collection('customers').insertOne(user);
 res.status(201).json({ message: "User created" });
 } catch (err) {
 res.status(400).json({ error: "Failed to Register Customer" });
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

// Request Ride
app.post('/rides/request', async (req, res) => {
  try {
    const result = await db.collection('rides').insertOne(req.body);
    res.status(201).json({ rideId: result.insertedId });
  } catch {
    res.status(400).json({ error: "Failed to request ride" });
  }
});



// =====================  DRIVER ROUTES =====================

// DRIVER LOGIN
app.post('/drivers/login', async (req, res) => {
 const user = await db.collection('drivers').findOne({ email: req.body.email
});
 if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
 return res.status(401).json({ error: "Invalid credentials" });
 }
 const token = jwt.sign(
 { userId: user._id, role: user.role },
 process.env.JWT_SECRET,
 { expiresIn: process.env.JWT_EXPIRES_IN }
 );
 res.status(200).json({ token }); // Return token to client
}); 

// Register Driver
app.post('/drivers', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
 const user = { ...req.body, password: hashedPassword };
 await db.collection('drivers').insertOne(user);
 res.status(201).json({ message: "User created" });
 } catch (err) {
 res.status(400).json({ error: "Failed to Register Driver" });
 }
}); 

// View Passengers (Driver)
app.get('/drivers/:id/passengers', async (req, res) => {
  try {
    const passengers = await db.collection('rides').find({ driverId: req.params.id }).toArray();
    res.status(200).json(passengers);
  } catch {
    res.status(400).json({ error: "Failed to fetch passengers" });
  }
});

// Update Driver Profile
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

// Delete Driver Account
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

// Accept Ride (Driver)
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


app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
    console.log("Admin access:", req.user.userId);

    const userIdToDelete = req.params.id;

    if (!ObjectId.isValid(userIdToDelete)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const id = new ObjectId(userIdToDelete);

        // Delete driver
        const driverResult = await db.collection('drivers').deleteOne({ _id: id });

        // Delete all customers associated with this driver
        const customerResult = await db.collection('customers').deleteOne({ _id: id });

        if (driverResult.deletedCount === 0 && customerResult.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            deletedDriver: driverResult.deletedCount,
            deletedCustomers: customerResult.deletedCount
        });

    } catch (err) {
        console.error("DELETE admin error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

