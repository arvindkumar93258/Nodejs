const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();
// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGO_DB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Mongoose connected");
        // // Connect the client to the server (optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // const response = await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!", response);
    } catch {
        console.log("Error while connecting to the MongoDB", err);
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
module.exports = connectMongoDB;
