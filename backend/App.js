const express = require('express');
const app = express();
const mongoose = require('mongoose');
const databaseRouter = require('./router/Database-router');
const externalAPIRouter = require('./router/ExternalAPI-router');

app.use(express.urlencoded({extended: true}));
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.json());
app.use(express.static('../dist/deep-neuron-on-hit-stage2/browser'));



// Connect to the database
async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/DeepNeuron-OnHit-Stage2');
}

connect();
app.listen(8080,()=> {console.log("Server is running on port 8080")});


app.use('/api/database', databaseRouter);
app.use('/api/external-api', externalAPIRouter);
