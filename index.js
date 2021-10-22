// user: mydbuser1
// pass: uVvIiCoCzYyxRJUb
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//Middleware 
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser1:uVvIiCoCzYyxRJUb@cluster0.jjl8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("foodmaster");
      const usersCollection = database.collection("users");
        // GET API 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await usersCollection.findOne(query);
            console.log('Load User with id', id);
            res.send(user);
        })
        // POST API 
        app.post('/users', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got the user', newUser);
            console.log('Added User', result);
            res.json(result);
        })
        // Delete API 
        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            console.log('deleted the user', result);
            res.json(result); 
        })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Running my crud server");
})

app.listen(port, () => {
    console.log("Listening to port", port);
})