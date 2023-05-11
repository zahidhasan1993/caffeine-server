const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;



//middleware

app.use(cors());
app.use(express.json());


//routes and mongodb connections


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.d09ztu7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection('newCoffee');
    //Db and routes connections
    app.get('/coffee', async (req,res)  => {
          const cursor = coffeeCollection.find();
          const result = await cursor.toArray();
          res.send(result)

    })
    app.post('/coffee', async (req,res) => {
        const coffee = req.body;
        const result = await coffeeCollection.insertOne(coffee)
        // console.log(coffee);
        res.send(result)

    })
    app.delete('/coffee/:id', async (req,res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = coffeeCollection.deleteOne(query);
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send('welcome to caffeine server site');
})

app.listen(port, () => {
    console.log('this server is running on port', port);
})