const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-nh2hz2f-shard-00-00.0tddw53.mongodb.net:27017,ac-nh2hz2f-shard-00-01.0tddw53.mongodb.net:27017,ac-nh2hz2f-shard-00-02.0tddw53.mongodb.net:27017/?ssl=true&replicaSet=atlas-xdrutp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

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


    const recipeCollection = client.db('recipeDB').collection('recipes')


    app.post('/recipes', async(req , res) => {
        const data = req.body;
        // console.log(data);
        const result = await recipeCollection.insertOne(data);
        res.send(result);
    })

    app.get('/recipes', async(req , res) => {
        const result = await recipeCollection.find().sort({likes : 1}).limit(6).toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Recipe server')
})

app.listen(port, () => {
  console.log(`Recipe server is running on port ${port}`)
})
