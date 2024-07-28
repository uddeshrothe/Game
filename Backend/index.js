const express = require('express');
const app = express()
const cors = require('cors')

const gameRoute = require('./routes/game.routes.js')
require('dotenv').config()

// Define CORS options
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json())

app.use('/api', gameRoute)

app.listen(5000, () => {
  console.log("Server is running!")
})