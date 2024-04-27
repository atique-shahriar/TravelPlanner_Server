const express = require("express");
const cors = require("cors");
const app = express();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vbl1j76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ping: 1});
    const database = client.db("travelPlanner");
    const userCollection = database.collection("users");
    const spotCollection = database.collection("touristSpot");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("New User", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    ///////////////////////////////////////////////
    //Tourist
    app.get("/touristSpots", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpots/ascSort", async (req, res) => {
      const cursor = spotCollection.find().sort({averageCost: 1});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpots/desSort", async (req, res) => {
      const cursor = spotCollection.find().sort({averageCost: -1});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    app.post("/touristSpots", async (req, res) => {
      const spot = req.body;
      console.log("New Spot", spot);
      const result = await spotCollection.insertOne(spot);
      res.send(result);
    });

    app.put("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateSpot = req.body;
      const spot = {
        $set: {
          imageUrl: updateSpot.imageUrl,
          touristsSpotName: updateSpot.touristsSpotName,
          countryName: updateSpot.countryName,
          location: updateSpot.location,
          shortDescription: updateSpot.shortDescription,
          averageCost: updateSpot.averageCost,
          seasonality: updateSpot.seasonality,
          travelTime: updateSpot.travelTime,
          totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
          userEmail: updateSpot.userEmail,
          userName: updateSpot.userName,
        },
      };
      console.log(updateSpot);
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    app.delete("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

run().catch(console.dir);
