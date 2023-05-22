const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kacof5g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyCollection").collection("toys");
    const AddedToyCollection = client
      .db("toyCollection")
      .collection("added-toys");

    // access API

    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/added_toy", async (req, res) => {
      console.log(req.query.seller_email);
      let query = {};
      if (req.query?.seller_email) {
        query = { seller_email: req.query.seller_email };
      }
      const cursor = AddedToyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/added_toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddedToyCollection.findOne(query);
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    //  Add API

    app.post("/toys", async (req, res) => {
      const toy = req.body;
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    app.post("/added_toy", async (req, res) => {
      const toy = req.body;
      const result = await AddedToyCollection.insertOne(toy);
      res.send(result);
    });

    // Update

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const newToy = {
        $set: {
          name: updatedToy.name,
          photo: updatedToy.photo,
          ratings: updatedToy.ratings,
          price: updatedToy.price,
          Quantity: updatedToy.Quantity,
          description: updatedToy.description,
          sub_category: updatedToy.sub_category,
        },
      };
      const result = await toyCollection.updateOne(filter, newToy, options);
      res.send(result);
    });

    app.put("/added_toy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const newToy = {
        $set: {
          name: updatedToy.name,
          photo: updatedToy.photo,
          ratings: updatedToy.ratings,
          price: updatedToy.price,
          Quantity: updatedToy.Quantity,
          description: updatedToy.description,
          sub_category: updatedToy.sub_category,
        },
      };
      const result = await AddedToyCollection.updateOne(
        filter,
        newToy,
        options
      );
      res.send(result);
    });

    // Delete

    app.delete("added_toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddedToyCollection.deleteOne(query);
      res.send(result);
    });

    // Sorting

    app.get("/descending", async (req, res) => {
      const query = {};
      const sort = { price: -1 };
      const cursor = AddedToyCollection.find(query).sort(sort);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy is running");
});

app.listen(port, () => {
  console.log(`toy is running on port ${port}`);
});
