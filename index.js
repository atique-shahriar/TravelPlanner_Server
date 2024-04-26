const express = require("express");
const cors = require("cors");
const app = express();
const {MongoClient, ServerApiVersion} = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vbl1j76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ping: 1});
    const database = client.db("travelPlanner");
    const userCollection = database.collection("users");

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
