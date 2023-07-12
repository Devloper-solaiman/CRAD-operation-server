const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

// midallware
app.use(cors());
app.use(express.json());

// user: dbUser2
// pass: qD4fEa21lwXpDA7n


const uri = "mongodb+srv://dbUser2:qD4fEa21lwXpDA7n@cluster0.9a7hjjg.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect()
        const userCollection = client.db('mongodbCrud').collection('user')

        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const user = await cursor.toArray()
            res.send(user)
        })
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(query, updatedUser, option)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from node mongo crad server')
});

app.listen(port, () => {
    console.log(`listing to port ${port}`);
})